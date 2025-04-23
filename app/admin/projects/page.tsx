import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Github, ExternalLink } from "lucide-react"
import { getAllProjects } from "@/app/actions/admin"

export default async function AdminProjectsPage() {
  const projects = await getAllProjects()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">All Projects</h1>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6">
            {projects.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <p className="text-muted-foreground mb-4">No projects found.</p>
                </CardContent>
              </Card>
            ) : (
              projects.map((project) => <ProjectCard key={project.id} project={project} />)
            )}
          </div>
        </TabsContent>
        <TabsContent value="in-progress" className="mt-6">
          <div className="grid gap-6">
            {projects
              .filter((p) => p.status === "In Progress")
              .map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="pending" className="mt-6">
          <div className="grid gap-6">
            {projects
              .filter((p) => p.status === "Pending")
              .map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="completed" className="mt-6">
          <div className="grid gap-6">
            {projects
              .filter((p) => p.status === "Completed")
              .map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ProjectCard({ project }: { project: any }) {
  return (
    <Card>
      <CardHeader>
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
        <CardDescription>{project.description?.substring(0, 100)}...</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-secondary">
            <div className="h-full rounded-full bg-primary" style={{ width: `${project.progress}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Payment Status</p>
            <p className="font-medium">{project.payment_status}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Start Date</p>
            <p className="font-medium">
              {project.start_date ? new Date(project.start_date).toLocaleDateString() : "Not started"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Estimated Completion</p>
            <p className="font-medium">
              {project.estimated_completion ? new Date(project.estimated_completion).toLocaleDateString() : "TBD"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Last Update</p>
            <p className="font-medium">{new Date(project.last_update).toLocaleDateString()}</p>
          </div>
        </div>

        {project.github_repo && (
          <div className="pt-2">
            <a
              href={project.github_repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <Github className="mr-1 h-4 w-4" />
              View GitHub Repository
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </div>
        )}
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
  )
}
