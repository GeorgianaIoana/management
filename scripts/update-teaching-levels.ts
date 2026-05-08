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

const updates = [
  { email: 'vlad.ghita@thesquare.ro', teaching_levels: ['Avansat'] },
  { email: 'calin.ghiorghiu@thesquare.ro', teaching_levels: ['Avansat'] },
  { email: 'vajda.levente@thesquare.ro', teaching_levels: ['Avansat'] },
  { email: 'adriana.stanciu@thesquare.ro', teaching_levels: ['Începător'] },
  { email: 'razvan@thesquarechessclub.com', teaching_levels: ['Avansat'] },
  { email: 'mustafa.hamdan@thesquare.ro', teaching_levels: ['Începător'] },
];

async function main() {
  console.log('Actualizare niveluri de predare...\n');

  for (const { email, teaching_levels } of updates) {
    const { data, error } = await supabase
      .from('teachers')
      .update({ teaching_levels })
      .eq('email', email)
      .select('first_name, last_name, teaching_levels')
      .single();

    if (error) {
      console.log(`✗ ${email}: ${error.message}`);
    } else {
      console.log(`✓ ${data.first_name} ${data.last_name}: ${teaching_levels.join(', ')}`);
    }
  }

  console.log('\nGata!');
}

main();
