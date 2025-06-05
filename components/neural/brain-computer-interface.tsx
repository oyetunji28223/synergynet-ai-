"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Activity, Waves, Cpu, Wifi } from "lucide-react"

export function BrainComputerInterface() {
  const [isConnected, setIsConnected] = useState(false)
  const [brainwaves, setBrainwaves] = useState({
    alpha: 0,
    beta: 0,
    gamma: 0,
    delta: 0,
    theta: 0,
  })
  const [neuralHealth, setNeuralHealth] = useState({
    cognitiveLoad: 0,
    stressLevel: 0,
    focusLevel: 0,
    emotionalState: "neutral",
    memoryPerformance: 0,
    neuroplasticity: 0,
  })

  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        setBrainwaves({
          alpha: Math.random() * 100,
          beta: Math.random() * 100,
          gamma: Math.random() * 100,
          delta: Math.random() * 100,
          theta: Math.random() * 100,
        })

        setNeuralHealth({
          cognitiveLoad: Math.random() * 100,
          stressLevel: Math.random() * 100,
          focusLevel: Math.random() * 100,
          emotionalState: ["happy", "calm", "focused", "stressed", "excited"][Math.floor(Math.random() * 5)],
          memoryPerformance: Math.random() * 100,
          neuroplasticity: Math.random() * 100,
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isConnected])

  const connectNeural = () => {
    setIsConnected(!isConnected)
  }

  const getEmotionalColor = (emotion: string) => {
    switch (emotion) {
      case "happy":
        return "text-yellow-400"
      case "calm":
        return "text-blue-400"
      case "focused":
        return "text-green-400"
      case "stressed":
        return "text-red-400"
      case "excited":
        return "text-purple-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white border-2 border-pink-400">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Brain className="h-8 w-8 text-pink-400" />
            Neural Interface System
            <Badge className="bg-pink-400 text-black font-bold animate-pulse">NEURAL</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              onClick={connectNeural}
              className={`${isConnected ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
            >
              <Wifi className="h-4 w-4 mr-2" />
              {isConnected ? "Disconnect Neural Link" : "Connect Neural Interface"}
            </Button>
            {isConnected && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400">Neural link active</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {isConnected && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-black/90 border-2 border-blue-400">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <Waves className="h-5 w-5" />
                Real-time Brainwave Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(brainwaves).map(([wave, value]) => (
                <div key={wave} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white capitalize">{wave} waves</span>
                    <span className="text-blue-400">{value.toFixed(1)}%</span>
                  </div>
                  <Progress value={value} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-black/90 border-2 border-purple-400">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Neural Health Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-white">Cognitive Load</span>
                  <span className="text-purple-400">{neuralHealth.cognitiveLoad.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Stress Level</span>
                  <span className="text-red-400">{neuralHealth.stressLevel.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Focus Level</span>
                  <span className="text-green-400">{neuralHealth.focusLevel.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Emotional State</span>
                  <span className={getEmotionalColor(neuralHealth.emotionalState)}>{neuralHealth.emotionalState}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Memory Performance</span>
                  <span className="text-blue-400">{neuralHealth.memoryPerformance.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Neuroplasticity</span>
                  <span className="text-yellow-400">{neuralHealth.neuroplasticity.toFixed(1)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="bg-gradient-to-br from-cyan-900 to-teal-900 text-white border-cyan-400">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            Neural Enhancement Protocols
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-black/30 p-4 rounded-lg">
              <h4 className="font-bold text-cyan-400">Cognitive Boost</h4>
              <p className="text-sm text-gray-300">+47% memory enhancement</p>
              <p className="text-sm text-gray-300">+23% processing speed</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg">
              <h4 className="font-bold text-green-400">Stress Reduction</h4>
              <p className="text-sm text-gray-300">-89% cortisol levels</p>
              <p className="text-sm text-gray-300">+156% relaxation</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg">
              <h4 className="font-bold text-purple-400">Neural Repair</h4>
              <p className="text-sm text-gray-300">+234% neurogenesis</p>
              <p className="text-sm text-gray-300">+67% synaptic density</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
