# BondKonnect: Democratizing the Kenyan Bond Market

BondKonnect is a premier financial technology platform designed to transform how Kenyans interact with the bond market. By bridging the gap between complex institutional trading and individual investors, BondKonnect provides a sophisticated yet accessible ecosystem for bond trading, portfolio analytics, and real-time market insights.

## Our Mission
In the Kenyan financial landscape, bond trading has traditionally been perceived as a high-barrier, opaque sector. **BondKonnect's mission is to democratize access to fixed-income securities (IFB, FXD, and Infrastructure Bonds)**, empowering everyday Kenyan investors and financial professionals with the tools previously reserved for elite institutional desks.

## How BondKonnect Helps Kenyan Users
*   **Financial Inclusion:** Seamlessly invest in government and corporate bonds using locally preferred payment methods like **M-Pesa (STK Push & C2B)** alongside international options like PayPal.
*   **Real-time Transparency:** Access live Central Bank of Kenya (CBK) bond yield curves and secondary market prices, eliminating the "information asymmetry" that often handicaps retail investors.
*   **Professional Analytics:** Utilize institutional-grade bond calculators (YTM, Duration, Convexity) to make data-driven investment decisions tailored to the Kenyan tax environment.
*   **Portfolio Empowerment:** Track realized and unrealized P&L in real-time, allowing users to manage their wealth with the same precision as a Tier-1 bank treasurer.

---

## 🏗 System Architecture

BondKonnect is built on a high-performance, decoupled architecture designed for 99.9% uptime and low-latency data delivery.

### [Frontend: Next.js Powerhouse](./bondkonnect_web/README.md)
The `bondkonnect_web` directory contains our cutting-edge user interface.
- **Tech:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Redux Toolkit, TanStack Query.
- **Focus:** High data density, mobile-responsive trading dashboards, and interactive financial visualizations.
- [**Explore Frontend Documentation →**](./bondkonnect_web/README.md)

### [Backend: Laravel Core](./bondkonnect_api/README.md)
The `bondkonnect_api` directory houses our robust financial engine.
- **Tech:** Laravel 11, PHP 8.2, Railway PostgreSQL, Railway Redis, Pusher.
- **Focus:** Secure transaction processing, RBAC, M-Pesa/PayPal integrations, and real-time WebSocket broadcasting.
- [**Explore Backend Documentation →**](./bondkonnect_api/README.md)

---

## 🚀 Quick Start (Full Stack)

To get the entire ecosystem running locally:

### 1. Prerequisites
- PHP 8.2+ & Composer
- Node.js 18+ & npm
- PostgreSQL (or access to a Railway DB instance)

### 2. Backend Setup
```bash
cd bondkonnect_api
composer install
cp .env.example .env # Configure your DB and M-Pesa keys
php artisan key:generate
php artisan migrate --seed
php artisan serve --port=8000
```

### 3. Frontend Setup
```bash
cd bondkonnect_web
npm install
cp .env.example .env.local # Point NEXT_PUBLIC_API_URL to http://localhost:8000/api
npm run dev
```

## 🛡 Security & Stability
BondKonnect implements enterprise-grade security, including:
- **Multi-Session Management:** Monitor and revoke active login sessions from any device.
- **RBAC:** Granular permissions for Individuals, Agents, Brokers, and Dealers.
- **Audit Trails:** Comprehensive logging of all financial transactions and sensitive system changes.

## 📄 License
Proprietary software. © 2026 BondKonnect. All rights reserved.
