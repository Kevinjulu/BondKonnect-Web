import React from "react";
import AnalysisComponent from "./Analysis";
import { getCurrentUserDetails } from "@/app/lib/actions/user.check";
import { redirect } from "next/navigation";

const Analysis = async () => {
  const user = await getCurrentUserDetails();
  if (!user) {
    redirect("/auth/login");
  }

  return <AnalysisComponent userDetails={user} />;
};

export default Analysis;
