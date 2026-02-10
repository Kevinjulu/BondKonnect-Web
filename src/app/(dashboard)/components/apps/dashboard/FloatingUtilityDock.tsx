"use client";

import React, { useState, useEffect } from "react";
import { BondCalc } from "../dashboard/BondCalc";
import { ChatWindow } from "../ai/ChatWindow";
import { Calculator, Sparkles, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function FloatingUtilityDock() {
  const [showHint, setShowHint] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);

  useEffect(() => {
    // Show hint after a short delay
    const showTimer = setTimeout(() => setShowHint(true), 1500);
    // Hide hint after 6 seconds
    const hideTimer = setTimeout(() => setShowHint(false), 7500);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-3">
      
      {/* AI Chat Window Popover */}
      {isAiOpen && (
        <div className="mb-2">
          <ChatWindow onClose={() => setIsAiOpen(false)} />
        </div>
      )}

      {/* The Dock */}
      <div className="flex flex-col gap-3 bg-black/5 p-1.5 rounded-full border border-black/5 backdrop-blur-md shadow-2xl">
        <TooltipProvider delayDuration={0}>
          {/* AI Toggle Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon" 
                onClick={() => setIsAiOpen(!isAiOpen)}
                className={cn(
                  "h-14 w-14 rounded-full transition-all duration-300 border-2 border-white/10 group relative",
                  isAiOpen 
                    ? "bg-white text-black hover:bg-neutral-100" 
                    : "bg-black text-white hover:bg-neutral-800 hover:scale-110"
                )}
              >
                {isAiOpen ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6 group-hover:rotate-12 transition-transform" />}
                {!isAiOpen && showHint && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-black"></span>
                  </span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-black text-white border-none font-bold text-[10px] uppercase tracking-widest px-4 py-2 mb-2">
              {isAiOpen ? "Close Assistant" : "Ask BondKonnect AI"}
            </TooltipContent>
          </Tooltip>

          {/* Calculator Trigger */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="transition-all duration-500">
                <BondCalc 
                  trigger={
                    <Button 
                      size="icon" 
                      className="h-14 w-14 rounded-full bg-black text-white shadow-2xl hover:bg-neutral-800 hover:scale-110 transition-all duration-300 border-2 border-white/10 group"
                    >
                      <Calculator className="h-6 w-6 group-hover:-rotate-12 transition-transform" />
                    </Button>
                  } 
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-black text-white border-none font-bold text-[10px] uppercase tracking-widest px-4 py-2 mb-2">
              Bond Calculator
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Discovery Hint Label */}
      <div 
        className={cn(
          "bg-black text-white px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl border border-white/10 transition-all duration-700 ease-in-out transform origin-right whitespace-nowrap mr-2",
          showHint && !isAiOpen
            ? "opacity-100 translate-x-0 scale-100" 
            : "opacity-0 translate-x-8 scale-90 pointer-events-none"
        )}
      >
        Market Assistant Ready
      </div>
    </div>
  );
}
