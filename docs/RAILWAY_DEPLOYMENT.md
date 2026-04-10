# BondKonnect on Railway

**Status:** Live & Operational  
**Last Updated:** March 21, 2026

This document provides a high-level overview of the BondKonnect platform's production deployment on [Railway](https://railway.app/).

## 1. Monorepo Architecture

The BondKonnect project is structured as a monorepo with two primary services:

1.  **`bondkonnect-api` (Backend)**
    -   **Framework:** Laravel
    -   **Purpose:** Handles all business logic, database interactions, user authentication, and serves as the central API for the platform.

2.  **`bondkonnect-web` (Frontend)**
    -   **Framework:** Next.js 15
    -   **Purpose:** Provides the user interface, client-side interactions, and dashboard visualizations. It communicates with the `bondkonnect-api` service.

## 2. Railway Services & Environment

The platform is composed of several interconnected services within our Railway project:

-   **Frontend Service (`bondkonnect-web`)**:
    -   **URL:** `https://bondkonnect.up.railway.app`
-   **Backend Service (`bondkonnect-api`)**:
    -   **URL:** `https://laravel-backend-api.up.railway.app/api`
-   **Database Service**:
    -   **Type:** PostgreSQL
    -   **Notes:** Managed by Railway, providing automated backups and scaling.
-   **External Services**:
    -   **Pusher**: Used for real-time WebSocket communication (notifications, live data).

## 3. Environment Variables & Configuration

All environment variables for both services are managed directly within the **Railway Dashboard**. This is the single source of truth for all production and development configurations.

The `.env` file in the `bondkonnect-web` repository serves as a template and is used for local development, but the Railway-injected variables will always take precedence in a deployed environment.

### Critical Frontend Variables

These variables MUST be set in the Railway dashboard for the `bondkonnect-web` service. For maximum reliability and to ensure the frontend always stays in sync with the backend, we use **Railway Service Variable Interpolation**.

Instead of hardcoding the URL, use the following syntax in the Railway Dashboard:

```env
# The full public URL to the backend API service (used by the browser)
NEXT_PUBLIC_API_URL=https://laravel-backend-api.up.railway.app

# The internal Railway URL for server-side requests (SSR / Server Actions)
# Uses Railway's private network — faster and avoids public egress
INTERNAL_API_URL=http://laravel-backend-api.railway.internal:8080

# The base URL of this frontend application (dynamically resolved)
NEXT_PUBLIC_APP_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}

# The base URL for the backend service, used for WebSocket authentication
NEXT_PUBLIC_WEBSOCKET_URL=https://laravel-backend-api.up.railway.app
```

**Note:** `NEXT_PUBLIC_API_URL` is embedded into the client-side bundle at build time, so a redeploy is required whenever the backend domain changes. `INTERNAL_API_URL` is only used server-side and can be updated without a full rebuild.

#### Why this is better:
1. **Zero Manual Edits:** If you rename the backend or clone the environment, the frontend automatically picks up the new URL.
2. **Environment Parity:** The same configuration works for Production, Staging, and Preview environments without changes.
3. **Railpack Optimized:** Our Railpack builder automatically triggers a rebuild of the frontend when these dependent service variables change, ensuring the client-side bundle is always up-to-date.

### External Service Credentials

In addition to API URLs, ensure these external service variables are configured in the dashboard:

```env
# Pusher credentials for real-time features
NEXT_PUBLIC_PUSHER_APP_KEY=...
NEXT_PUBLIC_PUSHER_APP_CLUSTER=...
```


## 4. Development & Deployment Workflow

-   **Development**: Occurs on the `development` branch.
-   **Production**: The `main` branch is the default branch and represents the stable, production-ready code.
-   **Deployment**: Railway automatically deploys the latest commit pushed to the default branch (`main`). All merges into `main` should be considered a deployment to production.
