#!/bin/bash

echo "🗄️  Setting up PostgreSQL database for Social Flow..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    exit 1
fi

# Check if PostgreSQL is running
if ! pg_isready -q; then
    echo "❌ PostgreSQL is not running. Please start PostgreSQL service."
    exit 1
fi

echo "✅ PostgreSQL is running"

# Get database credentials from environment or use defaults
DB_USER=${DB_USER:-postgres}
DB_PASSWORD=${DB_PASSWORD:-}
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME="social_flow_db"

echo "📝 Using database configuration:"
echo "   User: $DB_USER"
echo "   Host: $DB_HOST:$DB_PORT"
echo "   Database: $DB_NAME"

# Function to create database
create_database() {
    echo "🔧 Creating database..."
    
    # Try different methods to create database
    if createdb -U "$DB_USER" -h "$DB_HOST" -p "$DB_PORT" "$DB_NAME" 2>/dev/null; then
        echo "✅ Database created successfully using createdb"
        return 0
    elif psql -U "$DB_USER" -h "$DB_HOST" -p "$DB_PORT" -d postgres -c "CREATE DATABASE $DB_NAME;" 2>/dev/null; then
        echo "✅ Database created successfully using psql"
        return 0
    else
        echo "❌ Failed to create database. Please check your PostgreSQL credentials."
        echo "   You can manually create the database using:"
        echo "   createdb -U $DB_USER $DB_NAME"
        return 1
    fi
}

# Function to run schema
run_schema() {
    echo "📋 Running database schema..."
    
    if psql -U "$DB_USER" -h "$DB_HOST" -p "$DB_PORT" -d "$DB_NAME" -f database/schema.sql; then
        echo "✅ Database schema applied successfully"
        return 0
    else
        echo "❌ Failed to apply database schema"
        return 1
    fi
}

# Main execution
if create_database; then
    if run_schema; then
        echo ""
        echo "🎉 Database setup completed successfully!"
        echo ""
        echo "📊 Database connection details:"
        echo "   Host: $DB_HOST:$DB_PORT"
        echo "   Database: $DB_NAME"
        echo "   User: $DB_USER"
        echo ""
        echo "🔗 Update your .env file with:"
        echo "   DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"
    else
        echo "❌ Database schema setup failed"
        exit 1
    fi
else
    echo "❌ Database creation failed"
    exit 1
fi
