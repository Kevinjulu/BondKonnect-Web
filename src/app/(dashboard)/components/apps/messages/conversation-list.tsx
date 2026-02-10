"use client";

import { useEffect, useState, useCallback } from "react";
import { getMessagesByUser, markMessageAsRead } from "@/lib/actions/api.actions";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Message {
  Id: number;
  Description: string;
  created_on: string;
  IsRead: boolean;
  created_by: {
    Id: number;
    Email: string;
    FirstName: string;
    OtherNames: string;
  };
  assigned_to?: {
    Id: number;
    Email: string;
    FirstName: string;
    OtherNames: string;
  };
}

interface ConversationListProps {
  userDetails: UserData;
  selectedChat: number | null;
  onSelectChat: (chatId: number) => void;
}

export default function ConversationList({ userDetails, selectedChat, onSelectChat }: ConversationListProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchMessages = useCallback(async () => {
    try {
      const result = await getMessagesByUser(userDetails.email);
      if (result?.success) {
        const allMessages = [
          ...(result.data.created_messages || []),
          ...(result.data.received_messages || [])
        ].sort((a, b) => new Date(b.created_on).getTime() - new Date(a.created_on).getTime());
        
        setMessages(allMessages);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [userDetails.email, toast]);

  useEffect(() => {
    fetchMessages();
    
    // Listen for real-time message updates
    const handleNewMessage = () => {
      fetchMessages();
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
  }, [fetchMessages]);

  const handleSelectChat = async (message: Message) => {
    onSelectChat(message.Id);
    
    // Mark message as read if it's unread and assigned to current user
    if (!message.IsRead && message.assigned_to?.Email === userDetails.email) {
      try {
        const result = await markMessageAsRead(userDetails.email, message.Id);
        if (result?.success) {
          // Update local state to reflect the change
          setMessages(messages.map(m => 
            m.Id === message.Id ? { ...m, IsRead: true } : m
          ));
        }
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-neutral-400">
        <MessageSquare className="h-8 w-8 animate-pulse mb-3" />
        <p className="text-sm">Loading conversations...</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 bg-white">
      <div className="p-2 space-y-1">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-neutral-400">
            <div className="h-12 w-12 rounded-full bg-neutral-50 flex items-center justify-center mb-3">
               <MessageSquare className="h-6 w-6 text-neutral-300" />
            </div>
            <p className="text-sm font-medium text-black">No messages yet</p>
            <p className="text-xs max-w-[180px] mt-1">Start a new conversation to see it here.</p>
          </div>
        ) : (
          messages.map((message) => {
             const isSelected = selectedChat === message.Id;
             const isUnread = !message.IsRead && message.assigned_to?.Email === userDetails.email;
             
             return (
              <div
                key={message.Id}
                onClick={() => handleSelectChat(message)}
                className={cn(
                  "group flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border border-transparent",
                  isSelected ? "bg-neutral-100 border-neutral-200 shadow-sm" : "hover:bg-neutral-50 hover:border-neutral-100",
                  isUnread && "bg-neutral-50"
                )}
              >
                <div className="relative">
                  <Avatar className={cn("h-10 w-10 border border-neutral-200", isSelected && "border-black")}>
                    <AvatarFallback className={cn("text-xs font-semibold", isSelected ? "bg-black text-white" : "bg-white text-black")}>
                      {message.created_by.FirstName.substring(0, 1)}
                      {message.created_by.OtherNames.substring(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  {isUnread && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-black border-2 border-white"></span>
                    </span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className={cn("text-sm font-semibold truncate", isSelected ? "text-black" : "text-neutral-900")}>
                      {message.created_by.FirstName} {message.created_by.OtherNames}
                    </p>
                    <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                      {formatDistanceToNow(new Date(message.created_on), { addSuffix: false })}
                    </span>
                  </div>
                  <p className={cn(
                      "text-xs line-clamp-1", 
                      isSelected ? "text-neutral-600 font-medium" : "text-neutral-500",
                      isUnread && "text-black font-semibold"
                    )}>
                    {message.Description}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </ScrollArea>
  );
}