"use client";

import PageContainer from "../../components/container/PageContainer";
import { BillingComponent } from "./BillingComponent";

export default function BillingPage({ userDetails }: { userDetails: UserData }) {
  return (
    <PageContainer title="Billing & Payments | BondKonnect" description="Manage your payment methods, plans, and billing history.">
      <div className="min-h-screen bg-white text-black p-0 m-0 animate-in fade-in duration-500">
        <div className="p-6 md:p-10 max-w-[1400px] mx-auto space-y-10">
          <div className="flex flex-col gap-2 border-b border-neutral-100 pb-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-black">Billing & Payments</h1>
            <p className="text-lg text-neutral-500 font-medium">Manage your subscription plans, payment methods, and workstation invoices.</p>
          </div>
          
          <BillingComponent userDetails={userDetails} />
        </div>
      </div>
    </PageContainer>
  );
}