"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import { Checkbox } from "@/app/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group"
import { Switch } from "@/app/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
// Removed unused tooltip imports
import { Alert, AlertDescription } from "@/app/components/ui/alert"
import { Loader2 } from "lucide-react"
import { useToast } from "@/app/hooks/use-toast"
import { 
  getRoles, 
  getUsersByRole, 
  getRolePermissions, 
  getUserPermissions, 
  modifyUserPermissions, 
  addUserToNewRole,
  getAllRolesForUser
} from "@/app/lib/actions/api.actions"
import { PERMISSION_DESCRIPTIONS, ModulePermissions, ActionPermissions } from "@/app/app/config/permissions"
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

// Types
interface ApiRole {
  Id: number
  RoleName: string
  RoleDescription: string
}

interface ApiUser {
  Id: number
  Email: string
  FirstName: string
  OtherNames: string | null
  UserName: string | null
  CompanyName: string | null
  PhoneNumber: string
  AccountId: string
}

interface RoleWithColor extends ApiRole {
  color: string
}

// Role colors mapping
const roleColors: Record<string, string> = {
  "Admin": "#4f46e5",
  "Individual": "#0ea5e9",
  "Agent": "#10b981",
  "Corporate": "#f59e0b",
  "Broker": "#ec4899",
  "AuthorizedDealer": "#8b5cf6"
}

// Permission categories
const permissionCategories = {
  dashboard: "Dashboard & Bond Screens",
  portfolio: "Portfolio Management",
  transactions: "Transactions",
  quotes: "Quotes Management",
  messages: "Messages & Communication",
  account: "Account Settings",
  admin: "Administrative Features"
}

export function PermissionMappingTable({ userDetails }: { userDetails: UserData }) {
  const { toast } = useToast()
  const [roles, setRoles] = useState<RoleWithColor[]>([])
  const [selectedRole, setSelectedRole] = useState<string>("")
  const [selectedRoleId, setSelectedRoleId] = useState<number>(0)
  const [users, setUsers] = useState<ApiUser[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [editPermissionsOpen, setEditPermissionsOpen] = useState(false)
  const [changeRoleOpen, setChangeRoleOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null)
  const [newRoleId, setNewRoleId] = useState<number>(0)
  const [userRoles, setUserRoles] = useState<RoleWithColor[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [allPermissions, setAllPermissions] = useState<Record<string, boolean>>({})
  const [userPermissions, setUserPermissions] = useState<Record<string, boolean>>({})
  const [permissionWarning, setPermissionWarning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availableRoles, setAvailableRoles] = useState<RoleWithColor[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Fetch roles on component mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setIsLoading(true)
        const response = await getRoles()
        if (response?.success && response.data) {
          const rolesWithColors = response.data.map((role: ApiRole) => ({
            ...role,
            color: roleColors[role.RoleName] || "#6b7280"
          }))
          setRoles(rolesWithColors)
          if (rolesWithColors.length > 0) {
            setSelectedRole(rolesWithColors[0].RoleName)
            setSelectedRoleId(rolesWithColors[0].Id)
          }
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch roles",
            variant: "destructive"
          })
        }
      } catch (error) {
        console.error("Error fetching roles:", error)
        toast({
          title: "Error",
          description: "Failed to fetch roles",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRoles()
  }, [toast])

  // Fetch users when selected role changes
  useEffect(() => {
    const fetchUsers = async () => {
      if (!selectedRoleId) return
      
      try {
        setIsLoading(true)
        const response = await getUsersByRole({ role_id: selectedRoleId })
        if (response?.success && response.data) {
          setUsers(response.data)
        } else {
          setUsers([])
        }
      } catch (error) {
        console.error("Error fetching users:", error)
        setUsers([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [selectedRoleId, selectedRole])

  // Fetch default permissions for the role
  useEffect(() => {
    const fetchRolePermissions = async () => {
      if (!selectedRoleId) return
      
      try {
        const response = await getRolePermissions({ role_id: selectedRoleId })
        if (response?.success && response.data) {
          // Convert array of permission names to object with boolean values
          const permissionsObj: Record<string, boolean> = {}
          Object.keys(PERMISSION_DESCRIPTIONS).forEach(perm => {
            permissionsObj[perm] = response.data.includes(perm)
          })
          setAllPermissions(permissionsObj)
        }
      } catch (error) {
        console.error("Error fetching role permissions:", error)
      }
    }

    fetchRolePermissions()
  }, [selectedRoleId])

  // Handle role selection change
  const handleRoleChange = (roleId: string) => {
    const role = roles.find(r => r.RoleName.toLowerCase() === roleId.toLowerCase())
    if (role) {
      setSelectedRole(role.RoleName)
      setSelectedRoleId(role.Id)
      setSelectedUsers([])
    }
  }

  // Filter users by search query
  const filteredUsers = users.filter(user => {
    const fullName = `${user.FirstName || ''} ${user.OtherNames || ''}`.trim().toLowerCase()
    const searchLower = searchQuery.toLowerCase()
    return fullName.includes(searchLower) || 
           user.Email.toLowerCase().includes(searchLower) || 
           (user.CompanyName && user.CompanyName.toLowerCase().includes(searchLower))
  })

  // Handle user selection
  const toggleUserSelection = (userId: number) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId))
    } else {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  // Handle select all users
  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map(user => user.Id))
    }
  }

  // Open edit permissions dialog
  const handleEditPermissions = async () => {
    if (selectedUsers.length !== 1) return
    
    setIsLoading(true)
    const user = users.find(u => u.Id === selectedUsers[0])
    
    if (user) {
      setSelectedUser(user)
      
      try {
        const response = await getUserPermissions({ 
          role_id: selectedRoleId,
          user_email: user.Email 
        })
        
        if (response?.success && response.all_permissions) {
          setUserPermissions(response.all_permissions)
          setEditPermissionsOpen(true)
        } else {
          // If no specific permissions, use the role defaults
          setUserPermissions(allPermissions)
      setEditPermissionsOpen(true)
        }
      } catch (error) {
        console.error("Error fetching user permissions:", error)
        toast({
          title: "Error",
          description: "Failed to fetch user permissions",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Open change role dialog
  const handleChangeRole = async () => {
    if (selectedUsers.length !== 1) return
    
    const user = users.find(u => u.Id === selectedUsers[0])
    if (!user) return
    
      setSelectedUser(user)
    setIsLoading(true)
    
    try {
      // Get user's current roles
      const userRolesResponse = await getAllRolesForUser(user.Email)
      
      // Get all available roles
      const allRolesResponse = await getRoles()
      
      if (userRolesResponse?.success && allRolesResponse?.success) {
        const userCurrentRoles = userRolesResponse.data || []
        const allRoles = allRolesResponse.data.map((role: ApiRole) => ({
          ...role,
          color: roleColors[role.RoleName] || "#6b7280"
        }))
        
        // Set the user's current roles
        setUserRoles(allRoles)
        
        // User's current role IDs
        const userRoleIds = userCurrentRoles.map((role: ApiRole) => role.Id)
        
        // The available roles are all roles except the ones the user already has
        const available = allRoles.filter((role: ApiRole) => !userRoleIds.includes(role.Id))
        setAvailableRoles(available)
        
        if (available.length > 0) {
          setNewRoleId(available[0].Id) // Default to the first available role
      setChangeRoleOpen(true)
        } else {
          toast({
            title: "No Available Roles",
            description: "User already has all available roles",
            variant: "default"
          })
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch roles information",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error fetching roles:", error)
      toast({
        title: "Error",
        description: "Failed to fetch available roles",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Save permissions changes
  const savePermissions = () => {
    // Check if any permissions are being downgraded
    const hasDowngrades = Object.keys(userPermissions).some(
      key => allPermissions[key] && !userPermissions[key]
    )

    if (hasDowngrades) {
      setPermissionWarning(true)
    } else {
      completePermissionSave()
    }
  }

  // Complete the permission save after warning
  const completePermissionSave = async () => {
    if (!selectedUser) return
    
    setIsSubmitting(true)
    
    try {
      // Create an array of permissions that are set to true
      const permissionsArray = Object.entries(userPermissions)
        .filter(([, value]) => value === true)
        .map(([key]) => key);
      
      // Create the form data
      const formData = new FormData()
      formData.append('admin_email', userDetails.email || '')
      formData.append('role_id', selectedRoleId.toString())
      formData.append('user_email', selectedUser.Email)
      formData.append('permissions', JSON.stringify(permissionsArray)) // Send as a JSON string of an array
      
      const response = await modifyUserPermissions(formData)
      
      if (response?.success) {
        toast({
          title: "Success",
          description: `${selectedUser.FirstName}'s permissions updated successfully`,
          variant: "default"
        })
    setEditPermissionsOpen(false)
    setPermissionWarning(false)
    setSelectedUsers([])
      } else {
        toast({
          title: "Error",
          description: response?.message || "Failed to update permissions",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error saving permissions:", error)
      toast({
        title: "Error",
        description: "Failed to save permissions",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Save role change
  const saveRoleChange = async () => {
    if (!selectedUser || !newRoleId) return
    
    setIsSubmitting(true)
    
    try {
      const response = await addUserToNewRole({ 
        admin_email: userDetails.email,
        user_email: selectedUser.Email,
        role_id: newRoleId
      })
      
      if (response?.success) {
        const newRole = roles.find(r => r.Id === newRoleId)
        toast({
          title: "Success",
          description: `${selectedUser.FirstName}'s role changed to ${newRole?.RoleName}`,
          variant: "default"
        })
    setChangeRoleOpen(false)
    setSelectedUsers([])
      } else {
        toast({
          title: "Error",
          description: response?.message || "Failed to change role",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error changing role:", error)
      toast({
        title: "Error",
        description: "Failed to change user role",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Toggle a permission
  const togglePermission = (permissionId: string) => {
    setUserPermissions({
      ...userPermissions,
      [permissionId]: !userPermissions[permissionId],
    })
  }

  // Group permissions by category
  const groupPermissionsByCategory = (permissions: Record<string, boolean>) => {
    const grouped: Record<string, Record<string, boolean>> = {}
    
    // Initialize categories
    Object.keys(permissionCategories).forEach(cat => {
      grouped[cat] = {}
    })
    
    // Group permissions
    Object.entries(permissions).forEach(([key, value]) => {
      // Check if it's a module permission
      if (Object.values(ModulePermissions).includes(key as ModulePermissions)) {
        if (key.includes('Bond')) grouped['dashboard'][key] = value
        else if (key.includes('Portfolio')) grouped['portfolio'][key] = value
        else if (key.includes('Quotes')) grouped['quotes'][key] = value
        else if (key.includes('Transactions')) grouped['transactions'][key] = value
        else if (key.includes('Messages')) grouped['messages'][key] = value
        else if (key.includes('Account')) grouped['account'][key] = value
        else if (key.includes('Admin')) grouped['admin'][key] = value
        else grouped['admin'][key] = value
      } 
      // Check if it's an action permission
      else if (Object.values(ActionPermissions).includes(key as ActionPermissions)) {
        if (key.includes('Bond') || key.includes('Yield') || key.includes('Duration') || key.includes('Return') || key.includes('Barbell')) {
          grouped['dashboard'][key] = value
        }
        else if (key.includes('Portfolio') || key.includes('Quote') || key.includes('Face')) {
          grouped['portfolio'][key] = value
        }
        else if (key.includes('Transaction') || key.includes('Approve') || key.includes('Reject') || key.includes('Delegate')) {
          grouped['transactions'][key] = value
        }
        else if (key.includes('Bid')) {
          grouped['quotes'][key] = value
        }
        else if (key.includes('Message')) {
          grouped['messages'][key] = value
        }
        else if (key.includes('User') || key.includes('Password') || key.includes('Create') || key.includes('Delete')) {
          grouped['admin'][key] = value
        }
        else {
          grouped['account'][key] = value
        }
      }
    })
    
    return grouped
  }

  const groupedPermissions = groupPermissionsByCategory(userPermissions)

  // Get initials from name for avatar
  const getInitials = (firstName: string, otherNames: string | null) => {
    const first = firstName ? firstName.charAt(0) : ''
    const last = otherNames ? otherNames.charAt(0) : ''
    return (first + last).toUpperCase()
  }

  // Create a paginated version of filteredUsers
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredUsers.length / pageSize)
  
  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedRole])
  
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

  return (
    <div className="container mx-auto py-1">
      {/* Role Count Summary */}
      <div className="flex flex-wrap gap-2 mb-6">
        {roles.length > 0 ? (
          roles.map((role) => (
            <div 
              key={role.Id} 
              className="px-3 py-1 rounded-md flex items-center space-x-2 border"
              style={{ borderColor: role.color }}
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: role.color }}></div>
              <span>{role.RoleName}</span>
            </div>
          ))
        ) : (
          <div className="p-2 text-gray-500 flex items-center">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span>Loading roles...</span>
        </div>
      )}
      </div>

      {/* Role Tabs */}
      {roles.length > 0 && (
        <Tabs value={selectedRole} onValueChange={handleRoleChange} className="w-full">
          <TabsList className="grid" style={{ gridTemplateColumns: `repeat(${roles.length}, minmax(0, 1fr))` }}>
          {roles.map((role) => (
              <TabsTrigger key={role.Id} value={role.RoleName} className="data-[state=active]:shadow-none relative">
                <div className="flex items-center justify-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: role.color }}></div>
                  {role.RoleName}
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {roles.map((role) => (
            <TabsContent key={role.Id} value={role.RoleName} className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium mb-0 flex items-center">
                <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: role.color }}></div>
                    {role.RoleName} Role
              </h2>
                  {role.RoleName === selectedRole && (
                    <div className="bg-white text-sm px-3 py-1 rounded-full border border-gray-300 shadow-sm">
                      {isLoading ? (
                        <span className="flex items-center">
                          <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          Loading...
                        </span>
                      ) : (
                        <span>{users.length} {users.length === 1 ? 'user' : 'users'}</span>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-gray-600 mt-2">{role.RoleDescription}</p>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input 
                      type="search" 
                      placeholder="Search users" 
                      className="pl-8 w-[250px]" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
              </div>

              {selectedUsers.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button>Choose action</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleEditPermissions} disabled={selectedUsers.length !== 1}>
                      Edit Permissions
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleChangeRole} disabled={selectedUsers.length !== 1}>
                      Change Role
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <Card>
                <CardContent className="p-0 relative min-h-[200px]">
                  {isLoading && role.RoleName === selectedRole ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-gray-500">Loading users...</p>
                      </div>
                    </div>
                  ) : null}
                  
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 w-10">
                          <Checkbox
                            checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                            onCheckedChange={toggleSelectAll}
                          />
                        </th>
                        <th className="text-left p-4">User</th>
                          <th className="text-left p-4">Email</th>
                          <th className="text-left p-4">Company</th>
                          <th className="text-left p-4">Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="text-center py-8 text-gray-500">
                              {searchQuery ? "No users matching search criteria" : "No users found for this role"}
                            </td>
                          </tr>
                        ) : (
                          paginatedUsers.map((user) => (
                            <tr key={user.Id} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <Checkbox
                                  checked={selectedUsers.includes(user.Id)}
                                  onCheckedChange={() => toggleUserSelection(user.Id)}
                            />
                          </td>
                          <td className="p-4">
                            <div className="flex items-center">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white mr-3"
                                style={{ backgroundColor: role.color }}
                              >
                                    {getInitials(user.FirstName, user.OtherNames)}
                              </div>
                              <div>
                                    <div className="font-medium">
                                      {user.FirstName} {user.OtherNames || ''}
                                </div>
                                    <div className="text-sm text-gray-500">{user.AccountId}</div>
                              </div>
                            </div>
                          </td>
                              <td className="p-4">{user.Email}</td>
                              <td className="p-4">{user.CompanyName || '-'}</td>
                              <td className="p-4">{user.PhoneNumber}</td>
                        </tr>
                          ))
                        )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

              {/* Add pagination UI after the table */}
              {filteredUsers.length > 0 && (
                <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{Math.min(filteredUsers.length, (currentPage - 1) * pageSize + 1)}</span> to{" "}
                      <span className="font-medium">{Math.min(filteredUsers.length, currentPage * pageSize)}</span> of{" "}
                      <span className="font-medium">{filteredUsers.length}</span> results
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
          </TabsContent>
        ))}
      </Tabs>
      )}

      {/* Edit Permissions Dialog */}
      <Dialog open={editPermissionsOpen} onOpenChange={setEditPermissionsOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Edit Permissions</DialogTitle>
            <DialogDescription>
              Select permissions to grant to {selectedUser?.FirstName} {selectedUser?.OtherNames}
            </DialogDescription>
          </DialogHeader>

          {permissionWarning ? (
            <div className="space-y-4">
              <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
                <AlertDescription>
                  The changes you&apos;ve applied will downgrade some permissions below the default role setting.
                </AlertDescription>
              </Alert>

              <DialogFooter>
                <Button variant="outline" onClick={() => setPermissionWarning(false)}>
                  Cancel
                </Button>
                <Button onClick={completePermissionSave} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Applying...
                    </>
                  ) : (
                    "Apply changes"
                  )}
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <>
              <div className="grid gap-6 py-4 max-h-[60vh] overflow-y-auto">
                {Object.entries(permissionCategories).map(([category, title]) => (
                  <div key={category} className="space-y-4">
                    <h3 className="font-medium text-lg">{title}</h3>
                    {Object.entries(groupedPermissions[category] || {}).map(([permId, isEnabled]) => (
                      <div key={permId} className="flex items-center justify-between border-b pb-4">
                        <div className="max-w-[70%]">
                          <Label htmlFor={permId} className="font-medium">
                            {permId}
                          </Label>
                          <p className="text-sm text-gray-500">{PERMISSION_DESCRIPTIONS[permId] || "Permission description"}</p>
                        </div>
                        <Switch
                          id={permId}
                          checked={isEnabled}
                          onCheckedChange={() => togglePermission(permId)}
                          className="data-[state=checked]:bg-green-500"
                        />
                      </div>
                    ))}
                      </div>
                    ))}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setEditPermissionsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={savePermissions} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save changes"
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog open={changeRoleOpen} onOpenChange={setChangeRoleOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Role</DialogTitle>
            <DialogDescription>
              Change the role for {selectedUser?.FirstName} {selectedUser?.OtherNames}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="mb-4">
              <Label className="text-base font-medium">Select new role</Label>
              <RadioGroup 
                value={newRoleId.toString()} 
                onValueChange={(value) => setNewRoleId(Number(value))} 
                className="mt-3 space-y-3"
              >
                {availableRoles.map((role) => (
                  <div key={role.Id} className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value={role.Id.toString()} id={`role-${role.Id}`} />
                    <Label htmlFor={`role-${role.Id}`} className="flex items-center cursor-pointer">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: role.color }}></div>
                      {role.RoleName}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {newRoleId && (
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200 mt-4">
                <p className="text-sm text-gray-600">
                  {userRoles.find((r) => r.Id === newRoleId)?.RoleDescription}
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setChangeRoleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveRoleChange} disabled={isSubmitting || !newRoleId}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Changing...
                </>
              ) : (
                "Change role"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

