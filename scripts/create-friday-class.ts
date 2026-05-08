import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

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
  // Get teacher id (Razvan Tudoroiu)
  const { data: teachers } = await supabase.from('teachers').select('id').limit(1);
  const teacherId = teachers && teachers[0] ? teachers[0].id : null;

  // Create Friday class for kids
  const { data: cls, error } = await supabase
    .from('classes')
    .insert({
      name: 'Vineri - Copii',
      day_of_week: 5,
      target_age_group: 'kids',
      start_time: '17:00',
      end_time: '18:30',
      max_students: 10,
      is_active: true,
      teacher_id: teacherId,
    })
    .select()
    .single();

  if (error) {
    console.log('Eroare:', error.message);
    return;
  }
  console.log('Clasa creata: Vineri - Copii (id:', cls.id, ')');

  // List all classes
  const { data: classes } = await supabase
    .from('classes')
    .select('name, day_of_week, target_age_group, start_time, end_time')
    .order('day_of_week');

  console.log('\nClase:');
  classes?.forEach(c => console.log(`  ${c.name} | ${c.start_time}-${c.end_time}`));
}

main().catch(console.error);
