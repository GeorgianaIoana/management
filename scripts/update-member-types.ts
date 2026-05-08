/**
 * Script pentru a actualiza member_type pentru membrii existenti
 * bazat pe datele din calendar-import.json
 */

import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load env
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    const value = valueParts.join('=');
    if (key && value) process.env[key] = value;
  }
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

interface ImportStudent {
  name: string;
  firstName: string;
  lastName: string;
  memberType: 'child' | 'adult';
}

interface ImportData {
  students: ImportStudent[];
}

async function main() {
  const inputPath = path.join(process.cwd(), 'data', 'calendar-import.json');
  const data: ImportData = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

  console.log('\n=== ACTUALIZARE MEMBER_TYPE ===\n');

  // Get all members from DB
  const { data: members, error: fetchError } = await supabase
    .from('members')
    .select('id, first_name, last_name, member_type');

  if (fetchError) {
    console.error('Error fetching members:', fetchError);
    process.exit(1);
  }

  const updated: string[] = [];
  const errors: string[] = [];

  for (const student of data.students) {
    // Find matching member(s) in DB
    const matchingMembers = members?.filter(m =>
      m.first_name.toLowerCase() === student.firstName.toLowerCase() &&
      (m.last_name || '').toLowerCase() === (student.lastName || '').toLowerCase()
    ) || [];

    for (const member of matchingMembers) {
      if (member.member_type !== student.memberType) {
        const { error } = await supabase
          .from('members')
          .update({ member_type: student.memberType })
          .eq('id', member.id);

        if (error) {
          errors.push(`${member.first_name} ${member.last_name}: ${error.message}`);
        } else {
          updated.push(`${member.first_name} ${member.last_name || '-'}: ${member.member_type} -> ${student.memberType}`);
        }
      }
    }
  }

  if (updated.length > 0) {
    console.log('Actualizati:');
    updated.forEach(u => console.log(`  ${u}`));
  } else {
    console.log('Niciun membru de actualizat.');
  }

  if (errors.length > 0) {
    console.log('\nErori:');
    errors.forEach(e => console.log(`  ${e}`));
  }

  console.log(`\n=== TOTAL: ${updated.length} membri actualizati ===\n`);
}

main().catch(console.error);
