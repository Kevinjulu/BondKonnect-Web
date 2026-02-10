import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { loginType } from "../../(dashboard)/types/auth/auth";
import CustomSnackbar from "../../(dashboard)/layouts/shared/snackbar/CustomSnackbar";
import { Check, ChevronsUpDown } from "lucide-react"
import { Globe, UserRound } from 'lucide-react';
import { cn } from "@/lib/utils"
import { Button } from '@/components/ui/button';
import {Card,CardContent,CardDescription,CardHeader,CardTitle,} from '@/components/ui/card';
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// const axios = require('@/utils/axios');
import { register } from "@/lib/actions/auth.actions";
import { getAllBrokersAndDealers } from "@/lib/actions/api.actions";
import { getCurrentUserDetails } from "@/lib/actions/user.check";
import { Loader2 } from "lucide-react";

// Define interface for broker/dealer data
interface BrokerDealer {
  Id: number;
  Email: string;
  FirstName: string;
  OtherNames: string;
  CompanyName: string | null;
  PhoneNumber: string;
  UserName: string | null;
  AccountId: string;
  CdsNo: string;
  Roles: Array<{
    Id: number;
    RoleName: string;
    RoleDescription: string;
  }>;
}

// Define interface for broker/dealer option
interface BrokerDealerOption {
  value: string;
  label: string;
}

const AuthSignUp = ({ icon, title, subtitle, role = "", socialauths,subtext, }: loginType) => {

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [base, setBase] = useState("");
  const [category, setCategory] = useState("");
  
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [selectedAlternateValues, setSelectedAlternateValues] = useState<string[]>([]);
  const [newDealerInputs, setNewDealerInputs] = useState<string[]>(['']);
  
  // State for broker/dealer options
  const [brokerDealerOptions, setBrokerDealerOptions] = useState<BrokerDealerOption[]>([]);
  const [loadingBrokers, setLoadingBrokers] = useState(false);

  const handleNewDealerInputChange = (index: number, value: string) => {
    const newInputs = [...newDealerInputs];
    newInputs[index] = value;
    setNewDealerInputs(newInputs);
  };

  const addNewDealerInput = () => {
    setNewDealerInputs([...newDealerInputs, '']);
  };

    const emailRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);
    const companyNameRef = useRef<HTMLInputElement>(null);
    const firstNameRef = useRef<HTMLInputElement>(null);
    const otherNamesRef = useRef<HTMLInputElement>(null);
    const cdsNumberRef = useRef<HTMLInputElement>(null);
    const localityRef = useRef<HTMLInputElement>(null);
    const categoryTypeRef = useRef<HTMLInputElement>(null);

   // Get selected brokers and new dealer emails for foreign corporate
   const brokerDealerRef: string[] = selectedValues;   //for individual
   const alternateDealerRef: string[] = selectedAlternateValues;;
   const newDealerEmails: string[] = newDealerInputs.filter(email => email.trim() !== ""); //for individual
    
    const router = useRouter();
  
      // Snackbar state
      const [snackbarOpen, setSnackbarOpen] = useState(false);
      const [snackbarTitle, setSnackbarTitle] = useState("");
      const [snackbarMessage, setSnackbarMessage] = useState("");
      const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
    // loading
    const [loading, setLoading] = useState(false);
    const [isChecked, setIsChecked] = useState(false); // State to track checkbox
    const [errors, setErrors] = useState<any>({});


    const handleCheckboxChange = (checked: boolean) => {
        setIsChecked(checked);
      };
      
      useEffect(() => {
        const checkUser = async () => {
          const result = await getCurrentUserDetails();
          if (result) {
            router.push("/");
          }
        };
        checkUser();
      }, [router]);
      
      // Fetch brokers and dealers on component mount
      useEffect(() => {
        const fetchBrokersAndDealers = async () => {
          setLoadingBrokers(true);
          try {
            const response = await getAllBrokersAndDealers();
            if (response && response.success && response.data) {
              const options = response.data.map((broker: BrokerDealer) => ({
                value: broker.Email,
                label: `${broker.FirstName} ${broker.OtherNames} (${broker.Email})`
              }));
              setBrokerDealerOptions(options);
            }
          } catch (error) {
            console.error("Error fetching brokers and dealers:", error);
          } finally {
            setLoadingBrokers(false);
          }
        };
        
        fetchBrokersAndDealers();
      }, []);
  
  
    const handleSnackbarClose = () => {
      setSnackbarOpen(false);
    };
  
    const handleSignUp = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setErrors({});
      setLoading(true);
  
      try {
        const email = emailRef.current?.value || "";
        const phone = phoneRef.current?.value || "";
        const companyName = companyNameRef.current?.value || "";
        const firstName = firstNameRef.current?.value || "";
        const otherNames = otherNamesRef.current?.value || "";
        const cdsNumber = cdsNumberRef.current?.value || "";
        const locality = base || "";
        const categoryType = category || "";
        const isBroker = categoryType === "broker";
        const isDealer = categoryType === "dealer";

        // Call register function with necessary data
        const response = await register({
          is_individual: role === "individual",
          is_agent: role === "agent",
          is_corporate: role === "corporate",
          is_broker: isBroker,
          is_dealer: isDealer,
          is_admin: role === "admin",
          email,
          phone,
          company_name: companyName,
          first_name: firstName,
          other_names: otherNames,
          cds_number: cdsNumber,
          broker_dealer: brokerDealerRef,
          locality: locality,
          category_type: categoryType,
          alternate_dealer: alternateDealerRef,
          new_dealer_emails: newDealerEmails,
        });
  
        if (response.success) {
          setSnackbarTitle("Account Created");
          setSnackbarMessage("Registration successful! Redirecting...");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
          
          setTimeout(() => {
            router.push("/auth/success");
          }, 1500);
        } else {
          setErrors(response.errors || {});
          setSnackbarTitle("Registration Failed");
          setSnackbarMessage(response.message || "Please correct the highlighted errors.");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      } catch (error) {
        setSnackbarTitle("Error");
        setSnackbarMessage("An unexpected error occurred. Please try again.");
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
              {/* Dynamic form fields based on role and selections */}
                {role === "individual" && (
                <>
                  <div className="grid gap-2">
                  <Label htmlFor="firstName" className={errors.first_name ? "text-red-500" : ""}>First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="e.g John"
                    ref={firstNameRef}
                    required
                    className={errors.first_name ? "border-red-500" : ""}
                  />
                  {errors.first_name && <p className="text-[10px] font-bold text-red-500 uppercase">{errors.first_name[0]}</p>}
                  </div>
                  <div className="grid gap-2">
                  <Label htmlFor="otherNames" className={errors.other_names ? "text-red-500" : ""}>Other Names</Label>
                  <Input
                    id="otherNames" 
                    type="text"
                    placeholder="e.g Doe"
                    ref={otherNamesRef}
                    required
                    className={errors.other_names ? "border-red-500" : ""}
                  />
                  {errors.other_names && <p className="text-[10px] font-bold text-red-500 uppercase">{errors.other_names[0]}</p>}
                  </div>
                  <div className="grid gap-2">
                  <Label htmlFor="email" className={errors.email ? "text-red-500" : ""}>Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="abc@company.com"
                    ref={emailRef}
                    required
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-[10px] font-bold text-red-500 uppercase">{errors.email[0]}</p>}
                  </div>
                  <div className="grid gap-2">
                  <Label htmlFor="phone" className={errors.phone ? "text-red-500" : ""}>Phone Number</Label>
                  <Input
                    id="phone"
                    type="text"
                    placeholder="07** *** ***"
                    ref={phoneRef}
                    required
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && <p className="text-[10px] font-bold text-red-500 uppercase">{errors.phone[0]}</p>}
                  </div>
                  <div className="grid gap-2">
                  <Label htmlFor="cds" className={errors.cds_number ? "text-red-500" : ""}>CDS Number</Label>
                  <Input
                    id="cds"
                    type="text"
                    placeholder="e.g 000000123456"
                    ref={cdsNumberRef}
                    required
                    className={errors.cds_number ? "border-red-500" : ""}
                  />
                  {errors.cds_number && <p className="text-[10px] font-bold text-red-500 uppercase">{errors.cds_number[0]}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="select">Select Broker/Dealer (Max 5)</Label>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                      <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-[330px] justify-between"
                      >
                      {selectedValues?.length > 0
                        ? `${selectedValues.length} selected`
                        : "Select brokers..."}
                      <ChevronsUpDown className="opacity-50" />
                      </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                      <Command>
                      <CommandInput placeholder="Search Broker..." className="h-9" />
                      <CommandList>
                      <CommandEmpty>No Broker found.</CommandEmpty>
                      <CommandGroup>
                        {loadingBrokers ? (
                          <div className="p-2 text-center">Loading brokers...</div>
                        ) : (
                          brokerDealerOptions.map((broker) => (
                            <CommandItem
                              key={broker.value}
                              value={broker.value}
                              onSelect={(currentValue) => {
                                const newSelected = selectedValues.includes(currentValue)
                                  ? selectedValues.filter(val => val !== currentValue)
                                  : selectedValues.length < 5
                                    ? [...selectedValues, currentValue]
                                    : selectedValues;
                                setSelectedValues(newSelected);
                              }}
                            >
                              {broker.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  selectedValues.includes(broker.value) ? "opacity-100" : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))
                        )}
                      </CommandGroup>
                      </CommandList>
                      </Command>
                      </PopoverContent>
                    </Popover>
                    </div>

                    <div className="grid gap-2">
                      <Label>Can&apos;t find broker/dealer?</Label>
                      {newDealerInputs.map((input, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                        type="email"
                        placeholder="Enter broker email"
                        value={input}
                        onChange={(e) => handleNewDealerInputChange(index, e.target.value)}
                        />
                        {index === newDealerInputs.length - 1 && index < 4 && (
                        <Button
                          variant="outline"
                          onClick={addNewDealerInput}
                          type="button"
                        >
                          +
                        </Button>
                        )}
                      </div>
                      ))}
                    </div>
                </>
                )}

                {role === "agent" && (
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
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@company.com"
                    ref={emailRef}
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
                  <div className="grid gap-2">
                    <Label htmlFor="select">Select Broker/Dealer (Max 5)</Label>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                      <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-[330px] justify-between"
                      >
                      {selectedValues?.length > 0
                        ? `${selectedValues.length} selected`
                        : "Select brokers..."}
                      <ChevronsUpDown className="opacity-50" />
                      </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                      <Command>
                      <CommandInput placeholder="Search broker..." className="h-9" />
                      <CommandList>
                      <CommandEmpty>No broker found.</CommandEmpty>
                      <CommandGroup>
                        {loadingBrokers ? (
                          <div className="p-2 text-center">Loading brokers...</div>
                        ) : (
                          brokerDealerOptions.map((broker) => (
                            <CommandItem
                              key={broker.value}
                              value={broker.value}
                              onSelect={(currentValue) => {
                                const newSelected = selectedValues.includes(currentValue)
                                  ? selectedValues.filter(val => val !== currentValue)
                                  : selectedValues.length < 5
                                    ? [...selectedValues, currentValue]
                                    : selectedValues;
                                setSelectedValues(newSelected);
                              }}
                            >
                              {broker.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  selectedValues.includes(broker.value) ? "opacity-100" : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))
                        )}
                      </CommandGroup>
                      </CommandList>
                      </Command>
                      </PopoverContent>
                    </Popover>
                    </div>

                    <div className="grid gap-2">
                      <Label>Can&apos;t find broker/dealer?</Label>
                      {newDealerInputs.map((input, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                        type="email"
                        placeholder="Enter broker email"
                        value={input}
                        onChange={(e) => handleNewDealerInputChange(index, e.target.value)}
                        />
                        {index === newDealerInputs.length - 1 && index < 4 && (
                        <Button
                          variant="outline"
                          onClick={addNewDealerInput}
                          type="button"
                        >
                          +
                        </Button>
                        )}
                      </div>
                      ))}
                    </div>
                </>
                )}

                {role === "corporate" && (
                <div className="grid gap-2">
                  <Label htmlFor="select">Select your locality</Label>
                  <RadioGroup 
                  onValueChange={(value) => {
                    setBase(value);
                    if (localityRef.current) {
                    localityRef.current.value = value;
                    }
                  }}
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
                    <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="abc@company.com"
                      ref={emailRef}
                      required
                    />
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="select">Select Broker/Dealer (Max 5)</Label>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                      <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-[330px] justify-between"
                      >
                      {selectedValues?.length > 0
                        ? `${selectedValues.length} selected`
                        : "Select brokers..."}
                      <ChevronsUpDown className="opacity-50" />
                      </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                      <Command>
                      <CommandInput placeholder="Search broker..." className="h-9" />
                      <CommandList>
                      <CommandEmpty>No broker found.</CommandEmpty>
                      <CommandGroup>
                        {loadingBrokers ? (
                          <div className="p-2 text-center">Loading brokers...</div>
                        ) : (
                          brokerDealerOptions.map((broker) => (
                            <CommandItem
                              key={broker.value}
                              value={broker.value}
                              onSelect={(currentValue) => {
                                const newSelected = selectedValues.includes(currentValue)
                                  ? selectedValues.filter(val => val !== currentValue)
                                  : selectedValues.length < 5
                                    ? [...selectedValues, currentValue]
                                    : selectedValues;
                                setSelectedValues(newSelected);
                              }}
                            >
                              {broker.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  selectedValues.includes(broker.value) ? "opacity-100" : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))
                        )}
                      </CommandGroup>
                      </CommandList>
                      </Command>
                      </PopoverContent>
                    </Popover>
                    </div>

                    <div className="grid gap-2">
                      <Label>Can&apos;t find broker/dealer?</Label>
                      {newDealerInputs.map((input, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                        type="email"
                        placeholder="Enter broker email"
                        value={input}
                        onChange={(e) => handleNewDealerInputChange(index, e.target.value)}
                        />
                        {index === newDealerInputs.length - 1 && index < 4 && (
                        <Button
                          variant="outline"
                          onClick={addNewDealerInput}
                          type="button"
                        >
                          +
                        </Button>
                        )}
                      </div>
                      ))}
                    </div>
                  </>
                  )}

                  {base === "local" && (
                  <div className="grid gap-2">
                    <Label htmlFor="category">Select your category</Label>
                    <RadioGroup 
                    onValueChange={(value) => {
                      setCategory(value);
                      if (categoryTypeRef.current) {
                      categoryTypeRef.current.value = value;
                      }
                    }}
                    >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="broker" id="broker" />
                      <Label htmlFor="broker">Broker</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dealer" id="dealer" />
                      <Label htmlFor="dealer">Authorized Dealer</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                    </RadioGroup>

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
                      <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="abc@company.com"
                        ref={emailRef}
                        required
                      />
                      </div>
                      <div className="grid gap-2">
                    <Label htmlFor="select">Select Alternate Dealer (Max 5)</Label>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                      <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-[330px] justify-between"
                      >
                      {selectedAlternateValues?.length > 0
                        ? `${selectedAlternateValues.length} selected`
                        : "Select dealer..."}
                      <ChevronsUpDown className="opacity-50" />
                      </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                      <Command>
                      <CommandInput placeholder="Search dealer..." className="h-9" />
                      <CommandList>
                      <CommandEmpty>No dealer found.</CommandEmpty>
                      <CommandGroup>
                        {loadingBrokers ? (
                          <div className="p-2 text-center">Loading dealers...</div>
                        ) : (
                          brokerDealerOptions.map((dealer) => (
                            <CommandItem
                              key={dealer.value}
                              value={dealer.value}
                              onSelect={(currentAlternateValue) => {
                                const newSelected = selectedAlternateValues.includes(currentAlternateValue)
                                  ? selectedAlternateValues.filter(val => val !== currentAlternateValue)
                                  : selectedAlternateValues.length < 5
                                    ? [...selectedAlternateValues, currentAlternateValue]
                                    : selectedAlternateValues;
                                setSelectedAlternateValues(newSelected);
                              }}
                            >
                              {dealer.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  selectedAlternateValues.includes(dealer.value) ? "opacity-100" : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))
                        )}
                      </CommandGroup>
                      </CommandList>
                      </Command>
                      </PopoverContent>
                    </Popover>
                    </div>

                    <div className="grid gap-2">
                      <Label>Can&apos;t find alternate dealer?</Label>
                      {newDealerInputs.map((input, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                        type="email"
                        placeholder="Enter dealer email"
                        value={input}
                        onChange={(e) => handleNewDealerInputChange(index, e.target.value)}
                        />
                        {index === newDealerInputs.length - 1 && index < 4 && (
                        <Button
                          variant="outline"
                          onClick={addNewDealerInput}
                          type="button"
                        >
                          +
                        </Button>
                        )}
                      </div>
                      ))}
                    </div>
                    </>
                    )}

                    {category === "other" && (
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
                      <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="abc@company.com"
                        ref={emailRef}
                        required
                      />
                      </div>
                      <div className="grid gap-2">
                    <Label htmlFor="select">Select Broker/Dealer (Max 5)</Label>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                      <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-[330px] justify-between"
                      >
                      {selectedValues?.length > 0
                        ? `${selectedValues.length} selected`
                        : "Select brokers..."}
                      <ChevronsUpDown className="opacity-50" />
                      </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                      <Command>
                      <CommandInput placeholder="Search broker..." className="h-9" />
                      <CommandList>
                      <CommandEmpty>No broker found.</CommandEmpty>
                      <CommandGroup>
                        {loadingBrokers ? (
                          <div className="p-2 text-center">Loading brokers...</div>
                        ) : (
                          brokerDealerOptions.map((broker) => (
                            <CommandItem
                              key={broker.value}
                              value={broker.value}
                              onSelect={(currentValue) => {
                                const newSelected = selectedValues.includes(currentValue)
                                  ? selectedValues.filter(val => val !== currentValue)
                                  : selectedValues.length < 5
                                    ? [...selectedValues, currentValue]
                                    : selectedValues;
                                setSelectedValues(newSelected);
                              }}
                            >
                              {broker.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  selectedValues.includes(broker.value) ? "opacity-100" : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))
                        )}
                      </CommandGroup>
                      </CommandList>
                      </Command>
                      </PopoverContent>
                    </Popover>
                    </div>

                    <div className="grid gap-2">
                      <Label>Can&apos;t find broker/dealer?</Label>
                      {newDealerInputs.map((input, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                        type="email"
                        placeholder="Enter broker email"
                        value={input}
                        onChange={(e) => handleNewDealerInputChange(index, e.target.value)}
                        />
                        {index === newDealerInputs.length - 1 && index < 4 && (
                        <Button
                          variant="outline"
                          onClick={addNewDealerInput}
                          type="button"
                        >
                          +
                        </Button>
                        )}
                      </div>
                      ))}
                    </div>
                    </>
                    )}
                  </div>
                  )}
                </div>
                )}
                {(role === "individual" || role === "agent" || (base && category)) && (
                <div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" onCheckedChange={handleCheckboxChange} checked={isChecked}/>
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Accept <a href="/auth/terms" className="underline"> terms and conditions </a>
                    </label>
                  </div>
                  <Button type="submit" className="w-full mt-4" color="primary" onClick={handleSignUp} disabled={!isChecked || loading}>
                    {loading ? "Loading..." : "Sign Up"}
                  </Button>
                </div>
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
  
  export default AuthSignUp;
  
