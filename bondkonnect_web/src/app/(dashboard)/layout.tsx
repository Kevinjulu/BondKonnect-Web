"use client";
import { useState, useEffect } from "react";
import { SidebarProvider } from "@/app/components/ui/sidebar"
import { AppSidebar } from "@/app/app/(dashboard)/layouts/sidebar/Sidebar"
import Header from "./layouts/header/Header"
import { Toaster } from "@/app/components/ui/toaster"
import { getCurrentUserDetails } from "@/app/lib/actions/user.check";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { WebSocketProvider } from "@/app/components/providers/WebSocketProvider";

// Simple content loader component using CSS classes
const ContentLoader = () => {
  return (
    <div className="content-loader">
      <div className="mb-4">
        <Image
          src="/images/logos/logo-c.svg"
          alt="BondKonnect"
          width={120}
          height={40}
          priority
        />
      </div>
      <div className="spinner"></div>
    </div>
  );
};

export default function Layout({ children }: { children: React.ReactNode }) {
  // const [currentUser, setCurrentUser] = useState<UserData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserData | null>(null);
  // Load user details on initial mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user = await getCurrentUserDetails();
        if (!user) {
          router.push("/auth/login");
          return;
        }
        setUser(user);
        setIsLoading(false);
      } catch {
        router.push("/auth/login");
      }
    };

    fetchUserDetails();
  }, [router]); // Remove 'user' from dependencies to prevent infinite loop

  // Show content loader on page navigation
  useEffect(() => {
    setIsPageLoading(true);
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (isLoading) {
    return null; // Empty during initial authentication check
  }

  return (
    <WebSocketProvider userDetails={user || undefined}>
      <SidebarProvider>
        <div className="flex h-screen w-screen overflow-hidden">
          <AppSidebar userDetails={user || {} as UserData} />
          <div className="flex-1 flex flex-col">
            <Header userDetails={user} />
            <div className="flex-1 overflow-y-auto">
              {isPageLoading ? <ContentLoader /> : children}
              <Toaster />
            </div>
          </div>
        </div>
      </SidebarProvider>
    </WebSocketProvider>
  )
}
