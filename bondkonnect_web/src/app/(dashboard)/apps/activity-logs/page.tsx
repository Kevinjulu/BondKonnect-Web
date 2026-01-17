import React from "react";
import ActivityLogsComponent from "./ActivityLogsComponent";
import { getCurrentUserDetails } from "@/lib/actions/user.check";
import { redirect } from "next/navigation";

const ActivityLogs = async () => {
  const user = await getCurrentUserDetails();
  if (!user) {
    redirect("/auth/login");
  }

  return <ActivityLogsComponent userDetails={user} />;
};

export default ActivityLogs;
