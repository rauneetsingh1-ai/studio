'use client';

import Link from 'next/link';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import TeammateCard from '@/components/teammates/teammate-card';
import { ArrowRight, Swords, UserPlus, Loader } from 'lucide-react';
import { useFirebase, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';

function computeMatchScore(user1: UserProfile, user2: UserProfile): number {
    if (!user1 || !user2) return 0;
    
    const skills1 = new Set(user1.skills || []);
    const skills2 = new Set(user2.skills || []);
    const interests1 = new Set(user1.interests || []);
    const interests2 = new Set(user2.interests || []);

    if (skills1.size === 0 && interests1.size === 0) return 0;

    const skillIntersection = new Set([...skills1].filter(skill => skills2.has(skill)));
    const interestIntersection = new Set([...interests1].filter(interest => interests2.has(interest)));

    const skillUnion = new Set([...skills1, ...skills2]);
    const interestUnion = new Set([...interests1, ...interests2]);

    const skillOverlap = skillUnion.size > 0 ? skillIntersection.size / skillUnion.size : 0;
    const interestOverlap = interestUnion.size > 0 ? interestIntersection.size / interestUnion.size : 0;

    // Weighted average: 70% skills, 30% interests
    const score = (skillOverlap * 0.7 + interestOverlap * 0.3) * 100;
    
    return Math.round(score);
}


export default function DashboardPage() {
  const { user, firestore, isUserLoading } = useFirebase();

  const usersCollectionRef = useMemoFirebase(() => {
    return firestore ? collection(firestore, 'users') : null;
  }, [firestore]);

  const { data: allUsers, isLoading: isLoadingUsers } = useCollection<UserProfile>(usersCollectionRef);

  const currentUserDocRef = useMemoFirebase(() => {
    return user ? doc(firestore, 'users', user.uid) : null;
  }, [user, firestore]);
  
  const { data: currentUserProfile, isLoading: isLoadingCurrentUser } = useDoc<UserProfile>(currentUserDocRef);
  
  const isLoading = isUserLoading || isLoadingUsers || isLoadingCurrentUser;


  const topMatches = useMemoFirebase(() => {
    if (!currentUserProfile || !allUsers) return [];

    const potentialTeammates = allUsers.filter(u => u.id !== currentUserProfile.id);

    return potentialTeammates
      .map(teammate => ({
        ...teammate,
        matchScore: computeMatchScore(currentUserProfile, teammate),
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);
  }, [currentUserProfile, allUsers]);

  if (isLoading) {
     return (
        <AppLayout>
            <main className="flex-1 p-4 md:p-8 flex items-center justify-center">
                <Loader className="animate-spin h-8 w-8 text-primary" />
            </main>
        </AppLayout>
    )
  }

  return (
    <AppLayout>
      <main className="flex-1 p-4 md:p-8">
        <div className="space-y-4 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {currentUserProfile?.name.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground">
            Here's a quick overview of your buildathon journey.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Complete Your Profile</CardTitle>
              <CardDescription>
                A detailed profile attracts the best teammates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  You've filled out the basics, but adding more about your
                  project preferences can improve match quality by up to 30%.
                </p>
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
              <CardDescription>
                Create a team and invite your new connections.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Ready to start building? Create a team and begin collaborating
                  on your project.
                </p>
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
                <p className="text-sm text-muted-foreground">
                  Our AI has found some great potential matches for you. Check
                  them out!
                </p>
                 <Button asChild>
                    <Link href="/find-teammates">
                        <UserPlus /> Find Teammates
                    </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold tracking-tight">
              Top Matches for You
            </h2>
            <Button variant="link" asChild>
              <Link href="/find-teammates">
                View all <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {topMatches.map(user => (
              <TeammateCard key={user.id} user={user} />
            ))}
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
