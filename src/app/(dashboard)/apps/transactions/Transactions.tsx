'use client'

import { useState } from 'react'
import PageContainer from "../../components/container/PageContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { TransactionTable } from "../../components/apps/transactions/transaction-table-new";


export default function TransactionsPage({ userDetails }: { userDetails: UserData }) {
  const [hasDelegatedTransactions] = useState(false);
  
  // useEffect(() => {
  //   const checkDelegatedAccess = async () => {
  //     if (userDetails?.email) {
  //       try {
  //         const result = await getDelegatedTransactions(userDetails.email);
  //         setHasDelegatedTransactions(result?.success || false);
  //       } catch (error) {
  //         console.error("Error checking delegated transactions:", error);
  //         setHasDelegatedTransactions(false);
  //       }
  //     }
  //   };
    
  //   checkDelegatedAccess();
  // }, [userDetails]);
    
  return (
    <PageContainer title="My Transactions" description="View and manage your bond transactions">
      <div className="space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">My Transactions</h2>
          <div className="flex items-center space-x-2">
            {/* Additional buttons/actions could go here */}
          </div>
        </div>
        <Tabs defaultValue="sent" className="w-full">
          <TabsList className={`grid w-full ${hasDelegatedTransactions ? 'grid-cols-3' : 'grid-cols-2'} mb-8`}>
            <TabsTrigger value="sent">Sent Transactions</TabsTrigger>
            <TabsTrigger value="received">Received Transactions</TabsTrigger>
            {hasDelegatedTransactions && <TabsTrigger value="delegated">Delegated Transactions</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="sent">
            <TransactionTable  userDetails={userDetails} />
          </TabsContent>
          
          <TabsContent value="received">
            <TransactionTable  userDetails={userDetails} />
          </TabsContent>
          
          {hasDelegatedTransactions && (
            <TabsContent value="delegated">
              <TransactionTable  userDetails={userDetails} />
            </TabsContent>
          )}
        </Tabs>
      </div>      
    </PageContainer>
  )
}

