# Go Projects Analysis - Production Tools

**Date**: October 20, 2025
**Purpose**: Document real Go projects for resume

---

## 1. Go SQS UI - AWS Queue Management Tool

**GitHub**: https://github.com/cjunks94/go-sqs-ui
**Status**: Production-ready with CI/CD

### Technical Overview

**Architecture:**
- **Backend**: Go 1.21+ with Gorilla Mux router, AWS SDK v2
- **Frontend**: Vanilla JavaScript (ES6+), modular architecture
- **Real-time**: WebSocket updates for live message monitoring
- **Deployment**: Single binary with embedded static assets
- **Testing**: 230+ tests (112 frontend Vitest + backend Go tests)

**Key Features:**
- AWS SQS queue management with tag-based filtering
- Dead Letter Queue (DLQ) monitoring and retry capabilities
- Real-time WebSocket updates for message flow
- Message export (JSON/CSV), pagination, batch operations
- Keyboard navigation and shortcuts
- Demo mode for development/testing without AWS
- Queue statistics dashboard

**Technical Highlights:**
- Go embedded assets (single binary deployment)
- Gorilla WebSocket for real-time updates
- AWS SDK credential chain (no hardcoded secrets)
- Comprehensive test coverage (80%+ backend, 85%+ frontend)
- CI/CD with GitHub Actions, CodeCov integration
- golangci-lint with 25+ linters
- ESLint 9 with modern flat config

**Production Use:**
- DLQ debugging in staging/production environments
- Queue monitoring for 15+ university programs
- Tag filtering (businessunit, product, env)
- One-click message retry from DLQ to source queue

### Resume-Ready Bullets

**Option 1 (Full Feature Focus):**
> Built Go-based AWS SQS management UI with WebSocket real-time updates, handling queue operations, dead-letter queue monitoring, and message retry capabilities; deployed as single binary with embedded frontend assets serving 15+ production programs

**Option 2 (Technical Depth):**
> Developed production SQS monitoring tool in Go using Gorilla Mux and AWS SDK v2, implementing WebSocket-based real-time message updates, tag-based queue filtering, and comprehensive testing (230+ tests, 80%+ coverage) with CI/CD pipeline

**Option 3 (Observability Focus - for Datadog):**
> Created AWS SQS observability dashboard in Go with vanilla JavaScript frontend, providing real-time queue monitoring, DLQ tracking, message export (JSON/CSV), and keyboard-driven navigation for operational debugging across multiple environments

---

## 2. SF Debug Service - Salesforce Data Validation Tool

**GitHub**: https://github.com/cjunks94/sf-debug-service
**Status**: Production deployment in Kubernetes

### Technical Overview

**Architecture:**
- **Backend**: Go service with Gin router
- **Database**: Read-only MySQL connection to AMT production database
- **Frontend**: React SPA (TypeScript, Vite)
- **Deployment**: Kubernetes pod sharing ATM sidecar for secrets
- **API**: RESTful endpoints for data comparison

**Key Features:**
- Compare AMT application data with Salesforce records
- Validate Salesforce field mappings against actual SF schema
- Debug sync discrepancies between AMT and Salesforce
- View exact payload AMT would send to SF API
- Mapping validation per program

**Technical Highlights:**
- Go with Gin web framework
- Read-only database user (security-first)
- Shares secrets with ATM sidecar via Kubernetes volume mounts
- React frontend with TypeScript
- GitHub Actions CI/CD (self-hosted runner)
- Race condition detection in tests
- Kubernetes deployment alongside AMT Rails application

**Production Use:**
- Debug Salesforce sync issues in real-time
- Validate mapping configurations before deployment
- Compare actual vs expected Salesforce data
- Identify field mapping discrepancies
- Used by engineering team for troubleshooting

### Resume-Ready Bullets

**Option 1 (Kubernetes/Infrastructure Focus):**
> Built Go-based Salesforce debugging service deployed in Kubernetes, sharing ATM sidecar for secret management with read-only MySQL access to production database; provides REST API and React UI for validating data consistency across systems

**Option 2 (Data Validation Focus):**
> Developed Salesforce data validation tool in Go (Gin framework) with React frontend, comparing AMT application records against Salesforce API to debug sync discrepancies and validate field mappings across 15+ university programs

**Option 3 (Full Stack Focus):**
> Created full-stack debugging service (Go backend, React/TypeScript frontend) for Salesforce integration, implementing read-only database access, REST API for data comparison, and Kubernetes deployment with shared secret management

---

## Combined Impact for Resume

### Technical Skills Demonstrated

**Go Proficiency:**
- Web servers (Gorilla Mux, Gin)
- AWS SDK v2 integration
- WebSocket implementation (Gorilla WebSocket)
- Embedded assets (Go embed package)
- Database connections (MySQL)
- REST API design
- Comprehensive testing

**Frontend Skills:**
- Vanilla JavaScript (modular ES6+)
- React with TypeScript
- Vitest testing framework
- WebSocket client implementation
- Responsive UI design

**DevOps/Infrastructure:**
- GitHub Actions CI/CD
- Docker containerization
- Kubernetes deployment
- AWS credential management
- Secret management (ATM sidecar pattern)
- Self-hosted CI runners

**Observability/Monitoring:**
- Real-time queue monitoring
- DLQ tracking and alerting
- WebSocket-based updates
- Message export and analysis
- Data consistency validation

### Addressing Resume Gaps

**Before:** "Go (introductory projects)" - 🚫 Weak signal
**After:** Two production Go tools with:
- ✅ Real production use
- ✅ 230+ tests
- ✅ CI/CD pipelines
- ✅ Kubernetes deployment
- ✅ AWS integration
- ✅ WebSocket real-time features
- ✅ GitHub repos with badges

**Score Improvement:** +2.5 points (6.5 → 9.0 for Datadog role)

---

## Recommended Resume Integration

**Add to Professional Experience (2U):**
1. SQS UI bullet (monitoring/observability)
2. SF Debug Service bullet (data validation)

**Add to Technical Projects Section:**
- Update "Go (introductory projects)" → "Go (production tools)"
- Add both projects with GitHub links
- Include badges (CI, coverage, Go Report Card)

**Technical Skills Update:**
- Go → Go (Gorilla Mux, Gin, AWS SDK, WebSocket)
- Add "Real-time systems" or "WebSocket" to skills

---

## Next Steps

1. ✅ Add GitHub links to resume
2. ✅ Create 2-3 resume bullets
3. ⚠️ Ensure repos are public (or ready to share)
4. ⚠️ Add CI badges to READMEs if missing
5. ⚠️ Pin repos on GitHub profile

---

*Both projects demonstrate production-quality Go development with real business value.*
