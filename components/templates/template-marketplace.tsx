"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PremiumTemplateShowcase } from "./premium-template-showcase"
import { DesignSystemTemplates } from "./design-system-templates"
import { MobileAppTemplates } from "./mobile-app-templates"
import { Layout, Smartphone, Palette, Crown } from "lucide-react"

export function TemplateMarketplace() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* ULTIMATE MARKETPLACE HEADER */}
        <Card className="mb-8 bg-gradient-to-r from-rainbow via-gold to-rainbow border-8 border-rainbow animate-pulse">
          <CardHeader>
            <div className="text-center">
              <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-white via-gold to-white bg-clip-text text-transparent animate-bounce">
                🏆 ULTIMATE TEMPLATE MARKETPLACE 🏆
              </h1>
              <div className="text-3xl font-bold mb-4 text-black">PREMIUM • PROFESSIONAL • PROFITABLE • PERFECT</div>
              <div className="flex justify-center gap-4 flex-wrap">
                <Badge className="bg-black text-rainbow text-2xl px-6 py-3 animate-pulse">
                  <Crown className="h-8 w-8 mr-2" />
                  WORLD CLASS QUALITY
                </Badge>
                <Badge className="bg-black text-rainbow text-2xl px-6 py-3 animate-pulse">
                  <Layout className="h-8 w-8 mr-2" />
                  1000+ TEMPLATES
                </Badge>
                <Badge className="bg-black text-rainbow text-2xl px-6 py-3 animate-pulse">
                  <Smartphone className="h-8 w-8 mr-2" />
                  ALL PLATFORMS
                </Badge>
                <Badge className="bg-black text-rainbow text-2xl px-6 py-3 animate-pulse">
                  <Palette className="h-8 w-8 mr-2" />
                  DESIGN SYSTEMS
                </Badge>
              </div>
              <p className="text-2xl mt-6 text-gold animate-pulse">
                THE WORLD'S MOST PROFITABLE TEMPLATE MARKETPLACE - GENERATING $100M+ ANNUALLY
              </p>
            </div>
          </CardHeader>
        </Card>

        {/* REVENUE SHOWCASE */}
        <Card className="mb-8 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 border-4 border-gold">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-white mb-2">💰 MASSIVE REVENUE GENERATOR 💰</div>
            </div>
            <div className="grid gap-4 md:grid-cols-5 text-center text-white">
              <div>
                <div className="text-3xl font-bold">$100M+</div>
                <div className="text-sm">Annual Revenue</div>
              </div>
              <div>
                <div className="text-3xl font-bold">500K+</div>
                <div className="text-sm">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl font-bold">1000+</div>
                <div className="text-sm">Premium Templates</div>
              </div>
              <div>
                <div className="text-3xl font-bold">4.9★</div>
                <div className="text-sm">Average Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold">99%</div>
                <div className="text-sm">Success Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* TEMPLATE CATEGORIES */}
        <Tabs defaultValue="showcase" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-black/80 border-4 border-rainbow">
            <TabsTrigger value="showcase" className="flex items-center gap-2 text-cyan-400 text-xl py-4">
              <Layout className="h-6 w-6" />
              WEB TEMPLATES
            </TabsTrigger>
            <TabsTrigger value="mobile" className="flex items-center gap-2 text-pink-400 text-xl py-4">
              <Smartphone className="h-6 w-6" />
              MOBILE APPS
            </TabsTrigger>
            <TabsTrigger value="systems" className="flex items-center gap-2 text-purple-400 text-xl py-4">
              <Palette className="h-6 w-6" />
              DESIGN SYSTEMS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="showcase">
            <PremiumTemplateShowcase />
          </TabsContent>

          <TabsContent value="mobile">
            <MobileAppTemplates />
          </TabsContent>

          <TabsContent value="systems">
            <DesignSystemTemplates />
          </TabsContent>
        </Tabs>

        {/* SUCCESS STORIES */}
        <Card className="mt-8 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 border-4 border-gold">
          <CardHeader>
            <CardTitle className="text-4xl text-center text-gold">🌟 CLIENT SUCCESS STORIES 🌟</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="bg-black/40 p-6 rounded-lg border border-gold">
                <h3 className="text-gold font-bold mb-3 text-xl">🏥 HealthTech Startup</h3>
                <p className="text-white mb-3">
                  "Used the HealthTech Pro template and raised $50M in Series A funding. The design impressed every
                  investor!"
                </p>
                <div className="text-green-400 font-bold">Revenue: $50M raised</div>
              </div>
              <div className="bg-black/40 p-6 rounded-lg border border-gold">
                <h3 className="text-gold font-bold mb-3 text-xl">💼 SaaS Company</h3>
                <p className="text-white mb-3">
                  "The SaaS dashboard template helped us launch in 2 weeks instead of 6 months. Now we're at $10M ARR!"
                </p>
                <div className="text-green-400 font-bold">Revenue: $10M ARR</div>
              </div>
              <div className="bg-black/40 p-6 rounded-lg border border-gold">
                <h3 className="text-gold font-bold mb-3 text-xl">🛒 E-commerce Brand</h3>
                <p className="text-white mb-3">
                  "The luxury e-commerce template increased our conversion rate by 340%. Best investment ever!"
                </p>
                <div className="text-green-400 font-bold">Revenue: +340% conversion</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ULTIMATE VALUE PROPOSITION */}
        <Card className="mt-8 bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 border-8 border-gold animate-bounce">
          <CardHeader>
            <CardTitle className="text-5xl text-center text-black font-bold">
              🚀 BECOME A TEMPLATE EMPIRE OWNER 🚀
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center text-black">
            <div className="text-3xl font-bold mb-6">WHY OUR TEMPLATES DOMINATE THE MARKET:</div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <div className="bg-black/20 p-6 rounded-lg">
                <div className="text-2xl font-bold mb-2">🎨 WORLD-CLASS DESIGN</div>
                <div>Created by top designers from Apple, Google, and Tesla</div>
              </div>
              <div className="bg-black/20 p-6 rounded-lg">
                <div className="text-2xl font-bold mb-2">⚡ LIGHTNING FAST</div>
                <div>Optimized for 99.9% uptime and sub-second loading</div>
              </div>
              <div className="bg-black/20 p-6 rounded-lg">
                <div className="text-2xl font-bold mb-2">💰 PROFIT MAXIMIZED</div>
                <div>Conversion-optimized to generate maximum revenue</div>
              </div>
              <div className="bg-black/20 p-6 rounded-lg">
                <div className="text-2xl font-bold mb-2">🔒 ENTERPRISE SECURE</div>
                <div>Bank-level security and GDPR compliant</div>
              </div>
            </div>
            <div className="text-4xl font-bold mb-4">🎯 START YOUR TEMPLATE EMPIRE TODAY AND MAKE MILLIONS! 🎯</div>
            <div className="text-2xl">
              Join 500,000+ entrepreneurs who've built successful businesses with our templates!
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
