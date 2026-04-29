// Heartbeat checker for all services
// Runs as a Railway cron job — exits 0 on success, 1 on any failure.
// Railway dashboard shows pass/fail history per run.

const ENDPOINTS = [
  {
    name: "Portfolio (prod)",
    url: "https://cjunker.dev",
    expect: 200,
  },
  {
    name: "Portfolio (staging)",
    url: "https://staging.cjunker.dev",
    expect: 200,
  },
  {
    name: "Umami Analytics",
    url: "https://umami.cjunker.dev/api/heartbeat",
    expect: 200,
  },
  {
    name: "Umami Tracking",
    url: "https://umami-tracking.cjunker.dev/api/heartbeat",
    expect: 200,
  },
];

const TIMEOUT_MS = parseInt(process.env.TIMEOUT_MS || "10000", 10);
const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || "";

async function check(endpoint) {
  const start = Date.now();
  try {
    const res = await fetch(endpoint.url, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      redirect: "follow",
    });
    const latency = Date.now() - start;
    const ok = res.status === endpoint.expect;
    return {
      ...endpoint,
      status: res.status,
      latency,
      ok,
      error: ok ? null : `expected ${endpoint.expect}, got ${res.status}`,
    };
  } catch (err) {
    return {
      ...endpoint,
      status: null,
      latency: Date.now() - start,
      ok: false,
      error: err.name === "TimeoutError" ? `timeout after ${TIMEOUT_MS}ms` : err.message,
    };
  }
}

async function notify(failures) {
  if (!WEBHOOK_URL) return;
  const lines = failures.map(
    (f) => `**${f.name}** — ${f.error} (${f.url})`
  );
  const body = {
    content: `🚨 **Heartbeat failure** — ${failures.length} service(s) down\n${lines.join("\n")}`,
  };
  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("Webhook delivery failed:", err.message);
  }
}

async function main() {
  console.log(`Checking ${ENDPOINTS.length} endpoints...\n`);

  const results = await Promise.all(ENDPOINTS.map(check));

  for (const r of results) {
    const icon = r.ok ? "✓" : "✗";
    const detail = r.ok ? `${r.latency}ms` : r.error;
    console.log(`  ${icon} ${r.name.padEnd(24)} ${String(r.status ?? "---").padEnd(5)} ${detail}`);
  }

  const failures = results.filter((r) => !r.ok);

  console.log(
    `\n${results.length - failures.length}/${results.length} healthy`
  );

  if (failures.length > 0) {
    await notify(failures);
    process.exit(1);
  }
}

main();
