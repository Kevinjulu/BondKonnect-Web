"use client"

import { useState, useEffect, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Search,
  Share2,
  Copy,
  Twitter,
  Linkedin,
  Facebook,
  Plus,
  BookOpen,
  Layers,
  BarChart3,
  ChevronRight,
  X,
  Landmark,
  Coins,
  TrendingUp,
  AlertTriangle,
  Banknote,
  TrendingDown,
  Scale,
  Trophy,
  FileText,
  CircleDollarSign,
  Hourglass,
  Calendar,
  Droplets,
  Briefcase
} from "lucide-react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

export function GlossaryComponent() {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredTerms, setFilteredTerms] = useState<Record<string, Array<any>>>({})

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

  const categories = ["Market Snapshot", "Bond Screens", "Portfolio Assistant & Scorecard"]

  const glossaryTerms = useMemo(() => ({
    O: [
      {
        id: "obi-k-index",
        title: "OBI (K) Index",
        category: "Market Snapshot",
        resources: 3,
        description:
          "On-the-Run Bonds Index (OBI): is an index comprising listed on-the-run (OTR) fixed rate (non-callable) Kenya Government bonds; it simulates a laddered portfolio invested equally in prevailing on-the-run Treasury bonds of all maturities.",
        icon: BarChart3,
      },
    ],
    C: [
      {
        id: "cbr",
        title: "CBR",
        category: "Market Snapshot",
        resources: 1,
        description:
          "The Central Bank Rate (CBR) is the policy rate set by the Central Bank in guiding monetary policy.",
        icon: Landmark,
      },
      {
        id: "coupon",
        title: "Coupon",
        category: "Bond Screens",
        resources: 1,
        description:
          "Shows the periodic interest payable to the bondholder usually semi-annually (gross of withholding tax) stated as a percent of the bond's par value of 100.",
        icon: Coins,
      },
      {
        id: "convexity",
        title: "Convexity",
        category: "Bond Screens",
        resources: 1,
        description: "Shows how the duration of a bond changes given a unit change in interest rates.",
        icon: TrendingUp,
      },
      {
        id: "credit-risk",
        title: "Credit Risk",
        category: "Bond Screens",
        resources: 3,
        description:
          "Credit risk is essentially the default risk associated with holding listed corporate bonds. This risk is derived through estimating the probability of default (PD) by working out the z-score for each corporate bond using the Emerging Market Model (EMM).",
        icon: AlertTriangle,
      },
      {
        id: "coupon-paid",
        title: "Coupon Paid",
        category: "Portfolio Assistant & Scorecard",
        resources: 1,
        description:
          "This reflects The actual coupons received between the time of bond purchase and the current value date.",
        icon: Banknote,
      },
    ],
    S: [
      {
        id: "spot-rate",
        title: "Spot Rate",
        category: "Market Snapshot",
        resources: 2,
        description: "Reflects the prevailing market yield of a given bond at the time specified by the value date.",
        icon: TrendingDown,
      },
      {
        id: "sharpe-ratio",
        title: "Sharpe Ratio",
        category: "Portfolio Assistant & Scorecard",
        resources: 2,
        description:
          "Indicates the average portfolio return earned in excess of the risk-free rate per unit of volatility or total risk. Higher Sharpe ratio means better portfolio performance relative to the risk free rate.",
        icon: BarChart3,
      },
    ],
    Y: [
      {
        id: "yield-curve-graphs",
        title: "Yield Curve Graphs",
        category: "Market Snapshot",
        resources: 4,
        description:
          "The Yield Curve is derived from traded prices recorded over a 5-day window using a Nielson Siegel Svensson (NSS) Model.",
        icon: TrendingUp,
      },
    ],
    B: [
      {
        id: "barbell-vs-bullet",
        title: "Barbell vs Bullet Indicators",
        category: "Bond Screens",
        resources: 2,
        description:
          "Barbell strategy - optimizes duration by selecting the two of the most liquid bonds with shortest and longest tenors respectively; Bullet Strategy - indicates the bonds that are closest in proximity to the average duration of the Barbell strategy.",
        icon: Scale,
      },
      {
        id: "bond-screens",
        title: "Bond Screens",
        category: "Bond Screens",
        resources: 1,
        description:
          "Bond screening is by Expected Return is by liquidity (Top 5 of the most liquid bonds); and by Duration especially for portfolios managers that are looking to buy bonds with particular duration or alternatively to immunize their portfolios with specific duration.",
        icon: Search,
      },
      {
        id: "batting-average",
        title: "Batting Average",
        category: "Portfolio Assistant & Scorecard",
        resources: 1,
        description:
          "Indicates the percentage of time a bond portfolio outperforms the OBI index on a month-to-month basis; looking back over a minimum of 3 months and a maximum of 12 months depending on the age of the portfolio.",
        icon: Trophy,
      },
    ],
    Q: [
      {
        id: "quoted-yield",
        title: "Quoted Yield",
        category: "Bond Screens",
        resources: 3,
        description:
          "Indicates the type of Bond according to its expected cash flows and redemption; YTM – for bonds with fixed coupons and whose principal is redeemable at maturity their respective yield-to-maturity (YTM) rate is the quoted spot rate.",
        icon: FileText,
      },
    ],
    D: [
      {
        id: "dirty-price",
        title: "Dirty Price",
        category: "Bond Screens",
        resources: 2,
        description:
          "This is the price (P) of the bond inclusive of its accrued interest in the respective currency of the bond issue.",
        icon: CircleDollarSign,
      },
      {
        id: "dtm-yrs",
        title: "DTM (Yrs)",
        category: "Bond Screens",
        resources: 1,
        description:
          "Duration to maturity (DTM) of the bond (in years) i.e. number of years until the bond matures and its principal amount becomes due for redemption.",
        icon: Hourglass,
      },
      {
        id: "dv01",
        title: "DV01",
        category: "Bond Screens",
        resources: 1,
        description:
          "The dollar duration (DV01), indicates the sensitivity of a bond's price to a basis point (0.01%) change in interest rates.",
        icon: BarChart3,
      },
    ],
    N: [
      {
        id: "next-cpn-days",
        title: "Next Cpn (Days)",
        category: "Bond Screens",
        resources: 1,
        description:
          "Time in days between the stated value date and the Next Coupon (Cpn) payment date i.e. number of days to the next coupon payment date.",
        icon: Calendar,
      },
    ],
    M: [
      {
        id: "modified-duration",
        title: "Modified Duration",
        category: "Bond Screens",
        resources: 2,
        description:
          "Indicates the % loss (sensitivity) in bond price due to a 1% change in interest rates. In our model, interest rate change is based on the projected change in the CBR rate.",
        icon: TrendingDown,
      },
    ],
    E: [
      {
        id: "expected-return",
        title: "Expected Return",
        category: "Bond Screens",
        resources: 2,
        description:
          "Depicts the forward looking (ex-ante) annual expected return for a bond given its price sensitivity to changes in interest rates (as per CBR rate projections).",
        icon: TrendingDown,
      },
      {
        id: "expected-shortfall",
        title: "Expected Shortfall",
        category: "Bond Screens",
        resources: 1,
        description:
          "Expected shortfall (ES) for a particular time period is measured by determining the most extreme loss incurred by liquid bonds (those ranked LL or L) over the last 12 months.",
        icon: TrendingDown,
      },
    ],
    L: [
      {
        id: "liquidity-lqd-rank",
        title: "Liquidity (LQD) Rank",
        category: "Bond Screens",
        resources: 2,
        description:
          "LL – High Liquidity (traded 24 times and over the last 12 months; doing at least four trades in each respective quarter - as per Basel IV guidelines). L – Moderate Liquidity (traded at least 100 times in the last 12 months; but traded less than four times in some of the prevailing quarters).",
        icon: Droplets,
      },
    ],
    P: [
      {
        id: "portfolio-value",
        title: "Portfolio Value (KES)",
        category: "Portfolio Assistant & Scorecard",
        resources: 1,
        description:
          "Demonstrates The total market value of the bond portfolio based on prevailing market prices for Held-for-Sale (HFS) and Available-for-Sale (AFS) bonds in addition to buying prices for Held-to-Maturity (HTM) bonds.",
        icon: Briefcase,
      },
    ],
    T: [
      {
        id: "total-return",
        title: "Total Return (TR)",
        category: "Portfolio Assistant & Scorecard",
        resources: 2,
        description:
          "Measures the backward looking (ex post) return for a bond (as well as for the OBI Index) given its historical price momentum and coupons paid between the time of bond purchase and the current value date for a period not exceeding one year.",
        icon: TrendingUp,
      },
    ],
    I: [
      {
        id: "information-ratio",
        title: "Information Ratio",
        category: "Portfolio Assistant & Scorecard",
        resources: 2,
        description:
          "Information ratio is the average portfolio return earned in excess of the OBI Index performance benchmark. Higher information ratio means better portfolio performance relative to the OBI benchmark.",
        icon: BarChart3,
      },
    ],
  }), [])

  const termDetails: any = {
    "obi-k-index": {
      title: "OBI (K) Index",
      description:
        "On-the-Run Bonds Index (OBI): is an index comprising listed on-the-run (OTR) fixed rate (non-callable) Kenya Government bonds; it simulates a laddered portfolio invested equally in prevailing on-the-run Treasury bonds of all maturities.",
      category: "Market Snapshot",
      resources: 3,
      sections: [
        {
          id: "what-is",
          title: "What is OBI (K) Index?",
          content:
            "On-the-Run Bonds Index (OBI): is an index comprising listed on-the-run (OTR) fixed rate (non-callable) Kenya Government bonds; it simulates a laddered portfolio invested equally in prevailing on-the-run Treasury bonds of all maturities.",
        },
        {
          id: "conceptual-framework",
          title: "Conceptual Framework",
          content: `The OBI (K) Index is calculated as follows:

$$On-the-run\ Bond\ Index\ (OBI) = OBI_t = \frac{\bar{A}_t}{\bar{A}_0} \times 100$$

$$\bar{A}_t = \frac{1}{n}\sum_{i=1}^{n}A_n$$

Where:
- n = number of on-the-run bonds at a given time t
- A_n = prevailing prices of the on-the-run (OTR) bonds at time t
- Ā_t = Average price of all the prevailing OTR bonds at time t
- Ā_0 = Average price of all the prevailing OTR bonds at the inception date of indexing; which in this case is 1st Nov 2019.`,
        },
      ],
      relatedTopics: ["Yield Curve", "CBR", "Spot Rate"],
    },
  }

  const getAllTerms = () => {
    const terms: Array<any> = [];
    Object.keys(glossaryTerms).forEach((letter) => {
      glossaryTerms[letter as keyof typeof glossaryTerms].forEach((term) => {
        terms.push(term)
      })
    })
    return terms;
  }

  const getTermsByCategory = (category: string) => {
    const categoryTerms: Array<any> = [];
    Object.keys(glossaryTerms).forEach((letter) => {
      glossaryTerms[letter as keyof typeof glossaryTerms].forEach((term) => {
        if (term.category === category) {
          categoryTerms.push(term)
        }
      })
    })
    return categoryTerms
  }

  useEffect(() => {
    if (searchQuery) {
      const filtered: Record<string, Array<any>> = {}
      Object.keys(glossaryTerms).forEach((letter) => {
        const terms = glossaryTerms[letter as keyof typeof glossaryTerms].filter(
          (term) =>
            term.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            term.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            term.category.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        if (terms.length > 0) {
          filtered[letter] = terms
        }
      })
      setFilteredTerms(filtered)
    } else {
      setFilteredTerms(glossaryTerms)
    }
  }, [searchQuery, glossaryTerms])

  const handleTermClick = (termId: string) => {
    setSelectedTerm(termId)
    setIsDialogOpen(true)
  }

  const getDisplayedTerms = () => {
    if (selectedCategory) return getTermsByCategory(selectedCategory)
    if (selectedLetter) {
      const terms = searchQuery ? filteredTerms : glossaryTerms
      return terms[selectedLetter as keyof typeof terms] || []
    }
    return getAllTerms()
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 bg-white text-black p-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-neutral-100 pb-10">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-black tracking-tight flex items-center gap-3">
            <BookOpen className="h-10 w-10" /> Financial Glossary
          </h1>
          <p className="text-neutral-500 text-lg font-medium max-w-2xl">
            A comprehensive guide to bond market terminology, indices, and financial metrics.
          </p>
        </div>
        <Button 
          className="bg-black text-white hover:bg-neutral-800 font-bold px-8 h-14 rounded-2xl shadow-xl flex items-center gap-3 active:scale-95 transition-all"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="h-5 w-5" /> New Glossary Item
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-10">
          {/* Search & Filter Bar */}
          <div className="flex flex-col gap-6">
            <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden group focus-within:border-black transition-all">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 group-focus-within:text-black transition-colors" />
              <Input
                placeholder="Search terms, categories, or descriptions..."
                className="pl-14 h-16 border-none focus-visible:ring-0 text-lg font-medium text-black placeholder:text-neutral-300 bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-5 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-100 rounded-full transition-colors"
                >
                  <X className="h-4 w-4 text-neutral-400" />
                </button>
              )}
            </div>

            {/* Alphabet Filter */}
            <div className="flex flex-wrap items-center gap-1.5 py-4 border-y border-neutral-100">
              <button
                className={cn(
                  "px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                  !selectedLetter && !selectedCategory 
                    ? "bg-black text-white shadow-lg"
                    : "bg-neutral-50 text-neutral-400 hover:bg-neutral-100 hover:text-black"
                )}
                onClick={() => { setSelectedLetter(null); setSelectedCategory(null); }}
              >
                All
              </button>
              <div className="w-px h-6 bg-neutral-200 mx-2 hidden sm:block" />
              {alphabet.map((letter) => {
                const hasTerms = (searchQuery ? (filteredTerms as any) : (glossaryTerms as any))[letter];
                return (
                  <button
                    key={letter}
                    disabled={!hasTerms}
                    className={cn(
                      "w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all",
                      selectedLetter === letter
                        ? "bg-black text-white shadow-lg"
                        : hasTerms
                          ? "bg-white text-black border border-neutral-100 hover:border-black hover:bg-neutral-50"
                          : "bg-neutral-50 text-neutral-300 cursor-not-allowed opacity-40"
                    )}
                    onClick={() => {
                      setSelectedLetter(letter);
                      setSelectedCategory(null);
                    }}
                  >
                    {letter}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedLetter || selectedCategory) && (
            <div className="flex items-center gap-3 animate-in slide-in-from-left-4 duration-300">
              <span className="text-xs font-black uppercase tracking-widest text-neutral-400">Filtering by:</span>
              <Badge className="bg-neutral-100 text-black border-neutral-200 py-1.5 px-4 rounded-full flex items-center gap-2">
                {selectedLetter ? `Letter: ${selectedLetter}` : `Category: ${selectedCategory}`}
                <button onClick={() => { setSelectedLetter(null); setSelectedCategory(null); }}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            </div>
          )}

          {/* Terms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
            {getDisplayedTerms().map((term) => (
              <Card
                key={term.id}
                className="group border border-neutral-100 bg-white hover:border-black hover:shadow-xl hover:shadow-neutral-100 rounded-3xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
                onClick={() => handleTermClick(term.id)}
              >
                <CardContent className="p-8 space-y-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start">
                    <div className="p-4 bg-neutral-50 text-black group-hover:bg-black group-hover:text-white rounded-2xl transition-all duration-300 text-black">
                      <term.icon className="h-8 w-8 transition-colors" />
                    </div>
                    <div className="text-neutral-300 group-hover:text-black transition-colors">
                      <ChevronRight className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="space-y-2 flex-1">
                    <h3 className="text-2xl font-black text-black tracking-tight leading-tight group-hover:underline decoration-2 underline-offset-4">
                      {term.title}
                    </h3>
                    <p className="text-neutral-500 font-medium line-clamp-2 text-sm leading-relaxed">
                      {term.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-neutral-50">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                      {term.category}
                    </span>
                    <Badge variant="outline" className="border-neutral-100 text-neutral-400 text-[10px] font-bold px-2 py-0.5 rounded-lg">
                      {term.resources} Sources
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
            {getDisplayedTerms().length === 0 && (
              <div className="col-span-full py-20 text-center space-y-4 bg-neutral-50 rounded-[40px] border border-dashed border-neutral-200">
                <Search className="h-12 w-12 text-neutral-300 mx-auto" />
                <div className="space-y-1">
                  <p className="text-xl font-bold text-black">No results found</p>
                  <p className="text-neutral-500">We couldn&apos;t find any terms matching your search criteria.</p>
                </div>
                <Button variant="outline" onClick={() => setSearchQuery("")} className="mt-4 rounded-xl border-neutral-300">
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Categories Sidebar */}
          <Card className="border-neutral-100 shadow-sm bg-white rounded-[32px] overflow-hidden">
            <CardHeader className="bg-neutral-50/50 border-b border-neutral-100 p-8">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-neutral-500 flex items-center gap-3">
                <Layers className="h-4 w-4" /> Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <div className="flex flex-col gap-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => { setSelectedCategory(category); setSelectedLetter(null); }}
                    className={cn(
                      "w-full text-left px-6 py-5 rounded-2xl text-sm font-bold transition-all flex items-center justify-between group",
                      selectedCategory === category
                        ? "bg-black text-white shadow-xl shadow-neutral-100"
                        : "text-neutral-500 hover:bg-neutral-50 hover:text-black"
                    )}
                  >
                    <span>{category}</span>
                    <ChevronRight className={cn("h-4 w-4 opacity-0 group-hover:opacity-100 transition-all", selectedCategory === category && "opacity-100")} />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Sidebar */}
          <Card className="border-neutral-100 shadow-sm bg-white rounded-[32px] overflow-hidden">
            <CardHeader className="bg-neutral-50/50 border-b border-neutral-100 p-8">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-neutral-500 flex items-center gap-3">
                <BarChart3 className="h-4 w-4" /> Glossary Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Total Definitions</p>
                <p className="text-4xl font-black text-black tracking-tighter">{getAllTerms().length}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Top Category</p>
                <p className="text-xl font-bold text-black uppercase tracking-tight">Bond Screens</p>
              </div>
              <div className="pt-4 border-t border-neutral-50">
                <p className="text-xs text-neutral-500 font-medium leading-relaxed italic">
                  &quot;Enriching your investment knowledge through clear terminology.&quot;
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Term Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl border-none shadow-2xl p-0 overflow-hidden rounded-[40px] bg-white">
          {selectedTerm && (termDetails[selectedTerm] || glossaryTerms[selectedTerm.charAt(0).toUpperCase() as keyof typeof glossaryTerms]?.find((t: any) => t.id === selectedTerm)) && (
            <div className="flex flex-col max-h-[90vh]">
              {/* Dialog Header */}
              <div className="p-10 pb-8 bg-white border-b border-neutral-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                  <Badge className="bg-black text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit">
                    {(termDetails[selectedTerm] || {}).category || glossaryTerms[selectedTerm.charAt(0).toUpperCase() as keyof typeof glossaryTerms]?.find((t: any) => t.id === selectedTerm)?.category}
                  </Badge>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="rounded-xl border-neutral-200 text-black hover:bg-neutral-50 font-bold px-4">
                      <Share2 className="h-4 w-4 mr-2" /> Share
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-xl border-neutral-200 text-black hover:bg-neutral-50 font-bold px-4">
                      <Copy className="h-4 w-4 mr-2" /> Copy
                    </Button>
                  </div>
                </div>
                <DialogTitle className="text-5xl font-black text-black tracking-tighter mb-4">
                  {(termDetails[selectedTerm] || {}).title || glossaryTerms[selectedTerm.charAt(0).toUpperCase() as keyof typeof glossaryTerms]?.find((t: any) => t.id === selectedTerm)?.title}
                </DialogTitle>
                <DialogDescription className="text-xl text-neutral-600 font-medium leading-relaxed">
                  {(termDetails[selectedTerm] || {}).description || glossaryTerms[selectedTerm.charAt(0).toUpperCase() as keyof typeof glossaryTerms]?.find((t: any) => t.id === selectedTerm)?.description}
                </DialogDescription>
              </div>

              {/* Dialog Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-10 bg-neutral-50/30">
                {termDetails[selectedTerm]?.sections ? (
                  <Accordion type="single" collapsible defaultValue={termDetails[selectedTerm].sections[0].id} className="space-y-4">
                    {termDetails[selectedTerm].sections.map((section: any) => (
                      <AccordionItem key={section.id} value={section.id} className="border border-neutral-100 bg-white rounded-2xl overflow-hidden shadow-sm">
                        <AccordionTrigger className="px-6 py-6 text-lg font-bold hover:no-underline hover:bg-neutral-50 transition-colors text-black">
                          {section.title}
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-8 pt-2 whitespace-pre-line text-neutral-600 font-medium leading-relaxed">
                          {section.content}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="bg-white border border-neutral-100 rounded-3xl p-8 shadow-sm">
                    <h4 className="font-black text-xs uppercase tracking-widest text-neutral-400 mb-4">Summary</h4>
                    <p className="text-neutral-600 font-medium leading-relaxed italic">
                      Detailed analytical breakdown for this specific term is being compiled by our research team.
                    </p>
                  </div>
                )}

                {/* Social Share Footer */}
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-neutral-100">
                  <div className="flex items-center gap-4">
                    <button className="p-3 bg-white border border-neutral-100 rounded-2xl text-neutral-400 hover:text-[#0077b5] hover:border-[#0077b5] transition-all hover:-translate-y-1">
                      <Linkedin className="h-5 w-5" />
                    </button>
                    <button className="p-3 bg-white border border-neutral-100 rounded-2xl text-neutral-400 hover:text-[#1da1f2] hover:border-[#1da1f2] transition-all hover:-translate-y-1">
                      <Twitter className="h-5 w-5" />
                    </button>
                    <button className="p-3 bg-white border border-neutral-100 rounded-2xl text-neutral-400 hover:text-[#1877f2] hover:border-[#1877f2] transition-all hover:-translate-y-1">
                      <Facebook className="h-5 w-5" />
                    </button>
                  </div>
                  <Button onClick={() => setIsDialogOpen(false)} className="bg-black text-white hover:bg-neutral-800 rounded-2xl h-14 px-10 font-black uppercase tracking-widest text-xs shadow-xl transition-all">
                    Close Guide
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Glossary Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl border-none shadow-2xl p-0 overflow-hidden rounded-[40px] bg-white">
          <DialogHeader className="p-10 pb-6 bg-white">
            <DialogTitle className="text-3xl font-black text-black tracking-tighter">New Glossary Entry</DialogTitle>
            <DialogDescription className="text-lg text-neutral-500 font-medium pt-2">
              Contribute to the BondKonnect knowledge base.
            </DialogDescription>
          </DialogHeader>

          <div className="px-10 pb-10 space-y-8 bg-white max-h-[60vh] overflow-y-auto">
            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-neutral-500">Term Title</Label>
              <Input placeholder="e.g., Bond Duration" className="h-14 rounded-2xl border-neutral-200 focus:border-black font-bold text-lg px-6" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest text-neutral-500">Category</Label>
                <Select>
                  <SelectTrigger className="h-14 rounded-2xl border-neutral-200 font-bold px-6">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest text-neutral-500">Icon Selector</Label>
                <div className="h-14 rounded-2xl border-neutral-200 bg-neutral-50 flex items-center justify-center text-neutral-400 text-xs font-bold px-6 italic">
                  Visual presets will be assigned automatically.
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-neutral-500">Short Description</Label>
              <Textarea placeholder="Brief definition..." className="min-h-[100px] rounded-2xl border-neutral-200 focus:border-black font-medium text-base p-5 resize-none" />
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-neutral-500">Detailed Breakdown</Label>
              <Textarea placeholder="Formulas, examples, and deep dive..." className="min-h-[160px] rounded-2xl border-neutral-200 focus:border-black font-medium text-base p-5 resize-none" />
            </div>
          </div>

          <DialogFooter className="p-10 pt-0 bg-neutral-50 border-t border-neutral-100 flex flex-row gap-4">
            <Button 
              variant="ghost" 
              onClick={() => setIsAddDialogOpen(false)} 
              className="flex-1 h-14 font-black text-neutral-500 hover:text-black hover:bg-neutral-200 rounded-2xl uppercase tracking-widest text-xs"
            >
              Discard
            </Button>
            <Button className="flex-[2] bg-black text-white hover:bg-neutral-800 h-14 font-black rounded-2xl shadow-xl transition-all uppercase tracking-widest text-xs">
              Save Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
