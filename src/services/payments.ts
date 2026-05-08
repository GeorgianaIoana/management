import { createClient } from '@/lib/supabase/client';
import { paymentSchema } from '@/lib/validations/payment';
import type { Payment, PaymentFilters, PaginatedResponse, PaginationParams, PaymentStats } from '@/types';

const supabase = createClient();

class ValidationError extends Error {
  constructor(public errors: Record<string, string[]>) {
    super('Validation failed');
    this.name = 'ValidationError';
  }
}

export async function getPayments(
  filters?: PaymentFilters,
  pagination?: PaginationParams
): Promise<PaginatedResponse<Payment>> {
  const page = pagination?.page ?? 1;
  const pageSize = pagination?.pageSize ?? 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('payments')
    .select('*, member:members(*), class:classes(*)', { count: 'exact' });

  if (filters?.search) {
    // Search in member names via join - we'll filter client-side for now
  }

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  if (filters?.due_date_from) {
    query = query.gte('due_date', filters.due_date_from);
  }

  if (filters?.due_date_to) {
    query = query.lte('due_date', filters.due_date_to);
  }

  query = query
    .order('due_date', { ascending: false })
    .range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;

  // Client-side filter for search
  let filteredData = data ?? [];
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    filteredData = filteredData.filter((p) =>
      `${p.member?.first_name} ${p.member?.last_name}`.toLowerCase().includes(searchLower)
    );
  }

  return {
    data: filteredData,
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  };
}

export async function getPayment(id: string): Promise<Payment | null> {
  const { data, error } = await supabase
    .from('payments')
    .select('*, member:members(*), class:classes(*)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createPayment(payment: Omit<Payment, 'id' | 'created_at' | 'updated_at' | 'member' | 'class'>): Promise<Payment> {
  // Server-side validation
  const validation = paymentSchema.safeParse(payment);
  if (!validation.success) {
    throw new ValidationError(validation.error.flatten().fieldErrors as Record<string, string[]>);
  }

  const { data, error } = await supabase
    .from('payments')
    .insert(payment)
    .select('*, member:members(*), class:classes(*)')
    .single();

  if (error) throw error;

  await logActivity('payment', data.id, 'created', `New payment: ${data.amount} ${data.currency}`);

  return data;
}

export async function updatePayment(id: string, payment: Partial<Payment>): Promise<Payment> {
  const { member: _member, class: _cls, ...updateData } = payment;

  // Server-side validation for partial updates
  const validation = paymentSchema.partial().safeParse(updateData);
  if (!validation.success) {
    throw new ValidationError(validation.error.flatten().fieldErrors as Record<string, string[]>);
  }

  const { data, error } = await supabase
    .from('payments')
    .update(updateData)
    .eq('id', id)
    .select('*, member:members(*), class:classes(*)')
    .single();

  if (error) throw error;

  await logActivity('payment', data.id, 'updated', `Updated payment: ${data.amount} ${data.currency}`);

  return data;
}

export async function deletePayment(id: string): Promise<void> {
  const { error } = await supabase
    .from('payments')
    .delete()
    .eq('id', id);

  if (error) throw error;

  await logActivity('payment', id, 'deleted', 'Deleted payment');
}

export async function markPaymentPaid(id: string): Promise<Payment> {
  const { data, error } = await supabase
    .from('payments')
    .update({
      status: 'paid',
      paid_date: new Date().toISOString().split('T')[0],
    })
    .eq('id', id)
    .select('*, member:members(*), class:classes(*)')
    .single();

  if (error) throw error;

  await logActivity('payment', data.id, 'paid', `Payment marked as paid: ${data.amount} ${data.currency}`);

  return data;
}

// Quick filter queries
export async function getPendingPayments(): Promise<Payment[]> {
  const { data, error } = await supabase
    .from('payments')
    .select('*, member:members(*), class:classes(*)')
    .eq('status', 'pending')
    .order('due_date');

  if (error) throw error;
  return data ?? [];
}

export async function getOverduePayments(): Promise<Payment[]> {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('payments')
    .select('*, member:members(*), class:classes(*)')
    .eq('status', 'pending')
    .lt('due_date', today)
    .order('due_date');

  if (error) throw error;

  // Update status to overdue
  if (data && data.length > 0) {
    await supabase
      .from('payments')
      .update({ status: 'overdue' })
      .in('id', data.map(p => p.id));
  }

  const { data: overdueData, error: overdueError } = await supabase
    .from('payments')
    .select('*, member:members(*), class:classes(*)')
    .eq('status', 'overdue')
    .order('due_date');

  if (overdueError) throw overdueError;
  return overdueData ?? [];
}

export async function getDueThisWeekPayments(): Promise<Payment[]> {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const { data, error } = await supabase
    .from('payments')
    .select('*, member:members(*), class:classes(*)')
    .in('status', ['pending', 'overdue'])
    .gte('due_date', today.toISOString().split('T')[0])
    .lte('due_date', nextWeek.toISOString().split('T')[0])
    .order('due_date');

  if (error) throw error;
  return data ?? [];
}

export async function getPaymentStats(): Promise<PaymentStats> {
  const { data: payments, error } = await supabase
    .from('payments')
    .select('amount, status');

  if (error) throw error;

  const stats = (payments ?? []).reduce(
    (acc, payment) => {
      acc.totalRevenue += payment.amount;
      if (payment.status === 'paid') {
        acc.collected += payment.amount;
      } else if (payment.status === 'pending') {
        acc.pending += payment.amount;
      } else if (payment.status === 'overdue') {
        acc.overdue += payment.amount;
      }
      return acc;
    },
    { totalRevenue: 0, collected: 0, pending: 0, overdue: 0, collectionRate: 0 }
  );

  stats.collectionRate = stats.totalRevenue > 0
    ? (stats.collected / stats.totalRevenue) * 100
    : 0;

  return stats;
}

export async function getPaymentCounts(): Promise<{ pending: number; overdue: number }> {
  const today = new Date().toISOString().split('T')[0];

  const { count: pendingCount } = await supabase
    .from('payments')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')
    .gte('due_date', today);

  const { count: overdueCount } = await supabase
    .from('payments')
    .select('*', { count: 'exact', head: true })
    .or(`status.eq.overdue,and(status.eq.pending,due_date.lt.${today})`);

  return {
    pending: pendingCount ?? 0,
    overdue: overdueCount ?? 0,
  };
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
