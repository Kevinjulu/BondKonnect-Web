"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { ArrowLeft, ArrowRight, Clock, Forward, MoreHorizontal, Reply, ReplyAll, Trash, FileText, FileSpreadsheet, Image, Paperclip, Video, Download, Send } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "react-hot-toast"
import { PiImage } from "react-icons/pi"
import { cn } from "@/lib/utils"

interface EmailViewProps {
  email: {
    id: string
    subject: string
    sender: {
      name: string
      email: string
      avatar?: string
    }
    replyTo?: string
    date: string
    content: string
    attachments?: Array<{
      name: string
      size: string
      type: string
      progress?: number
    }>
  }
  onClose: () => void
}

interface UserDataProps extends EmailViewProps {
  userDetails: UserData;
}

interface AttachmentData {
  id?: number;
  name: string;
  size: string;
  type: string;
}

export default function EmailView({ userDetails, email, onClose }: UserDataProps) {
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])

  const handleReply = async () => {
    try {
      const formData = new FormData();
      formData.append("subject", `Re: ${email.subject}`);
      formData.append("body", replyContent);
      formData.append("recipients", JSON.stringify([email.sender.email]));
      formData.append("created_by", userDetails.email);

      attachments.forEach((file) => {
        formData.append("attachments[]", file);
      });

      const response = await fetch("/api/emails/reply", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Reply sent successfully");
        setIsReplying(false);
        setReplyContent("");
        setAttachments([]);
      } else {
        toast.error(data.message || "Failed to send reply");
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Failed to send reply");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const handleDownloadAttachment = async (attachment: AttachmentData) => {
    try {
      if (typeof window === 'undefined' || typeof document === 'undefined') return;
      const response = await fetch(`/api/emails/attachments/${attachment.id}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = attachment.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading attachment:", error);
      toast.error("Failed to download attachment");
    }
  };

  return (
    <div className="flex flex-col h-full bg-white animate-in fade-in duration-500">
      {/* Email header with actions */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onClose} className="bg-white border-neutral-200 text-black hover:bg-neutral-50 h-9 w-9 rounded-lg">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <div>
            <h2 className="text-base font-bold text-black leading-none">{email.subject}</h2>
            <div className="flex items-center gap-2 mt-1">
               <Badge variant="secondary" className="bg-neutral-100 text-[10px] font-bold text-neutral-600 uppercase tracking-tighter px-1.5 py-0 border-none">
                  Inbox
               </Badge>
            </div>
          </div>
        </div>

        <TooltipProvider>
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-black">
                  <Clock className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Snooze</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-red-600 hover:bg-red-50">
                  <Trash className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-4 mx-1" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-black">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 border-neutral-200">
                <DropdownMenuItem className="text-sm font-medium">Mark as unread</DropdownMenuItem>
                <DropdownMenuItem className="text-sm font-medium">Add star</DropdownMenuItem>
                <DropdownMenuItem className="text-sm font-medium">Archive</DropdownMenuItem>
                <DropdownMenuItem className="text-sm font-medium">Print</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TooltipProvider>
      </div>

      <ScrollArea className="flex-1">
        {/* Email sender info */}
        <div className="flex items-start justify-between px-6 py-6 bg-neutral-50/30">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border border-neutral-200 shadow-sm">
              <AvatarFallback className="bg-black text-white font-bold text-base">
                {email.sender.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-black text-base leading-tight">{email.sender.name}</h3>
              <p className="text-xs text-neutral-500 font-medium">
                {email.sender.email}
                {email.replyTo && <span className="ml-2 opacity-60">• Reply to: {email.replyTo}</span>}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-black uppercase tracking-wider">
              {format(new Date(email.date), "MMM d, yyyy")}
            </div>
            <div className="text-[10px] text-neutral-400 mt-0.5">
              {format(new Date(email.date), "h:mm a")}
            </div>
          </div>
        </div>

        <Separator className="bg-neutral-100" />

        {/* Email content */}
        <div className="px-6 py-8">
          <div className="text-sm text-neutral-800 leading-relaxed max-w-3xl space-y-4">
            {email.content.split("\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          {email.attachments && email.attachments.length > 0 && (
            <div className="mt-12 pt-8 border-t border-neutral-100">
              <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4">Attachments ({email.attachments.length})</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {email.attachments.map((attachment, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 border border-neutral-200 rounded-xl bg-white hover:bg-neutral-50 transition-colors group">
                    <div className="h-10 w-10 bg-neutral-100 rounded-lg flex items-center justify-center border border-neutral-200 text-black group-hover:bg-white transition-colors">
                      {getFileTypeIcon(attachment.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-black truncate">{attachment.name}</p>
                      <p className="text-[10px] text-neutral-500 font-medium uppercase tracking-tight">{attachment.size}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadAttachment(attachment)}
                      className="bg-white border-neutral-200 text-black hover:bg-neutral-100 h-8 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                    >
                      <Download className="h-3 w-3 mr-1.5" />
                      Save
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Reply box */}
      <div className="p-6 border-t border-neutral-100 bg-white">
        {!isReplying ? (
          <div 
            className="flex items-center gap-3 p-4 border border-neutral-200 rounded-2xl bg-neutral-50 hover:bg-white hover:border-black/20 cursor-text transition-all duration-300 group"
            onClick={() => setIsReplying(true)}
          >
            <Avatar className="h-6 w-6">
               <AvatarFallback className="bg-neutral-200 text-[10px] font-bold text-neutral-600">
                  {userDetails.email.charAt(0).toUpperCase()}
               </AvatarFallback>
            </Avatar>
            <p className="text-sm text-neutral-400 font-medium group-hover:text-neutral-500 transition-colors">
               Reply to {email.sender.name}...
            </p>
            <div className="ml-auto flex items-center gap-2 text-neutral-300 group-hover:text-black transition-colors">
               <Reply className="h-4 w-4" />
            </div>
          </div>
        ) : (
          <div className="border border-black/10 rounded-2xl p-4 bg-white shadow-lg animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-2 mb-4">
               <Badge variant="outline" className="bg-neutral-50 text-neutral-600 border-neutral-200 text-[10px] font-bold uppercase tracking-tight">
                  Replying to: {email.sender.email}
               </Badge>
            </div>
            <textarea
              className="w-full resize-none border-0 focus:ring-0 p-0 text-sm min-h-[120px] placeholder:text-neutral-400 text-black leading-relaxed"
              placeholder={`Write your reply...`}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              autoFocus
            />
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-100">
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  multiple
                  className="hidden"
                  id="reply-attachments"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="reply-attachments"
                  className="cursor-pointer flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-black transition-colors uppercase tracking-widest"
                >
                  <Paperclip className="h-4 w-4" />
                  <span>Attach</span>
                </label>
                {attachments.length > 0 && (
                  <Badge variant="secondary" className="bg-black text-white border-none text-[10px] font-bold h-5 px-2">
                    {attachments.length} Files
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsReplying(false)}
                  className="bg-white border-neutral-200 text-black hover:bg-neutral-50 rounded-xl h-10 px-6 font-bold text-xs uppercase tracking-widest"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleReply} 
                  disabled={!replyContent.trim()}
                  className="bg-black text-white hover:bg-neutral-800 rounded-xl h-10 px-8 font-bold text-xs uppercase tracking-widest transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function getFileTypeIcon(type: string) {
  const t = type.toLowerCase();
  if (t === "pdf") return <FileText className="h-5 w-5" />;
  if (t.includes("doc")) return <FileText className="h-5 w-5" />;
  if (t.includes("xls")) return <FileSpreadsheet className="h-5 w-5" />;
  if (t.includes("jpg") || t.includes("png") || t.includes("jpeg")) return <Image className="h-5 w-5" />;
  if (t.includes("mp4")) return <Video className="h-5 w-5" />;
  return <FileText className="h-5 w-5" />;
}