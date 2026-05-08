import { z } from 'zod';

export const memberSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(100),
  last_name: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email').nullable().or(z.literal('')),
  phone: z.string().max(50).nullable().or(z.literal('')),
  date_of_birth: z.string().nullable().or(z.literal('')),
  member_type: z.enum(['child', 'adult']),
  guardian_name: z.string().max(200).nullable().or(z.literal('')),
  guardian_phone: z.string().max(50).nullable().or(z.literal('')),
  guardian_email: z.string().email('Invalid email').nullable().or(z.literal('')),
  chess_rating: z.number().int().min(0).max(3000).nullable().optional(),
  skill_level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).nullable().optional(),
  status: z.enum(['active', 'inactive', 'suspended']),
  join_date: z.string(),
  avatar_url: z.string().nullable().optional(),
  notes: z.string().max(5000, 'Notes cannot exceed 5000 characters').nullable().optional(),
  contract_signed: z.boolean().default(false),
  contract_file_url: z.string().nullable().optional(),
  payment_confirmed: z.boolean().default(false),
  feedback_received: z.boolean().default(false),
  rating_given: z.boolean().default(false),
  trainer_id: z.string().uuid().nullable().optional(),
}).refine((data) => {
  // If member is a child, guardian info should be provided
  if (data.member_type === 'child') {
    return data.guardian_name && data.guardian_name.length > 0;
  }
  return true;
}, {
  message: 'Guardian name is required for child members',
  path: ['guardian_name'],
});

export type MemberFormValues = z.infer<typeof memberSchema>;
