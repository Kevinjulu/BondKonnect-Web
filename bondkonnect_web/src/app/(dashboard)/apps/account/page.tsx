import React from "react";
import AccountComponent from "./AccountComponent";
import { getCurrentUserDetails } from "@/lib/actions/user.check";
import { redirect } from "next/navigation";

const Account = async () => {
  const user = await getCurrentUserDetails();
  if (!user) {
    redirect("/auth/login");
  }

  return <AccountComponent user={user} />;
};

export default Account;
