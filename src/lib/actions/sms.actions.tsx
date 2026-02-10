"use server";

import { getCurrentApiUrl } from "./api.actions";

export const sendSms = async (data: {
  body: string;
  recipients: string[];
  schedule_date?: string;
  send_to_role?: string;
  created_by: string;
}) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) return null;

    const response = await fetch(`${BASE_URL}/V1/communication/create-sms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("SMS sending result:", result);

    return result;
  } catch (error) {
    console.error("Error sending SMS:", error);
    return {
      success: false,
      message: "Failed to send SMS",
    };
  }
};
