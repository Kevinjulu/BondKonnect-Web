"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { SidebarProvider, SidebarTrigger } from "@/app/components/ui/sidebar"
import { Search } from "./Search";
import { Profile } from "./Profile";
import { Messages } from "./Messages";
import { Notifications } from "./Notifications";
import  ModeToggle  from "./ModeToggle";
import { getCurrentUserDetails } from "@/app/lib/actions/user.check";
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
    <header className="sticky top-0 z-10 bg-background">
      <div className="w-full flex h-14 items-center px-4 border-b justify-between">
        {/* Left side */}
        <div className="">
          <SidebarTrigger />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <Search  userDetails={userDetails}/>
          <ModeToggle/>
          <Messages  userDetails={userDetails}/>
          <Notifications  userDetails={userDetails}/>
          <Profile userDetails={userDetails}/>
        </div>
      </div>
    </header>
  );
}
