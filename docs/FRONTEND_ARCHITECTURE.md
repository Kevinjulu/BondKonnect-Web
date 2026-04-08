# Frontend Architecture & Design Patterns

This document describes the architectural decisions, state management strategy, and UI patterns used in the BondKonnect Next.js 15 frontend.

## 1. Tech Stack Core

*   **Framework:** Next.js 15 (App Router)
*   **Language:** TypeScript
*   **State Management:** TanStack Query v5 (Server State) & Redux Toolkit (Global UI State)
*   **Styling:** Tailwind CSS + Radix UI (Headless primitives) + Lucide Icons
*   **Communication:** Axios with interceptors for CSRF and Sanctum Auth.

## 2. Data Fetching & Server State

BondKonnect relies heavily on **TanStack Query** to manage the lifecycle of asynchronous data.

### Key Patterns:
*   **Hooks as Domain Logic:** Business logic is encapsulated in custom hooks (e.g., `useTrustIndicator.ts`, `use-portfolio-data.ts`).
*   **Stale-While-Revalidate:** Default `staleTime` is typically 1-5 minutes for market data to balance freshness and performance.
*   **Invalidation:** Mutations (e.g., creating a portfolio) automatically trigger `queryClient.invalidateQueries` to refresh related data.

### Example: Trust Indicator Hook
The `useTrustIndicator` hook fetches both metrics and raw ratings in parallel, providing a unified `isLoading` state and handling error boundaries.

## 3. Component Architecture

### Layouts
*   **Dashboard Layout:** Provides the sidebar, top navigation, and real-time notification listeners.
*   **Auth Layout:** Centered, focused interface for login/register flows.

### Design System (The "BondKonnect Look")
*   **Typography:** High-contrast, dense data grids for financial clarity.
*   **Color Palette:** Semantic colors for bond yields (Green for up, Red for down).
*   **Border Radius:** Unified `rounded-[32px]` for major containers to create a modern, "contained" feel.

## 4. Real-time Integration

The frontend integrates with Laravel Echo / Pusher via the `use-websocket.tsx` hook.
*   **Channels:**
    *   `bond-market`: Public channel for price updates.
    *   `private-user.{id}`: Private channel for notifications and transaction updates.
*   **Events:** Components subscribe to events to trigger local cache invalidation or toast notifications.

## 5. Middleware & Security

*   **`middleware.ts`:** Handles route protection, redirecting unauthenticated users from `/dashboard` to `/auth/login`.
*   **CSRF Protection:** The `generate-csrf-token` endpoint is called during initial boot/login to set the `X-XSRF-TOKEN` cookie required by Laravel Sanctum.
*   **Sanctum Auth:** Cookies are configured with `SameSite=None` and `Secure=true` for cross-origin compatibility on Railway.

## 6. Project Directory Map

*   `src/app/`: Next.js App Router pages and layouts.
*   `src/components/`: Reusable UI components (Radix/Tailwind).
*   `src/hooks/`: Custom React hooks for data and logic.
*   `src/lib/`: Axios instances, API action wrappers, and utility functions.
*   `src/store/`: Redux slices for global UI state (e.g., sidebar collapse, theme).

---
*Last Updated: April 2026*
