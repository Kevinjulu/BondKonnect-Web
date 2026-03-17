"use client";
import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import axios from "@/utils/axios";
import { useToast } from "@/hooks/use-toast";
import { Laptop, Smartphone, ShieldCheck, Key, LogOut } from "lucide-react";
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
        <div className="flex flex-col gap-1 mb-10">
          <h2 className="text-2xl font-bold text-black tracking-tight">Security</h2>
          <p className="text-neutral-500 font-medium">Protect your account with a strong password and multi-factor authentication.</p>
        </div>

        <div className="space-y-6">
          <div className="p-8 border border-neutral-100 bg-white rounded-3xl shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-neutral-100 rounded-2xl">
                <Key className="h-6 w-6 text-black" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-black">Password</h3>
                <p className="text-sm text-neutral-500 font-medium">Last changed 3 months ago</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div className="space-y-2.5">
                <Label className="text-xs font-black uppercase tracking-widest text-neutral-500 ml-1">Current Password</Label>
                <Input type="password" value="••••••••••••••••" readOnly className="h-14 rounded-2xl border-neutral-100 bg-neutral-50 font-bold text-lg px-5 cursor-not-allowed" />
              </div>
              <Button 
                className="bg-black text-white hover:bg-neutral-800 h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg transition-all"
                onClick={() => setIsUpdatingPassword(!isUpdatingPassword)}
              >
                Change Password
              </Button>
            </div>

            {isUpdatingPassword && (
              <div className="pt-8 mt-8 border-t border-neutral-100 space-y-6 animate-in slide-in-from-top-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <Label className="text-xs font-black uppercase tracking-widest text-neutral-500 ml-1">New Password</Label>
                    <Input type="password" placeholder="Min. 8 characters" className="h-14 rounded-2xl border-neutral-200 focus:border-black focus:ring-1 focus:ring-black px-5 font-bold" />
                  </div>
                  <div className="space-y-2.5">
                    <Label className="text-xs font-black uppercase tracking-widest text-neutral-500 ml-1">Confirm New Password</Label>
                    <Input type="password" placeholder="Repeat new password" className="h-14 rounded-2xl border-neutral-200 focus:border-black focus:ring-1 focus:ring-black px-5 font-bold" />
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <Button variant="ghost" className="h-12 rounded-xl font-bold text-neutral-500 hover:text-black hover:bg-neutral-100" onClick={() => setIsUpdatingPassword(false)}>Cancel</Button>
                  <Button className="bg-black text-white hover:bg-neutral-800 rounded-xl h-12 px-8 font-black uppercase tracking-widest text-xs">Update</Button>
                </div>
              </div>
            )}
          </div>

          <div className="p-8 border border-neutral-100 bg-white rounded-3xl shadow-sm">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-neutral-100 rounded-2xl text-black">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-black">Two-Step Verification</h3>
                  <p className="text-sm text-neutral-500 font-medium">Add an extra layer of security to your account.</p>
                </div>
              </div>
              <Switch className="data-[state=checked]:bg-black h-7 w-12" />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-black tracking-tight">Active Sessions</h2>
          <p className="text-neutral-500 font-medium">Manage the devices where you are currently logged in.</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <div className="flex items-center justify-center p-20 border-2 border-dashed border-neutral-100 rounded-3xl bg-neutral-50/30">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-3 border-black border-t-transparent"></div>
                <p className="text-xs font-black uppercase tracking-widest text-neutral-400">Syncing devices...</p>
              </div>
            </div>
          ) : sessions.length > 0 ? (
            sessions.map((session) => (
              <div key={session.id} className={cn(
                "flex flex-col sm:flex-row items-center justify-between p-6 rounded-3xl border transition-all gap-6",
                session.is_current ? "border-black bg-white ring-1 ring-black shadow-xl shadow-neutral-100" : "border-neutral-100 bg-white hover:border-neutral-200 shadow-sm"
              )}>
                <div className="flex items-center gap-6">
                  <div className={cn(
                    "p-4 rounded-2xl",
                    session.is_current ? "bg-black text-white shadow-lg" : "bg-neutral-100 text-neutral-500"
                  )}>
                    {session.device.includes('iPhone') || session.device.includes('Android') ? (
                      <Smartphone className="h-6 w-6" />
                    ) : (
                      <Laptop className="h-6 w-6" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <p className="font-black text-black text-lg tracking-tight">{session.device}</p>
                      {session.is_current && (
                        <span className="bg-black text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest shadow-sm">Current</span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-500 font-bold">
                      {session.ip_address} <span className="mx-2 text-neutral-300">•</span> {session.last_active}
                    </p>
                  </div>
                </div>
                {!session.is_current && (
                  <Button 
                    onClick={() => handleRevoke(session.id)}
                    className="bg-white text-neutral-400 border border-neutral-200 hover:text-red-600 hover:border-red-100 hover:bg-red-50 rounded-2xl h-12 px-6 font-bold text-xs uppercase tracking-widest transition-all"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                )}
              </div>
            ))
          ) : (
            <div className="p-20 border-2 border-dashed border-neutral-100 rounded-3xl text-center bg-neutral-50/30">
              <p className="text-sm text-neutral-400 font-black uppercase tracking-widest italic">No other active sessions detected.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
