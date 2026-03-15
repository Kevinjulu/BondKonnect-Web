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

export const addNewPortfolio = async (data: any) => {
  try {
    const response = await fetch(`${BASE_URL}/V1/services/add-new-portfolio`, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error('Error adding new portfolio:', error);
    return null;
  }
};

export const getUserPortfolios = async (email: string) => {
  try {
    const url = `${BASE_URL}/V1/services/get-user-portfolios?user_email=${encodeURIComponent(email)}`;
    const response = await fetch(url, {
      method: "POST",
      headers: await getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching user portfolios:', error);
    return null;
  }
};

export const updatePortfolio = async (data: any) => {
  try {
    const response = await fetch(`${BASE_URL}/V1/services/update-portfolio`, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating portfolio:', error);
    return null;
  }
};

export const exportPortfolioToExcel = async (portfolioId: number) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${BASE_URL}/V1/services/export-portfolio-excel?portfolio_id=${portfolioId}`, {
      method: "GET",
      headers: {
        "Cookie": headers["Cookie"],
      },
    });
    return await response.blob();
  } catch (error) {
    console.error('Error exporting portfolio to Excel:', error);
    return null;
  }
};

export const getActivityLogs = async () => {
  try {
    const response = await fetch(`${BASE_URL}/V1/services/get-activity-logs`, {
      method: "GET",
      headers: await getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return { success: false, data: [] };
  }
};

export const getUserIntermediaries = async (email: string) => {
  try {
    const response = await fetch(`${BASE_URL}/V1/services/get-user-intermediaries?email=${encodeURIComponent(email)}`, {
      method: "GET",
      headers: await getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching user intermediaries:', error);
    return { success: false, data: [] };
  }
};

export const getPortfolioAnalytics = async (portfolioId: number) => {
  try {
    const response = await fetch(`${BASE_URL}/V1/bonds/portfolio-summary/${portfolioId}`, {
      method: "GET",
      headers: await getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching portfolio analytics:', error);
    return { success: false, message: "Connection error" };
  }
};

