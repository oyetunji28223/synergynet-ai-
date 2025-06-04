import { logger } from "@/lib/logger"
import { kv } from "@vercel/kv"
import { generateContent } from "@/lib/content-generator"
import { generateVideo, generateThumbnail } from "@/lib/video-generator"
import { uploadToYouTube } from "@/lib/youtube-api"
import { analyzeVideoPerformance } from "@/lib/analytics-optimizer"

// Daily content configuration
const DAILY_CONTENT_CONFIG = {
  long_form: {
    target_duration: 12, // minutes
    posting_time: "15:00", // 3 PM UTC
    niches: ["cybersecurity", "development", "networking", "hacking", "crypto"],
    styles: ["educational", "tutorial", "analysis", "news"],
    monetization_focus: "mixed",
  },
  short_form: {
    target_duration: 1, // minute
    posting_time: "18:00", // 6 PM UTC
    count_per_day: 3, // 3 shorts per day
    posting_interval: 2, // hours between shorts
    styles: ["quick_tip", "highlight", "teaser", "viral"],
    monetization_focus: "ads",
  },
  channels: [
    {
      id: "cybersec_channel",
      name: "CyberSec",
      niche: "cybersecurity",
      audience: "intermediate",
      long_form_days: ["monday", "wednesday", "friday"],
      short_form_daily: true,
    },
    {
      id: "devhacks_channel",
      name: "DevHacks",
      niche: "development",
      audience: "beginner",
      long_form_days: ["tuesday", "thursday", "saturday"],
      short_form_daily: true,
    },
    {
      id: "netsec_channel",
      name: "NetSec",
      niche: "networking",
      audience: "advanced",
      long_form_days: ["monday", "thursday", "sunday"],
      short_form_daily: true,
    },
    {
      id: "codebreak_channel",
      name: "CodeBreak",
      niche: "hacking",
      audience: "intermediate",
      long_form_days: ["tuesday", "friday", "sunday"],
      short_form_daily: true,
    },
    {
      id: "hacklab_channel",
      name: "HackLab",
      niche: "crypto",
      audience: "advanced",
      long_form_days: ["wednesday", "saturday", "sunday"],
      short_form_daily: true,
    },
  ],
}

/**
 * Main daily content generation and posting workflow
 */
export async function runDailyContentWorkflow(): Promise<void> {
  try {
    logger.info("Starting daily content workflow")

    const today = new Date()
    const dayOfWeek = today.toLocaleDateString("en-US", { weekday: "lowercase" })
    const currentHour = today.getUTCHours()

    // Check if it's time for long-form content
    if (shouldPostLongForm(currentHour)) {
      await generateAndPostLongFormContent(dayOfWeek)
    }

    // Check if it's time for short-form content
    if (shouldPostShortForm(currentHour)) {
      await generateAndPostShortFormContent()
    }

    // Run performance analysis on recent videos
    await analyzeRecentPerformance()

    logger.info("Daily content workflow completed successfully")
  } catch (error) {
    logger.error("Daily content workflow failed", { error })
    throw error
  }
}

/**
 * Generate and post long-form content for scheduled channels
 */
async function generateAndPostLongFormContent(dayOfWeek: string): Promise<void> {
  logger.info("Generating long-form content", { dayOfWeek })

  // Get channels scheduled for long-form content today
  const scheduledChannels = DAILY_CONTENT_CONFIG.channels.filter((channel) =>
    channel.long_form_days.includes(dayOfWeek),
  )

  for (const channel of scheduledChannels) {
    try {
      logger.info(`Generating long-form content for ${channel.name}`)

      // Generate trending topic for the channel
      const topic = await generateTrendingTopic(channel.niche, "long_form")

      // Generate optimized content
      const content = await generateContent({
        title: topic.title,
        niche: channel.niche,
        keywords: topic.keywords,
        style: getRandomStyle(DAILY_CONTENT_CONFIG.long_form.styles),
        length: "long",
        target_audience: channel.audience,
        monetization_focus: DAILY_CONTENT_CONFIG.long_form.monetization_focus,
      })

      // Generate video
      const videoPath = await generateVideo({
        script: content.script,
        sections: content.sections,
        voiceType: getVoiceForChannel(channel.id),
        style: "professional",
        outputPath: `/tmp/long_${channel.id}_${Date.now()}.mp4`,
        tempDir: `/tmp/long_${channel.id}_temp`,
      })

      // Generate thumbnail
      const thumbnailPath = await generateThumbnail({
        title: content.title,
        style: "high_impact",
        outputPath: `/tmp/thumb_${channel.id}_${Date.now()}.jpg`,
      })

      // Upload to YouTube
      const youtubeUrl = await uploadToYouTube({
        videoFilePath: videoPath,
        title: content.title,
        description: generateDescription(content, channel),
        tags: content.keywords,
        thumbnailFilePath: thumbnailPath,
        channelId: channel.id,
        privacyStatus: "public",
      })

      // Save to database for tracking
      await saveVideoRecord({
        channelId: channel.id,
        title: content.title,
        youtubeUrl,
        type: "long_form",
        publishedAt: new Date().toISOString(),
        optimizationData: content.metadata.optimization_data,
      })

      logger.info(`Long-form video published for ${channel.name}`, { youtubeUrl })

      // Clean up temporary files
      await cleanupFiles([videoPath, thumbnailPath])
    } catch (error) {
      logger.error(`Failed to generate long-form content for ${channel.name}`, { error })
      // Continue with other channels even if one fails
    }
  }
}

/**
 * Generate and post short-form content for all channels
 */
async function generateAndPostShortFormContent(): Promise<void> {
  logger.info("Generating short-form content")

  // Get all channels that post shorts daily
  const shortChannels = DAILY_CONTENT_CONFIG.channels.filter((channel) => channel.short_form_daily)

  for (const channel of shortChannels) {
    try {
      // Generate multiple shorts for the day
      const shortsToGenerate = Math.ceil(DAILY_CONTENT_CONFIG.short_form.count_per_day / shortChannels.length)

      for (let i = 0; i < shortsToGenerate; i++) {
        logger.info(`Generating short #${i + 1} for ${channel.name}`)

        // Generate trending topic for shorts
        const topic = await generateTrendingTopic(channel.niche, "short_form")

        // Generate short-form content
        const content = await generateShortFormContent({
          title: topic.title,
          niche: channel.niche,
          keywords: topic.keywords,
          style: getRandomStyle(DAILY_CONTENT_CONFIG.short_form.styles),
          target_audience: channel.audience,
          hook_type: getRandomHookType(),
        })

        // Generate short video (60 seconds max)
        const videoPath = await generateShortVideo({
          script: content.script,
          hook: content.hook,
          voiceType: getVoiceForChannel(channel.id),
          style: "dynamic",
          outputPath: `/tmp/short_${channel.id}_${Date.now()}_${i}.mp4`,
          tempDir: `/tmp/short_${channel.id}_temp_${i}`,
        })

        // Generate vertical thumbnail for shorts
        const thumbnailPath = await generateShortThumbnail({
          title: content.title,
          style: "viral",
          outputPath: `/tmp/short_thumb_${channel.id}_${Date.now()}_${i}.jpg`,
        })

        // Upload as YouTube Short
        const youtubeUrl = await uploadToYouTube({
          videoFilePath: videoPath,
          title: content.title + " #Shorts",
          description: generateShortDescription(content, channel),
          tags: [...content.keywords, "shorts", "viral", channel.niche],
          thumbnailFilePath: thumbnailPath,
          channelId: channel.id,
          privacyStatus: "public",
        })

        // Save to database
        await saveVideoRecord({
          channelId: channel.id,
          title: content.title,
          youtubeUrl,
          type: "short_form",
          publishedAt: new Date().toISOString(),
          optimizationData: content.metadata,
        })

        logger.info(`Short video published for ${channel.name}`, { youtubeUrl })

        // Clean up
        await cleanupFiles([videoPath, thumbnailPath])

        // Wait between shorts to avoid rate limiting
        if (i < shortsToGenerate - 1) {
          await new Promise((resolve) => setTimeout(resolve, 30000)) // 30 second delay
        }
      }
    } catch (error) {
      logger.error(`Failed to generate short-form content for ${channel.name}`, { error })
    }
  }
}

/**
 * Generate trending topics based on niche and content type
 */
async function generateTrendingTopic(
  niche: string,
  contentType: "long_form" | "short_form",
): Promise<{
  title: string
  keywords: string[]
  trend_score: number
}> {
  try {
    // Check cache for recent trending topics
    const cacheKey = `trending:${niche}:${contentType}:${new Date().toDateString()}`
    const cachedTopic = await kv.get(cacheKey)

    if (cachedTopic) {
      return cachedTopic as any
    }

    // Use OpenAI to generate trending topics
    const openai = new (require("openai").OpenAI)({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const prompt = `
Generate a trending ${contentType} video topic for ${niche} that would perform well on YouTube today.

Consider:
- Current tech trends and news
- Seasonal relevance
- High search volume keywords
- Viral potential
- Educational value

For ${contentType === "long_form" ? "12-15 minute educational content" : "60-second viral content"}

Return in this exact JSON format:
{
  "title": "Compelling title with high CTR potential",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "trend_score": 0.85
}
`

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a YouTube trend analyst and content strategist." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 300,
    })

    const topicData = JSON.parse(response.choices[0].message.content?.trim() || "{}")

    // Fallback if parsing fails
    const topic = {
      title: topicData.title || `${niche} Secrets That Will Blow Your Mind`,
      keywords: topicData.keywords || [niche, "tutorial", "guide", "tips", "secrets"],
      trend_score: topicData.trend_score || 0.7,
    }

    // Cache for 6 hours
    await kv.set(cacheKey, topic, { ex: 21600 })

    return topic
  } catch (error) {
    logger.error("Failed to generate trending topic", { niche, contentType, error })

    // Fallback topics
    const fallbackTopics = {
      cybersecurity: {
        long_form: "10 Zero-Day Exploits That Will Shock You",
        short_form: "This Hack Will Blow Your Mind",
      },
      development: {
        long_form: "Coding Mistakes That Cost Developers Their Jobs",
        short_form: "Code Like a Pro in 60 Seconds",
      },
      networking: {
        long_form: "Network Security Flaws Everyone Ignores",
        short_form: "Secure Your Network in 1 Minute",
      },
      hacking: {
        long_form: "Ethical Hacking Techniques They Don't Teach",
        short_form: "Hack Any System (Legally)",
      },
      crypto: {
        long_form: "Cryptocurrency Vulnerabilities Exposed",
        short_form: "Crypto Secret Revealed",
      },
    }

    return {
      title: fallbackTopics[niche]?.[contentType] || `${niche} Ultimate Guide`,
      keywords: [niche, "tutorial", "guide", "tips", "secrets"],
      trend_score: 0.6,
    }
  }
}

/**
 * Generate short-form content optimized for YouTube Shorts
 */
async function generateShortFormContent(params: {
  title: string
  niche: string
  keywords: string[]
  style: string
  target_audience: string
  hook_type: string
}): Promise<{
  title: string
  script: string
  hook: string
  metadata: any
}> {
  try {
    const openai = new (require("openai").OpenAI)({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const prompt = `
Generate a high-engagement YouTube Short script for: "${params.title}"

REQUIREMENTS:
- 60 seconds maximum duration
- Hook in first 3 seconds
- Fast-paced, attention-grabbing
- Vertical video format optimized
- Include visual cues for editing
- End with strong CTA

NICHE: ${params.niche}
STYLE: ${params.style}
AUDIENCE: ${params.target_audience}
HOOK TYPE: ${params.hook_type}
KEYWORDS: ${params.keywords.join(", ")}

Format:
[HOOK - 0:00-0:03]
[MAIN CONTENT - 0:03-0:50]
[CTA - 0:50-0:60]

Include [VISUAL] cues for dynamic editing.
`

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert YouTube Shorts script writer specializing in viral content." },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 800,
    })

    const script = response.choices[0].message.content?.trim() || "Script generation failed"

    // Extract hook from script
    const hookMatch = script.match(/\[HOOK[^\]]*\](.*?)(?=\[|$)/s)
    const hook = hookMatch?.[1]?.trim() || "Did you know this secret technique?"

    return {
      title: params.title,
      script,
      hook,
      metadata: {
        target_duration: 60,
        style: params.style,
        hook_type: params.hook_type,
      },
    }
  } catch (error) {
    logger.error("Short-form content generation failed", { error })
    throw error
  }
}

/**
 * Generate short video optimized for vertical format
 */
async function generateShortVideo(params: {
  script: string
  hook: string
  voiceType: string
  style: string
  outputPath: string
  tempDir: string
}): Promise<string> {
  try {
    const { outputPath } = params
    logger.info("Generating short video", { outputPath })

    // Create temp directory
    if (!require("fs").existsSync(params.tempDir)) {
      require("fs").mkdirSync(params.tempDir, { recursive: true })
    }

    // Generate voice over (faster pace for shorts)
    const audioPath = await generateShortVoiceOver(params.script, params.voiceType, params.tempDir)

    // Generate dynamic visuals for shorts
    const visualPath = await generateShortVisuals(params.script, params.style, params.tempDir)

    // Combine with vertical aspect ratio (9:16)
    const { exec } = require("child_process")
    const { promisify } = require("util")
    const execAsync = promisify(exec)

    await execAsync(`
      ffmpeg -i "${visualPath}" -i "${audioPath}" \
      -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" \
      -c:v libx264 -c:a aac -shortest -t 60 "${params.outputPath}"
    `)

    return params.outputPath
  } catch (error) {
    logger.error("Short video generation failed", { error })
    throw error
  }
}

/**
 * Generate thumbnail optimized for YouTube Shorts
 */
async function generateShortThumbnail(params: {
  title: string
  style: string
  outputPath: string
}): Promise<string> {
  try {
    const openai = new (require("openai").OpenAI)({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const prompt = `
Create a YouTube Shorts thumbnail for "${params.title}".
Style: ${params.style}

REQUIREMENTS:
- Vertical 9:16 aspect ratio
- Bold, large text (max 3 words)
- High contrast colors
- Eye-catching imagery
- Mobile-optimized
- Viral appeal

No watermarks or logos.
`

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1792", // Vertical format
      quality: "hd",
    })

    // Download and save thumbnail
    const axios = require("axios")
    const fs = require("fs")

    const imageResponse = await axios({
      method: "get",
      url: response.data[0].url,
      responseType: "arraybuffer",
    })

    fs.writeFileSync(params.outputPath, imageResponse.data)

    return params.outputPath
  } catch (error) {
    logger.error("Short thumbnail generation failed", { error })
    throw error
  }
}

/**
 * Analyze recent video performance and adjust strategy
 */
async function analyzeRecentPerformance(): Promise<void> {
  try {
    logger.info("Analyzing recent video performance")

    // Get videos from the last 7 days
    const recentVideos = await getRecentVideos(7)

    for (const video of recentVideos) {
      try {
        const analysis = await analyzeVideoPerformance(video.videoId)

        // Store performance insights
        await kv.set(
          `performance:${video.videoId}`,
          {
            analysis,
            analyzedAt: new Date().toISOString(),
          },
          { ex: 604800 },
        ) // 7 days

        // Update channel strategy based on performance
        await updateChannelStrategy(video.channelId, analysis)
      } catch (error) {
        logger.error(`Failed to analyze video ${video.videoId}`, { error })
      }
    }

    // Generate daily performance report
    await generateDailyReport(recentVideos)
  } catch (error) {
    logger.error("Performance analysis failed", { error })
  }
}

/**
 * Helper functions
 */

function shouldPostLongForm(currentHour: number): boolean {
  const targetHour = Number.parseInt(DAILY_CONTENT_CONFIG.long_form.posting_time.split(":")[0])
  return currentHour === targetHour
}

function shouldPostShortForm(currentHour: number): boolean {
  const targetHour = Number.parseInt(DAILY_CONTENT_CONFIG.short_form.posting_time.split(":")[0])
  const interval = DAILY_CONTENT_CONFIG.short_form.posting_interval

  // Post shorts at target time and every interval hours after
  return currentHour === targetHour || (currentHour > targetHour && (currentHour - targetHour) % interval === 0)
}

function getRandomStyle(styles: string[]): string {
  return styles[Math.floor(Math.random() * styles.length)]
}

function getRandomHookType(): string {
  const hookTypes = ["question", "controversy", "curiosity", "urgency", "social_proof"]
  return hookTypes[Math.floor(Math.random() * hookTypes.length)]
}

function getVoiceForChannel(channelId: string): string {
  const voiceMap = {
    cybersec_channel: "male_authoritative",
    devhacks_channel: "male_professional",
    netsec_channel: "female_professional",
    codebreak_channel: "male_casual",
    hacklab_channel: "female_authoritative",
  }
  return voiceMap[channelId] || "male_professional"
}

function generateDescription(content: any, channel: any): string {
  return `
${content.script.substring(0, 200)}...

🔔 Subscribe for daily ${channel.niche} content!
👍 Like if this helped you!
💬 Comment your thoughts below!

Keywords: ${content.keywords.join(", ")}

#${channel.niche} #tutorial #tech #education
`
}

function generateShortDescription(content: any, channel: any): string {
  return `
${content.hook}

Follow for daily ${channel.niche} tips! 🚀

#Shorts #${channel.niche} #viral #tech
`
}

async function saveVideoRecord(record: any): Promise<void> {
  const key = `video:${record.channelId}:${Date.now()}`
  await kv.set(key, record, { ex: 2592000 }) // 30 days
}

async function cleanupFiles(filePaths: string[]): Promise<void> {
  const fs = require("fs")
  for (const filePath of filePaths) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    } catch (error) {
      logger.warn(`Failed to cleanup file ${filePath}`, { error })
    }
  }
}

async function getRecentVideos(days: number): Promise<any[]> {
  // Implementation would fetch from your database
  // For now, return mock data
  return []
}

async function updateChannelStrategy(channelId: string, analysis: any): Promise<void> {
  // Update posting strategy based on performance
  const strategy = {
    channelId,
    updatedAt: new Date().toISOString(),
    recommendations: analysis.recommendations,
    optimizationScore: analysis.optimizationScore,
  }

  await kv.set(`strategy:${channelId}`, strategy, { ex: 604800 })
}

async function generateDailyReport(videos: any[]): Promise<void> {
  const report = {
    date: new Date().toISOString().split("T")[0],
    videosAnalyzed: videos.length,
    averagePerformance: videos.reduce((sum, v) => sum + (v.optimizationScore || 0), 0) / videos.length,
    topPerformers: videos.sort((a, b) => (b.optimizationScore || 0) - (a.optimizationScore || 0)).slice(0, 3),
    generatedAt: new Date().toISOString(),
  }

  await kv.set(`daily_report:${report.date}`, report, { ex: 2592000 })
  logger.info("Daily report generated", { report })
}

// Additional helper functions for short video generation
async function generateShortVoiceOver(script: string, voiceType: string, tempDir: string): Promise<string> {
  // Implementation similar to regular voice over but with faster pace
  const outputPath = require("path").join(tempDir, "short_audio.mp3")

  // Use ElevenLabs with faster speaking rate
  const axios = require("axios")
  const fs = require("fs")

  const response = await axios({
    method: "post",
    url: `https://api.elevenlabs.io/v1/text-to-speech/${getVoiceId(voiceType)}`,
    headers: {
      Accept: "audio/mpeg",
      "Content-Type": "application/json",
      "xi-api-key": process.env.ELEVENLABS_API_KEY,
    },
    data: {
      text: cleanScriptForTTS(script),
      model_id: "eleven_turbo_v2",
      voice_settings: {
        stability: 0.4,
        similarity_boost: 0.8,
        speed: 1.2, // Faster for shorts
      },
    },
    responseType: "arraybuffer",
  })

  fs.writeFileSync(outputPath, response.data)
  return outputPath
}

async function generateShortVisuals(script: string, style: string, tempDir: string): Promise<string> {
  // Generate fast-paced visuals for shorts
  const outputPath = require("path").join(tempDir, "short_visual.mp4")
  const { exec } = require("child_process")
  const { promisify } = require("util")
  const execAsync = promisify(exec)

  // Create dynamic, fast-paced visuals
  await execAsync(`
    ffmpeg -f lavfi -i "nullsrc=s=1080:1920:d=60,geq=r='128+128*sin(2*PI*t*2)':g='128+128*sin(2*PI*t*3)':b='128+128*sin(2*PI*t*5)'" \
    -vf "drawtext=fontsize=80:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2:text='${style.toUpperCase()}':enable='between(t,0,60)'" \
    -c:v libx264 -t 60 "${outputPath}"
  `)

  return outputPath
}

function getVoiceId(voiceType: string): string {
  const voices = {
    male_professional: "29vD33N1CtxCmqQRPOHJ",
    female_professional: "jsCqWAovK2LkecY7zXl4",
    male_casual: "5Q0t7uMcjvnagumLfvZi",
    female_casual: "oWAxZDx7w5VEj9dCyTzz",
    male_authoritative: "SOYHLrjzK2X1ezoPC6cr",
    female_authoritative: "z9fAnlkpzviPz146aGWa",
  }
  return voices[voiceType] || voices.male_professional
}

function cleanScriptForTTS(script: string): string {
  return script
    .replace(/\[VISUAL.*?\]/gi, "")
    .replace(/\[HOOK.*?\]/gi, "")
    .replace(/\[.*?\]/g, "")
    .replace(/\d+:\d+/g, "")
    .trim()
}
