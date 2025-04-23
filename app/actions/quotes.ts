"use server"

import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { revalidatePath } from "next/cache"
import type { Database, NewQuote, UpdateQuote } from "@/lib/supabase/database.types"

// Create a new quote
export async function createQuote(quote: NewQuote) {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // Verify the project belongs to the user
  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("id", quote.project_id)
    .eq("client_id", user.id)
    .single()

  if (!project) throw new Error("Project not found or access denied")

  const { data, error } = await supabase.from("quotes").insert(quote).select().single()

  if (error) throw error

  revalidatePath(`/dashboard/projects/${quote.project_id}`)

  return data
}

// Update an existing quote
export async function updateQuote(id: string, quote: UpdateQuote) {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // Verify the project belongs to the user
  const { data: existingQuote } = await supabase.from("quotes").select("project_id").eq("id", id).single()

  if (!existingQuote) throw new Error("Quote not found")

  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("id", existingQuote.project_id)
    .eq("client_id", user.id)
    .single()

  if (!project) throw new Error("Project not found or access denied")

  const { data, error } = await supabase.from("quotes").update(quote).eq("id", id).select().single()

  if (error) throw error

  revalidatePath(`/dashboard/projects/${existingQuote.project_id}`)

  return data
}
