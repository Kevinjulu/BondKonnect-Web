"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Calendar, 
  ShieldCheck, 
  History, 
  ArrowUpCircle, 
  Download, 
  ExternalLink,
  ChevronRight,
  Zap,
  Clock,
  Check,
  X,
  CreditCard,
  LayoutDashboard
} from "lucide-react"
import { getUserSubscriptions } from "@/lib/actions/api.actions"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Subscription {
  Id: number;
  User: number;
  PlanId: number;
  DueDate: string;
  AmountPaid: number;
  Discount: number;
  SubscriptionStatus: number;
  created_on: string;
  PlanName?: string;
}

export function SubscriptionDashboard({ userDetails }: { userDetails: any }) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSub, setActiveSub] = useState<Subscription | null>(null)

  useEffect(() => {
    async function loadSubscriptions() {
      if (!userDetails?.email) return
      try {
        const response = await getUserSubscriptions(userDetails.email)
        if (response?.success) {
          setSubscriptions(response.data)
          const active = response.data.find((s: Subscription) => s.SubscriptionStatus === 1)
          setActiveSub(active || null)
        }
      } catch (error) {
        console.error("Failed to load subscriptions", error)
      } finally {
        setLoading(false)
      }
    }
    loadSubscriptions()
  }, [userDetails?.email])

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 w-full space-y-8">
        <div className="animate-pulse">
          <Image
            src="/images/logos/logo-c.svg"
            alt="BondKonnect"
            width={140}
            height={50}
            priority
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent"></div>
          <span className="text-sm font-black uppercase tracking-widest text-neutral-400">Loading Terminal...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatusCard 
          icon={Zap}
          label="Subscription Tier"
          value={activeSub ? (activeSub.PlanId === 3 ? "Institutional" : activeSub.PlanId === 2 ? "Professional" : "Analyst") : "No Active Plan"}
          subValue={activeSub ? "Level " + activeSub.PlanId : "Free Access"}
          active={!!activeSub}
        />
        <StatusCard 
          icon={Calendar}
          label="Next Billing Cycle"
          value={activeSub ? new Date(activeSub.DueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A"}
          subValue={activeSub ? "Renewal active" : "Subscription paused"}
        />
        <StatusCard 
          icon={Clock}
          label="Terminal Status"
          value={activeSub ? "Online" : "Offline"}
          subValue="Authenticated Node"
          status={activeSub ? "success" : "neutral"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-12">
          {/* Plan Benefits */}
          <section className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-neutral-100 rounded-2xl text-black">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-black tracking-tight">Active Benefits</h3>
                  <p className="text-sm text-neutral-500 font-medium">Features included in your current subscription tier.</p>
                </div>
              </div>
              <Link href="/apps/pricing">
                <Button className="bg-black text-white hover:bg-neutral-800 font-black uppercase tracking-widest text-[10px] px-8 h-12 rounded-2xl shadow-lg active:scale-95 transition-all">
                  Change Plan
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BenefitItem title="Real-time NSE Data" description="Direct low-latency feed from the Nairobi Securities Exchange." active={!!activeSub} />
              <BenefitItem title="Advanced Analytics" description="Portfolio duration, convexity, and risk metrics." active={activeSub && activeSub.PlanId >= 2} />
              <BenefitItem title="Institutional Quotes" description="Create and manage secondary market buy/sell quotes." active={activeSub && activeSub.PlanId >= 2} />
              <BenefitItem title="Full API Access" description="Programmatic trading and automated data export." active={activeSub && activeSub.PlanId >= 3} />
            </div>
          </section>

          {/* Billing Logs */}
          <section className="space-y-8">
            <div className="flex items-center gap-4 border-b border-neutral-100 pb-6">
              <div className="p-3 bg-neutral-100 rounded-2xl text-black">
                <History className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-black tracking-tight">Billing History</h3>
                <p className="text-sm text-neutral-500 font-medium">Transaction logs for workstation and data feeds.</p>
              </div>
            </div>

            <Card className="border-neutral-100 shadow-sm rounded-[32px] overflow-hidden bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-neutral-50 hover:bg-neutral-50 border-neutral-200">
                    <TableHead className="font-bold text-black h-14 px-8 uppercase text-[10px] tracking-widest">Billing Date</TableHead>
                    <TableHead className="font-bold text-black h-14 uppercase text-[10px] tracking-widest">Transaction Ref</TableHead>
                    <TableHead className="font-bold text-black h-14 uppercase text-[10px] tracking-widest text-right">Amount</TableHead>
                    <TableHead className="font-bold text-black h-14 text-center px-8 uppercase text-[10px] tracking-widest">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.length > 0 ? subscriptions.map((sub) => (
                    <TableRow key={sub.Id} className="hover:bg-neutral-50 border-neutral-100 transition-colors group">
                      <TableCell className="py-6 px-8 text-sm font-bold text-black">
                        {new Date(sub.created_on).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </TableCell>
                      <TableCell className="py-6 font-mono text-neutral-400 text-[11px] uppercase tracking-tighter">
                        BK-TRX-{sub.Id}-{sub.PlanId}
                      </TableCell>
                      <TableCell className="py-6 font-black text-black text-right text-base tracking-tighter">
                        KES {(sub.AmountPaid * 130).toLocaleString()}
                      </TableCell>
                      <TableCell className="py-6 px-8 text-center">
                        <Badge className={cn(
                          "rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest border-none",
                          sub.SubscriptionStatus === 1 ? "bg-black text-white" : "bg-neutral-100 text-neutral-400"
                        )}>
                          {sub.SubscriptionStatus === 1 ? "Paid" : "Inactive"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={4} className="py-20 text-center">
                        <p className="text-xs font-black uppercase tracking-widest text-neutral-300 italic">No historical data available.</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <Card className="bg-black text-white rounded-[32px] p-10 space-y-8 shadow-2xl border-none relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <CreditCard className="h-32 w-32" />
            </div>
            <div className="space-y-3 relative z-10">
              <h4 className="text-2xl font-black tracking-tighter">Institutional Support</h4>
              <p className="text-neutral-400 text-sm font-medium leading-relaxed">
                Need reconciliation for M-Pesa or PayPal? Our trade desk is available 24/7 for workstation support.
              </p>
            </div>
            <Button className="w-full h-14 bg-white text-black hover:bg-neutral-200 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl transition-all active:scale-95 relative z-10">
              Open Support Ticket
            </Button>
          </Card>

          <Card className="border-neutral-100 bg-white rounded-[32px] shadow-sm overflow-hidden">
            <div className="p-8 bg-neutral-50/50 border-b border-neutral-100">
              <h4 className="text-xs font-black uppercase tracking-widest text-neutral-500">Quick Actions</h4>
            </div>
            <div className="p-2 space-y-1">
              <QuickLink href="/apps/pricing" icon={ArrowUpCircle} label="Upgrade Terminal" />
              <QuickLink href="#" icon={Download} label="Download Invoices" isButton />
              <QuickLink href="/apps/account" icon={ExternalLink} label="Billing Settings" />
              <QuickLink href="/apps/dashboard" icon={LayoutDashboard} label="Return to Hub" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatusCard({ icon: Icon, label, value, subValue, status, active }: { icon: any, label: string, value: string, subValue: string, status?: string, active?: boolean }) {
  return (
    <Card className={cn(
      "border-neutral-100 bg-white rounded-[32px] p-8 space-y-4 shadow-sm transition-all hover:border-black hover:shadow-xl hover:shadow-neutral-100 group",
      active && "border-neutral-200"
    )}>
      <div className="flex items-center gap-3">
        <div className={cn(
          "p-2.5 rounded-xl transition-colors",
          status === 'success' ? "bg-green-50 text-green-600" : "bg-neutral-100 text-black group-hover:bg-black group-hover:text-white"
        )}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{label}</span>
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-black text-black tracking-tighter uppercase leading-none">{value}</p>
        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 italic">{subValue}</p>
      </div>
    </Card>
  )
}

function BenefitItem({ title, description, active }: { title: string, description: string, active?: any }) {
  return (
    <div className={cn(
      "p-8 rounded-[28px] border transition-all duration-300",
      active 
        ? "border-neutral-100 bg-white shadow-sm hover:border-black group" 
        : "border-neutral-50 bg-neutral-50/50 opacity-40 grayscale"
    )}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-lg font-black text-black tracking-tight">{title}</span>
        <div className={cn(
          "p-2 rounded-lg transition-colors",
          active ? "bg-black text-white" : "bg-neutral-200 text-neutral-400"
        )}>
          {active ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </div>
      </div>
      <p className="text-sm text-neutral-500 font-medium leading-relaxed">{description}</p>
    </div>
  )
}

function QuickLink({ href, icon: Icon, label, isButton }: { href: string, icon: any, label: string, isButton?: boolean }) {
  const content = (
    <>
      <div className="p-2.5 bg-neutral-100 text-black group-hover:bg-black group-hover:text-white transition-colors rounded-xl">
        <Icon className="h-4 w-4" />
      </div>
      <span className="font-bold flex-1">{label}</span>
      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
    </>
  )

  const className = "w-full flex items-center gap-4 px-6 py-4 text-sm text-neutral-500 hover:text-black hover:bg-neutral-50 transition-all rounded-2xl group"

  if (isButton) {
    return (
      <button className={className}>
        {content}
      </button>
    )
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  )
}