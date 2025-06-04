import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Copy, Edit, Plus, Trash } from "lucide-react"

export default function TemplatesPage() {
  const templates = [
    {
      id: 1,
      name: "Zero-Day Exploit Analysis",
      description: "Technical breakdown of recent zero-day vulnerabilities",
      channel: "CyberSec",
      lastUsed: "2 days ago",
      type: "Educational",
    },
    {
      id: 2,
      name: "Code Review & Vulnerabilities",
      description: "Reviewing open-source code for security issues",
      channel: "DevHacks",
      lastUsed: "1 week ago",
      type: "Tutorial",
    },
    {
      id: 3,
      name: "Network Penetration Demo",
      description: "Step-by-step network penetration testing",
      channel: "NetSec",
      lastUsed: "3 days ago",
      type: "Demo",
    },
    {
      id: 4,
      name: "Encryption Breaking Challenge",
      description: "Breaking different encryption algorithms",
      channel: "CodeBreak",
      lastUsed: "5 days ago",
      type: "Challenge",
    },
    {
      id: 5,
      name: "Hardware Hacking Walkthrough",
      description: "Exploiting vulnerabilities in consumer hardware",
      channel: "HackLab",
      lastUsed: "Yesterday",
      type: "Walkthrough",
    },
  ]

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Content Templates</h1>
          <p className="text-muted-foreground">Reusable templates for faster content generation</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>

      <Tabs defaultValue="all">
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="all">All Templates</TabsTrigger>
            <TabsTrigger value="educational">Educational</TabsTrigger>
            <TabsTrigger value="tutorial">Tutorials</TabsTrigger>
            <TabsTrigger value="demo">Demos</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{template.name}</CardTitle>
                      <CardDescription className="mt-1">{template.channel}</CardDescription>
                    </div>
                    <Badge>{template.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                  <p className="text-xs text-muted-foreground mt-4">Last used: {template.lastUsed}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button>Use Template</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="educational">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {templates
              .filter((t) => t.type === "Educational")
              .map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{template.name}</CardTitle>
                        <CardDescription className="mt-1">{template.channel}</CardDescription>
                      </div>
                      <Badge>{template.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                    <p className="text-xs text-muted-foreground mt-4">Last used: {template.lastUsed}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button>Use Template</Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* Other tab contents would be similar */}
      </Tabs>

      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Create New Template</CardTitle>
            <CardDescription>Define a reusable content structure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="template-name">Template Name</Label>
                <Input id="template-name" placeholder="e.g., Security Vulnerability Analysis" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="template-type">Template Type</Label>
                <Input id="template-type" placeholder="e.g., Educational, Tutorial, Demo" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="template-description">Description</Label>
              <Input id="template-description" placeholder="Brief description of this template" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="template-structure">Content Structure</Label>
              <div className="border rounded-md p-4 space-y-2">
                <div className="p-2 border rounded-md bg-muted/50">
                  <p className="font-medium">Introduction</p>
                  <p className="text-sm text-muted-foreground">Brief overview of the topic</p>
                </div>
                <div className="p-2 border rounded-md bg-muted/50">
                  <p className="font-medium">Technical Background</p>
                  <p className="text-sm text-muted-foreground">Explain necessary technical concepts</p>
                </div>
                <div className="p-2 border rounded-md bg-muted/50">
                  <p className="font-medium">Demonstration</p>
                  <p className="text-sm text-muted-foreground">Show the vulnerability or technique</p>
                </div>
                <div className="p-2 border rounded-md bg-muted/50">
                  <p className="font-medium">Analysis</p>
                  <p className="text-sm text-muted-foreground">Explain implications and technical details</p>
                </div>
                <div className="p-2 border rounded-md bg-muted/50">
                  <p className="font-medium">Conclusion</p>
                  <p className="text-sm text-muted-foreground">Summarize key points and takeaways</p>
                </div>
                <Button variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Section
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Save Template</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
