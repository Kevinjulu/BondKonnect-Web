# BondKonnect

BondKonnect is an enterprise-grade bond trading and portfolio management platform designed to facilitate real-time fixed-income trading, portfolio analytics, and market data visualization. The system is built using a modern decoupled architecture, utilizing a Laravel-based RESTful API for the backend and a Next.js TypeScript application for the frontend interface.

## System Architecture

The project is divided into two primary distinct applications:

1.  **Backend API (`bondkonnect_api`)**: A Laravel 11 application that handles business logic, authentication, database interactions (MySQL), and real-time event broadcasting.
2.  **Frontend Client (`bondkonnect_web`)**: A Next.js 15 application providing a reactive user interface, utilizing Tailwind CSS for styling and Redux Toolkit for state management.

## Prerequisites

Before setting up the project, ensure your development environment meets the following requirements:

*   **PHP**: Version 8.2 or higher
*   **Composer**: Dependency manager for PHP
*   **Node.js**: Version 18.x or higher (LTS recommended)
*   **MySQL**: Version 8.0 or higher
*   **Redis**: For queue management and caching (optional for local dev, recommended for production)
*   **Git**: For version control

## Installation and Setup

Follow these steps to configure the development environment locally.

### 1. Clone the Repository

Clone the project repository to your local machine:

```bash
git clone <repository_url>
cd BondKonnect
```

### 2. Backend Setup (API)

Navigate to the API directory and install the necessary PHP dependencies.

```bash
cd bondkonnect_api
composer install
```

**Environment Configuration:**

Duplicate the example environment file and configure it:

```bash
cp .env.example .env
```

Open the `.env` file and update the database configuration section:

```ini
DB_CONNECTION=bk_api_db
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=bk_api_db
DB_USERNAME=your_username
DB_PASSWORD=your_password

# BK Legacy Database
BK_HOST=127.0.0.1
BK_PORT=3306
BK_DATABASE=bk_db
BK_USERNAME=your_username
BK_PASSWORD=your_password
```

**Application Initialization:**

Generate the application encryption key and run database migrations:

```bash
php artisan key:generate
php artisan migrate --seed
```

**Start the Server:**

Launch the local development server:

```bash
php artisan serve
```

The API will be accessible at `http://localhost:8000`.

### 3. Frontend Setup (Web)

Open a new terminal window, navigate to the web directory, and install Node.js dependencies.

```bash
cd bondkonnect_web
npm install
```

**Environment Configuration:**

Create a local environment file:

```bash
cp .env.example .env.local
```

Ensure the API URL is correctly pointed to your local backend server in `.env.local`:

```ini
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Start the Application:**

Launch the Next.js development server:

```bash
npm run dev
```

The application will be accessible at `http://localhost:4000` (or `http://localhost:3000` depending on your configuration).

## Documentation

Detailed project documentation is available in the `docs/` directory:

*   **[Technical Overview](docs/technical_overview.md)**: High-level system architecture and data flow.
*   **[Codebase Audit](docs/codebase_audit.md)**: Comprehensive security and architectural analysis.
*   **[Frontend Audit](docs/frontend_audit.md)**: Code quality, performance, and testing analysis.
*   **[Backend & DB Audit](docs/backend_db_audit.md)**: Refactoring plan and database consolidation strategy.
*   **[UI/UX Audit](docs/ui_ux_audit.md)**: Design system, responsiveness, and visual analysis.
*   **[Payment Audit](docs/payment_audit.md)**: Detailed analysis of M-Pesa and PayPal integrations.
*   **[Roadmap](docs/roadmap.md)**: Current development status and planned implementation tracks.
*   **Features Deep-Dive**:
    *   [Bond Calculator](docs/features/calculator.md)
    *   [Quote Book](docs/features/quote_book.md)
*   **Guides**:
    *   [Payment Integration](docs/guides/payments.md)
    *   [Frontend Testing](docs/guides/testing.md)

## Usage Examples

### accessing the Platform

1.  Open your web browser and navigate to the frontend URL (e.g., `http://localhost:4000`).
2.  Log in using your provided credentials.

### Quote Book Management

The Quote Book module allows dealers and brokers to view and manage market quotes.

*   **View Quotes**: Navigate to the "Quote Book" section to see real-time bids and offers sorted by yield.
*   **Place Quote**: Click the "Place Quote" button to submit a new buy or sell order. You must specify the bond issue, volume, and target yield.
*   **Edit Quote**: Users can modify their active quotes directly from the dashboard. Changes are validated against current market indicative ranges.

### Portfolio Analytics

The Portfolio Assistant provides deep insights into holdings:

*   **Valuation**: View real-time Mark-to-Market (MtM) valuations of bond holdings.
*   **Risk Metrics**: Monitor Duration, Convexity, and PV01 sensitivity metrics.

## Contribution Guidelines

We welcome contributions to the BondKonnect project. To ensure code quality and consistency, please adhere to the following guidelines.

### Code Standards

*   **Backend (PHP)**: Adhere to PSR-12 coding standards. Ensure all public methods have type hints and return types.
*   **Frontend (TypeScript)**: Follow the existing ESLint configuration. Use strong typing for all interfaces and props. Avoid using `any` type definition.

### Pull Request Process

1.  **Fork the Repository**: Create a personal fork of the project.
2.  **Create a Branch**: Create a feature branch with a descriptive name (e.g., `feature/bond-calculator-fix`).
3.  **Commit Changes**: Make granular, atomic commits with clear messages describing the "why" behind the change.
4.  **Testing**: Ensure all new features are accompanied by relevant unit or feature tests. Run the full test suite before pushing.
5.  **Submit PR**: Open a Pull Request against the `main` branch. Provide a detailed description of the changes and link any related issue tickets.

## License

This project is proprietary software. Unauthorized copying, modification, distribution, or use of this software is strictly prohibited without express written permission from the copyright holder.