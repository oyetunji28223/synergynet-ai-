import { logger } from "@/lib/logger"
import { recoverContentGeneration } from "@/lib/actions"
import { kv } from "@vercel/kv"

export const dynamic = "force-dynamic"
export const maxDuration = 60

export async function GET(request: Request) {
  const startTime = Date.now()

  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response("Unauthorized", { status: 401 })
    }

    logger.info("Processing recovery queue")

    // Get queued recovery jobs (oldest first)
    const queuedJobs = await kv.zrange("recovery_queue", 0, 4, { withScores: true })

    if (!queuedJobs || queuedJobs.length === 0) {
      return new Response(JSON.stringify({ message: "No recovery jobs in queue" }), {
        headers: { "Content-Type": "application/json" },
      })
    }

    const results = []
    let processed = 0

    // Process jobs with timeout protection
    for (let i = 0; i < queuedJobs.length; i += 2) {
      const requestId = queuedJobs[i] as string
      const queueTime = queuedJobs[i + 1] as number

      // Check timeout (leave 10 seconds buffer)
      if (Date.now() - startTime > 50000) {
        logger.info(`Timeout approaching, processed ${processed} recovery jobs`)
        break
      }

      try {
        logger.info(`Processing recovery for ${requestId}`)

        // Attempt recovery with timeout
        const result = await Promise.race([
          recoverContentGeneration(requestId),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Recovery timeout")), 30000)),
        ])

        // Remove from queue on success
        await kv.zrem("recovery_queue", requestId)

        results.push({
          requestId,
          status: "completed",
          result,
        })

        processed++
        logger.info(`Recovery completed for ${requestId}`)
      } catch (error) {
        logger.error(`Recovery failed for ${requestId}`, { error })

        // Check if job is too old (older than 24 hours)
        if (Date.now() - queueTime > 86400000) {
          await kv.zrem("recovery_queue", requestId)
          logger.info(`Removed expired recovery job ${requestId}`)
        }

        results.push({
          requestId,
          status: "failed",
          error: error.message,
        })
      }
    }

    const processingTime = Date.now() - startTime

    return new Response(
      JSON.stringify({
        message: "Recovery processing completed",
        processed,
        results,
        processingTime,
        remainingInQueue: await kv.zcard("recovery_queue"),
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    logger.error("Recovery processing failed", { error })

    return new Response(
      JSON.stringify({
        error: "Recovery processing failed",
        message: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
