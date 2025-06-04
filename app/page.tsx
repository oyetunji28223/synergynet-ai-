import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Code, LineChart, Settings, Upload, Users, Video } from "lucide-react"
import { ChannelStats } from "@/components/channel-stats"
import { ContentQueue } from "@/components/content-queue"
import { RecentVideos } from "@/components/recent-videos"

export default function Dashboard() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Video className="h-6 w-6" />
          <span>HackerTube</span>
        </Link>
        <nav className="ml-auto flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button size="sm">
            <Upload className="mr-2 h-4 w-4" />
            New Video
          </Button>
        </nav>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-[200px] flex-col border-r px-4 py-6 md:flex">
          <nav className="grid gap-2">
            <Link href="#" className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm font-medium bg-accent">
              <LineChart className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-primary"
            >
              <Video className="h-4 w-4" />
              Videos
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-primary"
            >
              <Users className="h-4 w-4" />
              Channels
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-primary"
            >
              <Code className="h-4 w-4" />
              Templates
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-primary"
            >
              <CalendarDays className="h-4 w-4" />
              Schedule
            </Link>
          </nav>
        </aside>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Channels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Videos Published</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">127</div>
                <p className="text-xs text-muted-foreground">+23 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.2M</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85.2K</div>
                <p className="text-xs text-muted-foreground">+5.2K from last month</p>
              </CardContent>
            </Card>
          </div>
          <Tabs defaultValue="overview">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="channels">Channels</TabsTrigger>
                <TabsTrigger value="queue">Content Queue</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Channel Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <ChannelStats />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Upcoming Content</CardTitle>
                    <CardDescription>Videos scheduled for the next 7 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ContentQueue />
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Videos</CardTitle>
                    <CardDescription>Latest videos published across all channels</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentVideos />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
