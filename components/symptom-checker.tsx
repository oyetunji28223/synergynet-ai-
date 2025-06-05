"use client"

import { useState } from "react"
import { Search, AlertCircle, CheckCircle, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useUser } from "@/contexts/user-context"
import { logSymptom } from "@/lib/actions"

const symptomDatabase = {
  headache: {
    severity: "mild",
    suggestions: [
      "Rest in a quiet, dark room",
      "Apply cold or warm compress to head/neck",
      "Stay hydrated - drink plenty of water",
      "Consider over-the-counter pain relievers",
      "Practice relaxation techniques",
    ],
    whenToSeekHelp:
      "Seek immediate medical attention if headache is sudden, severe, or accompanied by fever, stiff neck, confusion, or vision changes.",
  },
  fever: {
    severity: "moderate",
    suggestions: [
      "Rest and get plenty of sleep",
      "Drink fluids to prevent dehydration",
      "Use fever-reducing medications as directed",
      "Wear light clothing and keep room cool",
      "Monitor temperature regularly",
    ],
    whenToSeekHelp:
      "Seek medical care if fever is over 103°F (39.4°C), lasts more than 3 days, or is accompanied by severe symptoms.",
  },
  cough: {
    severity: "mild",
    suggestions: [
      "Stay hydrated with warm liquids",
      "Use honey to soothe throat (not for children under 1 year)",
      "Try throat lozenges or warm salt water gargle",
      "Use a humidifier or breathe steam",
      "Avoid irritants like smoke",
    ],
    whenToSeekHelp:
      "See a doctor if cough persists for more than 3 weeks, produces blood, or is accompanied by high fever or difficulty breathing.",
  },
  "stomach pain": {
    severity: "moderate",
    suggestions: [
      "Rest and avoid solid foods temporarily",
      "Try clear liquids like water, broth, or herbal tea",
      "Apply heat pad to abdomen",
      "Avoid dairy, caffeine, and spicy foods",
      "Consider probiotics for digestive health",
    ],
    whenToSeekHelp:
      "Seek immediate care for severe pain, signs of dehydration, blood in vomit/stool, or pain with fever.",
  },
  "sore throat": {
    severity: "mild",
    suggestions: [
      "Gargle with warm salt water",
      "Drink warm liquids like tea with honey",
      "Use throat lozenges or sprays",
      "Rest your voice",
      "Stay hydrated",
    ],
    whenToSeekHelp:
      "See a doctor if sore throat is severe, lasts more than a week, or is accompanied by high fever or difficulty swallowing.",
  },
}

export function SymptomChecker() {
  const [symptom, setSymptom] = useState("")
  const [result, setResult] = useState<any>(null)
  const user = useUser()

  const checkSymptom = async () => {
    const normalizedSymptom = symptom.toLowerCase().trim()
    const match = symptomDatabase[normalizedSymptom as keyof typeof symptomDatabase]

    let resultData
    if (match) {
      resultData = { symptom: normalizedSymptom, ...match }
    } else {
      resultData = {
        symptom: normalizedSymptom,
        severity: "unknown",
        suggestions: [
          "Monitor your symptoms closely",
          "Rest and stay hydrated",
          "Consider consulting a healthcare provider",
          "Keep a symptom diary",
          "Avoid self-medication without professional advice",
        ],
        whenToSeekHelp: "If symptoms persist, worsen, or you're concerned, please consult a healthcare professional.",
      }
    }

    setResult(resultData)

    // Log to database if user is signed in
    if (user) {
      const formData = new FormData()
      formData.append("user_id", user.id)
      formData.append("symptom", normalizedSymptom)
      formData.append("severity", resultData.severity)
      formData.append("suggestions", JSON.stringify(resultData.suggestions))

      await logSymptom(formData)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "mild":
        return "bg-green-100 text-green-800"
      case "moderate":
        return "bg-yellow-100 text-yellow-800"
      case "severe":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Symptom Checker
          </CardTitle>
          <CardDescription>
            Enter your symptom to get personalized care suggestions. This is for informational purposes only and not a
            substitute for professional medical advice.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter your symptom (e.g., headache, fever, cough)"
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && checkSymptom()}
            />
            <Button onClick={checkSymptom} disabled={!symptom.trim()}>
              Check
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Results for: {result.symptom}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge className={getSeverityColor(result.severity)}>
                {result.severity.charAt(0).toUpperCase() + result.severity.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Care Suggestions:
              </h4>
              <ul className="space-y-1">
                {result.suggestions.map((suggestion: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>When to seek medical help:</strong> {result.whenToSeekHelp}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Available Symptoms</CardTitle>
          <CardDescription>Click on any symptom below for quick access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.keys(symptomDatabase).map((sym) => (
              <Button
                key={sym}
                variant="outline"
                size="sm"
                onClick={() => {
                  setSymptom(sym)
                  setResult({ symptom: sym, ...symptomDatabase[sym as keyof typeof symptomDatabase] })
                }}
              >
                {sym.charAt(0).toUpperCase() + sym.slice(1)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
