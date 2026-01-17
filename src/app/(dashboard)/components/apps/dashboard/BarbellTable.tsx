"use client";
import { useEffect,useState } from 'react';
import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getBarbellAndBullet } from '@/lib/actions/api.actions';

import { RefreshCw } from 'lucide-react';

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
        console.log("Fetched barbell and bullet data:", data);
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
    <Card className="col-span-12">
      <CardHeader className="">
        <CardTitle className="text-center text-xl font-semibold text-[#8B6B07]">
          Barbell vs Bullet Indicators
        </CardTitle>
      </CardHeader>
      {loading && (
        <div className="flex items-center justify-center py-4">
          <RefreshCw className="h-4 w-4 animate-spin mr-2" />
          <span className="text-sm text-muted-foreground font-semibold text-green-500" >Loading...</span>
        </div>
      )}
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-primary text-primary-foreground">Bond Issue</TableHead>
                <TableHead className="bg-primary text-primary-foreground text-right">Coupon</TableHead>
                <TableHead className="bg-primary text-primary-foreground text-right">Maturity (Yrs)*</TableHead>
                <TableHead className="bg-primary text-primary-foreground text-right">M Duration</TableHead>
                {/* <TableHead className="bg-primary text-primary-foreground text-right">Indicative Bid-Offer</TableHead> */}
                <TableHead className="bg-primary text-primary-foreground text-right">Spot YTM</TableHead>
                {/* <TableHead className="bg-primary text-primary-foreground text-right">Expected Return</TableHead> */}
                <TableHead className="bg-primary text-primary-foreground text-right">Last 91 Days</TableHead>
                <TableHead className="bg-primary text-primary-foreground text-center">Liquidity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Barbell Section */}
              <TableRow className="bg-muted/50">
                <TableCell colSpan={8} className="font-semibold">Barbell:</TableCell>
              </TableRow>
              {bondData.filter(bond => bond.type === 'Short' || bond.type === 'Long').map((bond, index) => (
                <TableRow key={index} className={bond.type === 'Average' ? 'bg-muted/30' : ''}>
                  <TableCell>
                    <div className="flex gap-4">
                      <span className="w-16 text-muted-foreground">{bond.type}</span>
                      <span>{bond.bondIssue}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{bond.coupon.toFixed(3)}</TableCell>
                  <TableCell className="text-right">{bond.dtmDtc.toFixed(4)}</TableCell>
                  <TableCell className="text-right text-[#8B6B07]">{bond.duration.toFixed(3)}</TableCell>
                  {/* <TableCell className="text-right">{bond.indicativeBidOffer}</TableCell> */}
                  <TableCell className="text-right">{(bond.spotYtm * 100).toFixed(4)}%</TableCell>
                  {/* <TableCell className="text-right">{(bond.expectedReturn * 100).toFixed(2)}%</TableCell> */}
                  <TableCell className="text-right">{bond.last91Days ? bond.last91Days.toFixed(2) : 'N/A'}</TableCell>
                  <TableCell className="text-center">{bond.liquidity}</TableCell>
                </TableRow>
              ))}
              {/* Average for Barbell */}
              <TableRow className="bg-muted/30">
                <TableCell>
                  <div className="flex gap-4">
                    <span className="w-16 text-muted-foreground">Average</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">{calculateAverage('Short', 'coupon').toFixed(3)}</TableCell>
                <TableCell className="text-right">{calculateAverage('Short', 'dtmDtc').toFixed(4)}</TableCell>
                <TableCell className="text-right text-[#8B6B07]">{calculateAverage('Short', 'duration').toFixed(3)}</TableCell>
                {/* <TableCell className="text-right">-</TableCell> */}
                <TableCell className="text-right">{(calculateAverage('Short', 'spotYtm') * 100).toFixed(4)}%</TableCell>
                {/* <TableCell className="text-right">{(calculateAverage('Short', 'expectedReturn') * 100).toFixed(2)}%</TableCell> */}
                <TableCell className="text-right">-</TableCell>
                <TableCell className="text-center">-</TableCell>
              </TableRow>
                          
              {/* Bullet Section */}
              <TableRow className="bg-muted/50">
                <TableCell colSpan={8} className="font-semibold">Bullet:</TableCell>
              </TableRow>
              {bondData.filter(bond => bond.type === 'Medium').map((bond, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex gap-4">
                      <span className="w-16 text-muted-foreground">{bond.type}</span>
                      <span>{bond.bondIssue}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{bond.coupon.toFixed(3)}</TableCell>
                  <TableCell className="text-right">{bond.dtmDtc.toFixed(4)}</TableCell>
                  <TableCell className="text-right text-[#8B6B07]">{bond.duration.toFixed(3)}</TableCell>
                  {/* <TableCell className="text-right">{bond.indicativeBidOffer}</TableCell> */}
                  <TableCell className="text-right">{(bond.spotYtm * 100).toFixed(4)}%</TableCell>
                  {/* <TableCell className="text-right">{(bond.expectedReturn * 100).toFixed(2)}%</TableCell> */}
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
