import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getBaseApiUrl, getBaseUrl, isSelfCalling } from '../lib/utils/url-resolver';

// Mock the env module
vi.mock('@/app/config/env', () => ({
  env: {
    INTERNAL_API_URL: 'http://internal.railway.app/api',
    NEXT_PUBLIC_API_URL: 'https://public.up.railway.app/api',
    FORCE_PUBLIC_API: false,
    NEXT_PUBLIC_WEBSOCKET_URL: 'wss://ws.railway.app',
  }
}));

import { env } from '@/app/config/env';

describe('Connection Diagnostic - URL Resolution', () => {
  const originalWindow = global.window;

  beforeEach(() => {
    vi.resetModules();
    // Reset env mocks
    (env as any).INTERNAL_API_URL = 'http://internal.railway.app/api';
    (env as any).NEXT_PUBLIC_API_URL = 'https://public.up.railway.app/api';
    (env as any).FORCE_PUBLIC_API = false;
  });

  afterEach(() => {
    global.window = originalWindow;
  });

  it('should prefer INTERNAL_API_URL on the server', () => {
    // Simulate server-side
    vi.stubGlobal('window', undefined);

    const apiUrl = getBaseApiUrl();
    expect(apiUrl).toBe('http://internal.railway.app/api');
  });

  it('should use NEXT_PUBLIC_API_URL on the server if FORCE_PUBLIC_API is true', () => {
    (env as any).FORCE_PUBLIC_API = true;

    // Simulate server-side
    vi.stubGlobal('window', undefined);

    const apiUrl = getBaseApiUrl();
    expect(apiUrl).toBe('https://public.up.railway.app/api');
  });

  it('should use NEXT_PUBLIC_API_URL on the client', () => {
    // Simulate client-side
    vi.stubGlobal('window', { location: { host: 'another-host.com' } });

    const apiUrl = getBaseApiUrl();
    expect(apiUrl).toBe('https://public.up.railway.app/api');
  });

  it('should derive getBaseUrl correctly from API URL', () => {
    (env as any).NEXT_PUBLIC_API_URL = 'https://public.up.railway.app/api';
    const baseUrl = getBaseUrl();
    expect(baseUrl).toBe('https://public.up.railway.app');
  });

  it('should detect self-calling URLs correctly', () => {
    // Mock window.location
    vi.stubGlobal('window', { 
      location: { 
        origin: 'https://bondkonnect.up.railway.app', 
        host: 'bondkonnect.up.railway.app' 
      } 
    });

    expect(isSelfCalling('https://bondkonnect.up.railway.app/api/v1')).toBe(true);
    expect(isSelfCalling('/api/v1')).toBe(true);
    expect(isSelfCalling('https://another-site.com/api')).toBe(false);
  });

  it('should warn if API URL points to frontend origin', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    // Mock window.location
    vi.stubGlobal('window', { 
      location: { 
        origin: 'https://bondkonnect.up.railway.app', 
        host: 'bondkonnect.up.railway.app' 
      } 
    });

    (env as any).NEXT_PUBLIC_API_URL = 'https://bondkonnect.up.railway.app/api';
    
    getBaseApiUrl();
    
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('WARNING: API URL is pointing to the FRONTEND origin'));

    consoleSpy.mockRestore();
  });
});

describe('Axios Instance Configuration', () => {
  it('should have correct headers', async () => {
    const { default: api } = await import('../lib/api');
    expect(api.defaults.headers['Accept']).toBe('application/json');
    expect(api.defaults.headers['Content-Type']).toBe('application/json');
  });
});
