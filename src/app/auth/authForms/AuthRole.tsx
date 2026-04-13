import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { loginType } from "../../(dashboard)/types/auth/auth";
import CustomSnackbar from "../../(dashboard)/layouts/shared/snackbar/CustomSnackbar";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Icons } from "@/components/icons"
import { BsBuildings } from "react-icons/bs";
import { IoPersonOutline } from "react-icons/io5";
import { SiBookstack } from "react-icons/si";
import { ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { setActiveRole } from "@/lib/actions/api.actions";
import { AuthService } from "@/lib/auth-service";
import { cn } from "@/lib/utils";

type Role = "individual" | "agent" | "corporate" | "broker" | "authorizeddealer" | "admin";

interface UserRole {
  role_name: string;
  permissions?: string[];
}

interface UserData {
  roles: UserRole[];
  email?: string;
  cookie?: string;
  leave_assignments?: any;
}

const SIGNUP_ROLES: UserRole[] = [
  { role_name: "individual" },
  { role_name: "agent" },
  { role_name: "corporate" },
  { role_name: "broker" },
  { role_name: "authorizeddealer" },
];

const ROLE_DISPLAY_NAMES: Record<string, string> = {
  individual: "Individual",
  agent: "Agent",
  corporate: "Corporate",
  broker: "Broker",
  authorizeddealer: "Authorized Dealer",
  admin: "Admin"
};

type CenteredCardsProps = {
  mode: "signup" | "signin";
  user_details: UserData;
};

const AuthRole = ({ icon, title, subtitle, socialauths, subtext, user_details, mode }: CenteredCardsProps & loginType) => {
  const router = useRouter();
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>("individual");

  const persistRole = useCallback(async (role: string, systemId: number) => {
    try {
      // Use AuthService for role management
      AuthService.setUserRole(role);
      
      const formData = new FormData();
      formData.append("role", systemId.toString());
      const response = await setActiveRole(formData);
      if (!response?.success) throw new Error(response?.message || "Role activation failed");
      return response;
    } catch (error) {
      console.error("Role persistence error:", error);
      throw error;
    }
  }, []);

  const handleClick = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!selectedRole) {
      setSnackbarMessage("Please select a role");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }

    try {
      if (mode === "signup") {
        router.push(`/auth/sign-up?role=${selectedRole}`);
        return;
      }

      if (!user_details) throw new Error("Session expired. Please login again.");

      const roleMapping = {
        admin: 1, individual: 2, agent: 3, corporate: 4, broker: 5, authorizeddealer: 6
      };

      const systemId = roleMapping[selectedRole as keyof typeof roleMapping];
      const result = await persistRole(selectedRole, systemId);

      if (result?.success) {
        // AuthService handles the role cookie
        AuthService.setUserRole(selectedRole);
        
        // Handle roleSystemId separately if needed, though role is usually enough
        document.cookie = `roleSystemId=${systemId}; path=/; SameSite=Lax`;
        
        setSnackbarMessage(`Entering workstation as ${selectedRole}`);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setTimeout(() => router.push("/"), 1500);
      }
    } catch (error: any) {
      setSnackbarMessage("Failed to process selection. Try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  }, [selectedRole, mode, router, user_details, persistRole]);

  useEffect(() => {
    const initRoles = async () => {
      if (mode !== "signin") {
        setIsLoading(false);
        return;
      }
      const roles = user_details?.roles.map(r => r.role_name);
      setUserRoles(roles || []);
      if (roles?.length > 0) setSelectedRole(roles[0] as Role);
      setIsLoading(false);
    };
    initRoles();
  }, [mode, user_details]);

  return (
    <Card className="border-none shadow-none bg-transparent overflow-hidden">
      <CardHeader className="items-center pb-0 px-6 pt-6">
        <div className="flex flex-col items-center gap-1 group">
          <div className="relative">
            {icon}
            <div className="absolute -top-1 -right-1 size-4 bg-foreground rounded-full border-2 border-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Sparkles className="size-2 text-background" />
            </div>
          </div>
          <CardTitle className="text-2xl font-black tracking-tighter text-foreground leading-none mt-1 transition-colors">
            {title}
          </CardTitle>
          <CardDescription className="text-[13px] font-bold text-foreground opacity-60 tracking-tight text-center max-w-[280px]">
            {subtitle}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6 pt-6">
        {mode === "signin" && userRoles.length === 1 && !loading ? (
          <div className="flex flex-col items-center p-4 space-y-3 animate-in fade-in duration-500">
            <Icons.spinner className="size-6 animate-spin text-foreground" />
            <h3 className="text-sm font-black tracking-tighter uppercase text-center">Automated Handshake...</h3>
            <p className="text-[10px] font-bold text-foreground opacity-60">Entering workstation</p>
          </div>
        ) : (    
          <div className="grid gap-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {socialauths && (            
              <>
                {socialauths}
                <div className="flex items-center gap-3">
                  <span className="h-px w-full bg-border"></span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-foreground/40">OR</span>
                  <span className="h-px w-full bg-border"></span>
                </div>
              </>
            )}
        
            <RadioGroup 
              defaultValue={selectedRole} 
              className="grid grid-cols-3 gap-3" 
              onValueChange={(value) => setSelectedRole(value as Role)}
            >
              {(mode === "signup" ? SIGNUP_ROLES : (user_details.roles || [])).map((roleObj) => {
                const role = roleObj.role_name;
                const Icon = role === 'individual' ? IoPersonOutline : 
                             role === 'agent' ? BsBuildings : 
                             role === 'corporate' ? SiBookstack : 
                             role === 'broker' ? BsBuildings : 
                             role === 'authorizeddealer' ? SiBookstack : 
                             role === 'admin' ? ShieldCheck : IoPersonOutline;
                
                const isSelected = selectedRole === role;

                return (
                  <div key={role} className="relative">
                    <RadioGroupItem value={role} id={role} className="peer sr-only" />
                    <Label
                      htmlFor={role}
                      className={cn(
                        "flex flex-col items-center justify-center rounded-2xl border-2 p-2.5 min-h-[90px] cursor-pointer transition-all duration-300",
                        isSelected 
                          ? "border-foreground bg-foreground text-background shadow-md scale-[1.03] z-10" 
                          : "border-border bg-background text-foreground hover:border-foreground/20"
                      )}
                    >
                      <Icon className={cn("mb-2 size-5 transition-transform", isSelected && "scale-110")} />
                      <span className="text-[9px] font-black uppercase tracking-tighter text-center leading-tight">
                        {ROLE_DISPLAY_NAMES[role] || role}
                      </span>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>

            <Button 
              onClick={handleClick}
              disabled={loading}
              className="w-full h-11 mt-1 rounded-xl bg-foreground text-background hover:bg-foreground/90 shadow-md transition-all font-bold tracking-tight text-sm"
            >
              {loading ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {mode === "signup" ? "Proceed" : "Access Workstation"}
                  <ArrowRight className="ml-2 size-4" />
                </>
              )}
            </Button>
     
          </div>
        )}

        {subtext && (
            <div className="mt-6 pt-5 border-t border-border flex justify-center text-[13px] animate-in fade-in duration-1000">
              <div className="text-foreground font-bold">
                {subtext}
              </div>
            </div>
        )}
      </CardContent>

      <CustomSnackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        title="Access Control"
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </Card>
  );
};
  
export default AuthRole;

