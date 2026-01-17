"use client";
import { useState } from "react";
import Image from "next/image";
import PageContainer from "../../components/container/PageContainer";

export default function InvoicesPage({ userDetails }: { userDetails: UserData }) {
  return (

    <PageContainer title="Help Page" description="this is Help page">
        <div className=" space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">FAQ</h2>
            <div className="flex items-center space-x-2">

           

            </div>
          </div>
          {/* <BondStats/> */}
        </div>      

    </PageContainer>
  );
}
