#!/bin/sh
# Umami Analytics - Docker Entrypoint with Auto-Migration
# Runs Prisma migrations before starting the application
# Author: Chris Junker – Senior Engineer

set -e

echo "========================================="
echo "Umami Analytics - Starting Up"
echo "========================================="
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL environment variable is not set"
    exit 1
fi

echo "✓ DATABASE_URL is configured"
echo ""

# Run Prisma migrations
echo "📊 Running database migrations..."
echo "---"

if npx prisma migrate deploy; then
    echo "---"
    echo "✅ Database migrations completed successfully"
else
    echo "---"
    echo "❌ ERROR: Database migrations failed"
    echo "Check that:"
    echo "  1. PostgreSQL database is running and accessible"
    echo "  2. DATABASE_URL is correct"
    echo "  3. Database user has CREATE/ALTER table permissions"
    exit 1
fi

echo ""
echo "========================================="
echo "🚀 Starting Umami Server..."
echo "========================================="
echo ""

# Start the application
exec node server.js
