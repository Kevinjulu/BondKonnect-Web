"use client"

import { Check, X, Smartphone, Globe, CreditCard, ChevronRight, Zap, Target, Crown, Lock, ShieldCheck, Clock } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"
import LogoImage from "@/components/ui/LogoImage"
import { useLogoSrc } from "@/hooks/use-logo-src"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { getAllSubscriptionPlans, initiateMpesaStkPush, createPaypalOrder, getUserSubscriptions } from "@/lib/actions/api.actions"
import { env } from "@/app/config/env"
import React from "react"
import { useToast } from "@/hooks/use-toast"
import { Icons } from "@/components/icons"
import { pollMpesaStatus } from "./payment-utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

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
  const logoSrc = useLogoSrc('dashboard')

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
              toast({ title: "Terminal Activated", description: "Your workstation has been upgraded." });
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
          const paypalBaseUrl = env.NEXT_PUBLIC_PAYPAL_ENV === 'live' 
            ? 'https://www.paypal.com/checkoutnow' 
            : 'https://www.sandbox.paypal.com/checkoutnow';
          const paypalUrl = `${paypalBaseUrl}?token=${res.order_id}`;
          toast({ title: "Redirecting", description: "Opening secure PayPal gateway..." });
          window.open(paypalUrl, '_blank');
          toast({ 
            title: "Waiting for Approval", 
            description: "Complete payment in the new window then sync status.",
            action: (
              <Button size="sm" className="bg-black text-white rounded-lg" onClick={() => window.location.reload()}>
                Sync
              </Button>
            )
          });
        }
        setLoading(false);
      } else {
        toast({ title: "Coming Soon", description: "Direct Card Entry is under final review." });
        setLoading(false);
      }
    } catch (error: any) {
      toast({ title: "System Error", description: error.message, variant: "destructive" });
      setLoading(false);
    }
  }

  if (loadingPlans) return (
    <div className="flex flex-col justify-center items-center h-96 w-full space-y-6">
      <div className="animate-pulse">
        <LogoImage src={logoSrc} alt="BondKonnect" width={140} height={50} priority />
      </div>
      <div className="flex items-center gap-3 text-neutral-400">
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent"></div>
        <span className="text-xs font-black uppercase tracking-widest">Compiling Models...</span>
      </div>
    </div>
  );

  const getPlanFeatures = (level: number) => {
    if (level === 1) return ["Basic Bond Calculator", "Historical Data Access", "Daily Market Summaries", "Email Support"];
    if (level === 2) return ["Analyst Features +", "Real-time NSE Quotes", "Advanced Portfolio Tracking", "Corporate Bond Analytics", "Priority Support"];
    return ["Professional Features +", "Full Deal Execution", "IFRS 9 ECL Modeling", "Institutional API Access", "Account Manager"];
  };

  const getPlanIcon = (level: number) => {
    if (level === 1) return Zap;
    if (level === 2) return Target;
    return Crown;
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-1000">
      <Tabs defaultValue="monthly" className="w-full space-y-12">
        <div className="flex justify-center">
          <TabsList className="bg-neutral-100 p-1 rounded-2xl h-14 border border-neutral-200">
            <TabsTrigger value="daily" className="rounded-xl px-10 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg">Daily</TabsTrigger>
            <TabsTrigger value="weekly" className="rounded-xl px-10 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg">Weekly</TabsTrigger>
            <TabsTrigger value="monthly" className="rounded-xl px-10 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg">Monthly</TabsTrigger>
          </TabsList>
        </div>

        {['daily', 'weekly', 'monthly'].map(period => (
          <TabsContent key={period} value={period} className="w-full focus-visible:ring-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {subscriptionPlans.sort((a, b) => a.Level - b.Level).map((plan) => {
                const days = period === 'daily' ? 1 : period === 'weekly' ? 7 : 30;
                const billing = plan.billingDetails.find(b => b.Days === days);
                if (!billing) return null;
                const isCurrent = userActiveSubscription?.PlanId === plan.Id;
                const PlanIcon = getPlanIcon(plan.Level);

                return (
                  <Card key={plan.Id} className={cn(
                    "flex flex-col border border-neutral-100 rounded-[40px] p-10 transition-all duration-500 relative bg-white",
                    plan.Level === 2 ? "ring-2 ring-black scale-105 z-10 shadow-2xl shadow-neutral-200" : "hover:border-black hover:shadow-xl hover:shadow-neutral-100"
                  )}>
                    {isCurrent && (
                      <div className="absolute top-6 right-10 flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-full text-[9px] font-black uppercase tracking-widest">
                        <Check className="h-3 w-3" /> Active
                      </div>
                    )}
                    
                    <div className="mb-10">
                      <div className={cn("p-4 rounded-2xl w-fit mb-8 shadow-sm transition-colors", plan.Level === 2 ? "bg-black text-white" : "bg-neutral-100 text-black")}>
                        <PlanIcon className="h-8 w-8" />
                      </div>
                      <h3 className="text-3xl font-black text-black tracking-tighter uppercase">{plan.Name}</h3>
                      <p className="text-neutral-500 font-medium text-sm mt-3 leading-relaxed">
                        {plan.Description}
                      </p>
                    </div>

                    <div className="mb-10 flex items-end gap-2">
                      <span className="text-5xl font-black text-black tracking-tighter">
                        KES {(billing.UnitPrice * 130).toLocaleString()}
                      </span>
                      <span className="text-neutral-400 font-bold uppercase text-[10px] mb-2 tracking-widest">
                        / {period === 'daily' ? 'Day' : period === 'weekly' ? 'Week' : 'Month'}
                      </span>
                    </div>

                    <div className="flex-1 space-y-5 mb-12">
                      <div className="h-px bg-neutral-100 w-full mb-8" />
                      {getPlanFeatures(plan.Level).map((feature, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className={cn("p-1 rounded-full", plan.Level === 2 ? "bg-black text-white" : "bg-neutral-100 text-black")}>
                            <Check className="h-3 w-3" />
                          </div>
                          <span className="text-xs font-bold text-black uppercase tracking-tight">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button 
                      onClick={() => handleSubscribe(plan.Name, period, billing.UnitPrice, plan.Id)}
                      disabled={isCurrent}
                      className={cn(
                        "w-full h-16 rounded-[20px] font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 disabled:opacity-30",
                        plan.Level === 2 ? "bg-black text-white hover:bg-neutral-800 shadow-xl" : "bg-white text-black border border-neutral-200 hover:border-black"
                      )}
                    >
                      {isCurrent ? "Workstation Active" : `Authorize ${plan.Name}`}
                    </Button>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Trust Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
        <Card className="rounded-[32px] border-neutral-100 bg-neutral-50/50 p-10 space-y-6 group hover:bg-white hover:border-black transition-all duration-500">
          <div className="p-4 bg-white rounded-2xl w-fit shadow-sm group-hover:bg-black group-hover:text-white transition-all">
            <Smartphone className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-black text-black tracking-tight uppercase">M-Pesa Authorization</h4>
            <p className="text-sm text-neutral-500 font-medium leading-relaxed">
              Instant workstation activation using Safaricom STK Push. Secure, encrypted, and direct from your mobile node.
            </p>
          </div>
        </Card>
        <Card className="rounded-[32px] border-neutral-100 bg-neutral-50/50 p-10 space-y-6 group hover:bg-white hover:border-black transition-all duration-500">
          <div className="p-4 bg-white rounded-2xl w-fit shadow-sm group-hover:bg-black group-hover:text-white transition-all">
            <Globe className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-black text-black tracking-tight uppercase">Institutional Settlement</h4>
            <p className="text-sm text-neutral-500 font-medium leading-relaxed">
              Global accounts settled via secure PayPal gateway. Institutional direct billing and volume licensing available.
            </p>
          </div>
        </Card>
      </div>

      {/* Modern Payment Dialog */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-[40px] border-none p-0 overflow-hidden shadow-2xl bg-white">
          <DialogHeader className="p-10 pb-8 bg-black text-white">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="h-6 w-6" />
              <Badge className="bg-white/10 text-white border-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Order Node</Badge>
            </div>
            <DialogTitle className="text-4xl font-black tracking-tighter uppercase">Initialize Access</DialogTitle>
            <DialogDescription className="text-neutral-400 font-medium text-lg pt-2 italic">
              {selectedPayment?.plan} Node • {selectedPayment?.period} duration
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-10 space-y-10 bg-white">
            <div className="grid grid-cols-3 gap-4">
              <PaymentNode 
                active={selectedPaymentMethod === 'mpesa'} 
                onClick={() => setSelectedPaymentMethod('mpesa')} 
                image="/images/logos/mpesa.svg"
                label="M-PESA" 
              />
              <PaymentNode 
                active={selectedPaymentMethod === 'paypal'} 
                onClick={() => setSelectedPaymentMethod('paypal')} 
                image="/images/logos/paypal.svg"
                label="PAYPAL" 
              />
              <PaymentNode 
                active={selectedPaymentMethod === 'card'} 
                onClick={() => setSelectedPaymentMethod('card')} 
                icon={CreditCard} 
                label="CARD" 
              />
            </div>

            <form onSubmit={form.handleSubmit(handlePayment)} className="space-y-8">
              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1">Confirmation Path (Email)</Label>
                <Input {...form.register("email")} className="h-14 rounded-2xl border-neutral-200 focus:border-black font-bold text-lg px-6 bg-white text-black" />
              </div>

              {selectedPaymentMethod === 'mpesa' && (
                <div className="space-y-3 animate-in slide-in-from-top-4">
                  <Label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1">Mobile Node Number</Label>
                  <Input placeholder="254 7XX XXX XXX" {...form.register("phone")} className="h-14 rounded-2xl border-neutral-200 focus:border-black font-bold text-lg px-6 bg-white text-black" />
                </div>
              )}

              {selectedPaymentMethod === 'card' && (
                <div className="p-10 bg-neutral-50 rounded-[32px] border border-neutral-100 text-center animate-in zoom-in-95">
                  <Lock className="h-8 w-8 text-neutral-200 mx-auto mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Node Synchronization</p>
                  <p className="text-lg font-black text-black uppercase tracking-tight mt-1">Pending Approval</p>
                </div>
              )}

              <div className="pt-8 border-t border-neutral-100 flex flex-col gap-6">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Settlement Amount</p>
                    <p className="text-4xl font-black text-black tracking-tighter italic">KES {((selectedPayment?.amount || 0) * 130).toLocaleString()}</p>
                  </div>
                  <Clock className="h-6 w-6 text-neutral-200 mb-2" />
                </div>
                <Button type="submit" className="w-full h-16 bg-black text-white hover:bg-neutral-800 font-black uppercase tracking-widest text-xs rounded-3xl shadow-xl active:scale-95 transition-all" disabled={loading}>
                  {loading ? <Icons.spinner className="mr-2 h-5 w-5 animate-spin" /> : "Authorize Settlement"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function PlanMetric({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{label}</p>
      <p className="text-lg font-black text-black tracking-tight leading-none">{value}</p>
    </div>
  )
}

function PaymentNode({ active, onClick, icon: Icon, image, label }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-6 rounded-[24px] border transition-all gap-3 h-32 w-full",
        active 
          ? "border-black bg-white shadow-xl shadow-neutral-100 scale-105 z-10" 
          : "border-neutral-100 bg-neutral-50/50 text-neutral-400 hover:border-black hover:text-black"
      )}
    >
      {image ? (
        <div className={cn("relative h-10 w-full transition-all", !active && "grayscale opacity-40")}>
          <Image src={image} alt={label} fill className="object-contain" />
        </div>
      ) : (
        <Icon className={cn("h-6 w-6", active ? "text-black" : "text-neutral-300")} />
      )}
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  )
}
