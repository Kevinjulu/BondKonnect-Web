"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "./components/container/PageContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger,} from "@/app/components/ui/tabs"
import { CalendarDateRangePicker } from "./components/apps/dashboard/DateRangePicker";
import { BondCalc } from "./components/apps/dashboard/BondCalc";
import { InlineBondCalc } from "./components/apps/dashboard/InlineBondCalc";
import  { BondScreensTable } from "./components/apps/dashboard/BondScreensTable";
import { SpotYieldChart } from "./components/apps/dashboard/SpotYieldChart";
import { BondMarketChart } from "./components/apps/dashboard/BondMarketChart";
import { Barbell } from "./components/apps/dashboard/BarbellTable";
import { getCurrentUserDetails } from "@/app/lib/actions/user.check";

export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUserDetails = async () => {
          try {
            const user = await getCurrentUserDetails();
            if (!user) {
              router.push("/auth/login");
            }
            setIsLoading(false);
          } catch (error) {
            router.push("/auth/login");
          }
        };
    
        fetchUserDetails();
      }, [router]);
    
      if (isLoading) {
        return null; // or return a loading spinner
      }
    
  return (
   
    <PageContainer title="Dashboard Page" description="this is Dashboard page">
     
        <div className="flex h-screen flex-col lg:flex-row">
          {/* Main Content Area */}
          <div className="flex-1 space-y-4 p-8 pt-6 min-w-0 overflow-y-auto">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
              <div className="flex items-center space-x-2">
                <CalendarDateRangePicker />
                {/* Keep original Bond Calculator in header for mobile/tablet */}
                <div className="lg:hidden">
                  <BondCalc/>
                </div>
              </div>
            </div>
            <Tabs defaultValue="spotyield" className="space-y-4">
              <TabsList>
                <TabsTrigger value="spotyield"  >Yield Curve Analysis</TabsTrigger>
                <TabsTrigger value="bondscreen" >
                  Bond Screens
                </TabsTrigger>
                <TabsTrigger value="barbell" >
                  Barbell Vs Bullet Indicators
                </TabsTrigger>
                {/* <TabsTrigger value="notifications" disabled>
                  Notifications
                </TabsTrigger> */}
              </TabsList>
              <TabsContent value="spotyield" className="space-y-4">

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">          
                  <SpotYieldChart/>            
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
                    {/* <BondMarketChart/>          */}
                </div>
              </TabsContent>
              <TabsContent value="bondscreen" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-12">
                  <BondScreensTable/>
                </div>
              </TabsContent>
              <TabsContent value="barbell" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-12">
                  <Barbell/>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar Section - Hidden on mobile/tablet */}
          <div className="hidden lg:flex lg:flex-col w-96 border-l border-border bg-white p-4 overflow-hidden max-h-screen">
            {/* Inline Bond Calculator */}
            <div className="flex-1 min-h-0 max-h-full">
              <InlineBondCalc />
            </div>
          </div>
        </div>
     
    </PageContainer>
    
   
  );
}
