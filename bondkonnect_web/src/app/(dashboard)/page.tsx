"use client";
import PageContainer from "./components/container/PageContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger,} from "@/components/ui/tabs"
import { CalendarDateRangePicker } from "./components/apps/dashboard/DateRangePicker";
import { BondCalc } from "./components/apps/dashboard/BondCalc";
import { InlineBondCalc } from "./components/apps/dashboard/InlineBondCalc";
import  { BondScreensTable } from "./components/apps/dashboard/BondScreensTable";
import { SpotYieldChart } from "./components/apps/dashboard/SpotYieldChart";
import { Barbell } from "./components/apps/dashboard/BarbellTable";
import { LayoutDashboard } from "lucide-react";

export default function Home() {
  return (
    <PageContainer title="BondKonnect Dashboard" description="Bond trading and portfolio analytics dashboard">
        <div className="flex h-screen flex-col lg:flex-row bg-white text-black overflow-hidden">
          {/* Main Content Area */}
          <div className="flex-1 space-y-6 p-8 pt-6 min-w-0 overflow-y-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <LayoutDashboard className="h-6 w-6 text-neutral-400" />
                  <h2 className="text-3xl font-bold tracking-tight text-black">Market Dashboard</h2>
                </div>
                <p className="text-neutral-500 text-sm">Real-time market analytics and bond performance indicators.</p>
              </div>
              <div className="flex items-center gap-3">
                <CalendarDateRangePicker />
                {/* Mobile Calculator */}
                <div className="lg:hidden">
                  <BondCalc/>
                </div>
              </div>
            </div>

            <Tabs defaultValue="spotyield" className="space-y-6">
              <div className="bg-neutral-50 p-1 rounded-xl w-fit border border-neutral-200">
                <TabsList className="bg-transparent gap-1">
                  <TabsTrigger value="spotyield" className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm px-6">Yield Curve</TabsTrigger>
                  <TabsTrigger value="bondscreen" className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm px-6">Bond Screens</TabsTrigger>
                  <TabsTrigger value="barbell" className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm px-6">Indicators</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="spotyield" className="space-y-6 focus-visible:outline-none">
                <div className="grid gap-6 md:grid-cols-12">          
                  <div className="col-span-12 bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
                    <SpotYieldChart/>            
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="bondscreen" className="space-y-6 focus-visible:outline-none">
                <div className="grid gap-6 md:grid-cols-12">
                  <div className="col-span-12">
                    <BondScreensTable/>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="barbell" className="space-y-6 focus-visible:outline-none">
                <div className="grid gap-6 md:grid-cols-12">
                  <div className="col-span-12">
                    <Barbell/>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar Section - Professional Calculator Panel */}
          <div className="hidden lg:flex lg:flex-col w-[400px] border-l border-neutral-200 bg-white p-6 overflow-hidden max-h-screen">
            <div className="mb-6 flex items-center justify-between border-b border-neutral-100 pb-4">
              <h3 className="text-lg font-bold text-black uppercase tracking-tight">Trade Calculator</h3>
              <div className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center">
                <Calculator className="h-4 w-4 text-black" />
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <InlineBondCalc />
            </div>
          </div>
        </div>
    </PageContainer>
  );
}

// Simple Calculator Icon if lucide doesn't have it imported above
function Calculator(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <line x1="8" x2="16" y1="6" y2="6" />
      <line x1="16" x2="16" y1="14" y2="18" />
      <path d="M16 10h.01" />
      <path d="M12 10h.01" />
      <path d="M8 10h.01" />
      <path d="M12 14h.01" />
      <path d="M8 14h.01" />
      <path d="M12 18h.01" />
      <path d="M8 18h.01" />
    </svg>
  )
}