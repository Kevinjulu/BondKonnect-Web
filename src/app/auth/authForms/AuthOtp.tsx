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
import { otpVerify, resendOtp } from "@/lib/actions/auth.actions";
import { getIPAddress, getCurrentUserDetails } from "@/lib/actions/api.actions";
import { AuthService } from "@/lib/auth-service.client";
import { Loader2 } from "lucide-react";

const AuthOtp = ({ icon, title, subtitle, socialauths,subtext, }: loginType) => {
    const [timeLeft, setTimeLeft] = useState(45);
    const [resendActive, setResendActive] = useState(false);
    const [otpValue, setotpValue] = React.useState("")
    const router = useRouter();
    const searchParams = useSearchParams();
    const emailfromparams = searchParams.get("email");

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarTitle, setSnackbarTitle] = useState("");
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const checkUser = async () => {
        const result = await getCurrentUserDetails();
        if (result) {
          router.push("/");
        }
      };
      checkUser();
    }, [router]);

    useEffect(() => {
        if (timeLeft === 0) setResendActive(true);
        if (timeLeft > 0) {
          const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
          return () => clearInterval(timer);
        }
      }, [timeLeft]);
    
    useEffect(() => {
      if (!emailfromparams) {
        setSnackbarTitle("Missing Email");
        setSnackbarMessage("Email is missing from the request.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }, [emailfromparams]);
    
    const handleSnackbarClose = () => {
      setSnackbarOpen(false);
    };
  
    const handleSubmit = async () => {
      if (!emailfromparams) return;
  
      if (otpValue.length !== 6) {
        setSnackbarMessage("Please enter a valid 6-digit OTP");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }
  
      setLoading(true);
  
      try {
        const ipAddress = await getIPAddress();
        const queryParams = `email=${encodeURIComponent(emailfromparams)}&otp=${encodeURIComponent(otpValue)}&ip_address=${encodeURIComponent(ipAddress)}`;
  
        const response = await otpVerify(queryParams);
  
        if (response.success) {
          const token = response.data;
          
          if (token) {
            AuthService.setToken(token);
          }
          
          setSnackbarTitle("Success");
          setSnackbarMessage("OTP verified successfully");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
  
          setTimeout(() => {
            router.push("/auth/role");
          }, 1000);
  
        } else {
          setSnackbarTitle("Verification Failed");
          setSnackbarMessage(response.message || "Invalid OTP code.");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      } catch (error) {
        setSnackbarMessage("An unexpected error occurred. Please try again.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    const handleResendOtp = async () => {
      if (!emailfromparams) return;
      
      setLoading(true);
      try {
        const queryParams = `email=${encodeURIComponent(emailfromparams)}`;
        const response = await resendOtp(queryParams);
  
        if (response.success) {
          setSnackbarTitle("OTP Sent");
          setSnackbarMessage("A new code has been sent to your email.");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
          setTimeLeft(45);
          setResendActive(false);
          setotpValue("");
        } else {
          setSnackbarMessage(response.message || "Failed to resend OTP");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      } catch (error) {
        setSnackbarMessage("Network error. Could not resend OTP.");
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
                <Button type="submit" className="w-full bg-black text-white" disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                </Button>
              ) : (
                <Button type="submit" className="w-full bg-black text-white hover:bg-neutral-800" onClick={handleSubmit}  >
                  Verify & Proceed 
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
  
  export default AuthOtp;
  

