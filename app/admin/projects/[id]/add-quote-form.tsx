"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createQuoteAdmin } from "@/app/actions/admin"
import { useToast } from "@/hooks/use-toast"
import type { NewQuote } from "@/lib/supabase/database.types"

export function AddQuoteForm({ projectId }: { projectId: string }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const [amount, setAmount] = useState("")
  const [includesInput, setIncludesInput] = useState("")
  const [includes, setIncludes] = useState<string[]>([])

  const handleAddItem = () => {
    if (includesInput.trim()) {
      setIncludes([...includes, includesInput.trim()])
      setIncludesInput("")
    }
  }

  const handleRemoveItem = (index: number) => {
    setIncludes(includes.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!amount || includes.length === 0) {
      toast({
        title: "Error",
        description: "Please enter an amount and at least one included item.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const quoteData: NewQuote = {
        project_id: projectId,
        amount: Number.parseFloat(amount),
        includes,
      }

      await createQuoteAdmin(quoteData)

      toast({
        title: "Success",
        description: "Quote added successfully!",
      })

      router.refresh()
    } catch (error) {
      console.error("Error adding quote:", error)
      toast({
        title: "Error",
        description: "There was an error adding the quote. Please try again.",
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
          <CardTitle>Add Quote</CardTitle>
          <CardDescription>Create a new quote for this project</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="includes">Included Items</Label>
            <div className="flex gap-2">
              <Input
                id="includes"
                value={includesInput}
                onChange={(e) => setIncludesInput(e.target.value)}
                placeholder="Add an item"
              />
              <Button type="button" onClick={handleAddItem}>
                Add
              </Button>
            </div>
            {includes.length > 0 && (
              <ul className="mt-2 space-y-1">
                {includes.map((item, index) => (
                  <li key={index} className="flex items-center justify-between rounded-md bg-muted p-2">
                    <span>{item}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(index)}
                      className="h-6 w-6 p-0"
                    >
                      &times;
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Adding Quote..." : "Add Quote"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
