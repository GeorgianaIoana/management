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
  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .order('first_name');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('=== Profesori in baza de date ===\n');
  console.log(`Total: ${data.length}\n`);

  data.forEach((t, i) => {
    console.log(`${i + 1}. ${t.first_name} ${t.last_name}`);
    console.log(`   Email: ${t.email}`);
    console.log(`   Specializări: ${t.specializations?.join(', ') || '-'}`);
    console.log(`   Niveluri: ${t.teaching_levels?.join(', ') || '-'}`);
    console.log(`   Activ: ${t.is_active ? 'Da' : 'Nu'}`);
    console.log('');
  });
}

main();
