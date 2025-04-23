import type React from "react"
import { redirect } from "next/navigation"
import AdminLayout from "@/components/admin-layout"
import { isAdmin } from "@/lib/auth-utils"

export default async function Layout({ children }: { children: React.ReactNode }) {
  // Check if user is admin
  const admin = await isAdmin()

  if (!admin) {
    redirect("/login")
  }

  return <AdminLayout>{children}</AdminLayout>
}
