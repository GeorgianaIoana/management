import { z } from 'zod';

export const lessonSchema = z.object({
  title: z.string().min(1, 'Title is required').max(300),
  description: z.string().max(5000, 'Description cannot exceed 5000 characters').nullable().optional(),
  category: z.string().max(100).nullable().optional(),
  tags: z.array(z.string()).nullable().optional(),
  skill_level: z.enum(['beginner', 'intermediate', 'advanced', 'expert', 'all']).nullable().optional(),
  target_age_group: z.enum(['kids', 'adults', 'all']).nullable().optional(),
  file_url: z.string().nullable().optional(),
  file_name: z.string().nullable().optional(),
  file_type: z.string().nullable().optional(),
  file_size: z.number().nullable().optional(),
  class_id: z.string().uuid().nullable().optional(),
  uploaded_by: z.string().uuid().nullable().optional(),
});

export type LessonFormValues = z.infer<typeof lessonSchema>;

export const defaultCategories = [
  'Opening Theory',
  'Middlegame Strategy',
  'Endgame Technique',
  'Tactical Puzzles',
  'Classic Games',
  'Modern Games',
  'Game Analysis',
  'Tournament Preparation',
  'Training Materials',
  'Rules & Etiquette',
];

export const skillLevels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
  { value: 'all', label: 'All Levels' },
];

export const ageGroups = [
  { value: 'kids', label: 'Kids' },
  { value: 'adults', label: 'Adults' },
  { value: 'all', label: 'All Ages' },
];

export const fileTypeIcons: Record<string, string> = {
  'application/pdf': 'pdf',
  'image/jpeg': 'image',
  'image/png': 'image',
  'image/gif': 'image',
  'video/mp4': 'video',
  'video/webm': 'video',
  'application/x-chess-pgn': 'pgn',
  'text/plain': 'text',
};

export function getFileTypeIcon(mimeType: string): string {
  if (mimeType.includes('pdf')) return 'pdf';
  if (mimeType.includes('image')) return 'image';
  if (mimeType.includes('video')) return 'video';
  if (mimeType.includes('pgn') || mimeType.includes('chess')) return 'pgn';
  return 'file';
}
