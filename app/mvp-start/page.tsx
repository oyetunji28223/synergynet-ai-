"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export default function MVPStartPage() {
  const [step, setStep] = useState(1)
  const [setupData, setSetupData] = useState({
    openaiKey: "",
    youtubeClientId: "",
    supabaseUrl: "",
    testTopic: "",
  })

  const steps = [
    {
      title: "Environment Setup",
      description: "Configure your API keys and services",
      status: setupData.openaiKey && setupData.supabaseUrl ? "complete" : "pending",
    },
    {
      title: "YouTube Integration",
      description: "Connect your YouTube channels",
      status: setupData.youtubeClientId ? "complete" : "pending",
    },
    {
      title: "Test Content Generation",
      description: "Generate your first AI content",
      status: setupData.testTopic ? "complete" : "pending",
    },
    {
      title: "Deploy & Launch",
      description: "Go live with your automation",
      status: "pending",
    },
  ]

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">🚀 YouTube Automation MVP</h1>
        <p className="text-xl text-gray-600">Get your system running in 4 simple steps</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {steps.map((stepItem, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                  stepItem.status === "complete" ? "bg-green-500" : index + 1 === step ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                {stepItem.status === "complete" ? "✓" : index + 1}
              </div>
              <span className="text-sm mt-2 text-center max-w-20">{stepItem.title}</span>
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">{step}</span>
            {steps[step - 1].title}
            <Badge variant={steps[step - 1].status === "complete" ? "default" : "secondary"}>
              {steps[step - 1].status}
            </Badge>
          </CardTitle>
          <p className="text-gray-600">{steps[step - 1].description}</p>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">OpenAI API Key</label>
                <Input
                  placeholder="sk-..."
                  value={setupData.openaiKey}
                  onChange={(e) => setSetupData({ ...setupData, openaiKey: e.target.value })}
                />
                <p className="text-sm text-gray-500 mt-1">Get from platform.openai.com</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Supabase URL</label>
                <Input
                  placeholder="https://your-project.supabase.co"
                  value={setupData.supabaseUrl}
                  onChange={(e) => setSetupData({ ...setupData, supabaseUrl: e.target.value })}
                />
                <p className="text-sm text-gray-500 mt-1">From your Supabase project settings</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">YouTube Client ID</label>
                <Input
                  placeholder="your-client-id.googleusercontent.com"
                  value={setupData.youtubeClientId}
                  onChange={(e) => setSetupData({ ...setupData, youtubeClientId: e.target.value })}
                />
                <p className="text-sm text-gray-500 mt-1">From Google Cloud Console</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">📋 YouTube API Setup:</h4>
                <ol className="text-sm space-y-1 list-decimal list-inside">
                  <li>Go to Google Cloud Console</li>
                  <li>Create new project or select existing</li>
                  <li>Enable YouTube Data API v3</li>
                  <li>Create OAuth 2.0 credentials</li>
                  <li>Add your domain to authorized origins</li>
                </ol>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Test Topic</label>
                <Textarea
                  placeholder="Enter a topic for your first AI-generated video..."
                  value={setupData.testTopic}
                  onChange={(e) => setSetupData({ ...setupData, testTopic: e.target.value })}
                  rows={3}
                />
              </div>
              <Button
                onClick={() => alert("Content generation would start here!")}
                disabled={!setupData.testTopic}
                className="w-full"
              >
                🤖 Generate Test Content
              </Button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <h3 className="text-xl font-bold text-green-800 mb-2">🎉 Ready to Launch!</h3>
                <p className="text-green-700 mb-4">Your YouTube automation system is configured and ready to go.</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white p-3 rounded">
                    <div className="font-medium">Expected Output</div>
                    <div className="text-gray-600">5-10 videos/day</div>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <div className="font-medium">Revenue Target</div>
                    <div className="text-gray-600">$1K-5K/month</div>
                  </div>
                </div>
              </div>
              <Button className="w-full" size="lg">
                🚀 Deploy to Production
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>
          ← Previous
        </Button>
        <Button onClick={() => setStep(Math.min(4, step + 1))} disabled={step === 4}>
          Next →
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-3 gap-4 text-center">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">2-4 weeks</div>
          <div className="text-sm text-gray-600">To MVP</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">$100-500</div>
          <div className="text-sm text-gray-600">Initial Investment</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">15x ROI</div>
          <div className="text-sm text-gray-600">Potential Return</div>
        </div>
      </div>
    </div>
  )
}
