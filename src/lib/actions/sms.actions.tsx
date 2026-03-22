"use server";

import api from "@/lib/api";

export const sendSms = async (data: {
  body: string;
  recipients: string[];
  schedule_date?: string;
  send_to_role?: string;
  created_by: string;
}) => {
  try {
    const response = await api.post('/V1/communication/create-sms', data);
    const result = response.data;
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

