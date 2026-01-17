"use client"

import { useState, useEffect, useMemo } from "react"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/app/components/ui/accordion"
import { Search, Share2, Copy, Twitter, Linkedin, Facebook, Plus } from "lucide-react"
import { Label } from "@/app/components/ui/label"
import { Textarea } from "@/app/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"

export function GlossaryComponent() {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredTerms, setFilteredTerms] = useState<Record<string, Array<{
    id: string;
    title: string;
    category: string;
    resources: number;
    description: string;
    icon: string;
  }>>>({})

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
        icon: "📊",
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
        icon: "🏦",
      },
      {
        id: "coupon",
        title: "Coupon",
        category: "Bond Screens",
        resources: 1,
        description:
          "Shows the periodic interest payable to the bondholder usually semi-annually (gross of withholding tax) stated as a percent of the bond's par value of 100.",
        icon: "💰",
      },
      {
        id: "convexity",
        title: "Convexity",
        category: "Bond Screens",
        resources: 2,
        description: "Shows how the duration of a bond changes given a unit change in interest rates.",
        icon: "📈",
      },
      {
        id: "credit-risk",
        title: "Credit Risk",
        category: "Bond Screens",
        resources: 3,
        description:
          "Credit risk is essentially the default risk associated with holding listed corporate bonds. This risk is derived through estimating the probability of default (PD) by working out the z-score for each corporate bond using the Emerging Market Model (EMM).",
        icon: "⚠️",
      },
      {
        id: "coupon-paid",
        title: "Coupon Paid",
        category: "Portfolio Assistant & Scorecard",
        resources: 1,
        description:
          "This reflects The actual coupons received between the time of bond purchase and the current value date.",
        icon: "💵",
      },
    ],
    S: [
      {
        id: "spot-rate",
        title: "Spot Rate",
        category: "Market Snapshot",
        resources: 2,
        description: "Reflects the prevailing market yield of a given bond at the time specified by the value date.",
        icon: "📉",
      },
      {
        id: "sharpe-ratio",
        title: "Sharpe Ratio",
        category: "Portfolio Assistant & Scorecard",
        resources: 2,
        description:
          "Indicates the average portfolio return earned in excess of the risk-free rate per unit of volatility or total risk. Higher Sharpe ratio means better portfolio performance relative to the risk free rate.",
        icon: "📊",
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
        icon: "📈",
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
        icon: "⚖️",
      },
      {
        id: "bond-screens",
        title: "Bond Screens",
        category: "Bond Screens",
        resources: 1,
        description:
          "Bond screening is by Expected Return is by liquidity (Top 5 of the most liquid bonds); and by Duration especially for portfolios managers that are looking to buy bonds with particular duration or alternatively to immunize their portfolios with specific duration.",
        icon: "🔍",
      },
      {
        id: "batting-average",
        title: "Batting Average",
        category: "Portfolio Assistant & Scorecard",
        resources: 1,
        description:
          "Indicates the percentage of time a bond portfolio outperforms the OBI index on a month-to-month basis; looking back over a minimum of 3 months and a maximum of 12 months depending on the age of the portfolio.",
        icon: "🏆",
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
        icon: "📝",
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
        icon: "💲",
      },
      {
        id: "dtm-yrs",
        title: "DTM (Yrs)",
        category: "Bond Screens",
        resources: 1,
        description:
          "Duration to maturity (DTM) of the bond (in years) i.e. number of years until the bond matures and its principal amount becomes due for redemption.",
        icon: "⏳",
      },
      {
        id: "dv01",
        title: "DV01",
        category: "Bond Screens",
        resources: 1,
        description:
          "The dollar duration (DV01), indicates the sensitivity of a bond's price to a basis point (0.01%) change in interest rates.",
        icon: "📊",
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
        icon: "📅",
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
        icon: "📉",
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
        icon: "💹",
      },
      {
        id: "expected-shortfall",
        title: "Expected Shortfall",
        category: "Bond Screens",
        resources: 1,
        description:
          "Expected shortfall (ES) for a particular time period is measured by determining the most extreme loss incurred by liquid bonds (those ranked LL or L) over the last 12 months.",
        icon: "📉",
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
        icon: "💧",
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
        icon: "💼",
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
        icon: "📈",
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
        icon: "📊",
      },
    ],
  }), [])

  const termDetails = {
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

$$On-the-run\\ Bond\\ Index\\ (OBI) = OBI_t = \\frac{\\bar{A}_t}{\\bar{A}_0} \\times 100$$

$$\\bar{A}_t = \\frac{1}{n}\\sum_{i=1}^{n}A_n$$

Where:
- n = number of on-the-run bonds at a given time t
- A_n = prevailing prices of the on-the-run (OTR) bonds at time t
- Ā_t = Average price of all the prevailing OTR bonds at time t
- Ā_0 = Average price of all the prevailing OTR bonds at the inception date of indexing; which in this case is 1st Nov 2019.`,
        },
      ],
      relatedTopics: ["Yield Curve", "CBR", "Spot Rate"],
    },
    cbr: {
      title: "CBR",
      description: "The Central Bank Rate (CBR) is the policy rate set by the Central Bank in guiding monetary policy.",
      category: "Market Snapshot",
      resources: 1,
      sections: [
        {
          id: "what-is",
          title: "What is CBR?",
          content:
            "The Central Bank Rate (CBR) is the policy rate set by the Central Bank in guiding monetary policy. It serves as a benchmark for other interest rates in the economy and is a key tool for monetary policy implementation.",
        },
        {
          id: "importance",
          title: "Importance of CBR",
          content:
            "The CBR is crucial for controlling inflation, managing economic growth, and ensuring financial stability. Changes in the CBR can influence borrowing costs, investment decisions, and overall economic activity.",
        },
      ],
      relatedTopics: ["Yield Curve", "Monetary Policy", "Inflation"],
    },
    "yield-curve-graphs": {
      title: "Yield Curve Graphs",
      description:
        "The Yield Curve is derived from traded prices recorded over a 5-day window using a Nielson Siegel Svensson (NSS) Model.",
      category: "Market Snapshot",
      resources: 4,
      sections: [
        {
          id: "what-is",
          title: "What are Yield Curve Graphs?",
          content:
            "The Yield Curve is derived from traded prices recorded over a 5-day window using a Nielson Siegel Svensson (NSS) Model. Yield curves graphically represent the relationship between the interest rate (or cost of borrowing) and the time to maturity of the debt for a given borrower in a given currency.",
        },
        {
          id: "nss-model",
          title: "Nielson Siegel Svensson (NSS) Model",
          content: `The NSS Model is represented by the following equation:

$$r(t) = \\beta_0 + \\beta_1 \\left(\\frac{1-\\exp\\left(\\frac{-t}{\\lambda_1}\\right)}{\\frac{t}{\\lambda_1}}\\right) + \\beta_2 \\left(\\frac{1-\\exp\\left(\\frac{-t}{\\lambda_1}\\right)}{\\frac{t}{\\lambda_1}}-\\exp\\left(\\frac{-t}{\\lambda_1}\\right)\\right) + \\beta_3 \\left(\\frac{1-\\exp\\left(\\frac{-t}{\\lambda_2}\\right)}{\\frac{t}{\\lambda_2}}-\\exp\\left(\\frac{-t}{\\lambda_2}\\right)\\right)$$

Where:
- β₀ = This parameter, which must be positive, is the long term rate of a return on a perpetual zero Coupon bond.
- β₁ = This parameter along with β₀ determines the short term Zero coupon rate (the vertical intercept).
- λ₁ = This parameter, which must also be positive, positions the first hump.
- β₂ = This parameter determines the magnitude and direction of the hump occurring at λ₁.
- λ₂ = This parameter, which must also be positive, positions the second hump on the curve.
- β₃ = This parameter, which is analogous to β₂, determines the magnitude and direction of the second hump.`,
        },
        {
          id: "projection-bands",
          title: "Projection Bands",
          content: `Projection bands indicate a normal valuation range taking into account projected Central Bank Rate (CBR) rate adjustments; the red band signals potential overvaluation & the green band undervaluation.

Going by the Fisher equation:
$$(1+R) = (1+r)(1+\\pi) = 1+r+\\pi+r\\pi$$

Where:
- R = nominal rate
- r = real rate
- π = inflation rate

A hypothetical spot curve with spot rates, S_N, that can be projected as follows:
$$S_N ≈ r + \\pi_c + r(\\pi_c N)$$

Example:
$$S_2 ≈ r + \\pi_c + r(\\pi_c 2)$$
$$S_{10} ≈ r + \\pi_c + r(\\pi_c 10)$$

Where:
- S = is the estimated spot rate on a yield curve for a tenor of N years.
- N = is the tenor or term to maturity and determines the cumulative amount of inflation (π_c N) to be compensated for a given term to maturity.
- π_c = depicts the core inflation estimated by deducting energy and food prices from the Consumer Price Index basket.
- r = real return estimated by deducting π from the long run CBR rate, β₀, projected by the MPR equation.`,
        },
      ],
      relatedTopics: ["CBR", "Spot Rate", "Inflation"],
    },
    "modified-duration": {
      title: "Modified Duration",
      description:
        "Indicates the % loss (sensitivity) in bond price due to a 1% change in interest rates. In our model, interest rate change is based on the projected change in the CBR rate.",
      category: "Bond Screens",
      resources: 2,
      sections: [
        {
          id: "what-is",
          title: "What is Modified Duration?",
          content:
            "Modified Duration indicates the percentage loss (sensitivity) in bond price due to a 1% change in interest rates. In our model, interest rate change is based on the projected change in the CBR rate.",
        },
        {
          id: "conceptual-framework",
          title: "Conceptual Framework",
          content: `The Modified Duration is calculated as follows:

$$P = \\sum_{t=1}^{t=N}\\frac{C_t}{(1+y)^t} + \\frac{M}{(1+y)^N}$$

$$Macaulay\\ Duration = \\frac{\\partial P}{\\partial y} = \\frac{\\sum_{t=1}^{t=N}\\frac{tC_t}{(1+y)^t} + \\frac{NM}{(1+y)^N}}{P}$$

$$Modified\\ Duration = -\\frac{Macaulay\\ Duration}{(1+y)}$$

Where:
- P = Bond Price
- y = Bond's yield on maturity
- N = the number of payment periods
- CF_t = cash flow in time t.`,
        },
      ],
      relatedTopics: ["Convexity", "Bond Price", "Interest Rate Risk"],
    },
    "information-ratio": {
      title: "Information Ratio",
      description:
        "Information ratio is the average portfolio return earned in excess of the OBI Index performance benchmark. Higher information ratio means better portfolio performance relative to the OBI benchmark.",
      category: "Portfolio Assistant & Scorecard",
      resources: 2,
      sections: [
        {
          id: "what-is",
          title: "What is Information Ratio?",
          content:
            "Information ratio is the average portfolio return earned in excess of the OBI Index performance benchmark. Higher information ratio means better portfolio performance relative to the OBI benchmark.",
        },
        {
          id: "conceptual-framework",
          title: "Conceptual Framework",
          content: `The Information Ratio is calculated as follows:

$$Information\\ Ratio\\ (IR) = \\frac{Active\\ Return}{Active\\ Risk} = \\frac{R_p - R_i}{\\sigma_p}$$

For portfolios that are less than a year old their IR is annualized as follows:

$$\\sqrt{(12/age\\ of\\ Portfolio\\ in\\ Months) \\times IR}$$

Where:
- R_p = annualized portfolio return
- R_i = annualized return on benchmark (in this case the On-the-run Bond Index – OBI)
- σ_p = is the tracking error derived as standard deviation of the portfolio excess return [R_p – R_i]`,
        },
      ],
      relatedTopics: ["Sharpe Ratio", "Portfolio Performance", "Benchmark"],
    },
  }

  // Function to get all terms from all letters
  const getAllTerms = () => {
    const terms: Array<{
      id: string;
      title: string;
      category: string;
      resources: number;
      description: string;
      icon: string;
    }> = [];
    
    Object.keys(glossaryTerms).forEach((letter) => {
      glossaryTerms[letter as keyof typeof glossaryTerms].forEach((term) => {
        terms.push(term)
      })
    })
    return terms;
  }

  // Function to get terms by category
  const getTermsByCategory = (category: string) => {
    const categoryTerms: Array<{
      id: string;
      title: string;
      category: string;
      resources: number;
      description: string;
      icon: string;
    }> = [];
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
    // Filter terms based on search query
    if (searchQuery) {
      const filtered: Record<string, Array<{
        id: string;
        title: string;
        category: string;
        resources: number;
        description: string;
        icon: string;
      }>> = {}
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
    // If a category is selected, show terms from that category
    if (selectedCategory) {
      return getTermsByCategory(selectedCategory)
    }

    // If a letter is selected, show terms from that letter
    if (selectedLetter) {
      const terms = searchQuery ? filteredTerms : glossaryTerms
      return terms[selectedLetter as keyof typeof terms] || []
    }

    // Otherwise show all terms
    return getAllTerms()
  }

  const handleAddGlossaryItem = () => {
    // This would typically save the new term to your database
    // For now, we'll just close the dialog
    setIsAddDialogOpen(false)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex-1 flex flex-col">
        <div className="bg-blue-600 text-white p-4">
          <div className="container mx-auto">
            <h1 className="text-xl font-bold">Financial Glossary</h1>
          </div>
        </div>

        <div className="container mx-auto py-10 px-4 flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-3/4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">Financial Terms and Definitions</h2>
              <p className="text-muted-foreground mb-6">
                Browse the most commonly used financial and bond market terms that will help enrich your investment
                knowledge.
              </p>
              <div className="flex justify-between items-center mb-6">
                <div className="relative max-w-md w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search all terms"
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Glossary Item
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <Button
                variant={!selectedLetter && !selectedCategory ? "default" : "ghost"}
                className="px-4"
                onClick={() => {
                  setSelectedLetter(null)
                  setSelectedCategory(null)
                }}
              >
                All Terms
              </Button>
              {alphabet.map((letter) => (
                <Button
                  key={letter}
                  variant={selectedLetter === letter ? "default" : "ghost"}
                  className={`w-8 h-8 p-0 ${
                    !Object.keys(searchQuery ? filteredTerms : glossaryTerms).includes(letter) ? "opacity-50" : ""
                  }`}
                  onClick={() => {
                    if (Object.keys(searchQuery ? filteredTerms : glossaryTerms).includes(letter)) {
                      setSelectedLetter(letter)
                      setSelectedCategory(null)
                    }
                  }}
                  disabled={!Object.keys(searchQuery ? filteredTerms : glossaryTerms).includes(letter)}
                >
                  {letter}
                </Button>
              ))}
            </div>

            {selectedLetter && <h2 className="text-4xl font-bold mb-6">{selectedLetter}</h2>}

            {selectedCategory && (
              <div className="mb-6">
                <div className="flex items-center">
                  <h2 className="text-2xl font-bold">Category: {selectedCategory}</h2>
                  <Button variant="ghost" size="sm" className="ml-2" onClick={() => setSelectedCategory(null)}>
                    Clear
                  </Button>
                </div>
              </div>
            )}

            <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
              {getDisplayedTerms().map((term: {
                id: string;
                title: string;
                category: string;
                resources: number;
                description: string;
                icon: string;
              }) => (
                <Card
                  key={term.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleTermClick(term.id)}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-4 text-2xl">{term.icon}</div>
                      <div>
                        <h3 className="font-medium">{term.title}</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span>{term.category}</span>
                          <span className="mx-2">•</span>
                          <span>{term.resources} resources</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-2xl">👆</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-1/4">
            <div className="bg-blue-600 text-white p-6 rounded-lg mb-6">
              <h3 className="text-xl font-bold mb-4">Categories</h3>
              <div className="flex flex-col gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    className={`bg-white/20 hover:bg-white/30 text-white cursor-pointer py-2 px-3 ${
                      selectedCategory === category ? "bg-white/50" : ""
                    }`}
                    onClick={() => {
                      setSelectedCategory(category)
                      setSelectedLetter(null)
                    }}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Terms</p>
                  <p className="text-2xl font-bold">{getAllTerms().length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Categories</p>
                  <p className="text-2xl font-bold">{categories.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Most Terms In</p>
                  <p className="text-2xl font-bold">Bond Screens</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Term Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          {selectedTerm && termDetails[selectedTerm as keyof typeof termDetails] && (
            <>
              <DialogHeader>
                <div className="flex items-center mb-2">
                  <Badge className="mr-2 bg-primary/10 text-primary hover:bg-primary/20">
                    {termDetails[selectedTerm as keyof typeof termDetails].category}
                  </Badge>
                  <Button variant="ghost" size="sm" className="ml-auto">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-2xl font-bold">
                    {termDetails[selectedTerm as keyof typeof termDetails].title}
                  </DialogTitle>
                </div>
                <DialogDescription className="text-base mt-2">
                  {termDetails[selectedTerm as keyof typeof termDetails].description}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4">
                <Accordion type="single" collapsible className="w-full">
                  {termDetails[selectedTerm as keyof typeof termDetails].sections.map((section) => (
                    <AccordionItem key={section.id} value={section.id}>
                      <AccordionTrigger className="text-left font-medium">{section.title}</AccordionTrigger>
                      <AccordionContent className="whitespace-pre-line">{section.content}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              <div className="flex items-center justify-between mt-6">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Linkedin className="h-4 w-4 mr-1" />
                    LinkedIn
                  </Button>
                  <Button variant="outline" size="sm">
                    <Twitter className="h-4 w-4 mr-1" />
                    Twitter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Facebook className="h-4 w-4 mr-1" />
                    Facebook
                  </Button>
                </div>
                <Button variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-1" />
                  Copy Link
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Glossary Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Glossary Item</DialogTitle>
            <DialogDescription>Fill in the details below to add a new term to the glossary.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="term-title" className="text-right">
                Term Title
              </Label>
              <Input id="term-title" placeholder="e.g., Bond Duration" className="col-span-3" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="term-category" className="text-right">
                Category
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="term-icon" className="text-right">
                Icon
              </Label>
              <Input id="term-icon" placeholder="e.g., 📊" className="col-span-3" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="term-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="term-description"
                placeholder="Brief description of the term..."
                className="col-span-3"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="term-content" className="text-right mt-2">
                Detailed Content
              </Label>
              <div className="col-span-3 space-y-4">
                <Textarea
                  id="term-content"
                  placeholder="Detailed explanation including formulas if applicable..."
                  rows={6}
                />
                <p className="text-sm text-muted-foreground">
                  You can use LaTeX notation for mathematical formulas, e.g., $$E = mc^2$$
                </p>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="term-resources" className="text-right">
                Resources
              </Label>
              <Input
                id="term-resources"
                type="number"
                placeholder="Number of resources"
                className="col-span-3"
                min="1"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="term-related" className="text-right">
                Related Topics
              </Label>
              <Input id="term-related" placeholder="e.g., Yield Curve, CBR, Spot Rate" className="col-span-3" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddGlossaryItem}>Add Term</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
