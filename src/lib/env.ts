import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),
});

type Env = z.infer<typeof envSchema>;

function validateEnv(): Env | null {
  const env = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };

  const result = envSchema.safeParse(env);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const missingVars = Object.entries(errors)
      .map(([key, messages]) => `  - ${key}: ${messages?.join(', ')}`)
      .join('\n');

    console.error(
      '\n========================================\n' +
      'Missing or invalid environment variables:\n' +
      '========================================\n' +
      missingVars +
      '\n\nPlease create a .env.local file with:\n' +
      '  NEXT_PUBLIC_SUPABASE_URL=your-project-url\n' +
      '  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key\n' +
      '========================================\n'
    );

    return null;
  }

  return result.data;
}

export const env = validateEnv();

export function isSupabaseConfigured(): boolean {
  return env !== null;
}
