import React from "react";
import MessagesComponent from "./Messages";
import { getCurrentUserDetails } from "@/app/lib/actions/user.check";
import { redirect } from "next/navigation";

const Messages = async () => {
  const user = await getCurrentUserDetails();
  if (!user) {
    redirect("/auth/login");
  }

  return <MessagesComponent userDetails={user} />;
};

export default Messages;
