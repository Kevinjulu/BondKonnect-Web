"use client";
import * as React from 'react'
import { useState, useEffect, useCallback } from "react";
import { format } from 'date-fns'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { getBondCalcDetails, getPrimaryMarketBonds, getSecondaryMarketBonds } from '@/lib/actions/api.actions';
import { Loader2 } from 'lucide-react';

interface BondCalcState {
  valueDate: Date
  marketType: 'secondary' | 'primary'
  selectedBond: string
  calculationType: 'yield' | 'price'
  settlementDate: string
  dirtyPrice: string
  yieldTM: string
  coupon: string
  faceValue: string
  isinNo: string
}

interface BondDetails {
  IfbFiveYrs: number;
  PercentUnderTenYrs: number;
  DailyBasis: number;
  ValueDate?: string;
}

interface SecondaryMarketBond {
  Id: number;
  BondIssueNo: string;
  IssueDate: string;
  MaturityDate: string;
  Coupon: string;
  SpotYield: string;
  Spread: string;
  DirtyPrice: string;
  NextCpnDays: number;
  DtmYrs: string;
  Duration: string;
  MDuration: string;
  Basis: number;
  ValueDate: string;
}

interface PrimaryMarketBond {
  Id: number;
  BondIssueNo: string;
  IssueDate: string;
  MaturityDate: string;
  FirstCallDate: string | null;
  SecondCallDate: string | null;
  ParCall1Percent: string | null;
  ParCall2Percent: string | null;
  PricingMethod: string;
  DtmOrWal: string;
  DayCount: number;
  SpotRate: string;
  ParYield: string;
}

interface BondCalcResult {
  indicativeRange: string;
  previousCoupon: Date | null;
  nextCouponDate: Date | null;
  nextCouponDays: number;
  couponsDue: number;
  couponsPaid: number;
  dirtyPrice: number;
  cleanPrice: number;
  accruedInterest: number;
  bondTenor: number;
  termToMaturity: number;
  consideration: number;
  commissionNSE: number;
  otherLevies: number;
  withholdingTax: number;
  totalPayable: number;
  totalReceivable: number;
}

// Utility functions (same as in BondCalc.tsx)
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addBusinessDays(date: Date, days: number): Date {
  let count = 0;
  const result = new Date(date);
  while (count < days) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) { // Skip Sunday (0) and Saturday (6)
      count++;
    }
  }
  return result;
}

function daysBetween(date1: Date, date2: Date): number {
  const timeDiff = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

function calculateIndicativeRange(spotYield: number, spread: number): string {
  if (!spotYield) return "";
  
  const spreadValue = Math.abs(spread) || 0.01;
  const lowerBound = Math.round((spotYield - spreadValue) * 100 * 100) / 100;
  const upperBound = Math.round((spotYield + spreadValue) * 100 * 100) / 100;
  
  return `${upperBound.toFixed(2)}% - ${lowerBound.toFixed(2)}%`;
}

function calculatePreviousCoupon(
  issueDate: Date,
  settlementDate: Date,
  dailyBasis: number
): Date | null {
  if (dailyBasis === 364 || dailyBasis === 182) {
    const daysSinceIssue = daysBetween(issueDate, settlementDate);
    const couponPeriods = Math.floor(daysSinceIssue / 182);
    
    if (couponPeriods > 0) {
      return addDays(issueDate, couponPeriods * 182);
    }
    return issueDate;
  }
  
  const daysSinceIssue = daysBetween(issueDate, settlementDate);
  const couponPeriods = Math.floor(daysSinceIssue / (dailyBasis / 2));
  
  if (couponPeriods > 0) {
    return addDays(issueDate, couponPeriods * (dailyBasis / 2));
  }
  
  return issueDate;
}

function calculateNextCouponDate(
  issueDate: Date,
  settlementDate: Date,
  maturityDate: Date,
  dailyBasis: number,
  previousCoupon: Date | null
): Date | null {
  if (settlementDate > maturityDate) {
    return maturityDate;
  }
  
  if (dailyBasis === 364 || dailyBasis === 182) {
    if (previousCoupon) {
      const nextCoupon = addDays(previousCoupon, 182);
      return nextCoupon > maturityDate ? maturityDate : nextCoupon;
    }
    const nextCoupon = addDays(issueDate, 182);
    return nextCoupon > maturityDate ? maturityDate : nextCoupon;
  }
  
  if (previousCoupon) {
    const nextCoupon = addDays(previousCoupon, dailyBasis / 2);
    return nextCoupon > maturityDate ? maturityDate : nextCoupon;
  }
  
  const nextCoupon = addDays(issueDate, dailyBasis / 2);
  return nextCoupon > maturityDate ? maturityDate : nextCoupon;
}

function calculateNextCouponDays(
  settlementDate: Date,
  nextCouponDate: Date | null
): number {
  if (!nextCouponDate) return 0;
  return daysBetween(settlementDate, nextCouponDate);
}

function calculateCouponsDue(
  settlementDate: Date,
  maturityDate: Date,
  dailyBasis: number
): number {
  if (settlementDate > maturityDate) return 0;
  
  const remainingDays = daysBetween(settlementDate, maturityDate);
  const couponPeriod = dailyBasis === 364 ? 182 : dailyBasis / 2;
  
  return Math.ceil(remainingDays / couponPeriod);
}

function calculateAccruedInterest(
  settlementDate: Date,
  previousCoupon: Date | null,
  nextCouponDate: Date | null,
  coupon: number,
  dailyBasis: number
): number {
  if (!previousCoupon || !nextCouponDate) return 0;
  
  const couponPeriod = dailyBasis === 364 ? 182 : dailyBasis / 2;
  const nextCouponDays = daysBetween(settlementDate, nextCouponDate);
  
  return ((couponPeriod - nextCouponDays) / couponPeriod) * (coupon / 2);
}

function calculateBondPrice(
  yieldTM: number,
  coupon: number,
  couponsDue: number,
  nextCouponDays: number,
  dailyBasis: number
): number {
  if (yieldTM === 0) return 100 + (coupon / 2) * couponsDue;
  
  const y = yieldTM / 100 / 2; // Semi-annual yield
  const c = coupon / 2; // Semi-annual coupon
  const couponPeriod = dailyBasis === 364 ? 182 : dailyBasis / 2;
  const t = nextCouponDays / couponPeriod;
  
  const discountFactor = Math.pow(1 + y, -t);
  
  if (couponsDue <= 1) {
    return discountFactor * (100 + c);
  }
  
  const annuityValue = c * (1 - Math.pow(1 + y, -(couponsDue - 1))) / y;
  const principalValue = 100 * Math.pow(1 + y, -(couponsDue - 1));
  
  return discountFactor * (annuityValue + principalValue + c);
}

function calculateBondYield(
  dirtyPrice: number,
  coupon: number,
  couponsDue: number,
  nextCouponDays: number,
  dailyBasis: number
): number {
  // Newton-Raphson method for yield calculation
  let yield_guess = 0.1; // 10% initial guess
  const tolerance = 1e-6;
  const maxIterations = 100;
  
  for (let i = 0; i < maxIterations; i++) {
    const price = calculateBondPrice(yield_guess * 100, coupon, couponsDue, nextCouponDays, dailyBasis);
    const error = price - dirtyPrice;
    
    if (Math.abs(error) < tolerance) {
      return yield_guess * 100;
    }
    
    // Calculate derivative for Newton-Raphson
    const delta = 0.0001;
    const priceUp = calculateBondPrice((yield_guess + delta) * 100, coupon, couponsDue, nextCouponDays, dailyBasis);
    const derivative = (priceUp - price) / delta;
    
    if (Math.abs(derivative) < tolerance) break;
    
    yield_guess = yield_guess - error / derivative;
    
    if (yield_guess < 0) yield_guess = 0.001;
    if (yield_guess > 1) yield_guess = 0.999;
  }
  
  return yield_guess * 100;
}

function calculateFinancialValues(
  faceValue: number,
  pricePerHundred: number,
  cleanPrice: number,
  bondIssueNo: string,
  termToMaturity: number,
  calculationType: 'yield' | 'price',
  bondTermUnder10: number,
  bondTermOver10: number,
  ifbRate: number
) {
  let consideration = 0;
  if (faceValue === 0) {
    consideration = 0;
  } else if (calculationType === 'yield') {
    consideration = Math.floor(faceValue * (pricePerHundred / 100));
  } else {
    const excelPrice = Math.floor(pricePerHundred * 1000) / 1000;
    consideration = Math.floor(faceValue * (excelPrice / 100));
  }
  
  const commissionNSE = consideration === 0 ? 0 : 
    Math.max(consideration * 0.00024, 1000);
  
  const otherLevies = consideration === 0 ? 0 : 
    consideration * 0.00011;
  
  let withholdingTax = 0;
  
  if (calculationType === 'yield' || cleanPrice >= 100) {
    withholdingTax = 0;
  } else if (calculationType === 'price' && cleanPrice < 100 && faceValue > 0) {
    const discount = 100 - cleanPrice;
    
    if (bondIssueNo.startsWith('IFB')) {
      withholdingTax = discount * (ifbRate / 100) * (consideration / 100);
    }
  } else {
    withholdingTax = 0;
  }
  
  const totalPayable = consideration === 0 ? 0 : 
    consideration + commissionNSE + otherLevies + withholdingTax;
  
  const totalReceivable = consideration === 0 ? 0 : 
    consideration - commissionNSE - otherLevies - withholdingTax;
  
  return {
    consideration,
    commissionNSE,
    otherLevies,
    withholdingTax,
    totalPayable,
    totalReceivable
  };
}

function calculateBondValues(params: {
  bondData: SecondaryMarketBond | PrimaryMarketBond;
  settlementDate: Date;
  calculationType: 'yield' | 'price';
  dirtyPrice: number;
  yieldTM: number;
  faceValue: number;
  dailyBasis: number;
  bondTermUnder10: number;
  bondTermOver10: number;
  ifbRate: number;
  marketType: 'secondary' | 'primary';
}): BondCalcResult {
  const {
    bondData,
    settlementDate,
    calculationType,
    dirtyPrice,
    yieldTM,
    faceValue,
    dailyBasis,
    bondTermUnder10,
    bondTermOver10,
    ifbRate,
    marketType
  } = params;

  const issueDate = new Date(bondData.IssueDate);
  const maturityDate = new Date(bondData.MaturityDate);
  
  // Get bond-specific values
  const coupon = marketType === 'secondary' 
    ? parseFloat((bondData as SecondaryMarketBond).Coupon)
    : parseFloat((bondData as PrimaryMarketBond).ParYield);
  
  const spotYield = marketType === 'secondary'
    ? parseFloat((bondData as SecondaryMarketBond).SpotYield)
    : parseFloat((bondData as PrimaryMarketBond).SpotRate.replace('%', '')) / 100;
  
  const spread = marketType === 'secondary'
    ? parseFloat((bondData as SecondaryMarketBond).Spread)
    : 0;
  
  const bondDailyBasis = marketType === 'secondary'
    ? dailyBasis
    : (bondData as PrimaryMarketBond).DayCount;
  
  // Calculate indicative range
  const indicativeRange = calculateIndicativeRange(spotYield, spread);
  
  // Calculate coupon dates
  const previousCoupon = calculatePreviousCoupon(issueDate, settlementDate, bondDailyBasis);
  const nextCouponDate = calculateNextCouponDate(issueDate, settlementDate, maturityDate, bondDailyBasis, previousCoupon);
  const nextCouponDays = calculateNextCouponDays(settlementDate, nextCouponDate);
  
  // Calculate coupon counts
  const couponsDue = calculateCouponsDue(settlementDate, maturityDate, bondDailyBasis);
  const totalCoupons = Math.ceil(daysBetween(issueDate, maturityDate) / (bondDailyBasis === 364 ? 182 : bondDailyBasis / 2));
  const couponsPaid = Math.max(0, totalCoupons - couponsDue);
  
  // Calculate prices
  let calculatedDirtyPrice = dirtyPrice;
  let calculatedYield = yieldTM;
  
  if (calculationType === 'price' && yieldTM > 0) {
    calculatedDirtyPrice = calculateBondPrice(yieldTM, coupon, couponsDue, nextCouponDays, bondDailyBasis);
  } else if (calculationType === 'yield' && dirtyPrice > 0) {
    calculatedYield = calculateBondYield(dirtyPrice, coupon, couponsDue, nextCouponDays, bondDailyBasis);
  }
  
  // Calculate accrued interest and clean price
  const accruedInterest = calculateAccruedInterest(settlementDate, previousCoupon, nextCouponDate, coupon, bondDailyBasis);
  const cleanPrice = calculatedDirtyPrice - accruedInterest;
  
  // Calculate bond metrics
  const bondTenor = daysBetween(issueDate, maturityDate) / (bondDailyBasis === 364 ? 364 : 365);
  const termToMaturity = daysBetween(settlementDate, maturityDate) / (bondDailyBasis === 364 ? 364 : 365);
  
  // Calculate financial values
  const pricePerHundred = calculationType === 'price' ? calculatedDirtyPrice : dirtyPrice;
  const financialValues = calculateFinancialValues(
    faceValue,
    pricePerHundred,
    cleanPrice,
    bondData.BondIssueNo,
    termToMaturity,
    calculationType,
    bondTermUnder10,
    bondTermOver10,
    ifbRate
  );

  return {
    indicativeRange,
    previousCoupon,
    nextCouponDate,
    nextCouponDays,
    couponsDue,
    couponsPaid,
    dirtyPrice: calculatedDirtyPrice,
    cleanPrice,
    accruedInterest,
    bondTenor,
    termToMaturity,
    ...financialValues
  };
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 2
  }).format(amount);
}

function formatPercentage(value: number): string {
  return `${value.toFixed(4)}%`;
}

export function InlineBondCalc() {
  const [state, setState] = useState<BondCalcState>({
    valueDate: new Date(),
    marketType: 'secondary',
    selectedBond: '',
    calculationType: 'yield',
    settlementDate: format(addBusinessDays(new Date(), 3), 'yyyy-MM-dd'),
    dirtyPrice: '101.0766',
    yieldTM: '15.6914',
    coupon: '12.5000',
    faceValue: '',
    isinNo: ''
  });

  const [details, setDetails] = useState<BondDetails>({
    IfbFiveYrs: 0,
    PercentUnderTenYrs: 10,
    DailyBasis: 364,
    ValueDate: undefined
  });

  const [secondaryMarketBonds, setSecondaryMarketBonds] = useState<SecondaryMarketBond[]>([]);
  const [primaryMarketBonds, setPrimaryMarketBonds] = useState<PrimaryMarketBond[]>([]);
  const [selectedBondData, setSelectedBondData] = useState<SecondaryMarketBond | PrimaryMarketBond | null>(null);
  const [calculationResult, setCalculationResult] = useState<BondCalcResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch bond calculation details
        const detailsResponse = await getBondCalcDetails();
        if (detailsResponse?.data) {
          setDetails(detailsResponse.data);
        }

        // Fetch secondary market bonds
        const secondaryResponse = await getSecondaryMarketBonds();
        const secondaryBonds = Array.isArray(secondaryResponse) 
          ? secondaryResponse 
          : (secondaryResponse?.data && Array.isArray(secondaryResponse.data) ? secondaryResponse.data : []);
        
        if (secondaryBonds.length > 0) {
          setSecondaryMarketBonds(secondaryBonds);
          
          // Set first bond as default only if no bond is selected
          if (!state.selectedBond) {
            const firstBond = secondaryBonds[0];
            setState(prev => ({ 
              ...prev, 
              selectedBond: firstBond.Id.toString(),
              coupon: parseFloat(firstBond.Coupon).toString()
            }));
            setSelectedBondData(firstBond);
          }
        }

        // Fetch primary market bonds
        const primaryResponse = await getPrimaryMarketBonds();
        const primaryBonds = Array.isArray(primaryResponse) 
          ? primaryResponse 
          : (primaryResponse?.data && Array.isArray(primaryResponse.data) ? primaryResponse.data : []);
        
        if (primaryBonds.length > 0) {
          setPrimaryMarketBonds(primaryBonds);
        }
      } catch (error) {
        console.error("Error fetching bond data:", error);
        setError("Failed to load bond data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [state.selectedBond]);

  // Update selected bond data when bond selection changes
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (state.selectedBond && (secondaryMarketBonds.length > 0 || primaryMarketBonds.length > 0)) {
      const bonds = state.marketType === 'secondary' ? secondaryMarketBonds : primaryMarketBonds;
      const bond = bonds.find(b => b.Id.toString() === state.selectedBond);
      if (bond) {
        setSelectedBondData(bond);
        
        // Update coupon from selected bond
        if (state.marketType === 'secondary') {
          const secondaryBond = bond as SecondaryMarketBond;
          setState(prev => ({ 
            ...prev, 
            coupon: parseFloat(secondaryBond.Coupon).toString() 
          }));
        } else {
          const primaryBond = bond as PrimaryMarketBond;
          setState(prev => ({ 
            ...prev, 
            coupon: parseFloat(primaryBond.ParYield).toString() 
          }));
        }
      }
    }
  }, [state.selectedBond, state.marketType, secondaryMarketBonds.length, primaryMarketBonds.length]);
  /* eslint-enable react-hooks/exhaustive-deps */

  // Set default bond when data is loaded
  useEffect(() => {
    if (!state.selectedBond && secondaryMarketBonds.length > 0 && !isLoading) {
      const firstBond = secondaryMarketBonds[0];
      setState(prev => ({ 
        ...prev, 
        selectedBond: firstBond.Id.toString(),
        coupon: parseFloat(firstBond.Coupon).toString()
      }));
      setSelectedBondData(firstBond);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondaryMarketBonds.length, isLoading, state.selectedBond]);

  // Calculate bond values
  const handleCalculate = useCallback(async () => {
    if (!selectedBondData) return;

    setIsCalculating(true);
    setError(null);
    
    try {
      const settlementDate = new Date(state.settlementDate);
      
      const result = calculateBondValues({
        bondData: selectedBondData,
        settlementDate,
        calculationType: state.calculationType,
        dirtyPrice: parseFloat(state.dirtyPrice) || 0,
        yieldTM: parseFloat(state.yieldTM) || 0,
        faceValue: parseFloat(state.faceValue) || 0,
        dailyBasis: details.DailyBasis,
        bondTermUnder10: details.PercentUnderTenYrs,
        bondTermOver10: details.PercentUnderTenYrs,
        ifbRate: details.IfbFiveYrs,
        marketType: state.marketType
      });

      setCalculationResult(result);

      // Update calculated values in state
      if (state.calculationType === 'price') {
        setState(prev => ({ 
          ...prev, 
          dirtyPrice: result.dirtyPrice.toFixed(6)
        }));
      }
    } catch (error) {
      console.error("Error calculating bond values:", error);
      setError("Calculation failed. Please check your inputs.");
    } finally {
      setIsCalculating(false);
    }
  }, [
    selectedBondData,
    state.settlementDate,
    state.calculationType,
    state.dirtyPrice,
    state.yieldTM,
    state.faceValue,
    details.DailyBasis,
    details.PercentUnderTenYrs,
    details.IfbFiveYrs,
    state.marketType
  ]);

  // Auto-calculate when relevant inputs change
  useEffect(() => {
    if (selectedBondData && state.settlementDate && !isLoading) {
      const delay = 50;
      
      const timeoutId = setTimeout(() => {
        handleCalculate();
      }, delay);

      return () => clearTimeout(timeoutId);
    }
  }, [
    selectedBondData,
    state.settlementDate,
    state.calculationType,
    state.dirtyPrice,
    state.yieldTM,
    state.faceValue,
    state.coupon,
    isLoading,
    handleCalculate
  ]);

  const getBondsList = () => {
    return state.marketType === 'secondary' ? secondaryMarketBonds : primaryMarketBonds;
  };

  const handleMarketTypeChange = (newMarketType: 'secondary' | 'primary') => {
    setState(prev => ({ 
      ...prev, 
      marketType: newMarketType, 
      selectedBond: '' 
    }));
    setSelectedBondData(null);
    setCalculationResult(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="animate-spin h-8 w-8 text-black" />
        <span className="ml-3 text-sm font-medium text-neutral-500">Loading Bond Calculator...</span>
      </div>
    );
  }

  return (
    <div className="h-full  max-h-screen flex flex-col bg-white">
      <ScrollArea className="flex-1 pr-2">
        <div className="space-y-4 pb-4">
        <div className="text-center">
          <h3 className="text-lg font-bold text-black">Bond Calculator</h3>
          <p className="text-xs text-neutral-500">Calculate bond yields and prices</p>
        </div>

        {error && (
          <div className="bg-neutral-50 border border-neutral-200 text-black px-3 py-2 rounded text-xs">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Rate Viewer Section */}
        <div className="space-y-3">
          <Label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Rate Viewer</Label>
          
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-neutral-600">Market Type</Label>
              <Select
                value={state.marketType}
                onValueChange={handleMarketTypeChange}
              >
                <SelectTrigger className="h-9 text-xs bg-white border-neutral-200 text-black focus:ring-black">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-neutral-200">
                  <SelectItem value="secondary">Secondary Market</SelectItem>
                  <SelectItem value="primary">Primary Auction</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-neutral-600">Bond</Label>
              <Select
                value={state.selectedBond}
                onValueChange={(value) => setState(prev => ({ ...prev, selectedBond: value }))}
              >
                <SelectTrigger className="h-9 text-xs bg-white border-neutral-200 text-black focus:ring-black">
                  <SelectValue placeholder="Select Bond" />
                </SelectTrigger>
                <SelectContent className="bg-white border-neutral-200">
                  {getBondsList().map((bond) => {
                     const isSecondary = state.marketType === 'secondary';
                     const coupon = isSecondary ? (bond as SecondaryMarketBond).Coupon : (bond as PrimaryMarketBond).ParYield;
                     const maturityYear = format(new Date(bond.MaturityDate), 'yyyy');
                     // Helper to format coupon safely
                     const formatCpn = (c: string) => {
                        const val = parseFloat(c);
                        return isNaN(val) ? c : `${val.toFixed(2)}%`;
                     };

                     return (
                      <SelectItem key={bond.Id} value={bond.Id.toString()} className="text-black focus:bg-neutral-100">
                        <span className="font-medium">{bond.BondIssueNo}</span>
                        <span className="text-neutral-500 ml-2 text-[10px]">
                           {formatCpn(coupon)} - {maturityYear}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bond Information Display */}
          {selectedBondData && (
            <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-3 space-y-2">
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="font-medium text-neutral-600">
                    {state.marketType === 'secondary' ? 'Duration (Yrs)' : 'Average Life (Yrs)'}
                  </span>
                  <span className="font-bold text-black">
                    {state.marketType === 'secondary' 
                      ? parseFloat((selectedBondData as SecondaryMarketBond).DtmYrs).toFixed(2)
                      : parseFloat((selectedBondData as PrimaryMarketBond).DtmOrWal).toFixed(2)
                    }
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-neutral-600">Spot Rate</span>
                  <span className="font-bold text-black">
                    {state.marketType === 'secondary'
                      ? formatPercentage(parseFloat((selectedBondData as SecondaryMarketBond).SpotYield) * 100)
                      : (selectedBondData as PrimaryMarketBond).SpotRate
                    }
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-neutral-600">Indicative Range</span>
                  <span className="font-bold text-black">{calculationResult?.indicativeRange || "-"}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator className="bg-neutral-200" />

        {/* Bond Calc Section */}
        <div className="space-y-3">
          <Label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Bond Calculation</Label>
          
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-neutral-600">Type of Calculation</Label>
              <Select
                value={state.calculationType}
                onValueChange={(value: 'yield' | 'price') =>
                  setState(prev => ({ ...prev, calculationType: value }))
                }
              >
                <SelectTrigger className="h-9 text-xs bg-white border-neutral-200 text-black focus:ring-black">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-neutral-200">
                  <SelectItem value="yield">Calculate Yield (from Price)</SelectItem>
                  <SelectItem value="price">Calculate Price (from Yield)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold text-black">Settlement Date</Label>
              <Input
                type="date"
                value={state.settlementDate}
                onChange={(e) => setState(prev => ({ ...prev, settlementDate: e.target.value }))}
                className="h-9 text-xs font-medium text-black border-neutral-200 focus:border-black bg-white"
              />
              <div className="flex gap-2 mt-1">
                 <Button 
                   size="sm" 
                   className="h-6 text-[10px] px-2 bg-black text-white hover:bg-neutral-800 border-none"
                   onClick={() => setState(prev => ({ ...prev, settlementDate: format(new Date(), 'yyyy-MM-dd') }))}
                 >
                   Today
                 </Button>
                 <Button 
                   size="sm" 
                   className="h-6 text-[10px] px-2 bg-black text-white hover:bg-neutral-800 border-none"
                   onClick={() => setState(prev => ({ ...prev, settlementDate: format(addBusinessDays(new Date(), 1), 'yyyy-MM-dd') }))}
                 >
                   T+1
                 </Button>
                 <Button 
                   size="sm" 
                   className="h-6 text-[10px] px-2 bg-black text-white hover:bg-neutral-800 border-none"
                   onClick={() => setState(prev => ({ ...prev, settlementDate: format(addBusinessDays(new Date(), 3), 'yyyy-MM-dd') }))}
                 >
                   T+3
                 </Button>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-neutral-600">
                {state.calculationType === 'yield' ? 'Dirty Price' : 'Yield YTM (%)'}
              </Label>
              <Input
                value={state.calculationType === 'yield' ? state.dirtyPrice : state.yieldTM}
                onChange={(e) => {
                  if (state.calculationType === 'yield') {
                    setState(prev => ({ ...prev, dirtyPrice: e.target.value }));
                  } else {
                    setState(prev => ({ ...prev, yieldTM: e.target.value }));
                  }
                }}
                className="h-9 text-xs font-medium bg-white border-neutral-200 text-black focus:border-black"
                placeholder={state.calculationType === 'yield' ? 'Enter dirty price' : 'Enter yield %'}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-neutral-600">Coupon (%)</Label>
              <Input
                value={state.coupon}
                onChange={(e) => setState(prev => ({ ...prev, coupon: e.target.value }))}
                className="h-9 text-xs font-medium bg-white border-neutral-200 text-black focus:border-black"
                placeholder="Coupon rate"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-neutral-600">Face Value (KES)</Label>
              <Input
                value={state.faceValue}
                onChange={(e) => setState(prev => ({ ...prev, faceValue: e.target.value }))}
                className="h-9 text-xs font-medium bg-white border-neutral-200 text-black focus:border-black"
                placeholder="Enter face value"
              />
            </div>
          </div>
        </div>

        {/* Bond Details Display */}
        {selectedBondData && calculationResult && (
          <div className="space-y-3">
            <Separator className="bg-neutral-200" />
            <Label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Bond Details</Label>
            <div className="bg-white border border-neutral-200 rounded-lg p-3 shadow-sm">
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="font-medium text-neutral-600">Issue Date</span>
                  <span className="font-bold text-black">{format(new Date(selectedBondData.IssueDate), "dd-MMM-yyyy")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-neutral-600">Maturity Date</span>
                  <span className="font-bold text-black">{format(new Date(selectedBondData.MaturityDate), "dd-MMM-yyyy")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-neutral-600">Next Coupon Days</span>
                  <span className="font-bold text-black">{calculationResult.nextCouponDays}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-neutral-600">Coupons Due</span>
                  <span className="font-bold text-black">{calculationResult.couponsDue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-neutral-600">Clean Price</span>
                  <span className="font-bold text-black">{calculationResult.cleanPrice.toFixed(4)}</span>
                </div>
                {state.calculationType === 'price' && (
                  <div className="flex justify-between">
                    <span className="font-medium text-neutral-600">Calculated Dirty Price</span>
                    <span className="font-bold text-black">{calculationResult.dirtyPrice.toFixed(6)}</span>
                  </div>
                )}
                {state.calculationType === 'yield' && (
                  <div className="flex justify-between">
                    <span className="font-medium text-neutral-600">Dirty Price</span>
                    <span className="font-bold text-black">{parseFloat(state.dirtyPrice).toFixed(4)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Financial Summary */}
        {selectedBondData && calculationResult && parseFloat(state.faceValue) > 0 && (
          <Accordion type="single" collapsible className="space-y-0">
            <AccordionItem value="financial-summary" className="border-none">
              <AccordionTrigger className="hover:no-underline py-2">
                <Label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Financial Summary</Label>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <div className="bg-white border border-neutral-200 rounded-lg p-3 shadow-sm">
                  <div className="grid grid-cols-1 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="font-medium text-neutral-600">Face Value (KES)</span>
                      <span className="font-bold text-black">{formatCurrency(parseFloat(state.faceValue))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-neutral-600">Consideration</span>
                      <span className="font-bold text-black">{formatCurrency(calculationResult.consideration)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-neutral-600">Commission (NSE)</span>
                      <span className="font-bold text-black">{formatCurrency(calculationResult.commissionNSE)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-neutral-600">Other levies (CMA)</span>
                      <span className="font-bold text-black">{formatCurrency(calculationResult.otherLevies)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-neutral-600">Withholding Tax</span>
                      <span className={calculationResult.withholdingTax > 0 ? "font-bold text-black" : "font-bold text-black"}>{formatCurrency(calculationResult.withholdingTax)}</span>
                    </div>
                    <div className="flex justify-between border-t border-neutral-200 pt-2">
                      <span className="font-bold text-black">Total Payable</span>
                      <span className="font-bold text-black">{formatCurrency(calculationResult.totalPayable)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-neutral-600">Total Receivable</span>
                      <span className="font-bold text-black">{formatCurrency(calculationResult.totalReceivable)}</span>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {/* Calculation Status */}
        {isCalculating && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="animate-spin h-6 w-6 text-black" />
            <span className="ml-2 text-xs font-bold text-neutral-600">Calculating...</span>
          </div>
        )}

        {/* Manual Calculate Button */}
        <div className="space-y-2">
          <Button 
            onClick={handleCalculate}
            disabled={isCalculating || !selectedBondData}
            className="w-full h-9 bg-black hover:bg-neutral-800 font-bold text-xs text-white border-none"
          >
            {isCalculating ? 'Calculating...' : 'Recalculate'}
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              setCalculationResult(null);
              setState(prev => ({ 
                ...prev, 
                dirtyPrice: '101.0766',
                yieldTM: '15.6914',
                faceValue: '',
                isinNo: ''
              }));
            }}
            disabled={isCalculating}
            className="w-full h-9 font-medium text-xs border-neutral-200 text-black hover:bg-neutral-50 bg-white"
          >
            Reset
          </Button>
        </div>
        </div>
      </ScrollArea>
    </div>
  );
}