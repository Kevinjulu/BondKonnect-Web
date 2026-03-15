'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { submitRating } from '@/lib/actions/ratings.actions';
import { RATING_DIMENSIONS, RATING_TAGS } from '@/lib/types/ratings';
import { Star, X } from 'lucide-react';
import type { CreateRatingRequest } from '@/lib/types/ratings';

interface RatingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactionId: number;
  raterId: number;
  rateeId: number;
  rateeName: string;
  onSuccess?: () => void;
}

export function RatingModal({
  open,
  onOpenChange,
  transactionId,
  raterId,
  rateeId,
  rateeName,
  onSuccess,
}: RatingModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [ratings, setRatings] = useState({
    reliability_rating: 0,
    response_speed_rating: 0,
    professionalism_rating: 0,
    fairness_rating: 0,
    settlement_rating: 0,
  });

  const [reviewText, setReviewText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleRatingChange = (dimension: keyof typeof ratings, value: number) => {
    setRatings((prev) => ({
      ...prev,
      [dimension]: value,
    }));
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    // Validate at least one rating is selected
    const hasAtLeastOneRating = Object.values(ratings).some((r) => r > 0);
    if (!hasAtLeastOneRating) {
      toast({
        title: 'Validation Error',
        description: 'Please provide at least one rating.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const ratingData: CreateRatingRequest = {
        rater_id: raterId,
        ratee_id: rateeId,
        transaction_id: transactionId,
        ...ratings,
        review_text: reviewText || undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
      };

      const result = await submitRating(ratingData);

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Your rating has been submitted and will be published after verification.',
        });
        resetForm();
        onSuccess?.();
        onOpenChange(false);
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Failed to submit rating',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setRatings({
      reliability_rating: 0,
      response_speed_rating: 0,
      professionalism_rating: 0,
      fairness_rating: 0,
      settlement_rating: 0,
    });
    setReviewText('');
    setSelectedTags([]);
  };

  const getAverageRating = () => {
    const ratingValues = Object.values(ratings).filter((r) => r > 0);
    if (ratingValues.length === 0) return 0;
    return (ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length).toFixed(1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="bg-black text-white p-6 rounded-t-lg">
          <DialogTitle className="text-2xl font-bold">Rate {rateeName}</DialogTitle>
          <DialogDescription className="text-gray-300">
            Share your experience with this trader to help build credibility on BondKonnect
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-8">
          {/* Overall Rating Preview */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Your Overall Rating</p>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-blue-600">{getAverageRating()}</span>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={`${
                      i < Math.round(Number(getAverageRating()))
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Rating Dimensions */}
          <div className="space-y-6">
            <h3 className="font-semibold text-lg">Rate Different Aspects</h3>

            {(Object.entries(RATING_DIMENSIONS) as any[]).map(([key, dimension]) => (
              <div key={key} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-black">{dimension.label}</p>
                    <p className="text-sm text-gray-600">{dimension.description}</p>
                  </div>
                  {ratings[`${key}_rating` as keyof typeof ratings] > 0 && (
                    <span className="text-lg font-bold text-blue-600">
                      {ratings[`${key}_rating` as keyof typeof ratings]}/5
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        handleRatingChange(`${key}_rating` as keyof typeof ratings, i + 1)
                      }
                      className="group transition-transform hover:scale-110"
                    >
                      <Star
                        size={32}
                        className={`${
                          i < (ratings[`${key}_rating` as keyof typeof ratings] || 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 group-hover:text-yellow-200'
                        } cursor-pointer`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <label className="font-medium text-black">Additional Comments (Optional)</label>
            <Textarea
              placeholder="Share more about your experience with this trader..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value.slice(0, 500))}
              className="bg-gray-50 border-gray-300 text-black placeholder-gray-400 min-h-24"
            />
            <p className="text-xs text-gray-500">{reviewText.length}/500 characters</p>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <label className="font-medium text-black">Tags (Optional)</label>
            <div className="grid grid-cols-2 gap-2">
              {RATING_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-black text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tag.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                <p className="text-sm text-gray-600">Selected:</p>
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 bg-black text-white px-2 py-1 rounded text-sm"
                  >
                    {tag.replace(/_/g, ' ')}
                    <X
                      size={14}
                      className="cursor-pointer hover:opacity-70"
                      onClick={() => handleTagToggle(tag)}
                    />
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 border-t pt-6 mt-6">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || Object.values(ratings).every((r) => r === 0)}
              className="flex-1 bg-black hover:bg-gray-800"
            >
              {isLoading ? 'Submitting...' : 'Submit Rating'}
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Your rating will be published after a 48-hour verification period
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
