"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare } from "lucide-react"
import { createFeedback } from "@/app/actions/feedback"
import { useToast } from "@/hooks/use-toast"

export function FeedbackForm({ projectId }: { projectId: string }) {
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) return

    setIsSubmitting(true)
    try {
      await createFeedback({
        project_id: projectId,
        message: feedback,
      })

      toast({
        title: "Feedback Submitted",
        description: "Your feedback has been submitted successfully.",
      })

      setFeedback("")
    } catch (error) {
      console.error("Error submitting feedback:", error)
      toast({
        title: "Error",
        description: "There was an error submitting your feedback. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Provide Feedback</CardTitle>
        <CardDescription>Share your thoughts, suggestions, or report issues</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Enter your feedback, questions, or report any issues you've found..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={6}
        />
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleSubmitFeedback} disabled={!feedback.trim() || isSubmitting}>
          <MessageSquare className="mr-2 h-4 w-4" />
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </Button>
      </CardFooter>
    </Card>
  )
}
