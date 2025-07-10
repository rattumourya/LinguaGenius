import { z } from 'zod';

/**
 * @fileOverview Zod schemas and TypeScript types for the Scrabble validation flow.
 *
 * - ValidateScrabbleWordInputSchema - Zod schema for the input of the validateScrabbleWord flow.
 * - ValidateScrabbleWordInput - TypeScript type for the input.
 * - ValidateScrabbleWordOutputSchema - Zod schema for the output of the validateScrabbleWord flow.
 * - ValidateScrabbleWordOutput - TypeScript type for the output.
 */

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
  score: z.number().describe('The Scrabble score for the word.'),
});
export type ValidateScrabbleWordOutput = z.infer<typeof ValidateScrabbleWordOutputSchema>;
