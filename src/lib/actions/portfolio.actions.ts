"use server";
import { cookies } from "next/headers";
import api from '@/lib/api';

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
    const response = await api.post('/V1/services/add-new-portfolio', data, {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error adding new portfolio:', error);
    return null;
  }
};

export const getUserPortfolios = async (email: string) => {
  try {
    const url = `/V1/services/get-user-portfolios?user_email=${encodeURIComponent(email)}`;
    const response = await api.post(url, {}, {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user portfolios:', error);
    return null;
  }
};

export const updatePortfolio = async (data: any) => {
  try {
    const response = await api.post('/V1/services/update-portfolio', data, {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error updating portfolio:', error);
    return null;
  }
};

export const exportPortfolioToExcel = async (portfolioId: number) => {
  try {
    const headers = await getHeaders();
    const response = await api.get(`/V1/services/export-portfolio-excel?portfolio_id=${portfolioId}`, {
      headers: {
        "Cookie": headers["Cookie"],
      },
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting portfolio to Excel:', error);
    return null;
  }
};

export const getActivityLogs = async () => {
  try {
    const response = await api.get('/V1/services/get-activity-logs', {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return { success: false, data: [] };
  }
};

export const getUserIntermediaries = async (email: string) => {
  try {
    const response = await api.get(`/V1/services/get-user-intermediaries?email=${encodeURIComponent(email)}`, {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user intermediaries:', error);
    return { success: false, data: [] };
  }
};

export const getPortfolioAnalytics = async (portfolioId: number) => {
  try {
    const response = await api.get(`/V1/bonds/portfolio-summary/${portfolioId}`, {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching portfolio analytics:', error);
    return { success: false, message: "Connection error" };
  }
};


