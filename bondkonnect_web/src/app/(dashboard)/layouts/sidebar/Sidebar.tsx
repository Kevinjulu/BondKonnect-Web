"use client";
import { Calendar, Home, Inbox, Search, Settings,ChevronDown,ChevronUp,User2,Plus } from "lucide-react"
import { Sidebar,SidebarHeader,SidebarFooter,SidebarGroupAction, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import { usePathname, useRouter } from "next/navigation";
import { AppState } from '@/store/store'
import { useDispatch, useSelector } from '@/store/hooks';
import { setUserRole, clearUserRole } from '@/store/apps/auth/AuthSlice';
import Logo from "../shared/logo/Logo";
import { FaAudible } from "react-icons/fa";
import { TbSquareLetterB } from "react-icons/tb";
import { Header } from "./profile/SidebarHeader";
import { Footer } from "./profile/SidebarFooter";
import { ScrollArea,ScrollBar  } from "@/components/ui/scroll-area"
import Menuitems from "./MenuItems";
import { Items } from "./profile/SidebarItems";
import { getCurrentUserDetails } from "@/lib/actions/user.check";
import { useState, useEffect } from "react";

interface AppSidebarProps {
  userDetails: UserData;
}

export function AppSidebar({ userDetails }: AppSidebarProps) {
  // Remove redundant API call since Layout already provides user data
  
  // Find the active role instead of using the first role
  const role = userDetails?.roles?.find((role) => role.is_active)?.role_name;

  console.log("Current user role:", userDetails?.roles);

  // Modified loading condition to be more specific
  const isLoading = !userDetails?.roles || userDetails.roles.length === 0;

  // Debug log to check role data
  console.debug("Current user:", userDetails);
  console.debug("Active role:", role);

  if (isLoading) {
    return null; // or return a loading spinner
  }

  return (
    <Sidebar collapsible="icon">
      <Header userDetails={userDetails}/>
      <ScrollArea className="whitespace-nowrap rounded-md ">   
        <Items  userDetails={userDetails}/> 
   
      </ScrollArea>
     <Footer userDetails={userDetails}/>
    </Sidebar>
  )
}
