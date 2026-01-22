# BondKonnect - Project Context

## Project Overview
BondKonnect is a comprehensive bond trading and portfolio management platform. It operates as a full-stack application with a decoupled architecture, consisting of a **Laravel** backend API and a **Next.js** frontend.

The system is designed for financial professionals to view real-time market data, execute trades, manage portfolios, and process payments.

## System Architecture

The project is structured as a monorepo containing two distinct applications:

*   **`bondkonnect_api/`**: The Backend REST API (Laravel 11).
*   **`bondkonnect_web/`**: The Frontend Web Application (Next.js 15).

## Backend: `bondkonnect_api`

### Tech Stack
*   **Framework:** Laravel 11 (PHP 8.2+)
*   **Database:** PostgreSQL / MySQL
*   **Real-time:** Pusher & Redis
*   **Authentication:** Laravel Sanctum / Custom JWT strategy
*   **Payment Gateways:** M-Pesa (STK Push), PayPal

### Key Directories
*   `routes/api.php`: API endpoint definitions.
*   `app/Http/Controllers/`: Request handling logic.
*   `app/Services/`: Business logic, specifically `MpesaService.php` and `PaypalService.php`.
*   `app/Models/`: Eloquent ORM models (`User`, `Payment`, etc.).

### Development Commands
Run these commands from the `bondkonnect_api` directory:

```bash
# Install dependencies
composer install

# Run migrations and seed database
php artisan migrate --seed

# Start the development server
php artisan serve
# Default port: 8000

# Run tests
php artisan test
```

## Frontend: `bondkonnect_web`

### Tech Stack
*   **Framework:** Next.js 15.3.5 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS, Radix UI (Shadcn/ui)
*   **State Management:** Redux Toolkit (`@reduxjs/toolkit`)
*   **Authentication:** NextAuth.js (v5 beta)
*   **Testing:** Vitest, React Testing Library

### Key Directories
*   `src/app/`: App Router pages and layouts.
    *   `(dashboard)/`: Protected routes for trading and portfolio.
    *   `admin/`: Administrative interfaces.
    *   `auth/`: Login and registration.
*   `src/lib/actions/`: Server Actions for backend API integration.
*   `src/components/ui/`: Reusable Shadcn UI components.
*   `src/store/`: Redux store configuration.

### Route Map
*   **Dashboard Root:** `/`, `/payments`
*   **Dashboard Apps (`/apps/*`):** `account`, `activity-logs`, `analysis`, `billing`, `bond-stats`, `dms`, `emails`, `faq`, `financials`, `glossary`, `help`, `hub`, `invoices`, `manage-users`, `messages`, `notifications`, `permissions`, `portfolio-assistant`, `quote-book`, `research-assistant`, `sms`, `subscriptions`, `transactions`, `upload`
*   **Authentication:** `/auth/login`, `/auth/sign-up`, `/auth/forgot-password`, `/auth/otp`, `/auth/role`, `/auth/set-password`, `/auth/success`, `/auth/terms`, `/auth/intermediary`
*   **Admin:** `/admin/login`, `/admin/sign-up`, `/admin/forgot-password`, `/admin/otp`, `/admin/role`, `/admin/set-password`, `/admin/success`

## User Flow: Trading a Bond

The core functionality of BondKonnect revolves around the lifecycle of a bond deal:

1.  **Analysis & Evaluation:**
    *   Users evaluate market trends in the **Bond Stats** app.
    *   Users manage and analyze their current holdings in the **Portfolio Assistant**, calculating P&L and risk metrics.
2.  **Quote Initiation:**
    *   **From Portfolio:** Users can push a bond from their portfolio directly to the market via the "Send to Quote Book" action.
    *   **Direct Placement:** Users can "Place Quote" in the **Quote Book**, specifying whether it's a **Bid (Buy)** or **Offer (Sell)**, setting the target Yield, Amount, and Settlement Date.
3.  **Intermediary Action:**
    *   If the user is a **Broker, Agent, or Authorized Dealer**, the system prompts them to select a **Viewing Party (Client)** they are acting on behalf of.
4.  **Bidding & Negotiation:**
    *   Counterparties view all active market quotes in the "All Quotes" tab of the **Quote Book**.
    *   They can "Submit Bid" on a quote, which initiates a **Transaction**.
    *   Real-time price, consideration, commissions (NSE), and levies (CMA) are calculated during this step.
    *   Users can "Counter Bid" to negotiate yield and amount.
5.  **Execution & Acceptance:**
    *   The quote owner reviews incoming transactions in the "Edit My Quotes" section.
    *   The owner can **Accept** or **Reject** the transaction.
6.  **Finalization:**
    *   Accepted deals are tracked in the **My Transactions** app under "Sent" or "Received" tabs.
    *   The system logs audit trails and notifies relevant parties (Emails/Notifications).

### Development Commands
Run these commands from the `bondkonnect_web` directory:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Runs on Port 4000 (Note: Default Next.js port 3000 is changed)

# Run tests
npm test
```

## Development Workflow

To work on the full stack:

1.  **Database:** Ensure your local Database (PostgreSQL/MySQL) and Redis are running.
2.  **Backend:** Open a terminal in `bondkonnect_api` and run `php artisan serve`.
3.  **Frontend:** Open a separate terminal in `bondkonnect_web` and run `npm run dev`.
4.  **Access:** Open `http://localhost:4000` in your browser.

## Conventions

*   **UI Components:** Use **Shadcn/ui** components located in `src/components/ui`. Do not create custom implementations of common UI elements (buttons, inputs) if a Shadcn version exists.
*   **API Integration:** Prefer **Server Actions** (`src/lib/actions`) over direct `axios` calls in components for better security and type safety on the frontend.
*   **State Management:** Use **Redux** for global application state (user session, payment status) and local React state for transient UI interactions.
*   **Styling:** Use **Tailwind CSS** utility classes.
