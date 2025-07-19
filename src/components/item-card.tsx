'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import type { Item } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CategoryIcon } from '@/components/icons';

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="aspect-video relative">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            data-ai-hint={`${item.category.toLowerCase()} ${item.name.split(' ')[0].toLowerCase()}`}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start gap-2 mb-2">
            <Badge variant="secondary" className="capitalize shrink-0">
                <CategoryIcon category={item.category} className="mr-1.5 h-3 w-3" />
                {item.category}
            </Badge>
            <span className="text-xs text-muted-foreground text-right whitespace-nowrap">
              {formatDistanceToNow(new Date(item.reportedAt), { addSuffix: true })}
            </span>
        </div>
        <CardTitle className="text-lg font-semibold mb-2 line-clamp-2">{item.name}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-1.5 h-4 w-4 shrink-0" />
          <span className="truncate">{item.location}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
            <Link href={`/item/${item.id}/chat`}>
                <MessageCircle className="mr-2 h-4 w-4" />
                Chat about this item
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
