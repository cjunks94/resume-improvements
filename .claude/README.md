# Claude Code Project Guide

## Project Overview

**Type**: Portfolio Website + Resume Repository
**Primary Goal**: Showcase software engineering expertise for senior-level roles
**Live Site**: https://cjunker.dev
**Repository**: https://github.com/cjunks94/resume-improvements

## Quick Context

This is Christopher Junker's professional portfolio site and career development repository. The site is deployed via GitHub Pages with automated CI/CD.

### Key Facts
- **Owner**: Christopher Junker (cjunks94)
- **Role**: Senior Software Engineer @ 2U (7+ years)
- **Expertise**: Go, Ruby/Rails, Kubernetes, AWS, Datadog observability
- **Target**: Senior engineering roles at companies like Datadog
- **Domain**: cjunker.dev (custom domain configured)

## Project Structure

```
.
├── index.html              # Main portfolio page
├── styles.css              # Custom styling
├── tech-radar.csv          # Technology expertise data
├── DEPLOYMENT.md           # Deployment guide
├── .github/workflows/      # CI/CD automation
├── tests/                  # Validation tests
├── projects/               # Code demonstrations
├── blog-posts/             # Technical writing
└── resume-versions/        # Resume iterations
```

## Development Workflow

### Running Locally

```bash
npm install        # Install dependencies
npm test           # Run validation tests
npm run lint       # Run HTML/CSS linters
npm run serve      # Local preview at :8000
```

### Deploying Changes

```bash
git add .
git commit -m "description"
git push origin master
# GitHub Actions automatically tests & deploys
```

## Working with GitHub Issues

**Task Management**: Use GitHub Issues instead of TODO.md

### Creating Issues
```bash
gh issue create --title "Task title" --body "Description" --label "enhancement"
```

### Common Labels
- `enhancement`: New features or improvements
- `bug`: Something isn't working
- `documentation`: Documentation updates
- `portfolio`: Portfolio site updates
- `testing`: Test-related tasks

### Checking Issues
```bash
gh issue list
gh issue view <number>
```

## Key Constraints

### Time Budget
- Most tasks: 1-8 hours
- Site must remain fast and simple
- Prefer static content over heavy frameworks

### Technical Constraints
- **GitHub Actions free tier**: 2,000 minutes/month
- **GitHub Pages**: Static hosting only
- **Custom domain**: Already configured (cjunker.dev)

### Code Quality Standards
- All HTML must pass HTMLHint
- All CSS must pass Stylelint
- All tests must pass before deployment
- Use BEM naming for CSS classes
- Semantic HTML5 required

## Common Tasks

### Adding a New Section to Portfolio

1. Update `index.html` with new section (give it unique `id`)
2. Add corresponding styles in `styles.css`
3. Update `tests/validate.js` to check for new section
4. Test locally: `npm test`
5. Commit and push

### Updating Tech Radar

1. Edit `tech-radar.csv`
2. Update `TECH_RADAR.md` if adding new categories
3. Consider visualization options (link to tools in docs)

### Adding a Project

1. Create project directory under `projects/`
2. Include README.md with runnable examples
3. Add project card to `index.html` projects section
4. Update links in portfolio

### Writing Blog Posts

1. Create markdown file in `blog-posts/`
2. Add link from portfolio site if publishing
3. Consider syndicating to dev.to, Medium, or LinkedIn

## Important Files

### For Claude to Read First
- `.claude/README.md` (this file)
- `CLAUDE.md` (project-specific guidelines)
- `README.md` (public-facing overview)
- `DEPLOYMENT.md` (deployment specifics)

### Configuration Files
- `package.json` - NPM scripts and dependencies
- `.htmlhintrc` - HTML linting rules
- `.stylelintrc.json` - CSS linting rules
- `.github/workflows/test-and-deploy.yml` - CI/CD pipeline

### Testing
- `tests/validate.js` - Section presence validation
- `tests/check-links.js` - Link checking

## Project Philosophy

### Authenticity First
- Only showcase real projects and achievements
- Quantify impact with metrics where possible
- No fabricated credentials or experience

### Portfolio Quality
- Code should be clean, well-documented
- Prefer demonstrable results over perfection
- Time-boxed tasks to maintain momentum

### Progressive Enhancement
- Start simple, add complexity only when needed
- Static HTML/CSS before adding JavaScript
- Optimize for maintainability and speed

## Owner's Background

### Strengths
- Deep Rails/Ruby expertise (7+ years production)
- AWS infrastructure (EC2, S3, RDS, Kubernetes, CloudWatch)
- Production observability (Datadog APM, distributed tracing)
- On-call/SRE experience (SLO monitoring, incident response)

### Growth Areas
- Public Go projects (addressed with go-sqs-ui, sf-debug-service)
- Event streaming (RabbitMQ demo in projects/)
- AI/ML for operations (exploring)
- Public technical writing (blog-posts/ ready)

### Career Goals
- Senior+ roles at observability/infrastructure companies
- Focus on distributed systems, Kubernetes, event streaming
- Build reputation through open source and technical writing

## Context for Common Questions

### "What's the target audience for this site?"
- Primary: Technical recruiters and hiring managers
- Secondary: Engineering peers reviewing portfolio
- Focus: Senior-level positions (7+ years experience)

### "What technologies should we prioritize?"
Match Datadog's stack and industry trends:
- Go (microservices, tools)
- Kubernetes/Helm (orchestration)
- Event streaming (Kafka, RabbitMQ)
- Observability (metrics, tracing, logging)
- Distributed systems patterns

### "How technical should content be?"
- Portfolio site: Accessible to non-technical recruiters
- Project READMEs: Technical depth for engineers
- Blog posts: Educational, balanced for mixed audiences

## Git Workflow

### Branches
- `master` - main branch (auto-deploys to production)
- Feature branches welcome for major changes

### Commit Messages
Use semantic prefixes:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation
- `style:` - Formatting, CSS changes
- `refactor:` - Code restructuring
- `test:` - Test additions/changes
- `chore:` - Maintenance tasks

### Pull Requests
- Optional for this repo (direct commits to master allowed)
- Recommended for major refactors or experiments

## Debugging

### CI/CD Failures
```bash
gh run list           # Check recent workflow runs
gh run view <id>      # View specific run logs
npm test              # Run tests locally first
npm run lint          # Check linting locally
```

### Site Not Updating
1. Check GitHub Actions completed successfully
2. Clear browser cache (Cmd+Shift+R)
3. Check DNS propagation: `dig cjunker.dev`
4. Verify CNAME file exists

### Tests Failing
```bash
npm run test:sections  # Check section validation
npm run test:links     # Check link validation
npm run lint:html      # HTML linting
npm run lint:css       # CSS linting
```

## Future Enhancements (Ideas)

- Interactive tech radar visualization
- Blog integration (RSS feed)
- Project filtering/search
- Dark mode toggle
- Analytics integration (privacy-focused)
- Performance monitoring (Lighthouse CI)

## Resources

### Documentation
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Pico CSS](https://picocss.com/) - Base framework used

### Tools
- [HTMLHint](https://htmlhint.com/) - HTML linter
- [Stylelint](https://stylelint.io/) - CSS linter
- [GitHub CLI](https://cli.github.com/) - Issue management

---

**Last Updated**: November 2025
**Maintained By**: Christopher Junker with Claude Code assistance
