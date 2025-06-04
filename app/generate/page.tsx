"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import Link from "next/link"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
})

export default function GeneratePage() {
  const [channels, setChannels] = useState([])
  const [selectedChannel, setSelectedChannel] = useState("")

  useEffect(() => {
    fetchChannels()
  }, [])

  const fetchChannels = async () => {
    try {
      const response = await fetch("/api/channels")
      const data = await response.json()
      if (data.success) {
        setChannels(data.channels.filter((c) => c.status === "active"))
        if (data.channels.length > 0) {
          setSelectedChannel(data.channels[0].id)
        }
      }
    } catch (error) {
      console.error("Failed to fetch channels:", error)
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <div className="container mx-auto py-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="channelId">YouTube Channel</Label>
            <Select name="channelId" value={selectedChannel} onValueChange={setSelectedChannel} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a channel" />
              </SelectTrigger>
              <SelectContent>
                {channels.map((channel) => (
                  <SelectItem key={channel.id} value={channel.id}>
                    <div className="flex items-center gap-2">
                      {channel.thumbnailUrl && (
                        <img src={channel.thumbnailUrl || "/placeholder.svg"} alt="" className="w-4 h-4 rounded-full" />
                      )}
                      {channel.title}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {channels.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No channels connected.{" "}
                <Link href="/channels" className="text-primary hover:underline">
                  Connect a channel first
                </Link>
              </p>
            )}
          </div>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Video Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Video Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}
