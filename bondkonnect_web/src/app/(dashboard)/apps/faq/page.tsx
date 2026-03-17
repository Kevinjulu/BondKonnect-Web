import React from "react";
import FAQComponent from "./FAQ";
import { getCurrentUserDetails } from "@/lib/actions/user.check";
import { redirect } from "next/navigation";

const FAQ = async () => {
  const user = await getCurrentUserDetails();
  if (!user) {
    redirect("/auth/login");
  }

  return <FAQComponent userDetails={user} />;
};

export default FAQ;
