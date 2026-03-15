import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrustBadge } from './TrustBadge';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  BarChart3,
  Users,
} from 'lucide-react';

interface TrendData {
  trend_direction: 'improving' | 'stable' | 'declining';
  improvement_trend: string;
  last_6_months_change: number;
  observation_status: 'normal' | 'observation' | 'watch';
  observation_notes?: string;
  recent_6m_average: number;
  older_6m_average: number;
}

interface TrustIndicatorProps {
  credibilityIndex: number;
  credibilityBadge: string;
  recencyWeightedScore: number;
  recent50Average: number;
  mid50Average: number;
  olderAverage: number;
  trend: TrendData;
  observationStatus: 'normal' | 'observation' | 'watch';
  observationNotes?: string;
  isNewUser: boolean;
  totalRatings: number;
  positivePercentage: number;
  isTrusted: boolean;
  userName?: string;
}

export const TrustIndicator: React.FC<TrustIndicatorProps> = ({
  credibilityIndex,
  credibilityBadge,
  recencyWeightedScore,
  recent50Average,
  mid50Average,
  olderAverage,
  trend,
  observationStatus,
  observationNotes,
  isNewUser,
  totalRatings,
  positivePercentage,
  isTrusted,
  userName,
}) => {
  const getTrendMessage = () => {
    switch (trend.trend_direction) {
      case 'improving':
        return {
          icon: <TrendingUp className="w-5 h-5 text-green-600" />,
          message: 'Performance is improving',
          color: 'text-green-700 bg-green-50 border-green-200',
        };
      case 'declining':
        return {
          icon: <TrendingDown className="w-5 h-5 text-red-600" />,
          message: 'Performance is declining',
          color: 'text-red-700 bg-red-50 border-red-200',
        };
      case 'stable':
      default:
        return {
          icon: <Minus className="w-5 h-5 text-gray-600" />,
          message: 'Performance is stable',
          color: 'text-gray-700 bg-gray-50 border-gray-200',
        };
    }
  };

  const trendMessage = getTrendMessage();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div>
            {userName ? `Trust Profile: ${userName}` : 'Trust Indicator'}
          </div>
          <div className="flex items-center gap-2 text-sm font-normal">
            {isTrusted && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                ✓ Trusted
              </span>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Trust Badge Summary */}
        <TrustBadge
          credibilityIndex={credibilityIndex}
          credibilityBadge={credibilityBadge}
          trendDirection={trend.trend_direction}
          improvementTrend={trend.improvement_trend}
          recentWeightedScore={recencyWeightedScore}
          observationStatus={observationStatus}
          isNewUser={isNewUser}
          positivePercentage={positivePercentage}
        />

        {/* Trend Analysis */}
        <div
          className={`p-4 rounded-lg border-2 ${trendMessage.color}`}
        >
          <div className="flex items-start gap-3">
            {trendMessage.icon}
            <div className="flex-1">
              <p className="font-semibold mb-1">{trendMessage.message}</p>
              <p className="text-sm opacity-90">
                Last 6 months average: {trend.recent_6m_average.toFixed(2)}/5
              </p>
              <p className="text-sm opacity-90">
                Change: {trend.last_6_months_change > 0 ? '+' : ''}
                {trend.last_6_months_change.toFixed(1)}%
              </p>
              {observationNotes && (
                <p className="text-sm mt-2 italic border-t border-current pt-2 opacity-90">
                  {observationNotes}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Recency Weighting Breakdown */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-3 font-semibold text-sm">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            Recency-Weighted Score Breakdown
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">
                Recent 50 ratings (70% weight):
              </span>
              <span className="font-semibold text-blue-700">
                {recent50Average.toFixed(1)}/100
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(recent50Average / 100) * 100}%` }}
              />
            </div>

            <div className="flex justify-between items-center mt-3">
              <span className="text-gray-700">
                Mid 50 ratings (20% weight):
              </span>
              <span className="font-semibold text-blue-700">
                {mid50Average.toFixed(1)}/100
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${(mid50Average / 100) * 100}%` }}
              />
            </div>

            <div className="flex justify-between items-center mt-3">
              <span className="text-gray-700">
                Older ratings (10% weight):
              </span>
              <span className="font-semibold text-blue-700">
                {olderAverage.toFixed(1)}/100
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-400 h-2 rounded-full"
                style={{ width: `${(olderAverage / 100) * 100}%` }}
              />
            </div>

            <div className="border-t border-blue-200 pt-2 mt-3 flex justify-between">
              <span className="font-semibold text-gray-800">
                Weighted Score:
              </span>
              <span className="font-bold text-blue-800">
                {recencyWeightedScore.toFixed(1)}/100
              </span>
            </div>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-600 text-xs mb-1">Total Ratings</p>
            <p className="font-bold text-lg">{totalRatings}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-gray-600 text-xs mb-1">Positive</p>
            <p className="font-bold text-lg text-green-700">
              {positivePercentage.toFixed(0)}%
            </p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center justify-center gap-1">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-gray-600 text-xs">Score</span>
            </div>
            <p className="font-bold text-lg text-blue-700">
              {credibilityIndex.toFixed(0)}
            </p>
          </div>
        </div>

        {/* Recovery Path Info */}
        {observationStatus !== 'normal' && (
          <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-orange-900 mb-1">
                  Recovery Path Available
                </p>
                <p className="text-orange-800">
                  User remains fully operational. Performance monitoring active
                  to identify improvement patterns. Recent positive ratings show
                  recovery potential.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrustIndicator;
