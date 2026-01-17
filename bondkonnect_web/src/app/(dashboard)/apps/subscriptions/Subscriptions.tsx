"use client";


import PageContainer from "../../components/container/PageContainer";
import { SubscriptionsListing } from "../../components/apps/subscriptions/Subscriptions";

export default function SubscriptionPage({ userDetails }: { userDetails: UserData }) {
    
  return (

    <PageContainer title="Subscription Page" description="this is Subscription page">
        <div className=" space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            {/* <h2 className="text-3xl font-bold tracking-tight">Subscription</h2> */}
            <div className="flex items-center space-x-2">

           

            </div>
          </div>
          <SubscriptionsListing userDetails={userDetails}/>
        </div>      

    </PageContainer>
  );
}
