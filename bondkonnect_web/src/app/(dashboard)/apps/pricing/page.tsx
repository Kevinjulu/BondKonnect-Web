import React from "react";
import PricingComponent from "./PricingComponent";
import { getCurrentUserDetails } from "@/lib/actions/user.check";
import { redirect } from "next/navigation";

const PricingPage = async () => {
  const user = await getCurrentUserDetails();
  if (!user) {
    redirect("/auth/login");
  }

  return <PricingComponent user={user} />;
};

export default PricingPage;
