"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  CreditCard, 
  Calendar, 
  ShieldCheck, 
  History, 
  ArrowUpCircle, 
  Download, 
  ExternalLink,
  ChevronRight,
  Landmark,
  Zap,
  Clock,
  Check,
  X
} from "lucide-react"
import { getUserSubscriptions } from "@/lib/actions/api.actions"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Icons } from "@/components/icons"

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
      <div className="flex flex-col justify-center items-center h-96 w-full">
        <div className="mb-6 animate-pulse">
          <Image
            src="/images/logos/logo-c.svg"
            alt="BondKonnect"
            width={120}
            height={40}
            priority
          />
        </div>
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-black border border-black p-1">
        <StatusCard 
          icon={Zap}
          label="Current Tier"
          value={activeSub ? (activeSub.PlanId === 3 ? "Institutional" : activeSub.PlanId === 2 ? "Professional" : "Analyst") : "No Active Plan"}
          subValue={activeSub ? "Level " + activeSub.PlanId : "Free Access"}
          active={!!activeSub}
        />
        <StatusCard 
          icon={Calendar}
          label="Next Billing"
          value={activeSub ? new Date(activeSub.DueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A"}
          subValue={activeSub ? "Auto-renewal enabled" : "Subscription paused"}
        />
        <StatusCard 
          icon={Clock}
          label="Account Status"
          value={activeSub ? "Active" : "Inactive"}
          subValue="Verified Terminal"
          status={activeSub ? "success" : "neutral"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* Plan Details Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold uppercase tracking-tighter flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" /> Current Benefits
              </h3>
              <Link href="/apps/pricing">
                <Button className="rounded-none bg-black text-white hover:bg-gray-800 text-[10px] font-black uppercase tracking-widest px-6">
                  Manage Plan
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BenefitItem title="Real-time NSE Data" description="Direct low-latency feed from the Nairobi Securities Exchange." active={!!activeSub} />
              <BenefitItem title="Advanced Analytics" description="Portfolio duration, convexity, and risk metrics." active={activeSub && activeSub.PlanId >= 2} />
              <BenefitItem title="Institutional Quotes" description="Create and manage secondary market buy/sell quotes." active={activeSub && activeSub.PlanId >= 2} />
              <BenefitItem title="Full API Access" description="Programmatic trading and automated data export." active={activeSub && activeSub.PlanId >= 3} />
            </div>
          </section>

          {/* Billing History */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold uppercase tracking-tighter flex items-center gap-2">
                <History className="h-5 w-5" /> Transaction Logs
              </h3>
            </div>

            <div className="border border-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <table className="w-full border-collapse bg-white">
                <thead>
                  <tr className="border-b border-black bg-gray-50">
                    <th className="text-left py-4 px-6 font-black uppercase text-[10px] tracking-widest text-gray-400">Date</th>
                    <th className="text-left py-4 px-6 font-black uppercase text-[10px] tracking-widest text-gray-400">Reference</th>
                    <th className="text-left py-4 px-6 font-black uppercase text-[10px] tracking-widest text-gray-400 text-right">Amount</th>
                    <th className="text-center py-4 px-6 font-black uppercase text-[10px] tracking-widest text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.length > 0 ? subscriptions.map((sub) => (
                    <tr key={sub.Id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 text-xs font-bold text-black uppercase">{new Date(sub.created_on).toLocaleDateString()}</td>
                      <td className="py-4 px-6 text-[10px] font-mono text-gray-500 uppercase tracking-tighter">BK-SUB-{sub.Id}-{sub.PlanId}</td>
                      <td className="py-4 px-6 text-xs font-black text-black text-right tracking-tighter">KES {(sub.AmountPaid * 130).toLocaleString()}</td>
                      <td className="py-4 px-6 text-center">
                        <Badge className={cn(
                          "rounded-none text-[9px] font-black uppercase tracking-widest",
                          sub.SubscriptionStatus === 1 ? "bg-black text-white" : "bg-gray-100 text-gray-400"
                        )}>
                          {sub.SubscriptionStatus === 1 ? "Paid" : "Inactive"}
                        </Badge>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="py-12 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">No payment logs found.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Sidebar Context */}
        <div className="space-y-8">
          <div className="p-8 border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h4 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <Landmark className="h-4 w-4" /> Market Support
            </h4>
            <p className="text-[11px] text-gray-500 font-medium leading-relaxed uppercase mb-6">
              Having issues with your subscription? Our institutional support desk is available 24/7 for Safaricom M-Pesa and PayPal gateway reconciliations.
            </p>
            <Button className="w-full rounded-none bg-black text-white hover:bg-gray-900 text-[10px] font-black uppercase tracking-widest h-12">
              Contact Support
            </Button>
          </div>

          <div className="p-8 border border-gray-100 bg-gray-50">
            <h4 className="text-sm font-black uppercase tracking-widest mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/apps/pricing" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black flex items-center gap-2 group transition-colors">
                  <ArrowUpCircle className="h-3 w-3" /> Upgrade Terminal <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all" />
                </Link>
              </li>
              <li>
                <button className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black flex items-center gap-2 group transition-colors">
                  <Download className="h-3 w-3" /> Download Invoices <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all" />
                </button>
              </li>
              <li>
                <Link href="/apps/account" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black flex items-center gap-2 group transition-colors">
                  <ExternalLink className="h-3 w-3" /> Account Settings <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusCard({ icon: Icon, label, value, subValue, status, active }: { icon: any, label: string, value: string, subValue: string, status?: string, active?: boolean }) {
  return (
    <div className={cn(
      "bg-white p-8 flex flex-col gap-1 transition-all",
      active ? "ring-1 ring-inset ring-gray-100" : ""
    )}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={cn("h-4 w-4", status === 'success' ? "text-green-500" : "text-gray-400")} />
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</span>
      </div>
      <p className="text-2xl font-black uppercase tracking-tighter text-black leading-none">{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">{subValue}</p>
    </div>
  )
}

function BenefitItem({ title, description, active }: { title: string, description: string, active?: any }) {
  return (
    <div className={cn(
      "p-6 border transition-all",
      active ? "border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]" : "border-gray-100 opacity-40 bg-gray-50/50"
    )}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-black uppercase tracking-tight text-black">{title}</span>
        {active ? <Check className="h-4 w-4 text-black" /> : <X className="h-3 w-3 text-gray-400" />}
      </div>
      <p className="text-[10px] text-gray-500 leading-relaxed font-medium uppercase">{description}</p>
    </div>
  )
}
