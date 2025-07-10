# LinguaGenius System Design

This document provides a high-level overview of the frontend and backend architecture of the LinguaGenius application.

## 1. Core Technologies

- **Frontend**: [Next.js](https://nextjs.org/) with the App Router, [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI Backend**: [Firebase Genkit](https://firebase.google.com/docs/genkit)
- **AI Model Provider**: [Google AI (Gemini)](https://ai.google.dev/)
- **Deployment**: Firebase App Hosting

## 2. Frontend Architecture

The frontend is built using the **Next.js App Router**, which allows for a powerful combination of server-side and client-side rendering.

- **Server Components (Default)**: Most components are rendered on the server by default. This reduces the amount of JavaScript sent to the client, leading to faster initial page loads. These components are ideal for fetching data and displaying static content.

- **Client Components (`'use client'`)**: Components that require user interaction, state management (`useState`), or browser-specific APIs (`localStorage`) are marked with the `'use client'` directive. These components are pre-rendered on the server and then "hydrated" on the client to become interactive. All game pages are Client Components.

- **UI & Styling**: The UI is built with **ShadCN UI** components, which are pre-built, accessible, and customizable React components. Styling is handled via **Tailwind CSS**, a utility-first CSS framework that allows for rapid styling directly in the JSX. A global theme is defined in `src/app/globals.css` using CSS variables to ensure a consistent look and feel.

- **State Management**:
    - **Local State**: For component-level state (e.g., form inputs, loading states), we use React Hooks like `useState` and `useEffect`.
    - **Shared State (Cross-Component)**: For simple state sharing across pages, we use the browser's `localStorage`. The initial setup form on the home page saves user preferences, which are then read by the individual game pages to tailor the experience.

## 3. Backend (AI) Architecture

The application's AI capabilities are powered by **Firebase Genkit**. Genkit provides a streamlined way to define and manage interactions with Large Language Models (LLMs).

- **Genkit Flows**: A "flow" is a server-side function that orchestrates AI-related tasks. Each core game mechanic (e.g., generating Balderdash definitions, creating role-play scenarios) has its own dedicated flow defined in the `src/ai/flows/` directory.

- **Server Actions**: We use Next.js Server Actions to invoke Genkit flows. When a user clicks a button on a game page (a Client Component), it directly calls an exported server-side function (the Genkit flow). This eliminates the need to create and manage separate API endpoints, simplifying the architecture significantly.

- **Zod Schemas**: To ensure type safety and structured data between the client and the AI, we use `zod`. Each flow defines input and output schemas. This allows Genkit to request structured JSON from the AI model, which is then safely parsed and returned to the frontend.

## 4. End-to-End User Flow (Example: Balderdash)

Here is a step-by-step breakdown of a typical user interaction:

1.  **User Lands on Setup Page (`/`)**: The user fills out the initial form to define their learning profile (role, level, goal, context).
2.  **Save Profile**: Upon submission, the form data is saved to `localStorage` in the user's browser.
3.  **Navigate to Balderdash**: The user navigates to the Balderdash game page (`/balderdash`).
4.  **Component Mounts**: The `BalderdashPage` component (a Client Component) mounts and fetches the saved settings from `localStorage` to get context for the game.
5.  **Trigger AI Flow**: The component automatically calls the `generateBalderdashDefinitions` function. This is a Server Action that can be `await`ed directly from the client.
6.  **Server-Side Execution**:
    - The `generateBalderdashDefinitions` flow begins executing on the server.
    - It constructs a prompt using the word and context provided by the client.
    - It specifies the desired output format using a Zod schema (`GenerateBalderdashDefinitionsOutputSchema`).
    - Genkit sends the prompt and the structured output request to the Google Gemini model.
7.  **AI Response**: The Gemini model processes the request and returns a JSON object containing one real and several fake definitions.
8.  **Return to Client**: The JSON response is returned from the Server Action to the `BalderdashPage` component on the client.
9.  **UI Update**: The component updates its state with the new definitions, which triggers a re-render to display the game options to the user.
10. **User Interaction**: The user selects an answer and submits. The UI updates to show whether the choice was correct or not, handled entirely on the client side.
