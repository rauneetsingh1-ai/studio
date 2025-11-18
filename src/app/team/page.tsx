'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader, Plus, Swords } from 'lucide-react';
import { useFirebase, useCollection, useDoc, useMemoFirebase, updateDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { collection, doc, query, where } from 'firebase/firestore';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
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

function KanbanTask({ task, index }) {
     return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`bg-card p-3 rounded-lg border mb-2 ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                >
                    <h4 className="font-semibold text-sm">{task.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                    {task.assignedTo && (
                         <Avatar className="h-6 w-6 mt-2">
                            <AvatarImage src={`https://picsum.photos/seed/${task.assignedTo}/100`} />
                            <AvatarFallback>{task.assignedTo.charAt(0)}</AvatarFallback>
                        </Avatar>
                    )}
                </div>
            )}
        </Draggable>
    );
}

function KanbanColumn({ column, tasks, projectId }) {
    return (
        <div className="bg-muted/50 rounded-lg w-72 flex-shrink-0">
            <h3 className="font-semibold p-3 border-b">{column.title}</h3>
            <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`p-2 min-h-[200px] transition-colors ${snapshot.isDraggingOver ? 'bg-accent/20' : ''}`}
                    >
                        {tasks.map((task, index) => (
                            <KanbanTask key={task.id} task={task} index={index} />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            <div className="p-2 border-t">
                <CreateTaskDialog projectId={projectId} columnId={column.id} onTaskCreated={() => {}}/>
            </div>
        </div>
    );
}

function KanbanBoard({ project, tasks, onDragEnd }) {
     const orderedColumns = project.columns.sort((a, b) => a.order - b.order);

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-4 overflow-x-auto p-4">
                {orderedColumns.map(column => {
                    const columnTasks = tasks.filter(task => task.status === column.id);
                    return <KanbanColumn key={column.id} column={column} tasks={columnTasks} projectId={project.id}/>;
                })}
            </div>
        </DragDropContext>
    );
}


export default function TeamPage() {
    const { user, firestore } = useFirebase();

    // 1. Find the user's team
    const teamQuery = useMemoFirebase(() => {
        if (!user) return null;
        return query(
            collection(firestore, 'teams'),
            where('members', 'array-contains', { uid: user.uid, role: 'member' }) // This is a simplification
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

    const handleDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination || !project || !firestore) {
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        const taskRef = doc(firestore, `projects/${project.id}/tasks`, draggableId);
        updateDocumentNonBlocking(taskRef, { status: destination.droppableId });
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
             <KanbanBoard project={project} tasks={tasks || []} onDragEnd={handleDragEnd} />
        )}
      </main>
    </AppLayout>
  );
}

    