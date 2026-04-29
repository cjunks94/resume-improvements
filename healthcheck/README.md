# Healthcheck

Heartbeat checker for the portfolio ecosystem. Runs as a Railway cron job — exits 0 on success, 1 on any failure, with optional Discord webhook notifications.

## Endpoints monitored

| Service | URL | Expected |
|---------|-----|----------|
| Portfolio (prod) | https://cjunker.dev | 200 |
| Portfolio (staging) | https://staging.cjunker.dev | 200 |
| Blog (prod) | https://blog.cjunker.dev | 200 |

## Configuration

| Env var | Default | Purpose |
|---------|---------|---------|
| `TIMEOUT_MS` | `10000` | Per-request timeout |
| `DISCORD_WEBHOOK_URL` | _(unset)_ | If set, posts a summary on failure |

## Deployment

Railway service, Dockerfile build, cron schedule `*/10 * * * *` (every 10 minutes), `restartPolicyType: NEVER`. Dashboard shows pass/fail history per run.

## Local run

```bash
node index.js
```
