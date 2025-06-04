import { logger } from "@/lib/logger"
import { generateOptimizedStructure } from "@/lib/algorithm-optimizer"

type ScriptSection = {
  title: string
  content: string
  duration: number
  retention_techniques: string[]
  engagement_elements: string[]
  visual_cues: string[]
}

/**
 * Generate algorithm-optimized script for faceless content
 */
export async function generateAdvancedScript(params: {
  title: string
  niche: string
  target_duration: number
  audience_type: "beginner" | "intermediate" | "advanced"
  monetization_focus: "ads" | "sponsors" | "affiliate" | "mixed"
  keywords: string[]
}): Promise<{
  script: ScriptSection[]
  optimization_data: any
  performance_predictions: any
}> {
  const { title, niche, target_duration, audience_type, monetization_focus, keywords } = params

  logger.info("Generating advanced script", { title, niche, target_duration })

  // Get optimized structure
  const optimization = await generateOptimizedStructure({
    niche,
    target_duration,
    audience_type,
    monetization_focus,
  })

  // Generate script sections
  const script = await generateScriptSections(title, optimization, keywords, niche)

  // Predict performance metrics
  const performance_predictions = predictPerformance(script, optimization, niche)

  return {
    script,
    optimization_data: optimization,
    performance_predictions,
  }
}

/**
 * Generate individual script sections with retention optimization
 */
async function generateScriptSections(
  title: string,
  optimization: any,
  keywords: string[],
  niche: string,
): Promise<ScriptSection[]> {
  const sections: ScriptSection[] = []

  // Hook Section (0-30 seconds)
  const hookSection: ScriptSection = {
    title: "Hook",
    content: generateHookScript(optimization.hooks[0], title, keywords),
    duration: 30,
    retention_techniques: ["curiosity_gap", "pattern_interrupt", "urgency"],
    engagement_elements: ["question", "preview", "credibility"],
    visual_cues: ["dynamic_text", "countdown", "preview_clips"],
  }
  sections.push(hookSection)

  // Context Section (30s - 2min)
  const contextSection: ScriptSection = {
    title: "Context & Setup",
    content: generateContextScript(title, niche, keywords),
    duration: 90,
    retention_techniques: ["problem_agitation", "stakes_raising", "solution_preview"],
    engagement_elements: ["relatable_scenario", "statistics", "preview"],
    visual_cues: ["problem_visualization", "data_graphics", "solution_preview"],
  }
  sections.push(contextSection)

  // Main Content Sections
  const mainSections = generateMainContentSections(title, niche, keywords, optimization)
  sections.push(...mainSections)

  // Conclusion Section
  const conclusionSection: ScriptSection = {
    title: "Conclusion & CTA",
    content: generateConclusionScript(title, niche),
    duration: optimization.script_structure.sections.find((s) => s.name === "Conclusion")?.duration || 120,
    retention_techniques: ["summary_reinforcement", "next_video_hook", "urgency"],
    engagement_elements: ["action_steps", "community_building", "next_video_preview"],
    visual_cues: ["summary_graphics", "next_video_thumbnail", "subscribe_animation"],
  }
  sections.push(conclusionSection)

  return sections
}

/**
 * Generate hook script with maximum retention focus
 */
function generateHookScript(hook: any, title: string, keywords: string[]): string {
  const hookScript = `
[VISUAL: Dynamic text animation with urgent music]

${hook.text}

[PAUSE - 2 seconds for impact]

And by the end of this video, you'll not only understand exactly how this works, but you'll have the tools to ${getHookPromise(
    title,
  )}.

[VISUAL: Quick preview montage of key moments]

But first, let me show you something that will completely change how you think about ${keywords[0] || "security"}.

[PATTERN INTERRUPT - Music change, visual shift]

This isn't just theory - I'm going to walk you through real examples, and you'll see exactly why ${getCredibilityStatement(
    title,
  )}.

So if you're ready to ${getActionPromise(title)}, let's dive in.
`

  return hookScript.trim()
}

/**
 * Generate context script that maintains retention
 */
function generateContextScript(title: string, niche: string, keywords: string[]): string {
  const contextScript = `
[VISUAL: Problem scenario visualization]

Now, before we get into the technical details, let me paint you a picture of why this matters.

[RETENTION HOOK]
And what I'm about to show you in the next section will completely change your perspective on this.

[VISUAL: Statistics and data]

Here's what most people don't realize about ${keywords[0] || niche}...

[AGITATION]
Every single day, thousands of people are making this exact mistake, and it's costing them ${getStakes(niche)}.

[SOLUTION PREVIEW]
But here's the thing - once you understand the method I'm about to show you, you'll never have to worry about this again.

[TRANSITION HOOK]
In fact, let me show you the first technique right now, because this alone will ${getImmediateValue(niche)}.
`

  return contextScript.trim()
}

/**
 * Generate main content sections with engagement optimization
 */
function generateMainContentSections(title: string, niche: string, keywords: string[], optimization: any) {
  const sections: ScriptSection[] = []
  const numSections = Math.ceil((optimization.script_structure.total_duration - 240) / 180) // 3-minute sections

  for (let i = 0; i < numSections; i++) {
    const section: ScriptSection = {
      title: `Main Content ${i + 1}`,
      content: generateMainSectionScript(i, title, niche, keywords, numSections),
      duration: 180,
      retention_techniques: ["value_delivery", "examples", "transition_hooks"],
      engagement_elements: ["practical_examples", "step_by_step", "results_preview"],
      visual_cues: ["screen_recordings", "diagrams", "code_examples"],
    }
    sections.push(section)
  }

  return sections
}

/**
 * Generate main section script with retention optimization
 */
function generateMainSectionScript(
  sectionIndex: number,
  title: string,
  niche: string,
  keywords: string[],
  totalSections: number,
): string {
  const isFirstSection = sectionIndex === 0
  const isLastSection = sectionIndex === totalSections - 1

  let script = ""

  if (isFirstSection) {
    script += `
[RETENTION HOOK]
Alright, here's where things get really interesting. What I'm about to show you is something that ${getExclusivityClaim(
      niche,
    )}.

[VISUAL: Transition animation]
`
  }

  script += `
[MAIN CONTENT - Section ${sectionIndex + 1}]

${getValueDeliveryContent(sectionIndex, niche, keywords)}

[PRACTICAL EXAMPLE]
Let me show you exactly how this works with a real example.

[VISUAL: Screen recording or demonstration]

${getPracticalExample(sectionIndex, niche)}

[RETENTION HOOK - Mid-section]
Now, this next part is crucial, because ${getImportanceStatement(sectionIndex, niche)}.

${getAdvancedContent(sectionIndex, niche)}

[ENGAGEMENT HOOK]
Quick question - ${getEngagementQuestion(sectionIndex, niche)} Let me know in the comments.
`

  if (!isLastSection) {
    script += `
[TRANSITION HOOK]
But here's where it gets even more interesting. In the next section, I'm going to show you ${getNextSectionPreview(
      sectionIndex + 1,
      niche,
    )}.
`
  }

  return script.trim()
}

/**
 * Generate conclusion script with strong CTA
 */
function generateConclusionScript(title: string, niche: string): string {
  const conclusionScript = `
[VISUAL: Summary graphics]

Alright, let's quickly recap what we've covered today.

[SUMMARY WITH REINFORCEMENT]
We started by ${getSummaryPoint1(niche)}, then we explored ${getSummaryPoint2(niche)}, and finally we discovered ${getSummaryPoint3(
    niche,
  )}.

[VALUE REINFORCEMENT]
Now you have the knowledge to ${getValueReinforcement(niche)}.

[NEXT STEPS]
But here's what I want you to do right now:

First, ${getActionStep1(niche)}.
Second, ${getActionStep2(niche)}.
And third, ${getActionStep3(niche)}.

[NEXT VIDEO HOOK]
Now, if you found this valuable, you're going to love what I have planned for next week. I'm going to show you ${getNextVideoHook(
    niche,
  )}.

[VISUAL: Next video thumbnail]

This is something that ${getNextVideoValue(niche)}, and I guarantee it will ${getNextVideoPromise(niche)}.

[STRONG CTA]
So make sure you're subscribed with notifications on, because you don't want to miss this.

And if this video helped you ${getHelpStatement(niche)}, smash that like button - it really helps the algorithm show this to more people who need to see it.

[FINAL HOOK]
I'll see you in the next one, where we're going to ${getFinalHook(niche)}.
`

  return conclusionScript.trim()
}

/**
 * Predict performance metrics based on script optimization
 */
function predictPerformance(script: ScriptSection[], optimization: any, niche: string) {
  // Calculate predicted metrics based on optimization techniques
  const baseRetention = 0.65 // Base retention for niche
  const optimizationBonus = calculateOptimizationBonus(script)
  const predictedRetention = Math.min(0.85, baseRetention + optimizationBonus)

  const baseRPM = getNicheBaseRPM(niche)
  const rpmMultiplier = calculateRPMMultiplier(optimization, predictedRetention)
  const predictedRPM = baseRPM * rpmMultiplier

  return {
    retention: {
      predicted: predictedRetention,
      confidence: 0.85,
      breakdown: {
        hook: 0.95,
        first_minute: 0.88,
        mid_video: 0.75,
        conclusion: 0.65,
      },
    },
    monetization: {
      predicted_rpm: predictedRPM,
      confidence: 0.8,
      factors: {
        audience_quality: 0.9,
        content_optimization: 0.85,
        ad_placement: 0.88,
      },
    },
    engagement: {
      predicted_ctr: 0.08 + optimizationBonus * 0.02,
      predicted_like_ratio: 0.04 + optimizationBonus * 0.01,
      predicted_comment_ratio: 0.015 + optimizationBonus * 0.005,
    },
  }
}

// Helper functions for script generation
function getHookPromise(title: string): string {
  return "protect yourself from these exact vulnerabilities"
}

function getCredibilityStatement(title: string): string {
  return "this information is so valuable that most security professionals charge thousands to teach it"
}

function getActionPromise(title: string): string {
  return "master these techniques and become unhackable"
}

function getStakes(niche: string): string {
  const stakes = {
    cybersecurity: "their entire digital identity and financial security",
    development: "countless hours and potential career opportunities",
    networking: "critical business data and system integrity",
  }
  return stakes[niche] || stakes.cybersecurity
}

function getImmediateValue(niche: string): string {
  const values = {
    cybersecurity: "immediately identify if you're already compromised",
    development: "save you hours of debugging time",
    networking: "prevent the most common network attacks",
  }
  return values[niche] || values.cybersecurity
}

function getExclusivityClaim(niche: string): string {
  return "most people in the industry don't even know exists"
}

function getValueDeliveryContent(index: number, niche: string, keywords: string[]): string {
  // Generate specific content based on section index and niche
  return `Here's the ${index + 1}${getOrdinalSuffix(index + 1)} technique that will ${getValuePromise(index, niche)}...`
}

function getPracticalExample(index: number, niche: string): string {
  return `[Detailed practical example for section ${index + 1} in ${niche}]`
}

function getImportanceStatement(index: number, niche: string): string {
  return `this is where most people make a critical mistake that leaves them vulnerable`
}

function getAdvancedContent(index: number, niche: string): string {
  return `[Advanced technical content for section ${index + 1}]`
}

function getEngagementQuestion(index: number, niche: string): string {
  const questions = [
    "have you ever encountered this type of vulnerability before?",
    "what's your current approach to handling this situation?",
    "which of these techniques do you think is most effective?",
  ]
  return questions[index % questions.length]
}

function getNextSectionPreview(nextIndex: number, niche: string): string {
  return `an even more advanced technique that will blow your mind`
}

// Additional helper functions...
function getOrdinalSuffix(num: number): string {
  const suffixes = ["th", "st", "nd", "rd"]
  const v = num % 100
  return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]
}

function getValuePromise(index: number, niche: string): string {
  return "completely change how you approach security"
}

function getSummaryPoint1(niche: string): string {
  return "understanding the fundamental vulnerabilities"
}

function getSummaryPoint2(niche: string): string {
  return "practical techniques for protection"
}

function getSummaryPoint3(niche: string): string {
  return "advanced methods for staying ahead of threats"
}

function getValueReinforcement(niche: string): string {
  return "protect yourself and others from these critical vulnerabilities"
}

function getActionStep1(niche: string): string {
  return "implement the first technique we covered"
}

function getActionStep2(niche: string): string {
  return "test your current security setup"
}

function getActionStep3(niche: string): string {
  return "share this knowledge with your team"
}

function getNextVideoHook(niche: string): string {
  return "the most dangerous vulnerability that 99% of people don't know about"
}

function getNextVideoValue(niche: string): string {
  return "could save your entire digital life"
}

function getNextVideoPromise(niche: string): string {
  return "change everything you thought you knew about security"
}

function getHelpStatement(niche: string): string {
  return "understand these critical security concepts"
}

function getFinalHook(niche: string): string {
  return "dive even deeper into advanced protection techniques"
}

function calculateOptimizationBonus(script: ScriptSection[]): number {
  let bonus = 0
  script.forEach((section) => {
    bonus += section.retention_techniques.length * 0.02
    bonus += section.engagement_elements.length * 0.015
  })
  return Math.min(0.2, bonus) // Cap at 20% bonus
}

function getNicheBaseRPM(niche: string): number {
  const baseRPMs = {
    cybersecurity: 12,
    development: 8,
    networking: 10,
  }
  return baseRPMs[niche] || 8
}

function calculateRPMMultiplier(optimization: any, retention: number): number {
  let multiplier = 1
  multiplier += retention * 0.5 // Higher retention = higher RPM
  multiplier += optimization.monetization.ad_placement.length * 0.1 // More ads = higher RPM
  return Math.min(2.5, multiplier) // Cap at 2.5x
}
