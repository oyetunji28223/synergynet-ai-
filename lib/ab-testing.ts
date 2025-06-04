import { logger } from "@/lib/logger"
import { kv } from "@vercel/kv"

type ABTest = {
  test_id: string
  video_id: string
  test_type: "thumbnail" | "title" | "hook" | "description"
  variants: {
    id: string
    content: string
    performance: {
      impressions: number
      clicks: number
      ctr: number
      retention: number
      engagement: number
    }
  }[]
  status: "running" | "completed" | "paused"
  winner?: string
  confidence_level: number
  start_date: string
  end_date?: string
}

/**
 * Create A/B test for video elements
 */
export async function createABTest(params: {
  video_id: string
  test_type: "thumbnail" | "title" | "hook" | "description"
  variants: { id: string; content: string }[]
}): Promise<ABTest> {
  const { video_id, test_type, variants } = params

  const test: ABTest = {
    test_id: `test_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    video_id,
    test_type,
    variants: variants.map((variant) => ({
      ...variant,
      performance: {
        impressions: 0,
        clicks: 0,
        ctr: 0,
        retention: 0,
        engagement: 0,
      },
    })),
    status: "running",
    confidence_level: 0,
    start_date: new Date().toISOString(),
  }

  // Save test to KV store
  await kv.set(`ab_test:${test.test_id}`, test)

  logger.info("A/B test created", { test_id: test.test_id, video_id, test_type })

  return test
}

/**
 * Generate optimized thumbnail variants for A/B testing
 */
export async function generateThumbnailVariants(params: {
  title: string
  niche: string
  style: "dramatic" | "educational" | "curiosity" | "authority"
}): Promise<{ id: string; content: string; description: string }[]> {
  const { title, niche, style } = params

  const variants = []

  // Variant A: High contrast with bold text
  variants.push({
    id: "variant_a",
    content: `thumbnail_${Date.now()}_a.jpg`,
    description: "High contrast design with bold, large text overlay and dramatic lighting",
  })

  // Variant B: Minimalist with curiosity gap
  variants.push({
    id: "variant_b",
    content: `thumbnail_${Date.now()}_b.jpg`,
    description: "Clean, minimalist design with question mark or mysterious element",
  })

  // Variant C: Authority-based with credibility signals
  variants.push({
    id: "variant_c",
    content: `thumbnail_${Date.now()}_c.jpg`,
    description: "Professional look with credibility indicators and clear value proposition",
  })

  // Variant D: Emotional with urgency
  variants.push({
    id: "variant_d",
    content: `thumbnail_${Date.now()}_d.jpg`,
    description: "Emotional design with urgency indicators and compelling visual elements",
  })

  logger.info("Generated thumbnail variants", { title, niche, style, count: variants.length })

  return variants
}

/**
 * Generate title variants for A/B testing
 */
export async function generateTitleVariants(params: {
  base_title: string
  niche: string
  keywords: string[]
  target_audience: "beginner" | "intermediate" | "advanced"
}): Promise<{ id: string; content: string; strategy: string }[]> {
  const { base_title, niche, keywords, target_audience } = params

  const variants = []

  // Variant A: Curiosity-driven
  variants.push({
    id: "title_a",
    content: `What ${getAuthorityFigure(niche)} Don't Want You to Know About ${keywords[0] || niche}`,
    strategy: "curiosity_authority",
  })

  // Variant B: Benefit-focused
  variants.push({
    id: "title_b",
    content: `How to ${getBenefit(niche)} in ${getTimeframe()} (${getCredibility(niche)})`,
    strategy: "benefit_proof",
  })

  // Variant C: Urgency-based
  variants.push({
    id: "title_c",
    content: `URGENT: ${getThreat(niche)} - ${getSolution(niche)} Before It's Too Late`,
    strategy: "urgency_solution",
  })

  // Variant D: List-based
  variants.push({
    id: "title_d",
    content: `${getNumber()} ${getListItem(niche)} That Will ${getOutcome(niche)}`,
    strategy: "list_outcome",
  })

  // Variant E: Question-based
  variants.push({
    id: "title_e",
    content: `Are You Making These ${getNumber()} ${getMistake(niche)}? (${getConsequence(niche)})`,
    strategy: "question_consequence",
  })

  logger.info("Generated title variants", { base_title, niche, count: variants.length })

  return variants
}

/**
 * Update A/B test performance data
 */
export async function updateABTestPerformance(
  test_id: string,
  variant_id: string,
  performance_data: {
    impressions?: number
    clicks?: number
    retention?: number
    engagement?: number
  },
) {
  try {
    const test = await kv.get(`ab_test:${test_id}`)
    if (!test) {
      throw new Error(`A/B test ${test_id} not found`)
    }

    // Update variant performance
    const variantIndex = test.variants.findIndex((v) => v.id === variant_id)
    if (variantIndex === -1) {
      throw new Error(`Variant ${variant_id} not found in test ${test_id}`)
    }

    const variant = test.variants[variantIndex]
    Object.assign(variant.performance, performance_data)

    // Recalculate CTR
    if (variant.performance.impressions > 0) {
      variant.performance.ctr = variant.performance.clicks / variant.performance.impressions
    }

    // Calculate statistical significance
    test.confidence_level = calculateStatisticalSignificance(test.variants)

    // Determine winner if confidence is high enough
    if (test.confidence_level > 0.95 && !test.winner) {
      test.winner = findWinningVariant(test.variants)
      test.status = "completed"
      test.end_date = new Date().toISOString()
    }

    // Save updated test
    await kv.set(`ab_test:${test_id}`, test)

    logger.info("A/B test performance updated", { test_id, variant_id, confidence: test.confidence_level })

    return test
  } catch (error) {
    logger.error("Failed to update A/B test performance", { test_id, variant_id, error })
    throw error
  }
}

/**
 * Get A/B test results and recommendations
 */
export async function getABTestResults(test_id: string) {
  const test = await kv.get(`ab_test:${test_id}`)
  if (!test) {
    throw new Error(`A/B test ${test_id} not found`)
  }

  const results = {
    test,
    insights: generateABTestInsights(test),
    recommendations: generateABTestRecommendations(test),
    next_tests: suggestNextTests(test),
  }

  return results
}

// Helper functions for A/B testing
function getAuthorityFigure(niche: string): string {
  const figures = {
    cybersecurity: "Security Experts",
    development: "Senior Developers",
    networking: "Network Engineers",
  }
  return figures[niche] || "Experts"
}

function getBenefit(niche: string): string {
  const benefits = {
    cybersecurity: "Become Unhackable",
    development: "Code Like a Pro",
    networking: "Secure Any Network",
  }
  return benefits[niche] || "Master This Skill"
}

function getTimeframe(): string {
  const timeframes = ["15 Minutes", "30 Minutes", "1 Hour", "24 Hours"]
  return timeframes[Math.floor(Math.random() * timeframes.length)]
}

function getCredibility(niche: string): string {
  const credentials = {
    cybersecurity: "Used by Fortune 500 Companies",
    development: "Google Engineer Approved",
    networking: "Enterprise-Grade Methods",
  }
  return credentials[niche] || "Proven Method"
}

function getThreat(niche: string): string {
  const threats = {
    cybersecurity: "New Zero-Day Exploit Discovered",
    development: "Critical Security Flaw Found",
    networking: "Network Breach Imminent",
  }
  return threats[niche] || "Critical Alert"
}

function getSolution(niche: string): string {
  const solutions = {
    cybersecurity: "Patch Your Systems",
    development: "Fix Your Code",
    networking: "Secure Your Network",
  }
  return solutions[niche] || "Take Action"
}

function getNumber(): string {
  const numbers = ["5", "7", "10", "12", "15"]
  return numbers[Math.floor(Math.random() * numbers.length)]
}

function getListItem(niche: string): string {
  const items = {
    cybersecurity: "Security Mistakes",
    development: "Coding Errors",
    networking: "Network Vulnerabilities",
  }
  return items[niche] || "Critical Mistakes"
}

function getOutcome(niche: string): string {
  const outcomes = {
    cybersecurity: "Save Your Digital Life",
    development: "Transform Your Career",
    networking: "Protect Your Business",
  }
  return outcomes[niche] || "Change Everything"
}

function getMistake(niche: string): string {
  const mistakes = {
    cybersecurity: "Security Blunders",
    development: "Coding Mistakes",
    networking: "Network Errors",
  }
  return mistakes[niche] || "Critical Errors"
}

function getConsequence(niche: string): string {
  const consequences = {
    cybersecurity: "You're Already Hacked",
    development: "Your Code is Vulnerable",
    networking: "Your Network is Exposed",
  }
  return consequences[niche] || "Serious Consequences"
}

function calculateStatisticalSignificance(variants: any[]): number {
  // Simplified statistical significance calculation
  // In a real implementation, you'd use proper statistical tests
  if (variants.length < 2) return 0

  const totalImpressions = variants.reduce((sum, v) => sum + v.performance.impressions, 0)
  if (totalImpressions < 1000) return 0 // Need minimum sample size

  // Calculate confidence based on sample size and performance difference
  const ctrs = variants.map((v) => v.performance.ctr)
  const maxCtr = Math.max(...ctrs)
  const minCtr = Math.min(...ctrs)
  const difference = maxCtr - minCtr

  // Simplified confidence calculation
  const confidence = Math.min(0.99, (totalImpressions / 10000) * difference * 10)
  return confidence
}

function findWinningVariant(variants: any[]): string {
  // Find variant with highest overall performance score
  let bestVariant = variants[0]
  let bestScore = 0

  for (const variant of variants) {
    // Weighted score considering CTR, retention, and engagement
    const score =
      variant.performance.ctr * 0.4 + variant.performance.retention * 0.4 + variant.performance.engagement * 0.2

    if (score > bestScore) {
      bestScore = score
      bestVariant = variant
    }
  }

  return bestVariant.id
}

function generateABTestInsights(test: ABTest): string[] {
  const insights = []

  if (test.status === "completed" && test.winner) {
    const winner = test.variants.find((v) => v.id === test.winner)
    const winnerCtr = winner?.performance.ctr || 0
    const avgCtr = test.variants.reduce((sum, v) => sum + v.performance.ctr, 0) / test.variants.length

    const improvement = ((winnerCtr - avgCtr) / avgCtr) * 100

    insights.push(`🏆 Winning variant improved CTR by ${improvement.toFixed(1)}%`)
    insights.push(`📊 Test reached ${(test.confidence_level * 100).toFixed(1)}% confidence level`)
  }

  // Add specific insights based on test type
  if (test.test_type === "thumbnail") {
    insights.push("🖼️ Thumbnail tests typically show results within 24-48 hours")
  } else if (test.test_type === "title") {
    insights.push("📝 Title tests affect both CTR and search performance")
  }

  return insights
}

function generateABTestRecommendations(test: ABTest): string[] {
  const recommendations = []

  if (test.status === "completed") {
    recommendations.push("✅ Implement the winning variant across similar content")
    recommendations.push("🔄 Run follow-up tests to further optimize performance")
  } else if (test.confidence_level < 0.8) {
    recommendations.push("⏳ Continue test until statistical significance is reached")
    recommendations.push("📈 Consider increasing traffic allocation to speed up results")
  }

  return recommendations
}

function suggestNextTests(test: ABTest): string[] {
  const suggestions = []

  if (test.test_type === "thumbnail") {
    suggestions.push("Test different color schemes")
    suggestions.push("Test with/without text overlays")
    suggestions.push("Test different emotional expressions")
  } else if (test.test_type === "title") {
    suggestions.push("Test different hook types (curiosity vs benefit)")
    suggestions.push("Test title length variations")
    suggestions.push("Test keyword placement")
  }

  return suggestions
}
