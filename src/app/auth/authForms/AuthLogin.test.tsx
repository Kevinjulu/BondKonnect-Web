import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AuthLogin from './AuthLogin';
import { login } from '@/lib/actions/api.actions';
import React from 'react';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock api actions
vi.mock('@/lib/actions/api.actions', () => ({
  login: vi.fn(),
}));

// Mock user check
vi.mock('@/lib/actions/user.check', () => ({
  getCurrentUserDetails: vi.fn(() => Promise.resolve(null)),
}));

describe('AuthLogin Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display "Invalid email or password" on 401 error', async () => {
    (login as any).mockResolvedValue({
      success: false,
      status: 401,
      message: 'Unauthorized',
    });

    render(<AuthLogin title="Log In" />);

    fireEvent.change(screen.getByPlaceholderText('name@company.com'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /log in to workstation/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password.')).toBeInTheDocument();
    });
  });

  it('should display suspension message on 403 error', async () => {
    (login as any).mockResolvedValue({
      success: false,
      status: 403,
      message: 'Forbidden',
    });

    render(<AuthLogin title="Log In" />);

    fireEvent.change(screen.getByPlaceholderText('name@company.com'), {
      target: { value: 'suspended@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /log in to workstation/i }));

    await waitFor(() => {
      expect(screen.getByText(/Account suspended. Contact admin./i)).toBeInTheDocument();
    });
  });

  it('should display service unavailable message on 503 error', async () => {
    (login as any).mockResolvedValue({
      success: false,
      status: 503,
      message: 'Service Unavailable',
    });

    render(<AuthLogin title="Log In" />);

    fireEvent.change(screen.getByPlaceholderText('name@company.com'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /log in to workstation/i }));

    await waitFor(() => {
      expect(screen.getByText(/Service Unavailable/i)).toBeInTheDocument();
    });
  });

  it('should display "Unable to reach the server." when the login call throws', async () => {
    (login as any).mockRejectedValue(new Error('Network Error'));

    render(<AuthLogin title="Log In" />);

    fireEvent.change(screen.getByPlaceholderText('name@company.com'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /log in to workstation/i }));

    await waitFor(() => {
      expect(screen.getByText(/Unable to reach the server./i)).toBeInTheDocument();
    });
  });
});
