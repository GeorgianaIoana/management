import { z } from 'zod';

// Question schema
export const productivityQuestionSchema = z.object({
  question_text: z.string().min(1, 'Question text is required').max(500),
  question_type: z.enum(['morning', 'evening']),
  response_type: z.enum(['text', 'scale', 'mood', 'energy']),
  display_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});

export type ProductivityQuestionFormValues = z.infer<typeof productivityQuestionSchema>;

// Daily response schema
export const dailyResponseSchema = z.object({
  question_id: z.string().uuid(),
  response_date: z.string(),
  response_text: z.string().max(2000).nullable().optional(),
  response_value: z.number().int().min(1).max(5).nullable().optional(),
});

export type DailyResponseFormValues = z.infer<typeof dailyResponseSchema>;

// Recurring task schema
export const recurringTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).nullable().optional(),
  frequency: z.enum(['daily', 'weekdays', 'weekends', 'weekly']),
  is_active: z.boolean().default(true),
  display_order: z.number().int().min(0).default(0),
});

export type RecurringTaskFormValues = z.infer<typeof recurringTaskSchema>;

// Daily task schema
export const dailyTaskSchema = z.object({
  recurring_task_id: z.string().uuid().nullable().optional(),
  title: z.string().min(1, 'Title is required').max(200),
  task_date: z.string(),
  is_completed: z.boolean().default(false),
  completed_at: z.string().nullable().optional(),
  is_custom: z.boolean().default(false),
});

export type DailyTaskFormValues = z.infer<typeof dailyTaskSchema>;

// Custom task (simplified for add dialog)
export const customTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
});

export type CustomTaskFormValues = z.infer<typeof customTaskSchema>;

// Daily summary schema
export const dailySummarySchema = z.object({
  summary_date: z.string(),
  morning_mood: z.number().int().min(1).max(5).nullable().optional(),
  morning_energy: z.number().int().min(1).max(5).nullable().optional(),
  evening_mood: z.number().int().min(1).max(5).nullable().optional(),
  evening_energy: z.number().int().min(1).max(5).nullable().optional(),
  tasks_completed: z.number().int().min(0).default(0),
  tasks_total: z.number().int().min(0).default(0),
  notes: z.string().max(2000).nullable().optional(),
});

export type DailySummaryFormValues = z.infer<typeof dailySummarySchema>;

// Bulk check-in response schema
export const checkInResponsesSchema = z.array(
  z.object({
    question_id: z.string().uuid(),
    response_text: z.string().nullable().optional(),
    response_value: z.number().int().min(1).max(5).nullable().optional(),
  })
);

export type CheckInResponsesFormValues = z.infer<typeof checkInResponsesSchema>;

// Helper options for dropdowns
export const questionTypeOptions = [
  { value: 'morning', label: 'Dimineață' },
  { value: 'evening', label: 'Seară' },
];

export const responseTypeOptions = [
  { value: 'text', label: 'Text' },
  { value: 'scale', label: 'Scale (1-5)' },
  { value: 'mood', label: 'Mood' },
  { value: 'energy', label: 'Energy' },
];

export const frequencyOptions = [
  { value: 'daily', label: 'Zilnic' },
  { value: 'weekdays', label: 'Zile lucrătoare' },
  { value: 'weekends', label: 'Weekend' },
  { value: 'weekly', label: 'Săptămânal' },
];

// Mood emoji options
export const moodOptions = [
  { value: 1, emoji: '😢', label: 'Foarte rău' },
  { value: 2, emoji: '😕', label: 'Rău' },
  { value: 3, emoji: '😐', label: 'Neutru' },
  { value: 4, emoji: '😀', label: 'Bine' },
  { value: 5, emoji: '😊', label: 'Foarte bine' },
];

// Energy level options
export const energyOptions = [
  { value: 1, label: 'Foarte scăzut' },
  { value: 2, label: 'Scăzut' },
  { value: 3, label: 'Mediu' },
  { value: 4, label: 'Ridicat' },
  { value: 5, label: 'Foarte ridicat' },
];
