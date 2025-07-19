import { BookOpen, Laptop, Shirt, UserSquare, Box, type LucideProps } from 'lucide-react';
import type { ItemCategory } from '@/lib/types';

const categoryIcons: Record<ItemCategory, React.ElementType<LucideProps>> = {
  Electronics: Laptop,
  Books: BookOpen,
  Clothing: Shirt,
  'ID Cards': UserSquare,
  Other: Box,
};

interface CategoryIconProps extends LucideProps {
  category: ItemCategory;
}

export function CategoryIcon({ category, ...props }: CategoryIconProps) {
  const Icon = categoryIcons[category] || Box;
  return <Icon {...props} />;
}
