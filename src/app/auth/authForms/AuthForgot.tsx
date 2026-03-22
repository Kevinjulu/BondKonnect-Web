"use client"
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginType } from "../../(dashboard)/types/auth/auth";
import CustomSnackbar from "../../(dashboard)/layouts/shared/snackbar/CustomSnackbar";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { Loader2, Sparkles, SendHorizontal } from "lucide-react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AuthForgot = ({ icon, title, subtitle, socialauths, subtext }: loginType) => {
    const emailRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
  
    // Snackbar state
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarTitle, setSnackbarTitle] = useState("");
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSnackbarClose = () => {
      setSnackbarOpen(false);
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
  
      const email = emailRef.current?.value || "";
  
      if (!emailRegex.test(email)) {
        setError("Please enter a valid email address");
        return;
      }
  
      setLoading(true);
  
      try {
        await api.get('/sanctum/csrf-cookie');

        // Step 2: Direct API call via Axios (Client-side)
        const response = await api.post('/V1/auth/user-reset-password', {
          email
        });
  
        const result = response.data;

        if (result?.success) {
          setSnackbarTitle("Verification Sent");
          setSnackbarMessage(result.message || "An email reset link has been dispatched.");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
          setTimeout(() => router.push("/auth/success"), 2000);
        } else {
          setSnackbarTitle("Error");
          setSnackbarMessage(result?.message || "Failed to send verification link.");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      } catch (error: any) {
        console.error("Forgot Password Error:", error);
        const errorMessage = error.message || "An error occurred. Please try again.";
        setSnackbarTitle("Connection Failed");
        setSnackbarMessage(errorMessage);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    return (
      <Card className="border-none shadow-none bg-transparent overflow-hidden">
        <CardHeader className="items-center pb-0 px-8 pt-6">
          <div className="flex flex-col items-center gap-1 group">
            <div className="relative">
              {icon}
              <div className="absolute -top-1 -right-1 size-5 bg-black rounded-full border-2 border-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Sparkles className="size-3 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-black tracking-tighter text-black leading-none mt-2 transition-colors">
              {title}
            </CardTitle>
            <CardDescription className="text-black font-bold tracking-tight opacity-70 transition-colors text-center">
              {subtitle}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-8 pt-10">
          <form onSubmit={handleSubmit} className="grid gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {socialauths && (            
              <>
                {socialauths}
                <div className="flex items-center gap-4">
                  <span className="h-px w-full bg-black/10"></span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-black/40">OR</span>
                  <span className="h-px w-full bg-black/10"></span>
                </div>
              </>
            )}
  
            <div className="grid gap-2">
              <Label htmlFor="email" className={cn("text-[10px] font-black uppercase tracking-widest text-black opacity-70", error && "text-red-500 opacity-100")}>
                Registered Work Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                ref={emailRef}
                required
                disabled={loading}
                className={cn(
                  "h-12 rounded-xl border-black bg-white text-black font-bold placeholder:text-black/40 focus:ring-black focus:border-black transition-all shadow-sm",
                  error && "border-red-500 ring-red-500"
                )}
              />
              {error && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight mt-1">{error}</p>}
            </div>

            <Button type="submit" className="w-full h-12 mt-2 rounded-xl bg-black text-white hover:bg-neutral-800 shadow-lg transition-all font-bold tracking-tight" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin text-white" />
                  Dispatching...
                </>
              ) : (
                <>
                  Send Recovery Link
                  <SendHorizontal className="ml-2 size-4" />
                </>
              )}
            </Button>
          </form>

          {subtext && (
            <div className="mt-8 pt-8 border-t border-black/5 flex justify-center text-sm animate-in fade-in duration-1000">
              <div className="text-black font-bold">
                {subtext}
              </div>
            </div>
          )}
        </CardContent>

        <CustomSnackbar
          open={snackbarOpen}
          onClose={handleSnackbarClose}
          title={snackbarTitle}
          message={snackbarMessage}
          severity={snackbarSeverity}
        />
      </Card>
    );
  };
  
  export default AuthForgot;
