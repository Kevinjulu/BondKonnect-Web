"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Calendar, 
  BarChart3, 
  PieChart as PieChartIcon, 
  ArrowUpRight, 
  ArrowDownRight,
  Globe,
  Landmark,
  Wallet,
  Receipt,
  Download,
  Info
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from "recharts";
import { cn } from "@/lib/utils";

const marketTrendData = [
  { month: "Aug", yield: 12.5, index: 102.4 },
  { month: "Sep", yield: 13.2, index: 101.8 },
  { month: "Oct", yield: 14.1, index: 100.5 },
  { month: "Nov", yield: 13.8, index: 101.2 },
  { month: "Dec", yield: 14.5, index: 99.8 },
  { month: "Jan", yield: 15.2, index: 98.5 },
];

const revenueData = [
  { name: "Gross Interest", value: 450000 },
  { name: "Withholding Tax", value: 67500 },
  { name: "Service Fees", value: 12000 },
  { name: "Net Profit", value: 370500 },
];

export function FinancialsComponent() {
  const [activeRange, setActiveRange] = useState("6M");

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Macro Pulse Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MacroCard 
          label="Central Bank Rate (CBR)" 
          value="13.00%" 
          change="+50bps" 
          trend="up" 
          icon={Landmark}
          description="Last updated: Jan 10, 2026"
        />
        <MacroCard 
          label="Inflation Rate" 
          value="6.80%" 
          change="-0.2%" 
          trend="down" 
          icon={Activity}
          description="Core inflation (excl. food & fuel)"
        />
        <MacroCard 
          label="USD / KES" 
          value="128.45" 
          change="-1.20" 
          trend="down" 
          icon={Globe}
          description="CBK Mean Rate"
        />
        <MacroCard 
          label="OBI (K) Index" 
          value="98.54" 
          change="-0.45%" 
          trend="down" 
          icon={BarChart3}
          description="On-the-Run Bond Index"
        />
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Market Yield Analysis */}
        <Card className="xl:col-span-2 border-neutral-100 shadow-sm rounded-[32px] overflow-hidden bg-white">
          <CardHeader className="p-8 border-b border-neutral-50 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-black text-black tracking-tight">Market Yield Analysis</CardTitle>
              <CardDescription className="text-neutral-500 font-medium">Historical weighted average yields for treasury bonds.</CardDescription>
            </div>
            <div className="flex bg-neutral-100 p-1 rounded-xl">
              {["1M", "3M", "6M", "1Y"].map((range) => (
                <button
                  key={range}
                  onClick={() => setActiveRange(range)}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all",
                    activeRange === range ? "bg-black text-white shadow-lg" : "text-neutral-400 hover:text-black"
                  )}
                >
                  {range}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={marketTrendData}>
                  <defs>
                    <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#000000" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#a3a3a3', fontSize: 12, fontWeight: 600}} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#a3a3a3', fontSize: 12, fontWeight: 600}} 
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="yield" 
                    stroke="#000000" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorYield)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Financials */}
        <Card className="border-neutral-100 shadow-sm rounded-[32px] overflow-hidden bg-white">
          <CardHeader className="p-8 border-b border-neutral-50">
            <CardTitle className="text-2xl font-black text-black tracking-tight">Portfolio Revenue</CardTitle>
            <CardDescription className="text-neutral-500 font-medium">Financial breakdown of your interest earnings.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="space-y-4">
              {revenueData.map((item, i) => (
                <div key={i} className={cn(
                  "flex items-center justify-between p-4 rounded-2xl transition-all",
                  item.name === "Net Profit" ? "bg-black text-white shadow-xl shadow-neutral-200" : "bg-neutral-50"
                )}>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      item.name === "Net Profit" ? "bg-white/10" : "bg-white"
                    )}>
                      {item.name === "Withholding Tax" ? <Receipt className="h-4 w-4" /> : <Wallet className="h-4 w-4" />}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider">{item.name}</span>
                  </div>
                  <span className="text-lg font-black tracking-tighter">
                    KES {item.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="pt-6 border-t border-neutral-100">
              <div className="flex items-center gap-3 text-neutral-400 mb-4">
                <Info className="h-4 w-4" />
                <p className="text-[10px] font-bold uppercase tracking-widest leading-tight">
                  Calculated based on current value date and KRA tax guidelines.
                </p>
              </div>
              <Button className="w-full h-12 bg-neutral-100 text-black hover:bg-black hover:text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
                <Download className="h-4 w-4 mr-2" /> Download Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Auctions & Financial Calendar */}
      <section className="space-y-8">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-neutral-100 rounded-2xl text-black">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-black tracking-tight">Market Calendar</h3>
              <p className="text-sm text-neutral-500 font-medium">Upcoming bond auctions and central bank events.</p>
            </div>
          </div>
          <Button variant="outline" className="rounded-xl border-neutral-200 font-bold px-6">
            View Full Calendar
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-neutral-100 shadow-sm rounded-[32px] overflow-hidden bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-50 hover:bg-neutral-50 border-neutral-200">
                  <TableHead className="font-bold text-black h-14 px-8 uppercase text-[10px] tracking-widest">Auction Date</TableHead>
                  <TableHead className="font-bold text-black h-14 uppercase text-[10px] tracking-widest">Bond Issue</TableHead>
                  <TableHead className="font-bold text-black h-14 text-right px-8 uppercase text-[10px] tracking-widest">Value (M)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AuctionRow date="Jan 28, 2026" issue="FXD1/2026/05" amount="40,000" />
                <AuctionRow date="Feb 12, 2026" issue="IFB1/2026/10" amount="60,000" />
                <AuctionRow date="Feb 25, 2026" issue="FXD2/2026/03" amount="35,000" />
              </TableBody>
            </Table>
          </Card>

          <div className="space-y-6">
            <Card className="bg-neutral-900 text-white rounded-[32px] p-8 border-none relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
                <Landmark className="h-32 w-32" />
              </div>
              <div className="relative z-10 space-y-6">
                <Badge className="bg-white/10 text-white border-white/10 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">Monetary Policy Committee</Badge>
                <div className="space-y-2">
                  <h4 className="text-3xl font-black tracking-tighter leading-none">Next MPC Meeting</h4>
                  <p className="text-neutral-400 font-medium text-lg">February 05, 2026</p>
                </div>
                <p className="text-sm text-neutral-500 leading-relaxed max-w-sm">
                  The committee will review the current Central Bank Rate (CBR) in light of recent inflation trends and currency performance.
                </p>
                <Button className="bg-white text-black hover:bg-neutral-200 rounded-2xl px-10 h-12 font-black uppercase tracking-widest text-[10px]">
                  Set Reminder
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

function MacroCard({ label, value, change, trend, icon: Icon, description }: any) {
  return (
    <Card className="border-neutral-100 bg-white rounded-[32px] p-8 space-y-4 shadow-sm transition-all hover:border-black hover:shadow-xl hover:shadow-neutral-100 group">
      <div className="flex items-center justify-between">
        <div className="p-3 bg-neutral-100 text-black group-hover:bg-black group-hover:text-white transition-all duration-500 rounded-2xl">
          <Icon className="h-6 w-6" />
        </div>
        <div className={cn(
          "flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
          trend === 'up' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
        )}>
          {trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {change}
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{label}</p>
        <p className="text-4xl font-black text-black tracking-tighter leading-none">{value}</p>
      </div>
      <p className="text-[10px] text-neutral-400 font-medium italic">{description}</p>
    </Card>
  );
}

function AuctionRow({ date, issue, amount }: { date: string, issue: string, amount: string }) {
  return (
    <TableRow className="hover:bg-neutral-50 border-neutral-100 transition-colors">
      <TableCell className="py-6 px-8 text-sm font-bold text-black">{date}</TableCell>
      <TableCell className="py-6 font-mono text-black font-black text-base">{issue}</TableCell>
      <TableCell className="py-6 px-8 text-right font-black text-black text-base">
        <span className="text-neutral-400 text-xs mr-1">KES</span>
        {amount}
      </TableCell>
    </TableRow>
  );
}
