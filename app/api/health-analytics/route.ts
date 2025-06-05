import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Get health records count
    const { count: recordsCount } = await supabase
      .from("health_records")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)

    // Get active medications count
    const { count: medicationsCount } = await supabase
      .from("medications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_active", true)

    // Get recent symptoms
    const { data: recentSymptoms } = await supabase
      .from("symptom_logs")
      .select("symptom, logged_at")
      .eq("user_id", userId)
      .order("logged_at", { ascending: false })
      .limit(5)

    // Get latest health record
    const { data: latestRecord } = await supabase
      .from("health_records")
      .select("*")
      .eq("user_id", userId)
      .order("record_date", { ascending: false })
      .limit(1)
      .single()

    const analytics = {
      recordsCount: recordsCount || 0,
      medicationsCount: medicationsCount || 0,
      recentSymptoms: recentSymptoms || [],
      latestRecord: latestRecord || null,
    }

    return NextResponse.json({ data: analytics })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
