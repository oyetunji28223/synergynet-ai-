"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useChat } from "ai/react"
import { Mic, MicOff, Send, Bot, User, Volume2, VolumeX } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface HealthAIChatProps {
  userHealthData?: any
}

export function HealthAIChat({ userHealthData }: HealthAIChatProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [recognition, setRecognition] = useState<any>(null)
  const [synthesis, setSynthesis] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/health-ai-chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: `Hello! I'm your AI Health Assistant. I can help you with:
        
• Symptom analysis and recommendations
• Medication reminders and interactions
• Health goal tracking and motivation
• Emergency guidance and first aid
• Wellness tips and lifestyle advice
• Lab result interpretation
• Mental health support

How can I assist you with your health today?`,
      },
    ],
    onFinish: (message) => {
      if (synthesis && !isSpeaking) {
        speakMessage(message.content)
      }
    },
  })

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.lang = "en-US"

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        handleInputChange({ target: { value: transcript } } as any)
      }

      recognitionInstance.onend = () => {
        setIsListening(false)
      }

      setRecognition(recognitionInstance)
    }

    // Initialize speech synthesis
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSynthesis(window.speechSynthesis)
    }

    scrollToBottom()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const startListening = () => {
    if (recognition) {
      setIsListening(true)
      recognition.start()
    }
  }

  const stopListening = () => {
    if (recognition) {
      recognition.stop()
      setIsListening(false)
    }
  }

  const speakMessage = (text: string) => {
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

  const stopSpeaking = () => {
    if (synthesis) {
      synthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      handleSubmit(e)
    }
  }

  const getMessageIcon = (role: string) => {
    return role === "assistant" ? (
      <Bot className="h-6 w-6 text-blue-600" />
    ) : (
      <User className="h-6 w-6 text-green-600" />
    )
  }

  return (
    <Card className="h-[600px] flex flex-col bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200 shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-6 w-6" />
          AI Health Assistant
          <Badge variant="secondary" className="ml-auto">
            Premium AI
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
              >
                {message.role === "assistant" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    {getMessageIcon(message.role)}
                  </div>
                )}

                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === "assistant"
                      ? "bg-white border border-blue-200 shadow-sm"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>

                  {message.role === "assistant" && (
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => speakMessage(message.content)}
                        disabled={isSpeaking}
                        className="h-6 px-2 text-xs"
                      >
                        {isSpeaking ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                      </Button>
                    </div>
                  )}
                </div>

                {message.role === "user" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    {getMessageIcon(message.role)}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-blue-600" />
                </div>
                <div className="bg-white border border-blue-200 rounded-lg p-3 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        <div className="border-t bg-white p-4">
          <form onSubmit={handleFormSubmit} className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask about your health, symptoms, medications..."
                className="pr-12 border-2 border-blue-200 focus:border-blue-400"
                disabled={isLoading}
              />
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className={`absolute right-1 top-1 h-8 w-8 p-0 ${isListening ? "text-red-600" : "text-gray-400"}`}
                onClick={isListening ? stopListening : startListening}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>

          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              Voice enabled
            </Badge>
            <Badge variant="outline" className="text-xs">
              Real-time analysis
            </Badge>
            <Badge variant="outline" className="text-xs">
              HIPAA compliant
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
