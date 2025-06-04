import { type NextRequest, NextResponse } from "next/server"
import { getAuthUrl } from "@/lib/youtube-auth"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const state = searchParams.get("state") || "default"

    const authUrl = getAuthUrl(state)

    return NextResponse.json({
      success: true,
      authUrl,
    })
  } catch (error) {
    logger.error("Failed to generate auth URL", { error })
    return NextResponse.json({ success: false, error: "Failed to generate authentication URL" }, { status: 500 })
  }
}
