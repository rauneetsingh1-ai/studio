'use client';

import { useFirebase, useCollection, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader, MessagesSquare, Send } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase';

function ChatSidebar({ chatRooms, activeChatId, setActiveChatId, isLoading }) {
  if (isLoading) {
    return (
      <div className="p-4 space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2">
            <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
            <div className="flex-1 space-y-1">
              <div className="h-4 bg-muted animate-pulse rounded-md" />
              <div className="h-3 w-3/4 bg-muted animate-pulse rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="h-full border-r border-border">
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-bold">Chats</h2>
      </div>
      <div className="overflow-y-auto">
        {chatRooms.map(room => (
          <button
            key={room.id}
            onClick={() => setActiveChatId(room.id)}
            className={cn(
              'w-full text-left flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors',
              activeChatId === room.id && 'bg-muted'
            )}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={`https://picsum.photos/seed/${room.id}/200`} />
              <AvatarFallback>{'C'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 truncate">
              <p className="font-semibold">{room.name ?? 'Chat Room'}</p>
              <p className="text-sm text-muted-foreground truncate">{room.lastMessage ?? 'No messages yet'}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ message, isCurrentUser }) {
    return (
        <div className={cn("flex items-end gap-2", isCurrentUser ? "justify-end" : "justify-start")}>
            {!isCurrentUser && (
                 <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://picsum.photos/seed/${message.from}/200`} />
                    <AvatarFallback>{message.from?.charAt(0) ?? '?'}</AvatarFallback>
                </Avatar>
            )}
            <div className={cn(
                "max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg",
                isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
            )}>
                <p className="text-sm">{message.text}</p>
                 <p className="text-xs opacity-70 mt-1 text-right">{message.createdAt?.toDate ? new Date(message.createdAt.toDate()).toLocaleTimeString() : 'sending...'}</p>
            </div>
        </div>
    )
}

function ChatView({ activeChatId }) {
    const { firestore, user } = useFirebase();
    const [newMessage, setNewMessage] = useState('');

    const messagesQuery = useMemoFirebase(() => {
        if (!activeChatId || !firestore) return null;
        return query(
            collection(firestore, `chatRooms/${activeChatId}/messages`),
            orderBy('createdAt', 'asc')
        );
    }, [firestore, activeChatId]);

    const { data: messages, isLoading } = useCollection(messagesQuery);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !user || !activeChatId || !firestore) return;

        const messagesCollection = collection(firestore, `chatRooms/${activeChatId}/messages`);
        addDocumentNonBlocking(messagesCollection, {
            from: user.uid,
            text: newMessage.trim(),
            createdAt: serverTimestamp()
        });

        setNewMessage('');
    };

    if (!activeChatId) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center">
                 <MessagesSquare className="h-16 w-16 text-muted-foreground" />
                <h3 className="mt-4 text-xl font-medium">Select a Chat</h3>
                <p className="mt-1 text-muted-foreground">Choose a conversation from the sidebar to start messaging.</p>
            </div>
        );
    }
    
    if (isLoading) {
        return <div className="h-full flex items-center justify-center"><Loader className="animate-spin" /></div>
    }


    return (
        <div className="h-full flex flex-col">
             <div className="p-4 border-b border-border">
                <h3 className="text-lg font-semibold">Chat</h3>
            </div>
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {messages?.map(msg => (
                    <MessageBubble key={msg.id} message={msg} isCurrentUser={msg.from === user?.uid} />
                ))}
            </div>
            <div className="p-4 border-t border-border">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1"
                    />
                    <Button type="submit" disabled={!newMessage.trim()}>
                        <Send />
                    </Button>
                </form>
            </div>
        </div>
    )
}


export default function MessagesPage() {
  const { user, firestore, isUserLoading } = useFirebase();
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const chatRoomsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'chatRooms'),
      where(`participants.${user.uid}`, '==', true)
    );
  }, [firestore, user]);

  const { data: chatRooms, isLoading } = useCollection(chatRoomsQuery);

  const isPageLoading = isLoading || isUserLoading;

  if (isPageLoading) {
    return (
         <AppLayout>
            <main className="flex-1">
                 <div className="h-screen flex items-center justify-center">
                    <Loader className="animate-spin h-8 w-8 text-primary" />
                </div>
            </main>
        </AppLayout>
    )
  }

  if (!chatRooms || chatRooms.length === 0) {
     return (
        <AppLayout>
          <main className="flex-1 p-4 md:p-8">
            <div className="space-y-4 mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
            </div>
            
            <Card className="h-[60vh] flex items-center justify-center">
                <CardContent className="text-center p-6">
                    <MessagesSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No Conversations Yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Connect with teammates to start a conversation.
                    </p>
                </CardContent>
            </Card>
          </main>
        </AppLayout>
      );
  }

  return (
    <AppLayout>
      <main className="h-screen flex flex-col">
        <div className="flex-1 grid grid-cols-[300px_1fr] overflow-hidden">
            <ChatSidebar 
                chatRooms={chatRooms}
                activeChatId={activeChatId}
                setActiveChatId={setActiveChatId}
                isLoading={isLoading}
            />
            <ChatView activeChatId={activeChatId} />
        </div>
      </main>
    </AppLayout>
  );
}
