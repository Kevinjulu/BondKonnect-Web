"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Clock,
  Filter,
  Search,
  MoreVertical,
  FileText,
  Calendar,
  Download,
  Trash,
  Edit,
  Eye,
  DollarSign,
  Mail,
} from "lucide-react"
import { useRouter } from "next/navigation"

export function InvoicesComponent() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const router = useRouter()

  const invoices = [
    { id: "#054", customer: "Jane Cooper", date: "23.05.2023", total: "$2800", status: "Paid", amount: "" },
    { id: "#054", customer: "Esther Howard", date: "23.05.2023", total: "$2800", status: "Paid", amount: "" },
    { id: "#054", customer: "Cameron Williamson", date: "23.05.2023", total: "$2800", status: "Draft", amount: "" },
    { id: "#054", customer: "Brooklyn Simmons", date: "23.05.2023", total: "$2800", status: "Paid", amount: "$400" },
    { id: "#054", customer: "Leslie Alexander", date: "23.05.2023", total: "$2800", status: "Overdue", amount: "$400" },
    { id: "#054", customer: "Arlene McCoy", date: "23.05.2023", total: "$2800", status: "Overdue", amount: "$400" },
    { id: "#054", customer: "Marvin McKinney", date: "23.05.2023", total: "$2800", status: "Overdue", amount: "$400" },
    { id: "#054", customer: "Kathryn Murphy", date: "23.05.2023", total: "$2800", status: "Overdue", amount: "$400" },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Paid</Badge>
      case "Draft":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Draft</Badge>
      case "Overdue":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Overdue</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Invoices</h2>
        <Button onClick={() => router.push("/apps/invoices/CreateInvoice")} className="bg-blue-600 hover:bg-blue-700">
          Create an invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="mb-2 text-gray-500">
              <Clock className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold">$60,400</h2>
            <p className="text-sm text-muted-foreground">Overdue amount</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="mb-2 text-gray-500">
              <FileText className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold">$60,400</h2>
            <p className="text-sm text-muted-foreground">Drafted totals</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="mb-2 text-gray-500">
              <DollarSign className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold">$60,400</h2>
            <p className="text-sm text-muted-foreground">Unpaid totals</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="mb-2 text-gray-500">
              <Clock className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold">
              08 <span className="text-sm font-normal">days</span>
            </h2>
            <p className="text-sm text-muted-foreground">Average paid time</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-50">
          <CardContent className="p-6 flex items-center">
            <div className="mr-4">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                05 <span className="text-sm font-normal">invoices</span>
              </h2>
              <p className="text-sm text-muted-foreground">Scheduled for today</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="relative w-full md:w-auto md:min-w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Enter invoice number" className="pl-10" />
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <Tabs defaultValue="all" className="w-auto">
                <TabsList>
                  <TabsTrigger value="all" className="text-xs">
                    All invoices <Badge className="ml-1 bg-blue-100 text-blue-800">54</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="unpaid" className="text-xs">
                    Unpaid <Badge className="ml-1 bg-gray-100 text-gray-800">16</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="draft" className="text-xs">
                    Draft <Badge className="ml-1 bg-gray-100 text-gray-800">3</Badge>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <Button variant="outline" size="sm" onClick={() => setFilterOpen(!filterOpen)}>
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>

              <Select defaultValue="newest">
                <SelectTrigger className="w-[180px] h-9 text-xs">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="highest">Highest Amount</SelectItem>
                  <SelectItem value="lowest">Lowest Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filterOpen && (
            <div className="mb-6 p-4 border rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All Customers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  <SelectItem value="active">Active Customers</SelectItem>
                  <SelectItem value="inactive">Inactive Customers</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <div className="w-1/2">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    From
                  </Button>
                </div>
                <div className="w-1/2">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    To
                  </Button>
                </div>
              </div>

              <div className="md:col-span-3">
                <Button className="w-full">Apply Filters</Button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
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
                  <TableHead className="uppercase text-xs">Status</TableHead>
                  <TableHead className="uppercase text-xs">Date</TableHead>
                  <TableHead className="uppercase text-xs">Number</TableHead>
                  <TableHead className="uppercase text-xs">Customer</TableHead>
                  <TableHead className="uppercase text-xs">Total</TableHead>
                  <TableHead className="uppercase text-xs text-right">Amount</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300" 
                        aria-label={`Select invoice ${invoice.id}`}
                      />
                    </TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.id}</TableCell>
                    <TableCell>{invoice.customer}</TableCell>
                    <TableCell>{invoice.total}</TableCell>
                    <TableCell className="text-right">{invoice.amount}</TableCell>
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
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send to email
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
        </CardContent>
      </Card>
    </div>
  )
}
