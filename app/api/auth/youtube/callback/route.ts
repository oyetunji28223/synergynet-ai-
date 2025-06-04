import type { NextRequest } from "next/server"
import { redirect } from "next/navigation"
import { logger } from "@/lib/logger"
import { exchangeCodeForTokens, saveChannelTokens } from "@/lib/youtube-auth"

export const dynamic = "force-dynamic"
export const maxDuration = 30 // Set reasonable timeout for OAuth callback

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const error = searchParams.get("error")
    const state = searchParams.get("state")

    if (error) {
      logger.error("OAuth error", { error })
      redirect("/channels?error=oauth_failed")
    }

    if (!code) {
      logger.error("No authorization code received")
      redirect("/channels?error=no_code")
    }

    logger.info("Processing OAuth callback", { code: code.substring(0, 10) + "..." })

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code)

    // Save tokens and get channel info
    const channelInfo = await saveChannelTokens(tokens)

    logger.info("OAuth callback successful", {
      channelId: channelInfo.channelId,
      channelTitle: channelInfo.title,
    })

    redirect("/channels?success=channel_connected")
  } catch (error) {
    logger.error("OAuth callback failed", { error })
    redirect("/channels?error=callback_failed")
  }
}
