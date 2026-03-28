import { renderHook, waitFor } from '@testing-library/react';
import { useWebSocket } from '../use-websocket';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import webSocketService from '../../lib/websocket';
import { useToast } from '../use-toast';

// Mock the dependencies
vi.mock('../../lib/websocket', () => ({
  default: {
    initialize: vi.fn(),
    listenForNotifications: vi.fn(),
    listenForMessages: vi.fn(),
    stopListeningForNotifications: vi.fn(),
    stopListeningForMessages: vi.fn(),
    disconnect: vi.fn(),
  }
}));

vi.mock('../use-toast', () => ({
  useToast: vi.fn(() => ({
    toast: vi.fn(),
  })),
}));

describe('useWebSocket hook', () => {
  const mockToast = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    (useToast as any).mockReturnValue({ toast: mockToast });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('initializes connection when userId is provided', async () => {
    (webSocketService.initialize as any).mockResolvedValue({ some: 'echo-instance' });

    renderHook(() => useWebSocket({ userId: 123 }));

    await waitFor(() => {
      expect(webSocketService.initialize).toHaveBeenCalledWith(123, undefined);
    });
  });

  it('sets up listeners when callbacks are provided', async () => {
    (webSocketService.initialize as any).mockResolvedValue({ some: 'echo-instance' });
    const onNotification = vi.fn();
    const onMessage = vi.fn();

    renderHook(() => useWebSocket({ 
      userId: 123, 
      onNotificationReceived: onNotification,
      onMessageReceived: onMessage 
    }));

    await waitFor(() => {
      expect(webSocketService.listenForNotifications).toHaveBeenCalledWith(123, expect.any(Function));
      expect(webSocketService.listenForMessages).toHaveBeenCalledWith(123, expect.any(Function));
    });
  });

  it('calls onNotificationReceived and shows toast when notification arrives', async () => {
    let capturedCallback: any;
    (webSocketService.initialize as any).mockResolvedValue({});
    (webSocketService.listenForNotifications as any).mockImplementation((id: number, cb: any) => {
      capturedCallback = cb;
      return {};
    });

    const onNotification = vi.fn();
    renderHook(() => useWebSocket({ userId: 123, onNotificationReceived: onNotification }));

    await waitFor(() => expect(capturedCallback).toBeDefined());

    // Simulate incoming notification
    const mockNotification = { notification: { notification_message: 'Test message' } };
    capturedCallback(mockNotification);

    expect(onNotification).toHaveBeenCalledWith(mockNotification);
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
      title: "New Notification",
      description: 'Test message'
    }));
  });

  it('disconnects on unmount', async () => {
    (webSocketService.initialize as any).mockResolvedValue({});
    const { unmount } = renderHook(() => useWebSocket({ userId: 123 }));

    await waitFor(() => expect(webSocketService.initialize).toHaveBeenCalled());

    unmount();

    expect(webSocketService.disconnect).toHaveBeenCalled();
  });
});
