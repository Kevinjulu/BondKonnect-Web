// import { Calendar, Home, Inbox, Search, Settings,ChevronDown,ChevronUp,User2, } from "lucide-react"
// import { Sidebar,SidebarHeader,SidebarFooter, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,} from "@/app/components/ui/sidebar"
import { SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,} from "@/app/components/ui/sidebar"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,} from "@/app/components/ui/dropdown-menu"
// import Logo from "../../shared/logo/Logo";
// import { FaAudible } from "react-icons/fa";
// import { TbSquareLetterB } from "react-icons/tb";
import Image from "next/image";

// interface UserData {
//   [key: string]: unknown;
// }

export function Header({ userDetails }: { userDetails: UserData }) {
  
  return (
   
  <SidebarHeader>
    <SidebarMenu>
      <SidebarMenuItem>
          <SidebarMenuButton>
            {/* <TbSquareLetterB className="" /> */}
              {/* BondKonnect */}
           
              <Image
                src="/images/logos/logo.png"
                alt="BondKonnect Logo"
                className="h-6"
                width={120}
                height={24}
              />

              {/* <ChevronDown className="ml-auto" /> */}
            </SidebarMenuButton>
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton>
            <TbSquareLetterB className="" />
              BondKonnect
              <ChevronDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
            <DropdownMenuItem>
              <span>Acme Inc</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Acme Corp.</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarHeader>


  )
}
