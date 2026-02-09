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

export const getSpotYieldCurve = async () => {
  try {
    const response = await fetch(`${BASE_URL}/V1/services/get-spot-yield-curve`, {
      method: "GET",
      headers: await getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching spot yield curve:', error);
    throw error;
  }
};

export const getProjectionBands = async () => {
  try {
    const response = await fetch(`${BASE_URL}/V1/services/get-projection-bands`, {
      method: "GET",
      headers: await getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching projection bands:', error);
    throw error;
  }
};

export const getHistoricalBonds = async () => {
  try {
    const response = await fetch(`${BASE_URL}/V1/services/get-historical-bands`, {
      method: "GET",
      headers: await getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching historical bonds:', error);
    throw error;
  }
};

export const getTableParams = async () => {
  try {
    const response = await fetch(`${BASE_URL}/V1/services/get-table-params`, {
      method: "GET",
      headers: await getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching table params:', error);
    throw error;
  }
};

export const getTotalReturnScreen = async () => {
  try {
    const response = await fetch(`${BASE_URL}/V1/services/total-return-screen`, {
      method: "POST",
      headers: await getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching total return screen:', error);
    throw error;
  }
};

export const getTotalDurationScreen = async (targetDuration?: number) => {
  try {
    const requestBody = targetDuration !== undefined ? { targetDuration } : {};
    const response = await fetch(`${BASE_URL}/V1/services/total-duration-screen`, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify(requestBody),
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching total duration screen:', error);
    throw error;
  }
};

export const getSecondaryMarketBonds = async () => {
    try {
      const response = await fetch(`${BASE_URL}/V1/services/get-secondary-market-bonds`, {
        method: "GET",
        headers: await getHeaders(),
        next: { revalidate: 3000 }
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching secondary market bonds:', error);
      throw error;
    }
  };
  
  export const getPrimaryMarketBonds = async () => {
    try {
      const response = await fetch(`${BASE_URL}/V1/services/get-primary-market-bonds`, {
        method: "GET",
        headers: await getHeaders(),
        next: { revalidate: 3000 }
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching primary market bonds:', error);
      throw error;
    }
  };

export const getBondCalcDetails = async () => {
    try {
      const response = await fetch(`${BASE_URL}/V1/services/get-bondCalc-Details`, {
        method: "GET",
        headers: await getHeaders(),
        next: { revalidate: 3000 }
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching bond calc details:', error);
      throw error;
    }
  };

  export const getStatsTable = async () => {
    try {
      const response = await fetch(`${BASE_URL}/V1/services/stats-table`, {
        method: "POST",
        headers: await getHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching stats table:', error);
      throw error;
    }
  };

