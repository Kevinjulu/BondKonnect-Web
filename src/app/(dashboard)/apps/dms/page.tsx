import React from "react";
import  DMSPage  from "./DMS";
import { getCurrentUserDetails } from "@/app/lib/actions/user.check";
import { redirect } from "next/navigation";

const DMS = async () => {
  const user = await getCurrentUserDetails();
  if (!user) {
    redirect("/auth/login");
  }

  return <DMSPage userDetails={user} />;
};

export default DMS;
