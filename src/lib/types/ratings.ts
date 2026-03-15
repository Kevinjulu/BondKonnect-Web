/**
 * User Rating Types & Interfaces
 */

export interface UserRating {
  id: number;
  rater_id: number;
  ratee_id: number;
  transaction_id?: number;
  quote_id?: number;
  reliability_rating?: number;
  response_speed_rating?: number;
  professionalism_rating?: number;
  fairness_rating?: number;
  settlement_rating?: number;
  overall_rating: number;
  review_text?: string;
  tags?: string[];
  rating_status: 'pending' | 'published' | 'disputed' | 'removed';
  rater_name?: string;
  created_at: string;
  published_at?: string;
  updated_at: string;
}

export interface UserCredibilityScore {
  user_id: number;
  credibility_index: number;
  credibility_badge: 'platinum' | 'gold' | 'silver' | 'bronze' | 'unrated';
  badge: 'Platinum' | 'Gold' | 'Silver' | 'Bronze' | 'Unrated';
  badge_color?: string;
  is_trusted: boolean;
  is_new_user: boolean;
  total_ratings: number;
  total_ratings_count: number;
  average_overall_rating: number;
  rating_score: number;
  activity_score: number;
  verification_score: number;
  settlement_score: number;
  response_time_score: number;
  sentiment_distribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  total_transactions: number;
  total_transaction_volume: number;
  total_disputes: number;
  resolved_disputes: number;
  disputes_count: number;
  settlement_rate: number;
  is_kyc_verified: boolean;
  account_age_days: number;
  last_transaction_date?: string;
  recent_ratings?: UserRating[];
  component_scores?: {
    rating_score: number;
    activity_score: number;
    verification_score: number;
    settlement_score: number;
    response_time_score: number;
  };
}

export interface RatingDispute {
  id: number;
  rating_id: number;
  status: 'open' | 'upheld' | 'reversed';
  reason: string;
  notes?: string;
  disputed_by_id: number;
  disputed_by_name: string;
  resolved_by_id?: number;
  resolved_by_name?: string;
  created_at: string;
  resolved_at?: string;
  rating_details: {
    id: number;
    rater_name: string;
    ratee_name: string;
    overall_rating: number;
    review_text?: string;
    tags?: string[];
    published_at: string;
  };
}

export interface CreateRatingRequest {
  rater_id: number;
  ratee_id: number;
  transaction_id?: number;
  quote_id?: number;
  reliability_rating?: number;
  response_speed_rating?: number;
  professionalism_rating?: number;
  fairness_rating?: number;
  settlement_rating?: number;
  review_text?: string;
  tags?: string[];
}

export interface UpdateRatingRequest {
  reliability_rating?: number;
  response_speed_rating?: number;
  professionalism_rating?: number;
  fairness_rating?: number;
  settlement_rating?: number;
  review_text?: string;
  tags?: string[];
}

export interface FileDisputeRequest {
  disputed_by: number;
  reason: string;
}

export interface RatingStatistics {
  total_ratings: number;
  average_rating: number;
  rating_distribution: {
    [key: number]: number; // 5: count, 4: count, etc.
  };
  dimension_averages: {
    reliability: number;
    response_speed: number;
    professionalism: number;
    fairness: number;
    settlement: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
}

// Rating Tags
export const RATING_TAGS = [
  'easy_to_work_with',
  'reliable',
  'competitive_prices',
  'quick_settlement',
  'professional',
  'responsive',
  'slow_responder',
  'difficult_to_negotiate',
  'unreliable',
  'poor_communication',
] as const;

export type RatingTag = typeof RATING_TAGS[number];

// Badge metadata for UI
export const BADGE_METADATA = {
  platinum: {
    label: 'Platinum',
    color: '#FFD700',
    background: 'bg-yellow-100',
    textColor: 'text-yellow-900',
    icon: '⭐⭐⭐',
    description: 'Highly trusted trader, 100+ transactions',
  },
  gold: {
    label: 'Gold',
    color: '#FFA500',
    background: 'bg-orange-100',
    textColor: 'text-orange-900',
    icon: '⭐⭐',
    description: 'Trusted trader, 50+ transactions',
  },
  silver: {
    label: 'Silver',
    color: '#C0C0C0',
    background: 'bg-gray-100',
    textColor: 'text-gray-900',
    icon: '⭐',
    description: 'Established trader, 10+ transactions',
  },
  bronze: {
    label: 'Bronze',
    color: '#CD7F32',
    background: 'bg-amber-100',
    textColor: 'text-amber-900',
    icon: '◆',
    description: 'New trader with some activity',
  },
  unrated: {
    label: 'Unrated',
    color: '#808080',
    background: 'bg-slate-100',
    textColor: 'text-slate-600',
    icon: '◇',
    description: 'New user with no ratings',
  },
};

// Rating dimension labels
export const RATING_DIMENSIONS = {
  reliability: {
    label: 'Reliability',
    description: 'Did they fulfill their commitments?',
    icon: '✓',
  },
  response_speed: {
    label: 'Speed of Response',
    description: 'How quickly did they respond?',
    icon: '⚡',
  },
  professionalism: {
    label: 'Professionalism',
    description: 'Was interaction professional and courteous?',
    icon: '👔',
  },
  fairness: {
    label: 'Fairness in Negotiation',
    description: 'Were prices/terms fair?',
    icon: '⚖️',
  },
  settlement: {
    label: 'Settlement Reliability',
    description: 'Did settlement go smoothly?',
    icon: '✅',
  },
};
