'use server';

import type { Item, ChatMessage } from './types';
import { randomUUID } from 'crypto';

let items: Item[] = [
  {
    id: '1',
    chatId: randomUUID(),
    name: 'MacBook Pro 14"',
    description: 'A silver MacBook Pro with a small scratch on the corner and a sticker of a cat.',
    category: 'Electronics',
    status: 'Lost',
    location: 'Library, 2nd Floor',
    contact: 'student1@example.com',
    imageUrl: 'https://placehold.co/600x400.png',
    reportedAt: new Date('2024-05-20T10:00:00Z'),
  },
  {
    id: '2',
    chatId: randomUUID(),
    name: 'Hydro Flask Water Bottle',
    description: 'A blue Hydro Flask, 32 oz. It is covered in various national park stickers.',
    category: 'Other',
    status: 'Found',
    location: 'Campus Gym',
    contact: 'finder1@example.com',
    imageUrl: 'https://placehold.co/600x400.png',
    reportedAt: new Date('2024-05-21T14:30:00Z'),
  },
  {
    id: '3',
    chatId: randomUUID(),
    name: 'Organic Chemistry Textbook',
    description: '8th Edition of "Organic Chemistry" by Paula Yurkanis Bruice. Has some highlighting in the first few chapters.',
    category: 'Books',
    status: 'Lost',
    location: 'Chemistry Building, Room 101',
    contact: 'student2@example.com',
    imageUrl: 'https://placehold.co/600x400.png',
    reportedAt: new Date('2024-05-19T09:00:00Z'),
  },
  {
    id: '4',
    chatId: randomUUID(),
    name: 'Student ID Card',
    description: 'Student ID for Jane Doe. The picture is slightly faded.',
    category: 'ID Cards',
    status: 'Found',
    location: 'Student Union Cafeteria',
    contact: 'finder2@example.com',
    imageUrl: 'https://placehold.co/600x400.png',
    reportedAt: new Date('2024-05-22T12:00:00Z'),
  },
  {
    id: '5',
    chatId: randomUUID(),
    name: 'Black North Face Jacket',
    description: 'A black North Face jacket, size Medium. There is a small tear on the left sleeve.',
    category: 'Clothing',
    status: 'Found',
    location: 'Bus Stop near Main Gate',
    contact: 'finder3@example.com',
    imageUrl: 'https://placehold.co/600x400.png',
    reportedAt: new Date('2024-05-22T17:00:00Z'),
  },
  {
    id: '6',
    chatId: randomUUID(),
    name: 'Wireless Mouse',
    description: 'A gray wireless Logitech mouse. Was found near the computer lab entrance.',
    category: 'Electronics',
    status: 'Found',
    location: 'Tech Center',
    contact: 'finder4@example.com',
    imageUrl: 'https://placehold.co/600x400.png',
    reportedAt: new Date('2024-05-22T11:00:00Z'),
  },
];

let messages: ChatMessage[] = [];

// In-memory store, mimic async database call
export const getItems = async (): Promise<Item[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...items].sort((a, b) => b.reportedAt.getTime() - a.reportedAt.getTime()));
    }, 500);
  });
};

export const getItemById = async (id: string): Promise<Item | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(items.find(item => item.id === id));
    }, 200);
  });
}

export const getFoundItemsForMatching = async (): Promise<Item[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(items.filter(item => item.status === 'Found'));
      }, 0);
    });
  };

export const addItem = async (item: Omit<Item, 'id' | 'chatId' | 'reportedAt' | 'imageUrl'>): Promise<Item> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newItem: Item = {
          ...item,
          id: Date.now().toString(),
          chatId: randomUUID(),
          reportedAt: new Date(),
          imageUrl: 'https://placehold.co/600x400.png',
        };
        items = [newItem, ...items];
        resolve(newItem);
      }, 500);
    });
  };

export const getMessagesByChatId = async (chatId: string): Promise<ChatMessage[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(messages.filter(msg => msg.chatId === chatId).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()));
    }, 200);
  });
}

export const addMessage = async (chatId: string, text: string, sender: 'Owner' | 'Finder'): Promise<ChatMessage> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newMessage: ChatMessage = {
        id: randomUUID(),
        chatId,
        text,
        sender,
        timestamp: new Date(),
      };
      messages.push(newMessage);
      resolve(newMessage);
    }, 200);
  });
}

export const updateItemStatus = async (itemId: string, status: 'Lost' | 'Found'): Promise<Item> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const itemIndex = items.findIndex(item => item.id === itemId);
            if (itemIndex > -1) {
                items[itemIndex].status = status;
                resolve(items[itemIndex]);
            } else {
                reject(new Error('Item not found'));
            }
        }, 300);
    });
};

export const deleteItem = async (itemId: string): Promise<{ success: true }> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const initialLength = items.length;
            items = items.filter(item => item.id !== itemId);
            if (items.length < initialLength) {
                resolve({ success: true });
            } else {
                reject(new Error('Item not found'));
            }
        }, 300);
    });
};
