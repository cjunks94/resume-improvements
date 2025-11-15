# ADR-001: Dual-Subdomain Architecture to Bypass Cloudflare Access for Public Tracking

**Date**: November 11, 2025
**Status**: Accepted
**Decision Makers**: Christopher Junker, Claude (AI Assistant)

## Context and Problem Statement

We deployed Umami Analytics with Cloudflare Access (GitHub OAuth) to protect the dashboard at `umami.cjunker.dev`. However, this created a critical issue:

**Cloudflare Access blocks ALL requests** to protected domains, including:
- Public tracking script (`/script.js`)
- Analytics API endpoints (`/api/send`)

When browsers on `cjunker.dev` and `staging.cjunker.dev` try to load the tracking script, they encounter CORS errors:

```
Access to fetch at 'https://cjunkerdev.cloudflareaccess.com/cdn-cgi/access/login/...'
from origin 'https://staging.cjunker.dev' has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

### Root Cause

Cloudflare Access intercepts **every request** to `umami.cjunker.dev` and returns a 302 redirect to the login page. The browser sees this as a failed CORS request because:
1. No `Access-Control-Allow-Origin` header is present in the redirect response
2. The redirect is to a different domain (`cjunkerdev.cloudflareaccess.com`)

### Why Standard Solutions Don't Work

**Option 1: Path-based bypass rules in Cloudflare Access**
- ❌ **Not available on Cloudflare free tier**
- Requires paid plan ($200/month) for WAF Custom Rules with path matching
- Even then, the Access UI doesn't provide intuitive path selectors

**Option 2: Service Tokens / App Tokens**
- ❌ **Requires browsers to send authentication headers**
- CORS policy blocks adding custom headers to cross-origin requests
- Not feasible for public tracking from user browsers

**Option 3: Disable Cloudflare Access entirely**
- ❌ **Loses dashboard security**
- Would require managing Umami's built-in authentication only
- No SSO/GitHub OAuth integration

**Option 4: Cloudflare Workers to bypass Access**
- ❌ **Overly complex**
- Requires writing, deploying, and maintaining custom Workers
- Adds another layer of potential failure

## Decision Drivers

- **Must**: Allow public tracking from any origin without authentication
- **Must**: Keep dashboard protected with Cloudflare Access (GitHub OAuth)
- **Must**: Use Cloudflare free tier (zero cost requirement)
- **Must**: Minimal complexity and maintenance overhead
- **Should**: Use Railway's existing infrastructure (no additional services)
- **Should**: Document solution clearly for future reference

## Considered Options

1. **Dual-subdomain architecture** (DNS-only for tracking)
2. Disable Cloudflare Access entirely
3. Cloudflare Workers bypass
4. Separate Railway deployment for tracking (different service)
5. Upgrade to Cloudflare paid tier for path-based rules

## Decision Outcome

**Chosen option: Dual-subdomain architecture**

### Architecture

**Two subdomains pointing to the same Railway service:**

```
┌─────────────────────────────────────────────────────────────┐
│                     Railway Umami Service                    │
│                 (Single PostgreSQL Database)                 │
└──────────────────────┬────────────────────┬──────────────────┘
                       │                    │
         ┌─────────────┴──────────┐  ┌──────┴────────────────┐
         │ umami.cjunker.dev      │  │ umami-tracking        │
         │ (Dashboard)            │  │ .cjunker.dev          │
         │                        │  │ (Public Tracking)     │
         └─────────────┬──────────┘  └──────┬────────────────┘
                       │                    │
         ┌─────────────┴──────────┐  ┌──────┴────────────────┐
         │ Cloudflare DNS         │  │ Cloudflare DNS        │
         │ Proxy: ON (orange ☁️)  │  │ Proxy: OFF (gray ☁️)  │
         │ Access: ENABLED        │  │ Access: BYPASSED      │
         └────────────────────────┘  └───────────────────────┘
```

**Domain Configuration:**

| Domain | Cloudflare Proxy | Access Protection | Purpose |
|--------|-----------------|-------------------|---------|
| `umami.cjunker.dev` | ✅ ON (orange cloud) | ✅ Enabled | Dashboard login (GitHub OAuth) |
| `umami-tracking.cjunker.dev` | ❌ OFF (gray cloud) | ❌ Bypassed | Public tracking script & API |

### Implementation Details

**Railway Configuration:**
- Single Umami service with two custom domains
- Both domains use same CNAME target (`jkzsizyh.up.railway.app`)
- Environment variable `TRACKER_CORS_ORIGINS=*` allows all origins

**Cloudflare DNS:**
```
# Record 1: Dashboard (proxied through Cloudflare)
Type: CNAME
Name: umami
Target: jkzsizyh.up.railway.app
Proxy: ON (orange cloud)

# Record 2: Tracking (DNS-only, bypasses Cloudflare)
Type: CNAME
Name: umami-tracking
Target: jkzsizyh.up.railway.app
Proxy: OFF (gray cloud)
```

**Website Integration:**
```html
<!-- Use tracking subdomain in all websites -->
<script
  defer
  src="https://umami-tracking.cjunker.dev/script.js"
  data-website-id="e1d1ff65-36f9-42c3-9ce9-42b7b60f57d3"
></script>
```

### Why This Works

**DNS-only mode (gray cloud) means:**
- DNS resolves directly to Railway's IP address
- **No Cloudflare proxy** → No Cloudflare Access interception
- **No HTTPS inspection** → No security policies applied
- **Direct connection** → Browser gets proper CORS headers from Umami

**Orange cloud mode (proxied) means:**
- All traffic goes through Cloudflare proxy
- **Cloudflare Access intercepts** every request
- **GitHub OAuth required** before accessing any resource
- Dashboard remains secure with SSO

## Positive Consequences

✅ **Zero cost**: Uses Cloudflare free tier and Railway free tier
✅ **Simple**: No custom code, Workers, or additional services
✅ **Secure**: Dashboard still protected by GitHub OAuth
✅ **Fast**: Direct connection for tracking (no extra proxy hop)
✅ **Maintainable**: Standard DNS configuration, well-documented
✅ **Flexible**: Can easily add more public subdomains if needed

## Negative Consequences

⚠️ **DNS management**: Need to maintain two DNS records instead of one
⚠️ **Documentation**: Must clearly explain which domain to use for what
⚠️ **Tracking subdomain exposed**: No DDoS protection from Cloudflare on tracking endpoint
⚠️ **Different domains**: Slightly more complex mental model (two URLs instead of one)

### Mitigation Strategies

**DNS management**: Documented in README with clear examples
**Tracking exposure**: Railway provides basic DDoS protection; Umami is lightweight
**Documentation**: Created ADR and updated README with warnings and examples

## Alternatives Considered

### Alternative 1: Disable Cloudflare Access Entirely
- ✅ Simple (one domain)
- ❌ Loses GitHub OAuth SSO
- ❌ Requires managing Umami built-in authentication
- ❌ No audit logs or access policies
- **Rejected**: Security trade-off not acceptable

### Alternative 2: Cloudflare Workers Bypass
- ✅ Single domain
- ✅ Keeps Cloudflare proxy benefits
- ❌ Requires custom JavaScript code
- ❌ More complex debugging
- ❌ Another point of failure
- **Rejected**: Unnecessary complexity

### Alternative 3: Separate Railway Service
- ✅ Complete isolation
- ❌ Doubles infrastructure (2x PostgreSQL, 2x containers)
- ❌ Higher cost (may exceed free tier)
- ❌ More maintenance overhead
- **Rejected**: Over-engineering for a simple problem

### Alternative 4: Upgrade Cloudflare Plan
- ✅ Native path-based bypass
- ✅ Single domain
- ❌ **$200/month cost** for Business plan
- ❌ Overkill for personal project
- **Rejected**: Cost prohibitive

## Validation

**Tested and confirmed working:**
- ✅ Dashboard accessible at `https://umami.cjunker.dev` with GitHub OAuth
- ✅ Tracking script loads from `https://umami-tracking.cjunker.dev/script.js`
- ✅ API requests succeed to `https://umami-tracking.cjunker.dev/api/send`
- ✅ No CORS errors in browser console
- ✅ Pageviews recorded in Umami dashboard from `staging.cjunker.dev`

**Test commands:**
```bash
# Verify dashboard requires authentication (302 redirect)
curl -I https://umami.cjunker.dev/api/heartbeat
# Expected: HTTP/2 302 (redirect to Cloudflare Access login)

# Verify tracking endpoint is public (200 OK)
curl -I https://umami-tracking.cjunker.dev/api/heartbeat
# Expected: HTTP/2 200

# Verify tracking script loads
curl -I https://umami-tracking.cjunker.dev/script.js
# Expected: HTTP/2 200, content-type: application/javascript
```

## Lessons Learned

1. **Cloudflare Access free tier limitations**: No path-based rules without paid plan
2. **CORS and authentication don't mix**: Can't authenticate public tracking endpoints
3. **DNS-only mode is powerful**: Bypasses all Cloudflare features (good and bad)
4. **Railway supports multiple domains**: Single service can serve multiple hostnames
5. **Document architectural decisions**: This ADR will save time for future engineers

## References

- [Cloudflare Access Documentation](https://developers.cloudflare.com/cloudflare-one/applications/)
- [CORS Specification (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Railway Custom Domains](https://docs.railway.app/deploy/exposing-your-app#custom-domains)
- [Umami Environment Variables](https://umami.is/docs/environment-variables)
- GitHub Issue tracking this work: (none - resolved during development)

## Related Decisions

- ADR-002 (future): Choice of Umami over Google Analytics
- ADR-003 (future): Railway vs Vercel vs self-hosted VPS

---

**Decision Status**: ✅ Implemented and tested
**Last Updated**: November 11, 2025
**Review Date**: Review when upgrading Cloudflare plan or migrating infrastructure
