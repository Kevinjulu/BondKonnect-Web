'use client'
import { Calendar, Home, Inbox, Search, Settings,ChevronDown,ChevronUp,User2, } from "lucide-react"
import { Sidebar,SidebarHeader,SidebarFooter, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import { FaAudible } from "react-icons/fa";
import { TbSquareLetterB } from "react-icons/tb";
import { logout } from "@/lib/actions/api.actions";
import { useRouter } from "next/navigation";
// Menu items.

export function Footer({ userDetails }: { userDetails: UserData }) {
   const router = useRouter();
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const role = userDetails?.roles?.find((role) => role.is_active)?.role_name;
    const getRoleSystemId = (role: string): number => {
      const roleMap: Record<string, number> = {
        admin: 1,
        sponsor: 2,
        relationshipmanager: 3,
        trustee: 4,
      };
      return roleMap[role] || 1;
    };
  
    const clearAllStoredData = () => {
      try {
        // Clear all cookies
        const cookiesToClear = [
          "userRole",
          "roleSystemId",
          "roleDisplayName",
          "rmSponsors",
          "currentSponsor",
          "k-o-t",
          "lastActiveTime",
        ];
  
        cookiesToClear.forEach((cookieName) => {
          document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=${window.location.hostname}`;
        });
  
        // Clear any remaining cookies
        const allCookies = document.cookie.split(";");
        allCookies.forEach((cookie) => {
          const cookieName = cookie.split("=")[0].trim();
          document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=${window.location.hostname}`;
        });
  
        // Clear localStorage
        const keysToRemove = [
          "userRole",
          "roleSystemId",
          "roleDisplayName",
          "lastActiveTime",
          "rmSponsors",
          "currentSponsor",
        ];
  
        keysToRemove.forEach((key) => localStorage.removeItem(key));
        localStorage.clear(); // Clear any remaining items
  
        // Clear IndexedDB
        // const databases = ["britamPortalDB"];
        // databases.forEach(async (dbName) => {
        //   try {
        //     const DBDeleteRequest = window.indexedDB.deleteDatabase(dbName);
        //     DBDeleteRequest.onsuccess = () =>
        //       console.log(`Successfully deleted ${dbName}`);
        //     DBDeleteRequest.onerror = () =>
        //       console.error(`Error deleting ${dbName}`);
        //   } catch (error) {
        //     console.error(`Failed to delete database ${dbName}:`, error);
        //   }
        // });
  
        console.log("All storage cleared successfully");
      } catch (error) {
        console.error("Error during storage cleanup:", error);
      }
    };
  
    const handleClick = async () => {
      const cookie = document.cookie.split(";").find((cookie) => {
        return cookie.includes("k-o-t");
      });
  
      if (cookie) {
        try {
          // First clear all stored data
          clearAllStoredData();
  
          // Then proceed with logout
          const logoutResult = await logout(cookie);
          if (logoutResult.success) {
            router.push("/auth/login");
          } else {
            console.error("Logout failed", logoutResult.message);
            // Force redirect even if logout fails
            router.push("/auth/login");
          }
        } catch (error) {
          console.error("Logout failed", error);
          // Force redirect on error
          router.push("/auth/login");
        }
      } else {
        // If no cookie found, just clear data and redirect
        clearAllStoredData();
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
