"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Filter,
  MoreVertical,
  FileText,
  Download,
  Trash,
  Eye,
  Upload,
  FolderPlus,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  LayoutGrid,
  List
} from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function DMSComponent({ userDetails }: { userDetails: UserData }) {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isNewDocumentOpen, setIsNewDocumentOpen] = useState(false)

  const documents = [
    {
      id: 1,
      name: "Sample Sales Proposal.pdf",
      created: "Jan 16, 2024, 9:18 AM",
      lastActivity: "Jan 24, 2024, 9:18 AM",
      recipients: ["N", "J", "M"],
      status: "Draft",
    },
    {
      id: 2,
      name: "Start exploring here! (Product guide).docx",
      created: "Jan 15, 2024, 9:18 AM",
      lastActivity: "Jan 23, 2024, 9:18 AM",
      recipients: ["E", "J"],
      status: "Completed",
    },
    {
      id: 3,
      name: "Memorandum of Understanding.xlsx",
      created: "Jan 14, 2024, 9:18 AM",
      lastActivity: "Jan 23, 2024, 9:18 AM",
      recipients: ["M"],
      status: "Completed",
    },
    {
      id: 4,
      name: "Employment Contract.pptx",
      created: "Jan 13, 2024, 9:20 AM",
      lastActivity: "Jan 22, 2024, 9:18 AM",
      recipients: ["A", "E", "+3"],
      status: "Sent",
    },
    {
      id: 5,
      name: "Purchase Agreement.jpg",
      created: "Jan 12, 2024, 9:18 AM",
      lastActivity: "Jan 21, 2024, 10:24 AM",
      recipients: ["A", "E"],
      status: "Draft",
    },
    {
      id: 6,
      name: "Lease Agreement.png",
      created: "Jan 10, 2024, 11:18 AM",
      lastActivity: "Jan 21, 2024, 10:22 AM",
      recipients: ["J", "E", "R"],
      status: "Completed",
    },
    {
      id: 7,
      name: "Copyright Registration.gif",
      created: "Jan 10, 2024, 11:18 AM",
      lastActivity: "Jan 21, 2024, 10:20 AM",
      recipients: ["D"],
      status: "Sent",
    },
    {
      id: 8,
      name: "As - Is Bill of Sale.txt",
      created: "Jan 10, 2024, 10:18 AM",
      lastActivity: "Jan 20, 2024, 10:18 AM",
      recipients: ["S", "J"],
      status: "Expired",
    },
    {
      id: 9,
      name: "Service Agreement.zip",
      created: "Jan 10, 2024, 9:18 AM",
      lastActivity: "Jan 20, 2024, 9:15 AM",
      recipients: ["E", "J"],
      status: "Draft",
    },
    {
      id: 10,
      name: "Non-Disclosure Agreement (NDA).rar",
      created: "Jan 10, 2024, 9:18 AM",
      lastActivity: "Jan 20, 2024, 8:18 AM",
      recipients: ["Q"],
      status: "Completed",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Completed</Badge>
      case "Draft":
        return <Badge variant="outline" className="bg-neutral-50 text-neutral-600 border-neutral-200">Draft</Badge>
      case "Sent":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Sent</Badge>
      case "Expired":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Expired</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-black">File Manager</h2>
          <p className="text-neutral-500 mt-1">
             Manage, upload, and organize your system documents securely.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="bg-white border-neutral-200 text-black hover:bg-neutral-50">
             <Download className="h-4 w-4 mr-2" />
             Export
          </Button>
          <Button onClick={() => setIsNewDocumentOpen(true)} className="bg-black text-white hover:bg-neutral-800">
             <FolderPlus className="h-4 w-4 mr-2" />
             New Document
          </Button>
        </div>
      </div>

      {/* Main Content Card */}
      <Card className="shadow-sm border-neutral-200 bg-white">
        <CardContent className="p-6">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-neutral-100 pb-4">
               <TabsList className="bg-neutral-100 p-1 rounded-lg h-10">
                <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-black text-neutral-500 rounded-md text-xs font-medium px-3">
                  All Files
                </TabsTrigger>
                <TabsTrigger value="draft" className="data-[state=active]:bg-white data-[state=active]:text-black text-neutral-500 rounded-md text-xs font-medium px-3">
                  Drafts
                </TabsTrigger>
                <TabsTrigger value="sent" className="data-[state=active]:bg-white data-[state=active]:text-black text-neutral-500 rounded-md text-xs font-medium px-3">
                  Sent
                </TabsTrigger>
                 <TabsTrigger value="completed" className="data-[state=active]:bg-white data-[state=active]:text-black text-neutral-500 rounded-md text-xs font-medium px-3">
                  Completed
                </TabsTrigger>
                 <TabsTrigger value="expired" className="data-[state=active]:bg-white data-[state=active]:text-black text-neutral-500 rounded-md text-xs font-medium px-3">
                  Expired
                </TabsTrigger>
              </TabsList>
              
               <div className="flex items-center gap-2 w-full md:w-auto">
                 <div className="relative flex-1 md:flex-none">
                    <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input placeholder="Search files..." className="pl-9 w-full md:w-[250px] bg-neutral-50 border-neutral-200 focus:ring-black" />
                  </div>
                   <Button variant="outline" size="icon" className="border-neutral-200 text-black hover:bg-neutral-50">
                      <Filter className="h-4 w-4" />
                   </Button>
                    <div className="border-l border-neutral-200 h-6 mx-1"></div>
                     <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-black">
                      <LayoutGrid className="h-4 w-4" />
                   </Button>
                    <Button variant="ghost" size="icon" className="text-black bg-neutral-100">
                      <List className="h-4 w-4" />
                   </Button>
               </div>
            </div>

            <TabsContent value="all" className="mt-0 space-y-4">
              <div className="rounded-lg border border-neutral-200 overflow-hidden">
                <Table>
                  <TableHeader className="bg-neutral-50/50">
                    <TableRow className="border-neutral-100 hover:bg-transparent">
                      <TableHead className="w-[40px]">
                        <input 
                          type="checkbox" 
                          className="rounded border-neutral-300 text-black focus:ring-black" 
                        />
                      </TableHead>
                      <TableHead className="font-semibold text-xs text-neutral-600 uppercase tracking-wider">Document Name</TableHead>
                      <TableHead className="font-semibold text-xs text-neutral-600 uppercase tracking-wider">ID</TableHead>
                      <TableHead className="font-semibold text-xs text-neutral-600 uppercase tracking-wider">Last Activity</TableHead>
                      <TableHead className="font-semibold text-xs text-neutral-600 uppercase tracking-wider">Type</TableHead>
                      <TableHead className="font-semibold text-xs text-neutral-600 uppercase tracking-wider">Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc.id} className="border-neutral-100 hover:bg-neutral-50/50 transition-colors">
                        <TableCell>
                          <input 
                            type="checkbox" 
                            className="rounded border-neutral-300 text-black focus:ring-black"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-neutral-100 flex items-center justify-center border border-neutral-200">
                               <FileText className="h-4 w-4 text-neutral-600" />
                            </div>
                            <div>
                              <div className="font-medium text-sm text-black">{doc.name}</div>
                              <div className="text-[11px] text-neutral-500">Created: {doc.created}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs font-mono text-neutral-500">DOC-{doc.id.toString().padStart(4, "0")}</TableCell>
                        <TableCell className="text-xs text-neutral-600">{doc.lastActivity}</TableCell>
                        <TableCell className="text-xs text-neutral-600">
                           <Badge variant="secondary" className="bg-neutral-100 text-neutral-600 hover:bg-neutral-200 border-none font-normal">
                             {doc.name.split(".").pop()?.toUpperCase() || "FILE"}
                           </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(doc.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-black">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 border-neutral-200">
                              <DropdownMenuItem className="focus:bg-neutral-50">
                                <Eye className="h-4 w-4 mr-2 text-neutral-500" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="focus:bg-neutral-50">
                                <Download className="h-4 w-4 mr-2 text-neutral-500" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-700">
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

              {/* Pagination */}
              <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
                 <div className="text-xs text-neutral-500">
                    Showing <strong>1-10</strong> of <strong>32</strong> documents
                 </div>
                 <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled>
                       <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-black text-white hover:bg-neutral-800 border-black">1</Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">2</Button>
                     <Button variant="outline" size="sm" className="h-8 w-8 p-0">3</Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                       <ChevronRight className="h-4 w-4" />
                    </Button>
                 </div>
              </div>
            </TabsContent>
            
            {/* Empty States for other tabs (Placeholder) */}
            <TabsContent value="draft" className="py-12 text-center text-neutral-500 text-sm">No drafts found.</TabsContent>
            <TabsContent value="sent" className="py-12 text-center text-neutral-500 text-sm">No sent documents.</TabsContent>
             <TabsContent value="completed" className="py-12 text-center text-neutral-500 text-sm">No completed documents.</TabsContent>
             <TabsContent value="expired" className="py-12 text-center text-neutral-500 text-sm">No expired documents.</TabsContent>
          </Tabs>
        </CardContent>
      </Card>


      {/* Info Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-neutral-50 border-neutral-200 shadow-none">
           <CardHeader>
              <CardTitle className="text-sm font-bold text-black flex items-center gap-2">
                 <FileText className="h-4 w-4" /> Document Types
              </CardTitle>
           </CardHeader>
           <CardContent>
              <ul className="text-xs text-neutral-500 space-y-2">
                <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-neutral-300"></div> Contracts & Agreements</li>
                <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-neutral-300"></div> Invoices & Receipts</li>
                <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-neutral-300"></div> Legal & Policy Docs</li>
              </ul>
           </CardContent>
        </Card>
        
        <Card className="bg-neutral-50 border-neutral-200 shadow-none">
           <CardHeader>
              <CardTitle className="text-sm font-bold text-black flex items-center gap-2">
                 <LayoutGrid className="h-4 w-4" /> Key Features
              </CardTitle>
           </CardHeader>
           <CardContent>
              <ul className="text-xs text-neutral-500 space-y-2">
                <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-neutral-300"></div> Secure Encrypted Storage</li>
                <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-neutral-300"></div> Version Control & History</li>
                <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-neutral-300"></div> Granular Access Permissions</li>
              </ul>
           </CardContent>
        </Card>

        <Card className="bg-neutral-50 border-neutral-200 shadow-none">
           <CardHeader>
              <CardTitle className="text-sm font-bold text-black flex items-center gap-2">
                 <Filter className="h-4 w-4" /> Formats
              </CardTitle>
           </CardHeader>
           <CardContent>
              <ul className="text-xs text-neutral-500 space-y-2">
                <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-neutral-300"></div> PDF, DOCX, XLSX, PPTX</li>
                <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-neutral-300"></div> JPG, PNG, GIF Images</li>
                <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-neutral-300"></div> ZIP, RAR Archives</li>
              </ul>
           </CardContent>
        </Card>
      </div>


      {/* Upload Document Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="border-neutral-200">
          <DialogHeader>
            <DialogTitle className="text-black">Upload Document</DialogTitle>
            <DialogDescription className="text-neutral-500">Upload a new document to the system.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="border-2 border-dashed border-neutral-200 bg-neutral-50 rounded-lg p-10 text-center hover:bg-neutral-100 transition-colors cursor-pointer">
              <Upload className="h-10 w-10 mx-auto text-neutral-400 mb-4" />
              <p className="text-black font-medium text-sm mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-neutral-500">PDF, DOCX, XLSX, JPG (Max 10MB)</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-xs font-semibold text-black uppercase tracking-wider mb-1.5 block">Document Name</Label>
                <Input placeholder="Enter document name" className="bg-white border-neutral-200 focus:ring-black" />
              </div>
               <div>
                <Label className="text-xs font-semibold text-black uppercase tracking-wider mb-1.5 block">Category</Label>
                <Select>
                  <SelectTrigger className="bg-white border-neutral-200">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="contract">Contract</SelectItem>
                     <SelectItem value="invoice">Invoice</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)} className="border-neutral-200 text-black">
              Cancel
            </Button>
            <Button className="bg-black text-white hover:bg-neutral-800">Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Document Modal */}
      <Dialog open={isNewDocumentOpen} onOpenChange={setIsNewDocumentOpen}>
        <DialogContent className="max-w-4xl border-neutral-200">
          <DialogHeader>
            <DialogTitle className="text-black">Create New Document</DialogTitle>
            <DialogDescription className="text-neutral-500">Enter details to generate a new system document record.</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
            <div className="space-y-4">
               <div>
                <Label htmlFor="doc-name" className="text-xs font-semibold text-black uppercase tracking-wider mb-1.5 block">Name</Label>
                <Input id="doc-name" placeholder="E.g. Sales Agreement 2024" className="bg-white border-neutral-200 focus:ring-black" />
              </div>
               <div>
                <Label htmlFor="doc-id" className="text-xs font-semibold text-black uppercase tracking-wider mb-1.5 block">Document ID</Label>
                <Input id="doc-id" placeholder="Auto-generated if empty" className="bg-neutral-50 border-neutral-200 focus:ring-black" />
              </div>
               <div>
                <Label htmlFor="doc-ext" className="text-xs font-semibold text-black uppercase tracking-wider mb-1.5 block">Extension</Label>
                 <Select>
                  <SelectTrigger id="doc-ext" className="bg-white border-neutral-200">
                    <SelectValue placeholder="Select Extension" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="docx">DOCX</SelectItem>
                    <SelectItem value="xlsx">XLSX</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-6">
               <div className="border-2 border-dashed border-neutral-200 bg-neutral-50 rounded-lg h-full flex flex-col items-center justify-center p-6 hover:bg-neutral-100 transition-colors">
                  <Upload className="h-8 w-8 text-neutral-400 mb-2" />
                  <p className="text-sm font-medium text-black">Upload Attachment</p>
                  <p className="text-xs text-neutral-500">Optional</p>
               </div>
               
               <div className="space-y-3">
                  <Label className="text-xs font-semibold text-black uppercase tracking-wider mb-1.5 block">Options</Label>
                  <div className="grid grid-cols-2 gap-2">
                     <label className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer">
                        <input type="checkbox" className="rounded border-neutral-300 text-black focus:ring-black" />
                        Is Invoice
                     </label>
                     <label className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer">
                        <input type="checkbox" className="rounded border-neutral-300 text-black focus:ring-black" />
                        Email Attachment
                     </label>
                  </div>
               </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewDocumentOpen(false)} className="border-neutral-200 text-black">
              Cancel
            </Button>
            <Button className="bg-black text-white hover:bg-neutral-800">Create Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}