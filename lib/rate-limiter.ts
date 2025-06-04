import { kv } from "@vercel/kv"
import { logger } from "@/lib/logger"

/**
 * Rate limiter to prevent API abuse
 * @param key The key to rate limit on
 * @param limit The maximum number of requests per minute
 */
export async function rateLimit(key: string, limit: number): Promise<void> {
  try {
    // Get the current minute
    const now = Math.floor(Date.now() / 60000)
    const rateKey = `rate:${key}:${now}`

    // Increment the counter
    const count = await kv.incr(rateKey)

    // Set expiry to 2 minutes (to ensure it expires)
    await kv.expire(rateKey, 120)

    if (count > limit) {
      logger.warn(`Rate limit exceeded for ${key}`, { limit, count })

      // Calculate delay based on how much the limit was exceeded
      const delayMs = Math.min(30000, (count - limit) * 1000) // Max 30 second delay

      // Wait before proceeding
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  } catch (error) {
    // If rate limiting fails, log but continue
    logger.error("Rate limiting failed", { key, error })
  }
}
