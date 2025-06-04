import { createChannelClient } from "@/lib/youtube-auth"
import { logger } from "@/lib/logger"
import { rateLimit } from "@/lib/rate-limiter"
import * as fs from "fs"
import { google } from "googleapis"
import { handleYouTubeError } from "@/lib/youtube-error-handler"
import { generateFallbackChannelStats, generateFallbackVideoAnalytics } from "@/lib/fallback-data"

/**
 * Upload video to specific YouTube channel
 */
export async function uploadToYouTube(params: {
  videoFilePath: string
  title: string
  description: string
  tags: string[]
  thumbnailFilePath: string
  channelId: string
  privacyStatus?: "private" | "unlisted" | "public"
  categoryId?: string
}): Promise<string> {
  const {
    videoFilePath,
    title,
    description,
    tags,
    thumbnailFilePath,
    channelId,
    privacyStatus = "private",
    categoryId = "28", // Science & Technology
  } = params

  // Apply rate limiting
  await rateLimit(`youtube_upload_${channelId}`, 1)

  try {
    logger.info("Uploading video to YouTube", {
      title,
      channelId,
      privacyStatus,
    })

    // Create authenticated client for this channel
    const youtube = await createChannelClient(channelId)

    // Verify file exists
    if (!fs.existsSync(videoFilePath)) {
      throw new Error(`Video file not found: ${videoFilePath}`)
    }

    // Upload video
    const videoResponse = await youtube.videos.insert({
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title,
          description,
          tags,
          categoryId,
        },
        status: {
          privacyStatus,
          selfDeclaredMadeForKids: false,
        },
      },
      media: {
        body: fs.createReadStream(videoFilePath),
      },
    })

    const videoId = videoResponse.data.id
    if (!videoId) {
      throw new Error("Failed to upload video: No video ID returned")
    }

    // Upload thumbnail if provided
    if (thumbnailFilePath && fs.existsSync(thumbnailFilePath)) {
      try {
        await youtube.thumbnails.set({
          videoId,
          media: {
            body: fs.createReadStream(thumbnailFilePath),
          },
        })
        logger.info("Thumbnail uploaded successfully", { videoId })
      } catch (thumbnailError) {
        logger.warn("Failed to upload thumbnail", { videoId, error: thumbnailError })
        // Don't fail the entire upload for thumbnail issues
      }
    }

    const youtubeUrl = `https://youtube.com/watch?v=${videoId}`

    logger.info("Video uploaded successfully", {
      videoId,
      channelId,
      youtubeUrl,
    })

    return youtubeUrl
  } catch (error) {
    logger.error("YouTube upload failed", {
      channelId,
      title,
      error: error.message,
    })
    throw new Error(`Failed to upload to YouTube: ${error.message}`)
  }
}

/**
 * Get channel statistics
 */
export async function getChannelStats(channelId: string) {
  await rateLimit(`youtube_stats_${channelId}`, 10)

  try {
    const youtube = await createChannelClient(channelId)

    const response = await youtube.channels.list({
      id: [channelId],
      part: ["statistics", "snippet"],
    })

    const channel = response.data.items?.[0]
    if (!channel) {
      logger.warn(`Channel not found, using fallback data: ${channelId}`)
      return generateFallbackChannelStats(channelId)
    }

    return {
      subscribers: Number.parseInt(channel.statistics?.subscriberCount || "0"),
      views: Number.parseInt(channel.statistics?.viewCount || "0"),
      videos: Number.parseInt(channel.statistics?.videoCount || "0"),
      title: channel.snippet?.title,
      description: channel.snippet?.description,
      thumbnailUrl: channel.snippet?.thumbnails?.high?.url,
      lastUpdated: new Date().toISOString(),
    }
  } catch (error) {
    handleYouTubeError(error, { operation: "getChannelStats", channelId })
    // Return fallback data if error handling doesn't throw
    return generateFallbackChannelStats(channelId)
  }
}

/**
 * Get video analytics
 */
export async function getVideoAnalytics(videoId: string, channelId: string) {
  await rateLimit(`youtube_analytics_${videoId}`, 20)

  try {
    const youtube = await createChannelClient(channelId)

    const videoResponse = await youtube.videos.list({
      id: [videoId],
      part: ["statistics", "snippet", "contentDetails"],
    })

    const video = videoResponse.data.items?.[0]
    if (!video) {
      logger.warn(`Video not found, using fallback data: ${videoId}`)
      return generateFallbackVideoAnalytics(videoId)
    }

    return {
      views: Number.parseInt(video.statistics?.viewCount || "0"),
      likes: Number.parseInt(video.statistics?.likeCount || "0"),
      comments: Number.parseInt(video.statistics?.commentCount || "0"),
      duration: video.contentDetails?.duration || "PT0S",
      publishedAt: video.snippet?.publishedAt,
      title: video.snippet?.title,
      description: video.snippet?.description,
      thumbnailUrl: video.snippet?.thumbnails?.high?.url,
      channelId: video.snippet?.channelId,
      lastUpdated: new Date().toISOString(),
    }
  } catch (error) {
    handleYouTubeError(error, { operation: "getVideoAnalytics", videoId, channelId })
    // Return fallback data if error handling doesn't throw
    return generateFallbackVideoAnalytics(videoId)
  }
}

/**
 * Search for videos on a channel
 */
export async function searchChannelVideos(channelId: string, query?: string, maxResults = 25) {
  await rateLimit(`youtube_search_${channelId}`, 5)

  try {
    const youtube = await createChannelClient(channelId)

    const searchParams: any = {
      part: ["snippet"],
      channelId,
      type: ["video"],
      order: "date",
      maxResults,
    }

    if (query) {
      searchParams.q = query
    }

    const response = await youtube.search.list(searchParams)

    return (
      response.data.items?.map((item) => ({
        videoId: item.id?.videoId,
        title: item.snippet?.title,
        description: item.snippet?.description,
        thumbnailUrl: item.snippet?.thumbnails?.high?.url,
        publishedAt: item.snippet?.publishedAt,
      })) || []
    )
  } catch (error) {
    logger.error("Failed to search channel videos", { channelId, error })
    throw error
  }
}

/**
 * Update video metadata
 */
export async function updateVideoMetadata(
  videoId: string,
  channelId: string,
  updates: {
    title?: string
    description?: string
    tags?: string[]
    categoryId?: string
  },
) {
  await rateLimit(`youtube_update_${videoId}`, 5)

  try {
    const youtube = await createChannelClient(channelId)

    await youtube.videos.update({
      part: ["snippet"],
      requestBody: {
        id: videoId,
        snippet: {
          ...updates,
        },
      },
    })

    logger.info("Video metadata updated successfully", { videoId })
  } catch (error) {
    logger.error("Failed to update video metadata", { videoId, error })
    throw error
  }
}

/**
 * Get channel's recent videos
 */
export async function getRecentVideos(channelId: string, maxResults = 10) {
  try {
    const videos = await searchChannelVideos(channelId, undefined, maxResults)

    // Get detailed analytics for each video
    const videosWithAnalytics = await Promise.all(
      videos.map(async (video) => {
        try {
          const analytics = await getVideoAnalytics(video.videoId!, channelId)
          return {
            ...video,
            ...analytics,
          }
        } catch (error) {
          logger.warn(`Failed to get analytics for video ${video.videoId}`, { error })
          return video
        }
      }),
    )

    return videosWithAnalytics
  } catch (error) {
    logger.error("Failed to get recent videos", { channelId, error })
    throw error
  }
}

/**
 * Get retention curve data for a video
 */
export async function getRetentionCurve(videoId: string, channelId?: string) {
  await rateLimit(`youtube_retention_${videoId}`, 5)

  try {
    logger.info("Fetching retention curve", { videoId })

    // Get the channel ID if not provided
    if (!channelId) {
      const videoDetails = await getVideoAnalytics(videoId, channelId!)
      channelId = videoDetails.channelId
    }

    const youtube = await createChannelClient(channelId!)

    // This requires YouTube Analytics API with proper permissions
    const response = await google.youtubeAnalytics("v2").reports.query({
      auth: youtube.auth,
      ids: `channel==${channelId}`,
      startDate: "7daysAgo",
      endDate: "today",
      metrics: "audienceWatchRatio",
      dimensions: "elapsedVideoTimeRatio",
      filters: `video==${videoId}`,
      sort: "elapsedVideoTimeRatio",
    })

    if (!response.data.rows || response.data.rows.length === 0) {
      // Generate mock retention curve if no data available
      return generateMockRetentionCurve()
    }

    // Transform the data into a usable format
    const retentionCurve = response.data.rows.map((row) => ({
      timestamp: Number.parseFloat(row[0]) * 100, // Convert ratio to percentage
      retention: Number.parseFloat(row[1]),
    }))

    return retentionCurve
  } catch (error) {
    logger.warn("Failed to fetch retention curve, using mock data", { videoId, error })
    // Return mock data if API fails
    return generateMockRetentionCurve()
  }
}

/**
 * Get top performing videos for a channel
 */
export async function getTopPerformingVideos(channelId: string, limit = 10) {
  await rateLimit(`youtube_top_videos_${channelId}`, 5)

  try {
    logger.info("Fetching top performing videos", { channelId, limit })

    const youtube = await createChannelClient(channelId)

    // First, get recent videos from the channel
    const searchResponse = await youtube.search.list({
      part: ["snippet"],
      channelId,
      type: ["video"],
      order: "viewCount",
      maxResults: limit,
    })

    if (!searchResponse.data.items || searchResponse.data.items.length === 0) {
      return []
    }

    // Get detailed statistics for each video
    const videoIds = searchResponse.data.items.map((item) => item.id?.videoId).filter(Boolean)

    const videosResponse = await youtube.videos.list({
      id: videoIds,
      part: ["statistics", "snippet", "contentDetails"],
    })

    // Combine search results with detailed statistics
    const topVideos =
      videosResponse.data.items?.map((video) => {
        const searchItem = searchResponse.data.items?.find((item) => item.id?.videoId === video.id)

        return {
          videoId: video.id!,
          title: video.snippet?.title || "Unknown",
          thumbnail: video.snippet?.thumbnails?.high?.url || "",
          views: Number.parseInt(video.statistics?.viewCount || "0"),
          likes: Number.parseInt(video.statistics?.likeCount || "0"),
          comments: Number.parseInt(video.statistics?.commentCount || "0"),
          publishedAt: video.snippet?.publishedAt || "",
          duration: parseDuration(video.contentDetails?.duration || "PT0S"),
          description: video.snippet?.description || "",
          watchTime: 0, // Would need Analytics API for this
          retention: 0, // Would need Analytics API for this
          revenue: 0, // Would need Analytics API for this
        }
      }) || []

    // Sort by views (descending)
    topVideos.sort((a, b) => b.views - a.views)

    return topVideos.slice(0, limit)
  } catch (error) {
    logger.error("Failed to fetch top performing videos", { channelId, error })
    throw new Error(`Failed to fetch top performing videos: ${error.message}`)
  }
}

/**
 * Generate mock retention curve for testing/fallback
 */
function generateMockRetentionCurve() {
  const curve = []
  let retention = 0.95 // Start high

  for (let i = 0; i <= 900; i += 30) {
    // 15-minute video, 30-second intervals
    if (i === 0)
      retention = 0.95 // Hook
    else if (i === 150)
      retention += 0.05 // First payoff
    else if (i === 420)
      retention += 0.03 // Mid-video hook
    else if (i === 720)
      retention += 0.02 // Final hook
    else retention -= 0.01 + Math.random() * 0.02 // Natural decline

    retention = Math.max(0.3, Math.min(0.95, retention)) // Keep within bounds

    curve.push({
      timestamp: i,
      retention: Math.round(retention * 100) / 100,
    })
  }

  return curve
}

/**
 * Parse ISO 8601 duration to seconds
 */
function parseDuration(duration: string): number {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)

  const hours = match?.[1] ? Number.parseInt(match[1]) : 0
  const minutes = match?.[2] ? Number.parseInt(match[2]) : 0
  const seconds = match?.[3] ? Number.parseInt(match[3]) : 0

  return hours * 3600 + minutes * 60 + seconds
}
