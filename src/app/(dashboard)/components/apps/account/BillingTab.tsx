import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Wallet, ReceiptText, ChevronRight } from "lucide-react"

export function BillingTab() {
  return (
    <div className="space-y-12">
      <section>
        <div className="flex flex-col gap-1 mb-8">
          <h2 className="text-xl font-semibold text-black">Billing & Subscription</h2>
          <p className="text-sm text-gray-500">Manage your payment methods and current plan.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <PlanCard title="Current Plan" value="Enterprise" active />
          <PlanCard title="Next Invoice" value="Feb 22, 2026" />
          <PlanCard title="Total Spent" value="KES 45,000" />
        </div>

        <div className="space-y-6">
          <div className="p-8 border border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="h-5 w-5 text-black" />
              <h3 className="font-bold text-sm uppercase tracking-widest text-black">Payment Method</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Card Number</Label>
                <Input placeholder="•••• •••• •••• 4242" className="rounded-none border-gray-200 focus:border-black focus:ring-0" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Expiry</Label>
                  <Input placeholder="MM/YY" className="rounded-none border-gray-200 focus:border-black focus:ring-0" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">CVC</Label>
                  <Input placeholder="•••" className="rounded-none border-gray-200 focus:border-black focus:ring-0" />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button className="bg-black text-white hover:bg-gray-800 rounded-none text-[10px] font-bold uppercase tracking-widest px-8 py-6 h-auto transition-all active:scale-95">
                Update Payment Method
              </Button>
            </div>
          </div>

          <div className="p-6 border border-gray-100 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ReceiptText className="h-5 w-5 text-gray-400" />
              <div className="flex flex-col">
                <p className="text-sm font-bold text-black uppercase tracking-tight">Billing History</p>
                <p className="text-xs text-gray-500">View and download your past invoices.</p>
              </div>
            </div>
            <Button className="bg-black text-white hover:bg-gray-800 rounded-none text-xs font-bold uppercase group px-6 py-2 h-auto transition-all active:scale-95">
              View History <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

function PlanCard({ title, value, active }: { title: string, value: string, active?: boolean }) {
  return (
    <div className={`p-6 border ${active ? 'border-black bg-white text-black ring-1 ring-black' : 'border-gray-100 bg-white'}`}>
      <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-400`}>{title}</p>
      <p className="text-xl font-bold uppercase tracking-tight">{value}</p>
    </div>
  )
}