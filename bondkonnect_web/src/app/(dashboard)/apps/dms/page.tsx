import React from "react";
import PageContainer from "../../components/container/PageContainer";
import { DMSComponent } from "./DMSComponent";
import { getCurrentUserDetails } from "@/lib/actions/user.check";
import { redirect } from "next/navigation";

const DMSPage = async () => {
  const user = await getCurrentUserDetails();
  if (!user) {
    redirect("/auth/login");
  }

  return (
    <PageContainer title="DMS | BondKonnect" description="Document Management System for BondKonnect">
      <div className="flex-1 p-8 pt-6">
        <DMSComponent userDetails={user}/>
      </div>      
    </PageContainer>
  );
};

export default DMSPage;
