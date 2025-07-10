'use server';

/**
 * @fileOverview Summarizes the key vocabulary and grammar patterns of a document.
 *
 * - summarizeDocument - A function that handles the document summarization process.
 * - SummarizeDocumentInput - The input type for the summarizeDocument function.
 * - SummarizeDocumentOutput - The return type for the summarizeDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeDocumentInputSchema = z.object({
  documentText: z
    .string()
    .describe('The text content of the document to summarize.'),
  learningGoal: z
    .string()
    .optional()
    .describe('The user learning goal, for tailoring the summary.'),
});
export type SummarizeDocumentInput = z.infer<typeof SummarizeDocumentInputSchema>;

const SummarizeDocumentOutputSchema = z.object({
  vocabularySummary: z.string().describe('A summary of the key vocabulary in the document.'),
  grammarPatternsSummary: z
    .string()
    .describe('A summary of the key grammar patterns in the document.'),
});
export type SummarizeDocumentOutput = z.infer<typeof SummarizeDocumentOutputSchema>;

export async function summarizeDocument(
  input: SummarizeDocumentInput
): Promise<SummarizeDocumentOutput> {
  return summarizeDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeDocumentPrompt',
  input: {schema: SummarizeDocumentInputSchema},
  output: {schema: SummarizeDocumentOutputSchema},
  prompt: `You are an expert in English language learning.
  Your task is to analyze a document and provide summaries of its key vocabulary and grammar patterns.

  Document Text: {{{documentText}}}

  {% if learningGoal %}
  Learning Goal: {{{learningGoal}}}
  {% endif %}

  Provide a summary of the key vocabulary in the document, focusing on words that are likely to be useful for English language learners.  Also provide example sentences from the document.
  Then, provide a summary of the key grammar patterns in the document, with examples.  Return the summaries in the requested output format.
`,
});

const summarizeDocumentFlow = ai.defineFlow(
  {
    name: 'summarizeDocumentFlow',
    inputSchema: SummarizeDocumentInputSchema,
    outputSchema: SummarizeDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
