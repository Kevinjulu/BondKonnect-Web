"use client";
import { useState } from "react";
import Image from "next/image";
import PageContainer from "../../components/container/PageContainer";
import ResearchAssistantTable from "../../components/apps/research-assistant/research-assistant-table";

export default function ResearchAssistantPage({ userDetails }: { userDetails: UserData }) {
  return (
    <PageContainer title="Research Assistant Page" description="this is Research Assistant page">
      <div className="space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          {/* <h2 className="text-3xl font-bold tracking-tight">Quote Book</h2> */}
          <div className="flex items-center space-x-2">
            {/* Additional buttons/actions could go here */}
          </div>
        </div>
        <ResearchAssistantTable userDetails={userDetails} />
      </div>      
    </PageContainer>
  );
}
