import React from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Switch } from "@/app/components/ui/switch"

export function SecurityTab() {
  return (
    <div className="space-y-6">
      {/* <div className="flex items-center justify-between p-4 bg-blue-100 rounded-lg">
        <div>
          <h3 className="font-semibold">Your account security is 90%</h3>
          <p className="text-sm text-muted-foreground">Please review your account security settings regularly and update your password.</p>
        </div>
        <Button variant="outline">Review security</Button>
      </div> */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Basics</h2>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="flex items-center space-x-2">
            <Input id="password" type="password" value="••••••••••••••••" readOnly />
            <Button variant="outline">Update Password</Button>
          </div>
          <p className="text-sm text-green-600">Very secure</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="two-step">Two-step verification</Label>
            <p className="text-sm text-muted-foreground">We recommend requiring a verification code in addition to your password.</p>
          </div>
          <Switch id="two-step" />
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Browsers and devices</h2>
        <p className="text-muted-foreground">These browsers and devices are currently signed in to your account. Remove any unrecognized devices.</p>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <svg xmlns="http://www.w3.org/2000/
svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
              <div>
                <p className="font-medium">Brave on Mac OS X</p>
                <p className="text-sm text-muted-foreground">Juja, Kenya • Current session</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
              <span className="sr-only">Remove device</span>
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><line x1="12" x2="12.01" y1="18" y2="18"/></svg>
              <div>
                <p className="font-medium">Olive&apos;s MacBook Pro</p>
                <p className="text-sm text-muted-foreground">Mombasa, Kenya • Current session</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
              <span className="sr-only">Remove device</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

