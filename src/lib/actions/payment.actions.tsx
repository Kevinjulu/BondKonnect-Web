"use server";

import api from "@/lib/api";

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
    const response = await api.post('/V1/payments/mpesa/stk-push', data);
    return response.data;
  } catch (error: any) {
    console.error("Error initiating M-Pesa payment:", error);
    throw error;
  }
};

export const initiateMpesaPayment = initiateMpesaStkPush;

export const checkMpesaStatus = async (checkoutId: string) => {
  try {
    const response = await api.get(`/V1/payments/mpesa/check-status?checkout_id=${checkoutId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error checking M-Pesa status:", error);
    // Return success: false if handled, otherwise throw
    if (error.response?.data) return error.response.data;
    throw error;
  }
};

// Subscription Actions
export const getAllSubscriptionPlans = async () => {
  try {
    const response = await api.get('/V1/financials/get-all-sub-plans');
    return response.data;
  } catch (error) {
    console.error("Error fetching subscription plans:", error);
    return { success: false, data: [] };
  }
};

export const getUserSubscriptions = async (email: string) => {
  try {
    const payload = { user_email: email };
    const response = await api.post('/V1/financials/get-user-subscriptions', payload);
    return response.data;
  } catch (error) {
    console.error("Error fetching user subscriptions:", error);
    return { success: false, data: [] };
  }
};

export const getAllFeatures = async () => {
  try {
    const response = await api.get('/V1/financials/get-all-sub-features');
    return response.data;
  } catch (error) {
    console.error("Error fetching all features:", error);
    return { success: false, data: [] };
  }
};

export const getAllFeatureCategories = async () => {
  try {
    const response = await api.get('/V1/financials/get-all-feature-categories');
    return response.data;
  } catch (error) {
    console.error("Error fetching all feature categories:", error);
    return { success: false, data: [] };
  }
};

// Transaction Actions
export const createTransaction = async (data: any) => {
  try {
    // Normalize potential `email` -> `user_email` for backend expectations
    const payload = { ...data, user_email: data.user_email ?? data.email };
    delete payload.email;

    const response = await api.post('/V1/services/create-transaction', payload);
    return response.data;
  } catch (error) {
    console.error("Error creating transaction:", error);
    return { success: false, message: "Failed to create transaction" };
  }
};

export const getUserTransactions = async (email: string) => {
  try {
    const payload = { user_email: email };
    const response = await api.post('/V1/services/get-user-transactions', payload);
    return response.data;
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    return { success: false, data: [] };
  }
};

export const markTransactionStatus = async (data: any) => {
  try {
    // Normalize field names expected by backend: transaction_id -> trans_id, email -> user_email
    const payload = { ...data };
    if (payload.transaction_id && !payload.trans_id) {
      payload.trans_id = payload.transaction_id;
      delete payload.transaction_id;
    }
    payload.user_email = payload.user_email ?? payload.email;
    delete payload.email;

    const response = await api.post('/V1/services/mark-transaction-status', payload);
    return response.data;
  } catch (error) {
    console.error("Error marking transaction status:", error);
    return { success: false, message: "Failed to update transaction status" };
  }
};

// PayPal Actions
export const createPaypalOrder = async (data: PaypalOrderData) => {
  try {
    const response = await api.post('/V1/payments/paypal/create-order', data);
    return response.data;
  } catch (error: any) {
    console.error("Error creating PayPal order:", error);
    throw error;
  }
};

export const capturePaypalOrder = async (data: PaypalCaptureData) => {
  try {
    const response = await api.post('/V1/payments/paypal/capture-order', data);
    return response.data;
  } catch (error: any) {
    console.error("Error capturing PayPal order:", error);
    throw error;
  }
};

