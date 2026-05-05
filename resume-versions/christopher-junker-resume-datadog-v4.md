# Christopher Junker
**Senior Software Engineer | Full-Stack & Distributed Systems Specialist**

631-827-5831 | cjunks94@gmail.com | [GitHub](https://github.com/cjunks94) | [LinkedIn](https://linkedin.com/in/christopher-junker)
Brooklyn, NY | Open to NYC-based roles (e.g., Datadog NY)

## Professional Summary

Accomplished Senior Software Engineer with 7+ years building scalable, observable web applications at 2U, processing high-volume user data for 10,000+ users. Expertise in Go, Ruby on Rails, React, AWS/Kubernetes, and event-driven architectures; built production Go tools for SQS monitoring and Salesforce debugging with 230+ tests and CI/CD pipelines. Served as primary on-call engineer and team lead, managing production incidents, SLO monitoring, and post-mortem analysis. Built comprehensive Datadog observability infrastructure with custom dashboards, alerts, and distributed tracing across multi-system architecture. Led migrations and optimizations reducing latency by 33% and test times by 50%. Passionate about distributed systems, observability at scale, and infrastructure as code. Seeking to drive innovation at Datadog, leveraging experience in production reliability, event streaming, distributed tracing, Kubernetes orchestration, and real-time monitoring to enhance cloud-scale platforms.

## Technical Skills

**Languages & Frameworks:** Go (Gorilla Mux, Gin, AWS SDK, WebSocket), Ruby, Ruby on Rails, JavaScript/ES6+, React, Redux, TypeScript, Python, Java

**Databases & Observability:** MySQL, PostgreSQL, MongoDB, Elasticsearch, Datadog APM (distributed tracing, custom metrics, dashboards, alerts, deployment tracking), PaperTrail (audit logging), Redis

**Cloud & DevOps:** AWS (EC2, S3, Lambda, CloudWatch, SNS, SQS, Secrets Manager), Docker, Kubernetes, Helm, ArgoCD, Horizontal Pod Autoscaling (HPA), Terraform (IaC), CI/CD (GitHub Actions, Jenkins), WebSocket

**Other:** Git, Event Streaming (Kafka-like), StreamSets, Real-time systems, AI/ML Tools, Resilience Patterns (Circuit Breakers, Retry Logic, Exponential Backoff), Distributed Caching

## Professional Experience

### 2U, Brooklyn, NY
**Senior Software Engineer** (Promoted August 2022 – Present)
**Software Engineer** (August 2018 – July 2022)

- Built production AWS SQS monitoring tool in Go with WebSocket real-time updates, serving 15+ university programs for queue operations, dead-letter queue debugging, and message retry capabilities; deployed as single binary with embedded frontend assets and 230+ tests (80%+ coverage).

- Developed Salesforce data validation service in Go (Gin framework) with React/TypeScript frontend, deployed in Kubernetes sharing ATM sidecar for secret management; provides REST API for comparing AMT records against Salesforce to debug sync discrepancies across production environments.

- Served as primary on-call engineer and team lead for production AMT platform (10,000+ users), responding to critical incidents including API outages and payment integration failures; monitored SLOs/SLAs, wrote post-mortems, and advised on service reliability definitions across microservices ecosystem.

- Built comprehensive Datadog observability infrastructure including custom dashboards, alerts (Redis memory >90%, API performance), and deployment scorecards with unified service tagging (environment, service, version); implemented distributed tracing across multi-system architecture (AMT → SNS/SQS → Sidekiq → external APIs) with custom metrics for endpoint QPR, response time, and compute load.

- Developed and maintained Helm charts for Kubernetes deployment managing multiple services (web, job queue, Passport consumer, secrets sidecar) with rolling update strategies, horizontal pod autoscaling (HPA) based on CPU/memory thresholds, liveness/readiness probes, and resource limits for high-availability production environments.

- Implemented AWS SNS/SQS monitoring infrastructure alongside existing WebSocket integration for Salesforce data synchronization, enabling topic-based routing, dead-letter queue tracking, and improved debugging capabilities for data influx management across 15+ university programs.

- Architected distributed Redis caching layer shared across Rails monolith and microservices ecosystem, implementing write-through cache pattern (Rails writes, services read with API fallback on miss) and separate namespaces for application cache vs. Sidekiq job queue, optimizing cross-service performance.

- Implemented production resilience patterns including circuit breakers for external system integrations enabling immediate business action during outages, and Sidekiq/Celery retry logic with exponential backoff for data synchronization jobs across 15+ university programs.

- Implemented comprehensive audit trail using PaperTrail gem across 10+ models with automated whodunnit tracking in all controllers, enabling full versioning history and compliance auditing for user actions and data modifications.

- Architected multi-year data migration from legacy Python/MongoDB to Rails/MySQL, ingesting billions of events with zero downtime; integrated Elasticsearch for real-time search/indexing, enabling 50% faster admin queries and supporting scalable observability for user analytics.

- Built and maintained data pipelines using StreamSets/AWS for ETL on sensitive user data; integrated Kafka-like streaming for real-time anomaly detection, processing 1M+ daily events and aligning with distributed systems principles for cloud migration scalability.

- Led performance optimization of React frontend handling high-traffic forms (10K+ concurrent users), implementing async data loading and caching; reduced initial page loads from 3s to 2s (33% improvement), minimizing outliers during peak loads via AWS Lambda edge computing.

- Optimized CI/CD pipelines with parallel testing in Kubernetes, halving suite runtime from 45min to 22min; mentored 5 junior engineers on Docker and Kubernetes best practices, boosting team velocity by 25% and reducing production incidents through automated monitoring alerts.

- Implemented secure AWS Secrets Manager integration with Kubernetes persistent volumes and dedicated ATM (AWS Token Manager) sidecar for automatic credential rotation, managing database passwords, API tokens, and third-party service credentials across multiple environments.

- Directed cross-functional initiatives, including shell-scripted MongoDB access for compliance audits; fostered team cohesion through weekly tech talks on emerging tools (e.g., Go for microservices), resulting in 2 adopted prototypes for internal tools.

## Education

**Villanova University, Villanova, PA**
B.S. in Computer Science (Minor: Business), 2017

**Flatiron School**
Full-Stack Web Development Certificate (Ruby on Rails, JavaScript), 2018

## Technical Projects (Open-Source & Production Tools)

**AWS SQS Monitoring UI (Go, WebSocket, Vanilla JS)** | [GitHub](https://github.com/cjunks94/go-sqs-ui)
[![CI](https://github.com/cjunks94/go-sqs-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/cjunks94/go-sqs-ui/actions) [![Go Report](https://goreportcard.com/badge/github.com/cjunks94/go-sqs-ui)](https://goreportcard.com/report/github.com/cjunks94/go-sqs-ui)

Production tool for AWS SQS queue management with real-time WebSocket updates, DLQ monitoring, message export, and tag-based filtering. Built with Go (Gorilla Mux, AWS SDK v2) and modular JavaScript frontend. 230+ tests, 80%+ coverage, single binary deployment with embedded assets. Serves 15+ production programs for queue debugging and operations.

**Salesforce Debug Service (Go, React/TypeScript, Kubernetes)** | [GitHub](https://github.com/cjunks94/sf-debug-service)

Full-stack debugging service for Salesforce integration with Go backend (Gin framework), React/TypeScript UI, and Kubernetes deployment. Validates data consistency between AMT and Salesforce, compares field mappings, and provides REST API for sync debugging. Deployed with shared ATM sidecar, read-only database access, and GitHub Actions CI/CD.

**Observable Search Engine (Elasticsearch/Rails):** Admin-facing indexing tool deployed on AWS/K8s, serving 1K+ users with 60% faster selection times. Tech: Rails, Elasticsearch, React.

**Async Data Pipeline Migrator (Python/AWS):** Automated legacy-to-modern data transfer for 500K+ records with AI-based anomaly detection, reducing migration errors by 50%. Tech: Python, StreamSets, Lambda.
