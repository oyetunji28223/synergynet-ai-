"use client"

import { Droplets, Moon, Utensils, Dumbbell, Brain, Sun } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const wellnessTips = [
  {
    icon: Droplets,
    title: "Stay Hydrated",
    description: "Drink 8-10 glasses of water daily",
    tips: [
      "Start your day with a glass of water",
      "Keep a water bottle with you",
      "Eat water-rich foods like fruits and vegetables",
      "Monitor urine color - pale yellow is ideal",
      "Drink more during exercise or hot weather",
    ],
  },
  {
    icon: Moon,
    title: "Quality Sleep",
    description: "Get 7-9 hours of restful sleep",
    tips: [
      "Maintain a consistent sleep schedule",
      "Create a relaxing bedtime routine",
      "Keep bedroom cool, dark, and quiet",
      "Avoid screens 1 hour before bed",
      "Limit caffeine after 2 PM",
    ],
  },
  {
    icon: Utensils,
    title: "Balanced Nutrition",
    description: "Eat a variety of nutritious foods",
    tips: [
      "Fill half your plate with fruits and vegetables",
      "Choose whole grains over refined grains",
      "Include lean proteins in every meal",
      "Limit processed and sugary foods",
      "Practice portion control",
    ],
  },
  {
    icon: Dumbbell,
    title: "Regular Exercise",
    description: "Aim for 150 minutes of moderate activity weekly",
    tips: [
      "Take a 30-minute walk daily",
      "Use stairs instead of elevators",
      "Try strength training 2-3 times per week",
      "Find activities you enjoy",
      "Start slowly and gradually increase intensity",
    ],
  },
  {
    icon: Brain,
    title: "Mental Health",
    description: "Take care of your emotional well-being",
    tips: [
      "Practice mindfulness or meditation",
      "Stay connected with friends and family",
      "Engage in hobbies you enjoy",
      "Seek help when feeling overwhelmed",
      "Practice gratitude daily",
    ],
  },
  {
    icon: Sun,
    title: "Preventive Care",
    description: "Stay up-to-date with health screenings",
    tips: [
      "Schedule regular check-ups with your doctor",
      "Keep vaccinations current",
      "Get recommended health screenings",
      "Practice good hygiene habits",
      "Protect your skin from sun damage",
    ],
  },
]

export function WellnessTips() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {wellnessTips.map((category, index) => {
        const IconComponent = category.icon
        return (
          <Card key={index} className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconComponent className="h-5 w-5 text-blue-600" />
                {category.title}
              </CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {category.tips.map((tip, tipIndex) => (
                  <li key={tipIndex} className="flex items-start gap-2 text-sm">
                    <span className="text-green-600 mt-1 text-xs">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
