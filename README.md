# BondKonnect Frontend: Next-Gen Trading Interface

This directory contains the **Next.js 15** frontend for BondKonnect. Built for the modern Kenyan investor, the application provides a high-density, real-time interface for bond trading and portfolio management.

## 🎨 UX Philosophy: Data-Driven Performance
BondKonnect Web is designed with **financial clarity** and **actionability** at its core. Recognizing the unique needs of the Kenyan market—where mobile connectivity meets complex institutional requirements—our UX focuses on:
- **High Information Density:** Dashboards that display critical market data (Yield Curves, Quote Books) without overwhelming the user.
- **Visual Analytics:** Interactive charts (using Recharts) for bond performance and real-time yield curves.
- **Mobile-Responsive Finance:** A seamless transition from a desktop trading desk to a mobile-optimized bond calculator.
- **Fast Feedback:** Integrated page transitions and skeleton loaders (via `ContentLoader`) for a "live" feel even on slower network connections.

---

## 🌍 Infrastructure & Production Stack

BondKonnect is built on a resilient, high-performance cloud architecture:

- **Frontend:** [Vercel](https://vercel.com/) (Next.js 15) for high-availability and edge-optimized delivery.
- **Backend:** [Render](https://render.com/) (Laravel API) for a scalable and reliable server-side experience.
- **Database:** [Neon PostgreSQL](https://neon.tech/) for serverless, autoscaling relational data management.
- **Cache & Queue:** [Upstash Redis](https://upstash.com/) for serverless, low-latency caching and background job processing.
- **Real-time:** [Pusher](https://pusher.com/) for instant WebSockets-based notifications and live market updates.
- **Payments:** Seamless integration with [M-Pesa](https://www.safaricom.co.ke/personal/m-pesa) and [PayPal](https://www.paypal.com/).
- **AI Layer:** **AiService** utilizing [Google Gemini](https://deepmind.google/technologies/gemini/) and `pgvector` for semantic search and contextual financial analysis.

---

## 🛠 Frontend Technical Stack

The frontend is a decoupled SPA (Single Page Application) built with:
- **Framework:** [Next.js 15](https://nextjs.org/) (App Router) for SEO, performance, and modern routing.
- **Language:** TypeScript for enterprise-grade type safety in financial logic.
- **Styling:**
    - **Tailwind CSS:** For rapid, utility-first layout and responsive design.
    - **Shadcn UI (Radix UI):** For accessible, consistent core components.
    - **Material UI (MUI):** For complex data components and thematic consistency in legacy views.
- **State Management:**
    - **Redux Toolkit:** Managing global application state (UI themes, session info).
    - **TanStack Query (React Query):** Synchronizing server state, providing caching and auto-refetching for market data.

---

## 🔐 Advanced Role-Based Access Control (RBAC)

BondKonnect implements a sophisticated, multi-tier RBAC system to cater to the diverse players in the Kenyan bond market:

| Role | Target User | Capabilities |
| :--- | :--- | :--- |
| **Individual** | Retail Investor | Portfolio tracking, bond calculator, secondary market buying. |
| **Agent** | Financial Advisor | Manage client portfolios, view aggregated stats. |
| **Broker** | Certified Broker | Execute trades on behalf of clients, manage order books. |
| **Dealer** | Institutional Dealer | Market making, direct CBK data access. |
| **Corporate** | Institutional Entity | High-volume portfolio management and corporate reporting. |
| **Admin** | System Operator | User management, security audits, and system configuration. |

### Security & Redirection Flow:
1.  **Authentication:** Secure login with 2FA/OTP (via Laravel backend).
2.  **Role Selection:** Authenticated users select their active role (`/auth/role`), persisted via a secure `userRole` cookie.
3.  **Middleware Guard:** `middleware.ts` enforces role-specific permissions, ensuring users only see modules they are authorized to access.

---

## 🤖 AI Concierge & Market Assistant
BondKonnect Web includes an integrated AI Assistant designed to help you navigate the platform and understand complex bond data.

- **Site-Aware:** Understands every feature of BondKonnect, from M-Pesa deposits to IFB bond rules.
- **Terminal Aesthetic:** Matches our high-performance design system with a monochrome, professional interface.
- **Actionable:** Provides direct internal links to dashboards, calculators, and billing sections.
- **Interactive:** Features "Quick Suggestions" for common workflows like "How do I pay?" or "Where is my portfolio?".

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.17+
- npm

### 2. Installation
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file based on `.env.example`:
```bash
NEXT_PUBLIC_API_URL=http://your-backend-url/api
NEXT_PUBLIC_PUSHER_KEY=your-pusher-key
NEXT_PUBLIC_PUSHER_CLUSTER=mt1
```

### 4. Development
```bash
npm run dev
```

---

## 🧪 Testing & Quality Assurance

We maintain 100% confidence in our financial calculations through rigorous testing:
- **Unit & Integration:** [Vitest](https://vitest.dev/) and React Testing Library for component and logic validation.
- **E2E:** [Playwright](https://playwright.dev/) for critical flows like trading and payments.
- **Linting:** ESLint with strict financial data formatting rules.

```bash
# Run unit tests
npm run test

# Run E2E tests
npx playwright test
```

## 📄 License
Proprietary software. Part of the BondKonnect Ecosystem.
