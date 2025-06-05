"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Eye, Star, Crown, Sparkles, Layout, Zap } from "lucide-react"

const templateCategories = {
  medical: {
    name: "Medical & Healthcare",
    icon: "🏥",
    templates: [
      {
        id: 1,
        name: "HealthTech Pro Dashboard",
        price: 299,
        rating: 4.9,
        downloads: 15420,
        preview: "/api/placeholder/600/400",
        features: ["Responsive Design", "Dark/Light Mode", "Analytics Charts", "Patient Management"],
        colors: ["#0066CC", "#00CC66", "#FF6B35", "#6B73FF"],
      },
      {
        id: 2,
        name: "Medical Clinic Website",
        price: 199,
        rating: 4.8,
        downloads: 8934,
        preview: "/api/placeholder/600/400",
        features: ["Appointment Booking", "Doctor Profiles", "Service Pages", "Contact Forms"],
        colors: ["#2563EB", "#059669", "#DC2626", "#7C3AED"],
      },
      {
        id: 3,
        name: "Telemedicine App UI",
        price: 399,
        rating: 5.0,
        downloads: 23156,
        preview: "/api/placeholder/600/400",
        features: ["Video Call Interface", "Chat System", "Prescription Management", "Health Records"],
        colors: ["#1E40AF", "#10B981", "#F59E0B", "#EF4444"],
      },
    ],
  },
  business: {
    name: "Business & Corporate",
    icon: "💼",
    templates: [
      {
        id: 4,
        name: "SaaS Landing Page Pro",
        price: 249,
        rating: 4.9,
        downloads: 34567,
        preview: "/api/placeholder/600/400",
        features: ["Conversion Optimized", "A/B Testing Ready", "Payment Integration", "Analytics"],
        colors: ["#6366F1", "#8B5CF6", "#EC4899", "#F59E0B"],
      },
      {
        id: 5,
        name: "Corporate Dashboard Elite",
        price: 349,
        rating: 4.8,
        downloads: 19283,
        preview: "/api/placeholder/600/400",
        features: ["Real-time Data", "Custom Charts", "Team Management", "Report Generation"],
        colors: ["#1F2937", "#374151", "#6B7280", "#9CA3AF"],
      },
      {
        id: 6,
        name: "Startup Pitch Deck",
        price: 149,
        rating: 4.7,
        downloads: 45678,
        preview: "/api/placeholder/600/400",
        features: ["Investor Ready", "Financial Projections", "Market Analysis", "Team Slides"],
        colors: ["#F97316", "#EAB308", "#22C55E", "#3B82F6"],
      },
    ],
  },
  ecommerce: {
    name: "E-commerce & Retail",
    icon: "🛒",
    templates: [
      {
        id: 7,
        name: "Luxury E-commerce Store",
        price: 399,
        rating: 4.9,
        downloads: 28934,
        preview: "/api/placeholder/600/400",
        features: ["Product Showcase", "Shopping Cart", "Payment Gateway", "Inventory Management"],
        colors: ["#000000", "#FFFFFF", "#D4AF37", "#C0392B"],
      },
      {
        id: 8,
        name: "Fashion Brand Website",
        price: 279,
        rating: 4.8,
        downloads: 16745,
        preview: "/api/placeholder/600/400",
        features: ["Lookbook Gallery", "Size Guide", "Wishlist", "Social Integration"],
        colors: ["#FF69B4", "#FFB6C1", "#FFC0CB", "#FF1493"],
      },
      {
        id: 9,
        name: "Tech Store Dashboard",
        price: 329,
        rating: 4.9,
        downloads: 21567,
        preview: "/api/placeholder/600/400",
        features: ["Product Comparison", "Tech Specs", "Review System", "Support Chat"],
        colors: ["#1A1A1A", "#333333", "#0099FF", "#00FF99"],
      },
    ],
  },
}

export function PremiumTemplateShowcase() {
  const [selectedCategory, setSelectedCategory] = useState("medical")
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)

  const handlePreview = (template: any) => {
    setSelectedTemplate(template)
  }

  const handleDownload = (template: any) => {
    // Simulate download
    console.log(`Downloading ${template.name}`)
  }

  return (
    <div className="space-y-8">
      {/* Premium Header */}
      <Card className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white border-2 border-gold">
        <CardHeader>
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-gold via-white to-gold bg-clip-text text-transparent">
              ✨ PREMIUM DIGITAL TEMPLATES ✨
            </h1>
            <p className="text-xl text-blue-200">
              World-class designs that generate millions in revenue for our clients
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <Badge className="bg-gold text-black text-lg px-4 py-2">
                <Crown className="h-5 w-5 mr-2" />
                PREMIUM QUALITY
              </Badge>
              <Badge className="bg-green-500 text-white text-lg px-4 py-2">
                <Sparkles className="h-5 w-5 mr-2" />
                BEST SELLERS
              </Badge>
              <Badge className="bg-purple-500 text-white text-lg px-4 py-2">
                <Zap className="h-5 w-5 mr-2" />
                INSTANT DOWNLOAD
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Revenue Stats */}
      <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-4 text-center">
            <div>
              <div className="text-3xl font-bold">$2.4M+</div>
              <div className="text-sm opacity-90">Total Revenue Generated</div>
            </div>
            <div>
              <div className="text-3xl font-bold">156K+</div>
              <div className="text-sm opacity-90">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold">4.9★</div>
              <div className="text-sm opacity-90">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm opacity-90">Premium Templates</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Template Categories */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-3 mb-8 bg-black/20 border border-purple-400">
          {Object.entries(templateCategories).map(([key, category]) => (
            <TabsTrigger
              key={key}
              value={key}
              className="flex items-center gap-2 text-lg py-3 data-[state=active]:bg-purple-600"
            >
              <span className="text-2xl">{category.icon}</span>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(templateCategories).map(([key, category]) => (
          <TabsContent key={key} value={key}>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {category.templates.map((template) => (
                <Card
                  key={template.id}
                  className="group hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-purple-400 bg-white"
                >
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <div
                        className="h-48 bg-gradient-to-br from-purple-400 via-blue-500 to-indigo-600 flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${template.colors[0]}, ${template.colors[1]}, ${template.colors[2]})`,
                        }}
                      >
                        <div className="text-white text-center">
                          <Layout className="h-16 w-16 mx-auto mb-2 opacity-80" />
                          <div className="text-lg font-bold">{template.name}</div>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handlePreview(template)}
                            className="bg-white text-black hover:bg-gray-100"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleDownload(template)}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Buy
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-800">{template.name}</h3>
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

                    <div className="space-y-2 mb-4">
                      {template.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                      <span>{template.downloads.toLocaleString()} downloads</span>
                      <Badge variant="outline" className="text-purple-600 border-purple-600">
                        Trending
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" onClick={() => handlePreview(template)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                        onClick={() => handleDownload(template)}
                      >
                        <Download className="h-4 w-4 mr-2" />${template.price}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <Card className="fixed inset-4 z-50 bg-white border-4 border-purple-400 shadow-2xl overflow-auto">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">{selectedTemplate.name} - Live Preview</CardTitle>
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
              <div>
                <div
                  className="h-96 rounded-lg flex items-center justify-center text-white text-2xl font-bold"
                  style={{
                    background: `linear-gradient(135deg, ${selectedTemplate.colors[0]}, ${selectedTemplate.colors[1]}, ${selectedTemplate.colors[2]})`,
                  }}
                >
                  {selectedTemplate.name}
                  <br />
                  Live Preview
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Template Features</h3>
                  <div className="space-y-3">
                    {selectedTemplate.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                        <span className="text-lg">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-4">What's Included</h3>
                  <div className="space-y-2 text-gray-600">
                    <div>• Complete source code (HTML, CSS, JS)</div>
                    <div>• React/Next.js components</div>
                    <div>• Figma design files</div>
                    <div>• Documentation & setup guide</div>
                    <div>• 6 months of free updates</div>
                    <div>• Commercial license included</div>
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <div className="text-3xl font-bold text-green-600 mb-2">${selectedTemplate.price}</div>
                  <div className="text-gray-600 mb-4">One-time purchase, lifetime access</div>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-lg py-3"
                    onClick={() => handleDownload(selectedTemplate)}
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Purchase & Download Now
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
