#!/bin/sh
# Umami Analytics - Docker Entrypoint with Auto-Migration
# Runs Prisma migrations and optional password reset before starting the application
# Author: Chris Junker – Senior Engineer
#
# NOTE: This file is for documentation only. The actual script is embedded in the Dockerfile.

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

# Reset admin password if UMAMI_ADMIN_PASSWORD is set
if [ -n "$UMAMI_ADMIN_PASSWORD" ]; then
    echo "🔐 Updating admin password from UMAMI_ADMIN_PASSWORD secret..."

    node -e "
    const bcrypt = require('bcryptjs');
    const { PrismaClient } = require('@prisma/client');

    async function resetPassword() {
      const prisma = new PrismaClient();
      try {
        const hashedPassword = await bcrypt.hash(process.env.UMAMI_ADMIN_PASSWORD, 10);
        await prisma.user.update({
          where: { username: 'admin' },
          data: { password: hashedPassword }
        });
        console.log('✅ Admin password updated successfully');
      } catch (error) {
        console.error('❌ Failed to update admin password:', error.message);
        process.exit(1);
      } finally {
        await prisma.\$disconnect();
      }
    }

    resetPassword();
    " || exit 1

    echo ""
else
    echo "ℹ️  UMAMI_ADMIN_PASSWORD not set - using default password (admin/umami)"
    echo "   Set UMAMI_ADMIN_PASSWORD in Railway secrets for auto-reset"
    echo ""
fi

echo "========================================="
echo "🚀 Starting Umami Server..."
echo "========================================="
echo ""

# Start the application
exec node server.js
