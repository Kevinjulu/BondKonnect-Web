import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AuthLogin from '../AuthLogin';
import api, { getCsrf } from '@/lib/api';
import React from 'react';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock api
vi.mock('@/lib/api', () => ({
  default: {
    post: vi.fn(),
  },
  getCsrf: vi.fn(() => Promise.resolve(true)),
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
    (api.post as any).mockRejectedValue({
      response: {
        status: 401,
        data: { message: 'Unauthorized' }
      }
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
      expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument();
    });
  }, 15000);

  it('should display suspension message on 403 error', async () => {
    (api.post as any).mockRejectedValue({
      response: {
        status: 403,
        data: { message: 'Forbidden' }
      }
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
    (api.post as any).mockRejectedValue({
      response: {
        status: 503,
        data: { message: 'Service Unavailable' }
      }
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
      expect(screen.getByText(/Service Unavailable. Please try again later./i)).toBeInTheDocument();
    });
  });

  it('should display "Unable to reach the server." when the login call throws', async () => {
    (api.post as any).mockRejectedValue(new Error('Unable to reach the server.'));

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
