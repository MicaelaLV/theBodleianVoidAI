/** @jsxImportSource react */
// @/app/page.tsx
"use client";

import Typing from "@/components/ui/typed";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BlurIn } from "@/components/ui/blur-in";
import { Button } from "@/components/ui/button";
import { GlowEffect } from '@/components/ui/glow-effect';
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Textarea as BodleianTextarea } from "@/components/ui/textarea";
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpRight, Eraser, Sparkles } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useCallback, useState } from "react";
import type { BookResult } from "./api/chat/route";

type ChatReturnType = ReturnType<typeof useChat>;
type Message = ChatReturnType["messages"][number];
type MessagePart = Message["parts"][number];

const BookResult = ({ result }: { result: BookResult }) => {
  return (
    <div className="">
      <div className='relative h-full w-full mt-6 mb-4'>
        <GlowEffect
          colors={['#0894FF', '#C959DD', '#FF2E54', '#FF9004']}
          mode='static'
          blur='medium'
        />
        <div className='relative h-full w-full rounded-lg bg-black p-4 text-white dark:bg-card dark:text-white flex flex-col'>
          <img src={result.coverImage} alt="book cover image" className="rounded-sm" />
        </div>
      </div>
      <div className="ml-2 mt-2">
        <p className="text-lg mt-2">{result.name}</p>
        <p className="text-base mt-1">
          <span className="text-slate-400 mr-1">By</span>
          {result.author}
        </p>
        {/* <p className="mt-2">{result.description}</p> */}
      </div>
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
        <div className="ml-4 mt-2 flex flex-col items-start">
          <p className="text-2xl serif text-center gradient">The Singularity's Random Pick</p>
          <div className="flex flex-col items-center w-full mt-2 mb-8">
            <BookResult result={toolInvocation.result} />
          </div>
        </div>
      );
    }

    if (
      toolInvocation.toolName === "bookQuiz" &&
      toolInvocation.state === "result"
    ) {
      return (
        <div className="pl-4 my-2 mt-6 mb-6 flex flex-col items-center">
          <p className="text-xl mt-1 serif text-center gradient">The Bodleian's Choice</p>
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
        <p className="text-white text-lg serif pl-4">{title}</p>
        {jsonArr.map((item: any) => (
          <div className="p-4 my-4 min-h-[80px] w-full rounded-lg border border-rainbow-4/20 bg-rainbow-4/10 text-sm text-foreground shadow-sm shadow-black/5 transition-shadow placeholder:text-muted-foreground/70">
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

  const [showButtons, setShowButtons] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);

  const scrollToBottom = () => {
    console.log('scrolling to bottom NOW');
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleReset = useCallback(() => {
    setMessages([]);
  }, [setMessages]);

  useEffect(() => {
    console.log('messages changed', messages);
    scrollToBottom();
  }, [messages]); // Scroll when messages change

  useEffect(() => {
    const timer = setTimeout(() => {
      setTypingComplete(true);
      setShowButtons(true);
    }, 3000); // Adjust the duration to match your typing animation

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typingComplete) {
      const timer = setTimeout(() => {
        setShowForm(true);
      }, 1000); // Delay before showing the form

      return () => clearTimeout(timer);
    }
  }, [typingComplete]);

  return (
    <div className="border border-pink-300 flex flex-col relative justify-center w-full max-w-xl py-12 mx-auto h-screen stretch gap-6">
      {messages.length === 0 && (
        <div>
          <div className="flex w-full flex justify-center">
            <Typing
              className="text-5xl serif text-white mb-4"
              copy={[['the Bodleian']]}
            />
          </div>
          {showButtons && (
            <div className="inner text-center pt-4 pl-8 pr-8 lg:pl-16 lg:pr-16 text-lg">
              <BlurIn
                word="Ah, a brave soul!"
                className="serif text-lg"
              />
              <BlurIn
                word="You've entered the void searching for your next great read...are you?"
                className="serif text-lg"
              />
              <BlurIn
                word="I am the keeper of forgotten stories, the curator of literary chaos, the black hole librarian."
                className="serif text-lg"
              />
              <BlurIn
                word="I know what you seek, and this singularity is ready to deliver… if you dare..."
                className="serif text-lg"
              />
              <form
                onSubmit={handleSubmit}
                className="mt-8"
              >
                <div className="flex flex-col items-center w-full mt-4">
                  <RainbowButton onClick={() => {
                    const event = {
                      target: {
                        value: 'Oh, Bodleian void, could you please serve me with a quiz?',
                      },
                    } as React.ChangeEvent<HTMLTextAreaElement>;
                    handleInputChange(event as React.ChangeEvent<HTMLTextAreaElement>);
                  }}
                  >
                    Answer the Void
                    <ArrowUpRight className="w-3.5 h-3.5 text-white/90 ml-2" />
                  </RainbowButton>
                </div>
                <div className="flex flex-col items-center w-full mt-6">
                  <RainbowButton
                    onClick={() => {
                      const event = {
                        target: {
                          value: 'Oh, powerful singularity could you please select a book for me in your Void?',
                        },
                      } as React.ChangeEvent<HTMLTextAreaElement>;
                      handleInputChange(event as React.ChangeEvent<HTMLTextAreaElement>);
                    }}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-white/90 mr-2" />
                    Tempt the Singularity
                  </RainbowButton>
                </div>
              </form>
            </div>

          )}
        </div>
      )}
      {messages.length > 0 && (
        <div className="mb-10 border border-white">
          <div className="flex w-full flex justify-between align-center">
            <Typing
              className="text-4xl serif text-white animate-in"
              copy={[['the Bodleian']]} />
            <RainbowButton
              className="font-medium text-base text-left justify-start"
              onClick={handleReset}
            >
              <Eraser className="w-3.5 h-3.5 text-white/90 mr-2" />
              Clean Slate
            </RainbowButton>
          </div>
          {messages.map((m) => (
            <div key={m.id} className="flex flex-col items-end gap-2 animate-in mt-12 width-full">
              {m.role === "user" ? (
                <div className="sans-serif flex gap-2 items-start flex-row-reverse max-w-[400] w-full rounded-lg border border-ring/60 bg-ring/20 px-3 py-2 text-sm text-foreground shadow-sm shadow-black/5 transition-shadow">
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
                          <MessagePart part={part} key={index} />
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

      {showForm && (
        <form
          key="chat-form"
          onSubmit={handleSubmit}
          className="fixed bottom-0 z-10 right-0 mb-8 w-full flex items-center justify-center"
        >
          <div className="relative w-[600px]">
            {messages.length > 0 && (
              <div className="relative w-full mt-8">
                <BodleianTextarea
                  key="chat-textarea"
                  className=" min-h-[none] sans-serif text-base"
                  value={input}
                  rows={3}
                  placeholder="Ask or Answer away..."
                  onChange={handleInputChange}
                />
                <Button
                  type="submit"
                  disabled={status === "streaming"}
                  size="default"
                  variant="outline"
                  className="absolute bottom-2 right-2 ml-4"
                >
                  Send
                </Button>
              </div>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
