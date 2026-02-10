# Routing & Redirection Documentation

This document outlines the routing architecture and redirection logic implemented in the BondKonnect-Web application.

## Overview

The application uses Next.js App Router with integrated Middleware for security and role-based access control (RBAC).

## Logical Roles

The system supports 6 distinct logical roles:
- `individual`
- `agent`
- `corporate`
- `broker`
- `authorizeddealer`
- `admin`

## Route Categories

### 1. Public Routes
These routes are accessible without authentication:
- `/auth/login`
- `/auth/sign-up`
- `/auth/forgot-password`
- `/admin/login`
- `/admin/sign-up`
- `/admin/forgot-password`

### 2. Semi-Protected Routes (Auth Flow)
These routes require an `authToken` (k-o-t cookie) but do NOT require a `userRole`:
- `/auth/otp`
- `/auth/role`
- `/admin/otp`
- `/admin/role`

### 3. Protected Dashboard Routes
All other routes under `/` and `/apps/*` require both an `authToken` and a `userRole`.

## Redirection Logic (Middleware)

The `middleware.ts` handles the following redirection scenarios:

| User State | Target Path | Action |
|------------|-------------|--------|
| Unauthenticated | `/apps/*` | Redirect to `/auth/login` |
| Authenticated, No Role | `/apps/*` | Redirect to `/auth/role` (or `/admin/role`) |
| Authenticated, Role Selected | `/auth/login` | Redirect to `/` |
| Authenticated, Role Selected | `/auth/role` | Redirect to `/` |

## Navigation

- **Main Entry**: `/` (Market Dashboard)
- **Application Hub**: Sidebars and headers use `src/app/(dashboard)/layouts/sidebar/MenuItems.ts` to dynamically render navigation items based on the active role's permissions.
- **Admin Specifics**: Admin users have access to `/apps/manage-users`, `/apps/permissions`, and `/apps/activity-logs`.

## Testing & Verification

To verify routing:
1. Clear cookies and access `/`. Expect redirect to `/auth/login`.
2. Login and verify redirect to `/auth/otp`.
3. Complete OTP and verify redirect to `/auth/role`.
4. Select role and verify redirect to `/`.
5. While logged in, attempt to access `/auth/login`. Expect redirect to `/`.
