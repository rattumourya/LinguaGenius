'use server';

/**
 * @fileOverview Validates a Scrabble word and its usage in a sentence.
 *
 * - validateScrabbleWord - A function that validates a word against available tiles and checks sentence grammar.
 * - ValidateScrabbleWordInput - The input type for the validateScrabbleWord function.
 * - ValidateScrabbleWordOutput - The return type for the validateScrabbleWord function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const ValidateScrabbleWordInputSchema = z.object({
  word: z.string().describe('The word to validate.'),
  tiles: z.array(z.string()).describe('The available letter tiles.'),
  sentence: z.string().describe('The sentence using the word to check for grammar.'),
});
export type ValidateScrabbleWordInput = z.infer<typeof ValidateScrabbleWordInputSchema>;

export const ValidateScrabbleWordOutputSchema = z.object({
  isValidWord: z.boolean().describe('Whether the word is a valid English word.'),
  canBeMadeFromTiles: z.boolean().describe('Whether the word can be formed from the given tiles.'),
  isGrammaticallyCorrect: z.boolean().describe('Whether the sentence is grammatically correct.'),
  feedback: z.string().describe('Feedback on the word and sentence.'),
});
export type ValidateScrabbleWordOutput = z.infer<typeof ValidateScrabbleWordOutputSchema>;


export async function validateScrabbleWord(input: ValidateScrabbleWordInput): Promise<ValidateScrabbleWordOutput> {
  return validateScrabbleWordFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validateScrabbleWordPrompt',
  input: { schema: ValidateScrabbleWordInputSchema },
  output: { schema: ValidateScrabbleWordOutputSchema },
  prompt: `You are a Scrabble referee and an English grammar expert.
Your task is to validate a user's word and sentence based on the rules of Scrabble and English grammar.

Word played: {{{word}}}
Available tiles: {{#each tiles}}{{{this}}}{{/each}}
Sentence provided: {{{sentence}}}

First, determine if the played word can be formed using only the available tiles. The user can use a tile at most as many times as it appears in the available tiles list.

Second, determine if the played word is a valid English word.

Third, check if the provided sentence is grammatically correct. The sentence must use the played word.

Provide your validation results in the specified JSON format. The feedback should be a concise, helpful message for the user. For example, if the word is invalid, say "Sorry, '{{word}}' is not a valid English word." If the tiles are wrong, say "You don't have the right tiles to make '{{word}}'." If the grammar is incorrect, provide a brief explanation of the error. If everything is correct, say "Excellent! '{{word}}' is a valid word and your sentence is grammatically correct."
`,
});

const validateScrabbleWordFlow = ai.defineFlow(
  {
    name: 'validateScrabbleWordFlow',
    inputSchema: ValidateScrabbleWordInputSchema,
    outputSchema: ValidateScrabbleWordOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
