import { runDailyContentWorkflow } from "@/lib/daily-scheduler"
import { logger } from "@/lib/logger"

export const dynamic = "force-dynamic"
export const maxDuration = 60 // 60 seconds (maximum allowed)

export async function GET(request: Request) {
  try {
    // Verify cron secret
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (token !== process.env.CRON_SECRET) {
      return new Response("Unauthorized", { status: 401 })
    }

    logger.info("Starting daily shorts content generation")

    // Check if it's time for shorts (6 PM UTC or every 2 hours after)
    const currentHour = new Date().getUTCHours()
    const shouldPost =
      currentHour === 18 || // 6 PM
      (currentHour > 18 && (currentHour - 18) % 2 === 0) || // Every 2 hours after
      (currentHour < 6 && (currentHour + 24 - 18) % 2 === 0) // Handle day rollover

    if (!shouldPost) {
      return new Response(
        JSON.stringify({
          message: "Not time for shorts content",
          currentHour,
          nextPostingHour: currentHour < 18 ? 18 : currentHour + (2 - ((currentHour - 18) % 2)),
        }),
        {
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    // Run the workflow
    await runDailyContentWorkflow()

    return new Response(
      JSON.stringify({
        success: true,
        message: "Daily shorts content workflow completed",
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    logger.error("Daily shorts content workflow failed", { error })

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
