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

export const getEmailTemplates = async () => {
  try {
    const response = await fetch(`${BASE_URL}/V1/communication/get-email-templates`, {
      method: "GET",
      headers: await getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching email templates:', error);
    return { success: false, data: [] };
  }
};

export const createEmail = async (data: any) => {
  try {
    const response = await fetch(`${BASE_URL}/V1/communication/create-email`, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating email:', error);
    return { success: false, message: "Failed to create email" };
  }
};

// Messaging Actions
export const getMessageParticipants = async (email?: string) => {
  try {
    const response = await fetch(`${BASE_URL}/V1/communication/get-message-participants${email ? `?email=${encodeURIComponent(email)}` : ''}`, {
      method: "GET",
      headers: await getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching message participants:', error);
    return { success: false, data: [] };
  }
};

export const getUserThread = async (threadId: string | number) => {
  try {
    const response = await fetch(`${BASE_URL}/V1/communication/get-user-thread?thread_id=${threadId}`, {
      method: "GET",
      headers: await getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching user thread:', error);
    return { success: false, data: null };
  }
};

export const replyMessage = async (data: any) => {
  try {
    const response = await fetch(`${BASE_URL}/V1/communication/reply-message`, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error('Error replying to message:', error);
    return { success: false, message: "Failed to reply to message" };
  }
};

export const getMessagesByUser = async (email: string) => {
  try {
    const response = await fetch(`${BASE_URL}/V1/communication/get-messages-by-user?email=${encodeURIComponent(email)}`, {
      method: "GET",
      headers: await getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching messages by user:', error);
    return { success: false, data: [] };
  }
};

export const markMessageAsRead = async (email: string, messageId: number) => {
  try {
    const response = await fetch(`${BASE_URL}/V1/communication/mark-message-as-read`, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify({ email, message_id: messageId }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error marking message as read:', error);
    return { success: false, message: "Failed to mark message as read" };
  }
};

export const getAllUnreadMessagesForUser = async (email: string) => {
  try {
    const response = await fetch(`${BASE_URL}/V1/communication/get-all-unread-messages?email=${encodeURIComponent(email)}`, {
      method: "GET",
      headers: await getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching unread messages:', error);
    return { success: false, data: [] };
  }
};

// Notification Actions
export const markOneNotificationsAsRead = async (email: string, notificationId: number) => {
  try {
    const response = await fetch(`${BASE_URL}/V1/communication/mark-notification-as-read`, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify({ email, notification_id: notificationId }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { success: false, message: "Failed to mark notification as read" };
  }
};

export const markOneNotificationsAsFavoriteOrArchive = async (email: string, notificationId: number, field: string, value: number) => {
  try {
    const response = await fetch(`${BASE_URL}/V1/communication/mark-notification-status`, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify({ email, notification_id: notificationId, field, value }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error marking notification status:', error);
    return { success: false, message: "Failed to update notification status" };
  }
};

export const approveIntermediaryClient = async (data: any) => {
  try {
    const response = await fetch(`${BASE_URL}/V1/communication/approve-intermediary-client`, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error('Error approving intermediary client:', error);
    return { success: false, message: "Failed to approve client" };
  }
};

