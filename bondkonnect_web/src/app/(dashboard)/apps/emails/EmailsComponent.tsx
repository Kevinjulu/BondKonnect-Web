"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import PageContainer from "../../components/container/PageContainer"
import { Button } from "@/components/ui/button"
import EmailList from "./EmailsList"
import { CreateEmailDialog } from "./CreateEmailDialog"
import { getCurrentUserDetails } from "@/lib/actions/user.check"
import { redirect } from "next/navigation"
import React from "react"

export default function EmailsPage({ userDetails }: { userDetails: UserData }) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <PageContainer title="Emails" description="Send and manage emails">
      <div className="space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Emails</h2>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Email
          </Button>
        </div>

        <EmailList userDetails={userDetails} />

        <CreateEmailDialog userDetails={userDetails} open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
      </div>
    </PageContainer>
  )
}
