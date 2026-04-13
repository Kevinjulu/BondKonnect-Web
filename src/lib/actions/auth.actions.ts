"use server";
import { cookies } from "next/headers";
import api from "@/lib/api";

export const getHeaders = async (cookie?: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  };
  if (cookie) headers["Cookie"] = cookie;
  return headers;
};

export const login = async (queryParams: string) => {
  try {
    const response = await api.post(`/V1/auth/user-login?${queryParams}`, {}, {
      headers: await getHeaders(),
    });
    return { success: true, data: response.data, message: response.data.message };
  } catch (error: any) {
    console.error(`[Server Action] login error:`, error);
    return {
      success: false,
      message: error.response?.data?.message || "API Connection Failed",
      status: error.response?.status || 503
    };
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/V1/auth/user-logout', {}, {
      headers: await getHeaders()
    });
    return { success: true, data: response.data, message: response.data.message };
  } catch (error: any) {
    console.error("Logout error:", error);
    return { success: false, message: error.response?.data?.message || "Network error during logout" };
  }
};

export const register = async (data: any) => {
  try {
    const response = await api.post('/V1/auth/user-register', data, {
      headers: await getHeaders()
    });
    return { success: true, data: response.data, message: response.data.message };
  } catch (error: any) {
    console.error("Registration error:", error);
    return { success: false, message: error.response?.data?.message || "Could not connect to server", status: error.response?.status || 503 };
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.post('/V1/auth/get-user-details', {}, {
      headers: await getHeaders()
    });
    return { success: true, data: response.data, message: response.data.message };
  } catch (error: any) {
    console.error("Get user details error:", error);
    return { success: false, message: error.response?.data?.message || "Server unreachable", status: error.response?.status || 503 };
  }
};

export const getAllUsers = async () => {
  try {
    const response = await api.post('/V1/auth/get-all-users', {}, {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error: any) {
    console.error("Get all users error:", error);
    throw error;
  }
};

export const getAdminUsers = async () => {
  try {
    const response = await api.get('/V1/auth/get-admin-users', {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching admin users:', error);
    throw error;
  }
};
  
export const setActiveRole = async (data: FormData) => {
  try {
    const response = await api.post('/V1/auth/set-active-role', data, {
      headers: await getHeaders()
    });
    return response.data;
  } catch (error: any) {
    console.error("Error setting active role:", error);
    return null;
  }
};

export async function otpVerify(queryParams: string) {
  try {
    const response = await api.post(`/V1/auth/verify-otp?${queryParams}`, {}, {
      headers: await getHeaders(),
    });
    return { success: true, data: response.data.data, message: response.data.message };
  } catch (error: any) {
    console.error("OTP verify error:", error);
    return { 
      success: false, 
      message: error.response?.data?.message || "OTP verification failed", 
      status: error.response?.status || 503 
    };
  }
}

export const resendOtp = async (queryParams: string) => {
  try {
    const response = await api.post(`/V1/auth/resend-otp?${queryParams}`, {}, {
      headers: await getHeaders(),
    });
    return { success: true, message: response.data.message || "OTP resent" };
  } catch (error: any) {
    console.error("Resend OTP error:", error);
    return { 
      success: false, 
      message: error.response?.data?.message || "Resending OTP failed", 
      status: error.response?.status || 503 
    };
  }
};

export const forgotPassword = async (queryParams: string) => {
  try {
    const response = await api.post(`/V1/auth/user-reset-password?${queryParams}`, {}, {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error: any) {
    console.error(`Forgot password error:`, error);
    return { 
      success: false, 
      message: error.response?.data?.message || "Server unreachable",
    };
  }
};

export const setPassword = async (data: any) => {
  try {
    const response = await api.post('/V1/auth/set-password', data, {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error: any) {
    console.error("Set password error:", error);
    return { success: false, message: error.response?.data?.message || "Server unreachable" };
  }
};

export const generateCsrfToken = async () => {
  try {
    const response = await api.get('/V1/auth/generate-csrf-token', {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error: any) {
    console.error("Generate CSRF token error:", error);
    return { success: false, token: "" };
  }
};

// Role & Permission Management
export const getRoles = async () => {
  try {
    const response = await api.get('/V1/auth/get-roles', {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error: any) {
    console.error("Get roles error:", error);
    return { success: false, data: [] };
  }
};

export const getUsersByRole = async (data: { role_id: number }) => {
  try {
    const response = await api.get(`/V1/auth/get-users-by-role?role_id=${data.role_id}`, {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error: any) {
    console.error("Get users by role error:", error);
    return { success: false, data: [] };
  }
};

export const getRolePermissions = async (data: { role_id: number }) => {
  try {
    const response = await api.get(`/V1/auth/get-role-permissions?role_id=${data.role_id}`, {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error: any) {
    console.error("Get role permissions error:", error);
    return { success: false, data: [] };
  }
};

export const getUserPermissions = async (data: { role_id: number, user_email: string }) => {
  try {
    const response = await api.get(`/V1/auth/get-user-permissions?role_id=${data.role_id}&email=${encodeURIComponent(data.user_email)}`, {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error: any) {
    console.error("Get user permissions error:", error);
    return { success: false, data: [] };
  }
};

export const getAllRolesForUser = async (email: string) => {
  try {
    const response = await api.get(`/V1/auth/get-all-roles-for-user?email=${encodeURIComponent(email)}`, {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error: any) {
    console.error("Get all roles for user error:", error);
    return { success: false, data: [] };
  }
};

export const modifyUserPermissions = async (data: any) => {
  try {
    const response = await api.post('/V1/auth/modify-user-permissions', data, {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error: any) {
    console.error("Modify user permissions error:", error);
    return { success: false, message: error.response?.data?.message || "Failed to modify permissions" };
  }
};

export const addUserToNewRole = async (data: any) => {
  try {
    const response = await api.post('/V1/auth/add-user-to-new-role', data, {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error: any) {
    console.error("Add user to new role error:", error);
    return { success: false, message: error.response?.data?.message || "Failed to add user to role" };
  }
};

export const suspendUser = async (userId: number) => {
  try {
    const response = await api.post('/V1/auth/suspend-user', { user_id: userId }, {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error: any) {
    console.error("Suspend user error:", error);
    return { success: false, message: error.response?.data?.message || "Failed to suspend user" };
  }
};

export const reactivateUser = async (userId: number) => {
  try {
    const response = await api.post('/V1/auth/reactivate-user', { user_id: userId }, {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error: any) {
    console.error("Reactivate user error:", error);
    return { success: false, message: error.response?.data?.message || "Failed to reactivate user" };
  }
};

export const getAllBrokersAndDealers = async () => {
  try {
    const response = await api.get('/V1/auth/get-all-brokers-and-dealers', {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error: any) {
    console.error("Get all brokers and dealers error:", error);
    return { success: false, data: [] };
  }
};

export const completeIntermediaryRegistration = async (data: any) => {
  try {
    const response = await api.post('/V1/auth/complete-intermediary-registration', data, {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error: any) {
    console.error("Complete intermediary registration error:", error);
    return { success: false, message: error.response?.data?.message || "Failed to complete registration" };
  }
};
