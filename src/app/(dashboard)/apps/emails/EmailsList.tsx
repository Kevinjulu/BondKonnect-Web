"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Archive, Mail, Search, Trash, Inbox, InboxIcon, Send, RefreshCw } from "lucide-react"
import EmailView from "./EmailsView"
import { cn } from "@/lib/utils"

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

import { useEmails } from "@/hooks/use-email-data"

export default function EmailList({ userDetails }: { userDetails: UserData }) {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Use the new hook
  const { data: rawEmails = [], isLoading: loading, refetch: fetchEmails } = useEmails(userDetails?.email);

  const emails = React.useMemo(() => {
    return rawEmails.map((email: ApiEmailData) => ({
      id: email.Id.toString(),
      subject: email.Subject,
      sender: {
        name: email.SenderName || "Unknown",
        email: email.SenderEmail,
      },
      recipients: typeof email.AllRecipientsEmails === 'string' ? JSON.parse(email.AllRecipientsEmails || "[]") : [],
      cc: typeof email.CC === 'string' ? JSON.parse(email.CC || "[]") : [],
      bcc: typeof email.BCC === 'string' ? JSON.parse(email.BCC || "[]") : [],
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
    }));
  }, [rawEmails]);

  const filteredEmails = emails.filter((email) => {
    if (
      searchQuery &&
      !email.subject.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !email.sender.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    if (activeTab === "unread") {
      return !email.is_sent
    }

    return true
  })

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-neutral-400">
        <RefreshCw className="h-8 w-8 animate-spin mb-4" />
        <p className="text-sm font-medium text-black text-black">Syncing your inbox...</p>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-250px)] overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      {/* Email list sidebar */}
      <div className={cn(
        "flex flex-col h-full bg-white border-r border-neutral-100 transition-all",
        selectedEmail ? "hidden md:flex md:w-80 lg:w-96" : "w-full"
      )}>
        <div className="p-4 border-b border-neutral-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-black flex items-center gap-2">
              <InboxIcon className="h-5 w-5" />
              Inbox
            </h2>
            <Button variant="ghost" size="icon" onClick={fetchEmails} className="text-neutral-400 hover:text-black">
               <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 group-focus-within:text-black transition-colors" />
            <Input
              placeholder="Search in mail..."
              className="pl-9 bg-neutral-50 border-neutral-200 focus:bg-white focus:ring-black focus:border-black transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 overflow-hidden">
          <div className="px-4 bg-neutral-50/50 border-b border-neutral-100">
            <TabsList className="bg-transparent h-auto p-0 gap-6">
              <TabsTrigger
                value="all"
                className="relative px-0 py-3 rounded-none bg-transparent border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:border-black data-[state=active]:text-black text-neutral-500 font-medium text-sm hover:text-black transition-all data-[state=active]:shadow-none"
              >
                All Mail
              </TabsTrigger>
              <TabsTrigger
                value="unread"
                className="relative px-0 py-3 rounded-none bg-transparent border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:border-black data-[state=active]:text-black text-neutral-500 font-medium text-sm hover:text-black transition-all data-[state=active]:shadow-none"
              >
                Unread
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-auto bg-white">
            {filteredEmails.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-neutral-400">
                <div className="h-12 w-12 rounded-full bg-neutral-50 flex items-center justify-center mb-3">
                   <Mail className="h-6 w-6 text-neutral-300" />
                </div>
                <p className="text-sm font-medium text-black">No messages found</p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {filteredEmails.map((email) => {
                  const isSelected = selectedEmail?.id === email.id;
                  return (
                    <div
                      key={email.id}
                      className={cn(
                        "p-4 cursor-pointer transition-all relative border-l-2",
                        isSelected 
                          ? "bg-neutral-50 border-black" 
                          : "hover:bg-neutral-50/50 border-transparent"
                      )}
                      onClick={() => setSelectedEmail(email)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className={cn("text-sm font-bold truncate", isSelected ? "text-black" : "text-black")}>
                          {email.sender.name}
                        </div>
                        <div className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
                          {format(new Date(email.date), "MMM d")}
                        </div>
                      </div>
                      <div className={cn("text-sm font-semibold mb-1 truncate", isSelected ? "text-black" : "text-neutral-900")}>
                        {email.subject}
                      </div>
                      <div className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                        {email.content}
                      </div>
                      <div className="flex mt-3 gap-2">
                        {email.is_bulk_email && (
                          <Badge variant="secondary" className="bg-neutral-100 text-neutral-600 border-none px-1.5 py-0 text-[10px] font-bold uppercase tracking-tighter">
                            {email.role_group_sending_to || "Bulk"}
                          </Badge>
                        )}
                        <Badge variant="outline" className={cn(
                          "text-[10px] font-bold uppercase tracking-tighter px-1.5 py-0",
                          email.is_sent ? "border-emerald-200 text-emerald-700 bg-emerald-50" : "border-neutral-200 text-neutral-600 bg-neutral-50"
                        )}>
                          {email.is_draft ? "Draft" : email.is_sent ? "Sent" : "Scheduled"}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Tabs>

        <div className="p-3 border-t border-neutral-100 bg-neutral-50/30 flex justify-between items-center">
          <div className="flex gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8 bg-white border-neutral-200 text-black hover:bg-neutral-50">
              <Archive className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 bg-white border-neutral-200 text-black hover:bg-neutral-50">
              <Trash className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
            {filteredEmails.length} Items
          </div>
        </div>
      </div>

      {/* Email view */}
      <div className="flex-1 bg-white overflow-hidden">
        {selectedEmail ? (
          <EmailView userDetails={userDetails} email={selectedEmail} onClose={() => setSelectedEmail(null)} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-12 animate-in fade-in duration-700">
            <div className="bg-neutral-50 p-8 rounded-full mb-6">
              <Mail className="h-12 w-12 text-neutral-200" />
            </div>
            <h3 className="text-xl font-bold text-black mb-2 text-black">No Message Selected</h3>
            <p className="text-neutral-500 max-w-xs text-sm leading-relaxed">
              Select a conversation from your inbox to view its content and reply.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}