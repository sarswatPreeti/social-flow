# Social Flow - Web3 Social Platform

A decentralized social media platform built with Next.js, Flow blockchain, and PostgreSQL backend.

## Features

- 🔗 **Flow Blockchain Integration** - Connect with Flow wallets and interact with smart contracts
- 📝 **Social Posts** - Create, view, and interact with posts
- 💬 **Comments System** - Add comments to posts
- ⬆️ **Voting System** - Upvote and downvote posts with Flow tokens
- 👤 **User Profiles** - View user profiles and posts
- 🔍 **Search Functionality** - Search through posts and users
- 📱 **Mobile Responsive** - Beautiful UI that works on all devices
- 🚀 **Real-time Updates** - Instant updates with persistent database storage

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Flow Client Library (FCL)** - Flow blockchain integration

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **PostgreSQL** - Relational database

### Blockchain
- **Flow Blockchain** - Smart contracts for voting and social interactions
- **Cadence** - Smart contract language

## Quick Start

### Prerequisites
- Node.js 18 or higher
- PostgreSQL 15 or higher

### 1. Clone the Repository
```bash
git clone <repository-url>
cd social-flow
```

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

### 3. Backend Setup

```bash
# Setup backend
npm run backend:setup

# Start backend development server
npm run backend:dev
```

### 4. Database Setup
If not using Docker, set up PostgreSQL manually:
```bash
# Create database
createdb social_flow_db

# Run schema
psql -d social_flow_db -f backend/database/schema.sql
```

### 5. Environment Configuration
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Project Structure

```
social-flow/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (proxies to backend)
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── backend/               # Express.js backend
│   ├── config/            # Database configuration
│   ├── database/          # Database schema
│   ├── middleware/        # Express middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── server.js          # Main server file
│   └── docker-compose.yml # Docker setup
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── feed/             # Feed-related components
│   └── wallet/           # Wallet integration
├── contracts/            # Flow smart contracts
│   ├── cadence/          # Cadence contracts
│   ├── scripts/          # Flow scripts
│   └── transactions/     # Flow transactions
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── flow/            # Flow blockchain integration
│   └── api-client.ts    # Backend API client
└── types/               # TypeScript type definitions
```

## API Endpoints

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get specific post
- `POST /api/posts` - Create new post
- `POST /api/posts/:id/vote` - Vote on post
- `GET /api/posts/user/:address` - Get user posts

### Comments
- `GET /api/posts/:id/comments` - Get post comments
- `POST /api/posts/:id/comments` - Add comment

## Smart Contracts

The project includes Flow smart contracts for:
- Post creation and management
- Voting with Flow tokens
- User reputation system

### Contract Addresses
- **SocialContract**: `0x...` (deploy to your Flow network)

## Development

### Available Scripts
```bash
# Frontend
npm run dev              # Start Next.js dev server
npm run build            # Build for production
npm run start            # Start production server

# Backend
npm run backend:setup    # Setup backend dependencies
npm run backend:dev      # Start backend dev server
npm run backend:start    # Start backend production server

# Docker
npm run docker:up        # Start services with Docker
npm run docker:down      # Stop Docker services
```

### Database Management
```bash
# Connect to database
psql -d social_flow_db

# Run migrations
psql -d social_flow_db -f backend/database/schema.sql
```

## Deployment

### Frontend (Vercel)
1. Connect your repository to Vercel
2. Set environment variables
3. Deploy automatically on push

### Backend (Railway/Render/Heroku)
1. Connect your repository
2. Set environment variables:
   - `DATABASE_URL`
   - `NODE_ENV=production`
   - `PORT`
3. Deploy

### Database (Supabase/AWS RDS)
1. Create PostgreSQL database
2. Run schema migration
3. Update backend `DATABASE_URL`

## Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend (.env)
```env
DATABASE_URL=postgresql://username:password@localhost:5432/social_flow_db
NODE_ENV=development
PORT=5000
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:3000
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

## Acknowledgments

- [Flow Blockchain](https://flow.com/) for the blockchain infrastructure
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Radix UI](https://www.radix-ui.com/) for accessible components
