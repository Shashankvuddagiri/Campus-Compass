'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { addMessage, getMessagesByChatId, getItemById } from '@/lib/data';

const SendMessageSchema = z.object({
  chatId: z.string(),
  message: z.string().min(1, 'Message cannot be empty.'),
  sender: z.enum(['Owner', 'Finder']),
});

export async function getChatData(itemId: string) {
    const item = await getItemById(itemId);
    if (!item) {
        throw new Error('Item not found');
    }
    const messages = await getMessagesByChatId(item.chatId);
    return { item, messages };
}


export async function sendMessageAction(formData: FormData) {
  const validatedFields = SendMessageSchema.safeParse({
    chatId: formData.get('chatId'),
    message: formData.get('message'),
    sender: formData.get('sender'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { chatId, message, sender } = validatedFields.data;

  try {
    await addMessage(chatId, message, sender);
    const itemId = formData.get('itemId') as string;
    revalidatePath(`/item/${itemId}/chat`);
    return { success: true };
  } catch (error) {
    return { message: 'Failed to send message.' };
  }
}
