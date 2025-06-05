"use client"
import { Heart, Phone, AlertTriangle, Pill, Activity, BookOpen, Crown } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SymptomChecker } from "./components/symptom-checker"
import { WellnessTips } from "./components/wellness-tips"
import { EmergencyContacts } from "./components/emergency-contacts"
import { MedicationTracker } from "./components/medication-tracker"
import { HealthMetrics } from "./components/health-metrics"
import { FirstAid } from "./components/first-aid"
import { UserProvider, useUser } from "@/contexts/user-context"
import { AuthForm } from "@/components/auth/auth-form"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Premium3DLanding } from "./components/3d/premium-3d-landing"

function DashboardContent() {
  const { user, loading, signOut } = useUser()
  const [healthData, setHealthData] = useState({
    heartRate: 72,
    bloodPressure: "120/80",
    temperature: 98.6,
    weight: 150,
  })
  const [showLanding, setShowLanding] = useState(true)

  useEffect(() => {
    // Simulate fetching user's health data
    if (user) {
      setHealthData({
        heartRate: 72 + Math.floor(Math.random() * 20),
        bloodPressure: "120/80",
        temperature: 98.6,
        weight: 150,
      })
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading your health dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  if (showLanding) {
    return <Premium3DLanding />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-2">
              <Heart className="h-8 w-8 text-red-500" />
              Health Support Center
            </h1>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setShowLanding(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Crown className="h-4 w-4 mr-2" />
                3D Experience
              </Button>
              <span className="text-gray-600">Welcome, {user.name || user.email}</span>
              <Button variant="outline" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>
          <p className="text-gray-600 text-lg">Your comprehensive health companion for wellness and care guidance</p>
        </div>

        <Tabs defaultValue="symptoms" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="symptoms" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Symptoms
            </TabsTrigger>
            <TabsTrigger value="wellness" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Wellness
            </TabsTrigger>
            <TabsTrigger value="emergency" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Emergency
            </TabsTrigger>
            <TabsTrigger value="medication" className="flex items-center gap-2">
              <Pill className="h-4 w-4" />
              Medication
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Metrics
            </TabsTrigger>
            <TabsTrigger value="firstaid" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              First Aid
            </TabsTrigger>
          </TabsList>

          <TabsContent value="symptoms">
            <SymptomChecker />
          </TabsContent>

          <TabsContent value="wellness">
            <WellnessTips />
          </TabsContent>

          <TabsContent value="emergency">
            <EmergencyContacts />
          </TabsContent>

          <TabsContent value="medication">
            <MedicationTracker />
          </TabsContent>

          <TabsContent value="metrics">
            <HealthMetrics />
          </TabsContent>

          <TabsContent value="firstaid">
            <FirstAid />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function HealthDashboard() {
  return (
    <UserProvider>
      <DashboardContent />
    </UserProvider>
  )
}
