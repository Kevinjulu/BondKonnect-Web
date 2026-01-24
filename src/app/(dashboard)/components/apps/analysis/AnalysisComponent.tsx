"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts"
import { 
  Download, 
  Calendar, 
  ArrowUpRight, 
  TrendingUp, 
  TrendingDown,
  Activity, 
  PieChart as PieChartIcon, 
  BarChart3, 
  Briefcase,
  Search,
  Filter,
  ArrowDownRight,
  Info,
  Terminal,
  ChevronRight,
  Shield,
  AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

function ShieldCheckIcon(props: any) {
  return <Shield {...props} />
}

export function AnalysisComponent() {
  const [activeTab, setActiveRange] = useState("6M")

  // Bond-specific analytics data
  const yieldTrendData = [
    { month: "Aug", treasury: 12.5, corporate: 14.2, infrastructure: 13.8 },
    { month: "Sep", treasury: 13.2, corporate: 14.8, infrastructure: 14.1 },
    { month: "Oct", treasury: 14.1, corporate: 15.5, infrastructure: 14.9 },
    { month: "Nov", treasury: 13.8, corporate: 15.2, infrastructure: 14.5 },
    { month: "Dec", treasury: 14.5, corporate: 16.1, infrastructure: 15.2 },
    { month: "Jan", treasury: 15.2, corporate: 16.8, infrastructure: 15.8 },
  ]

  const allocationData = [
    { name: "Treasury Bonds", value: 65, color: "#000000" },
    { name: "Infrastructure", value: 20, color: "#404040" },
    { name: "Corporate Bonds", value: 10, color: "#737373" },
    { name: "T-Bills", value: 5, color: "#a3a3a3" },
  ]

  const riskMetrics = [
    { id: 1, metric: "Portfolio Duration", current: "6.42 Yrs", target: "6.50 Yrs", status: "Optimal", impact: "Low" },
    { id: 2, metric: "Convexity", current: "48.12", target: "45.00", status: "Elevated", impact: "Medium" },
    { id: 3, metric: "VaR (95%)", current: "KES 4.2M", target: "KES 5.0M", status: "Safe", impact: "Low" },
    { id: 4, metric: "Weighted Avg. YTM", current: "14.85%", target: "14.50%", status: "High", impact: "Positive" },
  ]

  const tradeVolumeData = [
    { day: "Mon", buys: 420, sells: 380 },
    { day: "Tue", buys: 550, sells: 410 },
    { day: "Wed", buys: 390, sells: 490 },
    { day: "Thu", buys: 610, sells: 320 },
    { day: "Fri", buys: 480, sells: 550 },
  ]

  return (
    <div className="space-y-10">
      {/* High-Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          label="Portfolio Yield" 
          value="14.85%" 
          trend="up" 
          change="+42bps" 
          icon={TrendingUp}
          description="vs. Benchmark OBI"
        />
        <MetricCard 
          label="Active Exposure" 
          value="KES 450M" 
          trend="up" 
          change="+12.5%" 
          icon={Briefcase}
          description="Total Held-for-Sale"
        />
        <MetricCard 
          label="Market Volume" 
          value="KES 2.8B" 
          trend="down" 
          change="-8.4%" 
          icon={Activity}
          description="Last 24h NSE Volume"
        />
        <MetricCard 
          label="Risk Buffer" 
          value="Optimal" 
          icon={ShieldCheckIcon}
          description="Duration matched"
          status="success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Yield Trend Analysis */}
        <Card className="lg:col-span-2 border-neutral-100 shadow-sm rounded-[32px] overflow-hidden bg-white">
          <CardHeader className="p-8 border-b border-neutral-50 flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-black text-black tracking-tight">Yield Multi-Curve Analysis</CardTitle>
              <CardDescription className="text-neutral-500 font-medium">Comparative historical trends for different bond categories.</CardDescription>
            </div>
            <div className="flex bg-neutral-100 p-1 rounded-xl">
              {["1M", "3M", "6M", "1Y"].map((range) => (
                <button
                  key={range}
                  onClick={() => setActiveRange(range)}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all",
                    activeTab === range ? "bg-black text-white shadow-lg" : "text-neutral-400 hover:text-black"
                  )}
                >
                  {range}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[400px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yieldTrendData}>
                  <defs>
                    <linearGradient id="colorTreasury" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#000000" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#a3a3a3', fontSize: 12, fontWeight: 700}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#a3a3a3', fontSize: 12, fontWeight: 700}} dx={-10} />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  />
                  <Area type="monotone" dataKey="treasury" name="Treasury Curve" stroke="#000000" strokeWidth={3} fillOpacity={1} fill="url(#colorTreasury)" />
                  <Area type="monotone" dataKey="corporate" name="Corporate Spread" stroke="#737373" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center mt-8 gap-8">
              <LegendItem label="Treasury" color="bg-black" />
              <LegendItem label="Corporate" color="bg-neutral-400" dashed />
              <LegendItem label="Infrastructure" color="bg-neutral-200" />
            </div>
          </CardContent>
        </Card>

        {/* Asset Allocation */}
        <Card className="border-neutral-100 shadow-sm rounded-[32px] overflow-hidden bg-white">
          <CardHeader className="p-8 border-b border-neutral-50">
            <CardTitle className="text-2xl font-black text-black tracking-tight">Portfolio Mix</CardTitle>
            <CardDescription className="text-neutral-500 font-medium">Diversification across bond instruments.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-10">
            <div className="h-[280px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl font-black text-black tracking-tighter">100%</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Allocated</span>
              </div>
            </div>
            
            <div className="space-y-4 pt-4">
              {allocationData.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 hover:bg-neutral-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={cn("h-3 w-3 rounded-full", i === 0 ? "bg-black" : i === 1 ? "bg-neutral-600" : "bg-neutral-300")} />
                    <span className="text-xs font-bold text-black uppercase tracking-tight">{item.name}</span>
                  </div>
                  <span className="text-sm font-black text-black">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Metrics Table */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-neutral-100 rounded-2xl text-black">
              <ShieldCheckIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-black tracking-tight">Risk Budgeting Indicators</h3>
              <p className="text-sm text-neutral-500 font-medium">Critical portfolio management and sensitivity metrics.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl border-neutral-200 bg-white font-bold h-12 px-6">
              <Filter className="h-4 w-4 mr-2" /> Parameters
            </Button>
            <Button className="bg-black text-white hover:bg-neutral-800 font-black uppercase tracking-widest text-[10px] h-12 px-8 rounded-xl shadow-lg transition-all active:scale-95">
              <Download className="h-4 w-4 mr-2" /> Export Audit
            </Button>
          </div>
        </div>

        <Card className="border-neutral-100 shadow-sm rounded-[32px] overflow-hidden bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-50 hover:bg-neutral-50 border-neutral-200">
                <TableHead className="font-bold text-black h-16 px-8 uppercase text-[10px] tracking-widest">Metric Description</TableHead>
                <TableHead className="font-bold text-black h-16 uppercase text-[10px] tracking-widest text-center">Current State</TableHead>
                <TableHead className="font-bold text-black h-16 uppercase text-[10px] tracking-widest text-center">Target Range</TableHead>
                <TableHead className="font-bold text-black h-16 uppercase text-[10px] tracking-widest text-center">Protocol Status</TableHead>
                <TableHead className="font-bold text-black h-16 uppercase text-[10px] tracking-widest text-right px-8">System Impact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {riskMetrics.map((row) => (
                <TableRow key={row.id} className="hover:bg-neutral-50 border-neutral-100 transition-colors">
                  <TableCell className="py-6 px-8">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-neutral-100 text-black rounded-xl">
                        <BarChart3 className="h-4 w-4" />
                      </div>
                      <span className="font-black text-black text-sm uppercase tracking-tight">{row.metric}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-black text-black text-lg tracking-tighter">{row.current}</TableCell>
                  <TableCell className="text-center font-bold text-neutral-400 text-sm">{row.target}</TableCell>
                  <TableCell className="text-center">
                    <Badge className={cn(
                      "px-3 py-1 rounded-lg font-black uppercase text-[9px] border-none shadow-sm",
                      row.status === "Optimal" || row.status === "Safe" ? "bg-black text-white" : "bg-neutral-100 text-neutral-500"
                    )}>
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right px-8">
                    <span className={cn(
                      "text-xs font-black uppercase tracking-widest",
                      row.impact === "Low" ? "text-neutral-300" : "text-black"
                    )}>{row.impact}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </section>

      {/* Trade Frequency Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pb-20">
        <Card className="border-neutral-100 shadow-sm rounded-[32px] overflow-hidden bg-white">
          <CardHeader className="p-8 border-b border-neutral-50">
            <CardTitle className="text-xl font-black text-black tracking-tight">Market Liquid Flow</CardTitle>
            <CardDescription className="text-neutral-500 font-medium pt-1">Institutional buy vs sell transmission frequency.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-10">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tradeVolumeData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#a3a3a3', fontSize: 12, fontWeight: 700}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#a3a3a3', fontSize: 12, fontWeight: 700}} />
                  <Tooltip cursor={{fill: '#f5f5f5'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="buys" name="Buy Transmissions" fill="#000000" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="sells" name="Sell Transmissions" fill="#a3a3a3" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-100 shadow-sm rounded-[32px] overflow-hidden bg-white">
          <CardHeader className="p-8 border-b border-neutral-50">
            <CardTitle className="text-xl font-black text-black tracking-tight">Recent Analytics Audit</CardTitle>
            <CardDescription className="text-neutral-500 font-medium pt-1">Live tracking of system-wide yield adjustments.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {[
                { title: "FXD1/2024/05 Yield Adjust", time: "2 mins ago", delta: "+12bps", trend: "up" },
                { title: "Portfolio Duration Rebalance", time: "15 mins ago", delta: "-0.05", trend: "down" },
                { title: "Market Index Synchronization", time: "1 hour ago", delta: "Live", trend: "safe" },
                { title: "Institutional Exposure Pulse", time: "3 hours ago", delta: "Verified", trend: "safe" },
              ].map((audit, i) => (
                <div key={i} className="flex items-center justify-between p-6 border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-neutral-100 text-black rounded-xl group-hover:bg-black group-hover:text-white transition-all">
                      <Terminal className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-black text-black text-sm uppercase tracking-tight">{audit.title}</p>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase">{audit.time}</p>
                    </div>
                  </div>
                  <div className={cn(
                    "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                    audit.trend === "up" ? "bg-red-50 text-red-600" : audit.trend === "down" ? "bg-green-50 text-green-600" : "bg-neutral-100 text-neutral-500"
                  )}>
                    {audit.delta}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 bg-neutral-50/50 flex justify-center">
              <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-black">
                View Analytical Log <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MetricCard({ label, value, icon: Icon, trend, change, description, status }: any) {
  return (
    <Card className="border-neutral-100 bg-white rounded-[32px] p-8 space-y-4 shadow-sm transition-all hover:border-black hover:shadow-xl group">
      <div className="flex items-center justify-between">
        <div className="p-3 bg-neutral-100 text-black rounded-2xl group-hover:bg-black group-hover:text-white transition-all duration-500">
          <Icon className="h-6 w-6" />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
            trend === 'up' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
          )}>
            {trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {change}
          </div>
        )}
        {status === 'success' && (
          <Badge className="bg-black text-white border-none px-3 py-1 rounded-lg font-black uppercase text-[9px] tracking-widest shadow-sm">Verified</Badge>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{label}</p>
        <p className="text-3xl font-black text-black tracking-tighter leading-none">{value}</p>
      </div>
      <p className="text-[10px] text-neutral-400 font-bold italic pt-1">{description}</p>
    </Card>
  )
}

function LegendItem({ label, color, dashed }: any) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("h-3 w-8 rounded-full", color, dashed && "opacity-50 border-2 border-dashed border-neutral-400 bg-transparent")} />
      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">{label}</span>
    </div>
  )
}
