'use server';

/**
 * @fileOverview A flow that tailors vocabulary clues in Articulate based on user-uploaded text.
 *
 * - adaptArticulateClues - A function that tailors vocabulary clues for Articulate.
 * - AdaptArticulateCluesInput - The input type for the adaptArticulateClues function.
 * - AdaptArticulateCluesOutput - The return type for the adaptArticulateClues function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdaptArticulateCluesInputSchema = z.object({
  word: z.string().describe('The word to be described in Articulate.'),
  contextText: z.string().describe('The user-uploaded text to provide context for the clues.'),
});
export type AdaptArticulateCluesInput = z.infer<typeof AdaptArticulateCluesInputSchema>;

const AdaptArticulateCluesOutputSchema = z.object({
  clues: z.array(z.string()).describe('A list of tailored clues for the given word, based on the context text.'),
});
export type AdaptArticulateCluesOutput = z.infer<typeof AdaptArticulateCluesOutputSchema>;

export async function adaptArticulateClues(input: AdaptArticulateCluesInput): Promise<AdaptArticulateCluesOutput> {
  return adaptArticulateCluesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adaptArticulateCluesPrompt',
  input: {schema: AdaptArticulateCluesInputSchema},
  output: {schema: AdaptArticulateCluesOutputSchema},
  prompt: `You are an expert at creating clues for the game Articulate. Your goal is to generate clues for a given word, taking into account a specific context provided by the user.

  Word: {{{word}}}
  Context Text: {{{contextText}}}

  Generate a list of clues that are relevant to the context text. The clues should help someone guess the word without directly stating it or using obvious synonyms. Return the clues as a JSON array of strings.
  The clues should be diverse, ranging from definitions and analogies to examples and associations, all tailored to the provided context. Focus on aspects of the word that are highlighted or particularly relevant within the context.
  The clues should be appropriate for an adult native English speaker.
  `,
});

const adaptArticulateCluesFlow = ai.defineFlow(
  {
    name: 'adaptArticulateCluesFlow',
    inputSchema: AdaptArticulateCluesInputSchema,
    outputSchema: AdaptArticulateCluesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
