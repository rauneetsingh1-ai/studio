// Author: rauneetsingh1@gmail.com
'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader, Swords } from 'lucide-react';

const createTeamSchema = z.object({
  teamName: z.string().min(3, 'Team name must be at least 3 characters.'),
  projectTitle: z.string().min(5, 'Project title must be at least 5 characters.'),
  projectSummary: z.string().min(20, 'Project summary must be at least 20 characters.').max(500),
  techStack: z.string().optional(),
});

type CreateTeamFormValues = z.infer<typeof createTeamSchema>;

export default function CreateTeamPage() {
  const { firestore, user } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTeamFormValues>({
    resolver: zodResolver(createTeamSchema),
  });

  const onSubmit = async (data: CreateTeamFormValues) => {
    if (!firestore || !user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create a team.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
        const teamsCollection = collection(firestore, 'teams');
        const projectsCollection = collection(firestore, 'projects');

        const techStackArray = data.techStack?.split(',').map(s => s.trim()).filter(Boolean) || [];

        // Firestore batch write to create both team and project atomically
        const batch = writeBatch(firestore);

        // 1. Create the team document
        const newTeamRef = doc(teamsCollection); // Create a reference with a new ID
        batch.set(newTeamRef, {
            name: data.teamName,
            createdBy: user.uid,
            members: [{ uid: user.uid, role: 'owner' }],
            status: 'open',
            techStack: techStackArray,
            projectIdea: {
                title: data.projectTitle,
                summary: data.projectSummary,
            },
        });

        // 2. Create the corresponding project document
        const newProjectRef = doc(projectsCollection, newTeamRef.id);
        batch.set(newProjectRef, {
            teamId: newTeamRef.id,
            columns: [
                { id: 'todo', title: 'To Do', order: 1 },
                { id: 'inprogress', title: 'In Progress', order: 2 },
                { id: 'done', title: 'Done', order: 3 },
            ]
        });

        await batch.commit();

        toast({
            title: 'Team Created!',
            description: `Your team "${data.teamName}" is ready.`,
        });

        router.push('/team');
    } catch (error) {
        console.error("Error creating team: ", error);
        toast({
            title: 'Error creating team',
            description: 'Something went wrong. Please try again.',
            variant: 'destructive',
        });
        setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Swords /> Create Your Team
              </CardTitle>
              <CardDescription>
                Assemble your crew and define the project you'll be building together.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="teamName">Team Name</Label>
                  <Controller
                    name="teamName"
                    control={control}
                    render={({ field }) => <Input id="teamName" placeholder="The A-Team" {...field} />}
                  />
                  {errors.teamName && <p className="text-sm text-destructive">{errors.teamName.message}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="projectTitle">Project Title</Label>
                  <Controller
                    name="projectTitle"
                    control={control}
                    render={({ field }) => <Input id="projectTitle" placeholder="AI-Powered Recipe Generator" {...field} />}
                  />
                   {errors.projectTitle && <p className="text-sm text-destructive">{errors.projectTitle.message}</p>}
                </div>

                 <div className="grid gap-2">
                  <Label htmlFor="projectSummary">Project Summary</Label>
                  <Controller
                    name="projectSummary"
                    control={control}
                    render={({ field }) => <Textarea id="projectSummary" rows={4} placeholder="A short, compelling summary of what your team will build." {...field} />}
                  />
                  {errors.projectSummary && <p className="text-sm text-destructive">{errors.projectSummary.message}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="techStack">Tech Stack</Label>
                  <Controller
                    name="techStack"
                    control={control}
                    render={({ field }) => <Input id="techStack" placeholder="Next.js, Tailwind, Firebase..." {...field} />}
                  />
                  <p className="text-xs text-muted-foreground">Comma-separated list of technologies.</p>
                   {errors.techStack && <p className="text-sm text-destructive">{errors.techStack.message}</p>}
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader className="animate-spin mr-2" />}
                    Create Team & Project
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </AppLayout>
  );
}
