import { render, screen } from '@testing-library/react';
import { PnLSummaryCards } from '@/app/(dashboard)/components/apps/portfolio-analytics/PnLSummaryCards';
import { describe, it, expect } from 'vitest';

describe('PnLSummaryCards', () => {
  const mockData = {
    totalPortfolioValue: 1000000,
    totalRealizedPnL: 50000,
    totalUnrealizedPnL: -20000,
    weightedAverageYield: 12.5,
    weightedAverageDuration: 5.2
  };

  it('renders loading state correctly', () => {
    const { container } = render(<PnLSummaryCards data={mockData} isLoading={true} />);
    expect(container.getElementsByClassName('animate-pulse').length).toBeGreaterThan(0);
  });

  it('renders analytics data correctly', () => {
    render(<PnLSummaryCards data={mockData} isLoading={false} />);
    
    expect(screen.getByText(/Total Portfolio Value/i)).toBeDefined();
    expect(screen.getByText(/KES 1,000,000/i)).toBeDefined();
    expect(screen.getByText(/KES 50,000/i)).toBeDefined();
    expect(screen.getByText(/12.50%/i)).toBeDefined();
    expect(screen.getByText(/5.20 Yrs/i)).toBeDefined();
  });

  it('handles negative P&L with appropriate formatting', () => {
    render(<PnLSummaryCards data={mockData} isLoading={false} />);
    // Unrealized P&L is -20,000
    expect(screen.getByText(/KES -20,000/i)).toBeDefined();
  });
});
