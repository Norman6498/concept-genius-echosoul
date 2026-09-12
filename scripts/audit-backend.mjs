import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read .env.local
const envFile = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, ...v] = line.trim().split('=');
  if (k && v.length) env[k.trim()] = v.join('=').trim();
});

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

const anonClient = createClient(url, anonKey);
const adminClient = createClient(url, serviceKey);

async function runAudit() {
  const report = {
    supabaseConnection: false,
    authReachable: false,
    tables: {},
    buckets: [],
    bucketFiles: {},
    rlsTests: {},
    postgrestTables: []
  };

  console.log('--- 1. Testing Supabase URL & Auth Health ---');
  try {
    const authRes = await fetch(`${url}/auth/v1/health`, { headers: { apikey: anonKey } });
    report.authReachable = authRes.ok;
    console.log('Auth Health:', authRes.status, authRes.statusText);
  } catch (e) {
    console.log('Auth Health Error:', e.message);
  }

  console.log('--- 2. Fetching PostgREST OpenAPI Schema (all exposed tables) ---');
  try {
    const schemaRes = await fetch(`${url}/rest/v1/`, {
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` }
    });
    if (schemaRes.ok) {
      const openapi = await schemaRes.json();
      const paths = Object.keys(openapi.paths || {}).map(p => p.replace('/', ''));
      report.postgrestTables = paths.filter(p => p && !p.startsWith('rpc/'));
      console.log('Discovered tables in PostgREST:', report.postgrestTables);
    }
  } catch (e) {
    console.log('OpenAPI schema fetch error:', e.message);
  }

  console.log('--- 3. Testing Expected Tables Individually ---');
  const expectedTables = [
    'profiles',
    'user_settings',
    'sessions',
    'messages',
    'context_snapshots',
    'memory_items',
    'moments',
    'novel_chapters',
    'moment_memory_links',
    'literature_works',
    'literary_passages',
    'literature_tags',
    'literature_feedback',
    'saved_words',
    'creative_jobs',
    'goals',
    'habits',
    'entitlements',
    'audit_events',
    // Newly proposed or domain tables:
    'music_tracks',
    'master_music_catalog',
    'melodies',
    'meditations',
    'visual_scenes',
    'scenes',
    'ambient_audio',
    'books',
    'shayari',
    'poetry',
    'quotes',
    'authors',
    'content_sources',
    'recommendation_events',
    'experience_sessions',
    'user_collections',
    'user_onboarding',
    'chat_sessions'
  ];

  for (const t of expectedTables) {
    try {
      const { count, error } = await adminClient.from(t).select('*', { count: 'exact', head: true });
      if (error) {
        report.tables[t] = { exists: false, error: error.message, code: error.code };
      } else {
        report.tables[t] = { exists: true, rowCount: count };
      }
    } catch (e) {
      report.tables[t] = { exists: false, error: e.message };
    }
  }

  console.log('--- 4. Testing Storage Buckets ---');
  try {
    const { data: buckets, error: bErr } = await adminClient.storage.listBuckets();
    if (bErr) {
      console.log('Storage buckets error:', bErr.message);
      report.storageError = bErr.message;
    } else {
      report.buckets = buckets;
      console.log('Buckets found:', buckets.map(b => `${b.name} (${b.public ? 'public' : 'private'})`));
      for (const b of buckets) {
        const { data: files, error: fErr } = await adminClient.storage.from(b.name).list();
        report.bucketFiles[b.name] = fErr ? { error: fErr.message } : (files || []).map(f => f.name);
      }
    }
  } catch (e) {
    report.storageError = e.message;
  }

  console.log('--- 5. Testing RLS Access Isolation (User A vs Anon vs Service Role) ---');
  // Test reading profiles table with anon client (without token)
  try {
    const { data: anonProfiles, error: aErr } = await anonClient.from('profiles').select('id, full_name').limit(5);
    report.rlsTests['profiles_anon_select'] = {
      allowed: !aErr && anonProfiles !== null,
      rowCount: anonProfiles ? anonProfiles.length : 0,
      error: aErr ? aErr.message : null
    };
  } catch (e) {
    report.rlsTests['profiles_anon_select'] = { error: e.message };
  }

  // Test reading messages table with anon client
  try {
    const { data: anonMsgs, error: mErr } = await anonClient.from('messages').select('*').limit(5);
    report.rlsTests['messages_anon_select'] = {
      allowed: !mErr && anonMsgs !== null,
      rowCount: anonMsgs ? anonMsgs.length : 0,
      error: mErr ? mErr.message : null
    };
  } catch (e) {
    report.rlsTests['messages_anon_select'] = { error: e.message };
  }

  // Test reading moments table with anon client
  try {
    const { data: anonMoments, error: momErr } = await anonClient.from('moments').select('*').limit(5);
    report.rlsTests['moments_anon_select'] = {
      allowed: !momErr && anonMoments !== null,
      rowCount: anonMoments ? anonMoments.length : 0,
      error: momErr ? momErr.message : null
    };
  } catch (e) {
    report.rlsTests['moments_anon_select'] = { error: e.message };
  }

  // Test reading literature_works with anon client (public data should be readable)
  try {
    const { data: anonLit, error: lErr } = await anonClient.from('literature_works').select('id, title').limit(5);
    report.rlsTests['literature_works_anon_select'] = {
      allowed: !lErr && anonLit !== null,
      rowCount: anonLit ? anonLit.length : 0,
      error: lErr ? lErr.message : null
    };
  } catch (e) {
    report.rlsTests['literature_works_anon_select'] = { error: e.message };
  }

  // Output report
  fs.writeFileSync('scripts/supabase-audit-raw.json', JSON.stringify(report, null, 2));
  console.log('\nAudit complete! Wrote raw data to scripts/supabase-audit-raw.json');
}

runAudit();
