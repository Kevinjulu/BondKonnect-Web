"use client";
import PageContainer from "../../components/container/PageContainer";
import { SubscriptionsListing } from "../../components/apps/subscriptions/Subscriptions";

interface PricingPageProps {
  user: any;
}

export default function PricingComponent({ user }: PricingPageProps) {
  return (
    <PageContainer title="Pricing & Subscriptions" description="Choose the best plan for your bond trading needs">
      <div className="space-y-8 p-8 max-w-[1400px] mx-auto">
        <div className="flex flex-col gap-2 border-b border-black pb-8">
          <h1 className="text-4xl font-bold tracking-tighter text-black uppercase italic">Subscription Models</h1>
          <p className="text-sm text-gray-500 font-medium uppercase tracking-widest">Premium access to the Kenyan Fixed Income Market.</p>
        </div>
        
        <SubscriptionsListing userDetails={user} />
      </div>      
    </PageContainer>
  );
}
