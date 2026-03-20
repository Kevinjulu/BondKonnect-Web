"use server";
import { cookies } from "next/headers";
import { ModulePermissions, ActionPermissions } from "@/app/config/permissions";

import { getBaseApiUrl } from '../utils/url-resolver';

const BASE_URL = getBaseApiUrl();

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
    const url = `${BASE_URL}/V1/auth/user-login?${queryParams}`;
    console.log("Server Action: Attempting login at URL:", url);
    console.log("Using BASE_URL:", BASE_URL);

    const response = await fetch(url, {
      method: "POST",
      headers: await getHeaders(),
      credentials: "include",
    });
    
    console.log("Server Action: Login response status:", response.status);
    const result = await response.json();
    console.log("Server Action: Login result:", JSON.stringify(result).substring(0, 100));
    
    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Login failed",
        errors: result.errors || null,
        status: response.status
      };
    }
    
    return {
      success: true,
      data: result,
      message: result.message || "Login successful"
    };
  } catch (error: any) {
    console.error("CRITICAL: Server Action Login error:", error);
    return {
      success: false,
      message: `API Connectivity Error: ${error.message || 'Unknown error'}. URL: ${BASE_URL}`,
      status: 503
    };
  }
};

export const logout = async (cookie: string) => {
  try {
    const response = await fetch(`${BASE_URL}/V1/auth/user-logout`, {
      method: "POST",
      headers: await getHeaders(cookie),
      credentials: "include",
    });
    const result = await response.json();
    return {
      success: response.ok,
      message: result.message || (response.ok ? "Logged out" : "Logout failed")
    };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, message: "Network error during logout" };
  }
};

export const register = async (data: any) => {
  try {
    const response = await fetch(`${BASE_URL}/V1/auth/user-register`, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify(data),
      credentials: "include",
    });
    const result = await response.json();
    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Registration failed",
        errors: result.errors || null,
        status: response.status
      };
    }
    return { success: true, data: result, message: result.message || "Registration successful" };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, message: "Could not connect to server", status: 503 };
  }
};

export const getCurrentUser = async (queryParams: string) => {
  try {
    const response = await fetch(`${BASE_URL}/V1/auth/get-user-details`, {
      method: "POST",
      headers: await getHeaders(queryParams),
      credentials: "include",
    });
    const result = await response.json();
    if (!response.ok) {
      return {
        success: false,
        message: "Session expired or invalid",
        status: response.status
      };
    }
    return { success: true, data: result };
  } catch (error) {
    console.error("Get user details error:", error);
    return { success: false, message: "Server unreachable", status: 503 };
  }
};

export const getAllUsers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/V1/auth/get-all-users`, {
      method: "POST",
      headers: await getHeaders(),
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.error("Get all users error:", error);
    throw error;
  }
};

export const getAdminUsers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/V1/auth/get-admin-users`, {
        method: 'GET',
        headers: await getHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch admin users');
      return await response.json();
    } catch (error) {
      console.error('Error fetching admin users:', error);
      throw error;
    }
  };
  
export const setActiveRole = async (data: FormData, token: string) => {
    try {
      const response = await fetch(`${BASE_URL}/V1/auth/set-active-role`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Cookie: token,
        },
        body: data,
      });
      return await response.json();
    } catch (error) {
      console.error("Error setting active role:", error);
      return null;
    }
  };

export async function otpVerify(queryParams: string) {
  try {
    const url = `${BASE_URL}/V1/auth/verify-otp?${queryParams}`;
    const response = await fetch(url, {
      method: "POST",
      headers: await getHeaders(),
      credentials: "include",
    });
    const result = await response.json();
    if (!response.ok) {
      return { success: false, message: result.message || "OTP verification failed", status: response.status };
    }
    return { success: true, data: result.data, message: result.message };
  } catch (error) {
    console.error("OTP verify error:", error);
    return { success: false, message: "Server unreachable", status: 503 };
  }
}

export const resendOtp = async (queryParams: string) => {
  try {
    const url = `${BASE_URL}/V1/auth/resend-otp?${queryParams}`;
    const response = await fetch(url, {
      method: "POST",
      headers: await getHeaders(),
      credentials: "include",
    });
    const result = await response.json();
    if (!response.ok) {
      return { success: false, message: result.message || "Resending OTP failed", status: response.status };
    }
    return { success: true, message: result.message || "OTP resent" };
  } catch (error) {
    console.error("Resend OTP error:", error);
    return { success: false, message: "Server unreachable", status: 503 };
  }
};

export const forgotPassword = async (queryParams: string) => {
  try {
    const url = `${BASE_URL}/V1/auth/user-reset-password?${queryParams}`;
    const response = await fetch(url, {
      method: "POST",
      headers: await getHeaders(),
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.error("Forgot password error:", error);
    return { success: false, message: "Server unreachable" };
  }
};

export const setPassword = async (data: any) => {
  try {
    const response = await fetch(`${BASE_URL}/V1/auth/set-password`, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Set password error:", error);
    return { success: false, message: "Server unreachable" };
  }
};

export const generateCsrfToken = async () => {
  try {
    const response = await fetch(`${BASE_URL}/V1/auth/generate-csrf-token`, {
      method: "GET",
      headers: await getHeaders(),
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.error("Generate CSRF token error:", error);
    return { success: false, token: "" };
  }
};

// Role & Permission Management
export const getRoles = async () => {
  try {
    const response = await fetch(`${BASE_URL}/V1/auth/get-roles`, {
      method: "GET",
      headers: await getHeaders(),
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.error("Get roles error:", error);
    return { success: false, data: [] };
  }
};

export const getUsersByRole = async (data: { role_id: number }) => {
  try {
    const response = await fetch(`${BASE_URL}/V1/auth/get-users-by-role?role_id=${data.role_id}`, {
      method: "GET",
      headers: await getHeaders(),
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.error("Get users by role error:", error);
    return { success: false, data: [] };
  }
};

export const getRolePermissions = async (data: { role_id: number }) => {
  try {
    const response = await fetch(`${BASE_URL}/V1/auth/get-role-permissions?role_id=${data.role_id}`, {
      method: "GET",
      headers: await getHeaders(),
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.error("Get role permissions error:", error);
    return { success: false, data: [] };
  }
};

export const getUserPermissions = async (data: { role_id: number, user_email: string }) => {
  try {
    const response = await fetch(`${BASE_URL}/V1/auth/get-user-permissions?role_id=${data.role_id}&email=${encodeURIComponent(data.user_email)}`, {
      method: "GET",
      headers: await getHeaders(),
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.error("Get user permissions error:", error);
    return { success: false, data: [] };
  }
};

export const getAllRolesForUser = async (email: string) => {
  try {
    const response = await fetch(`${BASE_URL}/V1/auth/get-all-roles-for-user?email=${encodeURIComponent(email)}`, {
      method: "GET",
      headers: await getHeaders(),
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.error("Get all roles for user error:", error);
    return { success: false, data: [] };
  }
};

export const modifyUserPermissions = async (data: any) => {
  try {
    const response = await fetch(`${BASE_URL}/V1/auth/modify-user-permissions`, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Modify user permissions error:", error);
    return { success: false, message: "Failed to modify permissions" };
  }
};

export const addUserToNewRole = async (data: any) => {
  try {
    const response = await fetch(`${BASE_URL}/V1/auth/add-user-to-new-role`, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Add user to new role error:", error);
    return { success: false, message: "Failed to add user to role" };
  }
};

export const suspendUser = async (userId: number) => {
  try {
    const response = await fetch(`${BASE_URL}/V1/auth/suspend-user`, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify({ user_id: userId }),
    });
    return await response.json();
  } catch (error) {
    console.error("Suspend user error:", error);
    return { success: false, message: "Failed to suspend user" };
  }
};

export const reactivateUser = async (userId: number) => {
  try {
    const response = await fetch(`${BASE_URL}/V1/auth/reactivate-user`, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify({ user_id: userId }),
    });
    return await response.json();
  } catch (error) {
    console.error("Reactivate user error:", error);
    return { success: false, message: "Failed to reactivate user" };
  }
};

export const getAllBrokersAndDealers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/V1/auth/get-all-brokers-and-dealers`, {
      method: "GET",
      headers: await getHeaders(),
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.error("Get all brokers and dealers error:", error);
    return { success: false, data: [] };
  }
};

export const completeIntermediaryRegistration = async (data: any) => {
  try {
    const response = await fetch(`${BASE_URL}/V1/auth/complete-intermediary-registration`, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Complete intermediary registration error:", error);
    return { success: false, message: "Failed to complete registration" };
  }
};
