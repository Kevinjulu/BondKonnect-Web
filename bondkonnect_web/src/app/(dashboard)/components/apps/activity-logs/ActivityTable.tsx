"use client"

import { useEffect, useState } from "react"
import { Eye, AlertTriangle, AlertCircle, Info, Check } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/app/components/ui/dialog"
import { Input } from "@/app/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"
import { Checkbox } from "@/app/components/ui/checkbox"
import { getActivityLogs } from "@/app/lib/actions/api.actions"
import { format, parse, getMonth } from "date-fns"
import { Loader2 } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/app/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"

// Activity log type based on the API response
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

// Chart data type
interface MonthlyStats {
  month: string
  info: number
  warning: number
  error: number
  critical: number
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
  
  // Create a paginated version of filteredLogs
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredLogs.length / pageSize)
  
  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])
  
  // Handle page size change
  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value))
    setCurrentPage(1) // Reset to first page when changing page size
  }
  
  // Navigate to specific page
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }
  
  // Create pagination UI elements
  const renderPaginationItems = () => {
    const items = []
    
    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink 
          onClick={() => goToPage(1)} 
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    )
    
    // Show ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis1">
          <span className="px-4">...</span>
        </PaginationItem>
      )
    }
    
    // Show current page and surrounding pages
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i <= 1 || i >= totalPages) continue // Skip first and last pages as they're always shown
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => goToPage(i)} 
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }
    
    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis2">
          <span className="px-4">...</span>
        </PaginationItem>
      )
    }
    
    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink 
            onClick={() => goToPage(totalPages)} 
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      )
    }
    
    return items
  }
  
  // Fetch activity logs when component mounts
  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true)
      try {
        const response = await getActivityLogs()
        if (response?.success && response.data) {
          // Format dates and sort by most recent first
          const formattedLogs = response.data.map((log: ActivityLog) => ({
            ...log,
            // Format created_on for display if needed
            created_on: log.created_on
          })).sort((a: ActivityLog, b: ActivityLog) => {
            return new Date(b.created_on).getTime() - new Date(a.created_on).getTime()
          })
          
          setLogs(formattedLogs)
          setFilteredLogs(formattedLogs)
          
          // Generate chart data
          generateChartData(formattedLogs)
        } else {
          console.error("Failed to fetch activity logs:", response?.message || "Unknown error")
          setLogs([])
          setFilteredLogs([])
        }
      } catch (error) {
        console.error("Error fetching activity logs:", error)
        setLogs([])
        setFilteredLogs([])
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchLogs()
  }, [])
  
  // Filter logs when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredLogs(logs)
      return
    }
    
    const query = searchQuery.toLowerCase()
    const filtered = logs.filter(log => 
      (log.FirstName && log.FirstName.toLowerCase().includes(query)) ||
      (log.OtherNames && log.OtherNames.toLowerCase().includes(query)) ||
      log.Action.toLowerCase().includes(query) ||
      log.ActivityType.toLowerCase().includes(query) ||
      log.UserAgent.toLowerCase().includes(query) ||
      log.IpAddress.toLowerCase().includes(query) ||
      (log.Description && log.Description.toLowerCase().includes(query))
    )
    
    setFilteredLogs(filtered)
  }, [searchQuery, logs])
  
  // Generate chart data from logs
  const generateChartData = (logs: ActivityLog[]) => {
    // Initialize monthly data
    const monthlyData: Record<string, { info: number, warning: number, error: number, critical: number }> = {}
    
    // Initialize for all months to ensure we have data points even for months with no logs
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    months.forEach(month => {
      monthlyData[month] = { info: 0, warning: 0, error: 0, critical: 0 }
    })
    
    // Count logs by month and severity
    logs.forEach(log => {
      try {
        const date = new Date(log.created_on)
        const month = months[date.getMonth()]
        
        // Map API's SeverityLevel to our chart categories
        if (log.SeverityLevel === 'info') {
          monthlyData[month].info++
        } else if (log.SeverityLevel === 'warning') {
          monthlyData[month].warning++
        } else if (log.SeverityLevel === 'error') {
          monthlyData[month].error++
        } else if (log.SeverityLevel === 'critical') {
          monthlyData[month].critical++
        }
      } catch (e) {
        console.error("Error parsing date:", log.created_on, e)
      }
    })
    
    // Convert to array format for chart
    const chartData = months.map(month => ({
      month,
      info: monthlyData[month].info,
      warning: monthlyData[month].warning,
      error: monthlyData[month].error,
      critical: monthlyData[month].critical
    }))
    
    setChartData(chartData)
  }
  
  // Handle viewing details of a log
  const handleViewDetails = (log: ActivityLog) => {
    setSelectedLog(log)
    setDetailsOpen(true)
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return format(date, "dd MMM yyyy, h:mm a")
    } catch (e) {
      return dateString
    }
  }
  
  // Get user name for display
  const getUserName = (log: ActivityLog) => {
    if (log.FirstName || log.OtherNames) {
      return `${log.FirstName || ''} ${log.OtherNames || ''}`.trim()
    }
    return log.UserName || 'Unknown User'
  }
  
  // Get severity icon based on severity level
  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }
  
  // Get action icon based on action type
  const getActionIcon = (action: string, severity: string) => {
    // First priority: use severity level
    const severityIcon = getSeverityIcon(severity)
    
    // Second priority: check action text for specific keywords
    if (action.toLowerCase().includes('fail') || action.toLowerCase().includes('error')) {
      return <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
    } else if (action.toLowerCase().includes('success') || action.toLowerCase().includes('enable')) {
      return <Check className="h-4 w-4 text-green-500 mr-2" />
    } else if (action.toLowerCase().includes('warn') || action.toLowerCase().includes('caution')) {
      return <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
    }
    
    // Default: return severity icon
    return <span className="mr-2">{severityIcon}</span>
  }
  
  // Parse JSON string safely
  const parseJson = (jsonString: string) => {
    try {
      return JSON.parse(jsonString)
    } catch (e) {
      return jsonString
    }
  }

  return (
    <div className="container mx-auto py-5">
      <Card>
        <CardHeader>
          {/* <CardTitle className="text-2xl font-bold">Activity Log</CardTitle> */}
          <CardDescription>Overview of security events and user activities</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Activity Severity Chart */}
          <div className="mb-8 bg-muted p-4 rounded-md">
            <h3 className="text-lg font-medium mb-4">Monthly Activity Severity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="info" name="Info" fill="#3b82f6" />
                <Bar dataKey="warning" name="Warning" fill="#f59e0b" />
                <Bar dataKey="error" name="Error" fill="#ef4444" />
                <Bar dataKey="critical" name="Critical" fill="#b91c1c" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input 
                type="search" 
                placeholder="Search logs..." 
                className="w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="outline">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 mr-2"
                >
                  <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
                </svg>
                Filter
              </Button>
            </div>
            <Button variant="default" className="bg-black text-white hover:bg-gray-800">
              Export
            </Button>
          </div>

          {/* Activity Logs Table */}
          <div className="rounded-md border">
            {isLoading ? (
              <div className="flex justify-center items-center p-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading activity logs...</span>
              </div>
            ) : (
              <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30px]">
                    <Checkbox />
                  </TableHead>
                  <TableHead className="w-[180px]">Date & Time</TableHead>
                  <TableHead className="w-[150px]">User</TableHead>
                  <TableHead className="w-[250px]">Event</TableHead>
                  <TableHead className="w-[150px]">Source</TableHead>
                  <TableHead className="w-[150px]">IP Address</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                    {filteredLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          {searchQuery ? "No logs matching search criteria" : "No activity logs found"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedLogs.map((log) => (
                        <TableRow key={log.Id}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                          <TableCell className="font-medium">{formatDate(log.created_on)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="inline-block w-6 h-6 rounded-full bg-gray-200 text-center text-xs leading-6 mr-2">
                                {getUserName(log)
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                              {getUserName(log)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                              {getActionIcon(log.Action, log.SeverityLevel)}
                              {log.Action.replace(/_/g, ' ')}
                      </div>
                    </TableCell>
                          <TableCell>{log.UserAgent}</TableCell>
                          <TableCell>{log.IpAddress}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleViewDetails(log)} title="View Details">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                      ))
                    )}
              </TableBody>
            </Table>
                
                {/* Add pagination UI after the table */}
                {filteredLogs.length > 0 && (
                  <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{Math.min(filteredLogs.length, (currentPage - 1) * pageSize + 1)}</span> to{" "}
                        <span className="font-medium">{Math.min(filteredLogs.length, currentPage * pageSize)}</span> of{" "}
                        <span className="font-medium">{filteredLogs.length}</span> results
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-700">Rows per page:</span>
                        <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                          <SelectTrigger className="h-8 w-16">
                            <SelectValue placeholder={pageSize} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => goToPage(currentPage - 1)} 
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        
                        {renderPaginationItems()}
                        
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => goToPage(currentPage + 1)}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Details Dialog */}
          <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
            <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Activity Log Details</DialogTitle>
              </DialogHeader>
              {selectedLog && (
                <div className="grid gap-4 py-4">
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 font-medium">Field</td>
                        <td className="py-2 font-medium">Value</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Date & Time</td>
                        <td className="py-2">{formatDate(selectedLog.created_on)}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">User</td>
                        <td className="py-2">{getUserName(selectedLog)}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Role</td>
                        <td className="py-2">{selectedLog.RoleName || 'Unknown'}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Activity Type</td>
                        <td className="py-2">{selectedLog.ActivityType}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Action</td>
                        <td className="py-2">{selectedLog.Action.replace(/_/g, ' ')}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Severity Level</td>
                        <td className="py-2 flex items-center">
                          {getSeverityIcon(selectedLog.SeverityLevel)}
                          <span className="ml-2">{selectedLog.SeverityLevel}</span>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Description</td>
                        <td className="py-2 whitespace-pre-wrap break-words max-w-[250px]">
                          <div className="max-h-[150px] overflow-y-auto border rounded p-2 bg-gray-50">
                            <pre className="text-xs whitespace-pre-wrap break-words">
                            {typeof selectedLog.Description === 'string' && selectedLog.Description.startsWith('{') 
                                ? JSON.stringify(parseJson(selectedLog.Description), null, 2)
                                : selectedLog.Description}
                            </pre>    
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">User Agent</td>
                        <td className="py-2">{selectedLog.UserAgent}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">IP Address</td>
                        <td className="py-2">{selectedLog.IpAddress}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Request Method</td>
                        <td className="py-2">{selectedLog.RequestMethod}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Request URL</td>
                        <td className="py-2 break-words max-w-[250px]">
                            <div className="max-h-[150px] overflow-y-auto border rounded p-2 bg-gray-50">
                                <pre className="text-xs whitespace-pre-wrap break-words">
                                
                                {selectedLog.RequestUrl}
                                </pre>    
                            </div>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Status Code</td>
                        <td className="py-2">{selectedLog.StatusCode}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Headers</td>
                        <td className="py-2">
                          <div className="max-h-[150px] overflow-y-auto border rounded p-2 bg-gray-50">
                            <pre className="text-xs whitespace-pre-wrap break-words">
                              {typeof selectedLog.RequestHeaders === 'string' && selectedLog.RequestHeaders.startsWith('{') 
                                ? JSON.stringify(parseJson(selectedLog.RequestHeaders), null, 2)
                                : selectedLog.RequestHeaders}
                            </pre>
                          </div>
                        </td>
                      </tr>
                      {selectedLog.Location && (
                        <tr className="border-b">
                          <td className="py-2">Location</td>
                          <td className="py-2">{selectedLog.Location}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="flex justify-end">
                <DialogClose asChild>
                  <Button type="button" className="mt-2">
                    Close
                  </Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}

