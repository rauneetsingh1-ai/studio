import Link from 'next/link';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { currentUser, teammates } from '@/lib/data';
import TeammateCard from '@/components/teammates/teammate-card';
import { ArrowRight, Swords, UserPlus } from 'lucide-react';

export default function DashboardPage() {
  return (
    <AppLayout>
      <main className="flex-1 p-4 md:p-8">
        <div className="space-y-4 mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {currentUser.name.split(' ')[0]}!</h1>
            <p className="text-muted-foreground">Here's a quick overview of your buildathon journey.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Complete Your Profile</CardTitle>
              <CardDescription>A detailed profile attracts the best teammates.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">You've filled out the basics, but adding more about your project preferences can improve match quality by up to 30%.</p>
                <Button asChild>
                    <Link href="/profile">
                        Update Profile <ArrowRight />
                    </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Start Your Team</CardTitle>
              <CardDescription>Create a team and invite your new connections.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Ready to start building? Create a team and begin collaborating on your project.</p>
                    <Button variant="secondary">
                        <Swords /> Create a Team
                    </Button>
                </div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Find Teammates</CardTitle>
              <CardDescription>Browse AI-suggested profiles.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Our AI has found some great potential matches for you. Check them out!</p>
                    <Button>
                        <UserPlus /> Find Teammates
                    </Button>
                </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold tracking-tight">Top Matches for You</h2>
                <Button variant="link" asChild>
                    <Link href="/find-teammates">View all <ArrowRight /></Link>
                </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {teammates.slice(0, 3).map((user) => (
                    <TeammateCard key={user.id} user={user} currentUser={currentUser} />
                ))}
            </div>
        </div>
      </main>
    </AppLayout>
  );
}
