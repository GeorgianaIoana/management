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
  { email: 'vlad.ghita@thesquare.ro', specializations: ['Adulți'] },
  { email: 'calin.ghiorghiu@thesquare.ro', specializations: ['Adulți'] },
  { email: 'vajda.levente@thesquare.ro', specializations: ['Copii'] },
  { email: 'adriana.stanciu@thesquare.ro', specializations: ['Copii'] },
  { email: 'razvan@thesquarechessclub.com', specializations: ['Copii', 'Adulți'] },
  { email: 'mustafa.hamdan@thesquare.ro', specializations: ['Copii', 'Adulți'] },
];

async function main() {
  console.log('Actualizare specializări profesori...\n');

  for (const { email, specializations } of updates) {
    const { data, error } = await supabase
      .from('teachers')
      .update({ specializations })
      .eq('email', email)
      .select('first_name, last_name, specializations')
      .single();

    if (error) {
      console.log(`✗ ${email}: ${error.message}`);
    } else {
      console.log(`✓ ${data.first_name} ${data.last_name}: ${specializations.join(', ')}`);
    }
  }

  console.log('\nGata!');
}

main();
