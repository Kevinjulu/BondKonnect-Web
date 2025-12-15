import { Check, LockIcon, X } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { cn } from "@/app/lib/utils"
import { getAllSubscriptionPlans, getAllFeatures, getAllFeatureCategories } from "@/app/lib/actions/api.actions"
import React from "react"

interface FeatureCategory {
  Id: number;
  Name: string;
  Description: string;
  Level: number;
}

interface Feature {
  Id: number;
  Name: string;
  Description: string;
  Level: number;
  CategoryId: number;
  CategoryName: string;
  CategoryDescription: string;
}

interface SubscriptionPlan {
  Id: number;
  Name: string;
  Description: string;
  IsActive: number;
  Level: number;
  billingDetails: Array<{
    Id: number;
    Name: string;
    Description: string;
    Days: number;
    UnitPrice: number;
  }>;
  features: Array<{
    Id: number;
    Name: string;
    Description: string;
    Level: number;
    CategoryName: string;
    CategoryDescription: string;
  }>;
}

interface PaymentDetails {
  plan: string;
  period: string;
  amount: number;
  planId: number;
}

type PaymentMethod = 'card' | 'apple-pay' | 'google-pay' | 'alipay';

const paymentSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  cardNumber: z.string().regex(/^\d{16}$/, "Please enter a valid 16-digit card number"),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/20[2-9]\d$/, "Please enter a valid expiry date (MM/YYYY)"),
  cvc: z.string().regex(/^\d{3,4}$/, "Please enter a valid CVC"),
  cardholderName: z.string().min(1, "Please enter the cardholder name"),
  country: z.string().min(1, "Please select a country"),
  address: z.string().min(1, "Please enter an address"),
  state: z.string().min(1, "Please select a state"),
  city: z.string().min(1, "Please enter a city"),
  zip: z.string().min(1, "Please enter a ZIP code"),
  taxId: z.string().optional(),
})

export function SubscriptionsListing() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<PaymentDetails | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('card')
  const [loading, setLoading] = useState(false)
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([])
  const [loadingPlans, setLoadingPlans] = useState(true)
  const [allFeatures, setAllFeatures] = useState<Feature[]>([])
  const [featureCategories, setFeatureCategories] = useState<FeatureCategory[]>([])

  const form = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      email: "",
      cardNumber: "",
      expiryDate: "",
      cvc: "",
      cardholderName: "",
      country: "",
      address: "",
      state: "",
      city: "",
      zip: "",
      taxId: "",
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansResponse, featuresResponse, categoriesResponse] = await Promise.all([
          getAllSubscriptionPlans(),
          getAllFeatures(),
          getAllFeatureCategories()
        ]);

        if (plansResponse?.success) {
          setSubscriptionPlans(plansResponse.data);
        }
        if (featuresResponse?.success) {
          setAllFeatures(featuresResponse.data);
        }
        if (categoriesResponse?.success) {
          setFeatureCategories(categoriesResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchData();
  }, []);

  const handleSubscribe = (plan: string, period: string, amount: number, planId: number) => {
    setSelectedPayment({ plan, period, amount, planId })
    setIsPaymentModalOpen(true)
  }

  const handlePayment = async (data: z.infer<typeof paymentSchema>) => {
    try {
      setLoading(true)
      // Here you would integrate with your payment processing service
      console.log("Processing payment with data:", { ...data, ...selectedPayment })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Success
      setIsPaymentModalOpen(false)
      form.reset()
      // You could show a success toast here
    } catch (error) {
      console.error("Payment failed:", error)
      // You could show an error toast here
    } finally {
      setLoading(false)
    }
  }

  const PaymentModal = () => (
    <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Complete your subscription</DialogTitle>
          <DialogDescription>
            Subscribe to {selectedPayment?.plan} plan ({selectedPayment?.period})
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={form.handleSubmit(handlePayment)} className="px-6">
            <div className="space-y-4 py-4">
              {/* Payment Method Buttons */}
              <div className="flex gap-2 pb-2">
                <Button
                  type="button"
                  variant={selectedPaymentMethod === 'card' ? 'default' : 'outline'}
                  className="flex-1 py-2 h-auto"
                  onClick={() => setSelectedPaymentMethod('card')}
                >
                  Card
                </Button>
                <Button
                  type="button"
                  variant={selectedPaymentMethod === 'apple-pay' ? 'default' : 'outline'}
                  className="flex-1 py-2 h-auto"
                  onClick={() => setSelectedPaymentMethod('apple-pay')}
                >
                  Apple Pay
                </Button>
                <Button
                  type="button"
                  variant={selectedPaymentMethod === 'google-pay' ? 'default' : 'outline'}
                  className="flex-1 py-2 h-auto"
                  onClick={() => setSelectedPaymentMethod('google-pay')}
                >
                  Google Pay
                </Button>
                <Button
                  type="button"
                  variant={selectedPaymentMethod === 'alipay' ? 'default' : 'outline'}
                  className="flex-1 py-2 h-auto"
                  onClick={() => setSelectedPaymentMethod('alipay')}
                >
                  Alipay
                </Button>
              </div>

              <div className="flex items-center gap-2 pb-2">
                <LockIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Secure payment link</span>
              </div>

              {/* Form Fields */}
              <div className="space-y-3">
                <div>
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g. john@example.com"
                    {...form.register("email")}
                    className={cn("mt-1", form.formState.errors.email && "border-red-500")}
                  />
                  {form.formState.errors.email && (
                    <p className="text-xs text-red-500 mt-1">{form.formState.errors.email.message}</p>
                  )}
                </div>

                {selectedPaymentMethod === 'card' && (
                  <>
                    <div>
                      <Label htmlFor="cardNumber">Card number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="0000 0000 0000 0000"
                        {...form.register("cardNumber")}
                        className={cn("mt-1", form.formState.errors.cardNumber && "border-red-500")}
                      />
                      {form.formState.errors.cardNumber && (
                        <p className="text-xs text-red-500 mt-1">{form.formState.errors.cardNumber.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="expiryDate">Expiration date</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM / YYYY"
                          {...form.register("expiryDate")}
                          className={cn("mt-1", form.formState.errors.expiryDate && "border-red-500")}
                        />
                        {form.formState.errors.expiryDate && (
                          <p className="text-xs text-red-500 mt-1">{form.formState.errors.expiryDate.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="cvc">Security code</Label>
                        <Input
                          id="cvc"
                          placeholder="000"
                          {...form.register("cvc")}
                          className={cn("mt-1", form.formState.errors.cvc && "border-red-500")}
                        />
                        {form.formState.errors.cvc && (
                          <p className="text-xs text-red-500 mt-1">{form.formState.errors.cvc.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="cardholderName">Cardholder name</Label>
                      <Input
                        id="cardholderName"
                        placeholder="Enter Cardholder name"
                        {...form.register("cardholderName")}
                        className={cn("mt-1", form.formState.errors.cardholderName && "border-red-500")}
                      />
                      {form.formState.errors.cardholderName && (
                        <p className="text-xs text-red-500 mt-1">{form.formState.errors.cardholderName.message}</p>
                      )}
                    </div>
                  </>
                )}

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select onValueChange={(value) => form.setValue("country", value)}>
                    <SelectTrigger className={cn("mt-1", form.formState.errors.country && "border-red-500")}>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.country && (
                    <p className="text-xs text-red-500 mt-1">{form.formState.errors.country.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Address line 1"
                    {...form.register("address")}
                    className={cn("mt-1", form.formState.errors.address && "border-red-500")}
                  />
                  {form.formState.errors.address && (
                    <p className="text-xs text-red-500 mt-1">{form.formState.errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="City"
                      {...form.register("city")}
                      className={cn("mt-1", form.formState.errors.city && "border-red-500")}
                    />
                    {form.formState.errors.city && (
                      <p className="text-xs text-red-500 mt-1">{form.formState.errors.city.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="zip">ZIP</Label>
                    <Input
                      id="zip"
                      placeholder="ZIP"
                      {...form.register("zip")}
                      className={cn("mt-1", form.formState.errors.zip && "border-red-500")}
                    />
                    {form.formState.errors.zip && (
                      <p className="text-xs text-red-500 mt-1">{form.formState.errors.zip.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="taxId">Tax ID number (optional)</Label>
                  <Input
                    id="taxId"
                    placeholder="Enter Tax ID number"
                    {...form.register("taxId")}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="border-t px-6 py-4 mt-auto">
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${selectedPayment?.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${selectedPayment?.amount.toFixed(2)}</span>
              </div>
            </div>

            <Button 
              type="submit"
              className="w-full" 
              disabled={loading}
              onClick={form.handleSubmit(handlePayment)}
            >
              {loading ? "Processing..." : `Pay $${selectedPayment?.amount.toFixed(2)}`}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Powered by Supplier • Terms • Privacy
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  // Helper function to organize features by category and deduplicate them
  const getFeaturesByCategory = () => {
    const organized: { [key: string]: Feature[] } = {};
    
    featureCategories.forEach(category => {
      // Filter features by category and deduplicate based on Name
      const uniqueFeatures = Array.from(
        new Map(
          allFeatures
            .filter(feature => feature.CategoryId === category.Id)
            .map(feature => [feature.Name, feature])
        ).values()
      );
      
      if (uniqueFeatures.length > 0) {
        organized[category.Name] = uniqueFeatures;
      }
    });
    
    return organized;
  };

  if (loadingPlans) {
    return <div className="flex justify-center items-center h-64">Loading subscription plans...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-1">
      <div className="text-center space-y-4 mb-16">
        <h1 className="text-xl md:text-5xl font-bold tracking-tight">
          Choose your plan
        </h1>
        <p className="text-md text-muted-foreground">
          Select a subscription plan that best fits your needs
        </p>
      </div>

      <Tabs defaultValue="monthly" className="w-full space-y-8">
        <div className="flex justify-center">
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </div>

        {/* Daily Pricing */}
        <TabsContent value="daily">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {subscriptionPlans.map((plan) => {
              const dailyBilling = plan.billingDetails.find(b => b.Days === 1);
              return (
                <Card key={plan.Id} className="flex flex-col">
                  <CardContent className="p-6 flex-1">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold">{plan.Name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {plan.Description}
                          </p>
                        </div>
                        <div className="h-8 w-8 rounded bg-primary/10" />
                      </div>
                      <div className="flex items-baseline text-2xl md:text-3xl font-bold">
                        ${dailyBilling?.UnitPrice || 0}
                        <span className="ml-1 text-sm font-normal text-muted-foreground">
                          /day
                        </span>
                      </div>
                      <Button 
                        className="w-full"
                        onClick={() => handleSubscribe(plan.Name, "daily", dailyBilling?.UnitPrice || 0, plan.Id)}
                      >
                        Subscribe Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Weekly Pricing */}
        <TabsContent value="weekly">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {subscriptionPlans.map((plan) => {
              const weeklyBilling = plan.billingDetails.find(b => b.Days === 7);
              return (
                <Card key={plan.Id} className="flex flex-col">
                  <CardContent className="p-6 flex-1">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold">{plan.Name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {plan.Description}
                          </p>
                        </div>
                        <div className="h-8 w-8 rounded bg-primary/10" />
                      </div>
                      <div className="flex items-baseline text-2xl md:text-3xl font-bold">
                        ${weeklyBilling?.UnitPrice || 0}
                        <span className="ml-1 text-sm font-normal text-muted-foreground">
                          /week
                        </span>
                      </div>
                      <Button 
                        className="w-full"
                        onClick={() => handleSubscribe(plan.Name, "weekly", weeklyBilling?.UnitPrice || 0, plan.Id)}
                      >
                        Subscribe Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Monthly Pricing */}
        <TabsContent value="monthly">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {subscriptionPlans.map((plan) => {
              const monthlyBilling = plan.billingDetails.find(b => b.Days === 30);
              return (
                <Card key={plan.Id} className="flex flex-col">
                  <CardContent className="p-6 flex-1">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold">{plan.Name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {plan.Description}
                          </p>
                        </div>
                        <div className="h-8 w-8 rounded bg-primary/10" />
                      </div>
                      <div className="flex items-baseline text-2xl md:text-3xl font-bold">
                        ${monthlyBilling?.UnitPrice || 0}
                        <span className="ml-1 text-sm font-normal text-muted-foreground">
                          /month
                        </span>
                      </div>
                      <Button 
                        className="w-full"
                        onClick={() => handleSubscribe(plan.Name, "monthly", monthlyBilling?.UnitPrice || 0, plan.Id)}
                      >
                        Subscribe Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Features Comparison Table */}
      <div className="mt-16">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-4 px-4 font-medium">Feature</th>
              {subscriptionPlans.map((plan) => (
                <th key={plan.Id} className="text-left py-4 px-4 font-medium">
                  {plan.Name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(getFeaturesByCategory()).map(([categoryName, features]) => (
              <React.Fragment key={categoryName}>
                <tr className="border-b bg-muted/50">
                  <td colSpan={subscriptionPlans.length + 1} className="py-2 px-4 font-semibold">
                    {categoryName}
                  </td>
                </tr>
                {features.map((feature) => (
                  <tr key={feature.Id} className="border-b">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium">{feature.Name}</div>
                        <div className="text-sm text-muted-foreground">{feature.Description}</div>
                      </div>
                    </td>
                    {subscriptionPlans.map((plan) => {
                      const hasFeature = plan.features.some(f => f.Name === feature.Name);
                      return (
                        <td key={plan.Id} className="py-4 px-4">
                          {hasFeature ? (
                            <Check className="h-5 w-5 text-primary" />
                          ) : (
                            <X className="h-5 w-5 text-warning-foreground" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <PaymentModal />
    </div>
  )
}

