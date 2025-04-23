import { Octokit } from "octokit"

// Initialize Octokit with the GitHub token
export function createGitHubClient(accessToken: string) {
  return new Octokit({ auth: accessToken })
}

// Extract owner and repo from GitHub URL
export function extractRepoInfo(repoUrl: string) {
  try {
    const url = new URL(repoUrl)
    if (url.hostname !== "github.com") {
      throw new Error("Not a GitHub URL")
    }

    const parts = url.pathname.split("/").filter(Boolean)
    if (parts.length < 2) {
      throw new Error("Invalid GitHub repository URL")
    }

    return {
      owner: parts[0],
      repo: parts[1],
    }
  } catch (error) {
    console.error("Error parsing GitHub URL:", error)
    throw new Error("Invalid GitHub repository URL")
  }
}

// Get repository information
export async function getRepositoryInfo(accessToken: string, repoUrl: string) {
  const { owner, repo } = extractRepoInfo(repoUrl)
  const octokit = createGitHubClient(accessToken)

  const { data } = await octokit.rest.repos.get({
    owner,
    repo,
  })

  return data
}

// Get recent commits
export async function getRecentCommits(accessToken: string, repoUrl: string, perPage = 10) {
  const { owner, repo } = extractRepoInfo(repoUrl)
  const octokit = createGitHubClient(accessToken)

  const { data } = await octokit.rest.repos.listCommits({
    owner,
    repo,
    per_page: perPage,
  })

  return data
}

// Get open issues
export async function getOpenIssues(accessToken: string, repoUrl: string, perPage = 10) {
  const { owner, repo } = extractRepoInfo(repoUrl)
  const octokit = createGitHubClient(accessToken)

  const { data } = await octokit.rest.issues.listForRepo({
    owner,
    repo,
    state: "open",
    per_page: perPage,
  })

  // Filter out pull requests (GitHub API returns PRs as issues)
  return data.filter((issue) => !issue.pull_request)
}

// Get open pull requests
export async function getOpenPullRequests(accessToken: string, repoUrl: string, perPage = 10) {
  const { owner, repo } = extractRepoInfo(repoUrl)
  const octokit = createGitHubClient(accessToken)

  const { data } = await octokit.rest.pulls.list({
    owner,
    repo,
    state: "open",
    per_page: perPage,
  })

  return data
}

// Get repository branches
export async function getRepositoryBranches(accessToken: string, repoUrl: string) {
  const { owner, repo } = extractRepoInfo(repoUrl)
  const octokit = createGitHubClient(accessToken)

  const { data } = await octokit.rest.repos.listBranches({
    owner,
    repo,
  })

  return data
}
