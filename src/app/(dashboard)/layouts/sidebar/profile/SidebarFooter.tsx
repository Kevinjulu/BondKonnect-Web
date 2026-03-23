'use client'
import { Calendar, Home, Inbox, Search, Settings,ChevronDown,ChevronUp,User2, } from "lucide-react"
import { Sidebar,SidebarHeader,SidebarFooter, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import { FaAudible } from "react-icons/fa";
import { TbSquareLetterB } from "react-icons/tb";
import { logout } from "@/lib/actions/api.actions";
import { AuthService } from "@/lib/auth-service";
import { useRouter } from "next/navigation";
// Menu items.

export function Footer({ userDetails }: { userDetails: UserData }) {
   const router = useRouter();
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const role = userDetails?.roles?.find((role) => role.is_active)?.role_name;

    const handleClick = async () => {
      // Use AuthService to get the token
      const token = await AuthService.getToken();
  
      try {
        // Use AuthService to clear all session data securely
        AuthService.clearAll();

        if (token) {
          // Proceed with server-side logout if token was present
          const logoutResult = await logout(`k-o-t=${token}`);
          if (!logoutResult.success) {
            console.error("Logout failed", logoutResult.message);
          }
        }
        
        // Always redirect to login
        router.push("/auth/login");
      } catch (error) {
        console.error("Logout failed", error);
        router.push("/auth/login");
      }
    };


  return (

      <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> {role ? capitalizeFirstLetter(role) : "Loading..."} 
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem>
                  <a href="/apps/account" className="cursor-pointer">
                    <span>Profile Settings</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                  <a href="/apps/pricing" className="cursor-pointer">
                    <span>Upgrade Account</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleClick}>
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
 
  )
}
