#!/bin/bash

echo "🚀 Setting up Social Flow Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "⚠️  Please update the .env file with your database credentials."
else
    echo "✅ .env file already exists"
fi

# Check if PostgreSQL is running (if not using Docker)
if command -v psql &> /dev/null; then
    echo "🐘 PostgreSQL detected. You can run the schema manually:"
    echo "   createdb social_flow_db"
    echo "   psql -d social_flow_db -f database/schema.sql"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env file with your database credentials"
echo "2. Start the database (PostgreSQL)"
echo "3. Run the database schema: psql -d social_flow_db -f database/schema.sql"
echo "4. Start the development server: npm run dev"
