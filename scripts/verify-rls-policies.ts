/**
 * Security Script: Verify RLS (Row Level Security) Policies
 *
 * This script checks if RLS is enabled on all tables and lists existing policies.
 *
 * Run with: npx ts-node scripts/verify-rls-policies.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Tables that should have RLS enabled
const CRITICAL_TABLES = [
  'members',
  'teachers',
  'classes',
  'enrollments',
  'payments',
  'class_sessions',
  'attendance',
  'lessons',
  'competitions',
  'activity_log',
];

interface TableInfo {
  table_name: string;
  rls_enabled: boolean;
}

interface PolicyInfo {
  tablename: string;
  policyname: string;
  permissive: string;
  roles: string[];
  cmd: string;
  qual: string;
  with_check: string;
}

async function verifyRLS() {
  console.log('🔍 Verifying Row Level Security (RLS) Policies...\n');

  // Check RLS status for each table
  const { data: tables, error: tablesError } = await supabase.rpc('get_tables_rls_status');

  if (tablesError) {
    // If RPC doesn't exist, try direct query
    console.log('Using fallback method to check RLS...\n');
    await verifyRLSFallback();
    return;
  }

  console.log('📋 Table RLS Status:\n');
  console.log('| Table | RLS Enabled |');
  console.log('|-------|-------------|');

  const tablesWithoutRLS: string[] = [];

  for (const table of CRITICAL_TABLES) {
    const tableInfo = (tables as TableInfo[])?.find((t) => t.table_name === table);
    const rlsEnabled = tableInfo?.rls_enabled ?? false;

    const status = rlsEnabled ? '✅ Yes' : '❌ No';
    console.log(`| ${table.padEnd(20)} | ${status.padEnd(11)} |`);

    if (!rlsEnabled) {
      tablesWithoutRLS.push(table);
    }
  }

  // Get policies
  const { data: policies, error: policiesError } = await supabase.rpc('get_rls_policies');

  if (!policiesError && policies) {
    console.log('\n\n📜 Existing RLS Policies:\n');

    for (const table of CRITICAL_TABLES) {
      const tablePolicies = (policies as PolicyInfo[]).filter((p) => p.tablename === table);

      if (tablePolicies.length > 0) {
        console.log(`\n${table}:`);
        tablePolicies.forEach((p) => {
          console.log(`  - ${p.policyname} (${p.cmd}) - ${p.permissive}`);
        });
      }
    }
  }

  // Summary
  console.log('\n\n📊 Summary:');
  console.log(`   Tables checked: ${CRITICAL_TABLES.length}`);
  console.log(`   Tables with RLS: ${CRITICAL_TABLES.length - tablesWithoutRLS.length}`);
  console.log(`   Tables WITHOUT RLS: ${tablesWithoutRLS.length}`);

  if (tablesWithoutRLS.length > 0) {
    console.log('\n🚨 CRITICAL: The following tables need RLS enabled:');
    tablesWithoutRLS.forEach((t) => console.log(`   - ${t}`));
    console.log('\nRun the following SQL in Supabase SQL Editor:');
    console.log('```sql');
    tablesWithoutRLS.forEach((t) => {
      console.log(`ALTER TABLE ${t} ENABLE ROW LEVEL SECURITY;`);
    });
    console.log('```');
  } else {
    console.log('\n✅ All critical tables have RLS enabled!');
  }
}

async function verifyRLSFallback() {
  // Direct SQL query to check RLS
  const { data, error } = await supabase.from('pg_tables').select('*').limit(1);

  if (error) {
    console.log('Cannot directly query pg_tables. Using information_schema...\n');
  }

  // Try to check by attempting to access data without auth
  console.log('Testing table access patterns...\n');

  for (const table of CRITICAL_TABLES) {
    try {
      // Try to count records
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`${table}: ⚠️  Error accessing - ${error.message}`);
      } else {
        console.log(`${table}: ✅ Accessible (${count} records)`);
      }
    } catch (e) {
      console.log(`${table}: ❌ Exception - ${e}`);
    }
  }

  console.log('\n📝 To fully verify RLS, check Supabase Dashboard:');
  console.log('   1. Go to Database > Tables');
  console.log('   2. Click on each table');
  console.log('   3. Check "RLS Enabled" toggle');
  console.log('   4. Review policies in "Policies" tab');
  console.log('\n⚠️  Recommended RLS Policies:');
  console.log(`
-- Example: Teachers can only see their own classes
CREATE POLICY "Teachers see own classes" ON classes
  FOR SELECT
  USING (teacher_id = auth.uid());

-- Example: Teachers can only update their own sessions
CREATE POLICY "Teachers update own sessions" ON class_sessions
  FOR UPDATE
  USING (teacher_id = auth.uid());

-- Example: Members are visible to authenticated users
CREATE POLICY "Authenticated users can view members" ON members
  FOR SELECT
  TO authenticated
  USING (true);
`);
}

// Run
verifyRLS().catch(console.error);
