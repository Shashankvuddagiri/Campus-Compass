'use server';

/**
 * @fileOverview Implements a simple conversational AI chat flow.
 *
 * This file defines a Genkit flow that uses Gemini to respond to user messages in a conversational context.
 * It exports:
 *   - `chat`: The main function to trigger the chat response.
 *   - `ChatInput`: The input type for the chat function.
 *   - `ChatOutput`: The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const ChatInputSchema = z.object({
  history: z.array(MessageSchema).describe('The conversation history.'),
  message: z.string().describe('The latest user message.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

export type ChatOutput = string;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  const {history, message} = input;

  const response = await ai.generate({
    model: 'googleai/gemini-2.0-flash',
    prompt: message,
    history: history.map(msg => ({role: msg.role, content: [{text: msg.content}]})),
    system: `You are a friendly and helpful assistant for the Campus Compass app, a lost and found platform for a university campus.
Your goal is to assist users with their questions about the app, lost and found items, and give helpful advice.
Keep your responses concise and to the point.
The current date is ${new Date().toLocaleDateString()}.
You cannot perform actions like reporting items for the user. You should guide them to use the "Report Item" button.
When asked about specific items, you can mention that you don't have real-time access to the item database but can give general advice.`,
  });

  return response.text;
}
