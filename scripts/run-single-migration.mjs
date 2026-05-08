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

const migrationFile = process.argv[2];

if (!migrationFile) {
  console.error('Usage: node run-single-migration.mjs <migration-file>');
  process.exit(1);
}

async function runMigration() {
  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL\n');

    const filePath = path.join(__dirname, '..', 'supabase', 'migrations', migrationFile);
    const sql = fs.readFileSync(filePath, 'utf8');

    console.log(`Running ${migrationFile}...`);
    await client.query(sql);
    console.log(`✓ ${migrationFile} completed successfully!`);
  } catch (error) {
    console.error('Migration error:', error.message);
  } finally {
    await client.end();
  }
}

runMigration();
