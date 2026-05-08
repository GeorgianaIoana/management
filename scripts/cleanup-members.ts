/**
 * Script pentru a curăța membrii duplicați/erori
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
  console.log('\n=== CURĂȚARE MEMBRI ===\n');

  // 1. Șterge "Ileanaes" (păstrăm "Ileana")
  console.log('1. Șterg "Ileanaes"...');
  const { error: deleteIleanaes } = await supabase
    .from('members')
    .delete()
    .eq('first_name', 'Ileanaes');

  if (deleteIleanaes) {
    console.log('   Eroare:', deleteIleanaes.message);
  } else {
    console.log('   OK - Ileanaes șters');
  }

  // 2. Șterge "Valentin §" (păstrăm "Valentin" normal)
  console.log('2. Șterg "Valentin §"...');
  const { error: deleteValentin } = await supabase
    .from('members')
    .delete()
    .eq('last_name', '§');

  if (deleteValentin) {
    console.log('   Eroare:', deleteValentin.message);
  } else {
    console.log('   OK - Valentin § șters');
  }

  // 3. Actualizează unul din "Andrei" (copil) cu numele "Stoicescu"
  console.log('3. Actualizez Andrei (copil) -> Andrei Stoicescu...');

  // Găsește toți Andrei care sunt copii și nu au last_name
  const { data: andreiList } = await supabase
    .from('members')
    .select('id, first_name, last_name, member_type')
    .eq('first_name', 'Andrei')
    .eq('member_type', 'child')
    .or('last_name.is.null,last_name.eq.');

  if (andreiList && andreiList.length > 0) {
    // Actualizează primul Andrei copil fără last_name
    const andreiToUpdate = andreiList[0];
    const { error: updateAndrei } = await supabase
      .from('members')
      .update({ last_name: 'Stoicescu' })
      .eq('id', andreiToUpdate.id);

    if (updateAndrei) {
      console.log('   Eroare:', updateAndrei.message);
    } else {
      console.log(`   OK - Andrei (id: ${andreiToUpdate.id}) -> Andrei Stoicescu`);
    }

    // Dacă mai există alt Andrei copil fără last_name, îl ștergem (e duplicat)
    if (andreiList.length > 1) {
      console.log('4. Șterg Andrei duplicat (copil)...');
      for (let i = 1; i < andreiList.length; i++) {
        const { error: deleteDup } = await supabase
          .from('members')
          .delete()
          .eq('id', andreiList[i].id);

        if (deleteDup) {
          console.log(`   Eroare la ștergere duplicat: ${deleteDup.message}`);
        } else {
          console.log(`   OK - Andrei duplicat șters (id: ${andreiList[i].id})`);
        }
      }
    }
  } else {
    console.log('   Nu am găsit Andrei copil fără last_name');
  }

  console.log('\n=== VERIFICARE FINALĂ ===\n');

  const { data: members } = await supabase
    .from('members')
    .select('first_name, last_name, member_type')
    .order('first_name');

  console.log('Membri în DB:');
  members?.forEach(m => console.log(`  ${m.first_name} ${m.last_name || '-'} -> ${m.member_type}`));

  const children = members?.filter(m => m.member_type === 'child') || [];
  const adults = members?.filter(m => m.member_type === 'adult') || [];
  console.log(`\nTotal: ${members?.length} membri (${children.length} copii, ${adults.length} adulți)`);
}

main().catch(console.error);
