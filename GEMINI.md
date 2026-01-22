# BondKonnect Web - Project Context

## Project Overview
BondKonnect Web is the frontend application for the BondKonnect platform, a bond trading and portfolio management system. It is built using **Next.js 15** (App Router) and **TypeScript**, providing a modern, responsive interface for traders and administrators.

The application interacts with a **Laravel backend** via REST API endpoints and uses **Pusher** for real-time updates (WebSockets).

## Tech Stack

-   **Framework:** Next.js 15.3.5 (App Router)
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS, Radix UI (Shadcn/ui), Class Variance Authority (CVA)
-   **State Management:** Redux Toolkit (`@reduxjs/toolkit`)
-   **Authentication:** NextAuth.js (v5 beta)
-   **Form Handling:** React Hook Form + Zod validation
-   **Data/API:** Server Actions (`src/lib/actions`), Axios (legacy/utils), Pusher (Real-time)
-   **Testing:** Vitest, React Testing Library
-   **Visualization:** Recharts

## Project Structure

```
src/
├── app/                    # App Router pages and layouts
│   ├── (dashboard)/        # Main dashboard routes (trading, portfolio, etc.)
│   ├── admin/              # Admin panel routes
│   ├── auth/               # Authentication routes (login, register)
│   ├── api/                # API routes (if any)
│   ├── globals.css         # Global styles (Tailwind directives)
│   └── layout.tsx          # Root layout with Redux & Theme providers
├── components/             # React components
│   ├── ui/                 # Reusable UI components (Shadcn/ui)
│   ├── payment/            # Payment-specific forms (M-Pesa, PayPal)
│   └── providers/          # Context providers (WebSocket, etc.)
├── lib/                    # Utilities and business logic
│   ├── actions/            # Server Actions (API integrations)
│   ├── utils/              # Helper functions (API cache, Auth utils)
│   └── websocket.ts        # WebSocket client configuration
├── store/                  # Redux store configuration
│   ├── apps/               # Slices for specific apps (auth, payment)
│   └── store.ts            # Store setup
└── test/                   # Test configuration and files
```

## Design System & UI Standards

**Strict Adherence Required:** All UI enhancements and new pages must follow this **Light Monochrome** aesthetic.

### 1. Color Palette (Monochrome)
-   **Backgrounds:**
    -   **Page Container:** `bg-white` (Avoid `bg-gray-50` or `bg-slate-50` for main backgrounds unless creating specific separation).
    -   **Cards/Surfaces:** `bg-white` with `border-neutral-200`.
    -   **Headers/Sections:** `bg-neutral-50` or `bg-neutral-100` for contrast against white.
-   **Typography:**
    -   **Primary Text:** `text-black` (Headings, heavy font weights, primary actions).
    -   **Secondary Text:** `text-neutral-500` or `text-muted-foreground` (Subtitles, metadata, icons).
    -   **Inverse Text:** `text-white` (Only on Black backgrounds, e.g., Primary Buttons, Active Badges).
-   **Borders:** `border-neutral-200` (Light, subtle separation).

### 2. Component Styling
-   **Buttons:**
    -   **Primary:** **Solid Black** (`bg-black text-white hover:bg-neutral-800`).
    -   **Secondary/Outline:** **White** (`bg-white text-black border border-neutral-200 hover:bg-neutral-100`).
    -   **Ghost/Icon:** Transparent (`text-black hover:bg-neutral-100`).
-   **Badges:**
    -   **Active/Positive:** **Solid Black** (`bg-black text-white`).
    -   **Inactive/Neutral:** **Outline** (`bg-transparent text-black border border-neutral-300`).
    -   **Tags/Roles:** **Light Gray** (`bg-neutral-100 text-black`).
-   **Cards:**
    -   Flat or low elevation (`shadow-sm`).
    -   Bordered (`border border-neutral-200`).
    -   Rounded corners (`rounded-xl`).
-   **Tables:**
    -   **Header:** `bg-neutral-50` with `text-neutral-600` headings.
    -   **Rows:** `bg-white` with `hover:bg-neutral-50`.
    -   **Borders:** `border-neutral-200`.
-   **Inputs:**
    -   Background: `bg-neutral-50` or `bg-white`.
    -   Border: `border-neutral-200`.
    -   Focus: Ring Black (`ring-black`).

### 3. Layout Principles
-   **Spacing:** Generous padding (`p-6`, `p-8`) to allow the monochrome design to breathe.
-   **Contrast:** Rely on font weight (bold vs normal) and grayscale values (black vs neutral-500) for hierarchy, not color.
-   **Icons:** Use Lucide React icons. Style them as `text-black` (primary) or `text-neutral-400` (decorative).

## Building and Running

### Development
```bash
npm run dev
# Runs on port 4000 (configured in package.json)
```

### Building
```bash
npm run build
```

### Testing
```bash
npm test
# Runs Vitest
```

## Key Features & Integrations

### Payment Integration
**File:** `src/lib/actions/payment.actions.tsx`
The application supports **M-Pesa** and **PayPal** payments.
-   **M-Pesa:** Uses STK Push (`/V1/payments/mpesa/stk-push`) and status checks.
-   **PayPal:** Uses Create Order (`/V1/payments/paypal/create-order`) and Capture Order.
-   **Backend:** All payment logic delegates to the Laravel backend.

### Authentication
Uses **NextAuth.js** (v5) with JWT strategy. Auth forms are located in `src/app/auth/`.

### Real-time Data
Uses **Pusher** (via `laravel-echo` and `pusher-js`) for real-time market updates and notifications.

## Conventions

-   **Components:** Prefer **Shadcn/ui** (`src/components/ui`) for new UI elements.
-   **API Calls:** Use **Server Actions** (`src/lib/actions`) for backend communication where possible to ensure type safety and separation of concerns.
-   **State:** Use **Redux** for global application state (user session, payment status) and local React state for UI interactions.
-   **Styling:** Use **Tailwind CSS** utility classes. Avoid inline styles.