import React from "react";
import HelpComponent from "./Help";
import { getCurrentUserDetails } from "@/app/lib/actions/user.check";
import { redirect } from "next/navigation";

const Help = async () => {
  const user = await getCurrentUserDetails();
  if (!user) {
    redirect("/auth/login");
  }

  return <HelpComponent userDetails={user} />;
};

export default Help;
