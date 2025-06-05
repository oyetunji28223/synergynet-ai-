"use client"

import { useState } from "react"
import { useUser } from "@/contexts/user-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AuthForm() {
  const { signIn, signUp } = useUser()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSignIn = async (formData: FormData) => {
    setLoading(true)
    setMessage("")

    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const { error } = await signIn(email, password)

    if (error) {
      setMessage(error.message)
    }

    setLoading(false)
  }

  const handleSignUp = async (formData: FormData) => {
    setLoading(true)
    setMessage("")

    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const name = formData.get("name") as string

    const { error } = await signUp(email, password, name)

    if (error) {
      setMessage(error.message)
    } else {
      setMessage("Check your email for the confirmation link!")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Health Support Center</CardTitle>
          <CardDescription>Sign in to access your health dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form action={handleSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="signin-email">Email</Label>
                  <Input id="signin-email" name="email" type="email" required placeholder="your@email.com" />
                </div>
                <div>
                  <Label htmlFor="signin-password">Password</Label>
                  <Input id="signin-password" name="password" type="password" required placeholder="Your password" />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form action={handleSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="signup-name">Name</Label>
                  <Input id="signup-name" name="name" type="text" placeholder="Your full name" />
                </div>
                <div>
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" name="email" type="email" required placeholder="your@email.com" />
                </div>
                <div>
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    required
                    placeholder="Choose a password"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating account..." : "Sign Up"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {message && (
            <div
              className={`mt-4 p-3 rounded-lg text-sm ${
                message.includes("Check your email") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
              }`}
            >
              {message}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
