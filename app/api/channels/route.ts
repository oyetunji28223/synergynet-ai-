import { type NextRequest, NextResponse } from "next/server"
import { getConnectedChannels, removeChannel, verifyChannelAccess } from "@/lib/youtube-auth"
import { logger } from "@/lib/logger"

export async function GET() {
  try {
    const channels = await getConnectedChannels()

    // Verify access for each channel
    const channelsWithStatus = await Promise.all(
      channels.map(async (channel) => {
        const hasAccess = await verifyChannelAccess(channel.id)
        return {
          ...channel,
          hasAccess,
          status: hasAccess ? "active" : "error",
        }
      }),
    )

    return NextResponse.json({
      success: true,
      channels: channelsWithStatus,
    })
  } catch (error) {
    logger.error("Failed to get channels", { error })
    return NextResponse.json({ success: false, error: "Failed to fetch channels" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const channelId = searchParams.get("channelId")

    if (!channelId) {
      return NextResponse.json({ success: false, error: "Channel ID required" }, { status: 400 })
    }

    await removeChannel(channelId)

    return NextResponse.json({
      success: true,
      message: "Channel disconnected successfully",
    })
  } catch (error) {
    logger.error("Failed to remove channel", { error })
    return NextResponse.json({ success: false, error: "Failed to disconnect channel" }, { status: 500 })
  }
}
