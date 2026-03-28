import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TrustIndicator } from '../TrustIndicator';
import React from 'react';

// Mock Lucide icons to avoid issues in testing environment
vi.mock('lucide-react', () => ({
  TrendingUp: () => <div data-testid="trending-up" />,
  TrendingDown: () => <div data-testid="trending-down" />,
  Minus: () => <div data-testid="minus" />,
  AlertCircle: () => <div data-testid="alert-circle" />,
  BarChart3: () => <div data-testid="bar-chart" />,
  Users: () => <div data-testid="users" />,
  CheckCircle: () => <div data-testid="check-circle" />,
  AlertTriangle: () => <div data-testid="alert-triangle" />,
}));

describe('TrustIndicator Component', () => {
  const defaultProps = {
    credibilityIndex: 85,
    credibilityBadge: 'gold',
    recencyWeightedScore: 82.5,
    recent50Average: 90,
    mid50Average: 75,
    olderAverage: 60,
    trend: {
      trend_direction: 'improving' as const,
      improvement_trend: '↑',
      last_6_months_change: 15.5,
      observation_status: 'normal' as const,
      recent_6m_average: 4.5,
      older_6m_average: 3.8,
    },
    observationStatus: 'normal' as const,
    isNewUser: false,
    totalRatings: 125,
    positivePercentage: 92,
    isTrusted: true,
    userName: 'John Doe',
  };

  it('renders correctly with default props', () => {
    render(<TrustIndicator {...defaultProps} />);
    
    expect(screen.getByText('Trust Profile: John Doe')).toBeInTheDocument();
    expect(screen.getByText('✓ Trusted')).toBeInTheDocument();
    expect(screen.getByText('Performance is improving')).toBeInTheDocument();
    expect(screen.getByText('Last 6 months average: 4.50/5')).toBeInTheDocument();
    expect(screen.getByText('Change: +15.5%')).toBeInTheDocument();
  });

  it('renders correctly for a declining trend', () => {
    const props = {
      ...defaultProps,
      trend: {
        ...defaultProps.trend,
        trend_direction: 'declining' as const,
        last_6_months_change: -10.2,
      },
    };
    render(<TrustIndicator {...props} />);
    
    expect(screen.getByText('Performance is declining')).toBeInTheDocument();
    expect(screen.getByText('Change: -10.2%')).toBeInTheDocument();
  });

  it('renders correctly for a stable trend', () => {
    const props = {
      ...defaultProps,
      trend: {
        ...defaultProps.trend,
        trend_direction: 'stable' as const,
        last_6_months_change: 0.5,
      },
    };
    render(<TrustIndicator {...props} />);
    
    expect(screen.getByText('Performance is stable')).toBeInTheDocument();
  });

  it('shows recovery path when in observation status', () => {
    const props = {
      ...defaultProps,
      observationStatus: 'observation' as const,
      observationNotes: 'Under review for recent disputes',
    };
    render(<TrustIndicator {...props} />);
    
    expect(screen.getByText('Recovery Path Available')).toBeInTheDocument();
    expect(screen.getByText('Under review for recent disputes')).toBeInTheDocument();
  });

  it('displays recency-weighted score breakdown correctly', () => {
    render(<TrustIndicator {...defaultProps} />);
    
    expect(screen.getByText('Recent 50 ratings (70% weight):')).toBeInTheDocument();
    expect(screen.getByText('90.0/100')).toBeInTheDocument();
    expect(screen.getByText('75.0/100')).toBeInTheDocument();
    expect(screen.getByText('60.0/100')).toBeInTheDocument();
    expect(screen.getByText('82.5/100')).toBeInTheDocument();
  });

  it('displays activity summary correctly', () => {
    render(<TrustIndicator {...defaultProps} />);
    
    expect(screen.getByText('125')).toBeInTheDocument();
    expect(screen.getAllByText('92%').length).toBeGreaterThan(0);
    expect(screen.getByText('85')).toBeInTheDocument();
  });
});
