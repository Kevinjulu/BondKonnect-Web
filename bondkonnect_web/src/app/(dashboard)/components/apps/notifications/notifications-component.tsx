"use client"

import type React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import { 
  Search, 
  MoreHorizontal, 
  Star, 
  FileText, 
  MessageSquare, 
  UserPlus, 
  AlertTriangle, 
  Globe, 
  LayoutDashboard,
  Bell,
  CheckCheck,
  Archive,
  Filter
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getAllNotifications, markOneNotificationsAsRead, markOneNotificationsAsFavoriteOrArchive } from "@/lib/actions/api.actions"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

// Updated mapping to be Monochrome-friendly
const NOTIFICATION_TYPES = {
  1: { name: 'Message', icon: MessageSquare },
  2: { name: 'Service Request', icon: FileText },
  3: { name: 'Account', icon: UserPlus },
  4: { name: 'Alert', icon: AlertTriangle },
  5: { name: 'Portal', icon: Globe },
  6: { name: 'Dashboard', icon: LayoutDashboard }
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
      const value = currentStatus ? 0 : 1 
      const result = await markOneNotificationsAsFavoriteOrArchive(userDetails.email, id, "IsFavorite", value)
      if (result?.success) {
        setNotifications(notifications.map(n =>
          n.notification_id === id ? { ...n, IsFavorite: !n.IsFavorite } : n
        ))
        toast({ title: "Success", description: `Updated favorites` })
      }
    } catch {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" })
    }
  }

  const markAsRead = async (id: number) => {
    if (!userDetails?.email) return
    try {
      const result = await markOneNotificationsAsRead(userDetails.email, id)
      if (result?.success) {
        setNotifications(notifications.map(n =>
          n.notification_id === id ? { ...n, IsRead: true } : n
        ))
      }
    } catch {
      toast({ title: "Error", description: "Failed to mark as read", variant: "destructive" })
    }
  }

  const archiveNotification = async (id: number, currentStatus: boolean) => {
    if (!userDetails?.email) return
    try {
      const value = currentStatus ? 0 : 1
      const result = await markOneNotificationsAsFavoriteOrArchive(userDetails.email, id, "IsArchive", value)
      if (result?.success) {
        setNotifications(notifications.map(n =>
          n.notification_id === id ? { ...n, IsArchive: !n.IsArchive } : n
        ))
        toast({ title: "Success", description: `Updated archive` })
      }
    } catch {
      toast({ title: "Error", description: "Failed to update archive", variant: "destructive" })
    }
  }

  const filteredNotifications = useMemo(() => {
    return notifications
      .filter((notification) => {
        if (activeTab === "all") return !notification.IsArchive
        if (activeTab === "archive") return notification.IsArchive
        if (activeTab === "favorite") return notification.IsFavorite
        return true
      })
      .filter((notification) => 
        notification.notification_message.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => new Date(b.notification_date).getTime() - new Date(a.notification_date).getTime())
  }, [notifications, activeTab, searchQuery])

  const stats = useMemo(() => {
    return {
      total: notifications.length,
      unread: notifications.filter(n => !n.IsRead).length,
      archived: notifications.filter(n => n.IsArchive).length,
      favorites: notifications.filter(n => n.IsFavorite).length
    }
  }, [notifications])

  return (
    <div className="space-y-6">
      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard label="Total Notifications" value={stats.total} icon={Bell} />
        <StatsCard label="Unread Messages" value={stats.unread} icon={MessageSquare} active={stats.unread > 0} />
        <StatsCard label="Favorites" value={stats.favorites} icon={Star} />
        <StatsCard label="Archived" value={stats.archived} icon={Archive} />
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        {/* Header & Controls */}
        <div className="p-6 border-b border-neutral-100 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-black flex items-center gap-2">
              Notifications
            </h3>
            <p className="text-sm text-neutral-500">Manage your alerts and system messages.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 group-focus-within:text-black transition-colors" />
              <Input
                className="pl-10 border-neutral-200 bg-neutral-50 focus:bg-white transition-all focus:ring-black focus:border-black"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="border-neutral-200 bg-white text-black hover:bg-neutral-50">
              <Filter className="h-4 w-4 text-black" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6 border-b border-neutral-100 bg-neutral-50/30 flex justify-between items-center">
            <TabsList className="bg-transparent h-auto p-0 gap-6">
              <TabItem value="all" label="All Notifications" count={stats.total - stats.archived} />
              <TabItem value="favorite" label="Favorites" count={stats.favorites} />
              <TabItem value="archive" label="Archived" count={stats.archived} />
            </TabsList>
            
            <div className="py-2">
               <Button variant="outline" size="sm" className="text-xs bg-white text-black border-neutral-200 hover:bg-neutral-50 h-8">
                 <CheckCheck className="h-3 w-3 mr-2" />
                 Mark all read
               </Button>
            </div>
          </div>

          <div className="min-h-[400px]">
            <TabsContent value="all" className="m-0">
              <NotificationList 
                items={filteredNotifications} 
                toggleFavorite={toggleFavorite}
                markAsRead={markAsRead}
                archiveNotification={archiveNotification}
                isLoading={isLoading}
              />
            </TabsContent>
            <TabsContent value="archive" className="m-0">
              <NotificationList 
                items={filteredNotifications} 
                toggleFavorite={toggleFavorite}
                markAsRead={markAsRead}
                archiveNotification={archiveNotification}
                isLoading={isLoading}
              />
            </TabsContent>
            <TabsContent value="favorite" className="m-0">
              <NotificationList 
                items={filteredNotifications} 
                toggleFavorite={toggleFavorite}
                markAsRead={markAsRead}
                archiveNotification={archiveNotification}
                isLoading={isLoading}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}

// --- Sub Components ---

function StatsCard({ label, value, icon: Icon, active = false }: { label: string, value: number, icon: any, active?: boolean }) {
  return (
    <Card className={cn("border-neutral-200 shadow-sm transition-all hover:border-black/20 bg-white", active && "border-black/40 bg-neutral-50")}>
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-black mt-1">{value}</p>
        </div>
        <div className={cn("h-10 w-10 rounded-full flex items-center justify-center", active ? "bg-black text-white" : "bg-neutral-100 text-neutral-600")}>
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  )
}

function TabItem({ value, label, count }: { value: string, label: string, count: number }) {
  return (
    <TabsTrigger
      value={value}
      className="relative px-0 py-4 rounded-none bg-transparent border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:border-black data-[state=active]:text-black text-neutral-500 font-medium text-sm transition-all hover:text-black data-[state=active]:shadow-none"
    >
      {label}
      {count > 0 && (
        <Badge variant="secondary" className="ml-2 bg-neutral-100 text-neutral-600 hover:bg-neutral-200 h-5 px-1.5 min-w-[20px] justify-center">
          {count}
        </Badge>
      )}
    </TabsTrigger>
  )
}

interface NotificationListProps {
  items: Notification[]
  toggleFavorite: (id: number, status: boolean) => void
  markAsRead: (id: number) => void
  archiveNotification: (id: number, status: boolean) => void
  isLoading: boolean
}

function NotificationList({ items, toggleFavorite, markAsRead, archiveNotification, isLoading }: NotificationListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-neutral-400 animate-in fade-in">
        <div className="h-8 w-8 rounded-full border-2 border-neutral-200 border-t-black animate-spin mb-4" />
        <p>Loading your updates...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-neutral-400 animate-in fade-in">
        <div className="h-16 w-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4">
          <Bell className="h-8 w-8 text-neutral-300" />
        </div>
        <p className="text-black font-medium">All caught up!</p>
        <p className="text-sm">No notifications to display in this view.</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-neutral-100">
      {items.map((notification) => (
        <div
          key={notification.notification_id}
          className={cn(
            "group flex gap-4 p-5 hover:bg-neutral-50 transition-colors cursor-pointer relative animate-in fade-in slide-in-from-bottom-1 duration-300",
            !notification.IsRead && "bg-neutral-50/50"
          )}
          onClick={() => !notification.IsRead && markAsRead(notification.notification_id)}
        >
          {/* Read Indicator */}
          {!notification.IsRead && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-black rounded-r-full" />
          )}

          {/* Icon */}
          <div className="flex-shrink-0 pt-1">
             <div className={cn(
               "h-10 w-10 rounded-full flex items-center justify-center border",
               !notification.IsRead ? "bg-white border-neutral-200" : "bg-neutral-100 border-transparent text-neutral-400"
             )}>
                {getNotificationIcon(notification.notification_type)}
             </div>
          </div>

          {/* Content */}
          <div className="flex-grow min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className={cn("text-xs font-semibold uppercase tracking-wider", !notification.IsRead ? "text-black" : "text-neutral-500")}>
                 {NOTIFICATION_TYPES[notification.notification_type as keyof typeof NOTIFICATION_TYPES]?.name || 'System'}
              </span>
              <span className="text-xs text-neutral-400">
                {formatDistanceToNow(new Date(notification.notification_date), { addSuffix: true })}
              </span>
            </div>
            
            <p className={cn("text-sm leading-relaxed", !notification.IsRead ? "text-black font-medium" : "text-neutral-600")}>
              {notification.notification_message}
            </p>
          </div>

          {/* Actions */}
          <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8 hover:bg-neutral-100 hover:text-black", notification.IsFavorite ? "text-black opacity-100" : "text-neutral-400")}
              onClick={(e) => {
                e.stopPropagation()
                toggleFavorite(notification.notification_id, notification.IsFavorite)
              }}
            >
              <Star className={cn("h-4 w-4", notification.IsFavorite && "fill-black")} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8 hover:bg-neutral-100 hover:text-black", notification.IsArchive ? "text-black opacity-100" : "text-neutral-400")}
              onClick={(e) => {
                e.stopPropagation()
                archiveNotification(notification.notification_id, notification.IsArchive)
              }}
            >
              <Archive className="h-4 w-4" />
            </Button>
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-black hover:bg-neutral-100">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); markAsRead(notification.notification_id); }}>
                  Mark as Read
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  )
}

function getNotificationIcon(type: number) {
  const TypeDef = NOTIFICATION_TYPES[type as keyof typeof NOTIFICATION_TYPES]
  const Icon = TypeDef ? TypeDef.icon : FileText
  return <Icon className="h-5 w-5" />
}