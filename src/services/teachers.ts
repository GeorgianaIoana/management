import { createClient } from '@/lib/supabase/client';
import type { Teacher, PaginatedResponse, PaginationParams } from '@/types';

const supabase = createClient();

interface TeacherFilters {
  search?: string;
  is_active?: boolean;
}

export async function getTeachers(
  filters?: TeacherFilters,
  pagination?: PaginationParams
): Promise<PaginatedResponse<Teacher>> {
  const page = pagination?.page ?? 1;
  const pageSize = pagination?.pageSize ?? 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('teachers')
    .select('*', { count: 'exact' });

  if (filters?.search) {
    query = query.or(
      `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
    );
  }

  if (filters?.is_active !== undefined) {
    query = query.eq('is_active', filters.is_active);
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

export async function getAllTeachers(): Promise<Teacher[]> {
  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .eq('is_active', true)
    .order('first_name');

  if (error) throw error;
  return data ?? [];
}

export async function getTeacher(id: string): Promise<Teacher | null> {
  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createTeacher(teacher: Omit<Teacher, 'id' | 'created_at' | 'updated_at'>): Promise<Teacher> {
  const { data, error } = await supabase
    .from('teachers')
    .insert(teacher)
    .select()
    .single();

  if (error) throw error;

  await logActivity('teacher', data.id, 'created', `New teacher: ${data.first_name} ${data.last_name}`);

  return data;
}

export async function updateTeacher(id: string, teacher: Partial<Teacher>): Promise<Teacher> {
  const { data, error } = await supabase
    .from('teachers')
    .update(teacher)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  await logActivity('teacher', data.id, 'updated', `Updated teacher: ${data.first_name} ${data.last_name}`);

  return data;
}

export async function deleteTeacher(id: string): Promise<void> {
  const { data: teacher } = await supabase
    .from('teachers')
    .select('first_name, last_name')
    .eq('id', id)
    .single();

  const { error } = await supabase
    .from('teachers')
    .delete()
    .eq('id', id);

  if (error) throw error;

  if (teacher) {
    await logActivity('teacher', id, 'deleted', `Deleted teacher: ${teacher.first_name} ${teacher.last_name}`);
  }
}

export async function getTeacherClasses(teacherId: string) {
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .eq('teacher_id', teacherId)
    .eq('is_active', true)
    .order('day_of_week');

  if (error) throw error;
  return data;
}

export async function getTeacherSchedule(teacherId: string, startDate: string, endDate: string) {
  const { data, error } = await supabase
    .from('class_sessions')
    .select('*, class:classes(*)')
    .eq('teacher_id', teacherId)
    .gte('session_date', startDate)
    .lte('session_date', endDate)
    .order('session_date');

  if (error) throw error;
  return data;
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

// ==========================================
// Teacher-scoped functions (for teacher portal)
// ==========================================

/**
 * Get teacher by auth_id (for logged-in teacher)
 */
export async function getTeacherByAuthId(authId: string): Promise<Teacher | null> {
  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .eq('auth_id', authId)
    .single();

  if (error) return null;
  return data;
}

/**
 * Update teacher's own profile (limited fields)
 */
export async function updateTeacherProfile(
  teacherId: string,
  profile: {
    bio?: string | null;
    chess_title?: string | null;
    chess_rating?: number | null;
    specializations?: string[] | null;
    teaching_levels?: string[] | null;
  }
): Promise<Teacher | null> {
  const { data, error } = await supabase
    .from('teachers')
    .update(profile)
    .eq('id', teacherId)
    .select()
    .single();

  if (error) {
    console.error('Error updating teacher profile:', error);
    return null;
  }

  return data;
}

/**
 * Get classes assigned to a specific teacher
 */
export async function getTeacherOwnClasses(teacherId: string) {
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .eq('teacher_id', teacherId)
    .eq('is_active', true)
    .order('day_of_week')
    .order('start_time');

  if (error) {
    console.error('Error fetching teacher classes:', error);
    return [];
  }

  return data || [];
}

/**
 * Get sessions for teacher's classes
 */
export async function getTeacherSessions(
  teacherId: string,
  options?: {
    startDate?: string;
    endDate?: string;
    classId?: string;
    limit?: number;
  }
) {
  let query = supabase
    .from('class_sessions')
    .select('*, class:classes(*), attendance(*, member:members(*))')
    .order('session_date', { ascending: false });

  if (options?.startDate) {
    query = query.gte('session_date', options.startDate);
  }

  if (options?.endDate) {
    query = query.lte('session_date', options.endDate);
  }

  if (options?.classId) {
    query = query.eq('class_id', options.classId);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching teacher sessions:', error);
    return [];
  }

  // Filter to only include sessions for teacher's classes
  // (RLS should handle this, but extra safety)
  const filteredData = (data || []).filter(
    (session) => session.class?.teacher_id === teacherId
  );

  return filteredData;
}

/**
 * Get enrolled members for teacher's classes
 */
export async function getTeacherClassMembers(teacherId: string, classId: string) {
  // First verify the class belongs to the teacher
  const { data: classData } = await supabase
    .from('classes')
    .select('teacher_id')
    .eq('id', classId)
    .single();

  if (!classData || classData.teacher_id !== teacherId) {
    return [];
  }

  const { data, error } = await supabase
    .from('enrollments')
    .select('*, member:members(*)')
    .eq('class_id', classId)
    .eq('is_active', true)
    .order('enrolled_date');

  if (error) {
    console.error('Error fetching class members:', error);
    return [];
  }

  return data || [];
}
