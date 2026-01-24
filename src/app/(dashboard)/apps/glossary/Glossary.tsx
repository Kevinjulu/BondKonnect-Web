"use client";

import PageContainer from "../../components/container/PageContainer";
import { GlossaryComponent } from "../../components/apps/glossary/GlossaryComponent";

export default function GlossaryPage({ userDetails }: { userDetails: UserData }) {
  return (
    <PageContainer title="Financial Glossary | BondKonnect" description="Comprehensive guide to financial and bond market terms.">
      <div className="min-h-screen bg-white text-black p-0 m-0 animate-in fade-in duration-500">
        <div className="p-6 md:p-10">
          <GlossaryComponent />
        </div>
      </div>
    </PageContainer>
  );
}