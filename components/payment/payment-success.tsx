"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Download, Zap, Crown, Gift } from "lucide-react"

interface PaymentSuccessProps {
  planName: string
  onContinue: () => void
}

export function PaymentSuccess({ planName, onContinue }: PaymentSuccessProps) {
  const [confetti, setConfetti] = useState(true)

  useEffect(() => {
    // Hide confetti after 5 seconds
    const timer = setTimeout(() => setConfetti(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      {confetti && (
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              {["🎉", "🔥", "⚡", "💚", "🚀"][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <Card className="max-w-2xl w-full border-4 border-green-500 shadow-2xl">
        <CardHeader className="text-center bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
          </div>
          <CardTitle className="text-4xl font-bold mb-2">🎉 PAYMENT SUCCESSFUL! 🎉</CardTitle>
          <p className="text-xl text-green-100">Welcome to the VitaForge transformation!</p>
        </CardHeader>

        <CardContent className="space-y-8 p-8">
          {/* Success Message */}
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-gray-800">Your {planName} is now active!</h3>
            <p className="text-gray-600">
              You now have access to all premium features and can start forging your perfect health immediately.
            </p>
          </div>

          {/* What's Next */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-center">🚀 What's Next?</h4>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardContent className="p-4 text-center">
                  <Download className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h5 className="font-bold text-blue-800">Download Mobile App</h5>
                  <p className="text-sm text-blue-600">Get the VitaForge app for iOS and Android</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-200 bg-purple-50">
                <CardContent className="p-4 text-center">
                  <Zap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h5 className="font-bold text-purple-800">Complete Setup</h5>
                  <p className="text-sm text-purple-600">Set up your health profile and goals</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-200 bg-orange-50">
                <CardContent className="p-4 text-center">
                  <Crown className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <h5 className="font-bold text-orange-800">Explore Premium Features</h5>
                  <p className="text-sm text-orange-600">Access AI health assistant and 3D visualization</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-200 bg-green-50">
                <CardContent className="p-4 text-center">
                  <Gift className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h5 className="font-bold text-green-800">Claim Bonuses</h5>
                  <p className="text-sm text-green-600">Get your welcome bonus and free consultation</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Special Offers */}
          <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
            <CardContent className="p-6 text-center">
              <h4 className="text-xl font-bold mb-2">🎁 WELCOME BONUS UNLOCKED!</h4>
              <div className="space-y-2">
                <Badge className="bg-white text-orange-600 font-bold">
                  FREE 1-on-1 Health Consultation ($200 value)
                </Badge>
                <Badge className="bg-white text-orange-600 font-bold">Premium Health Assessment ($150 value)</Badge>
                <Badge className="bg-white text-orange-600 font-bold">VitaForge Starter Kit ($100 value)</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Account Details */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="font-bold mb-4">📧 Account Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Plan:</span>
                <span className="font-bold">{planName}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <Badge className="bg-green-500">Active</Badge>
              </div>
              <div className="flex justify-between">
                <span>Next Billing:</span>
                <span>{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Confirmation:</span>
                <span className="font-mono">#VF{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <Button
            onClick={onContinue}
            className="w-full py-4 text-lg font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
          >
            <Zap className="h-5 w-5 mr-2" />
            Start Your Health Transformation Now!
          </Button>

          <p className="text-center text-sm text-gray-500">
            A confirmation email has been sent to your inbox with all the details.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
