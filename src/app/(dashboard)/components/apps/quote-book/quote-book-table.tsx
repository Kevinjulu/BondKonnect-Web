'use client'

import { MoreHorizontal, Eye, Trash2,Power, PowerOff, Download,ChevronDown,ChevronUp, Plus, User, FileText, Loader2, Settings, Search, Filter, RefreshCw, Calendar, Clock, DollarSign, TrendingUp, ArrowUpDown, CheckCircle2, ExternalLink, BarChart3, PieChart, Info } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/app/hooks/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/app/components/ui/sheet"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { getQuotes, createTransaction, getViewingPartyQuotes, activateQuote, suspendQuote, sendToQuoteBook, getStatsTable, markTransactionStatus, getSecondaryMarketBonds, getPrimaryMarketBonds, getBondCalcDetails } from "@/app/lib/actions/api.actions"
import { ClientSelectionDialog } from "./client-selection-dialog"
import { Badge } from "@/app/components/ui/badge"
import { ScrollArea } from "@/app/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/app/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/components/ui/collapsible"
import React from "react"
import { cn } from "@/app/lib/utils"
import { Separator } from "@/app/components/ui/separator"

interface QuoteData {
  id: number;
  placement_no: string;
  bond_id: number;
  bond_issue_no: string;
  face_value: number;
  settlement_date: string;
  bid_price: number;
  bid: number;
  offer: number;
  offer_price: number;
  assigned_by: string;
  viewing_party: string | null;
  is_active: boolean;
  is_accepted: boolean;
  total_receivable: number;
  total_payable: number;
  other_levies: number;
  commission_nse: number;
  consideration: number;
  BidYield?: number;
  OfferYield?: number;
  BidAmount?: number;
  OfferAmount?: number;
  IndicativeLower?: number;
  IndicativeHigher?: number;
}

interface Transaction {
  id: number;
  transaction_no: string;
  bid_amount: number;
  offer_amount: number;
  bid_price: number;
  offer_price: number;
  bid_yield: number;
  offer_yield: number;
  is_pending: boolean;
  is_accepted: boolean;
  is_rejected: boolean;
  is_delegated: boolean;
  created_on: string;
}

interface EditableQuoteData extends QuoteData {
  isEditing?: boolean;
  IsBid?: boolean;
  IsOffer?: boolean;
  PlacementNo?: string | null;
  isExpanded?: boolean;
  QuoteType?: string;
  transactions?: Transaction[];
  bid_yield?: number;
  offer_yield?: number;
}

interface Bond {
  Id: string | number;
  BondIssueNo: string;
  FirstCallDate?: string;
  SecondCallDate?: string;
  ParCall1?: number;
  ParCall2?: number;
  PreviousCoupon?: string;
  NextCoupon?: string;
  CouponPeriod?: number;
  MaturityDate?: string;
  IssueDate?: string;
  spotYTM?: number;
  Spread?: number;
  Coupon: number;
  DtmYrs?: number;
  Duration: number;
  MDuration: number;
  Dv01: number;
  DirtyPrice: number;
  SpotYield: number;
}

interface SecondaryMarketBond {
  Id: number;
  BondIssueNo: string;
  IssueDate: Date;
  MaturityDate: Date;
  Coupon: number;
  SpotYield: number;
  Spread: number;
  DirtyPrice: number;
  DtmYrs: number;
  Duration: number;
  MDuration: number;
  Basis: number;
}

interface PrimaryMarketBond {
  Id: number;
  BondIssueNo: string;
  IssueDate: Date;
  MaturityDate: Date;
  FirstCallDate: Date | null;
  SecondCallDate: Date | null;
  ParCall1Percent: string | null;
  ParCall2Percent: string | null;
  DayCount: number;
  SpotRate: string;
  ParYield: string;
}

interface BondCalcDetails {
  IfbFiveYrs: number;
  PercentUnderTenYrs: number;
  DailyBasis: number;
}

interface PlaceQuoteState {
  marketType: 'secondary' | 'primary';
  selectedBond: string;
  quoteType: 'bid' | 'offer';
  bidYield: string;
  offerYield: string;
  bidAmount: string;
  offerAmount: string;
  settlementDate: string;
}

interface CounterBidState {
  transactionId: number;
  originalTransaction: Transaction;
  newBidYield: string;
  newOfferYield: string;
  newBidAmount: string;
  newOfferAmount: string;
}

// Add business days calculation function
const addBusinessDays = (startDate: Date, businessDays: number): Date => {
  const result = new Date(startDate);
  let remainingDays = businessDays;
  
  while (remainingDays > 0) {
    result.setDate(result.getDate() + 1);
    // Skip weekends (Saturday = 6, Sunday = 0)
    if (result.getDay() !== 0 && result.getDay() !== 6) {
      remainingDays--;
    }
  }
  
  return result;
};

// Get 3 business days from today as default settlement date
const getDefaultSettlementDate = (): string => {
  const threeBDaysFromNow = addBusinessDays(new Date(), 3);
  return threeBDaysFromNow.toISOString().split('T')[0];
};

// Helper functions for bond price calculation (matching BondCalc implementation)
const addDaysHelper = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

const daysBetweenHelper = (date1: Date, date2: Date): number => {
  const timeDiff = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

const calculatePreviousCouponHelper = (
  issueDate: Date,
  settlementDate: Date,
  dailyBasis: number
): Date | null => {
  if (dailyBasis === 364 || dailyBasis === 182) {
    const daysSinceIssue = daysBetweenHelper(issueDate, settlementDate);
    const couponPeriods = Math.floor(daysSinceIssue / 182);
    
    if (couponPeriods > 0) {
      return addDaysHelper(issueDate, couponPeriods * 182);
    }
    return issueDate;
  }
  
  const daysSinceIssue = daysBetweenHelper(issueDate, settlementDate);
  const couponPeriods = Math.floor(daysSinceIssue / (dailyBasis / 2));
  
  if (couponPeriods > 0) {
    return addDaysHelper(issueDate, couponPeriods * (dailyBasis / 2));
  }
  
  return issueDate;
}

const calculateNextCouponDateHelper = (
  issueDate: Date,
  settlementDate: Date,
  maturityDate: Date,
  dailyBasis: number,
  previousCoupon: Date | null
): Date | null => {
  if (settlementDate > maturityDate) {
    return maturityDate;
  }
  
  if (dailyBasis === 364 || dailyBasis === 182) {
    if (previousCoupon) {
      const nextCoupon = addDaysHelper(previousCoupon, 182);
      return nextCoupon > maturityDate ? maturityDate : nextCoupon;
    }
    const nextCoupon = addDaysHelper(issueDate, 182);
    return nextCoupon > maturityDate ? maturityDate : nextCoupon;
  }
  
  if (previousCoupon) {
    const nextCoupon = addDaysHelper(previousCoupon, dailyBasis / 2);
    return nextCoupon > maturityDate ? maturityDate : nextCoupon;
  }
  
  const nextCoupon = addDaysHelper(issueDate, dailyBasis / 2);
  return nextCoupon > maturityDate ? maturityDate : nextCoupon;
}

const calculateNextCouponDaysHelper = (
  settlementDate: Date,
  nextCouponDate: Date | null
): number => {
  if (!nextCouponDate) return 0;
  return daysBetweenHelper(settlementDate, nextCouponDate);
}

const calculateCouponsDueHelper = (
  settlementDate: Date,
  maturityDate: Date,
  dailyBasis: number
): number => {
  if (settlementDate > maturityDate) return 0;
  
  const remainingDays = daysBetweenHelper(settlementDate, maturityDate);
  const couponPeriod = dailyBasis === 364 ? 182 : dailyBasis / 2;
  
  return Math.ceil(remainingDays / couponPeriod);
}

// Main bond price calculation function (matching BondCalc implementation)
const calculateBondPriceHelper = (
  yieldTM: number,
  coupon: number,
  couponsDue: number,
  nextCouponDays: number,
  dailyBasis: number
): number => {
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

export default function QuoteBookTable({ userDetails }: { userDetails: UserData }) {
  const [selectedQuote, setSelectedQuote] = useState<EditableQuoteData | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [allQuotes, setAllQuotes] = useState<EditableQuoteData[]>([])
  const [userQuotes, setUserQuotes] = useState<EditableQuoteData[]>([])
  const [viewingPartyQuotes, setViewingPartyQuotes] = useState<EditableQuoteData[]>([])
  const [clientDialogOpen, setClientDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [delegatedQuotes, setDelegatedQuotes] = useState<EditableQuoteData[]>([])
  
  // Place Quote States
  const [isPlaceQuoteOpen, setIsPlaceQuoteOpen] = useState(false)
  const [placeQuoteState, setPlaceQuoteState] = useState<PlaceQuoteState>({
    marketType: 'secondary',
    selectedBond: '',
    quoteType: 'bid',
    bidYield: '',
    offerYield: '',
    bidAmount: '',
    offerAmount: '',
    settlementDate: getDefaultSettlementDate()
  })
  
  // Counter Bid States
  const [isCounterBidOpen, setIsCounterBidOpen] = useState(false)
  const [counterBidState, setCounterBidState] = useState<CounterBidState | null>(null)
  
  const [pendingQuoteData, setPendingQuoteData] = useState<any>(null)
  const [bonds, setBonds] = useState<Bond[]>([]);
  const [secondaryMarketBonds, setSecondaryMarketBonds] = useState<SecondaryMarketBond[]>([]);
  const [primaryMarketBonds, setPrimaryMarketBonds] = useState<PrimaryMarketBond[]>([]);
  const [bondCalcDetails, setBondCalcDetails] = useState<BondCalcDetails>({
    IfbFiveYrs: 0,
    PercentUnderTenYrs: 10,
    DailyBasis: 364
  });
  
  const [calculatedBidPrice, setCalculatedBidPrice] = useState<number>(0);
  const [calculatedOfferPrice, setCalculatedOfferPrice] = useState<number>(0);
  
  const { toast } = useToast()
  const rowsPerPage = 10



  const fetchBondData = useCallback(async () => {
    try {
      // Fetch bond calculation details
      const detailsResponse = await getBondCalcDetails();
      if (detailsResponse?.success && detailsResponse?.data) {
        setBondCalcDetails(detailsResponse.data);
      }

      // Fetch secondary market bonds
      const secondaryResponse = await getSecondaryMarketBonds();
      if (Array.isArray(secondaryResponse)) {
        setSecondaryMarketBonds(secondaryResponse);
      }

      // Fetch primary market bonds
      const primaryResponse = await getPrimaryMarketBonds();
      if (Array.isArray(primaryResponse)) {
        setPrimaryMarketBonds(primaryResponse);
      }
    } catch (error) {
      console.error("Error fetching bond data:", error);
    }
  }, []);

  const fetchBonds = useCallback(async () => {
    try {
      const response = await getStatsTable();
      if (response) {
        setBonds(response);
      }
    } catch (error) {
      console.error("Error fetching bonds:", error);
    }
  }, []);
  const formatQuote = useCallback((quote: any): EditableQuoteData => {
    // Find the bond for this quote to calculate indicative range
    const bond = bonds.find(b => b.BondIssueNo === quote.BondIssueNo);
    let indicativeLower = undefined;
    let indicativeHigher = undefined;
    
    if (bond) {
      const spotYTM = typeof bond.spotYTM === 'number' ? bond.spotYTM : 0;
      const spread = typeof bond.Spread === 'number' ? bond.Spread : 0;
      indicativeLower = Math.max(0, Math.round((spotYTM - spread) * 10000) / 100);
      indicativeHigher = Math.round((spotYTM + spread) * 10000) / 100;
    }
    
    return {
      id: Number(quote.Id),
      placement_no: quote.PlacementNo,
      bond_id: Number(quote.BondIssueNo),
      bond_issue_no: quote.BondIssueNo,
      face_value: Number(quote.FaceValue || 0),
      settlement_date: quote.SettlementDate,
      bid_price: Number(quote.BidPrice || 0),
      bid: Number(quote.BidYield || 0),
      offer: Number(quote.OfferYield || 0),
      offer_price: Number(quote.OfferPrice || 0),
      assigned_by: quote.AssignedBy?.toString() || '',
      viewing_party: quote.ViewingParty?.toString() || null,
      is_active: Boolean(quote.IsActive),
      is_accepted: Boolean(quote.IsAccepted),
      total_receivable: Number(quote.TotalReceivable || 0),
      total_payable: Number(quote.TotalPayable || 0),
      other_levies: Number(quote.OtherLevies || 0),
      commission_nse: Number(quote.CommissionNSE || 0),
      consideration: Number(quote.Consideration || 0),
      BidAmount: Number(quote.BidAmount || 0),
      OfferAmount: Number(quote.OfferAmount || 0),
      IndicativeLower: indicativeLower,
      IndicativeHigher: indicativeHigher,
      isEditing: false,
      IsBid: quote.IsBid || false,
      IsOffer: quote.IsOffer || false,
      PlacementNo: quote.PlacementNo || null,
      bid_yield: Number(quote.BidYield || 0),
      offer_yield: Number(quote.OfferYield || 0),
      QuoteType: quote.IsBid ? 'Bid' : 'Offer',
      transactions: quote.transactions || [],
    };
  }, [bonds]);
  const fetchQuotes = useCallback(async () => {
    setIsLoading(true);
    try {
      const quotesData = await getQuotes(userDetails.email);
      
      if (quotesData?.all_quotes) {
        // Format quotes inline to avoid circular dependency with formatQuote
        const formatQuoteInline = (quote: any): EditableQuoteData => {
          // Find the bond for this quote to calculate indicative range
          const bond = bonds.find(b => b.BondIssueNo === quote.BondIssueNo);
          let indicativeLower = undefined;
          let indicativeHigher = undefined;
          
          if (bond) {
            const spotYTM = typeof bond.spotYTM === 'number' ? bond.spotYTM : 0;
            const spread = typeof bond.Spread === 'number' ? bond.Spread : 0;
            indicativeLower = Math.max(0, Math.round((spotYTM - spread) * 10000) / 100);
            indicativeHigher = Math.round((spotYTM + spread) * 10000) / 100;
          }
          
          return {
            id: Number(quote.Id),
            placement_no: quote.PlacementNo,
            bond_id: Number(quote.BondIssueNo),
            bond_issue_no: quote.BondIssueNo,
            face_value: Number(quote.FaceValue || 0),
            settlement_date: quote.SettlementDate,
            bid_price: Number(quote.BidPrice || 0),
            bid: Number(quote.BidYield || 0),
            offer: Number(quote.OfferYield || 0),
            offer_price: Number(quote.OfferPrice || 0),
            assigned_by: quote.AssignedBy?.toString() || '',
            viewing_party: quote.ViewingParty?.toString() || null,
            is_active: Boolean(quote.IsActive),
            is_accepted: Boolean(quote.IsAccepted),
            total_receivable: Number(quote.TotalReceivable || 0),
            total_payable: Number(quote.TotalPayable || 0),
            other_levies: Number(quote.OtherLevies || 0),
            commission_nse: Number(quote.CommissionNSE || 0),
            consideration: Number(quote.Consideration || 0),
            BidAmount: Number(quote.BidAmount || 0),
            OfferAmount: Number(quote.OfferAmount || 0),
            IndicativeLower: indicativeLower,
            IndicativeHigher: indicativeHigher,
            isEditing: false,
            IsBid: quote.IsBid || false,
            IsOffer: quote.IsOffer || false,
            PlacementNo: quote.PlacementNo || null,
            bid_yield: Number(quote.BidYield || 0),
            offer_yield: Number(quote.OfferYield || 0),
            QuoteType: quote.IsBid ? 'Bid' : 'Offer',
            transactions: quote.transactions || [],
          };
        };

        const formattedAllQuotes = quotesData.all_quotes.map(formatQuoteInline);
        const formattedUserQuotes = quotesData.user_quotes?.map(formatQuoteInline) || [];
        const formattedViewingPartyQuotes = quotesData.viewing_party_quotes?.map(formatQuoteInline) || [];
        const formattedDelegatedQuotes = quotesData.delegated_quotes?.map(formatQuoteInline) || [];
        
        setAllQuotes(formattedAllQuotes);
        setUserQuotes(formattedUserQuotes);
        setViewingPartyQuotes(formattedViewingPartyQuotes);
        setDelegatedQuotes(formattedDelegatedQuotes);
      }
    } catch (error) {
      console.error("Error fetching quotes:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch quotes",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails.email, toast]); // Intentionally excluding 'bonds' to prevent infinite loop

  useEffect(() => {
    // Fetch data on component mount only - no dependencies to prevent infinite loops
    const fetchAllData = async () => {
      try {
        // Fetch bond data first
        await fetchBondData();
        
        // Then fetch bonds
        await fetchBonds();
        
        // Finally fetch quotes (which depends on bonds being loaded)
        await fetchQuotes();
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchAllData();
    
    // Set up polling for real-time updates (optional)
    // const interval = setInterval(fetchQuotes, 300000); // Poll every 5 mins
    // return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty - run only once on mount, excluding functions to prevent infinite loops



  // Bond price calculation function (matching BondCalc implementation)
  const calculateBondPrice = useCallback((
    yield_rate: number,
    bond: SecondaryMarketBond | PrimaryMarketBond | Bond | undefined,
    settlementDate: string,
    amount: number
  ) => {
    if (!bond || !yield_rate) return 0;
    
    try {
      // Parse dates - handle both string and Date objects
      const settlementDateObj = new Date(settlementDate);
      
      let issueDate: Date;
      let maturityDate: Date;
      
      if (bond.IssueDate instanceof Date) {
        issueDate = bond.IssueDate;
      } else {
        issueDate = new Date(bond.IssueDate || '');
      }
      
      if (bond.MaturityDate instanceof Date) {
        maturityDate = bond.MaturityDate;
      } else {
        maturityDate = new Date(bond.MaturityDate || '');
      }
      
      // Get bond-specific values
      let coupon = 0;
      let dailyBasis = bondCalcDetails.DailyBasis || 364; // Default to 364 if not available
      
      // Determine coupon rate based on bond type - be more explicit about type checking
      if ('Coupon' in bond) {
        if (typeof bond.Coupon === 'number') {
          coupon = bond.Coupon;
        } else if (typeof bond.Coupon === 'string') {
          coupon = parseFloat(bond.Coupon) || 0;
        }
      } else if ('ParYield' in bond && typeof bond.ParYield === 'string') {
        coupon = parseFloat(bond.ParYield) || 0;
      }
      
      // Use bond-specific daily basis if available - prioritize bond-specific settings
      if ('DayCount' in bond && typeof bond.DayCount === 'number' && bond.DayCount > 0) {
        dailyBasis = bond.DayCount;
      } else if ('Basis' in bond && typeof bond.Basis === 'number' && bond.Basis > 0) {
        // dailyBasis = bond.Basis;
        dailyBasis = 364;
      }
      
      // Validate that we have the minimum required data
      if (coupon === 0) {
        console.warn("Warning: Coupon rate is 0 or not found for bond calculation");
      }
      
      if (isNaN(issueDate.getTime()) || isNaN(maturityDate.getTime())) {
        console.error("Invalid dates for bond calculation");
        return 0;
      }
      
      // Calculate coupon dates and periods using BondCalc logic
      const previousCoupon = calculatePreviousCouponHelper(issueDate, settlementDateObj, dailyBasis);
      const nextCouponDate = calculateNextCouponDateHelper(issueDate, settlementDateObj, maturityDate, dailyBasis, previousCoupon);
      const nextCouponDays = calculateNextCouponDaysHelper(settlementDateObj, nextCouponDate);
      const couponsDue = calculateCouponsDueHelper(settlementDateObj, maturityDate, dailyBasis);
      
      // Calculate the dirty price using BondCalc logic
      const dirtyPrice = calculateBondPriceHelper(yield_rate, coupon, couponsDue, nextCouponDays, dailyBasis);
      
      // Debug: Compare with expected BondCalc values
      // console.log("=== Quote Book vs BondCalc Comparison ===");
      // console.log("Expected BondCalc values:");
      // console.log("  Yield: 15.6914%");
      // console.log("  Coupon: 9.486%");
      // console.log("  Next Coupon Days: 98");
      // console.log("  Coupons Due: 4");
      // console.log("  Daily Basis: 364");
      // console.log("  Expected Result: 92.869786");
      // console.log("");
      // console.log("Quote Book actual values:");
      // console.log("  Yield:", yield_rate + "%");
      // console.log("  Coupon:", coupon + "%");
      // console.log("  Next Coupon Days:", nextCouponDays);
      // console.log("  Coupons Due:", couponsDue);
      // console.log("  Daily Basis:", dailyBasis);
      // console.log("  Calculated Result:", dirtyPrice);
      // console.log("  Settlement Date:", settlementDate);
      // console.log("  Issue Date:", issueDate.toISOString().split('T')[0]);
      // console.log("  Maturity Date:", maturityDate.toISOString().split('T')[0]);
      // console.log("==========================================");
      
      // Test with exact BondCalc values
      console.log("=== Testing with exact BondCalc values ===");
      const testResult = calculateBondPriceHelper(15.6914, 9.486, 4, 98, 364);
      // console.log("Test calculation result:", testResult);
      // console.log("Should be approximately: 92.869786");
      // console.log("===========================================");
      
      return dirtyPrice;
    } catch (error) {
      console.error("Error calculating bond price:", error);
      return 0;
    }
  }, [bondCalcDetails.DailyBasis]);

  // Calculate indicative range
  const calculateIndicativeRange = useCallback((bond: Bond | SecondaryMarketBond | PrimaryMarketBond | undefined): string => {
    if (!bond) return "N/A";
    
    let spotYTM = 0;
    let spread = 0;
    
    if ('spotYTM' in bond && typeof bond.spotYTM === 'number') {
      spotYTM = bond.spotYTM;
    } else if ('SpotYield' in bond) {
      spotYTM = typeof bond.SpotYield === 'number' ? bond.SpotYield : parseFloat(bond.SpotYield);
    } else if ('SpotRate' in bond) {
      spotYTM = parseFloat((bond as any)['SpotRate'].replace('%', '')) / 100;
    }
    
    if ('Spread' in bond && typeof bond.Spread === 'number') {
      spread = bond.Spread;
    } else if ('Spread' in bond && typeof bond.Spread === 'string') {
      spread = parseFloat(bond.Spread);
    }
    
    const lowerBound = Math.max(0, Math.round((spotYTM - spread) * 10000) / 100);
    const upperBound = Math.round((spotYTM + spread) * 10000) / 100;
    
    return `${lowerBound.toFixed(2)}% - ${upperBound.toFixed(2)}%`;
  }, []);

  // Effect to calculate prices when inputs change in Place Quote
  useEffect(() => {
    if (!placeQuoteState.selectedBond) return;
    
    // Try to get bond from the appropriate market type first
    let selectedBond: SecondaryMarketBond | PrimaryMarketBond | Bond | undefined;
    
    if (placeQuoteState.marketType === 'secondary') {
      selectedBond = secondaryMarketBonds.find(b => b.Id.toString() === placeQuoteState.selectedBond);
    } else {
      selectedBond = primaryMarketBonds.find(b => b.Id.toString() === placeQuoteState.selectedBond);
    }
    
    // Fallback to the general bonds array if not found in specific market arrays
    if (!selectedBond) {
      selectedBond = bonds.find(b => b.Id.toString() === placeQuoteState.selectedBond);
    }
    
    if (!selectedBond) {
      return;
    }
    
    if (placeQuoteState.quoteType === 'bid' && placeQuoteState.bidYield) {
      const calculatedPrice = calculateBondPrice(
        parseFloat(placeQuoteState.bidYield), // Keep as percentage - BondCalc expects percentage
        selectedBond,
        placeQuoteState.settlementDate,
        parseFloat(placeQuoteState.bidAmount) || 0
      );
      setCalculatedBidPrice(calculatedPrice);
    }
    
    if (placeQuoteState.quoteType === 'offer' && placeQuoteState.offerYield) {
      const calculatedPrice = calculateBondPrice(
        parseFloat(placeQuoteState.offerYield), // Keep as percentage - BondCalc expects percentage
        selectedBond,
        placeQuoteState.settlementDate,
        parseFloat(placeQuoteState.offerAmount) || 0
      );
      setCalculatedOfferPrice(calculatedPrice);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    placeQuoteState.selectedBond,
    placeQuoteState.bidYield,
    placeQuoteState.offerYield,
    placeQuoteState.bidAmount,
    placeQuoteState.offerAmount,
    placeQuoteState.quoteType,
    placeQuoteState.settlementDate,
    placeQuoteState.marketType,
    calculateBondPrice,
    calculateIndicativeRange,
  ]); // Intentionally excluding bond arrays to prevent infinite loops

  const formatDate = (dateString: string | Date): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const formatNumber = (value: any) => {
    const num = Number(value);
    if (isNaN(num)) return '';
    return num.toFixed(4);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const calculateValues = (quote: EditableQuoteData) => {
    let consideration = 0;
    if (quote.IsBid) {
      consideration = (quote.BidAmount || 0) * (quote.bid_price || 0) / 100;
    } else if (quote.IsOffer) {
      consideration = (quote.OfferAmount || 0) * (quote.offer_price || 0) / 100;
    }
    const commission = Math.max(consideration * 0.00024, 1000);
    const otherLevies = consideration * 0.00011;
    const totalPayable = consideration + commission + otherLevies;
    const totalReceivable = consideration - commission - otherLevies;
    return {
      ...quote,
      commission_nse: commission,
      other_levies: otherLevies,
      total_payable: totalPayable,
      total_receivable: totalReceivable,
      consideration: consideration,
    };
  };

  const handleFieldEdit = (quote: EditableQuoteData, field: keyof EditableQuoteData, value: any) => {
    const updatedQuote = { ...quote, [field]: Number(value) };
    
    // Find the bond to use for calculations
    const bondForCalc = bonds.find(b => b.BondIssueNo === quote.bond_issue_no);
    
    // If BidYield changes, recalculate BidPrice
    if (field === 'bid' || field === 'bid_yield') {
      const bidYield = Number(value);
      updatedQuote.bid = bidYield;
      updatedQuote.bid_yield = bidYield;
      
      if (!isNaN(bidYield) && bondForCalc) {
        updatedQuote.bid_price = calculateBondPrice(
          bidYield, // Keep as percentage - BondCalc expects percentage
          bondForCalc,
          updatedQuote.settlement_date,
          updatedQuote.BidAmount || 0
        );
      }
    }
    
    // If OfferYield changes, recalculate OfferPrice
    if (field === 'offer' || field === 'offer_yield') {
      const offerYield = Number(value);
      updatedQuote.offer = offerYield;
      updatedQuote.offer_yield = offerYield;
      
      if (!isNaN(offerYield) && bondForCalc) {
        updatedQuote.offer_price = calculateBondPrice(
          offerYield, // Keep as percentage - BondCalc expects percentage
          bondForCalc,
          updatedQuote.settlement_date,
          updatedQuote.OfferAmount || 0
        );
      }
    }
    
    // If amounts change, recalculate corresponding prices
    if (field === 'BidAmount' && updatedQuote.bid_yield && updatedQuote.bid_yield !== 0 && bondForCalc) {
      updatedQuote.bid_price = calculateBondPrice(
        updatedQuote.bid_yield, // Keep as percentage - BondCalc expects percentage
        bondForCalc,
        updatedQuote.settlement_date,
        Number(value)
      );
    }
    
    if (field === 'OfferAmount' && updatedQuote.offer_yield && updatedQuote.offer_yield !== 0 && bondForCalc) {
      updatedQuote.offer_price = calculateBondPrice(
        updatedQuote.offer_yield, // Keep as percentage - BondCalc expects percentage
        bondForCalc,
        updatedQuote.settlement_date,
        Number(value)
      );
    }
    
    // Recalculate other values based on the updated quote
    const recalculatedQuote = calculateValues(updatedQuote);
    if (activeTab === "all") {
      setAllQuotes(prev => prev.map(q => q.id === quote.id ? recalculatedQuote : q));
    } else if (activeTab === "my") {
      setUserQuotes(prev => prev.map(q => q.id === quote.id ? recalculatedQuote : q));
    } else if (activeTab === "delegated") {
      setDelegatedQuotes(prev => prev.map(q => q.id === quote.id ? recalculatedQuote : q));
    }
  };

  const handleSubmitBid = async (quote: EditableQuoteData) => {
    if (userDetails.roles.find(role => role.is_active === 1)?.role_name === 'broker' || userDetails.roles.find(role => role.is_active === 1)?.role_name === 'authorizeddealer' || userDetails.roles.find(role => role.is_active === 1)?.role_name === 'agent') {
      setSelectedQuote(quote);
      setClientDialogOpen(true);
    } else {
      await submitBid(quote, null);
    }
  };

  const handleClientSelection = async (clientEmail: string | null) => {
    if (pendingQuoteData) {
      const quoteData = { ...pendingQuoteData, assigned_by: userDetails.email };
      const response = await sendToQuoteBook(quoteData);
      if (response?.success) {
        toast({ title: "Success", description: "Quote placed successfully" });
        fetchQuotes();
      } else {
        toast({ title: "Error", description: response?.message || "Failed to place quote" });
      }
      setPendingQuoteData(null);
    } else if (selectedQuote) {
      await submitBid(selectedQuote, clientEmail);
    }
    setClientDialogOpen(false);
  };

  const handleActivateQuote = async (quote: EditableQuoteData) => {
    try {
      const response = await activateQuote({ quote_id: quote.id, user_email: userDetails.email });
      if (response?.success) {
        toast({
          title: "Success",
          description: "Quote activated successfully",
        });
        fetchQuotes();
      } else {
        toast({
          title: "Error",
          description: response?.message || "Failed to activate quote",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to activate quote",
        variant: "destructive"
      });
    }
  };

  const handleSuspendQuote = async (quote: EditableQuoteData) => {
    try {
      const response = await suspendQuote({ quote_id: quote.id, user_email: userDetails.email });
      if (response?.success) {
        toast({
          title: "Success",
          description: "Quote suspended successfully",
        });
        fetchQuotes();
      } else {
        toast({
          title: "Error",
          description: response?.message || "Failed to suspend quote",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to suspend quote",
        variant: "destructive"
      });
    }
  };

  const handleMarkTransactionStatus = async (transactionId: number, status: 'accept' | 'reject') => {
    const payload = {
      trans_id: transactionId,
      user_email: userDetails.email,
      is_accepted: status === 'accept',
      is_rejected: status === 'reject',
      is_pending: false,
      is_delegated: false,
    };
    try {
      const response = await markTransactionStatus(payload);
      if (response?.success) {
        toast({ title: 'Success', description: `Transaction ${status}ed successfully` });
        fetchQuotes();
      } else {
        toast({ title: 'Error', description: response?.message || `Failed to ${status} transaction` });
      }
    } catch (error) {
      toast({ title: 'Error', description: `Failed to ${status} transaction`, variant: 'destructive' });
    }
  };

  const submitBid = async (quote: EditableQuoteData, clientEmail: string | null) => {
    setIsSubmitting(true);
    try {
      const bidData = {
        quote_id: quote.id,
        user_email: userDetails.email,
        bid_price: quote.bid_price,
        bid_yield: quote.bid_yield ?? 0,
        offer_price: quote.offer_price,
        offer_yield: quote.offer_yield ?? 0,
        bid_amount: quote.BidAmount ?? 0,
        offer_amount: quote.OfferAmount ?? 0,
      };
      const response = await createTransaction(bidData);
      if (response?.success) {
        toast({ title: 'Success', description: 'Bid submitted successfully' });
        fetchQuotes();
      } else {
        toast({ title: 'Error', description: response?.message || 'Failed to submit bid', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'An error occurred while submitting the bid', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleView = (quote: EditableQuoteData) => {
    setSelectedQuote(quote);
    setIsViewOpen(true);
  };

  const handlePlaceQuote = async () => {
    try {
      setIsSubmitting(true);
      
      const allBonds = placeQuoteState.marketType === 'secondary' ? secondaryMarketBonds : primaryMarketBonds;
      const selectedBond = allBonds.find(b => b.Id.toString() === placeQuoteState.selectedBond);
      
      if (!selectedBond) {
        toast({ title: "Error", description: "Please select a bond" });
        return;
      }

      const quoteData = {
        bond_id: Number(placeQuoteState.selectedBond),
        IsBid: placeQuoteState.quoteType === 'bid',
        IsOffer: placeQuoteState.quoteType === 'offer',
        bid_price: calculatedBidPrice || 0,
        offer_price: calculatedOfferPrice || 0,
        bid_yield: parseFloat(placeQuoteState.bidYield) || 0,
        offer_yield: parseFloat(placeQuoteState.offerYield) || 0,
        bid_amount: parseFloat(placeQuoteState.bidAmount) || 0,
        offer_amount: parseFloat(placeQuoteState.offerAmount) || 0,
        assigned_by: userDetails.email,
      };

      const response = await sendToQuoteBook(quoteData);
      if (response?.success) {
        toast({ title: "Success", description: "Quote placed successfully" });
        setIsPlaceQuoteOpen(false);
        resetPlaceQuoteForm();
        fetchQuotes();
      } else {
        toast({ title: "Error", description: response?.message || "Failed to place quote" });
      }
    } catch (error) {
      toast({ title: "Error", description: "An error occurred while placing the quote", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPlaceQuoteForm = () => {
    setPlaceQuoteState({
      marketType: 'secondary',
      selectedBond: '',
      quoteType: 'bid',
      bidYield: '',
      offerYield: '',
      bidAmount: '',
      offerAmount: '',
      settlementDate: getDefaultSettlementDate()
    });
    setCalculatedBidPrice(0);
    setCalculatedOfferPrice(0);
  };

  const handleCounterBid = (transaction: Transaction) => {
    setCounterBidState({
      transactionId: transaction.id,
      originalTransaction: transaction,
      newBidYield: Number(transaction.bid_yield).toFixed(4),
      newOfferYield: Number(transaction.offer_yield).toFixed(4),
      newBidAmount: Number(transaction.bid_amount).toFixed(2),
      newOfferAmount: Number(transaction.offer_amount).toFixed(2),
    });
    setIsCounterBidOpen(true);
  };

  const submitCounterBid = async () => {
    if (!counterBidState) return;
    
    try {
      setIsSubmitting(true);
      
      // Find the quote associated with this transaction
      const quote = allQuotes.find(q => 
        q.transactions?.some(t => t.id === counterBidState.transactionId)
      );
      
      if (!quote) {
        toast({ title: "Error", description: "Quote not found" });
        return;
      }

      const bondForCalc = bonds.find(b => b.BondIssueNo === quote.bond_issue_no);
      
      const bidData = {
        quote_id: quote.id,
        user_email: userDetails.email,
        bid_price: calculateBondPrice(
          parseFloat(counterBidState.newBidYield),
          bondForCalc,
          quote.settlement_date,
          parseFloat(counterBidState.newBidAmount)
        ),
        bid_yield: parseFloat(counterBidState.newBidYield),
        offer_price: calculateBondPrice(
          parseFloat(counterBidState.newOfferYield),
          bondForCalc,
          quote.settlement_date,
          parseFloat(counterBidState.newOfferAmount)
        ),
        offer_yield: parseFloat(counterBidState.newOfferYield),
        bid_amount: parseFloat(counterBidState.newBidAmount),
        offer_amount: parseFloat(counterBidState.newOfferAmount),
      };

      const response = await createTransaction(bidData);
      if (response?.success) {
        toast({ title: 'Success', description: 'Counter bid submitted successfully' });
        setIsCounterBidOpen(false);
        setCounterBidState(null);
        fetchQuotes();
      } else {
        toast({ title: 'Error', description: response?.message || 'Failed to submit counter bid', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'An error occurred while submitting counter bid', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuotes = activeTab === "all" ? allQuotes :
                       activeTab === "my" ? userQuotes :
                       activeTab === "delegated" ? delegatedQuotes :
                       viewingPartyQuotes;
  const totalPages = Math.ceil(currentQuotes.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const displayedQuotes = currentQuotes.slice(startIndex, endIndex);

  const getBondsList = () => {
    return placeQuoteState.marketType === 'secondary' ? secondaryMarketBonds : primaryMarketBonds;
  };

  return (
    <div>
      <div className="rounded-md border">
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-600 to-blue-400">
          <h2 className="text-xl font-semibold text-white">QUOTE BOOK</h2>
          <Button onClick={() => setIsPlaceQuoteOpen(true)} variant="secondary" className="bg-white text-blue-600 font-semibold">Place Quote</Button>
          <span className="text-white">{new Date().toLocaleDateString()}</span>
        </div>
        
        <div className="flex justify-between px-4 py-2 bg-gray-50 text-sm">
          <span className="text-gray-600 font-medium">Lower bid goes top</span>
          <div className="flex items-center gap-4">
            <Button 
              onClick={fetchQuotes} 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2 hover:bg-blue-50"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <span className="text-gray-600 font-medium">Higher Offer goes on top</span>
          </div>
        </div>

        {/* Quick Tips Section */}
        <div className="px-4 mb-4">
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center justify-between w-full p-4 bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200 hover:from-cyan-100 hover:to-blue-100"
              >
                <div className="flex items-center">
                  <Info className="h-5 w-5 text-cyan-600 mr-2" />
                  <span className="font-medium text-cyan-900">Quick Tips for Quote Book</span>
                </div>
                <ChevronDown className="h-4 w-4 text-cyan-600" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="bg-white border border-cyan-200 rounded-lg p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
                      Quote Identification
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start">
                        <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2 mt-1 flex-shrink-0"></span>
                        <span><strong>Green numbers:</strong> Your submitted quotes</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-3 h-3 bg-purple-500 rounded-full mr-2 mt-1 flex-shrink-0"></span>
                        <span><strong>Purple numbers:</strong> Delegated quotes assigned to you</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-500 mr-2">•</span>
                        Use the # column to quickly identify quote ownership
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
                      Edit My Quotes
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        Click the "Edit" button to modify quote parameters
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        Values are automatically recalculated when you make changes
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        <span><strong>Green indicators:</strong> Yields within indicative range</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        <span><strong>Red indicators:</strong> Yields outside indicative range</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        Use "Submit Bid" button in edit drawer to place quotes
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">3</span>
                      Actions & Confirmations
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start">
                        <span className="text-orange-500 mr-2">•</span>
                        All critical actions require confirmation before execution
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-500 mr-2">•</span>
                        Suspend/Activate quotes with safety prompts
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-500 mr-2">•</span>
                        Place quotes with detailed confirmation dialogs
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">4</span>
                      Market Analysis
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        View all market quotes in the "All Quotes" section
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        Monitor indicative yield ranges for better pricing
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        Submit competitive bids directly from the market view
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <Tabs defaultValue="my" className="w-full" onValueChange={setActiveTab}>
          <div className="px-4 pt-2">
            <TabsList className="grid w-full max-w-[800px] grid-cols-2">
              <TabsTrigger value="my">Edit My Quotes</TabsTrigger>
              <TabsTrigger value="all">All Quotes</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="my" className="pt-2">
            {/* Tab Description */}
            <div className="px-4 mb-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Settings className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">Edit My Quotes</h3>
                    <p className="text-sm text-blue-700 leading-relaxed">
                      Manage and edit your submitted quotes and delegated quotes. Use the Edit button to modify quote details, 
                      activate/suspend quotes, and track transaction status. 
                      <span className="inline-flex items-center ml-1">
                        <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
                        <span className="text-xs">My Quotes</span>
                        <span className="inline-block w-3 h-3 bg-purple-500 rounded-full ml-2 mr-1"></span>
                        <span className="text-xs">Delegated</span>
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <QuoteTable 
              quotes={[...displayedQuotes.filter(q => q.assigned_by === userDetails.email || !q.assigned_by), ...displayedQuotes.filter(q => q.assigned_by && q.assigned_by !== userDetails.email && activeTab === 'my')]}
              isLoading={isLoading}
              onEdit={handleFieldEdit}
              onView={handleView}
              onSubmit={handleSubmitBid}
              onActivate={handleActivateQuote}
              onSuspend={handleSuspendQuote}
              formatDate={formatDate}
              formatNumber={formatNumber}
              formatCurrency={formatCurrency}
              showActions={true}
              showSubmitBid={false}
              showView={true}
              showSuspend={true}
              showActivate={true}
              showEdit={true}
              userRole={userDetails.roles.find(role => role.is_active === 1)?.role_name || ''}
              activeTab={activeTab}
              onMarkTransactionStatus={handleMarkTransactionStatus}
              onCounterBid={handleCounterBid}
              bonds={bonds}
              calculateIndicativeRange={calculateIndicativeRange}
              userEmail={userDetails.email}
            />
          </TabsContent>

          <TabsContent value="all" className="pt-2">
            {/* Tab Description */}
            <div className="px-4 mb-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <BarChart3 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-green-900 mb-1">All Quotes</h3>
                    <p className="text-sm text-green-700 leading-relaxed">
                      View all available quotes in the market. Submit bids, analyze market trends, and explore trading opportunities. 
                      This section displays all active quotes from various participants in the bond market.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <QuoteTable 
              quotes={displayedQuotes}
              isLoading={isLoading}
              onEdit={handleFieldEdit}
              onView={handleView}
              onSubmit={handleSubmitBid}
              onActivate={handleActivateQuote}
              onSuspend={handleSuspendQuote}
              formatDate={formatDate}
              formatNumber={formatNumber}
              formatCurrency={formatCurrency}
              showActions={true}
              showSubmitBid={true}
              showView={false}
              showSuspend={false}
              showActivate={false}
              showEdit={false}
              userRole={userDetails.roles.find(role => role.is_active === 1)?.role_name || ''}
              activeTab={activeTab}
              onMarkTransactionStatus={handleMarkTransactionStatus}
              onCounterBid={handleCounterBid}
              bonds={bonds}
              calculateIndicativeRange={calculateIndicativeRange}
              userEmail={userDetails.email}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center px-4 py-2 bg-gray-50">
          <span className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, currentQuotes.length)} of {currentQuotes.length} entries
          </span>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="hover:bg-blue-50"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="hover:bg-blue-50"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Place Quote Sheet */}
      <Sheet open={isPlaceQuoteOpen} onOpenChange={setIsPlaceQuoteOpen}>
        <SheetContent className="overflow-y-auto w-[500px] sm:w-[600px]">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold text-gray-800">Place New Quote</SheetTitle>
            <SheetDescription className="text-gray-600">
              Select bond and enter quote details
            </SheetDescription>
          </SheetHeader>

          <div className="grid gap-6 py-4">
            {/* Market Type Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Market Type</Label>
              <Select
                value={placeQuoteState.marketType}
                onValueChange={(value: 'secondary' | 'primary') =>
                  setPlaceQuoteState(prev => ({ ...prev, marketType: value, selectedBond: '' }))
                }
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

            {/* Bond Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Bond Selection</Label>
              <Select
                value={placeQuoteState.selectedBond}
                onValueChange={(value) =>
                  setPlaceQuoteState(prev => ({ ...prev, selectedBond: value }))
                }
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

            {/* Bond Information Display */}
            {placeQuoteState.selectedBond && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                {(() => {
                  const selectedBond = getBondsList().find(b => b.Id.toString() === placeQuoteState.selectedBond);
                  if (!selectedBond) return null;
                  
                  return (
                    <>
                      <div className="grid grid-cols-2 gap-3 items-center">
                        <Label className="text-xs font-medium text-gray-600">Issue Date</Label>
                        <Input
                          value={formatDate(selectedBond.IssueDate)}
                          className="h-8 bg-white border-gray-200 font-semibold text-gray-700"
                          readOnly
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3 items-center">
                        <Label className="text-xs font-medium text-gray-600">Maturity Date</Label>
                        <Input
                          value={formatDate(selectedBond.MaturityDate)}
                          className="h-8 bg-white border-gray-200 font-semibold text-gray-700"
                          readOnly
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3 items-center">
                        <Label className="text-xs font-medium text-gray-600">Indicative Range</Label>
                        <Input
                          value={calculateIndicativeRange(selectedBond)}
                          className="h-8 bg-white border-gray-200 font-semibold text-gray-700"
                          readOnly
                        />
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            <Separator />

            {/* Quote Type Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Quote Type</Label>
              <RadioGroup
                value={placeQuoteState.quoteType}
                onValueChange={(value: 'bid' | 'offer') =>
                  setPlaceQuoteState(prev => ({ ...prev, quoteType: value }))
                }
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bid" id="bid" />
                  <Label htmlFor="bid">Bid (Buy)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="offer" id="offer" />
                  <Label htmlFor="offer">Offer (Sell)</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Settlement Date */}
            <div className="grid grid-cols-2 gap-3 items-center">
              <Label className="text-xs font-medium text-gray-600">Settlement Date</Label>
              <Input
                type="date"
                value={placeQuoteState.settlementDate}
                onChange={(e) =>
                  setPlaceQuoteState(prev => ({ ...prev, settlementDate: e.target.value }))
                }
                className="h-8 border-2 border-orange-200 hover:border-orange-300 focus:border-orange-400 bg-orange-50 font-semibold"
              />
            </div>

            {/* Bid Fields */}
            {placeQuoteState.quoteType === 'bid' && (
              <>
                <div className="grid grid-cols-2 gap-3 items-center">
                  <Label className="text-xs font-medium text-gray-600">Bid Yield (%)</Label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={placeQuoteState.bidYield}
                    onChange={(e) =>
                      setPlaceQuoteState(prev => ({ ...prev, bidYield: e.target.value }))
                    }
                    className="h-8 border-2 border-yellow-200 hover:border-yellow-300 focus:border-yellow-400 bg-yellow-50 font-semibold"
                    placeholder="Enter bid yield"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 items-center">
                  <Label className="text-xs font-medium text-gray-600">Bid Amount (KES)</Label>
                  <Input
                    type="number"
                    value={placeQuoteState.bidAmount}
                    onChange={(e) =>
                      setPlaceQuoteState(prev => ({ ...prev, bidAmount: e.target.value }))
                    }
                    className="h-8 border-2 border-yellow-200 hover:border-yellow-300 focus:border-yellow-400 bg-yellow-50 font-semibold"
                    placeholder="Enter bid amount"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 items-center">
                  <Label className="text-xs font-medium text-gray-600">Calculated Bid Price</Label>
                  <Input
                    value={calculatedBidPrice.toFixed(6)}
                    className="h-8 bg-gray-100 text-gray-700 font-medium"
                    readOnly
                  />
                </div>
              </>
            )}

            {/* Offer Fields */}
            {placeQuoteState.quoteType === 'offer' && (
              <>
                <div className="grid grid-cols-2 gap-3 items-center">
                  <Label className="text-xs font-medium text-gray-600">Offer Yield (%)</Label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={placeQuoteState.offerYield}
                    onChange={(e) =>
                      setPlaceQuoteState(prev => ({ ...prev, offerYield: e.target.value }))
                    }
                    className="h-8 border-2 border-yellow-200 hover:border-yellow-300 focus:border-yellow-400 bg-yellow-50 font-semibold"
                    placeholder="Enter offer yield"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 items-center">
                  <Label className="text-xs font-medium text-gray-600">Offer Amount (KES)</Label>
                  <Input
                    type="number"
                    value={placeQuoteState.offerAmount}
                    onChange={(e) =>
                      setPlaceQuoteState(prev => ({ ...prev, offerAmount: e.target.value }))
                    }
                    className="h-8 border-2 border-yellow-200 hover:border-yellow-300 focus:border-yellow-400 bg-yellow-50 font-semibold"
                    placeholder="Enter offer amount"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 items-center">
                  <Label className="text-xs font-medium text-gray-600">Calculated Offer Price</Label>
                  <Input
                    value={calculatedOfferPrice.toFixed(6)}
                    className="h-8 bg-gray-100 text-gray-700 font-medium"
                    readOnly
                  />
                </div>
              </>
            )}
          </div>

          <SheetFooter className="mt-8 sticky bottom-0 bg-background pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline"
                onClick={resetPlaceQuoteForm}
                disabled={isSubmitting}
                className="h-10 border-2 border-gray-300 hover:border-gray-400 font-medium"
              >
                Reset
              </Button>
              <Button 
                onClick={handlePlaceQuote}
                disabled={isSubmitting || !placeQuoteState.selectedBond}
                className="h-10 bg-blue-600 hover:bg-blue-700 font-medium shadow-md"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Quote'}
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Counter Bid Dialog */}
      <Dialog open={isCounterBidOpen} onOpenChange={setIsCounterBidOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Counter Bid</DialogTitle>
          </DialogHeader>
          {counterBidState && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Original Transaction</Label>
                <div className="text-sm text-gray-600">
                  Transaction No: {counterBidState.originalTransaction.transaction_no}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 items-center">
                <Label>New Bid Yield (%)</Label>
                <Input
                  type="number"
                  step="0.0001"
                  value={counterBidState.newBidYield}
                  onChange={(e) =>
                    setCounterBidState(prev => prev ? { ...prev, newBidYield: e.target.value } : null)
                  }
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3 items-center">
                <Label>New Bid Amount</Label>
                <Input
                  type="number"
                  value={counterBidState.newBidAmount}
                  onChange={(e) =>
                    setCounterBidState(prev => prev ? { ...prev, newBidAmount: e.target.value } : null)
                  }
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3 items-center">
                <Label>New Offer Yield (%)</Label>
                <Input
                  type="number"
                  step="0.0001"
                  value={counterBidState.newOfferYield}
                  onChange={(e) =>
                    setCounterBidState(prev => prev ? { ...prev, newOfferYield: e.target.value } : null)
                  }
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3 items-center">
                <Label>New Offer Amount</Label>
                <Input
                  type="number"
                  value={counterBidState.newOfferAmount}
                  onChange={(e) =>
                    setCounterBidState(prev => prev ? { ...prev, newOfferAmount: e.target.value } : null)
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCounterBidOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitCounterBid} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Counter Bid'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Quote Sheet */}
      <Sheet open={isViewOpen} onOpenChange={setIsViewOpen}>
        <SheetContent className="sm:max-w-[500px]">
          <SheetHeader>
            <SheetTitle>Quote Details</SheetTitle>
            <SheetDescription>
              View quote information and calculations
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-200px)] pr-4">
            {selectedQuote && (
              <div className="grid gap-4 py-4">
                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-500">Placement No</Label>
                    <div className="text-sm font-medium">{selectedQuote.placement_no}</div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-500">Bond Issue</Label>
                    <div className="text-sm font-medium text-amber-600">{selectedQuote.bond_issue_no}</div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-500">Settlement Date</Label>
                    <div className="text-sm font-medium">{formatDate(selectedQuote.settlement_date)}</div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-500">Quote Type</Label>
                    <div className="text-sm font-medium">
                      <Badge variant="outline" className={selectedQuote.IsBid ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"}>
                        {selectedQuote.IsBid ? "Bid (Buy)" : "Offer (Sell)"}
                      </Badge>
                    </div>
                    
                  </div>
                </div>

                {/* Bid and Offer Details */}
                <div className="border-t pt-4 mt-4">
                  <h4 className="text-sm font-semibold mb-3">Quote Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Bid Details */}
                    <div className="space-y-3">
                      <h5 className="text-xs font-semibold text-purple-600 uppercase">Bid (Buy)</h5>
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-500">Bid Amount (KES)</Label>
                      <div className="text-sm font-medium">
                            {(selectedQuote.BidAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-500">Bid Yield (%)</Label>
                          <div className="text-sm font-medium">{Number(selectedQuote.bid || 0).toFixed(4)}%</div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-500">Bid Price</Label>
                          <div className="text-sm font-medium">{Number(selectedQuote.bid_price || 0).toFixed(6)}</div>
                        </div>
                      </div>
                    </div>

                    {/* Offer Details */}
                    <div className="space-y-3">
                      <h5 className="text-xs font-semibold text-green-600 uppercase">Offer (Sell)</h5>
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-500">Offer Amount (KES)</Label>
                      <div className="text-sm font-medium">
                            {(selectedQuote.OfferAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-500">Offer Yield (%)</Label>
                          <div className="text-sm font-medium">{Number(selectedQuote.offer || 0).toFixed(4)}%</div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-500">Offer Price</Label>
                          <div className="text-sm font-medium">{Number(selectedQuote.offer_price || 0).toFixed(6)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                      <Label className="text-xs text-gray-500">Indicative Range</Label>
                    <div className="text-sm font-medium text-orange-600">
                      {calculateIndicativeRange(bonds.find(b => b.BondIssueNo === selectedQuote.bond_issue_no))}
                    </div>
                  </div>
                </div>

                {/* Calculations & Fees */}
                <div className="border-t pt-4 mt-4">
                  <h4 className="text-sm font-semibold mb-3">Financial Calculations</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {(() => {
                      const amount = selectedQuote.IsBid ? selectedQuote.BidAmount : selectedQuote.OfferAmount;
                      const price = selectedQuote.IsBid ? selectedQuote.bid_price : selectedQuote.offer_price;
                      const consideration = (amount ?? 0) * (price ?? 0) / 100;
                      const commission = Math.max(consideration * 0.00024, 1000);
                      const otherLevies = consideration * 0.00011;
                      const totalPayable = consideration + commission + otherLevies;
                      const totalReceivable = consideration - commission - otherLevies;

                      return (
                        <>
                          <div className="space-y-1.5">
                            <Label className="text-xs text-gray-500">Consideration</Label>
                            <div className="text-sm font-medium">
                              {consideration.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs text-gray-500">Commission (NSE)</Label>
                            <div className="text-sm font-medium">
                              {commission.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <div className="text-xs text-gray-500">0.024% (min. KES 1,000)</div>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs text-gray-500">Other Levies (CMA)</Label>
                            <div className="text-sm font-medium">
                              {otherLevies.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <div className="text-xs text-gray-500">0.011% of consideration</div>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs text-gray-500">Total Payable</Label>
                            <div className="text-sm font-medium text-red-600">
                              {totalPayable.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs text-gray-500">Total Receivable</Label>
                            <div className="text-sm font-medium text-green-600">
                              {totalReceivable.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Bond Details */}
                {(() => {
                  const bond = bonds.find(b => b.BondIssueNo === selectedQuote.bond_issue_no);
                  if (!bond) return null;
                  return (
                    <div className="border-t pt-4 mt-4">
                      <h4 className="text-sm font-semibold mb-3">Bond Information</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs text-gray-500">Issue Date</Label>
                          <div className="text-sm font-medium">{bond.IssueDate ? formatDate(bond.IssueDate) : 'N/A'}</div>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-gray-500">Maturity Date</Label>
                          <div className="text-sm font-medium">{bond.MaturityDate ? formatDate(bond.MaturityDate) : 'N/A'}</div>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-gray-500">Coupon Rate</Label>
                          <div className="text-sm font-medium">{Number(bond.Coupon).toFixed(3)}%</div>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-gray-500">Duration</Label>
                          <div className="text-sm font-medium">{Number(bond.Duration).toFixed(4)}</div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Additional Information */}
                <div className="border-t pt-4 mt-4">
                  <h4 className="text-sm font-semibold mb-3">Additional Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-gray-500">Assigned By</Label>
                      <div className="text-sm font-medium">{selectedQuote.assigned_by || 'N/A'}</div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-gray-500">Face Value</Label>
                      <div className="text-sm font-medium">
                        {(selectedQuote.face_value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
          <SheetFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>
              Close
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <ClientSelectionDialog
        open={clientDialogOpen}
        onOpenChange={setClientDialogOpen}
        onSelect={handleClientSelection}
        userEmail={userDetails.email}
      />
    </div>
  );
}

function QuoteTable({
  quotes,
  isLoading,
  onEdit,
  onView,
  onSubmit,
  onActivate,
  onSuspend,
  formatDate,
  formatNumber,
  formatCurrency,
  showActions,
  showSubmitBid,
  showView,
  showSuspend,
  showActivate,
  showEdit,
  userRole,
  activeTab,
  onMarkTransactionStatus,
  onCounterBid,
  bonds,
  calculateIndicativeRange,
  userEmail
}: {
  quotes: EditableQuoteData[];
  isLoading: boolean;
  onEdit: (quote: EditableQuoteData, field: keyof EditableQuoteData, value: any) => void;
  onView: (quote: EditableQuoteData) => void;
  onSubmit: (quote: EditableQuoteData) => void;
  onActivate: (quote: EditableQuoteData) => void;
  onSuspend: (quote: EditableQuoteData) => void;
  formatDate: (date: string) => string;
  formatNumber: (value: any) => string;
  formatCurrency: (value: number) => string;
  showActions: boolean;
  showSubmitBid: boolean;
  showView: boolean;
  showSuspend: boolean;
  showActivate: boolean;
  showEdit: boolean;
  userRole: string;
  activeTab: string;
  onMarkTransactionStatus: (transactionId: number, status: 'accept' | 'reject') => void;
  onCounterBid: (transaction: Transaction) => void;
  bonds: Bond[];
  calculateIndicativeRange: (bond: Bond | undefined) => string;
  userEmail: string;
}) {
  const [openRows, setOpenRows] = useState<number[]>([]);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [selectedQuoteForEdit, setSelectedQuoteForEdit] = useState<EditableQuoteData | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: 'suspend' | 'activate' | 'place' | null;
    quote: EditableQuoteData | null;
    title: string;
    description: string;
  }>({
    open: false,
    type: null,
    quote: null,
    title: '',
    description: ''
  });

  const toggleRow = (quoteId: number) => {
    setOpenRows(prev => 
      prev.includes(quoteId) 
        ? prev.filter(id => id !== quoteId)
        : [...prev, quoteId]
    );
  };

  const handleEditClick = (quote: EditableQuoteData) => {
    setSelectedQuoteForEdit(quote);
    setEditDrawerOpen(true);
  };

  const handleConfirmAction = (type: 'suspend' | 'activate' | 'place', quote: EditableQuoteData) => {
    const actions = {
      suspend: {
        title: 'Suspend Quote',
        description: `Are you sure you want to suspend quote #${quote.placement_no}? This will make it inactive in the market.`
      },
      activate: {
        title: 'Activate Quote',
        description: `Are you sure you want to activate quote #${quote.placement_no}? This will make it active in the market.`
      },
      place: {
        title: 'Place Quote',
        description: `Are you sure you want to place this quote for ${quote.bond_issue_no}? This action will submit your bid to the market.`
      }
    };

    setConfirmDialog({
      open: true,
      type,
      quote,
      title: actions[type].title,
      description: actions[type].description
    });
  };

  const executeAction = () => {
    if (!confirmDialog.quote || !confirmDialog.type) return;

    switch (confirmDialog.type) {
      case 'suspend':
        onSuspend(confirmDialog.quote);
        break;
      case 'activate':
        onActivate(confirmDialog.quote);
        break;
      case 'place':
        onSubmit(confirmDialog.quote);
        break;
    }

    setConfirmDialog({ open: false, type: null, quote: null, title: '', description: '' });
  };

  const isAssignedBy = (quote: EditableQuoteData) => quote.assigned_by === userEmail;

  // Check if yield is within indicative range
  const getYieldColorClass = (yield_value: number, bond: Bond | undefined): string => {
    if (!bond || !yield_value) return 'bg-gray-100 text-gray-600';
    
    let spotYTM = 0;
    let spread = 0;
    
    if ('spotYTM' in bond && typeof bond.spotYTM === 'number') {
      spotYTM = bond.spotYTM;
    } else if ('SpotYield' in bond) {
      spotYTM = typeof bond.SpotYield === 'number' ? bond.SpotYield : parseFloat(bond.SpotYield);
    } else if ('SpotRate' in bond) {
      spotYTM = parseFloat((bond as any)['SpotRate'].replace('%', '')) / 100;
    }
    
    if ('Spread' in bond && typeof bond.Spread === 'number') {
      spread = bond.Spread;
    } else if ('Spread' in bond && typeof bond.Spread === 'string') {
      spread = parseFloat(bond.Spread);
    }
    
    // Use the same calculation as calculateIndicativeRange function
    const lowerBound = Math.max(0, Math.round((spotYTM - spread) * 10000) / 100);
    const upperBound = Math.round((spotYTM + spread) * 10000) / 100;
    
    // Debug logging to see what's happening
    console.log(`DEBUG - Bond: ${bond.BondIssueNo || 'Unknown'}, Yield: ${yield_value}%, SpotYTM: ${spotYTM}, Spread: ${spread}, Range: ${lowerBound}% - ${upperBound}%`);
    
    // Check if yield is within the indicative range
    if (yield_value >= lowerBound && yield_value <= upperBound) {
      console.log(`✅ GREEN: ${yield_value}% is within ${lowerBound}% - ${upperBound}%`);
      return 'bg-green-100 text-green-700 border-green-300';
    }
    // Yield is outside range
    console.log(`❌ RED: ${yield_value}% is outside ${lowerBound}% - ${upperBound}%`);
    return 'bg-red-100 text-red-700 border-red-300';
  };

  // Helper function to check if yield is within range (for validation)
  const isYieldInRange = (yield_value: number, bond: Bond | undefined): boolean => {
    if (!bond || !yield_value) return false;
    
    let spotYTM = 0;
    let spread = 0;
    
    if ('spotYTM' in bond && typeof bond.spotYTM === 'number') {
      spotYTM = bond.spotYTM;
    } else if ('SpotYield' in bond) {
      spotYTM = typeof bond.SpotYield === 'number' ? bond.SpotYield : parseFloat(bond.SpotYield);
    } else if ('SpotRate' in bond) {
      spotYTM = parseFloat((bond as any)['SpotRate'].replace('%', '')) / 100;
    }
    
    if ('Spread' in bond && typeof bond.Spread === 'number') {
      spread = bond.Spread;
    } else if ('Spread' in bond && typeof bond.Spread === 'string') {
      spread = parseFloat(bond.Spread);
    }
    
    // Use the same calculation as calculateIndicativeRange function
    const lowerBound = Math.max(0, Math.round((spotYTM - spread) * 10000) / 100);
    const upperBound = Math.round((spotYTM + spread) * 10000) / 100;
    
    const inRange = yield_value >= lowerBound && yield_value <= upperBound;
    console.log(`isYieldInRange - Yield: ${yield_value}%, Range: ${lowerBound}% - ${upperBound}%, InRange: ${inRange}`);
    
    return inRange;
  };

  return (
    <>
      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-gray-100 to-gray-50">
              <TableHead className="font-semibold text-gray-700 min-w-[100px]">Quote Type</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[60px]">#</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[120px]">Placement No</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[150px]">Bond Issue</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[120px]">Settlement Date</TableHead> 
              <TableHead className="font-semibold text-gray-700 min-w-[130px]">Bid Amount (Ksh)</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[100px]">Bid Price</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[110px]">Bid Yield (%)</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[140px]">Indicative Range</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[120px]">Offer Yield (%)</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[100px]">Offer Price</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[140px]">Offer Amount(Ksh)</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={13} className="h-24 text-center">
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                <p className="mt-2 text-gray-500">Loading quotes...</p>
              </TableCell>
            </TableRow>
          ) : quotes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={13} className="h-24 text-center text-gray-500">
                No quotes available
              </TableCell>
            </TableRow>
          ) : (
            quotes.map((quote, index) => {
              const assignedBy = isAssignedBy(quote);
              const disableBid = quote.IsBid || assignedBy;
              const disableOffer = quote.IsOffer || assignedBy;
              const bond = bonds.find(b => b.BondIssueNo === quote.bond_issue_no);
              
              return (
                <React.Fragment key={quote.id}>
                  <TableRow className={index % 2 === 0 ? 'bg-white hover:bg-blue-50' : 'bg-gray-50 hover:bg-blue-50'}>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={quote.IsBid ? "bg-purple-100 text-purple-800 border-purple-200" : "bg-green-100 text-green-800 border-green-200"}
                      >
                        {quote.IsBid ? "Bid" : "Offer"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center text-white text-sm font-bold",
                        quote.assigned_by === userEmail || !quote.assigned_by
                          ? "bg-green-500" 
                          : "bg-purple-500"
                      )}>
                        {index + 1}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{quote.placement_no}</TableCell>
                    <TableCell>
                      <span className="text-amber-600 font-medium">{quote.bond_issue_no}</span>
                    </TableCell>
                    <TableCell>{formatDate(quote.settlement_date)}</TableCell>
                    <TableCell className="text-right">
                      <div className="text-right font-medium">
                        {formatCurrency(quote.BidAmount || 0)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="text-right font-medium">
                        {formatNumber(quote.bid_price)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className={cn(
                        "text-right font-medium px-2 py-1 rounded",
                        getYieldColorClass(quote.bid_yield || 0, bond)
                      )}>
                        {quote.bid_yield ? `${quote.bid_yield.toFixed(4)}%` : '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-medium">
                        {calculateIndicativeRange(bond)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className={cn(
                        "text-right font-medium px-2 py-1 rounded",
                        getYieldColorClass(quote.offer_yield || 0, bond)
                      )}>
                        {quote.offer_yield ? `${quote.offer_yield.toFixed(4)}%` : '-'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="text-right font-medium">
                        {formatNumber(quote.offer_price)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="text-right font-medium">
                        {formatCurrency(quote.OfferAmount || 0)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {showActions && (
                          <>
                            {showEdit && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditClick(quote)}
                                className="flex items-center gap-1 hover:bg-blue-100 text-blue-700"
                              >
                                <Settings className="h-4 w-4" />
                                Edit
                              </Button>
                            )}
                            {showView && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onView(quote)}
                                className="flex items-center gap-1 hover:bg-gray-100"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            {showSubmitBid && !assignedBy && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleConfirmAction('place', quote)}
                                className="flex items-center gap-1 hover:bg-green-100 text-green-700"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            )}
                            {assignedBy && quote.is_active && showSuspend ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleConfirmAction('suspend', quote)}
                                className="flex items-center gap-1 hover:bg-red-100 text-red-700"
                              >
                                <PowerOff className="h-4 w-4" />
                              </Button>
                            ) : assignedBy && showActivate && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleConfirmAction('activate', quote)}
                                className="flex items-center gap-1 hover:bg-green-100"
                              >
                                <Power className="h-4 w-4" />
                                Activate
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                  {quote.transactions && quote.transactions.length > 0 && (
                    <TableRow>
                      <TableCell colSpan={13} className="p-0">
                        <Collapsible
                          open={openRows.includes(quote.id)}
                          onOpenChange={() => toggleRow(quote.id)}
                        >
                          <CollapsibleTrigger className="w-full px-4 py-2 flex items-center bg-blue-50 hover:bg-blue-100">
                            <span className="text-sm font-medium flex items-center gap-2">
                              {openRows.includes(quote.id) ? (
                                <ChevronUp className="h-4 w-4 text-blue-600" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-blue-600" />
                              )}
                              Transactions ({quote.transactions.length})
                            </span>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="p-4">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Transaction No</TableHead>
                                    <TableHead>Bid Amount</TableHead>
                                    <TableHead>Bid Price</TableHead>
                                    <TableHead>Bid Yield</TableHead>
                                    <TableHead>Offer Yield</TableHead>
                                    <TableHead>Offer Price</TableHead>
                                    <TableHead>Offer Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created On</TableHead>
                                    <TableHead>Actions</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {quote.transactions.map((transaction) => (
                                    <TableRow key={transaction.id}>
                                      <TableCell>{transaction.transaction_no}</TableCell>
                                      <TableCell>{Number(transaction.bid_amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                      <TableCell>{Number(transaction.bid_price).toFixed(4)}</TableCell>
                                      <TableCell>{Number(transaction.bid_yield).toFixed(4)}</TableCell>
                                      <TableCell>{Number(transaction.offer_yield).toFixed(4)}</TableCell>
                                      <TableCell>{Number(transaction.offer_price).toFixed(4)}</TableCell>
                                      <TableCell>{Number(transaction.offer_amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                      <TableCell>
                                        <Badge
                                          variant="outline"
                                          className={
                                            transaction.is_accepted
                                              ? "bg-green-100 text-green-800 border-green-200"
                                              : transaction.is_rejected
                                              ? "bg-red-100 text-red-800 border-red-200"
                                              : transaction.is_pending
                                              ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                              : "bg-gray-100 text-gray-800 border-gray-200"
                                          }
                                        >
                                          {transaction.is_accepted
                                            ? "Accepted"
                                            : transaction.is_rejected
                                            ? "Rejected"
                                            : transaction.is_pending
                                            ? "Pending"
                                            : "Delegated"}
                                        </Badge>
                                      </TableCell>
                                      <TableCell>{formatDate(transaction.created_on)}</TableCell>
                                      <TableCell>
                                        <div className="flex gap-2">
                                          {(activeTab === 'my' || activeTab === 'delegated') && assignedBy && (
                                            <>
                                              <Button 
                                                size="sm" 
                                                variant="outline" 
                                                onClick={() => onMarkTransactionStatus(transaction.id, 'accept')}
                                                disabled={transaction.is_accepted}
                                              >
                                                Accept
                                              </Button>
                                              <Button 
                                                size="sm" 
                                                variant="outline" 
                                                onClick={() => onView(quote)}
                                              >
                                                View
                                              </Button>
                                            </>
                                          )}
                                          {!assignedBy && (
                                            <Button 
                                              size="sm" 
                                              variant="outline" 
                                              onClick={() => onCounterBid(transaction)}
                                              className="flex items-center gap-1"
                                            >
                                              <Plus className="h-3 w-3" />
                                              Counter Bid
                                            </Button>
                                          )}
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })
          )}
        </TableBody>
      </Table>
      </div>

      {/* Edit Quote Drawer */}
      <Sheet open={editDrawerOpen} onOpenChange={setEditDrawerOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Edit Quote</SheetTitle>
            <SheetDescription>
              Modify quote details and parameters. Changes will be automatically calculated.
            </SheetDescription>
          </SheetHeader>
          
          {selectedQuoteForEdit && (() => {
            const selectedBond = bonds.find(b => b.BondIssueNo === selectedQuoteForEdit.bond_issue_no);
            const bidYieldInRange = isYieldInRange(selectedQuoteForEdit.bid_yield || 0, selectedBond);
            const offerYieldInRange = isYieldInRange(selectedQuoteForEdit.offer_yield || 0, selectedBond);
            
            return (
              <div className="space-y-4 mt-6">
                <div className="grid grid-cols-2 gap-3 items-center">
                  <Label className="text-xs font-medium text-gray-600">Placement No</Label>
                  <div className="text-sm font-medium">{selectedQuoteForEdit.placement_no}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 items-center">
                  <Label className="text-xs font-medium text-gray-600">Bond Issue</Label>
                  <div className="text-sm font-medium text-amber-600">{selectedQuoteForEdit.bond_issue_no}</div>
                </div>
                
                {/* Indicative Range Display */}
                {selectedBond && (
                  <div className="grid grid-cols-2 gap-3 items-center">
                    <Label className="text-xs font-medium text-gray-600">Indicative Range</Label>
                    <div className="text-xs font-medium bg-blue-50 px-2 py-1 rounded border border-blue-200">
                      {calculateIndicativeRange(selectedBond)}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-3 items-center">
                  <Label className="text-xs font-medium text-gray-600">Bid Amount (KES)</Label>
                  <Input
                    type="number"
                    value={selectedQuoteForEdit.BidAmount || ''}
                    onChange={(e) => onEdit(selectedQuoteForEdit, 'BidAmount', e.target.value)}
                    className="h-8 border-2 border-blue-200 hover:border-blue-300 focus:border-blue-400 bg-blue-50"
                    placeholder="Enter bid amount"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3 items-center">
                  <Label className="text-xs font-medium text-gray-600 flex items-center">
                    Bid Yield (%)
                    {selectedQuoteForEdit.bid_yield && (
                      <span className={`ml-2 w-3 h-3 rounded-full ${bidYieldInRange ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    )}
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      step="0.0001"
                      value={selectedQuoteForEdit.bid_yield || ''}
                      onChange={(e) => onEdit(selectedQuoteForEdit, 'bid_yield', e.target.value)}
                      className={`h-8 border-2 ${
                        selectedQuoteForEdit.bid_yield 
                          ? bidYieldInRange 
                            ? 'border-green-300 bg-green-50 hover:border-green-400 focus:border-green-500' 
                            : 'border-red-300 bg-red-50 hover:border-red-400 focus:border-red-500'
                          : 'border-green-200 bg-green-50 hover:border-green-300 focus:border-green-400'
                      }`}
                      placeholder="Enter bid yield"
                    />
                    {selectedQuoteForEdit.bid_yield && !bidYieldInRange && (
                      <div className="absolute -bottom-5 left-0 text-xs text-red-600">
                        Outside indicative range
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 items-center mt-6">
                  <Label className="text-xs font-medium text-gray-600">Offer Amount (KES)</Label>
                  <Input
                    type="number"
                    value={selectedQuoteForEdit.OfferAmount || ''}
                    onChange={(e) => onEdit(selectedQuoteForEdit, 'OfferAmount', e.target.value)}
                    className="h-8 border-2 border-purple-200 hover:border-purple-300 focus:border-purple-400 bg-purple-50"
                    placeholder="Enter offer amount"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3 items-center">
                  <Label className="text-xs font-medium text-gray-600 flex items-center">
                    Offer Yield (%)
                    {selectedQuoteForEdit.offer_yield && (
                      <span className={`ml-2 w-3 h-3 rounded-full ${offerYieldInRange ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    )}
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      step="0.0001"
                      value={selectedQuoteForEdit.offer_yield || ''}
                      onChange={(e) => onEdit(selectedQuoteForEdit, 'offer_yield', e.target.value)}
                      className={`h-8 border-2 ${
                        selectedQuoteForEdit.offer_yield 
                          ? offerYieldInRange 
                            ? 'border-green-300 bg-green-50 hover:border-green-400 focus:border-green-500' 
                            : 'border-red-300 bg-red-50 hover:border-red-400 focus:border-red-500'
                          : 'border-orange-200 bg-orange-50 hover:border-orange-300 focus:border-orange-400'
                      }`}
                      placeholder="Enter offer yield"
                    />
                    {selectedQuoteForEdit.offer_yield && !offerYieldInRange && (
                      <div className="absolute -bottom-5 left-0 text-xs text-red-600">
                        Outside indicative range
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 items-center mt-6">
                  <Label className="text-xs font-medium text-gray-600">Settlement Date</Label>
                  <Input
                    type="date"
                    value={selectedQuoteForEdit.settlement_date || ''}
                    onChange={(e) => onEdit(selectedQuoteForEdit, 'settlement_date', e.target.value)}
                    className="h-8 border-2 border-gray-200 hover:border-gray-300 focus:border-gray-400"
                  />
                </div>
              </div>
            );
          })()}
          
          <SheetFooter className="mt-6">
            <div className="flex gap-3 w-full">
              <Button variant="outline" onClick={() => setEditDrawerOpen(false)} className="flex-1">
                Close
              </Button>
              {selectedQuoteForEdit && (
                <Button 
                  onClick={() => {
                    handleConfirmAction('place', selectedQuoteForEdit);
                    setEditDrawerOpen(false);
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Submit Bid
                </Button>
              )}
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmDialog.title}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">{confirmDialog.description}</p>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
            >
              Cancel
            </Button>
            <Button 
              onClick={executeAction}
              className={confirmDialog.type === 'suspend' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
            >
              {confirmDialog.type === 'suspend' ? 'Suspend' : 
               confirmDialog.type === 'activate' ? 'Activate' : 'Place Quote'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}