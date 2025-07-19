'use client'

import { Loader2 } from 'lucide-react';
import type { Item } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ItemCard } from '@/components/item-card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MatchingResultsDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  items: Item[];
  isLoading: boolean;
}

export function MatchingResultsDialog({ isOpen, setIsOpen, items, isLoading }: MatchingResultsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Potential Matches Found!</DialogTitle>
          <DialogDescription>
            Our AI has found some items that might be what you're looking for.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] p-1">
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
