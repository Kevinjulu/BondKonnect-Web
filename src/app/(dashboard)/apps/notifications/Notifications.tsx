"use client";
import PageContainer from "../../components/container/PageContainer";
import NotificationsComponent from "../../components/apps/notifications/notifications-component";

export default function NotificationsPage({ userDetails }: { userDetails: UserData  }) {
  return (
    <PageContainer title="Notifications Page" description="this is Notifications page">
      <div className="space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
        </div>
        <NotificationsComponent userDetails={userDetails} />
      </div>      
    </PageContainer>
  );
}
