"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { EmailFormValues, emailFormSchema } from "./schemas"
import { User, AdminUser, EmailTemplate } from "./types"
import { Calendar, Paperclip, X, Send, UserPlus, Users, Shield, Clock, FileText, Info, RefreshCw } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { getAdminUsers, getEmailTemplates, getAllUsers, createEmail } from "@/lib/actions/api.actions"
import { toast } from "react-hot-toast"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CreateEmailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface UserDataProps extends CreateEmailDialogProps {
  userDetails: UserData
}

export function CreateEmailDialog({ userDetails, open, onOpenChange }: UserDataProps) {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [filteredRecipients, setFilteredRecipients] = useState<User[]>([])
  const [isScheduled, setIsScheduled] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string>("12:00")
  const [sendType, setSendType] = useState<"single" | "bulk">("single")
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      subject: "",
      body: "",
      send_type: "single",
      recipients: [],
      cc: [],
      bcc: [],
      attachments: [],
      from: userDetails?.email || "",
    },
  })

  const filterUsersByRole = (role: string) => {
    let filtered = allUsers
    switch (role) {
      case "active":
        filtered = allUsers.filter((user) => user.IsActive === 1)
        break
      case "inactive":
        filtered = allUsers.filter((user) => user.IsActive === 0)
        break
      case "all":
        filtered = allUsers
        break
      default:
        filtered = allUsers.filter((user) =>
          user.Roles.some((r) => r.RoleName.toLowerCase() === role.toLowerCase()),
        )
    }
    setFilteredRecipients(filtered)
  }

  const handleRecipientSelect = (email: string, checked: boolean) => {
    const currentRecipients = form.getValues("recipients")
    if (checked && email) {
      if (!currentRecipients.includes(email)) {
        form.setValue("recipients", [...currentRecipients, email])
      }
    } else {
      form.setValue("recipients", currentRecipients.filter((r) => r !== email))
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!open) return
      setIsLoading(true)

      try {
        const [templatesRes, adminsRes, usersRes] = await Promise.all([
          getEmailTemplates(),
          getAdminUsers(),
          getAllUsers(),
        ])

        if (templatesRes.success) setTemplates(templatesRes.data)
        if (adminsRes.success) setAdminUsers(adminsRes.data)
        if (usersRes.success) {
          const mappedUsers = usersRes.data.map(user => ({
            ...user,
            PhoneNumber: user.Email || null
          }));
          setAllUsers(mappedUsers);
          setFilteredRecipients(mappedUsers.filter((user) => user.IsActive === 1))
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load required data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [open])

  const onSubmit = async (data: EmailFormValues) => {
    try {
      setIsLoading(true)

      if (isScheduled && selectedDate) {
        const [hours, minutes] = selectedTime.split(":").map(Number)
        const scheduleDate = new Date(selectedDate)
        scheduleDate.setHours(hours, minutes)
        data.schedule_date = scheduleDate
      }

      const emailData = {
        ...data,
        created_by: userDetails.email,
        schedule_date: isScheduled && selectedDate ? selectedDate.toISOString() : undefined,
        recipients: data.recipients,
        subject: data.subject,
        body: data.body
      }

      const response = await createEmail(emailData)

      if (response.success) {
        toast.success(isScheduled ? "Email scheduled successfully" : "Email sent successfully")
        onOpenChange(false)
        form.reset()
      } else {
        toast.error(response.message || "Failed to process email")
      }
    } catch (error) {
      console.error("Error processing email:", error)
      toast.error("Failed to process email")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 gap-0 border-neutral-200 overflow-hidden shadow-2xl bg-white">
        <DialogHeader className="px-8 pt-8 pb-4 bg-white border-b border-neutral-100 flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-2xl font-bold text-black">Compose Communication</DialogTitle>
            <p className="text-sm text-neutral-500 mt-1">Create and dispatch system-wide or individual emails.</p>
          </div>
          <div className="hidden sm:flex gap-2">
             <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="bg-white border-neutral-200 text-black hover:bg-neutral-50 rounded-lg">
                Save Draft
             </Button>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col max-h-[80vh]">
            <ScrollArea className="flex-1">
              <div className="p-8 space-y-6">
                
                {/* Sender & Type Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="from"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">From Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="pl-10 h-11 bg-neutral-50 border-neutral-200 focus:ring-black focus:border-black text-black font-medium">
                                <SelectValue placeholder="Select sender" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-neutral-200">
                                {adminUsers.map((admin) => (
                                  <SelectItem key={admin.Id} value={admin.Email} className="text-black py-3">
                                    {admin.FirstName} {admin.OtherNames} ({admin.Email})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <FormLabel className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Communication Type</FormLabel>
                    <Tabs defaultValue="single" onValueChange={(value) => setSendType(value as "single" | "bulk")} className="w-full">
                      <TabsList className="grid w-full grid-cols-2 bg-neutral-100 p-1 rounded-xl h-11">
                        <TabsTrigger
                          value="single"
                          className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-black text-neutral-500 font-bold text-xs uppercase tracking-tighter transition-all"
                        >
                          <UserPlus className="h-3 w-3 mr-2" /> Single
                        </TabsTrigger>
                        <TabsTrigger
                          value="bulk"
                          className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-black text-neutral-500 font-bold text-xs uppercase tracking-tighter transition-all"
                        >
                          <Users className="h-3 w-3 mr-2" /> Bulk
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>

                <Separator className="bg-neutral-100" />

                {/* Recipients Area */}
                <div className="space-y-6">
                  {sendType === "bulk" && (
                    <FormField
                      control={form.control}
                      name="send_to_role"
                      render={({ field }) => (
                        <FormItem className="space-y-2 animate-in fade-in slide-in-from-top-2">
                          <FormLabel className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Filter Audience by Role</FormLabel>
                          <Select onValueChange={filterUsersByRole} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11 bg-white border-neutral-200 focus:ring-black text-black">
                                <SelectValue placeholder="Select target role..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white">
                              {["all", "active", "inactive", "broker", "dealer", "individual"].map((role) => (
                                <SelectItem key={role} value={role} className="text-black py-3">
                                  {role.charAt(0).toUpperCase() + role.slice(1)} Group
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="recipients"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Recipient(s)</FormLabel>
                        <FormControl>
                          <div className={cn(
                            "rounded-xl border border-neutral-200 bg-white transition-all focus-within:border-black focus-within:ring-1 focus-within:ring-black",
                            sendType === "bulk" ? "p-0" : "p-3"
                          )}>
                            {sendType === "bulk" ? (
                              <div className="flex flex-col">
                                <div className="flex items-center px-4 py-3 border-b border-neutral-100 bg-neutral-50/50">
                                  <Checkbox
                                    id="select-all"
                                    className="rounded-md border-neutral-300 text-black focus:ring-black"
                                    checked={filteredRecipients.length > 0 && filteredRecipients.every((r) => field.value.includes(r.Email))}
                                    onCheckedChange={(checked) => {
                                      if (checked) form.setValue("recipients", filteredRecipients.map((r) => r.Email))
                                      else form.setValue("recipients", [])
                                    }}
                                  />
                                  <label htmlFor="select-all" className="text-xs font-bold text-black uppercase ml-3 tracking-widest cursor-pointer">
                                    Select All Participants ({filteredRecipients.length})
                                  </label>
                                </div>
                                <ScrollArea className="h-48">
                                  <div className="p-2 grid grid-cols-1 sm:grid-cols-2 gap-1">
                                    {filteredRecipients.map((recipient) => (
                                      <div key={recipient.Id} className="flex items-center gap-3 p-2 hover:bg-neutral-50 rounded-lg transition-colors group cursor-pointer" onClick={() => handleRecipientSelect(recipient.Email, !field.value.includes(recipient.Email))}>
                                        <Checkbox
                                          id={`recipient-${recipient.Id}`}
                                          className="rounded-md border-neutral-300 text-black focus:ring-black"
                                          checked={field.value.includes(recipient.Email)}
                                          onCheckedChange={(checked) => handleRecipientSelect(recipient.Email, !!checked)}
                                        />
                                        <div className="min-w-0">
                                          <p className="text-xs font-bold text-black truncate">{recipient.FirstName}</p>
                                          <p className="text-[10px] text-neutral-500 truncate">{recipient.Email}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </ScrollArea>
                              </div>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                {field.value.map((email, index) => (
                                  <Badge key={index} variant="secondary" className="bg-neutral-900 text-white border-none py-1 pl-3 pr-1 rounded-full flex items-center gap-2 group hover:bg-black transition-colors">
                                    <span className="text-[10px] font-bold">{email}</span>
                                    <button
                                      type="button"
                                      className="rounded-full hover:bg-white/20 p-0.5 transition-colors"
                                      onClick={() => form.setValue("recipients", field.value.filter((_, i) => i !== index))}
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </Badge>
                                ))}
                                <Input
                                  type="text"
                                  className="flex-1 min-w-[150px] border-none shadow-none focus-visible:ring-0 p-0 h-7 text-sm text-black placeholder:text-neutral-400"
                                  placeholder={field.value.length === 0 ? "Enter recipient email and press Enter..." : "Add more..."}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" && e.currentTarget.value) {
                                      e.preventDefault()
                                      const email = e.currentTarget.value.trim()
                                      if (email && !field.value.includes(email)) {
                                        form.setValue("recipients", [...field.value, email])
                                        e.currentTarget.value = ""
                                      }
                                    }
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Content Area */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Subject Line</FormLabel>
                        <FormControl>
                          <Input placeholder="Message subject..." className="h-11 bg-white border-neutral-200 focus:ring-black focus:border-black text-black font-semibold" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="body"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Message Body</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Type your communication here..." 
                            className="min-h-[250px] bg-white border-neutral-200 focus:ring-black focus:border-black text-black leading-relaxed p-4 rounded-xl resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Attachments & Scheduling */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
                  <FormField
                    control={form.control}
                    name="attachments"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-3">
                          <Button type="button" variant="outline" size="sm" className="gap-2 bg-white border-neutral-200 text-black hover:bg-neutral-50 h-10 px-4 rounded-xl relative overflow-hidden">
                            <Paperclip className="h-4 w-4" />
                            <span className="font-bold text-xs uppercase tracking-widest">Attach Assets</span>
                            <Input
                              type="file"
                              multiple
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              onChange={(e) => {
                                form.setValue("attachments", Array.from(e.target.files || []))
                              }}
                            />
                          </Button>
                          {field.value && field.value.length > 0 && (
                            <Badge variant="secondary" className="bg-neutral-100 text-neutral-600 border-none font-bold text-[10px] h-6 px-2">
                              {field.value.length} Attached
                            </Badge>
                          )}
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsScheduled(!isScheduled)}
                      className={cn(
                        "gap-2 h-10 px-4 rounded-xl transition-all font-bold text-xs uppercase tracking-widest",
                        isScheduled ? "bg-neutral-900 text-white hover:bg-black" : "text-neutral-500 hover:bg-neutral-100"
                      )}
                    >
                      <Clock className="h-4 w-4" />
                      {isScheduled ? "Cancel Schedule" : "Schedule"}
                    </Button>

                    {isScheduled && (
                      <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="bg-white border-neutral-200 text-black h-10 px-4 rounded-xl font-bold text-xs">
                              {selectedDate ? format(selectedDate, "MMM d, yyyy") : "Date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-white border-neutral-200 shadow-xl" align="end">
                            <CalendarComponent
                              mode="single"
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>

                        <Select value={selectedTime} onValueChange={setSelectedTime}>
                          <SelectTrigger className="w-[100px] h-10 bg-white border-neutral-200 rounded-xl font-bold text-xs">
                            <SelectValue placeholder="Time" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-neutral-200">
                            {Array.from({ length: 24 }).map((_, hour) => (
                              <SelectItem key={hour} value={`${hour.toString().padStart(2, "0")}:00`} className="text-black py-2">
                                {hour.toString().padStart(2, "0")}:00
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>

            <DialogFooter className="px-8 py-6 bg-neutral-50 border-t border-neutral-100 sm:justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-neutral-400">
                 <Info className="h-4 w-4" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">Ready to transmit communication</span>
              </div>
              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  className="bg-white border-neutral-200 text-black hover:bg-neutral-50 rounded-xl h-11 px-8 font-bold text-xs uppercase tracking-widest"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isLoading}
                  className="bg-black text-white hover:bg-neutral-800 rounded-xl h-11 px-10 font-bold text-xs uppercase tracking-widest shadow-lg shadow-black/10 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      {isScheduled ? "Schedule Transmission" : "Dispatch Email"}
                    </>
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}