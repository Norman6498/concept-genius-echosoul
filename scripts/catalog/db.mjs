/**
 * EchoSoul Catalog Database & Ingestion Client
 *
 * Provides shared Supabase client access, batch upserting, and
 * provenance logging for all ETL ingestion scripts.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// Load .env.local
const envPath = resolve(process.cwd(), '.env.local');
const vars = {};
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) vars[m[1]] = m[2].trim();
  }
}

if (!vars.NEXT_PUBLIC_SUPABASE_URL || !vars.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

export const supabase = createClient(
  vars.NEXT_PUBLIC_SUPABASE_URL,
  vars.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export { vars };

/**
 * Batch insert or upsert rows with chunking and error reporting
 */
export async function batchUpsert(table, rows, options = {}) {
  const { batchSize = 50, onConflict, ignoreDuplicates = false } = options;
  if (!rows || rows.length === 0) return { inserted: 0, errors: [] };

  let totalSuccess = 0;
  const errors = [];

  for (let i = 0; i < rows.length; i += batchSize) {
    const chunk = rows.slice(i, i + batchSize);
    try {
      const query = supabase.from(table);
      let res;
      if (onConflict) {
        res = await query.upsert(chunk, { onConflict, ignoreDuplicates });
      } else {
        res = await query.insert(chunk);
      }

      if (res.error) {
        errors.push({ batch: Math.floor(i / batchSize), error: res.error.message });
        console.warn(`  ⚠️ Batch ${Math.floor(i / batchSize) + 1} error on ${table}: ${res.error.message}`);
      } else {
        totalSuccess += chunk.length;
      }
    } catch (err) {
      errors.push({ batch: Math.floor(i / batchSize), error: err.message });
      console.warn(`  ⚠️ Batch ${Math.floor(i / batchSize) + 1} exception on ${table}: ${err.message}`);
    }
  }

  return { inserted: totalSuccess, errors };
}

/**
 * Log ingestion run to catalog_sources provenance table (if available)
 */
export async function recordCatalogProvenance(provenance) {
  const {
    sourceName,
    sourceUrl,
    version = '1.0.0',
    license,
    recordCount = 0,
    notes = '',
  } = provenance;

  try {
    const { error } = await supabase.from('catalog_sources').insert({
      source_name: sourceName,
      source_url: sourceUrl,
      version,
      license,
      record_count: recordCount,
      notes,
    });
    if (!error) {
      console.log(`  📜 Provenance logged to catalog_sources: ${sourceName} (${recordCount} records, ${license})`);
    }
  } catch {
    // Graceful fallback if table is not yet migrated
  }
}
