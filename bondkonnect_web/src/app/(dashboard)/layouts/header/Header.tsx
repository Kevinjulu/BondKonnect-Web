"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Search } from "./Search";
import { Profile } from "./Profile";
import { Messages } from "./Messages";
import { Notifications } from "./Notifications";
import  ModeToggle  from "./ModeToggle";
import { getCurrentUserDetails } from "@/lib/actions/user.check";
import { useRouter } from "next/navigation";

interface HeaderProps {
  userDetails?: UserData | null;
}

export default function Header({ userDetails }: HeaderProps) {
  // Remove redundant API call since Layout already provides user data
  if (!userDetails) {
    return null; // or return a loading spinner
  }
  
  return (
    <header className="sticky top-0 z-10 bg-black text-white border-b border-white/10 shadow-lg">
      <div className="w-full flex h-16 items-center px-6 justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-white hover:bg-white/10 rounded-none transition-colors" />
          <div className="h-6 w-px bg-white/20 hidden md:block mx-2"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hidden lg:block">Market Terminal v1.0</span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 lg:gap-4">
          <Search userDetails={userDetails}/>
          <div className="h-6 w-px bg-white/20 mx-1 lg:mx-2"></div>
          <ModeToggle />
          <Messages userDetails={userDetails}/>
          <Notifications userDetails={userDetails}/>
          <Profile userDetails={userDetails}/>
        </div>
      </div>
    </header>
  );
}
