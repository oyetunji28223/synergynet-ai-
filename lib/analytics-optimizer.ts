import { logger } from "@/lib/logger"
import { kv } from "@vercel/kv"
import { getVideoAnalytics, getRetentionCurve } from "@/lib/youtube-api"

// Types
type VideoAnalysis = {
  videoId: string
  title: string
  publishDate: string
  metrics: {
    views: number
    retention: number
    watchTime: number
    engagement: {
      likes: number
      comments: number
      likeRatio: number
      commentRatio: number
    }
    monetization: {
      rpm: number
      revenue: number
    }
    algorithm: {
      ctr: number
      impressions: number
      impressionClickRate: number
    }
  }
  retentionCurve: {
    timestamp: number
    retention: number
  }[]
  dropPoints: {
    timestamp: number
    severity: "low" | "medium" | "high"
    dropAmount: number
  }[]
  optimizationScore: number
  grade: "A+" | "A" | "B+" | "B" | "C+" | "C" | "D"
  insights: string[]
  recommendations: string[]
}

/**
 * Analyze video performance and generate optimization insights
 */
export async function analyzeVideoPerformance(videoId: string, channelId?: string): Promise<VideoAnalysis> {
  try {
    logger.info("Analyzing video performance", { videoId, channelId })

    // Check cache first
    const cacheKey = `analysis:${videoId}`
    const cachedAnalysis = await kv.get(cacheKey)

    if (cachedAnalysis) {
      return cachedAnalysis as VideoAnalysis
    }

    // If no channelId provided, try to get it from video details
    if (!channelId) {
      try {
        const videoDetails = await getVideoAnalytics(videoId, channelId!)
        // In a real implementation, you'd extract channelId from video details
        channelId = "default_channel" // Fallback
      } catch (error) {
        logger.warn("Could not determine channel ID, using default", { videoId })
        channelId = "default_channel"
      }
    }

    // Fetch video analytics data
    const analytics = await getVideoAnalytics(videoId, channelId)

    // Fetch retention curve data
    const retentionCurve = await getRetentionCurve(videoId, channelId)

    // Analyze retention curve to find drop points
    const dropPoints = findRetentionDropPoints(retentionCurve)

    // Calculate engagement metrics
    const engagement = {
      likes: analytics.likes,
      comments: analytics.comments,
      likeRatio: analytics.likes / analytics.views,
      commentRatio: analytics.comments / analytics.views,
    }

    // Calculate algorithm metrics
    const algorithm = {
      ctr: analytics.ctr,
      impressions: analytics.views / analytics.ctr, // Estimated impressions
      impressionClickRate: analytics.ctr,
    }

    // Calculate optimization score
    const optimizationScore = calculateOptimizationScore({
      retention: analytics.retention,
      engagement,
      monetization: {
        rpm: analytics.rpm,
        revenue: analytics.revenue,
      },
      algorithm,
    })

    // Generate insights and recommendations
    const insights = generateInsights({
      retention: analytics.retention,
      engagement,
      monetization: {
        rpm: analytics.rpm,
        revenue: analytics.revenue,
      },
      algorithm,
      dropPoints,
    })

    const recommendations = generateRecommendations({
      retention: analytics.retention,
      engagement,
      monetization: {
        rpm: analytics.rpm,
        revenue: analytics.revenue,
      },
      algorithm,
      dropPoints,
    })

    // Create the analysis object
    const analysis: VideoAnalysis = {
      videoId,
      title: analytics.title || "Unknown",
      publishDate: analytics.publishedAt || new Date().toISOString(),
      metrics: {
        views: analytics.views,
        retention: analytics.retention,
        watchTime: analytics.watchTime,
        engagement,
        monetization: {
          rpm: analytics.rpm,
          revenue: analytics.revenue,
        },
        algorithm,
      },
      retentionCurve,
      dropPoints,
      optimizationScore,
      grade: calculateGrade(optimizationScore),
      insights,
      recommendations,
    }

    // Cache the analysis for 6 hours
    await kv.set(cacheKey, analysis, { ex: 21600 })

    return analysis
  } catch (error) {
    logger.error("Video analysis failed", { videoId, error })
    throw new Error(`Failed to analyze video: ${error.message}`)
  }
}

/**
 * Find retention drop points in the retention curve
 */
function findRetentionDropPoints(retentionCurve: any[]): any[] {
  const dropPoints = []

  for (let i = 1; i < retentionCurve.length; i++) {
    const currentPoint = retentionCurve[i]
    const previousPoint = retentionCurve[i - 1]

    const drop = previousPoint.retention - currentPoint.retention

    if (drop > 0.05) {
      // Significant drop
      const severity = drop > 0.1 ? "high" : drop > 0.07 ? "medium" : "low"

      dropPoints.push({
        timestamp: currentPoint.timestamp,
        severity,
        dropAmount: drop,
      })
    }
  }

  return dropPoints
}

/**
 * Calculate optimization score based on various metrics
 */
function calculateOptimizationScore(metrics: any): number {
  let score = 0

  // Retention score (40% of total)
  const retentionScore = (metrics.retention / 0.7) * 40 // Normalize to 70% target
  score += Math.min(40, retentionScore)

  // Engagement score (25% of total)
  const likeScore = (metrics.engagement.likeRatio / 0.04) * 15 // 4% like ratio target
  const commentScore = (metrics.engagement.commentRatio / 0.01) * 10 // 1% comment ratio target
  score += Math.min(15, likeScore) + Math.min(10, commentScore)

  // Monetization score (20% of total)
  const rpmScore = (metrics.monetization.rpm / 15) * 20 // $15 RPM target
  score += Math.min(20, rpmScore)

  // Algorithm score (15% of total)
  const ctrScore = (metrics.algorithm.ctr / 0.08) * 15 // 8% CTR target
  score += Math.min(15, ctrScore)

  return Math.min(100, Math.max(0, score))
}

/**
 * Calculate grade based on optimization score
 */
function calculateGrade(score: number): "A+" | "A" | "B+" | "B" | "C+" | "C" | "D" {
  if (score >= 95) return "A+"
  if (score >= 90) return "A"
  if (score >= 85) return "B+"
  if (score >= 80) return "B"
  if (score >= 75) return "C+"
  if (score >= 70) return "C"
  return "D"
}

/**
 * Generate insights based on performance metrics
 */
function generateInsights(metrics: any): string[] {
  const insights = []

  // Retention insights
  if (metrics.retention > 0.7) {
    insights.push(
      `🎯 Excellent retention at ${(metrics.retention * 100).toFixed(1)}% - your content structure is highly optimized`,
    )
  } else if (metrics.retention > 0.6) {
    insights.push(
      `📈 Good retention at ${(metrics.retention * 100).toFixed(1)}% - room for improvement in mid-video engagement`,
    )
  } else {
    insights.push(
      `⚠️ Low retention at ${(metrics.retention * 100).toFixed(1)}% - hook and content structure need optimization`,
    )
  }

  // Drop points insights
  if (metrics.dropPoints.length > 0) {
    const highSeverityDrops = metrics.dropPoints.filter((d) => d.severity === "high").length
    if (highSeverityDrops > 0) {
      insights.push(`📉 Found ${highSeverityDrops} major retention drops that need immediate attention`)
    }
  } else {
    insights.push(`✅ No significant retention drops detected - excellent content pacing`)
  }

  // Engagement insights
  if (metrics.engagement.likeRatio > 0.04) {
    insights.push(
      `👍 High engagement with ${(metrics.engagement.likeRatio * 100).toFixed(2)}% like ratio - audience loves your content`,
    )
  } else {
    insights.push(
      `💡 Like ratio at ${(metrics.engagement.likeRatio * 100).toFixed(2)}% - consider stronger CTAs and more engaging content`,
    )
  }

  // Monetization insights
  if (metrics.monetization.rpm > 15) {
    insights.push(
      `💰 Excellent RPM at $${metrics.monetization.rpm.toFixed(2)} - premium audience and optimal ad placement`,
    )
  } else if (metrics.monetization.rpm > 10) {
    insights.push(
      `💵 Good RPM at $${metrics.monetization.rpm.toFixed(2)} - consider optimizing ad placement for higher revenue`,
    )
  } else {
    insights.push(
      `📊 RPM at $${metrics.monetization.rpm.toFixed(2)} - focus on audience quality and content optimization`,
    )
  }

  // Algorithm insights
  if (metrics.algorithm.ctr > 0.08) {
    insights.push(
      `🎯 Strong CTR at ${(metrics.algorithm.ctr * 100).toFixed(1)}% - thumbnail and title are highly effective`,
    )
  } else {
    insights.push(
      `🖼️ CTR at ${(metrics.algorithm.ctr * 100).toFixed(1)}% - optimize thumbnail and title for better performance`,
    )
  }

  return insights
}

/**
 * Generate recommendations based on performance metrics
 */
function generateRecommendations(metrics: any): string[] {
  const recommendations = []

  // Retention recommendations
  if (metrics.retention < 0.7) {
    recommendations.push(`🎬 Strengthen your hook in the first 30 seconds to improve initial retention`)
  }

  if (metrics.dropPoints.length > 0) {
    const timestamps = metrics.dropPoints
      .filter((d) => d.severity === "high" || d.severity === "medium")
      .map((d) => formatTimestamp(d.timestamp))
      .join(", ")

    recommendations.push(`⏱️ Address retention drops at ${timestamps} with pattern interrupts or stronger content`)
  }

  // Engagement recommendations
  if (metrics.engagement.likeRatio < 0.03) {
    recommendations.push(`👍 Add stronger like CTAs at strategic points (30 seconds, midpoint, and conclusion)`)
  }

  if (metrics.engagement.commentRatio < 0.008) {
    recommendations.push(`💬 Ask specific questions to drive more comments and boost engagement signals`)
  }

  // Monetization recommendations
  if (metrics.monetization.rpm < 12) {
    recommendations.push(
      `💰 Optimize ad placement at retention high points (avoid placing ads before major drop points)`,
    )
  }

  // Algorithm recommendations
  if (metrics.algorithm.ctr < 0.07) {
    recommendations.push(`🖼️ A/B test thumbnails with higher contrast and more emotional triggers`)
    recommendations.push(`📝 Test different title formats focusing on curiosity gaps or clear value propositions`)
  }

  return recommendations
}

/**
 * Format timestamp in MM:SS format
 */
function formatTimestamp(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

/**
 * Generate A/B test variants for thumbnails
 */
export async function generateThumbnailVariants(videoId: string, title: string, niche: string): Promise<any[]> {
  try {
    logger.info("Generating thumbnail variants", { videoId, title })

    // Define variant styles
    const variantStyles = [
      {
        id: "high_contrast",
        name: "High Contrast",
        description: "Bold text with high contrast background",
        style: "high_contrast",
      },
      {
        id: "emotional",
        name: "Emotional Impact",
        description: "Emotional imagery with minimal text",
        style: "emotional",
      },
      {
        id: "curiosity",
        name: "Curiosity Gap",
        description: "Question-based design with mystery element",
        style: "curiosity",
      },
      {
        id: "authority",
        name: "Authority",
        description: "Professional look with credibility indicators",
        style: "authority",
      },
    ]

    // In a real implementation, this would generate actual thumbnail images
    // For this example, we'll return the variant definitions

    return variantStyles
  } catch (error) {
    logger.error("Thumbnail variant generation failed", { videoId, error })
    throw new Error(`Failed to generate thumbnail variants: ${error.message}`)
  }
}

/**
 * Generate A/B test variants for titles
 */
export async function generateTitleVariants(videoId: string, baseTitle: string, keywords: string[]): Promise<any[]> {
  try {
    logger.info("Generating title variants", { videoId, baseTitle })

    // Use OpenAI to generate title variants
    const openai = new (require("openai").OpenAI)({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const prompt = `
Generate 4 high-CTR YouTube title variants for a video currently titled "${baseTitle}".
Each title should use a different proven formula:
1. Curiosity-driven title
2. Benefit-focused title
3. Question-based title
4. List-based title

Keywords to include: ${keywords.join(", ")}

Return ONLY the 4 titles, one per line, with no quotes or additional text.
`

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert YouTube title optimizer." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 300,
    })

    const titleTexts = response.choices[0].message.content?.trim().split("\n") || [
      `What ${keywords[0]} Experts Don't Want You To Know`,
      `How To Master ${keywords[0]} In Just 15 Minutes`,
      `Is Your ${keywords[0]} Approach Costing You Time?`,
      `7 ${keywords[0]} Secrets That Will Transform Your Results`,
    ]

    // Create variant objects
    const variants = titleTexts.map((title, index) => ({
      id: `title_variant_${index + 1}`,
      title,
      type: ["curiosity", "benefit", "question", "list"][index],
    }))

    return variants
  } catch (error) {
    logger.error("Title variant generation failed", { videoId, error })
    throw new Error(`Failed to generate title variants: ${error.message}`)
  }
}

/**
 * Create and start an A/B test
 */
export async function createABTest(params: {
  videoId: string
  testType: "thumbnail" | "title"
  variants: any[]
}): Promise<any> {
  const { videoId, testType, variants } = params

  try {
    logger.info("Creating A/B test", { videoId, testType, variantCount: variants.length })

    const testId = `test_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    const test = {
      id: testId,
      videoId,
      testType,
      variants: variants.map((v) => ({
        ...v,
        performance: {
          impressions: 0,
          clicks: 0,
          ctr: 0,
        },
      })),
      status: "running",
      startDate: new Date().toISOString(),
      confidenceLevel: 0,
    }

    // Save the test to KV store
    await kv.set(`abtest:${testId}`, test)

    // In a real implementation, this would integrate with the YouTube API
    // to actually set up the A/B test

    return test
  } catch (error) {
    logger.error("A/B test creation failed", { videoId, testType, error })
    throw new Error(`Failed to create A/B test: ${error.message}`)
  }
}

/**
 * Update A/B test with performance data
 */
export async function updateABTest(testId: string, variantId: string, performance: any): Promise<any> {
  try {
    logger.info("Updating A/B test", { testId, variantId })

    // Get the current test data
    const test = await kv.get(`abtest:${testId}`)

    if (!test) {
      throw new Error(`A/B test ${testId} not found`)
    }

    // Update the variant performance
    const variantIndex = test.variants.findIndex((v) => v.id === variantId)

    if (variantIndex === -1) {
      throw new Error(`Variant ${variantId} not found in test ${testId}`)
    }

    test.variants[variantIndex].performance = {
      ...test.variants[variantIndex].performance,
      ...performance,
    }

    // Calculate CTR
    if (test.variants[variantIndex].performance.impressions > 0) {
      test.variants[variantIndex].performance.ctr =
        test.variants[variantIndex].performance.clicks / test.variants[variantIndex].performance.impressions
    }

    // Calculate confidence level
    test.confidenceLevel = calculateConfidenceLevel(test.variants)

    // Check if we have a winner
    if (test.confidenceLevel >= 0.95 && test.status === "running") {
      test.status = "completed"
      test.endDate = new Date().toISOString()
      test.winner = findWinner(test.variants)
    }

    // Save the updated test
    await kv.set(`abtest:${testId}`, test)

    return test
  } catch (error) {
    logger.error("A/B test update failed", { testId, variantId, error })
    throw new Error(`Failed to update A/B test: ${error.message}`)
  }
}

/**
 * Calculate statistical confidence level
 */
function calculateConfidenceLevel(variants: any[]): number {
  // This is a simplified implementation
  // In a real system, you would use proper statistical tests

  if (variants.length < 2) return 0

  // Check if we have enough data
  const totalImpressions = variants.reduce((sum, v) => sum + v.performance.impressions, 0)
  if (totalImpressions < 1000) return 0

  // Find the best and worst performers
  const ctrs = variants.map((v) => v.performance.ctr || 0)
  const maxCtr = Math.max(...ctrs)
  const minCtr = Math.min(...ctrs)

  // Calculate confidence based on sample size and performance difference
  const difference = maxCtr - minCtr
  const confidence = Math.min(0.99, (totalImpressions / 10000) * difference * 10)

  return confidence
}

/**
 * Find the winning variant
 */
function findWinner(variants: any[]): string {
  let bestVariant = variants[0]
  let bestCtr = variants[0].performance.ctr

  for (const variant of variants) {
    if (variant.performance.ctr > bestCtr) {
      bestCtr = variant.performance.ctr
      bestVariant = variant
    }
  }

  return bestVariant.id
}
