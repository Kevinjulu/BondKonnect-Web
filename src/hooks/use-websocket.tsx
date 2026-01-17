"use client";

import { useEffect, useCallback, useRef } from 'react';
import webSocketService from '../lib/websocket';
import { useToast } from './use-toast';

interface UseWebSocketProps {
  userId?: number;
  userEmail?: string;
  authCookie?: string;
  onNotificationReceived?: (notification: any) => void;
  onMessageReceived?: (message: any) => void;
}

export const useWebSocket = ({
  userId,
  userEmail,
  authCookie,
  onNotificationReceived,
  onMessageReceived,
}: UseWebSocketProps) => {
  const { toast } = useToast();
  const isConnectedRef = useRef(false);
  const notificationChannelRef = useRef<any>(null);
  const messageChannelRef = useRef<any>(null);

  // Initialize WebSocket connection
  const connect = useCallback(async () => {
    if (!userId || isConnectedRef.current) return;

    try {
      console.log(`Initializing WebSocket for user ${userId}`);
      await webSocketService.initialize(userId, authCookie);
      isConnectedRef.current = true;

      // Listen for notifications if callback provided
      if (onNotificationReceived) {
        notificationChannelRef.current = webSocketService.listenForNotifications(
          userId,
          (notification) => {
            console.log('New notification received:', notification);
            
            // Show toast notification
            toast({
              title: "New Notification",
              description: notification.notification?.notification_message || "You have a new notification",
            });

            // Call the callback
            onNotificationReceived(notification);
          }
        );
      }

      // Listen for messages if callback provided
      if (onMessageReceived) {
        messageChannelRef.current = webSocketService.listenForMessages(
          userId,
          (message) => {
            console.log('New message received:', message);
            
            // Show toast notification for messages
            const senderName = message.message?.created_by 
              ? `${message.message.created_by.FirstName} ${message.message.created_by.OtherNames}`
              : 'Someone';
            
            toast({
              title: "New Message",
              description: `${senderName} sent you a message`,
            });

            // Call the callback
            onMessageReceived(message);
          }
        );
      }

      console.log(`WebSocket connected for user ${userId}`);
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      isConnectedRef.current = false;
    }
  }, [userId, authCookie, onNotificationReceived, onMessageReceived, toast]);

  // Disconnect WebSocket
  const disconnect = useCallback(() => {
    if (!isConnectedRef.current || !userId) return;

    try {
      console.log(`Disconnecting WebSocket for user ${userId}`);
      
      // Stop listening to channels
      if (notificationChannelRef.current) {
        webSocketService.stopListeningForNotifications(userId);
        notificationChannelRef.current = null;
      }
      
      if (messageChannelRef.current) {
        webSocketService.stopListeningForMessages(userId);
        messageChannelRef.current = null;
      }

      // Disconnect the service
      webSocketService.disconnect();
      isConnectedRef.current = false;
      
      console.log(`WebSocket disconnected for user ${userId}`);
    } catch (error) {
      console.error('Error disconnecting WebSocket:', error);
    }
  }, [userId]);

  // Auto-connect when userId is available
  useEffect(() => {
    if (userId && !isConnectedRef.current) {
      connect().catch(console.error);
    }

    // Cleanup on unmount or when userId changes
    return () => {
      if (isConnectedRef.current) {
        disconnect();
      }
    };
  }, [userId, connect, disconnect]);

  // Handle visibility change to reconnect when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && userId && !isConnectedRef.current) {
        console.log('Tab became visible, reconnecting WebSocket...');
        setTimeout(() => connect().catch(console.error), 1000); // Small delay to ensure proper reconnection
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [connect, userId]);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      if (userId && !isConnectedRef.current) {
        console.log('Connection restored, reconnecting WebSocket...');
        setTimeout(() => connect().catch(console.error), 2000); // Delay to ensure connection is stable
      }
    };

    const handleOffline = () => {
      console.log('Connection lost, WebSocket will reconnect when online');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [connect, userId]);

  return {
    connect,
    disconnect,
    isConnected: isConnectedRef.current,
    webSocketService,
  };
}; 
