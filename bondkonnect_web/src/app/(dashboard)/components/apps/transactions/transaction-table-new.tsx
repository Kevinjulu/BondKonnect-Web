'use client'
import { useState, useEffect, useCallback } from 'react'
import { AlertCircle, ArrowUpDown, Eye, Check, X, Loader2, Calendar, FileText, User, DollarSign, Percent, MoreHorizontal, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { toast } from 'react-hot-toast'
import { getUserTransactions, markTransactionStatus } from '@/lib/actions/api.actions'
import { getUserCredibility } from '@/lib/actions/ratings.actions'
import { RatingModal } from '@/components/ratings/RatingModal'
import { CredibilityBadge } from '@/components/ratings/CredibilityBadge'
import type { UserCredibilityScore } from '@/lib/types/ratings'
import { format } from 'date-fns'
import { cn } from "@/lib/utils"

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
  transaction_type: 'Sent' | 'Received' | 'Delegated'
  PlacementNo: string
  ratee_id: number | null
  ratee_name: string | null
  ratee_email: string | null
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
  userDetails: Record<string, any>
}

export function TransactionTable({ userDetails }: TransactionTableProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('received')
  
  // Rating state
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false)
  const [rateeCredibility, setRateeCredibility] = useState<UserCredibilityScore | null>(null)
  const [isFetchingCredibility, setIsFetchingCredibility] = useState(false)

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

  // Fetch credibility when a transaction is selected
  useEffect(() => {
    const fetchCredibility = async () => {
      if (selectedTransaction?.ratee_id) {
        try {
          setIsFetchingCredibility(true)
          const result = await getUserCredibility(selectedTransaction.ratee_id)
          if (result && result.success) {
            setRateeCredibility(result.data)
          } else {
            setRateeCredibility(null)
          }
        } catch (error) {
          console.error('Error fetching credibility:', error)
          setRateeCredibility(null)
        } finally {
          setIsFetchingCredibility(false)
        }
      } else {
        setRateeCredibility(null)
      }
    }

    if (isDetailsOpen && selectedTransaction) {
      fetchCredibility()
    }
  }, [isDetailsOpen, selectedTransaction])

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
    if (transaction.IsAccepted) {
        return (
            <Badge className="bg-black text-white hover:bg-neutral-800 border-none transition-all rounded-full px-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white mr-2" />
                Accepted
            </Badge>
        )
    }
    if (transaction.IsRejected) {
        return (
            <Badge variant="outline" className="bg-transparent text-black border-neutral-400 transition-all rounded-full px-2">
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 mr-2" />
                Rejected
            </Badge>
        )
    }
    if (transaction.IsDelegated) {
        return (
             <Badge variant="outline" className="bg-neutral-100 text-black border-neutral-300 rounded-full px-2">
                Delegated
            </Badge>
        )
    }
    return (
        <Badge variant="secondary" className="bg-neutral-100 text-black border-neutral-200 hover:bg-neutral-200 rounded-full px-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mr-2 animate-pulse" />
            Pending
        </Badge>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value)
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-black">Transactions</h2>
          <p className="text-muted-foreground mt-1">
            Manage your trading activity and history
          </p>
        </div>
        <Button 
          onClick={fetchTransactions} 
          variant="outline" 
          className="bg-black text-white border-black hover:bg-neutral-800"
        >
          <ArrowUpDown className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-neutral-100 p-1 rounded-xl border border-neutral-200 w-full max-w-2xl grid grid-cols-5 gap-1">
          <TabsTrigger value="received" className="rounded-lg data-[state=active]:bg-black data-[state=active]:text-white text-neutral-500">All</TabsTrigger>
          <TabsTrigger value="accepted" className="rounded-lg data-[state=active]:bg-black data-[state=active]:text-white text-neutral-500">Accepted</TabsTrigger>
          <TabsTrigger value="rejected" className="rounded-lg data-[state=active]:bg-black data-[state=active]:text-white text-neutral-500">Rejected</TabsTrigger>
          <TabsTrigger value="pending" className="rounded-lg data-[state=active]:bg-black data-[state=active]:text-white text-neutral-500">Pending</TabsTrigger>
          <TabsTrigger value="delegated" className="rounded-lg data-[state=active]:bg-black data-[state=active]:text-white text-neutral-500">Delegated</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6 space-y-4">
          <Card className="border border-neutral-200 shadow-sm bg-white">
            <CardHeader className="px-6 py-4 border-b border-neutral-200 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-black">
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Transactions
                  </CardTitle>
                  <CardDescription className="text-xs mt-1 text-neutral-500">
                    Showing {filteredTransactions.length} record{filteredTransactions.length !== 1 ? 's' : ''}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-black opacity-20" />
                  <p className="text-sm text-neutral-500">Loading transactions...</p>
                </div>
              ) : (
                <div className="relative w-full overflow-auto">
                  <Table>
                    <TableHeader className="bg-neutral-50">
                      <TableRow className="hover:bg-transparent border-neutral-200">
                        <TableHead className="w-[200px] text-neutral-600 pl-6">Instrument</TableHead>
                        <TableHead className="text-neutral-600">Type</TableHead>
                        <TableHead className="text-right text-neutral-600">Price / Yield</TableHead>
                        <TableHead className="text-right text-neutral-600">Amount</TableHead>
                        <TableHead className="text-neutral-600 pl-8">Status</TableHead>
                        <TableHead className="text-neutral-600">Date</TableHead>
                        <TableHead className="text-right text-neutral-600 pr-6">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-24">
                            <div className="flex flex-col items-center gap-3">
                              <div className="h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center">
                                <AlertCircle className="h-6 w-6 text-neutral-400" />
                              </div>
                              <div className="space-y-1">
                                <p className="font-medium text-black">No transactions found</p>
                                <p className="text-sm text-neutral-500">Clear filters or check back later.</p>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredTransactions.map((transaction) => (
                          <TableRow key={transaction.Id} className="group hover:bg-neutral-50 transition-colors border-b border-neutral-200 last:border-0">
                            <TableCell className="pl-6 py-4">
                              <div className="flex flex-col">
                                <span className="font-bold text-sm text-black">{transaction.Quote.BondSymbol}</span>
                                <span className="text-xs text-neutral-500 truncate max-w-[200px]" title={transaction.Quote.BondName}>
                                  {transaction.Quote.BondName}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <Badge variant="outline" className="text-[10px] font-normal px-2 py-0.5 bg-neutral-100 border-neutral-300 text-black">
                                {transaction.Quote.BondType}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right py-4">
                              <div className="flex flex-col items-end gap-1">
                                <div className="text-sm font-medium tabular-nums text-black">
                                  {formatCurrency(transaction.BidPrice)}
                                </div>
                                <div className="text-xs text-neutral-500 tabular-nums">
                                  {transaction.BidYield.toFixed(2)}%
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right py-4">
                              <div className="text-sm font-medium tabular-nums text-black">
                                {formatNumber(transaction.BidAmount)}
                              </div>
                            </TableCell>
                            <TableCell className="pl-8 py-4">
                              {getStatusBadge(transaction)}
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-black">
                                  {format(new Date(transaction.CreatedAt), 'MMM d')}
                                </span>
                                <span className="text-xs text-neutral-500">
                                  {format(new Date(transaction.CreatedAt), 'yyyy')}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="pr-6 py-4">
                              <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:bg-neutral-100 rounded-full text-black"
                                  onClick={() => {
                                    setSelectedTransaction(transaction)
                                    setIsDetailsOpen(true)
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {transaction.IsPending && (
                                  <>
                                    <Button
                                      size="sm"
                                      className="bg-black text-white hover:bg-neutral-800 h-8 w-8 p-0 rounded-full shadow-sm"
                                      onClick={() => handleStatusUpdate(transaction.Id, 'accepted')}
                                      title="Accept"
                                    >
                                      <Check className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="bg-white text-black border-neutral-300 hover:bg-neutral-100 h-8 w-8 p-0 rounded-full shadow-sm"
                                      onClick={() => handleStatusUpdate(transaction.Id, 'rejected')}
                                      title="Reject"
                                    >
                                      <X className="h-3.5 w-3.5" />
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

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden gap-0 bg-white text-black border-neutral-200">
          <DialogHeader className="px-6 py-6 border-b border-neutral-200 bg-neutral-50">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-bold text-black">Transaction Details</DialogTitle>
                <DialogDescription className="mt-1 text-neutral-500">
                  Reference ID: <span className="font-mono text-black font-medium">#{selectedTransaction?.Id}</span>
                </DialogDescription>
              </div>
              {selectedTransaction && getStatusBadge(selectedTransaction)}
            </div>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="grid grid-cols-12 divide-x divide-neutral-200">
              {/* Left Column: Bond Info */}
              <div className="col-span-12 md:col-span-5 p-6 space-y-6 bg-white">
                <div>
                  <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Instrument</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-neutral-500">Bond Symbol</label>
                      <p className="text-base font-semibold text-black">{selectedTransaction.Quote.BondSymbol}</p>
                    </div>
                    <div>
                      <label className="text-xs text-neutral-500">Type</label>
                      <p className="text-sm font-medium text-black">{selectedTransaction.Quote.BondType}</p>
                    </div>
                  </div>
                </div>

                {selectedTransaction.ratee_name && (
                  <div className="pt-4 border-t border-neutral-100">
                    <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Counterparty</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-semibold text-black">{selectedTransaction.ratee_name}</p>
                        <p className="text-xs text-neutral-500">{selectedTransaction.ratee_email}</p>
                      </div>
                      
                      {isFetchingCredibility ? (
                        <div className="flex items-center gap-2 py-2">
                          <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
                          <span className="text-xs text-neutral-500">Fetching reputation...</span>
                        </div>
                      ) : (
                        <CredibilityBadge 
                          credibilityScore={rateeCredibility} 
                          size="sm" 
                          interactive={true}
                        />
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-neutral-100">
                   <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Timing</h4>
                   <div className="flex items-center gap-2 text-sm text-black">
                      <Calendar className="h-4 w-4 text-neutral-400" />
                      <span>{format(new Date(selectedTransaction.CreatedAt), 'MMMM d, yyyy')}</span>
                   </div>
                </div>
              </div>

              {/* Right Column: Economics */}
              <div className="col-span-12 md:col-span-7 p-6 bg-neutral-50">
                <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Deal Economics</h4>
                
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded-lg border border-neutral-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-sm font-medium text-black">Bid Side</span>
                       <Badge variant="outline" className="text-[10px] bg-neutral-100 text-black border-neutral-300">BUY</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                         <span className="text-xs text-neutral-500">Price</span>
                         <p className="text-sm font-semibold text-black">{formatCurrency(selectedTransaction.BidPrice)}</p>
                      </div>
                      <div>
                         <span className="text-xs text-neutral-500">Yield</span>
                         <p className="text-sm font-semibold text-black">{selectedTransaction.BidYield.toFixed(2)}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-neutral-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-sm font-medium text-black">Offer Side</span>
                       <Badge variant="outline" className="text-[10px] bg-neutral-100 text-black border-neutral-300">SELL</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                         <span className="text-xs text-neutral-500">Price</span>
                         <p className="text-sm font-semibold text-black">{formatCurrency(selectedTransaction.OfferPrice)}</p>
                      </div>
                      <div>
                         <span className="text-xs text-neutral-500">Yield</span>
                         <p className="text-sm font-semibold text-black">{selectedTransaction.OfferYield.toFixed(2)}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-dashed border-neutral-300">
                    <div className="flex justify-between items-center">
                       <span className="text-sm font-medium text-neutral-500">Total Amount</span>
                       <span className="text-lg font-bold tabular-nums text-black">{formatNumber(selectedTransaction.BidAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="p-6 pt-4 border-t border-neutral-200 bg-white">
            <div className="flex w-full justify-between items-center">
              <div>
                {selectedTransaction?.IsAccepted && selectedTransaction.ratee_id && (
                  <Button 
                    onClick={() => setIsRatingModalOpen(true)}
                    variant="outline"
                    className="bg-neutral-900 text-white hover:bg-black border-none"
                  >
                    <Star className="h-4 w-4 mr-2 text-amber-400 fill-amber-400" />
                    Rate Trader
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDetailsOpen(false)}
                  className="bg-white text-black border-neutral-300 hover:bg-neutral-100"
                >
                  Close
                </Button>
                {selectedTransaction?.IsPending && (
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => {
                        handleStatusUpdate(selectedTransaction.Id, 'accepted')
                        setIsDetailsOpen(false)
                      }}
                      className="bg-black text-white hover:bg-neutral-800 shadow-sm"
                    >
                      Accept Deal
                    </Button>
                    <Button 
                      onClick={() => {
                        handleStatusUpdate(selectedTransaction.Id, 'rejected')
                        setIsDetailsOpen(false)
                      }}
                      variant="outline"
                      className="bg-white text-black border-neutral-300 hover:bg-neutral-100"
                    >
                      Reject Deal
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rating Modal */}
      {selectedTransaction && selectedTransaction.ratee_id && (
        <RatingModal
          open={isRatingModalOpen}
          onOpenChange={setIsRatingModalOpen}
          transactionId={selectedTransaction.Id}
          raterId={Number(userDetails.id)}
          rateeId={selectedTransaction.ratee_id}
          rateeName={selectedTransaction.ratee_name || 'Trader'}
          onSuccess={() => {
            fetchTransactions()
          }}
        />
      )}
    </div>
  )
}
