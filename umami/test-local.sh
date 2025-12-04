#!/bin/bash
# Local Umami Testing Script
# Tests the Docker build locally before Railway deployment

set -e

echo "🧪 Umami Local Testing"
echo "====================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Use .env.local if it exists, otherwise use .env.example
if [ -f .env.local ]; then
    echo "📋 Using .env.local for configuration"
    ENV_FILE=".env.local"
elif [ -f .env.example ]; then
    echo "📋 Using .env.example for configuration"
    ENV_FILE=".env.example"
else
    echo "❌ No .env.local or .env.example found"
    exit 1
fi

# Clean up any existing containers
echo "🧹 Cleaning up old containers..."
docker-compose down -v 2>/dev/null || true

echo ""
echo "🏗️  Building Umami Docker image (this may take 3-5 minutes)..."
echo ""

# Build with the env file
docker-compose --env-file $ENV_FILE build --no-cache

echo ""
echo "🚀 Starting Umami + PostgreSQL..."
echo ""

# Start services
docker-compose --env-file $ENV_FILE up -d

echo ""
echo "⏳ Waiting for services to be healthy..."
echo ""

# Wait for health checks
sleep 5

# Check if containers are running
if docker-compose ps | grep -q "healthy"; then
    echo "✅ Services are healthy!"
    echo ""
    echo "🎉 Umami is running at: http://localhost:3000"
    echo ""
    echo "📝 Default credentials:"
    echo "   Username: admin"
    echo "   Password: umami"
    echo ""
    echo "📊 View logs:"
    echo "   docker-compose logs -f umami"
    echo ""
    echo "🛑 Stop services:"
    echo "   docker-compose down"
    echo ""
else
    echo "❌ Services failed to start. Checking logs..."
    docker-compose logs umami
    exit 1
fi
