# Decision Records

This directory contains architectural decisions and implementation plans for the Christopher Junker Portfolio project.

## Purpose

Track significant decisions, their rationale, and outcomes for:
- Historical context (why did we choose X over Y?)
- Onboarding (help future contributors understand the codebase)
- Avoiding rework (don't revisit settled decisions)
- Learning (document what worked and what didn't)

## Format

Each decision record follows a lightweight format:

```markdown
# Decision: [Short Title]

**Date:** YYYY-MM-DD
**Status:** Proposed | Accepted | Deprecated | Superseded
**Deciders:** [Who made the decision]

## Context
What is the issue we're trying to solve?

## Decision
What did we decide to do?

## Rationale
Why did we choose this approach?

## Alternatives Considered
What other options did we evaluate?

## Consequences
What are the trade-offs and implications?

## References
- Links to research, issues, PRs
```

## Index

1. [001-mobile-first-css-refactor.md](./001-mobile-first-css-refactor.md) - Refactor CSS from desktop-first to mobile-first
2. [002-mobile-navigation-pattern.md](./002-mobile-navigation-pattern.md) - Implement hamburger menu for mobile

---

**Note:** This is inspired by Architecture Decision Records (ADRs) but simplified for a portfolio project.
