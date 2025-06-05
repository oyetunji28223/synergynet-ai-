"use client"

import React from "react"

import { useState } from "react"
import { BookOpen, AlertTriangle, Heart, LigatureIcon as Bandage } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const firstAidGuides = {
  cuts: {
    title: "Cuts and Scrapes",
    icon: Bandage,
    steps: [
      "Wash your hands thoroughly",
      "Stop the bleeding by applying direct pressure with a clean cloth",
      "Clean the wound gently with water",
      "Apply antibiotic ointment if available",
      "Cover with a sterile bandage",
      "Change the bandage daily and keep the wound clean",
      "Watch for signs of infection (redness, swelling, pus)",
    ],
  },
  burns: {
    title: "Minor Burns",
    icon: AlertTriangle,
    steps: [
      "Remove from heat source immediately",
      "Cool the burn with cool (not cold) running water for 10-20 minutes",
      "Remove any jewelry or tight clothing near the burn",
      "Do not break blisters if they form",
      "Apply aloe vera or moisturizer",
      "Cover with a sterile, non-adhesive bandage",
      "Take over-the-counter pain medication if needed",
      "Seek medical attention for burns larger than 3 inches or on face/hands",
    ],
  },
  choking: {
    title: "Choking (Conscious Adult)",
    icon: AlertTriangle,
    steps: [
      "Ask 'Are you choking?' If they can't speak, cough, or breathe, begin first aid",
      "Stand behind the person",
      "Place your arms around their waist",
      "Make a fist with one hand, place thumb side against stomach above navel",
      "Grasp fist with other hand and give quick upward thrusts",
      "Continue until object is expelled or person becomes unconscious",
      "If unconscious, call 911 and begin CPR",
      "Seek medical attention even if successful",
    ],
  },
  sprains: {
    title: "Sprains and Strains",
    icon: Bandage,
    steps: [
      "Rest the injured area",
      "Ice for 15-20 minutes every 2-3 hours for first 48 hours",
      "Compress with elastic bandage (not too tight)",
      "Elevate the injured area above heart level when possible",
      "Take over-the-counter pain medication as needed",
      "Avoid activities that cause pain",
      "Seek medical attention if severe pain, numbness, or inability to use the area",
    ],
  },
  nosebleed: {
    title: "Nosebleeds",
    icon: AlertTriangle,
    steps: [
      "Sit upright and lean slightly forward",
      "Pinch the soft part of the nose firmly",
      "Hold for 10-15 minutes without checking",
      "Breathe through your mouth",
      "Apply ice to the bridge of the nose",
      "Avoid blowing your nose for several hours",
      "Seek medical attention if bleeding doesn't stop after 20 minutes",
    ],
  },
  allergic: {
    title: "Allergic Reactions",
    icon: Heart,
    steps: [
      "Remove or avoid the allergen if known",
      "For mild reactions: take antihistamine, apply cool compress",
      "For severe reactions (anaphylaxis): call 911 immediately",
      "Use epinephrine auto-injector if available",
      "Help person lie down and elevate legs",
      "Loosen tight clothing",
      "Do not give anything by mouth if having trouble breathing",
      "Be prepared to perform CPR if necessary",
    ],
  },
}

export function FirstAid() {
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            First Aid Guide
          </CardTitle>
          <CardDescription>
            Quick reference for common first aid situations. Always call emergency services for serious injuries.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(firstAidGuides).map(([key, guide]) => {
          const IconComponent = guide.icon
          return (
            <Card
              key={key}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedGuide(selectedGuide === key ? null : key)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <IconComponent className="h-5 w-5 text-red-600" />
                  {guide.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  {selectedGuide === key ? "Hide Steps" : "View Steps"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {selectedGuide && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {React.createElement(firstAidGuides[selectedGuide as keyof typeof firstAidGuides].icon, {
                className: "h-5 w-5 text-red-600",
              })}
              {firstAidGuides[selectedGuide as keyof typeof firstAidGuides].title} - Step by Step
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {firstAidGuides[selectedGuide as keyof typeof firstAidGuides].steps.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-5 w-5" />
            Important Disclaimer
          </CardTitle>
        </CardHeader>
        <CardContent className="text-red-800">
          <ul className="space-y-2 text-sm">
            <li>
              • This guide is for informational purposes only and not a substitute for professional medical training
            </li>
            <li>• Always call emergency services (911) for serious injuries or medical emergencies</li>
            <li>• Consider taking a certified first aid course for proper training</li>
            <li>• When in doubt, seek professional medical help immediately</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
