import { analyzeVideoPerformance } from "@/lib/analytics-optimizer"
import { getTopPerformingVideos } from "@/lib/youtube-api"
import { logger } from "@/lib/logger"
import { kv } from "@vercel/kv"

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

    logger.info("Starting daily performance analysis")

    const channels = ["cybersec_channel", "devhacks_channel", "netsec_channel", "codebreak_channel", "hacklab_channel"]

    const analysisResults = []

    for (const channelId of channels) {
      try {
        // Get recent videos for this channel
        const recentVideos = await getTopPerformingVideos(channelId, 5)

        for (const video of recentVideos) {
          try {
            const analysis = await analyzeVideoPerformance(video.videoId)

            analysisResults.push({
              channelId,
              videoId: video.videoId,
              title: video.title,
              analysis,
            })

            // Store analysis results
            await kv.set(
              `daily_analysis:${video.videoId}:${new Date().toISOString().split("T")[0]}`,
              {
                analysis,
                analyzedAt: new Date().toISOString(),
              },
              { ex: 604800 },
            ) // 7 days
          } catch (error) {
            logger.error(`Failed to analyze video ${video.videoId}`, { error })
          }
        }
      } catch (error) {
        logger.error(`Failed to get videos for channel ${channelId}`, { error })
      }
    }

    // Generate daily insights report
    const report = {
      date: new Date().toISOString().split("T")[0],
      totalVideosAnalyzed: analysisResults.length,
      averageOptimizationScore:
        analysisResults.reduce((sum, r) => sum + r.analysis.optimizationScore, 0) / analysisResults.length,
      topPerformers: analysisResults
        .sort((a, b) => b.analysis.optimizationScore - a.analysis.optimizationScore)
        .slice(0, 3),
      commonIssues: extractCommonIssues(analysisResults),
      recommendations: generateDailyRecommendations(analysisResults),
      generatedAt: new Date().toISOString(),
    }

    // Store daily report
    await kv.set(`daily_performance_report:${report.date}`, report, { ex: 2592000 }) // 30 days

    return new Response(
      JSON.stringify({
        success: true,
        message: "Daily performance analysis completed",
        report,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    logger.error("Daily performance analysis failed", { error })

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

function extractCommonIssues(results: any[]): string[] {
  const issues = []

  // Analyze common patterns
  const lowRetentionVideos = results.filter((r) => r.analysis.metrics.retention < 0.6).length
  const lowEngagementVideos = results.filter((r) => r.analysis.metrics.engagement.likeRatio < 0.03).length
  const lowRPMVideos = results.filter((r) => r.analysis.metrics.monetization.rpm < 10).length

  if (lowRetentionVideos > results.length * 0.3) {
    issues.push("High number of videos with low retention - focus on hook optimization")
  }

  if (lowEngagementVideos > results.length * 0.4) {
    issues.push("Low engagement across multiple videos - strengthen CTAs and interaction prompts")
  }

  if (lowRPMVideos > results.length * 0.3) {
    issues.push("Revenue optimization needed - review ad placement and audience targeting")
  }

  return issues
}

function generateDailyRecommendations(results: any[]): string[] {
  const recommendations = []

  // Find best performing patterns
  const topPerformers = results
    .sort((a, b) => b.analysis.optimizationScore - a.analysis.optimizationScore)
    .slice(0, Math.ceil(results.length * 0.2)) // Top 20%

  if (topPerformers.length > 0) {
    const avgTopRetention =
      topPerformers.reduce((sum, r) => sum + r.analysis.metrics.retention, 0) / topPerformers.length
    recommendations.push(
      `Top performers average ${(avgTopRetention * 100).toFixed(1)}% retention - replicate their content structure`,
    )

    const commonTopKeywords = extractCommonKeywords(topPerformers)
    if (commonTopKeywords.length > 0) {
      recommendations.push(`Focus on these high-performing keywords: ${commonTopKeywords.join(", ")}`)
    }
  }

  recommendations.push("Continue daily posting schedule for algorithm consistency")
  recommendations.push("A/B test thumbnails for videos with CTR below 7%")
  recommendations.push("Add mid-video retention hooks at 3-4 minute intervals")

  return recommendations
}

function extractCommonKeywords(videos: any[]): string[] {
  // This would analyze titles and extract common high-performing keywords
  // Simplified implementation
  return ["tutorial", "guide", "secrets", "tips", "advanced"]
}
