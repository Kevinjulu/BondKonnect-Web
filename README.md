# BondKonnect

BondKonnect is a comprehensive bond trading and portfolio management platform that provides real-time market data, trading capabilities, and portfolio analytics.

## Project Structure

The project is organized into three main components:

- `bondkonnect_api/`: Backend API service
- `bondkonnect_web/`: Frontend web application
- `bondkonnect_db/`: Database management and migrations

## Features

- Real-time bond market data
- Portfolio management and analytics
- Trading capabilities
- P&L calculations (Realized and Unrealized)
- User authentication and authorization
- Market data visualization

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/bondkonnect.git
cd bondkonnect
```

2. Install dependencies for each component:
```bash
# Install API dependencies
cd bondkonnect_api
npm install

# Install Web dependencies
cd ../bondkonnect_web
npm install
```

3. Set up environment variables:
   - Create `.env` files in both `bondkonnect_api` and `bondkonnect_web` directories
   - Refer to `.env.example` files for required variables

4. Set up the database:
```bash
cd bondkonnect_db
# Follow database setup instructions
```

### Running the Application

1. Start the API server:
```bash
cd bondkonnect_api
npm run dev
```

2. Start the web application:
```bash
cd bondkonnect_web
npm run dev
```

3. Access the application at `http://localhost:3000`

## Development

### Code Style

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages

### Testing

```bash
# Run tests for API
cd bondkonnect_api
npm test

# Run tests for Web
cd bondkonnect_web
npm test
```

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

## Acknowledgments

- List any third-party libraries or resources used
- Thank contributors and maintainers 