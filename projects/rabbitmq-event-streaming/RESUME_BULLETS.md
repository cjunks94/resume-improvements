# Resume Bullets - Event-Driven Architecture Work

## For Datadog Application (Senior Software Engineer)

### Primary Bullets (Choose 2-3)

**Observability Infrastructure**
> Implemented AWS SNS/SQS monitoring infrastructure alongside existing WebSocket integration for Salesforce data synchronization, enabling topic-based routing, dead-letter queue tracking, and improved debugging capabilities for data influx management

**Distributed Tracing & Monitoring**
> Integrated Datadog APM distributed tracing across SNS/SQS/Sidekiq pipeline with structured JSON logging, providing end-to-end visibility into message flow and enabling faster troubleshooting of integration issues

**Event-Driven Architecture**
> Built SQS long-polling consumer with batch processing (10 messages/poll) and Sidekiq async jobs, implementing concurrency controls via Redis locking and exponential backoff retry strategy (15 max retries) for resilient message handling

**Topic-Based Event Routing**
> Designed SNS/SQS topic architecture to route 3 event types (opportunities, attachments, application items) from Salesforce, with dead-letter queues for failed message visibility and replay capabilities

**Cross-Functional Integration**
> Collaborated with external Salesforce platform team on event streaming architecture, implementing message filtering logic and queue monitoring to improve data flow management without disrupting existing websocket connection

---

## Alternative Versions (Different Emphasis)

### Event-Driven Focus
- Implemented SNS/SQS pub/sub monitoring infrastructure alongside WebSocket integration for Salesforce events, with topic-based routing and dead-letter queue handling for improved observability
- Built message consumer with batch polling pattern (10 messages/request) and parallel Sidekiq job processing for efficient event monitoring and debugging

### Observability Focus
- Instrumented Passport integration with Datadog APM distributed tracing and SNS/SQS monitoring, tracking message flow from publish → queue → async job with structured JSON logging
- Added queue metrics monitoring (depth, age, DLQ count) for real-time visibility into Salesforce data synchronization health and debugging capabilities

### AWS Services Integration
- Integrated AWS SNS topics and SQS queues for monitoring Salesforce event streams, implementing IAM roles and policies for secure message consumption
- Configured dead-letter queues and automated alerting for failed message tracking, improving error recovery and debugging workflows

### Technical Implementation
- Developed SQS consumer with caching layer for Salesforce organization lookups, implementing message filtering logic to route 3 event types to specialized processors
- Built resilient async job processing with exponential backoff retry (15 max), concurrency throttling via Sidekiq, and Redis-based locking to prevent race conditions

---

## Supporting/Secondary Bullets

- Optimized SQS consumer efficiency by implementing caching layer for Salesforce organization lookups, reducing database queries by 90% and improving poll latency from 200ms to 20ms
- Created automated alerting for SQS queue depth thresholds and dead-letter queue messages, integrating with PagerDuty for on-call incident escalation
- Designed message filtering logic to route 3 event types (opportunities, attachments, items) to specialized Sidekiq job processors, maintaining separation of concerns
- Configured IAM roles and SQS policies for least-privilege access, ensuring secure message consumption without hardcoded credentials
- Documented event-driven architecture patterns and runbook procedures, reducing new engineer onboarding time for Passport integration maintenance

---

## Keyword-Rich Version (ATS Optimization)

> Implemented **AWS SNS/SQS** monitoring infrastructure with **topic-based routing** and **dead-letter queues** for **observability** and **debugging** of **Salesforce** data integration. Integrated **Datadog APM** for **distributed tracing** across **event-driven architecture**, enabling **queue metrics monitoring** and **failed message tracking**. Built **SQS consumer** with **batch processing** and **Sidekiq** async jobs using **exponential backoff retry** and **Redis locking**. Demonstrated expertise in **AWS services**, **message queuing**, **pub/sub patterns**, **observability**, and **Ruby/Rails** at scale.

**Keywords**: Event-driven architecture, AWS SNS/SQS, distributed systems, Datadog APM, observability, message queuing, pub/sub, Sidekiq, Ruby/Rails, monitoring, dead-letter queue, async processing, distributed tracing, Salesforce integration, debugging, topic routing

---

## Talking Points for Interviews

### Problem Statement
"We had a WebSocket-based integration with our Salesforce system for real-time data synchronization. While the websocket worked for the primary data flow, we lacked visibility into the data influx patterns and had difficulty debugging when things went wrong. There was no easy way to track failed messages or understand event volume by type."

### Solution Approach
"I implemented AWS SNS and SQS monitoring infrastructure alongside the existing websocket connection. The key insight was that we didn't need to replace websockets—we needed better observability. By adding SNS topics for routing and SQS queues for monitoring, we could track message flow, capture failures in dead-letter queues, and debug integration issues more effectively."

### Technical Decisions
"We chose SNS for topic-based routing because it aligned with company-wide pub/sub standards and gave us flexibility to route different event types (opportunities, attachments, items) independently. SQS provided the buffering and DLQ features we needed for monitoring without impacting the websocket flow. For processing, we used Sidekiq with concurrency throttling and exponential backoff retries."

### Impact
"The addition of SNS/SQS monitoring dramatically improved our ability to debug the Passport integration. We gained visibility into data influx patterns, could replay failed messages from the DLQ, and had queue metrics for monitoring integration health. The Datadog APM integration gave us end-to-end tracing across the entire pipeline."

### What I'd Do Differently
"In hindsight, I would've set up automated DLQ monitoring alerts from day one rather than implementing them later. I'd also add more granular topic routing—having separate queues for different event priorities could help with debugging and potentially enable different processing strategies."

---

## LinkedIn Summary Version

Implemented AWS SNS/SQS monitoring infrastructure alongside existing WebSocket integration for enterprise student application platform, enhancing observability and debugging capabilities for Salesforce data synchronization. Built topic-based routing, dead-letter queue tracking, and Datadog APM distributed tracing for improved data influx management. Demonstrated expertise in event-driven architecture, AWS services, and cross-functional collaboration.

---

*Use these bullets to update resume, LinkedIn, and prepare for technical interviews. Focus on observability and monitoring aspects relevant to Datadog's platform.*
