"use client";

import PageContainer from "../../components/container/PageContainer";
import { SMSComponent } from "./SMSComponent";

export default function SMSPage({ userDetails }: { userDetails: UserData }) {
  return (
    <PageContainer title="SMS Portal | BondKonnect" description="Manage and send SMS notifications to your clients.">
      {/* Forced light mode container */}
      <div className="min-h-screen bg-white text-black p-0 m-0">
        <div className="p-6 md:p-10">
          <SMSComponent userDetails={userDetails} />
        </div>
      </div>
    </PageContainer>
  );
}
