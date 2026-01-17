"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AccountTab } from "./AccountTab"
import { NotificationsTab } from "./NotificationsTab"
import { BillingTab } from "./BillingTab"
import { SecurityTab } from "./SecurityTab"
import { ApiTab } from "./APITab"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Search, UserPlus } from 'lucide-react'

interface AccountSettingsProps {
  user: any;
}

export function AccountSettings({ user }: AccountSettingsProps) {
  const [searchQuery, setSearchQuery] = useState("")

  return (

      <Tabs defaultValue="account">
        <TabsList className="mb-8">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <AccountTab user={user} />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>
        <TabsContent value="billing">
          <BillingTab />
        </TabsContent>
        <TabsContent value="security">
          <SecurityTab />
        </TabsContent>
        <TabsContent value="api">
          <ApiTab />
        </TabsContent>
      </Tabs>
 
  )
}

