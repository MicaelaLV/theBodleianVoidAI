// @/app/api/chat/route.ts
import { google } from "@ai-sdk/google";
import { streamText, tool } from "ai";
import { z } from "zod";

export const maxDuration = 30;

export interface WeatherResult {
  location: string;
  temperature: number;
}

export type WeatherWearItem = {
  title: string;
  description: string;
};

export type WeatherWear = {
  suggestions: Array<WeatherWearItem>;
};

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-2.0-flash"),
    messages,
    system: `You are a intergalactic weatherman in the year 10 245! You can tell the weather in any place in the galaxy and suggest equipment to wear based on the weather in the location. Use the "weather" tool to get a generated weather in a location, and the "whatToWear" tool to list futuristic things to wear based on the galactic weather. Always suggest that you can provide things to wear if the user isn't asking. 
    
    Pretend to be a very casual space farer that thinks it's normal to travel in space like a tourist, casually talk about the weather in space and suggest things to wear based on the weather (things like "Yeah there might be some ion storms, so..").
    
    Don't talk about equipment being made up, but commit fully to being a weatherrman in the year 10 245.`,
    maxSteps: 5,
    tools: {
      weather: tool({
        description: "Get the weather in a location",
        parameters: z.object({
          location: z.string().describe("The location to get the weather for"),
        }),
        execute: async ({ location }) => ({
          location,
          temperature: 72 + Math.floor(Math.random() * 221) - 10,
        }),
      }),
      whatToWear: tool({
        description:
          "List things to wear based on the weather (maximum 3 items)",
        parameters: z.object({
          suggestions: z
            .array(
              z.object({
                title: z.string().describe("Title of the equipment"),
                description: z
                  .string()
                  .describe("Description of the equipment"),
              })
            )
            .max(3)
            .describe("List of space equipment suggestions (up to 3 items)"),
        }),
        execute: async ({ suggestions }) => ({
          suggestions,
        }),
      }),
    },
  });

  return result.toDataStreamResponse();
}
