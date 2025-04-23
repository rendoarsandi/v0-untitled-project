"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { CheckCircle2 } from "lucide-react"
import { GitHubConnect } from "@/components/github-connect"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [isGitHubConnected, setIsGitHubConnected] = useState(false)
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const supabase = createClient()

  // Check if GitHub is connected
  useEffect(() => {
    const checkGitHubConnection = async () => {
      const { data } = await supabase.from("github_tokens").select("id").single()
      setIsGitHubConnected(!!data)
    }

    checkGitHubConnection()
  }, [supabase])

  // Show toast for GitHub connection status
  useEffect(() => {
    const githubStatus = searchParams.get("github")
    const error = searchParams.get("error")

    if (githubStatus === "connected") {
      toast({
        title: "GitHub Connected",
        description: "Your GitHub account has been successfully connected.",
      })
    } else if (error === "github_auth") {
      toast({
        title: "GitHub Connection Failed",
        description: "There was an error connecting to GitHub. Please try again.",
        variant: "destructive",
      })
    }
  }, [searchParams, toast])

  const handleSaveProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)

    // In a real app, you would handle the form submission here
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })
    }, 1000)
  }

  const handleDisconnectGitHub = async () => {
    if (!window.confirm("Are you sure you want to disconnect your GitHub account?")) {
      return
    }

    try {
      await supabase
        .from("github_tokens")
        .delete()
        .match({ user_id: (await supabase.auth.getUser()).data.user?.id })
      setIsGitHubConnected(false)
      toast({
        title: "GitHub Disconnected",
        description: "Your GitHub account has been disconnected.",
      })
    } catch (error) {
      console.error("Error disconnecting GitHub:", error)
      toast({
        title: "Error",
        description: "There was an error disconnecting your GitHub account. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card>
            <form onSubmit={handleSaveProfile}>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="John Doe" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john@example.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" defaultValue="Acme Inc" />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Update your password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Update Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-6 space-y-6">
          {isGitHubConnected ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>GitHub</CardTitle>
                  <div className="flex items-center gap-2 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Connected</span>
                  </div>
                </div>
                <CardDescription>Your GitHub account is connected</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  You can now link your projects to GitHub repositories and track code changes, issues, and pull
                  requests.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={handleDisconnectGitHub}>
                  Disconnect GitHub
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <GitHubConnect clientId={process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || ""} />
          )}
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="project-updates">Project Updates</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications about your project progress</p>
                  </div>
                  <Switch id="project-updates" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="quote-notifications">Quote Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications when you get a new quote</p>
                  </div>
                  <Switch id="quote-notifications" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="payment-reminders">Payment Reminders</Label>
                    <p className="text-sm text-muted-foreground">Receive reminders about upcoming payments</p>
                  </div>
                  <Switch id="payment-reminders" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="github-notifications">GitHub Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications about GitHub activity</p>
                  </div>
                  <Switch id="github-notifications" defaultChecked={isGitHubConnected} disabled={!isGitHubConnected} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Receive emails about new features and offers</p>
                  </div>
                  <Switch id="marketing-emails" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-16 rounded bg-muted" />
                      <div>
                        <p className="font-medium">•••• •••• •••• 4242</p>
                        <p className="text-sm text-muted-foreground">Expires 12/24</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Add Payment Method</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>View your billing history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">E-commerce Mobile App (50% Deposit)</p>
                    <p className="text-sm text-muted-foreground">Oct 15, 2023</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$4,250.00</p>
                    <p className="text-sm text-green-500">Paid</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Portfolio Website (50% Deposit)</p>
                    <p className="text-sm text-muted-foreground">Sep 1, 2023</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$1,500.00</p>
                    <p className="text-sm text-green-500">Paid</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Task Management System (50% Deposit)</p>
                    <p className="text-sm text-muted-foreground">Aug 15, 2023</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$3,000.00</p>
                    <p className="text-sm text-green-500">Paid</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
