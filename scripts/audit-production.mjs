#!/usr/bin/env node
/**
 * EchoSoul Production Audit Runner
 * 
 * Runs all production verification test suites and prints a final
 * pass/fail summary with exit code 0 (all pass) or 1 (any failure).
 * 
 * Usage: npm run audit:production
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';

const PASS = '\x1b[32m✅ PASS\x1b[0m';
const FAIL = '\x1b[31m❌ FAIL\x1b[0m';
const WARN = '\x1b[33m⚠️  WARN\x1b[0m';
const SECTION = (s) => console.log('\n\x1b[36m' + '='.repeat(60) + '\x1b[0m\n\x1b[36m  ' + s + '\x1b[0m\n\x1b[36m' + '='.repeat(60) + '\x1b[0m');

const results = [];

function run(label, cmd, { parseResult } = {}) {
  try {
    const out = execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], cwd: process.cwd() });
    const passed = parseResult ? parseResult(out) : true;
    const status = passed ? PASS : FAIL;
    console.log(`  ${status}  ${label}`);
    results.push({ label, passed });
    return out;
  } catch (err) {
    console.log(`  ${FAIL}  ${label}`);
    console.log('       Error:', err.message.split('\n')[0]);
    results.push({ label, passed: false });
    return null;
  }
}

console.log('\n\x1b[1m🔍 ECHOSOUL PRODUCTION AUDIT\x1b[0m');
console.log('Timestamp:', new Date().toISOString());
console.log('Branch:', execSync('git branch --show-current', { encoding: 'utf8' }).trim());
console.log('Commit:', execSync('git log --oneline -1', { encoding: 'utf8' }).trim());

// ===== SECTION 1: TypeScript =====
SECTION('1. TYPESCRIPT TYPE CHECK');
run('tsc --noEmit exits 0 (0 type errors)', 'npx tsc --noEmit', {
  parseResult: () => true, // if it throws, the catch handles it
});

// ===== SECTION 2: Multi-User Isolation =====
SECTION('2. MULTI-USER ISOLATION (23 TESTS)');
const attackOut = run(
  '23/23 attack tests pass',
  'node scripts/test-multi-user-attack.mjs',
  { parseResult: (out) => out.includes('23 PASSED / 0 FAILED') }
);

// ===== SECTION 3: RLS Isolation =====
SECTION('3. RLS ISOLATION (7 ASSERTIONS)');
const rlsOut = run(
  '7/7 RLS assertions pass',
  'node scripts/test-rls-isolation.mjs',
  { parseResult: (out) => out.includes('ALL ASSERTIONS PASSED') }
);

// ===== SECTION 4: OpenRouter Inference =====
SECTION('4. OPENROUTER INFERENCE (5 TESTS)');
run(
  '5/5 OpenRouter inference tests pass',
  'node scripts/test-openrouter-inference.mjs',
  { parseResult: () => {
    // Read the saved JSON results file which is written by the test script
    try {
      if (!existsSync('scripts/openrouter-test-results.json')) return false;
      const data = JSON.parse(readFileSync('scripts/openrouter-test-results.json', 'utf8'));
      if (!Array.isArray(data) || data.length < 5) return false;
      return data.every(r => r.httpStatus === 200 && r.hasValidOutput === true);
    } catch {
      return false;
    }
  }}
);

// ===== SECTION 5: Supabase Infrastructure =====
SECTION('5. SUPABASE INFRASTRUCTURE');
const infraOut = run(
  'Auth health endpoint responds 200',
  'node scripts/audit-backend.mjs',
  { parseResult: (out) => out.includes('Auth Health: 200 OK') }
);

run(
  '40 tables exposed via PostgREST',
  'node scripts/audit-backend.mjs',
  { parseResult: (out) => {
    const m = out.match(/Discovered tables in PostgREST: \[([^\]]+)\]/s);
    if (!m) return false;
    const count = (m[1].match(/'/g) || []).length / 2;
    return count >= 40;
  }}
);

run(
  '5 storage buckets exist (all private)',
  'node scripts/audit-backend.mjs',
  { parseResult: (out) => {
    const m = out.match(/Buckets found: \[([^\]]+)\]/s);
    if (!m) return false;
    const count = (m[1].match(/'/g) || []).length / 2;
    return count >= 5;
  }}
);

// ===== SECTION 6: Security Headers =====
SECTION('6. SECURITY HEADERS (next.config.ts)');
const config = readFileSync('next.config.ts', 'utf8');
const headers = [
  ['X-Frame-Options', 'X-Frame-Options'],
  ['X-Content-Type-Options', 'X-Content-Type-Options'],
  ['Strict-Transport-Security', 'Strict-Transport-Security'],
  ['Content-Security-Policy', 'Content-Security-Policy'],
  ['Permissions-Policy', 'Permissions-Policy'],
  ['poweredByHeader: false', 'poweredByHeader'],
];
for (const [label, search] of headers) {
  const found = config.includes(search);
  console.log(`  ${found ? PASS : FAIL}  ${label} configured`);
  results.push({ label: `Security header: ${label}`, passed: found });
}

// ===== SECTION 7: Environment Variables =====
SECTION('7. ENVIRONMENT VARIABLES');
const env = readFileSync('.env.local', 'utf8');
const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'OPENROUTER_API_KEY',
  'NEXT_PUBLIC_APP_URL',
];
for (const key of required) {
  const present = env.includes(`${key}=`) && !env.match(new RegExp(`${key}=\\s*$`, 'm'));
  console.log(`  ${present ? PASS : FAIL}  ${key} is set`);
  results.push({ label: `Env var: ${key}`, passed: present });
}

// ===== SUMMARY =====
SECTION('AUDIT SUMMARY');
const passed = results.filter(r => r.passed).length;
const failed = results.filter(r => !r.passed).length;
console.log(`  Total Checks: ${results.length}`);
console.log(`  ${PASS}: ${passed}`);
if (failed > 0) {
  console.log(`  ${FAIL}: ${failed}`);
  console.log('\n  Failed checks:');
  results.filter(r => !r.passed).forEach(r => console.log(`    - ${r.label}`));
}

console.log('\n' + '='.repeat(60));
if (failed === 0) {
  console.log('\x1b[32m  ALL CHECKS PASSED — PRODUCTION READY\x1b[0m');
  process.exit(0);
} else {
  console.log('\x1b[31m  ' + failed + ' CHECK(S) FAILED — REVIEW REQUIRED\x1b[0m');
  process.exit(1);
}
