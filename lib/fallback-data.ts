export function generateFallbackChannelStats(channelId: string) {
  return {
    subscribers: Math.floor(Math.random() * 100000) + 10000,
    views: Math.floor(Math.random() * 1000000) + 100000,
    videos: Math.floor(Math.random() * 500) + 50,
    title: `Channel ${channelId.slice(-8)}`,
    description: "YouTube Channel",
    thumbnailUrl: "/placeholder.svg?height=88&width=88",
    lastUpdated: new Date().toISOString(),
  }
}

export function generateFallbackVideoAnalytics(videoId: string) {
  return {
    views: Math.floor(Math.random() * 50000) + 1000,
    likes: Math.floor(Math.random() * 2000) + 100,
    comments: Math.floor(Math.random() * 500) + 20,
    duration: "PT10M30S",
    publishedAt: new Date().toISOString(),
    title: `Video ${videoId.slice(-8)}`,
    description: "Generated video content",
    thumbnailUrl: "/placeholder.svg?height=180&width=320",
    lastUpdated: new Date().toISOString(),
  }
}

export function generateFallbackRetentionCurve() {
  const curve = []
  let retention = 0.95

  for (let i = 0; i <= 600; i += 30) {
    if (i === 0) retention = 0.95
    else if (i === 120) retention += 0.03
    else if (i === 300) retention += 0.02
    else retention -= 0.015 + Math.random() * 0.01

    retention = Math.max(0.25, Math.min(0.95, retention))

    curve.push({
      timestamp: i,
      retention: Math.round(retention * 100) / 100,
    })
  }

  return curve
}
