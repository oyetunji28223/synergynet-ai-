"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { Clock, Video, TrendingUp, Eye, DollarSign, PlayCircle, BarChart3, Settings, RefreshCw } from "lucide-react"

export default function DailyDashboard() {
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    fetchDashboardData()

    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchDashboardData, 300000)
    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // Simulate fetching real-time data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setDashboardData({
        todayStats: {
          longFormPosted: 3,
          shortsPosted: 15,
          totalViews: 45600,
          totalRevenue: 287.5,
          avgRetention: 68.4,
          avgCTR: 8.2,
        },
        weeklyStats: {
          longFormPosted: 21,
          shortsPosted: 105,
          totalViews: 324500,
          totalRevenue: 2156.75,
          avgRetention: 71.2,
          avgCTR: 7.8,
        },
        scheduledContent: [
          {
            id: 1,
            type: "long_form",
            channel: "CyberSec",
            title: "Advanced SQL Injection Techniques",
            scheduledTime: "15:00",
            status: "completed",
            views: 12400,
            retention: 72.3,
          },
          {
            id: 2,
            type: "short_form",
            channel: "DevHacks",
            title: "Code Like a Pro in 60 Seconds",
            scheduledTime: "18:00",
            status: "completed",
            views: 8900,
            retention: 85.1,
          },
          {
            id: 3,
            type: "short_form",
            channel: "NetSec",
            title: "Network Security Quick Tip",
            scheduledTime: "20:00",
            status: "scheduled",
            views: 0,
            retention: 0,
          },
          {
            id: 4,
            type: "long_form",
            channel: "CodeBreak",
            title: "Ethical Hacking Fundamentals",
            scheduledTime: "15:00",
            status: "generating",
            views: 0,
            retention: 0,
          },
        ],
        channelPerformance: [
          {
            channel: "CyberSec",
            longFormToday: 1,
            shortsToday: 3,
            avgViews: 15200,
            avgRetention: 74.2,
            revenue: 89.5,
          },
          {
            channel: "DevHacks",
            longFormToday: 1,
            shortsToday: 3,
            avgViews: 12800,
            avgRetention: 69.8,
            revenue: 67.25,
          },
          {
            channel: "NetSec",
            longFormToday: 1,
            shortsToday: 3,
            avgViews: 9600,
            avgRetention: 71.5,
            revenue: 52.75,
          },
          {
            channel: "CodeBreak",
            longFormToday: 0,
            shortsToday: 3,
            avgViews: 11400,
            avgRetention: 66.9,
            revenue: 43.5,
          },
          {
            channel: "HackLab",
            longFormToday: 0,
            shortsToday: 3,
            avgViews: 8900,
            avgRetention: 68.1,
            revenue: 34.5,
          },
        ],
        performanceTrends: [
          { date: "Mon", longForm: 3, shorts: 15, views: 42000, revenue: 245 },
          { date: "Tue", longForm: 3, shorts: 15, views: 38500, revenue: 228 },
          { date: "Wed", longForm: 3, shorts: 15, views: 41200, revenue: 267 },
          { date: "Thu", longForm: 3, shorts: 15, views: 44800, revenue: 289 },
          { date: "Fri", longForm: 3, shorts: 15, views: 47200, revenue: 312 },
          { date: "Sat", longForm: 3, shorts: 15, views: 39600, revenue: 251 },
          { date: "Sun", longForm: 3, shorts: 15, views: 45600, revenue: 287 },
        ],
        upcomingSchedule: [
          { time: "22:00", type: "short_form", channel: "CyberSec", title: "Security Tip #247" },
          { time: "00:00", type: "short_form", channel: "DevHacks", title: "Quick Code Fix" },
          { time: "02:00", type: "short_form", channel: "NetSec", title: "Network Hack Alert" },
          { time: "15:00", type: "long_form", channel: "HackLab", title: "Tomorrow's Main Video" },
        ],
        systemHealth: {
          apiStatus: "healthy",
          generationQueue: 2,
          uploadQueue: 1,
          lastError: null,
          uptime: "99.8%",
        },
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading daily dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Daily Content Dashboard</h1>
          <p className="text-muted-foreground">Automated posting & performance monitoring</p>
        </div>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <p className="text-sm text-muted-foreground flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
          <Button variant="outline" onClick={fetchDashboardData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* System Health Alert */}
      {dashboardData?.systemHealth?.lastError && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>System Alert</AlertTitle>
          <AlertDescription>{dashboardData.systemHealth.lastError}</AlertDescription>
        </Alert>
      )}

      {/* Today's Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Video className="mr-2 h-4 w-4" />
              Long Form Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.todayStats?.longFormPosted}</div>
            <p className="text-xs text-muted-foreground">Target: 3 videos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <PlayCircle className="mr-2 h-4 w-4" />
              Shorts Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.todayStats?.shortsPosted}</div>
            <p className="text-xs text-muted-foreground">Target: 15 shorts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Eye className="mr-2 h-4 w-4" />
              Total Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.todayStats?.totalViews?.toLocaleString()}</div>
            <p className="text-xs text-green-600">+12% vs yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="mr-2 h-4 w-4" />
              Revenue Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dashboardData?.todayStats?.totalRevenue?.toFixed(2)}</div>
            <p className="text-xs text-green-600">+8% vs yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <BarChart3 className="mr-2 h-4 w-4" />
              Avg Retention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.todayStats?.avgRetention}%</div>
            <Progress value={dashboardData?.todayStats?.avgRetention} className="h-1 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="mr-2 h-4 w-4" />
              Avg CTR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.todayStats?.avgCTR}%</div>
            <p className="text-xs text-green-600">Above 7% target</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="schedule" className="space-y-6">
        <TabsList>
          <TabsTrigger value="schedule">Today's Schedule</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Today's Content</CardTitle>
                <CardDescription>Scheduled and completed posts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData?.scheduledContent?.map((content) => (
                    <div key={content.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          {content.type === "long_form" ? (
                            <Video className="h-6 w-6" />
                          ) : (
                            <PlayCircle className="h-6 w-6" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{content.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {content.channel} • {content.scheduledTime}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-sm font-medium">{content.views.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Views</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">{content.retention}%</div>
                          <div className="text-xs text-muted-foreground">Retention</div>
                        </div>
                        <Badge
                          variant={
                            content.status === "completed"
                              ? "default"
                              : content.status === "generating"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {content.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Schedule</CardTitle>
                <CardDescription>Next 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData?.upcomingSchedule?.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{item.title}</h4>
                          <Badge variant="outline">{item.time}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.channel} • {item.type.replace("_", " ")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Performance Trends</CardTitle>
              <CardDescription>Content performance over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboardData?.performanceTrends}>
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
                    name="Revenue ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Content Volume</CardTitle>
                <CardDescription>Daily posting consistency</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={dashboardData?.performanceTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="longForm" fill="#22c55e" name="Long Form" />
                    <Bar dataKey="shorts" fill="#3b82f6" name="Shorts" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Automation system status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Status</span>
                    <Badge variant="default">{dashboardData?.systemHealth?.apiStatus}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Generation Queue</span>
                    <span className="text-sm font-medium">{dashboardData?.systemHealth?.generationQueue} items</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Upload Queue</span>
                    <span className="text-sm font-medium">{dashboardData?.systemHealth?.uploadQueue} items</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Uptime</span>
                    <span className="text-sm font-medium text-green-600">{dashboardData?.systemHealth?.uptime}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <div className="grid gap-4">
            {dashboardData?.channelPerformance?.map((channel) => (
              <Card key={channel.channel}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{channel.channel}</CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="outline">{channel.longFormToday} Long</Badge>
                      <Badge variant="outline">{channel.shortsToday} Shorts</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{channel.avgViews.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Avg Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{channel.avgRetention}%</div>
                      <div className="text-xs text-muted-foreground">Retention</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">${channel.revenue}</div>
                      <div className="text-xs text-muted-foreground">Revenue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {((channel.revenue / channel.avgViews) * 1000).toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">RPM</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Comparison</CardTitle>
                <CardDescription>This week vs last week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Long Form Videos</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{dashboardData?.weeklyStats?.longFormPosted}</span>
                      <Badge variant="default" className="text-xs">
                        +5%
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Shorts</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{dashboardData?.weeklyStats?.shortsPosted}</span>
                      <Badge variant="default" className="text-xs">
                        +12%
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Views</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {dashboardData?.weeklyStats?.totalViews?.toLocaleString()}
                      </span>
                      <Badge variant="default" className="text-xs">
                        +18%
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Revenue</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        ${dashboardData?.weeklyStats?.totalRevenue?.toFixed(2)}
                      </span>
                      <Badge variant="default" className="text-xs">
                        +23%
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Optimization Insights</CardTitle>
                <CardDescription>AI-generated recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      🎯 Shorts are performing 15% better than long-form content this week
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      📈 CyberSec channel has the highest retention rate - replicate content style
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      ⚡ Consider posting shorts every 90 minutes for maximum reach
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-sm text-purple-800">
                      🔥 "Tutorial" and "Guide" keywords are trending - increase usage
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
