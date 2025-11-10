# Railway Secret Management Workflow

Automated secret generation and management for Railway deployments using GitHub Actions.

## Features

- 🔐 **Secure secret generation** using OpenSSL (64-character hex strings)
- 🚀 **Automated deployment** to Railway via CLI
- 🔄 **Secret rotation** on-demand or scheduled
- ✅ **Secret verification** without exposing values
- 💾 **Encrypted backups** (optional, GPG-encrypted)
- 🔒 **GitHub Actions security** with secret masking

## Prerequisites

### 1. Railway API Token

Get your Railway token:
1. Go to [Railway Account Tokens](https://railway.app/account/tokens)
2. Click **"Create Token"**
3. Copy the token (starts with `railway_...`)

### 2. Railway Project ID

Get your project ID:
```bash
# Option 1: Railway CLI
railway status | grep "Project ID"

# Option 2: Railway Dashboard URL
# URL format: https://railway.app/project/{PROJECT_ID}
```

### 3. Add GitHub Secrets

Go to: **GitHub Repository → Settings → Secrets and variables → Actions**

Add these secrets:

| Secret Name | Description | Required |
|-------------|-------------|----------|
| `RAILWAY_TOKEN` | Railway API token | ✅ Yes |
| `RAILWAY_PROJECT_ID` | Railway project UUID | ✅ Yes |
| `GPG_PASSPHRASE` | Passphrase for backup encryption | ❌ Optional |

**Example**:
```
RAILWAY_TOKEN: railway_abc123xyz...
RAILWAY_PROJECT_ID: 12345678-abcd-1234-efgh-123456789abc
GPG_PASSPHRASE: your-secure-passphrase-here
```

## Usage

### Initial Setup (First Time)

This generates and sets all secrets + environment variables:

1. Go to: **Actions → Railway Secret Management**
2. Click **"Run workflow"**
3. Select:
   - **Action**: `generate-and-set`
   - **Service name**: `umami` (or your service name)
4. Click **"Run workflow"**

**What it does**:
- Generates `HASH_SALT`, `NEXTAUTH_SECRET`, `POSTGRES_PASSWORD`
- Sets all environment variables in Railway
- Configures `DATABASE_TYPE`, `NODE_ENV`, `PORT`, etc.
- Triggers automatic Railway redeployment
- Creates encrypted backup (if `GPG_PASSPHRASE` is set)

**Timeline**: ~2-3 minutes + Railway deployment (~3-5 min)

### Rotate Secrets (Periodic Security)

Rotate secrets without changing other environment variables:

1. Go to: **Actions → Railway Secret Management**
2. Click **"Run workflow"**
3. Select:
   - **Action**: `rotate`
   - **Service name**: `umami`
4. Click **"Run workflow"**

**What it does**:
- Generates new `HASH_SALT`, `NEXTAUTH_SECRET`, `POSTGRES_PASSWORD`
- Updates only these 3 secrets in Railway
- Triggers automatic Railway redeployment
- Creates encrypted backup

**Timeline**: ~1-2 minutes + Railway deployment (~30s)

⚠️ **Warning**: Rotating secrets will invalidate existing user sessions.

### Verify Secrets

Check which secrets are configured (without exposing values):

1. Go to: **Actions → Railway Secret Management**
2. Click **"Run workflow"**
3. Select:
   - **Action**: `verify`
   - **Service name**: `umami`
4. Click **"Run workflow"**

**What it does**:
- Lists configured environment variables
- Verifies Railway connection
- Shows which secrets are set (values masked)

**Timeline**: ~30 seconds

## Automated Rotation (Optional)

Enable monthly automatic rotation:

1. Edit `.github/workflows/railway-secrets.yml`
2. Uncomment the `schedule` section:
   ```yaml
   schedule:
     - cron: '0 2 1 * *'  # Every 1st of month at 2am UTC
   ```
3. Commit and push

**Rotation schedule options**:
- Monthly: `0 2 1 * *` (1st day at 2am UTC)
- Quarterly: `0 2 1 */3 *` (Every 3 months)
- Annually: `0 2 1 1 *` (January 1st)

## Security Best Practices

### Secret Masking
All generated secrets are automatically masked in GitHub Actions logs using `::add-mask::`.

### Backup Encryption
If `GPG_PASSPHRASE` is set:
- Backups are encrypted with AES256
- Stored in workflow artifacts (expires after 90 days)
- Decrypt with: `gpg --decrypt secrets-YYYYMMDD-HHMMSS.env.gpg`

### Access Control
- Only repository admins can trigger workflows
- Railway token has limited scope (set in Railway)
- Secrets never appear in logs or artifacts unencrypted

## Troubleshooting

### Error: "RAILWAY_TOKEN secret not set"

**Solution**:
1. Go to repository **Settings → Secrets → Actions**
2. Add `RAILWAY_TOKEN` with your Railway API token
3. Get token from: https://railway.app/account/tokens

### Error: "Could not link Railway project"

**Solution**:
1. Verify `RAILWAY_PROJECT_ID` is correct (UUID format)
2. Check Railway token has access to the project
3. Ensure token hasn't expired

### Error: "Service not found"

**Solution**:
1. Check service name matches Railway dashboard
2. Default is `umami` - change if different
3. List services: `railway service list`

### Workflow fails after Railway updates secrets

**Expected behavior**: Railway automatically redeploys the service after secrets are updated. Check:
1. Railway dashboard → Deployments → View latest deployment
2. Check logs for errors
3. Verify health check: `curl -I https://umami.cjunker.dev/api/heartbeat`

## Manual Secret Generation (Alternative)

If you prefer manual setup:

```bash
# Generate secrets
echo "HASH_SALT=$(openssl rand -hex 32)"
echo "NEXTAUTH_SECRET=$(openssl rand -hex 32)"
echo "POSTGRES_PASSWORD=$(openssl rand -hex 32)"

# Set in Railway (requires Railway CLI)
railway login
railway link <PROJECT_ID>
railway variables set HASH_SALT="<value>" --service umami
railway variables set NEXTAUTH_SECRET="<value>" --service umami
railway variables set POSTGRES_PASSWORD="<value>" --service umami
```

## Workflow Diagram

```
┌─────────────────────────────────────────────┐
│ GitHub Actions: Railway Secret Management  │
└─────────────────┬───────────────────────────┘
                  │
    ┌─────────────┴─────────────┐
    │                           │
    ▼                           ▼
┌───────────────┐       ┌──────────────────┐
│ Generate      │       │ Verify           │
│ Secrets       │       │ Configuration    │
│ (openssl)     │       │ (no changes)     │
└───────┬───────┘       └──────────────────┘
        │
        ▼
┌───────────────────────────┐
│ Set Secrets in Railway    │
│ - HASH_SALT               │
│ - NEXTAUTH_SECRET         │
│ - POSTGRES_PASSWORD       │
└───────────┬───────────────┘
            │
            ▼
┌───────────────────────────┐
│ Railway Auto-Redeploy     │
│ (~30s cached, ~3-5m fresh)│
└───────────┬───────────────┘
            │
            ▼
┌───────────────────────────┐
│ Encrypted Backup          │
│ (optional, GPG-encrypted) │
└───────────────────────────┘
```

## Related Documentation

- [Railway CLI Documentation](https://docs.railway.app/develop/cli)
- [Railway Environment Variables](https://docs.railway.app/develop/variables)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Umami Environment Variables](https://umami.is/docs/environment-variables)

## Cost & Performance

- **Workflow Runtime**: 1-3 minutes (free GitHub Actions minutes)
- **Railway Redeployment**: 30 seconds (cached) to 5 minutes (fresh build)
- **Monthly Rotation**: ~5 minutes/month (negligible cost)

---

**Status**: ✅ Production-ready

**Last Updated**: November 2025

**Questions?** Open an issue in the repository
