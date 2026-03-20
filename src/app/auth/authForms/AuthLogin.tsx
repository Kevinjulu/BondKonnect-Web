"use client";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { loginType } from "../../(dashboard)/types/auth/auth";
import CustomSnackbar from "../../(dashboard)/layouts/shared/snackbar/CustomSnackbar";
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from "@/lib/actions/api.actions";
import axios from "@/utils/axios";
import { getCurrentUserDetails } from "@/lib/actions/user.check";
import { Loader2, Sparkles, ArrowRight } from "lucide-react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AuthLogin = ({ icon, title, subtitle, socialauths, subtext }: loginType) => {
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
        if (result) router.push("/");
      };
      checkUser();
    }, [router]);
  
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
        const API = getBaseApiUrl();
        console.log("Attempting to connect to API:", API);

        if (!API) {
          throw new Error("API URL is not configured. Check your environment variables.");
        }

        // Step 1: Initialize CSRF protection (Sanctum requirement)
        const baseUrl = API.split('/api')[0];
        console.log("Initializing CSRF at:", `${baseUrl}/sanctum/csrf-cookie`);
        
        await fetch(`${baseUrl}/sanctum/csrf-cookie`, {
          credentials: 'include'
        });

        // Step 2: Direct API call via Axios (Client-side)
        const response = await axios.post('/V1/auth/user-login', {
          email,
          password
        });

        const result = response.data;
        console.log("Login result:", result);

        if (result.success) {
          // Dev bypass sets token immediately
          if (result.data?.token || result.token) {
             const token = result.data?.token || result.token;
             document.cookie = `k-o-t=${token}; path=/; max-age=86400; SameSite=Lax`;
             setSnackbarTitle("Success");
             setSnackbarMessage("Login successful! Redirecting...");
             setSnackbarSeverity("success");
             setSnackbarOpen(true);
             setTimeout(() => router.push('/'), 1000);
          } else {
             // Normal flow: OTP was sent
             setSnackbarTitle("OTP Sent");
             setSnackbarMessage(result.message || "Please check your email for the verification code.");
             setSnackbarSeverity("success");
             setSnackbarOpen(true);
             // Redirect to OTP page with email parameter
             setTimeout(() => router.push(`/auth/otp?email=${encodeURIComponent(email)}`), 1500);
          }
        } else {
          // ... handle errors
        }
      } catch (error: any) {
        console.error("Login Error:", error);
        const errorMessage = error.message || "Unable to reach the server.";
        setSnackbarTitle("Connection Issue");
        setSnackbarMessage(errorMessage);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };
    
    return (
      <Card className="border-none shadow-none bg-transparent overflow-hidden">
        <CardHeader className="items-center pb-0 px-8 pt-8">
          <div className="flex flex-col items-center gap-1 group">
            <div className="relative">
              {icon}
              <div className="absolute -top-1 -right-1 size-5 bg-foreground rounded-full border-2 border-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Sparkles className="size-3 text-background" />
              </div>
            </div>
            <CardTitle className="text-3xl font-black tracking-tighter text-foreground leading-none mt-2 transition-colors">
              {title}
            </CardTitle>
            <CardDescription className="text-foreground font-bold tracking-tight opacity-70 transition-colors">
              {subtitle}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-8 pt-10">
          <form onSubmit={handleLogin} className="grid gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {socialauths}
            {socialauths && (            
              <div className="flex items-center gap-4">
                <span className="h-px w-full bg-border"></span>
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">OR</span>
                <span className="h-px w-full bg-border"></span>
              </div>
            )}
  
            <div className="grid gap-2">
              <Label htmlFor="email" className={cn("text-[10px] font-black uppercase tracking-widest text-foreground opacity-70", errors.email && "text-destructive opacity-100")}>
                Work Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                ref={emailRef}
                required
                disabled={loading}
                className={cn(
                  "h-12 rounded-xl border-border bg-background text-foreground font-bold placeholder:text-foreground/40 focus:ring-foreground focus:border-foreground transition-all shadow-sm",
                  errors.email && "border-destructive ring-destructive"
                )}
              />
              {errors.email && <p className="text-[10px] font-bold text-destructive uppercase tracking-tight mt-1">{errors.email}</p>}
            </div>

            <div className="grid gap-2">
              <div className="flex justify-between items-end">
                <Label htmlFor="password" className={cn("text-[10px] font-black uppercase tracking-widest text-foreground opacity-70", errors.password && "text-destructive opacity-100")}>
                  Secure Password
                </Label>
                <Link href="/auth/forgot-password" title="Recover Password" className="text-[10px] font-black uppercase tracking-widest text-foreground underline underline-offset-4 hover:bg-foreground hover:text-background px-1 transition-all">
                  Forgot?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                ref={passwordRef}
                required
                disabled={loading}
                className={cn(
                  "h-12 rounded-xl border-border bg-background text-foreground font-bold placeholder:text-foreground/40 focus:ring-foreground focus:border-foreground transition-all shadow-sm",
                  errors.password && "border-destructive ring-destructive"
                )}
              />
              {errors.password && <p className="text-[10px] font-bold text-destructive uppercase tracking-tight mt-1">{errors.password}</p>}
            </div>

            <Button type="submit" className="w-full h-12 mt-2 rounded-xl bg-foreground text-background hover:bg-foreground/90 shadow-lg transition-all font-bold tracking-tight" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Log in to Workstation
                  <ArrowRight className="ml-2 size-4" />
                </>
              )}
            </Button>
          </form>

          {subtext && (
            <div className="mt-8 pt-8 border-t border-border flex justify-center text-sm animate-in fade-in duration-1000">
              <div className="text-foreground font-bold">
                {subtext}
              </div>
            </div>
          )}
        </CardContent>

        <CustomSnackbar
          open={snackbarOpen}
          onClose={() => setSnackbarOpen(false)}
          title={snackbarTitle}
          message={snackbarMessage}
          severity={snackbarSeverity}
        />
      </Card>
    );
  };
  
  export default AuthLogin;
