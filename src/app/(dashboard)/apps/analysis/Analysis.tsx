"use client";

import PageContainer from "../../components/container/PageContainer";
import { AnalysisComponent } from "../../components/apps/analysis/AnalysisComponent";

export default function AnalysisPage({ userDetails }: { userDetails: UserData }) {
  return (
    <PageContainer title="Market Analysis | BondKonnect" description="Comprehensive market analytics and portfolio performance metrics.">
      <div className="min-h-screen bg-white text-black p-0 m-0 animate-in fade-in duration-500">
        <div className="p-6 md:p-10 max-w-[1400px] mx-auto space-y-10">
          <div className="flex flex-col gap-2 border-b border-neutral-100 pb-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-black">Market Analysis</h1>
            <p className="text-lg text-neutral-500 font-medium">Deep-dive analytics, yield performance, and portfolio risk budgeting.</p>
          </div>
          
          <AnalysisComponent />
        </div>
      </div>
    </PageContainer>
  );
}