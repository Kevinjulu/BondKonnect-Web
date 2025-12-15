import React from "react";
import ResearchAssistantComponent from "./ResearchAssistant";
import { getCurrentUserDetails } from "@/app/lib/actions/user.check";
import { redirect } from "next/navigation";

const ResearchAssistant = async () => {
  const user = await getCurrentUserDetails();
  if (!user) {
    redirect("/auth/login");
  }

  return <ResearchAssistantComponent userDetails={user} />;
};

export default ResearchAssistant;
