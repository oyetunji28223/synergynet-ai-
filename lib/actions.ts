"use server"

import { createServerClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function createHealthRecord(formData: FormData) {
  try {
    const supabase = createServerClient()

    const healthRecord = {
      user_id: formData.get("user_id") as string,
      record_date: formData.get("record_date") as string,
      blood_pressure: (formData.get("blood_pressure") as string) || null,
      heart_rate: formData.get("heart_rate") ? Number.parseInt(formData.get("heart_rate") as string) : null,
      temperature: formData.get("temperature") ? Number.parseFloat(formData.get("temperature") as string) : null,
      weight: formData.get("weight") ? Number.parseFloat(formData.get("weight") as string) : null,
      notes: (formData.get("notes") as string) || null,
    }

    const { data, error } = await supabase.from("health_records").insert([healthRecord]).select().single()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/health-metrics")
    return { success: true, data }
  } catch (error) {
    return { success: false, error: "Failed to create health record" }
  }
}

export async function createMedication(formData: FormData) {
  try {
    const supabase = createServerClient()

    const medication = {
      user_id: formData.get("user_id") as string,
      name: formData.get("name") as string,
      dosage: (formData.get("dosage") as string) || null,
      frequency: (formData.get("frequency") as string) || null,
      time_schedule: (formData.get("time_schedule") as string) || null,
      notes: (formData.get("notes") as string) || null,
    }

    const { data, error } = await supabase.from("medications").insert([medication]).select().single()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/medications")
    return { success: true, data }
  } catch (error) {
    return { success: false, error: "Failed to create medication" }
  }
}

export async function logSymptom(formData: FormData) {
  try {
    const supabase = createServerClient()

    const symptomLog = {
      user_id: formData.get("user_id") as string,
      symptom: formData.get("symptom") as string,
      severity: (formData.get("severity") as string) || null,
      description: (formData.get("description") as string) || null,
      suggestions: formData.get("suggestions") ? JSON.parse(formData.get("suggestions") as string) : null,
    }

    const { data, error } = await supabase.from("symptom_logs").insert([symptomLog]).select().single()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/symptom-checker")
    return { success: true, data }
  } catch (error) {
    return { success: false, error: "Failed to log symptom" }
  }
}

export async function createUser(email: string, name?: string) {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase.from("users").insert([{ email, name }]).select().single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    return { success: false, error: "Failed to create user" }
  }
}
