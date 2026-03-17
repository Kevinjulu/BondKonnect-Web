"use client"

import { useState } from "react"
import { AccountTab } from "./AccountTab"
import { NotificationsTab } from "./NotificationsTab"
import { BillingTab } from "./BillingTab"
import { SecurityTab } from "./SecurityTab"
import { ApiTab } from "./APITab"
import { UserCredibilityProfile } from "@/components/ratings/UserCredibilityProfile"
import { User, Bell, CreditCard, Shield, Code, ChevronRight, Star } from 'lucide-react'
import { cn } from "@/lib/utils"

interface AccountSettingsProps {
  user: any;
}

export function AccountSettings({ user }: AccountSettingsProps) {
  const [activeTab, setActiveTab] = useState("account")

  const menuItems = [
    { id: "account", label: "General", icon: User, description: "Profile and basic info" },
    { id: "reputation", label: "Reputation", icon: Star, description: "Trading credibility and ratings" },
    { id: "security", label: "Security", icon: Shield, description: "Password and access" },
    { id: "billing", label: "Billing", icon: CreditCard, description: "Plans and payments" },
    { id: "notifications", label: "Notifications", icon: Bell, description: "Alert preferences" },
    { id: "api", label: "Developer", icon: Code, description: "API keys and tools" },
  ]

  return (
    <div className="flex flex-col lg:flex-row gap-12 min-h-[600px]">
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-72 flex-shrink-0">
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center justify-between px-6 py-5 text-sm transition-all duration-200 rounded-2xl",
                activeTab === item.id
                  ? "bg-black text-white shadow-xl shadow-neutral-200"
                  : "bg-white text-neutral-500 hover:bg-neutral-50 hover:text-black"
              )}
            >
              <div className="flex items-center gap-4">
                <item.icon className={cn("h-5 w-5", activeTab === item.id ? "text-white" : "text-neutral-400")} />
                <div className="flex flex-col items-start">
                  <span className="font-bold">{item.label}</span>
                  <span className={cn("text-[10px] uppercase tracking-widest font-bold", activeTab === item.id ? "text-neutral-400" : "text-neutral-300")}>
                    {item.description}
                  </span>
                </div>
              </div>
              <ChevronRight className={cn("h-4 w-4 transition-transform", activeTab === item.id ? "opacity-100" : "opacity-0")} />
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white border border-neutral-100 rounded-3xl p-8 md:p-12 shadow-sm">
        <div className="max-w-3xl">
          {activeTab === "account" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <AccountTab user={user} />
            </div>
          )}
          {activeTab === "reputation" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <UserCredibilityProfile userId={user.id.toString()} userName={user.name} />
            </div>
          )}
          {activeTab === "security" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <SecurityTab />
            </div>
          )}
          {activeTab === "billing" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <BillingTab />
            </div>
          )}
          {activeTab === "notifications" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <NotificationsTab />
            </div>
          )}
          {activeTab === "api" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <ApiTab />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
