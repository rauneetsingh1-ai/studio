import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessagesSquare } from 'lucide-react';

export default function MessagesPage() {
  return (
    <AppLayout>
      <main className="flex-1 p-4 md:p-8">
        <div className="space-y-4 mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
            <p className="text-muted-foreground">Communicate with your connections and team.</p>
        </div>
        
        <Card className="h-[60vh] flex items-center justify-center">
            <CardContent className="text-center p-6">
                <MessagesSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Chat Coming Soon</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Real-time chat rooms will be available here.
                </p>
            </CardContent>
        </Card>
      </main>
    </AppLayout>
  );
}
