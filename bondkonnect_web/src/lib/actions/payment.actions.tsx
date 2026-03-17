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
export const initiateMpesaStkPush = async (data: MpesaPaymentData) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) throw new Error("API URL not found");

    const response = await fetch(`${BASE_URL}/V1/payments/mpesa/stk-push`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

export const initiateMpesaPayment = initiateMpesaStkPush;

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

// Subscription Actions
export const getAllSubscriptionPlans = async () => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    const response = await fetch(`${BASE_URL}/V1/financials/get-all-sub-plans`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching subscription plans:", error);
    return { success: false, data: [] };
  }
};

export const getUserSubscriptions = async (email: string) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    const payload = { user_email: email };
    const response = await fetch(`${BASE_URL}/V1/financials/get-user-subscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching user subscriptions:", error);
    return { success: false, data: [] };
  }
};

export const getAllFeatures = async () => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    const response = await fetch(`${BASE_URL}/V1/financials/get-all-sub-features`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching all features:", error);
    return { success: false, data: [] };
  }
};

export const getAllFeatureCategories = async () => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    const response = await fetch(`${BASE_URL}/V1/financials/get-all-feature-categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching all feature categories:", error);
    return { success: false, data: [] };
  }
};

// Transaction Actions
export const createTransaction = async (data: any) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    // Normalize potential `email` -> `user_email` for backend expectations
    const payload = { ...data, user_email: data.user_email ?? data.email };
    delete payload.email;

    const response = await fetch(`${BASE_URL}/V1/services/create-transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creating transaction:", error);
    return { success: false, message: "Failed to create transaction" };
  }
};

export const getUserTransactions = async (email: string) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    const payload = { user_email: email };
    const response = await fetch(`${BASE_URL}/V1/services/get-user-transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    return { success: false, data: [] };
  }
};

export const markTransactionStatus = async (data: any) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    // Normalize field names expected by backend: transaction_id -> trans_id, email -> user_email
    const payload = { ...data };
    if (payload.transaction_id && !payload.trans_id) {
      payload.trans_id = payload.transaction_id;
      delete payload.transaction_id;
    }
    payload.user_email = payload.user_email ?? payload.email;
    delete payload.email;

    const response = await fetch(`${BASE_URL}/V1/services/mark-transaction-status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (error) {
    console.error("Error marking transaction status:", error);
    return { success: false, message: "Failed to update transaction status" };
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
