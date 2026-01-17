"use client"

import { useState } from "react"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { ArrowLeft, ArrowRight, Clock, Forward, MoreHorizontal, Reply, ReplyAll, Trash, FileText, FileSpreadsheet, Image, Paperclip, Video   } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "react-hot-toast"
import { PiImage } from "react-icons/pi"

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
      // Only run on client side
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        return;
      }
      
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
    <div className="flex flex-col h-full bg-white rounded-lg border">
      {/* Email header with actions */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h2 className="text-lg font-semibold">{email.subject}</h2>
        </div>

        <TooltipProvider>
          <div className="flex items-center space-x-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">Previous</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Previous</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <ArrowRight className="h-4 w-4" />
                  <span className="sr-only">Next</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Next</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Clock className="h-4 w-4" />
                  <span className="sr-only">Snooze</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Snooze</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Mark as unread</DropdownMenuItem>
                <DropdownMenuItem>Add star</DropdownMenuItem>
                <DropdownMenuItem>Move to folder</DropdownMenuItem>
                <DropdownMenuItem>Print</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TooltipProvider>
      </div>

      {/* Email sender info */}
      <div className="flex items-start p-4">
        <Avatar className="h-10 w-10 mr-4">
          <div className="bg-gray-200 h-full w-full flex items-center justify-center rounded-full text-lg font-medium">
            {email.sender.name.charAt(0)}
          </div>
        </Avatar>

        <div className="flex-1">
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold">{email.sender.name}</h3>
              <p className="text-sm text-muted-foreground">{email.replyTo && <span>Reply-To: {email.replyTo}</span>}</p>
            </div>
            <div className="text-sm text-muted-foreground">
              {format(new Date(email.date), "MMM d, yyyy, h:mm:ss a")}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Email content */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="prose prose-sm max-w-none">
          {email.content.split("\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {email.attachments && email.attachments.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2">Attachments</h4>
            <div className="space-y-2">
              {email.attachments.map((attachment, i) => (
                <div key={i} className="flex items-center p-2 border rounded-md">
                  <div className="bg-gray-100 p-2 rounded mr-3">
                    {getFileTypeIcon(attachment.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{attachment.name}</p>
                    <p className="text-xs text-muted-foreground">{attachment.size}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownloadAttachment(attachment)}
                  >
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reply box */}
      <div className="p-4 border-t">
        {!isReplying ? (
          <div className="border rounded-lg p-4">
            <textarea
              className="w-full resize-none border-0 focus:ring-0 p-0 text-sm"
              placeholder={`Reply to ${email.sender.name}...`}
              onClick={() => setIsReplying(true)}
              rows={1}
            />
          </div>
        ) : (
          <div className="border rounded-lg p-4">
            <textarea
              className="w-full resize-none border-0 focus:ring-0 p-0 text-sm min-h-[100px]"
              placeholder={`Write your reply to ${email.sender.name}...`}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={5}
            />
            <div className="flex justify-between mt-4">
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  multiple
                  className="hidden"
                  id="reply-attachments"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="reply-attachments"
                  className="cursor-pointer flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Paperclip className="h-4 w-4" />
                  <span>Attach files</span>
                </label>
                {attachments.length > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {attachments.length} file(s) selected
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" onClick={() => setIsReplying(false)}>
                  Cancel
                </Button>
                <Button onClick={handleReply} disabled={!replyContent.trim()}>
                  Send Reply
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
  switch (type.toLowerCase()) {
    case "pdf":
      return <FileText className="h-6 w-6 text-red-500" />;
    case "doc":
    case "docx":
      return <FileText className="h-6 w-6 text-blue-500" />;
    case "xls":
    case "xlsx":
      return <FileSpreadsheet className="h-6 w-6 text-green-500" />;
    case "jpg":
    case "jpeg":
    case "png":
      return <PiImage className="h-6 w-6 text-purple-500" />;
    case "mp4":
      return <Video className="h-6 w-6 text-purple-500" />;
    default:
      return <FileText className="h-6 w-6 text-gray-500" />;
  }
}
  
