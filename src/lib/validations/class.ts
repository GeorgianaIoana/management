import { z } from 'zod';

export const classSchema = z.object({
  name: z.string().max(200).nullable().optional(), // Optional - name is generated dynamically from day + age group
  description: z.string().max(2000, 'Description cannot exceed 2000 characters').nullable().optional(),
  target_age_group: z.enum(['kids', 'adults', 'all']),
  day_of_week: z.number().int().min(0).max(6),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
  max_students: z.number().int().min(1),
  price_per_session: z.number().min(0).nullable().optional(),
  price_per_month: z.number().min(0).nullable().optional(),
  teacher_id: z.string().uuid().nullable().optional(),
  is_active: z.boolean(),
  location: z.string().max(200).nullable().optional(),
}).refine((data) => {
  const start = data.start_time.split(':').map(Number);
  const end = data.end_time.split(':').map(Number);
  const startMinutes = start[0] * 60 + start[1];
  const endMinutes = end[0] * 60 + end[1];
  return endMinutes > startMinutes;
}, {
  message: 'End time must be after start time',
  path: ['end_time'],
});

export type ClassFormValues = z.infer<typeof classSchema>;

export const dayNames = [
  'Duminica',
  'Luni',
  'Marti',
  'Miercuri',
  'Joi',
  'Vineri',
  'Sambata',
];

export const dayOptions = dayNames.map((name, index) => ({
  value: index.toString(),
  label: name,
}));

export const ageGroupLabels: Record<string, string> = {
  kids: 'Copii',
  adults: 'Adulti',
  all: 'Toti',
};
