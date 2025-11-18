'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { analyzeTeamCompatibility } from '@/ai/flows/analyze-team-compatibility';
import type { UserProfile } from '@/lib/types';
import { Loader, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CompatibilityDialogProps {
  user1: UserProfile;
  user2: UserProfile & { matchScore: number };
}

export function CompatibilityDialog({ user1, user2 }: CompatibilityDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const { toast } = useToast();

  const handleOpen = async () => {
    if (summary) return; // Don't re-fetch if we already have the summary
    if (!isOpen) { // Only fetch when opening for the first time
      setIsOpen(true);
      setIsLoading(true);
      try {
        const result = await analyzeTeamCompatibility({
          user1Profile: JSON.stringify(user1),
          user2Profile: JSON.stringify(user2),
          matchScore: user2.matchScore,
        });
        setSummary(result.summary);
      } catch (error) {
        console.error('Failed to analyze compatibility:', error);
        toast({
          title: 'Analysis Failed',
          description: 'Could not generate compatibility analysis. Please try again.',
          variant: 'destructive',
        });
        setIsOpen(false); // Close dialog on error
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="p-0 h-auto text-xs mt-1" onClick={handleOpen}>
            Why is this a good match?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="text-primary" />
            Compatibility Analysis
          </DialogTitle>
          <DialogDescription>
            AI-powered insights on why you and {user2.name} could be a great team.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader className="animate-spin" />
              <span>Analyzing profiles...</span>
            </div>
          ) : (
            <p className="text-sm leading-relaxed bg-accent/50 p-4 rounded-md">{summary}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
