"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, X, Sparkles, Loader2, Minimize2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { getCurrentUserDetails } from "@/lib/actions/user.check";
import axios from "@/utils/axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

interface Message {
  role: "assistant" | "user";
  content: string;
}

interface ChatWindowProps {
  onClose: () => void;
}

const QUICK_SUGGESTIONS = [
  "How do I pay with M-Pesa?",
  "Tell me about IFB bonds.",
  "Where is my portfolio?",
  "How to calculate YTM?",
];

export function ChatWindow({ onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your **BondKonnect AI Concierge**. I can help you navigate the platform and understand the Kenyan bond market. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  const handleSend = async (customPrompt?: string) => {
    const promptToSend = customPrompt || input.trim();
    if (!promptToSend || isLoading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: promptToSend }]);
    setIsLoading(true);

    try {
      const pageName = pathname.split('/').pop() || 'Dashboard';
      const user = await getCurrentUserDetails();
      
      const response = await axios.post('/V1/ai/chat', {
        prompt: promptToSend,
        user_email: user?.email,
        context: {
          page: pageName
        }
      });

      if (response.data.success) {
        setMessages((prev) => [...prev, { role: "assistant", content: response.data.data }]);
      } else {
        setMessages((prev) => [
          ...prev, 
          { role: "assistant", content: "I'm sorry, I'm having trouble accessing my knowledge base. Please try again later." }
        ]);
      }
    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prev) => [
        ...prev, 
        { role: "assistant", content: "Connection error. Please ensure the BondKonnect API is reachable." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-[400px] bg-white border border-neutral-200 rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-500">
      {/* Header */}
      <div className="bg-black p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/5">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-white text-xs font-black uppercase tracking-[0.2em]">AI Concierge</h3>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-white/40 text-[9px] font-black uppercase tracking-widest">Active Node</span>
            </div>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="text-white/30 hover:text-white hover:bg-white/10 h-10 w-10 rounded-2xl transition-all"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6" ref={scrollRef}>
        <div className="space-y-6">
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={cn(
                "flex flex-col max-w-[90%]",
                msg.role === "user" ? "ml-auto items-end" : "items-start"
              )}
            >
              <div 
                className={cn(
                  "p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm",
                  msg.role === "user" 
                    ? "bg-black text-white rounded-tr-none font-medium" 
                    : "bg-neutral-50 text-black border border-neutral-100 rounded-tl-none font-medium prose prose-sm prose-neutral"
                )}
              >
                {msg.role === "assistant" ? (
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({node, ...props}) => <Link href={props.href || '#'} className="text-black font-black underline decoration-2 underline-offset-4 hover:bg-black hover:text-white transition-all px-1 rounded-sm" {...props} />
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
              <span className="text-[9px] font-black text-neutral-300 uppercase mt-2 tracking-widest px-1">
                {msg.role === "assistant" ? "BK-AI v2.0" : "Terminal User"}
              </span>
            </div>
          ))}
          {isLoading && (
            <div className="flex flex-col items-start max-w-[90%]">
              <div className="bg-neutral-50 border border-neutral-100 p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
                <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] animate-pulse">Syncing Knowledge...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Suggestions */}
      {messages.length === 1 && !isLoading && (
        <div className="px-6 py-2 flex flex-wrap gap-2">
          {QUICK_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSend(suggestion)}
              className="text-[10px] font-black uppercase tracking-widest bg-neutral-50 hover:bg-black hover:text-white border border-neutral-100 px-3 py-2 rounded-xl transition-all active:scale-95"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-6 bg-white border-t border-neutral-50">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="relative flex items-center gap-2"
        >
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search platform features..."
            className="h-14 rounded-2xl border-neutral-100 bg-neutral-50 focus:bg-white focus:border-black text-[13px] font-medium pr-14 shadow-none transition-all"
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 h-10 w-10 rounded-xl bg-black text-white hover:bg-neutral-800 transition-all active:scale-95 disabled:opacity-20"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
        <p className="text-center text-[8px] font-black text-neutral-300 uppercase tracking-[0.3em] mt-4">
          Institutional AI Terminal Node
        </p>
      </div>
    </div>
  );
}
