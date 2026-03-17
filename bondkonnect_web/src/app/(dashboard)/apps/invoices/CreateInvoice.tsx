"use client"

import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Calendar, 
  CreditCard, 
  Plus, 
  ArrowLeft, 
  Save, 
  Eye, 
  Download, 
  Trash2, 
  Globe, 
  Coins, 
  Palette, 
  Layout, 
  Mail,
  User,
  Building2,
  Receipt,
  FileText
} from "lucide-react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function CreateInvoicePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white text-black p-6 md:p-10 animate-in fade-in duration-500">
      <div className="max-w-[1400px] mx-auto space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-neutral-100 pb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                onClick={() => router.back()} 
                className="p-0 h-auto hover:bg-transparent text-neutral-400 hover:text-black transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Invoices
              </Button>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-black flex items-center gap-3">
              <Receipt className="h-10 w-10" /> New Terminal Invoice
            </h1>
            <p className="text-neutral-500 text-lg font-medium">Configure and generate professional workstation invoices.</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="outline" className="flex-1 md:flex-none h-12 rounded-xl border-neutral-200 font-bold px-6 bg-white hover:bg-neutral-50 transition-all">
              Save Draft
            </Button>
            <Button className="flex-1 md:flex-none h-12 bg-black text-white hover:bg-neutral-800 font-bold px-8 rounded-xl shadow-lg active:scale-95 transition-all">
              Generate & Send
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
          {/* Main Form Area */}
          <div className="xl:col-span-2 space-y-10">
            {/* Basic Info */}
            <Card className="border-neutral-100 shadow-sm rounded-[32px] overflow-hidden bg-white">
              <CardHeader className="p-8 border-b border-neutral-50">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-neutral-400 flex items-center gap-3">
                  <FileText className="h-4 w-4" /> Invoice Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2.5">
                    <Label className="text-xs font-black uppercase tracking-widest text-neutral-500 ml-1">Invoice Number</Label>
                    <Input defaultValue="INV/2026/BK-018" className="h-14 rounded-2xl border-neutral-200 focus:border-black font-bold text-lg px-6 bg-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2.5">
                      <Label className="text-xs font-black uppercase tracking-widest text-neutral-500 ml-1">Issue Date</Label>
                      <Button variant="outline" className="w-full h-14 justify-start rounded-2xl border-neutral-200 bg-white font-bold text-black px-6">
                        <Calendar className="h-4 w-4 mr-3 text-neutral-400" />
                        24 Jan 2026
                      </Button>
                    </div>
                    <div className="space-y-2.5">
                      <Label className="text-xs font-black uppercase tracking-widest text-neutral-500 ml-1">Due Date</Label>
                      <Button variant="outline" className="w-full h-14 justify-start rounded-2xl border-neutral-200 bg-white font-bold text-black px-6">
                        <Calendar className="h-4 w-4 mr-3 text-neutral-400" />
                        24 Feb 2026
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4 border-t border-neutral-50">
                  <div className="space-y-6">
                    <h3 className="text-lg font-black text-black flex items-center gap-2">
                      <Building2 className="h-5 w-5" /> From
                    </h3>
                    <div className="space-y-3">
                      <Input defaultValue="BondKonnect Financial" className="h-12 rounded-xl border-neutral-100 bg-neutral-50 font-bold" />
                      <Input defaultValue="Workstation Hub, Nairobi" className="h-12 rounded-xl border-neutral-100 bg-neutral-50 font-medium" />
                      <Input defaultValue="support@bondkonnect.com" className="h-12 rounded-xl border-neutral-100 bg-neutral-50 font-medium" />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-black text-black flex items-center gap-2">
                        <User className="h-5 w-5" /> Bill To
                      </h3>
                      <Button variant="link" className="p-0 h-auto text-xs font-black uppercase tracking-widest text-neutral-400 hover:text-black">Change</Button>
                    </div>
                    <div className="space-y-3">
                      <Input defaultValue="Institutional Client Ltd" className="h-12 rounded-xl border-neutral-200 font-bold px-5" />
                      <Input defaultValue="1901 Financial District" className="h-12 rounded-xl border-neutral-200 font-medium px-5" />
                      <Input defaultValue="finance@client.com" className="h-12 rounded-xl border-neutral-200 font-medium px-5" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Line Items */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-2xl font-black text-black tracking-tight">Line Items</h3>
                <Button variant="outline" className="rounded-xl border-neutral-200 font-bold h-10 gap-2">
                  <Plus className="h-4 w-4" /> Add Item
                </Button>
              </div>
              
              <div className="border border-neutral-100 rounded-[32px] overflow-hidden shadow-sm">
                <div className="bg-black text-white p-6">
                  <div className="grid grid-cols-12 gap-6 text-[10px] font-black uppercase tracking-widest">
                    <div className="col-span-6">Description</div>
                    <div className="col-span-2 text-center">Qty</div>
                    <div className="col-span-2 text-right">Rate (KES)</div>
                    <div className="col-span-2 text-right">Total</div>
                  </div>
                </div>
                <div className="p-6 bg-white space-y-6">
                  <ItemRow description="Terminal Access - Institutional Tier" qty="1" rate="45,000" total="45,000" />
                  <ItemRow description="NSE Real-time Data Feed (Monthly)" qty="1" rate="12,000" total="12,000" />
                  
                  <div className="pt-8 mt-8 border-t border-neutral-100 flex justify-end">
                    <div className="w-full max-w-xs space-y-4">
                      <div className="flex justify-between items-center text-sm font-bold text-neutral-500">
                        <span>Subtotal</span>
                        <span>KES 57,000</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-bold text-neutral-500">
                        <span>Tax (16%)</span>
                        <span>KES 9,120</span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-neutral-100">
                        <span className="text-lg font-black text-black">Total Due</span>
                        <span className="text-2xl font-black text-black tracking-tighter">KES 66,120</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Config */}
          <div className="space-y-8">
            {/* Preferences */}
            <Card className="border-neutral-100 shadow-sm rounded-[32px] overflow-hidden bg-white">
              <CardHeader className="p-8 bg-neutral-50/50 border-b border-neutral-100">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-neutral-500 flex items-center gap-3">
                  <Palette className="h-4 w-4" /> Customization
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-4">
                  <Label className="text-xs font-black uppercase tracking-widest text-neutral-400">Currency</Label>
                  <Select defaultValue="kes">
                    <SelectTrigger className="h-12 rounded-xl border-neutral-200 font-bold px-5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="kes">KES - Kenya Shilling</SelectItem>
                      <SelectItem value="usd">USD - US Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label className="text-xs font-black uppercase tracking-widest text-neutral-400">Payment Method</Label>
                  <Select defaultValue="mpesa">
                    <SelectTrigger className="h-12 rounded-xl border-neutral-200 font-bold px-5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="mpesa">M-Pesa STK Push</SelectItem>
                      <SelectItem value="paypal">PayPal Gateway</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label className="text-xs font-black uppercase tracking-widest text-neutral-400">Branding Color</Label>
                  <div className="flex flex-wrap gap-3">
                    {["#000000", "#404040", "#737373", "#a3a3a3", "#d4d4d4"].map((color) => (
                      <button 
                        key={color}
                        className={cn(
                          "w-8 h-8 rounded-full border-2 transition-all",
                          color === "#000000" ? "border-black scale-110 shadow-lg" : "border-transparent"
                        )}
                        style={{ backgroundColor: color }}
                        aria-label={`Select ${color}`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Email Options */}
            <Card className="border-neutral-100 shadow-sm rounded-[32px] overflow-hidden bg-white">
              <CardHeader className="p-8 bg-neutral-50/50 border-b border-neutral-100">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-neutral-500 flex items-center gap-3">
                  <Mail className="h-4 w-4" /> Dispatch
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-3 px-1">
                  <input type="checkbox" id="copy" className="h-4 w-4 rounded border-neutral-300 text-black focus:ring-black" />
                  <Label htmlFor="copy" className="text-sm font-bold text-neutral-600">Send copy to myself</Label>
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-black uppercase tracking-widest text-neutral-400">Email Message</Label>
                  <Textarea 
                    placeholder="Message to client..." 
                    className="min-h-[120px] rounded-2xl border-neutral-200 focus:border-black font-medium text-sm p-5 resize-none bg-neutral-50/30" 
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Global Actions Footer */}
        <div className="pt-10 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-6 pb-20">
          <Button variant="ghost" onClick={() => router.back()} className="font-bold text-neutral-400 hover:text-black">
            Discard Invoice
          </Button>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none h-14 rounded-2xl border-neutral-200 font-bold px-10 gap-2">
              <Eye className="h-4 w-4" /> Preview
            </Button>
            <Button className="flex-1 sm:flex-none h-14 bg-black text-white hover:bg-neutral-800 font-black uppercase tracking-widest text-[10px] px-12 rounded-2xl shadow-xl active:scale-95 transition-all">
              <Download className="h-4 w-4 mr-3" /> Download PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ItemRow({ description, qty, rate, total }: any) {
  return (
    <div className="grid grid-cols-12 gap-6 items-center group">
      <div className="col-span-6">
        <Input defaultValue={description} className="h-12 rounded-xl border-neutral-100 bg-neutral-50/50 focus:bg-white focus:border-black font-bold px-5 transition-all" />
      </div>
      <div className="col-span-2">
        <Input defaultValue={qty} className="h-12 rounded-xl border-neutral-100 bg-neutral-50/50 text-center font-bold" />
      </div>
      <div className="col-span-2">
        <Input defaultValue={rate} className="h-12 rounded-xl border-neutral-100 bg-neutral-50/50 text-right font-bold pr-5" />
      </div>
      <div className="col-span-2 text-right">
        <p className="text-sm font-black text-black pr-2">{total}</p>
      </div>
    </div>
  )
}