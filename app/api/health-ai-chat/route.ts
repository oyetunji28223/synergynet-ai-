import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import { createServerClient } from "@/lib/supabase"

export async function POST(req: Request) {
  try {
    const { messages, userId } = await req.json()

    // Get user's health context if available
    let healthContext = ""
    if (userId) {
      const supabase = createServerClient()

      // Get recent health records
      const { data: healthRecords } = await supabase
        .from("health_records")
        .select("*")
        .eq("user_id", userId)
        .order("record_date", { ascending: false })
        .limit(5)

      // Get active medications
      const { data: medications } = await supabase
        .from("medications")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)

      // Get recent symptoms
      const { data: symptoms } = await supabase
        .from("symptom_logs")
        .select("*")
        .eq("user_id", userId)
        .order("logged_at", { ascending: false })
        .limit(10)

      if (healthRecords?.length || medications?.length || symptoms?.length) {
        healthContext = `
User's Health Context:
${healthRecords?.length ? `Recent Health Records: ${JSON.stringify(healthRecords)}` : ""}
${medications?.length ? `Current Medications: ${JSON.stringify(medications)}` : ""}
${symptoms?.length ? `Recent Symptoms: ${JSON.stringify(symptoms)}` : ""}
`
      }
    }

    const systemPrompt = `You are an advanced AI Health Assistant with the following capabilities:

CORE EXPERTISE:
- Medical symptom analysis and triage
- Medication management and interaction checking
- Health goal tracking and motivation
- Emergency guidance and first aid instructions
- Wellness coaching and lifestyle recommendations
- Mental health support and stress management
- Lab result interpretation and health metrics analysis

PERSONALITY:
- Empathetic, professional, and reassuring
- Evidence-based recommendations
- Clear, actionable advice
- Appropriate urgency for serious symptoms

SAFETY PROTOCOLS:
- Always recommend professional medical care for serious symptoms
- Never diagnose specific conditions
- Emphasize when emergency care is needed
- Provide disclaimers about AI limitations

ADVANCED FEATURES:
- Personalized recommendations based on user's health history
- Proactive health monitoring suggestions
- Integration with wearable device data
- Medication reminder optimization
- Health trend analysis

${healthContext}

Remember: You are an AI assistant for informational purposes. Always encourage users to consult healthcare professionals for medical decisions.`

    const result = await streamText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      messages,
      temperature: 0.7,
      maxTokens: 1000,
    })

    return result.toAIStreamResponse()
  } catch (error) {
    console.error("Health AI Chat Error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
