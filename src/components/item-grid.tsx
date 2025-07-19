import { FileQuestion } from 'lucide-react';
import type { Item } from '@/lib/types';
import { ItemCard } from './item-card';
import { Skeleton } from '@/components/ui/skeleton';

interface ItemGridProps {
  items: Item[];
  isLoading: boolean;
  onCardClick: (item: Item) => void;
}

function ItemGridSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="flex flex-col space-y-3">
                    <Skeleton className="h-[200px] w-full rounded-lg" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function ItemGrid({ items, isLoading, onCardClick }: ItemGridProps) {
  if (isLoading) {
    return <ItemGridSkeleton />;
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-4 rounded-lg border-2 border-dashed">
        <FileQuestion className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-2xl font-semibold text-foreground">No Items Found</h3>
        <p className="text-muted-foreground mt-2">
          Try adjusting your search or filters. Or maybe nothing is lost!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} onClick={() => onCardClick(item)} />
      ))}
    </div>
  );
}
