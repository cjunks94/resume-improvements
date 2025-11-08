# Deployment Guide

This guide covers deploying the portfolio site to GitHub Pages with optional custom domain setup.

## Prerequisites

- GitHub account
- Git installed locally
- Node.js 20+ installed (for local testing)

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
```

### Local Preview

```bash
npm run serve
# Visit http://localhost:8000
```

## GitHub Pages Setup

### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Build and deployment**:
   - **Source**: Select "GitHub Actions"
   - The workflow `.github/workflows/test-and-deploy.yml` will handle deployment

### Step 2: Push Your Code

```bash
git add .
git commit -m "Initial portfolio site"
git push origin master
```

### Step 3: Verify Deployment

1. Go to **Actions** tab in your repository
2. Wait for the "Test and Deploy" workflow to complete
3. Your site will be live at: `https://<username>.github.io/resume-improvements/`

## Custom Domain Setup

### Option 1: Using a Custom Domain (e.g., cjunker.dev)

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
