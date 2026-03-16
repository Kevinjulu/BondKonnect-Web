import { render, screen, renderHook } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { WebSocketProvider, useWebSocketContext } from '../WebSocketProvider';
import { useWebSocket } from '../../../hooks/use-websocket';
import React from 'react';

vi.mock('../../../hooks/use-websocket', () => ({
  useWebSocket: vi.fn(),
}));

describe('WebSocketProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('provides connection status and controls via context', () => {
    (useWebSocket as any).mockReturnValue({
      connect: vi.fn(),
      disconnect: vi.fn(),
      isConnected: true,
    });

    const TestComponent = () => {
      const { isConnected } = useWebSocketContext();
      return <div>{isConnected ? 'Connected' : 'Disconnected'}</div>;
    };

    render(
      <WebSocketProvider userDetails={{ id: 1, email: 'test@test.com' }}>
        <TestComponent />
      </WebSocketProvider>
    );

    expect(screen.getByText('Connected')).toBeInTheDocument();
  });

  it('throws error when used outside provider', () => {
    const TestComponent = () => {
      useWebSocketContext();
      return null;
    };

    // Suppress console error for expected throw
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => render(<TestComponent />)).toThrow('useWebSocketContext must be used within a WebSocketProvider');
    
    consoleSpy.mockRestore();
  });
});
