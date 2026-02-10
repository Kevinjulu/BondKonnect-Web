import React from "react";
import GlossaryComponent from "./Glossary";
import { getCurrentUserDetails } from "@/lib/actions/user.check";
import { redirect } from "next/navigation";

const Glossary = async () => {
  const user = await getCurrentUserDetails();
  if (!user) {
    redirect("/auth/login");
  }

  return <GlossaryComponent userDetails={user} />;
};

export default Glossary;
