import React from "react";
import HubComponent from "./Hub";
import { getCurrentUserDetails } from "@/lib/actions/user.check";
import { redirect } from "next/navigation";

const Hub = async () => {
  const user = await getCurrentUserDetails();
  if (!user) {
    redirect("/auth/login");
  }

  return <HubComponent userDetails={user} />;
};

export default Hub;
