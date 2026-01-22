"use client";
import { useEffect,useState } from 'react';
import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getBarbellAndBullet } from '@/lib/actions/api.actions';
import { Loader2 } from 'lucide-react';

interface BondData {
  type: 'Short' | 'Long' | 'Average' | 'Medium'
  bondIssue: string
  coupon: number
  dtmDtc: number
  duration: number
  indicativeBidOffer: string
  spotYtm: number
  expectedReturn: number
  liquidity: string
  spotYield?: number
  spread?: number
  last91Days?: number | null
}

interface ApiBondData {
  BondIssueNo: string
  Coupon: string
  DtmYrs: string
  Duration: string
  SpotYield: string
  Spread: string
  ExpectedReturn: string
  LqdRank: string
  Last91Days: string
}

export function Barbell() {
  const [bondData, setBondData] = useState<BondData[]>([]);
  const [loading, setLoading] = useState(true);

  const calculateIndicativeBidOffer = (spotYield: number | null, spread: number): string => {
    if (spotYield === null) {
      return '';
    }
    const lowerBound = ((spotYield - spread) * 100).toFixed(2);
    const upperBound = ((spotYield + spread) * 100).toFixed(2);
    return `${lowerBound}% - ${upperBound}%`;
  };
  
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getBarbellAndBullet();
        const formattedData = [
          ...data.short.map((bond: ApiBondData) => ({
            type: 'Short' as const,
            bondIssue: bond.BondIssueNo,
            coupon: parseFloat(bond.Coupon),
            dtmDtc: parseFloat(bond.DtmYrs),
            duration: parseFloat(bond.Duration),
            indicativeBidOffer: calculateIndicativeBidOffer(parseFloat(bond.SpotYield), parseFloat(bond.Spread)),
            spotYtm: bond.SpotYield ? parseFloat(bond.SpotYield) : 0,
            expectedReturn: parseFloat(bond.ExpectedReturn),
            liquidity: bond.LqdRank,
            spotYield: parseFloat(bond.SpotYield),
            spread: parseFloat(bond.Spread),
            last91Days: parseFloat(bond.Last91Days),
          })),
          ...data.long.map((bond: ApiBondData) => ({
            type: 'Long' as const,
            bondIssue: bond.BondIssueNo,
            coupon: parseFloat(bond.Coupon),
            dtmDtc: parseFloat(bond.DtmYrs),
            duration: parseFloat(bond.Duration),
            indicativeBidOffer: calculateIndicativeBidOffer(parseFloat(bond.SpotYield), parseFloat(bond.Spread)),
            spotYtm: bond.SpotYield ? parseFloat(bond.SpotYield) : 0,
            expectedReturn: parseFloat(bond.ExpectedReturn),
            liquidity: bond.LqdRank,
            spread: parseFloat(bond.Spread),
            last91Days: parseFloat(bond.Last91Days),
          })),
          ...data.bullet.map((bond: ApiBondData) => ({
            type: 'Medium' as const,
            bondIssue: bond.BondIssueNo,
            coupon: parseFloat(bond.Coupon),
            dtmDtc: parseFloat(bond.DtmYrs),
            duration: parseFloat(bond.Duration),
            indicativeBidOffer: calculateIndicativeBidOffer(parseFloat(bond.SpotYield), parseFloat(bond.Spread)),
            spotYtm: bond.SpotYield ? parseFloat(bond.SpotYield) : 0,
            expectedReturn: parseFloat(bond.ExpectedReturn),
            liquidity: bond.LqdRank,
            spread: parseFloat(bond.Spread),
            last91Days: parseFloat(bond.Last91Days),
          })),
        ];
        setBondData(formattedData);
      } catch (error) {
        console.error('Error fetching bonds data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const calculateAverage = (type: 'Short' | 'Long' | 'Medium', field: keyof BondData) => {
    const filteredData = bondData.filter(bond => bond.type === type);
    const sum = filteredData.reduce((acc, bond) => acc + (typeof bond[field] === 'number' ? bond[field] : 0), 0);
    return filteredData.length > 0 ? sum / filteredData.length : 0;
  };

  return (
    <Card className="col-span-12 border border-neutral-200 shadow-sm bg-white text-black">
      <CardHeader className="border-b border-neutral-100 bg-neutral-50">
        <CardTitle className="text-center text-xl font-bold text-black uppercase tracking-tight">
          Barbell vs Bullet Indicators
        </CardTitle>
      </CardHeader>
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-black opacity-20" />
          <span className="ml-2 text-sm font-bold text-neutral-500">Synchronizing Indicators...</span>
        </div>
      )}
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-50 border-b border-neutral-200 hover:bg-neutral-50">
                <TableHead className="font-bold text-neutral-600 uppercase text-xs">Bond Issue</TableHead>
                <TableHead className="font-bold text-neutral-600 uppercase text-xs text-right">Coupon</TableHead>
                <TableHead className="font-bold text-neutral-600 uppercase text-xs text-right">Maturity (Yrs)*</TableHead>
                <TableHead className="font-bold text-neutral-600 uppercase text-xs text-right">M Duration</TableHead>
                <TableHead className="font-bold text-neutral-600 uppercase text-xs text-right">Spot YTM</TableHead>
                <TableHead className="font-bold text-neutral-600 uppercase text-xs text-right">Last 91 Days</TableHead>
                <TableHead className="font-bold text-neutral-600 uppercase text-xs text-center">Liquidity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Barbell Section */}
              <TableRow className="bg-neutral-50 border-b border-neutral-200">
                <TableCell colSpan={7} className="font-bold text-black py-2 px-4">Barbell:</TableCell>
              </TableRow>
              {bondData.filter(bond => bond.type === 'Short' || bond.type === 'Long').map((bond, index) => (
                <TableRow key={index} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                  <TableCell className="px-4">
                    <div className="flex gap-4">
                      <span className="w-16 text-neutral-400 font-medium">{bond.type}</span>
                      <span className="font-semibold">{bond.bondIssue}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{bond.coupon.toFixed(3)}</TableCell>
                  <TableCell className="text-right">{bond.dtmDtc.toFixed(4)}</TableCell>
                  <TableCell className="text-right font-bold text-black">{bond.duration.toFixed(3)}</TableCell>
                  <TableCell className="text-right">{(bond.spotYtm * 100).toFixed(4)}%</TableCell>
                  <TableCell className="text-right">{bond.last91Days ? bond.last91Days.toFixed(2) : 'N/A'}</TableCell>
                  <TableCell className="text-center">{bond.liquidity}</TableCell>
                </TableRow>
              ))}
              {/* Average for Barbell */}
              <TableRow className="bg-neutral-50/50 border-b border-neutral-200">
                <TableCell className="px-4">
                  <div className="flex gap-4">
                    <span className="w-16 text-black font-bold">Average</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">{calculateAverage('Short', 'coupon').toFixed(3)}</TableCell>
                <TableCell className="text-right font-medium">{calculateAverage('Short', 'dtmDtc').toFixed(4)}</TableCell>
                <TableCell className="text-right font-bold text-black">{calculateAverage('Short', 'duration').toFixed(3)}</TableCell>
                <TableCell className="text-right font-bold">{(calculateAverage('Short', 'spotYtm') * 100).toFixed(4)}%</TableCell>
                <TableCell className="text-right">-</TableCell>
                <TableCell className="text-center">-</TableCell>
              </TableRow>
                          
              {/* Bullet Section */}
              <TableRow className="bg-neutral-50 border-b border-neutral-200">
                <TableCell colSpan={7} className="font-bold text-black py-2 px-4">Bullet:</TableCell>
              </TableRow>
              {bondData.filter(bond => bond.type === 'Medium').map((bond, index) => (
                <TableRow key={index} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                  <TableCell className="px-4">
                    <div className="flex gap-4">
                      <span className="w-16 text-neutral-400 font-medium">{bond.type}</span>
                      <span className="font-semibold">{bond.bondIssue}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{bond.coupon.toFixed(3)}</TableCell>
                  <TableCell className="text-right">{bond.dtmDtc.toFixed(4)}</TableCell>
                  <TableCell className="text-right font-bold text-black">{bond.duration.toFixed(3)}</TableCell>
                  <TableCell className="text-right">{(bond.spotYtm * 100).toFixed(4)}%</TableCell>
                  <TableCell className="text-right">{bond.last91Days ? bond.last91Days.toFixed(2) : 'N/A'}</TableCell>
                  <TableCell className="text-center">{bond.liquidity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
    </Card>
  )
}