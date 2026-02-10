"use client";
import PageContainer from "../../components/container/PageContainer";
import { BondStats } from "../../components/apps/bond-stats/BondStats";

export default function BondStatsPage({ userDetails }: { userDetails: UserData }) {
  return (

    <PageContainer title="Bond Stats Page" description="this is Bond Stats page">
        <div className=" space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Bond Stats </h2>
            <div className="flex items-center space-x-2">

           

            </div>
          </div>
          <BondStats/>
        </div>      

    </PageContainer>
  );
}
