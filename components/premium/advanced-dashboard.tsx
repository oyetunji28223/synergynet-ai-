"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, Heart, Activity, Zap, Shield, Crown, Smartphone, Wifi, BarChart3 } from "lucide-react"
import { HealthScene } from "../3d/health-scene"
import { HealthAIChat } from "../ai/health-ai-chat"

interface AdvancedDashboardProps {
  user: any
  healthData: any
}

export function AdvancedDashboard({ user, healthData }: AdvancedDashboardProps) {
  const [realTimeData, setRealTimeData] = useState({
    heartRate: 72,
    bloodOxygen: 98,
    stressLevel: 3,
    sleepQuality: 85,
    activityLevel: 7200,
  })

  const [aiInsights, setAiInsights] = useState([
    {
      type: "warning",
      title: "Blood Pressure Trend",
      message: "Your blood pressure has been slightly elevated over the past week. Consider reducing sodium intake.",
      confidence: 87,
    },
    {
      type: "success",
      title: "Exercise Progress",
      message: "Excellent! You've exceeded your weekly activity goal by 23%. Keep up the great work!",
      confidence: 95,
    },
    {
      type: "info",
      title: "Sleep Optimization",
      message:
        "Your sleep quality could improve with a consistent bedtime routine. Try going to bed 30 minutes earlier.",
      confidence: 78,
    },
  ])

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData((prev) => ({
        ...prev,
        heartRate: prev.heartRate + (Math.random() - 0.5) * 4,
        bloodOxygen: Math.max(95, Math.min(100, prev.bloodOxygen + (Math.random() - 0.5) * 2)),
        stressLevel: Math.max(1, Math.min(10, prev.stressLevel + (Math.random() - 0.5) * 2)),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getInsightColor = (type: string) => {
    switch (type) {
      case "warning":
        return "border-yellow-500 bg-yellow-50"
      case "success":
        return "border-green-500 bg-green-50"
      case "info":
        return "border-blue-500 bg-blue-50"
      default:
        return "border-gray-500 bg-gray-50"
    }
  }

  return (
    <div className="space-y-6">
      {/* Premium Header */}
      <Card className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Crown className="h-6 w-6 text-yellow-400" />
                Premium Health Intelligence
              </CardTitle>
              <CardDescription className="text-blue-100">
                Advanced AI-powered health monitoring and insights
              </CardDescription>
            </div>
            <Badge className="bg-yellow-400 text-black font-bold">PRO</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* 3D Health Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            3D Health Visualization
          </CardTitle>
          <CardDescription>Interactive 3D representation of your health metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <HealthScene healthData={healthData} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* AI Chat Interface */}
        <div>
          <HealthAIChat userHealthData={healthData} />
        </div>

        {/* Real-time Monitoring */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5 text-green-500" />
                Real-time Monitoring
                <Badge variant="outline" className="ml-auto">
                  Live
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    <span className="font-medium">Heart Rate</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600">{Math.round(realTimeData.heartRate)}</div>
                    <div className="text-xs text-gray-500">BPM</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">Blood Oxygen</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{Math.round(realTimeData.bloodOxygen)}%</div>
                    <div className="text-xs text-gray-500">SpO2</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-500" />
                    <span className="font-medium">Stress Level</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">{Math.round(realTimeData.stressLevel)}/10</div>
                    <div className="text-xs text-gray-500">Stress Index</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                AI Health Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {aiInsights.map((insight, index) => (
                  <div key={index} className={`p-3 rounded-lg border-l-4 ${getInsightColor(insight.type)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{insight.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{insight.message}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {insight.confidence}% confident
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Advanced Features */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Smartphone className="h-5 w-5" />
              Wearable Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Connect your smartwatch, fitness tracker, and health devices for comprehensive monitoring.
            </p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Connect Devices</Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <BarChart3 className="h-5 w-5" />
              Predictive Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              AI-powered predictions for health risks and personalized prevention strategies.
            </p>
            <Button className="w-full bg-green-600 hover:bg-green-700">View Predictions</Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Shield className="h-5 w-5" />
              Health Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Enterprise-grade security with blockchain health records and privacy protection.
            </p>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">Security Settings</Button>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Features */}
      <Card className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white border-0">
        <CardHeader>
          <CardTitle className="text-xl">🚀 Monetization Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <h4 className="font-semibold">Telemedicine</h4>
              <p className="text-sm opacity-90">Connect with doctors instantly</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <h4 className="font-semibold">Health Insurance</h4>
              <p className="text-sm opacity-90">AI-optimized coverage plans</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <h4 className="font-semibold">Wellness Marketplace</h4>
              <p className="text-sm opacity-90">Personalized health products</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <h4 className="font-semibold">Corporate Wellness</h4>
              <p className="text-sm opacity-90">Enterprise health solutions</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
