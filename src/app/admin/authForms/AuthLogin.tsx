"use client";
import { useRef, useState, useEffect } from "react";

import { redirect, useRouter } from "next/navigation";
import { loginType } from "../../(dashboard)/types/auth/auth";
import CustomSnackbar from "../../(dashboard)/layouts/shared/snackbar/CustomSnackbar";

import { Button } from '@/components/ui/button';
import {Card,CardContent,CardDescription,CardHeader,CardTitle,} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from '@/utils/axios';
import { login } from "@/lib/actions/api.actions";
import { getCurrentUserDetails } from "@/lib/actions/user.check";
import { getBaseApiUrl } from "@/lib/utils/url-resolver";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AuthLogin = ({ icon, title, subtitle, socialauths,subtext, }: loginType) => {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
  
    // Snackbar state
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarTitle, setSnackbarTitle] = useState("");
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
    
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const checkUser = async () => {
        const user = await getCurrentUserDetails();
        if (user) {
          router.push("/");
        }
      };
  
      checkUser();
    }, [router]);
  
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
  
      const email = emailRef.current?.value || "";
      const password = passwordRef.current?.value || "";
  
      // Validate email and password
      if (!emailRegex.test(email)) {
        setSnackbarMessage("Invalid Email Format");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setLoading(false);
        return;
      }
  
      if (!password) {
        setSnackbarMessage("Password is Required!");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setLoading(false);
        return;
      }
  
      try {
        const API = getBaseApiUrl();
        console.log("Admin Login: Connecting to API:", API);

        if (!API) {
          throw new Error("API URL is not configured.");
        }

        // Step 1: CSRF
        const baseUrl = API.split('/api')[0];
        await fetch(`${baseUrl}/sanctum/csrf-cookie`, {
          credentials: 'include'
        });

        // Step 2: Login
        const result = await login(new URLSearchParams({ email, password }).toString());
        
        console.log("Admin Login Result:", result);
        
        if (result && result.success) {
          setSnackbarMessage(result.message || "Login Successful, OTP sent.");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
  
          // Redirect to the OTP page
          router.push(`/admin/otp?email=${encodeURIComponent(email)}`);
        } else {
          setSnackbarMessage(
            result?.message || "An error occurred during login. Please try again."
          );
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      } catch (error: any) {
        console.error("Admin Login Error:", error);
        setSnackbarMessage(error.message || "An error occurred during login.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    // if (load) {
    //   return (
    //     <PageContainer title="Roles Page" description="This is the Roles page">
    //       <div className="flex items-center justify-center h-screen">
    //        <Icons.spinner className="h-6 w-6 animate-spin" />
    //       </div>
    //     </PageContainer>
    //   );
    // }
    
    return (
      <>

        <Card className="mx-auto w-full max-w-sm">     
        <CardHeader className="items-center">
          {icon}

          {title ? (
            <CardTitle className="text-xl">{title}</CardTitle>   
          ) : null}
          
          {subtitle ? (
            <CardDescription>{subtitle}</CardDescription>  
          ) : null}
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
              {socialauths}

              {socialauths ? (            
                <div className="flex items-center gap-4">
                <span className="h-px w-full bg-input"></span>
                <span className="text-xs text-muted-foreground">OR</span>
                <span className="h-px w-full bg-input"></span>
               </div>
              
              ) : null}
  
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name=""
                    placeholder="m@gmail.com"
                    ref={emailRef}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a href="/auth/forgot-password/" className="text-sm underline">
                      Forgot password
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    name=""
                    placeholder="Enter your password"
                    ref={passwordRef}
                    required
                  />
                </div>

              {loading ? (
                <Button type="submit" className="w-full" color="primary" onClick={handleLogin}   disabled>
                    Loading...
                </Button>
              ) : (
                <Button type="submit" className="w-full"  color="primary" onClick={handleLogin}  >
                  Log in
                </Button>

              )}
              </div>
            </CardContent>
          </Card>

         {subtext}
  
        <CustomSnackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        title={snackbarTitle}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
      </>
    );
  };
  
  export default AuthLogin;
  
