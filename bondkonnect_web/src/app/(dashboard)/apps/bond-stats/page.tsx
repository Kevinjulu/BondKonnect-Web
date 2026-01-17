import React from "react";
import BondStatsComponent from "./BondStatsComponent";
import { getCurrentUserDetails } from "@/app/lib/actions/user.check";
import { redirect } from "next/navigation";

const BondStats = async () => {
  const user = await getCurrentUserDetails();
  if (!user) {
    redirect("/auth/login");
  }

  return <BondStatsComponent userDetails={user} />;
};

export default BondStats;
