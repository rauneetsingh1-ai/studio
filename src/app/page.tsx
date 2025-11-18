import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BrainCircuit,
  MessagesSquare,
  Swords,
  UsersRound,
} from 'lucide-react';
import Logo from '@/components/logo';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <Link href="#" className="flex items-center justify-center">
          <Logo />
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-card">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Forge Your Dream Team for the Next Buildathon
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    TeamUp Forge uses AI to connect you with the perfect
                    teammates based on skills, interests, and project goals.
                    Stop searching, start building.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link href="/signup">Find Your Team</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:flex items-center justify-center">
                 <Swords className="h-48 w-48 text-primary/10" strokeWidth={0.5} />
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  Everything You Need to Succeed
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From finding the right people to collaborating seamlessly,
                  our platform is designed to make your buildathon experience
                  a success.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-2 pt-12">
              <div className="grid gap-1">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-md">
                        <BrainCircuit className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold">AI-Powered Matching</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Our intelligent algorithm analyzes profiles to suggest the most compatible teammates, increasing your chances of success.
                </p>
              </div>
              <div className="grid gap-1">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-md">
                        <UsersRound className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold">Detailed User Profiles</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Create comprehensive profiles that showcase your skills, interests, and what you're looking for in a project and team.
                </p>
              </div>
              <div className="grid gap-1">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-md">
                        <MessagesSquare className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold">Real-time Chat Rooms</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Connect and communicate with potential teammates instantly through private and secure chat rooms.
                </p>
              </div>
              <div className="grid gap-1">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-md">
                        <UsersRound className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold">Team Collaboration Tools</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Once your team is formed, use our built-in tools to manage tasks, share ideas, and collaborate in real-time.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">
                Ready to Build Something Amazing?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join TeamUp Forge today and find the collaborators who will help
                you bring your vision to life.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <Button size="lg" className="w-full" asChild>
                <Link href="/signup">Sign Up for Free</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; 2024 TeamUp Forge. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
