"use server"

import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { revalidatePath } from "next/cache"
import type { Database, NewProject, UpdateProject } from "@/lib/supabase/database.types"

// Get all projects for the current user
export async function getProjects() {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("client_id", user.id)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

// Get a single project by ID
export async function getProject(id: string) {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("projects")
    .select(`
      *,
      quotes (*),
      project_updates (*),
      feedback (*),
      project_milestones (*)
    `)
    .eq("id", id)
    .eq("client_id", user.id)
    .single()

  if (error) throw error
  return data
}

// Create a new project
export async function createProject(project: NewProject) {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // Ensure client_id is set to the current user
  project.client_id = user.id

  const { data, error } = await supabase.from("projects").insert(project).select().single()

  if (error) throw error

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/projects")

  return data
}

// Update an existing project
export async function updateProject(id: string, project: UpdateProject) {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // Set updated_at to current time
  project.updated_at = new Date().toISOString()

  const { data, error } = await supabase
    .from("projects")
    .update(project)
    .eq("id", id)
    .eq("client_id", user.id)
    .select()
    .single()

  if (error) throw error

  revalidatePath(`/dashboard/projects/${id}`)
  revalidatePath("/dashboard/projects")
  revalidatePath("/dashboard")

  return data
}

// Delete a project
export async function deleteProject(id: string) {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { error } = await supabase.from("projects").delete().eq("id", id).eq("client_id", user.id)

  if (error) throw error

  revalidatePath("/dashboard/projects")
  revalidatePath("/dashboard")
}
