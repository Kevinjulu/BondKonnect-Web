"use client";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { IoMdNotificationsOutline } from "react-icons/io";
import { getUnreadNotifications, markAllNotificationsAsRead, markOneNotificationsAsRead, approveIntermediaryClient } from "@/lib/actions/api.actions";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { MessageSquare, FileText, UserPlus, AlertTriangle, Globe, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Notification {
  notification_id: number;
  notification_type: number;
  notification_message: string;
  notification_date: string;
  notification_link: string;
  IsRead: boolean;
  client_email?: string;
}

const NOTIFICATION_TYPES = {
  1: { name: 'Message Notifications', icon: MessageSquare, color: 'text-blue-600' },
  2: { name: 'Service Request Notifications', icon: FileText, color: 'text-green-600' },
  3: { name: 'Account Creation Notifications', icon: UserPlus, color: 'text-purple-600' },
  4: { name: 'Failure Alerts Notifications', icon: AlertTriangle, color: 'text-red-600' },
  5: { name: 'Portal Notifications', icon: Globe, color: 'text-orange-600' },
  6: { name: 'Dashboard Notifications', icon: LayoutDashboard, color: 'text-indigo-600' },
  7: { name: 'Approval Request Notifications', icon: UserPlus, color: 'text-green-600' },
  8: { name: 'Bid Status Notifications', icon: FileText, color: 'text-blue-600' },
  9: { name: 'Bid Status Notifications', icon: FileText, color: 'text-blue-600' }

} as const;

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientEmail: string;
  intermediaryEmail: string;
  notificationId: number;
  onApprovalComplete: () => void;
}

const ApprovalModal = ({
  isOpen,
  onClose,
  clientEmail,
  intermediaryEmail,
  notificationId,
  onApprovalComplete
}: ApprovalModalProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleApproval = async (isApproved: boolean) => {
    setLoading(true);
    try {
      const response = await approveIntermediaryClient({
        intermediary_email: intermediaryEmail,
        client_email: clientEmail,
        notification_id: notificationId,
        is_approved: isApproved
      });

      if (response && response.success) {
        toast({
          title: "Success",
          description: `Client request ${isApproved ? 'approved' : 'rejected'} successfully`,
        });
        onApprovalComplete();
      }
    } catch (error) {
      console.error('Error handling approval:', error);
      toast({
        title: "Error",
        description: "Failed to process approval request",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Client Approval Request</DialogTitle>
          <DialogDescription>
            User with email {clientEmail} has mentioned you as their intermediary. 
            Do you want to approve or reject this request?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => handleApproval(false)}
            disabled={loading}
          >
            Reject
          </Button>
          <Button
            onClick={() => handleApproval(true)}
            disabled={loading}
          >
            {loading ? "Processing..." : "Approve"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function Notifications({ userDetails }: { userDetails: any }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const fetchNotifications = useCallback(async () => {
    if (!userDetails?.email) return;
    
    try {
      const result = await getUnreadNotifications(userDetails.email);
      if (result?.success) {
        setNotifications(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userDetails?.email]);

  useEffect(() => {
    fetchNotifications();
    
    // Listen for real-time notification updates
    const handleNewNotification = () => {
      fetchNotifications();
    };

    const handleRefreshNotifications = () => {
      fetchNotifications();
    };

    window.addEventListener('newNotification', handleNewNotification);
    window.addEventListener('refreshNotifications', handleRefreshNotifications);
    
    return () => {
      window.removeEventListener('newNotification', handleNewNotification);
      window.removeEventListener('refreshNotifications', handleRefreshNotifications);
    };
  }, [userDetails?.email, fetchNotifications]);

  const handleMarkAllAsRead = async () => {
    if (!userDetails?.email) return;
    
    try {
      const result = await markAllNotificationsAsRead(userDetails.email);
      if (result?.success) {
        setNotifications([]);
        toast({
          title: "Success",
          description: "All notifications marked as read",
        });
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark notifications as read",
        variant: "destructive"
      });
    }
  };

  const markAsRead = async (id: number) => {
    if (!userDetails?.email) return;
    
    try {
      const result = await markOneNotificationsAsRead(userDetails.email, id);
      if (result?.success) {
        setNotifications(notifications.map(notification =>
          notification.notification_id === id
            ? { ...notification, IsRead: true }
            : notification
        ));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive"
      });
    }
  };

  const getIconForNotificationType = (type: number) => {
    const notificationType = NOTIFICATION_TYPES[type as keyof typeof NOTIFICATION_TYPES];
    if (!notificationType) return <FileText className="h-5 w-5 text-gray-600" />;
    
    const Icon = notificationType.icon;
    return (
      <div className="relative group">
        <Icon className={cn("h-5 w-5", notificationType.color)} />
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
          {notificationType.name}
        </div>
      </div>
    );
  };

  const handleNotificationClick = (notification: Notification) => {
    // If it's an approval notification (type 7), show the approval modal
    if (notification.notification_type === 7 && !notification.IsRead) {
      setSelectedNotification(notification);
      setApprovalModalOpen(true);
      return;
    }

    markAsRead(notification.notification_id);
    router.push('/apps/notifications');
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <IoMdNotificationsOutline className="h-5 w-5" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-96" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Notifications</p>
              <p className="text-xs leading-none text-muted-foreground">
                {notifications.length} unread notifications
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <DropdownMenuItem disabled>Loading notifications...</DropdownMenuItem>
            ) : notifications.length === 0 ? (
              <DropdownMenuItem disabled>
                <div className="flex flex-col items-center justify-center py-4 text-sm text-gray-500">
                  <IoMdNotificationsOutline className="h-8 w-8 mb-2" />
                  <p>No new notifications</p>
                </div>
              </DropdownMenuItem>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem 
                  key={notification.notification_id} 
                  className="flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex-shrink-0 pt-1">
                    {getIconForNotificationType(notification.notification_type)}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-sm text-gray-800 font-medium line-clamp-2">
                      {notification.notification_message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(notification.notification_date), { addSuffix: true })}
                    </p>
                  </div>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <div className="p-2">
            {notifications.length > 0 && (
              <Button 
                variant="outline" 
                className="w-full text-sm"
                onClick={handleMarkAllAsRead}
              >
                Mark all as read
              </Button>
            )}
            <Button 
              variant="outline" 
              className="w-full text-sm mt-2"
              onClick={() => router.push('/apps/notifications')}
            >
              View all notifications
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedNotification && (
        <ApprovalModal
          isOpen={approvalModalOpen}
          onClose={() => {
            setApprovalModalOpen(false);
            setSelectedNotification(null);
          }}
          clientEmail={selectedNotification.client_email || ''}
          intermediaryEmail={userDetails?.email || ''}
          notificationId={selectedNotification.notification_id}
          onApprovalComplete={fetchNotifications}
        />
      )}
    </>
  );
}
