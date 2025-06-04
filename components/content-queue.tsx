import { CalendarDays } from "lucide-react"

export function ContentQueue() {
  const queuedContent = [
    {
      id: 1,
      title: "10 Zero-Day Exploits Every Hacker Should Know",
      channel: "CyberSec",
      scheduledFor: "Today, 3:00 PM",
      status: "Ready",
    },
    {
      id: 2,
      title: "Building Undetectable Backdoors with Python",
      channel: "DevHacks",
      scheduledFor: "Tomorrow, 10:00 AM",
      status: "Rendering",
    },
    {
      id: 3,
      title: "Advanced Network Penetration Techniques",
      channel: "NetSec",
      scheduledFor: "Jun 5, 2:00 PM",
      status: "Scripting",
    },
    {
      id: 4,
      title: "Breaking Modern Encryption: A Practical Guide",
      channel: "CodeBreak",
      scheduledFor: "Jun 6, 5:00 PM",
      status: "Generating",
    },
    {
      id: 5,
      title: "Reverse Engineering Mobile Apps for Vulnerabilities",
      channel: "HackLab",
      scheduledFor: "Jun 7, 12:00 PM",
      status: "Queued",
    },
  ]

  return (
    <div className="space-y-4">
      {queuedContent.map((content) => (
        <div key={content.id} className="flex items-center gap-4">
          <div className="w-14 h-14 rounded bg-muted flex items-center justify-center">
            <CalendarDays className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{content.title}</p>
            <p className="text-xs text-muted-foreground">{content.channel}</p>
            <div className="flex items-center pt-1">
              <span className="text-xs text-muted-foreground">{content.scheduledFor}</span>
              <span
                className={`ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  content.status === "Ready"
                    ? "bg-green-100 text-green-800"
                    : content.status === "Rendering"
                      ? "bg-yellow-100 text-yellow-800"
                      : content.status === "Scripting"
                        ? "bg-blue-100 text-blue-800"
                        : content.status === "Generating"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                }`}
              >
                {content.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
