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

### 🌍 Unified Infrastructure (Railway)
The entire ecosystem is now hosted on **Railway**, providing a seamless, auto-scaling environment for:
- **Web Frontend:** Next.js 15 (App Router).
- **API Backend:** Laravel 11.
- **Database:** Managed PostgreSQL (with `pgvector` for AI).
- **Cache/Queue:** Managed Redis.
- **SSL/Networking:** Automatic managed certificates and private networking between services.

---

### [Frontend: Next.js Powerhouse](./bondkonnect_web/README.md)
The `bondkonnect_web` directory contains our cutting-edge user interface.
- **Tech:** Next.js 15, TypeScript, Tailwind CSS, Redux Toolkit, TanStack Query.
- [**Explore Frontend Documentation →**](./bondkonnect_web/README.md)

### [Backend: Laravel Core](./bondkonnect_api/README.md)
The `bondkonnect_api` directory houses our robust financial engine.
- **Tech:** Laravel 11, PHP 8.2, PostgreSQL, Redis, Pusher.
- [**Explore Backend Documentation →**](./bondkonnect_api/README.md)

---

## 🚀 Quick Start (Full Stack)

To get the entire ecosystem running locally:

### 1. Prerequisites
- PHP 8.2+ & Composer
- Node.js 20+ & npm
- PostgreSQL & Redis (local or Railway-hosted)

### 2. Environment Setup
**CRITICAL:** Environment files (`.env`, `.env.local`) are excluded from Git for security.
1.  Copy `.env.example` in both `bondkonnect_api` and `bondkonnect_web`.
2.  Fill in your credentials (Pusher, M-Pesa, etc.).
3.  For production, these variables are managed directly in the **Railway Dashboard**.

### 3. Backend Setup
```bash
cd bondkonnect_api
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve --port=8000
```

### 4. Frontend Setup
```bash
cd bondkonnect_web
npm install
npm run dev
```

## 🛡 Security & Stability
BondKonnect implements enterprise-grade security, including:
- **Multi-Session Management:** Monitor and revoke active login sessions from any device.
- **RBAC:** Granular permissions for Individuals, Agents, Brokers, and Dealers.
- **Audit Trails:** Comprehensive logging of all financial transactions and sensitive system changes.

## 📄 License
Proprietary software. © 2026 BondKonnect. All rights reserved.
