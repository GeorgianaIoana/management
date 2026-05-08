import { createClient } from '@/lib/supabase/client';
import type { Lesson, LessonFilters, PaginatedResponse, PaginationParams } from '@/types';

const supabase = createClient();

export async function getLessons(
  filters?: LessonFilters,
  pagination?: PaginationParams
): Promise<PaginatedResponse<Lesson>> {
  const page = pagination?.page ?? 1;
  const pageSize = pagination?.pageSize ?? 12;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('lessons')
    .select('*, class:classes(*)', { count: 'exact' });

  if (filters?.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    );
  }

  if (filters?.category) {
    query = query.eq('category', filters.category);
  }

  if (filters?.skill_level) {
    query = query.eq('skill_level', filters.skill_level);
  }

  if (filters?.target_age_group) {
    query = query.eq('target_age_group', filters.target_age_group);
  }

  if (filters?.tags && filters.tags.length > 0) {
    query = query.overlaps('tags', filters.tags);
  }

  query = query
    .order('created_at', { ascending: false })
    .range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    data: data ?? [],
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  };
}

export async function getLesson(id: string): Promise<Lesson | null> {
  const { data, error } = await supabase
    .from('lessons')
    .select('*, class:classes(*)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createLesson(lesson: Omit<Lesson, 'id' | 'created_at' | 'updated_at' | 'class'>): Promise<Lesson> {
  const { data, error } = await supabase
    .from('lessons')
    .insert(lesson)
    .select('*, class:classes(*)')
    .single();

  if (error) throw error;

  await logActivity('lesson', data.id, 'created', `New lesson: ${data.title}`);

  return data;
}

export async function updateLesson(id: string, lesson: Partial<Lesson>): Promise<Lesson> {
  const { class: _cls, ...updateData } = lesson;

  const { data, error } = await supabase
    .from('lessons')
    .update(updateData)
    .eq('id', id)
    .select('*, class:classes(*)')
    .single();

  if (error) throw error;

  await logActivity('lesson', data.id, 'updated', `Updated lesson: ${data.title}`);

  return data;
}

export async function deleteLesson(id: string): Promise<void> {
  const { data: lesson } = await supabase
    .from('lessons')
    .select('title, file_url')
    .eq('id', id)
    .single();

  // Delete file from storage if exists
  if (lesson?.file_url) {
    const path = lesson.file_url.split('/').pop();
    if (path) {
      await supabase.storage.from('documents').remove([`lessons/${path}`]);
    }
  }

  const { error } = await supabase
    .from('lessons')
    .delete()
    .eq('id', id);

  if (error) throw error;

  if (lesson) {
    await logActivity('lesson', id, 'deleted', `Deleted lesson: ${lesson.title}`);
  }
}

export async function uploadLessonFile(file: File): Promise<{ url: string; name: string; type: string; size: number }> {
  // Security: Validate file before upload
  const { validateFileUpload, generateSecureFileName, sanitizeFileName } = await import('@/lib/validations/file-upload');
  const validation = validateFileUpload(file, 'lesson');
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const fileName = generateSecureFileName(file.name);
  const filePath = `lessons/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('documents')
    .getPublicUrl(filePath);

  return {
    url: data.publicUrl,
    name: sanitizeFileName(file.name),
    type: file.type,
    size: file.size,
  };
}

export async function getCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('lessons')
    .select('category')
    .not('category', 'is', null);

  if (error) throw error;

  const categories = [...new Set(data?.map((l) => l.category).filter(Boolean))];
  return categories as string[];
}

export async function getTags(): Promise<string[]> {
  const { data, error } = await supabase
    .from('lessons')
    .select('tags')
    .not('tags', 'is', null);

  if (error) throw error;

  const allTags = data?.flatMap((l) => l.tags ?? []) ?? [];
  return [...new Set(allTags)];
}

async function logActivity(
  entityType: string,
  entityId: string,
  action: string,
  description: string
) {
  await supabase.from('activity_log').insert({
    entity_type: entityType,
    entity_id: entityId,
    action,
    description,
  });
}
