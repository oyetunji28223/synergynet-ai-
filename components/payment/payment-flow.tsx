"use client"

import { useState } from "react"
import { PricingPlans } from "./pricing-plans"
import { Checkout } from "./checkout"
import { PaymentSuccess } from "./payment-success"
import { PRICING_PLANS } from "@/lib/stripe"

interface PaymentFlowProps {
  onComplete: () => void
  currentPlan?: string
}

export function PaymentFlow({ onComplete, currentPlan }: PaymentFlowProps) {
  const [step, setStep] = useState<"plans" | "checkout" | "success">("plans")
  const [selectedPlan, setSelectedPlan] = useState<string>("")

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId)
    setStep("checkout")
  }

  const handleBackToPlans = () => {
    setStep("plans")
  }

  const handlePaymentSuccess = () => {
    setStep("success")
  }

  const handleComplete = () => {
    onComplete()
  }

  const selectedPlanData = selectedPlan ? PRICING_PLANS[selectedPlan as keyof typeof PRICING_PLANS] : null

  switch (step) {
    case "plans":
      return <PricingPlans onSelectPlan={handleSelectPlan} currentPlan={currentPlan} />

    case "checkout":
      return <Checkout selectedPlan={selectedPlan} onBack={handleBackToPlans} onSuccess={handlePaymentSuccess} />

    case "success":
      return <PaymentSuccess planName={selectedPlanData?.name || ""} onContinue={handleComplete} />

    default:
      return null
  }
}
