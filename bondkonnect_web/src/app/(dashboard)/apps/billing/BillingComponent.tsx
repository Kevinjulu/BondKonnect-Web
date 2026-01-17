"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"   
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  CreditCard,
  MoreVertical,
  FileText,
  Download,
  Eye,
  Edit,
  Trash,
  CheckCircle2,
  AlertCircle,
  Phone,
  Plus,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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

export function BillingComponent({ userDetails }: { userDetails: UserData }) {
  const [activeTab, setActiveTab] = useState("all")
  const [isAddCardOpen, setIsAddCardOpen] = useState(false)
  const [isAddMobileOpen, setIsAddMobileOpen] = useState(false)
  const [isAddPaymentMethodOpen, setIsAddPaymentMethodOpen] = useState(false)

  const invoices = [
    {
      id: "#007",
      month: "August 2023",
      admin: { name: "Latifulrajar", email: "latifulrajar83@gmail.com", avatar: "L" },
      date: "August 28, 2023",
      amount: "USD $10.00",
      users: 10,
      status: "Paid",
      paymentMethod: "mpesa",
    },
    {
      id: "#006",
      month: "August 2023",
      admin: { name: "Sherina", email: "sherinapetualan@gmail.com", avatar: "S" },
      date: "August 28, 2023",
      amount: "USD $10.00",
      users: 10,
      status: "Paid",
      paymentMethod: "mpesa",
    },
    {
      id: "#005",
      month: "August 2023",
      admin: { name: "Ujang", email: "ujangsunda@gmail.com", avatar: "U" },
      date: "August 28, 2023",
      amount: "USD $10.00",
      users: 10,
      status: "Paid",
      paymentMethod: "mpesa",
    },
    {
      id: "#004",
      month: "July 2023",
      admin: { name: "Asep", email: "asep@gmail.com", avatar: "A" },
      date: "July 28, 2023",
      amount: "USD $10.00",
      users: 10,
      status: "Paid",
      paymentMethod: "card",
    },
    {
      id: "#003",
      month: "July 2023",
      admin: { name: "Budi", email: "budi@gmail.com", avatar: "B" },
      date: "July 28, 2023",
      amount: "USD $10.00",
      users: 10,
      status: "Paid",
      paymentMethod: "card",
    },
  ]

  const filteredInvoices = invoices.filter((invoice) => {
    if (activeTab === "all") return true
    if (activeTab === "mpesa") return invoice.paymentMethod === "mpesa"
    if (activeTab === "cards") return invoice.paymentMethod === "card"
    return true
  })

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-sm text-muted-foreground mb-1">Taxjar Plan</h2>
            <h3 className="text-xl font-bold mb-1">Professional</h3>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <h4 className="text-sm text-muted-foreground">Monthly Limit</h4>
                <p className="font-medium">25,000 Orders</p>
              </div>
              <div>
                <h4 className="text-sm text-muted-foreground">Cost</h4>
                <p className="font-medium">$ 12,099/Year</p>
              </div>
              <div>
                <h4 className="text-sm text-muted-foreground">Renew Date</h4>
                <p className="font-medium">31 December 2023</p>
              </div>
            </div>

            <div className="border rounded-lg p-4 mb-4">
              <h4 className="text-sm font-medium mb-1">Plan Usage</h4>
              <p className="text-xs text-muted-foreground mb-4">Usage resets on August 29, 2023</p>

              <h5 className="text-sm font-medium mb-2">Orders</h5>
              <div className="mb-2">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: "75%" }}></div>
                </div>
              </div>

              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-teal-500 mr-2"></div>
                  <span className="font-medium">18,305</span>
                  <span className="text-xs text-muted-foreground ml-1">Sales order</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-teal-300 mr-2"></div>
                  <span className="font-medium">9,305</span>
                  <span className="text-xs text-muted-foreground ml-1">Sales order</span>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              Changes Plan
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-sm text-muted-foreground mb-1">Autofile Plan</h2>
            <h3 className="text-xl font-bold mb-1">Pay-As-You-Go</h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="text-sm text-muted-foreground">Active Enrollments</h4>
                <p className="font-medium">12 States</p>
              </div>
              <div>
                <h4 className="text-sm text-muted-foreground">Cost</h4>
                <p className="font-medium">25 per filing</p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">
                Save up to X% on each AutoFile by purchasing a Prepaid Filling Bundle
              </h4>
              <p className="text-xs text-muted-foreground mb-4">
                Select a bundle option to save on your AutoFile filings.
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                <Button variant="outline" className="flex-1">
                  25 Filling
                </Button>
                <Button variant="outline" className="flex-1">
                  50 Filling
                </Button>
                <Button variant="outline" className="flex-1">
                  100 Filling
                </Button>
                <Button variant="outline" className="flex-1">
                  Unlimited
                </Button>
              </div>

              <div className="flex items-center text-xs text-muted-foreground">
                <AlertCircle className="h-4 w-4 mr-2 text-blue-500" />
                <p>Purchase a bundle to save on your AutoFile filings. Bundles never expire.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Billing History</h2>

        <div className="mb-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name or status etc." className="pl-10" />
          </div>
        </div>

        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="mpesa">M-Pesa</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300" 
                        aria-label="Select all invoices"
                      />
                    </TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Billing Admin</TableHead>
                    <TableHead>Billing Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300" 
                          aria-label={`Select invoice ${invoice.id}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="h-9 w-9 rounded-md border border-gray-200 flex items-center justify-center mr-3">
                            <FileText className="h-5 w-5 text-red-500" />
                          </div>
                          <div>
                            <div className="font-medium">Invoice {invoice.id}</div>
                            <div className="text-xs text-muted-foreground">{invoice.month}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Paid
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarFallback>{invoice.admin.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{invoice.admin.name}</div>
                            <div className="text-xs text-muted-foreground">{invoice.admin.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>{invoice.amount}</TableCell>
                      <TableCell>{invoice.users} Users</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="mpesa" className="mt-0">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300" 
                        aria-label="Select all invoices"
                      />
                    </TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Billing Admin</TableHead>
                    <TableHead>Billing Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300" 
                          aria-label={`Select invoice ${invoice.id}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="h-9 w-9 rounded-md border border-gray-200 flex items-center justify-center mr-3">
                            <FileText className="h-5 w-5 text-red-500" />
                          </div>
                          <div>
                            <div className="font-medium">Invoice {invoice.id}</div>
                            <div className="text-xs text-muted-foreground">{invoice.month}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Paid
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarFallback>{invoice.admin.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{invoice.admin.name}</div>
                            <div className="text-xs text-muted-foreground">{invoice.admin.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>{invoice.amount}</TableCell>
                      <TableCell>{invoice.users} Users</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="cards" className="mt-0">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300" 
                        aria-label="Select all invoices"
                      />
                    </TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Billing Admin</TableHead>
                    <TableHead>Billing Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300" 
                          aria-label={`Select invoice ${invoice.id}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="h-9 w-9 rounded-md border border-gray-200 flex items-center justify-center mr-3">
                            <FileText className="h-5 w-5 text-red-500" />
                          </div>
                          <div>
                            <div className="font-medium">Invoice {invoice.id}</div>
                            <div className="text-xs text-muted-foreground">{invoice.month}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Paid
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarFallback>{invoice.admin.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{invoice.admin.name}</div>
                            <div className="text-xs text-muted-foreground">{invoice.admin.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>{invoice.amount}</TableCell>
                      <TableCell>{invoice.users} Users</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Payment Methods</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Credit Cards</h3>
                <Button variant="outline" size="sm" onClick={() => setIsAddCardOpen(true)}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Add New Card
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center mr-4">
                      <CreditCard className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">Visa ending in 4242</div>
                      <div className="text-xs text-muted-foreground">Expires 12/2025</div>
                    </div>
                  </div>
                  <Badge>Default</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-md bg-purple-100 flex items-center justify-center mr-4">
                      <CreditCard className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium">Mastercard ending in 5555</div>
                      <div className="text-xs text-muted-foreground">Expires 08/2024</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Set as Default
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Mobile Payment</h3>
                <Button variant="outline" size="sm" onClick={() => setIsAddMobileOpen(true)}>
                  <Phone className="h-4 w-4 mr-2" />
                  Add Mobile Payment
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-md bg-green-100 flex items-center justify-center mr-4">
                      <Phone className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">M-Pesa</div>
                      <div className="text-xs text-muted-foreground">+254 712 345 678</div>
                    </div>
                  </div>
                  <Badge>Default</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <Button onClick={() => setIsAddPaymentMethodOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Payment Method
        </Button>
      </div>

      {/* Add Credit Card Modal */}
      <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Card</DialogTitle>
            <DialogDescription>Add a new credit card to your account.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cardName">Name on Card</Label>
              <Input id="cardName" placeholder="John Smith" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input id="cardNumber" placeholder="4242 4242 4242 4242" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input id="expiryDate" placeholder="MM/YY" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" placeholder="123" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="defaultCard" className="rounded border-gray-300" 
                aria-label="Set as default payment method"
              />
              <Label htmlFor="defaultCard">Set as default payment method</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCardOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Card</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Mobile Payment Modal */}
      <Dialog open={isAddMobileOpen} onOpenChange={setIsAddMobileOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Mobile Payment</DialogTitle>
            <DialogDescription>Add a new mobile payment method to your account.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="paymentType">Payment Type</Label>
              <Select>
                <SelectTrigger id="paymentType">
                  <SelectValue placeholder="Select payment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mpesa">M-Pesa</SelectItem>
                  <SelectItem value="airtel">Airtel Money</SelectItem>
                  <SelectItem value="orange">Orange Money</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input id="phoneNumber" placeholder="+254 712 345 678" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountName">Account Name</Label>
              <Input id="accountName" placeholder="John Smith" />
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="defaultMobile" className="rounded border-gray-300" 
                aria-label="Set as default payment method"
              />
              <Label htmlFor="defaultMobile">Set as default payment method</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMobileOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Mobile Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Payment Method Modal */}
      <Dialog open={isAddPaymentMethodOpen} onOpenChange={setIsAddPaymentMethodOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>Choose a payment method to add to your account.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button
              className="w-full justify-start h-auto p-4"
              onClick={() => {
                setIsAddPaymentMethodOpen(false)
                setIsAddCardOpen(true)
              }}
            >
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center mr-4">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Credit or Debit Card</div>
                  <div className="text-xs text-muted-foreground">Add a new card to your account</div>
                </div>
              </div>
            </Button>

            <Button
              className="w-full justify-start h-auto p-4"
              onClick={() => {
                setIsAddPaymentMethodOpen(false)
                setIsAddMobileOpen(true)
              }}
            >
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-md bg-green-100 flex items-center justify-center mr-4">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Mobile Payment</div>
                  <div className="text-xs text-muted-foreground">Add a mobile payment method</div>
                </div>
              </div>
            </Button>

            <Button className="w-full justify-start h-auto p-4" variant="outline">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-md bg-purple-100 flex items-center justify-center mr-4">
                  <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-medium">Bank Account</div>
                  <div className="text-xs text-muted-foreground">Add a bank account for direct transfers</div>
                </div>
              </div>
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPaymentMethodOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
