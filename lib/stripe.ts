import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export { stripePromise }

export const PRICING_PLANS = {
  basic: {
    id: "basic",
    name: "VitaForge Basic",
    price: 29,
    interval: "month",
    features: ["Basic Health Tracking", "Symptom Checker", "Wellness Tips", "Emergency Contacts", "Mobile App Access"],
    stripePriceId: "price_basic_monthly",
    popular: false,
    forgeLevel: "Bronze Forge",
  },
  pro: {
    id: "pro",
    name: "VitaForge Pro",
    price: 99,
    interval: "month",
    features: [
      "Everything in Basic",
      "AI Health Assistant",
      "3D Health Visualization",
      "Advanced Analytics",
      "Medication Tracking",
      "Telemedicine Access",
      "Priority Support",
    ],
    stripePriceId: "price_pro_monthly",
    popular: true,
    forgeLevel: "Silver Forge",
  },
  ultimate: {
    id: "ultimate",
    name: "VitaForge Ultimate",
    price: 299,
    interval: "month",
    features: [
      "Everything in Pro",
      "Quantum Health Engine",
      "Neural Interface Access",
      "Metaverse Health Clinic",
      "Crypto Health Rewards",
      "Personal Health Coach",
      "Unlimited Everything",
      "White-glove Service",
    ],
    stripePriceId: "price_ultimate_monthly",
    popular: false,
    forgeLevel: "Gold Forge",
  },
  enterprise: {
    id: "enterprise",
    name: "VitaForge Enterprise",
    price: 999,
    interval: "month",
    features: [
      "Everything in Ultimate",
      "Custom Integrations",
      "Dedicated Account Manager",
      "Advanced Security",
      "Custom Branding",
      "API Access",
      "Multi-location Support",
      "Enterprise Analytics",
    ],
    stripePriceId: "price_enterprise_monthly",
    popular: false,
    forgeLevel: "Platinum Forge",
  },
}
