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

    logger.info("Starting daily long-form content generation")

    // Check if it's time for long-form content (3 PM UTC)
    const currentHour = new Date().getUTCHours()
    if (currentHour !== 15) {
      return new Response(
        JSON.stringify({
          message: "Not time for long-form content",
          currentHour,
          targetHour: 15,
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
        message: "Daily long-form content workflow completed",
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    logger.error("Daily long-form content workflow failed", { error })

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
