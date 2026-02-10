import React from "react";
import PageContainer from "../../components/container/PageContainer";
import { HubComponent } from "../../components/apps/hub/HubComponent";
import { getCurrentUserDetails } from "@/lib/actions/user.check";
import { redirect } from "next/navigation";

const HubPage = async () => {
  const user = await getCurrentUserDetails();
  if (!user) {
    redirect("/auth/login");
  }

  return (
    <PageContainer title="Collaboration Hub" description="Manage your professional network and team operations">
        <div className="p-8 pt-6">
          <HubComponent />
        </div>      
    </PageContainer>
  );
};

export default HubPage;
