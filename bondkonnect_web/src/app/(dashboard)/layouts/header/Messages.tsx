"use client";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/app/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu"
import { TbMessage } from "react-icons/tb";
import { getAllUnreadMessagesForUser, markMessageAsRead } from "@/app/lib/actions/api.actions";
import { useToast } from "@/app/hooks/use-toast";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/app/lib/utils";
import { MessageSquare, Send, UserCircle2, MessageCircle } from "lucide-react";

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
  is_thread_message?: boolean;
  thread_count?: number;
}

export function Messages({ userDetails }: { userDetails: any }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  const fetchMessages = useCallback(async () => {
    if (!userDetails?.email) return;
    
    try {
      const result = await getAllUnreadMessagesForUser(userDetails.email);
      if (result?.success) {
        setMessages(result.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    //   toast({
    //     title: "Error",
    //     description: "Failed to fetch messages",
    //     variant: "destructive"
    //   });
    } finally {
      setIsLoading(false);
    }
  }, [userDetails?.email]);

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
  }, [userDetails?.email, fetchMessages]);

  const handleViewThread = async (message: Message) => {
    try {
      if (!message.IsRead && message.assigned_to?.Email === userDetails.email) {
        await markMessageAsRead(userDetails.email, message.Id);
      }
      // Update local state to reflect the message is read
      setMessages(messages.map(m => 
        m.Id === message.Id ? { ...m, IsRead: true } : m
      ));
      // Navigate to the messages app with the specific chat open
      router.push(`/apps/messages?chatId=${message.Id}`);
    } catch (error) {
      console.error('Error handling message:', error);
      toast({
        title: "Error",
        description: "Failed to process message",
        variant: "destructive"
      });
    }
  };

  const getUnreadCount = () => messages.filter(m => !m.IsRead && m.assigned_to?.Email === userDetails.email).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <TbMessage className="h-5 w-5" />
          {getUnreadCount() > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {getUnreadCount()}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Messages</p>
            <p className="text-xs leading-none text-muted-foreground">
              {getUnreadCount()} unread messages
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <DropdownMenuItem disabled>
              <div className="flex items-center justify-center w-full py-4">
                <MessageSquare className="h-5 w-5 animate-pulse" />
                <span className="ml-2">Loading messages...</span>
              </div>
            </DropdownMenuItem>
          ) : messages.length === 0 ? (
            <DropdownMenuItem disabled>
              <div className="flex flex-col items-center justify-center py-4 text-sm text-gray-500">
                <MessageSquare className="h-8 w-8 mb-2" />
                <p>No messages</p>
              </div>
            </DropdownMenuItem>
          ) : (
            messages.map((message) => (
              <DropdownMenuItem 
                key={message.Id} 
                className={cn(
                  "flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-50",
                  !message.IsRead && message.assigned_to?.Email === userDetails.email && "bg-blue-50"
                )}
                onClick={() => handleViewThread(message)}
              >
                <div className="flex-shrink-0 pt-1">
                  <UserCircle2 className="h-8 w-8 text-gray-400" />
                </div>
                <div className="flex-grow min-w-0">
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
                  <div className="flex items-center justify-between mt-1">
                    {message.assigned_to && (
                      <div className="flex items-center text-xs text-gray-500">
                        <Send className="h-3 w-3 mr-1" />
                        To: {message.assigned_to.FirstName} {message.assigned_to.OtherNames}
                      </div>
                    )}
                    {message.is_thread_message && message.thread_count && (
                      <div className="flex items-center text-xs text-blue-500">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        {message.thread_count} {message.thread_count === 1 ? 'reply' : 'replies'}
                      </div>
                    )}
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <div className="p-2">
          <Button 
            variant="outline" 
            className="w-full text-sm"
            onClick={() => router.push('/apps/messages')}
          >
            View all messages
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}