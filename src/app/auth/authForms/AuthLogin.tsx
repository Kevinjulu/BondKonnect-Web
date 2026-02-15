"use client";
import { useRef, useState, useEffect } from "react";

import { redirect, useRouter } from "next/navigation";
import Link from 'next/link';
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
import { Loader2 } from "lucide-react";

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
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    useEffect(() => {
      const checkUser = async () => {
        const result = await getCurrentUserDetails();
        if (result) {
          router.push("/");
        }
      };
      checkUser();
    }, [router]);
  
  
    const handleSnackbarClose = () => {
      setSnackbarOpen(false);
    };
  
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setErrors({});
      
      const email = emailRef.current?.value || "";
      const password = passwordRef.current?.value || "";

      let hasLocalError = false;
      const localErrors: { email?: string; password?: string } = {};

      if (!email) {
        localErrors.email = "Email is required";
        hasLocalError = true;
      } else if (!emailRegex.test(email)) {
        localErrors.email = "Please enter a valid email address";
        hasLocalError = true;
      }

      if (!password) {
        localErrors.password = "Password is required";
        hasLocalError = true;
      }

      if (hasLocalError) {
        setErrors(localErrors);
        return;
      }

      setLoading(true);

      try {
        const queryParams = `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
        const result = await login(queryParams);

        if (result.success) {
          // Set cookie manually if not handled by server header
          if (result.data?.token) {
             document.cookie = `k-o-t=${result.data.token}; path=/; max-age=86400; SameSite=Lax`;
          }
          
          setSnackbarTitle("Success");
          setSnackbarMessage("Login successful! Redirecting...");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
          
          setTimeout(() => {
            router.push('/');
          }, 1000);
        } else {
          // Map backend errors to UI
          const status = result.status;
          let errorMessage = result.message;

          if (status === 401) {
            errorMessage = "Invalid email or password.";
          } else if (status === 403) {
            errorMessage = "Your account is suspended. Please contact the administrator.";
          } else if (status === 429) {
            errorMessage = "Too many failed attempts. Please try again in 5 minutes.";
          } else if (status === 503) {
            errorMessage = "Service unavailable. Please ensure your local server is running.";
          }

          if (result.errors) {
            setErrors({
              email: result.errors.email?.[0],
              password: result.errors.password?.[0],
            });
          }

          setSnackbarTitle("Login Error");
          setSnackbarMessage(errorMessage);
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      } catch (error) {
        setSnackbarTitle("Connection Error");
        setSnackbarMessage("Unable to reach the server. Please check your network.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };
    
    return (
      <>
        <Card className="mx-auto w-full max-w-sm">     
        <CardHeader className="items-center">
          {icon}
          {title && <CardTitle className="text-xl">{title}</CardTitle>}
          {subtitle && <CardDescription>{subtitle}</CardDescription>}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            {socialauths}
            {socialauths && (            
              <div className="flex items-center gap-4">
                <span className="h-px w-full bg-input"></span>
                <span className="text-xs text-muted-foreground">OR</span>
                <span className="h-px w-full bg-input"></span>
              </div>
            )}
  
            <div className="grid gap-2">
              <Label htmlFor="email" className={errors.email ? "text-red-500" : ""}>Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@gmail.com"
                ref={emailRef}
                required
                disabled={loading}
                className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.email && <p className="text-[10px] font-bold text-red-500 uppercase">{errors.email}</p>}
            </div>
            <div className="grid gap-2">
              <div className="flex justify-between">
                <Label htmlFor="password" className={errors.password ? "text-red-500" : ""}>Password</Label>
                <Link href="/auth/forgot-password" className="text-sm underline">
                  Forgot password
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                ref={passwordRef}
                required
                disabled={loading}
                className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.password && <p className="text-[10px] font-bold text-red-500 uppercase">{errors.password}</p>}
            </div>

            <Button type="submit" className="w-full bg-black text-white hover:bg-neutral-800" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : "Log in"}
            </Button>
          </form>
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
  
