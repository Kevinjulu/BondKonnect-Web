import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Allowed origins for CORS - Strictly Railway and Pusher
const ALLOWED_ORIGINS = [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.NEXT_PUBLIC_API_URL,
    process.env.NEXT_PUBLIC_LOGIN_URL,
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

    // Allowed domains for CSP
    const allowedDomains = [
        'https://cdnjs.cloudflare.com',
        'https://sockjs-ap2.pusher.com',
        'wss://ws-ap2.pusher.com',
        'https://*.pusher.com',
        'wss://*.pusher.com',
        process.env.NEXT_PUBLIC_API_URL,
        process.env.NEXT_PUBLIC_WEBSOCKET_URL,
        process.env.NEXT_PUBLIC_LOGIN_URL,
        process.env.NEXT_PUBLIC_APP_URL,
    ].filter(Boolean).join(' ');

    // CSP headers
    const cspDirectives = {
        'worker-src': ["'self'", 'blob:'],
        'default-src': ["'self'", process.env.NEXT_PUBLIC_APP_URL || ''],
        'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'cdnjs.cloudflare.com'],
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", 'data:', 'https:', 'http:'],
        'font-src': ["'self'", 'data:', 'https:', 'http:'],
        'connect-src': ["'self'", 'blob:', allowedDomains, 'cdnjs.cloudflare.com', 'https://*.pusher.com', 'wss://*.pusher.com'],
        'frame-ancestors': ["'self'"],
        'form-action': ["'self'"],
        'object-src': ["'none'"],
    };

    const cspString = Object.entries(cspDirectives)
        .map(([key, values]) => `${key} ${values.filter(Boolean).join(' ')}`)
        .join('; ');

    // Security headers
    response.headers.set('Content-Security-Policy', cspString);
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

    return response;
}

export const config = {
    matcher: [
        {
            source: '/((?!api|_next/static|_next/image|favicon.ico|public/).*)',
            missing: [
                { type: 'header', key: 'next-router-prefetch' },
                { type: 'header', key: 'purpose', value: 'prefetch' },
            ],
        },
        '/api/:path*',
    ],
};
