import React from "react";
import BillingComponent from "./Billing";
import { getCurrentUserDetails } from "@/lib/actions/user.check";
import { redirect } from "next/navigation";

const Billing = async () => {
  const user = await getCurrentUserDetails();
  if (!user) {
    redirect("/auth/login");
  }

  return <BillingComponent userDetails={user} />;
};

export default Billing;
