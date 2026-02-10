'use client'

import { MoreHorizontal, Eye, Trash2,Power, PowerOff, Download,ChevronDown,ChevronUp, Plus, User, FileText, Loader2, Settings, Search, Filter, RefreshCw, Calendar, Clock, DollarSign, TrendingUp, ArrowUpDown, CheckCircle2, ExternalLink, BarChart3, PieChart, Info, AlertTriangle, Calculator, Briefcase, Target, ArrowRight } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getQuotes, createTransaction, getViewingPartyQuotes, activateQuote, suspendQuote, sendToQuoteBook, getStatsTable, markTransactionStatus, getSecondaryMarketBonds, getPrimaryMarketBonds, getBondCalcDetails } from "@/lib/actions/api.actions"
import { ClientSelectionDialog } from "./client-selection-dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import React from "react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import {
  addDays as addDaysHelper,
  daysBetween as daysBetweenHelper,
  calculatePreviousCoupon as calculatePreviousCouponHelper,
  calculateNextCouponDate as calculateNextCouponDateHelper,
  calculateNextCouponDays as calculateNextCouponDaysHelper,
  calculateCouponsDue as calculateCouponsDueHelper,
  calculateBondPrice as calculateBondPriceHelper,
  calculateFinancialValues,
  FinancialRates
} from '@/lib/calculator/bond-math';

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
  NseCommission?: number;
  NseMinCommission?: number;
  CmaLevies?: number;
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

// Helper functions for bond price calculation (imported from shared library)

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
    let faceValue = 0;
    let price = 0;
    
    if (quote.IsBid) {
      faceValue = quote.BidAmount || 0;
      price = quote.bid_price || 0;
    } else if (quote.IsOffer) {
      faceValue = quote.OfferAmount || 0;
      price = quote.offer_price || 0;
    }

    const rates: FinancialRates = {
      nseCommission: bondCalcDetails.NseCommission || 0.00024,
      nseMinCommission: bondCalcDetails.NseMinCommission || 1000,
      cmaLevies: bondCalcDetails.CmaLevies || 0.00011
    };

    // Calculate using shared library
    // Note: detailed tax logic requires clean price separation, using price as proxy for now to maintain commission logic
    const values = calculateFinancialValues(
      faceValue,
      price,
      price, // proxy for clean price
      quote.bond_issue_no,
      0, // term not needed for commissions
      'price',
      0, 0, bondCalcDetails.IfbFiveYrs,
      rates
    );

    return {
      ...quote,
      commission_nse: values.commissionNSE,
      other_levies: values.otherLevies,
      total_payable: values.totalPayable,
      total_receivable: values.totalReceivable,
      consideration: values.consideration,
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
      <div className="rounded-md border border-neutral-200 bg-white">
        <div className="flex justify-between items-center p-4 bg-neutral-50 border-b border-neutral-200">
          <h2 className="text-xl font-bold text-black tracking-tight uppercase">Quote Book</h2>
          <Button onClick={() => setIsPlaceQuoteOpen(true)} className="bg-black text-white hover:bg-neutral-800 font-bold px-6 shadow-md transition-all active:scale-95">
            <Plus className="mr-2 h-4 w-4" /> Place Quote
          </Button>
          <span className="text-neutral-500 font-bold text-sm">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        </div>
        
        <div className="flex justify-between px-4 py-2 bg-white text-xs border-b border-neutral-100">
          <span className="text-neutral-400 font-bold uppercase tracking-widest">Lower bid goes top</span>
          <div className="flex items-center gap-4">
            <Button 
              onClick={fetchQuotes} 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2 bg-white border-neutral-200 text-black hover:bg-neutral-50 font-bold h-7 px-3"
              disabled={isLoading}
            >
              <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <span className="text-neutral-400 font-bold uppercase tracking-widest">Higher Offer goes on top</span>
          </div>
        </div>

        {/* Quick Tips Section */}
        <div className="px-4 mb-4 mt-4">
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center justify-between w-full p-4 bg-neutral-50 border-neutral-200 hover:bg-neutral-100 text-black rounded-xl shadow-sm transition-all"
              >
                <div className="flex items-center">
                  <Info className="h-5 w-5 text-neutral-500 mr-2" />
                  <span className="font-bold text-sm uppercase tracking-wide">Usage Analytics & Quick Tips</span>
                </div>
                <ChevronDown className="h-4 w-4 text-neutral-500" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-black mb-3 flex items-center text-sm uppercase tracking-wider">
                      <div className="bg-black text-white rounded-lg w-6 h-6 flex items-center justify-center text-xs mr-2 font-black">01</div>
                      Quote Identification
                    </h4>
                    <ul className="space-y-2 text-sm text-neutral-600">
                      <li className="flex items-start">
                        <span className="inline-block w-3 h-3 bg-neutral-800 rounded-full mr-2 mt-1 flex-shrink-0"></span>
                        <span><strong>Primary indicators:</strong> Your active submissions</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-3 h-3 bg-neutral-300 rounded-full mr-2 mt-1 flex-shrink-0"></span>
                        <span><strong>Secondary indicators:</strong> Managed delegated entries</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-black mb-3 flex items-center text-sm uppercase tracking-wider">
                      <div className="bg-black text-white rounded-lg w-6 h-6 flex items-center justify-center text-xs mr-2 font-black">02</div>
                      Management Workflow
                    </h4>
                    <ul className="space-y-2 text-sm text-neutral-600">
                      <li className="flex items-start">
                        <span className="text-black mr-2 font-black">→</span>
                        Modify quote yields to trigger real-time re-valuation
                      </li>
                      <li className="flex items-start">
                        <span className="text-black mr-2 font-black">→</span>
                        High contrast text identifies yields within market spread
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
            <TabsList className="grid w-full max-w-[400px] grid-cols-2 bg-neutral-100 p-1 rounded-xl">
              <TabsTrigger 
                value="my" 
                className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm text-neutral-500 font-bold uppercase text-[10px] tracking-widest rounded-lg h-9"
              >
                My Portfolio
              </TabsTrigger>
              <TabsTrigger 
                value="all"
                className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm text-neutral-500 font-bold uppercase text-[10px] tracking-widest rounded-lg h-9"
              >
                Market Stream
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="my" className="pt-2">
            {/* Tab Description */}
            <div className="px-4 mb-4">
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-start space-x-3">
                  <Settings className="h-5 w-5 text-black mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-black mb-1 text-sm uppercase tracking-tight">Active Portfolio Management</h3>
                    <p className="text-xs text-neutral-500 leading-relaxed font-medium">
                      Control center for your active market positions. Edit, activate, or suspend quotes to maintain optimal portfolio liquidity.
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
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-start space-x-3">
                  <BarChart3 className="h-5 w-5 text-black mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-black mb-1 text-sm uppercase tracking-tight">Public Market Stream</h3>
                    <p className="text-xs text-neutral-500 leading-relaxed font-medium">
                      Real-time aggregation of market-wide bond quotes. Engage with public offers and analyze institutional liquidity flow.
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

        <div className="flex justify-between items-center px-4 py-3 bg-neutral-50 border-t border-neutral-200 rounded-b-md">
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
            Index {startIndex + 1} - {Math.min(endIndex, currentQuotes.length)} of {currentQuotes.length} Total
          </span>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-white border-neutral-200 text-black hover:bg-neutral-100 font-bold h-8 px-4 rounded-lg shadow-sm text-xs"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-white border-neutral-200 text-black hover:bg-neutral-100 font-bold h-8 px-4 rounded-lg shadow-sm text-xs"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Place Quote Sheet - Polished & Modern */}
      <Sheet open={isPlaceQuoteOpen} onOpenChange={setIsPlaceQuoteOpen}>
        <SheetContent className="overflow-y-auto w-[500px] sm:w-[600px] bg-white text-black border-l border-neutral-200 p-0">
          <div className="bg-black p-8 text-white relative">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
               <Calculator size={120} />
            </div>
            <SheetHeader className="relative z-10">
              <SheetTitle className="text-2xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Calculator className="h-6 w-6 text-white" />
                </div>
                Place New Quote
              </SheetTitle>
              <SheetDescription className="text-neutral-400 text-base">
                Market entry module for bond placement and RFQ generation.
              </SheetDescription>
            </SheetHeader>
          </div>

          <div className="p-8 space-y-8">
            {/* Market Selection Block */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="h-4 w-4 text-neutral-400" />
                <Label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Market Selection</Label>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-bold text-black">Trading Venue</Label>
                  <Select
                    value={placeQuoteState.marketType}
                    onValueChange={(value: 'secondary' | 'primary') =>
                      setPlaceQuoteState(prev => ({ ...prev, marketType: value, selectedBond: '' }))
                    }
                  >
                    <SelectTrigger className="h-11 border-neutral-200 bg-white text-black focus:ring-black font-bold text-base shadow-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-neutral-200">
                      <SelectItem value="secondary" className="font-medium focus:bg-neutral-100">Secondary Market</SelectItem>
                      <SelectItem value="primary" className="font-medium focus:bg-neutral-100">Primary Auction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-bold text-black">Instrument Selection</Label>
                  <Select
                    value={placeQuoteState.selectedBond}
                    onValueChange={(value) =>
                      setPlaceQuoteState(prev => ({ ...prev, selectedBond: value }))
                    }
                  >
                    <SelectTrigger className="h-11 border-neutral-200 bg-white text-black focus:ring-black font-bold text-base shadow-sm">
                      <SelectValue placeholder="Select Bond Issue..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-neutral-200 max-h-[300px]">
                      {getBondsList().map((bond) => (
                        <SelectItem key={bond.Id} value={bond.Id.toString()} className="font-medium focus:bg-neutral-100">
                          {bond.BondIssueNo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Instrument Data Display */}
            {placeQuoteState.selectedBond && (
              <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-5 space-y-4 shadow-inner">
                <div className="flex items-center gap-2 border-b border-neutral-200 pb-2 mb-2">
                  <Info className="h-4 w-4 text-neutral-400" />
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Live Instrument Data</span>
                </div>
                {(() => {
                  const selectedBond = getBondsList().find(b => b.Id.toString() === placeQuoteState.selectedBond);
                  if (!selectedBond) return null;
                  
                  return (
                    <div className="grid grid-cols-2 gap-y-4">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-bold text-neutral-400 uppercase">Issue Date</Label>
                        <div className="text-sm font-bold text-black">{formatDate(selectedBond.IssueDate)}</div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-bold text-neutral-400 uppercase">Maturity Date</Label>
                        <div className="text-sm font-bold text-black">{formatDate(selectedBond.MaturityDate)}</div>
                      </div>
                      <div className="col-span-2 space-y-1 pt-2 border-t border-neutral-200/50">
                        <Label className="text-[10px] font-bold text-neutral-400 uppercase">Current Indicative Range</Label>
                        <div className="text-lg font-black text-black tracking-tight">{calculateIndicativeRange(selectedBond)}</div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            <Separator className="bg-neutral-100" />

            {/* Quote Configuration */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-neutral-400" />
                <Label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Quote Parameters</Label>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-black">Direction</Label>
                  <RadioGroup
                    value={placeQuoteState.quoteType}
                    onValueChange={(value: 'bid' | 'offer') =>
                      setPlaceQuoteState(prev => ({ ...prev, quoteType: value }))
                    }
                    className="flex gap-4"
                  >
                    <div className={cn(
                      "flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all shadow-sm",
                      placeQuoteState.quoteType === 'bid' ? "border-black bg-black text-white" : "border-neutral-100 bg-neutral-50 text-neutral-500 hover:border-neutral-200"
                    )} onClick={() => setPlaceQuoteState(prev => ({ ...prev, quoteType: 'bid' }))}>
                      <RadioGroupItem value="bid" id="bid" className="sr-only" />
                      <Label htmlFor="bid" className="cursor-pointer font-black uppercase text-xs tracking-widest">Bid (Buy)</Label>
                    </div>
                    <div className={cn(
                      "flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all shadow-sm",
                      placeQuoteState.quoteType === 'offer' ? "border-black bg-black text-white" : "border-neutral-100 bg-neutral-50 text-neutral-500 hover:border-neutral-200"
                    )} onClick={() => setPlaceQuoteState(prev => ({ ...prev, quoteType: 'offer' }))}>
                      <RadioGroupItem value="offer" id="offer" className="sr-only" />
                      <Label htmlFor="offer" className="cursor-pointer font-black uppercase text-xs tracking-widest">Offer (Sell)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-bold text-black">Settlement Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <Input
                        type="date"
                        value={placeQuoteState.settlementDate}
                        onChange={(e) => setPlaceQuoteState(prev => ({ ...prev, settlementDate: e.target.value }))}
                        className="h-11 pl-10 border-neutral-200 bg-white text-black font-bold focus:border-black shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-bold text-black">
                      Target Yield (%)
                    </Label>
                    <div className="relative">
                      <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <Input
                        type="number"
                        step="0.0001"
                        value={placeQuoteState.quoteType === 'bid' ? placeQuoteState.bidYield : placeQuoteState.offerYield}
                        onChange={(e) =>
                          setPlaceQuoteState(prev => ({ 
                            ...prev, 
                            [placeQuoteState.quoteType === 'bid' ? 'bidYield' : 'offerYield']: e.target.value 
                          }))
                        }
                        className="h-11 pl-10 border-neutral-200 bg-white text-black font-black focus:border-black shadow-sm text-lg"
                        placeholder="0.0000"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-bold text-black">Face Value (KES)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <Input
                        type="number"
                        value={placeQuoteState.quoteType === 'bid' ? placeQuoteState.bidAmount : placeQuoteState.offerAmount}
                        onChange={(e) =>
                          setPlaceQuoteState(prev => ({ 
                            ...prev, 
                            [placeQuoteState.quoteType === 'bid' ? 'bidAmount' : 'offerAmount']: e.target.value 
                          }))
                        }
                        className="h-11 pl-10 border-neutral-200 bg-white text-black font-black focus:border-black shadow-sm"
                        placeholder="Amount"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black text-white flex items-center justify-between shadow-lg mt-2 border border-white/10">
                  <div className="space-y-0.5">
                    <Label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Calculated Valuation</Label>
                    <div className="text-sm font-medium text-neutral-300">Clean Price Approximation</div>
                  </div>
                  <div className="text-2xl font-black text-white tracking-tighter">
                    {(placeQuoteState.quoteType === 'bid' ? calculatedBidPrice : calculatedOfferPrice).toFixed(6)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <SheetFooter className="p-8 sticky bottom-0 bg-white border-t border-neutral-200 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
            <div className="grid grid-cols-2 gap-4 w-full">
              <Button 
                variant="outline"
                onClick={resetPlaceQuoteForm}
                disabled={isSubmitting}
                className="h-12 border-neutral-200 text-black hover:bg-neutral-50 font-bold text-base transition-all active:scale-95 bg-white"
              >
                Reset Module
              </Button>
              <Button 
                onClick={handlePlaceQuote}
                disabled={isSubmitting || !placeQuoteState.selectedBond}
                className="h-12 bg-black text-white hover:bg-neutral-800 font-bold text-base transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xl"
              >
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Place Quote <ArrowRight className="h-4 w-4" /></>}
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Counter Bid Dialog */}
      <Dialog open={isCounterBidOpen} onOpenChange={setIsCounterBidOpen}>
        <DialogContent className="max-w-md bg-white border-neutral-200 text-black p-0 overflow-hidden shadow-2xl rounded-2xl">
          <div className="bg-black p-6 text-white">
            <DialogHeader>
              <DialogTitle className="text-white font-bold text-xl uppercase tracking-tight">Counter Bid Entry</DialogTitle>
            </DialogHeader>
          </div>
          <div className="p-6">
            {counterBidState && (
              <div className="grid gap-6 py-2">
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 border-dashed">
                  <Label className="text-neutral-500 font-bold uppercase text-[10px] block mb-1">Targeting Transaction</Label>
                  <div className="text-sm text-black font-black">
                    REF: {counterBidState.originalTransaction.transaction_no}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-black uppercase">New Bid Yield (%)</Label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={counterBidState.newBidYield}
                      onChange={(e) =>
                        setCounterBidState(prev => prev ? { ...prev, newBidYield: e.target.value } : null)
                      }
                      className="h-10 border-neutral-200 bg-white text-black font-black focus:border-black"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-black uppercase">New Bid Amount</Label>
                    <Input
                      type="number"
                      value={counterBidState.newBidAmount}
                      onChange={(e) =>
                        setCounterBidState(prev => prev ? { ...prev, newBidAmount: e.target.value } : null)
                      }
                      className="h-10 border-neutral-200 bg-white text-black font-black focus:border-black"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-black uppercase">New Offer Yield (%)</Label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={counterBidState.newOfferYield}
                      onChange={(e) =>
                        setCounterBidState(prev => prev ? { ...prev, newOfferYield: e.target.value } : null)
                      }
                      className="h-10 border-neutral-200 bg-white text-black font-black focus:border-black"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-black uppercase">New Offer Amount</Label>
                    <Input
                      type="number"
                      value={counterBidState.newOfferAmount}
                      onChange={(e) =>
                        setCounterBidState(prev => prev ? { ...prev, newOfferAmount: e.target.value } : null)
                      }
                      className="h-10 border-neutral-200 bg-white text-black font-black focus:border-black"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="p-6 bg-neutral-50 border-t border-neutral-200">
            <Button variant="outline" onClick={() => setIsCounterBidOpen(false)} className="border-neutral-200 bg-white text-black hover:bg-neutral-100 font-bold h-11 px-6 rounded-xl">
              Cancel
            </Button>
            <Button onClick={submitCounterBid} disabled={isSubmitting} className="bg-black text-white hover:bg-neutral-800 font-bold h-11 px-8 rounded-xl shadow-lg">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit Counter Offer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Quote Sheet */}
      <Sheet open={isViewOpen} onOpenChange={setIsViewOpen}>
        <SheetContent className="sm:max-w-[500px] bg-white border-l border-neutral-200 text-black p-0">
          <div className="bg-neutral-900 p-8 text-white">
            <SheetHeader>
              <SheetTitle className="text-white font-bold text-xl uppercase tracking-tighter">Instrument Profile</SheetTitle>
              <SheetDescription className="text-neutral-400">
                Detailed valuation and transactional parameters
              </SheetDescription>
            </SheetHeader>
          </div>
          <ScrollArea className="h-[calc(100vh-180px)] p-8">
            {selectedQuote && (
              <div className="grid gap-8">
                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-6 bg-neutral-50 p-5 rounded-2xl border border-neutral-200 shadow-sm">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Placement ID</Label>
                    <div className="text-sm font-black text-black">{selectedQuote.placement_no}</div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Bond Issue</Label>
                    <div className="text-sm font-black text-black">{selectedQuote.bond_issue_no}</div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Settlement</Label>
                    <div className="text-sm font-black text-black">{formatDate(selectedQuote.settlement_date)}</div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Quote Mode</Label>
                    <div className="mt-1">
                      <Badge variant="outline" className={cn(
                        "font-black text-[10px] uppercase border-none rounded-md px-2 py-0.5",
                        selectedQuote.IsBid ? "bg-black text-white" : "bg-neutral-200 text-black"
                      )}>
                        {selectedQuote.IsBid ? "Buy / Bid" : "Sell / Offer"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Quote Block */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-black uppercase tracking-widest flex items-center gap-2">
                    <div className="h-1 w-4 bg-black rounded-full" />
                    Market Pricing
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-200 shadow-sm">
                      <h5 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Buy Side (Bid)</h5>
                      <div className="space-y-2.5 pt-1">
                        <div className="flex justify-between items-end border-b border-neutral-200 pb-2">
                          <Label className="text-[10px] font-bold text-neutral-500 uppercase">Amount</Label>
                          <div className="text-sm font-black text-black">{(selectedQuote.BidAmount || 0).toLocaleString()}</div>
                        </div>
                        <div className="flex justify-between items-end border-b border-neutral-200 pb-2">
                          <Label className="text-[10px] font-bold text-neutral-500 uppercase">Yield</Label>
                          <div className="text-sm font-black text-black">{Number(selectedQuote.bid || 0).toFixed(4)}%</div>
                        </div>
                        <div className="flex justify-between items-end">
                          <Label className="text-[10px] font-bold text-neutral-500 uppercase">Price</Label>
                          <div className="text-sm font-black text-black">{Number(selectedQuote.bid_price || 0).toFixed(6)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-200 shadow-sm">
                      <h5 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Sell Side (Offer)</h5>
                      <div className="space-y-2.5 pt-1">
                        <div className="flex justify-between items-end border-b border-neutral-200 pb-2">
                          <Label className="text-[10px] font-bold text-neutral-500 uppercase">Amount</Label>
                          <div className="text-sm font-black text-black">{(selectedQuote.OfferAmount || 0).toLocaleString()}</div>
                        </div>
                        <div className="flex justify-between items-end border-b border-neutral-200 pb-2">
                          <Label className="text-[10px] font-bold text-neutral-500 uppercase">Yield</Label>
                          <div className="text-sm font-black text-black">{Number(selectedQuote.offer || 0).toFixed(4)}%</div>
                        </div>
                        <div className="flex justify-between items-end">
                          <Label className="text-[10px] font-bold text-neutral-500 uppercase">Price</Label>
                          <div className="text-sm font-black text-black">{Number(selectedQuote.offer_price || 0).toFixed(6)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-black uppercase tracking-widest flex items-center gap-2">
                    <div className="h-1 w-4 bg-black rounded-full" />
                    Financial Disclosure
                  </h4>
                  <div className="bg-white border-2 border-black rounded-2xl p-5 shadow-[8px_8px_0px_rgba(0,0,0,0.05)]">
                    {(() => {
                      const amount = selectedQuote.IsBid ? selectedQuote.BidAmount : selectedQuote.OfferAmount;
                      const price = selectedQuote.IsBid ? selectedQuote.bid_price : selectedQuote.offer_price;
                      const consideration = (amount ?? 0) * (price ?? 0) / 100;
                      const commission = Math.max(consideration * 0.00024, 1000);
                      const otherLevies = consideration * 0.00011;
                      const totalPayable = consideration + commission + otherLevies;
                      const totalReceivable = consideration - commission - otherLevies;

                      return (
                        <div className="space-y-4">
                          <div className="flex justify-between items-end pb-3 border-b border-neutral-100">
                            <Label className="text-[10px] font-bold text-neutral-400 uppercase">Consideration</Label>
                            <div className="text-base font-black text-black">{formatCurrency(consideration)}</div>
                          </div>
                          <div className="flex justify-between items-end pb-3 border-b border-neutral-100">
                            <div className="space-y-0.5">
                              <Label className="text-[10px] font-bold text-neutral-400 uppercase block">Brokerage (NSE)</Label>
                              <span className="text-[9px] text-neutral-400">0.024% (Min KES 1,000)</span>
                            </div>
                            <div className="text-sm font-bold text-black">{formatCurrency(commission)}</div>
                          </div>
                          <div className="flex justify-between items-end pb-3 border-b border-neutral-100">
                            <div className="space-y-0.5">
                              <Label className="text-[10px] font-bold text-neutral-400 uppercase block">Regulatory Levies (CMA)</Label>
                              <span className="text-[9px] text-neutral-400">0.011% Total</span>
                            </div>
                            <div className="text-sm font-bold text-black">{formatCurrency(otherLevies)}</div>
                          </div>
                          <div className="flex justify-between items-center pt-2">
                            <Label className="text-sm font-black text-black uppercase">Net Total</Label>
                            <div className="text-2xl font-black text-black tracking-tighter">
                              {formatCurrency(selectedQuote.IsBid ? totalPayable : totalReceivable)}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
          <SheetFooter className="p-8 border-t border-neutral-200">
            <Button onClick={() => setIsViewOpen(false)} className="w-full bg-black text-white hover:bg-neutral-800 font-black h-12 rounded-xl text-base transition-all active:scale-95 shadow-xl">
              DONE
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

  const executeConfirmAction = () => {
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

    setConfirmDialog({ ...confirmDialog, open: false });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-black opacity-20" />
        <span className="ml-3 font-medium text-neutral-500">Loading quotes...</span>
      </div>
    );
  }

  if (!quotes || quotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-neutral-500 bg-neutral-50 rounded-xl border border-neutral-200 mt-4">
        <FileText className="h-12 w-12 mb-4 opacity-20" />
        <p className="font-bold uppercase tracking-widest text-xs">No entries detected</p>
        <p className="text-xs mt-1">Adjust filters or initialize a new placement.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50 border-b border-neutral-200 hover:bg-neutral-50">
              <TableHead className="w-[50px] font-bold text-black uppercase text-[10px] tracking-widest">#</TableHead>
              <TableHead className="font-bold text-black uppercase text-[10px] tracking-widest">Instrument</TableHead>
              <TableHead className="font-bold text-black uppercase text-[10px] tracking-widest">Settlement</TableHead>
              <TableHead className="text-center font-bold text-black uppercase text-[10px] tracking-widest bg-neutral-100/50">Bid (Buy)</TableHead>
              <TableHead className="text-center font-bold text-black uppercase text-[10px] tracking-widest bg-neutral-100/50">Offer (Sell)</TableHead>
              <TableHead className="text-right font-bold text-black uppercase text-[10px] tracking-widest">Status</TableHead>
              <TableHead className="text-right font-bold text-black uppercase text-[10px] tracking-widest">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.map((quote, index) => (
              <React.Fragment key={quote.id}>
                <TableRow className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                  <TableCell className="font-bold text-neutral-300 text-xs tracking-tighter">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-black text-black text-sm tracking-tight">{quote.bond_issue_no}</span>
                      <span className="text-[10px] text-neutral-400 font-bold uppercase">{quote.placement_no}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-black font-bold text-xs">{formatDate(quote.settlement_date)}</TableCell>
                  
                  {/* Bid Column */}
                  <TableCell className="bg-neutral-50/30">
                    {quote.IsBid ? (
                      <div className="flex flex-col items-center">
                        <span className="font-black text-black text-lg tracking-tighter">{Number(quote.bid).toFixed(4)}%</span>
                        <div className="flex flex-col items-center text-[10px] text-neutral-500 font-bold">
                          <span>KES {formatCurrency(quote.BidAmount || 0)}</span>
                          <span className="text-[9px] opacity-60">PRC: {Number(quote.bid_price).toFixed(4)}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-center text-neutral-200 opacity-20 font-black">---</div>
                    )}
                  </TableCell>

                  {/* Offer Column */}
                  <TableCell className="bg-neutral-50/30">
                    {quote.IsOffer ? (
                      <div className="flex flex-col items-center">
                        <span className="font-black text-black text-lg tracking-tighter">{Number(quote.offer).toFixed(4)}%</span>
                        <div className="flex flex-col items-center text-[10px] text-neutral-500 font-bold">
                          <span>KES {formatCurrency(quote.OfferAmount || 0)}</span>
                          <span className="text-[9px] opacity-60">PRC: {Number(quote.offer_price).toFixed(4)}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-center text-neutral-200 opacity-20 font-black">---</div>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <Badge variant="outline" className={cn(
                      "font-black text-[10px] uppercase border-2 px-3 py-0.5 rounded-md tracking-tighter transition-all",
                      quote.is_active 
                        ? "bg-black text-white border-black" 
                        : "bg-white text-neutral-300 border-neutral-100"
                    )}>
                      {quote.is_active ? "Live" : "Suspended"}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {showEdit && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditClick(quote)}
                          className="h-8 border-neutral-200 text-black hover:bg-neutral-50 font-black text-[10px] uppercase tracking-widest rounded-lg shadow-sm"
                        >
                          Modify
                        </Button>
                      )}
                      
                      {showView && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => onView(quote)}
                          className="h-8 w-8 p-0 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-lg transition-all"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}

                      {(showSubmitBid && quote.is_active) && (
                        <Button 
                          size="sm" 
                          onClick={() => handleConfirmAction('place', quote)}
                          className="h-8 bg-black text-white hover:bg-neutral-800 font-black text-[10px] uppercase tracking-widest rounded-lg shadow-lg transition-all active:scale-90"
                        >
                          Place
                        </Button>
                      )}

                      {showSuspend && quote.is_active && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleConfirmAction('suspend', quote)}
                          className="h-8 w-8 p-0 text-neutral-300 hover:text-black hover:bg-neutral-50 rounded-lg transition-all"
                        >
                          <PowerOff className="h-4 w-4" />
                        </Button>
                      )}

                      {showActivate && !quote.is_active && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleConfirmAction('activate', quote)}
                          className="h-8 w-8 p-0 text-neutral-300 hover:text-black hover:bg-neutral-50 rounded-lg transition-all"
                        >
                          <Power className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
        <DialogContent className="bg-white border-neutral-200 text-black p-0 overflow-hidden shadow-2xl rounded-2xl">
          <div className="bg-black p-6 text-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-white font-black uppercase tracking-tight">
                <AlertTriangle className="h-5 w-5 text-neutral-400" />
                {confirmDialog.title}
              </DialogTitle>
            </DialogHeader>
          </div>
          <div className="p-8">
            <p className="text-black font-medium leading-relaxed">{confirmDialog.description}</p>
          </div>
          <DialogFooter className="p-6 bg-neutral-50 border-t border-neutral-100 flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
              className="flex-1 border-neutral-200 text-black hover:bg-white font-bold h-11 rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              onClick={executeConfirmAction}
              className="flex-1 bg-black text-white hover:bg-neutral-800 font-bold h-11 rounded-xl shadow-lg"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Drawer */}
      <Sheet open={editDrawerOpen} onOpenChange={setEditDrawerOpen}>
        <SheetContent className="overflow-y-auto w-[500px] sm:w-[600px] bg-white text-black border-l border-neutral-200 p-0">
          <div className="bg-neutral-900 p-8 text-white relative shadow-xl">
            <SheetHeader>
              <SheetTitle className="text-xl font-bold text-white uppercase tracking-tighter">Edit active Quote</SheetTitle>
              <SheetDescription className="text-neutral-400">
                Modify transactional parameters for this instrument
              </SheetDescription>
            </SheetHeader>
          </div>

          {selectedQuoteForEdit && (
            <div className="grid gap-8 p-8">
              {/* Quote Information */}
              <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Bond Issue</Label>
                    <div className="font-black text-black text-lg tracking-tight">{selectedQuoteForEdit.bond_issue_no}</div>
                  </div>
                  <div>
                    <Label className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Settlement</Label>
                    <div className="font-black text-black text-lg tracking-tight">{formatDate(selectedQuoteForEdit.settlement_date)}</div>
                  </div>
                </div>
              </div>

              {/* Edit Fields */}
              <div className="space-y-6">
                <div className="space-y-4 bg-white p-5 rounded-2xl border-2 border-neutral-100 shadow-sm">
                  <h4 className="font-black text-black uppercase text-xs tracking-widest flex items-center gap-2">
                    <div className="h-1 w-3 bg-black" /> Bid Parameters
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-neutral-500 uppercase">Yield (%)</Label>
                      <Input
                        type="number"
                        step="0.0001"
                        value={selectedQuoteForEdit.bid}
                        onChange={(e) => onEdit(selectedQuoteForEdit, 'bid', e.target.value)}
                        className="h-11 border-neutral-200 bg-white text-black font-black text-lg focus:border-black shadow-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-neutral-500 uppercase">Face Value</Label>
                      <Input
                        type="number"
                        value={selectedQuoteForEdit.BidAmount}
                        onChange={(e) => onEdit(selectedQuoteForEdit, 'BidAmount', e.target.value)}
                        className="h-11 border-neutral-200 bg-white text-black font-black focus:border-black shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 bg-white p-5 rounded-2xl border-2 border-neutral-100 shadow-sm">
                  <h4 className="font-black text-black uppercase text-xs tracking-widest flex items-center gap-2">
                    <div className="h-1 w-3 bg-neutral-300" /> Offer Parameters
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-neutral-500 uppercase">Yield (%)</Label>
                      <Input
                        type="number"
                        step="0.0001"
                        value={selectedQuoteForEdit.offer}
                        onChange={(e) => onEdit(selectedQuoteForEdit, 'offer', e.target.value)}
                        className="h-11 border-neutral-200 bg-white text-black font-black text-lg focus:border-black shadow-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-neutral-500 uppercase">Face Value</Label>
                      <Input
                        type="number"
                        value={selectedQuoteForEdit.OfferAmount}
                        onChange={(e) => onEdit(selectedQuoteForEdit, 'OfferAmount', e.target.value)}
                        className="h-11 border-neutral-200 bg-white text-black font-black focus:border-black shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <SheetFooter className="p-8 sticky bottom-0 bg-white pt-4 border-t border-neutral-200 pb-8">
            <Button 
              onClick={() => setEditDrawerOpen(false)}
              className="w-full bg-black text-white hover:bg-neutral-800 font-black h-12 rounded-xl text-base tracking-widest transition-all active:scale-95 shadow-xl"
            >
              SAVE & UPDATE
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}