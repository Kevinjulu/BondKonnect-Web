import React from "react";
import SubscriptionsComponent from "./Subscriptions";
import { getCurrentUserDetails } from "@/lib/actions/user.check";
import { redirect } from "next/navigation";

const Subscriptions = async () => {
  const user = await getCurrentUserDetails();
  if (!user) {
    redirect("/auth/login");
  }
  return <SubscriptionsComponent userDetails={user} />;
};

export default Subscriptions;

