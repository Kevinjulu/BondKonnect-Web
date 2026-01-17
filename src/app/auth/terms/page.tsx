"use client";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";
import { useToast } from "@/app/hooks/use-toast";
import {
  ArrowLeft,
  FileText,
  Shield,
  Scale,
  AlertTriangle,
  Printer,
  CheckCircle2,
  Globe,
  Lock,
  Download,
  Mail,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import PageContainer from "../../(dashboard)/components/container/PageContainer";
import { useRouter } from "next/navigation";

export default function TermsPage() {
  const router = useRouter();
  const { toast } = useToast();

  const sections = [
    { id: "intro", title: "Introduction", icon: <Globe className="h-4 w-4" /> },
    { id: "eligibility", title: "Eligibility & Registration", icon: <CheckCircle2 className="h-4 w-4" /> },
    { id: "risk", title: "Risk Disclosure", icon: <AlertTriangle className="h-4 w-4" /> },
    { id: "usage", title: "Usage Guidelines", icon: <Scale className="h-4 w-4" /> },
    { id: "ip", title: "Intellectual Property", icon: <Lock className="h-4 w-4" /> },
    { id: "termination", title: "Termination", icon: <Shield className="h-4 w-4" /> },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const content = `
BOND KONNECT - TERMS OF SERVICE
Last Updated: January 8, 2026
Version: 2.4

1. INTRODUCTION
Welcome to BondKonnect. By registering for, accessing, or using our bond trading platform, portfolio management tools, and related services (collectively, the "Services"), you agree to be bound by these Terms of Service and our Privacy Policy.

2. USER ELIGIBILITY & REGISTRATION
To access the Services, you must be at least 18 years of age or the age of majority in your jurisdiction. You are responsible for maintaining the confidentiality of your login credentials.

3. RISK DISCLOSURE
Trading bonds and financial instruments involves a significant level of risk. Market Risk, Credit Risk, and Liquidity Risk are inherent in bond investments. You could lose some or all of your initial investment.

4. PLATFORM USAGE GUIDELINES
You agree not to misuse the Services for illegal or fraudulent activities, manipulation of security prices, or unauthorized automated data scraping.

5. INTELLECTUAL PROPERTY
All content, design, and original software associated with BondKonnect are protected under international intellectual property laws.

6. TERMINATION
We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including breach of Terms.

CONTACT
If you have questions, please contact: support@bondkonnect.com

(c) 2026 BondKonnect Financial Services. All rights reserved.
    `;
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "BondKonnect_Terms_of_Service_v2.4.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "File Downloaded",
      description: "Terms of Service has been exported successfully.",
    });
  };

  const handleAgree = () => {
    toast({
      title: "Terms Accepted",
      description: "Thank you for accepting our Terms of Service.",
    });
    // Redirect or perform next action
    setTimeout(() => {
      router.back();
    }, 1000);
  };

  return (
    <PageContainer title="Terms of Service | BondKonnect" description="Terms and Conditions for using the BondKonnect platform">
      <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 no-print">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Terms of Service</h1>
              <div className="flex items-center gap-2 mt-2 text-sm">
                <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100">
                  Current Version 2.4
                </Badge>
                <span className="text-slate-500">Last updated January 8, 2026</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden sm:flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                onClick={handlePrint}
              >
                <Printer className="h-4 w-4" />
                Print
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden sm:flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
                Export as Text
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Navigation - Hidden on Print */}
            <div className="hidden lg:block lg:col-span-3 space-y-6 no-print">
              <Card className="sticky top-8 border border-slate-200 shadow-sm bg-white overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Table of Contents</h3>
                </div>
                <CardContent className="p-2 grid gap-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-slate-600 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-all text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 group-hover:text-blue-500 transition-colors">{section.icon}</span>
                        {section.title}
                      </div>
                      <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 text-blue-400 transition-opacity" />
                    </button>
                  ))}
                </CardContent>
              </Card>

              <Card className="sticky top-[400px] border border-blue-100 shadow-sm bg-gradient-to-br from-blue-50 to-white">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-start space-y-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm">Need Help?</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Questions about our terms? Our legal team is here to assist you.
                      </p>
                    </div>
                    <Button variant="link" className="text-blue-600 h-auto p-0 text-sm font-medium hover:text-blue-700">
                      Contact Legal Support &rarr;
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9">
              <Card className="shadow-xl border-t-4 border-t-blue-600 bg-white print:border-none print:shadow-none">
                <CardHeader className="border-b border-slate-100 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 no-print">
                      <FileText className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-slate-900">User Agreement</CardTitle>
                      <CardDescription className="text-slate-500 mt-1">
                        Please read this agreement carefully to understand your rights and obligations.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-0">
                  <ScrollArea className="h-[70vh] w-full print:h-auto print:overflow-visible">
                    <div className="p-6 md:p-10 space-y-12 print:p-0">
                      
                      {/* Section 1: Introduction */}
                      <section id="intro" className="scroll-mt-6 group">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors no-print">
                            <Globe className="h-5 w-5" />
                          </div>
                          <h2 className="text-xl font-bold text-slate-900">1. Introduction</h2>
                        </div>
                        <div className="text-base text-slate-600 leading-7 space-y-4 pl-1">
                          <p>
                            Welcome to <strong className="text-slate-900">BondKonnect</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). By registering for, accessing, or using our bond trading platform, 
                            portfolio management tools, and related services (collectively, the &quot;Services&quot;), you agree to be bound by these Terms of Service 
                            (&quot;Terms&quot;) and our Privacy Policy.
                          </p>
                          <p>
                            These Terms constitute a legally binding agreement between you and BondKonnect. If you are entering into these Terms on behalf 
                            of a company or other legal entity, you represent that you have the authority to bind such entity to these Terms.
                          </p>
                        </div>
                      </section>

                      <Separator className="bg-slate-100 no-print" />

                      {/* Section 2: Eligibility */}
                      <section id="eligibility" className="scroll-mt-6 group">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors no-print">
                            <CheckCircle2 className="h-5 w-5" />
                          </div>
                          <h2 className="text-xl font-bold text-slate-900">2. User Eligibility & Registration</h2>
                        </div>
                        <div className="text-base text-slate-600 leading-7 space-y-4 pl-1">
                          <p>To access the Services, you must:</p>
                          <ul className="list-disc pl-5 space-y-2 marker:text-blue-400">
                            <li>Be at least 18 years of age or the age of majority in your jurisdiction.</li>
                            <li>Have the legal capacity to enter into a binding contract.</li>
                            <li>Not be prohibited by law from using our Services.</li>
                          </ul>
                          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mt-6 print:bg-white print:border-none">
                            <h4 className="font-semibold text-slate-900 mb-2 text-sm uppercase tracking-wide flex items-center gap-2">
                              <Lock className="h-3 w-3 text-slate-500 no-print" />
                              Account Security
                            </h4>
                            <p className="text-sm text-slate-500">
                              You are responsible for maintaining the confidentiality of your login credentials. You agree to notify us immediately 
                              of any unauthorized access to or use of your account. BondKonnect will not be liable for any loss or damage arising 
                              from your failure to comply with this security obligation.
                            </p>
                          </div>
                        </div>
                      </section>

                      <Separator className="bg-slate-100 no-print" />

                      {/* Section 3: Risk Disclosure */}
                      <section id="risk" className="scroll-mt-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600 no-print">
                            <AlertTriangle className="h-5 w-5" />
                          </div>
                          <h2 className="text-xl font-bold text-slate-900">3. Risk Disclosure</h2>
                        </div>
                        <div className="bg-orange-50 border border-orange-100 rounded-xl p-6 shadow-sm print:bg-white print:border-slate-200">
                          <h3 className="text-orange-900 font-bold mb-3 flex items-center gap-2 print:text-slate-900">
                            <AlertTriangle className="h-4 w-4 no-print" />
                            Investment Warning
                          </h3>
                          <p className="text-orange-900/80 text-sm leading-relaxed mb-4 font-medium print:text-slate-700">
                            Trading bonds, fixed-income securities, and other financial instruments involves a significant level of risk and may 
                            not be suitable for all investors. You could lose some or all of your initial investment.
                          </p>
                          <div className="grid sm:grid-cols-3 gap-4">
                            {[ 
                              { title: "Market Risk", desc: "Prices fluctuate with interest rates." },
                              { title: "Credit Risk", desc: "Issuer default potential." },
                              { title: "Liquidity Risk", desc: "Difficulty selling quickly." }
                            ].map((risk, i) => (
                              <div key={i} className="bg-white/60 p-3 rounded-lg border border-orange-100/50 print:border-slate-100">
                                <span className="block text-orange-800 font-bold text-xs mb-1 print:text-slate-800">{risk.title}</span>
                                <span className="block text-orange-700/70 text-xs leading-tight print:text-slate-600">{risk.desc}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </section>

                      <Separator className="bg-slate-100 no-print" />

                      {/* Section 4: Usage Guidelines */}
                      <section id="usage" className="scroll-mt-6 group">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors no-print">
                            <Scale className="h-5 w-5" />
                          </div>
                          <h2 className="text-xl font-bold text-slate-900">4. Platform Usage Guidelines</h2>
                        </div>
                        <div className="text-base text-slate-600 leading-7 space-y-4 pl-1">
                          <p>You agree not to misuse the Services. Prohibited actions include, but are not limited to:</p>
                          <div className="grid sm:grid-cols-2 gap-4 mt-4">
                            {[ 
                              "Engaging in any illegal or fraudulent activity.",
                              "Manipulating the price of any security.",
                              "Interfering with the proper working of the platform.",
                              "Reverse engineering or decompiling our software.",
                              "Harassing other users or our staff.",
                              "Automated data scraping without permission."
                            ].map((item, i) => (
                              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors print:bg-white print:border-slate-100">
                                <div className="p-1.5 bg-red-50 rounded-full shrink-0 mt-0.5 no-print">
                                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                </div>
                                <span className="text-sm text-slate-700 font-medium">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </section>

                      <Separator className="bg-slate-100 no-print" />

                      {/* Section 5: Intellectual Property */}
                      <section id="ip" className="scroll-mt-6 group">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors no-print">
                            <Lock className="h-5 w-5" />
                          </div>
                          <h2 className="text-xl font-bold text-slate-900">5. Intellectual Property</h2>
                        </div>
                        <div className="text-base text-slate-600 leading-7 pl-1">
                          <p>
                            All content, design, graphics, compilation, magnetic translation, digital conversion, and other matters related to the 
                            Services are protected under applicable copyrights, trademarks, and other proprietary (including but not limited to 
                            intellectual property) rights. The copying, redistribution, use, or publication by you of any such matters or any part 
                            of the Services, except as allowed by these Terms, is strictly prohibited.
                          </p>
                        </div>
                      </section>

                      <Separator className="bg-slate-100 no-print" />

                      {/* Section 6: Termination */}
                      <section id="termination" className="scroll-mt-6 group">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors no-print">
                            <Shield className="h-5 w-5" />
                          </div>
                          <h2 className="text-xl font-bold text-slate-900">6. Termination</h2>
                        </div>
                        <div className="text-base text-slate-600 leading-7 pl-1">
                          <p className="mb-4">
                            We may terminate or suspend your account and bar access to the Services immediately, without prior notice or liability, 
                            under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
                          </p>
                          <p>
                            If you wish to terminate your account, you may simply discontinue using the Service or contact support to request account deletion.
                          </p>
                        </div>
                      </section>

                    </div>
                  </ScrollArea>
                </CardContent>
                
                <CardFooter className="bg-slate-50 border-t border-slate-100 p-6 flex flex-col md:flex-row justify-between items-center gap-6 no-print">
                  <div className="flex items-start gap-3 max-w-md">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                    <div className="text-xs text-slate-500">
                      <p className="font-medium text-slate-900 mb-1">Acknowledgement</p>
                      <p>By clicking "I Agree", you confirm that you have read, understood, and accept these Terms of Service.</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <Button 
                      onClick={() => router.back()} 
                      variant="outline" 
                      className="w-full sm:w-auto bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Decline
                    </Button>
                    <Button 
                      onClick={handleAgree} 
                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20"
                    >
                      I Agree & Continue
                    </Button>
                  </div>
                </CardFooter>
              </Card>
              
              <div className="mt-8 text-center text-xs text-slate-400 no-print">
                <p>&copy; {new Date().getFullYear()} BondKonnect Financial Services. All rights reserved.</p>
                <div className="flex justify-center gap-6 mt-3">
                  <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-blue-600 transition-colors">Cookie Policy</a>
                  <a href="#" className="hover:text-blue-600 transition-colors">Legal Disclaimer</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background-color: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .max-w-7xl {
            max-width: 100% !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .lg\:col-span-9 {
            grid-column: span 12 / span 12 !important;
          }
        }
      `}</style>
    </PageContainer>
  );
}