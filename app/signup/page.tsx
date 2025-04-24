"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [supabaseError, setSupabaseError] = useState<string | null>(null)
  const { toast } = useToast()
  const [supabase, setSupabase] = useState<any>(null)

  // Check if Supabase environment variables are available
  const isMissingEnvVars =
    typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "undefined" ||
    typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "undefined"

  useEffect(() => {
    // Initialize Supabase client safely
    if (!isMissingEnvVars) {
      try {
        const client = createClient()
        setSupabase(client)
      } catch (err: any) {
        console.error("Failed to create Supabase client:", err)
        setSupabaseError(err.message || "Failed to initialize Supabase client")
      }
    }
  }, [isMissingEnvVars])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Check if Supabase client is available
    if (!supabase) {
      setError("Supabase client is not available. Please check your environment variables.")
      setIsLoading(false)
      toast({
        title: "Configuration Error",
        description: "Supabase client is not available. Please check your environment variables.",
        variant: "destructive",
      })
      return
    }

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setError(error.message)
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Check your email for the confirmation link",
        })
        router.push("/login")
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || "An unexpected error occurred")
      toast({
        title: "Error",
        description: err.message || "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className="absolute left-4 top-4 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:left-8 md:top-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Sign up</CardTitle>
            <CardDescription>Create an account to get started</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-4">
              {isMissingEnvVars && (
                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                  <p className="font-medium">Missing Supabase Configuration</p>
                  <p className="mt-1">
                    Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables.
                  </p>
                </div>
              )}
              {supabaseError && (
                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                  <p className="font-medium">Supabase Client Error</p>
                  <p className="mt-1">{supabaseError}</p>
                </div>
              )}
              {error && !isMissingEnvVars && !supabaseError && (
                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" required />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button className="w-full" type="submit" disabled={isLoading || isMissingEnvVars || !!supabaseError}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
              {(isMissingEnvVars || supabaseError) && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Sign up is disabled until Supabase is properly configured
                </p>
              )}
            </CardFooter>
          </form>
        </Card>
        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="underline underline-offset-4 hover:text-primary">
            Sign in
          </Link>
        </div>
        <div className="text-center">
          <Link href="/setup" className="text-sm text-muted-foreground hover:text-primary">
            Need help with setup?
          </Link>
        </div>
      </div>
    </div>
  )
}
