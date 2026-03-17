"use client";

import PageContainer from "../../components/container/PageContainer";
import { FAQComponent } from "../../components/apps/faq/FAQComponent";

export default function FAQPage({ userDetails }: { userDetails: UserData }) {
  return (
    <PageContainer title="Frequently Asked Questions | BondKonnect" description="Answers to common questions about the BondKonnect platform.">
      <div className="min-h-screen bg-white text-black p-0 m-0 animate-in fade-in duration-500">
        <div className="p-6 md:p-10">
          <FAQComponent />
        </div>
      </div>
    </PageContainer>
  );
}