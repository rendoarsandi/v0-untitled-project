"use server"

import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/auth-utils"
import type {
  Database,
  UpdateProject,
  NewQuote,
  NewProjectUpdate,
  NewProjectMilestone,
  UpdateProjectMilestone,
} from "@/lib/supabase/database.types"

// Get all projects (admin only)
export async function getAllProjects() {
  await requireAdmin()

  const supabase = createServerActionClient<Database>({ cookies })

  const { data, error } = await supabase
    .from("projects")
    .select("*, quotes(*), project_updates(*), project_milestones(*)")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

// Get a single project with all related data (admin only)
export async function getProjectAdmin(id: string) {
  await requireAdmin()

  const supabase = createServerActionClient<Database>({ cookies })

  const { data, error } = await supabase
    .from("projects")
    .select(`
      *,
      quotes (*),
      project_updates (*),
      project_milestones (*)
    `)
    .eq("id", id)
    .single()

  if (error) throw error
  return data
}

// Update a project (admin only)
export async function updateProjectAdmin(id: string, project: UpdateProject) {
  await requireAdmin()

  const supabase = createServerActionClient<Database>({ cookies })

  // Set updated_at to current time
  project.updated_at = new Date().toISOString()

  const { data, error } = await supabase.from("projects").update(project).eq("id", id).select().single()

  if (error) throw error

  revalidatePath(`/admin/projects/${id}`)
  revalidatePath("/admin/projects")
  revalidatePath("/admin")

  return data
}

// Delete a project (admin only)
export async function deleteProjectAdmin(id: string) {
  await requireAdmin()

  const supabase = createServerActionClient<Database>({ cookies })

  const { error } = await supabase.from("projects").delete().eq("id", id)

  if (error) throw error

  revalidatePath("/admin/projects")
  revalidatePath("/admin")
}

// Create a quote for a project (admin only)
export async function createQuoteAdmin(quote: NewQuote) {
  await requireAdmin()

  const supabase = createServerActionClient<Database>({ cookies })

  const { data, error } = await supabase.from("quotes").insert(quote).select().single()

  if (error) throw error

  revalidatePath(`/admin/projects/${quote.project_id}`)

  return data
}

// Create a project update (admin only)
export async function createProjectUpdateAdmin(update: NewProjectUpdate) {
  await requireAdmin()

  const supabase = createServerActionClient<Database>({ cookies })

  // Set the date if not provided
  if (!update.date) {
    update.date = new Date().toISOString()
  }

  const { data, error } = await supabase.from("project_updates").insert(update).select().single()

  if (error) throw error

  // Update the last_update field in the project
  await supabase.from("projects").update({ last_update: new Date().toISOString() }).eq("id", update.project_id)

  revalidatePath(`/admin/projects/${update.project_id}`)

  return data
}

// Create a project milestone (admin only)
export async function createMilestoneAdmin(milestone: NewProjectMilestone) {
  await requireAdmin()

  const supabase = createServerActionClient<Database>({ cookies })

  const { data, error } = await supabase.from("project_milestones").insert(milestone).select().single()

  if (error) throw error

  revalidatePath(`/admin/projects/${milestone.project_id}`)

  return data
}

// Update a milestone (admin only)
export async function updateMilestoneAdmin(id: string, milestone: UpdateProjectMilestone) {
  await requireAdmin()

  const supabase = createServerActionClient<Database>({ cookies })

  const { data, error } = await supabase.from("project_milestones").update(milestone).eq("id", id).select().single()

  if (error) throw error

  revalidatePath(`/admin/projects/${data.project_id}`)

  return data
}

// Get all users (admin only)
export async function getAllUsers() {
  await requireAdmin()

  const supabase = createServerActionClient<Database>({ cookies })

  const { data, error } = await supabase.auth.admin.listUsers()

  if (error) throw error
  return data.users
}
