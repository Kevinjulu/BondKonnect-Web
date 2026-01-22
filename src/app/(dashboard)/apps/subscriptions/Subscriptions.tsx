"use client";

import PageContainer from "../../components/container/PageContainer";
import { SubscriptionDashboard } from "../../components/apps/subscriptions/SubscriptionsPage";

export default function SubscriptionPage({ userDetails }: { userDetails: any }) {
  return (
    <PageContainer title="Billing & Terminal Access" description="Manage your BondKonnect subscription and billing history">
      <div className="space-y-8 p-8 max-w-[1400px] mx-auto">
        <div className="flex flex-col gap-2 border-b border-black pb-8">
          <h1 className="text-4xl font-black tracking-tighter text-black uppercase italic">Terminal & Billing</h1>
          <p className="text-sm text-gray-500 font-medium uppercase tracking-widest">
            Manage your active workstation credentials, market data feeds, and transaction history.
          </p>
        </div>
        
        <SubscriptionDashboard userDetails={userDetails} />
      </div>      
    </PageContainer>
  );
}