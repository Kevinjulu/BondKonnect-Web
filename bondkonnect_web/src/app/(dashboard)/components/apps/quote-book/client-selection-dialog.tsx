'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getUserIntermediaries } from '@/lib/actions/api.actions';

interface Client {
  id: number;
  email: string;
  name: string;
}

interface IntermediaryClient {
  Id: number;
  Email: string;
  FirstName: string;
  OtherNames: string;
}

interface ClientSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (clientEmail: string | null) => void;
  userEmail: string;
}

export function ClientSelectionDialog({
  open,
  onOpenChange,
  onSelect,
  userEmail
}: ClientSelectionDialogProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const response = await getUserIntermediaries(userEmail);
        if (response?.success && response.data) {
          const formattedClients = response.data.map((client: IntermediaryClient) => ({
            id: client.Id,
            email: client.Email,
            name: `${client.FirstName} ${client.OtherNames}`
          }));
          setClients(formattedClients);
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchClients();
    }
  }, [open, userEmail]);

  const handleSubmit = () => {
    onSelect(selectedClient);
    onOpenChange(false);
  };

  const handleSelfSelect = () => {
    onSelect(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Client</DialogTitle>
          <DialogDescription>
            Choose the client you are performing this action on behalf of, or select &quot;Myself&quot; if you are the client.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="client" className="text-right">
              Client
            </Label>
            <Select
              disabled={loading}
              onValueChange={(value) => setSelectedClient(value)}
              value={selectedClient || undefined}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.email}>
                    {client.name} ({client.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleSelfSelect}>
            Myself
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={!selectedClient}>
            Select Client
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 
