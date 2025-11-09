# Resume Improvement Project

**Target Role**: Senior Software Engineer (Datadog)
**Project Start**: October 20, 2025
**Application Target**: October 27, 2025

## Live Portfolio

**Production**: [cjunker.dev](https://cjunker.dev) (tag-based deployment)
**Staging**: [staging.cjunker.dev](https://staging.cjunker.dev) (test environment)
**Tech Stack**: HTML5, CSS3, GitHub Pages, GitHub Actions
**Status**: Tag-based deployments with production & staging environments

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

The site uses **branch-based deployments** with automatic CI/CD:

**Production (cjunker.dev):**
```bash
git checkout master
git push origin master
# → Automatically deploys to production
```

**Staging (staging.cjunker.dev):**
```bash
git checkout -b feature/my-feature
git push origin feature/my-feature
# → Automatically deploys to staging
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for:
- Complete deployment workflow
- Branch strategy (master → production, feature → staging)
- Rollback strategies
- DNS configuration
- Troubleshooting guide

## Progress Tracking

See [TODO.md](TODO.md) for detailed task list with priorities and deadlines.

## Contact

This is a private repository for personal career development.

---

*Last Updated: November 8, 2025*
