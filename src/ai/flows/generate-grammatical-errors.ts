// src/ai/flows/generate-grammatical-errors.ts
'use server';

/**
 * @fileOverview Generates text with grammatical errors based on the provided context.
 *
 * - generateGrammaticalErrors - A function that generates text with grammatical errors.
 * - GenerateGrammaticalErrorsInput - The input type for the generateGrammaticalErrors function.
 * - GenerateGrammaticalErrorsOutput - The return type for the generateGrammaticalErrors function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateGrammaticalErrorsInputSchema = z.object({
  text: z.string().describe('The base text to introduce grammatical errors into.'),
  errorCount: z.number().int().min(1).max(10).default(3).describe('The number of grammatical errors to introduce.'),
});
export type GenerateGrammaticalErrorsInput = z.infer<typeof GenerateGrammaticalErrorsInputSchema>;

const GenerateGrammaticalErrorsOutputSchema = z.object({
  textWithErrors: z.string().describe('The text with the specified number of grammatical errors introduced.'),
});
export type GenerateGrammaticalErrorsOutput = z.infer<typeof GenerateGrammaticalErrorsOutputSchema>;

export async function generateGrammaticalErrors(input: GenerateGrammaticalErrorsInput): Promise<GenerateGrammaticalErrorsOutput> {
  return generateGrammaticalErrorsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateGrammaticalErrorsPrompt',
  input: {schema: GenerateGrammaticalErrorsInputSchema},
  output: {schema: GenerateGrammaticalErrorsOutputSchema},
  prompt: `You are an expert grammarian. You will take the following text and introduce {{errorCount}} grammatical errors. The errors should be realistic and varied. Do not explain the errors, simply insert them into the text.

Text: {{{text}}}`,
});

const generateGrammaticalErrorsFlow = ai.defineFlow(
  {
    name: 'generateGrammaticalErrorsFlow',
    inputSchema: GenerateGrammaticalErrorsInputSchema,
    outputSchema: GenerateGrammaticalErrorsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
