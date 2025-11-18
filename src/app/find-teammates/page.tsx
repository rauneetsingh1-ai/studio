'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Input } from '@/components/ui/input';
import TeammateCard from '@/components/teammates/teammate-card';
import { teammates } from '@/lib/data';
import { Search } from 'lucide-react';
import { useFirebase } from '@/firebase';

export default function FindTeammatesPage() {
  const { user } = useFirebase();

  // Filter out the current user from the list of teammates
  const potentialTeammates = teammates.filter(t => t.id !== user?.uid);

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
