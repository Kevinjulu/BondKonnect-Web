"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Clock,
  Filter,
  Search,
  MoreVertical,
  FileText,
  Calendar,
  Download,
  Trash,
  Edit,
  Eye,
  DollarSign,
  Mail,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertCircle,
  X
} from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export function InvoicesComponent() {
  const [filterOpen, setFilterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const invoices = [
    { id: "INV-054", customer: "Jane Cooper", date: "Jan 23, 2026", total: "KES 28,000", status: "Paid", amount: "KES 0" },
    { id: "INV-055", customer: "Esther Howard", date: "Jan 23, 2026", total: "KES 15,200", status: "Paid", amount: "KES 0" },
    { id: "INV-056", customer: "Cameron Williamson", date: "Jan 22, 2026", total: "KES 42,800", status: "Draft", amount: "KES 42,800" },
    { id: "INV-057", customer: "Brooklyn Simmons", date: "Jan 20, 2026", total: "KES 8,400", status: "Paid", amount: "KES 0" },
    { id: "INV-058", customer: "Leslie Alexander", date: "Jan 18, 2026", total: "KES 12,000", status: "Overdue", amount: "KES 12,000" },
    { id: "INV-059", customer: "Arlene McCoy", date: "Jan 15, 2026", total: "KES 2,800", status: "Overdue", amount: "KES 2,800" },
    { id: "INV-060", customer: "Marvin McKinney", date: "Jan 12, 2026", total: "KES 35,000", status: "Overdue", amount: "KES 35,000" },
    { id: "INV-061", customer: "Kathryn Murphy", date: "Jan 10, 2026", total: "KES 11,400", status: "Overdue", amount: "KES 11,400" },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return (
          <Badge className="bg-green-50 text-green-700 border-green-100 hover:bg-green-50 font-bold px-3 py-1 rounded-lg flex items-center gap-1.5 w-fit">
            <CheckCircle2 className="h-3 w-3" /> Paid
          </Badge>
        )
      case "Draft":
        return (
          <Badge className="bg-neutral-100 text-neutral-500 border-neutral-200 hover:bg-neutral-100 font-bold px-3 py-1 rounded-lg flex items-center gap-1.5 w-fit">
            <FileText className="h-3 w-3" /> Draft
          </Badge>
        )
      case "Overdue":
        return (
          <Badge className="bg-red-50 text-red-700 border-red-100 hover:bg-red-50 font-bold px-3 py-1 rounded-lg flex items-center gap-1.5 w-fit">
            <AlertCircle className="h-3 w-3" /> Overdue
          </Badge>
        )
      default:
        return <Badge className="font-bold px-3 py-1 rounded-lg">{status}</Badge>
    }
  }

  return (
    <div className="space-y-10">
      {/* Action Header */}
      <div className="flex justify-end">
        <Button 
          onClick={() => router.push("/apps/invoices/CreateInvoice")} 
          className="bg-black text-white hover:bg-neutral-800 font-bold px-8 h-14 rounded-2xl shadow-xl flex items-center gap-3 active:scale-95 transition-all"
        >
          <Plus className="h-5 w-5" /> Create New Invoice
        </Button>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          label="Overdue Total" 
          value="KES 60,400" 
          icon={Clock} 
          trend="up" 
          trendValue="+12%" 
          description="Requires immediate action"
        />
        <MetricCard 
          label="Drafted Volume" 
          value="KES 42,800" 
          icon={FileText} 
          description="Invoices awaiting dispatch"
        />
        <MetricCard 
          label="Unpaid Balance" 
          value="KES 103,200" 
          icon={DollarSign} 
          trend="down" 
          trendValue="-5%"
          description="Total outstanding receivables"
        />
        <MetricCard 
          label="Avg. Payment Cycle" 
          value="08 Days" 
          icon={CheckCircle2} 
          description="Average time to settlement"
        />
      </div>

      {/* Filters & Table Section */}
      <Card className="border-neutral-100 shadow-sm rounded-[32px] overflow-hidden bg-white">
        <CardHeader className="p-8 border-b border-neutral-50 space-y-6">
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
            <div className="relative w-full max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 group-focus-within:text-black transition-colors" />
              <Input 
                placeholder="Search by invoice # or customer..." 
                className="pl-12 h-12 border-neutral-200 focus:border-black focus:ring-1 focus:ring-black rounded-2xl font-medium bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Tabs defaultValue="all" className="w-auto">
                <TabsList className="bg-neutral-100 p-1 rounded-xl h-11">
                  <TabsTrigger value="all" className="text-xs font-bold px-6 rounded-lg data-[state=active]:bg-white data-[state=active]:text-black">
                    All <Badge className="ml-2 bg-neutral-200 text-neutral-600 border-none group-data-[state=active]:bg-black group-data-[state=active]:text-white">54</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="unpaid" className="text-xs font-bold px-6 rounded-lg data-[state=active]:bg-white data-[state=active]:text-black">
                    Unpaid <Badge className="ml-2 bg-neutral-200 text-neutral-600 border-none">16</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="draft" className="text-xs font-bold px-6 rounded-lg data-[state=active]:bg-white data-[state=active]:text-black">
                    Draft <Badge className="ml-2 bg-neutral-200 text-neutral-600 border-none">3</Badge>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <Button 
                variant="outline" 
                className={cn(
                  "h-11 rounded-xl border-neutral-200 font-bold px-6 gap-2 bg-white",
                  filterOpen && "border-black bg-neutral-50"
                )}
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <Filter className="h-4 w-4" /> Filter
              </Button>

              <Select defaultValue="newest">
                <SelectTrigger className="w-[180px] h-11 rounded-xl border-neutral-200 bg-white font-bold text-xs focus:ring-black">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-neutral-200">
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="highest">Highest Amount</SelectItem>
                  <SelectItem value="lowest">Lowest Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filterOpen && (
            <div className="p-6 bg-neutral-50/50 border border-neutral-100 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-4 duration-300 relative">
              <button 
                onClick={() => setFilterOpen(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-black"
              >
                <X className="h-4 w-4" />
              </button>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Customer</label>
                <Select>
                  <SelectTrigger className="h-12 bg-white border-neutral-200 rounded-xl font-bold">
                    <SelectValue placeholder="All Customers" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">All Customers</SelectItem>
                    <SelectItem value="active">Active Accounts</SelectItem>
                    <SelectItem value="institutional">Institutional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Status</label>
                <Select>
                  <SelectTrigger className="h-12 bg-white border-neutral-200 rounded-xl font-bold">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Date Range</label>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 h-12 justify-start rounded-xl border-neutral-200 bg-white font-bold text-neutral-500">
                    <Calendar className="h-4 w-4 mr-2" /> From
                  </Button>
                  <Button variant="outline" className="flex-1 h-12 justify-start rounded-xl border-neutral-200 bg-white font-bold text-neutral-500">
                    <Calendar className="h-4 w-4 mr-2" /> To
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-0 bg-white">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-50 hover:bg-neutral-50 border-neutral-200">
                  <TableHead className="w-[80px] px-8">
                    <div className="flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 rounded border-neutral-300 text-black focus:ring-black"
                        aria-label="Select all invoices" 
                      />
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-black h-14 uppercase text-[10px] tracking-widest">Status</TableHead>
                  <TableHead className="font-bold text-black h-14 uppercase text-[10px] tracking-widest">Billing Date</TableHead>
                  <TableHead className="font-bold text-black h-14 uppercase text-[10px] tracking-widest">Invoice #</TableHead>
                  <TableHead className="font-bold text-black h-14 uppercase text-[10px] tracking-widest">Customer</TableHead>
                  <TableHead className="font-bold text-black h-14 uppercase text-[10px] tracking-widest">Total Amount</TableHead>
                  <TableHead className="font-bold text-black h-14 uppercase text-[10px] tracking-widest text-right">Balance Due</TableHead>
                  <TableHead className="w-[80px] px-8"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice, index) => (
                  <TableRow key={index} className="hover:bg-neutral-50 border-neutral-100 transition-colors group">
                    <TableCell className="px-8 py-6">
                      <div className="flex items-center justify-center">
                        <input 
                          type="checkbox" 
                          className="h-4 w-4 rounded border-neutral-300 text-black focus:ring-black" 
                          aria-label={`Select invoice ${invoice.id}`}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="py-6">{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell className="py-6 text-sm font-bold text-black">{invoice.date}</TableCell>
                    <TableCell className="py-6 font-mono text-neutral-400 text-[11px] uppercase tracking-tighter">{invoice.id}</TableCell>
                    <TableCell className="py-6 font-black text-black text-sm">{invoice.customer}</TableCell>
                    <TableCell className="py-6 font-black text-black text-sm">{invoice.total}</TableCell>
                    <TableCell className="py-6 text-right font-black text-black text-sm">{invoice.amount}</TableCell>
                    <TableCell className="px-8 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-xl hover:bg-neutral-100 transition-colors">
                            <MoreVertical className="h-5 w-5 text-neutral-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-2xl border-neutral-200 shadow-xl p-2 min-w-[200px] bg-white">
                          <DropdownMenuItem className="rounded-xl font-bold py-3 px-4 focus:bg-neutral-50">
                            <Eye className="h-4 w-4 mr-3 text-neutral-400" /> View Invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-xl font-bold py-3 px-4 focus:bg-neutral-50">
                            <Edit className="h-4 w-4 mr-3 text-neutral-400" /> Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-xl font-bold py-3 px-4 focus:bg-neutral-50">
                            <Download className="h-4 w-4 mr-3 text-neutral-400" /> Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-xl font-bold py-3 px-4 focus:bg-neutral-50">
                            <Mail className="h-4 w-4 mr-3 text-neutral-400" /> Resend to Email
                          </DropdownMenuItem>
                          <div className="h-px bg-neutral-100 my-2" />
                          <DropdownMenuItem className="rounded-xl font-bold py-3 px-4 focus:bg-red-50 text-red-600">
                            <Trash className="h-4 w-4 mr-3" /> Delete Invoice
                          </DropdownMenuItem>
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
    </div>
  )
}

function MetricCard({ label, value, icon: Icon, trend, trendValue, description }: any) {
  return (
    <Card className="border-neutral-100 bg-white rounded-[32px] p-8 space-y-4 shadow-sm transition-all hover:border-black hover:shadow-xl hover:shadow-neutral-100 group">
      <div className="flex items-center justify-between">
        <div className="p-3 bg-neutral-100 text-black group-hover:bg-black group-hover:text-white transition-all duration-500 rounded-2xl">
          <Icon className="h-6 w-6" />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
            trend === 'up' ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
          )}>
            {trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {trendValue}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{label}</p>
        <p className="text-3xl font-black text-black tracking-tighter leading-none">{value}</p>
      </div>
      <p className="text-[10px] text-neutral-400 font-medium italic">{description}</p>
    </Card>
  )
}