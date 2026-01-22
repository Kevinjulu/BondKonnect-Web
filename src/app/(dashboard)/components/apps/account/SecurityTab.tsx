"use client";
import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import axios from "@/utils/axios";
import { useToast } from "@/hooks/use-toast";
import { Laptop, Smartphone, Trash2, ShieldCheck, Key, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface Session {
  id: number;
  is_current: boolean;
  ip_address: string;
  last_active: string;
  device: string;
}

export function SecurityTab() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const { toast } = useToast();

  const fetchSessions = async () => {
    try {
      const response = await axios.get('/V1/auth/active-sessions');
      if (response.data.success) {
        setSessions(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch sessions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleRevoke = async (sessionId: number) => {
    try {
      await axios.post('/V1/auth/revoke-session', { session_id: sessionId });
      toast({
        title: "Session Revoked",
        description: "The device has been signed out successfully.",
      });
      fetchSessions();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Action Failed",
        description: error.message || "Failed to revoke session.",
      });
    }
  };

  return (
    <div className="space-y-12">
      <section>
        <div className="flex flex-col gap-1 mb-8">
          <h2 className="text-xl font-semibold text-black">Security Settings</h2>
          <p className="text-sm text-gray-500">Manage your password and active sessions.</p>
        </div>

        <div className="space-y-6">
          <div className="p-6 border border-gray-100 bg-white space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Key className="h-5 w-5 text-black" />
              <h3 className="font-medium text-black">Password</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Current Password</Label>
                <Input type="password" value="••••••••••••••••" readOnly className="rounded-none border-gray-200 bg-gray-50" />
              </div>
              <Button 
                className="rounded-none bg-black text-white hover:bg-gray-800 transition-colors h-10 px-6 font-semibold text-xs uppercase tracking-widest"
                onClick={() => setIsUpdatingPassword(!isUpdatingPassword)}
              >
                Change Password
              </Button>
            </div>

            {isUpdatingPassword && (
              <div className="pt-6 mt-6 border-t border-gray-100 space-y-4 animate-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">New Password</Label>
                    <Input type="password" placeholder="Min. 8 characters" className="rounded-none border-gray-200 focus:border-black focus:ring-0" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Confirm New Password</Label>
                    <Input type="password" placeholder="Repeat new password" className="rounded-none border-gray-200 focus:border-black focus:ring-0" />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="ghost" className="text-xs uppercase font-bold text-gray-400 hover:text-black" onClick={() => setIsUpdatingPassword(false)}>Cancel</Button>
                  <Button className="bg-black text-white hover:bg-gray-800 rounded-none text-xs uppercase font-bold px-6">Update</Button>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border border-gray-100 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-black" />
                <div className="flex flex-col">
                  <h3 className="font-medium text-black">Two-Step Verification</h3>
                  <p className="text-xs text-gray-500">Add an extra layer of security to your account.</p>
                </div>
              </div>
              <Switch className="data-[state=checked]:bg-black" />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-black">Active Sessions</h2>
          <p className="text-sm text-gray-500">You&apos;re currently logged in to these devices.</p>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center p-12 border border-dashed border-gray-200">
              <p className="text-sm text-gray-400 animate-pulse font-medium uppercase tracking-widest">Refreshing sessions...</p>
            </div>
          ) : sessions.length > 0 ? (
            sessions.map((session) => (
              <div key={session.id} className={cn(
                "flex items-center justify-between p-4 border transition-all",
                session.is_current ? "border-black bg-gray-50" : "border-gray-100 bg-white"
              )}>
                <div className="flex items-center space-x-4">
                  <div className={cn(
                    "p-2 rounded-none",
                    session.is_current ? "bg-black text-white" : "bg-gray-100 text-gray-500"
                  )}>
                    {session.device.includes('iPhone') || session.device.includes('Android') ? (
                      <Smartphone className="h-5 w-5" />
                    ) : (
                      <Laptop className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-black uppercase tracking-tight">{session.device}</p>
                      {session.is_current && (
                        <span className="bg-black text-white text-[8px] font-bold px-1.5 py-0.5 uppercase tracking-tighter">Current</span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium uppercase mt-0.5">
                      {session.ip_address} • {session.last_active}
                    </p>
                  </div>
                </div>
                {!session.is_current && (
                  <Button 
                    size="icon" 
                    onClick={() => handleRevoke(session.id)}
                    className="bg-black text-white hover:bg-gray-800 rounded-none transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="sr-only">Sign out</span>
                  </Button>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 border border-dashed border-gray-200 text-center">
              <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">No other active sessions found.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}