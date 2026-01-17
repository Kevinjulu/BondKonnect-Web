"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { EmailFormValues, emailFormSchema } from "./schemas"
import { User, AdminUser, EmailTemplate } from "./types"
import { Calendar, Paperclip, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { getAdminUsers, getEmailTemplates, getAllUsers, createEmail } from "@/lib/actions/api.actions"
import { toast } from "react-hot-toast"

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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>New message</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="from"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium w-16">From:</div>
                    <div className="flex-1">
                      {adminUsers.length === 1 ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <div className="bg-primary text-primary-foreground h-full w-full flex items-center justify-center rounded-full text-xs">
                              {adminUsers[0].FirstName?.charAt(0).toUpperCase() || "A"}
                            </div>
                          </Avatar>
                          <span className="text-sm">{adminUsers[0].Email}</span>
                        </div>
                      ) : (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select sender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {adminUsers.map((admin) => (
                              <SelectItem key={admin.Id} value={admin.Email}>
                                {admin.FirstName} {admin.OtherNames} ({admin.Email})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                </FormItem>
              )}
            />

            <div className="border-b">
              <Tabs defaultValue="single" onValueChange={(value) => setSendType(value as "single" | "bulk")}>
                <TabsList className="w-full justify-start border-b-0 mb-0">
                  <TabsTrigger
                    value="single"
                    className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                  >
                    Single
                  </TabsTrigger>
                  <TabsTrigger
                    value="bulk"
                    className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                  >
                    Bulk
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <FormField
              control={form.control}
              name="template_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Template</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {sendType === "bulk" && (
              <FormField
                control={form.control}
                name="send_to_role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Send To Role</FormLabel>
                    <Select onValueChange={filterUsersByRole} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["all", "active", "inactive", "broker", "dealer", "individual"].map((role) => (
                          <SelectItem key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
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
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className="w-16 text-sm font-medium">To:</FormLabel>
                    <div className="flex-1">
                      {sendType === "bulk" ? (
                        <div className="border rounded-md p-2 min-h-[100px] max-h-[200px] overflow-auto">
                          <div className="flex items-center mb-2 pb-2 border-b">
                            <Checkbox
                              id="select-all"
                              checked={
                                filteredRecipients.length > 0 &&
                                filteredRecipients.every((r) => field.value.includes(r.Email))
                              }
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  form.setValue(
                                    "recipients",
                                    filteredRecipients.map((r) => r.Email),
                                  )
                                } else {
                                  form.setValue("recipients", [])
                                }
                              }}
                            />
                            <label htmlFor="select-all" className="text-sm ml-2">
                              Select All
                            </label>
                          </div>
                          <div className="space-y-2">
                            {filteredRecipients.map((recipient) => (
                              <div key={recipient.Id} className="flex items-center gap-2">
                                <Checkbox
                                  id={`recipient-${recipient.Id}`}
                                  checked={field.value.includes(recipient.Email)}
                                  onCheckedChange={(checked) =>
                                    handleRecipientSelect(recipient.Email, !!checked)
                                  }
                                />
                                <label htmlFor={`recipient-${recipient.Id}`} className="text-sm">
                                  {recipient.FirstName} ({recipient.Email})
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1 border rounded-md p-2 min-h-[40px]">
                          {field.value.map((email, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              {email}
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0"
                                onClick={() => {
                                  form.setValue(
                                    "recipients",
                                    field.value.filter((_, i) => i !== index),
                                  )
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                          <Input
                            type="text"
                            className="flex-1 min-w-[100px] border-0 focus-visible:ring-0 p-0"
                            placeholder="Add recipient..."
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
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cc"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className="w-16 text-sm font-medium">CC:</FormLabel>
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-1 border rounded-md p-2 min-h-[40px]">
                        {field.value?.map((email, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {email}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0"
                              onClick={() => {
                                form.setValue("cc", field.value?.filter((_, i) => i !== index) || [])
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                        <Input
                          type="text"
                          className="flex-1 min-w-[100px] border-0 focus-visible:ring-0 p-0"
                          placeholder="Add CC..."
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && e.currentTarget.value) {
                              e.preventDefault()
                              const email = e.currentTarget.value.trim()
                              if (email && !field.value?.includes(email)) {
                                form.setValue("cc", [...(field.value || []), email])
                                e.currentTarget.value = ""
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bcc"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className="w-16 text-sm font-medium">BCC:</FormLabel>
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-1 border rounded-md p-2 min-h-[40px]">
                        {field.value?.map((email, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {email}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0"
                              onClick={() => {
                                form.setValue("bcc", field.value?.filter((_, i) => i !== index) || [])
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                        <Input
                          type="text"
                          className="flex-1 min-w-[100px] border-0 focus-visible:ring-0 p-0"
                          placeholder="Add BCC..."
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && e.currentTarget.value) {
                              e.preventDefault()
                              const email = e.currentTarget.value.trim()
                              if (email && !field.value?.includes(email)) {
                                form.setValue("bcc", [...(field.value || []), email])
                                e.currentTarget.value = ""
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Subject" {...field} />
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
                  <FormControl>
                    <Textarea placeholder="Write your message here..." className="min-h-[200px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="attachments"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="sm" className="gap-2">
                      <Paperclip className="h-4 w-4" />
                      Attach Files
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
                      <span className="text-sm text-muted-foreground">{field.value.length} file(s) selected</span>
                    )}
                  </div>
                </FormItem>
              )}
            />

            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant={isScheduled ? "default" : "outline"}
                size="sm"
                onClick={() => setIsScheduled(!isScheduled)}
                className="gap-2"
              >
                <Calendar className="h-4 w-4" />
                {isScheduled ? "Send Now" : "Send Later"}
              </Button>

              {isScheduled && (
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger className="w-[110px]">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }).map((_, hour) => (
                        <SelectItem key={hour} value={`${hour.toString().padStart(2, "0")}:00`}>
                          {hour.toString().padStart(2, "0")}:00
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{isScheduled ? "Schedule" : "Send"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
