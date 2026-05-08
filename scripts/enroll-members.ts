/**
 * Script pentru a înrola membrii în clasele corespunzătoare
 * bazat pe tipul lor (copii -> Vineri, adulți -> Joi)
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

async function main() {
  console.log('\n=== ÎNROLARE MEMBRI ÎN CLASE ===\n');

  // Get all classes
  const { data: classes, error: classError } = await supabase
    .from('classes')
    .select('id, day_of_week, target_age_group');

  if (classError) {
    console.error('Eroare la citire clase:', classError);
    return;
  }

  console.log('Clase disponibile:');
  classes?.forEach(c => console.log(`  Ziua ${c.day_of_week} - ${c.target_age_group} (id: ${c.id})`));

  // Find the kids class (Friday = day 5, target_age_group = kids)
  const kidsClass = classes?.find(c => c.day_of_week === 5 && c.target_age_group === 'kids');
  // Find the adults class (Thursday = day 4, target_age_group = adults)
  const adultsClass = classes?.find(c => c.day_of_week === 4 && c.target_age_group === 'adults');

  if (!kidsClass) {
    console.log('\nClasa de copii (Vineri) nu există!');
  }
  if (!adultsClass) {
    console.log('\nClasa de adulți (Joi) nu există!');
  }

  // Get all members
  const { data: members, error: memberError } = await supabase
    .from('members')
    .select('id, first_name, last_name, member_type');

  if (memberError) {
    console.error('Eroare la citire membri:', memberError);
    return;
  }

  // Get existing enrollments
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('member_id, class_id');

  const existingEnrollments = new Set(
    enrollments?.map(e => `${e.member_id}|${e.class_id}`) || []
  );

  const today = new Date().toISOString().split('T')[0];
  const toEnroll: { member_id: string; class_id: string; enrolled_date: string; is_active: boolean }[] = [];

  console.log('\n--- Procesare membri ---\n');

  for (const member of members || []) {
    let targetClass = null;

    if (member.member_type === 'child' && kidsClass) {
      targetClass = kidsClass;
    } else if (member.member_type === 'adult' && adultsClass) {
      targetClass = adultsClass;
    }

    if (targetClass) {
      const key = `${member.id}|${targetClass.id}`;
      if (!existingEnrollments.has(key)) {
        toEnroll.push({
          member_id: member.id,
          class_id: targetClass.id,
          enrolled_date: today,
          is_active: true,
        });
        console.log(`  ${member.first_name} ${member.last_name} -> ${member.member_type === 'child' ? 'Vineri - Copii' : 'Joi - Adulti'}`);
      } else {
        console.log(`  ${member.first_name} ${member.last_name} - deja înrolat`);
      }
    } else {
      console.log(`  ${member.first_name} ${member.last_name} - fără clasă potrivită`);
    }
  }

  if (toEnroll.length === 0) {
    console.log('\nToți membrii sunt deja înrolați.');
    return;
  }

  console.log(`\n--- Înrolez ${toEnroll.length} membri ---\n`);

  const { data: inserted, error: insertError } = await supabase
    .from('enrollments')
    .insert(toEnroll)
    .select();

  if (insertError) {
    console.error('Eroare la înrolare:', insertError);
    return;
  }

  console.log(`${inserted?.length || 0} membri înrolați cu succes!`);

  // Verify
  console.log('\n=== VERIFICARE FINALĂ ===\n');

  const { data: finalEnrollments } = await supabase
    .from('enrollments')
    .select('*, member:members(first_name, last_name, member_type), class:classes(day_of_week, target_age_group)')
    .eq('is_active', true);

  const byClass: Record<string, string[]> = {};
  finalEnrollments?.forEach(e => {
    const className = e.class?.day_of_week === 5 ? 'Vineri - Copii' :
                      e.class?.day_of_week === 4 ? 'Joi - Adulti' :
                      `Ziua ${e.class?.day_of_week}`;
    if (!byClass[className]) byClass[className] = [];
    byClass[className].push(`${e.member?.first_name} ${e.member?.last_name}`);
  });

  for (const [className, members] of Object.entries(byClass)) {
    console.log(`${className}:`);
    members.forEach(m => console.log(`  - ${m}`));
  }
}

main().catch(console.error);
