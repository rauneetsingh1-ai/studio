// Author: rauneetsingh1@gmail.com
'use client';

import type { UserProfile } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { MessageSquarePlus, UserRoundCheck, Check, Loader } from 'lucide-react';
import { CompatibilityDialog } from './compatibility-dialog';
import { useFirebase, addDocumentNonBlocking, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, serverTimestamp, query, where, limit, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface TeammateCardProps {
  user: UserProfile & { matchScore: number };
}

export default function TeammateCard({ user: potentialTeammate }: TeammateCardProps) {
  const { firestore, user: currentUser } = useFirebase();
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);

  const currentUserDocRef = useMemoFirebase(() => {
    if (!firestore || !currentUser) return null;
    return doc(firestore, 'users', currentUser.uid);
  }, [firestore, currentUser]);

  const {data: currentUserProfile} = useDoc(currentUserDocRef);

  const requestsRef = useMemoFirebase(() => {
    if (!firestore || !currentUser) return null;
    return query(
        collection(firestore, "requests"),
        where('fromUid', '==', currentUser.uid),
        where('toUid', '==', potentialTeammate.id),
        limit(1)
    );
  }, [firestore, currentUser, potentialTeammate.id]);

  const { data: existingRequests, isLoading: isLoadingRequests } = useCollection(requestsRef);

  const hasSentRequest = existingRequests && existingRequests.length > 0;
  const isButtonDisabled = isSending || hasSentRequest || isLoadingRequests;


  const handleConnect = async () => {
    if (!currentUser || !firestore) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to connect with others.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    const requestsCollection = collection(firestore, 'requests');

    addDocumentNonBlocking(requestsCollection, {
      fromUid: currentUser.uid,
      toUid: potentialTeammate.id,
      status: "pending",
      createdAt: serverTimestamp()
    });

    // The toast and state update can happen immediately due to the non-blocking write
    toast({
        title: "Request Sent!",
        description: `Your connection request to ${potentialTeammate.name} has been sent.`,
    });
    
    // Visually disable the button immediately; Firestore listener will eventually confirm.
    // No need to setIsSending(false) because the button will become disabled by hasSentRequest.
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center text-center">
        <Avatar className="h-24 w-24 mb-2">
          <AvatarImage src={potentialTeammate.avatarUrl} alt={potentialTeammate.name} data-ai-hint="person face" />
          <AvatarFallback>{potentialTeammate.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <CardTitle>{potentialTeammate.name}</CardTitle>
        <CardDescription className="line-clamp-2 h-10">{potentialTeammate.bio}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div>
            <div className="flex justify-between items-center mb-1">
                 <h4 className="text-sm font-semibold">Match Score</h4>
                 <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary to-primary">{potentialTeammate.matchScore}%</span>
            </div>
            <Progress value={potentialTeammate.matchScore} aria-label={`${potentialTeammate.matchScore}% match score`} />
             {currentUserProfile && <CompatibilityDialog user1={currentUserProfile} user2={potentialTeammate} />}
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2">Top Skills</h4>
          <div className="flex flex-wrap gap-1">
            {potentialTeammate.skills.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col sm:flex-row gap-2">
        <Button className="w-full" onClick={handleConnect} disabled={isButtonDisabled}>
            {isLoadingRequests ? <Loader className="animate-spin" /> 
              : hasSentRequest ? <><Check /> Request Sent</> 
              : <><MessageSquarePlus /> Connect</>
            }
        </Button>
      </CardFooter>
    </Card>
  );
}
