import { createClient } from '@/lib/supabase/client';
import { memberSchema } from '@/lib/validations/member';
import type { Member, MemberFilters, PaginatedResponse, PaginationParams } from '@/types';

const supabase = createClient();

class ValidationError extends Error {
  constructor(public errors: Record<string, string[]>) {
    super('Validation failed');
    this.name = 'ValidationError';
  }
}

export async function getMembers(
  filters?: MemberFilters,
  pagination?: PaginationParams
): Promise<PaginatedResponse<Member>> {
  const page = pagination?.page ?? 1;
  const pageSize = pagination?.pageSize ?? 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('members')
    .select('*, trainer:teachers!trainer_id(*)', { count: 'exact' });

  if (filters?.search) {
    query = query.or(
      `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
    );
  }

  if (filters?.member_type && filters.member_type !== 'all') {
    query = query.eq('member_type', filters.member_type);
  }

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  if (filters?.skill_level && filters.skill_level !== 'all') {
    query = query.eq('skill_level', filters.skill_level);
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

export async function getMember(id: string): Promise<Member | null> {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createMember(member: Omit<Member, 'id' | 'created_at' | 'updated_at'>): Promise<Member> {
  // Server-side validation
  const validation = memberSchema.safeParse(member);
  if (!validation.success) {
    throw new ValidationError(validation.error.flatten().fieldErrors as Record<string, string[]>);
  }

  const { data, error } = await supabase
    .from('members')
    .insert(member)
    .select()
    .single();

  if (error) throw error;

  // Log activity
  await logActivity('member', data.id, 'created', `New member: ${data.first_name} ${data.last_name}`);

  return data;
}

export async function updateMember(id: string, member: Partial<Member>): Promise<Member> {
  // Server-side validation for partial updates
  const validation = memberSchema.partial().safeParse(member);
  if (!validation.success) {
    throw new ValidationError(validation.error.flatten().fieldErrors as Record<string, string[]>);
  }

  const { data, error } = await supabase
    .from('members')
    .update(member)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  await logActivity('member', data.id, 'updated', `Updated member: ${data.first_name} ${data.last_name}`);

  return data;
}

export async function deleteMember(id: string): Promise<void> {
  const { data: member } = await supabase
    .from('members')
    .select('first_name, last_name')
    .eq('id', id)
    .single();

  const { error } = await supabase
    .from('members')
    .delete()
    .eq('id', id);

  if (error) throw error;

  if (member) {
    await logActivity('member', id, 'deleted', `Deleted member: ${member.first_name} ${member.last_name}`);
  }
}

export async function getMemberPayments(memberId: string) {
  const { data, error } = await supabase
    .from('payments')
    .select('*, class:classes(*)')
    .eq('member_id', memberId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getMemberEnrollments(memberId: string) {
  const { data, error } = await supabase
    .from('enrollments')
    .select('*, class:classes(*, teacher:teachers(*))')
    .eq('member_id', memberId)
    .eq('is_active', true);

  if (error) throw error;
  return data;
}

export async function uploadAvatar(file: File, memberId: string): Promise<string> {
  // Security: Validate file before upload
  const { validateFileUpload, generateSecureFileName } = await import('@/lib/validations/file-upload');
  const validation = validateFileUpload(file, 'avatar');
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const fileName = generateSecureFileName(`${memberId}-avatar.${file.name.split('.').pop()}`);
  const filePath = `avatars/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  return data.publicUrl;
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

export async function getMemberStats() {
  const { data: members, error } = await supabase
    .from('members')
    .select('id, member_type, status, created_at');

  if (error) throw error;

  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  return {
    total: members?.length ?? 0,
    active: members?.filter(m => m.status === 'active').length ?? 0,
    kids: members?.filter(m => m.member_type === 'child').length ?? 0,
    adults: members?.filter(m => m.member_type === 'adult').length ?? 0,
    newThisMonth: members?.filter(m => new Date(m.created_at) >= thisMonth).length ?? 0,
  };
}

export async function uploadContract(memberId: string, file: File): Promise<string> {
  // Security: Validate file before upload
  const { validateFileUpload, generateSecureFileName } = await import('@/lib/validations/file-upload');
  const validation = validateFileUpload(file, 'contract');
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const fileName = generateSecureFileName(`${memberId}-contract.${file.name.split('.').pop()}`);
  const filePath = `contracts/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('contracts')
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('contracts')
    .getPublicUrl(filePath);

  return data.publicUrl;
}
