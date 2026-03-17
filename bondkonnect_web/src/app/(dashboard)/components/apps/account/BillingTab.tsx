import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Wallet, ReceiptText, ChevronRight, CheckCircle2 } from "lucide-react"

export function BillingTab() {
  return (
    <div className="space-y-12">
      <section>
        <div className="flex flex-col gap-1 mb-10">
          <h2 className="text-2xl font-bold text-black tracking-tight">Billing & Subscriptions</h2>
          <p className="text-neutral-500 font-medium">Manage your financial preferences and service plans.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <PlanCard title="Current Plan" value="Enterprise" active />
          <PlanCard title="Next Invoice" value="Feb 22, 2026" />
          <PlanCard title="Total Spent" value="KES 45,000" />
        </div>

        <div className="space-y-8">
          <div className="p-10 border border-neutral-100 bg-white rounded-[32px] shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <CreditCard className="h-32 w-32 text-black" />
            </div>
            
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-neutral-100 rounded-2xl text-black">
                <Wallet className="h-6 w-6" />
              </div>
              <h3 className="font-black text-xs uppercase tracking-widest text-black">Payment Method</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest text-neutral-500 ml-1">Card Number</Label>
                <Input placeholder="•••• •••• •••• 4242" className="h-14 rounded-2xl border-neutral-200 focus:border-black focus:ring-1 focus:ring-black px-5 font-bold text-lg" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-xs font-black uppercase tracking-widest text-neutral-500 ml-1">Expiry</Label>
                  <Input placeholder="MM/YY" className="h-14 rounded-2xl border-neutral-200 focus:border-black focus:ring-1 focus:ring-black px-5 font-bold text-lg" />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-black uppercase tracking-widest text-neutral-500 ml-1">CVC</Label>
                  <Input placeholder="•••" className="h-14 rounded-2xl border-neutral-200 focus:border-black focus:ring-1 focus:ring-black px-5 font-bold text-lg" />
                </div>
              </div>
            </div>

            <div className="mt-12 flex justify-end">
              <Button className="bg-black text-white hover:bg-neutral-800 rounded-2xl h-14 px-10 font-black uppercase tracking-widest text-xs shadow-xl transition-all active:scale-95">
                Update Payment Method
              </Button>
            </div>
          </div>

          <div className="p-8 border border-neutral-100 bg-neutral-50/50 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 transition-all hover:bg-neutral-50 hover:border-neutral-200">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-white rounded-2xl shadow-sm text-neutral-400">
                <ReceiptText className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <p className="text-lg font-black text-black tracking-tight">Billing History</p>
                <p className="text-sm text-neutral-500 font-medium">View and download your past invoices.</p>
              </div>
            </div>
            <Button variant="outline" className="border-neutral-200 bg-white text-black hover:bg-neutral-100 rounded-2xl px-8 h-12 font-bold text-xs uppercase tracking-widest transition-all">
              View History <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

function PlanCard({ title, value, active }: { title: string, value: string, active?: boolean }) {
  return (
    <div className={`p-8 rounded-[28px] border transition-all ${active ? 'border-black bg-white text-black ring-1 ring-black shadow-xl shadow-neutral-100' : 'border-neutral-100 bg-white hover:border-neutral-200 shadow-sm'}`}>
      <div className="flex justify-between items-start mb-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{title}</p>
        {active && <CheckCircle2 className="h-4 w-4 text-black" />}
      </div>
      <p className="text-2xl font-black tracking-tighter uppercase">{value}</p>
    </div>
  )
}
