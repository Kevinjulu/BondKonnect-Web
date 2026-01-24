"use client";

import PageContainer from "../../components/container/PageContainer";
import { SubscriptionDashboard } from "../../components/apps/subscriptions/SubscriptionsPage";

export default function SubscriptionPage({ userDetails }: { userDetails: any }) {
  return (
    <PageContainer title="Terminal & Billing | BondKonnect" description="Manage your active workstation credentials and billing history.">
      <div className="min-h-screen bg-white text-black p-0 m-0 animate-in fade-in duration-500">
        <div className="p-6 md:p-10 max-w-[1400px] mx-auto space-y-10">
          <div className="flex flex-col gap-2 border-b border-neutral-100 pb-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-black">Terminal & Billing</h1>
            <p className="text-lg text-neutral-500 font-medium">Manage your workstation credentials, market data feeds, and transaction history.</p>
          </div>
          
          <SubscriptionDashboard userDetails={userDetails} />
        </div>
      </div>
    </PageContainer>
  );
}
