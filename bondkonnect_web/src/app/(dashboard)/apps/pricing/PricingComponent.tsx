"use client";
import PageContainer from "../../components/container/PageContainer";
import { SubscriptionsListing } from "../../components/apps/subscriptions/Subscriptions";

interface PricingPageProps {
  user: any;
}

export default function PricingComponent({ user }: PricingPageProps) {
  return (
    <PageContainer title="Terminal Access | BondKonnect" description="Choose the best plan for your bond trading and analytics needs.">
      <div className="min-h-screen bg-white text-black p-0 m-0 animate-in fade-in duration-500">
        <div className="p-6 md:p-10 max-w-[1400px] mx-auto space-y-10">
          <div className="flex flex-col gap-2 border-b border-neutral-100 pb-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-black">Workstation Access</h1>
            <p className="text-lg text-neutral-500 font-medium">Unlock advanced bond analytics, real-time data, and institutional trading tools.</p>
          </div>
          
          <SubscriptionsListing userDetails={user} />
        </div>
      </div>
    </PageContainer>
  );
}