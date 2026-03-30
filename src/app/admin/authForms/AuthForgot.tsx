"use client"
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { loginType } from "../../(dashboard)/types/auth/auth";
import CustomSnackbar from "../../(dashboard)/layouts/shared/snackbar/CustomSnackbar";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api, { getCsrf } from "@/lib/api";
import { Loader2 } from "lucide-react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AuthForgot = ({ icon, title, subtitle, socialauths, subtext }: loginType) => {
    const emailRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
  
    // Snackbar state
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
    
    const [loading, setLoading] = useState(false);
  
    const handleSnackbarClose = () => {
      setSnackbarOpen(false);
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
  
      const email = emailRef.current?.value || "";
  
      if (!emailRegex.test(email)) {
        setSnackbarMessage("Please enter a valid email address!");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setLoading(false);
        return;
      }
  
      try {
        await getCsrf();

        // Direct API call
        const response = await api.post('/V1/auth/user-reset-password', { email });
        const result = response.data;

        if (result?.success) {
          setSnackbarMessage(result.message || "An Email Verification Link has been sent");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
          setTimeout(() => router.push("/admin/success"), 2000);
        } else {
          setSnackbarMessage(result?.message || "Failed to send verification link.");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      } catch (error: any) {
        setSnackbarMessage(error.message || "An error occurred. Please try again.");
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
            <form onSubmit={handleSubmit} className="grid gap-4">
              {socialauths}
              {socialauths && (            
                <div className="flex items-center gap-4">
                  <span className="h-px w-full bg-input"></span>
                  <span className="text-xs text-muted-foreground">OR</span>
                  <span className="h-px w-full bg-input"></span>
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@gmail.com"
                  ref={emailRef}
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Link"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        {subtext}
        <CustomSnackbar
          open={snackbarOpen}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
          severity={snackbarSeverity}
        />
      </>
    );
  };
  
  export default AuthForgot;
  
