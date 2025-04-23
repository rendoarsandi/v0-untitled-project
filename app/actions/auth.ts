"use server"

import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { redirect } from "next/navigation"
import type { Database } from "@/lib/supabase/database.types"

// Sign up a new user
export async function signUp(formData: FormData) {
  const supabase = createServerActionClient<Database>({ cookies })

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  })

  if (error) {
    return {
      error: error.message,
    }
  }

  return {
    success: true,
    message: "Check your email for the confirmation link.",
  }
}

// Sign in an existing user
export async function signIn(formData: FormData) {
  const supabase = createServerActionClient<Database>({ cookies })

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return {
      error: error.message,
    }
  }

  return redirect("/dashboard")
}

// Sign out the current user
export async function signOut() {
  const supabase = createServerActionClient<Database>({ cookies })
  await supabase.auth.signOut()
  return redirect("/login")
}

// Get the current user
export async function getUser() {
  const supabase = createServerActionClient<Database>({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}
