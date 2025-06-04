import { kv } from "@vercel/kv"
import { logger } from "@/lib/logger"
import { publishContent } from "@/lib/actions"
import { sendNotification } from "@/lib/notifications"
import { publishingProcessor } from "@/lib/batch-processor"

export const dynamic = "force-dynamic"
export const maxDuration = 60 // 60 seconds (maximum allowed)

export async function GET(request: Request) {
  try {
    // Check for secret token to prevent unauthorized access
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (token !== process.env.CRON_SECRET) {
      return new Response("Unauthorized", { status: 401 })
    }

    logger.info("Starting publishing queue processing")

    // Get current time
    const now = Date.now()

    // Get all scheduled videos that should be published now
    const scheduledVideos = await kv.zrangebyscore("publishing_queue", 0, now)

    if (!scheduledVideos || scheduledVideos.length === 0) {
      logger.info("No videos to publish at this time")
      return new Response(JSON.stringify({ message: "No videos to publish" }), {
        headers: { "Content-Type": "application/json" },
      })
    }

    logger.info(`Found ${scheduledVideos.length} videos to publish`)

    // Add jobs to batch processor
    for (const requestId of scheduledVideos) {
      publishingProcessor.addJob({
        id: requestId as string,
        data: { requestId },
        priority: 1,
      })
    }

    // Process batch with timeout handling
    const results = await publishingProcessor.processBatch(
      async (job) => {
        const requestId = job.data.requestId

        // Get scheduling data
        const scheduleData = await kv.get(`schedule:${requestId}`)

        if (!scheduleData) {
          throw new Error(`Schedule data not found for ${requestId}`)
        }

        // Publish the video
        const result = await publishContent(scheduleData.videoId, scheduleData.channelId)

        // Remove from queue
        await kv.zrem("publishing_queue", requestId)

        // Update schedule status
        await kv.hset(`schedule:${requestId}`, {
          status: "published",
          publishedAt: new Date().toISOString(),
        })

        return { requestId, result }
      },
      undefined, // onComplete
      async (error, job) => {
        // Error handler
        const requestId = job.data.requestId
        logger.error(`Failed to publish scheduled video ${requestId}`, { error })

        // Update retry count
        const scheduleData = await kv.get(`schedule:${requestId}`)
        const retryCount = (scheduleData?.retryCount || 0) + 1

        if (retryCount >= 5) {
          // Too many retries, remove from queue and notify
          await kv.zrem("publishing_queue", requestId)
          await kv.hset(`schedule:${requestId}`, {
            status: "failed",
            error: error.message,
            failedAt: new Date().toISOString(),
          })

          await sendNotification({
            title: "Publishing Failed Permanently",
            message: `Video ${scheduleData?.videoId} failed to publish after 5 attempts: ${error.message}`,
            type: "error",
          })
        } else {
          // Reschedule with backoff
          const backoffMinutes = Math.pow(2, retryCount) // Exponential backoff
          const newScheduleTime = Date.now() + backoffMinutes * 60 * 1000

          await kv.zadd("publishing_queue", {
            score: newScheduleTime,
            member: requestId,
          })

          await kv.hset(`schedule:${requestId}`, {
            retryCount,
            nextRetry: new Date(newScheduleTime).toISOString(),
          })
        }
      },
    )

    const remainingJobs = publishingProcessor.getRemainingJobCount()

    logger.info(`Publishing queue processed: ${results.length} completed, ${remainingJobs} remaining`)

    return new Response(
      JSON.stringify({
        message: `Publishing queue processed: ${results.length} completed, ${remainingJobs} remaining`,
        processed: results.length,
        remaining: remainingJobs,
        total: scheduledVideos.length,
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    logger.error("Error processing publishing queue", { error })

    return new Response(JSON.stringify({ error: "Failed to process publishing queue" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
