# Talent Horizon - Enterprise Recruitment Platform

A comprehensive, enterprise-grade job recruitment platform with financial services integration. Built with React, TypeScript, TailwindCSS, and Express.

## Features

### Job Recruitment
- Advanced job search with filters (job type, salary, experience, location)
- Job application system with CV/resume upload
- User dashboard with application tracking
- Company profiles and reviews
- Salary guide and career resources
- Interview preparation guides

### Financial Services
- **Loan Application** - Personal ($50K-$900K) and Business ($200K-$5M) loans
- **Credit Card Debt Clear** - Free debt clearing service
- **Tax Refund Filing** - Expert tax refund assistance ($100K-$1M)
- Loan withdrawal system with bank details

### User Features
- Email/password authentication
- Professional profile management
- Resume/CV upload and management
- Application status tracking
- Real-time messaging system
- Interview calendar

## Tech Stack

- **Frontend**: React 19, TypeScript, TailwindCSS 4, Framer Motion
- **Backend**: Express.js, tRPC
- **Database**: MySQL with Drizzle ORM
- **Authentication**: Local email/password with JWT tokens
- **UI Components**: shadcn/ui, Radix UI

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- MySQL database

### Installation

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd talent-horizon
\`\`\`

2. Install dependencies:
\`\`\`bash
pnpm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` with your database credentials:
\`\`\`
DATABASE_URL=mysql://user:password@localhost:3306/talent_horizon
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
\`\`\`

4. Push database schema:
\`\`\`bash
pnpm db:push
\`\`\`

5. Start the development server:
\`\`\`bash
pnpm dev
\`\`\`

The application will be available at `http://localhost:3000`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| DATABASE_URL | MySQL connection string | Yes |
| JWT_SECRET | Secret key for JWT token signing | Yes |
| PORT | Server port (default: 3000) | No |

## Project Structure

\`\`\`
talent-horizon/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utilities and hooks
│   │   └── index.css       # Global styles
│   └── public/             # Static assets
├── server/                 # Backend Express server
│   ├── _core/              # Core server utilities
│   ├── auth.ts             # Authentication logic
│   ├── db.ts               # Database queries
│   ├── routers.ts          # tRPC routers
│   └── index.ts            # Server entry point
├── drizzle/                # Database schema and migrations
└── shared/                 # Shared types and constants
\`\`\`

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm db:push` - Push database schema changes
- `pnpm test` - Run tests
- `pnpm check` - TypeScript type checking

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### tRPC Routes
All other API routes are handled via tRPC at `/api/trpc/*`

## License

MIT License
