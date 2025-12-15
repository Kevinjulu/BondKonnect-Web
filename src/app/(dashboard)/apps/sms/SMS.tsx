"use client";


import PageContainer from "../../components/container/PageContainer";
import { SMSComponent } from "./SMSComponent";
export default function SMSPage({ userDetails }: { userDetails: UserData }) {
  return (

    <PageContainer title="SMS Page" description="this is SMS page">
        <div className=" space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            {/* <h2 className="text-3xl font-bold tracking-tight">DMS</h2> */}
            <div className="flex items-center space-x-2">

           

            </div>
          </div>
    
          <SMSComponent userDetails={userDetails}/>
        </div>      

    </PageContainer>
  );
}
