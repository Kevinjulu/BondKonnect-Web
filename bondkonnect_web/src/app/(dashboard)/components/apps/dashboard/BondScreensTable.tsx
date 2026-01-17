"use client";
import { useEffect, useState, useCallback } from 'react';
import * as React from 'react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle,} from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {  getTotalReturnScreen,getTotalDurationScreen } from '@/lib/actions/api.actions';
import { RefreshCw } from 'lucide-react'; // Import refresh icon



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

  // const data = await getData()
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
      console.log("Fetched duration data:", typeof(data2)); // Log the fetched duration data
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
      console.error('Error fetching duration data:', error); // Log any errors
    }
  }, [targetDuration]);

  useEffect(() => {
    const fetchTotalReturnData = async () => {
      try {
        const data = await getTotalReturnScreen();
        console.log("Fetched total return data:", data); // Log the fetched total return data
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
        console.error('Error fetching total return data:', error); // Log any errors
      }
    };

    const fetchInitialData = async () => {
      setLoading(true);
      await fetchTotalReturnData();
      await fetchDurationData(); // Fetch initial duration data
      setLoading(false);
    };

    fetchInitialData();
  }, [ fetchDurationData]);



  const handleTargetDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setTargetDuration(newValue);
  };

  const handleRefreshDurationData = useCallback(async () => {
    if (!targetDuration || targetDuration.trim() === '') {
      console.warn('Target duration is empty');
      return;
    }

    setDurationLoading(true);
    try {
      await fetchDurationData(targetDuration);
    } catch (error) {
      console.error('Error refreshing duration data:', error);
    } finally {
      setDurationLoading(false);
    }
  }, [targetDuration, fetchDurationData]);

  // Auto-refresh when target duration changes (with debounce)
  useEffect(() => {
    if (activeTab === 'duration' && targetDuration) {
      const timeoutId = setTimeout(() => {
        handleRefreshDurationData();
      }, 1000); // 1 second debounce

      return () => clearTimeout(timeoutId);
    }
  }, [targetDuration, activeTab, handleRefreshDurationData]);

  return (
    <Card className="col-span-12">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 pb-2">
            <button
              onClick={() => setActiveTab('total-return')}
              className={cn(
                "flex items-center space-x-2 rounded-full px-4 py-1",
                activeTab === 'total-return' 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-muted"
              )}
            >
              <div className={cn(
                "h-3 w-3 rounded-full border",
                activeTab === 'total-return' ? "bg-primary-foreground" : "bg-transparent"
              )} />
              <span>Liquidity</span>
            </button>
            <button
              onClick={() => setActiveTab('duration')}
              className={cn(
                "flex items-center space-x-2 rounded-full px-4 py-1",
                activeTab === 'duration' 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-muted"
              )}
            >
              <div className={cn(
                "h-3 w-3 rounded-full border",
                activeTab === 'duration' ? "bg-primary-foreground" : "bg-transparent"
              )} />
              <span>Duration Screen</span>
            </button>
          </div>
          {activeTab === 'duration' && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Target M Duration</span>
              <Input
                type="number"
                step="0.001"
                value={targetDuration}
                onChange={handleTargetDurationChange}
                className="w-28"
                placeholder="4.500"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshDurationData}
                disabled={durationLoading}
                className="p-2"
              >
                <RefreshCw className={cn("h-4 w-4", durationLoading && "animate-spin")} />
              </Button>
            </div>
          )}
        </div>
        <CardTitle className="text-xl">
          {activeTab === 'total-return' ? 'Liquidity' : 'Duration Screen'}
        </CardTitle>
      </CardHeader>
      {loading && (
        <div className="flex items-center justify-center py-4">
          <RefreshCw className="h-4 w-4 animate-spin mr-2" />
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      )}
        <CardContent className="pt-6">
          {activeTab === 'duration' && durationLoading && (
            <div className="flex items-center justify-center py-4">
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-muted-foreground">Updating duration data...</span>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-primary text-primary-foreground"></TableHead>
                <TableHead className="bg-primary text-primary-foreground"></TableHead>
                <TableHead className="bg-primary text-primary-foreground"></TableHead>
                <TableHead className="bg-primary text-primary-foreground"></TableHead>
                <TableHead className="bg-primary text-primary-foreground text-center" colSpan={1}>
                  Risk
                </TableHead>
                <TableHead className="bg-primary text-primary-foreground text-center" colSpan={1}>
                  Return
                </TableHead>
                <TableHead className="bg-primary text-primary-foreground"> Days Traded</TableHead>
                <TableHead className="bg-primary text-primary-foreground">Liquidity</TableHead>
              </TableRow>
              <TableRow>
                <TableHead className="bg-primary/80 text-primary-foreground">Rank</TableHead>
                <TableHead className="bg-primary/80 text-primary-foreground">Bond Issue</TableHead>
                <TableHead className="bg-primary/80 text-primary-foreground">Coupon</TableHead>
                <TableHead className="bg-primary/80 text-primary-foreground">Maturity (Yrs)</TableHead>
                <TableHead className="bg-primary/80 text-primary-foreground">M Duration</TableHead>
                <TableHead className="bg-primary/80 text-primary-foreground">Spot YTM</TableHead>
                <TableHead className="bg-primary/80 text-primary-foreground">Last 91 Days</TableHead>
                <TableHead className="bg-primary/80 text-primary-foreground">Rank</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(activeTab === 'total-return' ? totalReturnData : durationData).map((bond, index) => (
                <TableRow key={bond.Id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{bond.BondIssueNo}</TableCell>
                  <TableCell>{bond.Coupon}</TableCell>
                  <TableCell>{bond.DtmYrs}</TableCell>
                  <TableCell>{bond.Duration}</TableCell>
                  <TableCell>{bond.SpotYield.toFixed(10)}</TableCell>
                  <TableCell>{bond.Last91Days}</TableCell>
                  <TableCell>{bond.LqdRank}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      
    </Card>
  )
}
