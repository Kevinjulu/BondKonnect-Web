import React from "react";
import SMSComponent from "./SMS";
import { getCurrentUserDetails } from "@/app/lib/actions/user.check";
import { redirect } from "next/navigation";

const SMS = async () => {
  const user = await getCurrentUserDetails();
  if (!user) {
    redirect("/auth/login");
  }

  return <SMSComponent userDetails={user} />;
};

export default SMS;
