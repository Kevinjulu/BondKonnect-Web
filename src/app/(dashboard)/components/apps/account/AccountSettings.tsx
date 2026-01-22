"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AccountTab } from "./AccountTab"
import { NotificationsTab } from "./NotificationsTab"
import { BillingTab } from "./BillingTab"
import { SecurityTab } from "./SecurityTab"
import { ApiTab } from "./APITab"
import { User, Bell, CreditCard, Shield, Code, ChevronRight } from 'lucide-react'
import { cn } from "@/lib/utils"

interface AccountSettingsProps {
  user: any;
}

export function AccountSettings({ user }: AccountSettingsProps) {
  const [activeTab, setActiveTab] = useState("account")

  const menuItems = [
    { id: "account", label: "General", icon: User, description: "Manage your profile information" },
    { id: "security", label: "Security", icon: Shield, description: "Password and session management" },
    { id: "billing", label: "Billing", icon: CreditCard, description: "Manage payments and subscriptions" },
    { id: "notifications", label: "Notifications", icon: Bell, description: "Configure how you receive alerts" },
    { id: "api", label: "Developer", icon: Code, description: "Developer tools and access keys" },
  ]

  return (
    <div className="flex flex-col md:flex-row gap-8 min-h-[600px]">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 flex-shrink-0">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-4 text-sm font-medium transition-all duration-200 border-b md:border-b-0 md:border-l-2",
                activeTab === item.id
                  ? "border-black bg-black text-white font-bold"
                  : "border-transparent bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("h-4 w-4", activeTab === item.id ? "text-white" : "text-gray-400")} />
                <div className="flex flex-col items-start">
                  <span>{item.label}</span>
                </div>
              </div>
              <ChevronRight className={cn("h-4 w-4 transition-transform", activeTab === item.id ? "rotate-90 md:rotate-0 opacity-100" : "opacity-0")} />
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white border border-gray-100 p-6 md:p-8">
        <div className="max-w-3xl">
          {activeTab === "account" && (
            <div className="animate-in fade-in slide-in-from-right-2 duration-300">
              <AccountTab user={user} />
            </div>
          )}
          {activeTab === "security" && (
            <div className="animate-in fade-in slide-in-from-right-2 duration-300">
              <SecurityTab />
            </div>
          )}
          {activeTab === "billing" && (
            <div className="animate-in fade-in slide-in-from-right-2 duration-300">
              <BillingTab />
            </div>
          )}
          {activeTab === "notifications" && (
            <div className="animate-in fade-in slide-in-from-right-2 duration-300">
              <NotificationsTab />
            </div>
          )}
          {activeTab === "api" && (
            <div className="animate-in fade-in slide-in-from-right-2 duration-300">
              <ApiTab />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}