// Author: rauneetsingh1@gmail.com
'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BrainCircuit, Loader, Sparkles } from 'lucide-react';
import { generateProfileBio } from '@/ai/flows/generate-profile-bio';
import { suggestSkillsFromDescription } from '@/ai/flows/suggest-skills-from-description';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { useFirebase, useDoc, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { SkillsQuiz } from '@/components/profile/skills-quiz';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  bio: z.string().max(500, 'Bio must be 500 characters or less.').optional(),
  skills: z.string().optional(),
  interests: z.string().optional(),
  projectPreferences: z.string().max(1000, 'Preferences must be 1000 characters or less.').optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

function ProfileForm({ userProfile, userDocRef }: { userProfile: any, userDocRef: any }) {
    const { toast } = useToast();
    const [isBioLoading, setIsBioLoading] = useState(false);
    const [isSkillsLoading, setIsSkillsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: userProfile.name || '',
      bio: userProfile.bio || '',
      skills: (userProfile.skills || []).join(', '),
      interests: (userProfile.interests || []).join(', '),
      projectPreferences: userProfile.projectPreferences || '',
    },
  });

  useEffect(() => {
    reset({
      name: userProfile.name || '',
      bio: userProfile.bio || '',
      skills: (userProfile.skills || []).join(', '),
      interests: (userProfile.interests || []).join(', '),
      projectPreferences: userProfile.projectPreferences || '',
    });
  }, [userProfile, reset]);


  const onSubmit = (data: ProfileFormValues) => {
    const updatedData = {
        ...data,
        skills: data.skills?.split(',').map(s => s.trim()).filter(Boolean) || [],
        interests: data.interests?.split(',').map(s => s.trim()).filter(Boolean) || [],
        updatedAt: serverTimestamp(),
    }
    updateDocumentNonBlocking(userDocRef, updatedData);
    toast({
        title: "Profile Saved!",
        description: "Your profile has been successfully updated.",
    });
    // Form is reset after Firestore listener updates the userProfile prop
  };

  const handleGenerateBio = async () => {
    setIsBioLoading(true);
    try {
        const { skills, interests } = getValues();
        if (!skills && !interests) {
            toast({
                title: "Missing Information",
                description: "Please fill out your skills and interests to generate a bio.",
                variant: 'destructive',
            });
            return;
        }
        const result = await generateProfileBio({ 
            skills: skills || '', 
            interests: interests || '' 
        });
        setValue('bio', result.bio, { shouldDirty: true });
    } catch (error) {
        console.error("Failed to generate bio:", error);
        toast({
            title: "Error",
            description: "Failed to generate bio. Please try again.",
            variant: 'destructive',
        });
    } finally {
        setIsBioLoading(false);
    }
  };
  
  const handleSuggestSkills = async () => {
    setIsSkillsLoading(true);
    try {
        const { projectPreferences } = getValues();
        if (!projectPreferences) {
            toast({
                title: "Missing Information",
                description: "Please describe your project preferences to get skill suggestions.",
                variant: 'destructive',
            });
            return;
        }
        const result = await suggestSkillsFromDescription({ description: projectPreferences });
        const currentSkills = getValues('skills')?.split(',').map(s => s.trim()).filter(Boolean) || [];
        const newSkills = [...new Set([...currentSkills, ...result.suggestedSkills])];
        setValue('skills', newSkills.join(', '), { shouldDirty: true });

    } catch(error) {
        console.error("Failed to suggest skills:", error);
         toast({
            title: "Error",
            description: "Failed to suggest skills. Please try again.",
            variant: 'destructive',
        });
    } finally {
        setIsSkillsLoading(false);
    }
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle>Public Information</CardTitle>
            <CardDescription>This will be displayed on your profile.</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={userProfile.photoURL} alt={userProfile.name} />
                        <AvatarFallback>{userProfile.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                     <Button variant="outline">Change Photo</Button>
                </div>
                
                <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                     <Controller
                        name="name"
                        control={control}
                        render={({ field }) => <Input id="name" {...field} />}
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>

                 <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="bio">Bio</Label>
                        <Button type="button" variant="outline" size="sm" onClick={handleGenerateBio} disabled={isBioLoading}>
                            {isBioLoading ? <Loader className="animate-spin" /> : <Sparkles />}
                            Generate with AI
                        </Button>
                    </div>
                    <Controller
                        name="bio"
                        control={control}
                        render={({ field }) => <Textarea id="bio" rows={5} {...field} placeholder="Tell us about yourself..."/>}
                    />
                    {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
                </div>

                <Separator />

                <CardTitle>Buildathon Profile</CardTitle>
                 
                 <div className="grid gap-2">
                    <Label htmlFor="projectPreferences">Project Preferences</Label>
                     <Controller
                        name="projectPreferences"
                        control={control}
                        render={({ field }) => <Textarea id="projectPreferences" rows={4} placeholder="Describe the types of projects you're excited to work on..." {...field} />}
                    />
                    {errors.projectPreferences && <p className="text-sm text-destructive">{errors.projectPreferences.message}</p>}
                </div>

                <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="skills">Skills</Label>
                        <Button type="button" variant="outline" size="sm" onClick={handleSuggestSkills} disabled={isSkillsLoading}>
                            {isSkillsLoading ? <Loader className="animate-spin" /> : <BrainCircuit />}
                            Suggest from Preferences
                        </Button>
                    </div>
                     <Controller
                        name="skills"
                        control={control}
                        render={({ field }) => <Input id="skills" placeholder="React, Figma, Python..." {...field} />}
                    />
                    <p className="text-xs text-muted-foreground">Comma-separated list of your skills.</p>
                    {errors.skills && <p className="text-sm text-destructive">{errors.skills.message}</p>}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="interests">Interests</Label>
                     <Controller
                        name="interests"
                        control={control}
                        render={({ field }) => <Input id="interests" placeholder="AI, SaaS, Social Good..." {...field} />}
                    />
                    <p className="text-xs text-muted-foreground">Comma-separated list of your interests.</p>
                    {errors.interests && <p className="text-sm text-destructive">{errors.interests.message}</p>}
                </div>


                <div className="flex justify-end">
                    <Button type="submit" disabled={!isDirty || isSubmitting}>
                        {isSubmitting && <Loader className="animate-spin mr-2"/>}
                        Save Changes
                    </Button>
                </div>
            </form>
        </CardContent>
    </Card>
  );
}

function ProfileSkeleton() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Public Information</CardTitle>
                <CardDescription>This will be displayed on your profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <Skeleton className="h-10 w-28" />
                </div>
                <div className="grid gap-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="grid gap-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-24 w-full" />
                </div>
                <Separator />
                <Skeleton className="h-6 w-48" />
                <div className="grid gap-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-20 w-full" />
                </div>
                 <div className="grid gap-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="grid gap-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="flex justify-end">
                    <Skeleton className="h-10 w-32" />
                </div>
            </CardContent>
        </Card>
    )
}


export default function ProfilePage() {
    const { user, firestore, isUserLoading } = useFirebase();

    const userDocRef = useMemoFirebase(() => {
        if (!user) return null;
        return doc(firestore, "users", user.uid);
    }, [user, firestore]);

    const { data: userProfile, isLoading: isProfileLoading } = useDoc(userDocRef);

    const isLoading = isUserLoading || isProfileLoading;

    return (
        <AppLayout>
            <main className="flex-1 p-4 md:p-8">
                <div className="mx-auto max-w-4xl space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                        <p className="text-muted-foreground">Manage your public presence on CollabX.</p>
                    </div>

                    {isLoading ? (
                        <ProfileSkeleton />
                    ) : userProfile ? (
                        <>
                            <ProfileForm userProfile={userProfile} userDocRef={userDocRef} />
                            <SkillsQuiz userProfile={userProfile} userDocRef={userDocRef} />
                        </>
                    ) : (
                        <Card>
                            <CardContent className="p-6">
                                <p>Could not load user profile. Please try again later.</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
        </AppLayout>
    );
}
