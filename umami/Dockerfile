# Umami Analytics - Multi-stage Slim Build
# Based on official Umami with Alpine Linux for minimal size

# Stage 1: Dependencies (builder)
FROM node:18-alpine AS deps
WORKDIR /app

# Install system dependencies for building
RUN apk add --no-cache \
    git \
    openssl \
    libc6-compat

# Clone Umami source (specific version for stability)
ARG UMAMI_VERSION=v2.10.2
RUN git clone --depth 1 --branch ${UMAMI_VERSION} https://github.com/umami-software/umami.git /app

# Install dependencies
RUN npm ci --only=production --ignore-scripts

# Stage 2: Builder (compile application)
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package*.json ./
COPY --from=deps /app .

# Install dev dependencies for build
RUN npm ci --ignore-scripts

# Build application
RUN npm run build

# Stage 3: Production (minimal runtime)
FROM node:18-alpine AS runner
WORKDIR /app

# Install only runtime dependencies
RUN apk add --no-cache \
    wget \
    ca-certificates \
    && rm -rf /var/cache/apk/*

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nodejs

# Copy built application and dependencies
COPY --from=builder --chown=nodejs:nodejs /app/next.config.js ./
COPY --from=builder --chown=nodejs:nodejs /app/public ./public
COPY --from=builder --chown=nodejs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nodejs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json

# Copy Prisma schema and migrations
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nodejs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nodejs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Environment variables
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/heartbeat || exit 1

# Start application
CMD ["node", "server.js"]
