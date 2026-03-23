"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useWebSocket } from '../../hooks/use-websocket';

interface WebSocketContextType {
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  refreshNotifications: () => void;
  refreshMessages: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
};

interface WebSocketProviderProps {
  children: React.ReactNode;
  userDetails?: {
    id?: number;
    email?: string;
    cookie?: string;
  };
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
  userDetails,
}) => {
  const [notificationRefreshTrigger, setNotificationRefreshTrigger] = useState(0);
  const [messageRefreshTrigger, setMessageRefreshTrigger] = useState(0);

  // Handle new notifications
  const handleNotificationReceived = (notification: any) => {
    console.log('WebSocketProvider: New notification received', notification);
    // Trigger a refresh of notifications
    setNotificationRefreshTrigger(prev => prev + 1);
    
    // Dispatch custom event for components to listen to asynchronously to avoid blocking the main thread
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('newNotification', { 
        detail: notification 
      }));
    }, 0);
  };

  // Handle new messages
  const handleMessageReceived = (message: any) => {
    console.log('WebSocketProvider: New message received', message);
    // Trigger a refresh of messages
    setMessageRefreshTrigger(prev => prev + 1);
    
    // Dispatch custom event for components to listen to asynchronously to avoid blocking the main thread
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('newMessage', { 
        detail: message 
      }));
    }, 0);
  };

  const { connect, disconnect, isConnected } = useWebSocket({
    userId: userDetails?.id,
    userEmail: userDetails?.email,
    authCookie: userDetails?.cookie,
    onNotificationReceived: handleNotificationReceived,
    onMessageReceived: handleMessageReceived,
  });

  const refreshNotifications = () => {
    setNotificationRefreshTrigger(prev => prev + 1);
  };

  const refreshMessages = () => {
    setMessageRefreshTrigger(prev => prev + 1);
  };

  // Expose refresh triggers via custom events
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('refreshNotifications', { 
      detail: { trigger: notificationRefreshTrigger } 
    }));
  }, [notificationRefreshTrigger]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('refreshMessages', { 
      detail: { trigger: messageRefreshTrigger } 
    }));
  }, [messageRefreshTrigger]);

  const contextValue: WebSocketContextType = {
    isConnected,
    connect,
    disconnect,
    refreshNotifications,
    refreshMessages,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
}; 
