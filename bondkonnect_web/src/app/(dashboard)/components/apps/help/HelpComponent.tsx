"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Search, 
  LifeBuoy, 
  Book, 
  ShieldCheck, 
  CreditCard, 
  BarChart3, 
  MessageSquare, 
  Mail, 
  Phone, 
  ArrowRight,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

export function HelpComponent() {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      title: "Getting Started",
      description: "Learn how to set up your account and start trading.",
      icon: LifeBuoy,
      links: ["Account Verification", "User Roles", "Platform Tour"]
    },
    {
      title: "Trading & Markets",
      description: "Guides on biding, asking, and market analysis.",
      icon: BarChart3,
      links: ["Placing Quotes", "Counter Bidding", "Market Hours"]
    },
    {
      title: "Payments & Billing",
      description: "Manage your funds, M-Pesa, and PayPal integrations.",
      icon: CreditCard,
      links: ["M-Pesa STK Push", "PayPal Setup", "Withdrawals"]
    },
    {
      title: "Security & Privacy",
      description: "Protect your account and sensitive financial data.",
      icon: ShieldCheck,
      links: ["Two-Factor Auth", "Session Management", "Audit Logs"]
    }
  ];

  const popularArticles = [
    "How to execute a bond trade?",
    "Understanding the OBI (K) Index",
    "Linking your M-Pesa for instant settlement",
    "Managing your portfolio risk metrics",
    "Developer API access and webhooks"
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-16 pb-20">
      {/* Hero Search Section */}
      <section className="relative py-20 bg-black rounded-[40px] overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#ffffff,transparent)]"></div>
        </div>
        
        <div className="relative z-10 text-center space-y-8 px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white text-xs font-black uppercase tracking-widest backdrop-blur-md border border-white/10">
            <HelpCircle className="h-4 w-4" /> Help Center
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
            How can we assist you?
          </h1>
          <p className="text-neutral-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Search our knowledge base for instant answers or explore categories below to master the BondKonnect platform.
          </p>
          
          <div className="relative max-w-3xl mx-auto group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-neutral-500 group-focus-within:text-white transition-colors" />
            <Input 
              placeholder="Search for articles, guides, or keywords..." 
              className="h-20 bg-white/5 border-white/10 text-white placeholder:text-neutral-600 pl-16 pr-10 rounded-[30px] text-xl font-medium focus-visible:ring-white/20 focus-visible:border-white/20 transition-all backdrop-blur-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Main Support Categories */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {categories.map((cat, i) => (
          <Card key={i} className="border-neutral-100 bg-white rounded-[32px] hover:border-black hover:shadow-xl transition-all duration-500 group overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div className="p-4 bg-neutral-100 text-black group-hover:bg-black group-hover:text-white transition-all duration-500 w-fit rounded-2xl">
                <cat.icon className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-black tracking-tight">{cat.title}</h3>
                <p className="text-neutral-500 text-sm font-medium leading-relaxed">{cat.description}</p>
              </div>
              <ul className="space-y-3 pt-4">
                {cat.links.map((link, j) => (
                  <li key={j} className="flex items-center group/link cursor-pointer">
                    <span className="text-sm font-bold text-neutral-600 group-hover/link:text-black transition-colors">{link}</span>
                    <ChevronRight className="h-4 w-4 ml-auto text-neutral-300 group-hover/link:text-black transition-all" />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Popular Articles */}
        <section className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-6">
            <h2 className="text-3xl font-black text-black tracking-tight">Popular Articles</h2>
            <Button variant="link" className="text-black font-black uppercase text-xs tracking-widest gap-2">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {popularArticles.map((article, i) => (
              <div key={i} className="flex items-center justify-between p-6 bg-white border border-neutral-100 rounded-2xl hover:border-black transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-neutral-50 rounded-lg group-hover:bg-black group-hover:text-white transition-colors">
                    <FileText className="h-5 w-5" />
                  </div>
                  <span className="font-bold text-black text-lg group-hover:underline">{article}</span>
                </div>
                <ExternalLink className="h-4 w-4 text-neutral-300 group-hover:text-black" />
              </div>
            ))}
          </div>
        </section>

        {/* Support Sidebar */}
        <section className="space-y-8">
          <Card className="bg-black text-white rounded-[32px] p-8 space-y-8 shadow-2xl border-none">
            <div className="space-y-2">
              <h3 className="text-3xl font-black tracking-tighter">Still need help?</h3>
              <p className="text-neutral-400 font-medium">Our dedicated support team is available 24/7 to assist you with any inquiries.</p>
            </div>
            
            <div className="space-y-4">
              <Button className="w-full h-14 bg-white text-black hover:bg-neutral-200 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all active:scale-95">
                <MessageSquare className="h-4 w-4 mr-2" /> Start Live Chat
              </Button>
              <Button variant="outline" className="w-full h-14 border-white/20 bg-transparent text-white hover:bg-white/10 rounded-2xl font-black uppercase tracking-widest text-xs transition-all">
                <Mail className="h-4 w-4 mr-2" /> Email Support
              </Button>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Phone className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Phone Support</p>
                  <p className="font-bold text-white">+254 700 000 000</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Book className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Developer Docs</p>
                  <p className="font-bold text-white">docs.bondkonnect.com</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="p-8 border-2 border-dashed border-neutral-100 rounded-[32px] text-center space-y-4">
            <p className="text-neutral-500 font-medium text-sm">
              &quot;Join over 5,000 traders mastering the Kenyan bond market.&quot;
            </p>
            <div className="flex justify-center -space-x-2">
              {[1,2,3,4].map((i) => (
                <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-neutral-200" />
              ))}
              <div className="h-8 w-8 rounded-full border-2 border-white bg-black text-white text-[10px] flex items-center justify-center font-black">
                +5k
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
