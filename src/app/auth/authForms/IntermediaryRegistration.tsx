import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import CustomSnackbar from "../../(dashboard)/layouts/shared/snackbar/CustomSnackbar";
import { completeIntermediaryRegistration } from "@/app/lib/actions/api.actions";

interface IntermediaryRegistrationProps {
  icon?: React.ReactNode;
  title?: string;
  subtitle?: string;
  email: string;
  token: string;
  signature: string;
  is_reset: boolean;
//   csrfToken: string;
}

interface CsrfProps extends IntermediaryRegistrationProps {
    csrfToken?: { token: string; timestamp: number } | null;
  
  }
const IntermediaryRegistration = ({ 
  icon, 
  title, 
  subtitle,
  email,
  token,
  signature,
  is_reset,
  csrfToken
}: CsrfProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [base, setBase] = useState("");
  const [category, setCategory] = useState("");
  // const [isRes, setIsRes] = useState(false);

  // Form refs
//   const emailRef = useRef<HTMLInputElement>(null);
  const companyNameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  // const firstNameRef = useRef<HTMLInputElement>(null);
  // const otherNamesRef = useRef<HTMLInputElement>(null);
  // const cdsNumberRef = useRef<HTMLInputElement>(null);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {

          // Validate CSRF token first
          if (!csrfToken?.token) {
            setSnackbarMessage("Invalid session. Please refresh the page.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return;
          }
    e.preventDefault();
    setLoading(true);

    try {


      // const locality = base || "";
      const categoryType = category || "";
      const isBroker = categoryType === "broker";
      const isDealer = categoryType === "dealer";
    //   const email = emailRef.current?.value || "";
      // Prepare role-based fields


      const response = await completeIntermediaryRegistration({
  
        is_broker: isBroker || false,
        is_dealer: isDealer || false,
        email,
        token,
        signature,
        csrf_token: csrfToken?.token,   
        csrf_timestamp: csrfToken?.timestamp.toString(),
        company_name: companyNameRef.current?.value || "",
        phone: phoneRef.current?.value || "",
        // first_name: firstNameRef.current?.value || "",
        // other_names: otherNamesRef.current?.value || "",
        // cds_number: cdsNumberRef.current?.value || "",
        locality: base,
        category_type: category
      });

      if (response && response.success) {
        setSnackbarMessage("Registration completed successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        
        // Redirect to set password page after a short delay
        setTimeout(() => {
          router.push(`/auth/set-password?e=${email}&t=${token}&s=${signature}&is_res=${is_reset}`);
        }, 1500);
      } else {
        setSnackbarMessage(response?.message || "Registration failed. Please try again.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setSnackbarMessage("An error occurred. Please try again.");
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
            <div className="grid gap-2">
              <Label htmlFor="select">Select your locality</Label>
              <RadioGroup 
                onValueChange={(value) => setBase(value)}
                value={base}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="local" id="local" />
                  <Label htmlFor="local">Local</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="foreign" id="foreign" />
                  <Label htmlFor="foreign">Foreign</Label>
                </div>
              </RadioGroup>
            </div>

            {base === "foreign" && (
            <>
            <div className="grid gap-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                type="text"
                placeholder="e.g ABC Ltd"
                ref={companyNameRef}
                required
              />
            </div>


            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="text"
                placeholder="07** *** ***"
                ref={phoneRef}
                required
              />
            </div>

            {/* <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="abc@company.com"
                        ref={emailRef}
                        required
                      />
                      </div> */}


            </>
            )}    

            {base === "local" && (
              <div className="grid gap-2">
                <Label htmlFor="category">Select your category</Label>
                <RadioGroup 
                  onValueChange={(value) => setCategory(value)}
                  value={category}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="broker" id="broker" />
                    <Label htmlFor="broker">Broker</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dealer" id="dealer" />
                    <Label htmlFor="dealer">Authorized Dealer</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

        {(category === "broker" || category === "dealer") && (
            <>
            <div className="grid gap-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                type="text"
                placeholder="e.g ABC Ltd"
                ref={companyNameRef}
                required
              />
            </div>

            {/* <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="e.g John"
                ref={firstNameRef}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="otherNames">Other Names</Label>
              <Input
                id="otherNames"
                type="text"
                placeholder="e.g Doe"
                ref={otherNamesRef}
                required
              />
            </div> */}

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="text"
                placeholder="07** *** ***"
                ref={phoneRef}
                required
              />
            </div>

            {/* <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="abc@company.com"
                        ref={emailRef}
                        required
                      />
                      </div> */}
            {/* <div className="grid gap-2">
              <Label htmlFor="cds">CDS Number</Label>
              <Input
                id="cds"
                type="text"
                placeholder="e.g 000000123456"
                ref={cdsNumberRef}
                required
              />
            </div> */}
        </>
        )}
            <Button type="submit" className="w-full mt-4" disabled={!base || (base === "local" && !category) || loading}>
              {loading ? "Loading..." : "Complete Registration"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <CustomSnackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </>
  );
};

export default IntermediaryRegistration; 
