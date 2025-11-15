# Christopher Junker - Tech Radar

## Overview

This tech radar represents my current technology expertise and learning trajectory based on production experience at 2U and personal projects. It's organized using the [Thoughtworks Tech Radar](https://www.thoughtworks.com/radar) model.

## Visualization

You can visualize this tech radar using:

1. **Zalando Tech Radar**: https://radar.thoughtworks.com/
   - Upload `tech-radar.csv` to generate an interactive radar

2. **AOE Tech Radar Builder**: https://www.aoe.com/techradar/index.html
   - Import the CSV for a customizable visualization

3. **Google Sheets**: Import the CSV and create a bubble chart

## Rings Explained

| Ring | Meaning | My Context |
|------|---------|------------|
| **Adopt** | Technologies I confidently use in production and actively recommend | Daily tools with 1-7 years experience; proven in high-scale environments (10K+ users, 1M+ events/day) |
| **Trial** | Technologies I'm actively using with good results; worth pursuing | Production experience but evolving expertise; valuable for specific use cases |
| **Assess** | Technologies I'm exploring to understand their potential | Limited production use; learning phase; considering for future projects |
| **Hold** | Proceed with caution; may be deprecated or problematic | (None currently - all technologies actively used or being evaluated) |

## Quadrants Breakdown

### Languages & Frameworks (6 technologies)
**Adopt**: Go, Ruby on Rails, React, JavaScript/ES6+
**Trial**: TypeScript, Python

**Highlights**:
- **Go**: 230+ tests, production microservices (SQS UI, Salesforce debug service)
- **Ruby on Rails**: 7+ years, 10K+ user platform, full-stack expertise
- **React**: Performance optimization (33% latency reduction), high-traffic forms

### Platforms (5 technologies)
**Adopt**: Kubernetes, Docker, AWS, ArgoCD
**Trial**: Terraform

**Highlights**:
- **Kubernetes**: Helm charts, HPA, rolling updates, multi-service deployments
- **AWS**: EC2, S3, Lambda, CloudWatch, SNS/SQS, Secrets Manager
- **Docker**: CI/CD optimization (50% test runtime reduction)

### Tools (13 technologies)
**Adopt**: Datadog APM, MySQL, Redis, Helm, PaperTrail, Git
**Trial**: Elasticsearch, PostgreSQL, MongoDB, GitHub Actions, StreamSets
**Assess**: Jenkins

**Highlights**:
- **Datadog APM**: Distributed tracing across multi-system architecture, custom dashboards/alerts
- **Redis**: Distributed caching layer, write-through pattern, cross-service optimization
- **Elasticsearch**: 50% faster admin queries, real-time indexing for 1K+ users

### Techniques (11 technologies)
**Adopt**: WebSocket, Distributed Tracing, Circuit Breakers, Retry Logic, HPA, Distributed Caching, REST API Design, SLO/SLA Monitoring, Secrets Management
**Trial**: Event Streaming, Infrastructure as Code
**Assess**: AI/ML for Anomaly Detection (NEW)

**Highlights**:
- **Event Streaming**: Kafka-like architecture for 1M+ daily events, SNS/SQS topic-based routing
- **Circuit Breakers**: Production resilience patterns enabling immediate business action during outages
- **SLO/SLA Monitoring**: Primary on-call engineer, post-mortems, service reliability definitions

## New to This Radar

- **AI/ML for Anomaly Detection** (Assess): Exploring integration with data pipelines for predictive monitoring

## Portfolio Alignment

This tech radar directly supports my **Datadog Senior Engineer** application by showcasing:

✅ **Production Go experience** (SQS UI, Salesforce debug service)
✅ **Event streaming architecture** (SNS/SQS, Kafka-like patterns)
✅ **Comprehensive observability** (Datadog APM, distributed tracing, custom metrics)
✅ **Kubernetes at scale** (Helm, HPA, GitOps with ArgoCD)
✅ **Distributed systems patterns** (circuit breakers, retry logic, distributed caching)
✅ **On-call/SRE expertise** (SLO monitoring, incident response, post-mortems)

## How to Update

When adding new technologies or changing expertise levels:

1. Edit `tech-radar.csv` with new entries
2. Set `isNew=TRUE` for technologies added since last update
3. Move technologies between rings as expertise grows:
   - **Assess → Trial**: After 3+ months of active use
   - **Trial → Adopt**: After production deployment or 6+ months of confident use
4. Add quantifiable achievements to descriptions
5. Re-generate visualization using tools above

## Changelog

### October 2025
- Initial tech radar created based on resume v4
- 35 technologies across 4 quadrants
- Emphasis on production-proven tools (17 "Adopt" technologies)
- Added AI/ML for anomaly detection as emerging area

---

**Last Updated**: October 2025
**Resume Version**: v4 (Datadog-focused)
**GitHub**: github.com/cjunks94
**LinkedIn**: linkedin.com/in/christopher-junker
