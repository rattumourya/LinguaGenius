# Project Structure

This document outlines the key files and directories in the LinguaGenius project.

-   **`/` (Root)**
    -   `next.config.ts`: Configuration file for Next.js.
    -   `tailwind.config.ts`: Configuration file for Tailwind CSS, including custom colors and fonts.
    -   `tsconfig.json`: TypeScript compiler settings.
    -   `package.json`: Lists project dependencies and scripts.
    -   `components.json`: Configuration for ShadCN UI.
    -   `apphosting.yaml`: Configuration for Firebase App Hosting.

-   **`src/`**
    -   **`app/`**: The core of the Next.js application, using the App Router.
        -   `globals.css`: Global stylesheet, including Tailwind directives and CSS variables for theming (colors, fonts, etc.).
        -   `layout.tsx`: The root layout for the entire application. It sets up the HTML structure, fonts, and the global `Toaster` component.
        -   `page.tsx`: The landing/setup page of the application. This is where users create their learning profile.
        -   **`(games)/`**: This is a [Route Group](https://nextjs.org/docs/app/building-your-application/routing/route-groups). The folder name `(games)` is ignored in the URL path.
            -   `layout.tsx`: A shared layout for all game pages. It includes the main sidebar navigation.
            -   `dashboard/page.tsx`: The main dashboard showing all available games.
            -   `[game_name]/page.tsx`: The main page component for each game (e.g., `scrabble/page.tsx`, `balderdash/page.tsx`). These are all Client Components (`'use client'`) because they manage state and handle user interaction.

    -   **`ai/`**: Contains all AI-related logic, powered by Firebase Genkit.
        -   `genkit.ts`: Initializes the global Genkit instance and configures the Google AI plugin.
        -   **`flows/`**: Each file in this directory defines a single, self-contained AI flow (a Server Action).
            -   `[flow_name].ts`: Implements the logic for a specific AI task, including the prompt, input/output schemas (using Zod), and the flow definition. These are server-side files marked with `'use server'`.
        -   **`schemas/`**: Contains shared Zod schemas that might be used by multiple flows.

    -   **`components/`**: Shared, reusable React components.
        -   `Logo.tsx`: The application logo component.
        -   `PageHeader.tsx`: A standardized header component used at the top of each page.
        -   **`ui/`**: Components from the ShadCN UI library (e.g., `Button.tsx`, `Card.tsx`, `Input.tsx`). These are the building blocks for the application's interface.

    -   **`hooks/`**: Custom React hooks.
        -   `use-toast.ts`: A custom hook for showing toast notifications.
        -   `use-mobile.ts`: A hook to detect if the user is on a mobile device.

    -   **`lib/`**: Utility functions.
        -   `utils.ts`: Contains helper functions, most notably `cn` for merging Tailwind CSS classes.
