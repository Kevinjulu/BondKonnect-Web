"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Grid3X3, LayoutGrid, UserPlus, Users, BarChart3, MessageSquare, Edit, UserMinus, Plus, Mail, ArrowUpDown, Filter } from "lucide-react"
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function HubComponent() {
  const [userType, setUserType] = useState("individual") // individual, corporate, agent
  const [viewMode, setViewMode] = useState("grid") // grid, list
  const [isAssignPortfolioOpen, setIsAssignPortfolioOpen] = useState(false)
  const [isAddIntermediaryOpen, setIsAddIntermediaryOpen] = useState(false)
  const [isInviteOpen, setIsInviteOpen] = useState(false)

  // Mock data for different user types - Monochrome colors
  const individualData = [
    { id: 1, name: "Research & Development", email: "r&d@nerou.com", people: 13, initial: "R" },
    { id: 2, name: "People Ops", email: "people.ops@nerou.com", people: 16, initial: "P" },
    { id: 3, name: "Executives", email: "executives@nerou.com", people: 26, initial: "E" },
    { id: 4, name: "Sales & Support", email: "support@nerou.com", people: 16, initial: "S" },
    { id: 5, name: "Product Design", email: "design@nerou.com", people: 0, initial: "P" },
    { id: 6, name: "Branding", email: "branding@nerou.com", people: 13, initial: "B" },
  ]

  const corporateData = [
    { id: 1, name: "Alpha Brokers", email: "contact@alphabrokers.com", people: 8, initial: "A" },
    { id: 2, name: "Beta Securities", email: "info@betasec.com", people: 12, initial: "B" },
    { id: 3, name: "Gamma Investments", email: "support@gammainvest.com", people: 5, initial: "G" },
    { id: 4, name: "Delta Financial", email: "help@deltafinancial.com", people: 9, initial: "D" },
  ]

  const agentData = [
    { id: 1, name: "John Smith", email: "john.smith@example.com", type: "Client", initial: "J" },
    { id: 2, name: "Sarah Johnson", email: "sarah.j@example.com", type: "Client", initial: "S" },
    { id: 3, name: "Michael Brown", email: "m.brown@example.com", type: "Client", initial: "M" },
    { id: 4, name: "Emma Wilson", email: "emma.w@example.com", type: "Client", initial: "E" },
    { id: 5, name: "Robert Davis", email: "r.davis@brokerfirm.com", type: "Broker", initial: "R" },
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
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Collaboration Hub</h1>
          <p className="text-muted-foreground mt-1">
            People & Teams: Manage your network, intermediaries, and team assignments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="bg-white text-black border-neutral-200 hover:bg-neutral-50"
            onClick={() => setIsAddIntermediaryOpen(true)}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Intermediary
          </Button>
          <Button
            className="bg-black text-white hover:bg-neutral-800 shadow-sm"
            onClick={() => setIsInviteOpen(true)}
          >
            <Mail className="h-4 w-4 mr-2" />
            Invite New
          </Button>
        </div>
      </div>

      <Card className="shadow-sm bg-white border border-neutral-200 text-black">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
             <div className="relative w-full sm:w-[350px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input 
                  placeholder="Search network..." 
                  className="pl-9 bg-neutral-50 border-neutral-200 text-black focus-visible:ring-1 focus-visible:ring-black"
                />
             </div>
             
             <div className="flex items-center gap-2">
                <Tabs value={userType} onValueChange={setUserType} className="w-full">
                    <TabsList className="bg-neutral-100 p-1 rounded-lg border border-neutral-200 h-10">
                        <TabsTrigger value="individual" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm text-neutral-500">Individual</TabsTrigger>
                        <TabsTrigger value="corporate" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm text-neutral-500">Corporate</TabsTrigger>
                        <TabsTrigger value="agent" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm text-neutral-500">Agent</TabsTrigger>
                    </TabsList>
                </Tabs>
                
                <div className="h-8 w-[1px] bg-neutral-200 mx-2 hidden sm:block"></div>

                <div className="flex border border-neutral-200 rounded-md bg-white">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-r-none h-9 px-3 ${viewMode === "grid" ? "bg-neutral-100 text-black" : "text-neutral-500 hover:text-black"}`}
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-l-none h-9 px-3 ${viewMode === "list" ? "bg-neutral-100 text-black" : "text-neutral-500 hover:text-black"}`}
                    onClick={() => setViewMode("list")}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </div>
             </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item) => (
            <Card key={item.id} className="group hover:shadow-md transition-all duration-300 border border-neutral-200 bg-white text-black overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-16 w-16 border-4 border-white shadow-sm bg-neutral-100">
                    <AvatarFallback className="text-xl font-bold text-black bg-neutral-100">{item.initial}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-lg mt-3 text-black group-hover:text-neutral-700 transition-colors">{item.name}</h3>
                  <p className="text-sm text-neutral-500">{item.email}</p>
                  
                  <div className="flex items-center mt-3 bg-neutral-50 px-3 py-1 rounded-full border border-neutral-100">
                    <Users className="h-3.5 w-3.5 mr-1.5 text-neutral-500" />
                    <span className="text-xs font-medium text-neutral-600">
                      {('people' in item) ? item.people : '-'} {('people' in item) ? item.people === 1 ? "Connection" : "Connections" : '-'  }
                    </span>
                  </div>
                  
                  <div className="flex mt-6 space-x-2 w-full px-4">
                    <Button variant="outline" size="sm" className="flex-1 border-neutral-200 hover:bg-neutral-50 text-black bg-white">
                      <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
                      Stats
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                         <Button variant="outline" size="icon" className="h-9 w-9 border-neutral-200 hover:bg-neutral-50 text-black bg-white">
                             <Edit className="h-3.5 w-3.5" />
                         </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white border border-neutral-200 text-black">
                        <DropdownMenuItem className="focus:bg-neutral-100 focus:text-black">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Assign Portfolio
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-neutral-100"/>
                        <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-700">
                          <UserMinus className="h-4 w-4 mr-2" />
                          Remove Contact
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button size="sm" className="flex-1 bg-black text-white hover:bg-neutral-800">
                      <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
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
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-600">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-600">Email Contact</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-600">Connections</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-neutral-600">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-100">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar className="h-9 w-9 mr-3 bg-neutral-100 border border-neutral-200">
                        <AvatarFallback className="bg-neutral-100 text-black font-medium">{item.initial}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-black">{item.name}</div>
                        {userType === "agent" && <div className="text-xs text-neutral-500">{('type' in item) ? item.type : '-'}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{item.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {userType !== "agent" ? (
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-neutral-400" />
                        <span>{('people' in item) ? item.people : '-'}</span>
                      </div>
                    ) : (
                      <span className="text-neutral-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-black hover:bg-neutral-100">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-black hover:bg-neutral-100">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white border border-neutral-200">
                          <DropdownMenuItem className="focus:bg-neutral-100">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Assign Portfolio
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-neutral-100"/>
                          <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-700">
                            <UserMinus className="h-4 w-4 mr-2" />
                            Remove Contact
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-black hover:bg-neutral-100">
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
      <div className="mt-12 space-y-6">
        <div className="flex items-center justify-between">
           <h2 className="text-2xl font-bold text-black">Leave Management</h2>
           <Button onClick={() => setIsAssignPortfolioOpen(true)} className="bg-black text-white hover:bg-neutral-800">
              <UserPlus className="mr-2 h-4 w-4"/> Assign Portfolio
           </Button>
        </div>
        
        <Card className="border border-neutral-200 shadow-sm bg-white">
          <CardHeader className="border-b border-neutral-100 pb-4">
             <CardTitle className="text-lg font-bold text-black">LeaveTrail Operations</CardTitle>
             <CardDescription className="text-neutral-500">Recent operations performed by assigned colleagues during your absence.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                        Colleague
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                        Operation
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-100">
                    <tr className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">2025-04-25</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black font-medium">Jane Cooper</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                         <Badge variant="outline" className="bg-neutral-100 text-black border-neutral-300">Approval</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">Approved bid #4532 for $12,500</td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">2025-04-24</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black font-medium">Robert Davis</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                         <Badge variant="outline" className="bg-neutral-100 text-black border-neutral-300">Message</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                        Sent message to client regarding portfolio update
                      </td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">2025-04-23</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black font-medium">Jane Cooper</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                         <Badge variant="outline" className="text-black border-neutral-300">Rejection</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">Rejected bid #4530 for $8,200</td>
                    </tr>
                  </tbody>
                </table>
              </div>
          </CardContent>
        </Card>
      </div>

      {/* Assign Portfolio Modal */}
      <Dialog open={isAssignPortfolioOpen} onOpenChange={setIsAssignPortfolioOpen}>
        <DialogContent className="sm:max-w-[450px] bg-white border border-neutral-200 text-black">
          <DialogHeader className="border-b border-neutral-100 pb-4">
            <DialogTitle className="text-black">Assign Portfolio</DialogTitle>
            <DialogDescription className="text-neutral-500">Assign your portfolio to an intermediary during your absence.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="assignTo" className="text-black">
                Assign To
              </Label>
              <Select>
                <SelectTrigger className="bg-neutral-50 border-neutral-200 text-black">
                  <SelectValue placeholder="Select intermediary" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-neutral-200">
                  <SelectItem value="john" className="focus:bg-neutral-100">John Smith</SelectItem>
                  <SelectItem value="sarah" className="focus:bg-neutral-100">Sarah Johnson</SelectItem>
                  <SelectItem value="michael" className="focus:bg-neutral-100">Michael Brown</SelectItem>
                  <SelectItem value="emma" className="focus:bg-neutral-100">Emma Wilson</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endDate" className="text-black">
                End Date
              </Label>
              <Input type="date" id="endDate" className="bg-neutral-50 border-neutral-200 text-black" />
            </div>
          </div>
          <DialogFooter className="border-t border-neutral-100 pt-4">
            <Button variant="outline" onClick={() => setIsAssignPortfolioOpen(false)} className="border-neutral-200 text-black hover:bg-neutral-50">
              Cancel
            </Button>
            <Button type="submit" className="bg-black text-white hover:bg-neutral-800">Confirm Assignment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Intermediary Modal */}
      <Dialog open={isAddIntermediaryOpen} onOpenChange={setIsAddIntermediaryOpen}>
        <DialogContent className="sm:max-w-[450px] bg-white border border-neutral-200 text-black">
          <DialogHeader className="border-b border-neutral-100 pb-4">
            <DialogTitle className="text-black">Add Intermediary</DialogTitle>
            <DialogDescription className="text-neutral-500">Select an intermediary from the list below to add to your network.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[300px] overflow-y-auto py-4 space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3 bg-neutral-100 border border-neutral-200">
                    <AvatarFallback className="text-black bg-neutral-100">{["J", "S", "M", "E", "R"][i - 1]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-black">
                      {["John Smith", "Sarah Johnson", "Michael Brown", "Emma Wilson", "Robert Davis"][i - 1]}
                    </div>
                    <div className="text-xs text-neutral-500">
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
                <Button size="sm" variant="outline" className="border-neutral-200 text-black hover:bg-black hover:text-white transition-colors">
                  Select
                </Button>
              </div>
            ))}
          </div>
          <DialogFooter className="border-t border-neutral-100 pt-4">
            <Button variant="outline" onClick={() => setIsAddIntermediaryOpen(false)} className="border-neutral-200 text-black hover:bg-neutral-50">
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Modal */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="sm:max-w-[450px] bg-white border border-neutral-200 text-black">
          <DialogHeader className="border-b border-neutral-100 pb-4">
            <DialogTitle className="text-black">Invite Intermediary</DialogTitle>
            <DialogDescription className="text-neutral-500">Send an email invitation to a new intermediary.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-black">
                Email Address
              </Label>
              <Input id="email" placeholder="intermediary@example.com" className="bg-neutral-50 border-neutral-200 text-black" />
            </div>
          </div>
          <DialogFooter className="border-t border-neutral-100 pt-4">
            <Button variant="outline" onClick={() => setIsInviteOpen(false)} className="border-neutral-200 text-black hover:bg-neutral-50">
              Cancel
            </Button>
            <Button type="submit" className="bg-black text-white hover:bg-neutral-800">Send Invitation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
