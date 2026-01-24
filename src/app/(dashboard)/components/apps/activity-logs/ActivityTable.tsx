"use client"

import { useEffect, useState, useMemo } from "react"
import { 
  Eye, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  Check, 
  Search, 
  Filter, 
  Download, 
  ChevronRight, 
  MoreVertical, 
  Shield, 
  Activity,
  User,
  Globe,
  Zap,
  History,
  Terminal,
  ArrowUpRight,
  Fingerprint,
  Clock,
  Radio
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { getActivityLogs } from "@/lib/actions/api.actions"
import { format, subMonths, isAfter } from "date-fns"
import { Loader2 } from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface ActivityLog {
  Id: number
  created_on: string
  User: number
  Role: number
  ActivityType: string
  Action: string
  SeverityLevel: string
  Description: string
  UserAgent: string
  IpAddress: string
  RequestMethod: string
  RequestUrl: string
  RequestHeaders: string
  Location: string | null
  Compression: string | null
  StatusCode: string
  UserName: string | null
  FirstName: string | null
  OtherNames: string | null
  RoleName: string | null
}

interface MonthlyStats {
  month: string
  total: number
  alerts: number
  safe: number
}

export function ActivityLogsTable() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [chartData, setChartData] = useState<MonthlyStats[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [timeRange, setTimeRange] = useState("YTD")
  
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )
  
  const totalPages = Math.ceil(filteredLogs.length / pageSize)
  
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])
  
  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value))
    setCurrentPage(1)
  }
  
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }
  
  const metrics = useMemo(() => {
    const total = logs.length
    const criticalCount = logs.filter(l => l.SeverityLevel.toLowerCase() === 'critical' || l.SeverityLevel.toLowerCase() === 'error').length
    const uniqueIps = new Set(logs.map(l => l.IpAddress)).size
    const uniqueUsers = new Set(logs.map(l => l.User)).size
    return { total, criticalCount, uniqueIps, uniqueUsers }
  }, [logs])

  const renderPaginationItems = () => {
    const items = []
    items.push(
      <PaginationItem key="first">
        <PaginationLink onClick={() => goToPage(1)} isActive={currentPage === 1} className={cn("rounded-xl font-bold h-10 w-10", currentPage === 1 ? "bg-black text-white" : "text-black hover:bg-neutral-100")}>
          1
        </PaginationLink>
      </PaginationItem>
    )
    if (currentPage > 3) items.push(<PaginationItem key="ellipsis1"><span className="px-4 text-neutral-400 font-bold">...</span></PaginationItem>)
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i <= 1 || i >= totalPages) continue
      items.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={() => goToPage(i)} isActive={currentPage === i} className={cn("rounded-xl font-bold h-10 w-10", currentPage === i ? "bg-black text-white" : "text-black hover:bg-neutral-100")}>
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }
    if (currentPage < totalPages - 2) items.push(<PaginationItem key="ellipsis2"><span className="px-4 text-neutral-400 font-bold">...</span></PaginationItem>)
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink onClick={() => goToPage(totalPages)} isActive={currentPage === totalPages} className={cn("rounded-xl font-bold h-10 w-10", currentPage === totalPages ? "bg-black text-white" : "text-black hover:bg-neutral-100")}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      )
    }
    return items
  }
  
  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true)
      try {
        const response = await getActivityLogs()
        if (response?.success && response.data) {
          const formattedLogs = response.data.map((log: ActivityLog) => ({
            ...log,
            created_on: log.created_on
          })).sort((a: ActivityLog, b: ActivityLog) => {
            return new Date(b.created_on).getTime() - new Date(a.created_on).getTime()
          })
          
          setLogs(formattedLogs)
          setFilteredLogs(formattedLogs)
          generateChartData(formattedLogs)
        }
      } catch (error) {
        console.error("Error fetching activity logs:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchLogs()
  }, [])
  
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredLogs(logs)
      return
    }
    const query = searchQuery.toLowerCase()
    setFilteredLogs(logs.filter(log => 
      (log.FirstName?.toLowerCase().includes(query)) ||
      (log.OtherNames?.toLowerCase().includes(query)) ||
      log.Action.toLowerCase().includes(query) ||
      log.ActivityType.toLowerCase().includes(query) ||
      log.IpAddress.toLowerCase().includes(query) ||
      (log.Description?.toLowerCase().includes(query))
    ))
  }, [searchQuery, logs])
  
  const generateChartData = (logs: ActivityLog[]) => {
    const monthlyData: Record<string, { total: number, alerts: number, safe: number }> = {}
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    months.forEach(month => { monthlyData[month] = { total: 0, alerts: 0, safe: 0 } })
    
    logs.forEach(log => {
      try {
        const date = new Date(log.created_on)
        const month = months[date.getMonth()]
        monthlyData[month].total++
        
        if (['critical', 'error', 'warning'].includes(log.SeverityLevel.toLowerCase())) {
          monthlyData[month].alerts++
        } else {
          monthlyData[month].safe++
        }
      } catch (e) {}
    })
    
    setChartData(months.map(month => ({ 
      month, 
      total: monthlyData[month].total,
      alerts: monthlyData[month].alerts,
      safe: monthlyData[month].safe
    })))
  }
  
  const handleViewDetails = (log: ActivityLog) => {
    setSelectedLog(log)
    setDetailsOpen(true)
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return format(date, "dd MMM yyyy, h:mm a")
    } catch (e) {
      return dateString
    }
  }
  
  const getUserName = (log: ActivityLog) => {
    if (log.FirstName || log.OtherNames) return `${log.FirstName || ''} ${log.OtherNames || ''}`.trim()
    return log.UserName || 'Unknown User'
  }
  
  const getSeverityStyles = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return "bg-black text-white"
      case 'error': return "bg-neutral-900 text-white"
      case 'warning': return "bg-neutral-100 text-black border-neutral-200"
      default: return "bg-neutral-50 text-neutral-500 border-neutral-100"
    }
  }

  return (
    <div className="space-y-10">
      {/* Metric Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard label="Total Events" value={metrics.total.toLocaleString()} icon={History} description="Historical log volume" />
        <MetricCard label="System Alerts" value={metrics.criticalCount.toLocaleString()} icon={AlertCircle} trend="up" trendValue="Live" description="Critical errors & warnings" />
        <MetricCard label="Network Nodes" value={metrics.uniqueIps.toLocaleString()} icon={Globe} description="Unique IP addresses" />
        <MetricCard label="Active Sessions" value={metrics.uniqueUsers.toLocaleString()} icon={Fingerprint} description="Distinct system initiators" />
      </section>

      {/* Enhanced Operational Pulse Section */}
      <Card className="border-neutral-100 shadow-sm rounded-[40px] overflow-hidden bg-white relative">
        <div className="absolute top-0 right-0 p-8 flex items-center gap-2 z-10">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-50 rounded-full border border-neutral-100 shadow-sm">
            <div className="h-2 w-2 rounded-full bg-black animate-pulse shadow-[0_0_8px_rgba(0,0,0,0.5)]"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-black">Live Protocol</span>
          </div>
        </div>

        <CardHeader className="p-10 border-b border-neutral-50 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-black text-white rounded-2xl shadow-xl">
                <Activity className="h-6 w-6" />
              </div>
              <CardTitle className="text-3xl font-black text-black tracking-tighter">Operational Pulse</CardTitle>
            </div>
            <CardDescription className="text-neutral-500 font-medium text-lg max-w-xl leading-relaxed pt-1">
              Analyzing transmission frequency and security intensity across the workstation network.
            </CardDescription>
          </div>
          
          <div className="flex bg-neutral-100 p-1.5 rounded-2xl h-fit border border-neutral-200/50">
            {["1M", "3M", "6M", "YTD"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  timeRange === range ? "bg-white text-black shadow-lg shadow-neutral-200" : "text-neutral-400 hover:text-black"
                )}
              >
                {range}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-10 pt-12">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
            <div className="xl:col-span-3 h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#000000" stopOpacity={0.08}/>
                      <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#737373" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#737373" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#a3a3a3', fontSize: 12, fontWeight: 800}} 
                    dy={15} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#a3a3a3', fontSize: 12, fontWeight: 800}} 
                  />
                  <Tooltip 
                    cursor={{stroke: '#000', strokeWidth: 1, strokeDasharray: '4 4'}} 
                    contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '20px'}}
                    itemStyle={{fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em'}}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    name="System Traffic"
                    stroke="#000000" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorTraffic)" 
                    activeDot={{ r: 8, strokeWidth: 0, fill: '#000' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="alerts" 
                    name="Security Alerts"
                    stroke="#737373" 
                    strokeWidth={2} 
                    strokeDasharray="5 5"
                    fillOpacity={1} 
                    fill="url(#colorAlerts)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="xl:col-span-1 space-y-8 flex flex-col justify-center">
              <div className="space-y-6 pt-4">
                <PulseMetric 
                  label="Network Intensity" 
                  value="Optimal" 
                  icon={Zap} 
                  sub="Protocol stability: 99.9%"
                />
                <PulseMetric 
                  label="Average Latency" 
                  value="42ms" 
                  icon={Clock} 
                  sub="Transmission speed"
                />
                <PulseMetric 
                  label="Data Integrity" 
                  value="Verified" 
                  icon={Shield} 
                  sub="Encrypted node sync"
                />
              </div>
              <div className="pt-6 border-t border-neutral-100">
                <Button className="w-full h-12 bg-neutral-100 text-black hover:bg-black hover:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all">
                  Analyze Protocol Depth
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Table Area */}
      <div className="space-y-6">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
            <div className="relative w-full sm:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 group-focus-within:text-black transition-colors" />
              <Input 
                placeholder="Search audit trail by node, action, or user..." 
                className="pl-12 h-14 border-neutral-200 focus:border-black rounded-2xl font-bold bg-white text-black placeholder:text-neutral-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="h-14 rounded-2xl border-neutral-200 bg-white font-bold px-8 gap-2 hover:bg-neutral-50 transition-all text-neutral-600">
              <Filter className="h-4 w-4" /> Parameters
            </Button>
          </div>
          <Button className="bg-black text-white hover:bg-neutral-800 font-black uppercase tracking-widest text-[10px] px-10 h-14 rounded-2xl shadow-xl active:scale-95 transition-all">
            <Download className="h-4 w-4 mr-3" /> Export Logs
          </Button>
        </div>

        <Card className="border-neutral-100 shadow-sm rounded-[32px] overflow-hidden bg-white">
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex flex-col justify-center items-center py-32 space-y-4">
                <div className="animate-spin rounded-full h-10 w-10 border-3 border-black border-t-transparent"></div>
                <span className="text-xs font-black uppercase tracking-widest text-neutral-400">Syncing Protocol Logs...</span>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-neutral-50 hover:bg-neutral-50 border-neutral-200">
                      <TableHead className="w-[80px] px-8 text-center"><Checkbox className="border-neutral-300 data-[state=checked]:bg-black data-[state=checked]:border-black" /></TableHead>
                      <TableHead className="font-bold text-black h-16 uppercase text-[10px] tracking-widest">Time Node</TableHead>
                      <TableHead className="font-bold text-black h-16 uppercase text-[10px] tracking-widest">Initiator</TableHead>
                      <TableHead className="font-bold text-black h-16 uppercase text-[10px] tracking-widest">Event Protocol</TableHead>
                      <TableHead className="font-bold text-black h-16 uppercase text-[10px] tracking-widest">Network Node</TableHead>
                      <TableHead className="font-bold text-black h-16 uppercase text-[10px] tracking-widest text-right px-8">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.length === 0 ? (
                      <TableRow><TableCell colSpan={6} className="text-center py-32">
                        <div className="flex flex-col items-center space-y-3">
                          <Shield className="h-12 w-12 text-neutral-100" />
                          <p className="text-sm font-black uppercase tracking-widest text-neutral-300 italic">No historical records matching criteria.</p>
                        </div>
                      </TableCell></TableRow>
                    ) : (
                      paginatedLogs.map((log) => (
                        <TableRow key={log.Id} className="hover:bg-neutral-50 border-neutral-100 transition-colors group">
                          <TableCell className="px-8 py-6 text-center"><Checkbox className="border-neutral-300 data-[state=checked]:bg-black" /></TableCell>
                          <TableCell className="py-6">
                            <p className="text-sm font-bold text-black">{formatDate(log.created_on).split(',')[0]}</p>
                            <p className="text-[10px] font-medium text-neutral-400 uppercase">{formatDate(log.created_on).split(',')[1]}</p>
                          </TableCell>
                          <TableCell className="py-6">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 border-2 border-white shadow-md">
                                <AvatarFallback className="bg-black text-white font-black text-xs uppercase">
                                  {getUserName(log).split(" ").map((n) => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-black text-black">{getUserName(log)}</p>
                                <p className="text-[10px] text-neutral-400 font-bold uppercase">{log.RoleName || 'Guest'}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-6">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2">
                                <Badge className={cn("rounded-lg px-2 py-0.5 font-bold uppercase text-[9px] border-none shadow-sm", getSeverityStyles(log.SeverityLevel))}>
                                  {log.SeverityLevel}
                                </Badge>
                                <span className="font-black text-black text-xs uppercase tracking-tight">{log.RequestMethod}</span>
                              </div>
                              <p className="font-bold text-neutral-500 text-xs truncate max-w-[200px]">{log.Action.replace(/_/g, ' ')}</p>
                            </div>
                          </TableCell>
                          <TableCell className="py-6 font-mono text-neutral-400 text-[11px] font-bold tracking-tighter italic">{log.IpAddress}</TableCell>
                          <TableCell className="px-8 text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleViewDetails(log)} className="h-10 w-10 p-0 rounded-xl hover:bg-black hover:text-white transition-all">
                              <ChevronRight className="h-5 w-5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                
                {filteredLogs.length > 0 && (
                  <div className="px-10 py-8 flex flex-col sm:flex-row items-center justify-between border-t border-neutral-50 gap-6">
                    <div className="flex items-center gap-6">
                      <p className="text-xs font-black uppercase tracking-widest text-neutral-400">
                        Logs <span className="text-black">{Math.min(filteredLogs.length, (currentPage - 1) * pageSize + 1)} - {Math.min(filteredLogs.length, currentPage * pageSize)}</span> of {filteredLogs.length}
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">View:</span>
                        <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                          <SelectTrigger className="h-10 w-20 rounded-xl border-neutral-200 font-bold bg-white text-black">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-neutral-200 bg-white">
                            {[10, 20, 50].map(size => <SelectItem key={size} value={size.toString()} className="font-bold text-black">{size}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Pagination className="w-auto mx-0">
                      <PaginationContent className="gap-2">
                        <PaginationItem><Button variant="ghost" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="rounded-xl font-bold h-10 px-4">Prev</Button></PaginationItem>
                        {renderPaginationItems()}
                        <PaginationItem><Button variant="ghost" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="rounded-xl font-bold h-10 px-4">Next</Button></PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>
      </div>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-3xl border-none shadow-2xl p-0 overflow-hidden rounded-[40px] bg-white text-black">
          <DialogHeader className="p-10 pb-8 bg-black text-white">
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="h-6 w-6" />
              <Badge className="bg-white/10 text-white border-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Audit Protocol</Badge>
            </div>
            <DialogTitle className="text-4xl font-black tracking-tighter">Event Reference {selectedLog?.Id}</DialogTitle>
            <DialogDescription className="text-neutral-400 font-medium text-lg pt-2 italic">Comprehensive system-state capture for audit-node reference.</DialogDescription>
          </DialogHeader>
          
          {selectedLog && (
            <div className="p-10 space-y-10 bg-white max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <DetailNode label="Time Node" value={formatDate(selectedLog.created_on)} />
                <DetailNode label="Network IP" value={selectedLog.IpAddress} />
                <DetailNode label="Response" value={selectedLog.StatusCode} isBadge />
                <DetailNode label="Initiator" value={getUserName(selectedLog)} />
                <DetailNode label="System Role" value={selectedLog.RoleName || 'Authorized Node'} />
                <DetailNode label="Action Node" value={selectedLog.RequestMethod} />
              </div>

              <div className="space-y-4 pt-8 border-t border-neutral-100">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Request Path (Protocol)</label>
                <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100 font-mono text-xs text-black break-all leading-relaxed shadow-inner">
                  {selectedLog.RequestUrl}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Transmission Payload (JSON)</label>
                <div className="p-6 bg-neutral-900 rounded-3xl border-none shadow-2xl overflow-hidden">
                  <pre className="text-[11px] font-mono text-neutral-300 whitespace-pre-wrap break-words leading-relaxed">
                    {typeof selectedLog.Description === 'string' && selectedLog.Description.startsWith('{') 
                      ? JSON.stringify(JSON.parse(selectedLog.Description), null, 2)
                      : selectedLog.Description}
                  </pre>    
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="p-8 pt-0 bg-neutral-50 border-t border-neutral-100">
            <Button onClick={() => setDetailsOpen(false)} className="w-full h-16 bg-black text-white hover:bg-neutral-800 font-black uppercase tracking-widest text-xs rounded-3xl shadow-xl active:scale-95 transition-all">
              Acknowledge Audit Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function MetricCard({ label, value, icon: Icon, trend, trendValue, description }: any) {
  return (
    <Card className="border-neutral-100 bg-white rounded-[32px] p-8 space-y-4 shadow-sm transition-all hover:border-black hover:shadow-xl group">
      <div className="flex items-center justify-between">
        <div className="p-3 bg-neutral-100 text-black rounded-2xl group-hover:bg-black group-hover:text-white transition-all duration-500">
          <Icon className="h-6 w-6" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-50 text-green-600">
            <Zap className="h-3 w-3" /> {trendValue}
          </div>
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

function PulseMetric({ label, value, icon: Icon, sub }: any) {
  return (
    <div className="flex items-center gap-4 group">
      <div className="p-3 bg-neutral-50 text-neutral-400 rounded-xl group-hover:bg-black group-hover:text-white transition-all duration-300">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{label}</p>
        <p className="text-lg font-black text-black tracking-tight leading-none">{value}</p>
        <p className="text-[10px] font-bold text-neutral-300 uppercase pt-1">{sub}</p>
      </div>
    </div>
  )
}

function DetailNode({ label, value, isBadge }: any) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{label}</p>
      {isBadge ? (
        <Badge className="bg-black text-white font-black px-3 py-1 rounded-lg text-xs">{value}</Badge>
      ) : (
        <p className="text-lg font-black text-black tracking-tight leading-tight">{value}</p>
      )}
    </div>
  )
}