'use client'

import React, { useEffect, useState } from 'react';
import { useTheme } from "next-themes";
import LogoImage from "@/components/ui/LogoImage";

export default function Loading() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc = mounted && resolvedTheme === "dark" 
    ? "/images/logos/logo-dark.svg" 
    : "/images/logos/logo.png";

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen bg-background animate-in fade-in duration-500">
      <div className="relative mb-12">
        {/* Logo Container */}
        <div className="relative animate-pulse">
          <LogoImage
            src={logoSrc}
            alt="BondKonnect"
            width={240}
            height={80}
            className="h-20 w-auto object-contain"
          />
        </div>
      </div>
      
      {/* Sophisticated Loading Status */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-1">
          <div className="h-1 w-8 bg-black rounded-full animate-[loading_1.5s_ease-in-out_infinite]" />
          <div className="h-1 w-8 bg-neutral-100 rounded-full animate-[loading_1.5s_ease-in-out_0.2s_infinite]" />
          <div className="h-1 w-8 bg-neutral-100 rounded-full animate-[loading_1.5s_ease-in-out_0.4s_infinite]" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">
          Initializing Terminal
        </span>
      </div>

      <style jsx>{`
        @keyframes loading {
          0%, 100% { transform: scaleX(1); background-color: #f5f5f5; }
          50% { transform: scaleX(1.5); background-color: #000000; }
        }
      `}</style>
    </div>
  );
}
