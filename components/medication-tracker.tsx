"use client"

import { useState } from "react"
import { Plus, Pill, Clock, Calendar, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@/contexts/user-context"
import { useEffect } from "react"
import { createMedication } from "@/lib/actions"

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  time: string
  notes: string
}

export function MedicationTracker() {
  const { user } = useUser()
  const [medications, setMedications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newMed, setNewMed] = useState({
    name: "",
    dosage: "",
    frequency: "",
    time: "",
    notes: "",
  })

  useEffect(() => {
    if (user) {
      fetchMedications()
    }
  }, [user])

  const fetchMedications = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/medications?userId=${user.id}`)
      const result = await response.json()

      if (result.data) {
        setMedications(result.data)
      }
    } catch (error) {
      console.error("Error fetching medications:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddMedication = async (formData: FormData) => {
    if (!user) return

    formData.append("user_id", user.id)

    const result = await createMedication(formData)

    if (result.success) {
      await fetchMedications()
      setShowAddForm(false)
    }
  }

  const removeMedication = async (id: string) => {
    try {
      await fetch(`/api/medications/${id}`, { method: "DELETE" })
      await fetchMedications()
    } catch (error) {
      console.error("Error removing medication:", error)
    }
  }

  if (!user) {
    return <div>Please sign in to track your medications.</div>
  }

  if (loading) {
    return <div>Loading medications...</div>
  }

  const addMedication = () => {
    if (newMed.name && newMed.dosage) {
      const medication: Medication = {
        id: Date.now().toString(),
        ...newMed,
      }
      setMedications([...medications, medication])
      setNewMed({ name: "", dosage: "", frequency: "", time: "", notes: "" })
      setShowAddForm(false)
    }
  }

  const medicationSafetyTips = [
    "Always take medications as prescribed by your healthcare provider",
    "Don't share medications with others",
    "Check expiration dates regularly",
    "Store medications in a cool, dry place",
    "Keep a list of all medications for emergencies",
    "Inform all healthcare providers about all medications you take",
    "Don't stop taking prescribed medications without consulting your doctor",
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Medication Tracker
          </CardTitle>
          <CardDescription>Keep track of your medications and dosing schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setShowAddForm(!showAddForm)} className="mb-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Medication
          </Button>

          {showAddForm && (
            <Card className="mb-4">
              <CardContent className="pt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Medication Name</Label>
                    <Input
                      id="name"
                      value={newMed.name}
                      onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                      placeholder="e.g., Aspirin"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dosage">Dosage</Label>
                    <Input
                      id="dosage"
                      value={newMed.dosage}
                      onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                      placeholder="e.g., 100mg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="frequency">Frequency</Label>
                    <Input
                      id="frequency"
                      value={newMed.frequency}
                      onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                      placeholder="e.g., Twice daily"
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      value={newMed.time}
                      onChange={(e) => setNewMed({ ...newMed, time: e.target.value })}
                      placeholder="e.g., 8:00 AM, 8:00 PM"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Input
                      id="notes"
                      value={newMed.notes}
                      onChange={(e) => setNewMed({ ...newMed, notes: e.target.value })}
                      placeholder="e.g., Take with food"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={addMedication}>Add Medication</Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {medications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No medications added yet. Click "Add Medication" to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {medications.map((med) => (
                <Card key={med.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{med.name}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline">
                            <Pill className="h-3 w-3 mr-1" />
                            {med.dosage}
                          </Badge>
                          <Badge variant="outline">
                            <Calendar className="h-3 w-3 mr-1" />
                            {med.frequency}
                          </Badge>
                          {med.time && (
                            <Badge variant="outline">
                              <Clock className="h-3 w-3 mr-1" />
                              {med.time}
                            </Badge>
                          )}
                        </div>
                        {med.notes && <p className="text-sm text-gray-600 mt-2">{med.notes}</p>}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMedication(med.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Medication Safety Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {medicationSafetyTips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span className="text-sm">{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
