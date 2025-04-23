"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createMilestoneAdmin } from "@/app/actions/admin"
import { useToast } from "@/hooks/use-toast"

export function AddMilestoneForm({ projectId }: { projectId: string }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [date, setDate] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!name.trim() || !date) {
      toast({
        title: "Error",
        description: "Please enter a name and date for the milestone.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await createMilestoneAdmin({
        project_id: projectId,
        name,
        date,
        completed: false,
      })

      toast({
        title: "Success",
        description: "Milestone added successfully!",
      })

      setName("")
      setDate("")
      router.refresh()
    } catch (error) {
      console.error("Error adding milestone:", error)
      toast({
        title: "Error",
        description: "There was an error adding the milestone. Please try again.",
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
          <CardTitle>Add Milestone</CardTitle>
          <CardDescription>Create a new milestone for this project</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Milestone Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Design Phase Complete"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date">Target Date</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Adding Milestone..." : "Add Milestone"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
