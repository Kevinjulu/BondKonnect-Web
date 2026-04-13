import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useLogoSrc } from '../use-logo-src';

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

import { useTheme } from 'next-themes';

describe('useLogoSrc', () => {
  const mockUseTheme = vi.mocked(useTheme);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns light logo for auth context in light mode', () => {
    mockUseTheme.mockReturnValue({
      resolvedTheme: 'light',
      theme: 'light',
      setTheme: vi.fn(),
    });

    const { result } = renderHook(() => useLogoSrc('auth'));

    expect(result.current).toBe('/images/logos/logo.png');
  });

  it('returns dark logo for auth context in dark mode', () => {
    mockUseTheme.mockReturnValue({
      resolvedTheme: 'dark',
      theme: 'dark',
      setTheme: vi.fn(),
    });

    const { result } = renderHook(() => useLogoSrc('auth'));

    expect(result.current).toBe('/images/logos/logo-dark.svg');
  });

  it('returns compact light logo for dashboard context in light mode', () => {
    mockUseTheme.mockReturnValue({
      resolvedTheme: 'light',
      theme: 'light',
      setTheme: vi.fn(),
    });

    const { result } = renderHook(() => useLogoSrc('dashboard'));

    expect(result.current).toBe('/images/logos/logo-c.png');
  });

  it('returns compact dark logo for sidebar context in dark mode', () => {
    mockUseTheme.mockReturnValue({
      resolvedTheme: 'dark',
      theme: 'dark',
      setTheme: vi.fn(),
    });

    const { result } = renderHook(() => useLogoSrc('sidebar'));

    expect(result.current).toBe('/images/logos/logo-dark.svg');
  });

  it('returns default light logo during SSR (no theme resolved)', () => {
    mockUseTheme.mockReturnValue({
      resolvedTheme: undefined,
      theme: 'system',
      setTheme: vi.fn(),
    });

    const { result } = renderHook(() => useLogoSrc('auth'));

    expect(result.current).toBe('/images/logos/logo.png');
  });

  it('defaults to auth context when no context provided', () => {
    mockUseTheme.mockReturnValue({
      resolvedTheme: 'light',
      theme: 'light',
      setTheme: vi.fn(),
    });

    const { result } = renderHook(() => useLogoSrc());

    expect(result.current).toBe('/images/logos/logo.png');
  });
});