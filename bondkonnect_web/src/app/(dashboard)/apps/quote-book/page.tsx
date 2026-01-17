import React from "react";
import QuoteBookComponent from "./QuoteBook";
import { getCurrentUserDetails } from "@/lib/actions/user.check";
import { redirect } from "next/navigation";

const QuoteBook = async () => {
  const user = await getCurrentUserDetails();
  if (!user) {
    redirect("/auth/login");
  }

  return <QuoteBookComponent userDetails={user} />;
};

export default QuoteBook;
