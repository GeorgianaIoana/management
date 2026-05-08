import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const client = new pg.Client({
  host: 'db.htdmbkzahhoefslmmnut.supabase.co',
  port: 5432,
  user: 'postgres',
  password: 'TheSquare2024!',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

const migrations = [
  '001_initial_schema.sql',
  '002_productivity.sql',
  '003_competitions.sql',
  '004_add_is_priority_to_daily_tasks.sql',
  '005_add_member_fields.sql'
];

async function runMigrations() {
  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL');

    for (const migration of migrations) {
      const filePath = path.join(__dirname, '..', 'supabase', 'migrations', migration);
      const sql = fs.readFileSync(filePath, 'utf8');

      console.log(`Running ${migration}...`);
      await client.query(sql);
      console.log(`✓ ${migration} completed`);
    }

    console.log('\nAll migrations completed successfully!');
  } catch (error) {
    console.error('Migration error:', error.message);
  } finally {
    await client.end();
  }
}

runMigrations();
