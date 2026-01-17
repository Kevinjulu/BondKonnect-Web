import React from "react";
import UserManagementComponent from "./UserManagement";
import { getCurrentUserDetails } from "@/app/lib/actions/user.check";
import { redirect } from "next/navigation";

const UserManagement = async () => {
  const user = await getCurrentUserDetails();
  if (!user) {
    redirect("/auth/login");
  }

  return <UserManagementComponent userDetails={user} />;
};

export default UserManagement;
