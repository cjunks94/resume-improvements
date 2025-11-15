# Umami Database Migration Guide

## ⚠️ IMPORTANT: Auto-Migration Now Implemented

**As of commit `[NEXT_COMMIT]`**, migrations run automatically on every deployment.

This guide is kept for reference and troubleshooting only.

**Last Manual Migration Commit**: `fd3f3b2` - "fix: skip check-db during build (no database at build time)"
- This was the last working commit that required manual database migration
- Railway deployment worked, but database needed one-time seeding

---

## Problem (Historical - Now Solved Automatically)
After first deployment, the Railway PostgreSQL database was empty (no tables). Previously required manual Prisma migration.

## Quick Fix (2 minutes)

### Step 1: Login to Railway CLI

```bash
railway login
```

This will open your browser for authentication.

### Step 2: Link to Your Project

```bash
cd umami
railway link
```

Select your Umami project from the list.

### Step 3: Run Migrations

```bash
railway run npx prisma migrate deploy
```

This will:
- Connect to your Railway PostgreSQL database
- Create all required tables (`user`, `website`, `session`, `event`, etc.)
- Seed the admin user (username: `admin`, password: `umami`)

Expected output:
```
✓ Applying migration `01_init`
✓ Applying migration `02_add_uuid_function`
✓ Applying migration `03_add_share_token`
...
Database migrations completed successfully
```

### Step 4: Verify

Visit **https://umami.cjunker.dev** and login with:
- Username: `admin`
- Password: `umami`

**IMPORTANT**: Change the password immediately after first login!

## Alternative: Railway Dashboard

If CLI doesn't work:

1. Go to Railway dashboard → Your Umami service
2. Click **"Shell"** tab
3. Run:
   ```bash
   npx prisma migrate deploy
   ```

## Troubleshooting

### Error: "Database connection failed"
Check that `DATABASE_URL` environment variable is set:
```bash
railway variables get DATABASE_URL
```

### Error: "Migration files not found"
Make sure you're in the `umami/` directory:
```bash
cd /Users/cjunker/Documents/resume-improvements/umami
railway run npx prisma migrate deploy
```

### Error: "Could not find Prisma Client"
The Docker build should have generated it. Check build logs for:
```
✔ Generated Prisma Client (v5.17.0)
```

## One-Time Setup
This migration only needs to run **once** on fresh deployments. Railway will handle database persistence after this.

## Automatic Migration (Current Implementation)

### How It Works

**File**: `docker-entrypoint.sh`

On every Railway deployment:
1. Container starts and runs `docker-entrypoint.sh`
2. Script checks `DATABASE_URL` is set
3. Runs `npx prisma migrate deploy`
4. If migration succeeds → starts Umami server
5. If migration fails → container exits (fail-safe)

### Benefits

- ✅ **Zero manual intervention** - Migrations run automatically
- ✅ **Idempotent** - Prisma won't re-run existing migrations
- ✅ **Fail-safe** - Container won't start if migration fails
- ✅ **Observable** - Migration logs visible in Railway deployment logs
- ✅ **Works everywhere** - Local docker-compose, Railway, any Docker environment

### Viewing Migration Logs

**Railway Dashboard**:
1. Go to your Umami service
2. Click **"Deployments"** → Latest deployment
3. Click **"View Logs"**
4. Look for:
   ```
   📊 Running database migrations...
   ✅ Database migrations completed successfully
   🚀 Starting Umami Server...
   ```

### Troubleshooting Auto-Migration

**If migrations fail on deployment:**

1. Check Railway logs for error message
2. Verify `DATABASE_URL` is set correctly
3. Ensure PostgreSQL service is running
4. Check database user has CREATE/ALTER permissions

**Manual override** (if needed):
```bash
railway run npx prisma migrate deploy
```

## Configuration Files

- **`docker-entrypoint.sh`** - Startup script with auto-migration
- **`railway.toml`** - Railway configuration as code
- **`Dockerfile`** - Multi-stage build with migration support

## Next Steps

After successful migration:
- [ ] Login to Umami dashboard (https://umami.cjunker.dev)
- [ ] Change admin password (admin/umami)
- [ ] Create website entry for cjunker.dev
- [ ] Copy tracking script
- [ ] Set up Cloudflare Access (GitHub OAuth)

---

**Status**: ✅ Auto-migration implemented
**Last Updated**: November 10, 2025
