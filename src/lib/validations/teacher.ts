import { z } from 'zod';

export const teacherSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(100),
  last_name: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email'),
  phone: z.string().max(50).nullable().or(z.literal('')),
  chess_title: z.enum(['GM', 'IM', 'FM', 'CM', 'NM', 'WGM', 'WIM', 'WFM', 'WCM']).nullable().optional(),
  chess_rating: z.number().int().min(0).max(3000).nullable().optional(),
  bio: z.string().nullable().optional(),
  specializations: z.array(z.string()).nullable().optional(),
  teaching_levels: z.array(z.string()).nullable().optional(),
  hourly_rate: z.number().min(0).nullable().optional(),
  is_active: z.boolean(),
  avatar_url: z.string().nullable().optional(),
});

export type TeacherFormValues = z.infer<typeof teacherSchema>;

export const chessTitles = [
  { value: 'GM', label: 'Grandmaster (GM)' },
  { value: 'IM', label: 'International Master (IM)' },
  { value: 'FM', label: 'FIDE Master (FM)' },
  { value: 'CM', label: 'Candidate Master (CM)' },
  { value: 'NM', label: 'National Master (NM)' },
  { value: 'WGM', label: 'Woman Grandmaster (WGM)' },
  { value: 'WIM', label: 'Woman International Master (WIM)' },
  { value: 'WFM', label: 'Woman FIDE Master (WFM)' },
  { value: 'WCM', label: 'Woman Candidate Master (WCM)' },
];

export const defaultSpecializations = [
  'Openings',
  'Middlegame',
  'Endgame',
  'Tactics',
  'Strategy',
  'Classical Chess',
  'Rapid Chess',
  'Blitz Chess',
  'Youth Training',
  'Beginner Training',
  'Advanced Training',
  'Tournament Preparation',
];
