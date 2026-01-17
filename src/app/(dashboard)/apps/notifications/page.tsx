import React from "react";
import NotificationsComponent from "./Notifications";
import { getCurrentUserDetails } from "@/app/lib/actions/user.check";
import { redirect } from "next/navigation";

const Notifications = async () => {
  const user = await getCurrentUserDetails();
  if (!user) {
    redirect("/auth/login");
  }

  return <NotificationsComponent userDetails={user} />;
};

export default Notifications;
