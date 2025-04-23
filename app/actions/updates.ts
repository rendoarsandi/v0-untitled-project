"use server"

import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { revalidatePath } from "next/cache"
import type { Database, NewProjectUpdate } from "@/lib/supabase/database.types"

// Create a new project update
export async function createProjectUpdate(update: NewProjectUpdate) {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // Verify the project belongs to the user
  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("id", update.project_id)
    .eq("client_id", user.id)
    .single()

  if (!project) throw new Error("Project not found or access denied")

  // Set the date if not provided
  if (!update.date) {
    update.date = new Date().toISOString()
  }

  const { data, error } = await supabase.from("project_updates").insert(update).select().single()

  if (error) throw error

  // Update the last_update field in the project
  await supabase.from("projects").update({ last_update: new Date().toISOString() }).eq("id", update.project_id)

  revalidatePath(`/dashboard/projects/${update.project_id}`)

  return data
}
