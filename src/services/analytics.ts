import { createClient } from '@/lib/supabase/client';
import type { RevenueData } from '@/types';
import { format, subMonths, startOfMonth, endOfMonth, parseISO } from 'date-fns';

const supabase = createClient();

interface PaymentRow {
  amount: number;
  status: string;
  due_date: string;
  paid_date: string | null;
}

export async function getMonthlyRevenue(months: number = 12): Promise<RevenueData[]> {
  const endDate = new Date();
  const startDate = subMonths(startOfMonth(endDate), months - 1);

  const { data: payments, error } = await supabase
    .from('payments')
    .select('amount, status, due_date, paid_date')
    .gte('due_date', startDate.toISOString().split('T')[0])
    .lte('due_date', endDate.toISOString().split('T')[0]);

  if (error) throw error;

  // Group by month
  const monthlyData: Record<string, { revenue: number; collected: number; pending: number }> = {};

  for (let i = 0; i < months; i++) {
    const date = subMonths(endDate, months - 1 - i);
    const monthKey = format(date, 'yyyy-MM');
    monthlyData[monthKey] = { revenue: 0, collected: 0, pending: 0 };
  }

  (payments as PaymentRow[] | null)?.forEach((payment) => {
    const monthKey = format(parseISO(payment.due_date), 'yyyy-MM');
    if (monthlyData[monthKey]) {
      monthlyData[monthKey].revenue += payment.amount;
      if (payment.status === 'paid') {
        monthlyData[monthKey].collected += payment.amount;
      } else if (payment.status === 'pending' || payment.status === 'overdue') {
        monthlyData[monthKey].pending += payment.amount;
      }
    }
  });

  return Object.entries(monthlyData).map(([month, data]) => ({
    month: format(parseISO(`${month}-01`), 'MMM yyyy'),
    ...data,
  }));
}

export async function getYearOverYearComparison(): Promise<{
  currentYear: number;
  previousYear: number;
  change: number;
}> {
  const now = new Date();
  const currentYearStart = new Date(now.getFullYear(), 0, 1);
  const previousYearStart = new Date(now.getFullYear() - 1, 0, 1);
  const previousYearEnd = new Date(now.getFullYear() - 1, 11, 31);

  const [currentYearData, previousYearData] = await Promise.all([
    supabase
      .from('payments')
      .select('amount')
      .eq('status', 'paid')
      .gte('paid_date', currentYearStart.toISOString().split('T')[0]),
    supabase
      .from('payments')
      .select('amount')
      .eq('status', 'paid')
      .gte('paid_date', previousYearStart.toISOString().split('T')[0])
      .lte('paid_date', previousYearEnd.toISOString().split('T')[0]),
  ]);

  const currentYear = (currentYearData.data as { amount: number }[] | null)?.reduce((sum, p) => sum + p.amount, 0) ?? 0;
  const previousYear = (previousYearData.data as { amount: number }[] | null)?.reduce((sum, p) => sum + p.amount, 0) ?? 0;
  const change = previousYear > 0 ? ((currentYear - previousYear) / previousYear) * 100 : 0;

  return { currentYear, previousYear, change };
}

interface MemberRow {
  created_at: string;
  member_type?: string;
  skill_level?: string | null;
}

export async function getMemberGrowth(months: number = 12): Promise<{ month: string; total: number; new: number }[]> {
  const endDate = new Date();
  const startDate = subMonths(startOfMonth(endDate), months - 1);

  const { data: members, error } = await supabase
    .from('members')
    .select('created_at')
    .lte('created_at', endDate.toISOString());

  if (error) throw error;

  const typedMembers = members as MemberRow[] | null;
  const monthlyData: Record<string, { total: number; new: number }> = {};
  let runningTotal = 0;

  // Count members before start date
  typedMembers?.forEach((member) => {
    if (parseISO(member.created_at) < startDate) {
      runningTotal++;
    }
  });

  for (let i = 0; i < months; i++) {
    const date = subMonths(endDate, months - 1 - i);
    const monthKey = format(date, 'yyyy-MM');
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);

    const newMembers = typedMembers?.filter((m) => {
      const createdAt = parseISO(m.created_at);
      return createdAt >= monthStart && createdAt <= monthEnd;
    }).length ?? 0;

    runningTotal += newMembers;
    monthlyData[monthKey] = { total: runningTotal, new: newMembers };
  }

  return Object.entries(monthlyData).map(([month, data]) => ({
    month: format(parseISO(`${month}-01`), 'MMM yyyy'),
    ...data,
  }));
}

export async function getMemberDistribution(): Promise<{
  kids: number;
  adults: number;
  bySkillLevel: { level: string; count: number }[];
}> {
  const { data: members, error } = await supabase
    .from('members')
    .select('member_type, skill_level')
    .eq('status', 'active');

  if (error) throw error;

  const typedMembers = members as MemberRow[] | null;
  const kids = typedMembers?.filter((m) => m.member_type === 'child').length ?? 0;
  const adults = typedMembers?.filter((m) => m.member_type === 'adult').length ?? 0;

  const skillLevelCounts: Record<string, number> = {};
  typedMembers?.forEach((m) => {
    const level = m.skill_level ?? 'unspecified';
    skillLevelCounts[level] = (skillLevelCounts[level] ?? 0) + 1;
  });

  const bySkillLevel = Object.entries(skillLevelCounts).map(([level, count]) => ({
    level: level.charAt(0).toUpperCase() + level.slice(1),
    count,
  }));

  return { kids, adults, bySkillLevel };
}

interface SessionRow {
  id: string;
  class_id: string;
  class: Array<{ name: string }> | null;
}

interface AttendanceRow {
  session_id: string;
  attended: boolean;
}

export async function getAttendanceRates(): Promise<{
  overall: number;
  byClass: { className: string; rate: number }[];
}> {
  const thirtyDaysAgo = subMonths(new Date(), 1);

  const { data: sessions, error: sessionsError } = await supabase
    .from('class_sessions')
    .select('id, class_id, class:classes(name)')
    .gte('session_date', thirtyDaysAgo.toISOString().split('T')[0])
    .eq('status', 'completed');

  if (sessionsError) throw sessionsError;

  const typedSessions = sessions as SessionRow[] | null;

  const { data: attendance, error: attendanceError } = await supabase
    .from('attendance')
    .select('session_id, attended')
    .in('session_id', typedSessions?.map((s) => s.id) ?? []);

  if (attendanceError) throw attendanceError;

  const typedAttendance = attendance as AttendanceRow[] | null;

  // Calculate overall attendance
  const totalAttendance = typedAttendance?.length ?? 0;
  const attended = typedAttendance?.filter((a) => a.attended).length ?? 0;
  const overall = totalAttendance > 0 ? (attended / totalAttendance) * 100 : 0;

  // Calculate by class
  const classSessions: Record<string, { name: string; total: number; attended: number }> = {};

  typedSessions?.forEach((session) => {
    const classId = session.class_id;
    const className = session.class?.[0]?.name ?? 'Unknown';

    if (!classSessions[classId]) {
      classSessions[classId] = { name: className, total: 0, attended: 0 };
    }

    const sessionAttendance = typedAttendance?.filter((a) => a.session_id === session.id) ?? [];
    classSessions[classId].total += sessionAttendance.length;
    classSessions[classId].attended += sessionAttendance.filter((a) => a.attended).length;
  });

  const byClass = Object.values(classSessions).map((c) => ({
    className: c.name,
    rate: c.total > 0 ? (c.attended / c.total) * 100 : 0,
  }));

  return { overall, byClass };
}

export async function exportDataToCSV(type: 'members' | 'payments' | 'classes'): Promise<string> {
  let data: Record<string, unknown>[] = [];
  let headers: string[] = [];

  switch (type) {
    case 'members': {
      const { data: members } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });
      data = (members as Record<string, unknown>[] | null) ?? [];
      headers = ['first_name', 'last_name', 'email', 'phone', 'member_type', 'skill_level', 'status', 'join_date'];
      break;
    }
    case 'payments': {
      const { data: payments } = await supabase
        .from('payments')
        .select('*, member:members(first_name, last_name)')
        .order('created_at', { ascending: false });
      const typedPayments = payments as Array<Record<string, unknown> & { member: { first_name: string; last_name: string } | null }> | null;
      data = typedPayments?.map((p) => ({
        ...p,
        member_name: p.member ? `${p.member.first_name} ${p.member.last_name}` : '',
      })) ?? [];
      headers = ['member_name', 'amount', 'currency', 'status', 'due_date', 'paid_date', 'payment_method'];
      break;
    }
    case 'classes': {
      const { data: classes } = await supabase
        .from('classes')
        .select('*, teacher:teachers(first_name, last_name)')
        .order('name');
      const typedClasses = classes as Array<Record<string, unknown> & { teacher: { first_name: string; last_name: string } | null }> | null;
      data = typedClasses?.map((c) => ({
        ...c,
        teacher_name: c.teacher ? `${c.teacher.first_name} ${c.teacher.last_name}` : '',
      })) ?? [];
      headers = ['name', 'teacher_name', 'target_age_group', 'day_of_week', 'start_time', 'end_time', 'price_per_month'];
      break;
    }
  }

  const csvRows = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((header) => {
        const value = row[header];
        if (value === null || value === undefined) return '';
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return String(value);
      }).join(',')
    ),
  ];

  return csvRows.join('\n');
}
