"use client";
import { useEffect, useState, useCallback } from 'react';
import * as React from 'react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle,} from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {  getTotalReturnScreen,getTotalDurationScreen } from '@/lib/actions/api.actions';
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

export function BondScreensTable() {
  const [activeTab, setActiveTab] = useState<'total-return' | 'duration'>('total-return')
  const [targetDuration, setTargetDuration] = useState("4.500")
  const [totalReturnData, setTotalReturnData] = useState<BondData[]>([]);
  const [durationData, setDurationData] = useState<BondData[]>([]);
  const [loading, setLoading] = useState(true);
  const [durationLoading, setDurationLoading] = useState(false);

  const fetchDurationData = useCallback(async (customTargetDuration?: string) => {
    try {
      const targetValue = customTargetDuration || targetDuration;
      const data2 = await getTotalDurationScreen(parseFloat(targetValue));
      const formattedData2 = data2?.map((bond: any) => ({
        Id: bond.Id,
        BondIssueNo: bond.BondIssueNo,
        Coupon: parseFloat(bond.Coupon),
        DtmYrs: parseFloat(bond.DtmYrs),
        Duration: parseFloat(bond.Duration),
        ExpectedShortfall: parseFloat(bond.ExpectedShortfall),
        SpotYield: parseFloat(bond.SpotYield),
        ExpectedReturn: parseFloat(bond.ExpectedReturn),
        Last91Days: (bond.Last91Days),
        LqdRank: bond.LqdRank,
      })) || [];
      setDurationData(formattedData2);
    } catch (error) {
      console.error('Error fetching duration data:', error);
    }
  }, [targetDuration]);

  useEffect(() => {
    const fetchTotalReturnData = async () => {
      try {
        const data = await getTotalReturnScreen();
        const formattedData = (data ?? []).map((bond: any) => ({
          Id: bond.Id,
          BondIssueNo: bond.BondIssueNo,
          Coupon: parseFloat(bond.Coupon),
          DtmYrs: parseFloat(bond.DtmYrs),
          Duration: parseFloat(bond.Duration),
          ExpectedShortfall: parseFloat(bond.ExpectedShortfall),
          SpotYield: parseFloat(bond.SpotYield),
          ExpectedReturn: parseFloat(bond.ExpectedReturn),
          Last91Days: (bond.Last91Days),
          LqdRank: bond.LqdRank,
        }));
        setTotalReturnData(formattedData);
      } catch (error) {
        console.error('Error fetching total return data:', error);
      }
    };

    const fetchInitialData = async () => {
      setLoading(true);
      await fetchTotalReturnData();
      await fetchDurationData();
      setLoading(false);
    };

    fetchInitialData();
  }, [fetchDurationData]);

  const handleTargetDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetDuration(e.target.value);
  };

  const handleRefreshDurationData = useCallback(async () => {
    if (!targetDuration || targetDuration.trim() === '') return;
    setDurationLoading(true);
    try {
      await fetchDurationData(targetDuration);
    } catch (error) {
      console.error('Error refreshing duration data:', error);
    } finally {
      setDurationLoading(false);
    }
  }, [targetDuration, fetchDurationData]);

  useEffect(() => {
    if (activeTab === 'duration' && targetDuration) {
      const timeoutId = setTimeout(() => {
        handleRefreshDurationData();
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [targetDuration, activeTab, handleRefreshDurationData]);

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
          
          {activeTab === 'duration' && (
            <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-lg border border-neutral-200 shadow-sm">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider whitespace-nowrap">Target M Duration</span>
              <Input
                type="number"
                step="0.001"
                value={targetDuration}
                onChange={handleTargetDurationChange}
                className="w-24 h-8 bg-neutral-50 border-neutral-200 text-black font-bold focus:ring-black text-xs"
                placeholder="4.500"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefreshDurationData}
                disabled={durationLoading}
                className="h-8 w-8 rounded-md bg-black text-white hover:bg-neutral-800 border-none"
              >
                <RefreshCw className={cn("h-3.5 w-3.5", durationLoading && "animate-spin")} />
              </Button>
            </div>
          )}
        </div>
        <CardTitle className="text-xl font-bold text-black uppercase tracking-tight mt-4 flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-neutral-400" />
          {activeTab === 'total-return' ? 'Market Liquidity Analysis' : 'Duration Sensitivity Screen'}
        </CardTitle>
      </CardHeader>
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-black opacity-20" />
          <span className="ml-3 text-sm font-bold text-neutral-500">Retrieving Bond Data...</span>
        </div>
      ) : (
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-50 border-b border-neutral-200 hover:bg-neutral-50">
                <TableHead className="font-bold text-neutral-600 uppercase text-xs">Rank</TableHead>
                <TableHead className="font-bold text-neutral-600 uppercase text-xs">Bond Issue</TableHead>
                <TableHead className="font-bold text-neutral-600 uppercase text-xs text-right">Coupon</TableHead>
                <TableHead className="font-bold text-neutral-600 uppercase text-xs text-right">Maturity (Yrs)</TableHead>
                <TableHead className="font-bold text-neutral-600 uppercase text-xs text-right">M Duration</TableHead>
                <TableHead className="font-bold text-neutral-600 uppercase text-xs text-right">Spot YTM</TableHead>
                <TableHead className="font-bold text-neutral-600 uppercase text-xs text-right">Days Traded</TableHead>
                <TableHead className="font-bold text-neutral-600 uppercase text-xs text-center">Liquidity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(activeTab === 'total-return' ? totalReturnData : durationData).map((bond, index) => (
                <TableRow key={bond.Id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                  <TableCell className="font-medium text-neutral-400">{index + 1}</TableCell>
                  <TableCell className="font-semibold text-black">{bond.BondIssueNo}</TableCell>
                  <TableCell className="text-right">{bond.Coupon.toFixed(3)}</TableCell>
                  <TableCell className="text-right">{bond.DtmYrs.toFixed(4)}</TableCell>
                  <TableCell className="text-right">{bond.Duration.toFixed(3)}</TableCell>
                  <TableCell className="text-right font-bold">{(bond.SpotYield * 100).toFixed(4)}%</TableCell>
                  <TableCell className="text-right">{bond.Last91Days}</TableCell>
                  <TableCell className="text-center font-bold">{bond.LqdRank}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      )}
    </Card>
  )
}