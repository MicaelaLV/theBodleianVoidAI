// @/app/api/chat/route.ts
import { google } from "@ai-sdk/google";
import { streamText, tool } from "ai";
import { z } from "zod";
import fetch from "node-fetch"; // If using Next.js backend, use fetch

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes?q=";

export const maxDuration = 30;

export interface BookResult {
  coverImage: string;
  name: string;
  author: string;
  description: string;
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-2.0-flash"),
    messages,
    system: `You are a snarky black hole librarian, an all-knowing cosmic entity that helps lost souls find books. Your tone is witty, teasing, and slightly ominous.

    Use the "book" tool to get a generated random book recommendation. Use the "bookQuiz" tool to ask the user five questions on their reading preferences and give them examples of answers options and then generate a book recommendation based on their answers. Provide the bookquiz as a JSON.
    Your responses should:
    - Provide the book name, author, cover image and short description.
    - Give a one-line teaser about why it matches the user's choices.
    - End with a playful, foreboding remark about their fate in the void.

    Do **not** return placeholder values. Always generate a real book.`,
    maxSteps: 5,
    tools: {
      book: tool({
        description: "Get a book recommendation based on the void\’s wisdom",
        parameters: z.object({
          query: z.string().describe("Book genre, mood, or theme"),
        }),
        execute: async ({ query }) => {
          const response = await fetch(
            `${GOOGLE_BOOKS_API}${encodeURIComponent(query)}`
          );
          const data = await response.json();

          if (!data.items || data.items.length === 0) {
            return {
              name: "No book found",
              author: "The void is empty",
              description: "Even the abyss has limits.",
              coverImage: "https://example.com/default-cover.jpg", // Fallback image
            };
          }

          const bookVolumeInfo = data.items[0].volumeInfo;

          if (!bookVolumeInfo) {
            return {
              name: "No book found",
              author: "The void is empty",
              description: "Even the abyss has limits.",
              coverImage:
                "https://www.datocms-assets.com/20071/1578473071-cover.png?auto=format", // Fallback image
            };
          }

          const { title, authors, description, imageLinks } = bookVolumeInfo;

          const book: BookResult = {
            name: title,
            author: authors ? authors.join(", ") : "Unknown",
            description: description || "No description available",
            coverImage:
              imageLinks?.thumbnail ||
              "https://www.datocms-assets.com/20071/1578473071-cover.png?auto=format",
          };

          return book;
        },
      }),
      bookQuiz: tool({
        description: "Get a book recommendation based on the void\’s wisdom after a five-question quiz",
        parameters: z.object({
          genre: z.string().describe("Preferred book genre"),
          mood: z.string().describe("Desired mood or tone of the book"),
          characterType: z.string().describe("Preferred type of protagonist"),
          length: z.string().describe("Preferred book length"),
          theme: z.string().describe("A theme the user enjoys"),
        }),
        execute: async ({ genre, mood, characterType, length, theme }) => {
          const query = `${genre} ${mood} ${characterType} ${length} ${theme}`;
          const response = await fetch(`${GOOGLE_BOOKS_API}${encodeURIComponent(query)}`);
          const data = await response.json();

          if (!data.items || data.items.length === 0) {
            return {
              name: "No book found",
              author: "The void is empty",
              description: "Even the abyss has limits.",
              coverImage: "https://example.com/default-cover.jpg" // Fallback image
            };
          }

          const book = data.items[0].volumeInfo;
          return {
            name: book.title,
            author: book.authors ? book.authors.join(", ") : "Unknown",
            description: book.description || "No description available",
            coverImage: book.imageLinks?.thumbnail || "https://example.com/default-cover.jpg",
          };
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}