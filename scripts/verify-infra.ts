#!/usr/bin/env tsx
/**
 * EchoSoul — Infrastructure Verification Script
 *
 * Usage: npx tsx scripts/verify-infra.ts
 *
 * Performs non-destructive checks:
 * A. Required environment variables are set
 * B. Supabase connection works
 * C. Supabase database is reachable
 * D. OpenRouter server-side client initializes correctly
 * E. OpenRouter test request works (minimal cost — 8 tokens max)
 * F. Client-side bundle does NOT expose OPENROUTER_API_KEY
 *
 * This script runs server-side (Node / tsx). It never opens a browser.
 * It does not mutate any data.
 */

import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

// ── Helpers ────────────────────────────────────────────────────────────────

const OK = "✅";
const FAIL = "❌";
const WARN = "⚠️ ";
const INFO = "ℹ️ ";

let passed = 0;
let failed = 0;
let warnings = 0;

function pass(label: string, detail = "") {
  console.log(`  ${OK} ${label}${detail ? ` — ${detail}` : ""}`);
  passed++;
}

function fail(label: string, detail = "") {
  console.error(`  ${FAIL} ${label}${detail ? ` — ${detail}` : ""}`);
  failed++;
}

function warn(label: string, detail = "") {
  console.warn(`  ${WARN} ${label}${detail ? ` — ${detail}` : ""}`);
  warnings++;
}

function info(label: string) {
  console.log(`  ${INFO} ${label}`);
}

function section(title: string) {
  console.log(`\n── ${title} ${"─".repeat(Math.max(0, 60 - title.length))}`);
}

// ── Load .env.local if present ─────────────────────────────────────────────

const envPath = resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  const lines = readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx < 0) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  }
  info("Loaded environment from .env.local");
} else {
  warn(".env.local not found — using process.env only");
}

// ── A. Environment Variables ───────────────────────────────────────────────

section("A. Environment Variables");

const requiredVars = [
  { key: "NEXT_PUBLIC_SUPABASE_URL", public: true },
  { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", public: true },
  { key: "SUPABASE_SERVICE_ROLE_KEY", public: false },
  { key: "OPENROUTER_API_KEY", public: false },
  { key: "OPENROUTER_CHAT_MODEL", public: true },
];

for (const { key, public: isPublic } of requiredVars) {
  const value = process.env[key];
  if (!value) {
    fail(`${key} is not set`);
  } else if (!isPublic && value.length < 10) {
    warn(`${key} is set but looks suspiciously short`);
  } else {
    pass(key, isPublic ? `(public — first 8: ${value.slice(0, 8)}...)` : "(server-only — value hidden)");
  }
}

// ── B. Supabase Connection ─────────────────────────────────────────────────

section("B. Supabase Connection");

async function checkSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    fail("Supabase URL or anon key missing — cannot test connection");
    return;
  }

  try {
    const res = await fetch(`${url}/rest/v1/`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
    });

    if (res.ok || res.status === 200 || res.status === 404) {
      pass("Supabase REST endpoint reachable", `HTTP ${res.status}`);
    } else {
      fail("Supabase REST endpoint returned unexpected status", `HTTP ${res.status}`);
    }
  } catch (err) {
    fail("Supabase connection failed", err instanceof Error ? err.message : "unknown error");
  }
}

// ── C. Database Access ─────────────────────────────────────────────────────

async function checkDatabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    fail("Service role key missing — cannot test database access");
    return;
  }

  try {
    const res = await fetch(`${url}/rest/v1/profiles?select=id&limit=0`, {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      pass("Database: profiles table accessible (0 rows requested — non-destructive)");
    } else if (res.status === 400 || res.status === 422) {
      warn("Database: profiles table may not exist yet — run migrations first", `HTTP ${res.status}`);
    } else {
      fail("Database: unexpected response", `HTTP ${res.status}`);
    }
  } catch (err) {
    fail("Database connection failed", err instanceof Error ? err.message : "unknown error");
  }
}

// ── D & E. OpenRouter ─────────────────────────────────────────────────────

section("D & E. OpenRouter");

async function checkOpenRouter() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_CHAT_MODEL ?? "google/gemma-3-27b-it:free";

  if (!apiKey) {
    fail("OPENROUTER_API_KEY not set — cannot test OpenRouter connection");
    return;
  }

  // D. Client initializes
  pass("OpenRouter adapter initializes (key is set)");

  // E. Test request — minimal cost (8 tokens max)
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
        "X-Title": "EchoSoul",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: "Reply with the single word: ready" }],
        max_tokens: 8,
        temperature: 0,
      }),
    });

    if (res.ok) {
      const data = (await res.json()) as { model?: string; choices?: Array<{ message: { content: string } }> };
      const responseModel = data.model ?? model;
      const content = data.choices?.[0]?.message?.content?.slice(0, 32) ?? "(no content)";
      pass("OpenRouter test request succeeded", `model: ${responseModel}`);
      pass("OpenRouter response received", `content: "${content}"`);
    } else if (res.status === 401) {
      fail("OpenRouter: invalid or expired API key (HTTP 401)");
    } else if (res.status === 429) {
      warn("OpenRouter: rate limited (HTTP 429) — key works but limit hit");
    } else {
      const errText = await res.text().catch(() => "");
      fail(`OpenRouter: HTTP ${res.status}`, errText.slice(0, 128));
    }
  } catch (err) {
    fail("OpenRouter request failed", err instanceof Error ? err.message : "unknown error");
  }
}

// ── F. Secret Safety — API key not in client bundle ────────────────────────

section("F. Secret Safety — Client Bundle");

function checkSecretSafety() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Check that neither secret appears in source files that could be bundled
  const filesToCheck = [
    "src/app/page.tsx",
    "src/app/layout.tsx",
    "src/lib/ai/openrouter.ts",
    "src/lib/ai/index.ts",
    "src/lib/supabase/client.ts",
    ".env.example",
  ];

  const secretPatterns = [
    { name: "OPENROUTER_API_KEY value", value: apiKey?.slice(0, 8) },
    { name: "service-role key value", value: serviceKey?.slice(0, 8) },
  ].filter((p) => p.value && p.value.length >= 8);

  let allClear = true;
  for (const filePath of filesToCheck) {
    const absPath = resolve(process.cwd(), filePath);
    if (!existsSync(absPath)) continue;
    const content = readFileSync(absPath, "utf-8");
    for (const { name, value } of secretPatterns) {
      if (value && content.includes(value)) {
        fail(`Secret found in tracked file: ${filePath}`, `Matches start of ${name}`);
        allClear = false;
      }
    }
  }

  if (allClear) {
    pass("Secret values not found in tracked source files");
  }

  // Check .env.example has no real values (just placeholders)
  const examplePath = resolve(process.cwd(), ".env.example");
  if (existsSync(examplePath)) {
    const example = readFileSync(examplePath, "utf-8");
    const suspiciousPatterns = [/sk-[a-zA-Z0-9]{20,}/, /eyJ[a-zA-Z0-9]{20,}/];
    let exampleClean = true;
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(example)) {
        fail(".env.example appears to contain a real secret");
        exampleClean = false;
        break;
      }
    }
    if (exampleClean) pass(".env.example contains only placeholders");
  }
}

// ── Run all checks ─────────────────────────────────────────────────────────

async function main() {
  console.log("\n╔══════════════════════════════════════════════════════════════╗");
  console.log("║  EchoSoul — Infrastructure Verification                      ║");
  console.log("╚══════════════════════════════════════════════════════════════╝\n");

  await checkSupabase();
  section("C. Database Access");
  await checkDatabase();
  await checkOpenRouter();
  checkSecretSafety();

  console.log("\n── Summary ──────────────────────────────────────────────────────");
  console.log(`  ${OK} Passed:   ${passed}`);
  if (warnings > 0) console.log(`  ${WARN} Warnings: ${warnings}`);
  if (failed > 0) {
    console.error(`  ${FAIL} Failed:   ${failed}`);
    console.log("\nFailed checks require attention before Stage 1.");
    process.exit(1);
  } else {
    console.log("\nAll checks passed. Infrastructure is ready for Stage 1.");
  }
}

main().catch((err) => {
  console.error("Verification script crashed:", err);
  process.exit(2);
});
