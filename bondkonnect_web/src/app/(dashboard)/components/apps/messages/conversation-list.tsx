"use client";

import { useEffect, useState, useCallback } from "react";
import { getMessagesByUser, markMessageAsRead } from "@/app/lib/actions/api.actions";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/app/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { MessageSquare } from "lucide-react";
import { cn } from "@/app/lib/utils";

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
      <div className="flex items-center justify-center h-full p-4">
        <MessageSquare className="h-6 w-6 animate-pulse" />
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="space-y-2 p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-sm text-gray-500">
            <MessageSquare className="h-8 w-8 mb-2" />
            <p>No messages yet</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.Id}
              onClick={() => handleSelectChat(message)}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                selectedChat === message.Id ? "bg-primary/10" : "hover:bg-gray-50",
                !message.IsRead && message.assigned_to?.Email === userDetails.email && "bg-blue-50"
              )}
            >
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarFallback>
                  {message.created_by.FirstName}
                  {message.created_by.OtherNames}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {message.created_by.FirstName} {message.created_by.OtherNames}
                  </p>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(message.created_on), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                  {message.Description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  );
}

