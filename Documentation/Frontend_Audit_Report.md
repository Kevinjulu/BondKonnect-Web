# Frontend Audit & Optimization Report - BondKonnect

**Date:** February 9, 2026
**Status:** Deep Investigation Complete

## 1. Executive Summary
The BondKonnect frontend (`bondkonnect_web`) is a Next.js 15 application with a robust feature set but significant underlying technical debt. The most critical issue is a **total bypass of the authentication system** for development, which must be resolved before any production-grade testing. Architecturally, the project suffers from "Giant File" syndrome and fragmented data fetching patterns.

---

## 2. Technical Audit Findings

### 2.1 Security & Authentication (Critical)
*   **Auth Bypass:** `src/lib/actions/user.check.tsx` contains a hardcoded `if (true)` that returns a mock user, bypassing all security.
*   **Placebo Login:** The `AuthLogin.tsx` component's submit handler only executes `router.push('/')` without calling any backend API or managing tokens.
*   **Session Management:** There is no clear token refresh or session expiration logic visible in the current implementation.

### 2.2 API & Data Integration (High Severity)
*   **Bloated Actions:** `api.actions.tsx` is ~2,700 lines. This makes it extremely difficult to maintain and increases the risk of side effects.
*   **Fetch Fragmentation:** The project mixes `axios` (client-side) and `fetch` (server actions). Server actions do not benefit from global interceptors, leading to repeated header logic (e.g., `Ocp-Apim-Subscription-Key`).
*   **Manual Data Mapping:** Data transformation is handled locally in components (e.g., `parseFloat` on every field), which should be centralized in a data-access layer.

### 2.3 Performance Bottlenecks (Medium Severity)
*   **Redundant Renders:** Dashboard components (e.g., `SpotYieldChart`) trigger multiple `useEffect` hooks for related data, causing cascaded re-renders.
*   **Expensive Computations:** Complex array operations (Find/Map) on chart data occur on every render instead of being memoized with `useMemo`.
*   **Bundle Size:** Concurrent use of Material UI (MUI) and Radix UI increases the total JavaScript payload delivered to the client.

### 2.4 State Management
*   **Underused Redux:** Redux is configured but essentially empty. Most state is handled via local `useState` and manual prop-drilling from `layout.tsx`.
*   **Data Inconsistency:** The "User" object is redefined in multiple files with slightly different interfaces, leading to potential "undefined" errors.

---

## 3. Recommended Roadmap

### Phase 1: Security & Core Refactoring (Week 1-2)
1.  **Re-enable Authentication:** Connect the frontend to the actual Laravel Sanctum/Passport endpoints. Remove all mock bypasses.
2.  **Modularize API Actions:** Break `api.actions.tsx` into:
    *   `auth.actions.ts`
    *   `market.actions.ts`
    *   `portfolio.actions.ts`
    *   `communication.actions.ts`
3.  **Axios Standardization:** Use Axios for both client and server components to ensure consistent header and error handling.

### Phase 2: Data Layer & State Management (Week 3)
1.  **Redux Integration:** Move user profile and application settings into Redux.
2.  **SWR/React Query:** Implement a caching layer for market data to reduce API load and improve UI responsiveness.
3.  **Global Types:** Create a `src/types/api.d.ts` to define all backend response structures.

### Phase 3: UI/UX & Performance (Week 4)
1.  **UI Library Consolidation:** Favor Radix/Shadcn for new components to maintain a lightweight, modern feel.
2.  **Memoization Audit:** Apply `useMemo` to all chart-transformed data and `useCallback` to event handlers.
3.  **Error Handling:** Implement global Toast notifications and Error Boundaries for API failures.

---

## 4. Conclusion
The frontend is visually impressive and feature-rich but requires a "Infrastructure Hardening" phase to ensure it is secure, performant, and maintainable. Priority #1 must be the restoration of the Authentication flow.
