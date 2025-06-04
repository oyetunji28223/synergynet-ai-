import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

export default function SchedulePage() {
  const scheduledContent = [
    {
      id: 1,
      title: "10 Zero-Day Exploits Every Hacker Should Know",
      channel: "CyberSec",
      date: new Date(2025, 5, 3, 15, 0),
      status: "Ready",
    },
    {
      id: 2,
      title: "Building Undetectable Backdoors with Python",
      channel: "DevHacks",
      date: new Date(2025, 5, 4, 10, 0),
      status: "Rendering",
    },
    {
      id: 3,
      title: "Advanced Network Penetration Techniques",
      channel: "NetSec",
      date: new Date(2025, 5, 5, 14, 0),
      status: "Scripting",
    },
    {
      id: 4,
      title: "Breaking Modern Encryption: A Practical Guide",
      channel: "CodeBreak",
      date: new Date(2025, 5, 6, 17, 0),
      status: "Generating",
    },
    {
      id: 5,
      title: "Reverse Engineering Mobile Apps for Vulnerabilities",
      channel: "HackLab",
      date: new Date(2025, 5, 7, 12, 0),
      status: "Queued",
    },
  ]

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Content Schedule</h1>
          <p className="text-muted-foreground">Manage your publishing calendar</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Schedule New Content
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Select a date to view scheduled content</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" selected={new Date(2025, 5, 3)} className="rounded-md border" />
          </CardContent>
        </Card>

        <Card className="md:col-span-5">
          <CardHeader className="flex flex-row items-center">
            <div className="flex-1">
              <CardTitle>June 3, 2025</CardTitle>
              <CardDescription>1 video scheduled</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scheduledContent
                .filter((content) => content.date.toDateString() === new Date(2025, 5, 3).toDateString())
                .map((content) => (
                  <div key={content.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-14 h-14 rounded bg-muted flex items-center justify-center text-lg font-bold">
                      {content.channel.substring(0, 2)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{content.title}</h3>
                        <Badge
                          variant={
                            content.status === "Ready"
                              ? "default"
                              : content.status === "Rendering"
                                ? "secondary"
                                : content.status === "Scripting"
                                  ? "outline"
                                  : "destructive"
                          }
                        >
                          {content.status}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <span>{content.channel}</span>
                        <span className="mx-2">•</span>
                        <span>{content.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button size="sm">Publish Now</Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Schedule</CardTitle>
            <CardDescription>Next 7 days of content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scheduledContent.map((content) => (
                <div key={content.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-14 h-14 rounded bg-muted flex items-center justify-center text-lg font-bold">
                    {content.channel.substring(0, 2)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{content.title}</h3>
                      <Badge
                        variant={
                          content.status === "Ready"
                            ? "default"
                            : content.status === "Rendering"
                              ? "secondary"
                              : content.status === "Scripting"
                                ? "outline"
                                : "destructive"
                        }
                      >
                        {content.status}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <span>{content.channel}</span>
                      <span className="mx-2">•</span>
                      <span>
                        {content.date.toLocaleDateString()}{" "}
                        {content.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      Reschedule
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
