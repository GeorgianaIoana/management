import { useQuery, useMutation } from '@tanstack/react-query';
import {
  getMonthlyRevenue,
  getYearOverYearComparison,
  getMemberGrowth,
  getMemberDistribution,
  getAttendanceRates,
  exportDataToCSV,
} from '@/services/analytics';
import { toast } from 'sonner';

export function useMonthlyRevenue(months: number = 12) {
  return useQuery({
    queryKey: ['analytics', 'monthly-revenue', months],
    queryFn: () => getMonthlyRevenue(months),
  });
}

export function useYearOverYearComparison() {
  return useQuery({
    queryKey: ['analytics', 'yoy-comparison'],
    queryFn: getYearOverYearComparison,
  });
}

export function useMemberGrowth(months: number = 12) {
  return useQuery({
    queryKey: ['analytics', 'member-growth', months],
    queryFn: () => getMemberGrowth(months),
  });
}

export function useMemberDistribution() {
  return useQuery({
    queryKey: ['analytics', 'member-distribution'],
    queryFn: getMemberDistribution,
  });
}

export function useAttendanceRates() {
  return useQuery({
    queryKey: ['analytics', 'attendance-rates'],
    queryFn: getAttendanceRates,
  });
}

export function useExportCSV() {
  return useMutation({
    mutationFn: async (type: 'members' | 'payments' | 'classes') => {
      const csv = await exportDataToCSV(type);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${type}-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    onSuccess: () => {
      toast.success('Export completed');
    },
    onError: (error: Error) => {
      toast.error('Export failed', {
        description: error.message,
      });
    },
  });
}
