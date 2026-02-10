import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
    'http://localhost:4000',
    'http://localhost:8000',
    process.env.NEXT_PUBLIC_BRITAM_PROD_API_URL,
    process.env.NEXT_PUBLIC_BRITAM_UAT_API_URL,
    process.env.NEXT_PUBLIC_SOFTCLANS_PROD_API_URL,
    process.env.NEXT_PUBLIC_SOFTCLANS_UAT_API_URL,
    process.env.NEXT_PUBLIC_SOFTCLANS_DEV_API_URL,
    process.env.NEXT_PUBLIC_LOGIN_URL,
    'https://bondlytic.vps.webdock.cloud',
    'https://bondlytic.vps.webdock.cloud:8080',
    'https://*.bondlytic.com',
].filter(Boolean);

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const authToken = request.cookies.get('k-o-t');
    const userRole = request.cookies.get('userRole');
    
    // 1. Route Protection
    const isAuthRoute = pathname.startsWith('/auth') || pathname.startsWith('/admin');
    const isPublicAuthPage = [
        '/auth/login', '/auth/sign-up', '/auth/forgot-password',
        '/admin/login', '/admin/sign-up', '/admin/forgot-password'
    ].includes(pathname);

    const isRoleSelectionPage = pathname === '/auth/role' || pathname === '/admin/role';
    const isOtpPage = pathname === '/auth/otp' || pathname === '/admin/otp';
    
    // Protect dashboard routes (all routes except /auth, /admin, /api, and static assets)
    if (!isAuthRoute && !pathname.startsWith('/api') && !pathname.includes('.') && !authToken) {
        const loginUrl = new URL('/auth/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    // Redirect to role selection if logged in but no role selected (and not already on role/otp pages)
    if (authToken && !userRole && !isRoleSelectionPage && !isOtpPage && !pathname.startsWith('/api') && !pathname.includes('.')) {
        // Default to /auth/role, unless they are in the admin flow
        const roleUrl = new URL(pathname.startsWith('/admin') ? '/admin/role' : '/auth/role', request.url);
        return NextResponse.redirect(roleUrl);
    }

    // Redirect to dashboard if already logged in and role selected, and trying to access login/signup/role
    if ((isPublicAuthPage || isRoleSelectionPage) && authToken && userRole) {
        const dashboardUrl = new URL('/', request.url);
        return NextResponse.redirect(dashboardUrl);
    }

    const response = NextResponse.next();

    // Handle preflight OPTIONS requests
    if (request.method === 'OPTIONS') {
        const origin = request.headers.get('origin');
        if (origin && ALLOWED_ORIGINS.includes(origin)) {
            return new NextResponse(null, {
                status: 200,
                headers: {
                    'Access-Control-Allow-Origin': origin,
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
                    'Access-Control-Allow-Credentials': 'true',
                    'Access-Control-Max-Age': '86400',
                },
            });
        }
    }

    // CORS headers
    const origin = request.headers.get('origin');
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
        response.headers.set('Access-Control-Allow-Origin', origin);
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours
        response.headers.set('Access-Control-Allow-Credentials', 'true');
    }

    // allowed domains with development URLs
    const allowedDomains = [
        'http://localhost:4000',
        'http://localhost:8000',
        'http://localhost:8080',
        'https://bondlytic.vps.webdock.cloud',
        'https://bondlytic.vps.webdock.cloud:8080',
        'https://cdnjs.cloudflare.com',
        // Pusher domains for WebSocket connections
        'https://sockjs-ap2.pusher.com',
        'wss://ws-ap2.pusher.com',
        'https://*.pusher.com',
        'wss://*.pusher.com',
        process.env.NEXT_PUBLIC_BK_DEV_API_URL,
        process.env.NEXT_PUBLIC_BK_UAT_API_URL,
        process.env.NEXT_PUBLIC_BK_PROD_API_URL,
        process.env.NEXT_PUBLIC_LOGIN_URL,
        process.env.NEXT_PUBLIC_BK_DEV_WEBSOCKET_API_URL,
        process.env.NEXT_PUBLIC_BK_UAT_WEBSOCKET_API_URL,
        process.env.NEXT_PUBLIC_BK_PROD_WEBSOCKET_API_URL,
        'https://api.bondlytic.com',
        'https://*.bondlytic.com',
        'https://p.bondlytic.com',
        'https://hub.bondlytic.com',
        'wss://*.bondlytic.com',
    ].filter(Boolean).join(' ');

    // CSP headers with more permissive settings for development
    const cspDirectives = {
        // set up a worker-src directive to allow the use of web workers
        'worker-src': ["'self'", 'blob:'],
        'default-src': ["'self'", 'http://localhost:*', 'https://bw.bondlytic.com', 'https://*.bondlytic.com', 'https://bondlytic.vps.webdock.cloud', 'https://bondlytic.vps.webdock.cloud:8080'],
        'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'cdnjs.cloudflare.com', 'http://localhost:*'],
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", 'data:', 'https:', 'http:'],
        'font-src': ["'self'", 'data:', 'https:', 'http:'],
        'connect-src': ["'self'", 'blob:', allowedDomains, 'http://localhost:*', 'https://*.bondlytic.com', 'https://bondlytic.vps.webdock.cloud', 'https://bondlytic.vps.webdock.cloud:8080', 'cdnjs.cloudflare.com', 'https://sockjs-ap2.pusher.com', 'wss://ws-ap2.pusher.com', 'https://*.pusher.com', 'wss://*.pusher.com'],
        'frame-ancestors': ["'self'"],  // Changed from 'none' to allow frames in development
        //'base-uri': ["'self'"],
        'form-action': ["'self'"],
        'object-src': ["'none'"],
    };

    // Convert CSP directives to string
    const cspString = Object.entries(cspDirectives)
        .map(([key, values]) => `${key} ${values.join(' ')}`)
        .join('; ');

    // Apply security headers
    const securityHeaders = {
        'Content-Security-Policy': cspString,
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'X-XSS-Protection': '1; mode=block',
        'X-DNS-Prefetch-Control': 'on',
        'X-Download-Options': 'noopen',
        'X-Permitted-Cross-Domain-Policies': 'none',
        'Server': '',
        'X-Powered-By': '',
        // These headers can cause ChunkLoadError in development
        // 'Cross-Origin-Resource-Policy': 'same-origin',
        // 'Cross-Origin-Opener-Policy': 'same-origin',
        // 'Cross-Origin-Embedder-Policy': 'require-corp',
         
    };

    /*
    // Apply all security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
    });
    */

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon)
         * - public folder
         */
        {
            source: '/((?!api|_next/static|_next/image|favicon.ico|public/).*)',
            missing: [
                { type: 'header', key: 'next-router-prefetch' },
                { type: 'header', key: 'purpose', value: 'prefetch' },
            ],
        },
        '/api/:path*', // Include API 
    ],
};
