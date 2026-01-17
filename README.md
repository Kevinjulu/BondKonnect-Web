# BondKonnect

BondKonnect is a comprehensive bond trading and portfolio management platform designed to provide financial professionals and individual investors with real-time market data, advanced analytical tools, and seamless trading capabilities. The system facilitates efficient portfolio oversight, trade execution, and automated financial reporting.

## Recent Updates & Stability Fixes

The system has recently undergone a major stability and documentation overhaul:
*   **Repository Consolidation:** Successfully merged latest remote core updates with local custom payment integrations.
*   **Enhanced Security:** Implemented real-time session management allowing users to monitor and revoke active browser/device sessions.
*   **Architecture Standardization:** Unified the frontend codebase with consistent path aliases (`@/*`) across 180+ files for better maintainability.
*   **Integrated Testing Suite:** Established a robust unit testing foundation using Vitest and React Testing Library with 100% initial pass rate.

## System Architecture

The application is built on a modern, decoupled full-stack architecture ensuring scalability, performance, and security.

### Backend Application (bondkonnect_api)
*   **Framework:** Laravel 11
*   **Language:** PHP 8.2+
*   **Database:** PostgreSQL / MySQL
*   **Authentication:** Custom Secure Token System with Multi-Session Support
*   **Real-time Services:** Pusher & Redis

### Frontend Application (bondkonnect_web)
*   **Framework:** Next.js 15
*   **Language:** TypeScript
*   **State Management:** Redux Toolkit
*   **Testing:** Vitest & React Testing Library
*   **Styling:** Tailwind CSS & Shadcn UI

## Core Features

### Market Data & Trading
*   **Real-time Market Data:** Live updates on bond yields, prices, and market movements using WebSocket connections.
*   **Quote Management:** Create, view, and manage buy/sell quotes with real-time status tracking.
*   **Transaction Processing:** Secure handling of trade execution from initiation to settlement.

### Portfolio Management
*   **Portfolio Analysis:** Comprehensive tools for tracking portfolio performance, including realized and unrealized P&L.
*   **Bond Calculator:** Built-in financial calculators for yield-to-maturity (YTM), duration, and convexity.
*   **Visual Analytics:** Interactive charts and graphs for yield curves and historical performance.

### Financial Services
*   **Payment Integration:** Fully integrated payment gateways supporting M-Pesa (STK Push, C2B) and PayPal.
*   **Subscription Management:** Automated billing cycles, plan upgrades, and feature access control based on tiers.

### User Management & Security
*   **Active Session Control:** Users can view active login locations and devices, with the ability to revoke specific sessions.
*   **Role-Based Access Control (RBAC):** Granular permission settings for Admins, Traders, and Viewers.
*   **Activity Logging:** Detailed audit trails for all critical system actions.

## Installation and Setup

### Prerequisites
*   PHP 8.2+ & Composer
*   Node.js (v18+) & npm
*   PostgreSQL or MySQL
*   Redis

### Backend Configuration
1.  Navigate to `bondkonnect_api`.
2.  Run `composer install`.
3.  Configure `.env` with database and third-party keys (M-Pesa, PayPal, Pusher).
4.  Run `php artisan key:generate`.
5.  Run `php artisan migrate --seed`.
6.  Start server: `php artisan serve`.

### Frontend Configuration
1.  Navigate to `bondkonnect_web`.
2.  Run `npm install`.
3.  Configure `.env.local` with `NEXT_PUBLIC_API_URL`.
4.  Start development server: `npm run dev`.

## Testing

The project maintains high code quality through automated testing.

*   **Backend:** Execute PHPUnit tests via `php artisan test`.
*   **Frontend:** Execute Vitest suite via `npm test`.

## License

Proprietary software. Unauthorized copying, distribution, or use is strictly prohibited.
