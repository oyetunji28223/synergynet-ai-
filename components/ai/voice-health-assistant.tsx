"use client"

import { useState, useEffect } from "react"
import { Mic, MicOff, VolumeX, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function VoiceHealthAssistant() {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [response, setResponse] = useState("")
  const [recognition, setRecognition] = useState<any>(null)
  const [synthesis, setSynthesis] = useState<any>(null)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      recognitionInstance.continuous = true
      recognitionInstance.interimResults = true
      recognitionInstance.lang = "en-US"

      recognitionInstance.onresult = (event: any) => {
        let finalTranscript = ""
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript)
          processVoiceCommand(finalTranscript)
        }
      }

      recognitionInstance.onend = () => {
        if (isActive) {
          recognitionInstance.start() // Restart for continuous listening
        }
      }

      setRecognition(recognitionInstance)
    }

    // Initialize speech synthesis
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSynthesis(window.speechSynthesis)
    }
  }, [isActive])

  const processVoiceCommand = async (command: string) => {
    const lowerCommand = command.toLowerCase()

    let aiResponse = ""

    if (lowerCommand.includes("heart rate") || lowerCommand.includes("pulse")) {
      aiResponse =
        "Your current heart rate is 72 beats per minute, which is within the normal range. Would you like me to track this over time?"
    } else if (lowerCommand.includes("blood pressure")) {
      aiResponse =
        "Your last recorded blood pressure was 120 over 80, which is optimal. Remember to check it regularly."
    } else if (lowerCommand.includes("medication") || lowerCommand.includes("pills")) {
      aiResponse =
        "You have 3 active medications. Your next dose of Aspirin is due in 2 hours. Would you like me to set a reminder?"
    } else if (lowerCommand.includes("emergency") || lowerCommand.includes("help")) {
      aiResponse =
        "I'm here to help. If this is a medical emergency, please call 911 immediately. For non-emergency health questions, I can assist you."
    } else if (lowerCommand.includes("sleep") || lowerCommand.includes("tired")) {
      aiResponse =
        "Based on your recent data, you've been averaging 6.5 hours of sleep. I recommend aiming for 7-9 hours for optimal health."
    } else {
      // Send to AI for more complex queries
      try {
        const response = await fetch("/api/health-ai-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: "user", content: command }],
          }),
        })
        const data = await response.text()
        aiResponse = data || "I'm processing your request. Could you please repeat that?"
      } catch (error) {
        aiResponse = "I'm having trouble processing that request. Please try again."
      }
    }

    setResponse(aiResponse)
    speakResponse(aiResponse)
  }

  const speakResponse = (text: string) => {
    if (synthesis) {
      setIsSpeaking(true)
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8

      utterance.onend = () => {
        setIsSpeaking(false)
      }

      synthesis.speak(utterance)
    }
  }

  const toggleVoiceAssistant = () => {
    if (isActive) {
      setIsActive(false)
      setIsListening(false)
      if (recognition) recognition.stop()
      if (synthesis) synthesis.cancel()
    } else {
      setIsActive(true)
      setIsListening(true)
      if (recognition) recognition.start()
      speakResponse("Voice assistant activated. How can I help with your health today?")
    }
  }

  const stopSpeaking = () => {
    if (synthesis) {
      synthesis.cancel()
      setIsSpeaking(false)
    }
  }

  return (
    <Card className={`transition-all duration-300 ${isActive ? "border-2 border-blue-500 shadow-lg" : ""}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          Voice Health Assistant
          {isActive && <Badge className="bg-green-500 text-white animate-pulse">Active</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Button
            onClick={toggleVoiceAssistant}
            className={`${
              isActive ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
            } transition-colors`}
          >
            {isActive ? (
              <>
                <MicOff className="h-4 w-4 mr-2" />
                Deactivate
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-2" />
                Activate Voice
              </>
            )}
          </Button>

          {isSpeaking && (
            <Button onClick={stopSpeaking} variant="outline" size="sm">
              <VolumeX className="h-4 w-4 mr-2" />
              Stop Speaking
            </Button>
          )}
        </div>

        {isActive && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isListening ? "bg-green-500 animate-pulse" : "bg-gray-300"}`} />
              <span className="text-sm text-gray-600">{isListening ? "Listening..." : "Not listening"}</span>
            </div>

            {transcript && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-800">You said:</p>
                <p className="text-sm text-blue-600">{transcript}</p>
              </div>
            )}

            {response && (
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm font-medium text-green-800">Assistant:</p>
                <p className="text-sm text-green-600">{response}</p>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Say "heart rate" to check your pulse</p>
          <p>• Say "blood pressure" for BP info</p>
          <p>• Say "medications" for pill reminders</p>
          <p>• Say "emergency" for urgent help</p>
        </div>
      </CardContent>
    </Card>
  )
}
