'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, MessageCircle, Calendar, Tag, Info, CheckCircle, Award, Loader2, PartyPopper } from 'lucide-react';

import type { Item } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { markAsFoundAction, claimItemAction } from '@/app/actions';
import { CategoryIcon } from './icons';

interface ItemDetailsDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  item: Item;
  onItemUpdate: () => void;
}

export function ItemDetailsDialog({ isOpen, setIsOpen, item, onItemUpdate }: ItemDetailsDialogProps) {
  const [isFoundPending, startFoundTransition] = useTransition();
  const [isClaimPending, startClaimTransition] = useTransition();
  const { toast } = useToast();

  const handleMarkAsFound = () => {
    startFoundTransition(async () => {
      const result = await markAsFoundAction(item.id);
      if (result.success) {
        toast({ title: "Success!", description: result.message });
        onItemUpdate();
        setIsOpen(false);
      } else {
        toast({ title: "Error", description: result.message, variant: 'destructive' });
      }
    });
  };

  const handleClaimItem = () => {
    startClaimTransition(async () => {
      const result = await claimItemAction(item.id);
      if (result.success) {
        toast({ title: "Success!", description: result.message });
        onItemUpdate();
        setIsOpen(false);
      } else {
        toast({ title: "Error", description: result.message, variant: 'destructive' });
      }
    });
  };

  const formattedDate = new Date(item.reportedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{item.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image src={item.imageUrl} alt={item.name} fill className="object-cover" data-ai-hint={`${item.category} ${item.name.split(' ')[0]}`}/>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-muted-foreground" />
                <Badge variant={item.status === 'Lost' ? 'destructive' : 'secondary'}>{item.status}</Badge>
            </div>
            <div className="flex items-center gap-2">
                <CategoryIcon category={item.category} className="h-5 w-5 text-muted-foreground" />
                <span className="text-foreground">{item.category}</span>
            </div>
            <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <span className="text-foreground">{item.location}</span>
            </div>
            <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-foreground">{formattedDate}</span>
            </div>
            <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                <p className="text-foreground text-sm">{item.description}</p>
            </div>
          </div>
        </div>
        <DialogFooter className="mt-6 gap-2 sm:gap-0">
            <Button asChild className="w-full sm:w-auto">
                <Link href={`/item/${item.id}/chat`}>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Chat about this item
                </Link>
            </Button>
            {item.status === 'Lost' && (
                <Button variant="outline" onClick={handleMarkAsFound} disabled={isFoundPending} className="w-full sm:w-auto">
                    {isFoundPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <CheckCircle className="mr-2 h-4 w-4" />}
                    Mark as Found
                </Button>
            )}
            {item.status === 'Found' && (
                <Button variant="outline" onClick={handleClaimItem} disabled={isClaimPending} className="w-full sm:w-auto">
                    {isClaimPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Award className="mr-2 h-4 w-4" />}
                    Claim Item
                </Button>
            )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
