// @/app/page.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "@ai-sdk/react";
import { useEffect, useRef } from "react";
import type {
  WeatherResult,
  WeatherWear,
  WeatherWearItem,
} from "./api/chat/route";

type ChatReturnType = ReturnType<typeof useChat>;
type Message = ChatReturnType["messages"][number];
type MessagePart = Message["parts"][number];

const WeatherResult = ({ result }: { result: WeatherResult }) => {
  return (
    <div className="rounded-lg bg-slate-100 p-4 my-2">
      <h3 className="font-medium mb-2">Weather Information</h3>
      <p>Location: {result.location}</p>
      <p>Temperature: {result.temperature}°F</p>
    </div>
  );
};

const WeatherWear = ({
  result,
}: {
  result: { suggestions: WeatherWearItem[] };
}) => {
  return (
    <div className="rounded-lg bg-blue-200 p-4 my-2">
      <h3 className="font-medium mb-2">Equipment</h3>
      {result.suggestions.map((item, index) => (
        <div key={index} className="mb-2 last:mb-0">
          <p className="font-bold">{item.title}</p>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
};

const MessagePart = ({ part }: { part: MessagePart }) => {
  if (!part) return null;

  if (part.type === "tool-invocation") {
    const { toolInvocation } = part;

    if (
      toolInvocation.toolName === "weather" &&
      toolInvocation.state === "result"
    ) {
      return (
        <div className="border-l-2 border-blue-200 pl-4 my-2">
          <p className="text-sm text-slate-500">Weather Check</p>
          <WeatherResult result={toolInvocation.result} />
        </div>
      );
    }

    if (
      toolInvocation.toolName === "whatToWear" &&
      toolInvocation.state === "result"
    ) {
      return (
        <div className="border-l-2 border-blue-200 pl-4 my-2">
          <p className="text-sm text-slate-500">Weather Wear</p>
          <WeatherWear result={toolInvocation.result} />
        </div>
      );
    }
    return null;
  }

  if (part.type === "text") {
    return <div>{part.text}</div>;
  }

  return null;
};

export default function Home() {
  const { messages, input, status, handleInputChange, handleSubmit } =
    useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Scroll when messages change

  return (
    <div className="flex flex-col relative w-full max-w-md py-24 mx-auto stretch gap-6 pb-[200px]">
      {messages.length === 0 && (
        <div className="text-center text-slate-500 serif">
          The intergalactic weather assistant is here to help you with the
          weather and what to wear. Try asking it about the weather in any place
          in the galaxy or what to wear based on the weather. 🪐
        </div>
      )}
      {messages.map((m) => (
        <div key={m.id} className="flex flex-col gap-2 animate-in">
          {m.role === "user" ? (
            <div className="flex gap-2">
              <Avatar>
                <AvatarImage src="https://mighty.tools/mockmind-api/content/human/80.jpg" />
                <AvatarFallback>Me</AvatarFallback>
              </Avatar>
              <div>{m.content}</div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Avatar>
                <AvatarImage src="https://mighty.tools/mockmind-api/content/abstract/50.jpg" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                {m.parts?.map((part, index) => (
                  <MessagePart key={index} part={part} />
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      <div ref={messagesEndRef} />
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 z-10 right-0 mb-8 w-full flex items-center justify-center"
      >
        <div className="relative w-[480px]">
          <Textarea
            className="dark:bg-zinc-900 bg-white/50 backdrop-blur-xl rounded-xl w-full pb-[60px] border border-zinc-300 dark:border-zinc-800 shadow-xl"
            value={input}
            rows={3}
            placeholder="Say something..."
            onChange={handleInputChange}
          />
          <Button
            type="submit"
            disabled={status === "streaming"}
            size="sm"
            className="absolute bottom-2 right-2"
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}
