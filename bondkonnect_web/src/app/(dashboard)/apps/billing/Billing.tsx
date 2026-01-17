"use client";

import PageContainer from "../../components/container/PageContainer";
import { BillingComponent } from "./BillingComponent";
export default function BillingPage({ userDetails }: { userDetails: UserData }) {
  return (

    <PageContainer title="Billing Page" description="this is Billing page">
        <div className=" space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Billing</h2>
            <div className="flex items-center space-x-2">

           

            </div>
          </div>
    
          <BillingComponent userDetails={userDetails}/>
        </div>      

    </PageContainer>
  );
}
