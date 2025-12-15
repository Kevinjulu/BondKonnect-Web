"use client";
import PageContainer from "../../components/container/PageContainer";
import { AnalysisComponent } from "../../components/apps/analysis/AnalysisComponent";

export default function AnalysisPage({ userDetails }: { userDetails: UserData }) {
  return (

    <PageContainer title="Analysis Page" description="this is Analysis page">
        <div className=" space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Analysis </h2>
            <div className="flex items-center space-x-2">

           

            </div>
          </div>
          <AnalysisComponent/>
        </div>      

    </PageContainer>
  );
}
