"use client";

import Image from "next/image";
import React, { useState, useMemo, useEffect } from 'react'
import PageContainer from "../../components/container/PageContainer";
import { BondSelector, Bond } from "../../components/apps/portfolio-assistant/BondSelector";
import { PortfolioScorecard } from "../../components/apps/portfolio-assistant/PortfolioScorecard";

export default function PortfolioAssistantPage({ userDetails }: { userDetails: UserData }) {
    
  const [selectedBonds, setSelectedBonds] = useState<Bond[]>([])
  
  return (

    <PageContainer title="Portfolio Assistant Page" description="this is Portfolio Assistant page">
        <div className="space-y-4 p-8 pt-6 overflow-x-auto">
          <div className="flex items-center justify-between space-y-2">
            {/* <h2 className="text-3xl font-bold tracking-tight">Portfolio Assistant</h2> */}
            {/* <div className="flex items-center space-x-2">

           

            </div> */}
          </div>
          {/* <BondSelector onSelect={setSelectedBonds} /> */}
        <div className="grid grid-cols-1 ">
          <PortfolioScorecard userDetails={userDetails} />
        </div>
        </div>      

    </PageContainer>
  );
}
