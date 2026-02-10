# BondKonnect Frontend

This repository contains the **frontend part** of the BondKonnect project. It is a modern, responsive interface for bond trading and portfolio management, built with Next.js and styled with Tailwind CSS and Material UI.

## Deployment

The application is hosted on **Vercel** and can be accessed at: [https://bondkonnect-web.vercel.app/](https://bondkonnect-web.vercel.app/) (or your specific Vercel URL).

## Architecture

BondKonnect follows a decoupled architecture:
- **Frontend (This Repo):** Next.js application deployed on Vercel.
- **Backend:** Hosted in a separate repository, providing the RESTful API and WebSocket services.

## Getting Started

### Prerequisites

- Node.js 18.17 or higher
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Kevinjulu/BondKonnect-Web.git
cd BondKonnect-Web
```

2. Install dependencies:
```bash
npm install
```

3. Environment Setup:
   The project uses a `.env` file for configuration. Ensure the `NEXT_PUBLIC_BK_*_API_URL` variables point to the correct backend environment.

### Development

Start the development server:
```bash
npm run dev
```

## Role-Based Access Control (RBAC)

BondKonnect implements a robust RBAC system with 6 logical roles:

1.  **Individual**: Standard personal investor workstation.
2.  **Agent**: Represents and manages other investors.
3.  **Broker**: Certified broker with advanced trading and client management tools.
4.  **Authorized Dealer**: Institutional dealer with direct market access.
5.  **Corporate**: Company or institutional legal entity.
6.  **Admin**: System administrator with full access to user management, security logs, and system configuration.

### Routing & Redirection Flow

The application uses a secure multi-step authentication and role-selection flow:

1.  **Authentication**: Users log in via `/auth/login` (User) or `/admin/login` (Admin).
2.  **Verification**: After successful credentials, users are redirected to `/auth/otp` or `/admin/otp` for secondary verification.
3.  **Role Selection**: Upon OTP verification, users must select an active role at `/auth/role` or `/admin/role`. This selection is persisted via a `userRole` secure cookie.
4.  **Authorized Access**: The `middleware.ts` ensures that:
    *   Unauthenticated users are redirected to login.
    *   Authenticated users without a selected role are forced to the role selection page.
    *   Authenticated users are prevented from accessing public login/signup pages.
    *   Access to specific modules is governed by permissions tied to the selected role.

### Dashboard Modules

Access to the following modules is dynamically controlled based on the active role's permissions:
- **Market Dashboard**: Real-time yield curves and screens.
- **Bond Stats**: Advanced bond market indicators.
- **Portfolio Assistant**: Real-time valuation and P&L tracking.
- **Quote Book**: Secondary market buy/sell quote management.
- **My Transactions**: Execution and trade history.
- **Admin Tools**: User management and security audit logs.

## Deployment to Vercel

This repository is optimized for Vercel deployment:
1. Connect this GitHub repo to your Vercel account.
2. Vercel will automatically detect the Next.js framework.
3. Configure the environment variables from your `.env` file in the Vercel Dashboard.
4. The application will automatically deploy on every push to the `master` or `development` branches.

## License

This project is licensed under the MIT License.