"use server"

import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { revalidatePath } from "next/cache"
import type { Database, NewProjectMilestone, UpdateProjectMilestone } from "@/lib/supabase/database.types"

// Create a new project milestone
export async function createMilestone(milestone: NewProjectMilestone) {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // Verify the project belongs to the user
  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("id", milestone.project_id)
    .eq("client_id", user.id)
    .single()

  if (!project) throw new Error("Project not found or access denied")

  const { data, error } = await supabase.from("project_milestones").insert(milestone).select().single()

  if (error) throw error

  revalidatePath(`/dashboard/projects/${milestone.project_id}`)

  return data
}

// Update a milestone (e.g., mark as completed)
export async function updateMilestone(id: string, milestone: UpdateProjectMilestone) {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // Verify the milestone belongs to a project owned by the user
  const { data: existingMilestone } = await supabase
    .from("project_milestones")
    .select("project_id")
    .eq("id", id)
    .single()

  if (!existingMilestone) throw new Error("Milestone not found")

  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("id", existingMilestone.project_id)
    .eq("client_id", user.id)
    .single()

  if (!project) throw new Error("Project not found or access denied")

  const { data, error } = await supabase.from("project_milestones").update(milestone).eq("id", id).select().single()

  if (error) throw error

  revalidatePath(`/dashboard/projects/${existingMilestone.project_id}`)

  return data
}
