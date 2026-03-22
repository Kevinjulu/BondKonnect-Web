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

export const getSpotYieldCurve = async () => {
  try {
    const response = await api.get('/V1/services/get-spot-yield-curve', {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching spot yield curve:', error);
    throw error;
  }
};

export const getProjectionBands = async () => {
  try {
    const response = await api.get('/V1/services/get-projection-bands', {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching projection bands:', error);
    throw error;
  }
};

export const getHistoricalBonds = async () => {
  try {
    const response = await api.get('/V1/services/get-historical-bands', {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching historical bonds:', error);
    throw error;
  }
};

export const getTableParams = async () => {
  try {
    const response = await api.get('/V1/services/get-table-params', {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching table params:', error);
    throw error;
  }
};

export const getTotalReturnScreen = async () => {
  try {
    const response = await api.post('/V1/services/total-return-screen', {}, {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching total return screen:', error);
    throw error;
  }
};

export const getTotalDurationScreen = async (targetDuration?: number) => {
  try {
    const requestBody = targetDuration !== undefined ? { targetDuration } : {};
    const response = await api.post('/V1/services/total-duration-screen', requestBody, {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching total duration screen:', error);
    throw error;
  }
};

export const getSecondaryMarketBonds = async () => {
    try {
      const response = await api.get('/V1/services/get-secondary-market-bonds', {
        headers: await getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching secondary market bonds:', error);
      throw error;
    }
  };
  
  export const getPrimaryMarketBonds = async () => {
    try {
      const response = await api.get('/V1/services/get-primary-market-bonds', {
        headers: await getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching primary market bonds:', error);
      throw error;
    }
  };

export const getBondCalcDetails = async () => {
    try {
      const response = await api.get('/V1/services/get-bondCalc-Details', {
        headers: await getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching bond calc details:', error);
      throw error;
    }
  };

  export const getStatsTable = async () => {
    try {
      const response = await api.post('/V1/services/stats-table', {}, {
        headers: await getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching stats table:', error);
      throw error;
    }
  };

export const getBarbellAndBullet = async () => {
  try {
    const response = await api.get('/V1/services/get-barbell-and-bullet', {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching barbell and bullet data:', error);
    return { success: false, data: [] };
  }
};

// Quote Actions
export const getQuotes = async (email?: string) => {
  try {
    const response = await api.get(`/V1/services/get-quotes${email ? `?email=${encodeURIComponent(email)}` : ''}`, {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return { success: false, data: [] };
  }
};

export const sendToQuoteBook = async (data: any) => {
  try {
    const response = await api.post('/V1/services/send-to-quote-book', data, {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error sending to quote book:', error);
    return { success: false, message: "Failed to send to quote book" };
  }
};

export const activateQuote = async (data: { quote_id: number, user_email: string } | number) => {
  try {
    const body = typeof data === 'number' ? { quote_id: data } : data;
    const response = await api.post('/V1/services/activate-quote', body, {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error activating quote:', error);
    return { success: false, message: "Failed to activate quote" };
  }
};

export const suspendQuote = async (data: { quote_id: number, user_email: string } | number) => {
  try {
    const body = typeof data === 'number' ? { quote_id: data } : data;
    const response = await api.post('/V1/services/suspend-quote', body, {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error suspending quote:', error);
    return { success: false, message: "Failed to suspend quote" };
  }
};

export const getBondMarketPerformance = async () => {
  try {
    const response = await api.get('/V1/services/get-bond-market-performance', {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching bond market performance:', error);
    return { success: false, data: [] };
  }
};

export const getViewingPartyQuotes = async (email: string) => {
  try {
    const response = await api.get(`/V1/services/get-viewing-party-quotes?email=${encodeURIComponent(email)}`, {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching viewing party quotes:', error);
    return { success: false, data: [] };
  }
};


