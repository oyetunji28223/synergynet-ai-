"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Palette, Code, Sparkles, Crown, Zap } from "lucide-react"

const designSystems = [
  {
    id: 1,
    name: "HealthTech Design System Pro",
    price: 599,
    category: "Healthcare",
    components: 150,
    variants: 500,
    colors: ["#0066FF", "#00CC66", "#FF6B35", "#6B73FF", "#FF0080"],
    features: [
      "150+ Premium Components",
      "500+ Design Variants",
      "Dark & Light Themes",
      "Accessibility Compliant",
      "Figma + React + Vue",
      "Design Tokens",
      "Animation Library",
      "Icon Set (1000+ icons)",
    ],
    preview: {
      buttons: ["Primary", "Secondary", "Success", "Warning", "Danger"],
      cards: ["Basic Card", "Feature Card", "Pricing Card", "Testimonial Card"],
      forms: ["Login Form", "Contact Form", "Multi-step Form", "Survey Form"],
    },
  },
  {
    id: 2,
    name: "SaaS Dashboard Design System",
    price: 799,
    category: "Business",
    components: 200,
    variants: 750,
    colors: ["#6366F1", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981"],
    features: [
      "200+ Dashboard Components",
      "750+ UI Variations",
      "Advanced Charts Library",
      "Data Visualization Kit",
      "Admin Panel Templates",
      "Mobile Responsive",
      "TypeScript Support",
      "Storybook Documentation",
    ],
    preview: {
      charts: ["Line Chart", "Bar Chart", "Pie Chart", "Area Chart"],
      tables: ["Data Table", "Sortable Table", "Filterable Table", "Editable Table"],
      navigation: ["Sidebar", "Top Nav", "Breadcrumbs", "Pagination"],
    },
  },
  {
    id: 3,
    name: "E-commerce Design System Elite",
    price: 899,
    category: "E-commerce",
    components: 180,
    variants: 600,
    colors: ["#000000", "#FFFFFF", "#D4AF37", "#C0392B", "#2ECC71"],
    features: [
      "180+ E-commerce Components",
      "600+ Product Variants",
      "Shopping Cart System",
      "Payment UI Components",
      "Product Gallery Kit",
      "Review & Rating System",
      "Checkout Flow Templates",
      "Mobile Commerce UI",
    ],
    preview: {
      products: ["Product Card", "Product Grid", "Product Detail", "Quick View"],
      cart: ["Mini Cart", "Cart Page", "Checkout Steps", "Order Summary"],
      user: ["User Profile", "Order History", "Wishlist", "Account Settings"],
    },
  },
]

export function DesignSystemTemplates() {
  const [selectedSystem, setSelectedSystem] = useState(designSystems[0])
  const [activePreview, setActivePreview] = useState("components")

  return (
    <div className="space-y-8">
      {/* Premium Header */}
      <Card className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white border-4 border-gold">
        <CardHeader>
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-gold via-white to-gold bg-clip-text text-transparent">
              🎨 ULTRA-PREMIUM DESIGN SYSTEMS 🎨
            </h1>
            <p className="text-xl text-purple-200">Professional design systems used by Fortune 500 companies</p>
            <div className="flex justify-center gap-4 mt-6">
              <Badge className="bg-gold text-black text-lg px-4 py-2">
                <Crown className="h-5 w-5 mr-2" />
                ENTERPRISE GRADE
              </Badge>
              <Badge className="bg-purple-500 text-white text-lg px-4 py-2">
                <Palette className="h-5 w-5 mr-2" />
                DESIGN SYSTEMS
              </Badge>
              <Badge className="bg-blue-500 text-white text-lg px-4 py-2">
                <Code className="h-5 w-5 mr-2" />
                FULL CODE
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Design System Selector */}
      <div className="grid gap-6 lg:grid-cols-3">
        {designSystems.map((system) => (
          <Card
            key={system.id}
            className={`cursor-pointer transition-all duration-300 ${
              selectedSystem.id === system.id
                ? "border-4 border-purple-500 shadow-2xl scale-105"
                : "border-2 border-gray-200 hover:border-purple-300"
            }`}
            onClick={() => setSelectedSystem(system)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{system.name}</CardTitle>
                  <Badge variant="outline" className="mt-2">
                    {system.category}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">${system.price}</div>
                  <div className="text-sm text-gray-500">{system.components} components</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-1 mb-4">
                {system.colors.map((color, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded-lg border-2 border-white shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <div>{system.components} Components</div>
                <div>{system.variants} Variants</div>
                <div>Figma + Code</div>
                <div>Commercial License</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Design System Details */}
      <Card className="border-4 border-purple-400">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <CardTitle className="text-3xl flex items-center gap-2">
            <Sparkles className="h-8 w-8" />
            {selectedSystem.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Features */}
            <div>
              <h3 className="text-2xl font-bold mb-6">What's Included</h3>
              <div className="space-y-4">
                {selectedSystem.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-lg">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200">
                <div className="text-3xl font-bold text-green-600 mb-2">${selectedSystem.price}</div>
                <div className="text-gray-600 mb-4">Complete design system package</div>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-lg py-3">
                  <Zap className="h-5 w-5 mr-2" />
                  Purchase Design System
                </Button>
              </div>
            </div>

            {/* Preview */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Live Component Preview</h3>
              <Tabs value={activePreview} onValueChange={setActivePreview}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="components">Components</TabsTrigger>
                  <TabsTrigger value="colors">Colors</TabsTrigger>
                  <TabsTrigger value="layouts">Layouts</TabsTrigger>
                </TabsList>

                <TabsContent value="components" className="mt-6">
                  <div className="space-y-4">
                    {/* Button Examples */}
                    <div>
                      <h4 className="font-semibold mb-3">Buttons</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedSystem.preview.buttons?.map((button, index) => (
                          <Button
                            key={index}
                            variant={index === 0 ? "default" : "outline"}
                            style={{
                              backgroundColor: index === 0 ? selectedSystem.colors[0] : "transparent",
                              borderColor: selectedSystem.colors[0],
                              color: index === 0 ? "white" : selectedSystem.colors[0],
                            }}
                          >
                            {button}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Card Examples */}
                    <div>
                      <h4 className="font-semibold mb-3">Cards</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedSystem.preview.cards?.map((card, index) => (
                          <div
                            key={index}
                            className="p-4 border-2 rounded-lg"
                            style={{ borderColor: selectedSystem.colors[index % selectedSystem.colors.length] }}
                          >
                            <div className="text-sm font-medium">{card}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="colors" className="mt-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Color Palette</h4>
                    <div className="grid grid-cols-5 gap-3">
                      {selectedSystem.colors.map((color, index) => (
                        <div key={index} className="text-center">
                          <div
                            className="w-full h-16 rounded-lg border-2 border-gray-200 mb-2"
                            style={{ backgroundColor: color }}
                          />
                          <div className="text-xs font-mono">{color}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="layouts" className="mt-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Layout Templates</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 border-2 border-gray-200 rounded-lg">
                        <div className="text-sm font-medium mb-2">Dashboard Layout</div>
                        <div className="grid grid-cols-4 gap-1 h-12">
                          <div className="bg-gray-200 rounded"></div>
                          <div className="col-span-3 bg-gray-100 rounded"></div>
                        </div>
                      </div>
                      <div className="p-4 border-2 border-gray-200 rounded-lg">
                        <div className="text-sm font-medium mb-2">Landing Page</div>
                        <div className="space-y-1">
                          <div className="h-2 bg-gray-200 rounded"></div>
                          <div className="h-6 bg-gray-100 rounded"></div>
                          <div className="h-2 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Potential */}
      <Card className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
        <CardHeader>
          <CardTitle className="text-3xl text-center">💰 MASSIVE REVENUE POTENTIAL 💰</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3 text-center">
            <div className="bg-black/20 p-6 rounded-lg">
              <div className="text-3xl font-bold mb-2">$50K+</div>
              <div className="text-lg">Per Design System</div>
              <div className="text-sm opacity-90">Average client project value</div>
            </div>
            <div className="bg-black/20 p-6 rounded-lg">
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-lg">Enterprise Clients</div>
              <div className="text-sm opacity-90">Fortune 500 companies</div>
            </div>
            <div className="bg-black/20 p-6 rounded-lg">
              <div className="text-3xl font-bold mb-2">$25M+</div>
              <div className="text-lg">Annual Revenue</div>
              <div className="text-sm opacity-90">From design system licensing</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
