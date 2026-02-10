"use server";
import { cookies } from "next/headers";

const APP_ENVIRONMENT = process.env.APP_ENV;
let BASE_URL = "";

if (APP_ENVIRONMENT === "production") {
  BASE_URL = process.env.NEXT_PUBLIC_BK_PROD_API_URL ?? "";
} else if (APP_ENVIRONMENT === "uat") {
  BASE_URL = process.env.NEXT_PUBLIC_BK_UAT_API_URL ?? "";
} else {
  BASE_URL = process.env.NEXT_PUBLIC_BK_DEV_API_URL ?? "";
}

const getHeaders = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("k-o-t");

  return {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
    "Cookie": token ? `k-o-t=${token.value}` : "",
  };
};

export const getUnreadNotifications = async (email: string) => {
  try {
    const response = await fetch(`${BASE_URL}/V1/communication/get-unread-notifications?email=${encodeURIComponent(email)}`, {
      method: "GET",
      headers: await getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching unread notifications:', error);
    return null;
  }
};

export const getAllNotifications = async (email: string) => {
    try {
      const response = await fetch(`${BASE_URL}/V1/communication/get-all-notifications?email=${encodeURIComponent(email)}`, {
        method: "GET",
        headers: await getHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching all notifications:', error);
      return null;
    }
  };

export const markAllNotificationsAsRead = async (email: string) => {
  try {
    const response = await fetch(`${BASE_URL}/V1/communication/mark-all-as-read`, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify({ email })
    });
    return await response.json();
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    return null;
  }
};

export const submitMessage = async (data: FormData) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${BASE_URL}/V1/communication/send-message`, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": headers["Ocp-Apim-Subscription-Key"],
        "Cookie": headers["Cookie"],
      },
      body: data
    });
    return await response.json();
  } catch (error) {
    console.error('Error submitting message:', error);
    return null;
  }
};

export const getEmails = async (email: string) => {
  try {
    const response = await fetch(`${BASE_URL}/V1/communication/get-emails?email=${encodeURIComponent(email)}`, {
      method: "GET",
      headers: await getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching emails:', error);
    return { success: false, data: [] };
  }
};

