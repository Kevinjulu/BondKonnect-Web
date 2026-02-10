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

## Features

### Trading Interface
- Order book visualization
- Trade execution
- Position management

### Portfolio Management
- Portfolio overview and P&L tracking
- Performance analytics and risk metrics using advanced bond math

### Market Data
- Real-time pricing via WebSockets (Pusher)
- Interactive charts and yield curves

## Deployment to Vercel

This repository is optimized for Vercel deployment:
1. Connect this GitHub repo to your Vercel account.
2. Vercel will automatically detect the Next.js framework.
3. Configure the environment variables from your `.env` file in the Vercel Dashboard.
4. The application will automatically deploy on every push to the `master` or `development` branches.

## License

This project is licensed under the MIT License.