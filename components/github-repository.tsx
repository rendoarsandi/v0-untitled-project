"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Github,
  GitBranch,
  GitCommit,
  GitPullRequest,
  AlertCircle,
  ExternalLink,
  Code,
  MessageSquare,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { connectProjectToGitHub, disconnectProjectFromGitHub, getRepositoryData } from "@/app/actions/github"
import { extractRepoInfo } from "@/lib/github"

export function GitHubRepository({
  projectId,
  repoUrl,
  isConnected,
}: { projectId: string; repoUrl: string | null; isConnected: boolean }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isDisconnecting, setIsDisconnecting] = useState(false)
  const [repoData, setRepoData] = useState<any>(null)
  const [repoInput, setRepoInput] = useState(repoUrl || "")
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Fetch repository data if connected
  useEffect(() => {
    if (isConnected && repoUrl) {
      fetchRepoData()
    }
  }, [isConnected, repoUrl])

  const fetchRepoData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await getRepositoryData(projectId)
      setRepoData(data)
    } catch (error) {
      console.error("Error fetching repository data:", error)
      setError("Failed to fetch repository data. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnect = async () => {
    if (!repoInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid GitHub repository URL.",
        variant: "destructive",
      })
      return
    }

    setIsConnecting(true)
    setError(null)

    try {
      // Validate GitHub URL
      extractRepoInfo(repoInput)

      await connectProjectToGitHub(projectId, repoInput)
      toast({
        title: "Success",
        description: "Project connected to GitHub repository successfully!",
      })

      // Refresh the page to show the connected repository
      window.location.reload()
    } catch (error) {
      console.error("Error connecting to GitHub:", error)
      setError("Failed to connect to GitHub repository. Please check the URL and try again.")
      toast({
        title: "Error",
        description: "Failed to connect to GitHub repository. Please check the URL and try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    if (!window.confirm("Are you sure you want to disconnect this project from GitHub?")) {
      return
    }

    setIsDisconnecting(true)

    try {
      await disconnectProjectFromGitHub(projectId)
      toast({
        title: "Success",
        description: "Project disconnected from GitHub repository.",
      })

      // Refresh the page to show the disconnected state
      window.location.reload()
    } catch (error) {
      console.error("Error disconnecting from GitHub:", error)
      toast({
        title: "Error",
        description: "Failed to disconnect from GitHub repository. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDisconnecting(false)
    }
  }

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connect to GitHub</CardTitle>
          <CardDescription>Link this project to a GitHub repository to track code changes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-2">
            <Label htmlFor="repo-url">GitHub Repository URL</Label>
            <Input
              id="repo-url"
              placeholder="https://github.com/username/repository"
              value={repoInput}
              onChange={(e) => setRepoInput(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Example: https://github.com/username/repository</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleConnect} disabled={isConnecting}>
            <Github className="mr-2 h-4 w-4" />
            {isConnecting ? "Connecting..." : "Connect Repository"}
          </Button>
        </CardFooter>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>GitHub Repository</CardTitle>
          <CardDescription>Loading repository data...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-6">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>GitHub Repository</CardTitle>
          <CardDescription>
            Connected to{" "}
            <a
              href={repoUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              {repoUrl}
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={fetchRepoData}>
            Retry
          </Button>
          <Button variant="outline" onClick={handleDisconnect} disabled={isDisconnecting}>
            {isDisconnecting ? "Disconnecting..." : "Disconnect Repository"}
          </Button>
        </CardFooter>
      </Card>
    )
  }

  if (!repoData) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>GitHub Repository</CardTitle>
          <Badge variant="outline" className="flex items-center gap-1">
            <GitBranch className="h-3.5 w-3.5" />
            {repoData.repoInfo.default_branch}
          </Badge>
        </div>
        <CardDescription>
          <a
            href={repoData.repoInfo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-medium text-primary hover:underline"
          >
            {repoData.repoInfo.full_name}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="commits">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="commits"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Commits
            </TabsTrigger>
            <TabsTrigger
              value="issues"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Issues
            </TabsTrigger>
            <TabsTrigger
              value="pulls"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Pull Requests
            </TabsTrigger>
          </TabsList>
          <TabsContent value="commits" className="p-4">
            <div className="space-y-4">
              {repoData.commits.slice(0, 5).map((commit: any) => (
                <div key={commit.sha} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <GitCommit className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={commit.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium hover:underline"
                    >
                      {commit.commit.message.split("\n")[0].substring(0, 60)}
                      {commit.commit.message.split("\n")[0].length > 60 ? "..." : ""}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{commit.commit.author.name}</span>
                    <span>•</span>
                    <span>{new Date(commit.commit.author.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="font-mono">{commit.sha.substring(0, 7)}</span>
                  </div>
                </div>
              ))}
              {repoData.commits.length === 0 && (
                <p className="text-sm text-muted-foreground">No commits found in this repository.</p>
              )}
            </div>
            {repoData.commits.length > 0 && (
              <div className="mt-4 text-center">
                <a
                  href={`${repoData.repoInfo.html_url}/commits`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  View all commits
                </a>
              </div>
            )}
          </TabsContent>
          <TabsContent value="issues" className="p-4">
            <div className="space-y-4">
              {repoData.issues.slice(0, 5).map((issue: any) => (
                <div key={issue.id} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={issue.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium hover:underline"
                    >
                      {issue.title.substring(0, 60)}
                      {issue.title.length > 60 ? "..." : ""}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>#{issue.number}</span>
                    <span>•</span>
                    <span>Opened by {issue.user.login}</span>
                    <span>•</span>
                    <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              {repoData.issues.length === 0 && (
                <p className="text-sm text-muted-foreground">No open issues found in this repository.</p>
              )}
            </div>
            {repoData.issues.length > 0 && (
              <div className="mt-4 text-center">
                <a
                  href={`${repoData.repoInfo.html_url}/issues`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  View all issues
                </a>
              </div>
            )}
          </TabsContent>
          <TabsContent value="pulls" className="p-4">
            <div className="space-y-4">
              {repoData.pullRequests.slice(0, 5).map((pr: any) => (
                <div key={pr.id} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <GitPullRequest className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={pr.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium hover:underline"
                    >
                      {pr.title.substring(0, 60)}
                      {pr.title.length > 60 ? "..." : ""}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>#{pr.number}</span>
                    <span>•</span>
                    <span>
                      {pr.head.ref} → {pr.base.ref}
                    </span>
                    <span>•</span>
                    <span>{new Date(pr.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              {repoData.pullRequests.length === 0 && (
                <p className="text-sm text-muted-foreground">No open pull requests found in this repository.</p>
              )}
            </div>
            {repoData.pullRequests.length > 0 && (
              <div className="mt-4 text-center">
                <a
                  href={`${repoData.repoInfo.html_url}/pulls`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  View all pull requests
                </a>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t px-6 py-4">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Code className="h-4 w-4 text-muted-foreground" />
            <span>{repoData.repoInfo.language}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitBranch className="h-4 w-4 text-muted-foreground" />
            <span>{repoData.branches.length} branches</span>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleDisconnect} disabled={isDisconnecting}>
          {isDisconnecting ? "Disconnecting..." : "Disconnect"}
        </Button>
      </CardFooter>
    </Card>
  )
}
