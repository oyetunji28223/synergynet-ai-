"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PaymentFlow } from "./components/payment/payment-flow"

const VitaforgeDashboard = () => {
  const [showPayment, setShowPayment] = useState(false)
  const [userPlan, setUserPlan] = useState("basic") // Default plan

  const handleUpgrade = () => {
    setShowPayment(true)
  }

  const handlePaymentComplete = () => {
    setShowPayment(false)
    // Refresh user data or update plan
  }

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vitaforge Dashboard</h1>
        <Button
          onClick={handleUpgrade}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold"
        >
          💳 UPGRADE TO PREMIUM
        </Button>
      </header>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Account Overview</h2>
        <p>Welcome to your Vitaforge dashboard. Here you can manage your account and access premium features.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Current Plan: {userPlan}</h2>
        {/* Display plan details and usage here */}
      </section>

      {showPayment && (
        <div className="fixed inset-0 bg-black/50 z-50 overflow-auto">
          <PaymentFlow onComplete={handlePaymentComplete} currentPlan={userPlan} />
        </div>
      )}
    </div>
  )
}

export default VitaforgeDashboard
