"use client";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Code, Copy, RefreshCw, ExternalLink, Activity, History, Server, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

export function ApiTab() {
  const stats = [
    { label: "Total Requests", value: "1,284", icon: Activity },
    { label: "Success Rate", value: "99.2%", icon: Shield },
    { label: "Avg. Latency", value: "42ms", icon: Server },
  ]

  const recentLogs = [
    { event: "GET /V1/services/stats-table", status: 200, time: "2 mins ago" },
    { event: "POST /V1/services/create-quote", status: 201, time: "15 mins ago" },
    { event: "GET /V1/auth/active-sessions", status: 200, time: "1 hour ago" },
    { event: "POST /V1/payments/mpesa/stk-push", status: 400, time: "2 hours ago" },
  ]

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      {/* Header Section */}
      <section>
        <div className="flex flex-col gap-1 mb-10">
          <h2 className="text-2xl font-bold text-black tracking-tight">Developer Tools</h2>
          <p className="text-neutral-500 font-medium">Programmatic access and infrastructure monitoring.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="p-8 rounded-[28px] border border-neutral-100 bg-white shadow-sm hover:border-neutral-200 transition-all group">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2.5 bg-neutral-100 rounded-xl group-hover:bg-black group-hover:text-white transition-colors">
                  <stat.icon className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{stat.label}</span>
              </div>
              <p className="text-3xl font-black text-black tracking-tighter">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="space-y-8">
          {/* API Key Management */}
          <div className="p-10 border border-neutral-100 bg-white rounded-[32px] shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-black text-white rounded-2xl shadow-lg">
                  <Code className="h-6 w-6" />
                </div>
                <h3 className="font-black text-xs uppercase tracking-widest text-black">API Authentication</h3>
              </div>
              <Badge status="live">Live</Badge>
            </div>
            
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <Label className="text-xs font-black uppercase tracking-widest text-neutral-500 ml-1">Secret API Key</Label>
                  <span className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Production active</span>
                </div>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Input 
                      value="bk_live_28384950skd9384kdkdk8384kkd" 
                      type="password"
                      readOnly 
                      className="h-14 rounded-2xl border-neutral-100 bg-neutral-50 font-mono text-sm px-6 pr-12 focus:ring-0 cursor-text" 
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-5">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                    </div>
                  </div>
                  <Button className="rounded-2xl bg-black text-white hover:bg-neutral-800 transition-all px-6 h-14 shadow-lg active:scale-95">
                    <Copy className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" className="rounded-2xl border-neutral-200 bg-white text-black hover:bg-neutral-50 transition-all px-6 h-14 active:scale-95">
                    <RefreshCw className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-xs font-black uppercase tracking-widest text-neutral-500 ml-1">Webhook Endpoint</Label>
                <div className="flex gap-3">
                  <Input 
                    placeholder="https://api.yourdomain.com/webhooks" 
                    className="h-14 rounded-2xl border-neutral-200 focus:border-black focus:ring-1 focus:ring-black px-6 font-medium" 
                  />
                  <Button className="bg-black text-white hover:bg-neutral-800 rounded-2xl text-xs font-black uppercase tracking-widest px-8 h-14 transition-all active:scale-95 shadow-lg">
                    Save URL
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Events Log */}
          <div className="p-10 border border-neutral-100 bg-white rounded-[32px] shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-neutral-100 text-black rounded-2xl">
                <History className="h-6 w-6" />
              </div>
              <h3 className="font-black text-xs uppercase tracking-widest text-black">Recent API Events</h3>
            </div>
            
            <div className="space-y-2">
              {recentLogs.map((log, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-transparent hover:border-neutral-100 hover:bg-neutral-50/50 transition-all group">
                  <div className="flex items-center gap-6">
                    <span className={cn(
                      "text-[10px] font-black px-2.5 py-1 min-w-[40px] text-center rounded-lg uppercase tracking-tighter",
                      log.status < 300 ? "bg-black text-white shadow-md" : "bg-red-600 text-white shadow-md"
                    )}>
                      {log.status}
                    </span>
                    <span className="text-sm font-bold font-mono text-neutral-600 group-hover:text-black transition-colors">{log.event}</span>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-black uppercase tracking-widest">{log.time}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-10 flex justify-center">
              <Button variant="outline" className="border-neutral-200 bg-white text-black hover:bg-neutral-100 rounded-2xl text-[10px] font-black uppercase tracking-widest px-10 h-12 transition-all shadow-sm">
                View Full Logs
              </Button>
            </div>
          </div>

          {/* Documentation Support */}
          <div className="p-10 border-2 border-black bg-white rounded-[36px] flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl shadow-neutral-100">
            <div className="space-y-3 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 rounded-full">
                <ExternalLink className="h-3 w-3 text-black" />
                <span className="text-[9px] font-black uppercase tracking-widest">Resources</span>
              </div>
              <h4 className="font-black text-xl tracking-tight text-black">Developer Documentation</h4>
              <p className="text-sm text-neutral-500 font-medium max-w-lg leading-relaxed">
                Our SDKs and API documentation provide everything you need to build powerful financial applications on top of the BondKonnect infrastructure.
              </p>
            </div>
            <Button className="bg-black text-white hover:bg-neutral-800 rounded-2xl font-black text-xs uppercase tracking-widest px-12 h-16 shadow-xl active:scale-95 transition-all w-full lg:w-auto">
              Launch Explorer
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

function Badge({ children, status }: { children: React.ReactNode, status: 'live' | 'error' }) {
  return (
    <span className={cn(
      "text-[10px] font-black px-3 py-1.5 uppercase tracking-widest rounded-full border shadow-sm",
      status === 'live' ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"
    )}>
      {children}
    </span>
  )
}