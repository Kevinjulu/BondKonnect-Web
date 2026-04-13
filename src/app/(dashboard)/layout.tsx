"use client";
import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/app/(dashboard)/layouts/sidebar/Sidebar"
import Header from "./layouts/header/Header"
import { Toaster } from "@/components/ui/toaster"
import { useRouter, usePathname } from "next/navigation";
import LogoImage from "@/components/ui/LogoImage";
import { WebSocketProvider } from "@/components/providers/WebSocketProvider";
import { useTheme } from "next-themes";
import { FloatingUtilityDock } from "./components/apps/dashboard/FloatingUtilityDock";
import { useAuth } from "@/hooks/use-auth";
import { useLogoSrc } from "@/hooks/use-logo-src";
import { AlertCircle } from "lucide-react";

// Simple Error Boundary component
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error("Caught by layout boundary:", error);
      setHasError(true);
    };
    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
        <p className="text-neutral-500 mb-6 max-w-md">The application encountered an error while rendering this section.</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-black text-white rounded-md font-bold"
        >
          Reload Dashboard
        </button>
      </div>
    );
  }

  return <>{children}</>;
}

// Simple content loader component using CSS classes
const ContentLoader = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc = useLogoSrc('loading');

  return (
    <div className="flex flex-col justify-center items-center w-full h-[60vh] bg-background animate-in fade-in duration-300">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-neutral-100 rounded-full blur-2xl opacity-20 animate-pulse" />
        <LogoImage
          src={logoSrc}
          alt="BondKonnect"
          width={140}
          height={48}
          className="relative h-12 w-auto object-contain animate-pulse"
        />
      </div>
      
      <div className="flex flex-col items-center gap-3">
        <div className="h-[2px] w-24 bg-neutral-100 overflow-hidden relative">
          <div className="absolute inset-0 bg-black dark:bg-white animate-[loading-bar_1.5s_infinite]" />
        </div>
        <span className="text-[8px] font-black uppercase tracking-[0.5em] text-neutral-400">
          Syncing Node
        </span>
      </div>

      <style jsx>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [isPageLoading, setIsPageLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  // Use centralized auth hook
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Show content loader on page navigation
  useEffect(() => {
    setIsPageLoading(true);
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [pathname]);

  const showFloatingCalculator = [
    "/apps/bond-stats",
    "/apps/analysis",
    "/apps/research-assistant",
    "/apps/portfolio-assistant",
    "/apps/financials",
    "/apps/transactions",
    "/apps/portfolio-analytics",
    "/apps/hub",
    "/apps/billing",
    "/apps/messages",
    "/apps/account",
    "/apps/notifications",
    "/apps/faq",
    "/apps/help",
  ].some(path => pathname?.includes(path));

  if (isLoading) {
    const logoSrc = resolvedTheme === "dark" 
      ? "/images/logos/logo-dark.svg" 
      : "/images/logos/logo-c.png";

    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <LogoImage src={logoSrc} alt="Loading..." width={140} height={48} className="animate-pulse h-12 w-auto object-contain" />
      </div>
    );
  }

  return (
    <WebSocketProvider userDetails={user || undefined}>
      <SidebarProvider>
        <div className="flex h-screen w-screen overflow-hidden">
          <AppSidebar userDetails={user || {} as any} />
          <div className="flex-1 flex flex-col">
            <Header userDetails={user} />
            <div className="flex-1 overflow-y-auto">
              <ErrorBoundary>
                {isPageLoading ? <ContentLoader /> : children}
                {showFloatingCalculator && <FloatingUtilityDock />}
                <Toaster />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </WebSocketProvider>
  )
}
