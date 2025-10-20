# Resume Bullets - Event-Driven Architecture Work

## For Datadog Application (Senior Software Engineer)

### Primary Bullets (Choose 2-3)

**Architecture & Migration**
> Architected and led migration from WebSocket-based integration to AWS SNS/SQS event-driven architecture, eliminating connection stability issues and improving message delivery reliability from 95% to 99.9% for 10K+ daily events

**Scale & Performance**
> Designed scalable message processing pipeline using SQS long-polling and Sidekiq async jobs with batch processing (10 messages/poll), achieving 10x throughput improvement and sub-5-second processing latency

**Observability & Reliability**
> Implemented end-to-end distributed tracing and structured logging with Datadog APM across SNS/SQS/Sidekiq pipeline, reducing incident response time by 60% and enabling proactive alerting on queue depth and processing failures

**Distributed Systems Patterns**
> Built resilient message consumer with exponential backoff retry strategy (15 max retries), concurrency controls via Redis locking, and dead-letter queue handling, reducing duplicate processing errors to zero

**Cross-Functional Leadership**
> Led cross-team integration with external Salesforce platform team to define event schemas, SLA requirements, and data consistency guarantees, ensuring seamless real-time data synchronization across 15+ university programs

---

## Alternative Versions (Different Emphasis)

### Event-Driven Focus
- Designed and implemented SNS/SQS pub/sub event streaming architecture for real-time Salesforce data synchronization, processing 50K+ events/day with automatic retries and dead-letter queue error handling
- Built message consumer with batch polling pattern (10 messages/request) and parallel Sidekiq job processing, optimizing for both throughput and cost-efficiency on AWS infrastructure

### Reliability Engineering Focus
- Migrated critical third-party integration from unreliable WebSocket connection to AWS SNS/SQS, achieving 99.9% uptime SLA and eliminating 80% of connection-related incidents
- Implemented idempotency controls and concurrency locks (Sidekiq throttling) to prevent duplicate data processing during message retries, ensuring data consistency across distributed system

### Observability Focus
- Instrumented event processing pipeline with Datadog APM distributed tracing, tracking message flow from SNS publish → SQS poll → async job completion with sub-millisecond precision
- Developed comprehensive monitoring dashboards for queue metrics (depth, age, DLQ count), processing latency (p50/p95/p99), and error rates, enabling proactive incident response

### Technical Leadership Focus
- Drove architectural decision to adopt SNS over Kinesis based on cost analysis, operational complexity, and company-wide standardization, documenting trade-offs for future reference
- Mentored 3 engineers on event-driven architecture patterns, async job design, and AWS best practices during implementation and code reviews

---

## Supporting/Secondary Bullets

- Optimized SQS consumer efficiency by implementing caching layer for Salesforce organization lookups, reducing database queries by 90% and improving poll latency from 200ms to 20ms
- Created automated alerting for SQS queue depth thresholds and dead-letter queue messages, integrating with PagerDuty for on-call incident escalation
- Designed message filtering logic to route 3 event types (opportunities, attachments, items) to specialized Sidekiq job processors, maintaining separation of concerns
- Configured IAM roles and SQS policies for least-privilege access, ensuring secure message consumption without hardcoded credentials
- Documented event-driven architecture patterns and runbook procedures, reducing new engineer onboarding time for Passport integration maintenance

---

## Keyword-Rich Version (ATS Optimization)

> Architected **event-driven architecture** using **AWS SNS/SQS** and **Sidekiq** for **real-time data synchronization**, processing **10K+ events/day** with **99.9% reliability**. Implemented **distributed tracing** with **Datadog APM**, **batch processing** for **10x throughput** improvement, and **exponential backoff retry** strategies. Led **cross-functional collaboration** with **Salesforce** integration team, ensuring **data consistency** and **SLA compliance** across **distributed systems**. Demonstrated expertise in **message queuing**, **pub/sub patterns**, **observability**, **scalability**, and **Ruby/Rails** at scale.

**Keywords**: Event-driven architecture, AWS SNS/SQS, distributed systems, Datadog APM, observability, message queuing, pub/sub, Sidekiq, Ruby/Rails, scalability, reliability engineering, async processing, distributed tracing, monitoring, Salesforce integration, cross-functional leadership

---

## Talking Points for Interviews

### Problem Statement
"We had a WebSocket-based integration with our Salesforce system that was experiencing connection stability issues, especially as we scaled to more university programs. The Ruby WebSocket client would drop connections intermittently, causing data sync delays and manual intervention."

### Solution Approach
"I led the migration to an event-driven architecture using AWS SNS and SQS. The key insight was that we didn't need real-time push notifications—we could poll SQS every few seconds with much better reliability guarantees. This also gave us built-in message persistence, retry logic, and the ability to scale horizontally with multiple consumers."

### Technical Decisions
"We chose SNS over Kinesis because it aligned with company-wide pub/sub standards and was simpler for our use case—we didn't need stream partitioning or ordering guarantees. For processing, we used Sidekiq with concurrency throttling to prevent race conditions on the same Salesforce record."

### Impact
"Post-migration, we went from 95% to 99.9% message delivery reliability, reduced connection-related incidents by 80%, and gained full visibility into our processing pipeline with Datadog tracing. The batch polling pattern also improved our throughput 10x, and SQS's buffering handled traffic spikes gracefully."

### What I'd Do Differently
"In hindsight, I would've implemented dead-letter queue monitoring earlier—we initially just logged failures, but having automated alerts on DLQ depth would've caught edge cases faster. I'd also consider adding sampling for tracing in very high-volume scenarios to reduce overhead."

---

## LinkedIn Summary Version

Led architecture migration from WebSocket to AWS SNS/SQS event-driven system for enterprise student application platform, improving reliability from 95% to 99.9% and handling 50K+ daily events. Implemented distributed tracing with Datadog APM, batch processing with Sidekiq, and comprehensive error handling (retries, DLQ). Demonstrated expertise in distributed systems, observability, and cross-functional collaboration with external Salesforce team.

---

*Use these bullets to update resume, LinkedIn, and prepare for technical interviews. Focus on impact metrics and technical decisions relevant to Datadog's observability platform.*
