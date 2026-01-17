    "use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Search, ChevronRight, Star, Settings, MessageSquare } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"

export function SMSComponent({ userDetails }: { userDetails: UserData }) {
  const router = useRouter()
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [messageText, setMessageText] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [sendComplete, setSendComplete] = useState(false)

  const favoriteGroups = [
    { id: "active", name: "All Active Members", count: 58 },
    { id: "prospects", name: "Prospects Members", count: 7 },
  ]

  const recentSMS = [
    {
      id: 1,
      message: "Congratulations! You've won a scratch card...",
      status: "Draft",
      group: "25 active members of Little Tigers Karate",
      starred: true,
      date: "Not Sent",
    },
    {
      id: 2,
      message: "It's gone from something that was just used...",
      status: "Sent",
      group: "4 cancelled members of Swimming Dolphin",
      starred: false,
      date: "Nov 30, 2021",
    },
    {
      id: 3,
      message: "Individuals to perform intense calculations in...",
      status: "Sent",
      group: "12 recipients",
      starred: false,
      date: "Nov 30, 2021",
    },
  ]

  const handleSendSMS = (group?: string) => {
    if (group) {
      setSelectedGroup(group)
    }
    setIsSendDialogOpen(true)
  }

  const handleSendMessage = () => {
    if (!messageText.trim()) return

    setIsSending(true)

    // Simulate sending message
    setTimeout(() => {
      setIsSending(false)
      setSendComplete(true)

      // Reset after showing success message
      setTimeout(() => {
        setSendComplete(false)
        setIsSendDialogOpen(false)
        setMessageText("")
      }, 1500)
    }, 2000)
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Communication</h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-10" />
        </div>
      </div>

      <Tabs defaultValue="sms" className="mb-8">
        <TabsList>
          <TabsTrigger value="email" onClick={() => router.push("/communication/email")}>
            Email
          </TabsTrigger>
          <TabsTrigger value="sms">SMS</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div className="relative w-40 h-40 mb-4">
              <Progress value={64} className="h-40 w-40 [&>div]:bg-pink-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold">256</div>
                </div>
              </div>
            </div>
            <h3 className="text-lg font-medium">256 Messages Left</h3>
            <p className="text-sm text-muted-foreground mb-4">Out of 400</p>
            <Button variant="outline" className="w-full">
              Buy More
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Favourite Groups</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favoriteGroups.map((group) => (
                <div key={group.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{group.name}</h4>
                      <p className="text-sm text-muted-foreground">{group.count} Members</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => handleSendSMS(group.id)}>
                    Send SMS
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Quick Send</h3>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
                <Badge className="bg-purple-100 text-purple-800 px-3 py-1">SMS</Badge>
                <div className="flex flex-wrap gap-2 items-center">
                  <Select defaultValue="all-active">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Select group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-active">all active</SelectItem>
                      <SelectItem value="all-inactive">all inactive</SelectItem>
                      <SelectItem value="all">all members</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select defaultValue="members">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="members">members</SelectItem>
                      <SelectItem value="staff">staff</SelectItem>
                      <SelectItem value="prospects">prospects</SelectItem>
                    </SelectContent>
                  </Select>

                  <span className="text-muted-foreground">of</span>

                  <Select defaultValue="all-programs">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select programs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-programs">all programs</SelectItem>
                      <SelectItem value="karate">Karate</SelectItem>
                      <SelectItem value="swimming">Swimming</SelectItem>
                      <SelectItem value="yoga">Yoga</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="ml-auto bg-purple-600 hover:bg-purple-700" onClick={() => handleSendSMS()}>
                  Send SMS
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              <div className="flex justify-end">
                <Button variant="ghost" className="text-purple-600">
                  Send to Specific People
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-1"
                  >
                    <path
                      d="M3.5 2C3.22386 2 3 2.22386 3 2.5C3 2.77614 3.22386 3 3.5 3H11.5C11.7761 3 12 2.77614 12 2.5C12 2.22386 11.7761 2 11.5 2H3.5ZM3 7.5C3 7.22386 3.22386 7 3.5 7H11.5C11.7761 7 12 7.22386 12 7.5C12 7.77614 11.7761 8 11.5 8H3.5C3.22386 8 3 7.77614 3 7.5ZM3 12.5C3 12.2239 3.22386 12 3.5 12H11.5C11.7761 12 12 12.2239 12 12.5C12 12.7761 11.7761 13 11.5 13H3.5C3.22386 13 3 12.7761 3 12.5Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Recent SMS&apos;s</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">SMS</TableHead>
                  <TableHead className="w-[30%]">Group</TableHead>
                  <TableHead className="w-[20%]">Date Sent</TableHead>
                  <TableHead className="w-[10%]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSMS.map((sms) => (
                  <TableRow key={sms.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center">
                        <Badge variant={sms.status === "Draft" ? "outline" : "secondary"} className="mr-2">
                          {sms.status}
                        </Badge>
                        <span className="truncate">{sms.message}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="truncate">{sms.group}</span>
                        {sms.starred && <Star className="h-4 w-4 ml-2 text-yellow-500 fill-yellow-500" />}
                      </div>
                    </TableCell>
                    <TableCell>{sms.date}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="float-right">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Send SMS Dialog */}
      <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send SMS</DialogTitle>
            <DialogDescription>
              {selectedGroup === "active"
                ? "Sending to All Active Members (58)"
                : selectedGroup === "prospects"
                  ? "Sending to Prospects Members (7)"
                  : "Compose your message to send"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                placeholder="Type your message here..."
                className="min-h-[120px]"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                disabled={isSending || sendComplete}
              />
              <p className="text-xs text-muted-foreground text-right">{messageText.length}/160 characters</p>
            </div>

            {isSending && (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
                <span className="ml-3">Sending message...</span>
              </div>
            )}

            {sendComplete && (
              <div className="flex items-center justify-center p-4 text-green-600">
                <svg
                  className="w-6 h-6 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Message sent successfully!</span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSendDialogOpen(false)} disabled={isSending}>
              Cancel
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!messageText.trim() || isSending || sendComplete}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
