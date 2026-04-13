// import { Calendar, Home, Inbox, Search, Settings,ChevronDown,ChevronUp,User2, } from "lucide-react"
// import { Sidebar,SidebarHeader,SidebarFooter, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,} from "@/components/ui/sidebar"
import { SidebarHeader, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import LogoImage from "@/components/ui/LogoImage";
import { useLogoSrc } from "@/hooks/use-logo-src";

export function Header({ userDetails }: { userDetails: UserData }) {
  const logoSrc = useLogoSrc('sidebar');

  return (

  <SidebarHeader className="p-0 bg-transparent">
    <SidebarMenu>
      <SidebarMenuItem>
          <div className="flex items-center justify-start py-6 px-6">
            <LogoImage
              src={logoSrc}
              alt="BondKonnect Logo"
              className="h-16 w-auto object-contain transition-all duration-500 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:mx-auto"
              width={200}
              height={64}
            />
          </div>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarHeader>
  )
}
