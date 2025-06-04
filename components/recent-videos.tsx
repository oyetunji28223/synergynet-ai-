import Image from "next/image"
import { Eye, ThumbsUp, MessageSquare } from "lucide-react"

export function RecentVideos() {
  const videos = [
    {
      id: 1,
      title: "How to Bypass Two-Factor Authentication",
      channel: "CyberSec",
      views: "124K",
      likes: "8.2K",
      comments: "342",
      publishedAt: "2 days ago",
    },
    {
      id: 2,
      title: "Building Undetectable Malware with Rust",
      channel: "DevHacks",
      views: "98K",
      likes: "7.1K",
      comments: "289",
      publishedAt: "3 days ago",
    },
    {
      id: 3,
      title: "Advanced SQL Injection Techniques",
      channel: "CodeBreak",
      views: "156K",
      likes: "12.3K",
      comments: "521",
      publishedAt: "5 days ago",
    },
    {
      id: 4,
      title: "Hacking IoT Devices: A Practical Guide",
      channel: "HackLab",
      views: "203K",
      likes: "15.7K",
      comments: "632",
      publishedAt: "1 week ago",
    },
  ]

  return (
    <div className="space-y-4">
      {videos.map((video) => (
        <div key={video.id} className="flex items-start gap-4">
          <div className="relative w-32 h-20 rounded-md overflow-hidden">
            <Image
              src={`/placeholder.svg?height=80&width=128&text=${encodeURIComponent(video.channel)}`}
              alt={video.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium">{video.title}</h4>
            <p className="text-xs text-muted-foreground">{video.channel}</p>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center text-xs text-muted-foreground">
                <Eye className="mr-1 h-3 w-3" />
                {video.views}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <ThumbsUp className="mr-1 h-3 w-3" />
                {video.likes}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <MessageSquare className="mr-1 h-3 w-3" />
                {video.comments}
              </div>
              <div className="text-xs text-muted-foreground ml-auto">{video.publishedAt}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
