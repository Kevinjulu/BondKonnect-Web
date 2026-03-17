"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import PageContainer from "../../components/container/PageContainer"
import { Button } from "@/components/ui/button"
import EmailList from "./EmailsList"
import { CreateEmailDialog } from "./CreateEmailDialog"
import React from "react"

export default function EmailsPage({ userDetails }: { userDetails: UserData }) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <PageContainer title="Emails | BondKonnect" description="Send and manage system emails and communications.">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-black text-black">Email Communications</h2>
            <p className="text-neutral-500 mt-1">
              Manage internal and external communications across the BondKonnect platform.
            </p>
          </div>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-black text-white hover:bg-neutral-800 transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <Plus className="w-4 h-4 mr-2" />
            Compose Message
          </Button>
        </div>

        <div className="pt-4">
          <EmailList userDetails={userDetails} />
        </div>

        <CreateEmailDialog 
          userDetails={userDetails} 
          open={isCreateDialogOpen} 
          onOpenChange={setIsCreateDialogOpen} 
        />
      </div>
    </PageContainer>
  )
}