import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Bell, Mail, MessageSquare, Monitor } from "lucide-react"

export function NotificationsTab() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-1 mb-2">
        <h2 className="text-xl font-semibold text-black">Notification Preferences</h2>
        <p className="text-sm text-gray-500">Decide how you want to be notified about important events.</p>
      </div>

      <div className="space-y-4">
        <NotificationItem 
          id="email-notifications" 
          title="Email Notifications" 
          description="Receive critical alerts and transaction summaries via email."
          icon={Mail}
        />
        <NotificationItem 
          id="push-notifications" 
          title="Desktop Notifications" 
          description="Real-time alerts directly on your browser while active."
          icon={Monitor}
        />
        <NotificationItem 
          id="sms-notifications" 
          title="SMS Alerts" 
          description="Immediate text messages for trade execution and urgent security events."
          icon={MessageSquare}
        />
      </div>
    </div>
  )
}

function NotificationItem({ id, title, description, icon: Icon }: { id: string, title: string, description: string, icon: any }) {
  return (
    <div className="flex items-center justify-between p-6 border border-gray-100 bg-white group hover:border-black transition-colors">
      <div className="flex gap-4">
        <div className="mt-1">
          <Icon className="h-5 w-5 text-gray-400 group-hover:text-black transition-colors" />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor={id} className="text-sm font-bold uppercase tracking-tight text-black cursor-pointer">
            {title}
          </Label>
          <span className="text-xs text-gray-500 max-w-sm">{description}</span>
        </div>
      </div>
      <Switch id={id} className="data-[state=checked]:bg-black" />
    </div>
  )
}