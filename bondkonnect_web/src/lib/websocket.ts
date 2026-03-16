import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

import { getWebSocketBaseUrl } from './utils/url-resolver';

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo<'pusher'>;
  }
}

// Make Pusher available globally
if (typeof window !== 'undefined') {
  window.Pusher = Pusher;
}

class WebSocketService {
  private echo: Echo<'pusher'> | null = null;
  private isInitialized = false;
  private userId: number | null = null;

  // Helper function to check if k-o-t cookie is present
  private checkAuthCookie(): boolean {
    if (typeof document === 'undefined') return false;
    
    const cookies = document.cookie.split(';');
    const kotCookie = cookies.find(cookie => cookie.trim().startsWith('k-o-t='));
    const hasKotCookie = !!kotCookie;
    
    console.log('Auth cookie check:', {
      hasKotCookie,
      kotCookie: kotCookie ? 'Present' : 'Missing',
      allCookies: document.cookie || 'No cookies'
    });
    
    return hasKotCookie;
  }

  // Helper function to get the k-o-t cookie value
  private getAuthCookie(): string | null {
    if (typeof document === 'undefined') return null;
    
    const cookies = document.cookie.split(';');
    const kotCookie = cookies.find(cookie => cookie.trim().startsWith('k-o-t='));
    
    if (kotCookie) {
      return kotCookie.split('=')[1];
    }
    
    return null;
  }

  // Initialize the Echo instance
  async initialize(userId: number, authCookie?: string) {
    if (this.isInitialized && this.userId === userId) {
      return this.echo;
    }

    // Check if k-o-t cookie is present
    const hasAuthCookie = this.checkAuthCookie();
    if (!hasAuthCookie) {
      console.warn('No k-o-t authentication cookie found. WebSocket authentication may fail.');
    }

    this.userId = userId;
    let websocketBaseUrl = getWebSocketBaseUrl();

    // Check for valid Pusher key
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
    if (!pusherKey || pusherKey === 'your_pusher_app_key_here') {
      console.warn('WebSocket initialization skipped: Missing or invalid NEXT_PUBLIC_PUSHER_APP_KEY.');
      return null;
    }

    console.log('Initializing WebSocket connection...', {
      userId,
      pusherKey: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
      authEndpoint: `${websocketBaseUrl}/broadcasting/auth`,
      authCookie: authCookie ? 'Present' : 'Missing',
      hasKotCookie: hasAuthCookie
    });

    // Configure Echo with Pusher for cookie-based authentication
    this.echo = new Echo({
      broadcaster: 'pusher',
      key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
      forceTLS: true,
      encrypted: true,
      auth: {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      },
      authEndpoint: `${websocketBaseUrl}/broadcasting/auth`,
      // Enable credentials to send cookies (including k-o-t cookie)
      authorizer: (channel: any, options: any) => {
        return {
          authorize: (socketId: string, callback: (error: Error | null, data?: any) => void) => {
            console.log('Authenticating channel:', channel.name, 'with socket ID:', socketId);
            
            // Get the k-o-t token from browser cookies
            const kotToken = this.getAuthCookie();
            
            const headers: Record<string, string> = {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest',
              'Cache-Control': 'no-cache',
            };

            // Send k-o-t token as a custom header instead of relying on cookies
            if (kotToken) {
              headers['X-Auth-Token'] = kotToken;
              console.log('Sending k-o-t token as header');
            } else {
              console.warn('No k-o-t token found in cookies');
            }
            
            fetch(`${websocketBaseUrl}/broadcasting/auth`, {
              method: 'POST',
              headers,
              credentials: 'include', // Still include for other cookies if needed
              body: JSON.stringify({
                socket_id: socketId,
                channel_name: channel.name,
              }),
            })
            .then(response => {
              console.log('Broadcasting auth response:', {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok,
                headers: Object.fromEntries(response.headers.entries())
              });
              if (!response.ok) {
                throw new Error(`Authentication failed: ${response.status} ${response.statusText}`);
              }
              return response.json();
            })
            .then(data => {
              console.log('Broadcasting auth successful:', data);
              callback(null, data);
            })
            .catch(error => {
              console.error('WebSocket authentication failed:', {
                error: error.message,
                hasKotCookie: this.checkAuthCookie(),
                endpoint: `${websocketBaseUrl}/broadcasting/auth`
              });
              callback(error, null);
            });
          }
        };
      },
    });

    // Add connection event listeners
    this.echo.connector.pusher.connection.bind('connected', () => {
      console.log('WebSocket connected successfully');
    });

    this.echo.connector.pusher.connection.bind('disconnected', () => {
      console.log('WebSocket disconnected');
    });

    this.echo.connector.pusher.connection.bind('error', (error: any) => {
      console.error('WebSocket connection error:', error);
    });

    this.isInitialized = true;
    return this.echo;
  }

  // Listen for notifications
  listenForNotifications(userId: number, callback: (notification: any) => void) {
    if (!this.echo) {
      console.error('Echo not initialized. Call initialize() first.');
      return;
    }

    console.log(`Setting up notification listener for user ${userId}`);
    
    return this.echo
      .private(`notifications.${userId}`)
      .listen('.notification.sent', (e: any) => {
        console.log('Notification received:', e);
        callback(e);
      })
      .error((error: any) => {
        console.error('Error listening to notifications channel:', error);
      });
  }

  // Listen for messages
  listenForMessages(userId: number, callback: (message: any) => void) {
    if (!this.echo) {
      console.error('Echo not initialized. Call initialize() first.');
      return;
    }

    console.log(`Setting up message listener for user ${userId}`);

    return this.echo
      .private(`messages.${userId}`)
      .listen('.message.sent', (e: any) => {
        console.log('Message received:', e);
        callback(e);
      })
      .error((error: any) => {
        console.error('Error listening to messages channel:', error);
      });
  }

  // Stop listening to notifications
  stopListeningForNotifications(userId: number) {
    if (!this.echo) return;

    this.echo.leave(`notifications.${userId}`);
  }

  // Stop listening to messages
  stopListeningForMessages(userId: number) {
    if (!this.echo) return;

    this.echo.leave(`messages.${userId}`);
  }

  // Disconnect Echo
  disconnect() {
    if (this.echo) {
      this.echo.disconnect();
      this.echo = null;
      this.isInitialized = false;
      this.userId = null;
    }
  }

  // Get the current Echo instance
  getEcho() {
    return this.echo;
  }

  // Check if initialized
  isEchoInitialized() {
    return this.isInitialized && this.echo !== null;
  }

  // Debug function to check authentication status
  debugAuth(): void {
    console.log('WebSocket Debug Info:', {
      isInitialized: this.isInitialized,
      userId: this.userId,
      hasKotCookie: this.checkAuthCookie(),
      echoStatus: this.echo ? 'Present' : 'Not initialized'
    });
  }
}

// Create and export a singleton instance
const webSocketService = new WebSocketService();
export default webSocketService; 
