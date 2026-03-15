'use client';

import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { BADGE_METADATA } from '@/lib/types/ratings';
import type { UserCredibilityScore } from '@/lib/types/ratings';
import { Star, TrendingUp } from 'lucide-react';

interface CredibilityBadgeProps {
  credibilityScore: UserCredibilityScore | null;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
  interactive?: boolean;
}

export function CredibilityBadge({
  credibilityScore,
  size = 'md',
  showScore = true,
  interactive = false,
}: CredibilityBadgeProps) {
  if (!credibilityScore) {
    return (
      <div className="flex items-center gap-2">
        <div className={`${size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-10 h-10' : 'w-12 h-12'} rounded-full bg-gray-200`} />
        <span className="text-sm text-gray-500">No rating</span>
      </div>
    );
  }

  const badgeInfo = BADGE_METADATA[credibilityScore.credibility_badge as keyof typeof BADGE_METADATA];

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const tooltipContent = (
    <div className="space-y-2">
      <p className="font-semibold">{badgeInfo.label} Badge</p>
      <p className="text-sm">{badgeInfo.description}</p>
      <div className="text-sm space-y-1 border-t pt-2">
        <p>
          <span className="font-medium">Score:</span> {credibilityScore.credibility_index.toFixed(1)}/100
        </p>
        <p>
          <span className="font-medium">Ratings:</span> {credibilityScore.total_ratings_count}
        </p>
        <p>
          <span className="font-medium">Transactions:</span> {credibilityScore.total_transactions}
        </p>
      </div>
    </div>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`flex items-center gap-2 ${interactive ? 'cursor-pointer hover:opacity-80' : ''}`}
          >
            <div
              className={`
                ${sizeClasses[size]} 
                rounded-full flex items-center justify-center font-bold relative
                transition-all hover:shadow-lg
              `}
              style={{
                backgroundColor: badgeInfo.color,
                color: 'white',
              }}
            >
              {badgeInfo.icon}
            </div>

            {showScore && (
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900">
                  {credibilityScore.credibility_index.toFixed(1)}
                </span>
                <span className="text-xs text-gray-500">{badgeInfo.label}</span>
              </div>
            )}
          </div>
        </TooltipTrigger>

        <TooltipContent>{tooltipContent}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface BadgeDisplayProps {
  badge: 'platinum' | 'gold' | 'silver' | 'bronze' | 'unrated';
  label?: boolean;
}

export function BadgeDisplay({ badge, label = true }: BadgeDisplayProps) {
  const badgeInfo = BADGE_METADATA[badge as keyof typeof BADGE_METADATA];

  return (
    <div className="flex items-center gap-2">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
        style={{ backgroundColor: badgeInfo.color }}
      >
        {badgeInfo.icon}
      </div>
      {label && <span className="font-medium text-sm text-gray-900">{badgeInfo.label}</span>}
    </div>
  );
}
