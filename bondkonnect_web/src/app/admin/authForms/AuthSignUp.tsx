import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { loginType } from "../../(dashboard)/types/auth/auth";
import CustomSnackbar from "../../(dashboard)/layouts/shared/snackbar/CustomSnackbar";
import { Check, ChevronsUpDown } from "lucide-react"
import { Globe, UserRound } from 'lucide-react';
import { cn } from "@/app/lib/utils"
import { Button } from '@/app/components/ui/button';
import {Card,CardContent,CardDescription,CardHeader,CardTitle,} from '@/app/components/ui/card';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/app/components/ui/command"
import {  
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover"
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Checkbox } from "@/app/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
// const axios = require('@/app/utils/axios');
import { register } from "@/app/lib/actions/api.actions";
import { getCurrentUserDetails } from "@/app/lib/actions/user.check";
  
const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]
 

const AuthSignUp = ({ icon, title, subtitle, role = "", socialauths,subtext, }: loginType) => {

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [base, setBase] = useState("");
  const [category, setCategory] = useState("");
  
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [selectedAlternateValues, setSelectedAlternateValues] = useState<string[]>([]);
  const [newDealerInputs, setNewDealerInputs] = useState<string[]>(['']);

  const handleNewDealerInputChange = (index: number, value: string) => {
    const newInputs = [...newDealerInputs];
    newInputs[index] = value;
    setNewDealerInputs(newInputs);
    console.log('Updated newDealerInputs:', newInputs);
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
    // const brokerDealerRef = useRef<HTMLButtonElement>(null);
     //const brokerDealerRef = useRef<HTMLButtonElement>(null);
    const localityRef = useRef<HTMLInputElement>(null);
    const categoryTypeRef = useRef<HTMLInputElement>(null);
    // const alternateDealerRef = useRef<HTMLButtonElement>(null);

   // Get selected brokers and new dealer emails for foreign corporate
   const brokerDealerRef: string[] = selectedValues;   //for individual
   const alternateDealerRef: string[] = selectedAlternateValues;;
   const newDealerEmails: string[] = newDealerInputs.filter(email => email.trim() !== ""); //for individual
    
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();
  
      // Snackbar state
      const [snackbarOpen, setSnackbarOpen] = useState(false);
      const [snackbarTitle, setSnackbarTitle] = useState("");
      const [snackbarMessage, setSnackbarMessage] = useState("");
      const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
    // loading
    const [loading, setLoading] = useState(false);
    const [isChecked, setIsChecked] = useState(false); // State to track checkbox


    const handleCheckboxChange = useCallback((checked: boolean) => {
        setIsChecked(checked);
      }, []);
      
      useEffect(() => {
        // setIsClient(true);
        const checkUser = async () => {
          const user = await getCurrentUserDetails();
          if (user) {
            redirect("/");
          }
        };
    
        checkUser();
      }, [handleCheckboxChange]);
  
  
    const handleSnackbarClose = () => {
      setSnackbarOpen(false);
    };
  
    const handleSignUp = async (e: React.MouseEvent<HTMLButtonElement>) => {
      setLoading(true);
      e.preventDefault();
  
      console.log('newDealerInputs before API call:', newDealerInputs);
  
      try {

      const email = emailRef.current?.value || "";
      const phone = phoneRef.current?.value || "";
      const companyName = companyNameRef.current?.value || "";
      const firstName = firstNameRef.current?.value || "";
      const otherNames = otherNamesRef.current?.value || "";
      const cdsNumber = cdsNumberRef.current?.value || "";
      // const brokerDealer = brokerDealerRef.current?.getAttribute("value") || "";
      const locality = localityRef.current?.value || "";
      const categoryType = categoryTypeRef.current?.value || "";
      const isBroker = categoryType === "broker";
      const isDealer = categoryType === "dealer";
      // const alternateDealer = alternateDealerRef.current?.getAttribute("value") || "";

      // Prepare role-based fields
      const isIndividual = role === "individual";
      const isAgent = role === "agent"; 
      const isCorporate = role === "corporate";
    //   const isBroker = role === "broker";
    //   const isDealer = role === "authorizeddealer";
      const isAdmin = role === "admin";

      // Call register function with necessary data
      const response = await register({
        is_individual: isIndividual,
        is_agent: isAgent,
        is_corporate: isCorporate,
        is_broker: isBroker,
        is_dealer: isDealer,
        is_admin: isAdmin,
        email,
        phone,
        company_name: companyName,
        first_name: firstName,
        other_names: otherNames,
        cds_number: cdsNumber,
        // broker_dealer: brokerDealer,
        broker_dealer: brokerDealerRef,
        locality,
        category_type: categoryType,
        alternate_dealer: alternateDealerRef,
       new_dealer_emails: newDealerEmails,
      });
  
        if (response && response.success) {
          setTimeout(() => {
            setSnackbarMessage("Registration successful!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            // Optionally navigate to a new page after showing the success message
          }, 300);
          router.push("/admin/success");
        } else {
          setSnackbarMessage(
            response?.message || "Registration failed. Please try again later"
          );
          setSnackbarSeverity("error");
        }
  
        setSnackbarOpen(true);
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
                  </div>
                  <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@gmail.com"
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
                  <Label htmlFor="cds">CDS Number</Label>
                  <Input
                    id="cds"
                    type="text"
                    placeholder="e.g 000000123456"
                    ref={cdsNumberRef}
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
                      // ref={brokerDealerRef}
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
                        {frameworks.map((framework) => (
                        <CommandItem
                        key={framework.value}
                        value={framework.value}
                        onSelect={(currentValue) => {
                          const newSelected = selectedValues.includes(currentValue)
                          ? selectedValues.filter(val => val !== currentValue)
                          : selectedValues.length < 5
                            ? [...selectedValues, currentValue]
                            : selectedValues;
                          setSelectedValues(newSelected);
                        }}
                        >
                        {framework.label}
                        <Check
                        className={cn(
                          "ml-auto",
                          selectedValues.includes(framework.value) ? "opacity-100" : "opacity-0"
                        )}
                        />
                        </CommandItem>
                        ))}
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
                      // ref={brokerDealerRef}
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
                        {frameworks.map((framework) => (
                        <CommandItem
                        key={framework.value}
                        value={framework.value}
                        onSelect={(currentValue) => {
                          const newSelected = selectedValues.includes(currentValue)
                          ? selectedValues.filter(val => val !== currentValue)
                          : selectedValues.length < 5
                            ? [...selectedValues, currentValue]
                            : selectedValues;
                          setSelectedValues(newSelected);
                        }}
                        >
                        {framework.label}
                        <Check
                        className={cn(
                          "ml-auto",
                          selectedValues.includes(framework.value) ? "opacity-100" : "opacity-0"
                        )}
                        />
                        </CommandItem>
                        ))}
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
                      placeholder="m@gmail.com"
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
                      // ref={brokerDealerRef}
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
                        {frameworks.map((framework) => (
                        <CommandItem
                        key={framework.value}
                        value={framework.value}
                        onSelect={(currentValue) => {
                          const newSelected = selectedValues.includes(currentValue)
                          ? selectedValues.filter(val => val !== currentValue)
                          : selectedValues.length < 5
                            ? [...selectedValues, currentValue]
                            : selectedValues;
                          setSelectedValues(newSelected);
                        }}
                        >
                        {framework.label}
                        <Check
                        className={cn(
                          "ml-auto",
                          selectedValues.includes(framework.value) ? "opacity-100" : "opacity-0"
                        )}
                        />
                        </CommandItem>
                        ))}
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
                        placeholder="m@gmail.com"
                        ref={emailRef}
                        required
                      />
                      </div>
                      {/* <div className="grid gap-2">
                      <Label htmlFor="alternate">Select Alternate Dealer</Label>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-[330px] justify-between"
                          // ref={alternateDealerRef}
                        >
                          {value
                          ? frameworks.find((framework) => framework.value === value)?.label
                          : "Select alternate dealer..."}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search framework..." className="h-9" />
                          <CommandList>
                          <CommandEmpty>No framework found.</CommandEmpty>
                          <CommandGroup>
                            {frameworks.map((framework) => (
                            <CommandItem
                              key={framework.value}
                              value={framework.value}
                              onSelect={(currentValue) => {
                              setValue(currentValue === value ? "" : currentValue)
                              setOpen(false)
                              }}
                            >
                              {framework.label}
                              <Check
                              className={cn(
                                "ml-auto",
                                value === framework.value ? "opacity-100" : "opacity-0"
                              )}
                              />
                            </CommandItem>
                            ))}
                          </CommandGroup>
                          </CommandList>
                        </Command>
                        </PopoverContent>
                      </Popover>
                      </div> */}
                      <div className="grid gap-2">
                    <Label htmlFor="select">Select Alternate Dealer (Max 5)</Label>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                      <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-[330px] justify-between"
                      // ref={alternateDealerRef}
                      >
                      {setSelectedAlternateValues?.length > 0
                        ? `${setSelectedAlternateValues.length} selected`
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
                        {frameworks.map((framework) => (
                        <CommandItem
                        key={framework.value}
                        value={framework.value}
                        onSelect={(currentAlternateValue) => {
                          const newSelected = selectedAlternateValues.includes(currentAlternateValue)
                          ? selectedAlternateValues.filter(val => val !== currentAlternateValue)
                          : selectedAlternateValues.length < 5
                            ? [...selectedAlternateValues, currentAlternateValue]
                            : selectedAlternateValues;
                            setSelectedAlternateValues(newSelected);
                        }}
                        >
                        {framework.label}
                        <Check
                        className={cn(
                          "ml-auto",
                          selectedAlternateValues.includes(framework.value) ? "opacity-100" : "opacity-0"
                        )}
                        />
                        </CommandItem>
                        ))}
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
                        placeholder="m@gmail.com"
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
                      // ref={brokerDealerRef}
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
                        {frameworks.map((framework) => (
                        <CommandItem
                        key={framework.value}
                        value={framework.value}
                        onSelect={(currentValue) => {
                          const newSelected = selectedValues.includes(currentValue)
                          ? selectedValues.filter(val => val !== currentValue)
                          : selectedValues.length < 5
                            ? [...selectedValues, currentValue]
                            : selectedValues;
                          setSelectedValues(newSelected);
                        }}
                        >
                        {framework.label}
                        <Check
                        className={cn(
                          "ml-auto",
                          selectedValues.includes(framework.value) ? "opacity-100" : "opacity-0"
                        )}
                        />
                        </CommandItem>
                        ))}
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
              {/* {loading ? (
                <Button type="submit" className="w-full" color="primary" onClick={handleSignUp}   disabled>
                    Loading...
                </Button>
              ) : (
                <Button type="submit" className="w-full"  color="primary" onClick={handleSignUp}  >
                  Sign Up
                </Button>

              )} */}
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
  
