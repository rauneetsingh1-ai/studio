'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Loader, Plus, Swords } from 'lucide-react';
import { useFirebase, useCollection, useDoc, useMemoFirebase, updateDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { collection, doc, query, where, DocumentData } from 'firebase/firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const taskSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().optional(),
});
type TaskFormValues = z.infer<typeof taskSchema>;


function CreateTaskDialog({ projectId, columnId, onTaskCreated }) {
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();
    const { firestore } = useFirebase();

    const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm<TaskFormValues>({
        resolver: zodResolver(taskSchema),
        defaultValues: { title: '', description: '' }
    });

    const onSubmit = (data: TaskFormValues) => {
        if (!firestore || !projectId) return;
        const tasksCollection = collection(firestore, `projects/${projectId}/tasks`);
        addDocumentNonBlocking(tasksCollection, {
            ...data,
            status: columnId,
            createdAt: new Date(),
        });
        toast({ title: "Task created!" });
        reset();
        setIsOpen(false);
        onTaskCreated?.();
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Plus className="mr-2 h-4 w-4" /> Add task
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new task</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Task Title</Label>
                        <Controller name="title" control={control} render={({ field }) => <Input id="title" {...field} />} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Controller name="description" control={control} render={({ field }) => <Textarea id="description" {...field} />} />
                    </div>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader className="animate-spin mr-2" />}
                        Create Task
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function KanbanTask({ task, onMove, canMoveLeft, canMoveRight }) {
    const { firestore, user } = useFirebase();

    return (
        <div className="bg-card p-3 rounded-lg border mb-2 space-y-2">
            <h4 className="font-semibold text-sm">{task.title}</h4>
            {task.description && <p className="text-xs text-muted-foreground mt-1">{task.description}</p>}
            
            <div className="flex items-center justify-between">
                {task.assignedTo ? (
                    <Avatar className="h-6 w-6 mt-2">
                        <AvatarImage src={`https://picsum.photos/seed/${task.assignedTo}/100`} />
                        <AvatarFallback>{task.assignedTo.charAt(0)}</AvatarFallback>
                    </Avatar>
                ) : <div />}
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onMove('left')} disabled={!canMoveLeft}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                     <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onMove('right')} disabled={!canMoveRight}>
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

function KanbanColumn({ column, tasks, projectId, onMoveTask, canMoveLeft, canMoveRight }) {
    return (
        <div className="bg-muted/50 rounded-lg w-72 flex-shrink-0 flex flex-col">
            <h3 className="font-semibold p-3 border-b">{column.title}</h3>
            <div className="p-2 min-h-[200px] flex-1 overflow-y-auto">
                {tasks.map((task) => (
                    <KanbanTask 
                        key={task.id} 
                        task={task} 
                        onMove={(direction) => onMoveTask(task.id, direction)}
                        canMoveLeft={canMoveLeft}
                        canMoveRight={canMoveRight}
                    />
                ))}
            </div>
            <div className="p-2 border-t">
                <CreateTaskDialog projectId={projectId} columnId={column.id} onTaskCreated={() => {}}/>
            </div>
        </div>
    );
}

function KanbanBoard({ project, tasks, onMoveTask }) {
    const orderedColumns = project.columns.sort((a, b) => a.order - b.order);

    return (
        <div className="flex gap-4 overflow-x-auto p-4 flex-1">
            {orderedColumns.map((column, index) => {
                const columnTasks = tasks.filter(task => task.status === column.id);
                return (
                    <KanbanColumn 
                        key={column.id} 
                        column={column} 
                        tasks={columnTasks} 
                        projectId={project.id}
                        onMoveTask={onMoveTask}
                        canMoveLeft={index > 0}
                        canMoveRight={index < orderedColumns.length - 1}
                    />
                );
            })}
        </div>
    );
}

export default function TeamPage() {
    const { user, firestore } = useFirebase();

    // 1. Find the user's team
    const teamQuery = useMemoFirebase(() => {
        if (!user) return null;
        // This is a simplification and assumes the user is in one team.
        // A more robust solution might involve storing the user's team ID on their user profile.
        return query(
            collection(firestore, 'teams'),
            where('members', 'array-contains', { uid: user.uid, role: 'member' }) 
        );
    }, [user, firestore]);
    const { data: teams, isLoading: isLoadingTeams } = useCollection(teamQuery);
    const team = teams?.[0]; // Assume user is in one team for now

    // 2. Find the project for that team
    const projectQuery = useMemoFirebase(() => {
        if (!team) return null;
        return query(collection(firestore, 'projects'), where('teamId', '==', team.id));
    }, [team]);
    const { data: projects, isLoading: isLoadingProjects } = useCollection(projectQuery);
    const project = projects?.[0];

    // 3. Get tasks for the project
    const tasksQuery = useMemoFirebase(() => {
        if (!project) return null;
        return collection(firestore, `projects/${project.id}/tasks`);
    }, [project]);
    const { data: tasks, isLoading: isLoadingTasks } = useCollection(tasksQuery);

    const handleMoveTask = (taskId: string, direction: 'left' | 'right') => {
        if (!project || !tasks || !firestore) return;

        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        const orderedColumns = project.columns.sort((a, b) => a.order - b.order);
        const currentColumnIndex = orderedColumns.findIndex(c => c.id === task.status);

        if (currentColumnIndex === -1) return;

        const nextColumnIndex = direction === 'right' ? currentColumnIndex + 1 : currentColumnIndex - 1;
        
        if (nextColumnIndex >= 0 && nextColumnIndex < orderedColumns.length) {
            const nextColumn = orderedColumns[nextColumnIndex];
            const taskRef = doc(firestore, `projects/${project.id}/tasks`, taskId);
            updateDocumentNonBlocking(taskRef, { status: nextColumn.id });
        }
    };


    if (isLoadingTeams || isLoadingProjects) {
        return (
            <AppLayout>
                <main className="flex-1 p-4 md:p-8 flex items-center justify-center">
                    <Loader className="animate-spin h-8 w-8 text-primary" />
                </main>
            </AppLayout>
        );
    }
    
    if (!team || !project) {
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
                        <h3 className="mt-4 text-lg font-medium">No Team Project Found</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Create a team and a project to start collaborating.
                        </p>
                        <Button className="mt-4">Create Your Team</Button>
                    </CardContent>
                </Card>
            </main>
            </AppLayout>
        );
    }
    

  return (
    <AppLayout>
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="p-4 md:p-8 border-b">
            <h1 className="text-3xl font-bold tracking-tight">My Team: {team.name}</h1>
            <p className="text-muted-foreground">Manage your project tasks below.</p>
        </div>
        {isLoadingTasks ? (
             <div className="flex-1 flex items-center justify-center">
                <Loader className="animate-spin h-8 w-8 text-primary" />
            </div>
        ) : (
             <KanbanBoard project={project} tasks={tasks || []} onMoveTask={handleMoveTask} />
        )}
      </main>
    </AppLayout>
  );
}
