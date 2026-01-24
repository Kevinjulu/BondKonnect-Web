"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import axios from "@/utils/axios";
import { useToast } from "@/hooks/use-toast";
import { Camera, Trash2, Upload } from "lucide-react";

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
    <div className="space-y-12">
      <section>
        <div className="flex flex-col gap-1 mb-8">
          <h2 className="text-2xl font-bold text-black tracking-tight">Personal Information</h2>
          <p className="text-neutral-500 font-medium">Update your photo and personal details here.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-8 p-8 border border-neutral-100 bg-neutral-50/50 rounded-3xl">
          <div className="relative group">
            <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
              <AvatarImage src={user?.avatar_url} alt="User" />
              <AvatarFallback className="bg-black text-white text-2xl font-black">
                {user?.first_name ? user.first_name.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <button className="absolute inset-0 flex items-center justify-center bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300">
              <Camera className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-col gap-3 text-center sm:text-left">
            <h3 className="text-lg font-bold text-black">Profile Picture</h3>
            <p className="text-sm text-neutral-500 font-medium max-w-[240px]">Recommended: Square PNG or JPG, max 800KB.</p>
            <div className="flex gap-3 mt-2 justify-center sm:justify-start">
              <Button className="bg-black text-white hover:bg-neutral-800 rounded-xl px-4 font-bold text-xs uppercase tracking-widest h-10 shadow-lg">
                <Upload className="h-3 w-3 mr-2" /> Upload
              </Button>
              <Button variant="outline" className="border-neutral-200 bg-white text-neutral-400 hover:text-red-600 hover:border-red-200 rounded-xl px-4 font-bold text-xs uppercase tracking-widest h-10">
                <Trash2 className="h-3 w-3 mr-2" /> Remove
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
        <div className="space-y-2.5">
          <Label htmlFor="firstName" className="text-xs font-black uppercase tracking-widest text-neutral-500 ml-1">First Name</Label>
          <Input 
            id="firstName" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
            className="h-14 rounded-2xl border-neutral-200 focus:border-black focus:ring-1 focus:ring-black transition-all bg-white text-black font-bold text-lg px-5"
            placeholder="John" 
          />
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="lastName" className="text-xs font-black uppercase tracking-widest text-neutral-500 ml-1">Last Name</Label>
          <Input 
            id="lastName" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)} 
            className="h-14 rounded-2xl border-neutral-200 focus:border-black focus:ring-1 focus:ring-black transition-all bg-white text-black font-bold text-lg px-5"
            placeholder="Doe" 
          />
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-neutral-500 ml-1">Email Address</Label>
          <Input 
            id="email" 
            type="email" 
            value={user?.email || ''} 
            readOnly 
            className="h-14 rounded-2xl border-neutral-100 bg-neutral-50 text-neutral-400 cursor-not-allowed font-bold text-lg px-5" 
          />
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="phone" className="text-xs font-black uppercase tracking-widest text-neutral-500 ml-1">Phone Number</Label>
          <Input 
            id="phone" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            className="h-14 rounded-2xl border-neutral-200 focus:border-black focus:ring-1 focus:ring-black transition-all bg-white text-black font-bold text-lg px-5"
            placeholder="+254 700 000000" 
          />
        </div>
      </section>

      <div className="pt-10 border-t border-neutral-100 flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={loading}
          className="bg-black text-white hover:bg-neutral-800 rounded-2xl px-12 h-14 font-black uppercase tracking-widest text-sm shadow-xl transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}