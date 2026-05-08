export * from './database';
export * from './productivity';
export * from './competitions';

// UI-related types
export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export interface KPICard {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

// Pagination
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filter types
export interface MemberFilters {
  search?: string;
  member_type?: 'child' | 'adult' | 'all';
  status?: 'active' | 'inactive' | 'suspended' | 'all';
  skill_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'all';
}

export interface PaymentFilters {
  search?: string;
  status?: 'pending' | 'paid' | 'overdue' | 'cancelled' | 'all';
  due_date_from?: string;
  due_date_to?: string;
}

export interface ClassFilters {
  search?: string;
  target_age_group?: 'kids' | 'adults' | 'all';
  day_of_week?: number;
  teacher_id?: string;
  is_active?: boolean;
}

export interface LessonFilters {
  search?: string;
  category?: string;
  skill_level?: string;
  target_age_group?: string;
  tags?: string[];
}

// Analytics types
export interface RevenueData {
  month: string;
  revenue: number;
  collected: number;
  pending: number;
}

export interface MemberStats {
  total: number;
  active: number;
  kids: number;
  adults: number;
  newThisMonth: number;
}

export interface PaymentStats {
  totalRevenue: number;
  collected: number;
  pending: number;
  overdue: number;
  collectionRate: number;
}

export interface AttendanceStats {
  totalSessions: number;
  averageAttendance: number;
  attendanceByClass: {
    className: string;
    rate: number;
  }[];
}
