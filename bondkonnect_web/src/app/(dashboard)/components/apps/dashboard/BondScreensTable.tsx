"use client";
import { useState } from 'react';
import * as React from 'react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle,} from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { useTotalReturnScreen, useDurationScreen } from '@/hooks/use-market-data';
import { RefreshCw, Loader2, BarChart2 } from 'lucide-react';

interface BondData {
  Id: number;
  BondIssueNo: string;
  Coupon: number;
  DtmYrs: number;
  Duration: number;
  ExpectedShortfall: number;
  SpotYield: number;
  ExpectedReturn: number;
  Last91Days: number;
  LqdRank: string;
}

const formatBondData = (data: any): BondData[] => {
  // Ensure we are dealing with an array. 
  // API might return { success: true, data: [...] } or just [...]
  const arrayData = Array.isArray(data) ? data : (data?.data && Array.isArray(data.data) ? data.data : []);

  return arrayData.map((bond: any) => ({
    Id: bond.Id,
    BondIssueNo: bond.BondIssueNo,
    Coupon: parseFloat(bond.Coupon) || 0,
    DtmYrs: parseFloat(bond.DtmYrs) || 0,
    Duration: parseFloat(bond.Duration) || 0,
    ExpectedShortfall: parseFloat(bond.ExpectedShortfall) || 0,
    SpotYield: parseFloat(bond.SpotYield) || 0,
    ExpectedReturn: parseFloat(bond.ExpectedReturn) || 0,
    Last91Days: bond.Last91Days || 0,
    LqdRank: bond.LqdRank || 'N/A',
  }));
};

export function BondScreensTable() {
  const [activeTab, setActiveTab] = useState<'total-return' | 'duration'>('total-return')
  const [targetDuration, setTargetDuration] = useState("4.500")

  // Use the new hooks
  const { data: rawReturnData = [], isLoading: isReturnLoading, refetch: refetchReturn } = useTotalReturnScreen();
  const { data: rawDurationData = [], isLoading: isDurationLoading, refetch: refetchDuration } = useDurationScreen(parseFloat(targetDuration));

  const displayData = React.useMemo(() => {
    const rawData = activeTab === 'total-return' ? rawReturnData : rawDurationData;
    return formatBondData(rawData);
  }, [activeTab, rawReturnData, rawDurationData]);

  const handleRefresh = () => {
    if (activeTab === 'total-return') refetchReturn();
    else refetchDuration();
  };

  const isLoading = activeTab === 'total-return' ? isReturnLoading : isDurationLoading;

  return (
    <Card className="col-span-12 border border-neutral-200 shadow-sm bg-white text-black">
      <CardHeader className="pb-4 border-b border-neutral-100 bg-neutral-50 rounded-t-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-2 bg-neutral-100 p-1 rounded-lg w-fit">
            <Button
              variant={activeTab === 'total-return' ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab('total-return')}
              className={cn(
                "h-8 px-4 rounded-md transition-all",
                activeTab === 'total-return' ? "bg-black text-white shadow-sm" : "text-neutral-500 hover:text-black hover:bg-white"
              )}
            >
              Liquidity
            </Button>
            <Button
              variant={activeTab === 'duration' ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab('duration')}
              className={cn(
                "h-8 px-4 rounded-md transition-all",
                activeTab === 'duration' ? "bg-black text-white shadow-sm" : "text-neutral-500 hover:text-black hover:bg-white"
              )}
            >
              Duration Screen
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            {activeTab === 'duration' && (
              <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-neutral-200 shadow-sm">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Target M Duration</span>
                <Input
                  type="number"
                  step="0.001"
                  value={targetDuration}
                  onChange={(e) => setTargetDuration(e.target.value)}
                  className="w-20 h-7 bg-neutral-50 border-none text-black font-bold text-[10px] focus-visible:ring-0"
                />
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isLoading}
              className="h-8 w-8 rounded-md bg-white border border-neutral-200 text-black hover:bg-neutral-50"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
            </Button>
          </div>
        </div>
        <CardTitle className="text-xl font-bold text-black uppercase tracking-tight mt-4 flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-neutral-400" />
          {activeTab === 'total-return' ? 'Market Liquidity Analysis' : 'Duration Sensitivity Screen'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        {isLoading && displayData.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-black opacity-20" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-50 border-b border-neutral-200">
                <TableHead className="font-bold text-neutral-600 uppercase text-[10px]">Rank</TableHead>
                <TableHead className="font-bold text-neutral-600 uppercase text-[10px]">Bond Issue</TableHead>
                <TableHead className="font-bold text-neutral-600 uppercase text-[10px] text-right">Coupon</TableHead>
                <TableHead className="font-bold text-neutral-600 uppercase text-[10px] text-right">Maturity (Yrs)</TableHead>
                <TableHead className="font-bold text-neutral-600 uppercase text-[10px] text-right">M Duration</TableHead>
                <TableHead className="font-bold text-neutral-600 uppercase text-[10px] text-right">Spot YTM</TableHead>
                <TableHead className="font-bold text-neutral-600 uppercase text-[10px] text-right">Days Traded</TableHead>
                <TableHead className="font-bold text-neutral-600 uppercase text-[10px] text-center">Liquidity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayData.map((bond, index) => (
                <TableRow key={bond.Id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                  <TableCell className="text-[11px] font-medium text-neutral-400">{index + 1}</TableCell>
                  <TableCell className="text-[11px] font-bold text-black">{bond.BondIssueNo}</TableCell>
                  <TableCell className="text-[11px] text-right">{bond.Coupon.toFixed(3)}</TableCell>
                  <TableCell className="text-[11px] text-right">{bond.DtmYrs.toFixed(4)}</TableCell>
                  <TableCell className="text-[11px] text-right">{bond.Duration.toFixed(3)}</TableCell>
                  <TableCell className="text-[11px] text-right font-bold">{(bond.SpotYield * 100).toFixed(2)}%</TableCell>
                  <TableCell className="text-[11px] text-right">{bond.Last91Days}</TableCell>
                  <TableCell className="text-center">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[9px] font-black uppercase",
                      bond.LqdRank === 'HIGH' ? "bg-green-100 text-green-700" : 
                      bond.LqdRank === 'MED' ? "bg-blue-100 text-blue-700" : "bg-neutral-100 text-neutral-600"
                    )}>
                      {bond.LqdRank}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}