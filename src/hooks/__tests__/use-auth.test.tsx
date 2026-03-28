import { renderHook, waitFor } from '@testing-library/react';
import { useAuth, useHasPermission } from '../use-auth';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUserDetails } from '@/lib/actions/user.check';

// Mock dependencies
vi.mock('react-redux', () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

vi.mock('@/lib/actions/user.check', () => ({
  getCurrentUserDetails: vi.fn(),
}));

vi.mock('@/store/apps/auth/AuthSlice', () => ({
  setUser: vi.fn((payload) => ({ type: 'auth/setUser', payload })),
  logout: vi.fn(() => ({ type: 'auth/logout' })),
}));

describe('useAuth hook', () => {
  const mockDispatch = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    (useDispatch as any).mockReturnValue(mockDispatch);
  });

  it('returns auth state from redux', () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    (useSelector as any).mockImplementation((selector: any) => selector({
      auth: {
        user: mockUser,
        isAuthenticated: true,
        userRole: 'admin'
      }
    }));
    
    (useQuery as any).mockReturnValue({
      data: mockUser,
      isLoading: false,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
      error: null
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.userRole).toBe('admin');
  });

  it('dispatches setUser when query succeeds', async () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    (useSelector as any).mockReturnValue({ user: null, isAuthenticated: false });
    
    (useQuery as any).mockReturnValue({
      data: mockUser,
      isLoading: false,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    });

    renderHook(() => useAuth());

    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'auth/setUser', payload: mockUser }));
  });

  it('dispatches logout when query fails', async () => {
    (useSelector as any).mockReturnValue({ user: null, isAuthenticated: false });
    
    (useQuery as any).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      isSuccess: false,
      refetch: vi.fn(),
    });

    renderHook(() => useAuth());

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'auth/logout' });
  });
});

describe('useHasPermission hook', () => {
  it('returns true if user has the permission', () => {
    const mockUser = {
      roles: [
        {
          role_permissions: [
            { permission_name: 'view_dashboard', allowed: true }
          ]
        }
      ]
    };
    
    (useSelector as any).mockImplementation((selector: any) => selector({
      auth: { user: mockUser }
    }));

    const { result } = renderHook(() => useHasPermission('view_dashboard'));
    expect(result.current).toBe(true);
  });

  it('returns false if user does not have the permission', () => {
    const mockUser = {
      roles: [
        {
          role_permissions: [
            { permission_name: 'view_dashboard', allowed: false }
          ]
        }
      ]
    };
    
    (useSelector as any).mockImplementation((selector: any) => selector({
      auth: { user: mockUser }
    }));

    const { result } = renderHook(() => useHasPermission('admin_panel'));
    expect(result.current).toBe(false);
  });

  it('returns false if user is not logged in', () => {
    (useSelector as any).mockImplementation((selector: any) => selector({
      auth: { user: null }
    }));

    const { result } = renderHook(() => useHasPermission('view_dashboard'));
    expect(result.current).toBe(false);
  });
});
