import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Bell, Mail, MessageSquare, Monitor } from "lucide-react"

export function NotificationsTab() {
  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-1 mb-4">
        <h2 className="text-2xl font-bold text-black tracking-tight">Notifications</h2>
        <p className="text-neutral-500 font-medium">Choose how and when you want to stay updated.</p>
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
    <div className="flex items-center justify-between p-8 border border-neutral-100 bg-white rounded-3xl group hover:border-black transition-all hover:shadow-lg hover:shadow-neutral-100">
      <div className="flex gap-6">
        <div className="p-3 bg-neutral-100 rounded-2xl group-hover:bg-black group-hover:text-white transition-colors">
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor={id} className="text-lg font-bold tracking-tight text-black cursor-pointer">
            {title}
          </Label>
          <span className="text-sm text-neutral-500 font-medium max-w-sm leading-relaxed">{description}</span>
        </div>
      </div>
      <Switch id={id} className="data-[state=checked]:bg-black h-7 w-12" />
    </div>
  )
}
