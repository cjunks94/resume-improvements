# Railway Deployment Guide - Umami Analytics

**Quick Deploy**: Zero-config PaaS deployment with auto-HTTPS and PostgreSQL

## Prerequisites

- ✅ GitHub account with repository access
- ✅ Railway account (free tier: $5 credit, 500 hours/month)
- ✅ Custom domain (optional): `umami.cjunker.dev`
- ✅ Railway CLI installed (optional, for manual deploy)

## Pre-Deployment Checklist

- [ ] Repository pushed to GitHub (`feature/umami-analytics` branch or `master`)
- [ ] All Docker files present in `umami/` directory
- [ ] Railway account created at [railway.app](https://railway.app)
- [ ] Secrets generated and ready (see below)

## Step 1: Generate Secrets

**IMPORTANT**: Generate these secrets locally and store in password manager (1Password/Bitwarden):

```bash
# Generate all 3 secrets
echo "HASH_SALT=$(openssl rand -hex 32)"
echo "NEXTAUTH_SECRET=$(openssl rand -hex 32)"
echo "POSTGRES_PASSWORD=$(openssl rand -hex 32)"
```

**Save these values** - you'll need them in Step 4.

## Step 2: Create Railway Project

### Option A: Railway Dashboard (Recommended)

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"+ New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose `resume-improvements` repository
5. Railway detects Dockerfile automatically ✅

### Option B: Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Navigate to umami directory
cd umami

# Initialize project
railway init

# Link to GitHub repo
railway link
```

## Step 3: Add PostgreSQL Database

1. In Railway project, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway automatically:
   - Creates PostgreSQL 16 instance
   - Generates `DATABASE_URL` variable
   - Links to your Umami service

**No manual configuration needed!** ✅

## Step 4: Configure Environment Variables

### Via Railway Dashboard

1. Click on your **Umami service** (not database)
2. Go to **"Variables"** tab
3. Click **"RAW Editor"**
4. Paste:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
DATABASE_TYPE=postgresql
HASH_SALT=<paste-your-secret-from-step-1>
NEXTAUTH_SECRET=<paste-your-secret-from-step-1>
POSTGRES_PASSWORD=<paste-your-secret-from-step-1>
DISABLE_TELEMETRY=1
NEXT_TELEMETRY_DISABLED=1
CLIENT_IP_HEADER=CF-Connecting-IP
NODE_ENV=production
PORT=3000
```

5. Click **"Save Changes"**

### Via Railway CLI

```bash
railway variables set HASH_SALT="your-secret-here"
railway variables set NEXTAUTH_SECRET="your-secret-here"
railway variables set POSTGRES_PASSWORD="your-secret-here"
railway variables set DATABASE_TYPE=postgresql
railway variables set DISABLE_TELEMETRY=1
railway variables set NEXT_TELEMETRY_DISABLED=1
railway variables set CLIENT_IP_HEADER=CF-Connecting-IP
```

## Step 5: Configure Service Settings

1. Click on Umami service
2. Go to **"Settings"** tab
3. Set **"Root Directory"**: `umami`
4. Set **"Start Command"**: `dumb-init node server.js` (optional, Dockerfile already has this)
5. Click **"Save"**

## Step 6: Deploy

### Auto-Deploy (Recommended)

Railway automatically deploys when you push to GitHub:

```bash
git push origin feature/umami-analytics
```

Watch deployment logs in Railway dashboard.

### Manual Deploy

```bash
cd umami
railway up
```

**Build time**: ~3-5 minutes (first deploy), ~30 seconds (subsequent deploys with cache)

## Step 7: Add Custom Domain

### Railway Configuration

1. In Umami service, go to **"Settings"** → **"Domains"**
2. Click **"+ Custom Domain"**
3. Enter: `umami.cjunker.dev`
4. Copy the CNAME target (e.g., `your-project.up.railway.app`)

### Cloudflare DNS Configuration

1. Go to Cloudflare dashboard → DNS → Records
2. Click **"Add record"**
3. Configure:
   ```
   Type: CNAME
   Name: umami
   Target: <railway-cname-from-above>
   Proxy status: Proxied (orange cloud ☁️)
   TTL: Auto
   ```
4. Click **"Save"**

**Wait 1-5 minutes** for DNS propagation.

## Step 8: Verify Deployment

### Health Check

```bash
curl -I https://umami.cjunker.dev/api/heartbeat
```

**Expected**: `HTTP/2 200`

### Access Dashboard

1. Visit: `https://umami.cjunker.dev`
2. Default credentials:
   - **Username**: `admin`
   - **Password**: `umami`
3. **IMPORTANT**: Change password immediately!

### Check Logs

**Railway Dashboard**:
- Umami service → **"Deployments"** tab → Click latest deployment → **"View Logs"**

**Railway CLI**:
```bash
railway logs
```

## Step 9: Initial Configuration

### Create Website in Umami

1. Login to Umami dashboard
2. **Settings** → **"Websites"** → **"Add website"**
3. Configure:
   - **Name**: Christopher Junker Portfolio
   - **Domain**: cjunker.dev
   - **Enable Share URL**: Yes (for public dashboards)
4. Click **"Save"**
5. **Copy the Website ID** (needed for tracking script)

### Change Admin Password

1. **Settings** → **"Users"** → Click **"admin"**
2. **Change password** → Enter strong password
3. Save password in password manager

## Troubleshooting

### Build Fails

**Check logs**:
```bash
railway logs --deployment
```

**Common issues**:
- ❌ `DATABASE_URL` not set → Add PostgreSQL database
- ❌ Root directory not set → Set to `umami` in Settings
- ❌ Missing environment variables → Check Variables tab

### Health Check Fails

```bash
# Check if service is running
railway status

# View recent logs
railway logs --tail 50

# Check database connection
railway run psql $DATABASE_URL
```

### Domain Not Working

**Verify DNS**:
```bash
dig umami.cjunker.dev +short
```

**Should show**: Railway CNAME or Cloudflare proxy IP

**Clear DNS cache** (if needed):
```bash
# macOS
sudo dscacheutil -flushcache

# Windows
ipconfig /flushdns

# Linux
sudo systemd-resolve --flush-caches
```

### Can't Login

**Reset admin password**:
```bash
railway connect Postgres

# In PostgreSQL shell:
UPDATE account SET password = '$2a$10$BUli0c.muyCW1ErNJc3jL.vFRFtFJWrT8/GcnGU5eBF5xdEv1C8uS' WHERE username = 'admin';
```

**New password**: `umami` (change immediately after login)

## Cost Monitoring

**Railway Free Tier**:
- $5 credit/month
- 500 hours/month
- PostgreSQL included

**Estimated usage** (Umami + PostgreSQL):
- ~720 hours/month (continuous uptime)
- **Cost**: $0.01/hour × 220 hours = **$2.20/month**

**Tip**: Deploy only when needed, or upgrade to Hobby plan ($5/month, 500 hours included)

## Auto-Backup Setup

**Create backup manually**:
```bash
railway run pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
```

**Automate with GitHub Actions** (see #27 for implementation)

## Monitoring

**Railway Dashboard**:
- CPU/Memory usage
- Network traffic
- Deployment history

**External Health Check** (optional):
- UptimeRobot: https://uptimerobot.com (free, 50 monitors)
- Ping endpoint: `https://umami.cjunker.dev/api/heartbeat`

## Next Steps

After successful deployment:

- [ ] Configure Cloudflare Access (GitHub OAuth) - See umami/README.md #7
- [ ] Add tracking script to `index.html` - See #21
- [ ] Configure custom events for tech radar - See #21
- [ ] Test analytics tracking - Create test page views

## Rollback

**If deployment breaks**:

1. Go to Railway dashboard → Umami service → **"Deployments"**
2. Find last working deployment
3. Click **"..."** → **"Redeploy"**

**Or via CLI**:
```bash
railway rollback
```

## Useful Commands

```bash
# View environment variables
railway variables

# Connect to PostgreSQL
railway connect Postgres

# View service info
railway status

# Open in browser
railway open

# View deployment URL
railway domain
```

## Resources

- [Railway Documentation](https://docs.railway.app)
- [Umami Documentation](https://umami.is/docs)
- [Dockerfile Reference](./Dockerfile)
- [docker-compose.yml](./docker-compose.yml) (for local testing)

---

**Deployment Status**: 🟢 Ready for production

**Last Updated**: November 2025

**Questions?** Open an issue in the repository
