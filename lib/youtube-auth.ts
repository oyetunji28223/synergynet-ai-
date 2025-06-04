import { google } from "googleapis"
import { kv } from "@vercel/kv"
import { logger } from "@/lib/logger"

// OAuth2 configuration
const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.YOUTUBE_REDIRECT_URI,
)

// YouTube API client
const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
})

/**
 * Generate OAuth URL for channel authentication
 */
export function getAuthUrl(state?: string): string {
  const scopes = [
    "https://www.googleapis.com/auth/youtube",
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.readonly",
    "https://www.googleapis.com/auth/youtubepartner",
    "https://www.googleapis.com/auth/yt-analytics.readonly",
  ]

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
    state: state || "default",
  })
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(code: string): Promise<{
  tokens: any
  channelInfo: any
}> {
  try {
    // Get tokens from authorization code
    const { tokens } = await oauth2Client.getToken(code)

    // Set credentials to get channel info
    oauth2Client.setCredentials(tokens)

    // Get channel information
    const channelResponse = await youtube.channels.list({
      auth: oauth2Client,
      part: ["snippet", "statistics", "brandingSettings"],
      mine: true,
    })

    const channel = channelResponse.data.items?.[0]
    if (!channel) {
      throw new Error("No channel found for authenticated user")
    }

    const channelInfo = {
      id: channel.id,
      title: channel.snippet?.title,
      description: channel.snippet?.description,
      customUrl: channel.snippet?.customUrl,
      thumbnailUrl: channel.snippet?.thumbnails?.high?.url,
      subscriberCount: channel.statistics?.subscriberCount,
      videoCount: channel.statistics?.videoCount,
      viewCount: channel.statistics?.viewCount,
      country: channel.snippet?.country,
      defaultLanguage: channel.snippet?.defaultLanguage,
    }

    return { tokens, channelInfo }
  } catch (error) {
    logger.error("Failed to exchange code for tokens", { error })
    throw new Error(`Authentication failed: ${error.message}`)
  }
}

/**
 * Save tokens and get channel information
 */
export async function saveChannelTokens(tokens: any): Promise<any> {
  try {
    // Set credentials to get channel info
    oauth2Client.setCredentials(tokens)

    // Get channel information
    const channelResponse = await youtube.channels.list({
      auth: oauth2Client,
      part: ["snippet", "statistics", "brandingSettings"],
      mine: true,
    })

    const channel = channelResponse.data.items?.[0]
    if (!channel) {
      throw new Error("No channel found for authenticated user")
    }

    const channelInfo = {
      channelId: channel.id,
      title: channel.snippet?.title,
      description: channel.snippet?.description,
      customUrl: channel.snippet?.customUrl,
      thumbnailUrl: channel.snippet?.thumbnails?.high?.url,
      subscriberCount: channel.statistics?.subscriberCount,
      videoCount: channel.statistics?.videoCount,
      viewCount: channel.statistics?.viewCount,
      country: channel.snippet?.country,
      defaultLanguage: channel.snippet?.defaultLanguage,
    }

    // Store the tokens and channel info
    await storeChannelCredentials(channel.id, tokens, channelInfo)

    return channelInfo
  } catch (error) {
    logger.error("Failed to save channel tokens", { error })
    throw new Error(`Failed to save channel tokens: ${error.message}`)
  }
}

/**
 * Store channel credentials securely
 */
export async function storeChannelCredentials(channelId: string, tokens: any, channelInfo: any): Promise<void> {
  try {
    // Store tokens with encryption
    await kv.set(`channel:${channelId}:tokens`, {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expiry_date: tokens.expiry_date,
      token_type: tokens.token_type,
      scope: tokens.scope,
    })

    // Store channel information
    await kv.set(`channel:${channelId}:info`, {
      ...channelInfo,
      connectedAt: new Date().toISOString(),
      status: "active",
    })

    // Add to channels list
    const existingChannels = (await kv.get("connected_channels")) || []
    const updatedChannels = [
      ...existingChannels.filter((c: any) => c.id !== channelId),
      {
        id: channelId,
        title: channelInfo.title,
        thumbnailUrl: channelInfo.thumbnailUrl,
        subscriberCount: channelInfo.subscriberCount,
        connectedAt: new Date().toISOString(),
      },
    ]

    await kv.set("connected_channels", updatedChannels)

    logger.info("Channel credentials stored successfully", { channelId })
  } catch (error) {
    logger.error("Failed to store channel credentials", { channelId, error })
    throw error
  }
}

/**
 * Get stored credentials for a channel
 */
export async function getChannelCredentials(channelId: string): Promise<any> {
  try {
    const tokens = await kv.get(`channel:${channelId}:tokens`)
    if (!tokens) {
      throw new Error(`No credentials found for channel ${channelId}`)
    }

    // Check if token needs refresh
    if (tokens.expiry_date && Date.now() >= tokens.expiry_date) {
      return await refreshChannelTokens(channelId, tokens)
    }

    return tokens
  } catch (error) {
    logger.error("Failed to get channel credentials", { channelId, error })
    throw error
  }
}

/**
 * Refresh expired tokens
 */
export async function refreshChannelTokens(channelId: string, tokens: any): Promise<any> {
  try {
    oauth2Client.setCredentials(tokens)
    const { credentials } = await oauth2Client.refreshAccessToken()

    // Store updated tokens
    await kv.set(`channel:${channelId}:tokens`, credentials)

    logger.info("Tokens refreshed successfully", { channelId })
    return credentials
  } catch (error) {
    logger.error("Failed to refresh tokens", { channelId, error })
    throw error
  }
}

/**
 * Get all connected channels
 */
export async function getConnectedChannels(): Promise<any[]> {
  try {
    const channels = (await kv.get("connected_channels")) || []

    // Verify each channel is still valid
    const validChannels = []
    for (const channel of channels) {
      try {
        const credentials = await getChannelCredentials(channel.id)
        if (credentials) {
          validChannels.push(channel)
        }
      } catch (error) {
        logger.warn(`Channel ${channel.id} credentials invalid, removing`, { error })
        await removeChannel(channel.id)
      }
    }

    return validChannels
  } catch (error) {
    logger.error("Failed to get connected channels", { error })
    return []
  }
}

/**
 * Remove a channel connection
 */
export async function removeChannel(channelId: string): Promise<void> {
  try {
    // Remove credentials
    await kv.del(`channel:${channelId}:tokens`)
    await kv.del(`channel:${channelId}:info`)

    // Remove from channels list
    const existingChannels = (await kv.get("connected_channels")) || []
    const updatedChannels = existingChannels.filter((c: any) => c.id !== channelId)
    await kv.set("connected_channels", updatedChannels)

    logger.info("Channel removed successfully", { channelId })
  } catch (error) {
    logger.error("Failed to remove channel", { channelId, error })
    throw error
  }
}

/**
 * Create authenticated YouTube client for specific channel
 */
export async function createChannelClient(channelId: string) {
  const credentials = await getChannelCredentials(channelId)

  const channelOAuth = new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    process.env.YOUTUBE_REDIRECT_URI,
  )

  channelOAuth.setCredentials(credentials)

  return google.youtube({
    version: "v3",
    auth: channelOAuth,
  })
}

/**
 * Verify channel access and permissions
 */
export async function verifyChannelAccess(channelId: string): Promise<boolean> {
  try {
    const client = await createChannelClient(channelId)

    // Test API access
    const response = await client.channels.list({
      part: ["snippet"],
      id: [channelId],
    })

    return response.data.items && response.data.items.length > 0
  } catch (error) {
    logger.error("Channel access verification failed", { channelId, error })
    return false
  }
}
