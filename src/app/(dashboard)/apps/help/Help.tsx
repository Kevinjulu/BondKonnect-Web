"use client";

import PageContainer from "../../components/container/PageContainer";
import { HelpComponent } from "../../components/apps/help/HelpComponent";

export default function HelpPage({ userDetails }: { userDetails: UserData }) {
  return (
    <PageContainer title="Help Center | BondKonnect" description="Get assistance and learn how to use the BondKonnect platform.">
      <div className="min-h-screen bg-white text-black p-0 m-0 animate-in fade-in duration-500">
        <div className="p-6 md:p-10">
          <HelpComponent />
        </div>
      </div>
    </PageContainer>
  );
}