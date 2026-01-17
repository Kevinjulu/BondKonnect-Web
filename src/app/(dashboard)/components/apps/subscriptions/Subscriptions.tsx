import { Check, LockIcon, X } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { getAllSubscriptionPlans, getAllFeatures, getAllFeatureCategories, initiateMpesaStkPush, checkMpesaStatus } from "@/lib/actions/api.actions"
import React from "react"
import { useToast } from "@/hooks/use-toast"
import { Icons } from "@/components/icons"
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

type PaymentMethod = 'card' | 'mpesa' | 'paypal';

const paymentSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvc: z.string().optional(),
})

interface SubscriptionsListingProps {
  userDetails?: {
    email?: string;
    phone?: string;
  }
}

export function SubscriptionsListing({ userDetails }: SubscriptionsListingProps) {
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
      phone: userDetails?.phone || "",
      cardNumber: "",
      expiryDate: "",
      cvc: "",
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
    if (selectedPaymentMethod === 'mpesa') {
      if (!data.phone) {
        toast({ title: "Error", description: "Phone number is required for M-Pesa", variant: "destructive" });
        return;
      }
      
      setLoading(true);
      try {
        const res = await initiateMpesaStkPush({
          phone: data.phone,
          amount: selectedPayment?.amount || 0,
          plan_id: selectedPayment?.planId || 0,
          user_email: data.email
        });

        if (res?.success && res.checkout_id) {
          toast({ title: "STK Push Sent", description: "Please enter your PIN on your phone." });
          
          pollMpesaStatus(res.checkout_id, (status) => {
            if (status === 'completed') {
              toast({ title: "Success", description: "Subscription activated!" });
              setIsPaymentModalOpen(false);
            } else if (status === 'failed') {
              toast({ title: "Failed", description: "Payment was not successful.", variant: "destructive" });
            }
            setLoading(false);
          });
        } else {
          throw new Error(res?.message || "Failed to initiate M-Pesa");
        }
      } catch (error: any) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        setLoading(false);
      }
    } else {
      // Logic for Card/PayPal...
      toast({ title: "Coming Soon", description: "This payment method is being integrated." });
    }
  }

  const PaymentModal = () => (
    <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Complete your subscription</DialogTitle>
          <DialogDescription>
            Subscribe to {selectedPayment?.plan} plan ({selectedPayment?.period})
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={selectedPaymentMethod === 'mpesa' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setSelectedPaymentMethod('mpesa')}
            >
              M-Pesa
            </Button>
            <Button
              type="button"
              variant={selectedPaymentMethod === 'paypal' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setSelectedPaymentMethod('paypal')}
            >
              PayPal
            </Button>
            <Button
              type="button"
              variant={selectedPaymentMethod === 'card' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setSelectedPaymentMethod('card')}
            >
              Card
            </Button>
          </div>

          <form onSubmit={form.handleSubmit(handlePayment)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" {...form.register("email")} />
            </div>

            {selectedPaymentMethod === 'mpesa' && (
              <div className="space-y-2">
                <Label htmlFor="phone">M-Pesa Phone Number</Label>
                <Input id="phone" placeholder="2547..." {...form.register("phone")} />
              </div>
            )}

            {selectedPaymentMethod === 'card' && (
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" placeholder="0000 0000 0000 0000" {...form.register("cardNumber")} />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : null}
              {loading ? "Processing..." : `Pay $${selectedPayment?.amount.toFixed(2)} via ${selectedPaymentMethod.toUpperCase()}`}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )

  const getFeaturesByCategory = () => {
    const organized: { [key: string]: Feature[] } = {};
    featureCategories.forEach(category => {
      const uniqueFeatures = Array.from(
        new Map(
          allFeatures
            .filter(feature => feature.CategoryId === category.Id)
            .map(feature => [feature.Name, feature])
        ).values()
      );
      if (uniqueFeatures.length > 0) organized[category.Name] = uniqueFeatures;
    });
    return organized;
  };

  if (loadingPlans) return <div className="flex justify-center items-center h-64">Loading subscription plans...</div>;

  return (
    <div className="container mx-auto px-4 py-1">
      <div className="text-center space-y-4 mb-16">
        <h1 className="text-xl md:text-5xl font-bold tracking-tight">Choose your plan</h1>
        <p className="text-md text-muted-foreground">Select a subscription plan that best fits your needs</p>
      </div>

      <Tabs defaultValue="monthly" className="w-full space-y-8">
        <div className="flex justify-center">
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </div>

        {['daily', 'weekly', 'monthly'].map(period => (
          <TabsContent key={period} value={period}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {subscriptionPlans.map((plan) => {
                const days = period === 'daily' ? 1 : period === 'weekly' ? 7 : 30;
                const billing = plan.billingDetails.find(b => b.Days === days);
                return (
                  <Card key={plan.Id} className="flex flex-col">
                    <CardContent className="p-6 flex-1">
                      <div className="space-y-3">
                        <h3 className="text-lg font-bold">{plan.Name}</h3>
                        <p className="text-sm text-muted-foreground">{plan.Description}</p>
                        <div className="text-2xl md:text-3xl font-bold">
                          ${billing?.UnitPrice || 0}<span className="text-sm font-normal text-muted-foreground">/{period === 'daily' ? 'day' : period === 'weekly' ? 'week' : 'month'}</span>
                        </div>
                        <Button className="w-full" onClick={() => handleSubscribe(plan.Name, period, billing?.UnitPrice || 0, plan.Id)}>
                          Subscribe Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-16">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-4 px-4 font-medium">Feature</th>
              {subscriptionPlans.map((plan) => (
                <th key={plan.Id} className="text-left py-4 px-4 font-medium">{plan.Name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(getFeaturesByCategory()).map(([categoryName, features]) => (
              <React.Fragment key={categoryName}>
                <tr className="border-b bg-muted/50">
                  <td colSpan={subscriptionPlans.length + 1} className="py-2 px-4 font-semibold">{categoryName}</td>
                </tr>
                {features.map((feature) => (
                  <tr key={feature.Id} className="border-b">
                    <td className="py-4 px-4">
                      <div className="font-medium">{feature.Name}</div>
                      <div className="text-sm text-muted-foreground">{feature.Description}</div>
                    </td>
                    {subscriptionPlans.map((plan) => (
                      <td key={plan.Id} className="py-4 px-4">
                        {plan.features.some(f => f.Name === feature.Name) ? <Check className="h-5 w-5 text-primary" /> : <X className="h-5 w-5 text-warning-foreground" />}
                      </td>
                    ))}
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
