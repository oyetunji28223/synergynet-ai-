"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import {
  PlusCircle,
  Settings,
  Trash2,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Users,
  Eye,
  Video,
  RefreshCw,
} from "lucide-react"
import { useSearchParams } from "next/navigation"

interface Channel {
  id: string
  title: string
  thumbnailUrl?: string
  subscriberCount: string
  videoCount?: string
  viewCount?: string
  connectedAt: string
  hasAccess: boolean
  status: "active" | "error" | "warning"
}

export default function ChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>([])
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const searchParams = useSearchParams()

  useEffect(() => {
    // Check for URL parameters
    const urlError = searchParams.get("error")
    const urlSuccess = searchParams.get("success")
    const channelName = searchParams.get("channel")

    if (urlError) {
      setError(getErrorMessage(urlError))
    }

    if (urlSuccess === "connected" && channelName) {
      setSuccess(`Successfully connected channel: ${channelName}`)
    }

    fetchChannels()
  }, [searchParams])

  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case "access_denied":
        return "Access was denied. Please try again and grant the necessary permissions."
      case "no_code":
        return "Authorization failed. No authorization code received."
      default:
        return `Connection failed: ${errorCode}`
    }
  }

  const fetchChannels = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/channels")
      const data = await response.json()

      if (data.success) {
        setChannels(data.channels)
      } else {
        setError(data.error || "Failed to fetch channels")
      }
    } catch (err) {
      setError("Failed to fetch channels")
    } finally {
      setLoading(false)
    }
  }

  const connectChannel = async () => {
    try {
      setConnecting(true)
      setError(null)

      const response = await fetch("/api/auth/youtube")
      const data = await response.json()

      if (data.success) {
        window.location.href = data.authUrl
      } else {
        setError(data.error || "Failed to generate authentication URL")
      }
    } catch (err) {
      setError("Failed to initiate connection")
    } finally {
      setConnecting(false)
    }
  }

  const disconnectChannel = async (channelId: string) => {
    if (!confirm("Are you sure you want to disconnect this channel?")) {
      return
    }

    try {
      const response = await fetch(`/api/channels?channelId=${channelId}`, {
        method: "DELETE",
      })
      const data = await response.json()

      if (data.success) {
        setSuccess("Channel disconnected successfully")
        fetchChannels()
      } else {
        setError(data.error || "Failed to disconnect channel")
      }
    } catch (err) {
      setError("Failed to disconnect channel")
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600"
      case "error":
        return "text-red-600"
      case "warning":
        return "text-yellow-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">YouTube Channels</h1>
          <p className="text-muted-foreground">Connect and manage your YouTube channels</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchChannels} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={connectChannel} disabled={connecting}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {connecting ? "Connecting..." : "Connect Channel"}
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Success</AlertTitle>
          <AlertDescription className="text-green-700">{success}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading && channels.length === 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-8" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-4" />
                <div className="grid grid-cols-3 gap-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && channels.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No channels connected</h3>
            <p className="text-muted-foreground mb-6">
              Connect your first YouTube channel to start automating content creation
            </p>
            <Button onClick={connectChannel} disabled={connecting}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Connect Your First Channel
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Channels Grid */}
      {channels.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {channels.map((channel) => (
            <Card key={channel.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {channel.thumbnailUrl ? (
                      <img
                        src={channel.thumbnailUrl || "/placeholder.svg"}
                        alt={channel.title}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                        {channel.title.charAt(0)}
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-lg">{channel.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusIcon(channel.status)}
                        <Badge
                          variant={channel.status === "active" ? "default" : "destructive"}
                          className={getStatusColor(channel.status)}
                        >
                          {channel.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-3 gap-2 text-center mb-4">
                  <div>
                    <div className="text-sm font-medium flex items-center justify-center">
                      <Users className="h-3 w-3 mr-1" />
                      {Number.parseInt(channel.subscriberCount).toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Subscribers</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium flex items-center justify-center">
                      <Video className="h-3 w-3 mr-1" />
                      {channel.videoCount || "0"}
                    </div>
                    <div className="text-xs text-muted-foreground">Videos</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium flex items-center justify-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {channel.viewCount ? Number.parseInt(channel.viewCount).toLocaleString() : "0"}
                    </div>
                    <div className="text-xs text-muted-foreground">Views</div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  Connected: {new Date(channel.connectedAt).toLocaleDateString()}
                </div>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <a href={`https://youtube.com/channel/${channel.id}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Channel
                  </a>
                </Button>
                <div className="flex gap-2">
                  <Button size="sm">Generate Content</Button>
                  <Button variant="destructive" size="sm" onClick={() => disconnectChannel(channel.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Connection Instructions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How to Connect Channels</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Click "Connect Channel" to start the authentication process</li>
            <li>Sign in to your Google account that owns the YouTube channel</li>
            <li>Grant the necessary permissions for content management</li>
            <li>Your channel will appear here once connected successfully</li>
            <li>You can connect multiple channels and manage them all from this dashboard</li>
          </ol>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Required Permissions:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Upload and manage videos</li>
              <li>• View channel analytics</li>
              <li>• Manage thumbnails and metadata</li>
              <li>• Access subscriber and view counts</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
