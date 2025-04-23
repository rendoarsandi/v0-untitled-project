"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { createProject } from "@/app/actions/projects"
import { useToast } from "@/hooks/use-toast"
import type { NewProject } from "@/lib/supabase/database.types"

export default function NewRequestPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState<Partial<NewProject>>({
    name: "",
    description: "",
    status: "Pending",
    progress: 0,
    payment_status: "Unpaid",
  })
  const [projectType, setProjectType] = useState("")
  const [timeline, setTimeline] = useState("")
  const [budget, setBudget] = useState("")
  const [features, setFeatures] = useState("")
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [technicalRequirements, setTechnicalRequirements] = useState<string[]>([])

  const handleRequirementChange = (requirement: string) => {
    setTechnicalRequirements((prev) => {
      if (prev.includes(requirement)) {
        return prev.filter((r) => r !== requirement)
      } else {
        return [...prev, requirement]
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Combine all form data into the project description
      const fullDescription = `
Project Type: ${projectType}

Features:
${features}

Technical Requirements:
${technicalRequirements.join(", ")}

Timeline: ${timeline} days

Budget: ${budget}

Additional Information:
${additionalInfo}
      `.trim()

      // Create the project
      const projectData: NewProject = {
        ...formData,
        description: fullDescription,
        client_id: "", // This will be set by the server action
      }

      await createProject(projectData)

      toast({
        title: "Success",
        description: "Your project request has been submitted successfully!",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Error submitting project:", error)
      toast({
        title: "Error",
        description: "There was an error submitting your project request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">New App Request</h1>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>Provide basic information about your app project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                placeholder="E.g., E-commerce App, Portfolio Website"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project-type">Project Type</Label>
              <Select required value={projectType} onValueChange={setProjectType}>
                <SelectTrigger id="project-type">
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web">Web Application</SelectItem>
                  <SelectItem value="mobile">Mobile Application</SelectItem>
                  <SelectItem value="desktop">Desktop Application</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Features & Requirements</CardTitle>
            <CardDescription>Specify the features and technical requirements for your app</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="features">Key Features</Label>
              <Textarea
                id="features"
                placeholder="List the main features you want in your app (e.g., user authentication, payment processing, etc.)"
                rows={4}
                required
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Technical Requirements</Label>
              <div className="grid gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="req-database"
                    checked={technicalRequirements.includes("Database")}
                    onCheckedChange={() => handleRequirementChange("Database")}
                  />
                  <Label htmlFor="req-database" className="font-normal">
                    Database
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="req-api"
                    checked={technicalRequirements.includes("API Integration")}
                    onCheckedChange={() => handleRequirementChange("API Integration")}
                  />
                  <Label htmlFor="req-api" className="font-normal">
                    API Integration
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="req-auth"
                    checked={technicalRequirements.includes("Authentication System")}
                    onCheckedChange={() => handleRequirementChange("Authentication System")}
                  />
                  <Label htmlFor="req-auth" className="font-normal">
                    Authentication System
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="req-payment"
                    checked={technicalRequirements.includes("Payment Processing")}
                    onCheckedChange={() => handleRequirementChange("Payment Processing")}
                  />
                  <Label htmlFor="req-payment" className="font-normal">
                    Payment Processing
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="req-domain"
                    checked={technicalRequirements.includes("Domain Registration")}
                    onCheckedChange={() => handleRequirementChange("Domain Registration")}
                  />
                  <Label htmlFor="req-domain" className="font-normal">
                    Domain Registration
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Timeline & Budget</CardTitle>
            <CardDescription>Provide your expected timeline and budget for the project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="timeline">Expected Timeline (in days)</Label>
              <Input
                id="timeline"
                type="number"
                min="1"
                placeholder="30"
                required
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="budget">Budget Range</Label>
              <Select value={budget} onValueChange={setBudget}>
                <SelectTrigger id="budget">
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="$1,000 - $5,000">$1,000 - $5,000</SelectItem>
                  <SelectItem value="$5,000 - $10,000">$5,000 - $10,000</SelectItem>
                  <SelectItem value="$10,000 - $20,000">$10,000 - $20,000</SelectItem>
                  <SelectItem value="$20,000+">$20,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="additional-info">Additional Information</Label>
              <Textarea
                id="additional-info"
                placeholder="Any other details you'd like to share about your project"
                rows={3}
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </div>
      </form>
    </div>
  )
}
