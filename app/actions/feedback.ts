"use server"

import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { revalidatePath } from "next/cache"
import type { Database, NewFeedback } from "@/lib/supabase/database.types"

// Create new feedback
export async function createFeedback(feedback: NewFeedback) {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // Verify the project belongs to the user
  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("id", feedback.project_id)
    .eq("client_id", user.id)
    .single()

  if (!project) throw new Error("Project not found or access denied")

  const { data, error } = await supabase.from("feedback").insert(feedback).select().single()

  if (error) throw error

  revalidatePath(`/dashboard/projects/${feedback.project_id}`)

  return data
}
