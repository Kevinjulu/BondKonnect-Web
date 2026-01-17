"use client";
import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import axios from "@/utils/axios";
import { useToast } from "@/hooks/use-toast";
import { Laptop, Smartphone, Trash2 } from "lucide-react";

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
        title: "Success",
        description: "Session revoked successfully.",
      });
      fetchSessions(); // Refresh list
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to revoke session.",
      });
    }
  };

  return (
    <div className="space-y-6">
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
          {loading ? (
            <p>Loading sessions...</p>
          ) : sessions.length > 0 ? (
            sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  {session.device.includes('iPhone') || session.device.includes('Android') ? (
                    <Smartphone className="h-6 w-6 text-gray-500" />
                  ) : (
                    <Laptop className="h-6 w-6 text-gray-500" />
                  )}
                  <div>
                    <p className="font-medium">
                      {session.device} {session.is_current && <span className="text-green-600 text-xs ml-2">(Current session)</span>}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {session.ip_address} • Last active {session.last_active}
                    </p>
                  </div>
                </div>
                {!session.is_current && (
                  <Button variant="ghost" size="icon" onClick={() => handleRevoke(session.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                    <span className="sr-only">Remove device</span>
                  </Button>
                )}
              </div>
            ))
          ) : (
            <p>No active sessions found.</p>
          )}
        </div>
      </div>
    </div>
  )
}
