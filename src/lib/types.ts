export type ItemCategory = 'Electronics' | 'Books' | 'Clothing' | 'ID Cards' | 'Other';

export type Item = {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  status: 'Lost' | 'Found';
  location: string;
  contact: string; // email
  imageUrl: string;
  reportedAt: Date;
};
