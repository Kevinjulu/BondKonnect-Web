import React, { useRef, useState, useEffect } from "react";

import { redirect, useRouter,useSearchParams } from "next/navigation";
import { loginType } from "../../(dashboard)/types/auth/auth";
import CustomSnackbar from "../../(dashboard)/layouts/shared/snackbar/CustomSnackbar";

import { Button } from '@/components/ui/button';
import {Card,CardContent,CardDescription,CardHeader,CardTitle,} from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot, } from "@/components/ui/input-otp"
  
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// const axios = require('@/utils/axios');
import { otpVerify, resendOtp, getIPAddress, } from "@/lib/actions/api.actions";
import { createSession } from "../session/auth1";
import { AuthService } from "@/lib/auth-service";

import { getCurrentUserDetails } from "@/lib/actions/user.check";

const AuthOtp = ({ icon, title, subtitle, socialauths,subtext, }: loginType) => {
    // const otpRef = useRef<HTMLInputElement>(null);
    const [timeLeft, setTimeLeft] = useState(45);
    const [resendActive, setResendActive] = useState(false);
    const [otpValue, setotpValue] = React.useState("")
    // const [isClient, setIsClient] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const emailfromparams = searchParams.get("email");
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

    useEffect(() => {
        if (timeLeft === 0) setResendActive(true);
        if (timeLeft > 0) {
          const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
          return () => clearInterval(timer);
        }
      }, [timeLeft]);
    
      // Snackbar state
      const [snackbarOpen, setSnackbarOpen] = useState(false);
      // const [snackbarTitle, setSnackbarTitle] = useState("");
      const [snackbarMessage, setSnackbarMessage] = useState("");
      const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
    // loading
    const [loading, setLoading] = useState(false);
  
    // useEffect(() => {
    //   setIsClient(true);
    // }, []);
  
  
    useEffect(() => {
      if (!emailfromparams) {
        setSnackbarMessage("Email is missing from URL");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }
  
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(timer);
            setResendActive(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
  
      return () => clearInterval(timer);
    }, [emailfromparams]);
    
    
    const handleSnackbarClose = () => {
      setSnackbarOpen(false);
    };
  
    const handleSubmit = async () => {
      if (!emailfromparams) {
        setSnackbarMessage("Email is missing");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }
  
      if (otpValue.length !== 6) {
        setSnackbarMessage("Please enter a valid 6-digit OTP");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }
  
      setLoading(true);
  
      try {
        const ipAddress = await getIPAddress();
        const params = new URLSearchParams();
        params.append("email", emailfromparams);
        params.append("otp", otpValue);
        params.append("ip_address", ipAddress);
  
        const response = await otpVerify(params.toString());
  
        createSession(emailfromparams);
  
        if (response?.success) {
          createSession(emailfromparams);
          setSnackbarMessage("OTP verified successfully");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
  
  
  
          const token = response.data;
          if (token) {
            // Use AuthService for secure token management (60 days expiration as requested by original code)
            AuthService.setToken(token, 60);
          }
  
          // push to the role selection page
          router.push("/admin/role");
  
        } else {
          setSnackbarMessage(response?.message || "Verification failed");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      } catch (error) {
        setSnackbarMessage(
          error instanceof Error ? error.message : "An error occurred"
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    const handleResendOtp = async () => {
      if (!emailfromparams) {
        setSnackbarMessage("Email is missing");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("email", emailfromparams);
  
        const response = await resendOtp(params.toString());
  
        if (response?.success) {
          setSnackbarMessage("OTP resent successfully");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
          setTimeLeft(20);
          setResendActive(false);
          setotpValue(""); // Clear existing OTP


        } else {
          setSnackbarMessage(response?.message || "Failed to resend OTP");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      } catch (error) {
        setSnackbarMessage(
          error instanceof Error ? error.message : "An error occurred"
        );
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
  

                <div className="mx-auto flex gap-2">
                  {/* <Label htmlFor="otp">OTP</Label>
                  <Input
                    id="email"
                    type="email"
                    name=""
                    placeholder="m@example.com"
                    ref={otpRef}
                    required
                  /> */}

                    <InputOTP maxLength={6} value={otpValue}  onChange={(otpValue) => setotpValue(otpValue)}>
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                    </InputOTP>

                </div>

                <div className="mx-auto flex gap-1 text-sm">
                    
                    {resendActive ? (

                    <button 
                        className="underline"
                        onClick={handleResendOtp}
                        onKeyDown={(e) => e.key === 'Enter' && handleResendOtp()}
                        type="button"
                        role="button"
                        tabIndex={0}
                    >
                        {loading ? "Resending..." : "Click to Resend Code"}
                    </button>

                    ) : (
                        <p>Click to Resend in {timeLeft} seconds</p>
                    )}
                </div>
              {loading ? (
                <Button type="submit" className="w-full" color="primary" onClick={handleSubmit}   disabled>
                    Verifying...
                </Button>
              ) : (
                <Button type="submit" className="w-full"  color="primary" onClick={handleSubmit}  >
                  Proceed 
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
  
  export default AuthOtp;
  
