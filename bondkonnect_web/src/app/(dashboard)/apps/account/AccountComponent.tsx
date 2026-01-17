"use client";
import PageContainer from "../../components/container/PageContainer";
import { AccountSettings } from "../../components/apps/account/AccountSettings";

interface AccountPageProps {
  user: any;
}

export default function AccountPage({ user }: AccountPageProps) {

  return (

    <PageContainer title="Dashboard Page" description="this is Dashboard page">
        <div className=" space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Account Settings</h2>
            <div className="flex items-center space-x-2">

           

            </div>
          </div>
          <AccountSettings user={user} />
        </div>      

    </PageContainer>
  );
}
