"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import PageContainer from '../../(dashboard)/components/container/PageContainer';
import AuthRole from '../authForms/AuthRole';
import { getCurrentUserDetails } from "@/lib/actions/user.check";
import { Icons } from "@/components/icons"
import { AuthLogo } from '@/components/AuthLogo';
import { Users2 } from "lucide-react";
import CustomSnackbar from "../../(dashboard)/layouts/shared/snackbar/CustomSnackbar";

type Mode = "signin" | "signup";

const Role = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSignup, setIsSignup] = useState(false);
  const [mode, setMode] = useState<Mode>("signup");
  const [user_details, setUserDetails] = useState<any>({});
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user = await getCurrentUserDetails();
        setUserDetails(user);
        setIsSignup(!user);
        setMode(!user ? "signup" : "signin");
      } catch (error) {
        setSnackbarMessage("Error fetching profile session");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserDetails();
  }, []);

  if (isLoading) {
    return (
      <PageContainer title="Loading..." description="Preparing workstation">
        <div className="flex items-center justify-center h-screen bg-background">
          <Icons.spinner className="h-8 w-8 animate-spin text-foreground" />
        </div>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer title="Role Selection | BondKonnect" description={isSignup ? "Create your account" : "Switch Workstation Mode"}>
      <section className="min-h-screen flex items-center justify-center bg-white py-10 px-4 relative overflow-hidden transition-colors duration-500">
        {/* Uniform Top Gradient */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
        
        <div className="w-full max-w-[460px] relative z-10">
          <div className="flex flex-col items-center gap-6">
            <AuthLogo className="mb-1 transition-transform hover:scale-105 duration-300 dark:brightness-200" />
            
            <div className="w-full bg-card rounded-[24px] border border-border shadow-[0_4px_20px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] p-1.5 transition-all">
              <AuthRole
                mode={mode}
                user_details={user_details}
                icon={
                  <div className="size-12 rounded-xl bg-foreground/5 flex items-center justify-center mb-2 transition-colors">
                    <Users2 className="size-6 text-foreground" />
                  </div>
                }
                title={isSignup ? "Create Account" : "Welcome Back"}
                subtitle={isSignup ? "Select your primary role to begin" : "Switch your workstation mode"}
              />
            </div>
          </div>
        </div>
      </section>

      <CustomSnackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        title="Session Update"
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </PageContainer>
  );
};

export default Role;
