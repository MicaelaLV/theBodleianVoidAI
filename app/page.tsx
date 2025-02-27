// @/app/page.tsx
"use client";

import Typing from "@/components/ui/typed";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RainbowButton } from "@/components/ui/rainbow-button"
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, ArrowUpRight } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useCallback } from "react";
import type { BookResult } from "./api/chat/route";

type ChatReturnType = ReturnType<typeof useChat>;
type Message = ChatReturnType["messages"][number];
type MessagePart = Message["parts"][number];

const BookResult = ({ result }: { result: BookResult }) => {
  return (
    <div className="rounded-lg bg-violet-950 p-4 my-2">
      <img src={result.coverImage} alt="book cover image" />
      <p>Name: {result.name}</p>
      <p>Author: {result.author}</p>
      <p>Description: {result.description}</p>
    </div>
  );
};

const MessagePart = ({ part }: { part: MessagePart }) => {
  if (!part) return null;


  if (part.type === "tool-invocation") {
    // debugger;
    console.log('we\'re in ', part, part.toolInvocation);
    const { toolInvocation } = part;

    if (
      toolInvocation.toolName === "book" &&
      toolInvocation.state === "result"
    ) {
      return (
        <div className="border-l-2 border-violet-400 pl-4 my-2">
          <p className="text-sm text-slate-400">The Singularity Choice</p>
          <BookResult result={toolInvocation.result} />
        </div>
      );
    }

    if (
      toolInvocation.toolName === "bookQuiz" &&
      toolInvocation.state === "result"
    ) {
      return (
        <div className="border border-white pl-4 my-2">
          <p className="text-sm text-slate-400">The Void Quiz Choice</p>
          <BookResult result={toolInvocation.result} />
        </div>
      );
    }
    return null;
  }


  if (part.type === "text") {
    console.log('RESULT IS', part.text);

    let jsonArr = [];

    if (part.text) {
      const index = part.text.indexOf('`');
      const title = index !== -1 ? part.text.substring(0, index).trim() : part.text;

      if (part.text.includes('```json')) {
        let result = part.text.substring(part.text.indexOf('{'));
        result = result.replaceAll('`', '');
        // console.log(result);
        const jsonResult = JSON.parse(result);
        jsonArr = jsonResult.quiz;
        // console.log('JSONARR ', jsonArr);
      }
      // console.log('we\'re in text', part, part.text);
      return <div className="text-left">
        <p className="text-white text-base serif pl-4">{title}</p>
        {jsonArr.map((item: any) => (
          <div className="p-4 my-4 min-h-[80px] w-full rounded-lg border border-muted bg-background text-sm text-foreground shadow-sm shadow-black/5 transition-shadow placeholder:text-muted-foreground/70">
            <p className="text-base text-slate-300">{item.question}</p>
            {item.options.map((option: any) => (
              <div className="ml-2 mt-1 flex">
                <p className="text-base text-slate-400">{option}</p>
              </div>
            ))}
          </div>
        ))}
        {/* {part.text} */}
      </div>;
    }

  }
  return null;
};

export default function Home() {
  const { messages, input, status, handleInputChange, handleSubmit, setMessages } =
    useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleReset = useCallback(() => {
    setMessages([]);
  }, [setMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Scroll when messages change

  return (
    <div className="flex flex-col relative w-full max-w-md py-24 mx-auto stretch gap-6 pb-[200px]">
      <div className="flex w-full flex justify-center">
        <Button
          size="lg"
          variant={"ghost"}
          className="serif font-medium text-3xl text-center mt-4 p-4"
          onClick={handleReset}
        >
          the Bodleian
        </Button>
      </div>
      {messages.length === 0 && (
        <div className="inner serif text-center p-16">
          <p>Ah, a brave soul!</p>
          <p className="mt-2">You've entered the void searching for your next great read...are you?</p>
          <p className="mt-2">I am the keeper of forgotten stories, the curator of literary chaos, the black hole librarian.</p>
          <p className="mt-2">I know what you seek, and this singularity is ready to deliver… if you dare...</p>
        </div>
      )}
      {messages.length > 0 && (
        <div>
          {messages.map((m) => (
            <div key={m.id} className="flex flex-col items-end gap-2 animate-in mt-4 width-full">
              {m.role === "user" ? (
                <div className="sans-serif flex gap-2 items-start flex-row-reverse max-w-[224] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm shadow-black/5 transition-shadow">
                  <p className="text-end text-base">{m.content}</p>
                </div>
              ) : (
                <div className="flex gap-2 p-2 mt-2 mb-2 w-full items-start">
                  {status === "streaming" && (
                    <div className="flex items-center space-x-4 width-full items-start">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  )}
                  {status === "ready" && (
                    <div className="flex">
                      <Avatar>
                        <AvatarImage src="bodleian.png" />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 align-start">
                        {m.parts?.map((part, index) => (
                          <MessagePart key={index} part={part} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div ref={messagesEndRef} />

      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 z-10 right-0 mb-8 w-full flex items-center justify-center"
      >
        <div className="relative w-[456px]">
          {messages.length === 0 && (
            <div className="flex flex-col items-center w-full">
              <RainbowButton onClick={() => {
                const event = {
                  target: {
                    value: 'Quiz me',
                  },
                } as React.ChangeEvent<HTMLTextAreaElement>;
                handleInputChange(event);
              }}>
                Answer the Void
                <ArrowUpRight className="w-3.5 h-3.5 text-white/90 ml-2" />
              </RainbowButton>

              <RainbowButton
                className="mt-8 mb-72"
                onClick={() => {
                  const event = {
                    target: {
                      value: 'Give me a book',
                    },
                  } as React.ChangeEvent<HTMLTextAreaElement>;
                  handleInputChange(event);
                }}>
                <Sparkles className="w-3.5 h-3.5 text-white/90 mr-2" />
                Tempt the Singularity
              </RainbowButton>
            </div>
          )}
          {messages.length > 0 && (
            <div className="relative w-full mt-8">
              <Textarea
                className=" min-h-[none] sans-serif text-base"
                value={input}
                rows={3}
                placeholder="Ask or Answer away..."
                onChange={handleInputChange}
              />
              <Button
                type="submit"
                disabled={status === "streaming"}
                size="sm"
                variant="outline"
                className="absolute bottom-2 right-2"
              >
                Send
              </Button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
