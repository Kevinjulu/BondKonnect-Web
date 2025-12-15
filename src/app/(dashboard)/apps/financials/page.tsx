import React from "react";
import FinancialsComponent from "./Financials";
import { getCurrentUserDetails } from "@/app/lib/actions/user.check";
import { redirect } from "next/navigation";

const Financials = async () => {
  const user = await getCurrentUserDetails();
  if (!user) {
    redirect("/auth/login");
  }

  return <FinancialsComponent userDetails={user} />;
};

export default Financials;
