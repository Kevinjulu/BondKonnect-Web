import { useRef, useState, useEffect, useCallback } from "react";

import { redirect, useRouter } from "next/navigation";
import { loginType,  } from "../../(dashboard)/types/auth/auth";

interface UserData {
  roles: UserRole[];
  email?: string;
  cookie?: string;
  leave_assignments?: any;
}
import CustomSnackbar from "../../(dashboard)/layouts/shared/snackbar/CustomSnackbar";

import { Button } from '@/components/ui/button';
import {Card,CardContent,CardDescription,CardHeader,CardTitle,} from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Icons } from "@/components/icons"
// import { CiUser } from "react-icons/ci";
import { BsBuildings } from "react-icons/bs";
import { IoPersonOutline } from "react-icons/io5";
// import { BsJournalBookmark } from "react-icons/bs";
import { SiBookstack } from "react-icons/si";
import { ShieldCheck } from "lucide-react";
// import { RiStockLine } from "react-icons/ri";
import { setActiveRole } from "@/lib/actions/api.actions";
// import { getCurrentUserDetails } from "@/lib/actions/user.check";
// const axios = require('@/utils/axios');

  // const user = await getCurrentUserDetails();
  // if (user) {
  //   redirect("/");
  // }

type Role = "individual" | "agent" | "corporate" | "broker" | "authorizeddealer" | "admin";

const SIGNUP_ROLES: UserRole[] = [
  { role_name: "admin" },
  { role_name: "individual" },
  { role_name: "agent" },
  { role_name: "corporate" },
  { role_name: "broker" },
  { role_name: "authorizeddealer" },
];

// New interfaces for better type safety
interface UserRole {
  role_name: string;
  permissions?: string[];
}

type CenteredCardsProps = {
  mode: "signup" | "signin";
  user_details: UserData;
};



const AuthRole = ({ icon, title, subtitle, socialauths, subtext, user_details, mode }: CenteredCardsProps & loginType) => {

  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<UserData | null>(user_details);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarTitle, setSnackbarTitle] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  // loading
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>("individual");

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

  // Enhanced persistRole with validation
  const persistRole = useCallback(async (
    role: string,
    systemId: number,
    cookie: string
  ) => {
    if (!cookie) {
      throw new Error("Authentication token missing");
    }

    try {
      localStorage.setItem("userRole", role);
      localStorage.setItem("lastActiveTime", Date.now().toString());
      console.log("Stored role:", localStorage.getItem("userRole"));
      console.log("Stored time:", localStorage.getItem("lastActiveTime"));
      const formData = new FormData();
      formData.append("role", systemId.toString());

      const response = await setActiveRole(formData, cookie);

      if (!response?.success) {
        throw new Error(response?.message || "Role activation failed");
      }

      return response;
    } catch (error) {
      console.error("Role persistence error:", error);
      throw error;
    }
  }, []);
  const handleClick = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    e.preventDefault();

    if (!selectedRole) {
      setSnackbarMessage("Please select a role");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }

    const role = selectedRole;
  

    try {
      if (mode === "signup") {
        router.push(`/admin/sign-up?role=${role}`);
        return;
      }

      if (!userDetails?.cookie) {
        throw new Error("Session expired. Please login again.");
      }

      // Map roles to system IDs
      const roleMapping = {
        admin: 1,
        individual: 2,
        agent: 3,
        corporate: 4,
        broker: 5,
        authorizeddealer: 6,
  
      };

      const systemId = roleMapping[role as keyof typeof roleMapping];
      const displayName = role; // Using the role name as display name

      const result = await persistRole(
        role,
        systemId,
        userDetails.cookie
      );

      if (result?.success) {
        // Store role info in cookies
        document.cookie = `userRole=${role}; path=/`;
        document.cookie = `roleSystemId=${systemId}; path=/`;
        document.cookie = `roleDisplayName=${displayName}; path=/`;

        setSnackbarMessage(`Successfully logged in as ${role}`);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        // Redirect after a short delay
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    } catch (error: any) {
      setSnackbarMessage("Failed to process role selection. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Role selection error:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedRole, mode, router, userDetails, setSnackbarMessage, setSnackbarSeverity, setSnackbarOpen, setLoading, persistRole]);
  
  useEffect(() => {
    const fetchUserRoles = async () => {
      if (mode !== "signin") {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const roles = user_details?.roles.map(
          (role: UserRole) => role.role_name
        );
        setUserRoles(roles);

        // Set initial selected role if available
        if (roles && roles.length > 0) {
          setSelectedRole(roles[0] as Role);
        }

        //If user has exactly one role, treat it as their role
        if (roles.length === 1) {
          console.log("Single role detected:", roles[0]);
          const roleCard = selectedRole === roles[0];
          if (roleCard) {
            // // If the single role is RM, load sponsors first
            // if (roles[0] === "relationshipmanager") {
            //   await loadRmSponsors(user_details.email, user_details.leave_assignments);
            // }
            setSnackbarMessage(
              `Redirecting to dashboard with ${roles[0]} role...`
            );
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            setTimeout(() => handleClick({ preventDefault: () => {} } as React.MouseEvent<HTMLButtonElement>), 1500);
          }
        }
      } catch (err) {
        setSnackbarMessage(
          "Failed to fetch user roles. Please try again later."
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);

        // setError("Failed to fetch user roles. Please try again later.");
        console.error("Role fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRoles();
  }, [mode, user_details, handleClick, selectedRole]);

  
  //   setLoading(true);
  //   e.preventDefault();

  //   const email = emailRef.current?.value || "";
  //   const password = passwordRef.current?.value || "";

  //   try {
  //     const formData = new FormData();
  //     formData.append("email", email);
  //     formData.append("password", password);

  //     const response = await fetchLogin(formData);

  //     if (!response) {
  //       setSnackbarMessage("system error");
  //       setSnackbarSeverity("error");
  //       setSnackbarOpen(true);
  //       setLoading(false);
  //       return;
  //     }

  //     if (response.success) {
  //       setSnackbarMessage("Login successful");
  //       setSnackbarSeverity('success');
  //       setSnackbarOpen(true);
  //       setTimeout(() => router.push(`/auth/auth1/otp?id=${response.data.login_id}`), 1500);
  //     } else {
  //       console.error("Login failed:", response);
  //       setSnackbarMessage(response.message);
  //       setSnackbarSeverity("error");
  //       setSnackbarOpen(true);
  //       setLoading(false);
  //       return;
  //     }
  //   } catch (error) {
  //     setSnackbarMessage("An error occurred during login");
  //     setSnackbarSeverity("error");
  //     setSnackbarOpen(true);
  //   }
  //   setLoading(false);
  // };




  // if (isLoading) {
  //   return (
  //     <div className="flex justify-center p-4">
  //       <Icons.spinner className="h-6 w-6 animate-spin" />
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <div className="m-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-destructive">
        {error}
      </div>
    );
  }


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
        {mode === "signin" && userRoles.length === 1 ? (
          <div className="flex flex-col items-center p-6 space-y-4">
            <Icons.spinner className="h-8 w-8 animate-spin" />
            <h3 className="text-lg font-semibold">
            Redirecting to dashboard...
            </h3>
            <p className="text-sm text-muted-foreground">
            You will be redirected to the main dashboard automatically
            </p>
          </div>
      ) : (    
          <div className="grid gap-4">
            <h3 className="text-lg font-semibold text-center">
            {mode === "signup" ? "Select registration role" : "Select your active role"}
            </h3>
            {socialauths}
            {socialauths ? (
              <div className="flex items-center gap-4">
                <span className="h-px w-full bg-input"></span>
                <span className="text-xs text-muted-foreground">OR</span>
                <span className="h-px w-full bg-input"></span>
              </div>
            ) : null}
        
            <RadioGroup 
              defaultValue={mode === "signup" ? SIGNUP_ROLES[0].role_name : (user_details.roles?.[0]?.role_name)} 
              className="grid grid-cols-3 gap-4 py-4" 
              onValueChange={(value) => setSelectedRole(value as Role)}
            >
              {(mode === "signup" ? SIGNUP_ROLES : (user_details.roles || [])).map((roleObj) => {
                const role = roleObj.role_name;
                const Icon = role === 'individual' ? IoPersonOutline : 
                             role === 'agent' ? BsBuildings : 
                             role === 'corporate' ? SiBookstack : 
                             role === 'broker' ? BsBuildings : // Using same for now
                             role === 'authorizeddealer' ? SiBookstack : // Using same for now
                             role === 'admin' ? ShieldCheck : 
                             IoPersonOutline;
                
                return (
                  <div key={role}>
                    <RadioGroupItem value={role} id={role} className="peer sr-only" />
                    <Label
                      htmlFor={role}
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Icon className="mb-3 h-6 w-6" />
                      <span className="capitalize">{role}</span>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
            {loading ? (
              <Button type="submit" className="w-full" color="primary" disabled>
              Loading...
              </Button>
            ) : (
              <Button type="submit" className="w-full" color="primary" onClick={handleClick}>
              Proceed
              </Button>
            )}
     
          </div>
        )}
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
  
  export default AuthRole;
  
