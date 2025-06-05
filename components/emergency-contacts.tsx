"use client"

import { Phone, MapPin, Clock, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

const emergencyContacts = [
  {
    service: "Emergency Services",
    number: "911",
    description: "For life-threatening emergencies",
    available: "24/7",
  },
  {
    service: "Poison Control",
    number: "1-800-222-1222",
    description: "For poisoning emergencies",
    available: "24/7",
  },
  {
    service: "Crisis Text Line",
    number: "Text HOME to 741741",
    description: "For mental health crises",
    available: "24/7",
  },
  {
    service: "National Suicide Prevention Lifeline",
    number: "988",
    description: "For suicide prevention support",
    available: "24/7",
  },
]

const emergencySigns = [
  "Difficulty breathing or shortness of breath",
  "Chest pain or pressure",
  "Severe bleeding that won't stop",
  "Signs of stroke (face drooping, arm weakness, speech difficulty)",
  "Loss of consciousness",
  "Severe allergic reaction",
  "High fever with severe symptoms",
  "Severe burns",
  "Suspected poisoning",
  "Severe head injury",
]

export function EmergencyContacts() {
  return (
    <div className="space-y-6">
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>If you're experiencing a medical emergency, call 911 immediately.</strong>
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-2">
        {emergencyContacts.map((contact, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-red-600" />
                {contact.service}
              </CardTitle>
              <CardDescription>{contact.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-red-600">{contact.number}</div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  Available {contact.available}
                </div>
                <Button
                  className="w-full mt-2"
                  variant="outline"
                  onClick={() => window.open(`tel:${contact.number.replace(/[^\d]/g, "")}`)}
                >
                  Call Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            When to Call Emergency Services
          </CardTitle>
          <CardDescription>
            Call 911 immediately if you or someone else experiences any of these symptoms:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {emergencySigns.map((sign, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>{sign}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Find Nearby Healthcare
          </CardTitle>
          <CardDescription>Locate healthcare facilities in your area</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button
              className="w-full"
              variant="outline"
              onClick={() => window.open("https://www.google.com/maps/search/hospital+near+me")}
            >
              Find Hospitals
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => window.open("https://www.google.com/maps/search/urgent+care+near+me")}
            >
              Find Urgent Care
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => window.open("https://www.google.com/maps/search/pharmacy+near+me")}
            >
              Find Pharmacies
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
