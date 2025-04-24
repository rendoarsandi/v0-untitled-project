import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, CheckCircle, XCircle } from "lucide-react"

export default function SetupPage() {
  // Check if environment variables are set
  const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
  const hasSupabaseAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const hasGithubClientId = !!process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
  const hasGithubClientSecret = !!process.env.GITHUB_CLIENT_SECRET

  // Calculate overall setup status
  const isSupabaseConfigured = hasSupabaseUrl && hasSupabaseAnonKey
  const isGithubConfigured = hasGithubClientId && hasGithubClientSecret

  return (
    <div className="container flex min-h-screen flex-col items-center justify-center py-12">
      <div className="mx-auto w-full max-w-3xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Project Management Setup</h1>
          <p className="mt-2 text-muted-foreground">
            Configure your environment to get started with the project management application
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Supabase Configuration</CardTitle>
            <CardDescription>Supabase is used for authentication and database storage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">NEXT_PUBLIC_SUPABASE_URL</p>
                <p className="text-sm text-muted-foreground">Your Supabase project URL</p>
              </div>
              {hasSupabaseUrl ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY</p>
                <p className="text-sm text-muted-foreground">Your Supabase anonymous key</p>
              </div>
              {hasSupabaseAnonKey ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>

            {!isSupabaseConfigured && (
              <div className="rounded-md bg-amber-50 p-4 text-sm text-amber-800">
                <p className="font-medium">Missing Supabase Configuration</p>
                <ol className="mt-2 list-decimal pl-5 space-y-1">
                  <li>
                    Create a Supabase project at{" "}
                    <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline">
                      supabase.com
                    </a>
                  </li>
                  <li>Go to Project Settings &gt; API</li>
                  <li>Copy the URL and anon key</li>
                  <li>Add them to your .env.local file</li>
                </ol>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>GitHub Integration</CardTitle>
            <CardDescription>GitHub is used for repository integration and code tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">NEXT_PUBLIC_GITHUB_CLIENT_ID</p>
                <p className="text-sm text-muted-foreground">Your GitHub OAuth App client ID</p>
              </div>
              {hasGithubClientId ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">GITHUB_CLIENT_SECRET</p>
                <p className="text-sm text-muted-foreground">Your GitHub OAuth App client secret</p>
              </div>
              {hasGithubClientSecret ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>

            {!isGithubConfigured && (
              <div className="rounded-md bg-amber-50 p-4 text-sm text-amber-800">
                <p className="font-medium">Missing GitHub Configuration</p>
                <ol className="mt-2 list-decimal pl-5 space-y-1">
                  <li>
                    Create a GitHub OAuth App at{" "}
                    <a
                      href="https://github.com/settings/developers"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      github.com/settings/developers
                    </a>
                  </li>
                  <li>
                    Set the Authorization callback URL to{" "}
                    <code>
                      {typeof window !== "undefined"
                        ? `${window.location.origin}/api/github/callback`
                        : "[your-domain]/api/github/callback"}
                    </code>
                  </li>
                  <li>Copy the Client ID and Client Secret</li>
                  <li>Add them to your .env.local file</li>
                </ol>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
            <CardDescription>Add these variables to your .env.local file</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="rounded-md bg-muted p-4 overflow-x-auto">
              <code>
                {`# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# GitHub Integration
NEXT_PUBLIC_GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret`}
              </code>
            </pre>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              After adding these variables, restart your development server
            </p>
          </CardFooter>
        </Card>

        <div className="flex justify-center">
          <Link href="/">
            <Button>
              Go to Homepage
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
