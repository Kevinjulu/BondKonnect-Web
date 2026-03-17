"use client"

import * as React from "react"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  CreditCard,
  MoreVertical,
  FileText,
  Download,
  Eye,
  Trash,
  CheckCircle2,
  AlertCircle,
  Phone,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Activity,
  Wallet,
  Building2,
  ChevronRight,
  X
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

export function BillingComponent({ userDetails }: { userDetails: any }) {
  const [activeTab, setActiveTab] = useState("all")
  const [isAddCardOpen, setIsAddCardOpen] = useState(false)
  const [isAddMobileOpen, setIsAddMobileOpen] = useState(false)
  const [isAddPaymentMethodOpen, setIsAddPaymentMethodOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const invoices = [
    { id: "#007", month: "Aug 2023", admin: { name: "Latifulrajar", email: "lat@gmail.com", avatar: "L" }, date: "Aug 28, 2023", amount: "KES 1,300", users: 10, status: "Paid", paymentMethod: "mpesa" },
    { id: "#006", month: "Aug 2023", admin: { name: "Sherina", email: "she@gmail.com", avatar: "S" }, date: "Aug 28, 2023", amount: "KES 1,300", users: 10, status: "Paid", paymentMethod: "mpesa" },
    { id: "#005", month: "Aug 2023", admin: { name: "Ujang", email: "uja@gmail.com", avatar: "U" }, date: "Aug 28, 2023", amount: "KES 1,300", users: 10, status: "Paid", paymentMethod: "mpesa" },
    { id: "#004", month: "Jul 2023", admin: { name: "Asep", email: "ase@gmail.com", avatar: "A" }, date: "Jul 28, 2023", amount: "KES 1,300", users: 10, status: "Paid", paymentMethod: "card" },
    { id: "#003", month: "Jul 2023", admin: { name: "Budi", email: "bud@gmail.com", avatar: "B" }, date: "Jul 28, 2023", amount: "KES 1,300", users: 10, status: "Paid", paymentMethod: "card" },
  ]

  const filteredInvoices = invoices.filter((invoice) => {
    if (activeTab === "all") return true
    if (activeTab === "mpesa") return invoice.paymentMethod === "mpesa"
    if (activeTab === "cards") return invoice.paymentMethod === "card"
    return true
  })

  return (
    <div className="space-y-12 pb-20 text-black">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Card className="border-neutral-100 shadow-sm rounded-[32px] overflow-hidden bg-white group hover:border-black transition-all">
          <CardHeader className="p-8 border-b border-neutral-50 flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-neutral-400">Current Plan</CardTitle>
              <h3 className="text-3xl font-black text-black tracking-tighter">Institutional Terminal</h3>
            </div>
            <div className="p-4 bg-neutral-100 text-black rounded-2xl group-hover:bg-black group-hover:text-white transition-colors">
              <ShieldCheck className="h-8 w-8" />
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Usage Limit</p>
                <p className="text-xl font-black text-black tracking-tight uppercase leading-none">25k Trades</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Annual Cost</p>
                <p className="text-xl font-black text-black tracking-tight uppercase leading-none">KES 150k</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Renewal</p>
                <p className="text-xl font-black text-black tracking-tight uppercase leading-none">31 Dec 2026</p>
              </div>
            </div>
            <div className="p-6 bg-neutral-50 rounded-2xl space-y-4 border border-neutral-100">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase tracking-widest text-black">Terminal Usage</h4>
                  <p className="text-[10px] text-neutral-400 font-bold italic">Resets in 12 days</p>
                </div>
                <span className="text-lg font-black text-black tracking-tighter">75%</span>
              </div>
              <div className="h-3 w-full bg-neutral-200 rounded-full overflow-hidden">
                <div className="h-full bg-black rounded-full shadow-lg" style={{ width: "75%" }}></div>
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-neutral-400">18,305 Used</span>
                <span className="text-black">25,000 Total</span>
              </div>
            </div>
            <Button variant="outline" className="w-full h-14 rounded-2xl border-neutral-200 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all shadow-sm">
              Modify Subscription <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="border-neutral-100 shadow-sm rounded-[32px] overflow-hidden bg-white group hover:border-black transition-all">
          <CardHeader className="p-8 border-b border-neutral-50 flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-neutral-400">Auxiliary Service</CardTitle>
              <h3 className="text-3xl font-black text-black tracking-tighter">Market Data Feed</h3>
            </div>
            <div className="p-4 bg-neutral-100 text-black rounded-2xl group-hover:bg-black group-hover:text-white transition-colors">
              <Activity className="h-8 w-8" />
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Active Nodes</p>
                <p className="text-xl font-black text-black tracking-tight uppercase leading-none">12 Stations</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Feed Rate</p>
                <p className="text-xl font-black text-black tracking-tight uppercase leading-none">KES 25 / req</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-neutral-400" />
                <p className="text-xs font-bold text-neutral-500 leading-relaxed uppercase">
                  Save up to 30% by purchasing institutional data bundles.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-14 rounded-xl border-neutral-100 font-bold text-[10px] uppercase tracking-widest bg-white text-black hover:border-black transition-all">50k Requests</Button>
                <Button variant="outline" className="h-14 rounded-xl border-neutral-100 font-bold text-[10px] uppercase tracking-widest bg-white text-black hover:border-black transition-all">100k Requests</Button>
                <Button variant="outline" className="h-14 rounded-xl border-neutral-100 font-bold text-[10px] uppercase tracking-widest bg-white text-black hover:border-black transition-all">Unlimited</Button>
                <Button className="h-14 rounded-xl bg-black text-white font-bold text-[10px] uppercase tracking-widest shadow-lg hover:bg-neutral-800">Purchase Pro</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-neutral-100 rounded-2xl text-black">
              <Wallet className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-black tracking-tight">Payment Methods</h2>
              <p className="text-sm text-neutral-500 font-medium">Configure primary and secondary funding nodes.</p>
            </div>
          </div>
          <Button 
            onClick={() => setIsAddPaymentMethodOpen(true)}
            className="bg-black text-white hover:bg-neutral-800 font-black uppercase tracking-widest text-[10px] px-8 h-12 rounded-2xl shadow-xl active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Method
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-neutral-100 bg-white rounded-[32px] p-8 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-neutral-100 text-black rounded-xl">
                  <CreditCard className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-black tracking-tight text-black">Credit & Debit Cards</h3>
              </div>
              <Button variant="ghost" onClick={() => setIsAddCardOpen(true)} className="h-8 w-8 p-0 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-black">
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            <div className="space-y-3">
              {[
                { label: "Visa ending in 4242", subLabel: "Expires 12/2026", isDefault: true, color: "bg-black" },
                { label: "Mastercard ending in 5555", subLabel: "Expires 08/2027", color: "bg-neutral-400" }
              ].map((method, i) => (
                <div key={i} className="flex items-center justify-between p-5 border border-neutral-100 rounded-2xl hover:border-black transition-all group">
                  <div className="flex items-center gap-5">
                    <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shadow-lg", method.color)}>
                      <CreditCard className="h-6 w-6 text-white" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-black text-black text-sm">{method.label}</p>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase">{method.subLabel}</p>
                    </div>
                  </div>
                  {method.isDefault ? (
                    <Badge className="bg-black text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg">Primary</Badge>
                  ) : (
                    <Button variant="ghost" className="text-[9px] font-black uppercase tracking-widest text-neutral-400 hover:text-black hover:bg-neutral-50 h-8">Set Primary</Button>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-neutral-100 bg-white rounded-[32px] p-8 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-neutral-100 text-black rounded-xl">
                  <Phone className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-black tracking-tight text-black">Mobile Wallets</h3>
              </div>
              <Button variant="ghost" onClick={() => setIsAddMobileOpen(true)} className="h-8 w-8 p-0 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-black">
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            <div className="space-y-3">
              {[
                { label: "Safaricom M-Pesa", subLabel: "+254 712 345 678", isDefault: true, color: "bg-black" }
              ].map((method, i) => (
                <div key={i} className="flex items-center justify-between p-5 border border-neutral-100 rounded-2xl hover:border-black transition-all group">
                  <div className="flex items-center gap-5">
                    <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shadow-lg", method.color)}>
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-black text-black text-sm">{method.label}</p>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase">{method.subLabel}</p>
                    </div>
                  </div>
                  {method.isDefault && <Badge className="bg-black text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg">Primary</Badge>}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <section className="space-y-8">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 border-b border-neutral-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-neutral-100 rounded-2xl text-black">
              <FileText className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-black tracking-tight">Billing History</h2>
              <p className="text-sm text-neutral-500 font-medium">Transaction logs for workstation and data services.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
            <div className="relative w-full sm:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 group-focus-within:text-black transition-colors" />
              <Input 
                placeholder="Search history..." 
                className="pl-12 h-12 border-neutral-200 focus:border-black rounded-2xl font-medium bg-white text-black"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={setActiveTab}>
              <TabsList className="bg-neutral-100 p-1 rounded-xl h-12">
                <TabsTrigger value="all" className="text-xs font-bold px-6 rounded-lg data-[state=active]:bg-white data-[state=active]:text-black">All</TabsTrigger>
                <TabsTrigger value="mpesa" className="text-xs font-bold px-6 rounded-lg data-[state=active]:bg-white data-[state=active]:text-black">M-Pesa</TabsTrigger>
                <TabsTrigger value="cards" className="text-xs font-bold px-6 rounded-lg data-[state=active]:bg-white data-[state=active]:text-black">Cards</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        <Card className="border-neutral-100 shadow-sm rounded-[32px] overflow-hidden bg-white">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-neutral-50 hover:bg-neutral-50 border-neutral-200">
                    <TableHead className="w-[80px] px-8 text-center"><input type="checkbox" className="h-4 w-4 rounded border-neutral-300 text-black focus:ring-black cursor-pointer" /></TableHead>
                    <TableHead className="font-bold text-black h-14 uppercase text-[10px] tracking-widest">Invoice</TableHead>
                    <TableHead className="font-bold text-black h-14 uppercase text-[10px] tracking-widest text-center">Status</TableHead>
                    <TableHead className="font-bold text-black h-14 uppercase text-[10px] tracking-widest">Billing Node</TableHead>
                    <TableHead className="font-bold text-black h-14 uppercase text-[10px] tracking-widest">Date</TableHead>
                    <TableHead className="font-bold text-black h-14 uppercase text-[10px] tracking-widest text-right">Amount</TableHead>
                    <TableHead className="w-[80px] px-8"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id} className="hover:bg-neutral-50 border-neutral-100 transition-colors group">
                      <TableCell className="px-8 py-6 text-center"><input type="checkbox" className="h-4 w-4 rounded border-neutral-300 text-black focus:ring-black cursor-pointer" /></TableCell>
                      <TableCell className="py-6">
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 bg-neutral-100 text-black rounded-xl group-hover:bg-black group-hover:text-white transition-all">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-black text-black text-sm">{invoice.id}</p>
                            <p className="text-[10px] text-neutral-400 font-bold uppercase">{invoice.month}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-6 text-center">
                        <Badge className="bg-green-50 text-green-700 border-green-100 font-bold px-3 py-1 rounded-lg">
                          <CheckCircle2 className="h-3 w-3 mr-1.5" /> Paid
                        </Badge>
                      </TableCell>
                      <TableCell className="py-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border border-neutral-200">
                            <AvatarFallback className="bg-neutral-900 text-white font-black text-[10px]">{invoice.admin.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-bold text-black">{invoice.admin.name}</p>
                            <p className="text-[10px] text-neutral-400 font-medium">{invoice.admin.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-6 text-sm font-bold text-neutral-500 uppercase">{invoice.date}</TableCell>
                      <TableCell className="py-6 text-right font-black text-black text-base tracking-tighter">{invoice.amount}</TableCell>
                      <TableCell className="px-8 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-neutral-100">
                              <MoreVertical className="h-5 w-5 text-neutral-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-2xl border-neutral-200 shadow-xl p-2 min-w-[180px] bg-white text-black">
                            <DropdownMenuItem className="rounded-xl font-bold py-3 px-4 focus:bg-neutral-50 cursor-pointer"><Eye className="h-4 w-4 mr-3" /> View</DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl font-bold py-3 px-4 focus:bg-neutral-50 cursor-pointer"><Download className="h-4 w-4 mr-3" /> Download</DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl font-bold py-3 px-4 focus:bg-red-50 text-red-600 cursor-pointer"><Trash className="h-4 w-4 mr-3" /> Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </section>

      <AddCardDialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen} />
      <AddMobileDialog open={isAddMobileOpen} onOpenChange={setIsAddMobileOpen} />
      <PaymentMethodSelector 
        open={isAddPaymentMethodOpen} 
        onOpenChange={setIsAddPaymentMethodOpen}
        onSelectCard={() => { setIsAddCardOpen(true); setIsAddPaymentMethodOpen(false); }}
        onSelectMobile={() => { setIsAddMobileOpen(true); setIsAddPaymentMethodOpen(false); }}
      />
    </div>
  )
}

function AddCardDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] border-none shadow-2xl p-0 overflow-hidden rounded-[40px] bg-white text-black">
        <DialogHeader className="p-10 pb-6 bg-white">
          <DialogTitle className="text-3xl font-black tracking-tighter text-black">Add Terminal Card</DialogTitle>
          <DialogDescription className="text-neutral-500 font-medium">Link a new credit or debit node to your workstation.</DialogDescription>
        </DialogHeader>
        <div className="px-10 pb-10 space-y-6 bg-white">
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1">Cardholder Name</Label>
            <Input placeholder="JOHN SMITH" className="h-14 rounded-2xl border-neutral-200 focus:border-black font-bold text-lg px-6 uppercase text-black" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1">Card Number</Label>
            <div className="relative">
              <Input placeholder="**** **** **** ****" className="h-14 rounded-2xl border-neutral-200 focus:border-black font-bold text-lg px-6 pr-14 text-black" />
              <CreditCard className="absolute right-5 top-1/2 -translate-y-1/2 h-6 w-6 text-neutral-300" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1">Expiry</Label>
              <Input placeholder="MM / YY" className="h-14 rounded-2xl border-neutral-200 focus:border-black font-bold text-lg px-6 text-black" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1">CVC</Label>
              <Input placeholder="***" className="h-14 rounded-2xl border-neutral-200 focus:border-black font-bold text-lg px-6 text-black" />
            </div>
          </div>
        </div>
        <DialogFooter className="p-10 pt-0 bg-neutral-50 border-t border-neutral-100 flex flex-row gap-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="flex-1 h-14 font-black uppercase tracking-widest text-xs rounded-2xl text-neutral-500 hover:text-black hover:bg-neutral-200">Cancel</Button>
          <Button className="flex-[2] bg-black text-white h-14 font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl hover:bg-neutral-800 border-none">Authorize Card</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function AddMobileDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] border-none shadow-2xl p-0 overflow-hidden rounded-[40px] bg-white text-black">
        <DialogHeader className="p-10 pb-6 bg-white">
          <DialogTitle className="text-3xl font-black tracking-tighter text-black">Mobile Node</DialogTitle>
          <DialogDescription className="text-neutral-500 font-medium">Link your M-Pesa or mobile wallet for STK Push services.</DialogDescription>
        </DialogHeader>
        <div className="px-10 pb-10 space-y-6 bg-white">
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1">Service Provider</Label>
            <Select>
              <SelectTrigger className="h-14 rounded-2xl border-neutral-200 font-bold px-6 text-black bg-white">
                <SelectValue placeholder="Select Service" />
              </SelectTrigger>
              <SelectContent className="rounded-xl bg-white border-neutral-200 text-black">
                <SelectItem value="mpesa">Safaricom M-Pesa</SelectItem>
                <SelectItem value="airtel">Airtel Money</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1">Phone Number</Label>
            <Input placeholder="+254 7XX XXX XXX" className="h-14 rounded-2xl border-neutral-200 focus:border-black font-bold text-lg px-6 text-black" />
          </div>
        </div>
        <DialogFooter className="p-10 pt-0 bg-neutral-50 border-t border-neutral-100 flex flex-row gap-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="flex-1 h-14 font-black uppercase tracking-widest text-xs rounded-2xl text-neutral-500 hover:text-black hover:bg-neutral-200">Cancel</Button>
          <Button className="flex-[2] bg-black text-white h-14 font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl hover:bg-neutral-800 border-none">Link Wallet</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function PaymentMethodSelector({ open, onOpenChange, onSelectCard, onSelectMobile }: { open: boolean, onOpenChange: (open: boolean) => void, onSelectCard: () => void, onSelectMobile: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] border-none shadow-2xl p-0 overflow-hidden rounded-[40px] bg-white text-black">
        <DialogHeader className="p-10 pb-6 bg-white">
          <DialogTitle className="text-3xl font-black tracking-tighter text-black">Add Method</DialogTitle>
          <DialogDescription className="text-neutral-500 font-medium text-lg">Select a billing node to link to your account.</DialogDescription>
        </DialogHeader>
        <div className="px-10 pb-10 space-y-4 bg-white">
          <Button
            className="w-full justify-start h-auto p-6 bg-white border border-neutral-100 hover:border-black transition-all rounded-[24px] group"
            onClick={() => onSelectCard()}
          >
            <div className="flex items-center gap-6">
              <div className="p-4 bg-neutral-100 text-black rounded-2xl group-hover:bg-black group-hover:text-white transition-colors">
                <CreditCard className="h-6 w-6" />
              </div>
              <div className="text-left space-y-1">
                <p className="font-black text-black text-lg tracking-tight">Credit or Debit Card</p>
                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Visa, Mastercard, Amex</p>
              </div>
            </div>
          </Button>
          <Button
            className="w-full justify-start h-auto p-6 bg-white border border-neutral-100 hover:border-black transition-all rounded-[24px] group"
            onClick={() => onSelectMobile()}
          >
            <div className="flex items-center gap-6">
              <div className="p-4 bg-neutral-100 text-black rounded-2xl group-hover:bg-black group-hover:text-white transition-colors">
                <Phone className="h-6 w-6" />
              </div>
              <div className="text-left space-y-1">
                <p className="font-black text-black text-lg tracking-tight">Mobile Payment</p>
                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">M-Pesa, Airtel Money</p>
              </div>
            </div>
          </Button>
          <Button className="w-full justify-start h-auto p-6 bg-white border border-neutral-100 hover:border-black transition-all rounded-[24px] group opacity-50 grayscale cursor-not-allowed">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-neutral-100 text-black rounded-2xl">
                <Building2 className="h-6 w-6" />
              </div>
              <div className="text-left space-y-1">
                <p className="font-black text-black text-lg tracking-tight">Direct Bank Transfer</p>
                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Institutional RTGS</p>
              </div>
            </div>
          </Button>
        </div>
        <div className="px-10 pb-10 bg-white text-black">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="w-full h-12 font-black uppercase tracking-widest text-xs text-neutral-400 hover:text-black">Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}