import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, FileText, DollarSign, Clock } from "lucide-react"
import { getAllProjects } from "@/app/actions/admin"

export default async function AdminDashboardPage() {
  const projects = await getAllProjects()

  // Calculate project statistics
  const totalProjects = projects.length
  const inProgressCount = projects.filter((p) => p.status === "In Progress").length
  const pendingCount = projects.filter((p) => p.status === "Pending").length
  const completedCount = projects.filter((p) => p.status === "Completed").length

  // Calculate revenue statistics
  const totalQuotes = projects.reduce((sum, project) => {
    if (project.quotes && project.quotes.length > 0) {
      return sum + project.quotes.reduce((quoteSum, quote) => quoteSum + Number(quote.amount), 0)
    }
    return sum
  }, 0)

  const paidAmount = projects.reduce((sum, project) => {
    if (project.payment_status === "Paid" && project.quotes && project.quotes.length > 0) {
      return sum + project.quotes.reduce((quoteSum, quote) => quoteSum + Number(quote.amount), 0)
    }
    return sum
  }, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <Link href="/admin/projects">
          <Button>View All Projects</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              {inProgressCount} in progress, {pendingCount} pending, {completedCount} completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalQuotes.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">${paidAmount.toFixed(2)} received</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Projects awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(projects.map((project) => project.client_id)).size}</div>
            <p className="text-xs text-muted-foreground">Unique clients with projects</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-bold tracking-tight mb-4">Recent Projects</h2>
        <div className="grid gap-4">
          {projects.slice(0, 5).map((project) => (
            <Card key={project.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>{project.name}</CardTitle>
                  <Badge
                    variant={
                      project.status === "In Progress"
                        ? "default"
                        : project.status === "Awaiting Payment"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {project.status}
                  </Badge>
                </div>
                <CardDescription>Last updated: {new Date(project.last_update).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${project.progress}%` }} />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/admin/projects/${project.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    Manage Project
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
