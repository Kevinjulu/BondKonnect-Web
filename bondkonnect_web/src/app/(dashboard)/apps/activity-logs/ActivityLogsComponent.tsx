"use client";

import PageContainer from "../../components/container/PageContainer";
import { ActivityLogsTable } from "../../components/apps/activity-logs/ActivityTable";

export default function ActivityLogsPage({ userDetails }: { userDetails: UserData }) {
  return (
    <PageContainer title="Security & Activity Logs | BondKonnect" description="Audit trail of security events and workstation activities.">
      <div className="min-h-screen bg-white text-black p-0 m-0 animate-in fade-in duration-500">
        <div className="p-6 md:p-10 max-w-[1400px] mx-auto space-y-10">
          <div className="flex flex-col gap-2 border-b border-neutral-100 pb-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-black">Activity Logs</h1>
            <p className="text-lg text-neutral-500 font-medium">Monitor system security events, workstation logins, and operational audit trails.</p>
          </div>
          
          <ActivityLogsTable />
        </div>
      </div>
    </PageContainer>
  );
}