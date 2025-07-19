'use server';

/**
 * @fileOverview Implements an AI-powered item matching flow for the Campus Compass app.
 *
 * This file defines a Genkit flow that uses Gemini to semantically match lost and found item descriptions.
 * It exports:
 *   - `matchItems`: The main function to trigger the matching process.
 *   - `MatchItemsInput`: The input type for the matchItems function.
 *   - `MatchItemsOutput`: The return type for the matchItems function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MatchItemsInputSchema = z.object({
  lostItemDescription: z.string().describe('Description of the lost item.'),
  foundItemDescriptions: z
    .array(z.string())
    .describe('Array of descriptions of found items.'),
});
export type MatchItemsInput = z.infer<typeof MatchItemsInputSchema>;

const MatchItemsOutputSchema = z.object({
  potentialMatches: z
    .array(z.string())
    .describe('Array of descriptions of found items that are potential matches.'),
});
export type MatchItemsOutput = z.infer<typeof MatchItemsOutputSchema>;

export async function matchItems(input: MatchItemsInput): Promise<MatchItemsOutput> {
  return matchItemsFlow(input);
}

const matchItemsPrompt = ai.definePrompt({
  name: 'matchItemsPrompt',
  input: {
    schema: MatchItemsInputSchema,
  },
  output: {
    schema: MatchItemsOutputSchema,
  },
  prompt: `You are an AI assistant designed to match lost items with found items based on their descriptions.

  Given the description of a lost item and a list of descriptions of found items, identify the found items that are potential matches for the lost item.

  Lost Item Description: {{{lostItemDescription}}}
  Found Item Descriptions: {{#each foundItemDescriptions}}{{{this}}}\n{{/each}}

  Consider factors such as item type, color, size, and any unique characteristics mentioned in the descriptions.
  Return only found item descriptions that are potential matches.
  Do not return found items that are clearly not a match.
  Do not explain your reasoning.
  `,
});

const matchItemsFlow = ai.defineFlow(
  {
    name: 'matchItemsFlow',
    inputSchema: MatchItemsInputSchema,
    outputSchema: MatchItemsOutputSchema,
  },
  async input => {
    const {output} = await matchItemsPrompt(input);
    return output!;
  }
);
