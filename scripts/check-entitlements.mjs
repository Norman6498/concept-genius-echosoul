import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = {};
fs.readFileSync('.env.local', 'utf8').split('\n').forEach(line => {
  const [k, ...v] = line.trim().split('=');
  if (k && v.length) env[k.trim()] = v.join('=').trim();
});

const client = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const uRes = await client.from('user_music_meaning_unlocks').select('*').limit(1);
  console.log('user_music_meaning_unlocks:', uRes.error ? uRes.error.message : 'EXISTS');

  const wRes = await client.from('premium_waitlist').select('*').limit(1);
  console.log('premium_waitlist:', wRes.error ? wRes.error.message : 'EXISTS');
}

check();
