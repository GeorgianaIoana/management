import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=');
        if (key && value) process.env[key] = value;
      }
    }
  }
}
loadEnvLocal();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function main() {
  console.log('Adaug coloana teaching_levels la tabela teachers...\n');

  // Add the column using raw SQL
  const { error } = await supabase.rpc('exec_sql', {
    sql: `ALTER TABLE teachers ADD COLUMN IF NOT EXISTS teaching_levels text[] DEFAULT NULL;`
  });

  if (error) {
    // Try direct approach - the column might need to be added via Supabase dashboard
    // or we can try inserting with the new field to see if it exists
    console.log('Nu am putut adauga coloana direct. Verificam daca exista deja...');

    const { data, error: selectError } = await supabase
      .from('teachers')
      .select('*')
      .limit(1);

    if (selectError) {
      console.error('Eroare:', selectError);
      return;
    }

    const columns = data && data[0] ? Object.keys(data[0]) : [];
    console.log('Coloane existente:', columns.join(', '));

    if (!columns.includes('teaching_levels')) {
      console.log('\nColoana teaching_levels nu exista.');
      console.log('Trebuie adaugata manual din Supabase Dashboard:');
      console.log('1. Mergi la Table Editor > teachers');
      console.log('2. Click pe "+" pentru a adauga coloana noua');
      console.log('3. Nume: teaching_levels');
      console.log('4. Tip: text[] (array)');
      console.log('5. Default: NULL');
    } else {
      console.log('\nColoana teaching_levels exista deja!');
    }
  } else {
    console.log('Coloana teaching_levels a fost adaugata cu succes!');
  }
}

main();
