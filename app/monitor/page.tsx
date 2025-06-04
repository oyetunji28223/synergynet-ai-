"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, AlertCircle, CheckCircle, Clock, Database, HardDrive, RefreshCw, Server, Zap } from "lucide-react"

export default function MonitorPage() {
  const [loading, setLoading] = useState(true)
  const [systemStatus, setSystemStatus] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchSystemStatus = async () => {
    setLoading(true)
    try {
      // In a real app, this would fetch from an API
      // For demo purposes, we'll simulate the API response
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSystemStatus({
        status: "healthy",
        components: {
          api: { status: "healthy", latency: 120 },
          database: { status: "healthy", latency: 45 },
          storage: { status: "healthy", usage: 68 },
          queue: { status: "healthy", size: 12 },
          youtube: { status: "healthy", quota: 82 },
        },
        metrics: {
          requestsPerMinute: 42,
          successRate: 98.7,
          averageProcessingTime: 8.2,
          activeJobs: 3,
          completedJobs: 127,
          failedJobs: 2,
        },
        recentErrors: [
          { id: 1, message: "YouTube API quota exceeded", timestamp: "2025-06-03T09:45:12Z", resolved: true },
          { id: 2, message: "Video rendering timeout", timestamp: "2025-06-03T08:12:05Z", resolved: false },
        ],
      })
      setLastUpdated(new Date())
    } catch (err) {
      setError("Failed to fetch system status")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSystemStatus()

    // Set up polling every 30 seconds
    const interval = setInterval(fetchSystemStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-500"
      case "degraded":
        return "bg-yellow-500"
      case "critical":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">System Monitor</h1>
          <p className="text-muted-foreground">Real-time system health and performance</p>
        </div>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <p className="text-sm text-muted-foreground flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
          <Button variant="outline" onClick={fetchSystemStatus} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {systemStatus && (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">System Status</CardTitle>
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(systemStatus.status)}`}></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{systemStatus.status}</div>
                <p className="text-xs text-muted-foreground">All systems operational</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemStatus.metrics.activeJobs}</div>
                <p className="text-xs text-muted-foreground">
                  {systemStatus.metrics.completedJobs} completed, {systemStatus.metrics.failedJobs} failed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemStatus.metrics.successRate}%</div>
                <Progress value={systemStatus.metrics.successRate} className="h-1 mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Processing Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemStatus.metrics.averageProcessingTime}s</div>
                <p className="text-xs text-muted-foreground">Average per video</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="components">
            <TabsList className="mb-4">
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="errors">Recent Errors</TabsTrigger>
            </TabsList>

            <TabsContent value="components">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Server className="h-4 w-4 mr-2" />
                        <CardTitle className="text-sm font-medium">API Service</CardTitle>
                      </div>
                      <div
                        className={`w-2 h-2 rounded-full ${getStatusColor(systemStatus.components.api.status)}`}
                      ></div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{systemStatus.components.api.latency}ms</div>
                    <p className="text-xs text-muted-foreground">Average response time</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Database className="h-4 w-4 mr-2" />
                        <CardTitle className="text-sm font-medium">Database</CardTitle>
                      </div>
                      <div
                        className={`w-2 h-2 rounded-full ${getStatusColor(systemStatus.components.database.status)}`}
                      ></div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{systemStatus.components.database.latency}ms</div>
                    <p className="text-xs text-muted-foreground">Query response time</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <HardDrive className="h-4 w-4 mr-2" />
                        <CardTitle className="text-sm font-medium">Storage</CardTitle>
                      </div>
                      <div
                        className={`w-2 h-2 rounded-full ${getStatusColor(systemStatus.components.storage.status)}`}
                      ></div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{systemStatus.components.storage.usage}%</div>
                    <Progress value={systemStatus.components.storage.usage} className="h-1 mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Activity className="h-4 w-4 mr-2" />
                        <CardTitle className="text-sm font-medium">Queue</CardTitle>
                      </div>
                      <div
                        className={`w-2 h-2 rounded-full ${getStatusColor(systemStatus.components.queue.status)}`}
                      ></div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{systemStatus.components.queue.size}</div>
                    <p className="text-xs text-muted-foreground">Pending jobs</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Zap className="h-4 w-4 mr-2" />
                        <CardTitle className="text-sm font-medium">YouTube API</CardTitle>
                      </div>
                      <div
                        className={`w-2 h-2 rounded-full ${getStatusColor(systemStatus.components.youtube.status)}`}
                      ></div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{systemStatus.components.youtube.quota}%</div>
                    <p className="text-xs text-muted-foreground">Daily quota usage</p>
                    <Progress value={systemStatus.components.youtube.quota} className="h-1 mt-2" />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="metrics">
              <Card>
                <CardHeader>
                  <CardTitle>System Metrics</CardTitle>
                  <CardDescription>Real-time performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Requests Per Minute</span>
                        <span className="text-sm">{systemStatus.metrics.requestsPerMinute}</span>
                      </div>
                      <Progress value={systemStatus.metrics.requestsPerMinute / 2} className="h-2" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Success Rate</span>
                        <span className="text-sm">{systemStatus.metrics.successRate}%</span>
                      </div>
                      <Progress value={systemStatus.metrics.successRate} className="h-2" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Average Processing Time</span>
                        <span className="text-sm">{systemStatus.metrics.averageProcessingTime}s</span>
                      </div>
                      <Progress value={systemStatus.metrics.averageProcessingTime * 5} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="errors">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Errors</CardTitle>
                  <CardDescription>System errors in the last 24 hours</CardDescription>
                </CardHeader>
                <CardContent>
                  {systemStatus.recentErrors.length > 0 ? (
                    <div className="space-y-4">
                      {systemStatus.recentErrors.map((error: any) => (
                        <div key={error.id} className="flex items-start p-4 border rounded-lg">
                          <div
                            className={`mt-0.5 w-2 h-2 rounded-full ${error.resolved ? "bg-green-500" : "bg-red-500"} mr-3`}
                          ></div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{error.message}</p>
                              <Badge variant={error.resolved ? "outline" : "destructive"}>
                                {error.resolved ? "Resolved" : "Active"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {new Date(error.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <CheckCircle className="mx-auto h-8 w-8 text-green-500" />
                        <p className="mt-2 font-medium">No errors detected</p>
                        <p className="text-sm text-muted-foreground">All systems are running smoothly</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
