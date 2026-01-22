"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import axios from "@/utils/axios";
import { useToast } from "@/hooks/use-toast";
import { Camera } from "lucide-react";

interface AccountTabProps {
  user: any;
}

export function AccountTab({ user }: AccountTabProps) {
  const initialFirstName = user?.first_name || '';
  const initialLastName = user?.other_names || '';

  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.post('/V1/auth/update-profile', {
        first_name: firstName,
        last_name: lastName,
        phone: phone
      });
      
      toast({
        title: "Profile Updated",
        description: "Your changes have been saved successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <section>
        <div className="flex flex-col gap-1 mb-6">
          <h2 className="text-xl font-semibold text-black">Personal Information</h2>
          <p className="text-sm text-gray-500">Update your photo and personal details here.</p>
        </div>
        
        <div className="flex items-center gap-6 p-6 border border-gray-100 bg-gray-50/50">
          <div className="relative group">
            <Avatar className="h-20 w-20 border-2 border-white shadow-sm">
              <AvatarImage src={user?.avatar_url} alt="User" />
              <AvatarFallback className="bg-black text-white text-xl font-bold">
                {user?.first_name ? user.first_name.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <button className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-medium text-black">Profile Picture</h3>
            <p className="text-xs text-gray-500 max-w-[200px]">PNG, JPG or GIF. Max size of 800K.</p>
            <div className="flex gap-2 mt-1">
              <Button className="h-auto py-1 px-3 bg-black text-white hover:bg-gray-800 rounded-none text-[10px] font-bold uppercase tracking-wider">Upload new</Button>
              <Button className="h-auto py-1 px-3 bg-gray-400 text-white hover:bg-red-600 rounded-none text-[10px] font-bold uppercase tracking-wider transition-colors">Remove</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="firstName" className="text-xs font-bold uppercase tracking-wider text-gray-500">First Name</Label>
            <Input 
              id="firstName" 
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)} 
              className="rounded-none border-gray-200 focus:border-black focus:ring-0 transition-colors"
              placeholder="e.g. John" 
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName" className="text-xs font-bold uppercase tracking-wider text-gray-500">Last Name</Label>
            <Input 
              id="lastName" 
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)} 
              className="rounded-none border-gray-200 focus:border-black focus:ring-0 transition-colors"
              placeholder="e.g. Doe" 
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-500">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              value={user?.email || ''} 
              readOnly 
              className="rounded-none border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed" 
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-gray-500">Phone Number</Label>
            <Input 
              id="phone" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              className="rounded-none border-gray-200 focus:border-black focus:ring-0 transition-colors"
              placeholder="+254 700 000000" 
            />
          </div>
        </div>
      </section>

      <div className="pt-6 border-t border-gray-100 flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={loading}
          className="bg-black text-white hover:bg-gray-800 rounded-none px-8 py-6 h-auto font-bold uppercase tracking-widest text-xs transition-all active:scale-95"
        >
          {loading ? "Processing..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}