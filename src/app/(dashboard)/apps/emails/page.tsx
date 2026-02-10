"use server";

import { Plus } from "lucide-react";
import { redirect } from "next/navigation";
import PageContainer from "../../components/container/PageContainer";
import { Button } from "@/components/ui/button";
import EmailsComponent from "./EmailsComponent";
import { CreateEmailDialog } from "./CreateEmailDialog";
import { getCurrentUserDetails } from "@/lib/actions/user.check";
import React from "react";



const Emails = async () => {
  const user = await getCurrentUserDetails();
  if (!user) {
    redirect("/auth/login");
  }

  return <EmailsComponent userDetails={user} />;
};

export default Emails;
