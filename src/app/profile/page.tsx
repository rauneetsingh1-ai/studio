'use client';

import React, { useState } from 'react';
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
import { currentUser } from '@/lib/data';
import { BrainCircuit, Loader, Sparkles } from 'lucide-react';
import { generateProfileBio } from '@/ai/flows/generate-profile-bio';
import { suggestSkillsFromDescription } from '@/ai/flows/suggest-skills-from-description';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  bio: z.string().max(500, 'Bio must be 500 characters or less.'),
  skills: z.string(),
  interests: z.string(),
  projectPreferences: z.string().max(1000, 'Preferences must be 1000 characters or less.'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
    const { toast } = useToast();
    const [isBioLoading, setIsBioLoading] = useState(false);
    const [isSkillsLoading, setIsSkillsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: currentUser.name,
      bio: currentUser.bio,
      skills: currentUser.skills.join(', '),
      interests: currentUser.interests.join(', '),
      projectPreferences: currentUser.projectPreferences,
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    console.log(data);
    toast({
        title: "Profile Saved!",
        description: "Your profile has been successfully updated.",
    });
  };

  const handleGenerateBio = async () => {
    setIsBioLoading(true);
    try {
        const { skills, interests } = getValues();
        if (!skills || !interests) {
            toast({
                title: "Missing Information",
                description: "Please fill out your skills and interests to generate a bio.",
                variant: 'destructive',
            });
            return;
        }
        const result = await generateProfileBio({ skills, interests });
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
        setValue('skills', result.suggestedSkills.join(', '), { shouldDirty: true });

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
    <AppLayout>
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-4xl space-y-8">
            <div>
                 <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                 <p className="text-muted-foreground">Manage your public presence on CollabX.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Public Information</CardTitle>
                    <CardDescription>This will be displayed on your profile.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                                <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
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
                                render={({ field }) => <Textarea id="bio" rows={5} {...field} />}
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
        </div>
      </main>
    </AppLayout>
  );
}
