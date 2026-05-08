import pg from 'pg';

const client = new pg.Client({
  host: 'db.htdmbkzahhoefslmmnut.supabase.co',
  port: 5432,
  user: 'postgres',
  password: 'TheSquare2024!',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

const tables = [
  'members', 'teachers', 'classes', 'enrollments', 'payments',
  'payment_reminders', 'lessons', 'class_sessions', 'attendance', 'activity_log',
  'productivity_questions', 'daily_responses', 'recurring_tasks', 'daily_tasks', 'daily_summary',
  'competitions', 'competition_participants'
];

async function addAnonPolicies() {
  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL');

    for (const table of tables) {
      const policyName = `Allow anon users full access to ${table}`;
      const sql = `
        CREATE POLICY "${policyName}"
        ON ${table} FOR ALL TO anon
        USING (true) WITH CHECK (true);
      `;

      try {
        await client.query(sql);
        console.log(`✓ Added anon policy to ${table}`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`- Policy already exists for ${table}`);
        } else {
          console.error(`✗ Error on ${table}:`, error.message);
        }
      }
    }

    console.log('\nAnon policies added!');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

addAnonPolicies();
