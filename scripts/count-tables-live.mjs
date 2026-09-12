import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Load env
const env = readFileSync('.env.local', 'utf8');
const vars = {};
for (const line of env.split('\n')) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m) vars[m[1]] = m[2].trim();
}

const supabase = createClient(vars.NEXT_PUBLIC_SUPABASE_URL, vars.SUPABASE_SERVICE_ROLE_KEY);

const tables = [
  'profiles','sessions','messages','moments','goals','habits',
  'languages','scripts','authors','literature_works','literary_passages',
  'poems','shayari','quotes','visual_scenes','ambient_sounds','music_tracks',
  'music_artists','music_albums','music_lyrics','books','user_settings',
  'entitlements','creative_jobs','memory_items','context_snapshots',
  'recommendation_events','audit_events','user_context','user_goals',
  'user_interests','user_collections','journey_events','saved_words',
  'user_music_events','novel_chapters','current_user_state','literature_tags',
  'literature_feedback','moment_memory_links'
];

console.log('\n=== ECHOSOUL LIVE DB ROW COUNTS (SERVICE ROLE) ===\n');
let totalRows = 0;
for (const t of tables) {
  const { count, error } = await supabase.from(t).select('*', { count: 'exact', head: true });
  if (error) {
    console.log('  ' + t + ': ERROR - ' + error.message);
  } else {
    const c = count ?? 0;
    totalRows += c;
    const marker = c > 0 ? ' ✅' : ' ○';
    console.log('  ' + t.padEnd(30) + c + marker);
  }
}
console.log('\n  TOTAL ROWS ACROSS ALL TABLES: ' + totalRows);

// Also check profiles columns
const { data: prof, error: profErr } = await supabase.from('profiles').select('id,full_name,display_name,created_at').limit(5);
if (!profErr) {
  console.log('\n=== PROFILES SAMPLE (first 5) ===');
  console.log(JSON.stringify(prof, null, 2));
}
