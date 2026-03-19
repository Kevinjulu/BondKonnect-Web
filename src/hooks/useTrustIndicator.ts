import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from '@/utils/axios';

interface TrendData {
  trend_direction: 'improving' | 'stable' | 'declining';
  improvement_trend: string;
  last_6_months_change: number;
  observation_status: 'normal' | 'observation' | 'watch';
  observation_notes?: string;
  recent_6m_average: number;
  older_6m_average: number;
}

interface TrustMetrics {
  credibility_index: number;
  recency_weighted_score: number;
  credibility_badge: string;
  trend: TrendData;
  observation_status: 'normal' | 'observation' | 'watch';
  observation_notes?: string;
  is_new_user: boolean;
  total_ratings: number;
  positive_percentage: number;
  recent_50_average: number;
  mid_50_average: number;
  older_average: number;
  is_trusted: boolean;
}

interface RatingRecord {
  id: number;
  overall_rating: number;
  rater_name: string;
  comment?: string;
  created_at: string;
}

interface TrustIndicatorData {
  metrics: TrustMetrics | null;
  ratings: RatingRecord[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch and manage trust indicator data for a user
 * Includes recency-weighted score, trend analysis, and rating details
 */
export const useTrustIndicator = (
  userId?: number,
  userName?: string
): TrustIndicatorData => {
  const [error, setError] = useState<string | null>(null);

  // Fetch trust metrics
  const metricsQuery = useQuery({
    queryKey: ['trustMetrics', userId],
    queryFn: async () => {
      if (!userId) return null;

      try {
        const response = await axios.get(`/V1/users/${userId}/trust-metrics`);
        return response.data.data as TrustMetrics;
      } catch (err: any) {
        const message = err.message || 'Failed to fetch trust metrics';
        setError(message);
        throw err;
      }
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  // Fetch recent ratings
  const ratingsQuery = useQuery({
    queryKey: ['trustRatings', userId],
    queryFn: async () => {
      if (!userId) return [];

      try {
        const response = await axios.get(`/V1/users/${userId}/ratings?limit=10`);
        return response.data.data as RatingRecord[];
      } catch (err: any) {
        const message = err.message || 'Failed to fetch ratings';
        setError(message);
        return [];
      }
    },
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });

  const refetch = () => {
    metricsQuery.refetch();
    ratingsQuery.refetch();
  };

  return {
    metrics: metricsQuery.data || null,
    ratings: ratingsQuery.data || [],
    isLoading: metricsQuery.isLoading || ratingsQuery.isLoading,
    error,
    refetch,
  };
};

/**
 * Hook to calculate trust decision support info
 * Determines if a user should be engaged with based on trust metrics
 */
export const useTrustDecision = (metrics: TrustMetrics | null) => {
  const [decision, setDecision] = useState({
    canEngage: true,
    riskLevel: 'low' as 'low' | 'medium' | 'high',
    recommendations: [] as string[],
    requiresApproval: false,
  });

  useEffect(() => {
    if (!metrics) {
      setDecision({
        canEngage: true,
        riskLevel: 'low',
        recommendations: [],
        requiresApproval: false,
      });
      return;
    }

    const recommendations: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    let requiresApproval = false;

    // Check new user status
    if (metrics.is_new_user) {
      recommendations.push('New user - monitor first few transactions');
      riskLevel = 'medium';
    }

    // Check observation status
    if (metrics.observation_status === 'watch') {
      recommendations.push('User under performance watch - recovery path available');
      riskLevel = 'high';
      requiresApproval = true;
    } else if (metrics.observation_status === 'observation') {
      recommendations.push('User being monitored for improvement');
      riskLevel = 'medium';
    }

    // Check trend
    if (metrics.trend.trend_direction === 'declining') {
      recommendations.push('Declining trend - verify transaction details');
      if (riskLevel !== 'high') riskLevel = 'medium';
    }

    // Check credibility badge
    if (metrics.credibility_badge === 'bronze' || metrics.credibility_badge === 'unrated') {
      recommendations.push(`Trading as ${metrics.credibility_badge} user`);
      if (riskLevel !== 'high') riskLevel = 'medium';
    }

    // Check positive percentage
    if (metrics.positive_percentage < 80 && metrics.total_ratings >= 10) {
      recommendations.push(
        `Only ${metrics.positive_percentage.toFixed(0)}% positive ratings`
      );
      if (riskLevel === 'low') riskLevel = 'medium';
    }

    setDecision({
      canEngage: true, // Always true - no banning
      riskLevel,
      recommendations,
      requiresApproval,
    });
  }, [metrics]);

  return decision;
};

export default useTrustIndicator;
