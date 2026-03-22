import { useRef, useState, useEffect } from "react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { loginType } from "../../(dashboard)/types/auth/auth";
import CustomSnackbar from "../../(dashboard)/layouts/shared/snackbar/CustomSnackbar";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from "@/lib/api";
import { getCurrentUserDetails } from "@/lib/actions/user.check";
import { Loader2 } from "lucide-react";

interface AuthRegisterProps extends loginType {
  csrfToken?: { token: string; timestamp: number } | null;
}

// Password validation regex
const minLength = /.{8,}/;
const hasUppercase = /[A-Z]/;
const hasDigit = /\d/;
const hasSymbol = /[@$!%*?&]/;

const AuthSetPassword = ({ icon, title, subtitle, socialauths, subtext, csrfToken }: AuthRegisterProps) => {
    const passwordRef = useRef<HTMLInputElement>(null);
    const repasswordRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const queryParams = useSearchParams();
    const emailFromLink = queryParams.get("e");
    const is_res = queryParams.get("is_res") === "1";
    const s = queryParams.get("s") || "";
    const t = queryParams.get("t") || "";
    const [isRes, setIsRes] = useState(is_res);

    // Snackbar state
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarTitle, setSnackbarTitle] = useState("");
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
    
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
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
      if (!minLength.test(password)) errors.push("Password must be at least 8 characters long.");
      if (!hasUppercase.test(password)) errors.push("Password must include at least one uppercase letter.");
      if (!hasDigit.test(password)) errors.push("Password must include at least one number.");
      if (!hasSymbol.test(password)) errors.push("Password must include at least one symbol (e.g., @$!%*?&).");
      if (password !== reenteredPassword) errors.push("Passwords do not match.");
      return errors;
    };
  
    const handleSetPassword = async (e: React.FormEvent) => {
      e.preventDefault();

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
  
      if (!emailFromLink) {
        setSnackbarMessage("Email is missing!");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }
  
      setLoading(true);
  
      try {
        await api.get('/sanctum/csrf-cookie');

        const response = await api.post('/V1/auth/set-password', {
          email: emailFromLink,
          password: password,
          is_res: isRes ? "1" : "0",
          s: s,
          t: t,
          csrf_token: csrfToken.token,
          csrf_timestamp: csrfToken.timestamp.toString(),
        });

        const result = response.data;
  
        if (result?.success) {
          setSnackbarMessage("Password set successfully! Redirecting to login...");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
          setTimeout(() => router.push("/auth/login"), 2000);
        } else {
          setSnackbarMessage(result.message || "An error occurred.");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      } catch (error: any) {
        setSnackbarMessage(error.message || "An unexpected error occurred.");
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
            <form onSubmit={handleSetPassword} className="grid gap-4">
              <input type="hidden" name="csrf_token" value={csrfToken?.token || ""} />

              <div className="grid gap-2">
                <Label htmlFor="password">Enter Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  ref={passwordRef}
                  required
                  disabled={loading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="repassword">Re-enter Password</Label>
                <Input
                  id="repassword"
                  type="password"
                  placeholder="Re-enter your password"
                  ref={repasswordRef}
                  required
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting Password...
                  </>
                ) : (
                  "Set Password"
                )}
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
  
export default AuthSetPassword;
  
