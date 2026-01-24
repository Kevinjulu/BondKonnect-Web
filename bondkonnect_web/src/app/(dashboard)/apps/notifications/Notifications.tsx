"use client";
import PageContainer from "../../components/container/PageContainer";
import NotificationsComponent from "../../components/apps/notifications/notifications-component";

export default function NotificationsPage({ userDetails }: { userDetails: UserData  }) {
  return (
    <PageContainer title="Notifications | BondKonnect" description="View and manage your system notifications.">
      <div className="flex-1 p-8 pt-6">
        <NotificationsComponent userDetails={userDetails} />
      </div>      
    </PageContainer>
  );
}