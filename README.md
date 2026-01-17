# BondKonnect

BondKonnect is a comprehensive bond trading and portfolio management platform designed to provide financial professionals and individual investors with real-time market data, advanced analytical tools, and seamless trading capabilities. The system facilitates efficient portfolio oversight, trade execution, and automated financial reporting.

## System Architecture

The application is built on a modern, decoupled full-stack architecture ensuring scalability, performance, and security.

### Backend Application (bondkonnect_api)
*   **Framework:** Laravel 11
*   **Language:** PHP 8.2+
*   **Database:** PostgreSQL
*   **Authentication:** Laravel Sanctum
*   **Real-time Services:** Pusher & Redis
*   **Queue Management:** Laravel Horizon

### Frontend Application (bondkonnect_web)
*   **Framework:** Next.js 15
*   **Language:** TypeScript
*   **State Management:** Redux Toolkit
*   **Styling:** Tailwind CSS
*   **UI Components:** Shadcn UI

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
*   **Payment Integration:** Fully integrated payment gateways supporting M-Pesa (STK Push, C2B) and PayPal for subscription and service payments.
*   **Subscription Management:** Automated billing cycles, plan upgrades, and feature access control based on subscription tiers.

### User Management & Security
*   **Role-Based Access Control (RBAC):** Granular permission settings for Admins, Traders, and Viewers.
*   **Activity Logging:** Detailed audit trails for all critical system actions and user interactions.
*   **Secure Authentication:** Multi-factor capable authentication system with session management.

### Communication
*   **Messaging System:** Internal secure messaging platform for direct communication between traders and support.
*   **Notifications:** Real-time alerts for trade matches, subscription updates, and system announcements.

## Installation and Setup

### Prerequisites
Ensure the following are installed on your development environment:
*   PHP 8.2 or higher
*   Composer
*   Node.js (v18 or higher)
*   PostgreSQL
*   Redis

### Backend Configuration
1.  Navigate to the API directory:
    ```bash
    cd bondkonnect_api
    ```
2.  Install PHP dependencies:
    ```bash
    composer install
    ```
3.  Configure the environment:
    *   Copy `.env.example` to `.env`.
    *   Update database credentials and third-party API keys (M-Pesa, PayPal, Pusher).
4.  Generate the application key:
    ```bash
    php artisan key:generate
    ```
5.  Run database migrations and seeders:
    ```bash
    php artisan migrate --seed
    ```
6.  Start the development server:
    ```bash
    php artisan serve
    ```

### Frontend Configuration
1.  Navigate to the Web directory:
    ```bash
    cd bondkonnect_web
    ```
2.  Install JavaScript dependencies:
    ```bash
    npm install
    ```
3.  Configure the environment:
    *   Create a `.env.local` file.
    *   Set the `NEXT_PUBLIC_API_URL` to point to your backend server (default: `http://localhost:8000`).
4.  Start the development server:
    ```bash
    npm run dev
    ```

## Testing

The project maintains a rigorous testing standard.

*   **Backend Tests:** Run PHPUnit tests via `php artisan test`.
*   **Frontend Tests:** Run Vitest suites via `npm test`.

## Contribution

We welcome contributions to improve BondKonnect. Please ensure all pull requests follow the established coding standards and include relevant test coverage.

## License

This project is proprietary software. Unauthorized copying, distribution, or use is strictly prohibited.