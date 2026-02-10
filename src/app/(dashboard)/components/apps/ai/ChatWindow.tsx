"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, X, Sparkles, Loader2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { getCurrentUserDetails } from "@/lib/actions/user.check";

interface Message {
  role: "assistant" | "user";
  content: string;
}

interface ChatWindowProps {
  onClose: () => void;
}

export function ChatWindow({ onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your BondKonnect AI. How can I assist you with the Kenyan bond market today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // Get current page context and user details
      const pageName = pathname.split('/').pop() || 'Dashboard';
      const user = await getCurrentUserDetails();
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BK_DEV_API_URL || 'http://localhost:8000/api'}/V1/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          prompt: userMessage,
          user_email: user?.email,
          context: {
            page: pageName
          }
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.data }]);
      } else {
        setMessages((prev) => [
          ...prev, 
          { role: "assistant", content: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later." }
        ]);
      }
    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prev) => [
        ...prev, 
        { role: "assistant", content: "Connection error. Please check if the API is running." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-[350px] bg-white border-2 border-black/5 rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
      {/* Header */}
      <div className="bg-black p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-white text-[10px] font-black uppercase tracking-widest">BondKonnect AI</h3>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-white/50 text-[8px] font-bold uppercase tracking-tight">Active Terminal</span>
            </div>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="text-white/50 hover:text-white hover:bg-white/10 h-8 w-8 rounded-full"
        >
          <Minimize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={cn(
                "flex flex-col max-w-[85%]",
                msg.role === "user" ? "ml-auto items-end" : "items-start"
              )}
            >
              <div 
                className={cn(
                  "p-3 rounded-2xl text-xs leading-relaxed",
                  msg.role === "user" 
                    ? "bg-black text-white rounded-tr-none font-medium" 
                    : "bg-neutral-100 text-black rounded-tl-none font-medium"
                )}
              >
                {msg.content}
              </div>
              <span className="text-[8px] font-bold text-neutral-400 uppercase mt-1 px-1">
                {msg.role === "assistant" ? "AI Node" : "User"}
              </span>
            </div>
          ))}
          {isLoading && (
            <div className="flex flex-col items-start max-w-[85%] animate-pulse">
              <div className="bg-neutral-100 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin text-neutral-400" />
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Processing...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 bg-white border-t border-neutral-100">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="relative flex items-center gap-2"
        >
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Kenyan Bonds..."
            className="h-12 rounded-2xl border-neutral-200 focus:border-black text-xs font-medium pr-12 shadow-inner"
          />
          <Button 
            type="submit" 
            size="icon"
            aria-label="Send message"
            disabled={!input.trim() || isLoading}
            className="absolute right-1.5 h-9 w-9 rounded-xl bg-black text-white hover:bg-neutral-800 transition-all active:scale-95 disabled:opacity-30"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
