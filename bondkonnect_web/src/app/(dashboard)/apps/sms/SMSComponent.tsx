"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  MessageSquare, 
  Plus, 
  Send, 
  Users, 
  Wallet,
  ArrowUpRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import { sendSms } from "@/lib/actions/sms.actions";
import { toast } from "@/hooks/use-toast";

export function SMSComponent({ userDetails }: { userDetails: UserData }) {
  const router = useRouter();
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [recipientPhone, setRecipientPhone] = useState("");
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendComplete, setSendComplete] = useState(false);

  const favoriteGroups = [
    { id: "active", name: "All Active Members", count: 58 },
    { id: "prospects", name: "Prospects", count: 7 },
  ];

  const recentSMS = [
    {
      id: 1,
      message: "Congratulations! You've won a scratch card...",
      status: "Draft",
      recipient: "Active Members",
      date: "Not Sent",
    },
    {
      id: 2,
      message: "Your bond transaction was successful. Reference: BK-9283.",
      status: "Sent",
      recipient: "Portfolio Clients",
      date: "Jan 15, 2026",
    },
    {
      id: 3,
      message: "Market update: T-Bill yields are rising. Check the portal.",
      status: "Sent",
      recipient: "+254 712 345 678",
      date: "Jan 12, 2026",
    },
  ];

  const handleSendSMS = (group?: string) => {
    if (group) {
      setSelectedGroup(group);
    } else {
      setSelectedGroup(null);
    }
    setIsSendDialogOpen(true);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    if (!selectedGroup && !recipientPhone.trim()) {
      toast({
        title: "Missing recipient",
        description: "Please provide a phone number or select a group.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      const recipients = recipientPhone ? [recipientPhone] : [];
      const result = await sendSms({
        body: messageText,
        recipients: recipients,
        send_to_role: selectedGroup || undefined,
        created_by: userDetails.email,
      });

      if (result?.success) {
        setSendComplete(true);
        toast({
          title: "Message sent",
          description: "Your SMS has been successfully dispatched.",
        });
        setTimeout(() => {
          setSendComplete(false);
          setIsSendDialogOpen(false);
          setMessageText("");
          setRecipientPhone("");
        }, 1500);
      } else {
        toast({
          title: "Failed to send",
          description: result?.message || "There was an error sending your SMS.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      toast({
        title: "System Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 bg-white text-black p-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-100 pb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-black tracking-tight">SMS Portal</h1>
          <p className="text-neutral-500 text-lg font-medium">Manage and dispatch client communications.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="border-neutral-200 bg-white text-black hover:bg-neutral-50 font-bold px-6 h-12 rounded-xl"
            onClick={() => router.push("/apps/emails")}
          >
            Switch to Email
          </Button>
          <Button 
            className="bg-black text-white hover:bg-neutral-800 font-bold px-6 h-12 rounded-xl shadow-lg"
            onClick={() => handleSendSMS()}
          >
            <Plus className="mr-2 h-5 w-5 text-white" /> New Message
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Left Column: Stats & Quick Actions */}
        <div className="xl:col-span-1 space-y-6">
          <Card className="border-neutral-200 shadow-sm bg-white overflow-hidden rounded-2xl">
            <CardHeader className="bg-neutral-50 border-b border-neutral-100 py-4">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
                <Wallet className="h-4 w-4" /> Credits Balance
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <span className="text-5xl font-black text-black tracking-tighter">256</span>
                  <span className="text-neutral-400 text-xs font-bold mb-1">UNITS</span>
                </div>
                <div className="w-full bg-neutral-100 h-3 rounded-full overflow-hidden">
                  <div className="bg-black h-full w-[64%]"></div>
                </div>
                <p className="text-sm text-neutral-600 font-medium">Standard SMS remaining.</p>
                <Button variant="outline" className="w-full border-neutral-200 bg-white text-black font-bold hover:bg-neutral-50 rounded-xl h-11">
                  Top Up Credits
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-neutral-200 shadow-sm bg-white overflow-hidden rounded-2xl">
            <CardHeader className="bg-neutral-50 border-b border-neutral-100 py-4">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
                <Users className="h-4 w-4" /> Quick Broadcast
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2 px-0 pb-0">
              <div className="divide-y divide-neutral-100">
                {favoriteGroups.map((group) => (
                  <button 
                    key={group.id}
                    onClick={() => handleSendSMS(group.id)}
                    className="w-full px-6 py-5 flex items-center justify-between hover:bg-neutral-50 transition-colors text-left group"
                  >
                    <div>
                      <p className="font-bold text-black group-hover:underline">{group.name}</p>
                      <p className="text-xs text-neutral-500 font-medium">{group.count} recipients</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-neutral-300 group-hover:text-black transition-colors" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area: History & Search */}
        <div className="xl:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-2 rounded-2xl border border-neutral-200 shadow-sm">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <Input 
                placeholder="Search history by message or recipient..." 
                className="border-none bg-transparent pl-12 h-12 focus-visible:ring-0 text-base font-medium text-black"
              />
            </div>
            <div className="flex items-center gap-2 px-2">
              <Tabs defaultValue="all" className="w-auto">
                <TabsList className="bg-neutral-100 h-10 p-1 rounded-xl">
                  <TabsTrigger value="all" className="text-xs font-bold px-6 rounded-lg data-[state=active]:bg-white data-[state=active]:text-black">All</TabsTrigger>
                  <TabsTrigger value="sent" className="text-xs font-bold px-6 rounded-lg data-[state=active]:bg-white data-[state=active]:text-black">Sent</TabsTrigger>
                  <TabsTrigger value="draft" className="text-xs font-bold px-6 rounded-lg data-[state=active]:bg-white data-[state=active]:text-black">Drafts</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <Card className="border-neutral-200 shadow-sm overflow-hidden rounded-2xl bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-50 hover:bg-neutral-50 border-neutral-200">
                  <TableHead className="font-bold text-black h-14 px-6 uppercase text-[11px] tracking-widest">Message Content</TableHead>
                  <TableHead className="font-bold text-black h-14 uppercase text-[11px] tracking-widest">Recipient</TableHead>
                  <TableHead className="font-bold text-black h-14 uppercase text-[11px] tracking-widest">Date</TableHead>
                  <TableHead className="font-bold text-black h-14 text-right px-6 uppercase text-[11px] tracking-widest">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSMS.map((sms) => (
                  <TableRow key={sms.id} className="hover:bg-neutral-50 border-neutral-100 group transition-colors">
                    <TableCell className="max-w-[400px] px-6 py-5">
                      <p className="font-bold text-black truncate">{sms.message}</p>
                    </TableCell>
                    <TableCell className="py-5">
                      <span className="text-neutral-600 text-sm font-bold">{sms.recipient}</span>
                    </TableCell>
                    <TableCell className="py-5">
                      <span className="text-neutral-500 text-sm font-medium">{sms.date}</span>
                    </TableCell>
                    <TableCell className="text-right px-6 py-5">
                      <Badge 
                        variant={sms.status === "Draft" ? "outline" : "default"} 
                        className={sms.status === "Draft" 
                          ? "border-neutral-300 text-neutral-700 bg-white font-bold" 
                          : "bg-black text-white hover:bg-neutral-800 border-transparent font-bold"}
                      >
                        {sms.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>

      {/* Compose Dialog */}
      <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
        <DialogContent className="sm:max-w-[550px] border-none shadow-2xl p-0 gap-0 overflow-hidden rounded-3xl bg-white">
          <DialogHeader className="p-10 pb-6 bg-white">
            <DialogTitle className="text-3xl font-black text-black flex items-center gap-3 tracking-tighter">
              <MessageSquare className="h-8 w-8 text-black" />
              {selectedGroup ? "Send Broadcast" : "New SMS"}
            </DialogTitle>
            <DialogDescription className="text-neutral-500 text-lg font-medium pt-2">
              {selectedGroup 
                ? `Dispatching to ${favoriteGroups.find(g => g.id === selectedGroup)?.name}.`
                : "Fill in the details to send your message."}
            </DialogDescription>
          </DialogHeader>

          <div className="px-10 pb-10 space-y-8 bg-white">
            {!selectedGroup && (
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-neutral-500">Recipient Number</label>
                <Input 
                  placeholder="+254 712 345 678" 
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  className="border-neutral-200 focus:border-black focus:ring-1 focus:ring-black h-14 rounded-2xl text-xl bg-white text-black font-bold placeholder:text-neutral-300"
                  disabled={isSending || sendComplete}
                />
              </div>
            )}

            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-xs font-black uppercase tracking-widest text-neutral-500">Message Body</label>
                <span className={`text-[10px] font-black ${messageText.length > 160 ? 'text-red-500' : 'text-neutral-400'}`}>
                  {messageText.length} / 160 CHARACTERS
                </span>
              </div>
              <Textarea
                placeholder="Type your message here..."
                className="min-h-[160px] border-neutral-200 focus:border-black focus:ring-1 focus:ring-black rounded-2xl p-5 text-lg resize-none bg-white text-black font-medium leading-relaxed placeholder:text-neutral-300"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                disabled={isSending || sendComplete}
              />
            </div>

            {isSending && (
              <div className="flex items-center justify-center p-8 bg-neutral-50 rounded-2xl border border-neutral-100 animate-pulse">
                <div className="animate-spin rounded-full h-6 w-6 border-3 border-black border-t-transparent"></div>
                <span className="ml-4 font-bold text-black uppercase text-sm tracking-widest">Transmitting...</span>
              </div>
            )}

            {sendComplete && (
              <div className="flex items-center justify-center p-8 bg-black rounded-2xl text-white shadow-xl animate-in zoom-in duration-300">
                <Send className="w-6 h-6 mr-4 text-white" />
                <span className="font-bold text-lg uppercase tracking-widest">Sent Successfully</span>
              </div>
            )}
          </div>

          <DialogFooter className="p-10 pt-0 bg-neutral-50 border-t border-neutral-100 flex flex-row gap-4">
            <Button 
              variant="ghost" 
              onClick={() => setIsSendDialogOpen(false)} 
              disabled={isSending}
              className="flex-1 h-14 font-bold text-neutral-500 hover:text-black hover:bg-neutral-200 rounded-2xl uppercase tracking-widest text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!messageText.trim() || (!selectedGroup && !recipientPhone.trim()) || isSending || sendComplete}
              className="flex-[2] bg-black text-white hover:bg-neutral-800 h-14 font-bold rounded-2xl shadow-xl transition-transform active:scale-95 disabled:opacity-30 border-none uppercase tracking-widest text-xs"
            >
              <Send className="h-4 w-4 mr-3 text-white" />
              Send Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
