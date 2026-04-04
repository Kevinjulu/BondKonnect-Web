# GEMINI.md - Frontend Context: BondKonnect Web

## Project Overview
**BondKonnect Web** is the Next.js 15 frontend for the bond trading platform, providing high-density financial analytics and a modern trading interface.

## Core Technologies
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS (Modern UI) & Material UI (Data Components).
- **State:** Redux Toolkit (Global) & TanStack Query (Server State).
- **Communication:** Axios (API) & Laravel Echo (WebSockets).
- **Deployment:** Docker Standalone (Node 22-alpine).

## Architecture & Infrastructure

### 1. Production Deployment (Railway)
- **Dockerization:** Multi-stage build using `output: 'standalone'`.
- **Port Binding:** Uses shell-form `CMD ["sh", "-c", "PORT=${PORT:-3000} HOSTNAME=0.0.0.0 node server.js"]` to correctly handle Railway's dynamic `$PORT`.
- **Networking:**
  - `NEXT_PUBLIC_API_URL`: Public HTTPS URL for client-side fetching.
  - `INTERNAL_API_URL`: Private mesh URL (`http://backend.railway.internal`) for SSR/Server Components.

### 2. State & Data Flow
- **Authentication:** Managed via `useAuth` hook and Sanctum-compatible cookies.
- **API Interceptors:** Automatically handle CSRF tokens and unauthorized redirects.
- **Normalization:** `url-resolver.ts` ensures consistent `/api` prefix and port stripping for service-to-service calls.

## Building and Running
- **Development:** `npm run dev` (Port 4000)
- **Build:** `npm run build` (Generates `.next/standalone`)
- **Start:** `npm run start` (Production server)
- **Linting:** `npm run lint`

## Design Principles
- **Clarity:** High-contrast typography and dense data grids.
- **Consistency:** Unified rounding (`rounded-[32px]`) and semantic color mapping for yields/risk.
- **Performance:** Skeleton loaders and optimized image handling.

---
*Last Updated: April 2026*
