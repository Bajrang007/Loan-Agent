"use client";

import { MessageCircle, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState, useRef } from 'react';
import { chatWithAgent, Message } from '@/app/actions';
import { cn } from '@/lib/utils';

export function ChatbotFab() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: 'Hello! I am TIA, your loan assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithAgent(messages, input);
      const botMessage: Message = { role: 'model', content: response.text };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isClient && (
        <>
          <Button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 h-16 w-16 flex-col items-center justify-center space-y-1 rounded-full bg-primary shadow-lg hover:bg-primary/90 z-50"
            aria-label="Open Chatbot TIA"
          >
            <MessageCircle className="h-7 w-7 text-primary-foreground" />
            <span className="text-xs font-bold text-primary-foreground">TIA</span>
          </Button>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[400px] p-0 gap-0 overflow-hidden">
              <DialogHeader className="p-4 bg-primary text-primary-foreground">
                <DialogTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Chat with TIA
                </DialogTitle>
                <DialogDescription className="text-primary-foreground/80">
                  Your AI Loan Assistant
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col h-[500px]">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex w-full",
                          msg.role === 'user' ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[80%] rounded-lg px-4 py-2 text-sm",
                            msg.role === 'user'
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground"
                          )}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg px-4 py-2 text-sm text-muted-foreground animate-pulse">
                          TIA is typing...
                        </div>
                      </div>
                    )}
                    <div ref={scrollRef} />
                  </div>
                </ScrollArea>

                <div className="p-4 border-t bg-background">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Send</span>
                    </Button>
                  </form>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
}
