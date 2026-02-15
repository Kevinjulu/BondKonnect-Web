
"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { MoreVertical, FileDown, Loader2, Trash2, ChevronDown, ChevronRight, Info, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getStatsTable, addNewPortfolio, getUserPortfolios, updatePortfolio, exportPortfolioToExcel, sendToQuoteBook } from "@/lib/actions/api.actions"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ClientSelectionDialog } from "../quote-book/client-selection-dialog"
import { cn } from "@/lib/utils"

interface BondStats {
  Id: number;
  Otr: string;
  Filter1: number;
  Filter2: number;
  Id_: number; 
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
  <Input 
    value={String(value ?? "")} 
    onChange={(e) => onChange(e.target.value)} 
    className="h-8 w-full border-neutral-200 bg-white text-black focus:ring-black focus:border-black font-medium" 
  />
)

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "KES" }).format(value)
}

const formatDate = (date: string | Date): string => {
  if (!date) return '';
  if (typeof date === 'string') {
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
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

function formatValueDate(dateStr: string): string {
  if (!dateStr) return '';
  const dateParts = dateStr.split(/[T \-:]/);
  if (dateParts.length >= 3) {
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]);
    const day = parseInt(dateParts[2]);
    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      return `${month}/${day}/${year}`;
    }
  }
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

function formatDateForInput(dateStr: string): string {
  if (!dateStr) return '';
  const dateParts = dateStr.split(/[T \-:]/);
  if (dateParts.length >= 3) {
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]);
    const day = parseInt(dateParts[2]);
    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }
  }
  const [datePart] = dateStr.split(' ');
  if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
    return datePart;
  }
  const d = new Date(dateStr);
  return d.toISOString().split('T')[0];
}

function calculateBuyingWAP(bondIssueNo: string, type: string, buyingPrice: number, buyingDate: string, currentDate: string, data: PortfolioEntry[]): number {
  if (bondIssueNo === "Overall Portfolio" || bondIssueNo === "") return 0;
  if (type === "HTM") return buyingPrice;
  const previousEntries = data.filter(entry => entry.bondsHeld === bondIssueNo && entry.type === type);
  if (previousEntries.length === 0) return buyingPrice;
  let totalFaceValue = 0;
  let totalWeightedPrice = 0;
  for (const entry of previousEntries) {
    totalFaceValue += entry.faceValueBuys;
    totalWeightedPrice += entry.buyingPrice * entry.faceValueBuys;
  }
  totalFaceValue += 0;
  totalWeightedPrice += 0;
  return totalFaceValue > 0 ? totalWeightedPrice / totalFaceValue : buyingPrice;
}

function calculateSellingWAP(bondIssueNo: string, type: string, faceValueSales: number, sellingPrice: number, sellingDate: string, valueDate: string, data: PortfolioEntry[]): number {
  if (bondIssueNo === "Overall Portfolio" || bondIssueNo === "") return 0;
  if (faceValueSales === 0) return 0;
  if (type === "HTM") return sellingPrice;
  const valueDateObj = new Date(valueDate);
  const oneYearAgo = new Date(valueDateObj);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const previousSales = data.filter(entry => entry.bondsHeld === bondIssueNo && entry.type === type && entry.sellingDate && entry.faceValueSales > 0 && new Date(entry.sellingDate) > oneYearAgo);
  if (previousSales.length === 0) return sellingPrice;
  let totalFaceValueSold = 0;
  let totalWeightedSellingPrice = 0;
  for (const entry of previousSales) {
    totalFaceValueSold += entry.faceValueSales;
    totalWeightedSellingPrice += entry.sellingPrice * entry.faceValueSales;
  }
  totalFaceValueSold += faceValueSales;
  totalWeightedSellingPrice += sellingPrice * faceValueSales;
  if (totalFaceValueSold === 0) return sellingPrice;
  return totalWeightedSellingPrice / totalFaceValueSold;
}

function calculateFaceValueBal(bondIssueNo: string, type: string, faceValueBuys: number, faceValueSales: number, sellingDate: string, sellingPrice: number, data: PortfolioEntry[]): number {
  if (bondIssueNo === "Overall Portfolio" || bondIssueNo === "") return 0;
  const previousEntries = data.filter(entry => entry.bondsHeld === bondIssueNo && entry.type === type);
  const hasPreviousEntries = previousEntries.length > 0;
  const hasSellingData = sellingDate !== '' && sellingPrice > 0 && faceValueSales > 0;
  const lacksSellingData = sellingDate === '' || sellingPrice === 0 || faceValueSales === 0;
  if (hasPreviousEntries && (hasSellingData || lacksSellingData)) {
    const sumPreviousBuys = previousEntries.reduce((sum, entry) => sum + entry.faceValueBuys, 0);
    const sumPreviousSales = previousEntries.reduce((sum, entry) => sum + entry.faceValueSales, 0);
    return sumPreviousBuys + faceValueBuys - sumPreviousSales - faceValueSales;
  }
  if (hasSellingData) return faceValueBuys - faceValueSales;
  const sumPreviousBuys = previousEntries.reduce((sum, entry) => sum + entry.faceValueBuys, 0);
  return sumPreviousBuys + faceValueBuys;
}

function calculateClosingPrice(bondIssueNo: string, type: string, faceValueSales: number, sellingPrice: number, buyingPrice: number, sellingDate: string, faceValueBal: number, dirtyPrice: number): number {
  if (type === "HTM") return buyingPrice;
  if (type === "HFS") return dirtyPrice;
  if (sellingDate && sellingPrice > 0 && faceValueSales > 0 && faceValueBal === 0) return sellingPrice;
  return dirtyPrice;
}

function calculateCouponNet(bondIssueNo: string, type: string, sellingDate: string, valueDate: string, buyingWAP: number, coupon: number, filter1: number, filter2: number, daysBasis: number, taxRates: { taxRateC4: number, taxRateC5: number, taxRateC6: number }, data: PortfolioEntry[]): number | "" {
  if (bondIssueNo === "Overall Portfolio") {
    const total = data.filter((row: PortfolioEntry) => row.bondsHeld !== "Overall Portfolio").reduce((acc: { couponSum: number; maxFaceValue: number }, row: PortfolioEntry) => {
      acc.couponSum += (row.coupon || 0) * (row.faceValueBuys || 0);
      acc.maxFaceValue = Math.max(acc.maxFaceValue, row.faceValueBuys || 0);
      return acc;
    }, { couponSum: 0, maxFaceValue: 0 });
    if (total.maxFaceValue === 0) return 0;
    return total.couponSum / total.maxFaceValue;
  }
  if (type !== "HTM" && data.some((row: PortfolioEntry) => row.bondsHeld === bondIssueNo && row.type === type)) return "";
  if (!bondIssueNo) return "";
  const hasSellingDate = !!sellingDate;
  const termNot364 = daysBasis !== 364;
  const soldMoreThan1YrAgo = valueDate && sellingDate && (new Date(valueDate).getTime() - new Date(sellingDate).getTime()) / (1000 * 60 * 60 * 24) > 365;
  if (hasSellingDate && termNot364 && soldMoreThan1YrAgo && buyingWAP === 0) return "";
  const termIs364 = daysBasis === 364;
  const soldMoreThan364DaysAgo = valueDate && sellingDate && (new Date(valueDate).getTime() - new Date(sellingDate).getTime()) / (1000 * 60 * 60 * 24) > 364;
  if (hasSellingDate && termIs364 && soldMoreThan364DaysAgo && buyingWAP === 0) return "";
  const taxCode = filter1 - filter2;
  if (taxCode === 0) return coupon;
  else if (taxCode === 1) return coupon * (1 - taxRates.taxRateC6);
  else if (taxCode === 2) return coupon * (1 - taxRates.taxRateC5);
  else return coupon * (1 - taxRates.taxRateC4);
}

function calculateRealizedPL(bondIssueNo: string, type: string, sellingDate: string, sellingWAP: number, buyingWAP: number, faceValueSales: number, couponNet: number, valueDate: string, daysBasis: number, nextCouponDays: number, data: PortfolioEntry[]): number {
  if (!bondIssueNo || !type || !sellingDate) return 0;
  if (sellingWAP <= 0 || faceValueSales <= 0) return 0;
  const valueDateObj = parseDate(valueDate);
  const priceDiff = calculatePriceDifference(sellingWAP, buyingWAP, faceValueSales);
  if (bondIssueNo === "Overall Portfolio") return calculateOverallPortfolioPL(data);
  const couponAccrual = calculateCouponAccrual(data, bondIssueNo, type, couponNet, valueDateObj, daysBasis, nextCouponDays);
  return priceDiff + couponAccrual;
}

function parseDate(dateString: string): Date {
  if (dateString.includes("-")) {
    const parts = dateString.split("-");
    if (parts.length !== 3) throw new Error(`Invalid ISO date: ${dateString}`);
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  const parts = dateString.split("/");
  if (parts.length !== 3) throw new Error(`Invalid date format: ${dateString}`);
  let day: number, month: number, year: number;
  if (parseInt(parts[0], 10) > 12) {
    day = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10) - 1;
    year = parseInt(parts[2], 10);
  } else {
    month = parseInt(parts[0], 10) - 1;
    day = parseInt(parts[1], 10);
    year = parseInt(parts[2], 10);
  }
  return new Date(year, month, day);
}

function calculatePriceDifference(sellingWAP: number, buyingWAP: number, faceValueSales: number): number {
  return (sellingWAP - buyingWAP) * (faceValueSales / 100);
}

function calculateOverallPortfolioPL(data: PortfolioEntry[]): number {
  return data.filter(row => row.bondsHeld !== "Overall Portfolio").reduce((sum, row) => sum + (row.realizedPL || 0), 0);
}

function calculateCouponAccrual(data: PortfolioEntry[], bondIssueNo: string, type: string, couponNet: number, valueDateObj: Date, daysBasis: number, nextCouponDays: number): number {
  if (daysBasis === 364) return calculate364DayBondCouponAccrual(data, bondIssueNo, type, couponNet, valueDateObj, nextCouponDays);
  if (type === "HTM") return calculateHTMCouponAccrual(data, bondIssueNo, type, couponNet, valueDateObj);
  return calculateStandardCouponAccrual(data, bondIssueNo, type, couponNet, valueDateObj, daysBasis);
}

function calculate364DayBondCouponAccrual(data: PortfolioEntry[], bondIssueNo: string, type: string, couponNet: number, valueDateObj: Date, nextCouponDays: number): number {
  const oneYearAgo = new Date(valueDateObj);
  oneYearAgo.setDate(oneYearAgo.getDate() + nextCouponDays - 364);
  const sixMonthsAgo = new Date(valueDateObj);
  sixMonthsAgo.setDate(sixMonthsAgo.getDate() + nextCouponDays - 182);
  const holdingsAtOneYearAgo = calculateNetHoldings(data, bondIssueNo, type, oneYearAgo);
  const holdingsAtSixMonthsAgo = calculateNetHoldings(data, bondIssueNo, type, sixMonthsAgo);
  return (holdingsAtOneYearAgo * (couponNet / 100) / 2 + (holdingsAtSixMonthsAgo * (couponNet / 100) / 2));
}

function calculateHTMCouponAccrual(data: PortfolioEntry[], bondIssueNo: string, type: string, couponNet: number, valueDateObj: Date): number {
  const oneYearAgo = new Date(valueDateObj);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const sixMonthsAgo = new Date(valueDateObj);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const holdingsAtOneYearAgo = calculateNetHoldings(data, bondIssueNo, type, oneYearAgo);
  const holdingsAtSixMonthsAgo = calculateNetHoldings(data, bondIssueNo, type, sixMonthsAgo);
  return (holdingsAtOneYearAgo * (couponNet / 100) / 2 + (holdingsAtSixMonthsAgo * (couponNet / 100) / 2));
}

function calculateStandardCouponAccrual(data: PortfolioEntry[], bondIssueNo: string, type: string, couponNet: number, valueDateObj: Date, daysBasis: number): number {
  const holdingPeriod = daysBasis;
  const oneYearAgo = new Date(valueDateObj);
  oneYearAgo.setDate(oneYearAgo.getDate() - holdingPeriod);
  const sixMonthsAgo = new Date(valueDateObj);
  sixMonthsAgo.setDate(sixMonthsAgo.getDate() - Math.floor(holdingPeriod / 2));
  const holdingsAtOneYear = calculateNetHoldings(data, bondIssueNo, type, oneYearAgo);
  const holdingsAtSixMonths = calculateNetHoldings(data, bondIssueNo, type, sixMonthsAgo);
  return (holdingsAtOneYear * (couponNet / 100) / 2 + (holdingsAtSixMonths * (couponNet / 100) / 2));
}

function calculateNetHoldings(data: PortfolioEntry[], bondIssueNo: string, type: string, date: Date): number {
  const totalBuys = data.filter(entry => entry.bondsHeld === bondIssueNo && entry.type === type && entry.faceValueBuys > 0 && new Date(entry.buyingDate) <= date).reduce((sum, entry) => sum + (entry.faceValueBuys || 0), 0);
  const totalSales = data.filter(entry => entry.bondsHeld === bondIssueNo && entry.type === type && entry.faceValueSales > 0 && new Date(entry.sellingDate) <= date).reduce((sum, entry) => sum + (entry.faceValueSales || 0), 0);
  return totalBuys - totalSales;
}

function calculateUnrealizedPL(bondIssueNo: string, closingPrice: number, buyingWAP: number, faceValueBal: number, data: PortfolioEntry[]): number | "" {
  if (bondIssueNo !== "Overall Portfolio" && (closingPrice === 0 || closingPrice === null || closingPrice === undefined)) return "";
  if (bondIssueNo === "Overall Portfolio") return data.filter(entry => entry.bondsHeld !== "Overall Portfolio").reduce((sum, entry) => sum + (typeof entry.unrealizedPL === "number" ? entry.unrealizedPL : 0), 0);
  return ((closingPrice - buyingWAP) * faceValueBal) / 100;
}

function calculateOneYearTotalReturn(bondIssueNo: string, type: string, daysBasis: number, buyingWAP: number, realizedPL: number, unrealizedPL: number, faceValueBuys: number, faceValueSales: number, faceValueBal: number, buyingDate: string, closingPrice: number, sellingDate: string, valueDate: string, data: PortfolioEntry[]): number {
  let valueDateObj: Date;
  try { valueDateObj = parseDate(valueDate); } catch { return 0; }
  const totalPL = realizedPL + unrealizedPL;
  if (type === "HFS" || type === "AFS") {
    const cutoffDate = new Date(valueDateObj);
    cutoffDate.setDate(cutoffDate.getDate() - daysBasis);
    let totalFaceValue = 0;
    const bondEntries = data.filter(entry => entry.bondsHeld === bondIssueNo && entry.type === type);
    for (const entry of bondEntries) {
      const entryBuyingDate = parseDate(entry.buyingDate);
      const entrySellingDate = entry.sellingDate ? parseDate(entry.sellingDate) : null;
      if (entryBuyingDate >= cutoffDate && entry.faceValueBuys > 0) totalFaceValue += entry.faceValueBuys;
      if (entryBuyingDate < cutoffDate && entry.faceValueBuys > 0) totalFaceValue += entry.faceValueBuys;
      if (entrySellingDate && entrySellingDate < cutoffDate && entry.faceValueSales > 0) totalFaceValue -= entry.faceValueSales;
    }
    const denominator = buyingWAP * (totalFaceValue / 100);
    if (denominator === 0) return 0;
    return (totalPL / denominator) * 100;
  }
  if (type === "HTM") {
    const denominator = buyingWAP * (faceValueBuys / 100);
    return denominator > 0 ? (totalPL / denominator) * 100 : 0;
  }
  return 0;
}

function generateDefaultValues(bondStats: BondStats): PortfolioEntry {
  const timestamp = Date.now();
  const randomSuffix = Math.floor(Math.random() * 1000);
  const uniqueId = `${timestamp}-${randomSuffix}`;
  return {
    id: uniqueId, bondId: bondStats.Id, id_: bondStats.Id_, type: "HFS", bondsHeld: bondStats.BondIssueNo, buyingDate: formatDateForInput(new Date().toISOString()), buyingPrice: bondStats.DirtyPrice, buyingWAP: 0, faceValueBuys: 0, sellingDate: "", sellingPrice: 0, sellingWAP: 0, faceValueSales: 0, faceValueBal: 0, closingPrice: bondStats.DirtyPrice, couponNet: bondStats.Coupon, nextCouponDays: bondStats.NextCpnDays, realizedPL: 0, unrealizedPL: 0, totalReturn: 0, maturityYears: bondStats.DtmYrs, coupon: bondStats.Coupon, duration: bondStats.Duration, mDuration: bondStats.MDuration, dv01: bondStats.Dv01, expectedShortfall: bondStats.ExpectedShortfall, spotYTM: bondStats.SpotYield, dirtyPrice: bondStats.DirtyPrice, portfolioValue: 0, selected: false
  };
}

function calculatePortfolioValue(type: string, bondIssueNo: string, closingPrice: number, faceValueBal: number, data: PortfolioEntry[]): number {
  if (!type && !bondIssueNo) return 0;
  const hasEmptyClosingPrice = closingPrice === 0 || closingPrice === null || closingPrice === undefined;
  const hasFutureEntries = data.some(entry => entry.bondsHeld === bondIssueNo && entry.type === type);
  if ((bondIssueNo !== "" && bondIssueNo !== "Overall Portfolio" && hasEmptyClosingPrice) || (type !== "HTM" && hasFutureEntries)) return 0;
  if (bondIssueNo === "Overall Portfolio") return data.filter(entry => entry.bondsHeld !== "Overall Portfolio").reduce((sum, entry) => sum + entry.portfolioValue, 0);
  return Math.round(closingPrice * 1000000) / 1000000 * faceValueBal / 100;
}

function recalculateRow(rowIndex: number, data: PortfolioEntry[], availableBonds: BondStats[], valueDate: string): PortfolioEntry[] {
  const newData = [...data];
  const currentRow = { ...newData[rowIndex] };
  const otherData = [...newData.slice(0, rowIndex), ...newData.slice(rowIndex + 1)];
  const bondStats = availableBonds.find(bond => bond.BondIssueNo === currentRow.bondsHeld);
  if (!bondStats) {
    const defaultBondStats: BondStats = {
      BondIssueNo: currentRow.bondsHeld, Coupon: currentRow.coupon, DirtyPrice: currentRow.dirtyPrice, NextCpnDays: currentRow.nextCouponDays, Basis: 364, Filter1: 0, Filter2: 0, SpotYield: currentRow.spotYTM, Otr: "", Id: 0, Id_: currentRow.id_, IssueDate: "", MaturityDate: "", ValueDate: "", QuotedYield: "", DtmYrs: currentRow.maturityYears, Dtc: 0, Duration: currentRow.duration, MDuration: currentRow.mDuration, Convexity: 0, ExpectedReturn: 0, ExpectedShortfall: currentRow.expectedShortfall, Dv01: currentRow.dv01, Last91Days: 0, Last364Days: 0, LqdRank: "", Spread: 0, CreditRiskPremium: null, MdRank: null, ErRank: null, DayCount: 364
    };
    return calculateRowWithBondStats(rowIndex, newData, otherData, currentRow, defaultBondStats);
  }
  return calculateRowWithBondStats(rowIndex, newData, otherData, currentRow, bondStats);
}

function calculateRowWithBondStats(rowIndex: number, newData: PortfolioEntry[], otherData: PortfolioEntry[], currentRow: PortfolioEntry, bondStats: BondStats): PortfolioEntry[] {
  const taxRates = { taxRateC4: 0.10, taxRateC5: 0.15, taxRateC6: 0.00 };
  currentRow.buyingWAP = calculateBuyingWAP(currentRow.bondsHeld, currentRow.type, currentRow.buyingPrice, currentRow.buyingDate, formatValueDate(bondStats.ValueDate), otherData);
  currentRow.sellingWAP = calculateSellingWAP(currentRow.bondsHeld, currentRow.type, currentRow.faceValueSales, currentRow.sellingPrice, currentRow.sellingDate, formatValueDate(bondStats.ValueDate), otherData);
  currentRow.faceValueBal = calculateFaceValueBal(currentRow.bondsHeld, currentRow.type, currentRow.faceValueBuys, currentRow.faceValueSales, currentRow.sellingDate, currentRow.sellingPrice, otherData);
  currentRow.closingPrice = calculateClosingPrice(currentRow.bondsHeld, currentRow.type, currentRow.faceValueSales, currentRow.sellingPrice, currentRow.buyingPrice, currentRow.sellingDate, currentRow.faceValueBal, bondStats.DirtyPrice);
  if (currentRow.type === "HTM") currentRow.dirtyPrice = currentRow.buyingPrice;
  else currentRow.dirtyPrice = currentRow.closingPrice || 0;
  currentRow.couponNet = Number(calculateCouponNet(currentRow.bondsHeld, currentRow.type, currentRow.sellingDate, formatValueDate(bondStats.ValueDate), currentRow.buyingWAP, bondStats.Coupon, bondStats.Filter1, bondStats.Filter2, bondStats.DayCount, taxRates, otherData));
  currentRow.realizedPL = Number(calculateRealizedPL(currentRow.bondsHeld, currentRow.type, currentRow.sellingDate, currentRow.sellingWAP, currentRow.buyingWAP, currentRow.faceValueSales, currentRow.couponNet, formatValueDate(bondStats.ValueDate), 364, bondStats.NextCpnDays, newData)) || 0;
  currentRow.unrealizedPL = Number(calculateUnrealizedPL(currentRow.bondsHeld, currentRow.closingPrice, currentRow.buyingWAP, currentRow.faceValueBal, otherData)) || 0;
  currentRow.totalReturn = parseFloat(calculateOneYearTotalReturn(currentRow.bondsHeld, currentRow.type, 364, currentRow.buyingWAP, currentRow.realizedPL, currentRow.unrealizedPL, currentRow.faceValueBuys, currentRow.faceValueSales, currentRow.faceValueBal, currentRow.buyingDate, currentRow.closingPrice, currentRow.sellingDate, formatValueDate(bondStats.ValueDate), newData).toFixed(4));
  currentRow.portfolioValue = calculatePortfolioValue(currentRow.type, currentRow.bondsHeld, currentRow.closingPrice, currentRow.faceValueBal, otherData);
  currentRow.maturityYears = bondStats.DtmYrs ? bondStats.DtmYrs : 0;
  newData[rowIndex] = currentRow;
  return newData;
}

function recalculatePortfolio(data: PortfolioEntry[], availableBonds: BondStats[], valueDate: string): PortfolioEntry[] {
  let newData = [...data];
  for (let i = 0; i < newData.length; i++) {
    if (newData[i].bondsHeld === "Overall Portfolio") continue;
    newData = recalculateRow(i, newData, availableBonds, valueDate);
  }
  if (newData.length > 0) {
    const overallIndex = newData.findIndex(row => row.bondsHeld === "Overall Portfolio");
    if (overallIndex === -1) {
      const overallRow: PortfolioEntry = { id: "overall-portfolio", type: "HFS", id_: 0, bondsHeld: "Overall Portfolio", bondId: 0, buyingDate: "", buyingPrice: 0, buyingWAP: 0, faceValueBuys: 0, sellingDate: "", sellingPrice: 0, sellingWAP: 0, faceValueSales: 0, faceValueBal: 0, closingPrice: 0, couponNet: 0, nextCouponDays: 0, realizedPL: 0, unrealizedPL: 0, totalReturn: 0, maturityYears: 0, coupon: 0, duration: 0, mDuration: 0, dv01: 0, expectedShortfall: 0, spotYTM: 0, dirtyPrice: 0, portfolioValue: 0 };
      let totalPortfolioValue = 0; let totalFaceValueBuys = 0; let totalFaceValueSales = 0;
      for (const row of newData) {
        if (row.bondsHeld === "Overall Portfolio") continue;
        overallRow.faceValueBal += row.faceValueBal; overallRow.realizedPL += row.realizedPL; overallRow.unrealizedPL += row.unrealizedPL; overallRow.portfolioValue += row.portfolioValue; totalPortfolioValue += row.portfolioValue; totalFaceValueBuys += row.faceValueBuys; totalFaceValueSales += row.faceValueSales;
      }
      if (totalPortfolioValue > 0) {
        for (const row of newData) {
          if (row.bondsHeld === "Overall Portfolio") continue;
          const weightPV = row.portfolioValue / totalPortfolioValue; overallRow.maturityYears += row.maturityYears * weightPV; overallRow.coupon += row.coupon * weightPV; overallRow.duration += row.duration * weightPV; overallRow.mDuration += row.mDuration * weightPV; overallRow.dv01 += row.dv01 * weightPV; overallRow.expectedShortfall += row.expectedShortfall * weightPV; overallRow.spotYTM += row.spotYTM * weightPV; overallRow.dirtyPrice += row.dirtyPrice * weightPV; overallRow.closingPrice += row.closingPrice * weightPV; overallRow.couponNet += row.couponNet * weightPV; overallRow.nextCouponDays += row.nextCouponDays; overallRow.buyingWAP += row.buyingWAP * weightPV; overallRow.sellingWAP += row.sellingWAP * weightPV;
        }
      }
      if (totalFaceValueBuys > 0) overallRow.buyingPrice = newData.filter(r => r.bondsHeld !== "Overall Portfolio").reduce((sum, row) => sum + row.buyingPrice * row.faceValueBuys, 0) / totalFaceValueBuys;
      if (totalFaceValueSales > 0) overallRow.sellingPrice = newData.filter(r => r.bondsHeld !== "Overall Portfolio").reduce((sum, row) => sum + row.sellingPrice * row.faceValueSales, 0) / totalFaceValueSales;
      const totalPL = overallRow.realizedPL + overallRow.unrealizedPL;
      if (overallRow.portfolioValue > 0) overallRow.totalReturn = parseFloat((totalPL / overallRow.portfolioValue * 100).toFixed(4));
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
      // ... reset overallRow values ...
      overallRow.faceValueBal = 0; overallRow.realizedPL = 0; overallRow.unrealizedPL = 0; overallRow.portfolioValue = 0; overallRow.maturityYears = 0; overallRow.coupon = 0; overallRow.duration = 0; overallRow.mDuration = 0; overallRow.dv01 = 0; overallRow.expectedShortfall = 0; overallRow.spotYTM = 0; overallRow.dirtyPrice = 0; overallRow.closingPrice = 0; overallRow.couponNet = 0; overallRow.nextCouponDays = 0; overallRow.buyingWAP = 0; overallRow.sellingWAP = 0; overallRow.buyingPrice = 0; overallRow.sellingPrice = 0;
      let totalPortfolioValue = 0; let totalFaceValueBuys = 0; let totalFaceValueSales = 0;
      for (const row of newData) {
        if (row.bondsHeld === "Overall Portfolio") continue;
        overallRow.faceValueBal += row.faceValueBal; overallRow.realizedPL += row.realizedPL; overallRow.unrealizedPL += row.unrealizedPL; overallRow.portfolioValue += row.portfolioValue; totalPortfolioValue += row.portfolioValue; totalFaceValueBuys += row.faceValueBuys; totalFaceValueSales += row.faceValueSales;
      }
      if (totalPortfolioValue > 0) {
        for (const row of newData) {
          if (row.bondsHeld === "Overall Portfolio") continue;
          const weightPV = row.portfolioValue / totalPortfolioValue; overallRow.maturityYears += row.maturityYears * weightPV; overallRow.coupon += row.coupon * weightPV; overallRow.duration += row.duration * weightPV; overallRow.mDuration += row.mDuration * weightPV; overallRow.dv01 += row.dv01 * weightPV; overallRow.expectedShortfall += row.expectedShortfall * weightPV; overallRow.spotYTM += row.spotYTM * weightPV; overallRow.dirtyPrice += row.dirtyPrice * weightPV; overallRow.closingPrice += row.closingPrice * weightPV; overallRow.couponNet += row.couponNet * weightPV; overallRow.nextCouponDays += row.nextCouponDays; overallRow.buyingWAP += row.buyingWAP * weightPV; overallRow.sellingWAP += row.sellingWAP * weightPV;
        }
      }
      if (totalFaceValueBuys > 0) overallRow.buyingPrice = newData.filter(r => r.bondsHeld !== "Overall Portfolio").reduce((sum, row) => sum + row.buyingPrice * row.faceValueBuys, 0) / totalFaceValueBuys;
      if (totalFaceValueSales > 0) overallRow.sellingPrice = newData.filter(r => r.bondsHeld !== "Overall Portfolio").reduce((sum, row) => sum + row.sellingPrice * row.faceValueSales, 0) / totalFaceValueSales;
      const totalPL = overallRow.realizedPL + overallRow.unrealizedPL;
      if (overallRow.portfolioValue > 0) overallRow.totalReturn = parseFloat((totalPL / overallRow.portfolioValue * 100).toFixed(4));
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

import { useStatsTable, useUserPortfolios, usePortfolioMutations } from "@/hooks/use-portfolio-data"

export function PortfolioScorecard({ userDetails }: { userDetails: UserData }) {
  const [value, setValue] = useState<string[]>([])
  const [selectedBondsToAdd, setSelectedBondsToAdd] = useState<{issueNo: string, id?: number}[]>([])
  const [data, setData] = useState<PortfolioEntry[]>([])
  const [sectionVisibility, setSectionVisibility] = useState<SectionVisibility>({
    notepad: true, profitLoss: true, scorecard: true,
  })
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    bondIssueNo: true, bondValuationMetrics: false, riskBudgetingIndicators: false
  });
  const [portfolioName, setPortfolioName] = useState("Create New Portfolio")
  const [portfolioDate, setPortfolioDate] = useState(formatDate(new Date()))
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null)
  const [isNewPortfolioDialogOpen, setIsNewPortfolioDialogOpen] = useState(false)
  const [newPortfolioData, setNewPortfolioData] = useState({ portfolio_name: '', value_date: new Date().toISOString().split('T')[0], description: '', })
  const { toast } = useToast()
  const selectedPortfolioIdRef = useRef<number | null>(null)
  
  // Use the new hooks
  const { data: availableBonds = [], isLoading: isLoadingBonds } = useStatsTable();
  const { data: portfolios = [], isLoading: isLoadingPortfolios, refetch: refetchPortfolios } = useUserPortfolios(userDetails?.email);
  const { createPortfolio, isCreating, updatePortfolio, isUpdating } = usePortfolioMutations(userDetails?.email);

  const loading = isLoadingBonds || isLoadingPortfolios || isCreating || isUpdating;

  useEffect(() => {
    if (portfolios.length > 0 && !selectedPortfolio) {
      const p = portfolios[0];
      setSelectedPortfolio(p);
      setPortfolioName(p.Name);
      setPortfolioDate(formatDate(p.ValueDate));
      selectedPortfolioIdRef.current = p.Id;
      
      const mappedBonds: PortfolioEntry[] = p.bonds.map((bond: PortfolioBond) => {
        const bondData = availableBonds.find(b => b.Id === bond.BondId);
        return {
          id: bond.BondId.toString(), id_: bond.Id_, bondId: bond.BondId, type: bond.Type as "HFS" | "HTM" | "AFS", bondsHeld: bond.BondIssueNo, buyingDate: formatDate(bond.BuyingDate), buyingPrice: Number(bond.BuyingPrice), buyingWAP: Number(bond.BuyingWAP), faceValueBuys: Number(bond.FaceValueBuys), sellingDate: bond.SellingDate ? formatDate(bond.SellingDate) : '', sellingPrice: bond.SellingPrice ? Number(bond.SellingPrice) : 0, sellingWAP: bond.SellingWAP ? Number(bond.SellingWAP) : 0, faceValueSales: bond.FaceValueSales ? Number(bond.FaceValueSales) : 0, faceValueBal: Number(bond.FaceValueBAL), closingPrice: Number(bond.ClosingPrice), couponNet: Number(bond.CouponNET), nextCouponDays: Number(bond.NextCpnDays), realizedPL: Number(bond.RealizedPNL), unrealizedPL: Number(bond.UnrealizedPNL), totalReturn: Number(bond.OneYrTotalReturn), maturityYears: bondData ? bondData.DtmYrs : 0, coupon: bondData ? bondData.Coupon : 0, duration: bondData ? bondData.Duration : 0, mDuration: bondData ? bondData.MDuration : 0, dv01: bondData ? bondData.Dv01 : 0, expectedShortfall: bondData ? bondData.ExpectedShortfall : 0, spotYTM: bondData ? bondData.SpotYield : 0, dirtyPrice: bondData ? bondData.DirtyPrice : 0, portfolioValue: Number(bond.PortfolioValue)
        };
      });
      setData(recalculatePortfolio(mappedBonds, availableBonds, formatDate(p.ValueDate)));
    }
  }, [portfolios, availableBonds, selectedPortfolio]);

  const handleBondSelect = (bondIssueNo: string, specificBondId?: number) => {
    let selectedBond: BondStats | undefined;
    if (specificBondId) selectedBond = availableBonds.find(bond => bond.Id === specificBondId);
    if (!selectedBond) { const matchingBonds = availableBonds.filter(bond => bond.BondIssueNo === bondIssueNo); selectedBond = matchingBonds[0]; }
    if (selectedBond) {
      const newEntry = generateDefaultValues(selectedBond);
      newEntry.bondsHeld = selectedBond.BondIssueNo;
      setData(prevData => { const updatedData = [...prevData, newEntry]; return recalculatePortfolio(updatedData, availableBonds, portfolioDate); });
    }
  };

  const mapBondToStats = (bond: Record<string, unknown>): BondStats => {
    return {
      Id: Number(bond.Id) || 0, Otr: String(bond.Otr || ""), Id_: Number(bond.Id_) || 0, Filter1: Number(bond.Filter1) || 0, Filter2: Number(bond.Filter2) || 0, BondIssueNo: String(bond.BondIssueNo || ""), IssueDate: String(bond.IssueDate || ""), MaturityDate: String(bond.MaturityDate || ""), ValueDate: String(bond.ValueDate || ""), QuotedYield: String(bond.QuotedYield || ""), SpotYield: Number(bond.SpotYield) || 0, DirtyPrice: Number(bond.DirtyPrice) || 0, Coupon: Number(bond.Coupon) || 0, NextCpnDays: Number(bond.NextCpnDays) || 0, DtmYrs: Number(bond.DtmYrs) || 0, Dtc: Number(bond.Dtc) || 0, Duration: Number(bond.Duration) || 0, MDuration: Number(bond.MDuration) || 0, Convexity: Number(bond.Convexity) || 0, ExpectedReturn: Number(bond.ExpectedReturn) || 0, ExpectedShortfall: Number(bond.ExpectedShortfall) || 0, Dv01: Number(bond.Dv01) || 0, Last91Days: Number(bond.Last91Days) || 0, Last364Days: Number(bond.Last364Days) || 0, LqdRank: String(bond.LqdRank || ""), Spread: Number(bond.Spread) || 0, CreditRiskPremium: bond.CreditRiskPremium ? Number(bond.CreditRiskPremium) : null, MdRank: bond.MdRank ? Number(bond.MdRank) : null, ErRank: bond.ErRank ? Number(bond.ErRank) : null, Basis: Number(bond.Basis) || 0, DayCount: Number(bond.DayCount) || 364
    };
  };

  const updateData = (rowIndex: number, columnId: string, value: string) => {
    setData(oldData => {
      const newData = JSON.parse(JSON.stringify(oldData));
      newData[rowIndex][columnId] = value;
      if (['buyingPrice', 'sellingPrice', 'faceValueBuys', 'faceValueSales'].includes(columnId)) newData[rowIndex][columnId] = parseFloat(value) || 0;
      if (columnId === 'buyingPrice' && newData[rowIndex].type === 'HTM') newData[rowIndex].dirtyPrice = parseFloat(value) || 0;
      if (columnId === 'type') {
        if (value === 'HTM') newData[rowIndex].dirtyPrice = newData[rowIndex].buyingPrice;
        else { const bondIssueNo = newData[rowIndex].bondsHeld; const bondData = availableBonds.find(bond => bond.BondIssueNo === bondIssueNo); if (bondData) newData[rowIndex].dirtyPrice = bondData.DirtyPrice; }
      }
      const recalculatedData = recalculateRow(rowIndex, newData, availableBonds, portfolioDate);
      return recalculatePortfolio(recalculatedData, availableBonds, portfolioDate);
    });
  };

  const handleRemoveEntry = (id: string) => { setData(prev => { const filteredData = prev.filter(item => item.id !== id); return recalculatePortfolio(filteredData, availableBonds, portfolioDate); }); };
  const handlePortfolioDateChange = (newDate: string) => { setPortfolioDate(newDate); setData(prev => recalculatePortfolio(prev, availableBonds, newDate)); };

  const calculateTotals = () => {
    const overallEntry = data.find(entry => entry.bondsHeld === "Overall Portfolio");
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
        buyingPrice: overallEntry.buyingPrice,
        sellingPrice: overallEntry.sellingPrice,
        faceValueBuys: overallEntry.faceValueBuys,
        faceValueSales: overallEntry.faceValueSales,
      };
    }
    return data.reduce((acc, row) => { 
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
        buyingPrice: acc.buyingPrice + (row.buyingPrice || 0),
        sellingPrice: acc.sellingPrice + (row.sellingPrice || 0),
        faceValueBuys: acc.faceValueBuys + (row.faceValueBuys || 0),
        faceValueSales: acc.faceValueSales + (row.faceValueSales || 0),
      }; 
    }, { 
      faceValueBal: 0, realizedPL: 0, unrealizedPL: 0, totalReturn: 0, portfolioValue: 0, 
      maturityYears: 0, coupon: 0, duration: 0, mDuration: 0, dv01: 0, expectedShortfall: 0, 
      spotYTM: 0, dirtyPrice: 0, buyingPrice: 0, sellingPrice: 0, faceValueBuys: 0, faceValueSales: 0 
    });
  };

  const handleCreatePortfolio = async () => {
    try {
      if (!userDetails?.email) { toast({ title: "Error", description: "User email not found" }); return; }
      if (!newPortfolioData.portfolio_name) { toast({ title: "Error", description: "Portfolio name is required" }); return; }
      if (!newPortfolioData.value_date) { toast({ title: "Error", description: "Value date is required" }); return; }
      if (!newPortfolioData.description) { toast({ title: "Error", description: "Description is required" }); return; }
      
      const portfolioBondsFormatted = data.filter(bond => bond.bondsHeld !== "Overall Portfolio").map(bond => ({ bond_id: bond.bondId, type: bond.type, bond_issue_no: bond.bondsHeld, buying_date: bond.buyingDate, buying_price: bond.buyingPrice, buying_wap: bond.buyingWAP, face_value_buys: bond.faceValueBuys, selling_date: bond.sellingDate || null, selling_price: bond.sellingPrice || null, selling_wap: bond.sellingWAP || null, face_value_sales: bond.faceValueSales || null, face_value_bal: bond.faceValueBal, closing_price: bond.closingPrice, coupon_net: bond.couponNet, next_cpn_days: bond.nextCouponDays.toString(), realized_pnl: bond.realizedPL.toString(), unrealized_pnl: bond.unrealizedPL.toString(), one_yr_total_return: bond.totalReturn, portfolio_value: bond.portfolioValue.toString() }));
      const portfolioData = { portfolio_name: newPortfolioData.portfolio_name, value_date: newPortfolioData.value_date, description: newPortfolioData.description, user_email: userDetails.email, bonds: portfolioBondsFormatted };
      const response = await createPortfolio(portfolioData);
      if (response?.success) { toast({ title: "Success", description: "Portfolio created successfully" }); setData([]); setNewPortfolioData({ portfolio_name: "", value_date: new Date().toISOString().split('T')[0], description: "" }); setIsNewPortfolioDialogOpen(false); refetchPortfolios(); } else { toast({ title: "Error", description: response?.message || "Failed to create portfolio" }); }
    } catch { toast({ title: "Error", description: "An error occurred while creating the portfolio" }); }
  };

  const handleSavePortfolio = async () => {
    try {
      if (!userDetails?.email || !selectedPortfolio) { toast({ title: "Error", description: "Portfolio not created or selected first." }); return; }
      if (data.length === 0) { toast({ title: "Error", description: "Please add at least one bond to the portfolio" }); return; }
      
      const portfolioBonds = data.filter(bond => bond.bondsHeld !== "Overall Portfolio").map(bond => ({ bond_id: bond.bondId, type: bond.type, bond_issue_no: bond.bondsHeld, buying_date: bond.buyingDate, buying_price: bond.buyingPrice, buying_wap: bond.buyingWAP, face_value_buys: bond.faceValueBuys, selling_date: bond.sellingDate || null, selling_price: bond.sellingPrice || null, selling_wap: bond.sellingWAP || null, face_value_sales: bond.faceValueSales || null, face_value_bal: bond.faceValueBal, closing_price: bond.closingPrice, coupon_net: bond.couponNet, next_cpn_days: bond.nextCouponDays.toString(), realized_pnl: bond.realizedPL.toString(), unrealized_pnl: bond.unrealizedPL.toString(), one_yr_total_return: bond.totalReturn, portfolio_value: bond.portfolioValue.toString() }));
      const portfolioData = { portfolio_id: selectedPortfolio.Id, portfolio_name: portfolioName, value_date: portfolioDate, description: selectedPortfolio.Description, user_email: userDetails.email, bonds: portfolioBonds };
      const response = await updatePortfolio(portfolioData);
      if (response?.success) { toast({ title: "Success", description: "Portfolio updated successfully" }); refetchPortfolios(); } else { toast({ title: "Error", description: response?.message || "Failed to update portfolio" }); }
    } catch { toast({ title: "Error", description: "An error occurred while updating the portfolio" }); }
  };

  return (
    <div className="space-y-6 w-full max-w-[98vw] mx-auto bg-white p-4 rounded-xl shadow-sm border border-neutral-200 text-black">
      {/* Header & Controls */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-black tracking-tight uppercase">Portfolio Assistant</h2>
            <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest">Real-time Valuation & Risk Management</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-neutral-50 p-1 rounded-xl border border-neutral-200">
              <Select 
                value={selectedPortfolio?.Id.toString()} 
                onValueChange={(val) => { 
                  const selected = portfolios.find((p: Portfolio) => p.Id.toString() === val); 
                  if (selected) { 
                    selectedPortfolioIdRef.current = selected.Id; 
                    setSelectedPortfolio(selected); 
                    setPortfolioName(selected.Name); 
                    setPortfolioDate(formatDate(selected.ValueDate)); 
                    const mappedBonds: PortfolioEntry[] = selected.bonds.map((bond: PortfolioBond) => {
                      const bondData = availableBonds.find(b => b.Id === bond.BondId);
                      return { id: bond.BondId.toString(), id_: bond.Id_, bondId: bond.BondId, type: bond.Type as "HFS" | "HTM" | "AFS", bondsHeld: bond.BondIssueNo, buyingDate: formatDate(bond.BuyingDate), buyingPrice: Number(bond.BuyingPrice), buyingWAP: Number(bond.BuyingWAP), faceValueBuys: Number(bond.FaceValueBuys), sellingDate: bond.SellingDate ? formatDate(bond.SellingDate) : '', sellingPrice: bond.SellingPrice ? Number(bond.SellingPrice) : 0, sellingWAP: bond.SellingWAP ? Number(bond.SellingWAP) : 0, faceValueSales: bond.FaceValueSales ? Number(bond.FaceValueSales) : 0, faceValueBal: Number(bond.FaceValueBAL), closingPrice: Number(bond.ClosingPrice), couponNet: Number(bond.CouponNET), nextCouponDays: Number(bond.NextCpnDays), realizedPL: Number(bond.RealizedPNL), unrealizedPL: Number(bond.UnrealizedPNL), totalReturn: Number(bond.OneYrTotalReturn), maturityYears: bondData ? bondData.DtmYrs : 0, coupon: bondData ? bondData.Coupon : 0, duration: bondData ? bondData.Duration : 0, mDuration: bondData ? bondData.MDuration : 0, dv01: bondData ? bondData.Dv01 : 0, expectedShortfall: bondData ? bondData.ExpectedShortfall : 0, spotYTM: bondData ? bondData.SpotYield : 0, dirtyPrice: bondData ? bondData.DirtyPrice : 0, portfolioValue: Number(bond.PortfolioValue) };
                    });
                    setData(recalculatePortfolio(mappedBonds, availableBonds, formatDate(selected.ValueDate)));
                  } 
                }}
              >
                <SelectTrigger className="w-[240px] border-none bg-transparent text-black font-black text-[10px] uppercase tracking-widest focus:ring-0">
                  <SelectValue placeholder="Select Portfolio" />
                </SelectTrigger>
                <SelectContent className="bg-white border-neutral-200">
                  {portfolios.map((p: Portfolio) => <SelectItem key={p.Id} value={p.Id.toString()} className="text-[10px] font-bold uppercase tracking-widest text-black focus:bg-neutral-100">{p.Name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <Dialog open={isNewPortfolioDialogOpen} onOpenChange={setIsNewPortfolioDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-black text-white hover:bg-neutral-800 font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl shadow-lg"><Plus className="mr-2 h-4 w-4" /> New</Button>
              </DialogTrigger>
              <DialogContent className="bg-white border-neutral-200 text-black rounded-[32px] p-8 max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black text-black uppercase tracking-tight">Create Portfolio</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Portfolio Name</Label>
                    <Input id="name" value={newPortfolioData.portfolio_name} onChange={(e) => setNewPortfolioData({ ...newPortfolioData, portfolio_name: e.target.value })} className="h-12 border-neutral-200 focus:border-black text-black font-bold rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Value Date</Label>
                    <Input id="date" type="date" value={newPortfolioData.value_date} onChange={(e) => setNewPortfolioData({ ...newPortfolioData, value_date: e.target.value })} className="h-12 border-neutral-200 focus:border-black text-black font-bold rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="desc" className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Description</Label>
                    <Textarea id="desc" value={newPortfolioData.description} onChange={(e) => setNewPortfolioData({ ...newPortfolioData, description: e.target.value })} className="border-neutral-200 focus:border-black text-black font-bold rounded-xl min-h-[100px]" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="ghost" onClick={() => setIsNewPortfolioDialogOpen(false)} className="text-neutral-400 hover:text-black font-black uppercase tracking-widest text-[10px]">Cancel</Button>
                  <Button onClick={handleCreatePortfolio} className="bg-black text-white hover:bg-neutral-800 font-black uppercase tracking-widest text-[10px] h-12 px-10 rounded-xl shadow-xl">Initialize</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-neutral-50/50 rounded-2xl border border-neutral-100">
          <div className="space-y-2">
            <Label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Active Reference</Label>
            <Input value={portfolioName} onChange={(e) => setPortfolioName(e.target.value)} className="h-11 bg-white border-neutral-200 focus:border-black text-black font-bold rounded-xl shadow-sm" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Effective Date</Label>
            <Input type="date" value={portfolioDate} onChange={(e) => handlePortfolioDateChange(e.target.value)} className="h-11 bg-white border-neutral-200 focus:border-black text-black font-bold rounded-xl shadow-sm" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Asset Acquisition</Label>
            <Select onValueChange={(val) => handleBondSelect(val.split('|')[0], parseInt(val.split('|')[1]))}>
              <SelectTrigger className="h-11 bg-white border-neutral-200 text-black font-bold rounded-xl shadow-sm focus:ring-black">
                <SelectValue placeholder="Add Bond to Portfolio" />
              </SelectTrigger>
              <SelectContent className="bg-white border-neutral-200 max-h-[400px]">
                {availableBonds.map(bond => (
                  <SelectItem key={bond.Id} value={`${bond.BondIssueNo}|${bond.Id}`} className="text-black focus:bg-neutral-100 py-3">
                    <div className="flex flex-col">
                      <span className="font-black text-xs uppercase tracking-tight">{bond.BondIssueNo}</span>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">Yield: {bond.SpotYield}% • Dirty Price: {bond.DirtyPrice}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
            <Button variant="ghost" size="sm" onClick={() => setSectionVisibility(prev => ({ ...prev, notepad: !prev.notepad }))} className={cn("px-4 font-black uppercase tracking-widest text-[9px] h-8 rounded-lg transition-all", sectionVisibility.notepad ? "bg-white text-black shadow-sm" : "text-neutral-400 hover:text-black")}>
              Notepad
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSectionVisibility(prev => ({ ...prev, profitLoss: !prev.profitLoss }))} className={cn("px-4 font-black uppercase tracking-widest text-[9px] h-8 rounded-lg transition-all", sectionVisibility.profitLoss ? "bg-white text-black shadow-sm" : "text-neutral-400 hover:text-black")}>
              P&L Matrix
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSectionVisibility(prev => ({ ...prev, scorecard: !prev.scorecard }))} className={cn("px-4 font-black uppercase tracking-widest text-[9px] h-8 rounded-lg transition-all", sectionVisibility.scorecard ? "bg-white text-black shadow-sm" : "text-neutral-400 hover:text-black")}>
              Analytics
            </Button>
          </div>
          <div className="ml-auto flex gap-3">
            <Button variant="outline" size="sm" onClick={async () => {
              if (selectedPortfolio) {
                const blob = await exportPortfolioToExcel(selectedPortfolio.Id);
                if (blob) {
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${portfolioName}_Report.xlsx`;
                  a.click();
                }
              }
            }} className="h-10 bg-white border-neutral-200 text-black hover:bg-neutral-50 font-black uppercase tracking-widest text-[9px] px-6 rounded-xl border-2">
              <FileDown className="mr-2 h-4 w-4" /> Export Spreadsheet
            </Button>
            <Button size="sm" onClick={handleSavePortfolio} disabled={loading} className="h-10 bg-black text-white hover:bg-neutral-800 font-black uppercase tracking-widest text-[10px] px-8 rounded-xl shadow-xl transition-all active:scale-95">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Commit Changes"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Table - Excel SpreadSheet UI */}
      <div className="relative rounded-[24px] border-2 border-neutral-100 overflow-hidden bg-white shadow-2xl mt-4">
        {loading && (
          <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-black opacity-20" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Syncing Portfolio Ledger...</p>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-transparent">
          <Table className="border-collapse">
            <TableHeader>
              <TableRow className="bg-black hover:bg-black border-none h-14">
                <TableHead className="w-[50px] border-r border-white/10 text-white font-black uppercase text-[9px] tracking-widest text-center">#</TableHead>
                {columnVisibility.bondIssueNo && <TableHead className="min-w-[160px] border-r border-white/10 text-white font-black uppercase text-[9px] tracking-widest px-6">Instrument</TableHead>}
                <TableHead className="min-w-[80px] border-r border-white/10 text-white font-black uppercase text-[9px] tracking-widest text-center px-4">Type</TableHead>
                
                {/* Excel Notepad Section */}
                {sectionVisibility.notepad && (
                  <>
                    <TableHead className="min-w-[130px] border-r border-white/10 text-neutral-400 font-black uppercase text-[8px] tracking-[0.2em] text-center bg-neutral-900">Buy Date</TableHead>
                    <TableHead className="min-w-[110px] border-r border-white/10 text-neutral-400 font-black uppercase text-[8px] tracking-[0.2em] text-right px-4 bg-neutral-900">Buy Price</TableHead>
                    <TableHead className="min-w-[110px] border-r border-white/10 text-neutral-400 font-black uppercase text-[8px] tracking-[0.2em] text-right px-4 bg-neutral-900">Buy WAP</TableHead>
                    <TableHead className="min-w-[130px] border-r border-white/10 text-neutral-400 font-black uppercase text-[8px] tracking-[0.2em] text-right px-4 bg-neutral-900">Face Value (B)</TableHead>
                    <TableHead className="min-w-[130px] border-r border-white/10 text-neutral-400 font-black uppercase text-[8px] tracking-[0.2em] text-center bg-neutral-900">Sell Date</TableHead>
                    <TableHead className="min-w-[110px] border-r border-white/10 text-neutral-400 font-black uppercase text-[8px] tracking-[0.2em] text-right px-4 bg-neutral-900">Sell Price</TableHead>
                    <TableHead className="min-w-[110px] border-r border-white/10 text-neutral-400 font-black uppercase text-[8px] tracking-[0.2em] text-right px-4 bg-neutral-900">Sell WAP</TableHead>
                    <TableHead className="min-w-[130px] border-r border-white/10 text-neutral-400 font-black uppercase text-[8px] tracking-[0.2em] text-right px-4 bg-neutral-900">Face Value (S)</TableHead>
                    <TableHead className="min-w-[140px] border-r border-white/10 text-white font-black uppercase text-[9px] tracking-widest text-right px-6 bg-neutral-800">Balance</TableHead>
                  </>
                )}

                {/* Profit Matrix Section */}
                {sectionVisibility.profitLoss && (
                  <>
                    <TableHead className="min-w-[110px] border-r border-white/10 text-neutral-300 font-black uppercase text-[8px] tracking-[0.2em] text-right px-4">Closing</TableHead>
                    <TableHead className="min-w-[110px] border-r border-white/10 text-neutral-300 font-black uppercase text-[8px] tracking-[0.2em] text-right px-4">Net Cpn</TableHead>
                    <TableHead className="min-w-[90px] border-r border-white/10 text-neutral-300 font-black uppercase text-[8px] tracking-[0.2em] text-center px-4">DTC</TableHead>
                    <TableHead className="min-w-[140px] border-r border-white/10 text-white font-black uppercase text-[9px] tracking-widest text-right px-6">Realized</TableHead>
                    <TableHead className="min-w-[140px] border-r border-white/10 text-white font-black uppercase text-[9px] tracking-widest text-right px-6">Unrealized</TableHead>
                    <TableHead className="min-w-[120px] border-r border-white/10 text-white font-black uppercase text-[9px] tracking-widest text-right px-6 bg-neutral-800">Total Return</TableHead>
                  </>
                )}

                {/* Scorecard / Analytics Section */}
                {sectionVisibility.scorecard && (
                  <>
                    <TableHead className="min-w-[150px] border-none text-white font-black uppercase text-[9px] tracking-widest text-right px-8 bg-neutral-800">Position Value</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => {
                const isOverall = row.bondsHeld === "Overall Portfolio";
                return (
                  <TableRow 
                    key={row.id} 
                    className={cn(
                      "group border-b border-neutral-100 transition-colors",
                      isOverall ? "bg-black text-white hover:bg-black font-black" : "hover:bg-neutral-50/50"
                    )}
                  >
                    <TableCell className="border-r border-neutral-100 p-0 text-center">
                      {!isOverall ? (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleRemoveEntry(row.id)} 
                          className="h-10 w-10 text-neutral-300 hover:text-red-600 hover:bg-red-50 transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      ) : (
                        <div className="h-10 flex items-center justify-center">
                          <Info className="h-4 w-4 text-neutral-500" />
                        </div>
                      )}
                    </TableCell>
                    
                    {columnVisibility.bondIssueNo && (
                      <TableCell className={cn(
                        "border-r border-neutral-100 px-6 py-4 text-xs font-black uppercase tracking-tight",
                        isOverall ? "text-white" : "text-black"
                      )}>
                        {row.bondsHeld}
                      </TableCell>
                    )}

                    <TableCell className="border-r border-neutral-100 px-4">
                      {!isOverall ? (
                        <Select value={row.type} onValueChange={(val) => updateData(index, "type", val)}>
                          <SelectTrigger className="h-8 w-full border-neutral-200 bg-white text-black text-[9px] font-black uppercase tracking-widest focus:ring-black rounded-lg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-neutral-200">
                            <SelectItem value="HFS" className="text-[9px] font-black">HFS</SelectItem>
                            <SelectItem value="HTM" className="text-[9px] font-black">HTM</SelectItem>
                            <SelectItem value="AFS" className="text-[9px] font-black">AFS</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="text-[9px] font-black text-center text-neutral-500 tracking-[0.3em]">AGG</div>
                      )}
                    </TableCell>

                    {/* Notepad Cells */}
                    {sectionVisibility.notepad && (
                      <>
                        <TableCell className="border-r border-neutral-100 px-3">
                          {!isOverall && <Input type="date" value={row.buyingDate} onChange={(e) => updateData(index, "buyingDate", e.target.value)} className="h-8 w-full border-transparent bg-transparent text-[10px] font-bold text-center focus:border-black focus:bg-white rounded-md transition-all" />}
                        </TableCell>
                        <TableCell className="border-r border-neutral-100 px-3">
                          {!isOverall ? (
                            <Input type="number" value={row.buyingPrice} onChange={(e) => updateData(index, "buyingPrice", e.target.value)} className="h-8 w-full border-transparent bg-transparent text-[11px] font-mono tabular-nums text-right font-bold focus:border-black focus:bg-white rounded-md transition-all" />
                          ) : (
                            <div className="text-right font-mono text-[11px] px-2">{calculateTotals().buyingPrice?.toFixed(4)}</div>
                          )}
                        </TableCell>
                        <TableCell className="border-r border-neutral-100 px-4 text-right font-mono text-[11px] font-bold text-neutral-400">
                          {row.buyingWAP?.toFixed(4)}
                        </TableCell>
                        <TableCell className="border-r border-neutral-100 px-3">
                          {!isOverall ? (
                            <Input type="number" value={row.faceValueBuys} onChange={(e) => updateData(index, "faceValueBuys", e.target.value)} className="h-8 w-full border-transparent bg-transparent text-[11px] font-mono tabular-nums text-right font-bold focus:border-black focus:bg-white rounded-md transition-all" />
                          ) : (
                            <div className="text-right font-mono text-[11px] px-2">{Number(calculateTotals().faceValueBuys).toLocaleString()}</div>
                          )}
                        </TableCell>
                        <TableCell className="border-r border-neutral-100 px-3">
                          {!isOverall && <Input type="date" value={row.sellingDate} onChange={(e) => updateData(index, "sellingDate", e.target.value)} className="h-8 w-full border-transparent bg-transparent text-[10px] font-bold text-center focus:border-black focus:bg-white rounded-md transition-all" />}
                        </TableCell>
                        <TableCell className="border-r border-neutral-100 px-3">
                          {!isOverall ? (
                            <Input type="number" value={row.sellingPrice} onChange={(e) => updateData(index, "sellingPrice", e.target.value)} className="h-8 w-full border-transparent bg-transparent text-[11px] font-mono tabular-nums text-right font-bold focus:border-black focus:bg-white rounded-md transition-all" />
                          ) : (
                            <div className="text-right font-mono text-[11px] px-2">{calculateTotals().sellingPrice?.toFixed(4)}</div>
                          )}
                        </TableCell>
                        <TableCell className="border-r border-neutral-100 px-4 text-right font-mono text-[11px] font-bold text-neutral-400">
                          {row.sellingWAP?.toFixed(4)}
                        </TableCell>
                        <TableCell className="border-r border-neutral-100 px-3">
                          {!isOverall ? (
                            <Input type="number" value={row.faceValueSales} onChange={(e) => updateData(index, "faceValueSales", e.target.value)} className="h-8 w-full border-transparent bg-transparent text-[11px] font-mono tabular-nums text-right font-bold focus:border-black focus:bg-white rounded-md transition-all" />
                          ) : (
                            <div className="text-right font-mono text-[11px] px-2">{Number(calculateTotals().faceValueSales).toLocaleString()}</div>
                          )}
                        </TableCell>
                        <TableCell className={cn(
                          "border-r border-neutral-100 px-6 text-right font-mono text-xs font-black",
                          isOverall ? "text-white" : "text-black bg-neutral-50/50"
                        )}>
                          {row.faceValueBal?.toLocaleString()}
                        </TableCell>
                      </>
                    )}

                    {/* P&L Matrix Cells */}
                    {sectionVisibility.profitLoss && (
                      <>
                        <TableCell className="border-r border-neutral-100 px-4 text-right font-mono text-[11px] font-bold text-neutral-500">{row.closingPrice?.toFixed(4)}</TableCell>
                        <TableCell className="border-r border-neutral-100 px-4 text-right font-mono text-[11px] font-bold text-neutral-500">{row.couponNet?.toFixed(4)}</TableCell>
                        <TableCell className="border-r border-neutral-100 px-4 text-center font-mono text-[11px] font-bold text-neutral-500">{row.nextCouponDays}</TableCell>
                        <TableCell className={cn(
                          "border-r border-neutral-100 px-6 text-right font-mono text-xs font-black",
                          row.realizedPL < 0 ? "text-red-600" : isOverall ? "text-white" : "text-black"
                        )}>
                          {Math.round(row.realizedPL).toLocaleString()}
                        </TableCell>
                        <TableCell className={cn(
                          "border-r border-neutral-100 px-6 text-right font-mono text-xs font-black",
                          row.unrealizedPL < 0 ? "text-red-600" : isOverall ? "text-white" : "text-black"
                        )}>
                          {Math.round(row.unrealizedPL).toLocaleString()}
                        </TableCell>
                        <TableCell className={cn(
                          "border-r border-neutral-100 px-6 text-right font-mono text-xs font-black",
                          isOverall ? "text-white" : "text-black bg-neutral-50/50"
                        )}>
                          {row.totalReturn?.toFixed(4)}%
                        </TableCell>
                      </>
                    )}

                    {/* Scorecard Position Value */}
                    {sectionVisibility.scorecard && (
                      <TableCell className={cn(
                        "px-8 text-right font-mono text-sm font-black tracking-tighter",
                        isOverall ? "text-white bg-neutral-900" : "text-black"
                      )}>
                        {Math.round(row.portfolioValue).toLocaleString()}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {!loading && data.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-neutral-50 rounded-[32px] border-2 border-dashed border-neutral-200">
          <div className="p-6 bg-white rounded-full shadow-xl mb-6">
            <Plus className="h-10 w-10 text-neutral-300" />
          </div>
          <h3 className="text-xl font-black text-black tracking-tight">Empty Portfolio Ledger</h3>
          <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest mt-2">Initialize a new portfolio or select from reference</p>
          <Button onClick={() => setIsNewPortfolioDialogOpen(true)} className="mt-8 bg-black text-white px-10 h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl transition-all hover:scale-105 active:scale-95">
            Create First Portfolio
          </Button>
        </div>
      )}
    </div>
  )
}
