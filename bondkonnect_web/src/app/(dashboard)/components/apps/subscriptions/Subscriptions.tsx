import { Check, LockIcon, X, Phone, CreditCard, Smartphone } from "lucide-react"
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
import { 
  getAllSubscriptionPlans, 
  getAllFeatures, 
  getAllFeatureCategories,
  initiateMpesaStkPush,
  checkMpesaStatus,
  createPaypalOrder,
  capturePaypalOrder 
} from "@/app/lib/actions/api.actions"
import React from "react"
import { useToast } from "@/app/hooks/use-toast"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import { pollMpesaStatus } from "./payment-utils"

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

type PaymentMethod = 'mpesa' | 'paypal' | 'card';

const paymentSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  mpesaPhone: z.string().regex(/^254\d{9}$/, "Format: 2547XXXXXXXX").optional(),
  cardNumber: z.string().regex(/^\d{16}$/, "Invalid card number").optional(),
  expiryDate: z.string().optional(),
  cvc: z.string().optional(),
  cardholderName: z.string().optional(),
})

export function SubscriptionsListing({ userDetails }: { userDetails: any }) {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<PaymentDetails | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('mpesa')
  const [loading, setLoading] = useState(false)
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([])
  const [loadingPlans, setLoadingPlans] = useState(true)
  const [allFeatures, setAllFeatures] = useState<Feature[]>([])
  const [featureCategories, setFeatureCategories] = useState<FeatureCategory[]>([])
  const { toast } = useToast()

  const form = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      email: userDetails?.email || "",
      mpesaPhone: userDetails?.phone?.replace(/^(0|\+)/, '254') || "254",
      cardNumber: "",
      expiryDate: "",
      cvc: "",
      cardholderName: "",
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

  const handleMpesaPayment = async (data: any) => {
    if (!selectedPayment) return;
    
    try {
      setLoading(true)
      const result = await initiateMpesaStkPush({
        phone: data.mpesaPhone,
        amount: selectedPayment.amount,
        plan_id: selectedPayment.planId,
        user_email: userDetails.email
      });

      if (result?.success) {
        toast({
          title: "STK Push Sent",
          description: "Please check your phone and enter your M-Pesa PIN.",
        });
        
        const checkoutId = result.checkout_id;
        pollMpesaStatus(checkoutId, (status) => {
          setLoading(false);
          if (status === 'completed') {
            toast({ title: "Payment Successful", description: "Your subscription is now active!" });
            setIsPaymentModalOpen(false);
          } else if (status === 'failed') {
            toast({ title: "Payment Failed", description: "The transaction was not successful.", variant: "destructive" });
          } else if (status === 'timeout') {
            toast({ title: "Polling Timeout", description: "We couldn't verify the payment in time. Please check your dashboard later.", variant: "destructive" });
          }
        });

      } else {
        toast({
          title: "Payment Error",
          description: result?.message || "Failed to initiate M-Pesa payment",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false)
    }
  }

  const handleCardPayment = async (data: any) => {
    toast({
      title: "Coming Soon",
      description: "Direct card payments are currently under maintenance. Please use PayPal.",
    });
  }

  const PaymentModal = () => (
    <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Complete your subscription</DialogTitle>
          <DialogDescription>
            Subscribe to {selectedPayment?.plan} plan ({selectedPayment?.period})
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-4 space-y-6">
            {/* Payment Method Selection */}
            <div className="grid grid-cols-3 gap-3">
              <Button
                type="button"
                variant={selectedPaymentMethod === 'mpesa' ? 'default' : 'outline'}
                className={cn("flex flex-col h-20 gap-2", selectedPaymentMethod === 'mpesa' && "border-primary ring-2 ring-primary/20")}
                onClick={() => setSelectedPaymentMethod('mpesa')}
              >
                <Smartphone className="h-5 w-5" />
                <span className="text-xs">M-Pesa</span>
              </Button>
              <Button
                type="button"
                variant={selectedPaymentMethod === 'paypal' ? 'default' : 'outline'}
                className={cn("flex flex-col h-20 gap-2", selectedPaymentMethod === 'paypal' && "border-primary ring-2 ring-primary/20")}
                onClick={() => setSelectedPaymentMethod('paypal')}
              >
                <Smartphone className="h-5 w-5" /> {/* Use generic icon if paypal icon not ready */}
                <span className="text-xs">PayPal</span>
              </Button>
              <Button
                type="button"
                variant={selectedPaymentMethod === 'card' ? 'default' : 'outline'}
                className={cn("flex flex-col h-20 gap-2", selectedPaymentMethod === 'card' && "border-primary ring-2 ring-primary/20")}
                onClick={() => setSelectedPaymentMethod('card')}
              >
                <CreditCard className="h-5 w-5" />
                <span className="text-xs">Card</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <LockIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground font-medium">Secure Payment Processing</span>
            </div>

            {/* Dynamic Payment Content */}
            {selectedPaymentMethod === 'mpesa' && (
              <form onSubmit={form.handleSubmit(handleMpesaPayment)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mpesaPhone">M-Pesa Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="mpesaPhone"
                      placeholder="2547XXXXXXXX"
                      className="pl-9"
                      {...form.register("mpesaPhone")}
                    />
                  </div>
                  {form.formState.errors.mpesaPhone && (
                    <p className="text-xs text-red-500">{form.formState.errors.mpesaPhone.message}</p>
                  )}
                  <p className="text-[10px] text-muted-foreground">
                    Ensure your phone is unlocked and near you to receive the STK Prompt.
                  </p>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending Prompt..." : `Pay $${selectedPayment?.amount.toFixed(2)} via M-Pesa`}
                </Button>
              </form>
            )}

            {selectedPaymentMethod === 'paypal' && (
              <div className="space-y-4 py-2">
                <PayPalScriptProvider options={{ 
                  "clientId": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb",
                  currency: "USD"
                }}>
                  <PayPalButtons
                    style={{ layout: "vertical" }}
                    createOrder={async () => {
                      const res = await createPaypalOrder({
                        amount: selectedPayment?.amount || 0,
                        plan_id: selectedPayment?.planId || 0
                      });
                      return res.order_id;
                    }}
                    onApprove={async (data) => {
                      const res = await capturePaypalOrder({
                        order_id: data.orderID,
                        user_email: userDetails.email,
                        plan_id: selectedPayment?.planId || 0
                      });
                      if (res.success) {
                        toast({ title: "Success", description: "Subscription activated!" });
                        setIsPaymentModalOpen(false);
                      }
                    }}
                  />
                </PayPalScriptProvider>
              </div>
            )}

            {selectedPaymentMethod === 'card' && (
              <div className="space-y-4 opacity-60 pointer-events-none">
                <p className="text-sm text-center font-medium">Card integration via Stripe coming soon.</p>
                <div className="space-y-2">
                  <Label>Card Information</Label>
                  <Input placeholder="XXXX XXXX XXXX XXXX" disabled />
                </div>
                <Button className="w-full" disabled>Pay with Card</Button>
              </div>
            )}
          </div>
        </div>

        <div className="border-t px-6 py-4 bg-slate-50">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Plan: {selectedPayment?.plan}</span>
            <span className="font-bold text-primary">${selectedPayment?.amount.toFixed(2)}</span>
          </div>
          <p className="text-[10px] text-center text-muted-foreground">
            Payments are processed securely. By proceeding, you agree to our Terms of Service.
          </p>
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
                          <p className="text-sm text-muted-foreground line-clamp-2">
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
                          <p className="text-sm text-muted-foreground line-clamp-2">
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
                          <p className="text-sm text-muted-foreground line-clamp-2">
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
      <div className="mt-16 overflow-x-auto">
        <table className="w-full border-collapse min-w-[600px]">
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
                  <td colSpan={subscriptionPlans.length + 1} className="py-2 px-4 font-semibold text-sm">
                    {categoryName}
                  </td>
                </tr>
                {features.map((feature) => (
                  <tr key={feature.Id} className="border-b hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-sm">{feature.Name}</div>
                        <div className="text-xs text-muted-foreground">{feature.Description}</div>
                      </div>
                    </td>
                    {subscriptionPlans.map((plan) => {
                      const hasFeature = plan.features.some(f => f.Name === feature.Name);
                      return (
                        <td key={plan.Id} className="py-4 px-4">
                          {hasFeature ? (
                            <Check className="h-5 w-5 text-primary" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground/30" />
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