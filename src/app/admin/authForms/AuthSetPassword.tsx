import { useRef, useState, useEffect } from "react";

import { redirect, useRouter,useSearchParams, } from "next/navigation";
import { loginType } from "../../(dashboard)/types/auth/auth";
import CustomSnackbar from "../../(dashboard)/layouts/shared/snackbar/CustomSnackbar";

import { Button } from '@/app/components/ui/button';
import {Card,CardContent,CardDescription,CardHeader,CardTitle,} from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
// const axios = require('@/app/utils/axios');
import { setPassword } from "@/app/lib/actions/api.actions";
import { getCurrentUserDetails } from "@/app/lib/actions/user.check";

interface AuthRegisterProps extends loginType {
  csrfToken?: { token: string; timestamp: number } | null;

}

// Password validation regex
const minLength = /.{8,}/;
const hasUppercase = /[A-Z]/;
const hasDigit = /\d/;
const hasSymbol = /[@$!%*?&]/;

const AuthSetPassword = ({ icon, title,email, subtitle, socialauths,subtext,csrfToken, }: AuthRegisterProps) => {

    const passwordRef = useRef<HTMLInputElement>(null);
    const repasswordRef = useRef<HTMLInputElement>(null);
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();
    const queryParams = useSearchParams();
    const emailFromLink = queryParams.get("e");
    const is_res = queryParams.get("is_res") === "1";
    const s = queryParams.get("s") || "string";
    const [isRes, setIsRes] = useState(false);

  // State to manage password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showReenterPassword, setShowReenterPassword] = useState(false);


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
    const validatePassword = (password: string, reenteredPassword: string) => {
      const errors: string[] = [];
  
      if (!minLength.test(password))
        errors.push("Password must be at least 8 characters long.");
      if (!hasUppercase.test(password))
        errors.push("Password must include at least one uppercase letter.");
      if (!hasDigit.test(password))
        errors.push("Password must include at least one number.");
      if (!hasSymbol.test(password))
        errors.push("Password must include at least one symbol (e.g., @$!%*?&).");
      if (password !== reenteredPassword) errors.push("Passwords do not match.");
  
      return errors;
    };
  
    const handleSetPassword = async () => {
      // Validate CSRF token first
      if (!csrfToken?.token) {
        setSnackbarMessage("Invalid session. Please refresh the page.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }
  
    const password = passwordRef.current?.value || "";
    const reenteredPassword = repasswordRef.current?.value || "";
  
      const validationErrors = validatePassword(password, reenteredPassword);
      if (validationErrors.length > 0) {
        setSnackbarMessage(validationErrors.join(" "));
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }
  
      if (emailFromLink) {
        const formData = new FormData();
        formData.append("e", emailFromLink);
        formData.append("is_res", is_res ? "1" : "0");
        formData.append("s", s);
        formData.append("csrf_token", csrfToken.token);
        formData.append("csrf_timestamp", csrfToken.timestamp.toString());
      }
  
      if (!emailFromLink) {
        setSnackbarMessage("Email is missing!");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }
  
      setLoading(true);
  
      try {
        const queryParams = new URLSearchParams({
          email: emailFromLink,
          password: password,
          is_res: isRes ? "1" : "0",
          s: s,
          csrf_token: csrfToken.token,
          csrf_timestamp: csrfToken.timestamp.toString(),
        }).toString();
  
        const result = await setPassword(queryParams);
  
        if (result?.success) {
          setTimeout(() => {
            setSnackbarMessage(
              "Password set successfully! You can now log in with your new password."
            );
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
          }, 300);
          router.push("/admin/login");
        } else {
          setSnackbarMessage(result.message || "An error occurred.");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      } catch (error: any) {
        setSnackbarMessage(error.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
  
      setLoading(false);
    };
  
    useEffect(() => {
      if (!emailFromLink) {
        console.log("weuh");
      }
    }, [emailFromLink]);

    return (
      <>
      {/* Add hidden input for CSRF token */}
      <input type="hidden" name="csrf_token" value={csrfToken?.token || ""} />

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
                  <div className="flex justify-between">
                    <Label htmlFor="password">Enter Password</Label>
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
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <Label htmlFor="password">Re-enter Password</Label>
                  </div>
                  <Input
                    id="repassword"
                    type="password"
                    name=""
                    placeholder="Re-enter your password"
                    ref={repasswordRef}
                    required
                  />
                </div>
              {loading ? (
                <Button type="submit" className="w-full" color="primary" onClick={handleSetPassword}   disabled>
                    Loading...
                </Button>
              ) : (
                <Button type="submit" className="w-full"  color="primary" onClick={handleSetPassword}  >
                  Set Password
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
  
  export default AuthSetPassword;
  
