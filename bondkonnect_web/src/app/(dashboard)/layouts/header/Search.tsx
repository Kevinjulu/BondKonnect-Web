"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";

export function Search({ userDetails }: { userDetails: UserData }) {
  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <SearchIcon className="h-3 w-3 text-white/50 group-focus-within:text-white transition-colors" />
      </div>
      <Input
        type="search"
        placeholder="SEARCH TERMINAL..."
        className="h-9 w-[120px] md:w-[200px] lg:w-[350px] pl-9 bg-white/5 border border-white/20 hover:border-white/40 text-white rounded-none font-bold text-[10px] uppercase tracking-widest placeholder:text-white/30 focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-offset-0 transition-all"
      />
    </div>
  )
}
