'use client'

import { MoreHorizontal, Eye, Trash2,Power, PowerOff, Download,ChevronDown,ChevronUp, Plus, User, FileText, Loader2, Settings, Search, Filter, RefreshCw, Calendar, Clock, DollarSign, TrendingUp, ArrowUpDown, CheckCircle2, ExternalLink, BarChart3, PieChart, Info } from "lucide-react"
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


export default function ResearchAssistantTable({ userDetails }: { userDetails: UserData }) {
  


  return (
<div>
  <h1>Research Assistant</h1>
</div>
  );
}

