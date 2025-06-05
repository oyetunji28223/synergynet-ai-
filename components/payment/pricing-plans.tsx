"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Zap, Shield, Sparkles, CreditCard } from "lucide-react"
import { PRICING_PLANS } from "@/lib/stripe"

interface PricingPlansProps {
  onSelectPlan: (planId: string) => void
  currentPlan?: string
}

export function PricingPlans({ onSelectPlan, currentPlan }: PricingPlansProps) {
  const [billingInterval, setBillingInterval] = useState<"month" | "year">("month")

  const getForgeIcon = (planId: string) => {
    switch (planId) {
      case "basic":
        return <Shield className="h-6 w-6 text-bronze" />
      case "pro":
        return <Zap className="h-6 w-6 text-silver" />
      case "ultimate":
        return <Crown className="h-6 w-6 text-gold" />
      case "enterprise":
        return <Sparkles className="h-6 w-6 text-platinum" />
      default:
        return <Shield className="h-6 w-6" />
    }
  }

  const getForgeGradient = (planId: string) => {
    switch (planId) {
      case "basic":
        return "from-orange-400 to-red-500"
      case "pro":
        return "from-blue-500 to-purple-600"
      case "ultimate":
        return "from-yellow-400 to-orange-500"
      case "enterprise":
        return "from-purple-600 to-pink-600"
      default:
        return "from-gray-400 to-gray-600"
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
          🔥 CHOOSE YOUR VITAFORGE POWER LEVEL 🔥
        </h2>
        <p className="text-xl text-gray-600 mb-6">Unlock the ultimate health transformation experience</p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className={billingInterval === "month" ? "font-bold" : "text-gray-500"}>Monthly</span>
          <button
            onClick={() => setBillingInterval(billingInterval === "month" ? "year" : "month")}
            className="relative w-16 h-8 bg-gray-300 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <div
              className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 ${
                billingInterval === "year" ? "transform translate-x-8" : ""
              }`}
            />
          </button>
          <span className={billingInterval === "year" ? "font-bold" : "text-gray-500"}>
            Yearly
            <Badge className="ml-2 bg-green-500">Save 20%</Badge>
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {Object.entries(PRICING_PLANS).map(([key, plan]) => {
          const yearlyPrice = Math.round(plan.price * 12 * 0.8)
          const displayPrice = billingInterval === "year" ? yearlyPrice : plan.price
          const isCurrentPlan = currentPlan === plan.id

          return (
            <Card
              key={plan.id}
              className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                plan.popular
                  ? "border-4 border-orange-500 shadow-2xl shadow-orange-500/25"
                  : "border-2 border-gray-200 hover:border-orange-300"
              } ${isCurrentPlan ? "ring-4 ring-green-500" : ""}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-red-600 text-white text-center py-2 font-bold">
                  🔥 MOST POPULAR 🔥
                </div>
              )}

              {isCurrentPlan && (
                <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center py-2 font-bold">
                  ✅ CURRENT PLAN
                </div>
              )}

              <CardHeader className={`text-center ${plan.popular || isCurrentPlan ? "pt-12" : "pt-6"}`}>
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${getForgeGradient(plan.id)} flex items-center justify-center`}
                >
                  {getForgeIcon(plan.id)}
                </div>

                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="text-sm text-gray-600 font-medium">{plan.forgeLevel}</div>

                <div className="mt-4">
                  <div className="text-4xl font-bold">
                    ${displayPrice}
                    <span className="text-lg text-gray-500">/{billingInterval === "year" ? "year" : "month"}</span>
                  </div>
                  {billingInterval === "year" && (
                    <div className="text-sm text-green-600 font-medium">Save ${plan.price * 12 - yearlyPrice}/year</div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => onSelectPlan(plan.id)}
                  disabled={isCurrentPlan}
                  className={`w-full py-3 text-lg font-bold transition-all duration-300 ${
                    plan.popular
                      ? "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
                      : isCurrentPlan
                        ? "bg-green-500 text-white cursor-not-allowed"
                        : "bg-gray-800 hover:bg-gray-900 text-white"
                  }`}
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  {isCurrentPlan ? "Current Plan" : `Forge ${plan.forgeLevel}`}
                </Button>

                {plan.id === "enterprise" && (
                  <div className="text-center">
                    <Button variant="outline" className="w-full">
                      Contact Sales
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Money Back Guarantee */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
        <CardContent className="text-center py-8">
          <div className="text-6xl mb-4">💰</div>
          <h3 className="text-2xl font-bold text-green-800 mb-2">30-Day Money Back Guarantee</h3>
          <p className="text-green-700">
            Not satisfied with your health transformation? Get a full refund within 30 days, no questions asked.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
