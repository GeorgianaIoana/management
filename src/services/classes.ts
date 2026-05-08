import { createClient } from '@/lib/supabase/client';
import { getClassName } from '@/lib/utils';
import { classSchema } from '@/lib/validations/class';
import type { Class, ClassSession, Enrollment, Attendance, PaginatedResponse, PaginationParams, ClassFilters } from '@/types';

const supabase = createClient();

class ValidationError extends Error {
  constructor(public errors: Record<string, string[]>) {
    super('Validation failed');
    this.name = 'ValidationError';
  }
}

export async function getClasses(
  filters?: ClassFilters,
  pagination?: PaginationParams
): Promise<PaginatedResponse<Class>> {
  const page = pagination?.page ?? 1;
  const pageSize = pagination?.pageSize ?? 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('classes')
    .select('*, teacher:teachers(*)', { count: 'exact' });

  if (filters?.search) {
    query = query.ilike('name', `%${filters.search}%`);
  }

  if (filters?.target_age_group && filters.target_age_group !== 'all') {
    query = query.eq('target_age_group', filters.target_age_group);
  }

  if (filters?.day_of_week !== undefined) {
    query = query.eq('day_of_week', filters.day_of_week);
  }

  if (filters?.teacher_id) {
    query = query.eq('teacher_id', filters.teacher_id);
  }

  if (filters?.is_active !== undefined) {
    query = query.eq('is_active', filters.is_active);
  }

  query = query
    .order('day_of_week')
    .order('start_time')
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

export async function getAllClasses(): Promise<Class[]> {
  const { data, error } = await supabase
    .from('classes')
    .select('*, teacher:teachers(*)')
    .eq('is_active', true)
    .order('name');

  if (error) throw error;
  return data ?? [];
}

export async function getClass(id: string): Promise<Class | null> {
  const { data, error } = await supabase
    .from('classes')
    .select('*, teacher:teachers(*)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createClass(classData: Omit<Class, 'id' | 'created_at' | 'updated_at' | 'teacher' | 'enrollments_count'>): Promise<Class> {
  // Server-side validation
  const validation = classSchema.safeParse(classData);
  if (!validation.success) {
    throw new ValidationError(validation.error.flatten().fieldErrors as Record<string, string[]>);
  }

  const { data, error } = await supabase
    .from('classes')
    .insert(classData)
    .select('*, teacher:teachers(*)')
    .single();

  if (error) throw error;

  await logActivity('class', data.id, 'created', `New class: ${getClassName(data.day_of_week, data.target_age_group)}`);

  return data as Class;
}

export async function updateClass(id: string, classData: Partial<Class>): Promise<Class> {
  const { teacher: _teacher, enrollments_count: _enrollments_count, ...updateData } = classData;

  // Server-side validation for partial updates
  const validation = classSchema.partial().safeParse(updateData);
  if (!validation.success) {
    throw new ValidationError(validation.error.flatten().fieldErrors as Record<string, string[]>);
  }

  const { data, error } = await supabase
    .from('classes')
    .update(updateData)
    .eq('id', id)
    .select('*, teacher:teachers(*)')
    .single();

  if (error) throw error;

  await logActivity('class', data.id, 'updated', `Updated class: ${getClassName(data.day_of_week, data.target_age_group)}`);

  return data as Class;
}

export async function deleteClass(id: string): Promise<void> {
  const { data: cls } = await supabase
    .from('classes')
    .select('day_of_week, target_age_group')
    .eq('id', id)
    .single();

  const { error } = await supabase
    .from('classes')
    .delete()
    .eq('id', id);

  if (error) throw error;

  if (cls) {
    await logActivity('class', id, 'deleted', `Deleted class: ${getClassName(cls.day_of_week, cls.target_age_group)}`);
  }
}

// Enrollments
export async function getClassEnrollments(classId: string): Promise<Enrollment[]> {
  const { data, error } = await supabase
    .from('enrollments')
    .select('*, member:members(*)')
    .eq('class_id', classId)
    .eq('is_active', true)
    .order('enrolled_date');

  if (error) throw error;
  return data ?? [];
}

export async function enrollMember(classId: string, memberId: string): Promise<Enrollment> {
  const { data, error } = await supabase
    .from('enrollments')
    .insert({
      class_id: classId,
      member_id: memberId,
      enrolled_date: new Date().toISOString().split('T')[0],
      is_active: true,
    })
    .select('*, member:members(*)')
    .single();

  if (error) throw error;
  return data;
}

export async function unenrollMember(enrollmentId: string): Promise<void> {
  const { error } = await supabase
    .from('enrollments')
    .update({ is_active: false })
    .eq('id', enrollmentId);

  if (error) throw error;
}

// Class Sessions
export async function getClassSessions(classId: string, startDate?: string, endDate?: string): Promise<ClassSession[]> {
  let query = supabase
    .from('class_sessions')
    .select('*, teacher:teachers(*)')
    .eq('class_id', classId)
    .order('session_date', { ascending: false });

  if (startDate) {
    query = query.gte('session_date', startDate);
  }

  if (endDate) {
    query = query.lte('session_date', endDate);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data ?? [];
}

export async function createClassSession(session: Omit<ClassSession, 'id' | 'created_at' | 'updated_at' | 'class' | 'teacher' | 'attendance'>): Promise<ClassSession> {
  const { data, error } = await supabase
    .from('class_sessions')
    .insert(session)
    .select('*, teacher:teachers(*)')
    .single();

  if (error) throw error;
  return data;
}

export async function updateClassSession(id: string, session: Partial<ClassSession>): Promise<ClassSession> {
  const { class: _cls, teacher: _teacher, attendance: _attendance, ...updateData } = session;

  const { data, error } = await supabase
    .from('class_sessions')
    .update(updateData)
    .eq('id', id)
    .select('*, teacher:teachers(*)')
    .single();

  if (error) throw error;
  return data;
}

// Attendance
export async function getSessionAttendance(sessionId: string): Promise<Attendance[]> {
  const { data, error } = await supabase
    .from('attendance')
    .select('*, member:members(*)')
    .eq('session_id', sessionId);

  if (error) throw error;
  return data ?? [];
}

export async function recordAttendance(sessionId: string, memberId: string, attended: boolean): Promise<Attendance> {
  const { data, error } = await supabase
    .from('attendance')
    .upsert({
      session_id: sessionId,
      member_id: memberId,
      attended,
    }, {
      onConflict: 'session_id,member_id',
    })
    .select('*, member:members(*)')
    .single();

  if (error) throw error;
  return data;
}

export async function bulkRecordAttendance(
  sessionId: string,
  attendanceRecords: { member_id: string; attended: boolean }[]
): Promise<void> {
  const records = attendanceRecords.map((record) => ({
    session_id: sessionId,
    member_id: record.member_id,
    attended: record.attended,
  }));

  const { error } = await supabase
    .from('attendance')
    .upsert(records, {
      onConflict: 'session_id,member_id',
    });

  if (error) throw error;
}

// Get recent attendance sessions with details
export interface SessionWithAttendance {
  id: string;
  class_id: string;
  session_date: string;
  status: string;
  notes: string | null;
  created_at: string;
  class: Class | null;
  attendanceDetails: {
    present: { id: string; name: string }[];
    absent: { id: string; name: string }[];
  };
}

export async function getRecentSessions(limit: number = 20): Promise<SessionWithAttendance[]> {
  const { data: sessions, error } = await supabase
    .from('class_sessions')
    .select('*, class:classes(*, teacher:teachers(*)), attendance(*, member:members(first_name, last_name))')
    .order('session_date', { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (sessions ?? []).map((session) => {
    const attendanceRecords = session.attendance || [];
    const present = attendanceRecords
      .filter((a: { attended: boolean; member: { first_name: string; last_name: string } | null }) => a.attended && a.member)
      .map((a: { member: { first_name: string; last_name: string } }) => ({
        id: a.member.first_name + a.member.last_name,
        name: `${a.member.first_name} ${a.member.last_name || ''}`.trim(),
      }));
    const absent = attendanceRecords
      .filter((a: { attended: boolean; member: { first_name: string; last_name: string } | null }) => !a.attended && a.member)
      .map((a: { member: { first_name: string; last_name: string } }) => ({
        id: a.member.first_name + a.member.last_name,
        name: `${a.member.first_name} ${a.member.last_name || ''}`.trim(),
      }));

    return {
      ...session,
      class: session.class,
      attendanceDetails: { present, absent },
    };
  });
}

// Schedule helpers
export async function getWeeklySchedule(_weekStart: string): Promise<Class[]> {
  const { data, error } = await supabase
    .from('classes')
    .select('*, teacher:teachers(*)')
    .eq('is_active', true)
    .order('day_of_week')
    .order('start_time');

  if (error) throw error;
  return data ?? [];
}

export async function getTodaysClasses(): Promise<Class[]> {
  const today = new Date().getDay();

  const { data, error } = await supabase
    .from('classes')
    .select('*, teacher:teachers(*)')
    .eq('is_active', true)
    .eq('day_of_week', today)
    .order('start_time');

  if (error) throw error;
  return data ?? [];
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
 * Create a session for a teacher's class
 */
export async function createTeacherSession(
  teacherId: string,
  classId: string,
  sessionDate: string
): Promise<ClassSession | null> {
  // Verify class belongs to teacher
  const { data: classData } = await supabase
    .from('classes')
    .select('teacher_id')
    .eq('id', classId)
    .single();

  if (!classData || classData.teacher_id !== teacherId) {
    console.error('Class does not belong to teacher');
    return null;
  }

  const { data, error } = await supabase
    .from('class_sessions')
    .insert({
      class_id: classId,
      session_date: sessionDate,
      teacher_id: teacherId,
      status: 'scheduled',
    })
    .select('*, teacher:teachers(*)')
    .single();

  if (error) {
    console.error('Error creating session:', error);
    return null;
  }

  return data;
}

/**
 * Update attendance for a teacher's session
 */
export async function updateTeacherSessionAttendance(
  teacherId: string,
  sessionId: string,
  attendanceRecords: { member_id: string; attended: boolean }[]
): Promise<boolean> {
  // Verify session belongs to teacher's class
  const { data: sessionData } = await supabase
    .from('class_sessions')
    .select('class_id')
    .eq('id', sessionId)
    .single();

  if (!sessionData?.class_id) {
    console.error('Session not found');
    return false;
  }

  const { data: classData } = await supabase
    .from('classes')
    .select('teacher_id')
    .eq('id', sessionData.class_id)
    .single();

  if (!classData || classData.teacher_id !== teacherId) {
    console.error('Session does not belong to teacher');
    return false;
  }

  const records = attendanceRecords.map((record) => ({
    session_id: sessionId,
    member_id: record.member_id,
    attended: record.attended,
  }));

  const { error } = await supabase
    .from('attendance')
    .upsert(records, {
      onConflict: 'session_id,member_id',
    });

  if (error) {
    console.error('Error updating attendance:', error);
    return false;
  }

  // Update session status if there are present members
  const hasPresent = attendanceRecords.some((r) => r.attended);
  if (hasPresent) {
    await supabase
      .from('class_sessions')
      .update({ status: 'completed' })
      .eq('id', sessionId);
  }

  return true;
}

/**
 * Get teacher's sessions with attendance details
 */
export async function getTeacherSessionsWithAttendance(
  teacherId: string,
  limit: number = 20
) {
  const { data: sessions, error } = await supabase
    .from('class_sessions')
    .select('*, class:classes(*, teacher:teachers(*)), attendance(*, member:members(first_name, last_name))')
    .order('session_date', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching sessions:', error);
    return [];
  }

  // Filter to only include teacher's classes
  const filteredSessions = (sessions || []).filter(
    (session) => session.class?.teacher_id === teacherId
  );

  return filteredSessions.map((session) => {
    const attendanceRecords = session.attendance || [];
    const present = attendanceRecords
      .filter((a: { attended: boolean }) => a.attended)
      .map((a: { member: { first_name: string; last_name: string } | null }) =>
        a.member ? `${a.member.first_name} ${a.member.last_name}` : 'Unknown'
      );
    const absent = attendanceRecords
      .filter((a: { attended: boolean }) => !a.attended)
      .map((a: { member: { first_name: string; last_name: string } | null }) =>
        a.member ? `${a.member.first_name} ${a.member.last_name}` : 'Unknown'
      );

    return {
      ...session,
      presentCount: present.length,
      absentCount: absent.length,
      presentNames: present,
      absentNames: absent,
    };
  });
}
