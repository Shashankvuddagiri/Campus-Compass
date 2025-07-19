'use server';

import { z } from 'zod';
import { addItem } from '@/lib/data';
import type { Item, ItemCategory } from '@/lib/types';

const FormSchema = z.object({
  name: z.string().min(3, { message: 'Item name must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  category: z.enum(['Electronics', 'Books', 'Clothing', 'ID Cards', 'Other']),
  status: z.enum(['Lost', 'Found']),
  location: z.string().min(3, { message: 'Location must be at least 3 characters.' }),
  contact: z.string().email({ message: 'Please enter a valid email address.' }),
});

export type ReportItemFormState = {
  errors?: {
    name?: string[];
    description?: string[];
    category?: string[];
    status?: string[];
    location?: string[];
    contact?: string[];
  };
  message?: string | null;
  newItem?: Item;
};

export async function reportItemAction(
  prevState: ReportItemFormState,
  formData: FormData
): Promise<ReportItemFormState> {
  const validatedFields = FormSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    category: formData.get('category'),
    status: formData.get('status'),
    location: formData.get('location'),
    contact: formData.get('contact'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to report item. Please check the fields.',
    };
  }

  try {
    const newItem = await addItem({
      ...validatedFields.data,
      category: validatedFields.data.category as ItemCategory,
    });
    
    return { message: 'Item reported successfully!', newItem };
  } catch (error) {
    return {
      message: 'Database Error: Failed to report item.',
    };
  }
}
