import { useQuery } from '@tanstack/react-query';
import { getRecentActivity, getDashboardStats } from '@/services/dashboard';

export function useRecentActivity(limit: number = 10) {
  return useQuery({
    queryKey: ['recent-activity', limit],
    queryFn: () => getRecentActivity(limit),
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
  });
}
