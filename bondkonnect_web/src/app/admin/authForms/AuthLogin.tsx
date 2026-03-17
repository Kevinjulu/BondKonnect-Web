"use client";
import { useRef, useState, useEffect } from "react";

import { redirect, useRouter } from "next/navigation";
import { loginType } from "../../(dashboard)/types/auth/auth";
import CustomSnackbar from "../../(dashboard)/layouts/shared/snackbar/CustomSnackbar";

import { Button } from '@/components/ui/button';
import {Card,CardContent,CardDescription,CardHeader,CardTitle,} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// const axios = require('@/utils/axios');
import axios from 'axios';
import { login } from "@/lib/actions/api.actions";
import { getCurrentUserDetails } from "@/lib/actions/user.check";
// import { Icons } from "@/components/icons";
// import PageContainer from "../../(dashboard)/components/container/PageContainer";


  
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AuthLogin = ({ icon, title, subtitle, socialauths,subtext, }: loginType) => {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();
  
      // Snackbar state
      const [snackbarOpen, setSnackbarOpen] = useState(false);
      const [snackbarTitle, setSnackbarTitle] = useState("");
      const [snackbarMessage, setSnackbarMessage] = useState("");
      const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
    // loading
    const [loading, setLoading] = useState(false);
    const [load, setLoad] = useState(false);
    useEffect(() => {
      // setIsClient(true);
      const checkUser = async () => {
        const user = await getCurrentUserDetails();
        if (user) {
          redirect("/");
        }
      };
  
      checkUser();
    }, []);
  
  
    const handleSnackbarClose = () => {
      setSnackbarOpen(false);
    };
  
    const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
      setLoading(true);
      e.preventDefault();
  
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
        const queryParams = new URLSearchParams({
          email: email,
          password: password,
        }).toString();
  
        const result = await login(queryParams);
        console.log("Login Result:", result);
        if (result && result.success) {
          setSnackbarMessage(result.message || "Login Successful, OTP sent.");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
  
          // Redirect to the dashboard or another page
          router.push(`/admin/otp?email=${encodeURIComponent(email)}`);
         // setLoad(true);
        } else {
          setSnackbarMessage(
            result?.message || "An error occurred during login. Please try again."
          );
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error("Login Error:", error);
        setSnackbarMessage("An error occurred during login. Please try again.");
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
  
