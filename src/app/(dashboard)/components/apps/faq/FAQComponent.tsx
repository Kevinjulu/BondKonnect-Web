"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

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
          answer: "We accept all major credit cards, PayPal, and bank transfers for annual plans.",
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
          answer: "Yes, you can export your data in CSV, Excel, or PDF formats from the dashboard.",
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
          answer: "Our comprehensive API documentation is available at docs.example.com/api.",
        },
      ],
    },
  ]

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Frequently asked questions</h1>
        <p className="text-lg text-muted-foreground mb-2">
          These are the most commonly asked questions about our platform.
        </p>
        <p className="text-lg text-muted-foreground">
          Can&apos;t find what you&apos;re looking for?{" "}
          <a href="#" className="text-primary hover:underline">
            Chat to our friendly team!
          </a>
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="flex justify-center space-x-2 mb-8">
          {faqCategories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="px-6 py-2 rounded-full">
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {faqCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            <Accordion type="single" collapsible className="w-full">
              {category.questions.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left text-lg font-medium py-4">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base pb-4">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
