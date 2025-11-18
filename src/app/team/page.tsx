import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Swords } from 'lucide-react';

export default function TeamPage() {
  return (
    <AppLayout>
      <main className="flex-1 p-4 md:p-8">
        <div className="space-y-4 mb-8">
            <h1 className="text-3xl font-bold tracking-tight">My Team</h1>
            <p className="text-muted-foreground">Collaborate with your team members in real-time.</p>
        </div>

        <Card className="h-[60vh] flex items-center justify-center">
            <CardContent className="text-center p-6">
                <Swords className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No Team Yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Find teammates and create a team to start collaborating.
                </p>
                <Button className="mt-4">Create Your Team</Button>
            </CardContent>
        </Card>
      </main>
    </AppLayout>
  );
}
