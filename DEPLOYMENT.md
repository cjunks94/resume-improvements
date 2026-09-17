# Deployment Guide

This guide covers deploying the portfolio site to GitHub Pages using branch-based deployments with automatic staging previews.

## Prerequisites

- GitHub account
- Git installed locally
- Node.js 20+ installed (for local testing)
- DNS access for cjunker.dev (for custom domains)

## Deployment Overview

This site uses **branch-based deployments** with automatic staging:

- **Production** (cjunker.dev): Deployed automatically from `master` branch
- **Staging** (staging.cjunker.dev): Deployed automatically from `staging` and `feature/*` branches

### Why Branch-Based Subfolder Deployment?
- ✅ True CI/CD (automatic deployment on push)
- ✅ Feature branch previews (test before merging)
- ✅ Single gh-pages branch with subfolders
- ✅ Works natively with GitHub Pages
- ✅ Simple rollback with git revert

See `decisions/003-branch-based-deployment-strategy.md` for full rationale.

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

### Step 2: Auto-Deploy to Staging

Pushing your feature branch automatically deploys to staging:

```bash
git push origin feature/new-feature
# → Automatically deploys to https://staging.cjunker.dev
```

The GitHub Actions workflow will:
1. Run all tests and linters
2. Deploy to `/staging` subfolder of `gh-pages` branch
3. Site available at staging.cjunker.dev within 1-2 minutes

**Preview your changes at:** https://staging.cjunker.dev

### Step 3: Create Pull Request

```bash
# Create PR on GitHub for code review
# Tests will run automatically on PR
```

### Step 4: Merge to Master (Auto-Deploy to Production)

```bash
# After PR approval and merge
git checkout master
git pull origin master
# → Automatically deploys to https://cjunker.dev
```

The GitHub Actions workflow will:
1. Run all tests and linters
2. Deploy to root of `gh-pages` branch
3. Site available at cjunker.dev within 1-2 minutes

**No manual steps required!** Production updates automatically on merge to master.

## Rollback Strategy

### Option 1: Revert Specific Commit (Recommended)

```bash
# Find the bad commit
git log --oneline

# Revert it (creates new commit that undoes changes)
git checkout master
git revert <bad-commit-sha>
git push origin master
# → Automatically deploys reverted version to production
```

### Option 2: Revert Multiple Commits

```bash
# Revert a range of commits
git revert <oldest-bad-commit>..<newest-bad-commit>
git push origin master
```

### Option 3: Hard Reset (Use with Caution)

```bash
# Reset master to a known good commit
git checkout master
git reset --hard <good-commit-sha>
git push origin master --force

# ⚠️ WARNING: This rewrites history
# Only use if absolutely necessary
```

### Testing Rollback on Staging First

```bash
# Test the rollback on a feature branch first
git checkout -b rollback-test
git revert <bad-commit-sha>
git push origin rollback-test
# → Check https://staging.cjunker.dev

# If it looks good, apply to master
git checkout master
git cherry-pick <revert-commit-sha>
git push origin master
```

## GitHub Actions Workflows

### Workflow File: `.github/workflows/deploy.yml`

**Triggers:**
- Push to `master`, `staging`, or `feature/**` branches
- Pull requests to `master`

**Jobs:**

1. **test** (runs on all triggers):
   - Install dependencies
   - Run linters (HTML, CSS)
   - Run tests (section validation, links)
   - Run accessibility tests

2. **deploy-production** (only on push to master):
   - Runs after tests pass
   - Deploys to root of `gh-pages` branch
   - Site available at cjunker.dev

3. **deploy-staging** (only on push to non-master branches):
   - Runs after tests pass
   - Deploys to `/staging` subfolder of `gh-pages` branch
   - Site available at staging.cjunker.dev

**Key Configuration:**
- Uses `peaceiris/actions-gh-pages@v3` for deployment
- Excludes build artifacts (node_modules, tests, etc.)
- Sets up GitHub environments (production, staging)

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

4. **Push to a feature branch to trigger staging deployment:**
   ```bash
   git checkout -b feature/test-staging
   git push origin feature/test-staging
   # → Deploys to https://staging.cjunker.dev within 1-2 minutes
   ```

5. **GitHub Pages Configuration:**
   - Go to **Settings → Pages**
   - Source should be **gh-pages** branch (root)
   - Custom domain: `cjunker.dev`
   - GitHub Pages will automatically route `staging.cjunker.dev` to `/staging` subfolder

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

1. **On push to master**:
   - Installs dependencies
   - Runs linters (HTML + CSS)
   - Runs tests (section validation + link checking)
   - Runs accessibility tests
   - Deploys to production (cjunker.dev) if tests pass

2. **On push to staging or feature branches**:
   - Runs all tests and linters
   - Deploys to staging (staging.cjunker.dev) if tests pass

3. **On pull requests**:
   - Runs linters and tests only
   - Does NOT deploy (only validates)

### Workflow File

Located at: `.github/workflows/deploy.yml`

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
