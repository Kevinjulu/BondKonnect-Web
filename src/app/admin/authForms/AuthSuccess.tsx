"usde client";
import { useRef, useState, useEffect } from "react";

import { redirect, useRouter } from "next/navigation";
import { loginType } from "../../(dashboard)/types/auth/auth";
import CustomSnackbar from "../../(dashboard)/layouts/shared/snackbar/CustomSnackbar";

// import { Button } from '@/components/ui/button';
import {Card,CardContent,CardDescription,CardHeader,CardTitle,} from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
import { getCurrentUserDetails } from "@/lib/actions/user.check";
import React from "react";

// const axios = require('@/utils/axios');


const AuthSuccess = ({ icon, title, subtitle, socialauths,subtext, }: loginType) => {
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
  
{/* 
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name=""
                    placeholder="m@example.com"
                    ref={emailRef}
                    required
                  />
                </div> */}
                {/* <div className="grid gap-2">
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
                </div> */}

              {/* {loading ? (
                <Button type="submit" className="w-full" color="primary" onClick={handleLogin}   disabled>
                    Redirecting...
                </Button>
              ) : (
                <Button type="submit" className="w-full"  color="primary" onClick={handleLogin}  >
                  Back to Login
                </Button>

              )} */}
              </div>
            </CardContent>
          </Card>

         {/* {subtext} */}
  
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
  
  export default AuthSuccess;
  
