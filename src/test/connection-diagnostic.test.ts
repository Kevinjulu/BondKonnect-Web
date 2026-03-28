import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getBaseApiUrl, getBaseUrl, isSelfCalling } from '../lib/utils/url-resolver';

// Mock the env module
vi.mock('@/app/config/env', () => ({
  env: {
    get INTERNAL_API_URL() { return process.env.INTERNAL_API_URL; },
    get NEXT_PUBLIC_API_URL() { return process.env.NEXT_PUBLIC_API_URL; },
    get FORCE_PUBLIC_API() { return process.env.FORCE_PUBLIC_API === 'true'; },
    get NEXT_PUBLIC_WEBSOCKET_URL() { return process.env.NEXT_PUBLIC_WEBSOCKET_URL; },
  }
}));

// Mock environment variables
const ORIGINAL_ENV = process.env;

describe('Connection Diagnostic - URL Resolution', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  it('should prefer INTERNAL_API_URL on the server', () => {
    process.env.INTERNAL_API_URL = 'http://internal.railway.app/api';
    process.env.NEXT_PUBLIC_API_URL = 'https://public.up.railway.app/api';

    // Simulate server-side
    const originalWindow = global.window;
    // @ts-expect-error - Simulating server environment by deleting window
    delete global.window;

    const apiUrl = getBaseApiUrl();
    expect(apiUrl).toBe('http://internal.railway.app/api');

    global.window = originalWindow;
  });

  it('should use NEXT_PUBLIC_API_URL on the server if FORCE_PUBLIC_API is true', () => {
    process.env.INTERNAL_API_URL = 'http://internal.railway.app/api';
    process.env.NEXT_PUBLIC_API_URL = 'https://public.up.railway.app/api';
    process.env.FORCE_PUBLIC_API = 'true';

    // Simulate server-side
    const originalWindow = global.window;
    // @ts-expect-error - Simulating server environment by deleting window
    delete global.window;

    const apiUrl = getBaseApiUrl();
    expect(apiUrl).toBe('https://public.up.railway.app/api');

    global.window = originalWindow;
  });

  it('should use NEXT_PUBLIC_API_URL on the client', () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://public.up.railway.app/api';
    
    // In JSDOM, window is defined
    const apiUrl = getBaseApiUrl();
    expect(apiUrl).toBe('https://public.up.railway.app/api');
  });

  it('should derive getBaseUrl correctly from API URL', () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://public.up.railway.app/api';
    const baseUrl = getBaseUrl();
    expect(baseUrl).toBe('https://public.up.railway.app');
  });

  it('should detect self-calling URLs correctly', () => {
    // Mock window.location
    const originalLocation = window.location;
    // @ts-expect-error - Mocking window.location which is read-only
    delete window.location;
    window.location = { origin: 'https://bondkonnect.up.railway.app', host: 'bondkonnect.up.railway.app' } as Location;

    expect(isSelfCalling('https://bondkonnect.up.railway.app/api/v1')).toBe(true);
    expect(isSelfCalling('/api/v1')).toBe(true);
    expect(isSelfCalling('https://another-site.com/api')).toBe(false);

    window.location = originalLocation;
  });

  it('should warn if API URL points to frontend origin', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    const originalLocation = window.location;
    // @ts-expect-error - Mocking window.location which is read-only
    delete window.location;
    window.location = { origin: 'https://bondkonnect.up.railway.app', host: 'bondkonnect.up.railway.app' } as Location;

    process.env.NEXT_PUBLIC_API_URL = 'https://bondkonnect.up.railway.app/api';
    
    getBaseApiUrl();
    
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('WARNING: API URL is pointing to the FRONTEND origin'));

    window.location = originalLocation;
    consoleSpy.mockRestore();
  });
});

describe('Axios Instance Configuration', () => {
  it('should have correct baseURL from getBaseApiUrl', async () => {
    const { default: axiosServices } = await import('../utils/axios');
    const expectedUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
    expect(axiosServices.defaults.baseURL).toBe(expectedUrl);
  });

  it('should have correct headers', async () => {
    const { default: axiosServices } = await import('../utils/axios');
    expect(axiosServices.defaults.headers['Accept']).toBe('application/json');
    expect(axiosServices.defaults.headers['Content-Type']).toBe('application/json');
  });
});
