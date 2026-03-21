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
    -   **URL:** `https://bondkonnect-backend-production.up.railway.app/api`
-   **Database Service**:
    -   **Type:** PostgreSQL
    -   **Notes:** Managed by Railway, providing automated backups and scaling.
-   **External Services**:
    -   **Pusher**: Used for real-time WebSocket communication (notifications, live data).

## 3. Environment Variables & Configuration

All environment variables for both services are managed directly within the **Railway Dashboard**. This is the single source of truth for all production and development configurations.

The `.env` file in the `bondkonnect-web` repository serves as a template and is used for local development, but the Railway-injected variables will always take precedence in a deployed environment.

### Critical Frontend Variables

These variables MUST be set in the Railway dashboard for the `bondkonnect-web` service to connect to the backend correctly.

```env
# The full URL to the backend API service
NEXT_PUBLIC_API_URL=https://bondkonnect-backend-production.up.railway.app/api

# The base URL of this frontend application
NEXT_PUBLIC_APP_URL=https://bondkonnect.up.railway.app

# The base URL for the backend service, used for WebSocket authentication
NEXT_PUBLIC_WEBSOCKET_URL=https://bondkonnect-backend-production.up.railway.app

# Pusher credentials
NEXT_PUBLIC_PUSHER_APP_KEY=...
NEXT_PUBLIC_PUSHER_APP_CLUSTER=...
```

## 4. Development & Deployment Workflow

-   **Development**: Occurs on the `development` branch.
-   **Production**: The `main` branch is the default branch and represents the stable, production-ready code.
-   **Deployment**: Railway automatically deploys the latest commit pushed to the default branch (`main`). All merges into `main` should be considered a deployment to production.
