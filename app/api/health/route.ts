import { kv } from "@vercel/kv"
import { logger } from "@/lib/logger"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Check KV store connection
    const start = Date.now()
    await kv.set("health:check", { timestamp: start })
    const kvLatency = Date.now() - start

    // Check if we can read the value back
    const healthCheck = await kv.get("health:check")

    return new Response(
      JSON.stringify({
        status: "healthy",
        timestamp: new Date().toISOString(),
        kvStore: {
          connected: true,
          latency: `${kvLatency}ms`,
        },
        version: process.env.VERCEL_GIT_COMMIT_SHA || "development",
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    logger.error("Health check failed", { error })

    return new Response(
      JSON.stringify({
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
