import { type NextRequest, NextResponse } from "next/server"
import { handleGitHubCallback } from "@/app/actions/github"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const state = searchParams.get("state")

  if (!code) {
    return NextResponse.redirect(new URL("/dashboard/settings?error=no_code", request.url))
  }

  try {
    // In a real app, you would verify the state parameter here
    // to prevent CSRF attacks

    // Exchange code for access token and save it
    await handleGitHubCallback(code)

    return NextResponse.redirect(new URL("/dashboard/settings?github=connected", request.url))
  } catch (error) {
    console.error("Error handling GitHub callback:", error)
    return NextResponse.redirect(new URL("/dashboard/settings?error=github_auth", request.url))
  }
}
