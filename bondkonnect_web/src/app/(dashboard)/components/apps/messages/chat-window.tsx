"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { getUserThread, replyMessage, submitMessage } from "@/lib/actions/api.actions";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Trash2, MoreVertical, Paperclip, UserCircle2, Archive, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";

interface Message {
  Id: number;
  Description: string;
  created_on: string;
  created_by: {
    Id: number;
    Email: string;
    FirstName: string;
    OtherNames: string;
  };
  is_initial_message: boolean;
  assigned_to?: number;
}

interface ChatWindowProps {
  userDetails: UserData;
  chatId: number;
}

export default function ChatWindow({ userDetails, chatId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = useCallback(async () => {
    try {
      const result = await getUserThread(chatId);
      if (result?.success) {
        setMessages(result.data.thread);
      }
    } catch  {
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [chatId, toast]);

  useEffect(() => {
    if (chatId) {
      setIsLoading(true);
      fetchMessages();
    }
    
    // Listen for real-time message updates
    const handleNewMessage = (event: any) => {
      // Check if the message is for this chat
      if (event.detail?.message?.Id === chatId) {
        fetchMessages();
      }
    };

    const handleRefreshMessages = () => {
      fetchMessages();
    };

    window.addEventListener('newMessage', handleNewMessage);
    window.addEventListener('refreshMessages', handleRefreshMessages);
    
    return () => {
      window.removeEventListener('newMessage', handleNewMessage);
      window.removeEventListener('refreshMessages', handleRefreshMessages);
    };
  }, [chatId, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getChatPartner = () => {
    if (messages.length === 0) {
      // Return the participant object based on the chatId
      return {
        Id: chatId,
        FirstName: "New",
        OtherNames: "Chat",
        Email: ""
      };
    }
    const firstMessage = messages[0];
    const isInitialMessageFromUser = firstMessage.created_by.Email === userDetails.email;
    
    if (isInitialMessageFromUser) {
      const messageWithAssignedTo = messages.find(m => m.assigned_to && typeof m.assigned_to === 'object');
      return messageWithAssignedTo?.assigned_to || firstMessage.created_by;
    }
    return firstMessage.created_by;
  };

  const chatPartner = getChatPartner();

  // Helper function to check if chatPartner has user details
  const isUserObject = (partner: unknown): partner is { Id: number; Email: string; FirstName: string; OtherNames: string } => {
    return Boolean(partner && typeof partner === 'object' && partner !== null && 'FirstName' in partner);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append('message_attachments[]', file);
      });

      if (messages.length === 0) {
        // This is the first message in a new chat
        formData.append('message_description', newMessage.trim());
        formData.append('message_assigned_to', chatId.toString());
        formData.append('message_created_by', userDetails.email);

        const response = await submitMessage(formData);
        if (response?.success) {
          setNewMessage("");
          setSelectedFiles([]);
          await fetchMessages(); // Fetch messages after sending
        } else {
          throw new Error("Failed to send message");
        }
      } else {
        // This is a reply to an existing thread
        formData.append('message_id', chatId.toString());
        formData.append('reply_description', newMessage.trim());
        formData.append('reply_created_by', userDetails.email);

        const response = await replyMessage(formData);
        if (response?.success) {
          setNewMessage("");
          setSelectedFiles([]);
          await fetchMessages(); // Fetch messages after sending
        } else {
          throw new Error("Failed to send message");
        }
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles(Array.from(files));
    }
  };

  const handleDeleteChat = () => {
    // Implement delete chat functionality
    toast({
      title: "Info",
      description: "Delete chat functionality will be implemented soon",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-2">
           <div className="h-2 w-2 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
           <div className="h-2 w-2 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
           <div className="h-2 w-2 bg-black rounded-full animate-bounce"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="px-6 py-3 border-b border-neutral-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10 border border-neutral-200">
            <AvatarFallback className="bg-black text-white font-semibold">
              {chatPartner && isUserObject(chatPartner) ? (
                <>
                  {chatPartner.FirstName.charAt(0)}
                  {chatPartner.OtherNames.charAt(0)}
                </>
              ) : (
                <UserCircle2 className="h-6 w-6" />
              )}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-bold text-black text-sm">
              {chatPartner && isUserObject(chatPartner) 
                ? `${chatPartner.FirstName} ${chatPartner.OtherNames}` 
                : 'Unknown User'}
            </h2>
            <p className="text-xs text-neutral-500 flex items-center gap-1.5">
               <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
              {chatPartner && isUserObject(chatPartner) ? chatPartner.Email : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleDeleteChat} className="text-neutral-400 hover:text-red-600 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete Chat</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-black">
                <Archive className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Archive Chat</TooltipContent>
          </Tooltip>
          <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-black">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-6 bg-white">
        <div className="space-y-6">
          {messages.map((message, index) => {
            const isUserMessage = message.created_by.Email === userDetails.email;

            return (
              <div
                key={`${message.Id}-${index}`}
                className={cn(
                  "flex gap-3 group animate-in fade-in slide-in-from-bottom-2 duration-300",
                  isUserMessage ? "flex-row-reverse" : "flex-row"
                )}
              >
                {!isUserMessage && (
                   <Avatar className="h-8 w-8 flex-shrink-0 border border-neutral-200 mt-1">
                    <AvatarFallback className="bg-white text-black text-xs font-semibold">
                      {message.created_by.FirstName.charAt(0)}
                      {message.created_by.OtherNames.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={cn(
                    "flex flex-col gap-1 max-w-[70%]",
                    isUserMessage ? "items-end" : "items-start"
                  )}
                >
                  <div className="flex items-center gap-2 px-1">
                    <span className="text-[10px] text-neutral-400 font-medium">
                       {!isUserMessage && `${message.created_by.FirstName} • `}
                      {formatDistanceToNow(new Date(message.created_on), { addSuffix: true })}
                    </span>
                  </div>
                  <div
                    className={cn(
                      "rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm",
                      isUserMessage
                        ? "bg-black text-white rounded-tr-sm"
                        : "bg-neutral-100 text-neutral-800 rounded-tl-sm border border-neutral-200"
                    )}
                  >
                    {message.Description}
                  </div>
                  {isUserMessage && (
                      <div className="px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <CheckCheck className="h-3 w-3 text-neutral-300" />
                      </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-neutral-100">
        <div className="flex flex-col gap-3 max-w-4xl mx-auto">
          {selectedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 px-1">
              {selectedFiles.map((file, index) => (
                <div key={index} className="text-xs font-medium text-black bg-neutral-100 border border-neutral-200 px-3 py-1.5 rounded-full flex items-center gap-2">
                  <Paperclip className="h-3 w-3" />
                  {file.name}
                </div>
              ))}
            </div>
          )}
          
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-end gap-2 bg-neutral-50 p-2 rounded-2xl border border-neutral-200 focus-within:ring-1 focus-within:ring-black focus-within:border-black transition-all shadow-sm"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleFileSelect}
              className="flex-shrink-0 text-neutral-400 hover:text-black hover:bg-white rounded-xl h-10 w-10"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <Textarea
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="min-h-[44px] max-h-[120px] bg-transparent border-none focus-visible:ring-0 resize-none py-3 text-sm placeholder:text-neutral-400 text-black"
              rows={1}
            />
            <Button
              type="submit"
              disabled={isSending || !newMessage.trim()}
              className="flex-shrink-0 h-10 w-10 rounded-xl bg-black text-white hover:bg-neutral-800 shadow-sm"
              size="icon"
            >
              {isSending ? (
                 <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                 <Send className="h-4 w-4 ml-0.5" />
              )}
              <span className="sr-only">Send message</span>
            </Button>
          </form>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            className="hidden"
            aria-label="File attachment"
          />
        </div>
        <div className="text-center mt-2">
            <p className="text-[10px] text-neutral-400">Press Enter to send, Shift + Enter for new line</p>
        </div>
      </div>
    </div>
  );
}