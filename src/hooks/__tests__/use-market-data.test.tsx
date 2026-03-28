import { renderHook, waitFor } from '@testing-library/react';
import { 
  useYieldCurve, 
  useProjectionBands, 
  useHistoricalBonds, 
  useCalculatorRates 
} from '../use-market-data';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import * as apiActions from '@/lib/actions/api.actions';

// Mock the API actions
vi.mock('@/lib/actions/api.actions', () => ({
  getSpotYieldCurve: vi.fn(),
  getProjectionBands: vi.fn(),
  getHistoricalBonds: vi.fn(),
  getTableParams: vi.fn(),
  getTotalReturnScreen: vi.fn(),
  getTotalDurationScreen: vi.fn(),
  getBondCalcDetails: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'Wrapper'; // Add display name
  return Wrapper;
};

describe('useMarketData hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('useYieldCurve fetches and returns data', async () => {
    const mockData = [{ tenor: 1, yield: 10 }];
    (apiActions.getSpotYieldCurve as any).mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useYieldCurve(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });

  it('useProjectionBands fetches and returns data', async () => {
    const mockData = { upperBand: [1, 2], lowerBand: [0, 1] };
    (apiActions.getProjectionBands as any).mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useProjectionBands(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });

  it('useCalculatorRates returns mapped data and handles defaults', async () => {
    const mockResponse = {
      data: {
        NseCommission: 0.0005,
        NseMinCommission: 500,
        CmaLevies: 0.0002,
        IfbFiveYrs: 12.5,
        DailyBasis: 365
      }
    };
    (apiActions.getBondCalcDetails as any).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useCalculatorRates(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({
      nseCommission: 0.0005,
      nseMinCommission: 500,
      cmaLevies: 0.0002,
      ifbRate: 12.5,
      dailyBasis: 365
    });
  });

  it('useCalculatorRates returns defaults when API fails or returns null', async () => {
    (apiActions.getBondCalcDetails as any).mockResolvedValue(null);

    const { result } = renderHook(() => useCalculatorRates(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.nseCommission).toBe(0.00024); // Default value
    expect(result.current.data?.dailyBasis).toBe(364); // Default value
  });
});
