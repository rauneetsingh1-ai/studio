'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useFirebase, useDoc, useMemoFirebase, updateDocumentNonBlocking } from "@/firebase";
import { doc } from "firebase/firestore";
import { Check, Loader, X } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";


function RequestCardSkeleton() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-6 w-32" />
                </div>
            </CardHeader>
            <CardContent>
                 <Skeleton className="h-4 w-4/5" />
            </CardContent>
             <CardFooter className="flex gap-2">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-10 w-1/2" />
            </CardFooter>
        </Card>
    );
}


export default function RequestCard({ request }: { request: any }) {
    const { firestore } = useFirebase();
    const { toast } = useToast();
    const [isProcessing, setIsProcessing] = useState(false);

    const fromUserRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return doc(firestore, 'users', request.fromUid);
    }, [firestore, request.fromUid]);

    const { data: fromUser, isLoading: isLoadingUser } = useDoc(fromUserRef);

    const handleUpdateRequest = async (status: 'accepted' | 'rejected') => {
        setIsProcessing(true);
        const requestRef = doc(firestore, 'requests', request.id);
        
        updateDocumentNonBlocking(requestRef, { status });

        toast({
            title: `Request ${status}`,
            description: `The request from ${fromUser?.name} has been ${status}.`
        });
        
        // No need to set isProcessing to false, as the component will disappear on the next render
    };

    if (isLoadingUser) {
        return <RequestCardSkeleton />;
    }

    if (!fromUser) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-4">
                     <Avatar className="h-12 w-12">
                        <AvatarImage src={fromUser.photoURL} alt={fromUser.name} />
                        <AvatarFallback>{fromUser.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <CardTitle>{fromUser.name}</CardTitle>
                </div>
            </CardHeader>
             <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {fromUser.bio || "This user hasn't written a bio yet."}
                </p>
            </CardContent>
            <CardFooter className="flex gap-2">
                 <Button className="w-full" onClick={() => handleUpdateRequest('accepted')} disabled={isProcessing}>
                    {isProcessing ? <Loader className="animate-spin" /> : <Check />}
                    Accept
                 </Button>
                 <Button variant="outline" className="w-full" onClick={() => handleUpdateRequest('rejected')} disabled={isProcessing}>
                     {isProcessing ? <Loader className="animate-spin" /> : <X />}
                     Decline
                 </Button>
            </CardFooter>
        </Card>
    );
}
