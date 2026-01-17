import React from "react";
import TransactionsComponent from "./Transactions";
import { getCurrentUserDetails } from "@/lib/actions/user.check";
import { redirect } from "next/navigation";

const Transactions = async () => {
  const user = await getCurrentUserDetails();
  if (!user) {
    redirect("/auth/login");
  }

  return <TransactionsComponent userDetails={user} />;
};

export default Transactions;
