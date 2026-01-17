'use client'

import { useEffect, useState } from "react"
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
 
} from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog"
import { Input } from "@/app/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"
import { Checkbox } from "@/app/components/ui/checkbox"
import { Badge } from "@/app/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/app/components/ui/pagination"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { useToast } from "@/app/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { 
  getAllUsers, 
  getRoles, 
  suspendUser, 
  reactivateUser,
  register
} from "@/app/lib/actions/api.actions"
import { cn } from "@/app/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/app/components/ui/command"

// Role type
interface Role {
  Id: number
  RoleName: string
  RoleDescription: string
}

// User type from API (raw response) - removed as it's not used

// User type based on API response (mapped)
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

export default function UserManagementPage() {
  const { toast } = useToast()
  const [users, setUsers] = useState<ApiUser[]>([])
  const [filteredUsers, setFilteredUsers] = useState<ApiUser[]>([])
  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [successToast, setSuccessToast] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [displayMode, setDisplayMode] = useState<"table" | "board" | "list">("table")
  const [availableRoles, setAvailableRoles] = useState<Role[]>([])
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(15)
  const totalPages = Math.ceil(filteredUsers.length / pageSize)
  
  // Get current items for pagination
  const getCurrentItems = () => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return filteredUsers.slice(startIndex, endIndex)
  }
  
  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }
  
  const handlePageSizeChange = (size: string) => {
    setPageSize(parseInt(size))
    setCurrentPage(1)  // Reset to first page when changing page size
  }
  
  // Get page numbers to display
  const getPageNumbers = () => {
    const maxPagesToShow = 5
    let pages: (number | null)[] = []
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages
      pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    } else {
      // Show first page, last page, current page, and pages around current
      if (currentPage <= 3) {
        // Current page is near the start
        pages = [1, 2, 3, 4, null, totalPages]
      } else if (currentPage >= totalPages - 2) {
        // Current page is near the end
        pages = [1, null, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
      } else {
        // Current page is in the middle
        pages = [1, null, currentPage - 1, currentPage, currentPage + 1, null, totalPages]
      }
    }
    
    return pages
  }

  // State for broker/dealer selection
  const [selectedBrokers, setSelectedBrokers] = useState<string[]>([])
  const [newDealerEmails, setNewDealerEmails] = useState<string[]>([''])
  const [brokerOptions] = useState([
    { value: "broker1", label: "ABC Securities" },
    { value: "broker2", label: "XYZ Investments" },
    { value: "broker3", label: "Capital Markets Ltd" },
    { value: "broker4", label: "Equity Traders Inc" },
    { value: "broker5", label: "Bond Street Securities" },
  ])
  
  // Handle new dealer email inputs
  const handleNewDealerInputChange = (index: number, value: string) => {
    const newInputs = [...newDealerEmails]
    newInputs[index] = value
    setNewDealerEmails(newInputs)
  }
  
  const addNewDealerInput = () => {
    setNewDealerEmails([...newDealerEmails, ''])
  }

  // Fetch users and roles when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true)
      try {
        const response = await getAllUsers()
        if (response?.success && response.data) {
          // Map User[] to ApiUser[] to handle missing fields
          const mappedUsers: ApiUser[] = (response.data as Array<{
            Id: number;
            AccountId?: string;
            UserName?: string | null;
            CompanyName?: string | null;
            FirstName?: string;
            OtherNames?: string;
            Email: string;
            PhoneNumber?: string;
            PostalAddress?: string | null;
            IsActive: number;
            CdsNo?: string;
            IsLocal?: number;
            IsForeign?: number;
            Roles?: Role[];
            created_on?: string;
          }>).map((user) => ({
            Id: user.Id,
            AccountId: user.AccountId || '',
            UserName: user.UserName || null,
            CompanyName: user.CompanyName || null,
            FirstName: user.FirstName || '',
            OtherNames: user.OtherNames || '',
            Email: user.Email,
            PhoneNumber: user.PhoneNumber || '',
            PostalAddress: user.PostalAddress || null,
            IsActive: user.IsActive,
            CdsNo: user.CdsNo || '',
            IsLocal: user.IsLocal || 0,
            IsForeign: user.IsForeign || 0,
            Roles: user.Roles || [],
            created_on: user.created_on || ''
          }))
          setUsers(mappedUsers)
          setFilteredUsers(mappedUsers)
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch users",
            variant: "destructive"
          })
        }
      } catch (error) {
        console.error("Error fetching users:", error)
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    const fetchRoles = async () => {
      try {
        const response = await getRoles()
        if (response?.success && response.data) {
          setAvailableRoles(response.data)
        }
      } catch (error) {
        console.error("Error fetching roles:", error)
      }
    }
    
    fetchUsers()
    fetchRoles()
  }, [toast])
  
  // Filter users when search query or filters change
  useEffect(() => {
    let filtered = [...users]
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(user => 
        (user.FirstName + ' ' + user.OtherNames).toLowerCase().includes(query) ||
        user.Email.toLowerCase().includes(query) ||
        (user.CompanyName && user.CompanyName.toLowerCase().includes(query))
      )
    }
    
    // Apply role filter
    if (selectedRoleFilter !== "all") {
      filtered = filtered.filter(user => 
        user.Roles.some(role => role.RoleName === selectedRoleFilter)
      )
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active" ? 1 : 0
      filtered = filtered.filter(user => user.IsActive === isActive)
    }
    
    setFilteredUsers(filtered)
    // Reset to first page when filters change
    setCurrentPage(1)
  }, [users, searchQuery, selectedRoleFilter, statusFilter])
  
  // User activation/deactivation confirmation
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [userToToggle, setUserToToggle] = useState<ApiUser | null>(null)
  const [confirmationAction, setConfirmationAction] = useState<'activate' | 'deactivate'>('deactivate')

  // Initiate user status toggle with confirmation
  const initiateToggleUserStatus = (user: ApiUser) => {
    setUserToToggle(user)
    setConfirmationAction(user.IsActive === 1 ? 'deactivate' : 'activate')
    setConfirmationOpen(true)
  }

  // Handle user activation/deactivation after confirmation
  const handleToggleUserStatus = async (user: ApiUser) => {
    try {
      setIsLoading(true)
      
      let response
      console.log("Toggling status for user ID:", user.Id)
      if (user.IsActive === 1) {
        response = await suspendUser(user.Id)
      } else {
        response = await reactivateUser(user.Id)
      }
      
      if (response?.success) {
        // Update user in the local state
        const updatedUsers = users.map(u => {
          if (u.Id === user.Id) {
            return {...u, IsActive: u.IsActive === 1 ? 0 : 1}
          }
          return u
        })
        
        setUsers(updatedUsers)
        
        toast({
          title: "Success",
          description: `User ${user.IsActive === 1 ? "deactivated" : "activated"} successfully`,
          variant: "default"
        })
        
        // Close details dialog if it was open
        if (detailsOpen && selectedUser?.Id === user.Id) {
          setSelectedUser({...selectedUser, IsActive: user.IsActive === 1 ? 0 : 1})
        }
      } else {
        toast({
          title: "Error",
          description: response?.message || `Failed to ${user.IsActive === 1 ? "deactivate" : "activate"} user`,
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error(`Error ${user.IsActive === 1 ? "deactivating" : "activating"} user:`, error)
      toast({
        title: "Error",
        description: `Failed to ${user.IsActive === 1 ? "deactivate" : "activate"} user`,
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
      setConfirmationOpen(false)
    }
  }

  const handleViewDetails = (user: ApiUser) => {
    setSelectedUser(user)
    setDetailsOpen(true)
  }

  const [addUserOpen, setAddUserOpen] = useState(false)
  const [addUserStep, setAddUserStep] = useState(1)

  // Form schema for user creation
  const userFormSchema = z.object({
    role: z.string({
      required_error: "Please select a role",
    }),
    firstName: z.string().min(2, { message: "First name must be at least 2 characters" }).optional(),
    otherNames: z.string().min(2, { message: "Last name must be at least 2 characters" }).optional(),
    email: z.string().email({ message: "Please enter a valid email address" }),
    userName: z.string().min(3, { message: "Username must be at least 3 characters" }).optional(),
    companyName: z.string().min(2, { message: "Company name must be at least 2 characters" }).optional(),
    phoneNumber: z.string().min(5, { message: "Please enter a valid phone number" }),
    postalAddress: z.string().min(5, { message: "Please enter a valid address" }).optional(),
    isActive: z.boolean().default(true),
    cdsNo: z.string().optional(),
    isLocal: z.boolean().default(true),
    isForeign: z.boolean().default(false),
    locality: z.string().optional(),
    categoryType: z.string().optional(),
  })

  // Initialize the form
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

  // Reset form and related state when modal is closed
  const handleAddUserClose = () => {
    setAddUserOpen(false)
    setAddUserStep(1)
    form.reset()
    setSelectedBrokers([])
    setNewDealerEmails([''])
  }

  // Fix form submission
  async function onSubmit(values: z.infer<typeof userFormSchema>) {
    setIsLoading(true)
    
    try {
      // Get selected role type
      const roleType = values.role
      
      // Validate form data based on role type
      if (roleType === "individual" || roleType === "agent") {
        if (!values.firstName) {
          form.setError("firstName", {
            type: "manual",
            message: "First name is required",
          })
          setIsLoading(false)
          return
        }
        if (!values.otherNames) {
          form.setError("otherNames", {
            type: "manual",
            message: "Last name is required",
          })
          setIsLoading(false)
          return
        }
      }
      
      if (roleType === "agent" || roleType === "corporate") {
        if (!values.companyName) {
          form.setError("companyName", {
            type: "manual",
            message: "Company name is required",
          })
          setIsLoading(false)
          return
        }
      }
      
      if (roleType === "corporate" && !values.locality) {
        form.setError("locality", {
          type: "manual",
          message: "Locality is required",
        })
        setIsLoading(false)
        return
      }
      
      if (roleType === "corporate" && values.locality === "local" && !values.categoryType) {
        form.setError("categoryType", {
          type: "manual",
          message: "Category type is required",
        })
        setIsLoading(false)
        return
      }
      
      // Prepare registration data based on role type
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
        broker_dealer: selectedBrokers,
        locality: values.locality || "",
        category_type: values.categoryType || "",
        alternate_dealer: [], // If needed, add this functionality
        new_dealer_emails: newDealerEmails.filter(email => email.trim() !== ""),
      }
      
      console.log("Registration data:", registrationData)
      
      // Call the register API function
      const response = await register(registrationData)
      
      if (response?.success) {
    // Close the modal and show success message
    setAddUserOpen(false)
    setAddUserStep(1)
    form.reset()
        setSelectedBrokers([])
        setNewDealerEmails([''])
        
        toast({
          title: "Success",
          description: "User created successfully",
          variant: "default"
        })
        
        // Refresh the user list
        const updatedUsersResponse = await getAllUsers()
        if (updatedUsersResponse?.success && updatedUsersResponse.data) {
          // Map User[] to ApiUser[] to handle missing fields
          const mappedUsers: ApiUser[] = (updatedUsersResponse.data as Array<{
            Id: number;
            AccountId?: string;
            UserName?: string | null;
            CompanyName?: string | null;
            FirstName?: string;
            OtherNames?: string;
            Email: string;
            PhoneNumber?: string;
            PostalAddress?: string | null;
            IsActive: number;
            CdsNo?: string;
            IsLocal?: number;
            IsForeign?: number;
            Roles?: Role[];
            created_on?: string;
          }>).map((user) => ({
            Id: user.Id,
            AccountId: user.AccountId || '',
            UserName: user.UserName || null,
            CompanyName: user.CompanyName || null,
            FirstName: user.FirstName || '',
            OtherNames: user.OtherNames || '',
            Email: user.Email,
            PhoneNumber: user.PhoneNumber || '',
            PostalAddress: user.PostalAddress || null,
            IsActive: user.IsActive,
            CdsNo: user.CdsNo || '',
            IsLocal: user.IsLocal || 0,
            IsForeign: user.IsForeign || 0,
            Roles: user.Roles || [],
            created_on: user.created_on || ''
          }))
          setUsers(mappedUsers)
        }
      } else {
        toast({
          title: "Error",
          description: response?.message || "Failed to create user",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error creating user:", error)
      toast({
        title: "Error",
        description: "An error occurred while creating the user",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      })
    } catch {
      return dateString
    }
  }
  
  // Get initials from name for avatar
  const getInitials = (firstName: string, otherNames: string) => {
    const first = firstName ? firstName.charAt(0) : ''
    const last = otherNames ? otherNames.charAt(0) : ''
    return (first + last).toUpperCase()
  }
  
  // Get random color for avatar based on user ID
  const getAvatarColor = (id: number) => {
    const colors = [
      "#e74c3c", "#3498db", "#e84393", "#0984e3", "#fdcb6e", 
      "#00b894", "#a29bfe", "#0a3d62", "#6c5ce7", "#44bd32"
    ]
    return colors[id % colors.length]
  }

  return (
    <div className="container mx-auto py-8 text-gray-900">
      {/* Success Toast */}
      {successToast && (
        <div className="fixed top-4 right-4 z-50 bg-gray-800 text-white p-4 rounded-md shadow-lg flex items-start gap-3 max-w-md">
          <div className="bg-green-500 rounded-full p-1 mt-0.5">
            <Check className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-medium">&quot;Alexander Wright&quot; details updated</p>
            <p className="text-sm text-gray-300 mt-1">Details have been successfully updated.</p>
            <div className="flex gap-3 mt-2">
              <button className="text-sm underline">Undo</button>
              <button className="text-sm underline">View profile</button>
            </div>
          </div>
          <button 
            onClick={() => setSuccessToast(false)} 
            className="text-gray-400 hover:text-white"
            aria-label="Close notification"
          >
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
              className="h-5 w-5"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}

      <div className="mb-8">
        <h5 className="text-3xl font-bold flex items-center">
         Total Users
          <span className="ml-2 text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
            {users.length}
          </span>
        </h5>
        <p className="text-gray-500 mt-1">Manage your team members and their account permissions here.</p>
      </div>

      {/* View Options */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Button 
            variant={displayMode === "table" ? "default" : "outline"} 
            className={displayMode === "table" ? "bg-gray-100 border-gray-200" : "bg-white border-gray-200"}
            onClick={() => setDisplayMode("table")}
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Table
          </Button>
          <Button 
            variant={displayMode === "board" ? "default" : "outline"} 
            className={displayMode === "board" ? "bg-gray-100 border-gray-200" : "bg-white border-gray-200"}
            onClick={() => setDisplayMode("board")}
          >
            <LayoutList className="h-4 w-4 mr-2" />
            Board
          </Button>
          <Button 
            variant={displayMode === "list" ? "default" : "outline"} 
            className={displayMode === "list" ? "bg-gray-100 border-gray-200" : "bg-white border-gray-200"}
            onClick={() => setDisplayMode("list")}
          >
            <LayoutList className="h-4 w-4 mr-2" />
            List
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              type="search" 
              placeholder="Search" 
              className="pl-8 w-[200px] bg-white border-gray-200" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="border-gray-200">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Hide
          </Button>
          <Button variant="outline" className="border-gray-200">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Customize
          </Button>
          <Button variant="outline" className="border-gray-200">
            Export
          </Button>
          <Button onClick={() => setAddUserOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2 mb-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-gray-200">
              <span>Role</span>
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSelectedRoleFilter("all")}>
              All Roles
            </DropdownMenuItem>
            {availableRoles.map(role => (
              <DropdownMenuItem 
                key={role.Id} 
                onClick={() => setSelectedRoleFilter(role.RoleName)}
              >
                {role.RoleName}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-gray-200">
              <span>Status</span>
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("active")}>Active</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>Inactive</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" className="border-gray-200">
          <Plus className="h-4 w-4 mr-2" />
          Add filter
        </Button>
      </div>

      {/* User Table */}
      <div className="border rounded-md">
        {isLoading ? (
          <div className="flex justify-center items-center p-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading users...</span>
          </div>
        ) : (
          <>
            {displayMode === "table" && (
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[30px]">
                <Checkbox />
              </TableHead>
              <TableHead>Full name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        {searchQuery || selectedRoleFilter !== "all" || statusFilter !== "all" 
                          ? "No users matching filter criteria" 
                          : "No users found"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    getCurrentItems().map((user) => (
                      <TableRow key={user.Id} className="border-t border-gray-200">
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div
                      className="w-8 h-8 rounded-full mr-2 flex items-center justify-center text-white"
                              style={{ backgroundColor: getAvatarColor(user.Id) }}
                    >
                              {getInitials(user.FirstName, user.OtherNames)}
                    </div>
                    <span>
                              {user.FirstName} {user.OtherNames}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                          <a href={`mailto:${user.Email}`} className="text-gray-600 hover:underline">
                            {user.Email}
                  </a>
                </TableCell>
                <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.Roles.map((role, index) => (
                              <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {role.RoleName}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.IsActive === 1 ? (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200 flex items-center w-fit"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5"></span>
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center w-fit">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 mr-1.5"></span>
                      Inactive
                    </Badge>
                  )}
                </TableCell>
                        <TableCell>{formatDate(user.created_on)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleViewDetails(user)} className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => initiateToggleUserStatus(user)}
                            >
                              {user.IsActive === 1 ? (
                                <Ban className="h-4 w-4 text-red-500" />
                              ) : (
                                <RefreshCw className="h-4 w-4 text-green-500" />
                              )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
                    ))
                  )}
          </TableBody>
        </Table>
            )}
            
            {displayMode === "board" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {filteredUsers.map(user => (
                  <div key={user.Id} className="border rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: getAvatarColor(user.Id) }}
                      >
                        {getInitials(user.FirstName, user.OtherNames)}
                      </div>
                      <div>
                        <h3 className="font-medium">{user.FirstName} {user.OtherNames}</h3>
                        <p className="text-sm text-gray-500">{user.Email}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {user.Roles.map((role, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {role.RoleName}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <Badge
                        variant="outline"
                        className={user.IsActive === 1 
                          ? "bg-green-50 text-green-700 border-green-200 flex items-center w-fit"
                          : "bg-red-50 text-red-700 border-red-200 flex items-center w-fit"}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${user.IsActive === 1 ? "bg-green-500" : "bg-red-500"} mr-1.5`}></span>
                        {user.IsActive === 1 ? "Active" : "Inactive"}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleViewDetails(user)} className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => initiateToggleUserStatus(user)}
                        >
                          {user.IsActive === 1 ? (
                            <Ban className="h-4 w-4 text-red-500" />
                          ) : (
                            <RefreshCw className="h-4 w-4 text-green-500" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {displayMode === "list" && (
              <div className="divide-y">
                {filteredUsers.map(user => (
                  <div key={user.Id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: getAvatarColor(user.Id) }}
                      >
                        {getInitials(user.FirstName, user.OtherNames)}
                      </div>
                      <div>
                        <h3 className="font-medium">{user.FirstName} {user.OtherNames}</h3>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <span>{user.Email}</span>
                          <span>•</span>
                          <div className="flex flex-wrap gap-1">
                            {user.Roles.map((role, index) => (
                              <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {role.RoleName}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className={user.IsActive === 1 
                          ? "bg-green-50 text-green-700 border-green-200 flex items-center w-fit"
                          : "bg-red-50 text-red-700 border-red-200 flex items-center w-fit"}
                      >
                        {user.IsActive === 1 ? "Active" : "Inactive"}
                      </Badge>
                      <Button variant="ghost" size="icon" onClick={() => handleViewDetails(user)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => initiateToggleUserStatus(user)}
                      >
                        {user.IsActive === 1 ? (
                          <Ban className="h-4 w-4 text-red-500" />
                        ) : (
                          <RefreshCw className="h-4 w-4 text-green-500" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Rows per page</span>
          <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="w-[70px] h-8">
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="15">15</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-500">
            {filteredUsers.length > 0 
              ? `${Math.min((currentPage - 1) * pageSize + 1, filteredUsers.length)}-${Math.min(currentPage * pageSize, filteredUsers.length)} of ${filteredUsers.length} rows` 
              : "0 rows"}
          </span>
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))} 
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {getPageNumbers().map((pageNumber, index) => (
              <PaginationItem key={index}>
                {pageNumber === null ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => handlePageChange(pageNumber)}
                    isActive={currentPage === pageNumber}
                    className="cursor-pointer"
                  >
                    {pageNumber}
              </PaginationLink>
                )}
            </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages || totalPages === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* User Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl"
                  style={{ backgroundColor: getAvatarColor(selectedUser.Id) }}
                >
                  {getInitials(selectedUser.FirstName, selectedUser.OtherNames)}
                </div>
                <div>
                  <h3 className="font-medium text-lg">
                    {selectedUser.FirstName} {selectedUser.OtherNames}
                  </h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedUser.Roles.map((role, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {role.RoleName}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Account ID</p>
                  <p>{selectedUser.AccountId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Username</p>
                  <p>{selectedUser.UserName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Company</p>
                  <p>{selectedUser.CompanyName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p>{selectedUser.Email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone Number</p>
                  <p>{selectedUser.PhoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p>{selectedUser.IsActive === 1 ? "Active" : "Inactive"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">CDS Number</p>
                  <p>{selectedUser.CdsNo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Joined Date</p>
                  <p>{formatDate(selectedUser.created_on)}</p>
                </div>
                {selectedUser.PostalAddress && (
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500">Postal Address</p>
                    <p>{selectedUser.PostalAddress}</p>
                </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500">Account Type</p>
                  <p>
                    {selectedUser.IsLocal === 1 ? "Local" : selectedUser.IsForeign === 1 ? "Foreign" : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => initiateToggleUserStatus(selectedUser)}
                  variant={selectedUser.IsActive === 1 ? "destructive" : "default"}
                >
                  {selectedUser.IsActive === 1 ? "Deactivate" : "Activate"} User
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={addUserOpen} onOpenChange={handleAddUserClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {addUserStep === 1 ? "Select Registration Type" : "Add New User"}
            </DialogTitle>
            <DialogDescription>
              {addUserStep === 1
                ? "First, select the type of user you want to register."
                : "Fill in the user details to create a new account."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {addUserStep === 1 ? (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Registration Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 gap-4"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="individual" />
                                </FormControl>
                              <FormLabel className="font-normal">
                                <div className="flex flex-col">
                                  <span>Individual</span>
                                  <span className="text-xs text-gray-500">Personal investor account</span>
                                </div>
                              </FormLabel>
                              </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="agent" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                <div className="flex flex-col">
                                  <span>Agent</span>
                                  <span className="text-xs text-gray-500">Represents other investors</span>
                                </div>
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="corporate" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                <div className="flex flex-col">
                                  <span>Institution</span>
                                  <span className="text-xs text-gray-500">Company or institution</span>
                                </div>
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="admin" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                <div className="flex flex-col">
                                  <span>Admin</span>
                                  <span className="text-xs text-gray-500">System administrator</span>
                                </div>
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={() => {
                        if (form.getValues().role) {
                          setAddUserStep(2)
                        } else {
                          form.setError("role", {
                            type: "manual",
                            message: "Please select a registration type to continue",
                          })
                        }
                      }}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="basic">Basic Info</TabsTrigger>
                      <TabsTrigger value="contact">Contact</TabsTrigger>
                      <TabsTrigger value="account">Account Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-4 pt-4">
                    {(form.getValues().role === "individual") && (
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John" {...field} />
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
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                        )}
                      {/* <FormField
                        control={form.control}
                        name="userName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="johndoe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      /> */}

                      {(form.getValues().role === "corporate" || form.getValues().role === "agent") && (
                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company</FormLabel>
                            <FormControl>
                              <Input placeholder="Acme Inc" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      )}

                      {form.getValues().role === "corporate" && (
                        <FormField
                          control={form.control}
                          name="locality"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Locality</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={(value) => {
                                    field.onChange(value)
                                    form.setValue("categoryType", "")
                                  }}
                                  value={field.value}
                                  className="flex flex-col space-y-1"
                                >
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="local" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Local</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="foreign" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Foreign</FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {form.getValues().role === "corporate" && form.getValues().locality === "local" && (
                        <FormField
                          control={form.control}
                          name="categoryType"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Category</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  className="flex flex-col space-y-1"
                                >
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="broker" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Broker</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="dealer" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Authorized Dealer</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="other" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Other</FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </TabsContent>

                    <TabsContent value="contact" className="space-y-4 pt-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john.doe@example.com" {...field} />
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
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 555-123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="postalAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Address</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Main St, City, Country" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {(form.getValues().role === "individual" || 
                         form.getValues().role === "agent" || 
                         (form.getValues().role === "corporate" && 
                          form.getValues().locality === "foreign") ||
                         (form.getValues().role === "corporate" && 
                          form.getValues().locality === "local" && 
                          form.getValues().categoryType === "other")) && (
                        <>
                          <div className="space-y-2">
                            <FormLabel>Select Broker/Dealer (Max 5)</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className="w-full justify-between"
                                >
                                  {selectedBrokers.length > 0
                                    ? `${selectedBrokers.length} selected`
                                    : "Select brokers..."}
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput placeholder="Search broker..." className="h-9" />
                                  <CommandList>
                                    <CommandEmpty>No broker found.</CommandEmpty>
                                    <CommandGroup>
                                      {brokerOptions.map((broker) => (
                                        <CommandItem
                                          key={broker.value}
                                          value={broker.value}
                                          onSelect={(currentValue) => {
                                            const newSelected = selectedBrokers.includes(currentValue)
                                              ? selectedBrokers.filter(val => val !== currentValue)
                                              : selectedBrokers.length < 5
                                                ? [...selectedBrokers, currentValue]
                                                : selectedBrokers;
                                            setSelectedBrokers(newSelected);
                                          }}
                                        >
                                          {broker.label}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              selectedBrokers.includes(broker.value) ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </div>

                          <div className="space-y-2">
                            <FormLabel>Can&apos;t find broker/dealer?</FormLabel>
                            {newDealerEmails.map((input, index) => (
                              <div key={index} className="flex gap-2">
                                <Input
                                  type="email"
                                  placeholder="Enter broker email"
                                  value={input}
                                  onChange={(e) => handleNewDealerInputChange(index, e.target.value)}
                                />
                                {index === newDealerEmails.length - 1 && index < 4 && (
                                  <Button
                                    variant="outline"
                                    onClick={addNewDealerInput}
                                    type="button"
                                  >
                                    +
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </TabsContent>

                    <TabsContent value="account" className="space-y-4 pt-4">
                      <FormField
                        control={form.control}
                        name="cdsNo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CDS Number</FormLabel>
                            <FormControl>
                              <Input placeholder="CDS123456" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Active</FormLabel>
                              <FormDescription>User will be able to log in if active</FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <div className="space-y-2">
                        <FormLabel>Account Type</FormLabel>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="isLocal"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={(checked) => {
                                      field.onChange(checked)
                                      if (checked) {
                                        form.setValue("isForeign", false)
                                      }
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Local</FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="isForeign"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={(checked) => {
                                      field.onChange(checked)
                                      if (checked) {
                                        form.setValue("isLocal", false)
                                      }
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Foreign</FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={() => setAddUserStep(1)}>
                      Back
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create User"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* User Activation/Deactivation Confirmation Dialog */}
      <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Confirm User Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to {confirmationAction} this user?
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setConfirmationOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => userToToggle && handleToggleUserStatus(userToToggle)}
              variant={confirmationAction === 'deactivate' ? 'destructive' : 'default'}
            >
              {confirmationAction === 'deactivate' ? 'Deactivate' : 'Activate'} User
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

