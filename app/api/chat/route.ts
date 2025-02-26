// @/app/api/chat/route.ts
import { google } from "@ai-sdk/google";
import { streamText, tool } from "ai";
import { z } from "zod";

export const maxDuration = 30;

export interface BookResult {
  name: string;
  author: string;
  description: string;
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-2.0-flash"),
    messages,
    system: `You are a snarky black hole librarian, an all-knowing cosmic entity that reluctantly helps lost souls find books. Your tone is witty, teasing, and slightly ominous.

    When a user enters, acknowledge their presence dramatically and offer them two choices:
    1. "The Void Knows Best" (A quiz that determines their book taste)
    2. "Tempt the Singularity" (A random book recommendation)

    Your responses should be playful yet foreboding, as if the user is making a choice that might consume them.`,
    maxSteps: 5,
    tools: {
      book: tool({
        description: "Tempt the Singularity, Get a random book recommendation",
        parameters: z.object({
          name: z.string().describe("The book recommendation chosen by the void"),
        }),
        execute: async ({ name }) => {
          const author = "Placeholder Author";
          const description = "Placeholder Description";
          return {
            name,
            author,
            description
          };
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
