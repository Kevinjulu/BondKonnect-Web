'use client'
import { useState, useEffect, useCallback } from 'react'
import { AlertCircle, Filter, ArrowUpDown, Calendar, Clock, DollarSign, Percent, Hash, Building2, Loader2 } from 'lucide-react'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from '@/app/components/ui/dialog'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/app/components/ui/select'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/app/components/ui/table'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/tabs'
import { toast } from 'react-hot-toast'
import { getUserTransactions, markTransactionStatus } from '@/app/lib/actions/api.actions'

interface Transaction {
  Id: number
  QuoteId: number
  UserEmail: string
  BidPrice: number
  BidYield: number
  OfferPrice: number
  OfferYield: number
  BidAmount: number
  OfferAmount: number
  IsAccepted: boolean
  IsRejected: boolean
  IsPending: boolean
  IsDelegated: boolean
  CreatedAt: string
  UpdatedAt: string
  Quote: {
    Id: number
    BondName: string
    BondSymbol: string
    BondType: string
    Maturity: string
    Coupon: number
  }
}

interface TransactionTableProps {
  userDetails: Record<string, unknown>
}

export function TransactionTable({ userDetails }: TransactionTableProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [activeTab, setActiveTab] = useState('received')

    const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true)
      if (userDetails?.Email) {
        const result = await getUserTransactions(userDetails.Email as string)
        if (result && result.success) {
          setTransactions(result.data.map((transaction: Transaction) => ({
            ...transaction,
          })))
        }
      }
    } catch {
      toast.error('Failed to fetch transactions')
    } finally {
      setLoading(false)
    }
  }, [userDetails?.Email])

  useEffect(() => {
    fetchTransactions()
  }, [userDetails, fetchTransactions])

  const handleStatusUpdate = async (transactionId: number, statusType: 'accepted' | 'rejected') => {
    try {
      setLoading(true)
      const result = await markTransactionStatus({
        trans_id: transactionId,
        user_email: userDetails?.Email as string,
        is_accepted: statusType === 'accepted',
        is_rejected: statusType === 'rejected',
        is_pending: false,
        is_delegated: false
      })
      
      if (result?.success) {
        toast.success(`Transaction ${statusType} successfully`)
        fetchTransactions()
      } else {
        toast.error(result?.message || `Failed to ${statusType.toLowerCase()} transaction`)
      }
    } catch {
      toast.error(`Failed to ${statusType.toLowerCase()} transaction`)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (transaction: Transaction) => {
    if (transaction.IsAccepted) return <Badge className="bg-green-100 text-green-800">Accepted</Badge>
    if (transaction.IsRejected) return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
    if (transaction.IsDelegated) return <Badge className="bg-blue-100 text-blue-800">Delegated</Badge>
    return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
  }

  const filteredTransactions = transactions.filter(transaction => {
    switch (activeTab) {
      case 'accepted':
        return transaction.IsAccepted
      case 'rejected':
        return transaction.IsRejected
      case 'pending':
        return transaction.IsPending
      case 'delegated':
        return transaction.IsDelegated
      default:
        return true
    }
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Transactions</h2>
          <p className="text-muted-foreground">
            Manage your bond trading transactions
          </p>
        </div>
        <Button onClick={fetchTransactions} variant="outline" size="icon">
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="received">All</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="delegated">Delegated</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Transactions
              </CardTitle>
              <CardDescription>
                {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bond</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Bid/Offer</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <div className="flex flex-col items-center gap-2">
                              <AlertCircle className="h-8 w-8 text-muted-foreground" />
                              <p className="text-muted-foreground">No transactions found</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredTransactions.map((transaction) => (
                          <TableRow key={transaction.Id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{transaction.Quote.BondSymbol}</div>
                                <div className="text-sm text-muted-foreground">
                                  {transaction.Quote.BondName}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{transaction.Quote.BondType}</TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="text-sm">
                                  Bid: ${transaction.BidPrice?.toFixed(2)} ({transaction.BidYield?.toFixed(2)}%)
                                </div>
                                <div className="text-sm">
                                  Offer: ${transaction.OfferPrice?.toFixed(2)} ({transaction.OfferYield?.toFixed(2)}%)
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="text-sm">Bid: ${transaction.BidAmount?.toLocaleString()}</div>
                                <div className="text-sm">Offer: ${transaction.OfferAmount?.toLocaleString()}</div>
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(transaction)}</TableCell>
                            <TableCell>
                              {new Date(transaction.CreatedAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {transaction.IsPending && (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() => handleStatusUpdate(transaction.Id, 'accepted')}
                                    >
                                      Accept
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleStatusUpdate(transaction.Id, 'rejected')}
                                    >
                                      Reject
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
