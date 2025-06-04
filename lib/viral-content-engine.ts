import { logger } from "@/lib/logger"
import { kv } from "@vercel/kv"
import { OpenAI } from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Viral content patterns and triggers
const VIRAL_PATTERNS = {
  psychological_triggers: [
    "curiosity_gap",
    "fear_of_missing_out",
    "social_proof",
    "authority_bias",
    "scarcity_principle",
    "controversy",
    "emotional_shock",
    "pattern_interrupt",
  ],
  content_structures: [
    "problem_agitation_solution",
    "before_after_bridge",
    "story_lesson_application",
    "question_answer_deeper_question",
    "myth_busting_truth_reveal",
    "countdown_revelation",
    "comparison_contrast_winner",
    "journey_transformation",
  ],
  engagement_hooks: [
    "immediate_value_promise",
    "shocking_statistic",
    "controversial_statement",
    "personal_story_teaser",
    "industry_secret_reveal",
    "common_mistake_exposure",
    "expert_contradiction",
    "future_prediction",
  ],
}

/**
 * Advanced viral content generation engine
 */
export class ViralContentEngine {
  /**
   * Generate viral content ideas with psychological optimization
   */
  async generateViralContent(params: {
    niche: string
    audience: string
    contentType: "long_form" | "short_form"
    viralGoal: "awareness" | "engagement" | "conversion" | "retention"
    trendingTopics?: string[]
    competitorAnalysis?: any
  }): Promise<{
    title: string
    hook: string
    structure: any
    viralScore: number
    psychologicalTriggers: string[]
    contentStrategy: any
  }> {
    try {
      logger.info("Generating viral content", { params })

      // Analyze current viral trends
      const viralTrends = await this.analyzeViralTrends(params.niche)

      // Generate content using advanced AI
      const content = await this.generateAdvancedViralContent(params, viralTrends)

      // Calculate viral potential score
      const viralScore = await this.calculateViralScore(content, params)

      // Optimize for psychological triggers
      const optimizedContent = await this.optimizeForPsychology(content, params.viralGoal)

      return {
        ...optimizedContent,
        viralScore,
      }
    } catch (error) {
      logger.error("Viral content generation failed", { error })
      throw error
    }
  }

  /**
   * Analyze current viral trends in the niche
   */
  private async analyzeViralTrends(niche: string): Promise<any> {
    const cacheKey = `viral_trends:${niche}:${new Date().toDateString()}`
    const cached = await kv.get(cacheKey)

    if (cached) {
      return cached
    }

    const prompt = `
Analyze the current viral trends in ${niche} for YouTube content.

Identify:
1. Top 5 viral topics this week
2. Trending keywords and phrases
3. Viral content formats that are working
4. Psychological triggers being used
5. Audience engagement patterns
6. Optimal content length and structure
7. Best posting times and frequency

Return detailed analysis with specific examples and data.
`

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a viral content analyst with access to real-time YouTube data." },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    })

    const trends = JSON.parse(response.choices[0].message.content || "{}")

    // Cache for 6 hours
    await kv.set(cacheKey, trends, { ex: 21600 })

    return trends
  }

  /**
   * Generate advanced viral content using AI
   */
  private async generateAdvancedViralContent(params: any, viralTrends: any): Promise<any> {
    const prompt = `
Generate viral ${params.contentType} content for ${params.niche} targeting ${params.audience} audience.

VIRAL TRENDS DATA:
${JSON.stringify(viralTrends, null, 2)}

REQUIREMENTS:
- Goal: ${params.viralGoal}
- Must use proven viral patterns
- Include psychological triggers
- Optimize for YouTube algorithm
- Create curiosity gaps
- Use emotional hooks
- Include social proof elements

CONTENT TYPE: ${params.contentType}
${params.contentType === "long_form" ? "TARGET: 12-15 minutes with 70%+ retention" : "TARGET: 60 seconds with 85%+ retention"}

Generate:
1. Viral title (multiple variants)
2. Opening hook (first 15 seconds)
3. Content structure with retention points
4. Psychological triggers to use
5. Call-to-action strategy
6. Thumbnail concepts
7. SEO keywords

Return as detailed JSON structure.
`

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a viral content creator who has generated millions of views. Create content that triggers massive engagement.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 3000,
    })

    return JSON.parse(response.choices[0].message.content || "{}")
  }

  /**
   * Calculate viral potential score
   */
  private async calculateViralScore(content: any, params: any): Promise<number> {
    let score = 0

    // Title analysis (30% of score)
    score += this.analyzeTitleVirality(content.title) * 0.3

    // Hook strength (25% of score)
    score += this.analyzeHookStrength(content.hook) * 0.25

    // Psychological triggers (20% of score)
    score += this.analyzePsychologicalTriggers(content.psychologicalTriggers) * 0.2

    // Content structure (15% of score)
    score += this.analyzeContentStructure(content.structure) * 0.15

    // Trend alignment (10% of score)
    score += this.analyzeTrendAlignment(content, params.niche) * 0.1

    return Math.min(1, Math.max(0, score))
  }

  /**
   * Optimize content for psychological triggers
   */
  private async optimizeForPsychology(content: any, viralGoal: string): Promise<any> {
    const optimizationStrategies = {
      awareness: {
        triggers: ["curiosity_gap", "shocking_statistic", "controversy"],
        structure: "problem_agitation_solution",
        cta: "share_and_subscribe",
      },
      engagement: {
        triggers: ["social_proof", "fear_of_missing_out", "pattern_interrupt"],
        structure: "question_answer_deeper_question",
        cta: "comment_and_interact",
      },
      conversion: {
        triggers: ["authority_bias", "scarcity_principle", "social_proof"],
        structure: "before_after_bridge",
        cta: "click_and_convert",
      },
      retention: {
        triggers: ["emotional_shock", "personal_story", "value_delivery"],
        structure: "story_lesson_application",
        cta: "watch_next_video",
      },
    }

    const strategy = optimizationStrategies[viralGoal]

    // Apply psychological optimization
    const optimizedContent = {
      ...content,
      psychologicalTriggers: strategy.triggers,
      optimizedStructure: strategy.structure,
      callToAction: strategy.cta,
      viralOptimizations: await this.generateViralOptimizations(content, strategy),
    }

    return optimizedContent
  }

  /**
   * Generate specific viral optimizations
   */
  private async generateViralOptimizations(content: any, strategy: any): Promise<any> {
    return {
      titleVariants: await this.generateViralTitleVariants(content.title),
      hookVariants: await this.generateViralHookVariants(content.hook),
      thumbnailConcepts: await this.generateViralThumbnailConcepts(content.title),
      retentionHooks: await this.generateRetentionHooks(content.structure),
      engagementTriggers: await this.generateEngagementTriggers(strategy.triggers),
    }
  }

  /**
   * Generate viral title variants
   */
  private async generateViralTitleVariants(baseTitle: string): Promise<string[]> {
    const prompt = `
Generate 10 viral title variants for: "${baseTitle}"

Use these proven viral formulas:
1. "This [THING] Will [OUTCOME] (And Why [AUTHORITY] Doesn't Want You To Know)"
2. "[NUMBER] [THING] That Will [BENEFIT] In [TIMEFRAME]"
3. "Why [COMMON BELIEF] Is Wrong (And What To Do Instead)"
4. "The [ADJECTIVE] Truth About [TOPIC] That [AUTHORITY] Hides"
5. "[SHOCKING FACT] About [TOPIC] That Will [EMOTION]"
6. "How I [ACHIEVEMENT] Using This [METHOD] (Step By Step)"
7. "[TOPIC]: The [SUPERLATIVE] Guide You'll Ever Need"
8. "What Happens When You [ACTION]? (The Results Will Shock You)"
9. "[AUTHORITY] Reveals [SECRET] That [OUTCOME]"
10. "The [TIMEFRAME] [TOPIC] Challenge That [BENEFIT]"

Make each title:
- Curiosity-driven
- Benefit-focused
- Emotionally triggering
- Algorithm-optimized
- Click-worthy but not clickbait

Return only the titles, one per line.
`

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a viral title optimization expert." },
        { role: "user", content: prompt },
      ],
      temperature: 0.9,
      max_tokens: 800,
    })

    return response.choices[0].message.content?.trim().split("\n") || []
  }

  /**
   * Analyze title virality potential
   */
  private analyzeTitleVirality(title: string): number {
    let score = 0

    // Check for viral keywords
    const viralKeywords = [
      "secret",
      "shocking",
      "exposed",
      "revealed",
      "truth",
      "hidden",
      "dangerous",
      "powerful",
      "ultimate",
      "insane",
    ]
    const hasViralKeywords = viralKeywords.some((keyword) => title.toLowerCase().includes(keyword))
    if (hasViralKeywords) score += 0.2

    // Check for numbers
    if (/\d+/.test(title)) score += 0.15

    // Check for emotional triggers
    const emotionalWords = ["shocking", "amazing", "incredible", "unbelievable", "mind-blowing", "terrifying"]
    const hasEmotionalTrigger = emotionalWords.some((word) => title.toLowerCase().includes(word))
    if (hasEmotionalTrigger) score += 0.2

    // Check for curiosity gaps
    const curiosityIndicators = ["why", "how", "what", "when", "where", "which"]
    const hasCuriosityGap = curiosityIndicators.some((indicator) => title.toLowerCase().includes(indicator))
    if (hasCuriosityGap) score += 0.15

    // Check length (optimal 40-60 characters)
    const length = title.length
    if (length >= 40 && length <= 60) score += 0.15
    else if (length >= 30 && length <= 70) score += 0.1

    // Check for urgency
    const urgencyWords = ["now", "today", "immediately", "urgent", "breaking", "latest"]
    const hasUrgency = urgencyWords.some((word) => title.toLowerCase().includes(word))
    if (hasUrgency) score += 0.15

    return Math.min(1, score)
  }

  /**
   * Analyze hook strength
   */
  private analyzeHookStrength(hook: string): number {
    let score = 0

    // Check for immediate value promise
    if (hook.toLowerCase().includes("show you") || hook.toLowerCase().includes("teach you")) score += 0.2

    // Check for curiosity creation
    if (hook.includes("?") || hook.toLowerCase().includes("what if")) score += 0.2

    // Check for personal connection
    if (hook.toLowerCase().includes("you") || hook.toLowerCase().includes("your")) score += 0.15

    // Check for urgency
    if (hook.toLowerCase().includes("right now") || hook.toLowerCase().includes("immediately")) score += 0.15

    // Check for social proof
    if (hook.toLowerCase().includes("everyone") || hook.toLowerCase().includes("most people")) score += 0.1

    // Check for controversy
    if (hook.toLowerCase().includes("wrong") || hook.toLowerCase().includes("lie")) score += 0.2

    return Math.min(1, score)
  }

  /**
   * Additional helper methods for viral analysis
   */
  private analyzePsychologicalTriggers(triggers: string[]): number {
    const triggerWeights = {
      curiosity_gap: 0.2,
      fear_of_missing_out: 0.18,
      social_proof: 0.15,
      authority_bias: 0.12,
      scarcity_principle: 0.1,
      controversy: 0.25,
    }

    let score = 0
    triggers.forEach((trigger) => {
      score += triggerWeights[trigger] || 0.05
    })

    return Math.min(1, score)
  }

  private analyzeContentStructure(structure: any): number {
    // Analyze content structure for viral potential
    return 0.8 // Placeholder
  }

  private analyzeTrendAlignment(content: any, niche: string): number {
    // Analyze alignment with current trends
    return 0.7 // Placeholder
  }

  private async generateViralHookVariants(baseHook: string): Promise<string[]> {
    // Generate hook variants
    return []
  }

  private async generateViralThumbnailConcepts(title: string): Promise<string[]> {
    // Generate thumbnail concepts
    return []
  }

  private async generateRetentionHooks(structure: any): Promise<string[]> {
    // Generate retention hooks
    return []
  }

  private async generateEngagementTriggers(triggers: string[]): Promise<string[]> {
    // Generate engagement triggers
    return []
  }
}

export const viralContentEngine = new ViralContentEngine()
