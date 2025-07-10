# AI Flows and Genkit

This document provides a deeper dive into how Firebase Genkit is used to power the AI features in LinguaGenius.

## What is a Genkit Flow?

A Genkit "flow" is a function that runs on the server and orchestrates one or more steps to accomplish a goal, which usually involves calling an AI model. In our application, we use flows to generate all the dynamic, AI-powered content for the games.

Key characteristics of our flows:

-   **Server-Side**: They are defined with the `'use server'` directive, allowing them to be called directly from Client Components as if they were local functions (thanks to Next.js Server Actions).
-   **Structured I/O**: Every flow uses `zod` to define strict schemas for its inputs and outputs. This is a critical feature that allows us to ask the LLM for a response in a specific JSON format and then validate that the response matches our expectations. This prevents errors and makes the data easy to work with on the frontend.
-   **Single Responsibility**: Each flow has one specific job (e.g., generate clues, create definitions, validate a word).

## Core Genkit APIs Used

-   `ai.defineFlow()`: This function wraps our logic and registers it as a flow with Genkit. It takes the input and output schemas as arguments, ensuring type safety.
-   `ai.definePrompt()`: This is used inside a flow to define the prompt that will be sent to the AI model. It combines a template string with the input schema, allowing us to dynamically insert data from the client into the prompt.
-   `z.object()`: We use `zod` to create the input and output schemas. The descriptions within these schemas are passed to the AI model as instructions on how to structure its response.

## Example Flow Breakdown: `generateBalderdashDefinitions`

Let's examine `src/ai/flows/generate-balderdash-definitions.ts` to see how these pieces fit together.

**1. Input and Output Schemas (The "Contract")**

```typescript
// Input Schema
const GenerateBalderdashDefinitionsInputSchema = z.object({
  word: z.string().describe('The word to generate definitions for.'),
  // ... more fields
});

// Output Schema
const GenerateBalderdashDefinitionsOutputSchema = z.object({
  realDefinition: z.string().describe('The real definition of the word.'),
  fakeDefinitions: z.array(z.string()).describe('An array of fake, but plausible, definitions...'),
});
```

-   These schemas define the "contract" for the flow. The frontend must provide data matching the input schema, and it can expect to receive data matching the output schema.
-   The `.describe()` calls are important; they provide hints to the LLM on what kind of data is expected for each field in the output.

**2. The Prompt**

```typescript
const generateBalderdashDefinitionsPrompt = ai.definePrompt({
  name: 'generateBalderdashDefinitionsPrompt',
  input: {schema: GenerateBalderdashDefinitionsInputSchema},
  output: {schema: GenerateBalderdashDefinitionsOutputSchema},
  prompt: `You are an expert at creating definitions for words...

  The word is: {{{word}}}
  The context is: {{{context}}}

  Create one real definition, and {{{numFakeDefinitions}}} fake definitions...
  `,
});
```

-   The prompt is defined with a template string. The `{{{word}}}` and `{{{context}}}` are Handlebars placeholders that will be filled in with data from the input object.
-   Crucially, we pass the `output` schema to the prompt. Genkit uses this to instruct the Gemini model to return its response in the specified JSON format.

**3. The Flow (The "Orchestrator")**

```typescript
const generateBalderdashDefinitionsFlow = ai.defineFlow(
  {
    name: 'generateBalderdashDefinitionsFlow',
    inputSchema: GenerateBalderdashDefinitionsInputSchema,
    outputSchema: GenerateBalderdashDefinitionsOutputSchema,
  },
  async input => {
    // Calls the prompt with the input data
    const {output} = await generateBalderdashDefinitionsPrompt(input);
    return output!;
  }
);
```

-   This is the main flow function. It takes the validated `input` object.
-   It calls the prompt and `await`s the response.
-   Genkit handles the underlying API call to Google AI, including parsing the structured JSON response.
-   The flow returns the validated `output` object to the client.

**4. The Exported Wrapper (The "Server Action")**

```typescript
export async function generateBalderdashDefinitions(
  input: GenerateBalderdashDefinitionsInput
): Promise<GenerateBalderdashDefinitionsOutput> {
  return generateBalderdashDefinitionsFlow(input);
}
```

-   This simple wrapper function is what gets exported. By marking the file with `'use server'`, this function becomes a Server Action that can be imported and called directly from any Client Component in the application.
