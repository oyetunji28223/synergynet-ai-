import { logger } from "@/lib/logger"
import { recoverContentGeneration } from "@/lib/actions"

export const dynamic = "force-dynamic"
export const maxDuration = 60 // Fixed: Changed from 300 to 60 seconds (maximum allowed)

export async function POST(request: Request) {
  const startTime = Date.now()
  let body // Declare body here to make it accessible in the catch block

  try {
    // Check for secret token to prevent unauthorized access
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (token !== process.env.RECOVERY_SECRET) {
      return new Response("Unauthorized", { status: 401 })
    }

    // Get request body
    body = await request.json()
    const { requestId } = body

    if (!requestId) {
      return new Response(JSON.stringify({ error: "requestId is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    logger.info(`Starting recovery for request ${requestId}`)

    // Check if we're approaching timeout (leave 10 seconds buffer)
    const timeElapsed = Date.now() - startTime
    if (timeElapsed > 50000) {
      // 50 seconds
      logger.warn("Recovery timeout approaching, queuing for later processing")

      // Queue the recovery for later processing
      await queueRecoveryJob(requestId)

      return new Response(
        JSON.stringify({
          message: "Recovery queued for processing",
          requestId,
          status: "queued",
        }),
        {
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    // Attempt recovery with timeout protection
    const result = await Promise.race([
      recoverContentGeneration(requestId),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Recovery timeout")), 45000)),
    ])

    return new Response(
      JSON.stringify({
        message: "Recovery successful",
        requestId,
        result,
        processingTime: Date.now() - startTime,
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    const processingTime = Date.now() - startTime
    logger.error("Recovery failed", { error, processingTime })

    // If it's a timeout error, queue for later processing
    if (error.message === "Recovery timeout") {
      await queueRecoveryJob(body?.requestId).catch((e) => logger.error("Failed to queue recovery job", { error: e }))

      return new Response(
        JSON.stringify({
          error: "Recovery timeout - queued for retry",
          message: "Recovery will be retried automatically",
          requestId: body?.requestId,
        }),
        {
          status: 202, // Accepted for processing
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    return new Response(
      JSON.stringify({
        error: "Recovery failed",
        message: error.message,
        processingTime,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

// Helper function to queue recovery jobs for later processing
async function queueRecoveryJob(requestId: string) {
  try {
    const { kv } = await import("@vercel/kv")

    // Add to recovery queue with timestamp
    await kv.zadd("recovery_queue", {
      score: Date.now(),
      member: requestId,
    })

    logger.info(`Queued recovery job for ${requestId}`)
  } catch (error) {
    logger.error("Failed to queue recovery job", { requestId, error })
    throw error
  }
}
