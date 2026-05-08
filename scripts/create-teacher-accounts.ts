/**
 * Bulk Teacher Account Creation Script
 *
 * This script creates Supabase Auth accounts for all active teachers
 * who don't have an auth_id yet.
 *
 * Usage:
 *   npx tsx scripts/create-teacher-accounts.ts
 *
 * Requirements:
 *   - SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables
 *   - Run migration 008_teacher_auth.sql first
 *
 * Output:
 *   - Creates auth accounts with temporary passwords
 *   - Links auth accounts to teacher records
 *   - Outputs credentials to console and saves to credentials.json
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as crypto from 'crypto';

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: Missing required environment variables.');
  console.error('Required: SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create Supabase admin client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  auth_id: string | null;
}

interface CreatedAccount {
  teacher_id: string;
  name: string;
  email: string;
  password: string;
  auth_id: string;
}

function generatePassword(): string {
  // Generate a random 12-character password
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
  let password = '';
  const randomBytes = crypto.randomBytes(12);
  for (let i = 0; i < 12; i++) {
    password += chars[randomBytes[i] % chars.length];
  }
  return password;
}

async function createTeacherAccounts() {
  console.log('Starting teacher account creation...\n');

  // Fetch all active teachers without auth_id
  const { data: teachers, error: fetchError } = await supabase
    .from('teachers')
    .select('id, first_name, last_name, email, is_active, auth_id')
    .eq('is_active', true)
    .is('auth_id', null);

  if (fetchError) {
    console.error('Error fetching teachers:', fetchError);
    process.exit(1);
  }

  if (!teachers || teachers.length === 0) {
    console.log('No teachers found that need accounts.');
    console.log('All active teachers already have auth accounts.');
    return;
  }

  console.log(`Found ${teachers.length} teachers without auth accounts:\n`);

  const createdAccounts: CreatedAccount[] = [];
  const errors: { teacher: Teacher; error: string }[] = [];

  for (const teacher of teachers) {
    const name = `${teacher.first_name} ${teacher.last_name}`;
    console.log(`Processing: ${name} (${teacher.email})`);

    const password = generatePassword();

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: teacher.email,
        password,
        email_confirm: true, // Auto-confirm email
        app_metadata: {
          role: 'teacher',
        },
        user_metadata: {
          first_name: teacher.first_name,
          last_name: teacher.last_name,
        },
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('No user returned from auth creation');
      }

      // Update teacher record with auth_id
      const { error: updateError } = await supabase
        .from('teachers')
        .update({ auth_id: authData.user.id })
        .eq('id', teacher.id);

      if (updateError) {
        // Try to clean up the auth user if update fails
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw new Error(`Failed to update teacher record: ${updateError.message}`);
      }

      createdAccounts.push({
        teacher_id: teacher.id,
        name,
        email: teacher.email,
        password,
        auth_id: authData.user.id,
      });

      console.log(`  ✓ Account created successfully`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      errors.push({ teacher, error: errorMessage });
      console.log(`  ✗ Error: ${errorMessage}`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total processed: ${teachers.length}`);
  console.log(`Successfully created: ${createdAccounts.length}`);
  console.log(`Errors: ${errors.length}`);

  if (createdAccounts.length > 0) {
    console.log('\n' + '='.repeat(60));
    console.log('CREATED ACCOUNTS - SAVE THIS INFORMATION');
    console.log('='.repeat(60));
    console.log('\nThese are temporary passwords. Teachers should change them on first login.\n');

    for (const account of createdAccounts) {
      console.log(`Name: ${account.name}`);
      console.log(`Email: ${account.email}`);
      console.log(`Password: ${account.password}`);
      console.log('---');
    }

    // Save to file
    const outputPath = './scripts/teacher-credentials.json';
    const outputData = {
      created_at: new Date().toISOString(),
      accounts: createdAccounts.map((a) => ({
        name: a.name,
        email: a.email,
        password: a.password,
      })),
    };

    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));
    console.log(`\nCredentials saved to: ${outputPath}`);
    console.log('IMPORTANT: Delete this file after distributing credentials to teachers!');
  }

  if (errors.length > 0) {
    console.log('\n' + '='.repeat(60));
    console.log('ERRORS');
    console.log('='.repeat(60));
    for (const { teacher, error } of errors) {
      console.log(`${teacher.first_name} ${teacher.last_name} (${teacher.email}): ${error}`);
    }
  }
}

// Run the script
createTeacherAccounts()
  .then(() => {
    console.log('\nScript completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nScript failed:', error);
    process.exit(1);
  });
