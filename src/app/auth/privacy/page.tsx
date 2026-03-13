"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
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
  ExternalLink,
  UserCheck,
  Fingerprint,
  Database,
  Link as LinkIcon
} from "lucide-react";
import PageContainer from "../../(dashboard)/components/container/PageContainer";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";


export default function PrivacyPage() {
  const router = useRouter();
  const { toast } = useToast();

  const sections = [
    { id: "intro", title: "Introduction", icon: <FileText className="h-4 w-4" /> },
    { id: "data_collection", title: "Data We Collect", icon: <Database className="h-4 w-4" /> },
    { id: "data_use", title: "How We Use Data", icon: <UserCheck className="h-4 w-4" /> },
    { id: "data_sharing", title: "Data Sharing", icon: <LinkIcon className="h-4 w-4" /> },
    { id: "security", title: "Data Security", icon: <Lock className="h-4 w-4" /> },
    { id: "your_rights", title: "Your Rights", icon: <Fingerprint className="h-4 w-4" /> },
    { id: "kenyan_regulations", title: "Kenyan Regulations", icon: <Scale className="h-4 w-4" /> },
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
BOND KONNECT - PRIVACY POLICY
Last Updated: February 19, 2026
Version: 1.0

1. INTRODUCTION
BondKonnect is committed to protecting your privacy. This Privacy Policy describes how we collect, use, process, and disclose your information through our platform.

2. DATA WE COLLECT
We collect personal data you provide to us (e.g., name, contact details, financial information, national ID) and data collected automatically (e.g., usage data, device information).

3. HOW WE USE YOUR DATA
We use your data to: provide and maintain our Services, personalize your experience, process transactions, communicate with you, ensure security, and comply with legal obligations.

4. DATA SHARING AND DISCLOSURE
We do not sell your personal data. We may share data with trusted third-party service providers (e.g., payment processors, compliance partners) under strict confidentiality agreements.

5. DATA SECURITY
We implement robust security measures, including encryption and access controls, to protect your data from unauthorized access or disclosure.

6. YOUR RIGHTS
You have the right to access, correct, or delete your personal data. You can also object to processing or withdraw consent where applicable.

7. COMPLIANCE WITH KENYAN REGULATIONS
BondKonnect adheres strictly to the Data Protection Act, 2019 of Kenya, and relevant Central Bank of Kenya (CBK) guidelines regarding financial data privacy and security.

CONTACT
If you have questions, please contact: privacy@bondkonnect.com

(c) 2026 BondKonnect Financial Services. All rights reserved.
    `;
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "BondKonnect_Privacy_Policy_v1.0.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "File Downloaded",
      description: "Privacy Policy has been exported successfully.",
    });
  };

  const handleAgree = () => {
    toast({
      title: "Consent Granted",
      description: "Thank you for reviewing our Privacy Policy.",
    });
    // Redirect or perform next action
    setTimeout(() => {
      router.back();
    }, 1000);
  };

  return (
    <PageContainer title="Privacy Policy | BondKonnect" description="Our Privacy Policy and Data Protection practices">
      <div className="min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 no-print">
            <div>
              <h1 className="text-3xl font-extrabold text-black tracking-tight">Privacy Policy</h1>
              <div className="flex items-center gap-2 mt-2 text-sm">
                <Badge variant="outline" className="border-black/20 bg-black/5 text-black hover:bg-black/10">
                  Current Version 1.0
                </Badge>
                <span className="text-black opacity-60">Last updated February 19, 2026</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden sm:flex items-center gap-2 bg-white hover:bg-black/5 text-black border-black/20"
                onClick={handlePrint}
              >
                <Printer className="h-4 w-4" />
                Print
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden sm:flex items-center gap-2 bg-white hover:bg-black/5 text-black border-black/20"
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
              <Card className="sticky top-8 border border-black/10 shadow-sm bg-white overflow-hidden">
                <div className="bg-black/5 px-4 py-3 border-b border-black/10">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-black opacity-60">Table of Contents</h3>
                </div>
                <CardContent className="p-2 grid gap-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-black/80 rounded-md hover:bg-black/5 hover:text-black transition-all text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-black/40 group-hover:text-black transition-colors">{section.icon}</span>
                        {section.title}
                      </div>
                      <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 text-black/40 transition-opacity" />
                    </button>
                  ))}
                </CardContent>
              </Card>

              <Card className="sticky top-[400px] border border-black/10 shadow-sm bg-black/5">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-start space-y-3">
                    <div className="p-2 bg-black/10 rounded-lg text-black">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-black text-sm">Have Privacy Concerns?</h3>
                      <p className="text-xs text-black opacity-60 mt-1 leading-relaxed">
                        Our Data Protection Officer is available to assist you.
                      </p>
                    </div>
                    <Button variant="link" className="text-black h-auto p-0 text-sm font-medium hover:text-black/80">
                      Contact DPO &rarr;
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9">
              <Card className="shadow-xl border-t-4 border-t-black bg-white print:border-none print:shadow-none">
                <CardHeader className="border-b border-black/10 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-black/5 rounded-xl border border-black/10 no-print">
                      <FileText className="h-8 w-8 text-black" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-black">Data Protection & Privacy</CardTitle>
                      <CardDescription className="text-black opacity-60 mt-1">
                        Your trust is paramount. Understand how we protect your personal information.
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
                          <div className="p-1.5 rounded-lg bg-black/5 text-black group-hover:bg-black/10 transition-colors no-print">
                            <FileText className="h-5 w-5" />
                          </div>
                          <h2 className="text-xl font-bold text-black">1. Introduction</h2>
                        </div>
                        <div className="text-base text-black opacity-80 leading-7 space-y-4 pl-1">
                          <p>
                            At <strong className="text-black">BondKonnect</strong>, we are deeply committed to safeguarding your privacy and protecting your personal data. This Privacy Policy (&quot;Policy&quot;) details how we collect, use, process, and disclose your information when you access or use our bond trading platform, portfolio management tools, and related services (collectively, the &quot;Services&quot;).
                          </p>
                          <p>
                            Your trust is paramount. By using our Services, you consent to the data practices described in this Policy. Please read it carefully.
                          </p>
                        </div>
                      </section>

                      <Separator className="bg-black/10 no-print" />

                      {/* Section 2: Data We Collect */}
                      <section id="data_collection" className="scroll-mt-6 group">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-1.5 rounded-lg bg-black/5 text-black group-hover:bg-black/10 transition-colors no-print">
                            <Database className="h-5 w-5" />
                          </div>
                          <h2 className="text-xl font-bold text-black">2. Data We Collect</h2>
                        </div>
                        <div className="text-base text-black opacity-80 leading-7 space-y-4 pl-1">
                          <p>We collect various types of information, including:</p>
                          <h4 className="font-semibold text-black mt-4 mb-2">2.1 Personal Data You Provide:</h4>
                          <ul className="list-disc pl-5 space-y-2 marker:text-black/60">
                            <li><strong>Identity Data:</strong> Full name, national identification number (e.g., Kenyan ID/Passport), date of birth, gender.</li>
                            <li><strong>Contact Data:</strong> Email address, phone number, physical address.</li>
                            <li><strong>Financial Data:</strong> Bank account details, CDS account numbers, transaction history, investment preferences, income information (as required by regulatory bodies).</li>
                            <li><strong>KYC (Know Your Customer) Data:</strong> Proof of address, source of funds, occupation, PEP (Politically Exposed Person) status.</li>
                            <li><strong>Profile Data:</strong> Username, password, preferences, feedback.</li>
                          </ul>
                          <h4 className="font-semibold text-black mt-4 mb-2">2.2 Data Collected Automatically:</h4>
                          <ul className="list-disc pl-5 space-y-2 marker:text-black/60">
                            <li><strong>Usage Data:</strong> Information about how you interact with our platform (e.g., pages visited, features used, time spent).</li>
                            <li><strong>Device Data:</strong> IP address, browser type, operating system, device identifiers.</li>
                            <li><strong>Location Data:</strong> General geographic location inferred from IP address.</li>
                          </ul>
                        </div>
                      </section>

                      <Separator className="bg-black/10 no-print" />

                      {/* Section 3: How We Use Your Data */}
                      <section id="data_use" className="scroll-mt-6 group">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-1.5 rounded-lg bg-black/5 text-black group-hover:bg-black/10 transition-colors no-print">
                            <UserCheck className="h-5 w-5" />
                          </div>
                          <h2 className="text-xl font-bold text-black">3. How We Use Your Data</h2>
                        </div>
                        <div className="text-base text-black opacity-80 leading-7 space-y-4 pl-1">
                          <p>We use your data for the following purposes:</p>
                          <ul className="list-disc pl-5 space-y-2 marker:text-black/60">
                            <li><strong>Service Provision:</strong> To operate, maintain, and provide the core functionalities of the BondKonnect platform, including processing bond trades, managing portfolios, and delivering market data.</li>
                            <li><strong>Personalization:</strong> To tailor your experience and offer relevant content and services.</li>
                            <li><strong>Transaction Processing:</strong> To execute and record financial transactions, process payments, and manage settlements.</li>
                            <li><strong>Communication:</strong> To send you service-related updates, security alerts, technical notices, and promotional messages (with your consent).</li>
                            <li><strong>Security and Fraud Prevention:</strong> To detect, prevent, and respond to potential fraud, abuse, and other security risks.</li>
                            <li><strong>Compliance & Regulatory:</strong> To comply with legal and regulatory obligations, including those stipulated by Kenyan laws, the Data Protection Act, 2019, and Central Bank of Kenya (CBK) guidelines. This includes KYC, AML (Anti-Money Laundering), and CFT (Combating the Financing of Terrorism) requirements.</li>
                            <li><strong>Analytics & Improvement:</strong> To monitor and analyze usage patterns to improve our Services, features, and user experience.</li>
                          </ul>
                        </div>
                      </section>

                      <Separator className="bg-black/10 no-print" />

                      {/* Section 4: Data Sharing and Disclosure */}
                      <section id="data_sharing" className="scroll-mt-6 group">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-1.5 rounded-lg bg-black/5 text-black group-hover:bg-black/10 transition-colors no-print">
                            <LinkIcon className="h-5 w-5" />
                          </div>
                          <h2 className="text-xl font-bold text-black">4. Data Sharing and Disclosure</h2>
                        </div>
                        <div className="text-base text-black opacity-80 leading-7 space-y-4 pl-1">
                          <p>We do not sell your personal data. We may share your information in limited circumstances:</p>
                          <ul className="list-disc pl-5 space-y-2 marker:text-black/60">
                            <li><strong>Service Providers:</strong> With trusted third-party service providers who perform services on our behalf (e.g., cloud hosting, payment processing, data analytics, KYC/AML checks). These providers are contractually bound to protect your data and use it only for the purposes for which it was disclosed.</li>
                            <li><strong>Legal & Regulatory Compliance:</strong> When required by law, court order, or governmental regulations, particularly those from the Central Bank of Kenya, Capital Markets Authority, or other relevant Kenyan authorities.</li>
                            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, where your data may be transferred as part of the transaction.</li>
                            <li><strong>With Your Consent:</strong> We may share your data with third parties when we have your explicit consent to do so.</li>
                          </ul>
                        </div>
                      </section>

                      <Separator className="bg-black/10 no-print" />

                      {/* Section 5: Data Security */}
                      <section id="security" className="scroll-mt-6 group">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-1.5 rounded-lg bg-black/5 text-black group-hover:bg-black/10 transition-colors no-print">
                            <Lock className="h-5 w-5" />
                          </div>
                          <h2 className="text-xl font-bold text-black">5. Data Security</h2>
                        </div>
                        <div className="text-base text-black opacity-80 leading-7 space-y-4 pl-1">
                          <p>
                            We employ robust technical and organizational security measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. These measures include:
                          </p>
                          <ul className="list-disc pl-5 space-y-2 marker:text-black/60">
                            <li><strong>Encryption:</strong> Data encryption in transit and at rest.</li>
                            <li><strong>Access Controls:</strong> Strict access controls and authentication mechanisms.</li>
                            <li><strong>Regular Audits:</strong> Periodic security audits and vulnerability assessments.</li>
                            <li><strong>Employee Training:</strong> Regular training for our staff on data protection best practices.</li>
                          </ul>
                          <p className="mt-4">
                            While we strive to protect your data, no method of transmission over the Internet or method of electronic storage is 100% secure.
                          </p>
                        </div>
                      </section>

                      <Separator className="bg-black/10 no-print" />

                      {/* Section 6: Your Rights */}
                      <section id="your_rights" className="scroll-mt-6 group">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-1.5 rounded-lg bg-black/5 text-black group-hover:bg-black/10 transition-colors no-print">
                            <Fingerprint className="h-5 w-5" />
                          </div>
                          <h2 className="text-xl font-bold text-black">6. Your Data Protection Rights</h2>
                        </div>
                        <div className="text-base text-black opacity-80 leading-7 space-y-4 pl-1">
                          <p>In accordance with Kenyan data protection laws, you have the following rights:</p>
                          <ul className="list-disc pl-5 space-y-2 marker:text-black/60">
                            <li><strong>Right to Access:</strong> Request a copy of the personal data we hold about you.</li>
                            <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete data.</li>
                            <li><strong>Right to Erasure:</strong> Request the deletion of your personal data under certain conditions.</li>
                            <li><strong>Right to Object:</strong> Object to the processing of your personal data.</li>
                            <li><strong>Right to Restriction:</strong> Request the restriction of processing your personal data.</li>
                            <li><strong>Right to Data Portability:</strong> Request to transfer your data to another organization or directly to you.</li>
                            <li><strong>Right to Withdraw Consent:</strong> Withdraw your consent at any time where we rely on consent to process your personal data.</li>
                          </ul>
                          <p className="mt-4">
                            To exercise any of these rights, please contact our Data Protection Officer at privacy@bondkonnect.com.
                          </p>
                        </div>
                      </section>

                      <Separator className="bg-black/10 no-print" />

                      {/* Section 7: Compliance with Kenyan Regulations */}
                      <section id="kenyan_regulations" className="scroll-mt-6 group">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-1.5 rounded-lg bg-black/5 text-black group-hover:bg-black/10 transition-colors no-print">
                            <Scale className="h-5 w-5" />
                          </div>
                          <h2 className="text-xl font-bold text-black">7. Compliance with Kenyan Regulations</h2>
                        </div>
                        <div className="text-base text-black opacity-80 leading-7 space-y-4 pl-1">
                          <p>BondKonnect is fully compliant with:</p>
                          <ul className="list-disc pl-5 space-y-2 marker:text-black/60">
                            <li><strong>The Data Protection Act, 2019 (Kenya):</strong> We adhere to the principles of data protection as enshrined in this Act, ensuring lawful processing, purpose limitation, data minimization, accuracy, storage limitation, integrity, and confidentiality.</li>
                            <li><strong>Central Bank of Kenya (CBK) Regulations:</strong> We comply with all relevant CBK directives and prudential guidelines regarding data privacy, cybersecurity, and consumer protection in the financial sector.</li>
                            <li><strong>Capital Markets Authority (CMA) Guidelines:</strong> Our data handling practices align with CMA regulations for licensed market intermediaries.</li>
                          </ul>
                          <p className="mt-4">
                            We regularly review and update our practices to ensure ongoing compliance with the evolving regulatory landscape in Kenya.
                          </p>
                        </div>
                      </section>

                    </div>
                  </ScrollArea>
                </CardContent>
                
                <CardFooter className="bg-black/5 border-t border-black/10 p-6 flex flex-col md:flex-row justify-between items-center gap-6 no-print">
                  <div className="flex items-start gap-3 max-w-md">
                    <CheckCircle2 className="h-5 w-5 text-black mt-0.5 shrink-0" />
                    <div className="text-xs text-black opacity-80">
                      <p className="font-medium text-black mb-1">Consent Acknowledgment</p>
                      <p>By using our services, you acknowledge that you have read and understood this Privacy Policy.</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <Button 
                      onClick={() => router.back()} 
                      variant="outline" 
                      className="w-full sm:w-auto bg-white border-black/20 text-black hover:bg-black/5 hover:text-black"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Go Back
                    </Button>
                    <Button 
                      onClick={handleAgree} 
                      className="w-full sm:w-auto bg-black hover:bg-black/90 text-white shadow-md shadow-black/20"
                    >
                      I Understand
                    </Button>
                  </div>
                </CardFooter>
              </Card>
              
              <div className="mt-8 text-center text-xs text-black opacity-40 no-print">
                <p>&copy; {new Date().getFullYear()} BondKonnect Financial Services. All rights reserved.</p>
                <div className="flex justify-center gap-6 mt-3">
                  <a href="/auth/terms" className="hover:text-black/80 transition-colors underline underline-offset-2">Terms of Service</a>
                  <a href="#" className="hover:text-black/80 transition-colors underline underline-offset-2">Cookie Policy</a>
                  <a href="#" className="hover:text-black/80 transition-colors underline underline-offset-2">Legal Disclaimer</a>
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