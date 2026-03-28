import { expect, test, describe, vi } from 'vitest';
import { cn, formatDate, absoluteUrl } from '../utils';

describe('cn utility', () => {
  test('merges tailwind classes correctly', () => {
    expect(cn('px-2 py-2', 'bg-red-500')).toBe('px-2 py-2 bg-red-500');
    expect(cn('px-2 py-2', { 'bg-red-500': true })).toBe('px-2 py-2 bg-red-500');
    expect(cn('px-2 py-2', { 'bg-red-500': false })).toBe('px-2 py-2');
  });

  test('handles conditional classes', () => {
    expect(cn('base', true && 'is-true', false && 'is-false')).toBe('base is-true');
  });
});

describe('formatDate utility', () => {
  test('formats a date string correctly', () => {
    // We use a fixed date to avoid timezone issues in CI/local if possible, 
    // but toLocaleDateString depends on the locale.
    const date = '2023-10-25';
    const formatted = formatDate(date);
    expect(formatted).toContain('October 25, 2023');
  });

  test('formats a timestamp correctly', () => {
    const timestamp = new Date('2023-10-25').getTime();
    const formatted = formatDate(timestamp);
    expect(formatted).toContain('October 25, 2023');
  });
});

describe('absoluteUrl utility', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test('constructs an absolute URL correctly', () => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://bondkonnect.com';
    expect(absoluteUrl('/dashboard')).toBe('https://bondkonnect.com/dashboard');
  });
});
