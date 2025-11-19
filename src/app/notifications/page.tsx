// Author: rauneetsingh1@gmail.com
'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Bell, Loader } from 'lucide-react';
import RequestCard from './request-card';

export default function NotificationsPage() {
    const { firestore, user } = useFirebase();

    const requestsQuery = useMemoFirebase(() => {
        if (!user) return null;
        return query(
            collection(firestore, "requests"),
            where('toUid', '==', user.uid),
            where('status', '==', 'pending')
        );
    }, [firestore, user]);

    const { data: requests, isLoading } = useCollection(requestsQuery);

  return (
    <AppLayout>
      <main className="flex-1 p-4 md:p-8">
        <div className="space-y-4 mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground">Here are your pending connection requests.</p>
        </div>
        
        {isLoading && (
            <div className="flex justify-center items-center h-64">
                <Loader className="animate-spin h-8 w-8 text-primary" />
            </div>
        )}

        {!isLoading && (!requests || requests.length === 0) && (
             <Card className="h-[60vh] flex items-center justify-center">
                <CardContent className="text-center p-6">
                    <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No New Notifications</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        You're all caught up!
                    </p>
                </CardContent>
            </Card>
        )}

        {!isLoading && requests && requests.length > 0 && (
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {requests.map(request => (
                    <RequestCard key={request.id} request={request} />
                ))}
             </div>
        )}
      </main>
    </AppLayout>
  );
}
