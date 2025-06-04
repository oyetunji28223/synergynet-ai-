"use server"

import { revalidatePath } from "next/cache"
import { kv } from "@vercel/kv"
import { generateScript, generateVoiceOver, generateVisuals, createVideo, generateThumbnail } from "@/lib/generation"
import { uploadToYouTube } from "@/lib/youtube-api"
import { logger } from "@/lib/logger"

// Retry configuration
const MAX_RETRIES = 5
const INITIAL_RETRY_DELAY = 1000 // 1 second

/**
 * Retry function with exponential backoff
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = INITIAL_RETRY_DELAY,
  context = "operation",
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (retries <= 0) {
      logger.error(`Failed ${context} after maximum retries`, { error })
      throw error
    }

    logger.warn(`Retrying ${context} after error, ${retries} attempts remaining`, { error })
    await new Promise((resolve) => setTimeout(resolve, delay))
    return withRetry(fn, retries - 1, delay * 2, context)
  }
}

/**
 * Generate content with fault tolerance
 */
export async function generateContent(formData: FormData) {
  const startTime = Date.now()
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

  try {
    // Extract parameters
    const title = formData.get("title") as string
    const channelId = formData.get("channelId") as string // Now required
    const niche = formData.get("niche") as string
    const keywords = formData.get("keywords") as string
    const style = formData.get("style") as string
    const length = formData.get("length") as string

    if (!channelId) {
      throw new Error("Channel ID is required")
    }

    // Verify channel access
    const hasAccess = await verifyChannelAccess(channelId)
    if (!hasAccess) {
      throw new Error("No access to specified channel")
    }

    // Log the request
    logger.info("Content generation started", {
      requestId,
      channelId,
      niche,
      style,
      length,
    })

    // Save request to KV store for recovery if needed
    await kv.set(
      `request:${requestId}`,
      {
        title,
        channelId,
        niche,
        keywords,
        style,
        length,
        status: "processing",
        startTime,
      },
      { ex: 86400 },
    )

    // Generate content with channel-specific optimization
    const script = await withRetry(
      () => generateScript({ title, niche, keywords, style, length, channelId }),
      MAX_RETRIES,
      INITIAL_RETRY_DELAY,
      "script generation",
    )

    await kv.hset(`request:${requestId}`, { status: "script_generated" })

    const audioUrl = await withRetry(
      () => generateVoiceOver(script, channelId),
      MAX_RETRIES,
      INITIAL_RETRY_DELAY,
      "voice generation",
    )

    await kv.hset(`request:${requestId}`, { status: "audio_generated" })

    const visualsUrls = await withRetry(
      () => generateVisuals({ script, niche, style, channelId }),
      MAX_RETRIES,
      INITIAL_RETRY_DELAY,
      "visuals generation",
    )

    await kv.hset(`request:${requestId}`, { status: "visuals_generated" })

    const videoUrl = await withRetry(
      () => createVideo({ audioUrl, visualsUrls, channelId }),
      MAX_RETRIES,
      INITIAL_RETRY_DELAY,
      "video creation",
    )

    await kv.hset(`request:${requestId}`, { status: "video_created" })

    const thumbnailUrl = await withRetry(
      () => generateThumbnail({ title, niche, channelId }),
      MAX_RETRIES,
      INITIAL_RETRY_DELAY,
      "thumbnail generation",
    )

    // Final result
    const result = {
      requestId,
      title: title || `Ultimate Guide to ${niche}`,
      script,
      audioUrl,
      videoUrl,
      thumbnailUrl,
      channelId,
      processingTime: Date.now() - startTime,
      status: "completed",
    }

    await kv.hset(`request:${requestId}`, {
      ...result,
      status: "completed",
    })

    logger.info("Content generation completed successfully", {
      requestId,
      channelId,
      processingTime: result.processingTime,
    })

    revalidatePath("/")
    return result
  } catch (error) {
    logger.error("Content generation failed", {
      requestId,
      error,
      processingTime: Date.now() - startTime,
    })

    await kv.hset(`request:${requestId}`, {
      status: "failed",
      error: error.message,
      failedAt: Date.now(),
    })

    throw error
  }
}

/**
 * Schedule content for publishing with fault tolerance
 */
export async function scheduleContent(videoId: string, date: Date, channelId: string) {
  const requestId = `schedule_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

  try {
    logger.info("Scheduling content", { requestId, videoId, date, channelId })

    // Save scheduling request
    await kv.set(`schedule:${requestId}`, {
      videoId,
      date: date.toISOString(),
      channelId,
      status: "scheduled",
    })

    // Add to scheduling queue
    await kv.zadd("publishing_queue", {
      score: date.getTime(),
      member: requestId,
    })

    logger.info("Content scheduled successfully", { requestId })
    revalidatePath("/schedule")

    return { success: true, requestId }
  } catch (error) {
    logger.error("Failed to schedule content", { requestId, error })
    throw error
  }
}

export async function publishContent(videoId: string, channelId: string) {
  const requestId = `publish_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

  try {
    logger.info("Publishing content", { requestId, videoId, channelId })

    // Get video data
    const videoData = await kv.get(`request:${videoId}`)
    if (!videoData) {
      throw new Error(`Video data not found for ${videoId}`)
    }

    // Verify channel access
    const hasAccess = await verifyChannelAccess(channelId)
    if (!hasAccess) {
      throw new Error("No access to specified channel")
    }

    // Upload to YouTube with retry
    const youtubeUrl = await withRetry(
      () =>
        uploadToYouTube({
          videoFilePath: videoData.videoUrl,
          title: videoData.title,
          description: generateDescription(videoData),
          tags: generateTags(videoData),
          thumbnailFilePath: videoData.thumbnailUrl,
          channelId,
          privacyStatus: "public",
        }),
      MAX_RETRIES,
      INITIAL_RETRY_DELAY,
      "YouTube upload",
    )

    // Update video status
    await kv.hset(`request:${videoId}`, {
      publishedAt: new Date().toISOString(),
      youtubeUrl,
      status: "published",
      channelId,
    })

    logger.info("Content published successfully", { requestId, youtubeUrl, channelId })

    revalidatePath("/")
    return { success: true, youtubeUrl }
  } catch (error) {
    logger.error("Failed to publish content", { requestId, error })
    throw error
  }
}

/**
 * Recover failed content generation
 */
export async function recoverContentGeneration(requestId: string) {
  try {
    // Get the failed request
    const request = await kv.get(`request:${requestId}`)
    if (!request) {
      throw new Error(`Request ${requestId} not found`)
    }

    // Create form data from the saved request
    const formData = new FormData()
    for (const [key, value] of Object.entries(request)) {
      if (typeof value === "string") {
        formData.append(key, value)
      }
    }

    // Retry generation
    return await generateContent(formData)
  } catch (error) {
    logger.error("Failed to recover content generation", { requestId, error })
    throw error
  }
}

// Helper functions
function generateDescription(videoData: any): string {
  // Generate SEO-optimized description
  return `${videoData.title}\n\n${videoData.script.substring(0, 200)}...\n\nSubscribe for more ${videoData.niche} content!`
}

function generateTags(videoData: any): string[] {
  // Generate relevant tags
  const baseTags = ["hacking", "cybersecurity", "tech", "tutorial"]
  const nicheTags = videoData.niche.split(",").map((tag) => tag.trim())
  const keywordTags = videoData.keywords ? videoData.keywords.split(",").map((tag) => tag.trim()) : []

  return [...new Set([...baseTags, ...nicheTags, ...keywordTags])].slice(0, 15) // YouTube allows max 15 tags
}

async function verifyChannelAccess(channelId: string): Promise<boolean> {
  // Placeholder for channel access verification logic
  // In a real application, this would involve checking if the user has
  // permission to access the specified channel, possibly through an
  // authentication or authorization system.
  // For now, we'll just return true to simulate access granted.
  return true
}
