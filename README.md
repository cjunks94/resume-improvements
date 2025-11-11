# Resume Improvement Project

**Target Role**: Senior Software Engineer (Datadog)
**Project Start**: October 20, 2025
**Application Target**: October 27, 2025

## Live Portfolio

**Production**: [cjunker.dev](https://cjunker.dev) - Deployed from `master` branch
**Staging**: [staging.cjunker.dev](https://staging.cjunker.dev) - Deployed to dedicated repository
**Tech Stack**: HTML5, CSS3, GitHub Pages, GitHub Actions, SSH Deploy Keys
**Status**: Multi-repository architecture with bulletproof SSL + isolated environments

## Analytics

**Dashboard**: [umami.cjunker.dev](https://umami.cjunker.dev) - Self-hosted Umami analytics

**Stack**:
- **Frontend**: Privacy-friendly tracking script (no cookies, GDPR compliant)
- **Backend**: Umami v2.13.2 in Docker (82MB Alpine-based image)
- **Database**: PostgreSQL 16 Alpine
- **Hosting**: Railway.app (free tier, $0/month)
- **Security**: Cloudflare Access with GitHub OAuth (zero-trust)
- **Features**: Custom event tracking, heatmaps, tech radar interactions

**Deployment**:
```yaml
→ 82 MB container | 1.8s startup | Auto-HTTPS | Daily backups
→ Zero maintenance | $0/month hosting | SOC2-ready
```

**Custom Events Tracked**:
- Tech Radar: Click interactions, legend toggles
- Downloads: Resume, CSV exports, documentation
- Navigation: Page views, session analytics
- Performance: Load times, error tracking

See [umami/RAILWAY_DEPLOYMENT.md](umami/RAILWAY_DEPLOYMENT.md) for deployment guide.

## Project Overview

This repository tracks strategic improvements to my software engineering resume and portfolio to target senior-level positions at companies like Datadog. The focus is on demonstrating real, actionable achievements in distributed systems, observability, and cloud-native technologies.

## Objectives

1. **Technical Depth**: Showcase expertise in Go, Kubernetes, event streaming (Kafka/RabbitMQ), and observability tools
2. **Leadership**: Document mentoring, cross-team initiatives, and architectural decisions
3. **Innovation**: Build prototype projects demonstrating forward-thinking (AI/ML, real-time monitoring)
4. **Visibility**: Increase public presence through open-source contributions, blog posts, and technical networking
5. **ATS Optimization**: Align resume keywords and formatting with target job descriptions

## Repository Structure

```
resume-improvements/
├── index.html              # Portfolio site homepage
├── styles.css              # Custom styling
├── tech-radar.csv          # Technology expertise radar
├── DEPLOYMENT.md           # Deployment and custom domain guide
├── README.md               # This file - project overview
├── CLAUDE.md               # Context for Claude Code assistant
├── TODO.md                 # Prioritized task list with deadlines
├── .github/workflows/      # CI/CD automation
│   └── test-and-deploy.yml # Test and deploy pipeline
├── tests/                  # Validation and testing
│   ├── validate.js         # Section presence tests
│   └── check-links.js      # Link validation
├── projects/               # Code demonstrations and prototypes
│   ├── go-microservice/
│   ├── event-streaming/
│   └── ml-anomaly-detection/
├── blog-posts/             # Technical writing and thought leadership
├── certifications/         # Progress on professional certifications
└── resume-versions/        # Tailored resume iterations
```

## Success Metrics

- [ ] Complete 5+ high-impact tasks by October 27, 2025
- [ ] Publish 1-2 technical blog posts or social media threads
- [ ] Create 2-3 demonstrable GitHub projects
- [ ] Establish connections with 3-5 Datadog engineers
- [ ] Submit optimized resume application by October 27, 2025

## Key Technologies

**Current Expertise**: Ruby/Rails, Python, Docker, Kubernetes, AWS, Elasticsearch, MySQL, Redis

**Target Additions**: Go, Kafka/RabbitMQ, Prometheus, distributed tracing, AI/ML monitoring

## Development

### Local Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run linters
npm lint

# Serve locally
npm run serve
# Visit http://localhost:8000
```

### Deployment

The site uses **multi-repository architecture** with automatic CI/CD:

**Production (cjunker.dev):**
```bash
git checkout master
git push origin master
# → Deploys to cjunks94/resume-improvements gh-pages branch
# → Available at https://cjunker.dev
```

**Staging / PR Previews (staging.cjunker.dev):**
```bash
git checkout -b feature/my-feature
git push origin feature/my-feature
# → Deploys to cjunks94/resume-improvements-staging (external repo)
# → Available at https://staging.cjunker.dev
```

**Architecture Benefits:**
- ✅ Separate SSL certificates (no more `NET::ERR_CERT_COMMON_NAME_INVALID`)
- ✅ Clean environment isolation
- ✅ Secure SSH deploy key authentication
- ✅ Industry-standard pattern (used by Stripe, Vercel, etc.)
- ✅ Automatic PR preview deployments
- ✅ Zero history bloat with force_orphan

### CI/CD Pipeline
- **Production:** `master` → https://cjunker.dev
- **Staging / PR Previews:** All branches → https://staging.cjunker.dev
- **Manual deploy:** Workflow dispatch with environment selector
- **External staging repo:** Bulletproof SSL + isolation
- **Build time:** ~45s (GitHub hosted)

See [DEPLOYMENT.md](DEPLOYMENT.md) for:
- Complete deployment workflow
- Multi-repository strategy details
- Rollback strategies
- DNS configuration
- Troubleshooting guide

## Progress Tracking

See [TODO.md](TODO.md) for detailed task list with priorities and deadlines.

## Contact

This is a private repository for personal career development.

---

*Last Updated: November 9, 2025*
