"use client";
import PageContainer from "../../components/container/PageContainer";
import { AccountSettings } from "../../components/apps/account/AccountSettings";

interface AccountPageProps {
  user: any;
}

export default function AccountPage({ user }: AccountPageProps) {
  return (
    <PageContainer title="Account Settings" description="Manage your account preferences and security">
      <div className="space-y-8 p-8 max-w-[1200px] mx-auto">
        <div className="flex flex-col gap-2 border-b border-black pb-8">
          <h1 className="text-4xl font-bold tracking-tighter text-black uppercase">Settings</h1>
          <p className="text-sm text-gray-500 font-medium uppercase tracking-widest">Manage your workspace and personal account preferences.</p>
        </div>
        
        <AccountSettings user={user} />
      </div>      
    </PageContainer>
  );
}