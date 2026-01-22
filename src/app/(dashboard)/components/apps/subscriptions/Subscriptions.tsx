import { Check, X, Smartphone, Globe, CreditCard, ChevronRight, Zap, Target, Crown, Lock } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { getAllSubscriptionPlans, getAllFeatures, getAllFeatureCategories, initiateMpesaStkPush, createPaypalOrder, capturePaypalOrder, getUserSubscriptions } from "@/lib/actions/api.actions"
import React from "react"
import { useToast } from "@/hooks/use-toast"
import { Icons } from "@/components/icons"
import { pollMpesaStatus } from "./payment-utils"

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
  phone: z.string().optional(),
})

export function SubscriptionsListing({ userDetails }: { userDetails?: any }) {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<PaymentDetails | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('mpesa')
  const [loading, setLoading] = useState(false)
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([])
  const [loadingPlans, setLoadingPlans] = useState(true)
  const [userActiveSubscription, setUserActiveSubscription] = useState<any>(null)
  const { toast } = useToast()

  const form = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      email: userDetails?.email || "",
      phone: userDetails?.phone || "",
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const plansResponse = await getAllSubscriptionPlans();
        if (plansResponse?.success) {
          setSubscriptionPlans(plansResponse.data);
        } else {
          setSubscriptionPlans([
            {
              Id: 1, Name: "Analyst", Description: "Individual investor workstation.", IsActive: 1, Level: 1,
              billingDetails: [{ Id: 1, Name: "Daily", Description: "", Days: 1, UnitPrice: 5 }, { Id: 2, Name: "Weekly", Description: "", Days: 7, UnitPrice: 20 }, { Id: 3, Name: "Monthly", Description: "", Days: 30, UnitPrice: 50 }],
            },
            {
              Id: 2, Name: "Professional", Description: "Advanced trading & broker tools.", IsActive: 1, Level: 2,
              billingDetails: [{ Id: 4, Name: "Daily", Description: "", Days: 1, UnitPrice: 15 }, { Id: 5, Name: "Weekly", Description: "", Days: 7, UnitPrice: 60 }, { Id: 6, Name: "Monthly", Description: "", Days: 30, UnitPrice: 150 }],
            },
            {
              Id: 3, Name: "Institutional", Description: "Full execution & API infrastructure.", IsActive: 1, Level: 3,
              billingDetails: [{ Id: 7, Name: "Daily", Description: "", Days: 1, UnitPrice: 50 }, { Id: 8, Name: "Weekly", Description: "", Days: 7, UnitPrice: 200 }, { Id: 9, Name: "Monthly", Description: "", Days: 30, UnitPrice: 500 }],
            }
          ]);
        }

        if (userDetails?.email) {
          const userSubResponse = await getUserSubscriptions(userDetails.email);
          if (userSubResponse?.success && userSubResponse.data?.length > 0) {
            const active = userSubResponse.data.find((sub: any) => sub.SubscriptionStatus === 1);
            setUserActiveSubscription(active);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoadingPlans(false);
      }
    };
    fetchData();
  }, [userDetails?.email]);

  const handleSubscribe = (plan: string, period: string, amount: number, planId: number) => {
    if (userActiveSubscription && userActiveSubscription.PlanId === planId) {
      toast({ title: "Current Plan", description: "You are already active on this tier." });
      return;
    }
    setSelectedPayment({ plan, period, amount, planId })
    setIsPaymentModalOpen(true)
  }

  const handlePayment = async (data: z.infer<typeof paymentSchema>) => {
    setLoading(true);
    try {
      if (selectedPaymentMethod === 'mpesa') {
        if (!data.phone) {
          toast({ title: "Phone Required", description: "M-Pesa requires a valid Safaricom number.", variant: "destructive" });
          setLoading(false);
          return;
        }
        
        const amountInKes = Math.round((selectedPayment?.amount || 0) * 130);

        const res = await initiateMpesaStkPush({
          phone: data.phone,
          amount: amountInKes,
          plan_id: selectedPayment?.planId || 0,
          user_email: data.email
        });

        if (res?.success && res.checkout_id) {
          toast({ title: "Authorization Sent", description: "Enter your M-Pesa PIN on your phone now." });
          
          pollMpesaStatus(res.checkout_id, (status) => {
            if (status === 'completed') {
              toast({ title: "Terminal Activated", description: "Your subscription is now live." });
              setIsPaymentModalOpen(false);
              window.location.reload();
            } else if (status === 'failed') {
              toast({ title: "Payment Failed", description: "The transaction was cancelled or declined.", variant: "destructive" });
            }
            setLoading(false);
          });
        } else {
          throw new Error(res?.message || "M-Pesa gateway connection failure.");
        }
      } else if (selectedPaymentMethod === 'paypal') {
        const res = await createPaypalOrder({
          amount: selectedPayment?.amount || 0,
          plan_id: selectedPayment?.planId || 0,
        });

        if (res?.success && res.order_id) {
          // Find the approval link from PayPal response
          // Note: createPaypalOrder in api.actions returns order_id directly, 
          // we might need the full response to get links, or we construct the redirect.
          // For sandbox/production, the format is usually:
          // https://www.paypal.com/checkoutnow?token=ORDER_ID
          const paypalUrl = `https://www.sandbox.paypal.com/checkoutnow?token=${res.order_id}`;
          
          toast({ title: "Redirecting", description: "Opening secure PayPal gateway..." });
          
          // In a real production app, we would use window.location.href or a better modal
          // For this terminal feel, we'll open in a new tab then poll or wait for callback
          window.open(paypalUrl, '_blank');
          
          toast({ 
            title: "Waiting for Approval", 
            description: "Please complete payment in the new window. Click 'Sync' once done.",
            action: (
              <Button size="sm" className="bg-black text-white" onClick={() => window.location.reload()}>
                Sync Status
              </Button>
            )
          });
        }
        setLoading(false);
      } else {
        toast({ title: "Coming Soon", description: "Direct Card Entry is under final security review." });
        setLoading(false);
      }
    } catch (error: any) {
      toast({ title: "System Error", description: error.message, variant: "destructive" });
      setLoading(false);
    }
  }

  if (loadingPlans) return (
    <div className="flex flex-col justify-center items-center h-96 w-full">
      <div className="mb-6 animate-pulse">
        <Image src="/images/logos/logo-c.svg" alt="BondKonnect" width={120} height={40} priority />
      </div>
      <div className="spinner"></div>
    </div>
  );

  const getPlanFeatures = (level: number) => {
    if (level === 1) return ["Basic Bond Calculator", "Historical Data Access", "Daily Market Summaries", "Email Support"];
    if (level === 2) return ["Analyst Features +", "Real-time NSE Quotes", "Advanced Portfolio Tracking", "Corporate Bond Analytics", "Priority Support"];
    return ["Professional Features +", "Full Deal Execution (Quote Book)", "IFRS 9 ECL Modeling", "Institutional API Access", "Dedicated Account Manager"];
  };

  const getPlanIcon = (level: number) => {
    if (level === 1) return Zap;
    if (level === 2) return Target;
    return Crown;
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-1000">
      {/* Sleek Centered Header */}
      <div className="text-center space-y-4 pt-10">
        <h2 className="text-5xl font-black tracking-tighter uppercase italic">Terminal Access Plans</h2>
        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">Choose your workstation depth</p>
      </div>

      <Tabs defaultValue="monthly" className="w-full flex flex-col items-center">
        <TabsList className="bg-white border-2 border-black h-14 p-0 rounded-none overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-12">
          <TabsTrigger value="daily" className="rounded-none px-8 data-[state=active]:bg-black data-[state=active]:text-white font-black uppercase text-[10px] tracking-widest">Daily</TabsTrigger>
          <TabsTrigger value="weekly" className="rounded-none px-8 data-[state=active]:bg-black data-[state=active]:text-white font-black uppercase text-[10px] tracking-widest border-x-2 border-black">Weekly</TabsTrigger>
          <TabsTrigger value="monthly" className="rounded-none px-8 data-[state=active]:bg-black data-[state=active]:text-white font-black uppercase text-[10px] tracking-widest">Monthly</TabsTrigger>
        </TabsList>

        {['daily', 'weekly', 'monthly'].map(period => (
          <TabsContent key={period} value={period} className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
              {subscriptionPlans.sort((a, b) => a.Level - b.Level).map((plan) => {
                const days = period === 'daily' ? 1 : period === 'weekly' ? 7 : 30;
                const billing = plan.billingDetails.find(b => b.Days === days);
                if (!billing) return null;
                const isCurrent = userActiveSubscription?.PlanId === plan.Id;
                const PlanIcon = getPlanIcon(plan.Level);

                return (
                  <div key={plan.Id} className={cn(
                    "flex flex-col border-2 p-8 transition-all relative",
                    plan.Level === 2 ? "border-black bg-black text-white shadow-[16px_16px_0px_0px_rgba(0,0,0,0.05)] scale-105 z-10" : "border-gray-100 bg-white hover:border-black"
                  )}>
                    {isCurrent && (
                      <div className="absolute top-0 left-0 bg-white text-black px-4 py-1.5 font-black text-[9px] uppercase tracking-widest border-r-2 border-b-2 border-black">
                        Active
                      </div>
                    )}
                    
                    <div className="mb-8">
                      <div className={cn("p-3 w-fit mb-6", plan.Level === 2 ? "bg-white text-black" : "bg-black text-white")}>
                        <PlanIcon className="h-6 w-6" />
                      </div>
                      <h3 className="text-3xl font-black uppercase tracking-tighter italic">{plan.Name}</h3>
                      <p className={cn("text-[10px] font-bold uppercase tracking-widest mt-2", plan.Level === 2 ? "text-gray-400" : "text-gray-400")}>
                        {plan.Description}
                      </p>
                    </div>

                    <div className="mb-10 flex items-end gap-2">
                      <span className="text-5xl font-black tracking-tighter italic">KES {(billing.UnitPrice * 130).toLocaleString()}</span>
                      <span className={cn("text-[10px] font-bold uppercase mb-2", plan.Level === 2 ? "text-gray-500" : "text-gray-400")}>
                        / {period.slice(0, -2)}
                      </span>
                    </div>

                    <div className="flex-1 space-y-4 mb-12">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-4 opacity-50">Feature Set</p>
                      {getPlanFeatures(plan.Level).map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <Check className={cn("h-4 w-4 shrink-0", plan.Level === 2 ? "text-white" : "text-black")} />
                          <span className="text-[11px] font-bold uppercase tracking-tight leading-none">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button 
                      onClick={() => handleSubscribe(plan.Name, period, billing.UnitPrice, plan.Id)}
                      disabled={isCurrent}
                      className={cn(
                        "w-full rounded-none h-16 font-black uppercase tracking-[0.3em] text-[10px] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all",
                        plan.Level === 2 ? "bg-white text-black hover:bg-gray-100" : "bg-black text-white hover:bg-gray-900"
                      )}
                    >
                      {isCurrent ? "TERMINAL ACTIVE" : `INITIALIZE ${plan.Name}`}
                    </Button>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Trust & Support Footer (Sleek) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black border-2 border-black mx-4">
        <div className="bg-white p-12 space-y-4">
          <h4 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
            <Smartphone className="h-4 w-4" /> M-Pesa Integration
          </h4>
          <p className="text-[10px] text-gray-400 font-bold uppercase leading-relaxed tracking-wider">
            Authorize your terminal level instantly using Safaricom STK Push. Standard carrier rates apply.
          </p>
        </div>
        <div className="bg-white p-12 space-y-4">
          <h4 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
            <Globe className="h-4 w-4" /> Global Settlement
          </h4>
          <p className="text-[10px] text-gray-400 font-bold uppercase leading-relaxed tracking-wider">
            International accounts settled via secure PayPal gateway. Institutional billing available upon request.
          </p>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-none border-2 border-black p-0 overflow-hidden shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
          <div className="bg-black p-8 text-white">
            <DialogTitle className="text-3xl font-black uppercase tracking-tighter italic">Order Summary</DialogTitle>
            <DialogDescription className="text-gray-400 font-bold uppercase text-[9px] tracking-[0.2em] mt-2">
              {selectedPayment?.plan} Subscription • {selectedPayment?.period}
            </DialogDescription>
          </div>
          
          <div className="p-8 space-y-8 bg-white">
            <div className="grid grid-cols-3 gap-3">
              <PaymentMethodBtn 
                active={selectedPaymentMethod === 'mpesa'} 
                onClick={() => setSelectedPaymentMethod('mpesa')} 
                image="/images/logos/mpesa.svg" 
                label="M-PESA" 
              />
              <PaymentMethodBtn 
                active={selectedPaymentMethod === 'paypal'} 
                onClick={() => setSelectedPaymentMethod('paypal')} 
                image="/images/logos/paypal.svg" 
                label="PAYPAL" 
              />
              <PaymentMethodBtn 
                active={selectedPaymentMethod === 'card'} 
                onClick={() => setSelectedPaymentMethod('card')} 
                icon={CreditCard} 
                label="CARD" 
              />
            </div>

            <form onSubmit={form.handleSubmit(handlePayment)} className="space-y-6">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Confirmation Email</Label>
                <Input {...form.register("email")} className="rounded-none border-2 border-black focus:ring-0 h-12 font-black text-sm uppercase" />
              </div>

              {selectedPaymentMethod === 'mpesa' && (
                <div className="space-y-1.5 animate-in slide-in-from-top-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Safaricom Phone</Label>
                  <Input placeholder="2547XXXXXXXX" {...form.register("phone")} className="rounded-none border-2 border-black focus:ring-0 h-12 font-black text-sm" />
                </div>
              )}

              {selectedPaymentMethod === 'card' && (
                <div className="p-8 border-2 border-dashed border-gray-200 text-center animate-in zoom-in-95 bg-gray-50/50">
                  <div className="flex flex-col items-center gap-3">
                    <Lock className="h-6 w-6 text-gray-300" />
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Merchant Gateway Integration</p>
                    <p className="text-[14px] font-black uppercase tracking-tighter text-black italic">COMING SOON</p>
                  </div>
                </div>
              )}

              <div className="pt-6 border-t-2 border-black flex flex-col gap-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Amount Due</span>
                  <span className="text-4xl font-black tracking-tighter italic">KES {((selectedPayment?.amount || 0) * 130).toLocaleString()}</span>
                </div>
                <Button type="submit" className="w-full rounded-none h-16 bg-black text-white hover:bg-gray-900 font-black uppercase tracking-[0.4em] text-xs transition-all" disabled={loading}>
                  {loading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : "AUTHORIZE PAYMENT"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function PaymentMethodBtn({ 
  active, 
  onClick, 
  icon: Icon, 
  image, 
  label 
}: { 
  active: boolean, 
  onClick: () => void, 
  icon?: any, 
  image?: string, 
  label: string 
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-4 border-2 transition-all gap-2 rounded-none h-24 w-full",
        active 
          ? "border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] scale-[1.02] z-10" 
          : "border-gray-100 bg-white text-gray-400 hover:border-black hover:text-black"
      )}
    >
      {image ? (
        <div className={cn("relative h-8 w-16 transition-all", !active && "grayscale opacity-30")}>
          <Image src={image} alt={label} fill className="object-contain" />
        </div>
      ) : (
        <Icon className={cn("h-6 w-6", active ? "text-black" : "text-gray-400")} />
      )}
      <span className={cn("text-[8px] font-black tracking-widest", active ? "text-black" : "text-gray-400")}>{label}</span>
    </button>
  )
}