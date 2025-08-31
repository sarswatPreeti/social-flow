# Social Flow Backend

A Node.js/Express backend for the Social Flow Web3 application with PostgreSQL database.

## Features

- RESTful API for posts and comments
- PostgreSQL database with proper schema
- Rate limiting and security middleware
- CORS configuration
- Docker support for deployment
- Health check endpoints

## Prerequisites

- Node.js 18 or higher
- PostgreSQL 15 or higher
- Docker (optional, for containerized deployment)

## Local Development Setup

### Option 1: Using Docker Compose (Recommended)

1. Clone the repository and navigate to the backend directory:
```bash
cd backend
```

2. Start the services using Docker Compose:
```bash
docker-compose up -d
```

This will start both PostgreSQL and the backend server automatically.

### Option 2: Manual Setup

1. Install dependencies:
```bash
npm install
```

2. Set up PostgreSQL database:
```bash
# Create database
createdb social_flow_db

# Run schema
psql -d social_flow_db -f database/schema.sql
```

3. Create environment file:
```bash
cp env.example .env
```

4. Update the `.env` file with your database credentials.

5. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get a specific post
- `POST /api/posts` - Create a new post
- `POST /api/posts/:id/vote` - Vote on a post
- `GET /api/posts/user/:address` - Get posts by user address

### Comments
- `GET /api/posts/:id/comments` - Get comments for a post
- `POST /api/posts/:id/comments` - Add a comment to a post

### Health Check
- `GET /health` - Health check endpoint

## Environment Variables

Create a `.env` file with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/social_flow_db
DB_HOST=localhost
DB_PORT=5432
DB_NAME=social_flow_db
DB_USER=your_username
DB_PASSWORD=your_password

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration (for future auth features)
JWT_SECRET=your_jwt_secret_key_here

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Database Schema

The database includes the following tables:
- `posts` - Main posts table
- `post_media` - Media attachments for posts
- `comments` - Comments on posts
- `votes` - User votes on posts

## Deployment

### Docker Deployment

1. Build the Docker image:
```bash
docker build -t social-flow-backend .
```

2. Run the container:
```bash
docker run -p 5000:5000 --env-file .env social-flow-backend
```

### Production Deployment

For production deployment, consider:
- Using a managed PostgreSQL service (AWS RDS, Google Cloud SQL, etc.)
- Setting up proper SSL certificates
- Configuring environment variables securely
- Using a reverse proxy (nginx)
- Setting up monitoring and logging

## Security Features

- Helmet.js for security headers
- CORS protection
- Rate limiting
- Input validation
- SQL injection protection (using parameterized queries)

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License
