"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Archive, Mail, Search, Trash } from "lucide-react"
import EmailView from "./EmailsView"

interface Email {
  id: string
  subject: string
  sender: {
    name: string
    email: string
    avatar?: string
  }
  replyTo?: string
  recipients: string[]
  cc?: string[]
  bcc?: string[]
  created_by: string
  date: string
  content: string
  is_sent: boolean
  is_draft: boolean
  is_bulk_email: boolean
  role_group_sending_to?: string
  attachments?: Array<{
    name: string
    size: string
    type: string
  }>
}

interface ApiEmailData {
  Id: number;
  Subject: string;
  SenderName?: string;
  SenderEmail: string;
  AllRecipientsEmails?: string;
  CC?: string;
  BCC?: string;
  created_by: string;
  created_on: string;
  Body: string;
  IsSent: number;
  IsDraft: number;
  IsBulkEmail: number;
  RoleGroupSendingTo?: string;
  attachments?: Array<{
    DocumentName: string;
    Extension: string;
  }>;
}

export default function EmailList({ userDetails }: { userDetails: UserData }) {
  const [emails, setEmails] = useState<Email[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        // Fetch emails from the API
        const response = await fetch(`/api/emails?user=${userDetails.email}`)
        const data = await response.json()

        if (data.success) {
          // Transform the data to match our Email interface
          const transformedEmails = data.data.map((email: ApiEmailData) => ({
            id: email.Id.toString(),
            subject: email.Subject,
            sender: {
              name: email.SenderName || "Unknown",
              email: email.SenderEmail,
            },
            recipients: JSON.parse(email.AllRecipientsEmails || "[]"),
            cc: JSON.parse(email.CC || "[]"),
            bcc: JSON.parse(email.BCC || "[]"),
            created_by: email.created_by,
            date: email.created_on,
            content: email.Body,
            is_sent: email.IsSent === 1,
            is_draft: email.IsDraft === 1,
            is_bulk_email: email.IsBulkEmail === 1,
            role_group_sending_to: email.RoleGroupSendingTo,
            attachments: email.attachments?.map((att) => ({
              name: att.DocumentName,
              size: "Unknown",
              type: att.Extension,
            })),
          }))

          setEmails(transformedEmails)
        }
      } catch (error) {
        console.error("Error fetching emails:", error)
        // Handle error (show toast, etc.)
      } finally {
        setLoading(false)
      }
    }

    fetchEmails()
  }, [userDetails.email])

  const filteredEmails = emails.filter((email) => {
    // Filter by search query
    if (
      searchQuery &&
      !email.subject.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !email.sender.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Filter by tab
    if (activeTab === "unread") {
      return !email.is_sent
    }

    return true
  })

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>
  }

  return (
    <div className="flex h-[calc(100vh-200px)] overflow-hidden rounded-lg border">
      {/* Email list sidebar */}
      <div className={`w-full ${selectedEmail ? "hidden md:block md:w-1/3 lg:w-2/5" : "w-full"} border-r`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold mb-4">Inbox</h2>
            <Tabs defaultValue="all" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all">All mail</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {filteredEmails.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">No emails found</div>
            ) : (
              <div className="divide-y">
                {filteredEmails.map((email) => (
                  <div
                    key={email.id}
                    className="p-4 hover:bg-muted/50 cursor-pointer"
                    onClick={() => setSelectedEmail(email)}
                  >
                    <div className="flex justify-between mb-1">
                      <div className="font-medium">{email.sender.name}</div>
                      <div className="text-xs text-muted-foreground">{format(new Date(email.date), "MMM d, yyyy")}</div>
                    </div>
                    <div className="font-medium mb-1">{email.subject}</div>
                    <div className="text-sm text-muted-foreground line-clamp-2">
                      {email.content.substring(0, 100)}...
                    </div>
                    <div className="flex mt-2 gap-2">
                      {email.is_bulk_email && (
                        <Badge variant="secondary" className="text-xs">
                          {email.role_group_sending_to || "Bulk"}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {email.is_draft ? "Draft" : email.is_sent ? "Sent" : "Scheduled"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-2 border-t">
            <div className="flex justify-between">
              <div className="flex space-x-1">
                <Button variant="ghost" size="icon">
                  <Archive className="h-4 w-4" />
                  <span className="sr-only">Archive</span>
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">{filteredEmails.length} email(s)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Email view */}
      {selectedEmail ? (
        <div className={`${selectedEmail ? "w-full md:w-2/3 lg:w-3/5" : "hidden"}`}>
          <EmailView userDetails={userDetails} email={selectedEmail} onClose={() => setSelectedEmail(null)} />
        </div>
      ) : (
        <div className="hidden md:flex md:w-2/3 lg:w-3/5 items-center justify-center">
          <div className="text-center">
            <Mail className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Select an email to view</h3>
            <p className="mt-2 text-sm text-muted-foreground">Choose an email from the list to view its contents</p>
          </div>
        </div>
      )}
    </div>
  )
}
  