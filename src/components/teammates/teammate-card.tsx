'use client';

import type { UserProfile } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { MessageSquarePlus, UserRoundCheck } from 'lucide-react';
import { CompatibilityDialog } from './compatibility-dialog';

interface TeammateCardProps {
  user: UserProfile & { matchScore: number };
  currentUser: UserProfile;
}

export default function TeammateCard({ user, currentUser }: TeammateCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center text-center">
        <Avatar className="h-24 w-24 mb-2">
          <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person face" />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <CardTitle>{user.name}</CardTitle>
        <CardDescription className="line-clamp-2 h-10">{user.bio}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div>
            <div className="flex justify-between items-center mb-1">
                 <h4 className="text-sm font-semibold">Match Score</h4>
                 <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary to-primary">{user.matchScore}%</span>
            </div>
            <Progress value={user.matchScore} aria-label={`${user.matchScore}% match score`} />
             <CompatibilityDialog user1={currentUser} user2={user} />
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2">Top Skills</h4>
          <div className="flex flex-wrap gap-1">
            {user.skills.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col sm:flex-row gap-2">
        <Button className="w-full">
            <MessageSquarePlus /> Connect
        </Button>
      </CardFooter>
    </Card>
  );
}
