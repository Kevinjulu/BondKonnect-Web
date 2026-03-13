'use client';

import React, { useState, useEffect } from 'react';
import { Star, TrendingUp } from 'lucide-react';
import { getUserRatingStats } from '@/lib/actions/ratings.actions';
import type { RatingStatistics } from '@/lib/types/ratings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RatingsSummaryProps {
  userId: number;
  isLoading?: boolean;
}

export function RatingsSummary({ userId, isLoading: externalIsLoading }: RatingsSummaryProps) {
  const [stats, setStats] = useState<RatingStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, [userId]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const result = await getUserRatingStats(userId);
      if (result.success) {
        setStats(result.data);
      } else {
        setError('Failed to load rating statistics');
      }
    } catch (err) {
      setError('An error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || externalIsLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Rating Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !stats) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Rating Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">{error || 'No rating data available'}</p>
        </CardContent>
      </Card>
    );
  }

  const totalRatings = stats.total_ratings;
  const averageRating = stats.average_rating;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5" />
          Rating Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Average Rating */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Average Rating</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-3xl font-bold text-blue-600">{averageRating}</span>
              <span className="text-gray-500">/ 5</span>
            </div>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={24}
                className={`${
                  i < Math.round(averageRating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Total Ratings */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">
            Based on <span className="font-bold">{totalRatings}</span>{' '}
            {totalRatings === 1 ? 'rating' : 'ratings'}
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-3">
          <p className="font-medium text-gray-900">Rating Distribution</p>

          {[5, 4, 3, 2, 1].map((stars) => {
            const count = stats.rating_distribution[stars] || 0;
            const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;

            return (
              <div key={stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                <span className="text-sm font-medium text-gray-700 w-12 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>

        {/* Dimension Averages */}
        <div className="space-y-3">
          <p className="font-medium text-gray-900">Dimension Averages</p>

          <div className="grid grid-cols-1 gap-3">
            {Object.entries(stats.dimension_averages).map(([dimension, avg]) => (
              <div
                key={dimension}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <span className="text-sm text-gray-700 capitalize">
                  {dimension.replace(/_/g, ' ')}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-blue-600">{avg}</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={`${
                          i < Math.round(avg)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {totalRatings === 0 && (
          <div className="bg-blue-50 border border-blue-200 rgba-lg p-3 text-center">
            <p className="text-sm text-blue-900">No ratings yet. Be the first to rate!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
