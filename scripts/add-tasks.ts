import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addPriorityTask(date: string, title: string) {
  const { data, error } = await supabase
    .from('daily_tasks')
    .insert({
      title,
      task_date: date,
      is_completed: false,
      is_custom: true,
      is_priority: true,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function main() {
  const today = '2026-05-08';
  const tasks = [
    'Documente necesare Lecții cu nevăzători',
    'Print despre endgame și tabără',
    'Postat cu Cosmin',
    'Fișe pentru părinți cu documente semnate și adrese de e-mail',
    'Plan pentru vară - gândire strategică de lecții și încasări',
    'Sponsorizări',
    'Strategie conținut media',
  ];

  console.log(`Adaug ${tasks.length} priorități pentru ${today}...\n`);

  for (const title of tasks) {
    try {
      await addPriorityTask(today, title);
      console.log(`✓ ${title}`);
    } catch (error) {
      console.error(`✗ ${title}:`, error);
    }
  }

  console.log('\nGata!');
}

main();
