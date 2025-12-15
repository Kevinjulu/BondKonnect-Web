"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Search, MoreHorizontal, Star, FileText, MessageSquare, UserPlus, AlertTriangle, Globe, LayoutDashboard } from "lucide-react"
import { LuArchive } from "react-icons/lu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { cn } from "@/app/lib/utils"
import { getAllNotifications, markOneNotificationsAsRead, markOneNotificationsAsFavoriteOrArchive } from "@/app/lib/actions/api.actions"
import { useToast } from "@/app/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"

interface Notification {
  notification_id: number
  notification_type: number
  notification_message: string
  notification_date: string
  notification_link: string
  IsRead: boolean
  IsFavorite: boolean
  IsArchive: boolean
}

interface NotificationsComponentProps {
  userDetails: {
    email: string
  }
}

const NOTIFICATION_TYPES = {
  1: { name: 'Message Notifications', icon: MessageSquare, color: 'text-blue-600' },
  2: { name: 'Service Request Notifications', icon: FileText, color: 'text-green-600' },
  3: { name: 'Account Creation Notifications', icon: UserPlus, color: 'text-purple-600' },
  4: { name: 'Failure Alerts Notifications', icon: AlertTriangle, color: 'text-red-600' },
  5: { name: 'Portal Notifications', icon: Globe, color: 'text-orange-600' },
  6: { name: 'Dashboard Notifications', icon: LayoutDashboard, color: 'text-indigo-600' }
} as const

export default function NotificationsComponent({ userDetails }: NotificationsComponentProps) {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchNotifications = useCallback(async () => {
    if (!userDetails?.email) return
    
    try {
      const result = await getAllNotifications(userDetails.email)
      if (result?.success) {
        setNotifications(result.data || [])
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
      toast({
        title: "Error",
        description: "Failed to fetch notifications",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }, [userDetails?.email, toast])

  useEffect(() => {
    fetchNotifications()
    
    // Listen for real-time notification updates
    const handleNewNotification = () => {
      fetchNotifications()
    }

    const handleRefreshNotifications = () => {
      fetchNotifications()
    }

    window.addEventListener('newNotification', handleNewNotification)
    window.addEventListener('refreshNotifications', handleRefreshNotifications)
    
    return () => {
      window.removeEventListener('newNotification', handleNewNotification)
      window.removeEventListener('refreshNotifications', handleRefreshNotifications)
    }
  }, [fetchNotifications])

  const toggleFavorite = async (id: number, currentStatus: boolean) => {
    if (!userDetails?.email) return
    
    try {
      const value = currentStatus ? 0 : 1 // If currently favorite, set to 0 to unfavorite, else set to 1
      const result = await markOneNotificationsAsFavoriteOrArchive(userDetails.email, id, "IsFavorite", value)
      if (result?.success) {
        setNotifications(notifications.map(notification =>
          notification.notification_id === id
            ? { ...notification, IsFavorite: !notification.IsFavorite }
            : notification
        ))
        toast({
          title: "Success",
          description: `Notification ${value === 1 ? 'marked as favorite' : 'removed from favorites'}`,
        })
      }
    } catch (error) {
      console.error('Error toggling notification favorite status:', error)
      toast({
        title: "Error",
        description: "Failed to update notification favorite status",
        variant: "destructive"
      })
    }
  }

  const markAsRead = async (id: number) => {
    if (!userDetails?.email) return
    
    try {
      const result = await markOneNotificationsAsRead(userDetails.email, id)
      if (result?.success) {
        setNotifications(notifications.map(notification =>
          notification.notification_id === id
            ? { ...notification, IsRead: true }
            : notification
        ))
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive"
      })
    }
  }

  const archiveNotification = async (id: number, currentStatus: boolean) => {
    if (!userDetails?.email) return
    
    try {
      const value = currentStatus ? 0 : 1 // If currently archived, set to 0 to unarchive, else set to 1
      const result = await markOneNotificationsAsFavoriteOrArchive(userDetails.email, id, "IsArchive", value)
      if (result?.success) {
        setNotifications(notifications.map(notification =>
          notification.notification_id === id
            ? { ...notification, IsArchive: !notification.IsArchive }
            : notification
        ))
        toast({
          title: "Success",
          description: `Notification ${value === 1 ? 'archived' : 'unarchived'}`,
        })
      }
    } catch (error) {
      console.error('Error toggling notification archive status:', error)
      toast({
        title: "Error",
        description: "Failed to update notification archive status",
        variant: "destructive"
      })
    }
  }

  const filteredNotifications = notifications
    .filter((notification) => {
      if (activeTab === "all") return true
      if (activeTab === "archive") return notification.IsArchive
      if (activeTab === "favorite") return notification.IsFavorite
      return true
    })
    .filter((notification) => 
      notification.notification_message.toLowerCase().includes(searchQuery.toLowerCase())
    )

  const getIconForNotificationType = (type: number) => {
    const notificationType = NOTIFICATION_TYPES[type as keyof typeof NOTIFICATION_TYPES]
    if (!notificationType) return <FileText className="h-5 w-5 text-gray-600" />
    
    const Icon = notificationType.icon
    return (
      <div className="relative group">
        <Icon className={cn("h-5 w-5", notificationType.color)} />
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
          {notificationType.name}
        </div>
      </div>
    )
  }

  const getUnreadCount = () => notifications.filter(n => !n.IsRead).length

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <span className="p-1 rounded-full bg-gray-800 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
          </span>
          List Notification
        </h3>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-medium">
            {notifications.length} Notifications
            {getUnreadCount() > 0 && (
              <span className="ml-2 text-sm text-gray-500">
                ({getUnreadCount()} unread)
              </span>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9 w-64"
              placeholder="Search notifications"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start border-b pb-0">
            <TabsTrigger
              value="all"
              className="relative data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              All
              <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {notifications.length}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="archive"
              className="relative data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              Archive
              <span className="ml-2 text-xs">{notifications.filter(n => n.IsArchive).length}</span>
            </TabsTrigger>
            <TabsTrigger
              value="favorite"
              className="relative data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              Favorite
              <span className="ml-2 text-xs">{notifications.filter(n => n.IsFavorite).length}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0 pt-2">
            <NotificationList
              notifications={filteredNotifications}
              toggleFavorite={toggleFavorite}
              markAsRead={markAsRead}
              archiveNotification={archiveNotification}
              getIconForNotificationType={getIconForNotificationType}
              isLoading={isLoading}
            />
          </TabsContent>
          <TabsContent value="archive" className="mt-0 pt-2">
            <NotificationList
              notifications={filteredNotifications}
              toggleFavorite={toggleFavorite}
              markAsRead={markAsRead}
              archiveNotification={archiveNotification}
              getIconForNotificationType={getIconForNotificationType}
              isLoading={isLoading}
            />
          </TabsContent>
          <TabsContent value="favorite" className="mt-0 pt-2">
            <NotificationList
              notifications={filteredNotifications}
              toggleFavorite={toggleFavorite}
              markAsRead={markAsRead}
              archiveNotification={archiveNotification}
              getIconForNotificationType={getIconForNotificationType}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

interface NotificationListProps {
  notifications: Notification[]
  toggleFavorite: (id: number, currentStatus: boolean) => void
  markAsRead: (id: number) => void
  archiveNotification: (id: number, currentStatus: boolean) => void
  getIconForNotificationType: (type: number) => React.ReactNode
  isLoading: boolean
}

function NotificationList({
  notifications,
  toggleFavorite,
  markAsRead,
  archiveNotification,
  getIconForNotificationType,
  isLoading
}: NotificationListProps) {
  if (isLoading) {
    return <div className="text-center py-4">Loading notifications...</div>
  }

  if (notifications.length === 0) {
    return <div className="text-center py-4">No notifications found</div>
  }

  return (
    <div className="space-y-1">
      {notifications.map((notification) => (
        <div
          key={notification.notification_id}
          className="flex items-start gap-3 py-3 px-2 hover:bg-gray-50 rounded-md group cursor-pointer"
          onClick={() => !notification.IsRead && markAsRead(notification.notification_id)}
        >
          <div className="pt-1 flex-shrink-0">
            <div className={cn("w-2 h-2 rounded-full", notification.IsRead ? "bg-gray-300" : "bg-green-500")} />
          </div>

          <button
            title={notification.IsFavorite ? "Remove from favorites" : "Add to favorites"}
            className="pt-1 flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation()
              toggleFavorite(notification.notification_id, notification.IsFavorite)
            }}
          >
            <Star
              className={cn("h-5 w-5", notification.IsFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400")}
            />
          </button>

          <div className="flex-shrink-0">{getIconForNotificationType(notification.notification_type)}</div>

          <div className="flex-grow min-w-0">
            <p className={cn("text-sm text-gray-800", !notification.IsRead && "font-semibold")}>
              {notification.notification_message}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {formatDistanceToNow(new Date(notification.notification_date), { addSuffix: true })}
            </span>
            <button
              title={notification.IsArchive ? "Unarchive notification" : "Archive notification"}
              className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation()
                archiveNotification(notification.notification_id, notification.IsArchive)
              }}
            >
              <LuArchive className={cn(
                "h-6 w-6 p-1 rounded-full",
                notification.IsArchive 
                  ? "text-gray-500 bg-gray-100" 
                  : "text-red-500 bg-red-100"
              )} />
            </button>
          </div>
        </div>
      ))}   
    </div>
  )
}

