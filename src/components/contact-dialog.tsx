'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';

import type { Item } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ContactDialogProps {
  item: Item;
}

export function ContactDialog({ item }: ContactDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Contact {item.status === 'Lost' ? 'Owner' : 'Finder'}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Information</DialogTitle>
          <DialogDescription>
            Use this email to get in touch about the {item.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <a 
              href={`mailto:${item.contact}`} 
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80"
            >
              <Mail className="h-4 w-4" />
              <span>{item.contact}</span>
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
