// src/ai/flows/generate-balderdash-definitions.ts
'use server';
/**
 * @fileOverview Generates definitions, including a real one and convincing fake ones, for use in a Balderdash game.
 *
 * - generateBalderdashDefinitions - A function that generates Balderdash definitions.
 * - GenerateBalderdashDefinitionsInput - The input type for the generateBalderdashDefinitions function.
 * - GenerateBalderdashDefinitionsOutput - The return type for the generateBalderdashDefinitions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBalderdashDefinitionsInputSchema = z.object({
  word: z.string().describe('The word to generate definitions for.'),
  context: z.string().describe('The context in which the word is used, e.g., "business", "medicine", or a snippet of text from a document.'),
  numFakeDefinitions: z.number().describe('The number of fake definitions to generate.'),
});
export type GenerateBalderdashDefinitionsInput = z.infer<typeof GenerateBalderdashDefinitionsInputSchema>;

const GenerateBalderdashDefinitionsOutputSchema = z.object({
  realDefinition: z.string().describe('The real definition of the word.'),
  fakeDefinitions: z.array(z.string()).describe('An array of fake, but plausible, definitions for the word.'),
});
export type GenerateBalderdashDefinitionsOutput = z.infer<typeof GenerateBalderdashDefinitionsOutputSchema>;

export async function generateBalderdashDefinitions(
  input: GenerateBalderdashDefinitionsInput
): Promise<GenerateBalderdashDefinitionsOutput> {
  return generateBalderdashDefinitionsFlow(input);
}

const generateBalderdashDefinitionsPrompt = ai.definePrompt({
  name: 'generateBalderdashDefinitionsPrompt',
  input: {schema: GenerateBalderdashDefinitionsInputSchema},
  output: {schema: GenerateBalderdashDefinitionsOutputSchema},
  prompt: `You are an expert at creating definitions for words, both real and fake.

  You are creating content for a game of Balderdash, where players must distinguish the real definition of a word from fake definitions.

  The word is: {{{word}}}
  The context is: {{{context}}}

  Create one real definition, and {{{numFakeDefinitions}}} fake definitions that sound plausible in the given context.
  The fake definitions should be creative and convincing, but ultimately incorrect.

  Here's an example of the desired output format:
  { 
    "realDefinition": "The actual meaning of the word.",
    "fakeDefinitions": [
      "A plausible but incorrect meaning.",
      "Another plausible but incorrect meaning.",
    ]
  }

  Make sure the real definition is very clearly the actual definition and that the fake definitions aren't too similar to the real one.
  Ensure that the number of fake definitions matches the number requested by the user, do not generate more or less definitions.
  Always return the result in the requested JSON format.
  `,
});

const generateBalderdashDefinitionsFlow = ai.defineFlow(
  {
    name: 'generateBalderdashDefinitionsFlow',
    inputSchema: GenerateBalderdashDefinitionsInputSchema,
    outputSchema: GenerateBalderdashDefinitionsOutputSchema,
  },
  async input => {
    const {output} = await generateBalderdashDefinitionsPrompt(input);
    return output!;
  }
);
