import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Code, Layers, Rocket } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <Rocket className="h-5 w-5" />
            <span>AppDev Manager</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Streamline Your App Development Process
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Request, track, and manage your app development projects all in one place.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button size="lg" className="gap-1.5">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline">
                      Login
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-[350px] rounded-lg bg-muted p-4 shadow-lg">
                  <div className="absolute left-4 top-4 h-2 w-2 rounded-full bg-red-500" />
                  <div className="absolute left-8 top-4 h-2 w-2 rounded-full bg-yellow-500" />
                  <div className="absolute left-12 top-4 h-2 w-2 rounded-full bg-green-500" />
                  <div className="mt-4 space-y-4">
                    <div className="h-8 w-full rounded bg-background/50" />
                    <div className="space-y-2">
                      <div className="h-4 w-3/4 rounded bg-background/50" />
                      <div className="h-4 w-full rounded bg-background/50" />
                      <div className="h-4 w-2/3 rounded bg-background/50" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-full rounded bg-background/50" />
                      <div className="h-4 w-5/6 rounded bg-background/50" />
                      <div className="h-4 w-3/4 rounded bg-background/50" />
                    </div>
                    <div className="h-32 w-full rounded bg-background/50" />
                    <div className="flex justify-end">
                      <div className="h-8 w-24 rounded bg-primary/20" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full bg-muted py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
              <p className="max-w-[85%] text-muted-foreground md:text-xl">
                Our platform simplifies the app development process from start to finish.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Code className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Request</h3>
                <p className="text-center text-muted-foreground">
                  Submit your app requirements and get a custom quote.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Layers className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Track</h3>
                <p className="text-center text-muted-foreground">
                  Monitor progress and provide feedback throughout development.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Rocket className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Launch</h3>
                <p className="text-center text-muted-foreground">Receive your completed app ready for deployment.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 font-semibold">
            <Rocket className="h-5 w-5" />
            <span>AppDev Manager</span>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} AppDev Manager. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
