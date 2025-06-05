"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Download, Star, Crown, Zap, Heart } from "lucide-react"

const mobileTemplates = [
  {
    id: 1,
    name: "HealthTracker Pro",
    category: "Health & Fitness",
    price: 399,
    rating: 4.9,
    downloads: 25430,
    platforms: ["iOS", "Android", "React Native"],
    features: [
      "Health Metrics Dashboard",
      "Workout Tracking",
      "Nutrition Logger",
      "Sleep Monitoring",
      "Heart Rate Integration",
      "Social Sharing",
      "Premium Analytics",
      "Wearable Sync",
    ],
    screens: 45,
    colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"],
    mockup: "📱",
  },
  {
    id: 2,
    name: "MedConnect Telemedicine",
    category: "Medical",
    price: 599,
    rating: 5.0,
    downloads: 18920,
    platforms: ["iOS", "Android", "Flutter"],
    features: [
      "Video Consultations",
      "Appointment Booking",
      "Prescription Management",
      "Medical Records",
      "Payment Integration",
      "Doctor Profiles",
      "Chat Messaging",
      "Emergency Contacts",
    ],
    screens: 60,
    colors: ["#667eea", "#764ba2", "#f093fb", "#f5576c", "#4facfe"],
    mockup: "🏥",
  },
  {
    id: 3,
    name: "FitnessPro Trainer",
    category: "Fitness",
    price: 449,
    rating: 4.8,
    downloads: 32150,
    platforms: ["iOS", "Android", "React Native"],
    features: [
      "Workout Plans",
      "Exercise Library",
      "Progress Tracking",
      "Nutrition Plans",
      "Personal Trainer Chat",
      "Video Workouts",
      "Achievement System",
      "Social Community",
    ],
    screens: 50,
    colors: ["#FF9A8B", "#A8E6CF", "#FFD93D", "#6BCF7F", "#4D96FF"],
    mockup: "💪",
  },
  {
    id: 4,
    name: "MindfulMed Wellness",
    category: "Mental Health",
    price: 499,
    rating: 4.9,
    downloads: 21780,
    platforms: ["iOS", "Android", "Flutter"],
    features: [
      "Meditation Sessions",
      "Mood Tracking",
      "Therapy Booking",
      "Mindfulness Exercises",
      "Sleep Stories",
      "Breathing Exercises",
      "Progress Analytics",
      "Community Support",
    ],
    screens: 40,
    colors: ["#A8E6CF", "#88D8B0", "#68C3A3", "#4ECDC4", "#45B7D1"],
    mockup: "🧘",
  },
  {
    id: 5,
    name: "PharmaCare Manager",
    category: "Healthcare",
    price: 549,
    rating: 4.7,
    downloads: 16540,
    platforms: ["iOS", "Android", "React Native"],
    features: [
      "Medication Reminders",
      "Pill Identification",
      "Drug Interactions",
      "Pharmacy Locator",
      "Prescription Refills",
      "Health Reports",
      "Doctor Communication",
      "Insurance Integration",
    ],
    screens: 35,
    colors: ["#74b9ff", "#0984e3", "#00b894", "#00cec9", "#6c5ce7"],
    mockup: "💊",
  },
  {
    id: 6,
    name: "VitalSigns Monitor",
    category: "Medical Devices",
    price: 699,
    rating: 5.0,
    downloads: 12890,
    platforms: ["iOS", "Android", "Flutter"],
    features: [
      "Real-time Monitoring",
      "Device Integration",
      "Alert System",
      "Data Export",
      "Cloud Sync",
      "Family Sharing",
      "Emergency Protocols",
      "AI Health Insights",
    ],
    screens: 55,
    colors: ["#fd79a8", "#fdcb6e", "#6c5ce7", "#74b9ff", "#00b894"],
    mockup: "📊",
  },
]

export function MobileAppTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)

  const handlePreview = (template: any) => {
    setSelectedTemplate(template)
  }

  return (
    <div className="space-y-8">
      {/* Premium Header */}
      <Card className="bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 text-white border-4 border-gold">
        <CardHeader>
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-gold via-white to-gold bg-clip-text text-transparent">
              📱 PREMIUM MOBILE APP TEMPLATES 📱
            </h1>
            <p className="text-xl text-blue-200">
              Professional mobile app designs that generate millions in app store revenue
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <Badge className="bg-gold text-black text-lg px-4 py-2">
                <Crown className="h-5 w-5 mr-2" />
                APP STORE READY
              </Badge>
              <Badge className="bg-green-500 text-white text-lg px-4 py-2">
                <Smartphone className="h-5 w-5 mr-2" />
                NATIVE CODE
              </Badge>
              <Badge className="bg-purple-500 text-white text-lg px-4 py-2">
                <Zap className="h-5 w-5 mr-2" />
                INSTANT DEPLOY
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Mobile App Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {mobileTemplates.map((template) => (
          <Card
            key={template.id}
            className="group hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-purple-400 bg-white overflow-hidden"
          >
            <CardHeader className="p-0">
              <div className="relative">
                <div
                  className="h-64 flex items-center justify-center text-8xl"
                  style={{
                    background: `linear-gradient(135deg, ${template.colors[0]}, ${template.colors[1]}, ${template.colors[2]})`,
                  }}
                >
                  {template.mockup}
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-black/80 text-white">{template.screens} Screens</Badge>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button onClick={() => handlePreview(template)} className="bg-white text-black hover:bg-gray-100">
                    <Smartphone className="h-4 w-4 mr-2" />
                    Preview App
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{template.name}</h3>
                  <Badge variant="outline" className="mt-1">
                    {template.category}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">${template.price}</div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {template.rating}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {template.colors.map((color, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {template.platforms.map((platform, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {platform}
                  </Badge>
                ))}
              </div>

              <div className="space-y-1 mb-4 max-h-32 overflow-y-auto">
                {template.features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    {feature}
                  </div>
                ))}
                {template.features.length > 4 && (
                  <div className="text-sm text-gray-500">+{template.features.length - 4} more features</div>
                )}
              </div>

              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span>{template.downloads.toLocaleString()} downloads</span>
                <Badge variant="outline" className="text-purple-600 border-purple-600">
                  Bestseller
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => handlePreview(template)}>
                  <Smartphone className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                  <Download className="h-4 w-4 mr-2" />${template.price}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mobile App Preview Modal */}
      {selectedTemplate && (
        <Card className="fixed inset-4 z-50 bg-white border-4 border-purple-400 shadow-2xl overflow-auto">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">{selectedTemplate.name} - Mobile Preview</CardTitle>
              <Button
                variant="ghost"
                onClick={() => setSelectedTemplate(null)}
                className="text-white hover:bg-white/20"
              >
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="text-center">
                <div
                  className="w-80 h-96 mx-auto rounded-3xl flex items-center justify-center text-9xl shadow-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${selectedTemplate.colors[0]}, ${selectedTemplate.colors[1]}, ${selectedTemplate.colors[2]})`,
                  }}
                >
                  {selectedTemplate.mockup}
                </div>
                <div className="mt-4 text-lg font-semibold">{selectedTemplate.screens} Screens Included</div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-4">App Features</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedTemplate.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-4">Platforms Supported</h3>
                  <div className="flex gap-2">
                    {selectedTemplate.platforms.map((platform: string, index: number) => (
                      <Badge key={index} className="bg-blue-500 text-white">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-4">What You Get</h3>
                  <div className="space-y-2 text-gray-600">
                    <div>• Complete source code for all platforms</div>
                    <div>• {selectedTemplate.screens} professionally designed screens</div>
                    <div>• Figma design files with components</div>
                    <div>• App store assets and icons</div>
                    <div>• Documentation and setup guide</div>
                    <div>• 1 year of free updates</div>
                    <div>• Commercial license for unlimited apps</div>
                    <div>• Priority support and customization</div>
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <div className="text-3xl font-bold text-green-600 mb-2">${selectedTemplate.price}</div>
                  <div className="text-gray-600 mb-4">Complete mobile app template</div>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-lg py-3">
                    <Download className="h-5 w-5 mr-2" />
                    Purchase & Download
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Revenue Stats */}
      <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <CardHeader>
          <CardTitle className="text-3xl text-center">📈 MOBILE APP SUCCESS METRICS 📈</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4 text-center">
            <div className="bg-black/20 p-6 rounded-lg">
              <div className="text-3xl font-bold mb-2">$5M+</div>
              <div className="text-lg">App Store Revenue</div>
              <div className="text-sm opacity-90">Generated by our templates</div>
            </div>
            <div className="bg-black/20 p-6 rounded-lg">
              <div className="text-3xl font-bold mb-2">2.5M+</div>
              <div className="text-lg">App Downloads</div>
              <div className="text-sm opacity-90">Across all platforms</div>
            </div>
            <div className="bg-black/20 p-6 rounded-lg">
              <div className="text-3xl font-bold mb-2">4.8★</div>
              <div className="text-lg">Average Rating</div>
              <div className="text-sm opacity-90">App store reviews</div>
            </div>
            <div className="bg-black/20 p-6 rounded-lg">
              <div className="text-3xl font-bold mb-2">95%</div>
              <div className="text-lg">Success Rate</div>
              <div className="text-sm opacity-90">Apps launched successfully</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
