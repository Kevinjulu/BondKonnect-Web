"use client"
import { useRef, useState } from "react";

import { useRouter } from "next/navigation";
import { loginType } from "../../(dashboard)/types/auth/auth";
import CustomSnackbar from "../../(dashboard)/layouts/shared/snackbar/CustomSnackbar";

import { Button } from '@/components/ui/button';
import {Card,CardContent,CardDescription,CardHeader,CardTitle,} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// const axios = require('@/utils/axios');
//  import axios from 'axios';
import { forgotPassword } from "@/lib/actions/api.actions";
// import { getCurrentUserDetails } from "@/lib/actions/user.check";


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AuthForgot = ({ icon, title, subtitle, socialauths,subtext, }: loginType) => {
    const emailRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
  
      // Snackbar state
      const [snackbarOpen, setSnackbarOpen] = useState(false);
      // const [snackbarTitle, setSnackbarTitle] = useState("");
      const [snackbarMessage, setSnackbarMessage] = useState("");
      const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
    // loading
    const [loading, setLoading] = useState(false);
  
    // useEffect(() => {
    //   // setIsClient(true);
    //   const checkUser = async () => {
    //     const user = await getCurrentUserDetails();
    //     if (user) {
    //       redirect("/");
    //     }
    //   };
  
    //   checkUser();
    // }, []);
  
  
    const handleSnackbarClose = () => {
      setSnackbarOpen(false);
    };
  
    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
      setLoading(true);
      e.preventDefault();
  
      const email = emailRef.current?.value || "";
  
      if (!emailRegex.test(email)) {
        setSnackbarMessage("Please enter a valid email address!");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }
  
      setLoading(true);
  
      try {
        const params = new URLSearchParams();
        params.append("email", email);
        const response = await forgotPassword(params.toString());
  
        if (response?.success) {
          setSnackbarMessage("An Email Verification Link has been sent");
          setSnackbarSeverity("success");
          router.push("/admin/success");
        } else {
          setSnackbarMessage(
            response?.message || "Failed to send verification link."
          );
          setSnackbarSeverity("error");
        }
      } catch {
        setSnackbarMessage("An error occurred. Please try again.");
        setSnackbarSeverity("error");
      } finally {
        setSnackbarOpen(true);
        setLoading(false);
      }
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


              {loading ? (
                <Button type="submit" className="w-full" color="primary" onClick={handleSubmit}   disabled>
                    Sending...
                </Button>
              ) : (
                <Button type="submit" className="w-full"  color="primary" onClick={handleSubmit}  >
                  Send Link
                </Button>

              )}
              </div>
            </CardContent>
          </Card>

         {subtext}
  
        <CustomSnackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        // title={snackbarTitle}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
      </>
    );
  };
  
  export default AuthForgot;
  
