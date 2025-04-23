"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { createProjectUpdateAdmin } from "@/app/actions/admin"
import { useToast } from "@/hooks/use-toast"

export function AddUpdateForm({ projectId }: { projectId: string }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!message.trim()) {
      return
    }

    setIsSubmitting(true)

    try {
      await createProjectUpdateAdmin({
        project_id: projectId,
        message,
      })

      toast({
        title: "Success",
        description: "Update added successfully!",
      })

      setMessage("")
      router.refresh()
    } catch (error) {
      console.error("Error adding update:", error)
      toast({
        title: "Error",
        description: "There was an error adding the update. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Add Update</CardTitle>
          <CardDescription>Post a new update for this project</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter your update message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            required
          />
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit" disabled={!message.trim() || isSubmitting}>
            {isSubmitting ? "Posting..." : "Post Update"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
