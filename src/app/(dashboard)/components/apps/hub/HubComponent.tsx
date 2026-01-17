"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Grid3X3, LayoutGrid, UserPlus, Users, BarChart3, MessageSquare, Edit, UserMinus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

export function HubComponent() {
  const [userType, setUserType] = useState("individual") // individual, corporate, agent
  const [viewMode, setViewMode] = useState("grid") // grid, list
  const [isAssignPortfolioOpen, setIsAssignPortfolioOpen] = useState(false)
  const [isAddIntermediaryOpen, setIsAddIntermediaryOpen] = useState(false)
  const [isInviteOpen, setIsInviteOpen] = useState(false)

  // Mock data for different user types
  const individualData = [
    { id: 1, name: "Research & Development", email: "r&d@nerou.com", people: 13, initial: "R", color: "bg-purple-200" },
    { id: 2, name: "People Ops", email: "people.ops@nerou.com", people: 16, initial: "P", color: "bg-teal-200" },
    { id: 3, name: "Executives", email: "executives@nerou.com", people: 26, initial: "E", color: "bg-orange-200" },
    { id: 4, name: "Sales & Support", email: "support@nerou.com", people: 16, initial: "S", color: "bg-cyan-200" },
    { id: 5, name: "Product Design", email: "design@nerou.com", people: 0, initial: "P", color: "bg-slate-200" },
    { id: 6, name: "Branding", email: "branding@nerou.com", people: 13, initial: "B", color: "bg-green-200" },
  ]

  const corporateData = [
    { id: 1, name: "Alpha Brokers", email: "contact@alphabrokers.com", people: 8, initial: "A", color: "bg-red-200" },
    { id: 2, name: "Beta Securities", email: "info@betasec.com", people: 12, initial: "B", color: "bg-blue-200" },
    {
      id: 3,
      name: "Gamma Investments",
      email: "support@gammainvest.com",
      people: 5,
      initial: "G",
      color: "bg-green-200",
    },
    {
      id: 4,
      name: "Delta Financial",
      email: "help@deltafinancial.com",
      people: 9,
      initial: "D",
      color: "bg-yellow-200",
    },
  ]

  const agentData = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@example.com",
      type: "Client",
      initial: "J",
      color: "bg-emerald-200",
    },
    { id: 2, name: "Sarah Johnson", email: "sarah.j@example.com", type: "Client", initial: "S", color: "bg-pink-200" },
    {
      id: 3,
      name: "Michael Brown",
      email: "m.brown@example.com",
      type: "Client",
      initial: "M",
      color: "bg-violet-200",
    },
    { id: 4, name: "Emma Wilson", email: "emma.w@example.com", type: "Client", initial: "E", color: "bg-amber-200" },
    {
      id: 5,
      name: "Robert Davis",
      email: "r.davis@brokerfirm.com",
      type: "Broker",
      initial: "R",
      color: "bg-indigo-200",
    },
  ]

  // Get data based on user type
  const getData = () => {
    switch (userType) {
      case "individual":
        return individualData
      case "corporate":
        return corporateData
      case "agent":
        return agentData
      default:
        return individualData
    }
  }

  const data = getData()

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        {/* <h1 className="text-3xl font-bold">People</h1> */}
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => setIsAddIntermediaryOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add an intermediary
          </Button>
          <Button
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => setIsInviteOpen(true)}
          >
            Invite
          </Button>
        </div>
      </div>

      {/* <Tabs defaultValue="employees" className="mb-6">
        <TabsList>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
        </TabsList>
      </Tabs> */}

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-10" />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Sort By</span>
          <Button variant="outline" size="sm">
            <span className="mr-2">Name</span>
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
            >
              <path
                d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.26618 11.9026 7.38064 11.95 7.49999 11.95C7.61933 11.95 7.73379 11.9026 7.81819 11.8182L10.0682 9.56819Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </Button>
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              className="rounded-r-none"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              className="rounded-l-none"
              onClick={() => setViewMode("list")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* User Type Selector (for demo purposes) */}
      <div className="mb-6 p-4 bg-muted rounded-lg">
        <h3 className="font-medium mb-2">Demo: Select User Type</h3>
        <div className="flex space-x-2">
          <Button
            variant={userType === "individual" ? "default" : "outline"}
            size="sm"
            onClick={() => setUserType("individual")}
          >
            Individual
          </Button>
          <Button
            variant={userType === "corporate" ? "default" : "outline"}
            size="sm"
            onClick={() => setUserType("corporate")}
          >
            Corporate
          </Button>
          <Button variant={userType === "agent" ? "default" : "outline"} size="sm" onClick={() => setUserType("agent")}>
            Agent/Broker
          </Button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className={`h-12 ${item.color} bg-opacity-50 w-full`}></div>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className={`h-16 w-16 -mt-12 border-4 border-background ${item.color}`}>
                    <AvatarFallback className="text-xl">{item.initial}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg mt-2">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.email}</p>
                  <div className="flex items-center mt-2">
                    <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {('people' in item) ? item.people : '-'} {('people' in item) ? item.people === 1 ? "Person" : "People" : '-'  }
                    </span>
                  </div>
                  <div className="flex mt-4 space-x-2">
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Analytics
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Assign
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <UserMinus className="h-4 w-4 mr-2" />
                          Remove as intermediary
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="default" size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  People
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-background divide-y divide-border">
              {data.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar className={`h-8 w-8 mr-3 ${item.color}`}>
                        <AvatarFallback>{item.initial}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        {userType === "agent" && <div className="text-xs text-muted-foreground">{('type' in item) ? item.type : '-'}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{item.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {userType !== "agent" ? (
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{('people' in item) ? item.people : '-'}</span>
                      </div>
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Assign
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <UserMinus className="h-4 w-4 mr-2" />
                            Remove as intermediary
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Leave Management Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Leave Management</h2>
        <Card>
          <CardContent className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Assign Portfolios</h3>
              <p className="text-muted-foreground mb-4">Assign your portfolios to a broker during your absence</p>
              <Button onClick={() => setIsAssignPortfolioOpen(true)}>Assign Portfolio</Button>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">LeaveTrail Operations</h3>
              <p className="text-muted-foreground mb-4">Recent operations performed by assigned colleagues</p>

              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Colleague
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Operation
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-background divide-y divide-border">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">2025-04-25</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">Jane Cooper</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">Approval</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">Approved bid #4532 for $12,500</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">2025-04-24</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">Robert Davis</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">Message</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        Sent message to client regarding portfolio update
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">2025-04-23</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">Jane Cooper</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">Rejection</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">Rejected bid #4530 for $8,200</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assign Portfolio Modal */}
      <Dialog open={isAssignPortfolioOpen} onOpenChange={setIsAssignPortfolioOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Assign Portfolio</DialogTitle>
            <DialogDescription>Assign your portfolio to an intermediary during your absence.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assignTo" className="text-right">
                Assign To
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select intermediary" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="john">John Smith</SelectItem>
                  <SelectItem value="sarah">Sarah Johnson</SelectItem>
                  <SelectItem value="michael">Michael Brown</SelectItem>
                  <SelectItem value="emma">Emma Wilson</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                End Date
              </Label>
              <div className="col-span-3">
                <Input type="date" id="endDate" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignPortfolioOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Intermediary Modal */}
      <Dialog open={isAddIntermediaryOpen} onOpenChange={setIsAddIntermediaryOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add an Intermediary</DialogTitle>
            <DialogDescription>Select an intermediary from the list below.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[300px] overflow-y-auto py-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-md mb-2">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarFallback>{["J", "S", "M", "E", "R"][i - 1]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {["John Smith", "Sarah Johnson", "Michael Brown", "Emma Wilson", "Robert Davis"][i - 1]}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {
                        [
                          "john@example.com",
                          "sarah@example.com",
                          "michael@example.com",
                          "emma@example.com",
                          "robert@example.com",
                        ][i - 1]
                      }
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Select
                </Button>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddIntermediaryOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Modal */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Invite Intermediary</DialogTitle>
            <DialogDescription>Send an invitation to a new intermediary.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" placeholder="intermediary@example.com" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Send Invitation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
