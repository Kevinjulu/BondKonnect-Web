import { format, addDays as dateFnsAddDays, differenceInDays } from 'date-fns';

export interface FinancialRates {
  nseCommission: number;
  nseMinCommission: number;
  cmaLevies: number;
}

export interface FinancialValues {
  consideration: number;
  commissionNSE: number;
  otherLevies: number;
  withholdingTax: number;
  totalPayable: number;
  totalReceivable: number;
}

/**
 * Utility to add business days (simple version)
 */
export function addDays(date: Date, days: number): Date {
  return dateFnsAddDays(date, days);
}

export function addBusinessDays(date: Date, days: number): Date {
  let result = new Date(date);
  let added = 0;
  while (added < days) {
    result = dateFnsAddDays(result, 1);
    if (result.getDay() !== 0 && result.getDay() !== 6) {
      added++;
    }
  }
  return result;
}

export function daysBetween(start: Date, end: Date): number {
  return Math.abs(differenceInDays(end, start));
}

/**
 * Calculates Indicative Range (Bid/Offer) based on Spot and Spread
 */
export function calculateIndicativeRange(spot: number, spread: number): string {
  const bid = (spot - spread) * 100;
  const offer = (spot + spread) * 100;
  return `${bid.toFixed(2)} - ${offer.toFixed(2)}`;
}

/**
 * Bond Math Functions
 */

export function calculatePreviousCoupon(issueDate: Date, settlementDate: Date, basis: number): Date {
  const couponInterval = basis === 364 ? 182 : 182.5;
  let current = new Date(issueDate);
  while (current < settlementDate) {
    const next = dateFnsAddDays(current, Math.floor(couponInterval));
    if (next > settlementDate) break;
    current = next;
  }
  return current;
}

export function calculateNextCouponDate(issueDate: Date, settlementDate: Date, maturityDate: Date, basis: number, previousCoupon?: Date): Date {
  const prev = previousCoupon || calculatePreviousCoupon(issueDate, settlementDate, basis);
  const couponInterval = basis === 364 ? 182 : 182.5;
  const next = dateFnsAddDays(prev, Math.floor(couponInterval));
  return next > maturityDate ? maturityDate : next;
}

export function calculateNextCouponDays(settlementDate: Date, nextCouponDate: Date): number {
  return differenceInDays(nextCouponDate, settlementDate);
}

export function calculateCouponsDue(settlementDate: Date, maturityDate: Date, basis: number): number {
  const daysToMaturity = differenceInDays(maturityDate, settlementDate);
  const couponInterval = basis === 364 ? 182 : 182.5;
  return Math.max(1, Math.ceil(daysToMaturity / couponInterval));
}

export function calculateAccruedInterest(settlementDate: Date, prevCoupon: Date, nextCoupon: Date, couponRate: number, basis: number): number {
  const daysInPeriod = differenceInDays(nextCoupon, prevCoupon);
  const daysAccrued = differenceInDays(settlementDate, prevCoupon);
  return (daysAccrued / basis) * couponRate;
}

/**
 * Standard Bond Pricing Formula (PV of Cash Flows)
 */
export function calculateBondPrice(yieldTM: number, coupon: number, couponsDue: number, nextCouponDays: number, basis: number): number {
  const y = yieldTM / 100;
  const c = coupon / 100;
  const f = 2; // Semi-annual
  const n = couponsDue;
  const t = nextCouponDays / (basis / f);
  
  // Price Formula: [C/y * (1 - 1/(1+y/f)^(n-1+t))] + [100 / (1+y/f)^(n-1+t)]
  const v = 1 / (1 + y/f);
  const price = ( (c * 100 / y) * (1 - Math.pow(v, n - 1 + t)) ) + ( 100 * Math.pow(v, n - 1 + t) );
  
  // Adjust for accrued interest handled by the yield formula usually returns Dirty Price
  return price;
}

/**
 * Newton-Raphson solver for Bond Yield
 */
export function calculateBondYield(dirtyPrice: number, coupon: number, couponsDue: number, nextCouponDays: number, basis: number): number {
  let y = coupon / 100; // Initial guess
  const target = dirtyPrice;
  
  for (let i = 0; i < 20; i++) {
    const p = calculateBondPrice(y * 100, coupon, couponsDue, nextCouponDays, basis);
    const diff = p - target;
    if (Math.abs(diff) < 0.0001) break;
    
    // Simple derivative approximation
    const p2 = calculateBondPrice((y + 0.0001) * 100, coupon, couponsDue, nextCouponDays, basis);
    const dy = (p2 - p) / 0.0001;
    y = y - diff / dy;
  }
  
  return y * 100;
}

export function calculateFinancialValues(
  faceValue: number,
  dirtyPrice: number,
  cleanPrice: number,
  bondIssueNo: string,
  termToMaturity: number,
  calcType: 'yield' | 'price',
  bondTermUnder10: number,
  bondTermOver10: number,
  ifbRate: number,
  rates: FinancialRates
): FinancialValues {
  const consideration = (faceValue * dirtyPrice) / 100;
  
  // Commission
  let commissionNSE = consideration * rates.nseCommission;
  if (commissionNSE < rates.nseMinCommission) commissionNSE = rates.nseMinCommission;
  
  // Levies
  const otherLevies = consideration * rates.cmaLevies;
  
  // Tax (simplified version from logic)
  let withholdingTax = 0;
  if (bondIssueNo.startsWith('IFB')) {
    // Infrastructure bonds might have specific logic
    withholdingTax = 0; 
  }
  
  const totalPayable = consideration + commissionNSE + otherLevies;
  const totalReceivable = consideration - commissionNSE - otherLevies;

  return {
    consideration,
    commissionNSE,
    otherLevies,
    withholdingTax,
    totalPayable,
    totalReceivable
  };
}