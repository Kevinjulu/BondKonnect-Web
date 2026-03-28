import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CredibilityBadge, BadgeDisplay } from '../CredibilityBadge';
import React from 'react';
import { UserCredibilityScore } from '@/lib/types/ratings';

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  Star: () => <div data-testid="star" />,
  TrendingUp: () => <div data-testid="trending-up" />,
  CheckCircle: () => <div data-testid="check-circle" />,
}));

describe('CredibilityBadge Component', () => {
  const mockScore: UserCredibilityScore = {
    user_id: 1,
    credibility_index: 95.5,
    credibility_badge: 'platinum',
    badge: 'Platinum',
    is_trusted: true,
    is_new_user: false,
    total_ratings: 150,
    total_ratings_count: 150,
    total_transactions: 200,
    average_overall_rating: 4.9,
    rating_score: 98,
    activity_score: 95,
    verification_score: 100,
    settlement_score: 99,
    response_time_score: 92,
    sentiment_distribution: { positive: 145, neutral: 3, negative: 2 },
    total_transaction_volume: 500000,
    total_disputes: 0,
    resolved_disputes: 0,
    disputes_count: 0,
    settlement_rate: 100,
    is_kyc_verified: true,
    account_age_days: 365,
  };

  it('renders correctly for a platinum user', () => {
    render(<CredibilityBadge credibilityScore={mockScore} />);
    
    expect(screen.getByText('95.5')).toBeInTheDocument();
    expect(screen.getByText('Platinum')).toBeInTheDocument();
  });

  it('renders correctly for a gold user', () => {
    const goldScore = { ...mockScore, credibility_badge: 'gold' as const, credibility_index: 85.0 };
    render(<CredibilityBadge credibilityScore={goldScore} />);
    
    expect(screen.getByText('85.0')).toBeInTheDocument();
    expect(screen.getByText('Gold')).toBeInTheDocument();
  });

  it('renders "No rating" when credibilityScore is null', () => {
    render(<CredibilityBadge credibilityScore={null} />);
    
    expect(screen.getByText('No rating')).toBeInTheDocument();
  });

  it('hides score when showScore is false', () => {
    render(<CredibilityBadge credibilityScore={mockScore} showScore={false} />);
    
    expect(screen.queryByText('95.5')).not.toBeInTheDocument();
  });
});

describe('BadgeDisplay Component', () => {
  it('renders the correct badge label', () => {
    render(<BadgeDisplay badge="platinum" />);
    expect(screen.getByText('Platinum')).toBeInTheDocument();
    
    render(<BadgeDisplay badge="bronze" />);
    expect(screen.getByText('Bronze')).toBeInTheDocument();
  });

  it('hides label when label prop is false', () => {
    render(<BadgeDisplay badge="platinum" label={false} />);
    expect(screen.queryByText('Platinum')).not.toBeInTheDocument();
  });
});
