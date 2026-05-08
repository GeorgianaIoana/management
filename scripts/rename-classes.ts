/**
 * Script pentru a redenumi clasele după ziua săptămânii
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

const DAY_NAMES: Record<number, string> = {
  0: 'Duminica',
  1: 'Luni',
  2: 'Marti',
  3: 'Miercuri',
  4: 'Joi',
  5: 'Vineri',
  6: 'Sambata',
};

async function main() {
  console.log('\n=== CLASE EXISTENTE ===\n');

  const { data: classes, error } = await supabase
    .from('classes')
    .select('*')
    .order('day_of_week');

  if (error) {
    console.error('Eroare:', error.message);
    return;
  }

  if (!classes || classes.length === 0) {
    console.log('Nu există clase în baza de date.');
    return;
  }

  console.log('Clase găsite:');
  classes.forEach(c => {
    console.log(`  ${c.name} (ziua ${c.day_of_week}, ${c.target_age_group})`);
  });

  console.log('\n=== REDENUMIRE CLASE ===\n');

  for (const cls of classes) {
    const dayName = DAY_NAMES[cls.day_of_week] || `Ziua ${cls.day_of_week}`;
    const suffix = cls.target_age_group === 'kids' ? 'Copii' : 'Adulti';
    const newName = `${dayName} - ${suffix}`;

    if (cls.name !== newName) {
      const { error: updateError } = await supabase
        .from('classes')
        .update({ name: newName })
        .eq('id', cls.id);

      if (updateError) {
        console.log(`  Eroare la ${cls.name}: ${updateError.message}`);
      } else {
        console.log(`  ${cls.name} -> ${newName}`);
      }
    } else {
      console.log(`  ${cls.name} (neschimbat)`);
    }
  }

  console.log('\n=== CLASE ACTUALIZATE ===\n');

  const { data: updatedClasses } = await supabase
    .from('classes')
    .select('name, day_of_week, target_age_group, start_time, end_time')
    .order('day_of_week');

  updatedClasses?.forEach(c => {
    console.log(`  ${c.name} | ${c.start_time}-${c.end_time}`);
  });
}

main().catch(console.error);
