"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, DollarSign, Eye, Clock, Target, Zap, Brain, TestTube, ArrowUp } from "lucide-react"

export default function AdvancedDashboard() {
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<any>(null)

  useEffect(() => {
    // Simulate loading advanced analytics data
    setTimeout(() => {
      setDashboardData({
        overview: {
          total_videos: 127,
          avg_retention: 72.3,
          avg_rpm: 16.8,
          total_revenue: 24580,
          algorithm_score: 8.7,
        },
        performance_trends: {
          retention: [
            { date: "2025-05-27", value: 68.2 },
            { date: "2025-05-28", value: 69.1 },
            { date: "2025-05-29", value: 71.5 },
            { date: "2025-05-30", value: 70.8 },
            { date: "2025-05-31", value: 72.3 },
            { date: "2025-06-01", value: 73.1 },
            { date: "2025-06-02", value: 74.2 },
          ],
          rpm: [
            { date: "2025-05-27", value: 14.2 },
            { date: "2025-05-28", value: 15.1 },
            { date: "2025-05-29", value: 16.5 },
            { date: "2025-05-30", value: 15.8 },
            { date: "2025-05-31", value: 16.8 },
            { date: "2025-06-01", value: 17.1 },
            { date: "2025-06-02", value: 17.8 },
          ],
        },
        top_performers: [
          {
            id: 1,
            title: "10 Zero-Day Exploits That Will Shock You",
            retention: 78.5,
            rpm: 22.4,
            views: 156000,
            grade: "A+",
          },
          {
            id: 2,
            title: "Why Your VPN is Making You LESS Secure",
            retention: 76.2,
            rpm: 19.8,
            views: 142000,
            grade: "A",
          },
          {
            id: 3,
            title: "Hacking Tutorial: Buffer Overflow Explained",
            retention: 74.1,
            rpm: 18.6,
            views: 128000,
            grade: "A",
          },
        ],
        ab_tests: [
          {
            id: "test_001",
            type: "thumbnail",
            video: "Advanced SQL Injection",
            status: "running",
            confidence: 87,
            leader: "Variant B (+12.3% CTR)",
          },
          {
            id: "test_002",
            type: "title",
            video: "Network Security Basics",
            status: "completed",
            confidence: 95,
            winner: "Variant A (+8.7% CTR)",
          },
        ],
        optimization_opportunities: [
          {
            type: "retention",
            priority: "high",
            description: "3 videos have retention drops at 4:30 mark",
            potential_impact: "+5.2% avg retention",
          },
          {
            type: "monetization",
            priority: "medium",
            description: "Add mid-roll ads to 5 high-performing videos",
            potential_impact: "+$2.3 RPM",
          },
          {
            type: "algorithm",
            priority: "high",
            description: "Optimize 8 thumbnails for higher CTR",
            potential_impact: "+15% impressions",
          },
        ],
        channel_health: {
          algorithm_signals: {
            watch_time: 8.7,
            session_duration: 15.2,
            browse_features: 0.18,
            search_traffic: 0.42,
          },
          audience_quality: {
            returning_viewers: 0.34,
            subscriber_conversion: 0.08,
            engagement_rate: 0.045,
          },
        },
      })
      setLoading(false)
    }, 1500)
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading advanced analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Advanced Dashboard</h1>
          <p className="text-muted-foreground">Algorithm optimization & performance insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <TestTube className="mr-2 h-4 w-4" />
            New A/B Test
          </Button>
          <Button>
            <Brain className="mr-2 h-4 w-4" />
            AI Optimize
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Eye className="mr-2 h-4 w-4" />
              Avg Retention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{dashboardData.overview.avg_retention}%</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUp className="mr-1 h-3 w-3" />
              +3.2% vs last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="mr-2 h-4 w-4" />
              Avg RPM
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${dashboardData.overview.avg_rpm}</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUp className="mr-1 h-3 w-3" />
              +$1.4 vs last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Target className="mr-2 h-4 w-4" />
              Algorithm Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{dashboardData.overview.algorithm_score}/10</div>
            <Progress value={dashboardData.overview.algorithm_score * 10} className="h-1 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="mr-2 h-4 w-4" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dashboardData.overview.total_revenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUp className="mr-1 h-3 w-3" />
              +18% vs last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Zap className="mr-2 h-4 w-4" />
              Total Videos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.overview.total_videos}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="mr-1 h-3 w-3" />
              +5 this week
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList>
          <TabsTrigger value="performance">Performance Trends</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="ab-testing">A/B Testing</TabsTrigger>
          <TabsTrigger value="algorithm">Algorithm Health</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Retention Trend</CardTitle>
                <CardDescription>Average retention rate over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dashboardData.performance_trends.retention}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[65, 80]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>RPM Trend</CardTitle>
                <CardDescription>Revenue per mille over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dashboardData.performance_trends.rpm}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[12, 20]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Videos</CardTitle>
              <CardDescription>Videos with highest optimization scores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.top_performers.map((video, index) => (
                  <div key={video.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">{video.title}</h4>
                        <p className="text-sm text-muted-foreground">{video.views.toLocaleString()} views</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-sm font-medium">{video.retention}%</div>
                        <div className="text-xs text-muted-foreground">Retention</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">${video.rpm}</div>
                        <div className="text-xs text-muted-foreground">RPM</div>
                      </div>
                      <Badge variant={video.grade === "A+" ? "default" : "secondary"}>{video.grade}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <Alert>
            <Brain className="h-4 w-4" />
            <AlertTitle>AI Optimization Insights</AlertTitle>
            <AlertDescription>
              Based on your content analysis, we've identified {dashboardData.optimization_opportunities.length}{" "}
              optimization opportunities that could increase your revenue by up to 25%.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4">
            {dashboardData.optimization_opportunities.map((opportunity, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center">
                      {opportunity.type === "retention" && <Eye className="mr-2 h-4 w-4" />}
                      {opportunity.type === "monetization" && <DollarSign className="mr-2 h-4 w-4" />}
                      {opportunity.type === "algorithm" && <Target className="mr-2 h-4 w-4" />}
                      {opportunity.type.charAt(0).toUpperCase() + opportunity.type.slice(1)} Optimization
                    </CardTitle>
                    <Badge variant={opportunity.priority === "high" ? "destructive" : "secondary"}>
                      {opportunity.priority} priority
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{opportunity.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-green-600">
                      Potential Impact: {opportunity.potential_impact}
                    </div>
                    <Button size="sm">Optimize Now</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ab-testing" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Active A/B Tests</h3>
              <p className="text-sm text-muted-foreground">Monitor and manage your optimization experiments</p>
            </div>
            <Button>
              <TestTube className="mr-2 h-4 w-4" />
              Create New Test
            </Button>
          </div>

          <div className="grid gap-4">
            {dashboardData.ab_tests.map((test) => (
              <Card key={test.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {test.video} - {test.type} Test
                    </CardTitle>
                    <Badge variant={test.status === "completed" ? "default" : "secondary"}>{test.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Confidence Level</span>
                      <span className="text-sm font-medium">{test.confidence}%</span>
                    </div>
                    <Progress value={test.confidence} className="h-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {test.status === "completed" ? "Winner" : "Current Leader"}
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        {test.status === "completed" ? test.winner : test.leader}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {test.status === "completed" && <Button size="sm">Apply Winner</Button>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="algorithm" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Algorithm Signals</CardTitle>
                <CardDescription>Key metrics that influence YouTube's algorithm</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Watch Time</span>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={dashboardData.channel_health.algorithm_signals.watch_time * 10}
                        className="w-20 h-2"
                      />
                      <span className="text-sm font-medium">
                        {dashboardData.channel_health.algorithm_signals.watch_time}/10
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Session Duration</span>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={dashboardData.channel_health.algorithm_signals.session_duration * 5}
                        className="w-20 h-2"
                      />
                      <span className="text-sm font-medium">
                        {dashboardData.channel_health.algorithm_signals.session_duration}min
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Browse Features</span>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={dashboardData.channel_health.algorithm_signals.browse_features * 500}
                        className="w-20 h-2"
                      />
                      <span className="text-sm font-medium">
                        {(dashboardData.channel_health.algorithm_signals.browse_features * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Search Traffic</span>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={dashboardData.channel_health.algorithm_signals.search_traffic * 200}
                        className="w-20 h-2"
                      />
                      <span className="text-sm font-medium">
                        {(dashboardData.channel_health.algorithm_signals.search_traffic * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Audience Quality</CardTitle>
                <CardDescription>Metrics indicating audience engagement and loyalty</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Returning Viewers</span>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={dashboardData.channel_health.audience_quality.returning_viewers * 200}
                        className="w-20 h-2"
                      />
                      <span className="text-sm font-medium">
                        {(dashboardData.channel_health.audience_quality.returning_viewers * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Subscriber Conversion</span>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={dashboardData.channel_health.audience_quality.subscriber_conversion * 1000}
                        className="w-20 h-2"
                      />
                      <span className="text-sm font-medium">
                        {(dashboardData.channel_health.audience_quality.subscriber_conversion * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Engagement Rate</span>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={dashboardData.channel_health.audience_quality.engagement_rate * 2000}
                        className="w-20 h-2"
                      />
                      <span className="text-sm font-medium">
                        {(dashboardData.channel_health.audience_quality.engagement_rate * 100).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Algorithm Health Score</CardTitle>
              <CardDescription>Overall assessment of your channel's algorithm performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="2"
                      strokeDasharray={`${dashboardData.overview.algorithm_score * 10}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{dashboardData.overview.algorithm_score}</div>
                      <div className="text-xs text-muted-foreground">/ 10</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Badge variant="default" className="mb-2">
                  Excellent Performance
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Your channel is performing exceptionally well with the YouTube algorithm. Continue focusing on
                  retention optimization and audience engagement.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
