"use server"

import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { Database, NewGitHubToken, UpdateGitHubToken } from "@/lib/supabase/database.types"
import {
  getRepositoryInfo,
  getRecentCommits,
  getOpenIssues,
  getOpenPullRequests,
  getRepositoryBranches,
} from "@/lib/github"

// Save GitHub token
export async function saveGitHubToken(accessToken: string) {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // Check if token already exists
  const { data: existingToken } = await supabase.from("github_tokens").select("id").eq("user_id", user.id).single()

  if (existingToken) {
    // Update existing token
    const tokenData: UpdateGitHubToken = {
      access_token: accessToken,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from("github_tokens").update(tokenData).eq("id", existingToken.id)

    if (error) throw error
  } else {
    // Create new token
    const tokenData: NewGitHubToken = {
      user_id: user.id,
      access_token: accessToken,
    }

    const { error } = await supabase.from("github_tokens").insert(tokenData)

    if (error) throw error
  }

  revalidatePath("/dashboard/settings")
  revalidatePath("/dashboard/projects")
}

// Get GitHub token for current user
export async function getGitHubToken() {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase.from("github_tokens").select("access_token").eq("user_id", user.id).single()

  if (error) return null
  return data.access_token
}

// Connect project to GitHub repository
export async function connectProjectToGitHub(projectId: string, repoUrl: string) {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // Get GitHub token
  const { data: tokenData } = await supabase
    .from("github_tokens")
    .select("access_token")
    .eq("user_id", user.id)
    .single()

  if (!tokenData) throw new Error("GitHub token not found")

  // Verify repository exists and get default branch
  try {
    const repoInfo = await getRepositoryInfo(tokenData.access_token, repoUrl)
    const defaultBranch = repoInfo.default_branch

    // Update project with GitHub info
    const { error } = await supabase
      .from("projects")
      .update({
        github_repo: repoUrl,
        github_connected: true,
        github_default_branch: defaultBranch,
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId)
      .eq("client_id", user.id)

    if (error) throw error

    revalidatePath(`/dashboard/projects/${projectId}`)
    revalidatePath("/dashboard/projects")
  } catch (error) {
    console.error("Error connecting to GitHub:", error)
    throw new Error("Failed to connect to GitHub repository")
  }
}

// Disconnect project from GitHub
export async function disconnectProjectFromGitHub(projectId: string) {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { error } = await supabase
    .from("projects")
    .update({
      github_connected: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", projectId)
    .eq("client_id", user.id)

  if (error) throw error

  revalidatePath(`/dashboard/projects/${projectId}`)
  revalidatePath("/dashboard/projects")
}

// Get repository data for a project
export async function getRepositoryData(projectId: string) {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // Get project
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .eq("client_id", user.id)
    .single()

  if (!project || !project.github_connected || !project.github_repo) {
    throw new Error("Project not connected to GitHub")
  }

  // Get GitHub token
  const { data: tokenData } = await supabase
    .from("github_tokens")
    .select("access_token")
    .eq("user_id", user.id)
    .single()

  if (!tokenData) throw new Error("GitHub token not found")

  // Get repository data
  try {
    const [repoInfo, commits, issues, pullRequests, branches] = await Promise.all([
      getRepositoryInfo(tokenData.access_token, project.github_repo),
      getRecentCommits(tokenData.access_token, project.github_repo),
      getOpenIssues(tokenData.access_token, project.github_repo),
      getOpenPullRequests(tokenData.access_token, project.github_repo),
      getRepositoryBranches(tokenData.access_token, project.github_repo),
    ])

    return {
      repoInfo,
      commits,
      issues,
      pullRequests,
      branches,
    }
  } catch (error) {
    console.error("Error fetching GitHub data:", error)
    throw new Error("Failed to fetch GitHub repository data")
  }
}

// GitHub OAuth callback handler
export async function handleGitHubCallback(code: string) {
  // Exchange code for access token
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  })

  const data = await response.json()

  if (data.error) {
    throw new Error(`GitHub OAuth error: ${data.error_description}`)
  }

  // Save the token
  await saveGitHubToken(data.access_token)

  // Redirect to settings page
  redirect("/dashboard/settings?github=connected")
}
