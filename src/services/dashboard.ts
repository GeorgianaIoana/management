import { createClient } from '@/lib/supabase/client';
import type { ActivityLog } from '@/types';

const supabase = createClient();

export async function getRecentActivity(limit: number = 10): Promise<ActivityLog[]> {
  const { data, error } = await supabase
    .from('activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

export async function getDashboardStats() {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [
    membersResult,
    classesResult,
    paymentsThisMonth,
    pendingPayments,
  ] = await Promise.all([
    supabase.from('members').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('classes').select('id', { count: 'exact', head: true }).eq('is_active', true),
    supabase
      .from('payments')
      .select('amount')
      .eq('status', 'paid')
      .gte('paid_date', startOfMonth.toISOString().split('T')[0]),
    supabase
      .from('payments')
      .select('amount')
      .in('status', ['pending', 'overdue']),
  ]);

  const monthlyRevenue = paymentsThisMonth.data?.reduce((sum, p) => sum + p.amount, 0) ?? 0;
  const pendingAmount = pendingPayments.data?.reduce((sum, p) => sum + p.amount, 0) ?? 0;

  return {
    totalMembers: membersResult.count ?? 0,
    activeClasses: classesResult.count ?? 0,
    monthlyRevenue,
    pendingPayments: pendingAmount,
  };
}
