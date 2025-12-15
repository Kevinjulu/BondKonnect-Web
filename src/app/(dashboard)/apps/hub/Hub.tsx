"use client";
import { useState } from "react";
import Image from "next/image";
import PageContainer from "../../components/container/PageContainer";
import { HubComponent } from "../../components/apps/hub/HubComponent";
export default function HubPage({ userDetails }: { userDetails: UserData }) {
  return (

    <PageContainer title="Hub Page" description="this is Hub page">
        <div className=" space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Hub</h2>
            <div className="flex items-center space-x-2">

           

            </div>
          </div>
          <HubComponent/>
        </div>      

    </PageContainer>
  );
}
