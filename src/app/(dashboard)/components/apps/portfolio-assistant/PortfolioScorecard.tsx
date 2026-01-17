"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { MoreVertical, FileDown, Loader2, Trash2, ChevronDown, ChevronRight, Info } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { getStatsTable, addNewPortfolio, getUserPortfolios, updatePortfolio, exportPortfolioToExcel, sendToQuoteBook } from "@/app/lib/actions/api.actions"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Input } from "@/app/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import { Checkbox } from "@/app/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog"
import { Label } from "@/app/components/ui/label"
import { Textarea } from "@/app/components/ui/textarea"
import { useToast } from "@/app/hooks/use-toast"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/app/components/ui/collapsible"
import { Alert, AlertDescription } from "@/app/components/ui/alert"
import { ClientSelectionDialog } from "../quote-book/client-selection-dialog"
import * as XLSX from 'xlsx'

interface BondStats {
  Id: number;
  Otr: string;
  Filter1: number;
  Filter2: number;
  Id_: number; // Restore this field - needed for backward compatibility
  BondIssueNo: string;
  IssueDate: string;
  MaturityDate: string;
  ValueDate: string;
  QuotedYield: string;
  SpotYield: number;
  DirtyPrice: number;
  Coupon: number;
  NextCpnDays: number;
  DtmYrs: number;
  Dtc: number;
  Duration: number;
  MDuration: number;
  Convexity: number;
  ExpectedReturn: number;
  ExpectedShortfall: number;
  Dv01: number;
  Last91Days: number;
  Last364Days: number;
  LqdRank: string;
  Spread: number;
  CreditRiskPremium: number | null;
  MdRank: number | null;
  ErRank: number | null;
  Basis: number;
  DayCount:number;
}

interface PortfolioEntry {
  id: string;
  id_: number;
  bondId: number;
  type: "HFS" | "HTM" | "AFS" ;
  bondsHeld: string;
  buyingDate: string;
  buyingPrice: number;
  buyingWAP: number;
  faceValueBuys: number;
  sellingDate: string;
  sellingPrice: number;
  sellingWAP: number;
  faceValueSales: number;
  faceValueBal: number;
  closingPrice: number;
  couponNet: number;
  nextCouponDays: number;
  realizedPL: number;
  unrealizedPL: number;
  totalReturn: number;
  maturityYears: number;
  coupon: number;
  duration: number;
  mDuration: number;
  dv01: number;
  expectedShortfall: number;
  spotYTM: number;
  dirtyPrice: number;
  portfolioValue: number;
  selected?: boolean;
}

type SectionVisibility = {
  notepad: boolean
  profitLoss: boolean
  scorecard: boolean
}

type ColumnVisibility = {
  bondIssueNo: boolean
  bondValuationMetrics: boolean
  riskBudgetingIndicators: boolean
}

interface Portfolio {
  Id: number;
  Name: string;
  ValueDate: string;
  Description: string;
  bonds: PortfolioBond[];
}

interface PortfolioBond {
  BondId: number;
  Id_: number;
  Type: string;
  BondIssueNo: string;
  BuyingDate: string;
  SellingDate: string | null;
  BuyingPrice: number;
  SellingPrice: number | null;
  BuyingWAP: number;
  SellingWAP:  number | null;
  FaceValueBuys:  number;
  FaceValueSales:  number | null;
  FaceValueBAL:  number;
  ClosingPrice:  number;
  CouponNET:  number;
  NextCpnDays:  number;
  RealizedPNL:  number;
  UnrealizedPNL: number;
  OneYrTotalReturn: number;
  Coupon: number;
  Duration: number;
  MDuration:  number;
  DV01:  number;
  ExpectedShortfall:  number;
  SpotYTM: number;
  DirtyPrice:  number;
  PortfolioValue:  number;
}

interface QuoteData {
  bond_id: number;
  IsBid: boolean;
  IsOffer: boolean;
  bid_price: number;
  offer_price: number;
  bid_yield: number;
  offer_yield: number;
  bid_amount: number;
  offer_amount: number;
  assigned_by: string;
  viewing_party?: string | null;
}

const EditableCell = ({ value, onChange }: { value: string | number; onChange: (value: string) => void }) => (
  <Input value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className="h-8 w-full bg-red-50" />
)

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "KES" }).format(value)
}

// Removed unused formatPercentage function

const formatDate = (date: string | Date): string => {
  if (!date) return '';
  
  // Handle timezone by using date parts directly to avoid timezone offset issues
  if (typeof date === 'string') {
    // Extract just the date part from the string (ignoring time and timezone)
    const dateParts = date.split(/[T \-:]/);
    if (dateParts.length >= 3) {
      const year = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]);
      const day = parseInt(dateParts[2]);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      }
    }
  }
  
  // Fallback to standard Date parsing
  const d = new Date(date);
  return d.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
}

// Use the same approach for formatValueDate
function formatValueDate(dateStr: string): string {
  if (!dateStr) return '';
  
  // Handle timezone by using date parts directly
  const dateParts = dateStr.split(/[T \-:]/);
  if (dateParts.length >= 3) {
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]);
    const day = parseInt(dateParts[2]);
    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      return `${month}/${day}/${year}`;
    }
  }
  
  // Fallback to standard Date parsing
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

// Add a helper function for input type="date"
function formatDateForInput(dateStr: string): string {
  if (!dateStr) return '';
  
  // Handle timezone by using date parts directly
  const dateParts = dateStr.split(/[T \-:]/);
  if (dateParts.length >= 3) {
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]);
    const day = parseInt(dateParts[2]);
    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }
  }
  
  // Accepts '2021-04-01 00:00:00', '2021-04-01', or similar
  const [datePart] = dateStr.split(' ');
  if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
    return datePart;
  }
  
  // fallback: try to parse and format
  const d = new Date(dateStr);
  return d.toISOString().split('T')[0];
}

/**
 * Calculates buying Weighted Average Price (WAP) based on Excel formula CB9
 */
function calculateBuyingWAP(
  bondIssueNo: string,
  type: string,
  buyingPrice: number,
  buyingDate: string,
  currentDate: string,
  data: PortfolioEntry[]
): number {
  // Early return checks
  if (bondIssueNo === "Overall Portfolio" || bondIssueNo === "") {
    return 0;
  }
  
  // For HTM bonds, just return buying price
  if (type === "HTM") {
    return buyingPrice;
  }
  
  // For non-HTM types, follow the Excel formula logic
  // Filter to get relevant previous entries
  const previousEntries = data.filter(entry => 
    entry.bondsHeld === bondIssueNo && 
    entry.type === type
  );
  
  // Check if there are no previous entries with the current dayBasis
  if (previousEntries.length === 0) {
    return buyingPrice;
  }
  
  // Calculate the weighted average
  let totalFaceValue = 0;
  let totalWeightedPrice = 0;
  
  // Process all relevant entries
  for (const entry of previousEntries) {
    totalFaceValue += entry.faceValueBuys;
    totalWeightedPrice += entry.buyingPrice * entry.faceValueBuys;
  }
  
  // Add current transaction
  totalFaceValue += 0; // This would be the current face value
  totalWeightedPrice += 0; // This would be current price * face value
  
  // Return weighted average or default to buying price
  return totalFaceValue > 0 ? totalWeightedPrice / totalFaceValue : buyingPrice;
}


/**
 * Calculates selling Weighted Average Price (WAP) based on Excel formula CF9
 */
function calculateSellingWAP(
  bondIssueNo: string,
  type: string,
  faceValueSales: number,
  sellingPrice: number,
  sellingDate: string,
  valueDate: string,
  data: PortfolioEntry[]
): number {
  // Early return checks
  if (bondIssueNo === "Overall Portfolio" || bondIssueNo === "") {
    return 0;
  }
  
  // If face value sales is 0, return 0 (if CE9=0)
  if (faceValueSales === 0) {
    return 0;
  }
  
  // For HTM bonds, just return selling price
  if (type === "HTM") {
    return sellingPrice;
  }
  
  // Get threshold date for comparison (CI$7-@INDEX)
  const valueDateObj = new Date(valueDate);
  const oneYearAgo = new Date(valueDateObj);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  // Check for previous entries with sales in the relevant period
  const previousSales = data.filter(entry => 
    entry.bondsHeld === bondIssueNo && 
    entry.type === type && 
    entry.sellingDate && 
    entry.faceValueSales > 0 && 
    new Date(entry.sellingDate) > oneYearAgo
  );
  
  // If there are no previous sales, return current selling price
  if (previousSales.length === 0) {
    return sellingPrice;
  }
  
  // Calculate weighted average selling price
  let totalFaceValueSold = 0;
  let totalWeightedSellingPrice = 0;
  
  // Sum face value sales from previous entries in period
  for (const entry of previousSales) {
    totalFaceValueSold += entry.faceValueSales;
    totalWeightedSellingPrice += entry.sellingPrice * entry.faceValueSales;
  }
  
  // Add current transaction
  totalFaceValueSold += faceValueSales;
  totalWeightedSellingPrice += sellingPrice * faceValueSales;
  
  // Return weighted average
  if (totalFaceValueSold === 0) return sellingPrice; // Avoid division by zero
  
  return totalWeightedSellingPrice / totalFaceValueSold;
}

/**
 * Calculates face value balance based on Excel formula CH9
 */
function calculateFaceValueBal(
  bondIssueNo: string,
  type: string,
  faceValueBuys: number,
  faceValueSales: number,
  sellingDate: string,
  sellingPrice: number,
  data: PortfolioEntry[]
): number {
  // Early return for invalid inputs
  if (bondIssueNo === "Overall Portfolio" || bondIssueNo === "") {
    return 0;
  }
  
  // Check for previous entries of the same bond and type
  const previousEntries = data.filter(entry => 
    entry.bondsHeld === bondIssueNo && 
    entry.type === type
  );
  
  const hasPreviousEntries = previousEntries.length > 0;
  
  // Check conditions as in Excel formula
  const hasSellingData = sellingDate !== '' && sellingPrice > 0 && faceValueSales > 0;
  const lacksSellingData = sellingDate === '' || sellingPrice === 0 || faceValueSales === 0;
  
  if (hasPreviousEntries && (hasSellingData || lacksSellingData)) {
    // Calculate sums for face value buys and sales from previous entries
    const sumPreviousBuys = previousEntries.reduce(
      (sum, entry) => sum + entry.faceValueBuys, 
      0
    );
    
    const sumPreviousSales = previousEntries.reduce(
      (sum, entry) => sum + entry.faceValueSales, 
      0
    );
    
    // Return total balance calculation
    return sumPreviousBuys + faceValueBuys - sumPreviousSales - faceValueSales;
  }
  
  // Simple case: just the difference between buys and sales
  if (hasSellingData) {
    return faceValueBuys - faceValueSales;
  }
  
  // Default case: sum previous buys + current buys
  const sumPreviousBuys = previousEntries.reduce(
    (sum, entry) => sum + entry.faceValueBuys,
    0
  );
  
  return sumPreviousBuys + faceValueBuys;
}

function calculateClosingPrice(
  bondIssueNo: string,
  type: string,
  faceValueSales: number,
  sellingPrice: number,
  buyingPrice: number,
  sellingDate: string,
  faceValueBal: number, 
  dirtyPrice: number
): number {
  // For HTM type, use buying price - always preserve original buying price
  if (type === "HTM") {
    return buyingPrice; // Return buying price for HTM bonds, not dirty price
  }
  
  // For HFS type, use dirty price from bond data (no change)
  if (type === "HFS") {
    return dirtyPrice;
  }
  
  // For sale condition with zero balance, use selling price (no change)
  if (sellingDate && sellingPrice > 0 && faceValueSales > 0 && faceValueBal === 0) {
    return sellingPrice;
  }
  
  // Default case: use dirty price (no change)
  return dirtyPrice;
}

function calculateCouponNet(
  bondIssueNo: string,
  type: string,
  sellingDate: string,
  valueDate: string,
  buyingWAP: number,
  coupon: number,
  filter1: number,
  filter2: number,
  daysBasis: number,
  taxRates: {
    taxRateC4: number, // 0.15 (default)
    taxRateC5: number, // 0.10
    taxRateC6: number  // 0
  },
  data: PortfolioEntry[]
): number | "" {
  // 1. Overall Portfolio
  if (bondIssueNo === "Overall Portfolio") {
    // Weighted average coupon: sum(coupon * faceValue) / largest faceValue
    const total = data
      .filter((row: PortfolioEntry) => row.bondsHeld !== "Overall Portfolio")
      .reduce((acc: { couponSum: number; maxFaceValue: number }, row: PortfolioEntry) => {
        acc.couponSum += (row.coupon || 0) * (row.faceValueBuys || 0);
        acc.maxFaceValue = Math.max(acc.maxFaceValue, row.faceValueBuys || 0);
        return acc;
      }, { couponSum: 0, maxFaceValue: 0 });
    if (total.maxFaceValue === 0) return 0;
    return total.couponSum / total.maxFaceValue;
  }

  // 2. Skip Calculation (Return Blank)
  // a) Non-HTM with duplicates below
  if (
    type !== "HTM" &&
    data.some((row: PortfolioEntry) => row.bondsHeld === bondIssueNo && row.type === type)
  ) {
    return "";
  }
  // b) Blank portfolio name
  if (!bondIssueNo) return "";

  // c) Sold bond, no buying price, term ≠ 364, sold >1 year ago
  const hasSellingDate = !!sellingDate;
  const termNot364 = daysBasis !== 364;
  const soldMoreThan1YrAgo = valueDate && sellingDate && (new Date(valueDate).getTime() - new Date(sellingDate).getTime()) / (1000 * 60 * 60 * 24) > 365;
  if (
    hasSellingDate &&
    termNot364 &&
    soldMoreThan1YrAgo &&
    buyingWAP === 0
  ) {
    return "";
  }
  // d) Sold bond, no buying price, term = 364, sold >364 days ago
  const termIs364 = daysBasis === 364;
  const soldMoreThan364DaysAgo = valueDate && sellingDate && (new Date(valueDate).getTime() - new Date(sellingDate).getTime()) / (1000 * 60 * 60 * 24) > 364;
  if (
    hasSellingDate &&
    termIs364 &&
    soldMoreThan364DaysAgo &&
    buyingWAP === 0
  ) {
    return "";
  }

  // 3. Tax/Fee Adjustment Logic
  // Simulate tax code lookup (replace with your actual logic if you have a tax code field)
  // For now, let's use filter1 - filter2 as a proxy for tax code
  const taxCode = filter1 - filter2;
  // If you have a better way to get taxCode, use it here

  if (taxCode === 0) {
    return coupon;
  } else if (taxCode === 1) {
    return coupon * (1 - taxRates.taxRateC6);
  } else if (taxCode === 2) {
    return coupon * (1 - taxRates.taxRateC5);
  } else {
    return coupon * (1 - taxRates.taxRateC4);
  }
}

// function calculateRealizedPL(
//   bondIssueNo: string,
//   type: string,
//   sellingDate: string,
//   sellingWAP: number,
//   buyingWAP: number,
//   faceValueSales: number,
//   couponNet: number,
//   valueDate: string,
//   daysBasis: number,
//   nextCouponDays: number,
//   data: PortfolioEntry[]
// ): number {
//   // Early return conditions for invalid inputs
//   if (!bondIssueNo || !type || !sellingDate || sellingWAP <= 0 || faceValueSales <= 0) {
//     return 0;
//   }

//   // Parse dates for calculations
//   const sellingDateObj = new Date(sellingDate);
//   const valueDateObj = new Date(valueDate);
  
//   // Calculate basic price difference
//   const priceDiff = (sellingWAP - buyingWAP) * (faceValueSales / 100);

//   // For "Overall Portfolio" type - sum all previous entries
//   if (bondIssueNo === "Overall Portfolio") {
//     return data.filter(row => row.bondsHeld !== "Overall Portfolio")
//       .reduce((sum, row) => sum + (row.realizedPL || 0), 0);
//   }

//   // Handle 364-day bonds (including HTM bonds)
//   if (daysBasis === 364) {
//     // Basic price difference calculation
//     const basicPriceDiff = (sellingWAP - buyingWAP) * (faceValueSales / 100);
    
//     // Calculate date points for coupon accrual
//     const dateWithNextCoupon = new Date(valueDateObj);
//     dateWithNextCoupon.setDate(dateWithNextCoupon.getDate() + nextCouponDays - 364); // One year before next coupon
    
//     const sixMonthsBeforeNextCoupon = new Date(valueDateObj);
//     sixMonthsBeforeNextCoupon.setDate(sixMonthsBeforeNextCoupon.getDate() + nextCouponDays - 182); // Six months before next coupon
    
//     // Calculate holdings for various periods
//     const holdingsAtOneYearAgo = calculateNetHoldingsForBondAndType(data, bondIssueNo, type, dateWithNextCoupon);
//     const holdingsAtSixMonthsAgo = calculateNetHoldingsForBondAndType(data, bondIssueNo, type, sixMonthsBeforeNextCoupon);
    
//     // Calculate coupon accrual
//     const couponAccrual = 
//       (holdingsAtOneYearAgo * (couponNet / 100) / 2) + 
//       (holdingsAtSixMonthsAgo * (couponNet / 100) / 2);
    
//     return basicPriceDiff + couponAccrual;
//   } 
  
//   // For non-364 day bonds
//   else {
//     // For HTM bonds with non-364 day basis, use the price difference
//     if (type === "HTM") {
//       const oneYearAgo = new Date(valueDateObj);
//       oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      
//       const sixMonthsAgo = new Date(valueDateObj);
//       sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
//       // Calculate holdings for various periods
//       const holdingsAtOneYearAgo = calculateNetHoldingsForBondAndType(data, bondIssueNo, type, oneYearAgo);
//       const holdingsAtSixMonthsAgo = calculateNetHoldingsForBondAndType(data, bondIssueNo, type, sixMonthsAgo);
      
//       // Calculate coupon accrual
//       const couponAccrual = 
//         (holdingsAtOneYearAgo * (couponNet / 100) / 2) + 
//         (holdingsAtSixMonthsAgo * (couponNet / 100) / 2);
      
//       return priceDiff + couponAccrual;
//     }
    
//     // For non-HTM, non-364 day bonds
//     const holdingPeriod = daysBasis;
//     const oneYearAgo = new Date(valueDateObj);
//     oneYearAgo.setDate(oneYearAgo.getDate() - holdingPeriod);
    
//     const sixMonthsAgo = new Date(valueDateObj);
//     sixMonthsAgo.setDate(sixMonthsAgo.getDate() - Math.floor(holdingPeriod / 2));
    
//     // Calculate holdings for this specific bond and type
//     const holdingsAtOneYear = calculateNetHoldingsForBondAndType(data, bondIssueNo, type, oneYearAgo);
//     const holdingsAtSixMonths = calculateNetHoldingsForBondAndType(data, bondIssueNo, type, sixMonthsAgo);
    
//     // Calculate accrual
//     const couponAccrual = 
//       (holdingsAtOneYear * (couponNet / 100) / 2) + 
//       (holdingsAtSixMonths * (couponNet / 100) / 2);
    
//     return priceDiff + couponAccrual;
//   }
// }

// // Helper function to calculate net holdings for a specific bond issue and type at a date
// function calculateNetHoldingsForBondAndType(
//   data: PortfolioEntry[],
//   bondIssueNo: string,
//   type: string,
//   date: Date
// ): number {
//   // Filter for relevant entries up to the given date
//   const relevantEntries = data.filter(entry => 
//     entry.bondsHeld === bondIssueNo && 
//     entry.type === type &&
//     new Date(entry.buyingDate) <= date
//   );
  
//   // Calculate net holdings (buys - sales)
//   let totalBuys = 0;
//   let totalSales = 0;
  
//   for (const entry of relevantEntries) {
//     totalBuys += entry.faceValueBuys || 0;
//     totalSales += entry.faceValueSales || 0;
//   }
  
//   return totalBuys - totalSales;
// }


function calculateRealizedPL(
  bondIssueNo: string,
  type: string,
  sellingDate: string,
  sellingWAP: number,
  // closingPrice: number,
  buyingWAP: number,
  faceValueSales: number,
  couponNet: number,
  valueDate: string,
  daysBasis: number,
  nextCouponDays: number,
  data: PortfolioEntry[]
): number {
  console.log("🔢 Calculating realized profit and loss for bond:", bondIssueNo);
  console.log("🔢 Type:", type);
  console.log("🔢 Selling date:", sellingDate);
  console.log("🔢 Selling WAP:", sellingWAP);
  // console.log("🔢 Closing price:", closingPrice);
  console.log("🔢 Buying WAP:", buyingWAP);
  console.log("🔢 Face value sales:", faceValueSales);
  console.log("🔢 Coupon net:", couponNet);
  console.log("🔢 Value date:", valueDate);
  console.log("🔢 Days basis:", daysBasis);
  console.log("🔢 Next coupon days:", nextCouponDays);
  console.log("🔢 Data:", data);
  // Validate inputs with more specific checks
  if (!bondIssueNo || !type || !sellingDate) {
    // throw new Error('Missing required parameters: bondIssueNo, type, or sellingDate');
    return 0;
  }
  
  if (sellingWAP <= 0 || faceValueSales <= 0) {
    // throw new Error('sellingWAP and faceValueSales must be positive numbers');
    return 0;
  }

  // Parse dates with validation
  const valueDateObj = parseDate(valueDate);

  // Calculate basic price difference
  const priceDiff = calculatePriceDifference(sellingWAP, buyingWAP, faceValueSales);

  // Handle "Overall Portfolio" case
  if (bondIssueNo === "Overall Portfolio") {
    return calculateOverallPortfolioPL(data);
  }

  // Calculate coupon accrual based on bond type and days basis
  const couponAccrual = calculateCouponAccrual(
    data,
    bondIssueNo,
    type,
    couponNet,
    valueDateObj,
    daysBasis,
    nextCouponDays
  );

  return priceDiff + couponAccrual;
}

function parseDate(dateString: string): Date {
  // Handle ISO format (YYYY-MM-DD)
  if (dateString.includes("-")) {
    const parts = dateString.split("-");
    if (parts.length !== 3) throw new Error(`Invalid ISO date: ${dateString}`);
    
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Months are 0-based
    const day = parseInt(parts[2], 10);
    
    return new Date(year, month, day); // Use local time
  }

  // Handle slash-delimited formats (MM/DD/YYYY or DD/MM/YYYY)
  const parts = dateString.split("/");
  if (parts.length !== 3) throw new Error(`Invalid date format: ${dateString}`);

  let day: number, month: number, year: number;
  
  // Detect DD/MM/YYYY format
  if (parseInt(parts[0], 10) > 12) {
    day = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10) - 1;
    year = parseInt(parts[2], 10);
  } else { // MM/DD/YYYY format
    month = parseInt(parts[0], 10) - 1;
    day = parseInt(parts[1], 10);
    year = parseInt(parts[2], 10);
  }

  return new Date(year, month, day); // Use local time
}

function calculatePriceDifference(sellingWAP: number, buyingWAP: number, faceValueSales: number): number {
  return (sellingWAP - buyingWAP) * (faceValueSales / 100);
}

function calculateOverallPortfolioPL(data: PortfolioEntry[]): number {
  return data
    .filter(row => row.bondsHeld !== "Overall Portfolio")
    .reduce((sum, row) => sum + (row.realizedPL || 0), 0);
}

function calculateCouponAccrual(
  data: PortfolioEntry[],
  bondIssueNo: string,
  type: string,
  couponNet: number,
  valueDateObj: Date,
  daysBasis: number,
  nextCouponDays: number
): number {
  if (daysBasis === 364) {
    return calculate364DayBondCouponAccrual(data, bondIssueNo, type, couponNet, valueDateObj, nextCouponDays);
  }

  if (type === "HTM") {
    return calculateHTMCouponAccrual(data, bondIssueNo, type, couponNet, valueDateObj);
  }

  return calculateStandardCouponAccrual(data, bondIssueNo, type, couponNet, valueDateObj, daysBasis);
}


function calculate364DayBondCouponAccrual(
  data: PortfolioEntry[],
  bondIssueNo: string,
  type: string,
  couponNet: number,
  valueDateObj: Date,
  nextCouponDays: number
): number {
  // Calculate dates using valueDate + nextCouponDays - daysBasis
  const oneYearAgo = new Date(valueDateObj);
  oneYearAgo.setDate(oneYearAgo.getDate() + nextCouponDays - 364);
  
  const sixMonthsAgo = new Date(valueDateObj);
  sixMonthsAgo.setDate(sixMonthsAgo.getDate() + nextCouponDays - 182);
  
  const holdingsAtOneYearAgo = calculateNetHoldings(data, bondIssueNo, type, oneYearAgo);
  const holdingsAtSixMonthsAgo = calculateNetHoldings(data, bondIssueNo, type, sixMonthsAgo);
  
  return (holdingsAtOneYearAgo * (couponNet / 100) / 2 + 
         (holdingsAtSixMonthsAgo * (couponNet / 100) / 2));
}
function calculateHTMCouponAccrual(
  data: PortfolioEntry[],
  bondIssueNo: string,
  type: string,
  couponNet: number,
  valueDateObj: Date
): number {
  const oneYearAgo = new Date(valueDateObj);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  const sixMonthsAgo = new Date(valueDateObj);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const holdingsAtOneYearAgo = calculateNetHoldings(data, bondIssueNo, type, oneYearAgo);
  const holdingsAtSixMonthsAgo = calculateNetHoldings(data, bondIssueNo, type, sixMonthsAgo);
  
  return (holdingsAtOneYearAgo * (couponNet / 100) / 2 + 
         (holdingsAtSixMonthsAgo * (couponNet / 100) / 2));
}

function calculateStandardCouponAccrual(
  data: PortfolioEntry[],
  bondIssueNo: string,
  type: string,
  couponNet: number,
  valueDateObj: Date,
  daysBasis: number
): number {
  const holdingPeriod = daysBasis;
  const oneYearAgo = new Date(valueDateObj);
  oneYearAgo.setDate(oneYearAgo.getDate() - holdingPeriod);
  
  const sixMonthsAgo = new Date(valueDateObj);
  sixMonthsAgo.setDate(sixMonthsAgo.getDate() - Math.floor(holdingPeriod / 2));
  
  const holdingsAtOneYear = calculateNetHoldings(data, bondIssueNo, type, oneYearAgo);
  const holdingsAtSixMonths = calculateNetHoldings(data, bondIssueNo, type, sixMonthsAgo);
  
  return (holdingsAtOneYear * (couponNet / 100) / 2 +  (holdingsAtSixMonths * (couponNet / 100) / 2));
}

function calculateNetHoldings(
  data: PortfolioEntry[],
  bondIssueNo: string,
  type: string,
  date: Date
): number {
  // Calculate total buys before or on the target date
  const totalBuys = data
    .filter(entry => 
      entry.bondsHeld === bondIssueNo &&
      entry.type === type &&
      entry.faceValueBuys > 0 &&
      new Date(entry.buyingDate) <= date
    )
    .reduce((sum, entry) => sum + (entry.faceValueBuys || 0), 0);

  // Calculate total sales before or on the target date
  const totalSales = data
    .filter(entry => 
      entry.bondsHeld === bondIssueNo &&
      entry.type === type &&
      entry.faceValueSales > 0 &&
      new Date(entry.sellingDate) <= date
    )
    .reduce((sum, entry) => sum + (entry.faceValueSales || 0), 0);

  return totalBuys - totalSales;
}

/**
 * Calculates unrealized profit and loss based on Excel formula CM9
 */
function calculateUnrealizedPL(
  bondIssueNo: string,
  closingPrice: number,
  buyingWAP: number,
  faceValueBal: number,
  data: PortfolioEntry[]
): number | "" {
  if (bondIssueNo !== "Overall Portfolio" && (closingPrice === 0 || closingPrice === null || closingPrice === undefined)) {
    return "";
  }
  if (bondIssueNo === "Overall Portfolio") {
    return data
      .filter(entry => entry.bondsHeld !== "Overall Portfolio")
      .reduce((sum, entry) => sum + (typeof entry.unrealizedPL === "number" ? entry.unrealizedPL : 0), 0);
  }
  return ((closingPrice - buyingWAP) * faceValueBal) / 100;
}
function calculateOneYearTotalReturn(
  bondIssueNo: string,
  type: string,
  daysBasis: number,
  buyingWAP: number,  // This is CB9 in Excel - the calculated buying WAP for this row
  realizedPL: number,
  unrealizedPL: number,
  faceValueBuys: number,
  faceValueSales: number,
  faceValueBal: number,
  buyingDate: string,
  closingPrice: number,
  sellingDate: string,
  valueDate: string,
  data: PortfolioEntry[]
): number {
  console.log("🔢 Calculating 1Y Total Return for:", bondIssueNo);
  console.log("🔢 Type:", type);
  console.log("🔢 Current Row Buying WAP (CB9):", buyingWAP);
  
  // Parse dates safely
  let valueDateObj: Date;
  try {
    valueDateObj = parseDate(valueDate);
  } catch (error: unknown) {
    console.error("❌ Date parsing error:", error instanceof Error ? error.message : 'Unknown error');
    return 0;
  }

  // Calculate total PL
  const totalPL = realizedPL + unrealizedPL;
  console.log("📊 Total PL (Realized + Unrealized):", totalPL);

  // For HFS bonds, follow Excel formula logic exactly
  if (type === "HFS" || type === "AFS") {
    // Calculate the cutoff date: valueDate - daysBasis
    const cutoffDate = new Date(valueDateObj);
    cutoffDate.setDate(cutoffDate.getDate() - daysBasis);
    
    console.log("📅 Value Date:", valueDate);
    console.log("📅 Cutoff Date (ValueDate - DaysBasis):", cutoffDate.toISOString().split('T')[0]);
    console.log("🔢 Days Basis:", daysBasis);
    
    // Calculate face value amounts based on Excel logic:
    // SUMPRODUCT(($BZ$8:BZ9>=$CI$7-INDEX(...))*($BX$8:BX9=BX9),$CC$8:CC9) + 
    // SUMIFS($CC$8:CC9,$BW$8:BW9,"<>"&"HTM",$BW$8:BW9,BW9,$BX$8:BX9,BX9,$BZ$8:BZ9,"<"&$CI$7-INDEX(...)) - 
    // SUMIFS($CG$8:CG9,$BW$8:BW9,"<>"&"HTM",$BW$8:BW9,BW9,$BX$8:BX9,BX9,$CD$8:CD9,"<"&$CI$7-INDEX(...))
    
    let totalFaceValue = 0;
    
    // Process all entries for this bond and type
    const bondEntries = data.filter(entry => 
      entry.bondsHeld === bondIssueNo && 
      entry.type === type
    );
    
    console.log(`📋 Processing ${bondEntries.length} entries for ${bondIssueNo} (${type})`);
    
    for (const entry of bondEntries) {
      const entryBuyingDate = parseDate(entry.buyingDate);
      const entrySellingDate = entry.sellingDate ? parseDate(entry.sellingDate) : null;
      
      // Part 1: Buys on or after cutoff date (including current buying date)
      if (entryBuyingDate >= cutoffDate && entry.faceValueBuys > 0) {
        totalFaceValue += entry.faceValueBuys;
        console.log(`📈 Buy on/after cutoff: Date=${entry.buyingDate}, Face=${entry.faceValueBuys}`);
      }
      
      // Part 2: Buys before cutoff date  
      if (entryBuyingDate < cutoffDate && entry.faceValueBuys > 0) {
        totalFaceValue += entry.faceValueBuys;
        console.log(`📈 Buy before cutoff: Date=${entry.buyingDate}, Face=${entry.faceValueBuys}`);
      }
      
      // Part 3: Sales before cutoff date (subtract)
      if (entrySellingDate && entrySellingDate < cutoffDate && entry.faceValueSales > 0) {
        totalFaceValue -= entry.faceValueSales;
        console.log(`📉 Sale before cutoff: Date=${entry.sellingDate}, Face=${entry.faceValueSales}`);
      }
    }
    
    console.log("💰 Total Face Value for calculation:", totalFaceValue);
    
    // Calculate denominator using the Excel formula structure:
    // CB9 * (calculated face values / 100)
    const denominator = buyingWAP * (totalFaceValue / 100);
    
    console.log("🔢 Buying WAP (CB9):", buyingWAP);
    console.log("🔢 Denominator calculation: ", buyingWAP, " * (", totalFaceValue, " / 100) = ", denominator);
    
    if (denominator === 0) {
      console.warn("⚠️ Denominator is zero, returning 0");
      return 0;
    }
    
    // Calculate return: totalPL / denominator * 100
    const returnValue = (totalPL / denominator) * 100;
    
    console.log("📈 Final Return Calculation:");
    console.log("   Total PL:", totalPL);
    console.log("   Denominator:", denominator);
    console.log("   Return:", returnValue, "%");
    
    return returnValue;
  }
  
  // For HTM bonds, use simpler calculation
  if (type === "HTM") {
    const denominator = buyingWAP * (faceValueBuys / 100);
    return denominator > 0 ? (totalPL / denominator) * 100 : 0;
  }
  
  // Default case
  return 0;
}


function generateDefaultValues(bondStats: BondStats): PortfolioEntry {
  // Generate a unique ID for the new entry
  const timestamp = Date.now();
  const randomSuffix = Math.floor(Math.random() * 1000);
  const uniqueId = `${timestamp}-${randomSuffix}`;

  return {
    id: uniqueId,
    bondId: bondStats.Id,
    id_: bondStats.Id_,
    type: "HFS",
    bondsHeld: bondStats.BondIssueNo, // Ensure the bond issue number is set explicitly
    buyingDate: formatDateForInput(new Date().toISOString()),
    buyingPrice: bondStats.DirtyPrice,
    buyingWAP: 0,
    faceValueBuys: 0,
    sellingDate: "",
    sellingPrice: 0,
    sellingWAP: 0,
    faceValueSales: 0,
    faceValueBal: 0,
    closingPrice: bondStats.DirtyPrice,
    couponNet: bondStats.Coupon,
    nextCouponDays: bondStats.NextCpnDays,
    realizedPL: 0,
    unrealizedPL: 0,
    totalReturn: 0,
    maturityYears: bondStats.DtmYrs,
    coupon: bondStats.Coupon,
    duration: bondStats.Duration,
    mDuration: bondStats.MDuration,
    dv01: bondStats.Dv01,
    expectedShortfall: bondStats.ExpectedShortfall,
    spotYTM: bondStats.SpotYield,
    dirtyPrice: bondStats.DirtyPrice,
    portfolioValue: 0,
    selected: false
  };
}

/**
 * Calculates portfolio value based on Excel formula BL9
 * =IF(AND(ISBLANK(BI9),BJ9=""),"",IF(OR(AND(BJ9<>"",BJ9<>"Overall Portfolio",BK9=""),AND(BI9<>"HTM",COUNTIFS(BJ10:$BJ$80,BJ9,BI10:$BI$80,BI9)>0)),0,IF(BJ9="Overall Portfolio",SUM(BL$8:$BL8),ROUND(BK9,6)*CH9/100)))
 */
function calculatePortfolioValue(
  type: string,
  bondIssueNo: string,
  closingPrice: number,
  faceValueBal: number,
  data: PortfolioEntry[]
): number {
  // Check first condition: AND(ISBLANK(BI9),BJ9="")
  if (!type && !bondIssueNo) {
    return 0;
  }
  
  // Check second condition: OR(AND(BJ9<>"",BJ9<>"Overall Portfolio",BK9=""),AND(BI9<>"HTM",COUNTIFS(BJ10:$BJ$80,BJ9,BI10:$BI$80,BI9)>0))
  const hasEmptyClosingPrice = closingPrice === 0 || closingPrice === null || closingPrice === undefined;
  const hasFutureEntries = data.some(entry => 
    entry.bondsHeld === bondIssueNo && 
    entry.type === type
  );
  
  if ((bondIssueNo !== "" && bondIssueNo !== "Overall Portfolio" && hasEmptyClosingPrice) || 
      (type !== "HTM" && hasFutureEntries)) {
    return 0;
  }
  
  // Check third condition: BJ9="Overall Portfolio"
  if (bondIssueNo === "Overall Portfolio") {
    // SUM(BL$8:$BL8)
    return data
      .filter(entry => entry.bondsHeld !== "Overall Portfolio")
      .reduce((sum, entry) => sum + entry.portfolioValue, 0);
  }
  
  // Default calculation: ROUND(BK9,6)*CH9/100
  return Math.round(closingPrice * 1000000) / 1000000 * faceValueBal / 100;
}

/**
 * Recalculates values for a single row
 */
function recalculateRow(
  rowIndex: number,
  data: PortfolioEntry[],
  availableBonds: BondStats[],
  valueDate: string
): PortfolioEntry[] {
  const newData = [...data];
  const currentRow = { ...newData[rowIndex] };
  const otherData = [...newData.slice(0, rowIndex), ...newData.slice(rowIndex + 1)];
  
  // Find corresponding bond stats
  const bondStats = availableBonds.find(bond => bond.BondIssueNo === currentRow.bondsHeld);
  if (!bondStats) {
    // Handle missing bond stats gracefully instead of just logging error
    console.warn(`Bond stats not found for ${currentRow.bondsHeld}. Using default values.`);
    
    // Create a default bondStats object using current values
    const defaultBondStats: BondStats = {
      BondIssueNo: currentRow.bondsHeld,
      Coupon: currentRow.coupon,
      DirtyPrice: currentRow.dirtyPrice,
      NextCpnDays: currentRow.nextCouponDays,
      Basis: 364, // Default value
      Filter1: 0,  // Default value
      Filter2: 0,  // Default value
      SpotYield: currentRow.spotYTM,
      // Include other required properties with default values
      Otr: "",
      Id: 0,
      Id_: currentRow.id_, // Remove this line or make it optional
      IssueDate: "",
      MaturityDate: "",
      ValueDate: "",
      QuotedYield: "",
      DtmYrs: currentRow.maturityYears,
      Dtc: 0,
      Duration: currentRow.duration,
      MDuration: currentRow.mDuration,
      Convexity: 0,
      ExpectedReturn: 0,
      ExpectedShortfall: currentRow.expectedShortfall,
      Dv01: currentRow.dv01,
      Last91Days: 0,
      Last364Days: 0,
      LqdRank: "",
      Spread: 0,
      CreditRiskPremium: null,
      MdRank: null,
      ErRank: null,
      DayCount: 364
    };
    
    // Use the default bond stats for calculations
    return calculateRowWithBondStats(rowIndex, newData, otherData, currentRow, defaultBondStats);
  }
  
  // Continue with normal calculation using found bondStats
  return calculateRowWithBondStats(rowIndex, newData, otherData, currentRow, bondStats);
}

// New helper function to avoid duplicate code
function calculateRowWithBondStats(
  rowIndex: number,
  newData: PortfolioEntry[],
  otherData: PortfolioEntry[],
  currentRow: PortfolioEntry,
  bondStats: BondStats
): PortfolioEntry[] {
  // Set up tax rates
  const taxRates = {
    taxRateC4: 0.10,
    taxRateC5: 0.15,
    taxRateC6: 0.00
  };
  
  // Recalculate all derived values
  currentRow.buyingWAP = calculateBuyingWAP(
    currentRow.bondsHeld,
    currentRow.type,
    currentRow.buyingPrice,
    currentRow.buyingDate,
    formatValueDate(bondStats.ValueDate),
    otherData
  );
  
  currentRow.sellingWAP = calculateSellingWAP(
    currentRow.bondsHeld,
    currentRow.type,
    currentRow.faceValueSales,
    currentRow.sellingPrice,
    currentRow.sellingDate,
    formatValueDate(bondStats.ValueDate),
    otherData
  );
  
  currentRow.faceValueBal = calculateFaceValueBal(
    currentRow.bondsHeld,
    currentRow.type,
    currentRow.faceValueBuys,
    currentRow.faceValueSales,
    currentRow.sellingDate,
    currentRow.sellingPrice,
    otherData
  );
  
  // Calculate closing price according to logic
  currentRow.closingPrice = calculateClosingPrice(
    currentRow.bondsHeld,
    currentRow.type,
    currentRow.faceValueSales,
    currentRow.sellingPrice,
    currentRow.buyingPrice,
    currentRow.sellingDate,
    currentRow.faceValueBal,
    bondStats.DirtyPrice
  );
  
  // Calculate dirty price exactly according to the Excel formula: 
  // =IF(BI9="HTM",CB9,IF(CI9="","",CI9))
  // If type is HTM, use buying price; otherwise use dirty price from bond
  if (currentRow.type === "HTM") {
    currentRow.dirtyPrice = currentRow.buyingPrice;
  } else {
    // If closing price is empty/zero, use empty string equivalent (0)
    currentRow.dirtyPrice = currentRow.closingPrice || 0;
  }
  
  currentRow.couponNet = Number(calculateCouponNet(
    currentRow.bondsHeld,
    currentRow.type,
    currentRow.sellingDate,
    formatValueDate(bondStats.ValueDate),
    currentRow.buyingWAP,
    bondStats.Coupon,
    bondStats.Filter1,
    bondStats.Filter2,
    bondStats.DayCount,
    taxRates,
    otherData
  ));
  
  currentRow.realizedPL = Number(calculateRealizedPL(
    currentRow.bondsHeld,
    currentRow.type,
    currentRow.sellingDate,
    currentRow.sellingWAP,
    // currentRow.closingPrice,
    currentRow.buyingWAP,
    currentRow.faceValueSales,
    currentRow.couponNet,
    formatValueDate(bondStats.ValueDate),
    // bondStats.Basis || 364,
    364,
    bondStats.NextCpnDays,
    newData // Pass the complete dataset including the current row
  )) || 0;
  
  currentRow.unrealizedPL = Number(calculateUnrealizedPL(
    currentRow.bondsHeld,
    currentRow.closingPrice,
    currentRow.buyingWAP,
    currentRow.faceValueBal,
    otherData
  )) || 0;
  
  currentRow.totalReturn = parseFloat(
    calculateOneYearTotalReturn(
      currentRow.bondsHeld,
      currentRow.type,
      // bondStats.Basis || 364,
      364,
      currentRow.buyingWAP,
      currentRow.realizedPL,
      currentRow.unrealizedPL,
      currentRow.faceValueBuys,
      currentRow.faceValueSales,
      currentRow.faceValueBal,
      currentRow.buyingDate,
      currentRow.closingPrice,
      currentRow.sellingDate,
      formatValueDate(bondStats.ValueDate),
      newData
    ).toFixed(4)
  );
  
  // Calculate portfolio value
  currentRow.portfolioValue = calculatePortfolioValue(
    currentRow.type,
    currentRow.bondsHeld,
    currentRow.closingPrice,
    currentRow.faceValueBal,
    otherData
  );
  
  // Set maturityYears from DtmYrs
  currentRow.maturityYears = bondStats.DtmYrs ? bondStats.DtmYrs : 0;
  
  // Update the row in the data array
  newData[rowIndex] = currentRow;
  
  return newData;
}

/**
 * Recalculates the entire portfolio
 */
function recalculatePortfolio(
  data: PortfolioEntry[],
  availableBonds: BondStats[],
  valueDate: string
): PortfolioEntry[] {
  let newData = [...data];

  // Recalculate each row
  for (let i = 0; i < newData.length; i++) {
    // Skip the overall portfolio row if it exists
    if (newData[i].bondsHeld === "Overall Portfolio") continue;
    newData = recalculateRow(i, newData, availableBonds, valueDate);
  }

  // Calculate overall portfolio totals
  if (newData.length > 0) {
    const overallIndex = newData.findIndex(row => row.bondsHeld === "Overall Portfolio");
    if (overallIndex === -1) {
      // Create a new overall portfolio row
      const overallRow: PortfolioEntry = {
        id: "overall-portfolio",
        type: "HFS",
        id_: 0,
        bondsHeld: "Overall Portfolio",
        bondId: 0, // Added missing required property
        buyingDate: "",
        buyingPrice: 0,
        buyingWAP: 0,
        faceValueBuys: 0,
        sellingDate: "",
        sellingPrice: 0,
        sellingWAP: 0,
        faceValueSales: 0,
        faceValueBal: 0,
        closingPrice: 0,
        couponNet: 0,
        nextCouponDays: 0,
        realizedPL: 0,
        unrealizedPL: 0,
        totalReturn: 0,
        maturityYears: 0,
        coupon: 0,
        duration: 0,
        mDuration: 0,
        dv01: 0,
        expectedShortfall: 0,
        spotYTM: 0,
        dirtyPrice: 0,
        portfolioValue: 0
      };
      let totalPortfolioValue = 0;
      let totalFaceValueBuys = 0;
      let totalFaceValueSales = 0;
      let totalFaceValueBal = 0;
      for (const row of newData) {
        if (row.bondsHeld === "Overall Portfolio") continue;
        overallRow.faceValueBal += row.faceValueBal;
        overallRow.realizedPL += row.realizedPL;
        overallRow.unrealizedPL += row.unrealizedPL;
        overallRow.portfolioValue += row.portfolioValue;
        totalPortfolioValue += row.portfolioValue;
        totalFaceValueBuys += row.faceValueBuys;
        totalFaceValueSales += row.faceValueSales;
        totalFaceValueBal += row.faceValueBal;
      }
      // Weighted averages for new fields
      if (totalPortfolioValue > 0) {
        for (const row of newData) {
          if (row.bondsHeld === "Overall Portfolio") continue;
          const weightPV = row.portfolioValue / totalPortfolioValue;
          overallRow.maturityYears += row.maturityYears * weightPV;
          overallRow.coupon += row.coupon * weightPV;
          overallRow.duration += row.duration * weightPV;
          overallRow.mDuration += row.mDuration * weightPV;
          overallRow.dv01 += row.dv01 * weightPV;
          overallRow.expectedShortfall += row.expectedShortfall * weightPV;
          overallRow.spotYTM += row.spotYTM * weightPV;
          overallRow.dirtyPrice += row.dirtyPrice * weightPV;
          overallRow.closingPrice += row.closingPrice * weightPV;
          overallRow.couponNet += row.couponNet * weightPV;
          overallRow.nextCouponDays += row.nextCouponDays * weightPV;
          overallRow.buyingWAP += row.buyingWAP * weightPV;
          overallRow.sellingWAP += row.sellingWAP * weightPV;
        }
      }
      // Weighted averages for price fields by face value
      if (totalFaceValueBuys > 0) {
        overallRow.buyingPrice = newData.filter(r => r.bondsHeld !== "Overall Portfolio").reduce((sum, row) => sum + row.buyingPrice * row.faceValueBuys, 0) / totalFaceValueBuys;
      }
      if (totalFaceValueSales > 0) {
        overallRow.sellingPrice = newData.filter(r => r.bondsHeld !== "Overall Portfolio").reduce((sum, row) => sum + row.sellingPrice * row.faceValueSales, 0) / totalFaceValueSales;
      }
      // Calculate overall total return
      const totalPL = overallRow.realizedPL + overallRow.unrealizedPL;
      if (overallRow.portfolioValue > 0) {
        overallRow.totalReturn = parseFloat((totalPL / overallRow.portfolioValue * 100).toFixed(4));
      }
      // Weighted average DtmYrs for overallRow.maturityYears
      if (totalPortfolioValue > 0) {
        const maturityNumerator = newData.filter(row => row.bondsHeld !== "Overall Portfolio").reduce((sum, row) => {
          const bondStats = availableBonds.find(b => b.BondIssueNo === row.bondsHeld);
          const dtm = bondStats && bondStats.DtmYrs ? bondStats.DtmYrs : 0;
          return sum + row.portfolioValue * dtm;
        }, 0);
        overallRow.maturityYears = maturityNumerator / totalPortfolioValue;
      }
      newData.push(overallRow);
    } else {
      const overallRow = { ...newData[overallIndex] };
      overallRow.faceValueBal = 0;
      overallRow.realizedPL = 0;
      overallRow.unrealizedPL = 0;
      overallRow.portfolioValue = 0;
      overallRow.maturityYears = 0;
      overallRow.coupon = 0;
      overallRow.duration = 0;
      overallRow.mDuration = 0;
      overallRow.dv01 = 0;
      overallRow.expectedShortfall = 0;
      overallRow.spotYTM = 0;
      overallRow.dirtyPrice = 0;
      overallRow.closingPrice = 0;
      overallRow.couponNet = 0;
      overallRow.nextCouponDays = 0;
      overallRow.buyingWAP = 0;
      overallRow.sellingWAP = 0;
      overallRow.buyingPrice = 0;
      overallRow.sellingPrice = 0;
      let totalPortfolioValue = 0;
      let totalFaceValueBuys = 0;
      let totalFaceValueSales = 0;
      let totalFaceValueBal = 0;
      for (const row of newData) {
        if (row.bondsHeld === "Overall Portfolio") continue;
        overallRow.faceValueBal += row.faceValueBal;
        overallRow.realizedPL += row.realizedPL;
        overallRow.unrealizedPL += row.unrealizedPL;
        overallRow.portfolioValue += row.portfolioValue;
        totalPortfolioValue += row.portfolioValue;
        totalFaceValueBuys += row.faceValueBuys;
        totalFaceValueSales += row.faceValueSales;
        totalFaceValueBal += row.faceValueBal;
      }
      if (totalPortfolioValue > 0) {
        for (const row of newData) {
          if (row.bondsHeld === "Overall Portfolio") continue;
          const weightPV = row.portfolioValue / totalPortfolioValue;
          overallRow.maturityYears += row.maturityYears * weightPV;
          overallRow.coupon += row.coupon * weightPV;
          overallRow.duration += row.duration * weightPV;
          overallRow.mDuration += row.mDuration * weightPV;
          overallRow.dv01 += row.dv01 * weightPV;
          overallRow.expectedShortfall += row.expectedShortfall * weightPV;
          overallRow.spotYTM += row.spotYTM * weightPV;
          overallRow.dirtyPrice += row.dirtyPrice * weightPV;
          overallRow.closingPrice += row.closingPrice * weightPV;
          overallRow.couponNet += row.couponNet * weightPV;
          overallRow.nextCouponDays += row.nextCouponDays ;
          // overallRow.nextCouponDays += row.nextCouponDays * weightPV;
          overallRow.buyingWAP += row.buyingWAP * weightPV;
          overallRow.sellingWAP += row.sellingWAP * weightPV;
        }
      }
      if (totalFaceValueBuys > 0) {
        overallRow.buyingPrice = newData.filter(r => r.bondsHeld !== "Overall Portfolio").reduce((sum, row) => sum + row.buyingPrice * row.faceValueBuys, 0) / totalFaceValueBuys;
      }
      if (totalFaceValueSales > 0) {
        overallRow.sellingPrice = newData.filter(r => r.bondsHeld !== "Overall Portfolio").reduce((sum, row) => sum + row.sellingPrice * row.faceValueSales, 0) / totalFaceValueSales;
      }
      const totalPL = overallRow.realizedPL + overallRow.unrealizedPL;
      if (overallRow.portfolioValue > 0) {
        overallRow.totalReturn = parseFloat((totalPL / overallRow.portfolioValue * 100).toFixed(4));
      }
      // Weighted average DtmYrs for overallRow.maturityYears
      if (totalPortfolioValue > 0) {
        const maturityNumerator = newData.filter(row => row.bondsHeld !== "Overall Portfolio").reduce((sum, row) => {
          const bondStats = availableBonds.find(b => b.BondIssueNo === row.bondsHeld);
          const dtm = bondStats && bondStats.DtmYrs ? bondStats.DtmYrs : 0;
          return sum + row.portfolioValue * dtm;
        }, 0);
        overallRow.maturityYears = maturityNumerator / totalPortfolioValue;
      }
      newData[overallIndex] = overallRow;
    }
  }
  return newData;
}

export function PortfolioScorecard({ userDetails }: { userDetails: UserData }) {
  const [value, setValue] = useState<string[]>([])
  const [selectedBondsToAdd, setSelectedBondsToAdd] = useState<{issueNo: string, id?: number}[]>([])
  const [bonds, setBonds] = useState<BondStats[]>([])
  const [data, setData] = useState<PortfolioEntry[]>([])
  const [sectionVisibility, setSectionVisibility] = useState<SectionVisibility>({
    notepad: true,
    profitLoss: true,
    scorecard: true,
  })
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    bondIssueNo: true,
    bondValuationMetrics: false,
    riskBudgetingIndicators: false // Changed default to false (hidden)
  });
  const [portfolioName, setPortfolioName] = useState("Create New Portfolio")
  const [portfolioDate, setPortfolioDate] = useState(formatDate(new Date()))
  const [availableBonds, setAvailableBonds] = useState<BondStats[]>([])
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null)
  const [isNewPortfolioDialogOpen, setIsNewPortfolioDialogOpen] = useState(false)
  const [newPortfolioData, setNewPortfolioData] = useState({
    portfolio_name: '',
    value_date: new Date().toISOString().split('T')[0],
    description: '',
  })
  const { toast } = useToast()
  const [loading, setLoading] = useState(false);
  const [clientDialogOpen, setClientDialogOpen] = useState(false);
  const [pendingQuoteData, setPendingQuoteData] = useState<QuoteData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [quickTipsOpen, setQuickTipsOpen] = useState(false);
  
  // Ref to track current portfolio ID without causing re-renders
  const selectedPortfolioIdRef = useRef<number | null>(null);

  // const { data: session } = useSession();

  // Add logging for initial mount
  useEffect(() => {
    console.log("Component mounted with userDetails:", userDetails);
  }, [userDetails]);

  const fetchPortfolios = useCallback(async () => {
    setLoading(true);
    try {
      if (!userDetails?.email) {
        toast({ title: "Error", description: "User email not found" });
        return;
      }
      // Always refresh availableBonds before loading
      let bondsResult = availableBonds;
      if (availableBonds.length === 0) {
        const fetched = await getStatsTable();
        bondsResult = Array.isArray(fetched) ? fetched : [];
        setAvailableBonds(bondsResult);
        setBonds(bondsResult);
      }
      const result = await getUserPortfolios(userDetails.email);
      if (result?.success && result.data && result.data.length > 0) {
        setPortfolios(result.data);
        
        // Maintain current portfolio state if it exists, otherwise use first portfolio
        const currentPortfolioId = selectedPortfolioIdRef.current;
        const portfolioToSelect = currentPortfolioId 
          ? result.data.find((p: any) => p.Id === currentPortfolioId) || result.data[0]
          : result.data[0];
        
        selectedPortfolioIdRef.current = portfolioToSelect.Id;
        setSelectedPortfolio(portfolioToSelect);
        setPortfolioName(portfolioToSelect.Name);
        setPortfolioDate(formatDate(portfolioToSelect.ValueDate));
        // Map loaded bonds by bondId
        const mappedBonds: PortfolioEntry[] = portfolioToSelect.bonds.map((bond: PortfolioBond) => {
          // Find the bond in availableBonds by bondId
          const bondData = bondsResult.find(b => b.Id === bond.BondId);
          return {
            id: bond.BondId.toString(),
            id_: bond.Id_,
            bondId: bond.BondId,
            type: bond.Type as "HFS" | "HTM" | "AFS",
            bondsHeld: bond.BondIssueNo,
            buyingDate: formatDate(bond.BuyingDate),
            buyingPrice: Number(bond.BuyingPrice),
            buyingWAP: Number(bond.BuyingWAP),
            faceValueBuys: Number(bond.FaceValueBuys),
            sellingDate: bond.SellingDate ? formatDate(bond.SellingDate) : '',
            sellingPrice: bond.SellingPrice ? Number(bond.SellingPrice) : 0,
            sellingWAP: bond.SellingWAP ? Number(bond.SellingWAP) : 0,
            faceValueSales: bond.FaceValueSales ? Number(bond.FaceValueSales) : 0,
            faceValueBal: Number(bond.FaceValueBAL),
            closingPrice: Number(bond.ClosingPrice),
            couponNet: Number(bond.CouponNET),
            nextCouponDays: Number(bond.NextCpnDays),
            realizedPL: Number(bond.RealizedPNL),
            unrealizedPL: Number(bond.UnrealizedPNL),
            totalReturn: Number(bond.OneYrTotalReturn),
            maturityYears: bondData ? bondData.DtmYrs : 0,
            coupon: bondData ? bondData.Coupon : 0,
            duration: bondData ? bondData.Duration : 0,
            mDuration: bondData ? bondData.MDuration : 0,
            dv01: bondData ? bondData.Dv01 : 0,
            expectedShortfall: bondData ? bondData.ExpectedShortfall : 0,
            spotYTM: bondData ? bondData.SpotYield : 0,
            dirtyPrice: bondData ? bondData.DirtyPrice : 0,
            portfolioValue: Number(bond.PortfolioValue)
          };
        });
        setData(recalculatePortfolio(mappedBonds, bondsResult, formatDate(result.data[0].ValueDate)));
      }
    } catch {
      toast({ title: "Error", description: "Failed to fetch portfolios" });
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails?.email, toast]); // Removed availableBonds to prevent re-fetch loops

  useEffect(() => {
    if (userDetails?.email) {
      console.log("Fetching portfolios for user:", userDetails.email);
      fetchPortfolios();
    } else {
      console.log("No user email available for fetching portfolios");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails?.email]); // Only fetch once when email is available


  // Data Loading
  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const result = await getStatsTable();
  //       if (!Array.isArray(result)) {
  //         console.error("Expected an array from getStatsTable, got:", result);
  //         setBonds([]);
  //         return;
  //       }
        
  //       // Map the bonds to ensure they have all required fields
  //       const mappedBonds = result.map(mapBondToStats);
  //       setBonds(mappedBonds);
        
  //     } catch {
  //       console.error("Error fetching stats table");
  //       setBonds([]);
  //     }
  //   }
  //   fetchData();
  // }, []);

  // Update the bond mapping function to include all required fields
  const mapBondToStats = (bond: Record<string, unknown>): BondStats => {
    return {
      Id: Number(bond.Id) || 0,
      Otr: String(bond.Otr || ""),
      Id_: Number(bond.Id_) || 0,
      Filter1: Number(bond.Filter1) || 0,
      Filter2: Number(bond.Filter2) || 0,
      BondIssueNo: String(bond.BondIssueNo || ""),
      IssueDate: String(bond.IssueDate || ""),
      MaturityDate: String(bond.MaturityDate || ""),
      ValueDate: String(bond.ValueDate || ""),
      QuotedYield: String(bond.QuotedYield || ""),
      SpotYield: Number(bond.SpotYield) || 0,
      DirtyPrice: Number(bond.DirtyPrice) || 0,
      Coupon: Number(bond.Coupon) || 0,
      NextCpnDays: Number(bond.NextCpnDays) || 0,
      DtmYrs: Number(bond.DtmYrs) || 0,
      Dtc: Number(bond.Dtc) || 0,
      Duration: Number(bond.Duration) || 0,
      MDuration: Number(bond.MDuration) || 0,
      Convexity: Number(bond.Convexity) || 0,
      ExpectedReturn: Number(bond.ExpectedReturn) || 0,
      ExpectedShortfall: Number(bond.ExpectedShortfall) || 0,
      Dv01: Number(bond.Dv01) || 0,
      Last91Days: Number(bond.Last91Days) || 0,
      Last364Days: Number(bond.Last364Days) || 0,
      LqdRank: String(bond.LqdRank || ""),
      Spread: Number(bond.Spread) || 0,
      CreditRiskPremium: bond.CreditRiskPremium ? Number(bond.CreditRiskPremium) : null,
      MdRank: bond.MdRank ? Number(bond.MdRank) : null,
      ErRank: bond.ErRank ? Number(bond.ErRank) : null,
      Basis: Number(bond.Basis) || 0,
      DayCount: Number(bond.DayCount) || 364
    };
  };

  const handleBondSelect = (bondIssueNo: string, specificBondId?: number) => {
    let selectedBond: BondStats | undefined;
    
    // First try to find by exact ID match if provided
    if (specificBondId) {
      selectedBond = availableBonds.find(bond => bond.Id === specificBondId);
      console.log(`Search by exact ID ${specificBondId} result:`, selectedBond?.Id, selectedBond?.BondIssueNo);
    }
    
    // If not found by ID, try finding by bond issue number
    if (!selectedBond) {
      const matchingBonds = availableBonds.filter(bond => bond.BondIssueNo === bondIssueNo);
      console.log('Available bonds with matching name:', 
        matchingBonds.map(b => ({ id: b.Id, issueNo: b.BondIssueNo })));
      
      selectedBond = matchingBonds[0];
    }
    
    if (selectedBond) {
      // Create a new entry with default values
      const newEntry = generateDefaultValues(selectedBond);
      
      // Ensure bondIssueNo is explicitly set to make sure it displays
      newEntry.bondsHeld = selectedBond.BondIssueNo;
      
      console.log("Adding new bond entry:", {
        bondIssueNo: newEntry.bondsHeld,
        bondId: newEntry.bondId,
        type: newEntry.type
      });
      
      // Add the new entry to the data array and recalculate the portfolio
      setData(prevData => {
        const updatedData = [...prevData, newEntry];
        return recalculatePortfolio(updatedData, availableBonds, portfolioDate);
      });
    }
  };

  const updateData = (rowIndex: number, columnId: string, value: string) => {
    console.log(`Updating data at row ${rowIndex}, column ${columnId} with value:`, value);
    
    setData(oldData => {
      // Create a deep copy
      const newData = JSON.parse(JSON.stringify(oldData));
      
      // Update the specific field
      newData[rowIndex][columnId] = value;
      
      // Perform type conversion for numeric fields
      if (['buyingPrice', 'sellingPrice', 'faceValueBuys', 'faceValueSales'].includes(columnId)) {
        newData[rowIndex][columnId] = parseFloat(value) || 0;
      }
      
      // For HTM bonds, if buying price is edited, also update the dirty price
      if (columnId === 'buyingPrice' && newData[rowIndex].type === 'HTM') {
        newData[rowIndex].dirtyPrice = parseFloat(value) || 0;
      }
      
      // For type changes, need to recalculate dirty price
      if (columnId === 'type') {
        if (value === 'HTM') {
          // For HTM bonds, dirty price should be buying price
          newData[rowIndex].dirtyPrice = newData[rowIndex].buyingPrice;
        } else {
          // For non-HTM bonds, use the closing price/bond data
          const bondIssueNo = newData[rowIndex].bondsHeld;
          const bondData = availableBonds.find(bond => bond.BondIssueNo === bondIssueNo);
          if (bondData) {
            newData[rowIndex].dirtyPrice = bondData.DirtyPrice;
          }
        }
      }
      
      // Recalculate the row and portfolio immediately
      console.log("Recalculating after field update");
      const recalculatedData = recalculateRow(rowIndex, newData, availableBonds, portfolioDate);
      return recalculatePortfolio(recalculatedData, availableBonds, portfolioDate);
    });
  };

  const handleRemoveEntry = (id: string) => {
    console.log(`Removing entry with ID: ${id}`);
    
    // Find the entry to be removed for debugging
    const entryToRemove = data.find(item => item.id === id);
    console.log("Entry to remove:", entryToRemove?.bondsHeld, entryToRemove?.type);
    
    setData(prev => {
      // Only remove the exact row with matching id, not by bondId or bondIssueNo
      const filteredData = prev.filter(item => item.id !== id);
      
      // Log count of removed entries
      console.log(`Removed ${prev.length - filteredData.length} entries`);
      
      // Recalculate portfolio after removal
      return recalculatePortfolio(filteredData, availableBonds, portfolioDate);
    });
  };

  const handlePortfolioDateChange = (newDate: string) => {
    setPortfolioDate(newDate);
    
    // Recalculate with new date
    setData(prev => recalculatePortfolio(prev, availableBonds, newDate));
  };


  // Calculate totals for the summary row
  const calculateTotals = () => {
    // Find the overall portfolio entry if it exists
    const overallEntry = data.find(entry => entry.bondsHeld === "Overall Portfolio");
    
    // If we have an overall entry, use its values (rounded to 4 dp)
    if (overallEntry) {
      const round4 = (val: number) => (isNaN(val) ? "" : Number(val).toFixed(4));
      return {
        faceValueBal: round4(overallEntry.faceValueBal),
        realizedPL: round4(overallEntry.realizedPL),
        unrealizedPL: round4(overallEntry.unrealizedPL),
        totalReturn: round4(overallEntry.totalReturn),
        portfolioValue: round4(overallEntry.portfolioValue),
        maturityYears: round4(overallEntry.maturityYears),
        coupon: round4(overallEntry.coupon),
        duration: round4(overallEntry.duration),
        mDuration: round4(overallEntry.mDuration),
        dv01: round4(overallEntry.dv01),
        expectedShortfall: round4(overallEntry.expectedShortfall),
        spotYTM: round4(overallEntry.spotYTM),
        dirtyPrice: round4(overallEntry.dirtyPrice),
      };
    }
    // Otherwise calculate totals from individual entries (rounded to 4 dp)
    return data.reduce(
      (acc, row) => {
        if (row.bondsHeld === "Overall Portfolio") return acc;
        return {
          faceValueBal: acc.faceValueBal + row.faceValueBal,
          realizedPL: acc.realizedPL + row.realizedPL,
          unrealizedPL: acc.unrealizedPL + row.unrealizedPL,
          totalReturn: acc.totalReturn + (row.totalReturn || 0),
          portfolioValue: acc.portfolioValue + row.portfolioValue,
          maturityYears: acc.maturityYears + (row.maturityYears || 0),
          coupon: acc.coupon + (row.coupon || 0),
          duration: acc.duration + (row.duration || 0),
          mDuration: acc.mDuration + (row.mDuration || 0),
          dv01: acc.dv01 + (row.dv01 || 0),
          expectedShortfall: acc.expectedShortfall + (row.expectedShortfall || 0),
          spotYTM: acc.spotYTM + (row.spotYTM || 0),
          dirtyPrice: acc.dirtyPrice + (row.dirtyPrice || 0),
        };
      },
      { 
        faceValueBal: 0, 
        realizedPL: 0, 
        unrealizedPL: 0, 
        totalReturn: 0, 
        portfolioValue: 0,
        maturityYears: 0,
        coupon: 0,
        duration: 0,
        mDuration: 0,
        dv01: 0,
        expectedShortfall: 0,
        spotYTM: 0,
        dirtyPrice: 0 
      }
    );
  };

      calculateTotals()

  const handleCreatePortfolio = async () => {
    try {
      if (!userDetails?.email) {
        toast({ title: "Error", description: "User email not found" });
        return;
      }
      // if (data.length === 0) {
      //   toast({ title: "Error", description: "Please add at least one bond to the portfolio" });
      //   return;
      // }
      if (!newPortfolioData.portfolio_name) {
        toast({ title: "Error", description: "Portfolio name is required" });
        return;
      }
      if (!newPortfolioData.value_date) {
        toast({ title: "Error", description: "Value date is required" });
        return;
      }
      if (!newPortfolioData.description) {
        toast({ title: "Error", description: "Description is required" });
        return;
      }
      
      // Always refresh availableBonds before saving
      let bondsResult = availableBonds;
      if (availableBonds.length === 0) {
        const fetched = await getStatsTable();
        bondsResult = Array.isArray(fetched) ? fetched : [];
        setAvailableBonds(bondsResult);
        setBonds(bondsResult);
      }
      
      // Log portfolio bonds before saving
      const portfolioItems = data.filter(bond => bond.bondsHeld !== "Overall Portfolio");
      console.log("Saving portfolio bonds:", portfolioItems.map(b => ({ id: b.bondId, name: b.bondsHeld })));
      
      // Prepare portfolio bonds with correct types
      const portfolioBondsFormatted = data
        .filter(bond => bond.bondsHeld !== "Overall Portfolio")
        .map(bond => ({
          bond_id: bond.bondId, 
          type: bond.type,
          bond_issue_no: bond.bondsHeld,
          buying_date: bond.buyingDate,
          buying_price: bond.buyingPrice,
          buying_wap: bond.buyingWAP,
          face_value_buys: bond.faceValueBuys,
          selling_date: bond.sellingDate || null,
          selling_price: bond.sellingPrice || null,
          selling_wap: bond.sellingWAP || null,
          face_value_sales: bond.faceValueSales || null,
          face_value_bal: bond.faceValueBal,
          closing_price: bond.closingPrice,
          coupon_net: bond.couponNet,
          next_cpn_days: bond.nextCouponDays.toString(),
          realized_pnl: bond.realizedPL.toString(),
          unrealized_pnl: bond.unrealizedPL.toString(),
          one_yr_total_return: bond.totalReturn,
          portfolio_value: bond.portfolioValue.toString()
        }));
      
      const portfolioData = {
        portfolio_name: newPortfolioData.portfolio_name,
        value_date: newPortfolioData.value_date,
        description: newPortfolioData.description,
        user_email: userDetails.email,
        bonds: portfolioBondsFormatted
      };
      
      // Send data to API
      const response = await addNewPortfolio(portfolioData);
      
      if (response?.success) {
        toast({ title: "Success", description: "Portfolio created successfully" });
        setData([]);
        setNewPortfolioData({ portfolio_name: "", value_date: new Date().toISOString().split('T')[0], description: "" });
        setIsNewPortfolioDialogOpen(false);
        fetchPortfolios();
      } else {
        toast({ title: "Error", description: response?.message || "Failed to create portfolio" });
      }
    } catch (error) {
      console.error("Error creating portfolio:", error);
      toast({ title: "Error", description: "An error occurred while creating the portfolio" });
    }
  };

  const handleSavePortfolio = async () => {
    try {
      if (!userDetails?.email || !selectedPortfolio) {
        toast({ title: "Error", description: "Portfolio not created or selected first." });
        return;
      }
      if (data.length === 0) {
        toast({ title: "Error", description: "Please add at least one bond to the portfolio" });
        return;
      }
      
      // Always refresh availableBonds before saving
      let bondsResult = availableBonds;
      if (availableBonds.length === 0) {
        const fetched = await getStatsTable();
        bondsResult = Array.isArray(fetched) ? fetched : [];
        setAvailableBonds(bondsResult);
        setBonds(bondsResult);
      }
      
      // Log portfolio bonds before saving
      const portfolioItems = data.filter(bond => bond.bondsHeld !== "Overall Portfolio");
      console.log("Updating portfolio bonds:", portfolioItems.map(b => ({ id: b.bondId, name: b.bondsHeld })));
      
      // Prepare the portfolio data with proper bond data types
      const portfolioBonds = data
        .filter(bond => bond.bondsHeld !== "Overall Portfolio")
        .map(bond => ({
          bond_id: bond.bondId, // Convert to string for API
          type: bond.type,
          bond_issue_no: bond.bondsHeld,
          buying_date: bond.buyingDate,
          buying_price: bond.buyingPrice,
          buying_wap: bond.buyingWAP,
          face_value_buys: bond.faceValueBuys,
          selling_date: bond.sellingDate || null,
          selling_price: bond.sellingPrice || null,
          selling_wap: bond.sellingWAP || null,
          face_value_sales: bond.faceValueSales || null,
          face_value_bal: bond.faceValueBal,
          closing_price: bond.closingPrice,
          coupon_net: bond.couponNet,
          next_cpn_days: bond.nextCouponDays.toString(),
          realized_pnl: bond.realizedPL.toString(),
          unrealized_pnl: bond.unrealizedPL.toString(),
          one_yr_total_return: bond.totalReturn,
          portfolio_value: bond.portfolioValue.toString()
        }));

      const portfolioData = {
        portfolio_id: selectedPortfolio.Id,
        portfolio_name: portfolioName,
        value_date: portfolioDate,
        description: selectedPortfolio.Description,
        user_email: userDetails.email,
        bonds: portfolioBonds
      };
      
      // Send data to API
      const response = await updatePortfolio(portfolioData);
      
      if (response?.success) {
        toast({ title: "Success", description: "Portfolio updated successfully" });
        fetchPortfolios();
      } else {
        toast({ title: "Error", description: response?.message || "Failed to update portfolio" });
      }
    } catch (error) {
      console.error("Error updating portfolio:", error);
      toast({ title: "Error", description: "An error occurred while updating the portfolio" });
    }
  };

  const handleExportToExcel = async () => {
    try {
      if (!selectedPortfolio) {
        toast({ title: "Error", description: "Please select a portfolio to export" });
        return;
      }

      // Check if any section is visible
      if (!columnVisibility.bondIssueNo && !columnVisibility.riskBudgetingIndicators) {
        toast({ 
          title: "No sections selected", 
          description: "Please select at least one view section (Portfolio Notepad or Scorecard) to export" 
        });
        return;
      }

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      
      // Prepare headers based on visible sections
      const headers = ["Type", "Bonds Held"];
      
      if (columnVisibility.bondIssueNo) {
        headers.push(
          "Buying Date", "Buying Price", "Buying WAP", "Face Value Buys",
          "Selling Date", "Selling Price", "Selling WAP", "Face Value Sales",
          "Face Value Bal", "Closing Price"
        );
      }
      
      if (columnVisibility.riskBudgetingIndicators) {
        headers.push(
          "Dirty Price (KES)", "Portfolio Value (KES)", "Maturity (Yrs)", "Coupon",
          "Coupon (Net)", "Next Coupon (Days)", "Duration", "M Duration",
          "Realized P&L", "Unrealized P&L", "1-Yr Total Return"
        );
      }

      // Prepare data rows
      const rows = data.map(row => {
        const rowData = [row.type, row.bondsHeld];
        
        if (columnVisibility.bondIssueNo) {
          rowData.push(
            row.buyingDate?.toString() || "", row.buyingPrice?.toString() || "", row.buyingWAP?.toString() || "", row.faceValueBuys?.toString() || "",
            row.sellingDate?.toString() || "", row.sellingPrice?.toString() || "", row.sellingWAP?.toString() || "", row.faceValueSales?.toString() || "",
            row.faceValueBal?.toString() || "", row.closingPrice?.toString() || ""
          );
        }
        
        if (columnVisibility.riskBudgetingIndicators) {
          rowData.push(
            row.dirtyPrice?.toString(), row.portfolioValue?.toString(), row.maturityYears?.toString(), row.coupon?.toString(),
            row.couponNet?.toString(), row.nextCouponDays?.toString(), row.duration?.toString(), row.mDuration?.toString(),
            row.realizedPL?.toString(), row.unrealizedPL?.toString(), row.totalReturn?.toString()
          );
        }
        
        return rowData;
      });

      // Create worksheet
      const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Portfolio");
      
      // Save file
      XLSX.writeFile(wb, `${selectedPortfolio.Name}_portfolio.xlsx`);
      
      toast({ title: "Success", description: "Portfolio exported to Excel successfully" });
    } catch (error) {
      console.error("Error exporting portfolio:", error);
      toast({ title: "Error", description: "An error occurred while exporting the portfolio" });
    }
  };

  const handleExportToCSV = async () => {
    try {
      if (!selectedPortfolio) {
        toast({ title: "Error", description: "Please select a portfolio to export" });
        return;
      }

      // Check if any section is visible
      if (!columnVisibility.bondIssueNo && !columnVisibility.riskBudgetingIndicators) {
        toast({ 
          title: "No sections selected", 
          description: "Please select at least one view section (Portfolio Notepad or Scorecard) to export" 
        });
        return;
      }

      // Prepare headers based on visible sections
      const headers = ["Type", "Bonds Held"];
      
      if (columnVisibility.bondIssueNo) {
        headers.push(
          "Buying Date", "Buying Price", "Buying WAP", "Face Value Buys",
          "Selling Date", "Selling Price", "Selling WAP", "Face Value Sales",
          "Face Value Balance", "Closing Price"
        );
      }
      
      if (columnVisibility.riskBudgetingIndicators) {
        headers.push(
          "Dirty Price (KES)", "Portfolio Value (KES)", "Maturity (Yrs)", "Coupon",
          "Coupon NET", "Next Coupon Days", "Duration", "Modified Duration",
          "Realized P&L", "Unrealized P&L", "One Year Total Return"
        );
      }

      // Prepare data rows based on visible sections
      const rows = data.map(row => {
        const rowData = [row.type, row.bondsHeld];
        
        if (columnVisibility.bondIssueNo) {
          rowData.push(
            row.buyingDate?.toString() || "", row.buyingPrice?.toString() || "", row.buyingWAP?.toString() || "", row.faceValueBuys?.toString() || "",
            row.sellingDate?.toString() || "", row.sellingPrice?.toString() || "", row.sellingWAP?.toString() || "", row.faceValueSales?.toString() || "",
            row.faceValueBal?.toString() || "", row.closingPrice?.toString() || ""
          );
        }
        
        if (columnVisibility.riskBudgetingIndicators) {
          rowData.push(
            row.dirtyPrice?.toString(), row.portfolioValue?.toString(), row.maturityYears?.toString(), row.coupon?.toString(),
            row.couponNet?.toString(), row.nextCouponDays?.toString(), row.duration?.toString(), row.mDuration?.toString(),
            row.realizedPL?.toString(), row.unrealizedPL?.toString(), row.totalReturn?.toString()
          );
        }
        
        return rowData;
      });
      const csvContent = headers.join(",") + "\n" + rows.map(r => r.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedPortfolio.Name}_portfolio.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({ title: "Success", description: "Portfolio exported to CSV successfully" });
    } catch (error) {
      console.error("Error exporting portfolio to CSV:", error);
      toast({ title: "Error", description: "An error occurred while exporting the portfolio to CSV" });
    }
  };

  const handleExportToPDF = async () => {
    try {
      if (!selectedPortfolio) {
        toast({ title: "Error", description: "Please select a portfolio to export" });
        return;
      }
      // Check if any section is visible
      if (!columnVisibility.bondIssueNo && !columnVisibility.riskBudgetingIndicators) {
        toast({ 
          title: "No sections selected", 
          description: "Please select at least one view section (Portfolio Notepad or Scorecard) to export" 
        });
        return;
      }

      // Prepare headers based on visible sections
      const headers = ["Type", "Bonds Held"];
      
      if (columnVisibility.bondIssueNo) {
        headers.push(
          "Buying Date", "Buying Price", "Buying WAP", "Face Value Buys",
          "Selling Date", "Selling Price", "Selling WAP", "Face Value Sales",
          "Face Value Balance", "Closing Price"
        );
      }
      
      if (columnVisibility.riskBudgetingIndicators) {
        headers.push(
          "Dirty Price (KES)", "Portfolio Value (KES)", "Maturity (Yrs)", "Coupon",
          "Coupon NET", "Next Coupon Days", "Duration", "Modified Duration",
          "Realized P&L", "Unrealized P&L", "One Year Total Return"
        );
      }

      // Prepare data rows based on visible sections
      const rows = data.map(row => {
        const rowData = [row.type, row.bondsHeld];
        
        if (columnVisibility.bondIssueNo) {
          rowData.push(
            row.buyingDate?.toString() || "", row.buyingPrice?.toString() || "", row.buyingWAP?.toString() || "", row.faceValueBuys?.toString() || "",
            row.sellingDate?.toString() || "", row.sellingPrice?.toString() || "", row.sellingWAP?.toString() || "", row.faceValueSales?.toString() || "",
            row.faceValueBal?.toString() || "", row.closingPrice?.toString() || ""
          );
        }
        
        if (columnVisibility.riskBudgetingIndicators) {
          rowData.push(
            row.dirtyPrice?.toString(), row.portfolioValue?.toString(), row.maturityYears?.toString(), row.coupon?.toString(),
            row.couponNet?.toString(), row.nextCouponDays?.toString(), row.duration?.toString(), row.mDuration?.toString(),
            row.realizedPL?.toString(), row.unrealizedPL?.toString(), row.totalReturn?.toString()
          );
        }
        
        return rowData;
      });

      // Create section titles
      let sectionTitles = "";
      if (columnVisibility.bondIssueNo) sectionTitles += "Portfolio Notepad (Input) ";
      if (columnVisibility.riskBudgetingIndicators) sectionTitles += "Portfolio Scorecard (Output)";
      // Create a styled HTML table for PDF
      const html = `
        <html>
        <head>
          <title>${selectedPortfolio.Name} Portfolio - ${sectionTitles}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h2 { color: #1e293b; text-align: center; }
            .sections { color: #6b7280; text-align: center; margin-bottom: 20px; }
            table { border-collapse: collapse; width: 100%; margin-top: 20px; }
            th, td { border: 1px solid #e5e7eb; padding: 6px; text-align: left; font-size: 10px; }
            th { background-color: #f1f5f9; color: #1e293b; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9fafb; }
            .notepad-header { background-color: #fef3c7; }
            .scorecard-header { background-color: #d1fae5; }
          </style>
        </head>
        <body>
          <h2>${selectedPortfolio.Name} Portfolio</h2>
          <div class="sections">Sections: ${sectionTitles}</div>
          <table>
            <thead>
              <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${rows.map(row => `<tr>${row.map(cell => `<td>${cell || ''}</td>`).join('')}</tr>`).join('')}
            </tbody>
          </table>
        </body>
        </html>
      `;
      // Open the HTML in a new window for printing to PDF
      const printWindow = window.open('', '', 'width=1200,height=800');
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 500);
        toast({ title: "Success", description: "Portfolio ready for PDF printing" });
      } else {
        toast({ title: "Error", description: "Failed to open print window" });
      }
    } catch (error) {
      console.error("Error exporting portfolio to PDF:", error);
      toast({ title: "Error", description: "An error occurred while exporting the portfolio to PDF" });
    }
  };

  const handleSendToQuoteBook = async (bond: PortfolioEntry) => {
    try {
      if (!userDetails?.email) {
        toast({ title: "Error", description: "User email not found" });
        return;
      } 

      // Find the corresponding bond stats
      const bondStats = availableBonds.find(b => b.BondIssueNo === bond.bondsHeld);
      if (!bondStats) {
        toast({ title: "Error", description: "Bond details not found" });
        return;
      }

      const today = new Date();
      const tomorrowDate = new Date(today);
      tomorrowDate.setDate(tomorrowDate.getDate() + 1);
      // Calculate Consideration based on the formula - removed unused variable
      // const consideration = bond.faceValueBal * (bond.sellingPrice || bond.buyingPrice * 1.02);

      // Calculate Other Levies (CMA) - removed unused variable
      // const otherLevies = consideration * 0.00011;

      // Build the quote data
      const quoteData = {
        bond_id: Number(bondStats.Id),
        IsBid: true, // or false, depending on context
        IsOffer: false, // or true, depending on context
        bid_price: bond.buyingPrice,
        offer_price: bond.sellingPrice || bond.buyingPrice * 1.02,
        bid_yield: 0, // set actual value if available
        offer_yield: 0, // set actual value if available
        bid_amount: bond.faceValueBal,
        offer_amount: 0, // or actual value if offer
        assigned_by: userDetails.email,
      };

      // Check if user is a broker/agent/dealer
      const isBrokerOrAgent = userDetails.roles?.some(role => 
        ['broker', 'agent', 'authorizeddealer'].includes(role.role_name)
      );

      if (isBrokerOrAgent) {
        setPendingQuoteData(quoteData);
        setClientDialogOpen(true);
        return;
      }

      // If not broker/agent/dealer, send directly
      const response = await sendToQuoteBook(quoteData as QuoteData);
      
      if (response?.success) {
        toast({ title: "Success", description: "Bond sent to Quote Book successfully" });
      } else {
        toast({ title: "Error", description: response?.message || "Failed to send bond to Quote Book" });
      }
    } catch (error) {
      console.error("Error sending to Quote Book:", error);
      toast({ title: "Error", description: "An error occurred while sending to Quote Book" });
    }
  };

  const handleClientSelection = async (clientEmail: string | null) => {
    if (!pendingQuoteData) return;

    try {
      const quoteData = {
        ...pendingQuoteData,
        viewing_party: clientEmail
      };

      const response = await sendToQuoteBook(quoteData as QuoteData);
      
      if (response?.success) {
        toast({ title: "Success", description: "Bond sent to Quote Book successfully" });
      } else {
        toast({ title: "Error", description: response?.message || "Failed to send bond to Quote Book" });
      }
    } catch (error) {
      console.error("Error sending to Quote Book:", error);
      toast({ title: "Error", description: "An error occurred while sending to Quote Book" });
    } finally {
      setPendingQuoteData(null);
    }
  };



  // const totals = calculateTotals();
  
  const renderPortfolioSelector = () => {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 shadow-sm mb-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
            <h2 className="text-xl font-bold text-gray-800">Portfolio Management</h2>
          </div>
          
          <Dialog open={isNewPortfolioDialogOpen} onOpenChange={setIsNewPortfolioDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="default" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-xl"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Portfolio
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Portfolio</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Portfolio Name</Label>
                  <Input
                    value={newPortfolioData.portfolio_name}
                    onChange={(e) => setNewPortfolioData({
                      ...newPortfolioData,
                      portfolio_name: e.target.value
                    })}
                    required
                  />
                </div>
                <div>
                  <Label>Value Date</Label>
                  <Input
                    type="date"
                    value={newPortfolioData.value_date}
                    onChange={(e) => setNewPortfolioData({
                      ...newPortfolioData,
                      value_date: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={newPortfolioData.description}
                    onChange={(e) => setNewPortfolioData({
                      ...newPortfolioData,
                      description: e.target.value
                    })}
                    required
                  />
                </div>
                <Button disabled={loading} type="submit" onClick={handleCreatePortfolio}>Create Portfolio</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Portfolio Selection and Details */}
        <div className="space-y-4">
          {/* Portfolio Selector */}
          <div className="flex items-center space-x-3">
            <Label className="text-sm font-medium text-gray-700 min-w-[100px]">Select Portfolio:</Label>
        <select
              className="flex-1 max-w-[300px] px-3 py-1 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          value={selectedPortfolio?.Id || ""}
          onChange={(e) => {
            const portfolioId = e.target.value;
            const portfolio = portfolios.find(p => p.Id.toString() === portfolioId);
            
            if (portfolio) {
              selectedPortfolioIdRef.current = portfolio.Id;
              setSelectedPortfolio(portfolio);
              setPortfolioName(portfolio.Name);
              setPortfolioDate(formatDate(portfolio.ValueDate));
              
              // Load portfolio data
              if (portfolio.bonds && portfolio.bonds.length) {
                const mappedBonds: PortfolioEntry[] = portfolio.bonds.map(bond => ({
                  id: bond.BondId.toString(),
                  id_: bond.Id_,
                  bondId: bond.BondId,
                  type: bond.Type as "HFS" | "HTM" | "AFS",
                  bondsHeld: bond.BondIssueNo,
                  buyingDate: formatDate(bond.BuyingDate),
                  buyingPrice: Number(bond.BuyingPrice),
                  buyingWAP: Number(bond.BuyingWAP),
                  faceValueBuys: Number(bond.FaceValueBuys),
                  sellingDate: bond.SellingDate ? formatDate(bond.SellingDate) : '',
                  sellingPrice: bond.SellingPrice ? Number(bond.SellingPrice) : 0,
                  sellingWAP: bond.SellingWAP ? Number(bond.SellingWAP) : 0,
                  faceValueSales: bond.FaceValueSales ? Number(bond.FaceValueSales) : 0,
                  faceValueBal: Number(bond.FaceValueBAL),
                  closingPrice: Number(bond.ClosingPrice),
                  couponNet: Number(bond.CouponNET),
                  nextCouponDays: Number(bond.NextCpnDays),
                  realizedPL: Number(bond.RealizedPNL),
                  unrealizedPL: Number(bond.UnrealizedPNL),
                  totalReturn: Number(bond.OneYrTotalReturn),
                  maturityYears: 0,
                  coupon: Number(bond.Coupon),
                  duration: Number(bond.Duration),
                  mDuration: Number(bond.MDuration),
                  dv01: Number(bond.DV01),
                  expectedShortfall: Number(bond.ExpectedShortfall),
                  spotYTM: Number(bond.SpotYTM),
                  dirtyPrice: Number(bond.DirtyPrice),
                  portfolioValue: Number(bond.PortfolioValue)
                }));
                
                // Recalculate after loading
                const recalculatedBonds = recalculatePortfolio(
                  mappedBonds, 
                  availableBonds, 
                  formatDate(portfolio.ValueDate)
                );
                
                setData(recalculatedBonds);
              } else {
                // Clear data if no bonds
                setData([]);
              }
            }
          }}
          aria-label="Select Portfolio"
        >
              <option value="">Choose a portfolio...</option>
          {portfolios.map(portfolio => (
            <option key={portfolio.Id} value={portfolio.Id}>
              {portfolio.Name}
            </option>
          ))}
        </select>
          </div>

          {/* Portfolio Details Row */}
          <div className="flex items-center justify-between">
            {/* Left side - Portfolio Name and Date */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <Label className="text-sm font-medium text-gray-700 min-w-[100px]">Portfolio Name:</Label>
                <Input
                  value={portfolioName}
                  onChange={(e) => setPortfolioName(e.target.value)}
                  className="w-80 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200"
                  placeholder="Enter portfolio name"
                  required
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <Label className="text-sm font-medium text-gray-700 min-w-[80px]">Value Date:</Label>
                <Input
                  type="date"
                  value={formatDateForInput(portfolioDate)} 
                  onChange={(e) => handlePortfolioDateChange(e.target.value)} 
                  className="w-40 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" 
                />
              </div>
              </div>

            {/* Right side - Action Buttons */}
            <div className="flex items-center space-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50 border-gray-300 shadow-sm">
                    <FileDown className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleExportToExcel}>Export to Excel</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportToPDF}>Export to PDF</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportToCSV}>Export to CSV</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                size="sm"
                className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900 font-medium border-blue-200 hover:from-blue-200 hover:to-indigo-200 shadow-sm"
                onClick={fetchPortfolios}
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                Refresh
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-900 font-medium border-green-200 hover:from-green-200 hover:to-emerald-200 shadow-sm"
                onClick={handleRecalculate}
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                Recalculate
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const sortedData = [
    ...data.filter(row => row.bondsHeld !== "Overall Portfolio"),
    ...data.filter(row => row.bondsHeld === "Overall Portfolio"),
  ];
  const [bondSearch, setBondSearch] = useState("");

  const handleRecalculate = () => {
    console.log("Recalculating portfolio...");
    if (!selectedPortfolio) return;
    setData(prev => recalculatePortfolio(prev, availableBonds, portfolioDate));
  };

  // Add function to handle removing selected bonds
  const handleRemoveSelectedBonds = () => {
    const selectedIds = data.filter(row => row.selected && row.bondsHeld !== "Overall Portfolio").map(row => row.id);
    if (selectedIds.length === 0) {
      toast({ title: "No bonds selected", description: "Please select bonds to remove" });
      return;
    }
    
    setData(prev => {
      const newData = prev.filter(row => !selectedIds.includes(row.id));
      return recalculatePortfolio(newData, availableBonds, portfolioDate);
    });
    
    toast({ title: "Success", description: `${selectedIds.length} bond(s) removed from portfolio` });
  };

  // Pagination helpers
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);


  return (
    <div className="space-y-4">
      {renderPortfolioSelector()}
      <div className="w-full">
        <div className="flex flex-col gap-4 mb-6">
          {/* View Toggle Buttons Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* <span className="text-sm font-medium text-gray-700">View Sections:</span> */}
              
              <Button
                variant={columnVisibility.bondIssueNo ? "default" : "outline"}
                size="sm"
                onClick={() => setColumnVisibility(prev => ({ ...prev, bondIssueNo: !prev.bondIssueNo }))}
                className={`transition-all duration-200 ${
                  columnVisibility.bondIssueNo 
                    ? "bg-purple-600 hover:bg-purple-700 text-white shadow-md" 
                    : "border-purple-300 text-purple-700 hover:bg-purple-50"
                }`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Portfolio Notepad (Input)
                {columnVisibility.bondIssueNo && (
                  <span className="ml-2 text-xs bg-white bg-opacity-20 px-2 py-0.5 rounded-full">ON</span>
                )}
              </Button>

              <Button
                variant={columnVisibility.riskBudgetingIndicators ? "default" : "outline"}
                size="sm"
                onClick={() => setColumnVisibility(prev => ({ ...prev, riskBudgetingIndicators: !prev.riskBudgetingIndicators }))}
                className={`transition-all duration-200 ${
                  columnVisibility.riskBudgetingIndicators 
                    ? "bg-green-600 hover:bg-green-700 text-white shadow-md" 
                    : "border-green-300 text-green-700 hover:bg-green-50"
                }`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                  Portfolio Scorecard (Output)
                {columnVisibility.riskBudgetingIndicators && (
                  <span className="ml-2 text-xs bg-white bg-opacity-20 px-2 py-0.5 rounded-full">ON</span>
                )}
              </Button>

              <Select
              onValueChange={(selectedValues) => {
                // Just update the list of selected bonds, but don't add them yet
                const uniqueValues = [...new Set(selectedValues.split(','))];
                setValue(uniqueValues);
                
                // Update selectedBondsToAdd array for later use
                const bondsList = uniqueValues.map(val => {
                  // Parse the bond issue number and ID from the selection value
                  // Format is "BondIssueNo (ID)" or "BondIssueNo (-)" if no ID
                  const selectedBondMatch = val.match(/^(.+?)\s+\((\d+|\-)\)$/);
                  if (selectedBondMatch) {
                    const bondIssueNo = selectedBondMatch[1].trim();
                    const bondIdStr = selectedBondMatch[2];
                    const bondId = bondIdStr !== "-" ? parseInt(bondIdStr) : undefined;
                    
                    // Log parsed values for debugging
                    console.log(`Parsed selection: Issue=${bondIssueNo}, ID=${bondId || 'undefined'}`);
                    
                    // Find the matching bond in availableBonds to verify the data
                    const matchingBond = availableBonds.find(b => 
                      bondId ? b.Id === bondId : b.BondIssueNo === bondIssueNo
                    );
                    
                    if (matchingBond) {
                      console.log(`Verified bond data:`, {
                        issueNo: matchingBond.BondIssueNo,
                        id: matchingBond.Id,
                        // id_: matchingBond.Id_
                      });
                    } else {
                      console.warn(`Could not verify bond: ${bondIssueNo} (${bondId})`);
                    }
                    
                    return { issueNo: bondIssueNo, id: bondId };
                  }
                  
                  // If parsing fails, log error and return just the issue number
                  console.warn(`Failed to parse ID from: ${val}`);
                  return { issueNo: val.trim() };
                });
                
                // Filter out any duplicates based on both issue number and ID
                const uniqueBonds = bondsList.filter((bond, index, self) => 
                  index === self.findIndex(b => 
                    b.issueNo === bond.issueNo && 
                    ((!b.id && !bond.id) || b.id === bond.id)
                  )
                );
                
                if (uniqueBonds.length !== bondsList.length) {
                  console.log(`Removed ${bondsList.length - uniqueBonds.length} duplicate bonds`);
                }
                
                setSelectedBondsToAdd(uniqueBonds);
              }}
              value={value.join(',')}
            >
              <SelectTrigger className="w-[850px]">
                <SelectValue placeholder="Select bonds...">
                  {value.length > 0 ? `${value.length} bonds selected` : "Select bonds..."}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="w-[850px] max-h-[420px] p-0">
                {/* Search bar */}
                <div className="sticky top-0 z-10 bg-white p-2 border-b flex items-center">
                  <Input
                    type="text"
                    placeholder="Search bonds by issue, date, coupon, etc..."
                    className="w-full h-8"
                    value={bondSearch}
                    onChange={e => setBondSearch(e.target.value)}
                  />
                </div>
                {/* Table header */}
                <div className="grid grid-cols-7 gap-2 px-2 py-2 border-b sticky top-10 bg-blue-100 z-5">
                  <div className="font-bold text-xs bg-blue-100 text-blue-900">#</div>
                  <div className="font-bold text-xs bg-blue-100 text-blue-900">Bond Issue</div>
                  <div className="font-bold text-xs bg-blue-100 text-blue-900">Issue Date</div>
                  <div className="font-bold text-xs bg-blue-100 text-blue-900">Coupon</div>
                  <div className="font-bold text-xs bg-blue-100 text-blue-900">DTM (Yrs)</div>
                  <div className="font-bold text-xs bg-blue-100 text-blue-900">Dirty Price</div>
                  <div className="font-bold text-xs bg-blue-100 text-blue-900">Yield</div>
                </div>
                {/* Bond list */}
                <div className="max-h-[340px] overflow-y-auto">
                  {bonds
                    .filter(bond => {
                      if (!bondSearch) return true;
                      const search = bondSearch.toLowerCase();
                      return (
                        bond.BondIssueNo?.toLowerCase().includes(search) ||
                        (bond.IssueDate && new Date(bond.IssueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' }).toLowerCase().includes(search)) ||
                        String(bond.Coupon).toLowerCase().includes(search) ||
                        String(bond.DtmYrs).toLowerCase().includes(search) ||
                        String(bond.DirtyPrice).toLowerCase().includes(search) ||
                        String(bond.SpotYield).toLowerCase().includes(search)
                      );
                    })
                    .map((bond, index) => {
                      // Generate a reliable ID using only the primary Id field
                      const bondId = bond.Id || Math.floor(Date.now() / 1000) + index;
                      const displayId = bond.Id || "-";
                      
                      // For debugging, add logging to see all IDs
                      console.log(`Bond ${index}: ${bond.BondIssueNo}, Id=${bond.Id}, Id_=${bond.Id_}`);
                      
                      return (
                        <SelectItem
                          key={`bond-${bondId}-${bond.BondIssueNo}`}
                          value={`${bond.BondIssueNo} (${displayId})`}
                          className={`py-2 px-2 transition-all rounded hover:bg-blue-50 flex items-center`}
                        >
                          <div className="grid grid-cols-7 gap-2 w-full items-center text-sm">
                            <div className="text-gray-500">{index + 1}.</div>
                            <div className="font-medium">
                              {bond.BondIssueNo}
                              <span className="ml-1 text-blue-600">
                                {/* (ID: {bond.Id || "-"}) */}
                              </span>
                            </div>
                            <div>
                              {bond.IssueDate
                                ? new Date(bond.IssueDate).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'short',
                                    day: '2-digit'
                                  })
                                : ""}
                            </div>
                            <div>{Number(bond.Coupon).toFixed(4)}%</div>
                            <div>{Number(bond.DtmYrs).toFixed(4)}</div>
                            <div>{Number(bond.DirtyPrice).toFixed(4)}</div>
                            <div>{Number(bond.SpotYield).toFixed(4)}%</div>
                          </div>
                        </SelectItem>
                      );
                    })}
                  {bonds.filter(bond => {
                    if (!bondSearch) return true;
                    const search = bondSearch.toLowerCase();
                    return (
                      bond.BondIssueNo?.toLowerCase().includes(search) ||
                      (bond.IssueDate && new Date(bond.IssueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' }).toLowerCase().includes(search)) ||
                      String(bond.Coupon).toLowerCase().includes(search) ||
                      String(bond.DtmYrs).toLowerCase().includes(search) ||
                      String(bond.DirtyPrice).toLowerCase().includes(search) ||
                      String(bond.SpotYield).toLowerCase().includes(search)
                    );
                  }).length === 0 && (
                    <div className="text-center text-gray-400 py-4">No bonds found.</div>
                  )}
                </div>
              </SelectContent>
            </Select>

            <Button 
              variant="default" 
              size="sm"
              onClick={() => {
                // Only add bonds when the button is clicked
                selectedBondsToAdd.forEach(bond => {
                  if (bond.id) {
                    // Try to find by primary Id only
                    let selectedBond = availableBonds.find(b => b.Id === bond.id);
                    
                    console.log(`Processing selection: ${bond.issueNo} with ID ${bond.id}, match found:`, 
                      selectedBond ? {id: selectedBond.Id, issueNo: selectedBond.BondIssueNo} : 'none');
                    
                    // If not found by Id, try finding by bond issue number
                    if (!selectedBond) {
                      console.log(`Could not find bond with ID ${bond.id}, trying by issue number ${bond.issueNo}`);
                      selectedBond = availableBonds.find(b => b.BondIssueNo === bond.issueNo);
                    }
                    
                    if (selectedBond) {
                      console.log(`Found bond ${selectedBond.BondIssueNo} with ID ${selectedBond.Id}`);
                      handleBondSelect(selectedBond.BondIssueNo, selectedBond.Id);
                    } else {
                      // Fallback to finding by issue number
                      console.log(`Fallback: sending issue number only ${bond.issueNo}`);
                      handleBondSelect(bond.issueNo);
                    }
                  } else {
                    // If no ID, just use the issue number
                    console.log(`No ID provided, using issue number only: ${bond.issueNo}`);
                    handleBondSelect(bond.issueNo);
                  }
                });
                
                // Clear selection after adding
                setSelectedBondsToAdd([]);
                setValue([]);
              }}
              className="ml-2 bg-green-600 hover:bg-green-700 text-white shadow-md flex items-center gap-1"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Add 
            </Button>

            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRemoveSelectedBonds}
              className="ml-2 bg-red-50 hover:bg-red-100 text-red-700 border-red-300 shadow-md flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              
            </Button>
            
            </div>
          </div>


        </div>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
            <span className="ml-2 text-blue-700 font-medium">Refreshing portfolio...</span>
          </div>
        )}

        {/* Quick Tips Section */}
        <div className="mb-6">
          <Collapsible open={quickTipsOpen} onOpenChange={setQuickTipsOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center justify-between w-full p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 hover:from-blue-100 hover:to-cyan-100"
              >
                <div className="flex items-center">
                  <Info className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-medium text-blue-900">Quick Tips for Portfolio Creation & Management</span>
                </div>
                {quickTipsOpen ? (
                  <ChevronDown className="h-4 w-4 text-blue-600" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-blue-600" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="bg-white border border-blue-200 rounded-lg p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
                      Portfolio Setup
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        Create a new portfolio or select an existing one from the dropdown
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        Set your portfolio name and value date for accurate calculations
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        Use the search feature to quickly find specific bonds
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
                      Data Entry
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        <span className="bg-red-100 px-2 py-1 rounded text-xs font-medium mr-1">Light red fields</span>
                        are editable - click to modify values
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        Select bond type (HTM, HFS, AFS) from the dropdown menu
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        Enter purchase/sale dates, prices, and face values as needed
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">3</span>
                      View Options
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        Toggle between Portfolio Notepad (Input) and Scorecard (Output) views
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        Use checkboxes to select multiple bonds for bulk operations
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        Export visible sections only using the export dropdown
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">4</span>
                      Actions
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start">
                        <span className="text-orange-500 mr-2">•</span>
                        Click "Add" to include selected bonds in your portfolio
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-500 mr-2">•</span>
                        Use "Remove Selected" to delete checked bonds from portfolio
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-500 mr-2">•</span>
                        Save your portfolio and recalculate values as needed
                      </li>
                    </ul>
                  </div>
                </div>
                
                <Alert className="mt-4 border-amber-200 bg-amber-50">
                  <Info className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    <strong>Pro Tip:</strong> Always save your portfolio after making changes to preserve your work. 
                    Use the Refresh button to reload the latest data while maintaining your current portfolio selection.
                  </AlertDescription>
                </Alert>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Unified Table with all sections */}
        <div className="border rounded-lg overflow-hidden">
          <div
            className="overflow-x-auto"
            style={{
              width: "100%",
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "thin",
              scrollbarColor: "#cbd5e0 #f1f5f9",
              maxWidth: "100%",
              overflow: "auto",
            }}
          >
            <div style={{ minWidth: "1500px" }}>
              <Table>
                <TableHeader className="bg-gradient-to-r from-blue-50 to-green-50 sticky top-0 z-10">
                  {/* Main Section Headers */}
                  <TableRow>
                    {/* Common columns */}
                    <TableHead className="text-center" colSpan={3}></TableHead>

                    {/* Section A: Portfolio Notepad - Input */}
                    {columnVisibility.bondIssueNo && (
                      <TableHead className="text-center font-bold bg-purple-100 text-purple-900  border-l border-r" colSpan={10}>
                         PORTFOLIO NOTEPAD
                      </TableHead>
                    )}

                    {/* Section B: Profit & Loss */}
                    {/* {columnVisibility.bondValuationMetrics && (
                      <TableHead className="text-center font-bold bg-blue-100 text-blue-900 border-l border-r" colSpan={7}>
                        PROFIT & LOSS (P&L) - OUTPUT
                      </TableHead>
                    )} */}

                    {/* Section C: Portfolio Scorecard */}
                    {columnVisibility.riskBudgetingIndicators && (
                      <TableHead className="text-center font-bold bg-green-100 text-green-900  border-l border-r" colSpan={11}>
                        PORTFOLIO SCORECARD 
                      </TableHead>
                    )}
                  </TableRow>

                  {/* Sub-section Headers */}
                  <TableRow>
                    {/* Common columns */}
                    <TableHead className="text-center" colSpan={3}></TableHead>

                    {/* Section A: Sub-headers */}
                    {columnVisibility.bondIssueNo && (
                      <>
                        <TableHead className="text-center font-bold bg-orange-100 text-orange-900  border-l" colSpan={4}>
                          PURCHASES
                        </TableHead>
                        <TableHead className="text-center font-bold bg-lime-100 text-lime-900 border-r" colSpan={4}>
                          SALES
                        </TableHead>
                        <TableHead className="text-center font-bold bg-lime-100 text-lime-900 border-r" colSpan={1}>
                          BALANCE
                        </TableHead>
                        <TableHead className="text-center font-bold bg-lime-100 text-lime-900 border-r" colSpan={1}>
                          {/* Display today's date here */}
                          {new Date().toLocaleDateString()}
                        </TableHead>
                      </>
                    )}

                    {/* Section B: Sub-headers */}
                    {columnVisibility.riskBudgetingIndicators && (
                        <>
                      <TableHead className="text-center font-bold bg-orange-100 text-orange-900 border-l border-r" colSpan={6}>
                       Description
                      </TableHead>
                      <TableHead className="text-center font-bold bg-red-100 text-red-900 border-l border-r" colSpan={2}>
                      Risk Profile
                    </TableHead>        
                    <TableHead className="text-center font-bold bg-green-100 text-green-900 border-l border-r" colSpan={3}>
                      Returns Profile
                    </TableHead>    
                      </>             
                    )}
                  </TableRow>

                  {/* Column Headers */}
                  <TableRow>
                    {/* Checkbox column */}
                    <TableHead className="whitespace-nowrap bg-stone-100 text-stone-900 w-10  border-gray-300">
                      <Checkbox
                        checked={paginatedData.length > 0 && paginatedData.every((row) => row.selected)}
                        onCheckedChange={(checked) => {
                          setData((prev) => prev.map((row) => ({ ...row, selected: !!checked })))
                        }}
                      />
                    </TableHead>

                    {/* Common columns */}
                    <TableHead className="bg-stone-100 text-stone-900 whitespace-nowrap  border-gray-300">Type</TableHead>
                    <TableHead className="bg-stone-100 text-stone-900 whitespace-nowrap  border-gray-300">Bonds Held</TableHead>

                    {/* Section A: Column Headers */}
                    {columnVisibility.bondIssueNo && (
                      <>
                        <TableHead className="bg-purple-100 text-purple-900 font-bold whitespace-nowrap border-l">Buying Date</TableHead>
                        <TableHead className="bg-purple-100 text-purple-900 font-bold whitespace-nowrap">Buying Price</TableHead>
                        <TableHead className="whitespace-nowrap bg-purple-100 text-purple-900 font-bold">Buying WAP</TableHead>
                        <TableHead className="bg-purple-100 text-purple-900 font-bold whitespace-nowrap">Face Value Buys</TableHead>
                        <TableHead className="bg-green-100 text-green-900 font-bold whitespace-nowrap">Selling Date</TableHead>
                        <TableHead className="bg-green-100 text-green-900 font-bold whitespace-nowrap">Selling Price</TableHead>
                        <TableHead className="whitespace-nowrap bg-green-100 text-green-900 font-bold">Selling WAP</TableHead>
                        <TableHead className="bg-green-100 text-green-900 font-bold whitespace-nowrap border-r">Face Value Sales</TableHead>
                        <TableHead className="whitespace-nowrap border-l bg-blue-100 text-blue-900 font-bold">Face Value Bal</TableHead>
                        <TableHead className="whitespace-nowrap bg-blue-100 text-blue-900 font-bold">Closing Price</TableHead>
                      </>
                    )}

                    {/* Section B: Column Headers */}
                    {columnVisibility.bondValuationMetrics && (
                      <>

                        
                        

                      </>
                    )}

                    {/* Section C: Column Headers */}
                    {columnVisibility.riskBudgetingIndicators && (
                      <>
                        <TableHead className="whitespace-nowrap border-l bg-green-100 text-green-900 font-bold">Dirty Price (KES)</TableHead>
                        <TableHead className="whitespace-nowrap bg-green-100 text-green-900 font-bold">Portfolio Value (KES)</TableHead>
                        <TableHead className="whitespace-nowrap bg-green-100 text-green-900 font-bold">Maturity (Yrs)*</TableHead>
                        <TableHead className="whitespace-nowrap bg-green-100 text-green-900 font-bold">Coupon</TableHead>
                        <TableHead className="whitespace-nowrap bg-blue-100 text-blue-900 font-bold">Coupon (Net)</TableHead>
                        <TableHead className="whitespace-nowrap bg-blue-100 text-blue-900 font-bold">Next Coupon (Days)</TableHead>
                        {/* <TableHead className="whitespace-nowrap border-r bg-green-100 text-green-900 font-bold">Spot YTM</TableHead> */}
                        <TableHead className="whitespace-nowrap bg-red-100 text-red-700 font-bold">Duration</TableHead>
                        <TableHead className="whitespace-nowrap bg-red-100 text-red-700 font-bold">M Duration</TableHead>
                        <TableHead className="whitespace-nowrap text-green-700 bg-green-100 font-bold">Realized P&L</TableHead>
                        <TableHead className="whitespace-nowrap text-red-700 bg-red-100 font-bold">Unrealized P&L</TableHead>
                        <TableHead className="whitespace-nowrap border-r bg-green-100 text-green-700 font-bold">1-Yr Total Return</TableHead>
                        {/* <TableHead className="whitespace-nowrap bg-red-100 text-red-700 font-bold">DV01</TableHead> */}
                        {/* <TableHead className="whitespace-nowrap bg-green-100 text-green-900 font-bold">Expected Shortfall (CVaR)</TableHead> */}
                        
                      </>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((row, rowIndex) => (
                    <TableRow 
                      key={`row-${row.id}-${rowIndex}`}
                      className={
                        row.bondsHeld === "Overall Portfolio"
                          ? "bg-gradient-to-r from-blue-100 to-green-100 font-bold text-blue-900 border-t-2 border-blue-200"
                          : row.selected
                            ? "bg-blue-50 hover:bg-blue-100"
                            : "hover:bg-gray-50"
                      }
                      style={{ borderRadius: "8px" }}
                    >
                      {/* Checkbox column */}
                      <TableCell className="w-10  bg-white border-gray-300">
                        {row.bondsHeld !== "Overall Portfolio" && (
                          <Checkbox
                            checked={!!row.selected}
                            onCheckedChange={(checked) => {
                              setData((prev) =>
                                prev.map((item) => (item.id === row.id ? { ...item, selected: !!checked } : item)),
                              ) 
                            }}
                          />
                        )}
                      </TableCell>

                      {/* Common columns */}
                      <TableCell className=" bg-white border-r border-gray-300">
                        {row.bondsHeld !== "Overall Portfolio" ? (
                          <Select 
                            defaultValue={row.type}
                            onValueChange={(value) => updateData(startIndex + rowIndex, "type", value)}
                          >
                            <SelectTrigger className="w-16 h-8 border bg-red-50">
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="HFS">HFS</SelectItem>
                              <SelectItem value="HTM">HTM</SelectItem>
                              <SelectItem value="AFS">AFS</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          "Overall"
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap  bg-white border-r border-gray-300" >
                        <div className="flex items-center justify-between">
                          <span>{row.bondsHeld}</span>
                          {row.bondsHeld !== "Overall Portfolio" && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-2">
                                  <MoreVertical className="h-3 w-3" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleSendToQuoteBook(row)}
                                >
                                  Send to Quote Book
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRemoveEntry(row.id)} className="text-red-600">
                                  Remove
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </TableCell>

                      {/* Section A: Portfolio Notepad - Input */}
                      {columnVisibility.bondIssueNo && (
                        <>
                          <TableCell className=" border-l">
                            {row.bondsHeld !== "Overall Portfolio" ? (
                              <Input
                                type="date"
                                value={row.buyingDate}
                                onChange={(e) => updateData(rowIndex, "buyingDate", e.target.value)}
                                className="w-32 h-8 bg-red-50"
                              />
                            ) : (
                              ""
                            )}
                          </TableCell>
                          <TableCell className="">
                            {row.bondsHeld !== "Overall Portfolio" ? (
                              <EditableCell
                                value={row.buyingPrice}
                                onChange={(value) => updateData(rowIndex, "buyingPrice", value)}
                              />
                            ) : (
                              ""
                            )}
                          </TableCell>
                          <TableCell>{row.bondsHeld !== "Overall Portfolio" ? Number(row.buyingWAP).toFixed(4) : ""}</TableCell>
                          <TableCell className="">
                            {row.bondsHeld !== "Overall Portfolio" ? (
                              <EditableCell
                                value={row.faceValueBuys}
                                onChange={(value) => updateData(rowIndex, "faceValueBuys", value)}
                              />
                            ) : (
                              ""
                            )}
                          </TableCell>
                          <TableCell className="">
                            {row.bondsHeld !== "Overall Portfolio" ? (
                              <Input
                                type="date"
                                value={row.sellingDate}
                                onChange={(e) => updateData(rowIndex, "sellingDate", e.target.value)}
                                className="w-32 h-8 bg-red-50"
                              />
                            ) : (
                              ""
                            )}
                          </TableCell>
                          <TableCell className="">
                            {row.bondsHeld !== "Overall Portfolio" ? (
                              <EditableCell
                                value={row.sellingPrice}
                                onChange={(value) => updateData(rowIndex, "sellingPrice", value)}
                              />
                            ) : (
                              ""
                            )}
                          </TableCell>
                          <TableCell>{row.bondsHeld !== "Overall Portfolio" ? row.sellingWAP.toFixed(4) : ""}</TableCell>
                          <TableCell className=" border-r">
                            {row.bondsHeld !== "Overall Portfolio" ? (
                              <EditableCell
                                value={row.faceValueSales}
                                onChange={(value) => updateData(rowIndex, "faceValueSales", value)}
                              />
                            ) : (
                              ""
                            )}
                          </TableCell>
                          <TableCell className="border-l">{row.bondsHeld === "Overall Portfolio" ? (row.faceValueBal ? formatCurrency(row.faceValueBal) : "") : formatCurrency(row.faceValueBal)}</TableCell>
                          <TableCell>{row.bondsHeld === "Overall Portfolio" ? (row.closingPrice ? Number(row.closingPrice).toFixed(4) : "") : (row.closingPrice ? Number(row.closingPrice).toFixed(4) : "")}</TableCell>
                        </>
                      )}

                      {/* Section B: Profit & Loss */}
                      {/* {columnVisibility.bondValuationMetrics && (
                        <>

                          <TableCell>{row.bondsHeld === "Overall Portfolio" ? (row.couponNet ? Number(row.couponNet).toFixed(4) : "") : row.couponNet.toFixed(4)}</TableCell>
                          <TableCell>{row.bondsHeld === "Overall Portfolio" ? (row.nextCouponDays ? Number(row.nextCouponDays).toFixed(4) : "") : row.nextCouponDays}</TableCell>
                          <TableCell className="text-green-600">{row.bondsHeld === "Overall Portfolio" ? (row.realizedPL ? formatCurrency(Number(row.realizedPL)) : "") : formatCurrency(row.realizedPL)}</TableCell>
                          <TableCell className={row.unrealizedPL < 0 ? "text-red-600" : "text-green-600"}>
                            {row.bondsHeld === "Overall Portfolio"
                              ? row.unrealizedPL < 0
                                ? `(${formatCurrency(Math.abs(Number(row.unrealizedPL)))})`
                                : row.unrealizedPL > 0
                                  ? formatCurrency(Number(row.unrealizedPL))
                                  : ""
                              : row.unrealizedPL < 0
                                ? `(${formatCurrency(Math.abs(row.unrealizedPL))})`
                                : formatCurrency(row.unrealizedPL)}
                          </TableCell>
                          <TableCell
                            className={`${row.totalReturn < 0 ? "text-red-600 bg-pink-50" : "text-green-600 italic"} border-r`}
                          >
                            {row.bondsHeld === "Overall Portfolio" ? (isNaN(row.totalReturn) ? "" : Number(row.totalReturn).toFixed(4) + "%") : (isNaN(row.totalReturn) ? 0 : row.totalReturn.toFixed(4) + "%")}
                          </TableCell>
                        </>
                      )}

                      {/* Section C: Portfolio Scorecard */}
                      {columnVisibility.riskBudgetingIndicators && (
                        <>
                          <TableCell className="border-l">{row.bondsHeld === "Overall Portfolio" ? (row.dirtyPrice ? Number(row.dirtyPrice).toFixed(4) : "") : Number(row.dirtyPrice).toFixed(4)}</TableCell>
                          <TableCell>{row.bondsHeld === "Overall Portfolio" ? (row.portfolioValue ? formatCurrency(Number(row.portfolioValue)) : "") : formatCurrency(row.portfolioValue)}</TableCell>
                          <TableCell>{row.bondsHeld === "Overall Portfolio" ? (row.maturityYears ? Number(row.maturityYears).toFixed(4) : "") : Number(row.maturityYears).toFixed(4)}</TableCell>
                          
                          <TableCell>{row.bondsHeld === "Overall Portfolio" ? (row.coupon ? Number(row.coupon).toFixed(4) : "") : Number(row.coupon).toFixed(4) }</TableCell>
                          <TableCell>{row.bondsHeld === "Overall Portfolio" ? (row.couponNet ? Number(row.couponNet).toFixed(4) : "") : (row.couponNet ? Number(row.couponNet).toFixed(4) : "")}</TableCell>
                          <TableCell>{row.bondsHeld === "Overall Portfolio" ? (row.nextCouponDays ? Number(row.nextCouponDays).toFixed(4) : "") : row.nextCouponDays}</TableCell>
                          {/* <TableCell className="border-r">{row.bondsHeld === "Overall Portfolio" ? (row.spotYTM ? (Number(row.spotYTM) * 100).toFixed(4) + "%" : "") : (Number(row.spotYTM) * 100).toFixed(4) + "%"}</TableCell> */}
                          <TableCell>{row.bondsHeld === "Overall Portfolio" ? (row.duration ? Number(row.duration).toFixed(4) : "") : Number(row.duration).toFixed(4)}</TableCell>
                          <TableCell>{row.bondsHeld === "Overall Portfolio" ? (row.mDuration ? Number(row.mDuration).toFixed(4) : "") : Number(row.mDuration).toFixed(4)}</TableCell>
                          <TableCell className="text-green-600">{row.bondsHeld === "Overall Portfolio" ? (row.realizedPL ? formatCurrency(Number(row.realizedPL)) : "") : formatCurrency(row.realizedPL)}</TableCell>
                          <TableCell className={row.unrealizedPL < 0 ? "text-red-600" : "text-green-600"}>
                            {row.bondsHeld === "Overall Portfolio"
                              ? row.unrealizedPL < 0
                                ? `(${formatCurrency(Math.abs(Number(row.unrealizedPL)))})`
                                : row.unrealizedPL > 0
                                  ? formatCurrency(Number(row.unrealizedPL))
                                  : ""
                              : row.unrealizedPL < 0
                                ? `(${formatCurrency(Math.abs(row.unrealizedPL))})`
                                : formatCurrency(row.unrealizedPL)}
                          </TableCell>
                          <TableCell
                            className={`${row.totalReturn < 0 ? "text-red-600 bg-pink-50" : "text-green-600 italic"} border-r`}
                          >
                            {row.bondsHeld === "Overall Portfolio" ? (isNaN(row.totalReturn) ? "" : Number(row.totalReturn).toFixed(4) + "%") : (isNaN(row.totalReturn) ? 0 : row.totalReturn.toFixed(4) + "%")}
                          </TableCell>
                          {/* <TableCell>{row.bondsHeld === "Overall Portfolio" ? (row.dv01 ? Number(row.dv01).toFixed(4) : "") : Number(row.dv01).toFixed(4)}</TableCell> */}
                          {/* <TableCell className="bg-gray-100">{row.bondsHeld === "Overall Portfolio" ? (row.expectedShortfall ? Number(row.expectedShortfall).toFixed(4) : "") : row.expectedShortfall}</TableCell> */}
                         
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>  
          </div>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 px-4">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1"
              >
                Previous
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = currentPage <= 3 
                    ? i + 1 
                    : currentPage >= totalPages - 2 
                      ? totalPages - 4 + i 
                      : currentPage - 2 + i;
                  
                  if (pageNum < 1 || pageNum > totalPages) return null;
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 ${
                        currentPage === pageNum 
                          ? "bg-blue-600 text-white" 
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={handleExportToExcel}>Export to Excel</Button>
          <Button variant="outline" onClick={handleExportToPDF}>Export to PDF</Button>
          <Button variant="outline" onClick={handleExportToCSV}>Export to CSV</Button>
          <Button onClick={handleSavePortfolio}>Save Portfolio</Button>
        </div>
      </div>
      <ClientSelectionDialog
        open={clientDialogOpen}
        onOpenChange={setClientDialogOpen}
        onSelect={handleClientSelection}
        userEmail={userDetails?.email || ''}
      />
    </div>
  )
}