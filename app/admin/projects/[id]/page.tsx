"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Github, ExternalLink, CheckCircle } from "lucide-react"
import { getProjectAdmin } from "@/app/actions/admin"
import { UpdateProjectForm } from "./update-project-form"
import { AddUpdateForm } from "./add-update-form"
import { AddMilestoneForm } from "./add-milestone-form"
import { GitHubRepository } from "@/components/github-repository"

export default async function AdminProjectDetailPage({ params }: { params: { id: string } }) {
  const projectId = params.id

  try {
    const project = await getProjectAdmin(projectId)

    if (!project) {
      return notFound()
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/projects">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          <Badge
            variant={
              project.status === "In Progress"
                ? "default"
                : project.status === "Awaiting Payment"
                  ? "destructive"
                  : "secondary"
            }
            className="ml-auto"
          >
            {project.status}
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
              <CardDescription>
                {project.description?.split("\n").map((line: string, i: number) => (
                  <p key={i}>{line}</p>
                ))}
              </CardDescription>
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
                    className="inline-flex items-center text-sm hover:text-primary"
                  >
                    <Github className="mr-1 h-4 w-4" />
                    View GitHub Repository
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quote Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.quotes && project.quotes.length > 0 ? (
                <>
                  <div>
                    <p className="text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold">${project.quotes[0].amount}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="mb-2 font-medium">Includes:</p>
                    <ul className="space-y-1 text-sm">
                      {project.quotes[0].includes.map((item: string, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">No quote has been provided yet.</p>
              )}
            </CardContent>
            <CardFooter>
              <Link href={`/admin/projects/${project.id}/quote`} className="w-full">
                <Button className="w-full">
                  {project.quotes && project.quotes.length > 0 ? "Update Quote" : "Add Quote"}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <Tabs defaultValue="update">
          <TabsList>
            <TabsTrigger value="update">Update Project</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
            <TabsTrigger value="github">GitHub</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>
          <TabsContent value="update" className="mt-6">
            <UpdateProjectForm project={project} />
          </TabsContent>
          <TabsContent value="timeline" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Project Timeline</CardTitle>
                  <CardDescription>Track the progress of your project through key milestones</CardDescription>
                </CardHeader>
                <CardContent>
                  {project.project_milestones && project.project_milestones.length > 0 ? (
                    <div className="relative ml-3 space-y-6 pb-6">
                      {project.project_milestones.map((milestone: any, index: number) => (
                        <div key={index} className="relative flex gap-6">
                          <div className="absolute left-[-23px] top-1 h-full w-0.5 bg-border" />
                          <div
                            className={`absolute left-[-31px] rounded-full p-1 ${
                              milestone.completed ? "bg-primary" : "bg-muted"
                            }`}
                          >
                            <div className="h-4 w-4 rounded-full bg-background" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{milestone.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(milestone.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {milestone.completed ? (
                                <Badge variant="default">Completed</Badge>
                              ) : (
                                <Badge variant="outline">Pending</Badge>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2"
                                onClick={() => {
                                  // This would be handled with client component
                                }}
                              >
                                Toggle Status
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No milestones have been set for this project yet.</p>
                  )}
                </CardContent>
              </Card>
              <AddMilestoneForm projectId={projectId} />
            </div>
          </TabsContent>
          <TabsContent value="updates" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Project Updates</CardTitle>
                  <CardDescription>Latest updates and progress on this project</CardDescription>
                </CardHeader>
                <CardContent>
                  {project.project_updates && project.project_updates.length > 0 ? (
                    <div className="space-y-6">
                      {project.project_updates.map((update: any, index: number) => (
                        <div key={index} className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{new Date(update.date).toLocaleDateString()}</p>
                          </div>
                          <p className="text-muted-foreground">{update.message}</p>
                          {index < project.project_updates.length - 1 && <Separator className="mt-4" />}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No updates have been posted for this project yet.</p>
                  )}
                </CardContent>
              </Card>
              <AddUpdateForm projectId={projectId} />
            </div>
          </TabsContent>
          <TabsContent value="github" className="mt-6">
            <GitHubRepository
              projectId={projectId}
              repoUrl={project.github_repo}
              isConnected={project.github_connected}
            />
          </TabsContent>
          <TabsContent value="feedback" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Feedback</CardTitle>
                <CardDescription>Feedback received from the client</CardDescription>
              </CardHeader>
              <CardContent>
                {project.feedback && project.feedback.length > 0 ? (
                  <div className="space-y-6">
                    {project.feedback.map((item: any, index: number) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{new Date(item.created_at).toLocaleDateString()}</p>
                        </div>
                        <p className="text-muted-foreground">{item.message}</p>
                        {index < project.feedback.length - 1 && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No feedback has been received for this project yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
  } catch (error) {
    console.error("Error fetching project:", error)
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <h1 className="text-2xl font-bold mb-4">Error Loading Project</h1>
        <p className="text-muted-foreground mb-6">There was an error loading the project details.</p>
        <Link href="/admin/projects">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </Link>
      </div>
    )
  }
}
