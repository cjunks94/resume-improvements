# GitHub Pages Setup Checklist

Quick reference for enabling GitHub Pages on this repository.

## Prerequisites

- [x] Repository created on GitHub
- [x] Code pushed to `master` branch
- [x] GitHub Actions workflow configured (`.github/workflows/test-and-deploy.yml`)

## Setup Steps

### 1. Enable GitHub Pages

1. Go to your repository on GitHub: `https://github.com/<username>/resume-improvements`
2. Click **Settings** (top navigation)
3. Click **Pages** (left sidebar)
4. Under **Build and deployment**:
   - **Source**: Select **GitHub Actions** (not "Deploy from a branch")
5. Save (it should save automatically)

### 2. Verify Workflow Permissions

1. In **Settings** → **Actions** → **General**
2. Scroll to **Workflow permissions**
3. Select: **Read and write permissions**
4. Check: **Allow GitHub Actions to create and approve pull requests**
5. Click **Save**

### 3. Push Code to Trigger Deployment

```bash
# Make sure all files are committed
git add .
git commit -m "feat: add portfolio site with CI/CD"
git push origin master
```

### 4. Monitor Deployment

1. Go to **Actions** tab in your repository
2. You should see "Test and Deploy" workflow running
3. Click on the workflow to see progress
4. Wait for both jobs to complete:
   - `test` (runs linters and tests)
   - `deploy` (deploys to GitHub Pages)

### 5. Access Your Site

Once deployment completes:

**Default URL**: `https://<username>.github.io/resume-improvements/`

Update this URL in:
- `README.md` (line 9)
- Share with recruiters!

## Optional: Custom Domain

See [DEPLOYMENT.md](DEPLOYMENT.md) for full custom domain setup instructions.

### Quick Steps for Custom Domain

1. Purchase domain (e.g., `cjunker.dev`)

2. Configure DNS at registrar:
   ```
   Type: A, Name: @, Value: 185.199.108.153
   Type: A, Name: @, Value: 185.199.109.153
   Type: A, Name: @, Value: 185.199.110.153
   Type: A, Name: @, Value: 185.199.111.153
   ```

3. Create CNAME file in repository:
   ```bash
   echo "cjunker.dev" > CNAME
   git add CNAME
   git commit -m "Add custom domain"
   git push
   ```

4. In GitHub **Settings** → **Pages**:
   - Enter custom domain: `cjunker.dev`
   - Wait for DNS check to pass
   - Enable **Enforce HTTPS**

## Troubleshooting

### Workflow Fails

**Check**: Actions tab for error messages

**Common fixes**:
- Ensure workflow permissions are set correctly
- Run `npm test` locally to catch errors
- Check `.gitignore` isn't excluding necessary files

### 404 Error on Site

**Possible causes**:
- Deployment hasn't completed yet (check Actions tab)
- GitHub Pages source is set to "branch" instead of "Actions"
- Repository is private (GitHub Pages requires public repo on free tier)

**Fix**:
1. Make repository public (Settings → Danger Zone → Change visibility)
2. Or upgrade to GitHub Pro for private Pages

### Tests Pass Locally But Fail in CI

**Check**:
- Node.js version mismatch
- Missing dependencies in `package.json`

**Fix**: Update workflow to match local Node.js version

## Verification Checklist

After setup, verify:

- [ ] Workflow completes successfully in Actions tab
- [ ] Site is accessible at GitHub Pages URL
- [ ] All sections load (hero, about, tech-radar, projects, resume, contact)
- [ ] Links work (resume downloads, GitHub links)
- [ ] Mobile responsive (test on phone or browser dev tools)
- [ ] HTTPS is enforced
- [ ] Custom domain works (if configured)

## Updating the Site

Every push to `master` triggers automatic deployment:

```bash
# Make changes to index.html or styles.css
git add .
git commit -m "Update content"
git push origin master

# Check Actions tab to monitor deployment
```

Changes go live in 1-2 minutes after workflow completes.

---

**Need Help?** See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed troubleshooting.
