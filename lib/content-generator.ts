import { OpenAI } from "openai"
import { logger } from "@/lib/logger"
import { rateLimit } from "@/lib/rate-limiter"
import { kv } from "@vercel/kv"
import { generateOptimizedStructure } from "@/lib/algorithm-optimizer"

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Types
type ContentParams = {
  title?: string
  niche: string
  keywords: string[]
  style: string
  length: string
  target_audience: "beginner" | "intermediate" | "advanced"
  monetization_focus: "ads" | "sponsors" | "affiliate" | "mixed"
  hook_type?: "question" | "controversy" | "curiosity" | "urgency" | "social_proof"
}

type GeneratedContent = {
  title: string
  script: string
  sections: {
    title: string
    content: string
    duration: number
    timestamp: number
  }[]
  hooks: {
    primary: string
    secondary: string[]
  }
  keywords: string[]
  metadata: {
    target_duration: number
    optimization_data: any
  }
}

/**
 * Generate optimized content for YouTube
 */
export async function generateContent(params: ContentParams): Promise<GeneratedContent> {
  // Apply rate limiting
  await rateLimit("content_generation", 2) // 2 requests per minute

  try {
    logger.info("Generating optimized content", { params })

    // 1. Get optimized content structure
    const optimizedStructure = await generateOptimizedStructure({
      niche: params.niche,
      target_duration: getTargetDuration(params.length),
      audience_type: params.target_audience,
      monetization_focus: params.monetization_focus,
    })

    // 2. Generate title if not provided
    const title = params.title || (await generateTitle(params, optimizedStructure))

    // 3. Generate script with optimized structure
    const script = await generateScript(title, params, optimizedStructure)

    // 4. Parse script into sections
    const sections = parseScriptIntoSections(script, optimizedStructure)

    // 5. Generate hooks
    const hooks = {
      primary: optimizedStructure.hooks[0]?.text || (await generatePrimaryHook(title, params)),
      secondary: optimizedStructure.hooks.slice(1).map((h) => h.text) || (await generateSecondaryHooks(title, params)),
    }

    // 6. Generate optimized keywords
    const keywords = await generateOptimizedKeywords(title, params.keywords, params.niche)

    // Return the complete content package
    return {
      title,
      script,
      sections,
      hooks,
      keywords,
      metadata: {
        target_duration: getTargetDuration(params.length),
        optimization_data: optimizedStructure,
      },
    }
  } catch (error) {
    logger.error("Content generation failed", { error })
    throw new Error(`Failed to generate content: ${error.message}`)
  }
}

/**
 * Generate an optimized title using AI
 */
async function generateTitle(params: ContentParams, optimizedStructure: any): Promise<string> {
  try {
    // Cache key for title generation
    const cacheKey = `title:${params.niche}:${params.keywords.join(",")}:${params.target_audience}`
    const cachedTitle = await kv.get(cacheKey)

    if (cachedTitle) {
      return cachedTitle as string
    }

    const prompt = `
Generate a high-CTR YouTube title for a faceless ${params.niche} video targeting ${params.target_audience} audience.
The title should be optimized for the YouTube algorithm and achieve high click-through rates.

Keywords: ${params.keywords.join(", ")}
Style: ${params.style}
Target audience: ${params.target_audience}

The title should:
1. Be between 40-60 characters
2. Include at least one of these keywords: ${params.keywords.slice(0, 3).join(", ")}
3. Create curiosity or promise clear value
4. Avoid clickbait but be compelling
5. Use one of these proven title structures:
   - How to [Achieve Result] Without [Common Method]
   - [Number] [Keyword] Secrets That Will [Benefit]
   - The Truth About [Keyword] That Nobody Tells You
   - Why [Common Belief] Is Wrong And What To Do Instead
   - [Keyword]: The Ultimate Guide for [Target Audience]

Return ONLY the title text with no quotes or additional text.
`

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert YouTube title optimizer that creates high-CTR titles." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 100,
    })

    const title =
      response.choices[0].message.content?.trim() ||
      `${params.keywords[0] || params.niche} - The Ultimate Guide for ${params.target_audience}`

    // Cache the result for 24 hours
    await kv.set(cacheKey, title, { ex: 86400 })

    return title
  } catch (error) {
    logger.error("Title generation failed", { error })
    return `${params.keywords[0] || params.niche} - The Ultimate Guide for ${params.target_audience}`
  }
}

/**
 * Generate an optimized script using AI
 */
async function generateScript(title: string, params: ContentParams, optimizedStructure: any): Promise<string> {
  try {
    // Prepare the retention points for the script
    const retentionPoints = optimizedStructure.retention_points
      .map(
        (point) =>
          `${Math.floor(point.timestamp / 60)}:${(point.timestamp % 60).toString().padStart(2, "0")} - ${point.engagement_type}: ${point.content}`,
      )
      .join("\n")

    // Prepare the monetization strategy
    const adPlacements = optimizedStructure.monetization.ad_placement
      .map((timestamp) => `${Math.floor(timestamp / 60)}:${(timestamp % 60).toString().padStart(2, "0")}`)
      .join(", ")

    const prompt = `
Generate a high-retention YouTube script for a faceless video with the title: "${title}"

AUDIENCE: ${params.target_audience} level viewers interested in ${params.niche}
STYLE: ${params.style}
LENGTH: ${getTargetDuration(params.length)} minutes
KEYWORDS: ${params.keywords.join(", ")}

RETENTION STRUCTURE:
${retentionPoints}

MONETIZATION:
- Ad placements at: ${adPlacements}
${optimizedStructure.monetization.sponsor_segments.length > 0 ? "- Include sponsor segments" : ""}
${optimizedStructure.monetization.affiliate_mentions.length > 0 ? "- Include affiliate product mentions" : ""}

SCRIPT REQUIREMENTS:
1. Start with a powerful hook that creates curiosity and promises value
2. Include pattern interrupts every 2-3 minutes to maintain attention
3. Use the "open loop" technique to keep viewers watching
4. Include timestamps and section headers in the format [SECTION NAME - 00:00]
5. End with a strong call-to-action
6. Optimize for 70%+ retention rate
7. Write in a conversational, engaging style
8. Include [VISUAL CUE] notes for b-roll/graphics suggestions
9. Include [RETENTION HOOK] elements at strategic points

Format the script with clear section headers and timestamps.
`

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert YouTube script writer specializing in high-retention faceless content.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    })

    return response.choices[0].message.content?.trim() || "Script generation failed. Please try again."
  } catch (error) {
    logger.error("Script generation failed", { error })
    throw new Error(`Failed to generate script: ${error.message}`)
  }
}

/**
 * Parse script into structured sections
 */
function parseScriptIntoSections(script: string, optimizedStructure: any): any[] {
  const sections = []
  let currentSection = null
  let currentContent = []
  let totalDuration = 0

  // Simple regex to find section headers with timestamps
  const sectionRegex = /\[([^\]]+)\s*-\s*(\d+):(\d+)\]/g
  let match

  // Split the script by lines
  const lines = script.split("\n")

  for (const line of lines) {
    // Check if this line contains a section header
    match = sectionRegex.exec(line)

    if (match) {
      // If we have a current section, save it
      if (currentSection) {
        const sectionDuration = estimateSectionDuration(currentContent.join("\n"))
        sections.push({
          title: currentSection,
          content: currentContent.join("\n"),
          duration: sectionDuration,
          timestamp: totalDuration,
        })
        totalDuration += sectionDuration
      }

      // Start a new section
      currentSection = match[1].trim()
      currentContent = [line]
      sectionRegex.lastIndex = 0 // Reset regex for next iteration
    } else if (currentSection) {
      // Add to current section
      currentContent.push(line)
    } else {
      // Before first section, create an intro section
      currentSection = "Introduction"
      currentContent = [line]
    }
  }

  // Add the last section
  if (currentSection) {
    const sectionDuration = estimateSectionDuration(currentContent.join("\n"))
    sections.push({
      title: currentSection,
      content: currentContent.join("\n"),
      duration: sectionDuration,
      timestamp: totalDuration,
    })
  }

  return sections
}

/**
 * Estimate section duration based on word count
 */
function estimateSectionDuration(text: string): number {
  // Average speaking rate is about 150 words per minute
  const wordCount = text.split(/\s+/).length
  return Math.ceil(wordCount / 150) * 60 // Duration in seconds
}

/**
 * Generate primary hook
 */
async function generatePrimaryHook(title: string, params: ContentParams): Promise<string> {
  try {
    const prompt = `
Generate a powerful opening hook for a YouTube video titled "${title}".
The hook should be 15-25 seconds long, create curiosity, and make a strong promise.
Hook type: ${params.hook_type || "curiosity"}
Target audience: ${params.target_audience}
Niche: ${params.niche}

Return ONLY the hook text with no quotes or additional text.
`

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert at creating high-retention YouTube hooks." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 200,
    })

    return (
      response.choices[0].message.content?.trim() ||
      `Have you ever wondered what would happen if ${params.keywords[0]}? In this video, I'll show you exactly how to master this technique in just a few minutes.`
    )
  } catch (error) {
    logger.error("Hook generation failed", { error })
    return `Have you ever wondered what would happen if ${params.keywords[0]}? In this video, I'll show you exactly how to master this technique in just a few minutes.`
  }
}

/**
 * Generate secondary hooks for pattern interrupts
 */
async function generateSecondaryHooks(title: string, params: ContentParams): Promise<string[]> {
  try {
    const prompt = `
Generate 3 pattern interrupt hooks for a YouTube video titled "${title}".
These hooks should be placed throughout the video to boost retention at key moments.
Each hook should be 1-2 sentences that create curiosity and keep viewers watching.
Target audience: ${params.target_audience}
Niche: ${params.niche}

Return ONLY the 3 hooks, one per line, with no quotes or additional text.
`

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert at creating high-retention YouTube pattern interrupts." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 300,
    })

    const hooks = response.choices[0].message.content?.trim().split("\n") || [
      "But wait - what I'm about to show you next completely changed how I approach this problem.",
      "This next technique is something that 99% of people get wrong, and it's costing them big time.",
      "Pay close attention to this part, because this is where most tutorials miss the critical step.",
    ]

    return hooks
  } catch (error) {
    logger.error("Secondary hooks generation failed", { error })
    return [
      "But wait - what I'm about to show you next completely changed how I approach this problem.",
      "This next technique is something that 99% of people get wrong, and it's costing them big time.",
      "Pay close attention to this part, because this is where most tutorials miss the critical step.",
    ]
  }
}

/**
 * Generate optimized keywords for SEO
 */
async function generateOptimizedKeywords(title: string, baseKeywords: string[], niche: string): Promise<string[]> {
  try {
    const prompt = `
Generate 10 optimized YouTube SEO keywords/tags for a video titled "${title}" in the ${niche} niche.
Include a mix of:
- Primary keywords (exact match to search terms)
- Secondary keywords (related terms)
- Long-tail keywords (specific phrases)

The keywords should help with YouTube search ranking and suggested videos.
Base keywords to include: ${baseKeywords.join(", ")}

Return ONLY the keywords as a comma-separated list with no quotes or additional text.
`

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert YouTube SEO specialist." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 300,
    })

    const keywordsText = response.choices[0].message.content?.trim() || baseKeywords.join(", ")
    const keywords = keywordsText.split(",").map((k) => k.trim())

    // Ensure we have the base keywords
    const allKeywords = [...new Set([...baseKeywords, ...keywords])]

    return allKeywords.slice(0, 15) // YouTube allows max 15 tags
  } catch (error) {
    logger.error("Keywords generation failed", { error })
    return baseKeywords
  }
}

/**
 * Get target duration in minutes based on length parameter
 */
function getTargetDuration(length: string): number {
  switch (length) {
    case "short":
      return 5
    case "medium":
      return 10
    case "long":
      return 15
    default:
      return 10
  }
}
