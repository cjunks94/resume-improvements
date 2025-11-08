# Decision 003: Tag-Based Deployment Strategy

**Date:** 2025-11-08
**Status:** Proposed
**Deciders:** Christopher Junker, Claude Code
**Related Issues:** TBD
**Related PR:** TBD

## Context

Currently, the portfolio site deploys automatically from the `master` branch to cjunker.dev using GitHub Actions. Every push to master triggers a deployment, which can be problematic for:

1. **Production stability** - Untested changes can accidentally deploy to production
2. **Testing workflow** - No staging environment to test before production
3. **Rollback capability** - No easy way to revert to a previous working version
4. **Release management** - No clear versioning or release history

**Current workflow:**
```
Push to master → Tests run → Deploy to cjunker.dev
```

**Desired workflow:**
```
Push to master → Tests run → No deployment
Create tag v1.0.0 → Deploy to cjunker.dev (production)
Create tag staging-v1.0.0 → Deploy to staging.cjunker.dev (staging)
```

## Decision

**Implement tag-based deployments with separate production and staging environments.**

### Architecture

**Production Environment:**
- Domain: `cjunker.dev`
- Trigger: Git tags matching `v*.*.*` (e.g., `v1.0.0`, `v1.2.3`)
- Deployment branch: `gh-pages-production`
- Source: Tagged commit from master

**Staging Environment:**
- Domain: `staging.cjunker.dev`
- Trigger: Git tags matching `staging-*` (e.g., `staging-v1.0.0`, `staging-latest`)
- Deployment branch: `gh-pages-staging`
- Source: Tagged commit from any branch

### Workflow

1. **Development:**
   ```bash
   git checkout -b feature/new-feature
   # Make changes
   git commit -m "feat: add new feature"
   git push origin feature/new-feature
   ```

2. **Deploy to Staging:**
   ```bash
   git checkout feature/new-feature
   git tag staging-v1.0.0-rc1
   git push origin staging-v1.0.0-rc1
   # → Deploys to staging.cjunker.dev
   ```

3. **Merge to Master:**
   ```bash
   # After testing on staging
   git checkout master
   git merge feature/new-feature
   git push origin master
   ```

4. **Deploy to Production:**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   # → Deploys to cjunker.dev
   ```

## Rationale

### Why Tag-Based Deployments?

1. **Controlled Releases**
   - Only deploy when explicitly tagging
   - Prevents accidental production deployments
   - Clear intent (tag = release)

2. **Version History**
   - Tags provide permanent markers in git history
   - Easy to see what's deployed: `git describe --tags`
   - Rollback is simple: tag an older commit

3. **Staging Environment**
   - Test changes before production
   - Verify mobile responsiveness, accessibility, etc.
   - Share preview links with others

4. **Semantic Versioning**
   - Production tags follow semver (v1.0.0, v1.1.0, v2.0.0)
   - Clear communication of changes (major/minor/patch)
   - Automated changelog generation possible

### Why Separate Branches (gh-pages-production and gh-pages-staging)?

1. **GitHub Pages Limitation**
   - One repo = one primary GitHub Pages site
   - Can't have multiple GitHub Pages sites from same repo directly
   - Solution: Use separate deployment branches

2. **Independent Deployments**
   - Staging and production don't interfere with each other
   - Can deploy different versions simultaneously
   - Production remains stable while testing on staging

3. **Clarity and Organization**
   - Explicit naming: `gh-pages-production` and `gh-pages-staging`
   - No ambiguity about which branch is which
   - Easier onboarding for new contributors

4. **DNS Routing**
   - Main GitHub Pages site (gh-pages-production) → cjunker.dev
   - Staging branch (gh-pages-staging) → staging.cjunker.dev
   - Requires DNS configuration for both domains

## Alternatives Considered

### Option 1: Branch-Based Deployment (Current - Rejected)
**Deploy from master branch**

**Pros:**
- Simple, automatic
- No tagging required

**Cons:**
- Every push to master deploys (no control)
- No staging environment
- No version history
- Risky for production

**Decision:** Rejected - too risky, no staging

### Option 2: Two Separate Repositories (Rejected)
**resume-improvements (prod) + resume-improvements-staging (staging)**

**Pros:**
- Complete isolation
- Separate commit histories
- Easier GitHub Pages setup

**Cons:**
- Code duplication
- Must sync changes between repos
- More complex maintenance
- Doubles git operations

**Decision:** Rejected - unnecessary complexity

### Option 3: External Hosting for Staging (Considered)
**GitHub Pages for prod + Netlify/Vercel for staging**

**Pros:**
- Separate services
- Netlify/Vercel offer great preview features

**Cons:**
- Additional service dependency
- Different deployment processes
- Potential cost (free tiers have limits)
- Inconsistent environments

**Decision:** Rejected - prefer consistency

### Option 4: Tag-Based with Dual Branches (Selected)
**gh-pages-production (prod) + gh-pages-staging (staging) triggered by tags**

**Pros:**
- Single repository
- Consistent workflow
- Version control via tags
- No external dependencies
- Free (GitHub Actions + Pages)
- Clear, explicit branch naming

**Cons:**
- Requires GitHub Actions workflow setup
- DNS configuration for subdomain
- Slightly more complex than branch deployment

**Decision:** **Selected** - best balance of control and simplicity

## Consequences

### Positive
- ✅ Controlled production deployments
- ✅ Staging environment for testing
- ✅ Clear version history with tags
- ✅ Easy rollback (re-tag older commit)
- ✅ No accidental deployments
- ✅ Semantic versioning support

### Negative
- ⚠️ Must remember to tag for deployments
- ⚠️ Extra step in workflow (tag → push tag)
- ⚠️ DNS configuration required for staging subdomain
- ⚠️ GitHub Actions workflow more complex

### Neutral
- 📝 Need to educate team on tagging workflow
- 📝 Document tag naming conventions
- 📝 Consider automated tagging in CI/CD

## Implementation Plan

### Phase 1: GitHub Actions Workflow (2 hours)
- [ ] Create `.github/workflows/deploy-tags.yml`
- [ ] Configure triggers for `v*` and `staging-*` tags
- [ ] Add deployment jobs for gh-pages-production and gh-pages-staging branches
- [ ] Test with sample tags

**Workflow Logic:**
```yaml
on:
  push:
    tags:
      - 'v*'          # Production: v1.0.0
      - 'staging-*'   # Staging: staging-v1.0.0
```

### Phase 2: GitHub Environments (30 min)
- [ ] Create `production` environment in GitHub repo settings
- [ ] Create `staging` environment
- [ ] Configure environment protection rules (optional: require approval for prod)

### Phase 3: DNS Configuration (30 min)
- [ ] Update CNAME file for production (gh-pages-production branch)
- [ ] Add CNAME record for staging.cjunker.dev
- [ ] Update CNAME file in gh-pages-staging branch
- [ ] Test DNS propagation

**DNS Records:**

Production (cjunker.dev):
```
Type: A (already configured)
Name: @
Value: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
```

Staging (staging.cjunker.dev):
```
Type: CNAME
Name: staging
Value: cjunks94.github.io
TTL: 3600
```

### Phase 4: Documentation (1 hour)
- [ ] Update DEPLOYMENT.md with tag workflow
- [ ] Add tagging examples and best practices
- [ ] Document staging environment usage
- [ ] Create release process documentation

### Phase 5: Testing (1 hour)
- [ ] Create test staging tag
- [ ] Verify staging deployment
- [ ] Create test production tag
- [ ] Verify production deployment
- [ ] Test rollback scenario

## Tag Naming Conventions

### Production Tags
Format: `v<major>.<minor>.<patch>[-prerelease]`

Examples:
- `v1.0.0` - Major release
- `v1.1.0` - Minor release (new features)
- `v1.1.1` - Patch release (bug fixes)
- `v2.0.0-beta.1` - Pre-release (optional)

### Staging Tags
Format: `staging-<description>` or `staging-v<version>[-rc]`

Examples:
- `staging-latest` - Always deploy latest master to staging
- `staging-v1.0.0-rc1` - Release candidate 1
- `staging-mobile-fix` - Feature-specific staging
- `staging-2025-11-08` - Date-based staging

## Rollback Strategy

To rollback production:

```bash
# Option 1: Tag an older commit
git checkout <old-commit-sha>
git tag -f v1.0.0  # Force update tag
git push origin v1.0.0 --force

# Option 2: Create new patch tag from old commit
git checkout <old-commit-sha>
git tag v1.0.1
git push origin v1.0.1
```

## Success Criteria

- [ ] Production deploys only from `v*.*.*` tags
- [ ] Staging deploys from `staging-*` tags
- [ ] cjunker.dev serves production site
- [ ] staging.cjunker.dev serves staging site
- [ ] Tests run before deployment
- [ ] GitHub Actions workflow passes
- [ ] Documentation updated
- [ ] Team understands tagging workflow

## Estimated Effort

**Total: 5-6 hours**

Breakdown:
- GitHub Actions workflow: 2 hours
- GitHub environments setup: 30 min
- DNS configuration: 30 min
- Documentation: 1 hour
- Testing and validation: 1-2 hours

## References

- GitHub Pages Docs: https://docs.github.com/en/pages
- GitHub Actions Deployment: https://docs.github.com/en/actions/deployment/about-deployments
- Semantic Versioning: https://semver.org/
- Git Tagging: https://git-scm.com/book/en/v2/Git-Basics-Tagging

## Timeline

- **Proposed:** 2025-11-08
- **Accepted:** TBD
- **Implementation Start:** 2025-11-08
- **Target Completion:** 2025-11-09

## Notes

### GitHub Pages Configuration

After workflow is set up:
1. Go to **Settings → Pages**
2. Keep **Source: GitHub Actions** (current setting)
3. Custom domain remains `cjunker.dev`
4. Staging will use a different approach (separate branch deployment)

### Future Enhancements

- Automated changelog generation from tags
- Slack/email notifications on deployments
- Deployment status badges in README
- Preview environments for PRs (GitHub Environments)

---

**Status Update:**
- 2025-11-08: Decision proposed, implementation in progress
