import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
} from 'lucide-react';

interface TrustBadgeProps {
  credibilityIndex: number;
  credibilityBadge: string;
  trendDirection: 'improving' | 'stable' | 'declining';
  improvementTrend: string; // ↑ ↗ → ↘ ↓
  recentWeightedScore: number;
  observationStatus: 'normal' | 'observation' | 'watch';
  isNewUser: boolean;
  positivePercentage: number;
  className?: string;
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({
  credibilityIndex,
  credibilityBadge,
  trendDirection,
  improvementTrend,
  recentWeightedScore,
  observationStatus,
  isNewUser,
  positivePercentage,
  className = '',
}) => {
  // Get badge colors and icons based on credibility
  const getBadgeConfig = (badge: string) => {
    const configs: Record<
      string,
      {
        color: string;
        bgColor: string;
        label: string;
        icon: React.ReactNode;
      }
    > = {
      platinum: {
        color: 'bg-blue-100 text-blue-800 border-blue-300',
        bgColor: 'bg-blue-50',
        label: 'Platinum',
        icon: <CheckCircle className="w-4 h-4" />,
      },
      gold: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        bgColor: 'bg-yellow-50',
        label: 'Gold',
        icon: <CheckCircle className="w-4 h-4" />,
      },
      silver: {
        color: 'bg-gray-100 text-gray-800 border-gray-300',
        bgColor: 'bg-gray-50',
        label: 'Silver',
        icon: <CheckCircle className="w-4 h-4" />,
      },
      bronze: {
        color: 'bg-orange-100 text-orange-800 border-orange-300',
        bgColor: 'bg-orange-50',
        label: 'Bronze',
        icon: <CheckCircle className="w-4 h-4" />,
      },
      unrated: {
        color: 'bg-gray-200 text-gray-700 border-gray-400',
        bgColor: 'bg-gray-100',
        label: 'Unrated',
        icon: <AlertCircle className="w-4 h-4" />,
      },
    };
    return configs[badge] || configs.unrated;
  };

  // Get trend icon
  const getTrendIcon = () => {
    switch (trendDirection) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'stable':
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  // Get observation status icon and color
  const getObservationConfig = () => {
    const configs: Record<
      string,
      { color: string; icon: React.ReactNode; label: string }
    > = {
      normal: {
        color: 'text-green-600',
        icon: <CheckCircle className="w-4 h-4" />,
        label: 'Normal',
      },
      observation: {
        color: 'text-yellow-600',
        icon: <AlertCircle className="w-4 h-4" />,
        label: 'Observation',
      },
      watch: {
        color: 'text-red-600',
        icon: <AlertTriangle className="w-4 h-4" />,
        label: 'Watch',
      },
    };
    return configs[observationStatus] || configs.normal;
  };

  const badgeConfig = getBadgeConfig(credibilityBadge);
  const observationConfig = getObservationConfig();

  return (
    <div className={`${badgeConfig.bgColor} p-3 rounded-lg border ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {badgeConfig.icon}
          <span className="font-semibold text-sm">{badgeConfig.label}</span>
          {isNewUser && (
            <Badge
              variant="outline"
              className="text-xs bg-blue-50 border-blue-300"
            >
              New User
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          {getTrendIcon()}
          <span className="text-xs font-semibold">{improvementTrend}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
        <div>
          <p className="text-gray-600">Credibility Score</p>
          <p className="font-bold text-base">{credibilityIndex.toFixed(1)}</p>
        </div>
        <div>
          <p className="text-gray-600">Positive Ratings</p>
          <p className="font-bold text-base">{positivePercentage.toFixed(0)}%</p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <div className={`flex items-center gap-1 ${observationConfig.color}`}>
          {observationConfig.icon}
          <span className="font-medium">{observationConfig.label}</span>
        </div>
        <span className="text-gray-500">
          Weighted Score: {recentWeightedScore.toFixed(1)}
        </span>
      </div>

      {trendDirection === 'improving' && (
        <p className="text-xs text-green-700 mt-2 italic">
          ✓ User showing positive improvement trajectory
        </p>
      )}
      {observationStatus !== 'normal' && (
        <p className="text-xs text-orange-700 mt-2 italic">
          ⓘ Monitoring for recovery pattern
        </p>
      )}
    </div>
  );
};

export default TrustBadge;
