'use server';
/**
 * @fileOverview Generates role-play scenarios for conversational English practice.
 *
 * - generateRolePlayScenarios - A function that generates role-play scenarios.
 * - GenerateRolePlayScenariosInput - The input type for the generateRolePlayScenarios function.
 * - GenerateRolePlayScenariosOutput - The return type for the generateRolePlayScenarios function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRolePlayScenariosInputSchema = z.object({
  context: z
    .string()
    .describe(
      'The context for the role-play scenario (e.g., job interview, business negotiation, medical consultation).' 
    ),
  goal: z
    .string()
    .describe(
      'The user\'s learning goal (e.g., improve conversational skills, practice specific vocabulary, prepare for a specific situation).'
    ),
  level: z
    .string()
    .describe(
        'The English proficiency level of the user (e.g., beginner, intermediate, advanced).'
    ),
  uploadedText: z
    .string()
    .optional()
    .describe(
      'Optional: A text file (e.g., book, manual, lecture notes) to serve as the knowledge source for the scenarios.'
    ),
});
export type GenerateRolePlayScenariosInput = z.infer<typeof GenerateRolePlayScenariosInputSchema>;

const GenerateRolePlayScenariosOutputSchema = z.object({
  scenarios: z
    .array(z.string())
    .describe('An array of generated role-play scenarios.'),
});
export type GenerateRolePlayScenariosOutput = z.infer<typeof GenerateRolePlayScenariosOutputSchema>;

export async function generateRolePlayScenarios(
  input: GenerateRolePlayScenariosInput
): Promise<GenerateRolePlayScenariosOutput> {
  return generateRolePlayScenariosFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRolePlayScenariosPrompt',
  input: {schema: GenerateRolePlayScenariosInputSchema},
  output: {schema: GenerateRolePlayScenariosOutputSchema},
  prompt: `You are an expert in creating role-play scenarios for English language learners.  Based on the user's context ({{{context}}}), learning goal ({{{goal}}}), and proficiency level ({{{level}}}), generate several unique and engaging role-play scenarios.  If the user has uploaded a text file ({{{uploadedText}}}), incorporate vocabulary and concepts from that text into the scenarios. Each scenario should provide a clear setting, characters, and objectives to facilitate realistic conversational practice.

Here are a few guidelines:

*   Lexical diversity, contextual relevance, and progressive difficulty.
*   Role authenticity in dialogue games.

Scenarios:`, 
});

const generateRolePlayScenariosFlow = ai.defineFlow(
  {
    name: 'generateRolePlayScenariosFlow',
    inputSchema: GenerateRolePlayScenariosInputSchema,
    outputSchema: GenerateRolePlayScenariosOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
