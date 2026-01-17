import { Switch } from "@/app/components/ui/switch"
import { Label } from "@/app/components/ui/label"

export function NotificationsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Notification Preferences</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
            <span>Email Notifications</span>
            <span className="font-normal text-sm text-muted-foreground">Receive notifications via email</span>
          </Label>
          <Switch id="email-notifications" />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
            <span>Push Notifications</span>
            <span className="font-normal text-sm text-muted-foreground">Receive notifications on your device</span>
          </Label>
          <Switch id="push-notifications" />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="sms-notifications" className="flex flex-col space-y-1">
            <span>SMS Notifications</span>
            <span className="font-normal text-sm text-muted-foreground">Receive notifications via text message</span>
          </Label>
          <Switch id="sms-notifications" />
        </div>
      </div>
    </div>
  )
}

