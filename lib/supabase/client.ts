"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/supabase/database.types"

// Create a single instance of the Supabase client to be used across the client components
export const createClient = () => {
  // Check if environment variables are available
  if (
    typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "undefined" ||
    typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "undefined"
  ) {
    throw new Error(
      "Supabase environment variables are missing. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment.",
    )
  }

  try {
    return createClientComponentClient<Database>()
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    throw error
  }
}
