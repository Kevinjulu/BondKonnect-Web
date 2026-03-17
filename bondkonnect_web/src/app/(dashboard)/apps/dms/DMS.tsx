"use client";
import PageContainer from "../../components/container/PageContainer";
import { DMSComponent } from "./DMSComponent";

export default function DMSPage({ userDetails }: { userDetails: UserData }) {
  return (

    <PageContainer title="DMS Page" description="this is DMS page">
        <div className=" space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">DMS </h2>
            <div className="flex items-center space-x-2">

           

            </div>
          </div>
          <DMSComponent userDetails={userDetails}/>
        </div>      

    </PageContainer>
  );
}
