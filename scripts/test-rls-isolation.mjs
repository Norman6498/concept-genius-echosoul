import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

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

const adminClient = createClient(url, serviceKey);

console.log('====================================================');
console.log('PHASE 5: MULTI-USER ROW LEVEL SECURITY (RLS) AUDIT');
console.log('====================================================');

async function getOrCreateUser(email, password, displayName) {
  // Try sign in
  const client = createClient(url, anonKey);
  const { data: signInData, error: signInError } = await client.auth.signInWithPassword({ email, password });
  if (!signInError && signInData?.session) {
    console.log(`  Logged in existing test user: ${email} (${signInData.user.id})`);
    return { client, user: signInData.user, session: signInData.session };
  }

  // If failed, create user via admin
  console.log(`  Creating user via admin: ${email}...`);
  const { data: createData, error: createError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: displayName, display_name: displayName }
  });

  if (createError) {
    throw new Error(`Failed to create test user ${email}: ${createError.message}`);
  }

  // Sign in with new user
  const { data: newSession, error: newSessionError } = await client.auth.signInWithPassword({ email, password });
  if (newSessionError) {
    throw new Error(`Failed to sign in newly created user ${email}: ${newSessionError.message}`);
  }

  console.log(`  Created and logged in: ${email} (${newSession.user.id})`);
  return { client, user: newSession.user, session: newSession.session };
}

async function runRlsAudit() {
  const assertions = [];

  try {
    const userA = await getOrCreateUser('echosoul_user_a@test.local', 'EchoSoulSecurity2026!A', 'User Alpha');
    const userB = await getOrCreateUser('echosoul_user_b@test.local', 'EchoSoulSecurity2026!B', 'User Beta');

    const sessionAId = crypto.randomUUID();
    const sessionBId = crypto.randomUUID();

    console.log('\n--- 1. Populating User A Data (Session, Messages, Moments) ---');
    // User A creates their session
    const { error: sessAError } = await userA.client.from('sessions').insert({
      id: sessionAId,
      user_id: userA.user.id,
      mode: 'balanced'
    });
    console.log('User A session insert:', sessAError ? sessAError.message : 'OK');

    // User A creates their message
    const msgAId = crypto.randomUUID();
    const { error: msgAError } = await userA.client.from('messages').insert({
      id: msgAId,
      session_id: sessionAId,
      user_id: userA.user.id,
      role: 'user',
      content: 'This is User A private reflection about their struggles.'
    });
    console.log('User A message insert:', msgAError ? msgAError.message : 'OK');

    // User A creates their moment
    const momentAId = crypto.randomUUID();
    const { error: momAError } = await userA.client.from('moments').insert({
      id: momentAId,
      user_id: userA.user.id,
      title: 'User A Breakthrough Moment',
      summary: 'Realized personal strength today.',
      emotion: 'empowered'
    });
    console.log('User A moment insert:', momAError ? momAError.message : 'OK');

    console.log('\n--- 2. Populating User B Data ---');
    const { error: sessBError } = await userB.client.from('sessions').insert({
      id: sessionBId,
      user_id: userB.user.id,
      mode: 'reflective'
    });
    const msgBId = crypto.randomUUID();
    await userB.client.from('messages').insert({
      id: msgBId,
      session_id: sessionBId,
      user_id: userB.user.id,
      role: 'user',
      content: 'This is User B private reflection about art and poetry.'
    });

    console.log('\n--- 3. Testing Cross-User RLS Isolation (User B attempts to access User A) ---');

    // Test 1: User B tries to SELECT User A's message
    const { data: bReadAmsg } = await userB.client.from('messages').select('*').eq('id', msgAId);
    const pass1 = (!bReadAmsg || bReadAmsg.length === 0);
    console.log(`  Assertion 1: User B cannot read User A message: ${pass1 ? 'PASSED ✅' : 'FAILED ❌'}`);
    assertions.push({ name: 'User B cannot read User A messages', passed: pass1, data: bReadAmsg });

    // Test 2: User B tries to UPDATE User A's message
    const { data: bUpdateAmsg, error: bUpdateErr } = await userB.client
      .from('messages')
      .update({ content: 'Tampered by User B!' })
      .eq('id', msgAId)
      .select();
    const pass2 = (!bUpdateAmsg || bUpdateAmsg.length === 0);
    console.log(`  Assertion 2: User B cannot update User A message: ${pass2 ? 'PASSED ✅' : 'FAILED ❌'}`);
    assertions.push({ name: 'User B cannot update User A messages', passed: pass2, error: bUpdateErr });

    // Test 3: User B tries to DELETE User A's message
    const { data: bDeleteAmsg, error: bDeleteErr } = await userB.client
      .from('messages')
      .delete()
      .eq('id', msgAId)
      .select();
    const pass3 = (!bDeleteAmsg || bDeleteAmsg.length === 0);
    console.log(`  Assertion 3: User B cannot delete User A message: ${pass3 ? 'PASSED ✅' : 'FAILED ❌'}`);
    assertions.push({ name: 'User B cannot delete User A messages', passed: pass3, error: bDeleteErr });

    // Test 4: User B tries to SELECT User A's moment
    const { data: bReadAmom } = await userB.client.from('moments').select('*').eq('id', momentAId);
    const pass4 = (!bReadAmom || bReadAmom.length === 0);
    console.log(`  Assertion 4: User B cannot read User A moment: ${pass4 ? 'PASSED ✅' : 'FAILED ❌'}`);
    assertions.push({ name: 'User B cannot read User A moments', passed: pass4, data: bReadAmom });

    // Test 5: User A tries to SELECT User B's message
    const { data: aReadBmsg } = await userA.client.from('messages').select('*').eq('id', msgBId);
    const pass5 = (!aReadBmsg || aReadBmsg.length === 0);
    console.log(`  Assertion 5: User A cannot read User B message: ${pass5 ? 'PASSED ✅' : 'FAILED ❌'}`);
    assertions.push({ name: 'User A cannot read User B messages', passed: pass5, data: aReadBmsg });

    // Test 6: User A CAN read their own message
    const { data: aReadAmsg } = await userA.client.from('messages').select('*').eq('id', msgAId);
    const pass6 = (aReadAmsg && aReadAmsg.length === 1 && aReadAmsg[0].id === msgAId);
    console.log(`  Assertion 6: User A can read own message: ${pass6 ? 'PASSED ✅' : 'FAILED ❌'}`);
    assertions.push({ name: 'User A can read own messages', passed: pass6 });

    // Test 7: Anonymous user (no auth) cannot SELECT any messages
    const anonClient = createClient(url, anonKey);
    const { data: anonRead } = await anonClient.from('messages').select('*');
    const pass7 = (!anonRead || anonRead.length === 0);
    console.log(`  Assertion 7: Anonymous client cannot read messages: ${pass7 ? 'PASSED ✅' : 'FAILED ❌'}`);
    assertions.push({ name: 'Anonymous client cannot read messages', passed: pass7 });

    const allPassed = assertions.every(a => a.passed);
    console.log('\n====================================================');
    console.log(`RLS AUDIT SUMMARY: ${allPassed ? 'ALL ASSERTIONS PASSED ✅' : 'FAILURES DETECTED ❌'}`);
    console.log('====================================================');

    fs.writeFileSync('scripts/rls-test-results.json', JSON.stringify({
      allPassed,
      timestamp: new Date().toISOString(),
      assertions
    }, null, 2));

  } catch (e) {
    console.error('Fatal error during RLS audit:', e);
  }
}

runRlsAudit();
