"use client";
import PageContainer from "../../components/container/PageContainer";
import { AccountSettings } from "../../components/apps/account/AccountSettings";

interface AccountPageProps {
  user: any;
}

export default function AccountPage({ user }: AccountPageProps) {
  return (
    <PageContainer title="Account Settings | BondKonnect" description="Manage your account preferences and security">
      <div className="min-h-screen bg-white text-black p-6 md:p-10 animate-in fade-in duration-500">
        <div className="max-w-[1400px] mx-auto space-y-10">
          <div className="flex flex-col gap-2 border-b border-neutral-100 pb-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-black">Account Settings</h1>
            <p className="text-lg text-neutral-500 font-medium">Manage your personal profile, security, and preferences.</p>
          </div>
          
          <AccountSettings user={user} />
        </div>      
      </div>
    </PageContainer>
  );
}