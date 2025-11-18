'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Input } from '@/components/ui/input';
import TeammateCard from '@/components/teammates/teammate-card';
import { Loader, Search } from 'lucide-react';
import { useFirebase, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { useMemo } from 'react';

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


export default function FindTeammatesPage() {
  const { user, isUserLoading, firestore } = useFirebase();

  const usersCollectionRef = useMemoFirebase(() => {
    return firestore ? collection(firestore, 'users') : null;
  }, [firestore]);
  const { data: allUsers, isLoading: isLoadingUsers } = useCollection<UserProfile>(usersCollectionRef);

  const currentUserDocRef = useMemoFirebase(() => {
    return user ? doc(firestore, 'users', user.uid) : null;
  }, [user, firestore]);
  const { data: currentUserProfile, isLoading: isLoadingCurrentUser } = useDoc<UserProfile>(currentUserDocRef);
  
  const isLoading = isUserLoading || isLoadingUsers || isLoadingCurrentUser;

  const potentialTeammates = useMemo(() => {
    if (!currentUserProfile || !allUsers) return [];

    return allUsers
      .filter(u => u.id !== currentUserProfile.id)
      .map(teammate => ({
        ...teammate,
        matchScore: computeMatchScore(currentUserProfile, teammate),
      }))
      .sort((a, b) => b.matchScore - a.matchScore);
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
            <h1 className="text-3xl font-bold tracking-tight">Find Your Teammates</h1>
            <p className="text-muted-foreground">Browse AI-curated profiles to build your dream team.</p>
        </div>
        
        <div className="mb-6">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    placeholder="Search by skill, interest, or name..." 
                    className="pl-10 w-full max-w-lg"
                />
            </div>
            {/* Add filter buttons here if needed */}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {potentialTeammates.map((user) => (
            <TeammateCard key={user.id} user={user} />
          ))}
        </div>
      </main>
    </AppLayout>
  );
}
