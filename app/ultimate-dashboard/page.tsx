"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  Brain,
  Zap,
  Target,
  TrendingUp,
  Eye,
  DollarSign,
  Clock,
  BarChart3,
  Settings,
  RefreshCw,
  Cpu,
  Shield,
  Rocket,
  Globe,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react"

export default function UltimateDashboard() {
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // Simulate comprehensive data fetch
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setDashboardData({
        systemStatus: {
          overall: "optimal",
          uptime: "99.97%",
          activeChannels: 6,
          dailyGeneration: 18,
          queueStatus: "healthy",
          lastError: null,
        },
        realTimeMetrics: {
          totalViews: 2847392,
          totalRevenue: 18947.32,
          avgRetention: 74.8,
          avgCTR: 11.2,
          viralScore: 8.7,
          algorithmScore: 92.3,
        },
        aiPerformance: {
          contentQuality: 94.2,
          viralPrediction: 87.5,
          optimizationScore: 91.8,
          competitorAdvantage: 15.3,
          trendAccuracy: 89.7,
        },
        channelPerformance: [
          {
            id: "cybersec_alpha",
            name: "CyberSec Alpha",
            subscribers: 847392,
            views: 2847392,
            revenue: 8947.32,
            retention: 78.4,
            ctr: 12.8,
            viralScore: 9.2,
            status: "optimal",
            growth: "+23.4%",
          },
          {
            id: "devhacks_pro",
            name: "DevHacks Pro",
            subscribers: 623847,
            views: 1923847,
            revenue: 5234.67,
            retention: 72.1,
            ctr: 10.9,
            viralScore: 8.5,
            status: "good",
            growth: "+18.7%",
          },
          {
            id: "netsec_elite",
            name: "NetSec Elite",
            subscribers: 534829,
            views: 1634829,
            revenue: 4765.43,
            retention: 76.8,
            ctr: 11.4,
            viralScore: 8.9,
            status: "optimal",
            growth: "+21.2%",
          },
          {
            id: "hacklab_x",
            name: "HackLab X",
            subscribers: 423847,
            views: 1234567,
            revenue: 3456.78,
            retention: 74.2,
            ctr: 10.6,
            viralScore: 8.3,
            status: "good",
            growth: "+16.9%",
          },
          {
            id: "crypto_fortress",
            name: "Crypto Fortress",
            subscribers: 298374,
            views: 892374,
            revenue: 2987.45,
            retention: 79.3,
            ctr: 13.2,
            viralScore: 9.1,
            status: "optimal",
            growth: "+28.5%",
          },
          {
            id: "ai_security",
            name: "AI Security Hub",
            subscribers: 187293,
            views: 567293,
            revenue: 2234.56,
            retention: 81.7,
            ctr: 14.1,
            viralScore: 9.4,
            status: "optimal",
            growth: "+34.2%",
          },
        ],
        contentPipeline: {
          planning: 12,
          generating: 8,
          optimizing: 6,
          scheduled: 15,
          published: 24,
          analyzing: 18,
        },
        viralContent: [
          {
            title: "This AI Hack Will Change Everything",
            channel: "AI Security Hub",
            viralScore: 9.8,
            predictedViews: 2500000,
            status: "viral",
            publishedHours: 6,
          },
          {
            title: "Cybersecurity Secret They Don't Want You to Know",
            channel: "CyberSec Alpha",
            viralScore: 9.4,
            predictedViews: 1800000,
            status: "trending",
            publishedHours: 12,
          },
          {
            title: "Hack Any Network in 60 Seconds",
            channel: "HackLab X",
            viralScore: 9.1,
            predictedViews: 1200000,
            status: "rising",
            publishedHours: 3,
          },
        ],
        competitorAnalysis: {
          marketPosition: "leading",
          competitiveAdvantage: 15.3,
          contentGaps: 8,
          trendingTopics: 12,
          threatLevel: "low",
        },
        abTesting: {
          activeTests: 24,
          completedTests: 156,
          winRate: 73.2,
          avgImprovement: 18.7,
          significantResults: 18,
        },
        automation: {
          dailyPosts: 18,
          successRate: 97.8,
          avgProcessingTime: "12.3 min",
          queueHealth: "optimal",
          errorRate: 0.02,
        },
        trends: [
          { date: "Mon", views: 420000, revenue: 2800, retention: 72.1, viral: 8.2 },
          { date: "Tue", views: 385000, revenue: 2650, retention: 73.4, viral: 8.5 },
          { date: "Wed", views: 445000, revenue: 3100, retention: 74.8, viral: 8.8 },
          { date: "Thu", views: 467000, revenue: 3250, retention: 75.2, viral: 9.1 },
          { date: "Fri", views: 523000, revenue: 3680, retention: 76.1, viral: 9.3 },
          { date: "Sat", views: 489000, revenue: 3420, retention: 74.9, viral: 8.9 },
          { date: "Sun", views: 512000, revenue: 3580, retention: 75.6, viral: 9.2 },
        ],
      })

      setLastUpdated(new Date())
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading && !dashboardData) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg font-medium">Loading Ultimate Dashboard...</p>
            <p className="text-muted-foreground">Initializing all systems...</p>
          </div>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal":
        return "text-green-600"
      case "good":
        return "text-blue-600"
      case "warning":
        return "text-yellow-600"
      case "error":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "optimal":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "good":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Ultimate AI Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">Complete YouTube automation & optimization system</p>
        </div>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <p className="text-sm text-muted-foreground flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
          <Badge variant={dashboardData?.systemStatus?.overall === "optimal" ? "default" : "secondary"}>
            {getStatusIcon(dashboardData?.systemStatus?.overall)}
            <span className="ml-1">{dashboardData?.systemStatus?.overall?.toUpperCase()}</span>
          </Badge>
          <Button variant="outline" onClick={fetchDashboardData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* System Status Alert */}
      {dashboardData?.systemStatus?.lastError && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>System Alert</AlertTitle>
          <AlertDescription>{dashboardData.systemStatus.lastError}</AlertDescription>
        </Alert>
      )}

      {/* Key Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-blue-700">
              <Eye className="mr-2 h-4 w-4" />
              Total Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {dashboardData?.realTimeMetrics?.totalViews?.toLocaleString()}
            </div>
            <p className="text-xs text-blue-600">+24% this week</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-green-700">
              <DollarSign className="mr-2 h-4 w-4" />
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              ${dashboardData?.realTimeMetrics?.totalRevenue?.toLocaleString()}
            </div>
            <p className="text-xs text-green-600">+31% this week</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-purple-700">
              <BarChart3 className="mr-2 h-4 w-4" />
              Avg Retention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{dashboardData?.realTimeMetrics?.avgRetention}%</div>
            <Progress value={dashboardData?.realTimeMetrics?.avgRetention} className="h-1 mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-orange-700">
              <Target className="mr-2 h-4 w-4" />
              Avg CTR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{dashboardData?.realTimeMetrics?.avgCTR}%</div>
            <p className="text-xs text-orange-600">Above 8% target</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-pink-700">
              <Zap className="mr-2 h-4 w-4" />
              Viral Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-900">{dashboardData?.realTimeMetrics?.viralScore}/10</div>
            <p className="text-xs text-pink-600">Excellent performance</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-indigo-700">
              <Brain className="mr-2 h-4 w-4" />
              AI Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-900">
              {dashboardData?.realTimeMetrics?.algorithmScore}/100
            </div>
            <p className="text-xs text-indigo-600">Algorithm optimized</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="viral">Viral Content</TabsTrigger>
          <TabsTrigger value="ai">AI Performance</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="testing">A/B Testing</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5" />
                  System Performance
                </CardTitle>
                <CardDescription>Real-time system health and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">System Uptime</span>
                    <Badge variant="default">{dashboardData?.systemStatus?.uptime}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Channels</span>
                    <span className="text-sm font-medium">{dashboardData?.systemStatus?.activeChannels}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Daily Generation</span>
                    <span className="text-sm font-medium">{dashboardData?.systemStatus?.dailyGeneration} videos</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Queue Status</span>
                    <Badge variant="default">{dashboardData?.systemStatus?.queueStatus}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Error Rate</span>
                    <span className="text-sm font-medium text-green-600">{dashboardData?.automation?.errorRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cpu className="mr-2 h-5 w-5" />
                  Content Pipeline
                </CardTitle>
                <CardDescription>Current content production status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Planning</span>
                    <Badge variant="outline">{dashboardData?.contentPipeline?.planning} items</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Generating</span>
                    <Badge variant="secondary">{dashboardData?.contentPipeline?.generating} items</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Optimizing</span>
                    <Badge variant="secondary">{dashboardData?.contentPipeline?.optimizing} items</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Scheduled</span>
                    <Badge variant="default">{dashboardData?.contentPipeline?.scheduled} items</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Published Today</span>
                    <Badge variant="default">{dashboardData?.contentPipeline?.published} videos</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Analyzing</span>
                    <Badge variant="outline">{dashboardData?.contentPipeline?.analyzing} videos</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Weekly performance across all channels</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboardData?.trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="views" stroke="#22c55e" strokeWidth={2} name="Views" />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Revenue"
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="retention"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    name="Retention %"
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="viral"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    name="Viral Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <div className="grid gap-4">
            {dashboardData?.channelPerformance?.map((channel) => (
              <Card key={channel.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {channel.name.charAt(0)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{channel.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {channel.subscribers.toLocaleString()} subscribers
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(channel.status)}
                      <Badge variant={channel.status === "optimal" ? "default" : "secondary"}>{channel.status}</Badge>
                      <Badge variant="outline" className="text-green-600">
                        {channel.growth}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-6 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{channel.views.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Total Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">${channel.revenue.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Revenue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{channel.retention}%</div>
                      <div className="text-xs text-muted-foreground">Retention</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{channel.ctr}%</div>
                      <div className="text-xs text-muted-foreground">CTR</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{channel.viralScore}/10</div>
                      <div className="text-xs text-muted-foreground">Viral Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{((channel.revenue / channel.views) * 1000).toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">RPM</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Performance Score</span>
                      <span>{Math.round((channel.retention + channel.ctr + channel.viralScore * 10) / 3)}%</span>
                    </div>
                    <Progress
                      value={Math.round((channel.retention + channel.ctr + channel.viralScore * 10) / 3)}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="viral" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Rocket className="mr-2 h-5 w-5" />
                  Viral Content Performance
                </CardTitle>
                <CardDescription>Currently trending and viral videos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData?.viralContent?.map((content, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{content.title}</h4>
                        <p className="text-sm text-muted-foreground">{content.channel}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={content.status === "viral" ? "default" : "secondary"}>{content.status}</Badge>
                          <span className="text-xs text-muted-foreground">{content.publishedHours}h ago</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{content.viralScore}/10</div>
                        <div className="text-sm text-muted-foreground">
                          {content.predictedViews.toLocaleString()} predicted
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Viral Prediction Engine
                </CardTitle>
                <CardDescription>AI-powered viral content analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Prediction Accuracy</span>
                    <span className="text-sm font-medium">89.7%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Viral Content Identified</span>
                    <span className="text-sm font-medium">24 this week</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Viral Score</span>
                    <span className="text-sm font-medium">8.7/10</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Success Rate</span>
                    <span className="text-sm font-medium text-green-600">73.2%</span>
                  </div>
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">🚀 AI predicts 3 videos will go viral in the next 24 hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="mr-2 h-5 w-5" />
                  Content Quality AI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {dashboardData?.aiPerformance?.contentQuality}%
                  </div>
                  <Progress value={dashboardData?.aiPerformance?.contentQuality} className="mb-4" />
                  <p className="text-sm text-muted-foreground">AI-generated content quality score</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="mr-2 h-5 w-5" />
                  Viral Prediction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">
                    {dashboardData?.aiPerformance?.viralPrediction}%
                  </div>
                  <Progress value={dashboardData?.aiPerformance?.viralPrediction} className="mb-4" />
                  <p className="text-sm text-muted-foreground">Viral content prediction accuracy</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  Optimization Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {dashboardData?.aiPerformance?.optimizationScore}%
                  </div>
                  <Progress value={dashboardData?.aiPerformance?.optimizationScore} className="mb-4" />
                  <p className="text-sm text-muted-foreground">Algorithm optimization effectiveness</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>AI Performance Breakdown</CardTitle>
              <CardDescription>Detailed AI system performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Content Generation Speed</span>
                    <span className="text-sm font-medium">12.3 min avg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Script Quality Score</span>
                    <span className="text-sm font-medium">94.2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SEO Optimization</span>
                    <span className="text-sm font-medium">91.8%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Thumbnail Generation</span>
                    <span className="text-sm font-medium">96.5%</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Voice Synthesis Quality</span>
                    <span className="text-sm font-medium">93.7%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Trend Analysis Accuracy</span>
                    <span className="text-sm font-medium">89.7%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Competitor Analysis</span>
                    <span className="text-sm font-medium">87.3%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Algorithm Prediction</span>
                    <span className="text-sm font-medium">85.9%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitors" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Competitive Position
                </CardTitle>
                <CardDescription>Market position analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Market Position</span>
                    <Badge variant="default">{dashboardData?.competitorAnalysis?.marketPosition}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Competitive Advantage</span>
                    <span className="text-sm font-medium text-green-600">
                      +{dashboardData?.competitorAnalysis?.competitiveAdvantage}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Content Gaps Identified</span>
                    <span className="text-sm font-medium">{dashboardData?.competitorAnalysis?.contentGaps}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Trending Topics Tracked</span>
                    <span className="text-sm font-medium">{dashboardData?.competitorAnalysis?.trendingTopics}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Threat Level</span>
                    <Badge variant="outline" className="text-green-600">
                      {dashboardData?.competitorAnalysis?.threatLevel}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="mr-2 h-5 w-5" />
                  Market Intelligence
                </CardTitle>
                <CardDescription>Real-time competitor insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      📊 Competitor "TechSec Pro" posted 3 videos this week with avg 45K views
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      🎯 Content gap identified: "AI Security for Beginners" - high demand, low supply
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      ⚡ Trending topic: "Quantum Computing Security" - 3 competitors covered this week
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-sm text-purple-800">
                      🚀 Opportunity: "Zero Trust Architecture" has 2.3M monthly searches, low competition
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cpu className="mr-2 h-5 w-5" />
                  Automation Performance
                </CardTitle>
                <CardDescription>Daily automation metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Daily Posts Generated</span>
                    <span className="text-sm font-medium">{dashboardData?.automation?.dailyPosts}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Success Rate</span>
                    <span className="text-sm font-medium text-green-600">
                      {dashboardData?.automation?.successRate}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Avg Processing Time</span>
                    <span className="text-sm font-medium">{dashboardData?.automation?.avgProcessingTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Queue Health</span>
                    <Badge variant="default">{dashboardData?.automation?.queueHealth}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Error Rate</span>
                    <span className="text-sm font-medium text-green-600">{dashboardData?.automation?.errorRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5" />
                  System Health
                </CardTitle>
                <CardDescription>Real-time system monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Status</span>
                    <Badge variant="default">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database Connection</span>
                    <Badge variant="default">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">YouTube API Quota</span>
                    <span className="text-sm font-medium">67% used</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">OpenAI API Status</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Storage Usage</span>
                    <span className="text-sm font-medium">23.4 GB / 100 GB</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="testing" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  A/B Testing Performance
                </CardTitle>
                <CardDescription>Testing results and optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Tests</span>
                    <span className="text-sm font-medium">{dashboardData?.abTesting?.activeTests}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completed Tests</span>
                    <span className="text-sm font-medium">{dashboardData?.abTesting?.completedTests}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Win Rate</span>
                    <span className="text-sm font-medium text-green-600">{dashboardData?.abTesting?.winRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Avg Improvement</span>
                    <span className="text-sm font-medium text-green-600">
                      +{dashboardData?.abTesting?.avgImprovement}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Significant Results</span>
                    <span className="text-sm font-medium">{dashboardData?.abTesting?.significantResults}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Recent Test Results
                </CardTitle>
                <CardDescription>Latest A/B test outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">🎯 Thumbnail Test: Variant B increased CTR by 23.4%</p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">📝 Title Test: "Secret" keyword improved clicks by 18.7%</p>
                  </div>
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-sm text-purple-800">⏰ Posting Time: 3 PM UTC shows 15.2% better engagement</p>
                  </div>
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-orange-800">
                      🎬 Video Length: 12-15 min videos have 12% higher retention
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics Dashboard</CardTitle>
              <CardDescription>Comprehensive performance analytics across all channels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium mb-4">Revenue by Channel</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={dashboardData?.channelPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-4">Performance Distribution</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Optimal", value: 3, fill: "#22c55e" },
                          { name: "Good", value: 2, fill: "#3b82f6" },
                          { name: "Warning", value: 1, fill: "#f59e0b" },
                          { name: "Error", value: 0, fill: "#ef4444" },
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label
                      >
                        <Cell fill="#22c55e" />
                        <Cell fill="#3b82f6" />
                        <Cell fill="#f59e0b" />
                        <Cell fill="#ef4444" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
