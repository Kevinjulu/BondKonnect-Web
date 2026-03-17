"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useUserPortfolios, usePortfolioAnalytics } from '@/hooks/use-portfolio-data';
import { PnLSummaryCards } from '../../components/apps/portfolio-analytics/PnLSummaryCards';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { LayoutPanelLeft, RefreshCcw, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function PortfolioAnalyticsPage() {
  const { user } = useAuth();
  const { data: portfolios, isLoading: portfoliosLoading } = useUserPortfolios(user?.email || '');
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<number | null>(null);

  // Set initial portfolio once loaded
  useEffect(() => {
    if (portfolios && portfolios.length > 0 && !selectedPortfolioId) {
      setSelectedPortfolioId(portfolios[0].Id);
    }
  }, [portfolios, selectedPortfolioId]);

  const { 
    data: analytics, 
    isLoading: analyticsLoading, 
    refetch 
  } = usePortfolioAnalytics(selectedPortfolioId);

  return (
    <div className="p-6 lg:p-10 space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-neutral-400 mb-1">
            <LayoutPanelLeft className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Institutional Terminal</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-black">
            Performance <span className="text-neutral-300">&</span> Analytics
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Select 
            value={selectedPortfolioId?.toString()} 
            onValueChange={(val) => setSelectedPortfolioId(parseInt(val))}
          >
            <SelectTrigger className="w-[240px] h-12 rounded-xl border-neutral-100 font-bold">
              <SelectValue placeholder="Select Portfolio" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-neutral-100">
              {portfolios?.map((p: any) => (
                <SelectItem key={p.Id} value={p.Id.toString()} className="font-medium">
                  {p.Name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <button 
            onClick={() => refetch()}
            className="w-12 h-12 flex items-center justify-center rounded-xl border border-neutral-100 hover:bg-neutral-50 transition-colors"
          >
            <RefreshCcw className={`h-4 w-4 text-neutral-400 ${analyticsLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <PnLSummaryCards 
        data={analytics || {
          totalPortfolioValue: 0,
          totalRealizedPnL: 0,
          totalUnrealizedPnL: 0,
          weightedAverageYield: 0,
          weightedAverageDuration: 0
        }} 
        isLoading={analyticsLoading} 
      />

      {!selectedPortfolioId && !portfoliosLoading && (
        <Alert className="rounded-[24px] border-blue-50 bg-blue-50/50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertTitle className="font-bold text-blue-900">No Portfolio Selected</AlertTitle>
          <AlertDescription className="text-blue-700">
            Please select a portfolio from the dropdown above to view performance analytics.
          </AlertDescription>
        </Alert>
      )}

      {/* Dashboard Grid Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-[400px] bg-white rounded-[32px] border border-neutral-50 flex items-center justify-center text-neutral-300 font-black uppercase tracking-widest text-xs">
          Yield Distribution Chart (Coming Soon)
        </div>
        <div className="h-[400px] bg-white rounded-[32px] border border-neutral-50 flex items-center justify-center text-neutral-300 font-black uppercase tracking-widest text-xs">
          Maturity Profile (Coming Soon)
        </div>
      </div>
    </div>
  );
}
