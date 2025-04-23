"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Github } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function GitHubConnect({ clientId }: { clientId: string }) {
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  const handleConnect = () => {
    setIsConnecting(true)

    try {
      // Generate a random state for CSRF protection
      const state = Math.random().toString(36).substring(2, 15)

      // Store state in localStorage for verification when the user returns
      localStorage.setItem("github_oauth_state", state)

      // Redirect to GitHub OAuth
      const authUrl = new URL("https://github.com/login/oauth/authorize")
      authUrl.searchParams.append("client_id", clientId)
      authUrl.searchParams.append("redirect_uri", `${window.location.origin}/api/github/callback`)
      authUrl.searchParams.append("scope", "repo")
      authUrl.searchParams.append("state", state)

      window.location.href = authUrl.toString()
    } catch (error) {
      console.error("Error connecting to GitHub:", error)
      toast({
        title: "Error",
        description: "There was an error connecting to GitHub. Please try again.",
        variant: "destructive",
      })
      setIsConnecting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect to GitHub</CardTitle>
        <CardDescription>
          Connect your GitHub account to track repositories, commits, issues, and pull requests.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Connecting to GitHub allows you to:</p>
        <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
          <li>Link projects to specific repositories</li>
          <li>View recent commits and code changes</li>
          <li>Track open issues and pull requests</li>
          <li>Monitor repository activity</li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleConnect} disabled={isConnecting}>
          <Github className="mr-2 h-4 w-4" />
          {isConnecting ? "Connecting..." : "Connect to GitHub"}
        </Button>
      </CardFooter>
    </Card>
  )
}
