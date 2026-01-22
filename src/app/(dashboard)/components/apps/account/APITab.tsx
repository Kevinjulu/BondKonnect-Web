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
        <div className="flex flex-col gap-1 mb-8">
          <h2 className="text-xl font-semibold text-black">Developer Settings</h2>
          <p className="text-sm text-gray-500 font-medium">Configure and monitor your programmatic access to the BondKonnect engine.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="p-6 border border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3 mb-3">
                <stat.icon className="h-4 w-4 text-gray-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-black">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {/* API Key Management */}
          <div className="p-8 border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-black text-white">
                  <Code className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-sm uppercase tracking-widest text-black">API Authentication</h3>
              </div>
              <span className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-1 uppercase border border-green-100">Live</span>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Secret API Key</Label>
                  <span className="text-[10px] text-gray-400 font-medium italic">Production access enabled</span>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input 
                      value="bk_live_28384950skd9384kdkdk8384kkd" 
                      type="password"
                      readOnly 
                      className="rounded-none border-gray-200 bg-gray-50 font-mono text-xs pr-10" 
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    </div>
                  </div>
                  <Button className="rounded-none bg-black text-white hover:bg-gray-800 transition-colors px-3">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button className="rounded-none bg-black text-white hover:bg-gray-800 transition-colors px-3">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Webhook Endpoint</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="https://api.yourdomain.com/webhooks/bondkonnect" 
                    className="rounded-none border-gray-200 focus:border-black focus:ring-0" 
                  />
                  <Button className="bg-black text-white hover:bg-gray-800 rounded-none text-[10px] font-bold uppercase tracking-widest px-8 h-auto transition-all active:scale-95">
                    Save URL
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Events Log */}
          <div className="p-8 border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-100 text-black">
                <History className="h-4 w-4" />
              </div>
              <h3 className="font-bold text-sm uppercase tracking-widest text-black">Recent API Events</h3>
            </div>
            
            <div className="space-y-1">
              {recentLogs.map((log, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 px-2 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 min-w-[32px] text-center",
                      log.status < 300 ? "bg-gray-100 text-black" : "bg-red-50 text-red-600"
                    )}>
                      {log.status}
                    </span>
                    <span className="text-xs font-mono text-gray-600">{log.event}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium uppercase">{log.time}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-center">
              <Button className="bg-black text-white hover:bg-gray-800 rounded-none text-[10px] font-bold uppercase tracking-widest px-6 py-2 h-auto transition-all">
                View Full Logs
              </Button>
            </div>
          </div>

          {/* Documentation Support */}
          <div className="p-8 border-2 border-black bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h4 className="font-bold text-sm uppercase tracking-widest text-black flex items-center gap-2">
                <ExternalLink className="h-4 w-4" /> Technical Documentation
              </h4>
              <p className="text-xs text-gray-500 font-medium max-w-lg leading-relaxed">
                Our SDKs and API documentation provide everything you need to build powerful financial applications on top of the BondKonnect infrastructure.
              </p>
            </div>
            <Button className="bg-black text-white hover:bg-gray-800 rounded-none font-bold text-[10px] uppercase tracking-widest px-10 py-6 h-auto transition-all">
              Launch API Explorer
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
