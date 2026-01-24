"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle, MessageSquare, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FAQComponent() {
  const faqCategories = [
    {
      id: "general",
      label: "General",
      questions: [
        {
          id: "free-trial",
          question: "Is there a free trial available?",
          answer:
            "Yes, you can try us for free for 30 days. If you want, we'll provide you with a free 30-minute onboarding call to get you up and running. Book a call here.",
        },
        {
          id: "change-plan",
          question: "Can I change my plan later?",
          answer:
            "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
        },
        {
          id: "cancel-policy",
          question: "What is your cancellation policy?",
          answer:
            "You can cancel your subscription at any time. Once canceled, you'll have access until the end of your current billing period.",
        },
      ],
    },
    {
      id: "pricing",
      label: "Pricing",
      questions: [
        {
          id: "payment-methods",
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards, PayPal, and M-Pesa (STK Push).",
        },
        {
          id: "refund-policy",
          question: "Do you offer refunds?",
          answer:
            "We offer a 14-day money-back guarantee for all plans. If you're not satisfied, contact our support team.",
        },
      ],
    },
    {
      id: "dashboard",
      label: "Dashboard",
      questions: [
        {
          id: "data-export",
          question: "Can I export my dashboard data?",
          answer: "Yes, you can export your data in CSV, Excel, or PDF formats from the analytics sections.",
        },
        {
          id: "custom-dashboard",
          question: "Can I customize my dashboard?",
          answer:
            "Yes, you can customize your dashboard by adding, removing, or rearranging widgets to suit your needs.",
        },
      ],
    },
    {
      id: "api",
      label: "API",
      questions: [
        {
          id: "api-limits",
          question: "Are there any API rate limits?",
          answer:
            "Yes, API rate limits depend on your plan. Basic plans have 1,000 requests per day, while premium plans have higher or unlimited requests.",
        },
        {
          id: "api-docs",
          question: "Where can I find API documentation?",
          answer: "Our comprehensive API documentation is available at docs.bondkonnect.com.",
        },
      ],
    },
  ]

  return (
    <div className="max-w-[1000px] mx-auto space-y-16 animate-in fade-in duration-500">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-full text-black text-[10px] font-black uppercase tracking-widest border border-neutral-200">
          <HelpCircle className="h-4 w-4" /> FAQ
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-black tracking-tighter">Frequently Asked Questions</h1>
        <p className="text-neutral-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
          The most commonly asked questions about the BondKonnect trading engine and ecosystem.
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full space-y-12">
        <TabsList className="flex justify-center bg-neutral-100 p-1.5 rounded-2xl h-auto w-fit mx-auto border border-neutral-200 shadow-sm">
          {faqCategories.map((category) => (
            <TabsTrigger 
              key={category.id} 
              value={category.id} 
              className="px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg transition-all"
            >
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {faqCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-0 focus-visible:ring-0">
            <div className="bg-white border border-neutral-100 rounded-[32px] overflow-hidden shadow-sm">
              <Accordion type="single" collapsible className="w-full divide-y divide-neutral-100">
                {category.questions.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id} className="border-none">
                    <AccordionTrigger className="text-left text-xl font-bold py-8 px-10 hover:no-underline hover:bg-neutral-50 transition-colors text-black">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-neutral-500 text-lg font-medium px-10 pb-10 leading-relaxed bg-neutral-50/30">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="p-12 bg-black text-white rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl">
        <div className="space-y-3 text-center md:text-left">
          <h3 className="text-3xl font-black tracking-tighter">Still have questions?</h3>
          <p className="text-neutral-400 font-medium max-w-md">
            If you couldn&apos;t find what you were looking for, our support team is just a message away.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Button className="h-14 bg-white text-black hover:bg-neutral-200 rounded-2xl px-10 font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">
            <MessageSquare className="h-4 w-4 mr-2" /> Chat with Us
          </Button>
          <Button variant="outline" className="h-14 border-white/20 bg-transparent text-white hover:bg-white/10 rounded-2xl px-10 font-black uppercase tracking-widest text-xs transition-all">
            Contact Support <ArrowUpRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}