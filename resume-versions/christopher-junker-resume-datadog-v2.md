# Christopher Junker
**Senior Software Engineer | Full-Stack & Distributed Systems Specialist**

631-827-5831 | cjunks94@gmail.com | GitHub | LinkedIn
Brooklyn, NY | Open to NYC-based roles (e.g., Datadog NY)

## Professional Summary

Accomplished Senior Software Engineer with 7+ years building scalable, observable web applications at 2U, processing high-volume user data for 10,000+ users. Expertise in Ruby on Rails, React, AWS/Kubernetes, and event-driven architectures; implemented AWS SNS/SQS monitoring infrastructure with Datadog APM and Helm-based deployments. Led migrations and optimizations reducing latency by 33% and test times by 50%. Passionate about distributed systems, observability at scale, and infrastructure as code. Seeking to drive innovation at Datadog, leveraging experience in event streaming, distributed tracing, Kubernetes orchestration, and cross-team leadership to enhance cloud-scale platforms.

## Technical Skills

**Languages & Frameworks:** Ruby, Ruby on Rails, JavaScript/ES6+, React, Redux, Python, Go (introductory projects), Java

**Databases & Observability:** MySQL, PostgreSQL, MongoDB, Elasticsearch, Datadog APM (distributed tracing, deployment tracking), PaperTrail (audit logging)

**Cloud & DevOps:** AWS (EC2, S3, Lambda, CloudWatch, SNS, SQS, Secrets Manager), Docker, Kubernetes, Helm, ArgoCD, Terraform (IaC), CI/CD (Jenkins/GitHub Actions), Redis

**Other:** Git, Shell Scripting, Event Streaming (Kafka-like), StreamSets, Unity (game-web integration), AI/ML Tools

## Professional Experience

### 2U, Brooklyn, NY
**Senior Software Engineer** (Promoted August 2022 – Present)
**Software Engineer** (August 2018 – July 2022)

- Integrated Datadog deployment tracking with unified service tagging (environment, service, version) in Helm charts, enabling release-level observability and correlation between deployments, logs, and application performance metrics across microservices architecture.

- Developed and maintained Helm charts for Kubernetes deployment managing multiple services (web, job queue, Passport consumer, secrets sidecar) with rolling update strategies, liveness/readiness probes, and resource limits for high-availability production environments.

- Implemented AWS SNS/SQS monitoring infrastructure alongside existing WebSocket integration for Salesforce data synchronization, enabling topic-based routing, dead-letter queue tracking, and improved debugging capabilities for data influx management across 15+ university programs.

- Integrated Datadog APM distributed tracing across SNS/SQS/Sidekiq event processing pipeline with structured JSON logging, providing end-to-end visibility into message flow and enabling faster troubleshooting of integration issues.

- Implemented comprehensive audit trail using PaperTrail gem across 10+ models with automated whodunnit tracking in all controllers, enabling full versioning history and compliance auditing for user actions and data modifications.

- Configured Redis for dual-purpose caching and Sidekiq job queue with separate database namespaces, optimizing performance for application caching and asynchronous job processing in Kubernetes environment.

- Architected multi-year data migration from legacy Python/MongoDB to Rails/MySQL, ingesting billions of events with zero downtime; integrated Elasticsearch for real-time search/indexing, enabling 50% faster admin queries and supporting scalable observability for user analytics.

- Built and maintained data pipelines using StreamSets/AWS for ETL on sensitive user data; integrated Kafka-like streaming for real-time anomaly detection, processing 1M+ daily events and aligning with distributed systems principles for cloud migration scalability.

- Led performance optimization of React frontend handling high-traffic forms (10K+ concurrent users), implementing async data loading and caching; reduced initial page loads from 3s to 2s (33% improvement), minimizing outliers during peak loads via AWS Lambda edge computing.

- Optimized CI/CD pipelines with parallel testing in Kubernetes, halving suite runtime from 45min to 22min; mentored 5 junior engineers on Docker and Kubernetes best practices, boosting team velocity by 25% and reducing production incidents through automated monitoring alerts.

- Designed and deployed draft/publishing workflow for CMS, cloning production instances for safe edits; collaborated with product teams to roll out AI-assisted content validation (using basic ML models), preventing deployment errors and ensuring 99.9% uptime for user-facing content.

- Implemented secure AWS Secrets Manager integration with Kubernetes persistent volumes and dedicated ATM (AWS Token Manager) sidecar for automatic credential rotation, managing database passwords, API tokens, and third-party service credentials across multiple environments.

- Directed cross-functional initiatives, including shell-scripted MongoDB access for compliance audits; fostered team cohesion through weekly tech talks on emerging tools (e.g., Go for microservices), resulting in 2 adopted prototypes for internal tools.

## Education

**Villanova University, Villanova, PA**
B.S. in Computer Science (Minor: Business), 2017

**Flatiron School**
Full-Stack Web Development Certificate (Ruby on Rails, JavaScript), 2018

## Technical Projects (Open-Source & Professional Highlights)

**Observable Search Engine (Elasticsearch/Rails):** Developed admin-facing indexing tool for dynamic lists; searchable by 1K+ non-admin users. Deployed on AWS/K8s; reduced selection time by 60%. GitHub: [link] | Tech: Rails, Elasticsearch, React.

**Async Data Pipeline Migrator (Python/AWS):** Automated legacy-to-modern data transfer for 500K+ records; incorporated basic AI (rule-based anomaly detection) to flag inconsistencies. Halved migration errors. GitHub: [link] | Tech: Python, StreamSets, Lambda.

**Performance Tuning Dashboard (React/AWS CloudWatch):** Prototype for visualizing load metrics; integrated Unity for interactive sims. Cut dev debugging time by 40%. GitHub: [link] | Tech: React, AWS, JavaScript.
