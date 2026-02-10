"use client";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage, } from "@/components/ui/avatar"
import { Calendar, Home, Inbox, Search, Settings,ChevronDown,ChevronUp,User2, } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu,  DropdownMenuContent,  DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { getCurrentUserDetails } from "@/lib/actions/user.check";
import { logout,setActiveRole } from "@/lib/actions/api.actions";
import { useRouter } from "next/navigation";

  export function Profile({ userDetails }: { userDetails: UserData }) {
    const [isChangingRole, setIsChangingRole] = useState<string | null>(null);
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-none hover:bg-white/10 transition-colors">
            <Avatar className="h-8 w-8 rounded-none border border-white/20">
              <AvatarImage src="/avatars/01.png" alt="@shadcn" className="rounded-none" />
              <AvatarFallback className="bg-white/10 text-white rounded-none">
                <User2 className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{role ? capitalizeFirstLetter(role) : "Loading..."}</p>
              <p className="text-xs leading-none text-muted-foreground">
              {/* {userDetails?.first_name || "My"} */}
              {userDetails?.email || "Loading..."}

              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {/* <DropdownMenuItem asChild>
              <a href="/apps/account" className="cursor-pointer">
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </a>
            </DropdownMenuItem> */}
            <DropdownMenuItem asChild>
            <a href="/apps/pricing" className="cursor-pointer">
              Upgrade Account
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem >
            <a href="/apps/account" className="cursor-pointer">
              Profile Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </a>
            </DropdownMenuItem>
            {/* <DropdownMenuItem>New Team</DropdownMenuItem> */}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem  onClick={handleClick}>
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
