"use client";

import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Percent, 
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PnLSummaryCardsProps {
  data: {
    totalPortfolioValue: number;
    totalRealizedPnL: number;
    totalUnrealizedPnL: number;
    weightedAverageYield: number;
    weightedAverageDuration: number;
  };
  isLoading: boolean;
}

export const PnLSummaryCards: React.FC<PnLSummaryCardsProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-32 bg-neutral-100 rounded-2xl" />
      ))}
    </div>;
  }

  const cards = [
    {
      title: "Total Portfolio Value",
      value: `KES ${data.totalPortfolioValue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Realized P&L",
      value: `KES ${data.totalRealizedPnL.toLocaleString()}`,
      icon: data.totalRealizedPnL >= 0 ? TrendingUp : TrendingDown,
      color: data.totalRealizedPnL >= 0 ? "text-green-600" : "text-red-600",
      bg: data.totalRealizedPnL >= 0 ? "bg-green-50" : "bg-red-50",
      trend: data.totalRealizedPnL >= 0 ? ArrowUpRight : ArrowDownRight
    },
    {
      title: "Unrealized P&L",
      value: `KES ${data.totalUnrealizedPnL.toLocaleString()}`,
      icon: data.totalUnrealizedPnL >= 0 ? TrendingUp : TrendingDown,
      color: data.totalUnrealizedPnL >= 0 ? "text-emerald-600" : "text-orange-600",
      bg: data.totalUnrealizedPnL >= 0 ? "bg-emerald-50" : "bg-orange-50"
    },
    {
      title: "Avg. Yield (WAY)",
      value: `${data.weightedAverageYield.toFixed(2)}%`,
      icon: Percent,
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      title: "Avg. Duration",
      value: `${data.weightedAverageDuration.toFixed(2)} Yrs`,
      icon: Clock,
      color: "text-slate-600",
      bg: "bg-slate-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => (
        <Card key={idx} className="border-none shadow-none bg-white rounded-[24px] overflow-hidden group hover:shadow-xl hover:shadow-neutral-100/50 transition-all duration-500">
          <CardHeader className="pb-2 pt-6">
            <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-2`}>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <CardTitle className="text-xs font-black uppercase tracking-widest text-neutral-400">
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black tracking-tighter">
                {card.value}
              </span>
              {card.trend && <card.trend className={`h-4 w-4 ${card.color}`} />}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
