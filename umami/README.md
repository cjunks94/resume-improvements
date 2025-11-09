# Umami Analytics Deployment

Self-hosted Umami analytics for cjunker.dev with zero-cost hosting and Cloudflare Access security.

## Architecture

- **Analytics Dashboard**: `umami.cjunker.dev`
- **Hosting**: Railway.app (free tier)
- **Database**: PostgreSQL (included with Railway)
- **Security**: Cloudflare Access (GitHub OAuth)
- **Frontend**: Tracking script on cjunker.dev

## Quick Start - Railway Deployment

### 1. Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/umami)

**Manual deployment:**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Create new project
railway init

# Add PostgreSQL database
railway add

# Set environment variables
railway variables set APP_SECRET=$(openssl rand -hex 32)
railway variables set DATABASE_URL=${{Postgres.DATABASE_URL}}

# Deploy Umami
railway up
```

### 2. Configure Custom Domain

In Railway dashboard:
1. Go to **Settings** → **Domains**
2. Add custom domain: `umami.cjunker.dev`
3. Copy the CNAME value (e.g., `xyz.up.railway.app`)

### 3. Configure Cloudflare DNS

Add CNAME record in Cloudflare:

```
Type: CNAME
Name: umami
Target: <railway-domain-from-step-2>
Proxy status: Proxied (orange cloud)
TTL: Auto
```

### 4. Set Up Cloudflare Access

**Create GitHub OAuth Application:**

1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: Umami Analytics - cjunker.dev
   - **Homepage URL**: https://umami.cjunker.dev
   - **Authorization callback URL**: https://umami.cloudflareaccess.com/cdn-cgi/access/callback
4. Save **Client ID** and **Client Secret**

**Configure Cloudflare Access:**

1. Go to Cloudflare dashboard → Zero Trust → Access → Applications
2. Click "Add an application"
3. Select "Self-hosted"
4. Configuration:
   - **Application name**: Umami Analytics
   - **Session Duration**: 24 hours
   - **Application domain**: `umami.cjunker.dev`
5. Add identity provider:
   - Select "GitHub"
   - Enter Client ID and Client Secret
6. Create access policy:
   - **Policy name**: GitHub Auth
   - **Action**: Allow
   - **Include**: Emails ending in `@gmail.com` (or your GitHub email)
   - **Require**: GitHub

### 5. Initial Umami Setup

1. Visit `https://umami.cjunker.dev`
2. Authenticate via Cloudflare Access (GitHub OAuth)
3. Default credentials:
   - **Username**: `admin`
   - **Password**: `umami`
4. **IMPORTANT**: Change password immediately
5. Add website:
   - **Name**: Christopher Junker Portfolio
   - **Domain**: cjunker.dev
   - **Enable Share URL**: Yes (for public dashboards)
6. Copy the **Website ID** and **Tracking Code**

## Add Tracking Script to Website

Add to `index.html` in `<head>`:

```html
<!-- Umami Analytics -->
<script
  defer
  src="https://umami.cjunker.dev/script.js"
  data-website-id="YOUR-WEBSITE-ID-HERE"
></script>
```

### Custom Event Tracking

Track tech radar interactions:

```javascript
// Track radar interaction
function trackRadarEvent(techName, ring, quadrant) {
  if (window.umami) {
    window.umami.track('tech-radar-click', {
      tech: techName,
      ring: ring,
      quadrant: quadrant
    });
  }
}

// Track legend toggle
function trackLegendToggle(isExpanded) {
  if (window.umami) {
    window.umami.track('legend-toggle', {
      action: isExpanded ? 'expand' : 'collapse'
    });
  }
}

// Track CSV download
document.querySelector('a[href="tech-radar.csv"]').addEventListener('click', () => {
  if (window.umami) {
    window.umami.track('download', { file: 'tech-radar.csv' });
  }
});
```

## Environment Variables

Required environment variables for Railway:

```bash
# Database connection (auto-populated by Railway Postgres)
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Application secret (generate with: openssl rand -hex 32)
APP_SECRET=your-random-secret-key-here

# Optional: Custom port (Railway auto-assigns)
PORT=3000
```

## Local Development

Run Umami locally with Docker Compose:

```bash
cd umami

# Generate app secret
export APP_SECRET=$(openssl rand -hex 32)

# Start services
docker-compose up -d

# View logs
docker-compose logs -f umami

# Access dashboard
open http://localhost:3000
```

Default credentials: `admin` / `umami`

## Monitoring and Maintenance

### Health Check

```bash
curl https://umami.cjunker.dev/api/heartbeat
```

### Database Backups

Railway provides automatic daily backups. Manual backup:

```bash
railway run pg_dump $DATABASE_URL > backup.sql
```

### View Logs

```bash
railway logs
```

## Cost Breakdown

- **Railway**: $0/month (free tier: 500 hours, $5 credit)
- **Cloudflare**: $0/month (Access free tier: 50 users)
- **PostgreSQL**: $0/month (included with Railway)
- **Domain**: $12/year (already owned)

**Total: $0/month + $1/year**

## Security Features

✅ **Zero-trust access** via Cloudflare Access
✅ **GitHub OAuth** - no passwords to manage
✅ **HTTPS enforced** via Cloudflare
✅ **No cookies** required (privacy-friendly)
✅ **GDPR compliant** (no PII collected)

## Troubleshooting

### Railway deployment fails

- Check DATABASE_URL is set correctly
- Verify APP_SECRET is generated (32+ char hex)
- Check Railway logs: `railway logs`

### Cloudflare Access not working

- Verify GitHub OAuth app callback URL: `https://umami.cloudflareaccess.com/cdn-cgi/access/callback`
- Check access policy includes your GitHub email
- Clear browser cookies and retry

### Tracking script not loading

- Verify website ID is correct
- Check browser console for errors
- Test with curl: `curl -I https://umami.cjunker.dev/script.js`

## Useful Links

- [Umami Documentation](https://umami.is/docs)
- [Railway Documentation](https://docs.railway.app)
- [Cloudflare Access Docs](https://developers.cloudflare.com/cloudflare-one/applications/)
- [Umami GitHub](https://github.com/umami-software/umami)

---

**Status**: 🟢 Deployed at https://umami.cjunker.dev
**Last Updated**: November 2025
