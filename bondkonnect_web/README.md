# BondKonnect Web

This is the frontend application for BondKonnect, built with Next.js. It provides a modern, responsive interface for bond trading and portfolio management.

## Project Structure

```
bondkonnect_web/
├── src/                    # Source code
├── public/                 # Static files
├── .next/                  # Next.js build output
├── node_modules/           # NPM dependencies
├── .codegpt/              # CodeGPT configuration
├── .eslintrc.json         # ESLint configuration
├── components.json        # Component configuration
├── next.config.ts         # Next.js configuration
├── next-env.d.ts          # Next.js TypeScript declarations
├── package.json           # NPM configuration
├── package-lock.json      # NPM lock file
├── postcss.config.mjs     # PostCSS configuration
├── tailwind.config.ts     # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```

## Features

### Trading Interface
- Order book visualization
- Trade execution
- Position management
- Trade history

### Portfolio Management
- Portfolio overview
- P&L tracking
- Performance analytics
- Risk metrics

### Market Data
- Real-time pricing
- Historical charts
- Market depth
- Yield curves

### User Experience
- Responsive design
- Dark/Light mode
- Internationalization
- Accessibility

## Getting Started

### Prerequisites

- Node.js 18.17 or higher
- npm or yarn
- Modern web browser

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/bondkonnect.git
cd bondkonnect/bondkonnect_web
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Configure environment variables in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

### Development

1. Start the development server:
```bash
npm run dev
# or
yarn dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

## Building for Production

1. Build the application:
```bash
npm run build
# or
yarn build
```

2. Start the production server:
```bash
npm start
# or
yarn start
```

## Styling

The project uses Tailwind CSS for styling. Custom styles can be added in the `src/styles` directory.

```bash
# Build CSS
npm run build:css
# or
yarn build:css
```

## Testing

```bash
# Run tests
npm test
# or
yarn test

# Run tests with coverage
npm run test:coverage
# or
yarn test:coverage
```

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy

### Other Platforms
- Netlify
- AWS Amplify
- Docker

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.
