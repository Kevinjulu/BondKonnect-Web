"use client";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage, } from "@/components/ui/avatar"
import { Calendar, Home, Inbox, Search, Settings,ChevronDown,ChevronUp,User2, } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu,  DropdownMenuContent,  DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { getCurrentUserDetails } from "@/lib/actions/user.check";
import { logout,setActiveRole } from "@/lib/actions/api.actions";
import { AuthService } from "@/lib/auth-service";
import { useRouter } from "next/navigation";

  export function Profile({ userDetails }: { userDetails: UserData }) {
    const [isChangingRole, setIsChangingRole] = useState<string | null>(null);
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
