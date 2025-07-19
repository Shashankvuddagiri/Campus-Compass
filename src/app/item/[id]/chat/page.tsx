'use client';
import { useState, useEffect, useRef, useActionState } from 'react';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { Send, ArrowLeft, User, Bot, Loader2, Compass } from 'lucide-react';

import type { Item, ChatMessage } from '@/lib/types';
import { getChatData, sendMessageAction } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';


function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" size="icon" disabled={pending}>
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
    );
}

export default function ChatPage({ params }: { params: { id: string } }) {
    const [item, setItem] = useState<Item | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [role, setRole] = useState<'Owner' | 'Finder' | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const [state, formAction] = useActionState(sendMessageAction, { success: false });

    useEffect(() => {
        async function loadData() {
            try {
                const { item: fetchedItem, messages: fetchedMessages } = await getChatData(params.id);
                setItem(fetchedItem);
                setMessages(fetchedMessages);
                // In a real app, user role would be determined by auth.
                // Here we'll derive it based on the item status for demo purposes.
                setRole(fetchedItem.status === 'Lost' ? 'Finder' : 'Owner');
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, [params.id]);

    useEffect(() => {
        if (state.success) {
            formRef.current?.reset();
            // Refetch messages after sending a new one
            getChatData(params.id).then(({ messages }) => setMessages(messages));
        }
    }, [state, params.id]);

    useEffect(() => {
        if (scrollAreaRef.current) {
            setTimeout(() => {
                scrollAreaRef.current!.scrollTo({
                    top: scrollAreaRef.current!.scrollHeight,
                    behavior: 'smooth',
                });
            }, 100);
        }
    }, [messages]);

    if (isLoading) {
        return <ChatPageSkeleton />;
    }

    if (!item || !role) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-background">
                <p className="text-xl text-muted-foreground">Item not found or could not determine role.</p>
                <Button asChild variant="link" className="mt-4">
                    <Link href="/">Go back to Home</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-screen">
            <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/">
                        <ArrowLeft />
                    </Link>
                </Button>
                <div className="text-center">
                    <h1 className="text-lg font-semibold truncate">{item.name}</h1>
                    <p className="text-sm text-muted-foreground">Chat</p>
                </div>
                <div className="w-10"></div>
            </header>
            <main className="flex-1 overflow-hidden">
                <ScrollArea className="h-full p-4 md:p-6" ref={scrollAreaRef}>
                    <div className="space-y-4 max-w-2xl mx-auto">
                        <div className="text-center p-4 my-4 rounded-lg bg-secondary text-secondary-foreground">
                            <p className="font-semibold">You are chatting as the {role}.</p>
                            <p className="text-sm">Be respectful and arrange a safe meeting place on campus to exchange the item.</p>
                        </div>

                        {messages.map((message) => (
                             <div
                                key={message.id}
                                className={cn(
                                'flex items-start gap-3',
                                message.sender === role ? 'justify-end' : 'justify-start'
                                )}
                            >
                                {message.sender !== role && (
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                                </Avatar>
                                )}
                                <div
                                className={cn(
                                    'rounded-lg px-3 py-2 max-w-[80%]',
                                    message.sender === role
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                )}
                                >
                                <p className="text-sm">{message.text}</p>
                                <p className="text-xs text-right opacity-70 mt-1">{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                                {message.sender === role && (
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback><Compass className="h-5 w-5"/></AvatarFallback>
                                </Avatar>
                                )}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </main>
            <footer className="p-4 border-t bg-background">
                <form 
                    ref={formRef}
                    action={formAction}
                    className="flex w-full items-center gap-2 max-w-2xl mx-auto"
                >
                    <Input name="message" placeholder="Type your message..." autoComplete="off" />
                    <input type="hidden" name="chatId" value={item.chatId} />
                    <input type="hidden" name="itemId" value={item.id} />
                    <input type="hidden" name="sender" value={role} />
                    <SubmitButton />
                </form>
            </footer>
        </div>
    );
}

function ChatPageSkeleton() {
    return (
        <div className="flex flex-col h-screen">
            <header className="flex items-center justify-between p-4 border-b">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="text-center">
                    <Skeleton className="h-6 w-48" />
                </div>
                <div className="w-10"></div>
            </header>
            <main className="flex-1 overflow-hidden p-6">
                <div className="space-y-4 max-w-2xl mx-auto">
                    <div className="flex gap-3 justify-start">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-16 w-64 rounded-lg" />
                    </div>
                    <div className="flex gap-3 justify-end">
                        <Skeleton className="h-20 w-80 rounded-lg" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                    <div className="flex gap-3 justify-start">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-12 w-48 rounded-lg" />
                    </div>
                </div>
            </main>
            <footer className="p-4 border-t">
                <div className="flex w-full items-center gap-2 max-w-2xl mx-auto">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-10" />
                </div>
            </footer>
        </div>
    );
}
