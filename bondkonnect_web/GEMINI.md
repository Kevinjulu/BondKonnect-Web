# GEMINI.md - Project Context: BondKonnect

## Project Overview
**BondKonnect** is a comprehensive bond trading and portfolio analytics platform. It provides real-time market insights, bond performance indicators, and financial management tools for various user roles in the bond market.

### Core Technologies
- **Framework:** Next.js 15 (App Router) with TypeScript.
- **Frontend:** React 18, Tailwind CSS, Radix UI (Shadcn/ui), and Material UI.
- **State Management:** Redux Toolkit (global state) and TanStack Query (server state).
- **Analytics:** Recharts for market data visualization.
- **Real-time:** Pusher/WebSockets for live notifications and messaging.
- **Testing:** Vitest for unit/integration testing and Playwright for E2E flows.

### Architecture
- `src/app`: Application routes and page components.
- `src/app/(dashboard)`: Protected dashboard routes and layout.
- `src/app/config/permissions.ts`: Centralized RBAC logic and module/action permissions.
- `src/components`: Shared UI components and layout elements.
- `src/hooks`: Custom hooks for authentication, data fetching, and real-time updates.
- `src/lib/actions`: Server-side actions for API interactions and authentication.
- `src/store`: Redux store configuration and slices.
- `src/utils`: Theme configuration, axios instances, and utility functions.

## UI & Design Decisions
BondKonnect employs a sophisticated UI architecture designed for clarity, data density, and high-performance financial analytics.

### Design Principles
- **Clarity & Contrast:** High-contrast typography (using `font-black` and `tracking-tighter`) ensures financial data is legible at a glance.
- **Modern Aesthetic:** Extensive use of rounded corners (`rounded-[32px]`, `rounded-xl`) and subtle neutral borders (`border-neutral-100`) creates a contemporary, professional look.
- **Responsive Analytics:** Dashboards use a flexible grid system (Tailwind) to adapt from dense desktop trading views to mobile-optimized calculators.
- **Motion & Feedback:** Integrated page transitions and skeleton loaders (via `ContentLoader`) provide smooth navigation and immediate user feedback.

### Styling Engines
The project utilizes a dual-engine approach for maximum flexibility:
1. **Tailwind CSS:** Used for layout, modern UI elements, and rapid utility-based styling.
2. **Material UI (MUI):** Integrated for complex data components and thematic consistency across legacy views.

### Color Palette (Theming)
The application supports multiple thematic presets (Blue, Green, Purple, etc.) and full Light/Dark mode transitions.

**Core Palettes (Light Mode):**
- **Primary:** High-contrast Dark/Blue tones (`#006DAF` / `#1e4db7`) for brand presence.
- **Secondary:** Accent tones (`#44d0ef`, `#fb9678`) for call-to-actions and status indicators.
- **Backgrounds:** Clean neutrals (`#ffffff`, `#fafbfb`) with subtle grey backgrounds for content separation.

**System Variables (Tailwind/CSS):**
- **Primary:** `hsl(var(--primary))` mapped to high-contrast dark-on-light or light-on-dark.
- **Success/Error:** Semantically mapped to standard financial indicators (Green for yield up, Red for risk alerts).
- **Sidebar:** Specifically themed with a distinct background (`--sidebar-background`) to anchor the navigation experience.

## Building and Running
The project follows standard npm scripts for development and production:

- **Development:** `npm run dev` (Starts the server on port 4000)
- **Production Build:** `npm run build`
- **Start Production:** `npm run start`
- **Linting:** `npm run lint` or `npm run lint:fix`
- **Unit Testing:** `npm run test` (Vitest)
- **E2E Testing:** `npx playwright test`

## Development Conventions
1.  **Routing:** All protected routes are under the `(dashboard)` group and guarded by `middleware.ts`.
2.  **Permissions:** Use the `hasRequiredPermissions` utility from `@/app/config/permissions` to control component visibility and access.
3.  **Data Fetching:** Prefer TanStack Query hooks (found in `@/hooks`) for server state to benefit from caching and auto-refreshing.
4.  **Styling:** Use Tailwind CSS for component styling, adhering to the design system defined in `@/utils/theme`.
5.  **Authentication:** Managed via `useAuth` hook and `k-o-t` session cookie.
6.  **Navigation:** Use Next.js `<Link>` components for all internal transitions to maintain SPA-like performance.

## Key Documentation
- `ROUTING.md`: Detailed breakdown of route categories and redirection logic.
- `documentation/UPGRADES_2026_02_14.md`: Overview of the 2026 security and testing infrastructure upgrades.
