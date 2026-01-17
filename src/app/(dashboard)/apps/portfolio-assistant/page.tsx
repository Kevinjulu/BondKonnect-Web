import React from "react";
import PortfolioAssistantComponent from "./PortfolioAssistant";
import { getCurrentUserDetails } from "@/lib/actions/user.check";
import { redirect } from "next/navigation";

const PortfolioAssistant = async () => {
  const user = await getCurrentUserDetails();
  if (!user) {
    redirect("/auth/login");
  }

  return <PortfolioAssistantComponent userDetails={user} />;
};

export default PortfolioAssistant;
