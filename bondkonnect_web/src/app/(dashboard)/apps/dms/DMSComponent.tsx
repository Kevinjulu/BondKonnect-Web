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
} from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>
      case "Draft":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Draft</Badge>
      case "Sent":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Sent</Badge>
      case "Expired":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Expired</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold"> Files</h2>
        <div className="flex space-x-2">
          <Button variant="outline">Export</Button>
          <Button onClick={() => setIsNewDocumentOpen(true)}>New Document</Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="all" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            All Documents
          </TabsTrigger>
          <TabsTrigger value="draft">
            <FileText className="h-4 w-4 mr-2" />
            Draft
          </TabsTrigger>
          <TabsTrigger value="approval">
            <FileText className="h-4 w-4 mr-2" />
            For Approval
          </TabsTrigger>
          <TabsTrigger value="sent">
            <FileText className="h-4 w-4 mr-2" />
            Sent
          </TabsTrigger>
          <TabsTrigger value="viewed">
            <FileText className="h-4 w-4 mr-2" />
            Viewed
          </TabsTrigger>
          <TabsTrigger value="edits">
            <FileText className="h-4 w-4 mr-2" />
            Suggest Edits
          </TabsTrigger>
          <TabsTrigger value="completed">
            <FileText className="h-4 w-4 mr-2" />
            Sign Completed
          </TabsTrigger>
          <TabsTrigger value="expired">
            <FileText className="h-4 w-4 mr-2" />
            Expired/Declined
          </TabsTrigger>
        </TabsList>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <span>Sort By: Last Updated Des</span>
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-2"
              >
                <path
                  d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L7.09346 7.90657C7.31801 8.13112 7.68208 8.13112 7.90664 7.90657L11.7816 4.03157Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Button>
            <Button variant="outline" size="sm">
              <span>Name</span>
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-2"
              >
                <path
                  d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.26618 11.9026 7.38064 11.95 7.49999 11.95C7.61933 11.95 7.73379 11.9026 7.81819 11.8182L10.0682 9.56819Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Button>
            <Button variant="outline" size="sm">
              <span>Date</span>
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-2"
              >
                <path
                  d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.26618 11.9026 7.38064 11.95 7.49999 11.95C7.61933 11.95 7.73379 11.9026 7.81819 11.8182L10.0682 9.56819Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-10 w-[250px]" />
            </div>
            <Button variant="outline" size="sm">
              <FolderPlus className="h-4 w-4 mr-2" />
              Mange Folders
            </Button>
            <div className="flex border rounded-md">
              <Button variant="ghost" size="sm" className="px-2">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                >
                  <path
                    d="M2 3C2 2.44772 2.44772 2 3 2H12C12.5523 2 13 2.44772 13 3V12C13 12.5523 12.5523 13 12 13H3C2.44772 13 2 12.5523 2 12V3ZM3 3H12V12H3V3Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </Button>
              <Button variant="default" size="sm" className="px-2">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                >
                  <path
                    d="M2 3C2 2.44772 2.44772 2 3 2H12C12.5523 2 13 2.44772 13 3V12C13 12.5523 12.5523 13 12 13H3C2.44772 13 2 12.5523 2 12V3ZM3 3H12V12H3V3Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                  <path
                    d="M3 5.5C3 5.22386 3.22386 5 3.5 5H11.5C11.7761 5 12 5.22386 12 5.5C12 5.77614 11.7761 6 11.5 6H3.5C3.22386 6 3 5.77614 3 5.5Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                  <path
                    d="M3 8.5C3 8.22386 3.22386 8 3.5 8H11.5C11.7761 8 12 8.22386 12 8.5C12 8.77614 11.7761 9 11.5 9H3.5C3.22386 9 3 8.77614 3 8.5Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                  <path
                    d="M3 11.5C3 11.2239 3.22386 11 3.5 11H11.5C11.7761 11 12 11.2239 12 11.5C12 11.7761 11.7761 12 11.5 12H3.5C3.22386 12 3 11.7761 3 11.5Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </Button>
            </div>
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300" 
                      aria-label="Select all documents"
                      title="Select all documents"
                    />
                  </TableHead>
                  <TableHead className="font-medium">Document Name</TableHead>
                  <TableHead className="font-medium">Document ID</TableHead>
                  <TableHead className="font-medium">Created On</TableHead>
                  <TableHead className="font-medium">Extension</TableHead>
                  <TableHead className="font-medium">Type</TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="w-[100px] text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300"
                        aria-label={`Select ${doc.name}`}
                        title={`Select ${doc.name}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                        <div>
                          <div className="font-medium">{doc.name}</div>
                          <div className="text-xs text-muted-foreground">Created: {doc.created}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>DOC-{doc.id.toString().padStart(4, "0")}</TableCell>
                    <TableCell>{doc.lastActivity}</TableCell>
                    <TableCell>{doc.name.split(".").pop() || "PDF"}</TableCell>
                    <TableCell>{doc.status === "Draft" ? "Internal" : "External"}</TableCell>
                    <TableCell>{getStatusBadge(doc.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
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

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              <select 
                className="border rounded p-1 mr-2"
                aria-label="Documents per page"
                title="Select number of documents per page"
              >
                <option>10 Documents</option>
                <option>25 Documents</option>
                <option>50 Documents</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button variant="outline" size="sm" className="px-3 py-1">
                1
              </Button>
              <Button variant="outline" size="sm" className="px-3 py-1">
                2
              </Button>
              <Button variant="outline" size="sm" className="px-3 py-1">
                3
              </Button>
              <span>...</span>
              <Button variant="outline" size="sm" className="px-3 py-1">
                8
              </Button>
              <Button variant="outline" size="sm" className="px-3 py-1">
                9
              </Button>
              <Button variant="outline" size="sm" className="px-3 py-1">
                10
              </Button>
              <Button variant="outline" size="sm">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <Button onClick={() => setIsUploadDialogOpen(true)} className="mb-6">
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>

        <h2 className="text-xl font-bold mb-4">Document Management System</h2>
        <p className="text-muted-foreground mb-6">
          The Document Management System (DMS) allows you to store, organize, and manage all your important documents in
          one place. You can upload new documents, categorize them, and control access permissions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium mb-2">Document Types</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Contracts and Agreements</li>
              <li>Invoices and Receipts</li>
              <li>Legal Documents</li>
              <li>Reports and Presentations</li>
              <li>Policies and Procedures</li>
              <li>Marketing Materials</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-2">Features</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Secure document storage</li>
              <li>Version control</li>
              <li>Access permissions</li>
              <li>Document sharing</li>
              <li>Full-text search</li>
              <li>Document previews</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-2">Supported Formats</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>PDF (.pdf)</li>
              <li>Microsoft Office (.docx, .xlsx, .pptx)</li>
              <li>Images (.jpg, .png, .gif)</li>
              <li>Text files (.txt)</li>
              <li>Compressed files (.zip)</li>
              <li>And many more...</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Upload Document Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>Upload a new document to the Document Management System</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="border-2 border-dashed rounded-lg p-10 text-center">
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">Drag and drop your file here, or click to browse</p>
              <p className="text-xs text-muted-foreground mb-4">Supports PDF, DOCX, XLSX, JPG, PNG (Max 10MB)</p>
              <Button>Browse Files</Button>
            </div>

            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium">Document Name</label>
                <Input placeholder="Enter document name" />
              </div>

              <div>
                <label className="text-sm font-medium" id="document-type-label" htmlFor="document-type">Document Type</label>
                <select 
                  className="w-full border rounded-md p-2" 
                  id="document-type" 
                  aria-labelledby="document-type-label"
                  name="documentType"
                >
                  <option>Contract</option>
                  <option>Invoice</option>
                  <option>Report</option>
                  <option>Presentation</option>
                  <option>Policy</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Tags</label>
                <Input placeholder="Add tags separated by commas" />
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  className="w-full border rounded-md p-2 min-h-[100px]"
                  placeholder="Enter document description"
                ></textarea>
              </div>

              <div>
                <label className="text-sm font-medium" id="access-permissions-label" htmlFor="access-permissions">Access Permissions</label>
                <select 
                  className="w-full border rounded-md p-2"
                  id="access-permissions"
                  aria-labelledby="access-permissions-label"
                  name="accessPermissions"
                >
                  <option>Private (Only me)</option>
                  <option>Team (Selected members)</option>
                  <option>Department</option>
                  <option>Organization (Everyone)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button>Upload Document</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Document Modal */}
      <Dialog open={isNewDocumentOpen} onOpenChange={setIsNewDocumentOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>New Document</DialogTitle>
            <DialogDescription>Create a new document in the Document Management System</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="documentName">Document Name</Label>
                <Input id="documentName" placeholder="Enter document name" />
              </div>

              <div>
                <Label htmlFor="documentId">Document ID</Label>
                <Input id="documentId" placeholder="Enter document ID" />
              </div>

              <div>
                <Label htmlFor="pageId">Page ID</Label>
                <Input id="pageId" placeholder="Enter page ID" />
              </div>

              <div>
                <Label htmlFor="extension">File Extension</Label>
                <Select>
                  <SelectTrigger id="extension">
                    <SelectValue placeholder="Select file extension" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="docx">DOCX</SelectItem>
                    <SelectItem value="xlsx">XLSX</SelectItem>
                    <SelectItem value="pptx">PPTX</SelectItem>
                    <SelectItem value="jpg">JPG</SelectItem>
                    <SelectItem value="png">PNG</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="locationUrl">Location URL</Label>
                <Input id="locationUrl" placeholder="Enter document location URL" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-10 text-center h-40">
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">Drag and drop your file here, or click to browse</p>
                <p className="text-xs text-muted-foreground mb-4">Supports PDF, DOCX, XLSX, JPG, PNG (Max 10MB)</p>
                <Button size="sm">Browse Files</Button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="isMessageAttachment" 
                    className="rounded border-gray-300"
                    aria-label="Is Message Attachment" 
                  />
                  <Label htmlFor="isMessageAttachment">Is Message Attachment</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="isEmailAttachment" 
                    className="rounded border-gray-300"
                    aria-label="Is Email Attachment" 
                  />
                  <Label htmlFor="isEmailAttachment">Is Email Attachment</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="isInvoice" 
                    className="rounded border-gray-300"
                    aria-label="Is Invoice" 
                  />
                  <Label htmlFor="isInvoice">Is Invoice</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="isForAdmin" 
                    className="rounded border-gray-300"
                    aria-label="Is For Admin" 
                  />
                  <Label htmlFor="isForAdmin">Is For Admin</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="isServiceRequestAttachment" 
                    className="rounded border-gray-300"
                    aria-label="Is Service Request Attachment" 
                  />
                  <Label htmlFor="isServiceRequestAttachment">Is Service Request Attachment</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="emailId">Email ID</Label>
                <Input id="emailId" type="number" placeholder="Enter email ID" />
              </div>

              <div>
                <Label htmlFor="serviceRequestId">Service Request ID</Label>
                <Input id="serviceRequestId" type="number" placeholder="Enter service request ID" />
              </div>

              <div>
                <Label htmlFor="messageId">Message ID</Label>
                <Input id="messageId" type="number" placeholder="Enter message ID" />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewDocumentOpen(false)}>
              Cancel
            </Button>
            <Button>Create Document</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
