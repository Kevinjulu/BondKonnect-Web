"use client";
import React from "react";
import PageContainer from "../../components/container/PageContainer";
import { HubComponent } from "../../components/apps/hub/HubComponent";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  [key: string]: any;
}

export default function HubPage({ userDetails }: { userDetails: UserData }) {
  return (
    <PageContainer title="Collaboration Hub" description="Manage your professional network and team operations">
        <div className="p-8 pt-6">
          <HubComponent />
        </div>      
    </PageContainer>
  );
}