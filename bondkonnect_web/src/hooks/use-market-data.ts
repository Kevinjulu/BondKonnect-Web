import { useQuery } from "@tanstack/react-query";
import { 
  getSpotYieldCurve, 
  getProjectionBands, 
  getHistoricalBonds, 
  getTableParams,
  getTotalReturnScreen,
  getTotalDurationScreen,
  getBondCalcDetails
} from "@/lib/actions/api.actions";

export const useYieldCurve = () => {
  return useQuery({
    queryKey: ["yield-curve"],
    queryFn: async () => {
      const response = await getSpotYieldCurve();
      return response?.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProjectionBands = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["projection-bands"],
    queryFn: async () => {
      const response = await getProjectionBands();
      return response?.data || { upperBand: [], lowerBand: [] };
    },
    enabled,
    staleTime: 10 * 60 * 1000,
  });
};

export const useHistoricalBonds = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["historical-bonds"],
    queryFn: async () => {
      const response = await getHistoricalBonds();
      return response?.data || { oneWeekAgo: [], oneMonthAgo: [], oneYearAgo: [] };
    },
    enabled,
    staleTime: 10 * 60 * 1000,
  });
};

export const useTableParams = () => {
  return useQuery({
    queryKey: ["table-params"],
    queryFn: async () => {
      const response = await getTableParams();
      return response || null;
    },
    staleTime: 30 * 60 * 1000,
  });
};

export const useTotalReturnScreen = () => {
  return useQuery({
    queryKey: ["total-return-screen"],
    queryFn: async () => {
      const response = await getTotalReturnScreen();
      return response || [];
    },
    staleTime: 60 * 1000, // 1 minute
  });
};

export const useDurationScreen = (targetDuration: number) => {
  return useQuery({
    queryKey: ["duration-screen", targetDuration],
    queryFn: async () => {
      const response = await getTotalDurationScreen(targetDuration);
      return response || [];
    },
    staleTime: 60 * 1000,
  });
};

export const useCalculatorRates = () => {
  return useQuery({
    queryKey: ["calculator-rates"],
    queryFn: async () => {
      const response = await getBondCalcDetails();
      if (response?.data) {
        return {
          nseCommission: response.data.NseCommission || 0.00024,
          nseMinCommission: response.data.NseMinCommission || 1000,
          cmaLevies: response.data.CmaLevies || 0.00011,
          ifbRate: response.data.IfbFiveYrs || 0,
          dailyBasis: response.data.DailyBasis || 364
        };
      }
      return {
        nseCommission: 0.00024,
        nseMinCommission: 1000,
        cmaLevies: 0.00011,
        ifbRate: 0,
        dailyBasis: 364
      };
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};
