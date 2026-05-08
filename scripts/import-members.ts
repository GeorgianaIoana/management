/**
 * Script pentru a importa elevii din calendar-import.json in baza de date Supabase
 */

import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
function loadEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=');
        if (key && value) {
          process.env[key] = value;
        }
      }
    }
  }
}

loadEnvLocal();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface ImportStudent {
  name: string;
  firstName: string;
  lastName: string;
  memberType: 'child' | 'adult';
  totalSessions: number;
  present: number;
  absent: number;
  dayDistribution: Record<number, number>;
}

interface ImportData {
  students: ImportStudent[];
  events: unknown[];
}

interface MemberInsert {
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  date_of_birth: string | null;
  member_type: 'child' | 'adult';
  guardian_name: string | null;
  guardian_phone: string | null;
  guardian_email: string | null;
  chess_rating: number | null;
  skill_level: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null;
  status: 'active' | 'inactive' | 'suspended';
  join_date: string;
  avatar_url: string | null;
  notes: string | null;
  contract_signed: boolean;
  contract_file_url: string | null;
  payment_confirmed: boolean;
  feedback_received: boolean;
  rating_given: boolean;
  trainer_id: string | null;
}

async function main() {
  const inputPath = path.join(process.cwd(), 'data', 'calendar-import.json');

  if (!fs.existsSync(inputPath)) {
    console.error('File not found:', inputPath);
    console.error('Run `npx tsx scripts/parse-calendar.ts` first to generate the import file.');
    process.exit(1);
  }

  const data: ImportData = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
  const { students } = data;

  console.log('\n=== IMPORT MEMBRI IN SUPABASE ===\n');
  console.log(`Total elevi de importat: ${students.length}`);

  // Check for existing members to avoid duplicates
  const { data: existingMembers, error: fetchError } = await supabase
    .from('members')
    .select('first_name, last_name');

  if (fetchError) {
    console.error('Error fetching existing members:', fetchError);
    process.exit(1);
  }

  const existingNames = new Set(
    existingMembers?.map(m => `${m.first_name}|${m.last_name}`.toLowerCase()) || []
  );

  const today = new Date().toISOString().split('T')[0];
  const membersToInsert: MemberInsert[] = [];
  const skipped: string[] = [];

  for (const student of students) {
    const key = `${student.firstName}|${student.lastName}`.toLowerCase();

    if (existingNames.has(key)) {
      skipped.push(`${student.firstName} ${student.lastName || ''} (deja exista)`);
      continue;
    }

    // Prepare notes with session info
    const attendanceInfo = student.present + student.absent > 0
      ? `Rata prezenta: ${Math.round((student.present / (student.present + student.absent)) * 100)}%`
      : 'Fara date prezenta';

    const memberData: MemberInsert = {
      first_name: student.firstName,
      last_name: student.lastName || '',
      email: null,
      phone: null,
      date_of_birth: null,
      member_type: student.memberType,
      guardian_name: student.memberType === 'child' ? 'De completat' : null,
      guardian_phone: null,
      guardian_email: null,
      chess_rating: null,
      skill_level: 'beginner',
      status: 'active',
      join_date: today,
      avatar_url: null,
      notes: `Importat din calendar. Sesiuni: ${student.totalSessions}, Prezent: ${student.present}, Absent: ${student.absent}. ${attendanceInfo}`,
      contract_signed: false,
      contract_file_url: null,
      payment_confirmed: false,
      feedback_received: false,
      rating_given: false,
      trainer_id: null,
    };

    membersToInsert.push(memberData);
  }

  if (membersToInsert.length === 0) {
    console.log('\nNu sunt membri noi de importat. Toti exista deja in baza de date.');
    if (skipped.length > 0) {
      console.log('\nSariti:');
      skipped.forEach(s => console.log(`  - ${s}`));
    }
    return;
  }

  console.log(`\nSe vor importa ${membersToInsert.length} membri noi:`);

  // Insert members
  const { data: insertedMembers, error: insertError } = await supabase
    .from('members')
    .insert(membersToInsert)
    .select();

  if (insertError) {
    console.error('\nEroare la inserare:', insertError);
    process.exit(1);
  }

  console.log('\n=== RAPORT IMPORT ===\n');

  // Group by type
  const children = insertedMembers?.filter(m => m.member_type === 'child') || [];
  const adults = insertedMembers?.filter(m => m.member_type === 'adult') || [];

  console.log(`COPII importati (${children.length}):`);
  children.forEach(m => console.log(`  - ${m.first_name} ${m.last_name}`));

  console.log(`\nADULTI importati (${adults.length}):`);
  adults.forEach(m => console.log(`  - ${m.first_name} ${m.last_name}`));

  if (skipped.length > 0) {
    console.log(`\nSARITI (${skipped.length}):`);
    skipped.forEach(s => console.log(`  - ${s}`));
  }

  console.log(`\n=== TOTAL: ${insertedMembers?.length || 0} membri importati cu succes ===\n`);

  // Log activity
  for (const member of insertedMembers || []) {
    await supabase.from('activity_log').insert({
      entity_type: 'member',
      entity_id: member.id,
      action: 'created',
      description: `Importat din calendar: ${member.first_name} ${member.last_name}`,
    });
  }
}

main().catch(console.error);
