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


export default function ResearchAssistantTable({ userDetails }: { userDetails: UserData }) {
  


  return (
<div>
  <h1>Research Assistant</h1>
</div>
  );
}

