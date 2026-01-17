import React from "react";
import InvoicesComponent from "./Invoices";
import { getCurrentUserDetails } from "@/lib/actions/user.check";
import { redirect } from "next/navigation";

const Invoices = async () => {
  const user = await getCurrentUserDetails();
  if (!user) {
    redirect("/auth/login");
  }

  return <InvoicesComponent userDetails={user} />;
};

export default Invoices;
