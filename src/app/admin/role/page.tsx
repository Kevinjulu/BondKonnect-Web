"use client";
import { useRef, useState, useEffect } from "react";

// import { Button } from '@/components/ui/button';
import { Grid, Box, Stack, Typography } from "@mui/material";
import {Card,CardContent,CardDescription,CardHeader,CardTitle,} from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
import PageContainer from '../../(dashboard)/components/container/PageContainer';
// import AuthLogin from '../authForms/AuthLogin';
import AuthRole from '../authForms/AuthRole';
import { FaUsersCog } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
// import { setActiveRole } from "@/lib/actions/api.actions";
import { getCurrentUserDetails } from "@/lib/actions/user.check";
// import Logo from '../../(dashboard)/layouts/shared/logo/Logo';
import { Icons } from "@/components/icons"
// next import
import Image from "next/image";
import LogoImage from "@/components/ui/LogoImage";
// Types
type Mode = "signin" | "signup";


const Role = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [isSignup, setIsSignup] = useState(false);
  const [mode, setMode] = useState<Mode>("signup");
  const searchParams = useSearchParams();
  const [user_details, setUserDetails] = useState<any>({});
  const [error, setError] = useState<any>(null);

    // Snackbar state
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarTitle, setSnackbarTitle] = useState("");
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
    const handleSnackbarClose = () => {
      setSnackbarOpen(false);
    };
  
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user = await getCurrentUserDetails();
        setUserDetails(user);
        setIsSignup(!user);
        setMode(!user ? "signup" : "signin");
      } catch (error) {
       setSnackbarMessage("Error fetching user details");
       setSnackbarSeverity("error");
        setSnackbarOpen(true);

        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserDetails();
  }, []);

  if (isLoading) {
    return (
      <PageContainer title="Roles Page" description="This is the Roles page">
        <div className="flex items-center justify-center h-screen">
         <Icons.spinner className="h-6 w-6 animate-spin" />
        </div>
      </PageContainer>
    );
  }
  
  return (
  <PageContainer title="Roles Page" description={isSignup ? "Create your account" : "This is the Roles page"}>
    <section className=" py-6">
      <div className="container">
        <div className="flex flex-col gap-4">
         <Box display="flex" justifyContent="center" width="100%">

              <LogoImage
                src="/images/logos/logo-c.svg"
                alt="logo"
                className="h-9"
                width={400}
                height={100}
              />

          </Box>
          <AuthRole
            mode={mode}
            user_details={user_details}
            icon={
              <FaUsersCog className="size-10 rounded-full bg-accent p-2.5 text-muted-foreground" />
            }
            title={isSignup ? "Select Sign Up Role" : "Select Sign in Role"}
            // title="Select Role"
            // subtitle="Pick your role"
          />
        </div>
      </div>
    </section>
  </PageContainer>
  );
};

export default Role;
