"use client"

import { useState } from "react"
import { Heart, Activity, Thermometer, Scale, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUser } from "@/contexts/user-context"
import { useEffect } from "react"
import { createHealthRecord } from "@/lib/actions"

interface HealthRecord {
  id: string
  date: string
  bloodPressure: string
  heartRate: string
  temperature: string
  weight: string
  notes: string
}

export function HealthMetrics() {
  const { user } = useUser()
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newRecord, setNewRecord] = useState({
    bloodPressure: "",
    heartRate: "",
    temperature: "",
    weight: "",
    notes: "",
  })

  useEffect(() => {
    if (user) {
      fetchHealthRecords()
    }
  }, [user])

  const fetchHealthRecords = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/health-records?userId=${user.id}`)
      const result = await response.json()

      if (result.data) {
        setRecords(result.data)
      }
    } catch (error) {
      console.error("Error fetching health records:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddRecord = async (formData: FormData) => {
    if (!user) return

    formData.append("user_id", user.id)
    formData.append("record_date", new Date().toISOString().split("T")[0])

    const result = await createHealthRecord(formData)

    if (result.success) {
      await fetchHealthRecords()
      setShowAddForm(false)
    }
  }

  if (!user) {
    return <div>Please sign in to track your health metrics.</div>
  }

  if (loading) {
    return <div>Loading health records...</div>
  }

  const healthRanges = [
    {
      metric: "Blood Pressure",
      normal: "Less than 120/80 mmHg",
      elevated: "120-129/<80 mmHg",
      high: "130/80 mmHg or higher",
    },
    {
      metric: "Resting Heart Rate",
      normal: "60-100 beats per minute",
      elevated: "Above 100 (consult doctor)",
      high: "Consistently above 100",
    },
    {
      metric: "Body Temperature",
      normal: "97°F - 99°F (36.1°C - 37.2°C)",
      elevated: "99.1°F - 100.4°F (fever developing)",
      high: "Above 100.4°F (38°C) - fever",
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Health Metrics Tracker
          </CardTitle>
          <CardDescription>Track your vital signs and health measurements over time</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setShowAddForm(!showAddForm)} className="mb-4">
            <Plus className="h-4 w-4 mr-2" />
            Add New Record
          </Button>

          {showAddForm && (
            <Card className="mb-4">
              <CardContent className="pt-6">
                <form action={handleAddRecord}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="bloodPressure">Blood Pressure (mmHg)</Label>
                      <Input id="bloodPressure" name="blood_pressure" placeholder="e.g., 120/80" />
                    </div>
                    <div>
                      <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                      <Input id="heartRate" name="heart_rate" placeholder="e.g., 72" />
                    </div>
                    <div>
                      <Label htmlFor="temperature">Temperature (°F)</Label>
                      <Input id="temperature" name="temperature" placeholder="e.g., 98.6" />
                    </div>
                    <div>
                      <Label htmlFor="weight">Weight (lbs)</Label>
                      <Input id="weight" name="weight" placeholder="e.g., 150" />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Input id="notes" name="notes" placeholder="Any additional notes..." />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button type="submit">Add Record</Button>
                    <Button variant="outline" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {records.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No health records yet. Start tracking your vital signs!
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((record: any) => (
                <Card key={record.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold">{new Date(record.record_date).toLocaleDateString()}</h3>
                    </div>
                    <div className="grid gap-4 md:grid-cols-4">
                      {record.blood_pressure && (
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-red-500" />
                          <div>
                            <div className="text-sm text-gray-600">Blood Pressure</div>
                            <div className="font-semibold">{record.blood_pressure} mmHg</div>
                          </div>
                        </div>
                      )}
                      {record.heart_rate && (
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-blue-500" />
                          <div>
                            <div className="text-sm text-gray-600">Heart Rate</div>
                            <div className="font-semibold">{record.heart_rate} bpm</div>
                          </div>
                        </div>
                      )}
                      {record.temperature && (
                        <div className="flex items-center gap-2">
                          <Thermometer className="h-4 w-4 text-orange-500" />
                          <div>
                            <div className="text-sm text-gray-600">Temperature</div>
                            <div className="font-semibold">{record.temperature}°F</div>
                          </div>
                        </div>
                      )}
                      {record.weight && (
                        <div className="flex items-center gap-2">
                          <Scale className="h-4 w-4 text-green-500" />
                          <div>
                            <div className="text-sm text-gray-600">Weight</div>
                            <div className="font-semibold">{record.weight} lbs</div>
                          </div>
                        </div>
                      )}
                    </div>
                    {record.notes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">Notes:</div>
                        <div className="text-sm">{record.notes}</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Normal Health Ranges</CardTitle>
          <CardDescription>Reference ranges for common health metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {healthRanges.map((range, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold">{range.metric}</h4>
                <div className="text-sm space-y-1">
                  <div>
                    <span className="text-green-600">Normal:</span> {range.normal}
                  </div>
                  <div>
                    <span className="text-yellow-600">Elevated:</span> {range.elevated}
                  </div>
                  <div>
                    <span className="text-red-600">High:</span> {range.high}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
