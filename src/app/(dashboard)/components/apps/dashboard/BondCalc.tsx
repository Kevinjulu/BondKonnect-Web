"use client";
import * as React from 'react'
import { useState, useEffect, useCallback } from "react";
// import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
// import { Calendar } from "@/components/ui/calendar"
import { Separator } from "@/components/ui/separator"
import { Sheet,  SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { getBondCalcDetails, getPrimaryMarketBonds, getSecondaryMarketBonds } from '@/lib/actions/api.actions';

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

// Utility functions
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
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
  // const daysSinceLastCoupon = daysBetween(previousCoupon, settlementDate);
  const nextCouponDays = daysBetween(settlementDate, nextCouponDate);
  
  // return (daysSinceLastCoupon / couponPeriod) * (coupon / 2);
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
  // Fix consideration calculation to match Excel: =ROUNDDOWN(C56*C53%,0)
  // For yield calc: Excel shows 2,021,530 vs calc shows 2,021,519 (diff of 11)
  // This suggests Excel uses the full precision price for yield calculations
  let consideration = 0;
  if (faceValue === 0) {
    consideration = 0;
  } else if (calculationType === 'yield') {
    // For yield calculations, use full precision price
    consideration = Math.floor(faceValue * (pricePerHundred / 100));
  } else {
    // For price calculations, truncate price to 3 decimal places
    const excelPrice = Math.floor(pricePerHundred * 1000) / 1000;
    consideration = Math.floor(faceValue * (excelPrice / 100));
  }
  
  const commissionNSE = consideration === 0 ? 0 : 
    Math.max(consideration * 0.00024, 1000);
  
  const otherLevies = consideration === 0 ? 0 : 
    consideration * 0.00011;
  
  // Fix withholding tax to match Excel formula logic
  // =IF(OR($B$8=1,$C$33>=100),0,IF(AND($B$8=2,LEFT($C$40,3)="IFB",$C$33<100),(100-C33)*C6*C57/100,IF(AND($B$8=2,LEFT($C$40,3)<>"IFB",$C$33<100,C42<10),(100-C33)*C4*C57/100,IF(AND($B$8=2,LEFT($C$40,3)<>"IFB",$C$33<100,C42>=10),(100-C33)*C5*C57/100,0))))
  let withholdingTax = 0;
  
  // Excel logic: B$8=1 means yield calculation, B$8=2 means price calculation
  // According to Excel formula: IF(OR($B$8=1, $C$33>=100), 0, ...)
  // This means: if yield calculation OR clean price >= 100, then withholding tax = 0
  if (calculationType === 'yield' || cleanPrice >= 100) {
    // For yield calculations or when clean price >= 100, withholding tax = 0
    withholdingTax = 0;
  } else if (calculationType === 'price' && cleanPrice < 100 && faceValue > 0) {
    // For price calculations with clean price < 100 (discount bonds)
    const discount = 100 - cleanPrice;
    
    if (bondIssueNo.startsWith('IFB')) {
      withholdingTax = discount * (ifbRate / 100) * (consideration / 100);
    }
    //  else if (termToMaturity < 10) {
    //   withholdingTax = discount * (bondTermUnder10 / 100) * (consideration / 100);
    // } else {
    //   withholdingTax = discount * (bondTermOver10 / 100) * (consideration / 100);
    // }
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
    // ? (bondData as SecondaryMarketBond).Basis || dailyBasis
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

export function BondCalc() {
  const [state, setState] = useState<BondCalcState>({
    valueDate: new Date(),
    marketType: 'secondary',
    selectedBond: '',
    calculationType: 'yield',
    settlementDate: format(new Date(), 'yyyy-MM-dd'),
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
        // Handle both array and wrapped response formats
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
        // Handle both array and wrapped response formats
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
  }, [state.selectedBond]); // Remove the circular dependencies

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
  }, [secondaryMarketBonds.length, isLoading, state.selectedBond]); // Intentionally excluding full bond arrays to prevent infinite loops

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
      // Immediate calculation for calculation type changes, debounced for others
      const delay = 50; // Fast response for all changes to ensure financial summary updates
      
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
      <ScrollArea className="whitespace-nowrap rounded-md">
        <Sheet>
          <SheetTrigger asChild>
            <Button disabled>Loading Bond Calculator...</Button>
          </SheetTrigger>
        </Sheet>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="whitespace-nowrap rounded-md">
      <Sheet>
        <SheetTrigger asChild>
          <Button>Bond Calculator</Button>
        </SheetTrigger>
        <SheetContent className="overflow-y-auto w-[500px] sm:w-[600px]">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold text-gray-800">Bond Calculator</SheetTitle>
            <SheetDescription className="text-gray-600">
              Calculate bond yields and prices for secondary and primary market bonds
            </SheetDescription>
          </SheetHeader>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              <p className="font-medium">{error}</p>
            </div>
          )}

          <div className="grid gap-6 py-4">
            {/* Details Section */}
            {/* <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Details</Label>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                  <div className="font-medium text-gray-600">Value Date</div>
                  <div className="font-semibold text-gray-800">{details.ValueDate ? format(new Date(details.ValueDate), "dd/MM/yyyy") : format(new Date(), "dd/MM/yyyy")}</div>
                  <div className="font-medium text-gray-600">Daily Basis</div>
                  <div className="font-semibold text-gray-800">{details.DailyBasis}</div>
                  <div className="font-medium text-gray-600">Bond Term (Yrs) &lt; 10</div>
                  <div className="font-semibold text-gray-800">{details.PercentUnderTenYrs}%</div>
                  <div className="font-medium text-gray-600">Bond Term (Yrs) &gt;= 10</div>
                  <div className="font-semibold text-gray-800">{details.PercentUnderTenYrs}%</div>
                  <div className="font-medium text-gray-600">IFB N.5 (Yrs)</div>
                  <div className="font-semibold text-gray-800">{details.IfbFiveYrs}%</div>
                </div>
              </div>
            </div> */}

            <Separator />

            {/* Rate Viewer Section */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Rate Viewer</Label>
              <div className="text-xs font-medium text-gray-500 mb-3">Select Type of Bond Market & Specific Bond</div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-600">Market Type</Label>
                  <Select
                    value={state.marketType}
                    onValueChange={handleMarketTypeChange}
                  >
                    <SelectTrigger className="h-9 border-2 border-blue-200 hover:border-blue-300 focus:border-blue-400 bg-blue-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="secondary">Secondary Market</SelectItem>
                      <SelectItem value="primary">Primary Auction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-600">Bond</Label>
                  <Select
                    value={state.selectedBond}
                    onValueChange={(value) => setState(prev => ({ ...prev, selectedBond: value }))}
                  >
                    <SelectTrigger className="h-9 border-2 border-blue-200 hover:border-blue-300 focus:border-blue-400 bg-blue-50">
                      <SelectValue placeholder="Select Bond" />
                    </SelectTrigger>
                    <SelectContent>
                      {getBondsList().map((bond) => (
                        <SelectItem key={bond.Id} value={bond.Id.toString()}>
                          {bond.BondIssueNo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Bond Information Display */}
              {selectedBondData && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3 items-center">
                    <Label className="text-xs font-medium text-gray-600">
                      {state.marketType === 'secondary' ? 'Duration-to-Maturity (Yrs)' : 'Average Life (Yrs)'}
                    </Label>
                    <Input
                      value={
                        state.marketType === 'secondary' 
                          ? parseFloat((selectedBondData as SecondaryMarketBond).DtmYrs).toFixed(4)
                          : parseFloat((selectedBondData as PrimaryMarketBond).DtmOrWal).toFixed(4)
                      }
                      className="h-8 bg-white border-gray-200 font-semibold text-gray-700"
                      readOnly
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 items-center">
                    <Label className="text-xs font-medium text-gray-600">Spot Rate</Label>
                    <Input
                      value={
                        state.marketType === 'secondary'
                          ? formatPercentage(parseFloat((selectedBondData as SecondaryMarketBond).SpotYield) * 100)
                          : (selectedBondData as PrimaryMarketBond).SpotRate
                      }
                      className="h-8 bg-white border-gray-200 font-semibold text-gray-700"
                      readOnly
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 items-center">
                    <Label className="text-xs font-medium text-gray-600">Indicative Range (Bid-Offer)</Label>
                    <Input
                      value={calculationResult?.indicativeRange || ""}
                      className="h-8 bg-white border-gray-200 font-semibold text-gray-700"
                      readOnly
                    />
                  </div>

                  {/* Primary Market specific fields */}
                  {state.marketType === 'primary' && (
                    <>
                      {(selectedBondData as PrimaryMarketBond).FirstCallDate && (
                        <div className="grid grid-cols-2 gap-3 items-center">
                          <Label className="text-xs font-medium text-gray-600">1st Redemption Date</Label>
                          <Input
                            value={format(new Date((selectedBondData as PrimaryMarketBond).FirstCallDate!), "dd/MM/yyyy")}
                            className="h-8 bg-white border-gray-200 font-semibold text-gray-700"
                            readOnly
                          />
                        </div>
                      )}
                      {(selectedBondData as PrimaryMarketBond).SecondCallDate && (
                        <div className="grid grid-cols-2 gap-3 items-center">
                          <Label className="text-xs font-medium text-gray-600">2nd Redemption Date</Label>
                          <Input
                            value={format(new Date((selectedBondData as PrimaryMarketBond).SecondCallDate!), "dd/MM/yyyy")}
                            className="h-8 bg-white border-gray-200 font-semibold text-gray-700"
                            readOnly
                          />
                        </div>
                      )}
                      {(selectedBondData as PrimaryMarketBond).ParCall1Percent && (
                        <div className="grid grid-cols-2 gap-3 items-center">
                          <Label className="text-xs font-medium text-gray-600">1st Redemption %</Label>
                          <Input
                            value={(selectedBondData as PrimaryMarketBond).ParCall1Percent + '%'}
                            className="h-8 bg-white border-gray-200 font-semibold text-gray-700"
                            readOnly
                          />
                        </div>
                      )}
                      {(selectedBondData as PrimaryMarketBond).ParCall2Percent && (
                        <div className="grid grid-cols-2 gap-3 items-center">
                          <Label className="text-xs font-medium text-gray-600">2nd Redemption %</Label>
                          <Input
                            value={(selectedBondData as PrimaryMarketBond).ParCall2Percent + '%'}
                            className="h-8 bg-white border-gray-200 font-semibold text-gray-700"
                            readOnly
                          />
                        </div>
                      )}
                      {/* Show both Dirty Price and Clean Price for Primary Market */}
                      {calculationResult && (
                        <>
                          <div className="grid grid-cols-2 gap-3 items-center">
                            <Label className="text-xs font-medium text-gray-600">Dirty Price</Label>
                            <Input
                              value={calculationResult.dirtyPrice.toFixed(6)}
                              className="h-8 bg-white border-gray-200 font-bold text-green-600"
                              readOnly
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3 items-center">
                            <Label className="text-xs font-medium text-gray-600">Clean Price</Label>
                            <Input
                              value={calculationResult.cleanPrice.toFixed(6)}
                              className="h-8 bg-white border-gray-200 font-bold text-amber-600"
                              readOnly
                            />
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            <Separator />

            {/* Bond Calc Section */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Bond Calculation</Label>
              
              <div className="space-y-1">
                <Label className="text-xs font-medium text-gray-600">Type of Calculation</Label>
                <Select
                  value={state.calculationType}
                  onValueChange={(value: 'yield' | 'price') =>
                    setState(prev => ({ ...prev, calculationType: value }))
                  }
                >
                  <SelectTrigger className="h-9 border-2 border-green-200 hover:border-green-300 focus:border-green-400 bg-green-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yield">Bond Yield Calc</SelectItem>
                    <SelectItem value="price">Bond Price Calc</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <Label className="text-xs font-medium text-gray-600">Settlement Date</Label>
                <Input
                  type="date"
                  value={state.settlementDate}
                  onChange={(e) => setState(prev => ({ ...prev, settlementDate: e.target.value }))}
                  className="h-8 border-2 border-orange-200 hover:border-orange-300 focus:border-orange-400 bg-orange-50 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <Label className="text-xs font-medium text-gray-600">
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
                  className="h-8 border-2 border-yellow-200 hover:border-yellow-300 focus:border-yellow-400 bg-yellow-50 font-semibold"
                  placeholder={state.calculationType === 'yield' ? 'Enter dirty price' : 'Enter yield %'}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <Label className="text-xs font-medium text-gray-600">Coupon (%)</Label>
                <Input
                  value={state.coupon}
                  onChange={(e) => setState(prev => ({ ...prev, coupon: e.target.value }))}
                  className="h-8 border-2 border-yellow-200 hover:border-yellow-300 focus:border-yellow-400 bg-yellow-50 font-semibold"
                  placeholder="Coupon rate"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <Label className="text-xs font-medium text-gray-600">Face Value (KES)</Label>
                <Input
                  value={state.faceValue}
                  onChange={(e) => setState(prev => ({ ...prev, faceValue: e.target.value }))}
                  className="h-8 border-2 border-yellow-200 hover:border-yellow-300 focus:border-yellow-400 bg-yellow-50 font-semibold"
                  placeholder="Enter face value"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <Label className="text-xs font-medium text-gray-600">ISIN No (optional)</Label>
                <Input
                  value={state.isinNo}
                  onChange={(e) => setState(prev => ({ ...prev, isinNo: e.target.value }))}
                  className="h-8 border-2 border-yellow-200 hover:border-yellow-300 focus:border-yellow-400 bg-yellow-50 font-semibold"
                  placeholder="Enter ISIN number"
                />
              </div>
            </div>

            {/* Bond Details Display */}
            {selectedBondData && calculationResult && (
              <div className="space-y-3">
                <Separator />
                <Label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Bond Details</Label>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                    <div className="font-medium text-gray-600">Day-Count Convention</div>
                    <div className="font-semibold text-gray-800">
                      {state.marketType === 'secondary' 
                        // ? (selectedBondData as SecondaryMarketBond).Basis || details.DailyBasis
                        ?  details.DailyBasis
                        : (selectedBondData as PrimaryMarketBond).DayCount
                      }
                    </div>
                    <div className="font-medium text-gray-600">Issue Date</div>
                    <div className="font-semibold text-gray-800">{format(new Date(selectedBondData.IssueDate), "dd-MMM-yyyy")}</div>
                    <div className="font-medium text-gray-600">Maturity Date</div>
                    <div className="font-semibold text-gray-800">{format(new Date(selectedBondData.MaturityDate), "dd-MMM-yyyy")}</div>
                    
                    {/* Primary Market specific fields */}
                    {state.marketType === 'primary' && (
                      <>
                        {(selectedBondData as PrimaryMarketBond).FirstCallDate && (
                          <>
                            <div className="font-medium text-gray-600">1st Redemption Date</div>
                            <div className="font-semibold text-gray-800">{format(new Date((selectedBondData as PrimaryMarketBond).FirstCallDate!), "dd-MMM-yyyy")}</div>
                          </>
                        )}
                        {(selectedBondData as PrimaryMarketBond).SecondCallDate && (
                          <>
                            <div className="font-medium text-gray-600">2nd Redemption Date</div>
                            <div className="font-semibold text-gray-800">{format(new Date((selectedBondData as PrimaryMarketBond).SecondCallDate!), "dd-MMM-yyyy")}</div>
                          </>
                        )}
                        {(selectedBondData as PrimaryMarketBond).ParCall1Percent && (
                          <>
                            <div className="font-medium text-gray-600">1st Redemption %</div>
                            <div className="font-semibold text-gray-800">{(selectedBondData as PrimaryMarketBond).ParCall1Percent}</div>
                          </>
                        )}
                        {(selectedBondData as PrimaryMarketBond).ParCall2Percent && (
                          <>
                            <div className="font-medium text-gray-600">2nd Redemption %</div>
                            <div className="font-semibold text-gray-800">{(selectedBondData as PrimaryMarketBond).ParCall2Percent}</div>
                          </>
                        )}
                      </>
                    )}
                    
                    <div className="font-medium text-gray-600">Previous Coupon</div>
                    <div className="font-semibold text-gray-800">{calculationResult.previousCoupon ? format(calculationResult.previousCoupon, "dd-MMM-yyyy") : "-"}</div>
                    <div className="font-medium text-gray-600">Next Coupon Date</div>
                    <div className="font-semibold text-gray-800">{calculationResult.nextCouponDate ? format(calculationResult.nextCouponDate, "dd-MMM-yyyy") : "-"}</div>
                    <div className="font-medium text-gray-600">Next Coupon Days</div>
                    <div className="font-semibold text-gray-800">{calculationResult.nextCouponDays}</div>
                    <div className="font-medium text-gray-600">Coupon Period</div>
                    <div className="font-semibold text-gray-800">
                      {(() => {
                        const dayCountConvention = state.marketType === 'secondary' 
                          ? details.DailyBasis
                          : (selectedBondData as PrimaryMarketBond).DayCount;
                        
                        // Excel formula: =IF(C18=360,180,C29-C28)
                        if (dayCountConvention === 360) {
                          return 180;
                        } else if (calculationResult.previousCoupon && calculationResult.nextCouponDate) {
                          // Calculate difference between Next Coupon Date and Previous Coupon Date
                          return daysBetween(calculationResult.previousCoupon, calculationResult.nextCouponDate);
                        } else {
                          // Fallback to default logic if dates are not available
                          return dayCountConvention === 364 ? 182 : dayCountConvention / 2;
                        }
                      })()}
                    </div>
                    <div className="font-medium text-gray-600">Coupons Due</div>
                    <div className="font-semibold text-gray-800">{calculationResult.couponsDue}</div>
                    {/* <div className="font-medium text-gray-600">Coupons Paid</div>
                    <div className="font-semibold text-gray-800">{calculationResult.couponsPaid}</div> */}
                    <div className="font-medium text-gray-600">Clean Price</div>
                    <div className="font-bold text-amber-600">{calculationResult.cleanPrice.toFixed(4)}</div>
                    {/* <div className="font-medium text-gray-600">Accrued Interest</div>
                    <div className="font-semibold text-gray-800">{calculationResult.accruedInterest.toFixed(4)}</div> */}
                    {state.calculationType === 'price' && (
                      <>
                        <div className="font-medium text-gray-600">Calculated Dirty Price</div>
                        <div className="font-bold text-green-600">{calculationResult.dirtyPrice.toFixed(6)}</div>
                      </>
                    )}
                    {state.calculationType === 'yield' && (
                      <>
                        <div className="font-medium text-gray-600">Dirty Price</div>
                        <div className="font-bold text-green-600">{parseFloat(state.dirtyPrice).toFixed(4)}</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            <Separator />

            {/* Bond Quotation & Financial Summary Accordion */}
            {selectedBondData && calculationResult && (
              <Accordion type="single" collapsible className="space-y-0">
                <AccordionItem value="quotation-financial" className="border-none">
                  <AccordionTrigger className="hover:no-underline">
                    <Label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Bond Quotation & Financial Summary</Label>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-6 pt-3">
                    {/* Bond Quotation Section */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Bond Quotation</Label>
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                          <div className="font-medium text-gray-600">Bond Issue No</div>
                          <div className="font-semibold text-gray-800">{selectedBondData.BondIssueNo}</div>
                          <div className="font-medium text-gray-600">ISIN No (optional)</div>
                          <div className="font-semibold text-gray-800">{state.isinNo || "-"}</div>
                          <div className="font-medium text-gray-600">Bond Tenor (Yrs)</div>
                          <div className="font-semibold text-gray-800">{calculationResult.bondTenor.toFixed(4)}</div>
                          <div className="font-medium text-gray-600">Term-to-Maturity (Yrs)</div>
                          <div className="font-semibold text-gray-800">{calculationResult.termToMaturity.toFixed(4)}</div>
                          <div className="font-medium text-gray-600">Issue Date</div>
                          <div className="font-semibold text-gray-800">{format(new Date(selectedBondData.IssueDate), "dd-MMM-yyyy")}</div>
                          <div className="font-medium text-gray-600">Maturity Date</div>
                          <div className="font-semibold text-gray-800">{format(new Date(selectedBondData.MaturityDate), "dd-MMM-yyyy")}</div>
                          <div className="font-medium text-gray-600">Settlement Date</div>
                          <div className="font-semibold text-gray-800">{format(new Date(state.settlementDate), "dd-MMM-yyyy")}</div>
                          <div className="font-medium text-gray-600">Last Coupon Date</div>
                          <div className="font-semibold text-gray-800">{calculationResult.previousCoupon ? format(calculationResult.previousCoupon, "dd-MMM-yyyy") : "-"}</div>
                          <div className="font-medium text-gray-600">Next Coupon Date</div>
                          <div className="font-semibold text-gray-800">{calculationResult.nextCouponDate ? format(calculationResult.nextCouponDate, "dd-MMM-yyyy") : "-"}</div>
                          <div className="font-medium text-gray-600">Coupon (KES)</div>
                          <div className="font-semibold text-gray-800">{parseFloat(state.coupon).toFixed(4)}</div>
                          <div className="font-medium text-gray-600">Coupons Paid</div>
                          <div className="font-semibold text-gray-800">{calculationResult.couponsPaid}</div>
                          <div className="font-medium text-gray-600">Coupons Due</div>
                          <div className="font-semibold text-gray-800">{calculationResult.couponsDue}</div>
                          <div className="font-medium text-gray-600">YTM (%)</div>
                          <div className="font-bold text-blue-600">
                            {state.calculationType === 'yield' 
                              ? 'Calculated from price' 
                              : parseFloat(state.yieldTM).toFixed(4) + '%'
                            }
                          </div>
                          <div className="font-medium text-gray-600">Price per 100</div>
                          <div className="font-bold text-green-600">{calculationResult.dirtyPrice.toFixed(4)}</div>
                          <div className="font-medium text-gray-600">Accrued Interest</div>
                          <div className="font-semibold text-gray-800">{calculationResult.accruedInterest.toFixed(4)}</div>
                          <div className="font-medium text-gray-600">Clean Price</div>
                          <div className="font-semibold text-gray-800">{calculationResult.cleanPrice.toFixed(4)}</div>
                        </div>
                      </div>
                    </div>

                    {/* Financial Summary Section */}
                    {parseFloat(state.faceValue) > 0 && (
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Financial Summary</Label>
                        <div className="bg-purple-50 rounded-lg p-4">
                          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
                            <div className="font-medium text-gray-600">Face Value (KES)</div>
                            <div>
                              <Input
                                value={state.faceValue}
                                onChange={(e) => setState(prev => ({ ...prev, faceValue: e.target.value }))}
                                className="h-7 border-2 border-yellow-200 hover:border-yellow-300 focus:border-yellow-400 bg-yellow-50 text-xs font-semibold"
                                placeholder="0"
                              />
                            </div>
                            <div className="font-medium text-gray-600">Consideration</div>
                            <div className="font-bold text-blue-600 text-sm">{formatCurrency(calculationResult.consideration)}</div>
                            <div className="font-medium text-gray-600">Commission (NSE)</div>
                            <div className="font-semibold text-gray-800">{formatCurrency(calculationResult.commissionNSE)}</div>
                            <div className="font-medium text-gray-600">Other levies (CMA)</div>
                            <div className="font-semibold text-gray-800">{formatCurrency(calculationResult.otherLevies)}</div>
                            <div className="font-medium text-gray-600">Withholding Tax</div>
                            <div className={calculationResult.withholdingTax > 0 ? "font-semibold text-red-600" : "font-semibold text-gray-800"}>{formatCurrency(calculationResult.withholdingTax)}</div>
                            <div className="font-medium text-gray-700 border-t pt-2">Total Payable</div>
                            <div className="font-bold text-green-600 text-sm border-t pt-2">{formatCurrency(calculationResult.totalPayable)}</div>
                            <div className="font-medium text-gray-600">Total Receivable</div>
                            <div className="font-bold text-blue-600 text-sm">{formatCurrency(calculationResult.totalReceivable)}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}

            {/* Calculation Status */}
            {isCalculating && (
              <div className="flex items-center justify-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-600">Calculating...</span>
              </div>
            )}
          </div>

          {/* Manual Calculate Button */}
          <div className="mt-8 sticky bottom-0 bg-background pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-3">
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
                className="h-10 border-2 border-gray-300 hover:border-gray-400 font-medium"
              >
                Reset
              </Button>
              <Button 
                onClick={handleCalculate}
                disabled={isCalculating || !selectedBondData}
                className="h-10 bg-blue-600 hover:bg-blue-700 font-medium shadow-md"
              >
                {isCalculating ? 'Calculating...' : 'Recalculate'}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </ScrollArea>
  );
}
