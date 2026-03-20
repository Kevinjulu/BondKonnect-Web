import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginType } from "../../(dashboard)/types/auth/auth";
import CustomSnackbar from "../../(dashboard)/layouts/shared/snackbar/CustomSnackbar";
import { Check, ChevronsUpDown, ArrowRight, ArrowLeft, X, Building2, Globe, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {  
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from "@/components/ui/checkbox";
import axios from "@/utils/axios";
import { getBaseApiUrl } from "@/lib/utils/url-resolver";
import { getAllBrokersAndDealers } from "@/lib/actions/api.actions";
import { getCurrentUserDetails } from "@/lib/actions/user.check";
import { Badge } from "@/components/ui/badge";

interface BrokerDealer {
  Id: number;
  Email: string;
  FirstName: string;
  OtherNames: string;
  CompanyName: string | null;
}

interface BrokerDealerOption {
  value: string;
  label: string;
}

const AuthSignUp = ({ icon, title, subtitle, role = "individual", subtext }: loginType) => {
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);
  const [base, setBase] = useState("");
  const [category, setCategory] = useState("");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [selectedAlternateValues, setSelectedAlternateValues] = useState<string[]>([]);
  const [newDealerInputs, setNewDealerInputs] = useState<string[]>(['']);
  const [brokerDealerOptions, setBrokerDealerOptions] = useState<BrokerDealerOption[]>([]);
  const [loadingBrokers, setLoadingBrokers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [errors, setErrors] = useState<any>({});
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarTitle, setSnackbarTitle] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const companyNameRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const otherNamesRef = useRef<HTMLInputElement>(null);
  const cdsNumberRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const result = await getCurrentUserDetails();
      if (result) router.push("/");
    };
    checkUser();
  }, [router]);

  useEffect(() => {
    const fetchBrokersAndDealers = async () => {
      setLoadingBrokers(true);
      try {
        const response = await getAllBrokersAndDealers();
        if (response?.success && response.data) {
          const options = response.data.map((broker: BrokerDealer) => ({
            value: broker.Email,
            label: `${broker.FirstName} ${broker.OtherNames} (${broker.Email})`
          }));
          setBrokerDealerOptions(options);
        }
      } catch (error) {
        console.error("Error fetching brokers:", error);
      } finally {
        setLoadingBrokers(false);
      }
    };
    fetchBrokersAndDealers();
  }, []);

  const handleSignUp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const API = getBaseApiUrl();
      if (!API) throw new Error("API URL is not configured.");

      const baseUrl = API.split('/api')[0];
      await fetch(`${baseUrl}/sanctum/csrf-cookie`, { credentials: 'include' });

      const response = await axios.post('/V1/auth/user-register', {
        is_individual: role === "individual",
        is_agent: role === "agent",
        is_corporate: role === "corporate",
        is_broker: category === "broker",
        is_dealer: category === "dealer",
        email: emailRef.current?.value || "",
        phone: phoneRef.current?.value || "",
        company_name: companyNameRef.current?.value || "",
        first_name: firstNameRef.current?.value || "",
        other_names: otherNamesRef.current?.value || "",
        cds_number: cdsNumberRef.current?.value || "",
        broker_dealer: selectedValues,
        locality: base,
        category_type: category,
        alternate_dealer: selectedAlternateValues,
        new_dealer_emails: newDealerInputs.filter(e => e.trim() !== ""),
      });

      const result = response.data;

      if (result.success) {
        setSnackbarTitle("Success");
        setSnackbarMessage("Account created successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setTimeout(() => router.push("/auth/success"), 1500);
      } else {
        setErrors(result.errors || {});
        setSnackbarMessage(result.message || "Registration failed");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        if (result.errors?.first_name || result.errors?.email || result.errors?.phone) {
            setStep(1);
        }
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || "An unexpected error occurred";
      setErrors(error?.data?.errors || {});
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, label: "Identity" },
    { id: 2, label: "Professional" },
    { id: 3, label: "Finalize" }
  ];

  return (
    <Card className="border-none shadow-none bg-transparent overflow-hidden">
      <CardHeader className="items-center pb-0 px-8 pt-8 relative">
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
        
        {/* Semantic Stepper Indicator */}
        <div className="flex w-full items-center justify-center gap-4 mt-10">
          {steps.map((s, idx) => (
            <div key={s.id} className="flex items-center">
              <div 
                className={cn(
                  "relative h-1.5 rounded-full transition-all duration-500 ease-out",
                  step === s.id ? "bg-foreground w-20 ring-4 ring-foreground/5" : "bg-border w-10",
                  step > s.id && "bg-foreground/30"
                )} 
              />
              {idx < steps.length - 1 && (
                <div className="w-1 h-1 rounded-full bg-border mx-1" />
              )}
            </div>
          ))}
        </div>
        
        {/* Step Label */}
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground mt-4 h-4 transition-colors">
          Step {step}: {steps.find(s => s.id === step)?.label}
        </p>
      </CardHeader>

      <CardContent className="px-8 pb-8 pt-6">
        <div className="grid gap-6">
          
          {/* STEP 1: IDENTITY */}
          {step === 1 && (
            <div className="grid gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
              {role === "corporate" && (
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    onClick={() => setBase("local")}
                    className={cn(
                      "group p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex flex-col items-center gap-3",
                      base === "local" ? "border-foreground bg-foreground text-background shadow-lg scale-[1.02]" : "border-border hover:border-foreground/20"
                    )}
                  >
                    <div className={cn("size-10 rounded-xl flex items-center justify-center transition-colors", base === "local" ? "bg-background text-foreground" : "bg-muted text-foreground group-hover:bg-accent")}>
                      <Building2 className="size-5" />
                    </div>
                    <span className={cn("text-xs font-black uppercase tracking-tighter", base === "local" ? "text-background" : "text-foreground")}>Local Corp</span>
                  </div>
                  <div 
                    onClick={() => setBase("foreign")}
                    className={cn(
                      "group p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex flex-col items-center gap-3",
                      base === "foreign" ? "border-foreground bg-foreground text-background shadow-lg scale-[1.02]" : "border-border hover:border-foreground/20"
                    )}
                  >
                    <div className={cn("size-10 rounded-xl flex items-center justify-center transition-colors", base === "foreign" ? "bg-background text-foreground" : "bg-muted text-foreground group-hover:bg-accent")}>
                      <Globe className="size-5" />
                    </div>
                    <span className={cn("text-xs font-black uppercase tracking-tighter", base === "foreign" ? "text-background" : "text-foreground")}>Foreign Corp</span>
                  </div>
                </div>
              )}

              {(role !== "corporate" || base !== "") && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    {role === "individual" ? (
                      <>
                        <div className="grid gap-2">
                          <Label htmlFor="firstName" className="text-[10px] font-black uppercase tracking-widest text-foreground opacity-70">First Name</Label>
                          <Input id="firstName" placeholder="John" ref={firstNameRef} className="h-12 rounded-xl border-border bg-background text-foreground font-bold placeholder:text-foreground/40 focus:ring-foreground focus:border-foreground transition-all shadow-sm" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="otherNames" className="text-[10px] font-black uppercase tracking-widest text-foreground opacity-70">Other Names</Label>
                          <Input id="otherNames" placeholder="Doe" ref={otherNamesRef} className="h-12 rounded-xl border-border bg-background text-foreground font-bold placeholder:text-foreground/40 focus:ring-foreground focus:border-foreground transition-all shadow-sm" />
                        </div>
                      </>
                    ) : (
                      <div className="grid gap-2 col-span-2">
                        <Label htmlFor="companyName" className="text-[10px] font-black uppercase tracking-widest text-foreground opacity-70">Company Name</Label>
                        <Input id="companyName" placeholder="e.g Acme Corp" ref={companyNameRef} className="h-12 rounded-xl border-border bg-background text-foreground font-bold placeholder:text-foreground/40 focus:ring-foreground focus:border-foreground transition-all shadow-sm" />
                      </div>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-foreground opacity-70">Email Address</Label>
                    <Input id="email" type="email" placeholder="abc@company.com" ref={emailRef} className={cn("h-12 rounded-xl border-border bg-background text-foreground font-bold placeholder:text-foreground/40 focus:ring-foreground focus:border-foreground transition-all shadow-sm", errors.email && "border-destructive")} />
                    {errors.email && <p className="text-[10px] text-destructive font-bold uppercase tracking-tight mt-1">{errors.email[0]}</p>}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-foreground opacity-70">Phone Number</Label>
                    <Input id="phone" placeholder="07** *** ***" ref={phoneRef} className="h-12 rounded-xl border-border bg-background text-foreground font-bold placeholder:text-foreground/40 focus:ring-foreground focus:border-foreground transition-all shadow-sm" />
                  </div>

                  <Button onClick={() => setStep(2)} className="w-full h-12 mt-2 rounded-xl bg-foreground text-background hover:bg-foreground/90 transition-all font-bold tracking-tight">
                    Next Step
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </>
              )}
            </div>
          )}

          {/* STEP 2: PROFESSIONAL */}
          {step === 2 && (
            <div className="grid gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="grid gap-2">
                <Label htmlFor="cds" className="text-[10px] font-black uppercase tracking-widest text-foreground opacity-70">CDS Number</Label>
                <Input id="cds" placeholder="000000123456" ref={cdsNumberRef} className="h-12 rounded-xl border-border bg-background text-foreground font-bold placeholder:text-foreground/40 focus:ring-foreground focus:border-foreground transition-all shadow-sm" />
              </div>

              <div className="grid gap-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-foreground opacity-70">Select Broker (Max 5)</Label>
                {selectedValues.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-1 animate-in zoom-in-95 duration-300">
                    {selectedValues.map(v => (
                      <Badge key={v} variant="secondary" className="text-[11px] py-1 pl-3 pr-1 bg-foreground text-background border-none rounded-lg font-bold">
                        {v.split('@')[0]}
                        <div 
                          className="ml-2 p-0.5 rounded-full hover:bg-background/20 cursor-pointer transition-colors"
                          onClick={() => setSelectedValues(prev => prev.filter(x => x !== v))}
                        >
                          <X className="size-3" />
                        </div>
                      </Badge>
                    ))}
                  </div>
                )}
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full h-12 justify-between rounded-xl border-border bg-background text-foreground hover:bg-accent transition-all text-sm font-bold">
                      {selectedValues.length > 0 ? `${selectedValues.length} Selected` : "Search to connect..."}
                      <ChevronsUpDown className="size-4 text-foreground shrink-0" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl border-border shadow-2xl overflow-hidden bg-popover" align="start">
                    <Command className="rounded-none bg-transparent">
                      <CommandInput placeholder="Type broker name..." className="h-11 border-none focus:ring-0 bg-transparent text-foreground" />
                      <CommandList className="max-h-60 overflow-y-auto">
                        <CommandEmpty className="p-4 text-sm text-foreground">No matching entities found.</CommandEmpty>
                        <CommandGroup className="p-1">
                          {brokerDealerOptions.map((opt) => (
                            <CommandItem
                              key={opt.value}
                              onSelect={() => {
                                setSelectedValues(prev => 
                                  prev.includes(opt.value) 
                                    ? prev.filter(x => x !== opt.value) 
                                    : prev.length < 5 ? [...prev, opt.value] : prev
                                );
                              }}
                              className="rounded-lg py-2 transition-colors cursor-pointer text-foreground aria-selected:bg-foreground aria-selected:text-background"
                            >
                              <div className={cn("size-4 border rounded mr-3 flex items-center justify-center transition-colors", selectedValues.includes(opt.value) ? "bg-background border-background" : "border-border")}>
                                <Check className={cn("size-3 text-foreground transition-opacity", selectedValues.includes(opt.value) ? "opacity-100" : "opacity-0")} />
                              </div>
                              <span className="text-sm font-bold">{opt.label}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex gap-4 mt-2">
                <Button variant="ghost" onClick={() => setStep(1)} className="h-12 flex-1 rounded-xl text-foreground font-black tracking-tight hover:bg-accent transition-colors">
                  <ArrowLeft className="mr-2 size-4" /> Back
                </Button>
                <Button onClick={() => setStep(3)} className="h-12 flex-[2] rounded-xl bg-foreground text-background hover:bg-foreground/90 shadow-lg transition-all font-bold tracking-tight">
                  Continue
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: FINALIZE */}
          {step === 3 && (
            <div className="grid gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="p-6 rounded-[24px] border-2 border-border bg-background space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="size-2 rounded-full bg-foreground" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Verification Summary</p>
                </div>
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <span className="text-foreground font-bold opacity-60">Identity Mode</span>
                  <span className="text-right font-black uppercase tracking-tighter text-foreground">{role}</span>
                  
                  <span className="text-foreground font-bold opacity-60">Entity Primary</span>
                  <span className="text-right font-black tracking-tighter text-foreground truncate pl-4">
                    {firstNameRef.current?.value || companyNameRef.current?.value}
                  </span>
                  
                  <span className="text-foreground font-bold opacity-60">Connections</span>
                  <span className="text-right font-black tracking-tighter text-foreground">{selectedValues.length} Linked</span>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-foreground/5 border border-border transition-colors hover:bg-foreground/10">
                <Checkbox 
                  id="terms" 
                  checked={isChecked} 
                  onCheckedChange={(c) => setIsChecked(!!c)} 
                  className="mt-1 border-foreground data-[state=checked]:bg-foreground data-[state=checked]:border-foreground" 
                />
                <label htmlFor="terms" className="text-xs text-foreground leading-relaxed font-bold">
                  I acknowledge that I have read and agree to the <Link href="/auth/terms" className="text-foreground font-black underline underline-offset-2 hover:bg-foreground hover:text-background transition-all">Terms of Service</Link> and <Link href="/auth/privacy" className="text-foreground font-black underline underline-offset-2 hover:bg-foreground hover:text-background transition-all">Privacy Policy</Link>.
                </label>
              </div>

              <div className="flex gap-4 mt-2">
                <Button variant="ghost" onClick={() => setStep(2)} className="h-12 flex-1 rounded-xl text-foreground font-black tracking-tight hover:bg-accent transition-colors" disabled={loading}>
                  Back
                </Button>
                <Button onClick={handleSignUp} className="h-12 flex-[2] rounded-xl bg-foreground text-background hover:bg-foreground/90 shadow-xl transition-all font-bold tracking-tight" disabled={!isChecked || loading}>
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="size-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : "Complete Registration"}
                </Button>
              </div>
            </div>
          )}

          {subtext && (
            <div className="mt-6 pt-6 border-t border-border flex justify-center animate-in fade-in duration-1000">
              <div className="text-foreground font-bold">
                {subtext}
              </div>
            </div>
          )}
        </div>
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

export default AuthSignUp;
