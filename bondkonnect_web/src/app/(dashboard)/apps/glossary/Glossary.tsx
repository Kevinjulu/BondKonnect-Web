"use client";
import { useState } from "react";
import Image from "next/image";
import PageContainer from "../../components/container/PageContainer";
import {GlossaryComponent} from "../../components/apps/glossary/GlossaryComponent";
export default function GlossaryPage({ userDetails }: { userDetails: UserData }) {
  return (

    <PageContainer title="Glossary Page" description="this is Glossary page">
        <div className=" space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Glossary</h2>
            <div className="flex items-center space-x-2">

           

            </div>
          </div>
    
          <GlossaryComponent/>
        </div>      

    </PageContainer>
  );
}
