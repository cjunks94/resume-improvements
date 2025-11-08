# Deployment Guide

This guide covers deploying the portfolio site to GitHub Pages using tag-based deployments with separate production and staging environments.

## Prerequisites

- GitHub account
- Git installed locally
- Node.js 20+ installed (for local testing)
- DNS access for cjunker.dev (for custom domains)

## Deployment Overview

This site uses **tag-based deployments** with two environments:

- **Production** (cjunker.dev): Deployed from tags like `v1.0.0`, `v1.1.0`
- **Staging** (staging.cjunker.dev): Deployed from tags like `staging-v1.0.0`, `staging-latest`

### Why Tag-Based?
- ✅ Controlled deployments (no accidental production releases)
- ✅ Version history and rollback capability
- ✅ Staging environment for testing before production
- ✅ Semantic versioning for clear release communication

See `decisions/003-tag-based-deployment-strategy.md` for full rationale.

## Local Development

### Install Dependencies

```bash
npm install
```

### Run Tests

```bash
npm test          # Run all tests
npm run lint      # Run linters only
npm run test:sections  # Test section presence
npm run test:links     # Check local file links
npm run test:a11y      # Accessibility tests
```

### Local Preview

```bash
npm run serve
# Visit http://localhost:8000
```

## Deployment Workflow

### Step 1: Develop and Test Locally

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
# ...

# Test locally
npm test
npm run lint

# Commit changes
git commit -m "feat: add new feature"
git push origin feature/new-feature
```

### Step 2: Deploy to Staging

```bash
# Tag your feature branch for staging
git tag staging-v1.0.0-rc1
git push origin staging-v1.0.0-rc1

# Check deployment at: https://staging.cjunker.dev
```

The GitHub Actions workflow will:
1. Run all tests and linters
2. Deploy to `gh-pages-staging` branch
3. Site available at staging.cjunker.dev

### Step 3: Merge to Master

```bash
# After testing on staging
git checkout master
git merge feature/new-feature
git push origin master
```

**Note:** Pushing to master only runs tests, NOT deployment.

### Step 4: Deploy to Production

```bash
# Tag master for production release
git tag v1.0.0
git push origin v1.0.0

# Check deployment at: https://cjunker.dev
```

The GitHub Actions workflow will:
1. Run all tests and linters
2. Deploy to `gh-pages-production` branch
3. Site available at cjunker.dev

## Tag Naming Conventions

### Production Tags (Semantic Versioning)

Format: `v<major>.<minor>.<patch>[-prerelease]`

```bash
v1.0.0        # Major release
v1.1.0        # Minor release (new features)
v1.1.1        # Patch release (bug fixes)
v2.0.0-beta.1 # Pre-release (optional)
```

**When to increment:**
- **Major (v2.0.0)**: Breaking changes, major redesign
- **Minor (v1.1.0)**: New features, non-breaking changes
- **Patch (v1.0.1)**: Bug fixes, small improvements

### Staging Tags

Format: `staging-<description>` or `staging-v<version>[-rc]`

```bash
staging-latest         # Always latest master
staging-v1.0.0-rc1     # Release candidate 1
staging-mobile-fix     # Feature-specific
staging-2025-11-08     # Date-based
```

## Rollback Strategy

### Option 1: Force Update Tag (Quick)

```bash
# Find commit SHA of working version
git log --oneline

# Move tag to that commit
git checkout <old-commit-sha>
git tag -f v1.0.0
git push origin v1.0.0 --force
```

### Option 2: Create New Patch Tag (Recommended)

```bash
# Tag the older working commit with new version
git checkout <old-commit-sha>
git tag v1.0.2  # New patch version
git push origin v1.0.2
```

## GitHub Actions Workflows

### Test on Push and PR (`.github/workflows/test-and-deploy.yml`)

**Triggers:**
- Push to `master`
- Pull requests to `master`

**Actions:**
- Run linters (HTML, CSS)
- Run tests (section validation, links)
- Run accessibility tests
- **Does NOT deploy** (tests only)

### Deploy from Tags (`.github/workflows/deploy-tags.yml`)

**Triggers:**
- Tags matching `v*.*.*` (production)
- Tags matching `staging-*` (staging)

**Actions:**
- Run all tests
- Deploy to appropriate branch:
  - `v*` → `gh-pages-production` → cjunker.dev
  - `staging-*` → `gh-pages-staging` → staging.cjunker.dev

## DNS Configuration for Staging

To set up staging.cjunker.dev:

1. **Add CNAME record at your DNS provider:**
   ```
   Type: CNAME
   Name: staging
   Value: cjunks94.github.io
   TTL: 3600 (or automatic)
   ```

2. **Wait for DNS propagation** (5-30 minutes typically)

3. **Verify DNS:**
   ```bash
   dig staging.cjunker.dev +noall +answer
   # Should show CNAME to cjunks94.github.io
   ```

4. **Deploy to staging with a tag:**
   ```bash
   git tag staging-latest
   git push origin staging-latest
   ```

5. **Check GitHub Pages settings:**
   - Go to **Settings → Environments → staging**
   - Custom domain will be automatically configured via CNAME file in gh-pages-staging

## Custom Domain Setup

### Production Domain (cjunker.dev)

#### DNS Configuration

1. **Purchase a domain** from a registrar (Namecheap, Google Domains, etc.)

2. **Configure DNS records** at your domain registrar:

   For apex domain (cjunker.dev):
   ```
   Type: A
   Name: @
   Value: 185.199.108.153

   Type: A
   Name: @
   Value: 185.199.109.153

   Type: A
   Name: @
   Value: 185.199.110.153

   Type: A
   Name: @
   Value: 185.199.111.153
   ```

   For www subdomain (www.cjunker.dev):
   ```
   Type: CNAME
   Name: www
   Value: <username>.github.io
   ```

3. **Create CNAME file** in your repository:

   ```bash
   echo "cjunker.dev" > CNAME
   git add CNAME
   git commit -m "Add custom domain"
   git push
   ```

4. **Configure in GitHub**:
   - Go to **Settings** → **Pages**
   - Under **Custom domain**, enter: `cjunker.dev`
   - Check **Enforce HTTPS** (wait for DNS propagation first)

5. **Wait for DNS propagation** (can take 24-48 hours)

6. **Verify**:
   ```bash
   dig cjunker.dev +noall +answer
   # Should show GitHub's IPs
   ```

### Option 2: Using GitHub Subdomain

If you don't want a custom domain, your site will be at:

```
https://<username>.github.io/resume-improvements/
```

No additional configuration needed!

### Option 3: Using a Subdomain (e.g., portfolio.cjunker.dev)

1. **Configure DNS** (at your domain registrar):
   ```
   Type: CNAME
   Name: portfolio
   Value: <username>.github.io
   ```

2. **Update CNAME file**:
   ```bash
   echo "portfolio.cjunker.dev" > CNAME
   git add CNAME
   git commit -m "Update to subdomain"
   git push
   ```

3. **Configure in GitHub** as above

## Continuous Deployment

The GitHub Actions workflow automatically:

1. **On every push to master**:
   - Installs dependencies
   - Runs linters (HTML + CSS)
   - Runs tests (section validation + link checking)
   - Deploys to GitHub Pages if tests pass

2. **On pull requests**:
   - Runs linters and tests
   - Does NOT deploy (only validates)

### Workflow File

Located at: `.github/workflows/test-and-deploy.yml`

To modify deployment behavior, edit this file.

## Troubleshooting

### Tests Fail Locally

```bash
# Check which test is failing
npm run test:sections
npm run test:links
npm run lint

# Fix issues and re-run
```

### GitHub Actions Failing

1. Check the **Actions** tab for error logs
2. Common issues:
   - Missing `node_modules` → Fixed by `npm ci` in workflow
   - Linting errors → Run `npm run lint` locally first
   - Missing files → Check `.gitignore`

### Custom Domain Not Working

1. Verify DNS propagation:
   ```bash
   dig yourdomain.com +noall +answer
   ```

2. Check GitHub Pages settings:
   - Domain should match CNAME file exactly
   - HTTPS may take time to provision

3. Clear browser cache or test in incognito mode

### Site Not Updating

1. Check if workflow ran successfully in **Actions** tab
2. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
3. Check if changes were pushed to master branch

## Adding New Sections

1. Update `index.html` with new section (must have unique `id`)
2. Update `tests/validate.js` to include new section ID:
   ```javascript
   const requiredSections = ['hero', 'about', 'tech-radar', 'projects', 'resume', 'contact', 'new-section'];
   ```
3. Run tests locally before pushing:
   ```bash
   npm test
   ```

## Performance Optimization

The site is already optimized for GitHub Pages:

- Static HTML/CSS (no build step required)
- Minimal external dependencies (only Pico.css CDN)
- Lightweight custom CSS
- Mobile-responsive design

### Future Enhancements

- Add image optimization if adding photos
- Consider service worker for offline support
- Implement lazy loading for project images

## Cost Breakdown

Current setup uses **100% free tier**:

- GitHub Pages: Free
- GitHub Actions: 2,000 minutes/month free (this uses ~1 min per deploy)
- Custom domain: $10-15/year (optional)

Upgrade considerations:
- If you exceed 2,000 Actions minutes: ~$0.008/min ($16 for additional 2,000 min)
- For this site, you'd need ~2,000 deployments/month to hit the limit

## Security

- Site is static (no server-side code to secure)
- No sensitive data exposed
- HTTPS enforced via GitHub Pages
- No cookies or tracking

## Monitoring

Monitor your site via:

1. **GitHub Insights**: Traffic data in repository settings
2. **Google Search Console**: Add your domain for SEO insights (free)
3. **Uptime monitoring**: UptimeRobot (free for 50 monitors)

---

**Last Updated**: November 2025
**Questions?** Open an issue in the repository
