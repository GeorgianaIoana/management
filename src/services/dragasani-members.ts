import { createClient } from '@/lib/supabase/client';
import type { DragasaniMember, PaginatedResponse, PaginationParams } from '@/types';

const supabase = createClient();

interface DragasaniMemberFilters {
  search?: string;
  member_type?: 'child' | 'adult' | 'all';
  status?: 'active' | 'inactive' | 'suspended' | 'all';
}

export async function getDragasaniMembers(
  filters?: DragasaniMemberFilters,
  pagination?: PaginationParams
): Promise<PaginatedResponse<DragasaniMember>> {
  const page = pagination?.page ?? 1;
  const pageSize = pagination?.pageSize ?? 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('dragasani_members')
    .select('*', { count: 'exact' });

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

export async function getDragasaniMember(id: string): Promise<DragasaniMember | null> {
  const { data, error } = await supabase
    .from('dragasani_members')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createDragasaniMember(
  member: Omit<DragasaniMember, 'id' | 'created_at' | 'updated_at'>
): Promise<DragasaniMember> {
  const { data, error } = await supabase
    .from('dragasani_members')
    .insert(member)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateDragasaniMember(
  id: string,
  member: Partial<DragasaniMember>
): Promise<DragasaniMember> {
  const { data, error } = await supabase
    .from('dragasani_members')
    .update(member)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteDragasaniMember(id: string): Promise<void> {
  const { error } = await supabase
    .from('dragasani_members')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getDragasaniMemberStats() {
  const { data: members, error } = await supabase
    .from('dragasani_members')
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
