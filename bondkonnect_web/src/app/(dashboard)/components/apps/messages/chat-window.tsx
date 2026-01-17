"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { getUserThread, replyMessage, submitMessage } from "@/app/lib/actions/api.actions";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/app/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Send, Trash2, MoreVertical, Paperclip, UserCircle2, Archive } from "lucide-react";
import { cn } from "@/app/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/app/components/ui/tooltip";
import { Input } from "@/app/components/ui/input";

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
      console.log('Selected files:', selectedFiles);
      selectedFiles.forEach((file) => {
        console.log('Appending file:', file.name);
        formData.append('message_attachments[]', file);
      });

      // Log FormData contents
      console.log('FormData entries:');
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      if (messages.length === 0) {
        // This is the first message in a new chat
        formData.append('message_description', newMessage.trim());
        formData.append('message_assigned_to', chatId.toString());
        formData.append('message_created_by', userDetails.email);

        console.log('Sending new message with attachments');
        const response = await submitMessage(formData);
        console.log('Submit message response:', response);
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
        <Send className="h-8 w-8 animate-pulse text-gray-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary">
              {chatPartner && isUserObject(chatPartner) ? (
                <>
                  {chatPartner.FirstName}
                  {chatPartner.OtherNames}
                </>
              ) : (
                <UserCircle2 className="h-6 w-6" />
              )}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">
              {chatPartner && isUserObject(chatPartner) 
                ? `${chatPartner.FirstName} ${chatPartner.OtherNames}` 
                : 'Unknown User'}
            </h2>
            <p className="text-sm text-gray-500">
              {chatPartner && isUserObject(chatPartner) ? chatPartner.Email : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleDeleteChat}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete Chat</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Archive className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Archive Chat</TooltipContent>
          </Tooltip>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4">
          {messages.map((message, index) => {
            const isUserMessage = message.created_by.Email === userDetails.email;

            return (
              <div
                key={`${message.Id}-${index}`}
                className={cn(
                  "flex gap-3",
                  isUserMessage ? "flex-row-reverse" : "flex-row"
                )}
              >
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback>
                    {message.created_by.FirstName}
                    {message.created_by.OtherNames}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    "flex flex-col gap-1 max-w-[70%]",
                    isUserMessage ? "items-end" : "items-start"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {message.created_by.FirstName} {message.created_by.OtherNames}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(message.created_on), { addSuffix: true })}
                    </span>
                  </div>
                  <div
                    className={cn(
                      "rounded-lg px-4 py-2 text-sm",
                      isUserMessage
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {message.Description}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2"
        >
          <div className="flex-1 flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleFileSelect}
              className="flex-shrink-0"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <Textarea
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
          <Button
            type="submit"
            disabled={isSending || !newMessage.trim()}
            className="flex-shrink-0"
          >
            <Send className="h-4 w-4" />
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
        {selectedFiles.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                {file.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

