import { exec } from "child_process"
import { promisify } from "util"
import * as fs from "fs"
import * as path from "path"
import { logger } from "@/lib/logger"
import { rateLimit } from "@/lib/rate-limiter"
import axios from "axios"

const execAsync = promisify(exec)

// Types
type VideoParams = {
  script: string
  sections: {
    title: string
    content: string
    duration: number
    timestamp: number
  }[]
  voiceType: string
  style: string
  outputPath: string
  tempDir: string
}

type ThumbnailParams = {
  title: string
  style: string
  outputPath: string
}

/**
 * Generate complete video from script
 */
export async function generateVideo(params: VideoParams): Promise<string> {
  const { script, sections, voiceType, style, outputPath, tempDir } = params

  try {
    logger.info("Starting video generation", { outputPath, sections: sections.length })

    // 1. Create temp directory if it doesn't exist
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }

    // 2. Generate voice over for each section
    const audioFiles = await generateVoiceOvers(sections, voiceType, tempDir)

    // 3. Generate visuals for each section
    const visualFiles = await generateVisuals(sections, style, tempDir)

    // 4. Combine audio and visuals
    const videoPath = await combineAudioAndVisuals(audioFiles, visualFiles, outputPath)

    logger.info("Video generation completed", { videoPath })

    return videoPath
  } catch (error) {
    logger.error("Video generation failed", { error })
    throw new Error(`Failed to generate video: ${error.message}`)
  }
}

/**
 * Generate voice overs for each section
 */
async function generateVoiceOvers(sections: any[], voiceType: string, tempDir: string): Promise<string[]> {
  logger.info("Generating voice overs", { sections: sections.length })

  const audioFiles = []

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]
    const outputFile = path.join(tempDir, `section_${i}_audio.mp3`)

    // Apply rate limiting
    await rateLimit("voice_generation", 5) // 5 requests per minute

    try {
      // Use ElevenLabs API for voice generation
      const apiKey = process.env.ELEVENLABS_API_KEY
      const voiceId = getVoiceId(voiceType)

      const response = await axios({
        method: "post",
        url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        data: {
          text: cleanScriptForTTS(section.content),
          model_id: "eleven_turbo_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        },
        responseType: "arraybuffer",
      })

      fs.writeFileSync(outputFile, response.data)
      audioFiles.push(outputFile)

      logger.info(`Generated voice over for section ${i + 1}`, { outputFile })
    } catch (error) {
      logger.error(`Failed to generate voice over for section ${i + 1}`, { error })
      throw error
    }
  }

  return audioFiles
}

/**
 * Generate visuals for each section
 */
async function generateVisuals(sections: any[], style: string, tempDir: string): Promise<string[]> {
  logger.info("Generating visuals", { sections: sections.length })

  const visualFiles = []

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]
    const outputFile = path.join(tempDir, `section_${i}_visual.mp4`)

    // Apply rate limiting
    await rateLimit("visuals_generation", 2) // 2 requests per minute

    try {
      // Extract visual cues from the script
      const visualCues = extractVisualCues(section.content)

      // Generate visuals based on the style and visual cues
      if (style === "screen_recording") {
        // For screen recording style, use stock footage
        await generateScreenRecordingVisual(visualCues, section.duration, outputFile)
      } else if (style === "animation") {
        // For animation style, generate animated visuals
        await generateAnimatedVisual(visualCues, section.duration, outputFile)
      } else {
        // Default to slideshow style
        await generateSlideshowVisual(visualCues, section.duration, outputFile)
      }

      visualFiles.push(outputFile)
      logger.info(`Generated visuals for section ${i + 1}`, { outputFile })
    } catch (error) {
      logger.error(`Failed to generate visuals for section ${i + 1}`, { error })
      throw error
    }
  }

  return visualFiles
}

/**
 * Combine audio and visuals into final video
 */
async function combineAudioAndVisuals(
  audioFiles: string[],
  visualFiles: string[],
  outputPath: string,
): Promise<string> {
  logger.info("Combining audio and visuals", { audioFiles: audioFiles.length, visualFiles: visualFiles.length })

  try {
    // Create a temporary file list for FFmpeg
    const fileListPath = path.join(path.dirname(outputPath), "filelist.txt")
    let fileListContent = ""

    // Create individual segment files
    const segmentFiles = []
    for (let i = 0; i < audioFiles.length; i++) {
      const segmentOutput = path.join(path.dirname(outputPath), `segment_${i}.mp4`)

      // Combine audio and visual for this segment
      await execAsync(
        `ffmpeg -i "${visualFiles[i]}" -i "${audioFiles[i]}" -c:v libx264 -c:a aac -shortest "${segmentOutput}"`,
      )

      fileListContent += `file '${segmentOutput.replace(/'/g, "\\'")}'\n`
      segmentFiles.push(segmentOutput)
    }

    // Write the file list
    fs.writeFileSync(fileListPath, fileListContent)

    // Concatenate all segments
    await execAsync(`ffmpeg -f concat -safe 0 -i "${fileListPath}" -c copy "${outputPath}"`)

    // Clean up temporary files
    segmentFiles.forEach((file) => fs.unlinkSync(file))
    fs.unlinkSync(fileListPath)

    logger.info("Video combination completed", { outputPath })
    return outputPath
  } catch (error) {
    logger.error("Failed to combine audio and visuals", { error })
    throw error
  }
}

/**
 * Generate thumbnail for the video
 */
export async function generateThumbnail(params: ThumbnailParams): Promise<string> {
  const { title, style, outputPath } = params

  try {
    logger.info("Generating thumbnail", { title, style, outputPath })

    // Apply rate limiting
    await rateLimit("thumbnail_generation", 5) // 5 requests per minute

    // Use DALL-E 3 to generate the thumbnail
    const openai = new (require("openai").OpenAI)({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const prompt = `
Create a YouTube thumbnail for a video titled "${title}".
Style: ${style}

The thumbnail should:
1. Have high contrast and be eye-catching
2. Include bold, easy-to-read text (max 3-4 words)
3. Use emotion-triggering imagery
4. Have a clean, professional look
5. Be optimized for both mobile and desktop viewing

Do not include any watermarks or logos.
`

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1792x1024",
      quality: "hd",
      response_format: "url",
    })

    const imageUrl = response.data[0].url

    // Download the image
    const imageResponse = await axios({
      method: "get",
      url: imageUrl,
      responseType: "arraybuffer",
    })

    fs.writeFileSync(outputPath, imageResponse.data)

    logger.info("Thumbnail generation completed", { outputPath })
    return outputPath
  } catch (error) {
    logger.error("Thumbnail generation failed", { error })
    throw new Error(`Failed to generate thumbnail: ${error.message}`)
  }
}

/**
 * Helper functions
 */

function getVoiceId(voiceType: string): string {
  // ElevenLabs voice IDs
  const voices = {
    male_professional: "29vD33N1CtxCmqQRPOHJ", // Adam
    female_professional: "jsCqWAovK2LkecY7zXl4", // Rachel
    male_casual: "5Q0t7uMcjvnagumLfvZi", // Daniel
    female_casual: "oWAxZDx7w5VEj9dCyTzz", // Grace
    male_authoritative: "SOYHLrjzK2X1ezoPC6cr", // Marcus
    female_authoritative: "z9fAnlkpzviPz146aGWa", // Scarlett
  }

  return voices[voiceType] || voices.male_professional
}

function cleanScriptForTTS(script: string): string {
  // Remove visual cues and other non-spoken elements
  return script
    .replace(/\[VISUAL CUE:.*?\]/gi, "")
    .replace(/\[RETENTION HOOK\]/gi, "")
    .replace(/\[.*?\]/g, "")
    .replace(/$$.*?$$/g, "")
    .trim()
}

function extractVisualCues(content: string): string[] {
  const visualCues = []
  const regex = /\[VISUAL CUE:([^\]]+)\]/gi
  let match

  while ((match = regex.exec(content)) !== null) {
    visualCues.push(match[1].trim())
  }

  // If no explicit visual cues, extract key phrases
  if (visualCues.length === 0) {
    const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0)
    for (const sentence of sentences) {
      if (sentence.length > 20 && sentence.length < 100) {
        visualCues.push(sentence.trim())
      }
    }
  }

  return visualCues.slice(0, 5) // Limit to 5 visual cues
}

async function generateScreenRecordingVisual(visualCues: string[], duration: number, outputFile: string) {
  // In a real implementation, this would use stock footage based on the visual cues
  // For this example, we'll create a simple colored background with text

  const textFile = outputFile.replace(".mp4", ".txt")
  fs.writeFileSync(textFile, visualCues.join("\n"))

  await execAsync(
    `ffmpeg -f lavfi -i color=c=blue:s=1920x1080:d=${duration} -vf "drawtext=fontfile=/path/to/font.ttf:fontsize=60:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2:textfile='${textFile}'" -c:v libx264 -t ${duration} "${outputFile}"`,
  )

  fs.unlinkSync(textFile)
}

async function generateAnimatedVisual(visualCues: string[], duration: number, outputFile: string) {
  // In a real implementation, this would generate animated visuals
  // For this example, we'll create a simple animation

  await execAsync(
    `ffmpeg -f lavfi -i "nullsrc=s=1920x1080:d=${duration},geq=r='128+128*sin(2*PI*t)':g='128+128*sin(2*PI*t/3)':b='128+128*sin(2*PI*t/5)'" -c:v libx264 -t ${duration} "${outputFile}"`,
  )
}

async function generateSlideshowVisual(visualCues: string[], duration: number, outputFile: string) {
  // In a real implementation, this would generate a slideshow based on the visual cues
  // For this example, we'll create a simple slideshow effect

  const textFile = outputFile.replace(".mp4", ".txt")
  fs.writeFileSync(textFile, visualCues.join("\n"))

  const slideDuration = duration / Math.max(1, visualCues.length)

  await execAsync(
    `ffmpeg -f lavfi -i color=c=black:s=1920x1080:d=${duration} -vf "drawtext=fontfile=/path/to/font.ttf:fontsize=60:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2:textfile='${textFile}':reload=1:d=${slideDuration}" -c:v libx264 -t ${duration} "${outputFile}"`,
  )

  fs.unlinkSync(textFile)
}
