# BondKonnect Frontend: Next-Gen Trading Interface

This directory contains the **Next.js 15** frontend for BondKonnect, the user-facing interface for our high-performance bond trading and portfolio analytics platform.

## Infrastructure: Built on Railway

The entire BondKonnect platform, including this frontend and the corresponding Laravel backend, is deployed and managed on **[Railway](https://railway.app/)**. This unified infrastructure provides a scalable, resilient, and high-performance environment.

-   **Frontend Service**: `bondkonnect-web` (This Repository)
-   **Backend Service**: `bondkonnect-api`
-   **Database**: Managed PostgreSQL on Railway
-   **Real-time Messaging**: Pusher for live notifications

---

## 🚀 Getting Started (Development)

### 1. Prerequisites

-   Node.js 20.x or later
-   npm

### 2. Environment Configuration

This project uses a single `.env` file for managing environment variables. Before running the application, create a `.env` file in this directory and populate it with the correct values for your environment.

**Production Example (`.env`):**

```env
# BondKonnect Production Environment
NEXT_PUBLIC_APP_ENV=production

# Core API Connections
NEXT_PUBLIC_API_URL=https://bondkonnect-backend-production.up.railway.app/api
NEXT_PUBLIC_APP_URL=https://bondkonnect.up.railway.app
NEXT_PUBLIC_WEBSOCKET_URL=https://bondkonnect-backend-production.up.railway.app

# Real-time Messaging (Pusher)
NEXT_PUBLIC_PUSHER_APP_KEY=8b6fde671de8467f0bd2
NEXT_PUBLIC_PUSHER_APP_CLUSTER=eu
```

### 3. Installation & Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

The application will be available at `http://localhost:4000`.

---

## 🧪 Testing & Quality Assurance

We maintain 100% confidence in our financial calculations through rigorous testing:

- **Unit & Integration**: [Vitest](https://vitest.dev/) and React Testing Library for component and logic validation.
- **E2E**: [Playwright](https://playwright.dev/) for critical user flows.
- **Linting**: ESLint with strict formatting rules.

```bash
# Run unit tests
npm run test

# Check for linting errors
npm run lint

# Run E2E tests
npx playwright test
```

## 🌟 Core Features

-   **Real-time Market Data:** High-performance bond analytics and spot yield curves.
-   **Integrated Trading:** Seamless quote submission and transaction management.
-   **Payment Infrastructure:** Unified gateway for M-Pesa and PayPal with automated parameter normalization.
-   **Peer-to-Peer Ratings:** Comprehensive credibility system with weighted scoring and dispute resolution.
-   **Portfolio Management:** Advanced analytics, P&L tracking, and stress testing.

## 📄 License

Proprietary software. Part of the BondKonnect Ecosystem.
