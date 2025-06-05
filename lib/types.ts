export interface User {
  id: string
  email: string
  name?: string
  created_at: string
  updated_at: string
}

export interface HealthRecord {
  id: string
  user_id: string
  record_date: string
  blood_pressure?: string
  heart_rate?: number
  temperature?: number
  weight?: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface Medication {
  id: string
  user_id: string
  name: string
  dosage?: string
  frequency?: string
  time_schedule?: string
  notes?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SymptomLog {
  id: string
  user_id: string
  symptom: string
  severity?: string
  description?: string
  suggestions?: string[]
  logged_at: string
}

export interface EmergencyContact {
  id: string
  user_id: string
  name: string
  relationship?: string
  phone: string
  email?: string
  is_primary: boolean
  created_at: string
}

export interface WellnessGoal {
  id: string
  user_id: string
  category: string
  goal_description: string
  target_value?: string
  current_progress?: string
  target_date?: string
  is_completed: boolean
  created_at: string
  updated_at: string
}
