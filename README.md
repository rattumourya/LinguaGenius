# LinguaGenius - A Firebase Studio Project

This is a Next.js starter project built in Firebase Studio. It's an AI-powered suite of English learning games designed to improve your skills in a fun and personalized way.

## Prerequisites

Before you can run this application locally, you will need the following:

1.  **Node.js**: Make sure you have Node.js installed on your system. We recommend using version 20 or later. You can download it from [nodejs.org](https://nodejs.org/).
2.  **npm**: npm (Node Package Manager) is included with Node.js.
3.  **Google AI API Key**: The application's AI features are powered by Google's Gemini models via Firebase Genkit.
    -   Visit [Google AI Studio](https://aistudio.google.com/app/apikey) to generate a free API key.
    -   Create a new file named `.env` in the root of this project.
    -   Add your API key to the `.env` file like this:
        ```
        GOOGLE_API_KEY=YOUR_API_KEY_HERE
        ```

## Running the Application Locally

To run the application, you need to start two separate development servers in two separate terminal windows.

**1. Start the Next.js Frontend:**

In your first terminal, run the following command to install dependencies and start the Next.js development server:

```bash
npm install
npm run dev
```

This will start the frontend application, usually on `http://localhost:9002`.

**2. Start the Genkit AI Flows:**

In your second terminal, run the following command to start the Genkit development UI, which allows you to inspect and test your AI flows:

```bash
npm run genkit:watch
```

This will start the Genkit UI, usually on `http://localhost:4000`.

Once both servers are running, you can open your browser to `http://localhost:9002` to use the LinguaGenius application.
