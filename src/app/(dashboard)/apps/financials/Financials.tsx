"use client";
import { useState } from "react";
import Image from "next/image";
import PageContainer from "../../components/container/PageContainer";

export default function FinancialsPage({ userDetails }: { userDetails: UserData }) {
  return (

    <PageContainer title="Financials Page" description="this is Financials page">
        <div className=" space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Financials</h2>
            <div className="flex items-center space-x-2">

           

            </div>
          </div>
          {/* <BondStats/> */}
        </div>      

    </PageContainer>
  );
}
