import { z } from 'zod';

export const competitionSchema = z.object({
  name: z.string().min(1, 'Numele este obligatoriu').max(200),
  description: z.string().nullable().optional(),
  event_date: z.string().min(1, 'Data evenimentului este obligatorie'),
  end_date: z.string().nullable().optional(),
  location: z.string().max(200).nullable().optional(),
  status: z.enum(['planned', 'ongoing', 'completed', 'cancelled']),
  notes: z.string().nullable().optional(),
}).refine((data) => {
  if (data.end_date && data.event_date) {
    return new Date(data.end_date) >= new Date(data.event_date);
  }
  return true;
}, {
  message: 'Data de sfârșit trebuie să fie după data de început',
  path: ['end_date'],
});

export type CompetitionFormValues = z.infer<typeof competitionSchema>;

export const participantSchema = z.object({
  name: z.string().min(1, 'Numele este obligatoriu').max(200),
  email: z.string().email('Email invalid').nullable().or(z.literal('')).optional(),
  phone: z.string().max(50).nullable().optional(),
  notes: z.string().nullable().optional(),
});

export type ParticipantFormValues = z.infer<typeof participantSchema>;
