"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Shield, Lock, ArrowLeft, Zap } from "lucide-react"
import { PRICING_PLANS } from "@/lib/stripe"

interface CheckoutProps {
  selectedPlan: string
  onBack: () => void
  onSuccess: () => void
}

export function Checkout({ selectedPlan, onBack, onSuccess }: CheckoutProps) {
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">("stripe")
  const [formData, setFormData] = useState({
    email: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    name: "",
    address: "",
    city: "",
    zipCode: "",
  })

  const plan = PRICING_PLANS[selectedPlan as keyof typeof PRICING_PLANS]

  if (!plan) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // In real implementation, integrate with Stripe/PayPal
      console.log("Processing payment for:", plan.name)
      console.log("Payment method:", paymentMethod)
      console.log("Form data:", formData)

      onSuccess()
    } catch (error) {
      console.error("Payment failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <Button variant="ghost" onClick={onBack} className="mb-4 text-orange-600 hover:text-orange-700">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Plans
        </Button>

        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
          🔥 COMPLETE YOUR VITAFORGE TRANSFORMATION 🔥
        </h2>
        <p className="text-xl text-gray-600">You're one step away from unlocking ultimate health power!</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Order Summary */}
        <Card className="border-2 border-orange-200">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-orange-600" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-gray-600">{plan.forgeLevel}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">What's Included:</h4>
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${plan.price}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>First Month Discount (50%)</span>
                <span>-${plan.price / 2}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>$0</span>
              </div>
              <Separator />
              <div className="flex justify-between text-xl font-bold">
                <span>Total Today</span>
                <span className="text-green-600">${plan.price / 2}</span>
              </div>
              <p className="text-sm text-gray-500">Then ${plan.price}/month. Cancel anytime.</p>
            </div>

            {/* Trust Badges */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center gap-2 text-green-600">
                <Shield className="h-5 w-5" />
                <span className="text-sm">256-bit SSL Encryption</span>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <Lock className="h-5 w-5" />
                <span className="text-sm">PCI DSS Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <CreditCard className="h-5 w-5" />
                <span className="text-sm">30-Day Money Back Guarantee</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card className="border-2 border-gray-200">
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Payment Method Selection */}
              <div className="space-y-3">
                <Label>Payment Method</Label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("stripe")}
                    className={`p-4 border-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                      paymentMethod === "stripe"
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <CreditCard className="h-5 w-5" />
                    Credit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("paypal")}
                    className={`p-4 border-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                      paymentMethod === "paypal"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    💳 PayPal
                  </button>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>

              {paymentMethod === "stripe" && (
                <>
                  {/* Card Information */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          value={formData.expiryDate}
                          onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          value={formData.cvv}
                          onChange={(e) => handleInputChange("cvv", e.target.value)}
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Billing Information */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        placeholder="123 Main St"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          placeholder="New York"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          value={formData.zipCode}
                          onChange={(e) => handleInputChange("zipCode", e.target.value)}
                          placeholder="10001"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-4 text-lg font-bold bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing Payment...
                  </div>
                ) : (
                  <>
                    <Lock className="h-5 w-5 mr-2" />
                    Complete Payment - ${plan.price / 2}
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                By completing this purchase, you agree to our Terms of Service and Privacy Policy. Your payment is
                secured with 256-bit SSL encryption.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
