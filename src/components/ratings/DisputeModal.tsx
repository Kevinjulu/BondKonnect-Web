'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { disputeRating } from '@/lib/actions/ratings.actions'
import { AlertCircle, Loader2, CheckCircle2, Flag } from 'lucide-react'

interface DisputeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ratingId: number
  ratingText?: string
  raterName?: string
  onSuccess?: () => void
}

export function DisputeModal({
  open,
  onOpenChange,
  ratingId,
  ratingText = '',
  raterName = 'User',
  onSuccess
}: DisputeModalProps) {
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please provide a reason for disputing this rating',
        variant: 'destructive'
      })
      return
    }

    if (reason.length < 20) {
      toast({
        title: 'Validation Error',
        description: 'Dispute reason must be at least 20 characters',
        variant: 'destructive'
      })
      return
    }

    try {
      setLoading(true)
      await disputeRating(ratingId, reason)
      setSubmitted(true)
      
      toast({
        title: 'Dispute Submitted',
        description: 'Your dispute has been filed. Our admin team will review it within 48 hours.',
        variant: 'default'
      })

      setTimeout(() => {
        setSubmitted(false)
        setReason('')
        onOpenChange(false)
        onSuccess?.()
      }, 2000)
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit dispute',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading && !submitted) {
      setReason('')
      setSubmitted(false)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg bg-white border-neutral-200 p-0 overflow-hidden shadow-2xl rounded-2xl">
        {/* Header */}
        <div className="bg-red-50 p-6 border-b border-neutral-200">
          <DialogHeader>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 flex-shrink-0">
                <Flag className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <DialogTitle className="text-lg font-black text-black tracking-tight">
                  Dispute Rating
                </DialogTitle>
                <DialogDescription className="text-sm text-neutral-600 mt-1">
                  Challenge a rating you believe is unfair or inaccurate
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Content */}
        {!submitted ? (
          <div className="space-y-6 p-6">
            {/* Rating Info */}
            {ratingText && (
              <div className="bg-neutral-50 border-l-4 border-red-500 p-4 rounded-lg">
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Disputed Rating</p>
                <p className="text-sm text-neutral-700 italic">"{ratingText}"</p>
                <p className="text-xs text-neutral-500 mt-2">From: <span className="font-bold">{raterName}</span></p>
              </div>
            )}

            {/* Warning Box */}
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-yellow-900 mb-1">Important Notice</p>
                  <p className="text-xs text-yellow-800 leading-relaxed">
                    False disputes harm our community. Submitting fraudulent disputes may result in account restrictions or suspension. Be honest and specific about why you believe this rating is inaccurate.
                  </p>
                </div>
              </div>
            </div>

            {/* Dispute Reason */}
            <div className="space-y-2">
              <Label htmlFor="dispute-reason" className="text-sm font-bold text-black">
                Reason for Dispute <span className="text-red-600">*</span>
              </Label>
              <Textarea
                id="dispute-reason"
                placeholder="Explain why you disagree with this rating. Be specific about what was inaccurate or unfair. (minimum 20 characters)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[120px] border-neutral-200 bg-white text-black placeholder:text-neutral-400 focus:border-black focus:ring-1 focus:ring-black rounded-lg resize-none font-medium"
                disabled={loading}
              />
              <p className="text-xs text-neutral-500 font-medium">
                Characters: {reason.length} / 500 (min 20 required)
              </p>
            </div>

            {/* Dispute Process Info */}
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3">
              <p className="text-xs font-bold text-neutral-600 uppercase tracking-widest">What Happens Next</p>
              <ol className="space-y-2.5 text-sm text-neutral-600">
                <li className="flex gap-3">
                  <span className="font-black text-neutral-800 min-w-fit">1.</span>
                  <span>Our admin team reviews your dispute within 48 hours</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-black text-neutral-800 min-w-fit">2.</span>
                  <span>We may contact you for additional information</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-black text-neutral-800 min-w-fit">3.</span>
                  <span>Rating is temporarily hidden while under review</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-black text-neutral-800 min-w-fit">4.</span>
                  <span>You'll be notified of the resolution by email</span>
                </li>
              </ol>
            </div>
          </div>
        ) : (
          /* Success State */
          <div className="p-12 text-center space-y-4">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-8 w-8 text-green-600 animate-bounce" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-black text-black mb-2">Dispute Submitted</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Thank you for helping us maintain a trustworthy community. We'll review your dispute and notify you within 48 hours.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        {!submitted && (
          <DialogFooter className="p-6 bg-neutral-50 border-t border-neutral-200 space-x-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="border-neutral-200 text-black hover:bg-white font-bold h-11 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || reason.length < 20}
              className="bg-red-600 text-white hover:bg-red-700 font-bold h-11 rounded-lg shadow-lg min-w-[120px] flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Submitting...' : 'Submit Dispute'}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
