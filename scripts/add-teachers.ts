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
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface NewTeacher {
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
}

const newTeachers: NewTeacher[] = [
  {
    first_name: 'Vlad',
    last_name: 'Ghita',
    email: 'vlad.ghita@thesquare.ro',
    is_active: true,
  },
  {
    first_name: 'Vajda',
    last_name: 'Levente',
    email: 'vajda.levente@thesquare.ro',
    is_active: true,
  },
  {
    first_name: 'Adriana',
    last_name: 'Stanciu',
    email: 'adriana.stanciu@thesquare.ro',
    is_active: true,
  },
  {
    first_name: 'Mustafa',
    last_name: 'Hamdan',
    email: 'mustafa.hamdan@thesquare.ro',
    is_active: true,
  },
  {
    first_name: 'Calin',
    last_name: 'Ghiorghiu',
    email: 'calin.ghiorghiu@thesquare.ro',
    is_active: true,
  },
];

async function main() {
  console.log('=== Adaugare Profesori Noi ===\n');

  // Verificam profesorii existenti
  const { data: existingTeachers, error: fetchError } = await supabase
    .from('teachers')
    .select('email, first_name, last_name');

  if (fetchError) {
    console.error('Eroare la citirea profesorilor existenti:', fetchError);
    process.exit(1);
  }

  const existingEmails = new Set(existingTeachers?.map(t => t.email) || []);
  console.log(`Profesori existenti: ${existingTeachers?.length || 0}`);
  existingTeachers?.forEach(t => {
    console.log(`  - ${t.first_name} ${t.last_name} (${t.email})`);
  });
  console.log('');

  // Filtram profesorii care nu exista deja
  const teachersToAdd = newTeachers.filter(t => !existingEmails.has(t.email));
  const alreadyExist = newTeachers.filter(t => existingEmails.has(t.email));

  if (alreadyExist.length > 0) {
    console.log('Profesori care exista deja (vor fi ignorati):');
    alreadyExist.forEach(t => {
      console.log(`  - ${t.first_name} ${t.last_name} (${t.email})`);
    });
    console.log('');
  }

  if (teachersToAdd.length === 0) {
    console.log('Toti profesorii exista deja in baza de date.');
    return;
  }

  console.log(`Adaugam ${teachersToAdd.length} profesori noi...\n`);

  // Inseram profesorii noi
  const { data: inserted, error: insertError } = await supabase
    .from('teachers')
    .insert(teachersToAdd)
    .select();

  if (insertError) {
    console.error('Eroare la inserare:', insertError);
    process.exit(1);
  }

  console.log('Profesori adaugati cu succes:');
  inserted?.forEach(t => {
    console.log(`  ✓ ${t.first_name} ${t.last_name} (${t.email}) - ID: ${t.id}`);
  });

  // Raport final
  const { data: allTeachers, error: countError } = await supabase
    .from('teachers')
    .select('id, first_name, last_name, email, is_active');

  if (!countError && allTeachers) {
    console.log(`\n=== Raport Final ===`);
    console.log(`Total profesori in baza de date: ${allTeachers.length}`);
    console.log('\nToti profesorii:');
    allTeachers.forEach((t, i) => {
      const status = t.is_active ? '✓' : '✗';
      console.log(`  ${i + 1}. ${status} ${t.first_name} ${t.last_name} (${t.email})`);
    });
  }

  console.log('\nGata!');
}

main();
