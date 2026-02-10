"use server";

import { getCurrentApiUrl } from "./api.actions";

// M-Pesa Types
export interface MpesaPaymentData {
  phone: string;
  amount: number;
  plan_id: number;
  user_email: string;
}

// PayPal Types
export interface PaypalOrderData {
  amount: number;
  plan_id: number;
}

export interface PaypalCaptureData {
  order_id: string;
  user_email: string;
  plan_id: number;
}

// M-Pesa Actions
export const initiateMpesaPayment = async (data: MpesaPaymentData) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) throw new Error("API URL not found");

    const response = await fetch(`${BASE_URL}/V1/payments/mpesa/stk-push`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || "Failed to initiate M-Pesa payment");
    }

    return result;
  } catch (error) {
    console.error("Error initiating M-Pesa payment:", error);
    throw error;
  }
};

export const checkMpesaStatus = async (checkoutId: string) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) throw new Error("API URL not found");

    const response = await fetch(
      `${BASE_URL}/V1/payments/mpesa/check-status?checkout_id=${checkoutId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
        // Don't throw immediately, let the caller handle the status
        return { success: false, message: result.message || "Failed to check status" };
    }

    return result;
  } catch (error) {
    console.error("Error checking M-Pesa status:", error);
    throw error;
  }
};

// PayPal Actions
export const createPaypalOrder = async (data: PaypalOrderData) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) throw new Error("API URL not found");

    const response = await fetch(`${BASE_URL}/V1/payments/paypal/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to create PayPal order");
    }

    return result;
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    throw error;
  }
};

export const capturePaypalOrder = async (data: PaypalCaptureData) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) throw new Error("API URL not found");

    const response = await fetch(`${BASE_URL}/V1/payments/paypal/capture-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to capture PayPal order");
    }

    return result;
  } catch (error) {
    console.error("Error capturing PayPal order:", error);
    throw error;
  }
};
