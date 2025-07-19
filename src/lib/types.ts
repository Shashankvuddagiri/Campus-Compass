export type ItemCategory = 'Electronics' | 'Books' | 'Clothing' | 'ID Cards' | 'Other';

export type Item = {
  id: string;
  chatId: string; // Unique ID for the chat channel associated with this item
  name: string;
  description: string;
  category: ItemCategory;
  status: 'Lost' | 'Found';
  location: string;
  contact: string; // email, still useful as a fallback or for initial user identification
  imageUrl: string;
  reportedAt: Date;
};

export type ChatMessage = {
  id: string;
  chatId: string;
  text: string;
  sender: 'Owner' | 'Finder';
  timestamp: Date;
};
