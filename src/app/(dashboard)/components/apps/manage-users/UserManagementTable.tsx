'use client'

import { useEffect, useState, useMemo } from "react"
import {
  Search,
  Eye,
  Check,
  Loader2,
  RefreshCw,
  Ban,
  ChevronDown,
  Plus,
  LayoutGrid,
  LayoutList,
  SlidersHorizontal,
  ChevronsUpDown,
  UserPlus,
  Users,
  UserCheck,
  UserMinus,
  Mail,
  Phone,
  Building2,
  Calendar,
  MoreVertical,
  Filter,
  Download,
  X,
  ArrowUpDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  getAllUsers,
  getRoles,
  suspendUser,
  reactivateUser,
  register,
} from "@/lib/actions/api.actions"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

// Role type
interface Role {
  Id: number
  RoleName: string
  RoleDescription: string
}

// User type based on API response
interface ApiUser {
  Id: number
  AccountId: string
  UserName: string | null
  CompanyName: string | null
  FirstName: string
  OtherNames: string
  Email: string
  PhoneNumber: string
  PostalAddress: string | null
  IsActive: number
  CdsNo: string
  IsLocal: number
  IsForeign: number
  Roles: Role[]
  created_on: string
}

import { useUsers, useRoles, useUserMutations } from "@/hooks/use-user-data"

export default function UserManagementPage() {
  const { toast } = useToast()
  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [displayMode, setDisplayMode] = useState<"table" | "board" | "list">("table")
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortConfig, setSortConfig] = useState<{ key: keyof ApiUser | 'fullName', direction: 'asc' | 'desc' } | null>(null)
  
  // Use the new hooks
  const { data: users = [], isLoading: isLoadingUsers } = useUsers();
  const { data: availableRoles = [] } = useRoles();
  const { suspendUser, reactivateUser, createUser, isSuspending, isReactivating, isCreating } = useUserMutations();

  const isLoading = isLoadingUsers || isSuspending || isReactivating || isCreating;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(15)

  // Stats calculation
  const stats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter(u => u.IsActive === 1).length,
      inactive: users.filter(u => u.IsActive === 0).length,
      newThisMonth: users.filter(u => {
        const joinedDate = new Date(u.created_on)
        const now = new Date()
        return joinedDate.getMonth() === now.getMonth() && joinedDate.getFullYear() === now.getFullYear()
      }).length
    }
  }, [users])
  
  // Sorting handler
  const handleSort = (key: keyof ApiUser | 'fullName') => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  // Memoized filtered and sorted users
  const processedUsers = useMemo(() => {
    let result = [...users]
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(user => 
        (user.FirstName + ' ' + user.OtherNames).toLowerCase().includes(query) ||
        user.Email.toLowerCase().includes(query) ||
        (user.CompanyName && user.CompanyName.toLowerCase().includes(query))
      )
    }
    
    // Apply role filter
    if (selectedRoleFilter !== "all") {
      result = result.filter(user => 
        user.Roles.some(role => role.RoleName === selectedRoleFilter)
      )
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active" ? 1 : 0
      result = result.filter(user => user.IsActive === isActive)
    }

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        let aVal: any = a[sortConfig.key as keyof ApiUser]
        let bVal: any = b[sortConfig.key as keyof ApiUser]

        if (sortConfig.key === 'fullName') {
          aVal = `${a.FirstName} ${a.OtherNames}`.toLowerCase()
          bVal = `${b.FirstName} ${b.OtherNames}`.toLowerCase()
        } else if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase()
          bVal = (bVal as string).toLowerCase()
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }
    
    return result
  }, [users, searchQuery, selectedRoleFilter, statusFilter, sortConfig])

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }
  
  const handlePageSizeChange = (size: string) => {
    setPageSize(parseInt(size))
    setCurrentPage(1)
  }

  // User activation/deactivation confirmation
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [userToToggle, setUserToToggle] = useState<ApiUser | null>(null)
  const [confirmationAction, setConfirmationAction] = useState<'activate' | 'deactivate'>('deactivate')

  const initiateToggleUserStatus = (user: ApiUser) => {
    setUserToToggle(user)
    setConfirmationAction(user.IsActive === 1 ? 'deactivate' : 'activate')
    setConfirmationOpen(true)
  }

  const handleToggleUserStatus = async (user: ApiUser) => {
    if (user.IsActive === 1) {
      await suspendUser(user.Id)
    } else {
      await reactivateUser(user.Id)
    }
    setConfirmationOpen(false)
  }

  const handleViewDetails = (user: ApiUser) => {
    setSelectedUser(user)
    setDetailsOpen(true)
  }

  const [addUserOpen, setAddUserOpen] = useState(false)
  const [addUserStep, setAddUserStep] = useState(1)

  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      role: "",
      firstName: "",
      otherNames: "",
      email: "",
      userName: "",
      companyName: "",
      phoneNumber: "",
      postalAddress: "",
      isActive: true,
      cdsNo: "",
      isLocal: true,
      isForeign: false,
      locality: "",
      categoryType: "",
    },
  })

  const handleAddUserClose = () => {
    setAddUserOpen(false)
    setAddUserStep(1)
    form.reset()
  }

  async function onSubmit(values: z.infer<typeof userFormSchema>) {
    const roleType = values.role
    
    const registrationData = {
      is_individual: roleType === "individual",
      is_agent: roleType === "agent",
      is_corporate: roleType === "corporate",
      is_admin: roleType === "admin",
      is_broker: values.categoryType === "broker",
      is_dealer: values.categoryType === "dealer",
      email: values.email,
      phone: values.phoneNumber,
      company_name: values.companyName || "",
      first_name: values.firstName || "",
      other_names: values.otherNames || "",
      cds_number: values.cdsNo || "",
      broker_dealer: [],
      locality: values.locality || "",
      category_type: values.categoryType || "",
      alternate_dealer: [],
      new_dealer_emails: [],
    }
    
    const result = await createUser(registrationData)
    if (result?.success) {
      handleAddUserClose()
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric'
      })
    } catch {
      return dateString
    }
  }
  
  const getInitials = (firstName: string, otherNames: string) => {
    return `${firstName?.[0] || ''}${otherNames?.[0] || ''}`.toUpperCase()
  }
  
  // Monochrome Avatar Colors
  const getAvatarColor = (id: number) => {
    return "bg-black text-white"
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">User Management</h1>
          <p className="text-muted-foreground mt-1">
            Overview of all users, their roles, and system access status.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden sm:flex bg-black text-white border-black hover:bg-neutral-800">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setAddUserOpen(true)} className="bg-black text-white hover:bg-neutral-800 shadow-sm border border-neutral-800">
            <UserPlus className="mr-2 h-4 w-4" />
            Add New User
          </Button>
        </div>
      </div>

      {/* Stats Cards - Monochrome (Light Mode) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm bg-white border border-neutral-200 text-black">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500">Total Users</p>
              <h3 className="text-2xl font-bold text-black">{stats.total}</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-black" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm bg-white border border-neutral-200 text-black">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500">Active Users</p>
              <h3 className="text-2xl font-bold text-black">{stats.active}</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center">
              <UserCheck className="h-6 w-6 text-black" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm bg-white border border-neutral-200 text-black">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500">Inactive Users</p>
              <h3 className="text-2xl font-bold text-black">{stats.inactive}</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center">
              <UserMinus className="h-6 w-6 text-black" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm bg-white border border-neutral-200 text-black">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500">New This Month</p>
              <h3 className="text-2xl font-bold text-black">{stats.newThisMonth}</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-black" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar - Monochrome (Light Mode) */}
      <Card className="shadow-sm bg-white border border-neutral-200 text-black">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <div className="relative w-full sm:w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input 
                  placeholder="Search by name, email or company..." 
                  className="pl-9 bg-neutral-50 border-neutral-200 text-black focus-visible:ring-1 focus-visible:ring-black"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="border-dashed bg-black text-white border-black hover:bg-neutral-800">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                    {(selectedRoleFilter !== "all" || statusFilter !== "all") && (
                      <>
                        <Separator orientation="vertical" className="mx-2 h-4 bg-neutral-600" />
                        <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden bg-neutral-100 text-black">
                          { (selectedRoleFilter !== "all" ? 1 : 0) + (statusFilter !== "all" ? 1 : 0) }
                        </Badge>
                        <div className="hidden space-x-1 lg:flex">
                          {selectedRoleFilter !== "all" && (
                            <Badge variant="secondary" className="rounded-sm px-1 font-normal bg-neutral-100 text-black">
                              Role: {selectedRoleFilter}
                            </Badge>
                          )}
                          {statusFilter !== "all" && (
                            <Badge variant="secondary" className="rounded-sm px-1 font-normal bg-neutral-100 text-black">
                              Status: {statusFilter}
                            </Badge>
                          )}
                        </div>
                      </>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0 bg-white border border-neutral-200 text-black" align="start">
                  <div className="p-3 space-y-4">
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Role</p>
                      <Select value={selectedRoleFilter} onValueChange={setSelectedRoleFilter}>
                        <SelectTrigger className="h-8 bg-neutral-50 border-neutral-200 text-black">
                          <SelectValue placeholder="All Roles" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-neutral-200 text-black">
                          <SelectItem value="all">All Roles</SelectItem>
                          {availableRoles.map(role => (
                            <SelectItem key={role.Id} value={role.RoleName}>{role.RoleName}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</p>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="h-8 bg-neutral-50 border-neutral-200 text-black">
                          <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-neutral-200 text-black">
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active Only</SelectItem>
                          <SelectItem value="inactive">Inactive Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-center h-8 text-xs bg-black text-white hover:bg-neutral-800"
                      onClick={() => {
                        setSelectedRoleFilter("all")
                        setStatusFilter("all")
                        setSearchQuery("")
                      }}
                    >
                      Clear All
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-lg">
              <Button 
                variant={displayMode === "table" ? "secondary" : "ghost"} 
                size="sm" 
                className={cn("h-8 px-3 rounded-md", displayMode === "table" ? "bg-black text-white shadow-sm hover:bg-neutral-800" : "text-black hover:bg-neutral-200")}
                onClick={() => setDisplayMode("table")}
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Table
              </Button>
              <Button 
                variant={displayMode === "board" ? "secondary" : "ghost"} 
                size="sm" 
                className={cn("h-8 px-3 rounded-md", displayMode === "board" ? "bg-black text-white shadow-sm hover:bg-neutral-800" : "text-black hover:bg-neutral-200")}
                onClick={() => setDisplayMode("board")}
              >
                <LayoutList className="h-4 w-4 mr-2" />
                Cards
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Area */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-[400px] gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-black opacity-20" />
            <p className="text-neutral-500 animate-pulse">Synchronizing user data...</p>
          </div>
        ) : (
          <>
            {displayMode === "table" ? (
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                <Table>
                  <TableHeader className="bg-neutral-50">
                    <TableRow className="hover:bg-transparent border-neutral-200">
                      <TableHead className="w-[50px] text-neutral-500"><Checkbox className="border-neutral-400" /></TableHead>
                      <TableHead className="cursor-pointer text-neutral-600 hover:text-black" onClick={() => handleSort('fullName')}>
                        <div className="flex items-center">
                          User
                          <ArrowUpDown className="ml-2 h-3 w-3 opacity-50" />
                        </div>
                      </TableHead>
                      <TableHead className="text-neutral-600">Account Details</TableHead>
                      <TableHead className="text-neutral-600">Roles</TableHead>
                      <TableHead className="cursor-pointer text-neutral-600 hover:text-black" onClick={() => handleSort('IsActive')}>
                         <div className="flex items-center">
                          Status
                          <ArrowUpDown className="ml-2 h-3 w-3 opacity-50" />
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer text-neutral-600 hover:text-black" onClick={() => handleSort('created_on')}>
                        <div className="flex items-center">
                          Joined Date
                          <ArrowUpDown className="ml-2 h-3 w-3 opacity-50" />
                        </div>
                      </TableHead>
                      <TableHead className="text-right text-neutral-600">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.length === 0 ? (
                      <TableRow className="hover:bg-transparent border-neutral-200">
                        <TableCell colSpan={7} className="h-60 text-center">
                          <div className="flex flex-col items-center justify-center text-neutral-400">
                            <Users className="h-12 w-12 mb-4 opacity-20" />
                            <p className="text-lg font-medium">No users found</p>
                            <p className="text-sm">Try adjusting your filters or search query.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentItems.map((user) => (
                        <TableRow key={user.Id} className="group transition-colors hover:bg-neutral-50 border-neutral-200">
                          <TableCell><Checkbox className="border-neutral-400 data-[state=checked]:bg-black data-[state=checked]:text-white" /></TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm transition-transform group-hover:scale-105 border border-neutral-100", getAvatarColor(user.Id))}>
                                {getInitials(user.FirstName, user.OtherNames)}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-semibold text-black group-hover:text-neutral-800 transition-colors">
                                  {user.FirstName} {user.OtherNames}
                                </span>
                                <span className="text-xs text-neutral-500">{user.Email}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center text-xs text-neutral-500">
                                <Building2 className="mr-1 h-3 w-3" />
                                {user.CompanyName || "N/A"}
                              </div>
                              <div className="flex items-center text-xs text-neutral-500">
                                <span className="font-mono">{user.AccountId}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                              {user.Roles.slice(0, 2).map((role, idx) => (
                                <Badge key={idx} variant="outline" className="bg-neutral-100 text-black text-[10px] py-0 border-neutral-300">
                                  {role.RoleName}
                                </Badge>
                              ))}
                              {user.Roles.length > 2 && (
                                <Badge variant="outline" className="bg-neutral-100 text-black text-[10px] py-0 border-neutral-300">+{user.Roles.length - 2}</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.IsActive === 1 ? (
                              <Badge className="bg-black text-white hover:bg-neutral-800 border-none transition-all rounded-full px-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-white mr-2 animate-pulse" />
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-transparent text-black border-neutral-400 transition-all rounded-full px-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 mr-2" />
                                Suspended
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-neutral-500 text-sm">
                            {formatDate(user.created_on)}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-black hover:bg-neutral-100">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48 bg-white border border-neutral-200 text-black">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-neutral-200" />
                                <DropdownMenuItem className="focus:bg-neutral-100 focus:text-black" onClick={() => handleViewDetails(user)}>
                                  <Eye className="mr-2 h-4 w-4" /> View Full Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => initiateToggleUserStatus(user)} className={user.IsActive === 1 ? "text-neutral-700 focus:text-black focus:bg-neutral-100" : "text-neutral-700 focus:text-black focus:bg-neutral-100"}>
                                  {user.IsActive === 1 ? (
                                    <><Ban className="mr-2 h-4 w-4" /> Suspend Account</>
                                  ) : (
                                    <><RefreshCw className="mr-2 h-4 w-4" /> Reactivate Account</>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-neutral-200" />
                                <DropdownMenuItem className="focus:bg-neutral-100 focus:text-black">
                                  <Mail className="mr-2 h-4 w-4" /> Send Message
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {currentItems.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center h-60 text-neutral-400 bg-white rounded-xl border border-dashed border-neutral-300">
                    <Users className="h-12 w-12 mb-4 opacity-20" />
                    <p className="text-lg font-medium">No users found</p>
                  </div>
                ) : (
                  currentItems.map(user => (
                    <Card key={user.Id} className="group hover:shadow-md transition-all duration-300 border border-neutral-200 bg-white text-black shadow-sm overflow-hidden flex flex-col">
                      <div className={cn("h-1.5 w-full", user.IsActive === 1 ? "bg-black" : "bg-neutral-300")} />
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-sm transition-transform group-hover:scale-110 border border-neutral-100", getAvatarColor(user.Id))}>
                              {getInitials(user.FirstName, user.OtherNames)}
                            </div>
                            <div className="flex flex-col">
                              <h3 className="font-bold text-lg leading-tight group-hover:text-neutral-600 transition-colors">
                                {user.FirstName} {user.OtherNames}
                              </h3>
                              <p className="text-xs text-neutral-500">{user.Email}</p>
                            </div>
                          </div>
                          <Badge variant={user.IsActive === 1 ? "secondary" : "outline"} className={cn("rounded-full px-2", user.IsActive === 1 ? "bg-black text-white hover:bg-neutral-800" : "text-neutral-500 border-neutral-300")}>
                            {user.IsActive === 1 ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 space-y-4 pt-2">
                        <div className="grid grid-cols-2 gap-y-3">
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Company</span>
                            <span className="text-sm font-medium truncate text-neutral-700">{user.CompanyName || "Individual"}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Joined</span>
                            <span className="text-sm font-medium text-neutral-700">{formatDate(user.created_on)}</span>
                          </div>
                          <div className="flex flex-col col-span-2">
                            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-1">Roles</span>
                            <div className="flex flex-wrap gap-1">
                              {user.Roles.map((role, idx) => (
                                <Badge key={idx} variant="secondary" className="text-[10px] py-0 h-5 font-normal bg-neutral-100 text-black hover:bg-neutral-200">
                                  {role.RoleName}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-2 flex items-center gap-2">
                          <Button variant="secondary" size="sm" className="flex-1 h-8 text-xs font-semibold bg-black text-white hover:bg-neutral-800" onClick={() => handleViewDetails(user)}>
                            <Eye className="mr-2 h-3 w-3" /> Details
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="h-8 w-8 px-0 border-neutral-200 bg-black text-white hover:bg-neutral-800">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white border border-neutral-200 text-black">
                              <DropdownMenuItem onClick={() => initiateToggleUserStatus(user)} className="focus:bg-neutral-100 focus:text-black">
                                {user.IsActive === 1 ? (
                                  <><Ban className="mr-2 h-4 w-4" /> Suspend</>
                                ) : (
                                  <><RefreshCw className="mr-2 h-4 w-4" /> Reactivate</>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="focus:bg-neutral-100 focus:text-black">
                                <Mail className="mr-2 h-4 w-4" /> Email User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Pagination Container */}
      {!isLoading && processedUsers.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-200">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-500 whitespace-nowrap">Show per page</span>
              <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                <SelectTrigger className="w-[80px] h-8 bg-neutral-50 border-neutral-200 text-black">
                  <SelectValue placeholder={pageSize.toString()} />
                </SelectTrigger>
                <SelectContent className="bg-white border border-neutral-200 text-black">
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-neutral-500">
              Showing <span className="font-medium text-black">{Math.min((currentPage - 1) * pageSize + 1, processedUsers.length)}</span> to <span className="font-medium text-black">{Math.min(currentPage * pageSize, processedUsers.length)}</span> of <span className="font-medium text-black">{processedUsers.length}</span> results
            </p>
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))} 
                  className={cn("bg-black text-white hover:bg-neutral-800", currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer")}
                />
              </PaginationItem>
              
              {getPageNumbers().map((pageNumber, index) => (
                <PaginationItem key={index} className="hidden sm:inline-block">
                  {pageNumber === null ? (
                    <PaginationEllipsis className="text-black" />
                  ) : (
                    <PaginationLink
                      onClick={() => handlePageChange(pageNumber)}
                      isActive={currentPage === pageNumber}
                      className={cn("cursor-pointer", currentPage === pageNumber ? "bg-black text-white hover:bg-neutral-800" : "text-black bg-white hover:bg-neutral-100")}
                    >
                      {pageNumber}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={cn("bg-black text-white hover:bg-neutral-800", currentPage === totalPages || totalPages === 0 ? "pointer-events-none opacity-50" : "cursor-pointer")}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* User Details Side Sheet - Monochrome (Light Mode) */}
      <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
        <SheetContent className="sm:max-w-lg p-0 flex flex-col gap-0 border-l border-neutral-200 bg-white text-black">
          <div className={cn("h-32 w-full relative bg-neutral-100")}>
            <div className="absolute -bottom-10 left-8 p-1 bg-white rounded-2xl shadow-xl">
               <div className={cn("w-24 h-24 rounded-xl flex items-center justify-center text-white font-bold text-3xl bg-black border border-neutral-100")}>
                {selectedUser && getInitials(selectedUser.FirstName, selectedUser.OtherNames)}
              </div>
            </div>
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 bg-black text-white hover:bg-neutral-800 rounded-full h-8 w-8" onClick={() => setDetailsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <ScrollArea className="flex-1 pt-12">
            <div className="px-8 pb-10 space-y-8">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-black">
                    {selectedUser?.FirstName} {selectedUser?.OtherNames}
                  </h2>
                  {selectedUser?.IsActive === 1 ? (
                    <Badge className="bg-black text-white border-none rounded-full">Active</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-transparent text-black border-neutral-300 rounded-full">Suspended</Badge>
                  )}
                </div>
                <p className="text-neutral-500">{selectedUser?.Email}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {selectedUser?.Roles.map((role, index) => (
                    <Badge key={index} variant="secondary" className="bg-neutral-100 text-black border-neutral-200 font-normal">
                      {role.RoleName}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 flex items-center">
                    <SlidersHorizontal className="mr-2 h-3 w-3" />
                    Account Overview
                  </h3>
                  <div className="grid grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                    <div>
                      <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-tight">Account ID</p>
                      <p className="text-sm font-mono font-medium text-black">{selectedUser?.AccountId}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-tight">Username</p>
                      <p className="text-sm font-medium text-black">{selectedUser?.UserName || 'Not Set'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-tight">CDS Number</p>
                      <p className="text-sm font-medium text-black">{selectedUser?.CdsNo || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-tight">Joined Since</p>
                      <p className="text-sm font-medium text-black">{formatDate(selectedUser?.created_on || '')}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 flex items-center">
                    <Mail className="mr-2 h-3 w-3" />
                    Contact Information
                  </h3>
                  <div className="space-y-3 px-1">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-neutral-100 flex items-center justify-center">
                        <Mail className="h-4 w-4 text-black" />
                      </div>
                      <div>
                        <p className="text-[10px] text-neutral-500 font-bold leading-none mb-1">Email Address</p>
                        <p className="text-sm font-medium text-black">{selectedUser?.Email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-neutral-100 flex items-center justify-center">
                        <Phone className="h-4 w-4 text-black" />
                      </div>
                      <div>
                        <p className="text-[10px] text-neutral-500 font-bold leading-none mb-1">Phone Number</p>
                        <p className="text-sm font-medium text-black">{selectedUser?.PhoneNumber || 'No phone recorded'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-neutral-100 flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-black" />
                      </div>
                      <div>
                        <p className="text-[10px] text-neutral-500 font-bold leading-none mb-1">Company / Institution</p>
                        <p className="text-sm font-medium text-black">{selectedUser?.CompanyName || 'Individual User'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedUser?.PostalAddress && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500">Postal Address</h3>
                    <div className="bg-neutral-50 p-4 rounded-xl text-sm leading-relaxed text-black border border-neutral-200">
                      {selectedUser.PostalAddress}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>

          <div className="p-6 border-t border-neutral-200 bg-white flex gap-3">
            <Button className="flex-1 bg-black text-white hover:bg-neutral-800" onClick={() => {
              if (selectedUser) initiateToggleUserStatus(selectedUser)
            }}>
              {selectedUser?.IsActive === 1 ? <Ban className="mr-2 h-4 w-4" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              {selectedUser?.IsActive === 1 ? "Deactivate User" : "Reactivate User"}
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10 border-neutral-300 bg-black text-white hover:bg-neutral-800">
              <Mail className="h-4 w-4" />
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Add User Dialog - Monochrome Wizard (Light Mode) */}
      <Dialog open={addUserOpen} onOpenChange={handleAddUserClose}>
        <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden border border-neutral-200 shadow-2xl bg-white text-black">
          <div className="bg-black p-8 text-white relative border-b border-neutral-800">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
               <UserPlus size={120} />
            </div>
            <DialogTitle className="text-2xl font-bold mb-2 flex items-center text-white">
              <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center mr-3">
                <Plus className="h-6 w-6 text-white" />
              </div>
              Register New User
            </DialogTitle>
            <DialogDescription className="text-neutral-400 text-base">
              {addUserStep === 1 
                ? "Step 1: Choose the type of account to create." 
                : "Step 2: Provide personal and contact information."}
            </DialogDescription>
            
            <div className="mt-8 flex items-center gap-3">
              <div className={cn("h-1.5 flex-1 rounded-full transition-all duration-500", addUserStep >= 1 ? "bg-white" : "bg-neutral-700")} />
              <div className={cn("h-1.5 flex-1 rounded-full transition-all duration-500", addUserStep >= 2 ? "bg-white" : "bg-neutral-700")} />
            </div>
          </div>

          <div className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {addUserStep === 1 ? (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-sm font-bold uppercase tracking-widest text-neutral-500">Select Registration Profile</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                            >
                              <div className={cn("relative rounded-xl border-2 p-4 cursor-pointer transition-all hover:bg-neutral-50", field.value === "individual" ? "border-black bg-neutral-50" : "border-neutral-200")}>
                                <RadioGroupItem value="individual" id="r-individual" className="sr-only" />
                                <label htmlFor="r-individual" className="cursor-pointer flex flex-col items-center text-center gap-3">
                                  <div className={cn("h-12 w-12 rounded-full flex items-center justify-center", field.value === "individual" ? "bg-black text-white" : "bg-neutral-100 text-neutral-500")}>
                                    <Users className="h-6 w-6" />
                                  </div>
                                  <div>
                                    <p className="font-bold text-black">Individual</p>
                                    <p className="text-xs text-neutral-500 mt-1">Personal investor account for single users.</p>
                                  </div>
                                </label>
                              </div>
                              <div className={cn("relative rounded-xl border-2 p-4 cursor-pointer transition-all hover:bg-neutral-50", field.value === "agent" ? "border-black bg-neutral-50" : "border-neutral-200")}>
                                <RadioGroupItem value="agent" id="r-agent" className="sr-only" />
                                <label htmlFor="r-agent" className="cursor-pointer flex flex-col items-center text-center gap-3">
                                  <div className={cn("h-12 w-12 rounded-full flex items-center justify-center", field.value === "agent" ? "bg-black text-white" : "bg-neutral-100 text-neutral-500")}>
                                    <LayoutGrid className="h-6 w-6" />
                                  </div>
                                  <div>
                                    <p className="font-bold text-black">Agent / Intermediary</p>
                                    <p className="text-xs text-neutral-500 mt-1">Represents and manages other investors.</p>
                                  </div>
                                </label>
                              </div>
                              <div className={cn("relative rounded-xl border-2 p-4 cursor-pointer transition-all hover:bg-neutral-50", field.value === "corporate" ? "border-black bg-neutral-50" : "border-neutral-200")}>
                                <RadioGroupItem value="corporate" id="r-corporate" className="sr-only" />
                                <label htmlFor="r-corporate" className="cursor-pointer flex flex-col items-center text-center gap-3">
                                  <div className={cn("h-12 w-12 rounded-full flex items-center justify-center", field.value === "corporate" ? "bg-black text-white" : "bg-neutral-100 text-neutral-500")}>
                                    <Building2 className="h-6 w-6" />
                                  </div>
                                  <div>
                                    <p className="font-bold text-black">Corporate</p>
                                    <p className="text-xs text-neutral-500 mt-1">Company, institution or legal entity.</p>
                                  </div>
                                </label>
                              </div>
                              <div className={cn("relative rounded-xl border-2 p-4 cursor-pointer transition-all hover:bg-neutral-50", field.value === "admin" ? "border-black bg-neutral-50" : "border-neutral-200")}>
                                <RadioGroupItem value="admin" id="r-admin" className="sr-only" />
                                <label htmlFor="r-admin" className="cursor-pointer flex flex-col items-center text-center gap-3">
                                  <div className={cn("h-12 w-12 rounded-full flex items-center justify-center", field.value === "admin" ? "bg-black text-white" : "bg-neutral-100 text-neutral-500")}>
                                    <SlidersHorizontal className="h-6 w-6" />
                                  </div>
                                  <div>
                                    <p className="font-bold text-black">Administrator</p>
                                    <p className="text-xs text-neutral-500 mt-1">System level access and controls.</p>
                                  </div>
                                </label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end pt-4">
                      <Button
                        type="button"
                        className="w-full sm:w-auto px-8 bg-black text-white hover:bg-neutral-800"
                        onClick={() => {
                          if (form.getValues().role) {
                            setAddUserStep(2)
                          } else {
                            form.setError("role", {
                              type: "manual",
                              message: "Please select a profile to continue",
                            })
                          }
                        }}
                      >
                        Continue to Details
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <Tabs defaultValue="basic" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 mb-6 bg-neutral-100 p-1 rounded-xl h-11 border border-neutral-200">
                        <TabsTrigger value="basic" className="rounded-lg data-[state=active]:bg-black data-[state=active]:text-white text-neutral-500">Basic</TabsTrigger>
                        <TabsTrigger value="contact" className="rounded-lg data-[state=active]:bg-black data-[state=active]:text-white text-neutral-500">Contact</TabsTrigger>
                        <TabsTrigger value="account" className="rounded-lg data-[state=active]:bg-black data-[state=active]:text-white text-neutral-500">Settings</TabsTrigger>
                      </TabsList>

                      <TabsContent value="basic" className="space-y-4 pt-2">
                        {(form.getValues().role === "individual" || form.getValues().role === "agent") && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="firstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-black">First Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. Alexander" className="bg-neutral-50 border-neutral-200 text-black" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="otherNames"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-black">Other Names</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. Wright" className="bg-neutral-50 border-neutral-200 text-black" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}

                        {(form.getValues().role === "corporate" || form.getValues().role === "agent") && (
                          <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-black">Company Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. BondKonnect Ltd" className="bg-neutral-50 border-neutral-200 text-black" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        {form.getValues().role === "corporate" && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                            <FormField
                              control={form.control}
                              name="locality"
                              render={({ field }) => (
                                <FormItem className="space-y-3">
                                  <FormLabel className="text-black">Entity Locality</FormLabel>
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={(value) => {
                                        field.onChange(value)
                                        form.setValue("categoryType", "")
                                      }}
                                      value={field.value}
                                      className="flex gap-4"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="local" id="l-local" className="border-black text-black" />
                                        <label htmlFor="l-local" className="text-sm font-medium text-black">Local</label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="foreign" id="l-foreign" className="border-black text-black" />
                                        <label htmlFor="l-foreign" className="text-sm font-medium text-black">Foreign</label>
                                      </div>
                                    </RadioGroup>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                        
                        {form.getValues().role === "corporate" && form.getValues().locality === "local" && (
                          <FormField
                            control={form.control}
                            name="categoryType"
                            render={({ field }) => (
                              <FormItem className="space-y-3 pt-2">
                                <FormLabel className="text-black">Business Category</FormLabel>
                                <FormControl>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="bg-neutral-50 border-neutral-200 text-black h-10">
                                      <SelectValue placeholder="Select business type..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border border-neutral-200 text-black">
                                      <SelectItem value="broker">Certified Broker</SelectItem>
                                      <SelectItem value="dealer">Authorized Dealer</SelectItem>
                                      <SelectItem value="other">Institutional Investor</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </TabsContent>

                      <TabsContent value="contact" className="space-y-4 pt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-black">Email Address</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="user@example.com" className="bg-neutral-50 border-neutral-200 text-black" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-black">Phone Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="+254 ..." className="bg-neutral-50 border-neutral-200 text-black" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="postalAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-black">Postal Address</FormLabel>
                              <FormControl>
                                <Input placeholder="P.O. Box ..." className="bg-neutral-50 border-neutral-200 text-black" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {(form.getValues().role === "individual" || form.getValues().role === "agent") && (
                           <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 mt-4">
                              <p className="text-xs font-bold text-neutral-500 mb-3 uppercase tracking-wider">Broker Assignment (Optional)</p>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="outline" className="w-full justify-between h-10 border-neutral-300 bg-black text-white hover:bg-neutral-800">
                                    {selectedBrokers.length > 0 ? `${selectedBrokers.length} Brokers Selected` : "Select primary brokers..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px] p-0 shadow-xl border border-neutral-200 bg-white text-black">
                                  <Command className="bg-white text-black">
                                    <CommandInput placeholder="Search system brokers..." className="text-black" />
                                    <CommandList>
                                      <CommandEmpty>No brokers found.</CommandEmpty>
                                      <CommandGroup>
                                        {brokerOptions.map((broker) => (
                                          <CommandItem
                                            key={broker.value}
                                            value={broker.value}
                                            className="text-black hover:bg-neutral-100"
                                            onSelect={(val) => {
                                              const updated = selectedBrokers.includes(val)
                                                ? selectedBrokers.filter(b => b !== val)
                                                : selectedBrokers.length < 5 ? [...selectedBrokers, val] : selectedBrokers
                                              setSelectedBrokers(updated)
                                            }}
                                          >
                                            <div className={cn("mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-neutral-300", selectedBrokers.includes(broker.value) ? "bg-black text-white" : "opacity-50")}>
                                              {selectedBrokers.includes(broker.value) && <Check className="h-3 w-3" />}
                                            </div>
                                            {broker.label}
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                           </div>
                        )}
                      </TabsContent>

                      <TabsContent value="account" className="space-y-6 pt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="cdsNo"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-black">CDS Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. CDS123456" className="bg-neutral-50 border-neutral-200 text-black" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-xl border border-dashed border-neutral-300 p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base font-semibold text-black">Enable Account</FormLabel>
                                  <FormDescription className="text-xs text-neutral-500">User will have immediate login access</FormDescription>
                                </div>
                                <FormControl>
                                  <Checkbox checked={field.value} onCheckedChange={field.onChange} className="border-black data-[state=checked]:bg-black data-[state=checked]:text-white" />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </TabsContent>
                    </Tabs>

                    <DialogFooter className="flex gap-2 sm:gap-0 pt-2">
                      <Button type="button" variant="ghost" onClick={() => setAddUserStep(1)} className="flex-1 sm:flex-none bg-black text-white hover:bg-neutral-800">
                        Back to Profile
                      </Button>
                      <Button type="submit" disabled={isLoading} className="flex-1 sm:flex-none px-10 bg-black text-white hover:bg-neutral-800">
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Confirm & Create"
                        )}
                      </Button>
                    </DialogFooter>
                  </div>
                )}
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog - Monochrome (Light Mode) */}
      <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <DialogContent className="sm:max-w-md border border-neutral-200 shadow-2xl overflow-hidden p-0 bg-white text-black">
          <div className="p-8 text-center flex flex-col items-center border-b border-neutral-200">
            <div className="h-16 w-16 rounded-full flex items-center justify-center mb-4 bg-black text-white">
              {confirmationAction === 'deactivate' ? <Ban className="h-8 w-8" /> : <RefreshCw className="h-8 w-8" />}
            </div>
            <DialogTitle className="text-xl font-bold text-black">
              {confirmationAction === 'deactivate' ? "Suspend Account?" : "Reactivate Account?"}
            </DialogTitle>
            <DialogDescription className="mt-2 text-neutral-500">
              {confirmationAction === 'deactivate' 
                ? "This will immediately revoke system access for " 
                : "This will restore system access for "}
              <span className="font-bold text-black">{userToToggle?.FirstName} {userToToggle?.OtherNames}</span>.
            </DialogDescription>
          </div>

          <div className="p-6 bg-neutral-50 flex gap-3">
            <Button variant="ghost" className="flex-1 bg-black text-white hover:bg-neutral-800" onClick={() => setConfirmationOpen(false)}>
              Keep Current Status
            </Button>
            <Button
              onClick={() => userToToggle && handleToggleUserStatus(userToToggle)}
              className="flex-1 bg-black text-white hover:bg-neutral-800"
            >
              {confirmationAction === 'deactivate' ? "Yes, Suspend" : "Yes, Reactivate"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}