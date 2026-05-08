import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import {
  getPayments,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment,
  markPaymentPaid,
  getPendingPayments,
  getOverduePayments,
  getDueThisWeekPayments,
  getPaymentStats,
  getPaymentCounts,
} from '@/services/payments';
import type { Payment, PaymentFilters, PaginationParams } from '@/types';
import { useNotificationStore } from '@/stores/ui-store';
import { toast } from 'sonner';

export function usePayments(filters?: PaymentFilters, pagination?: PaginationParams) {
  return useQuery({
    queryKey: ['payments', filters, pagination],
    queryFn: () => getPayments(filters, pagination),
  });
}

export function usePayment(id: string | undefined) {
  return useQuery({
    queryKey: ['payment', id],
    queryFn: () => getPayment(id!),
    enabled: !!id,
  });
}

export function usePendingPayments() {
  return useQuery({
    queryKey: ['payments', 'pending'],
    queryFn: getPendingPayments,
  });
}

export function useOverduePayments() {
  return useQuery({
    queryKey: ['payments', 'overdue'],
    queryFn: getOverduePayments,
  });
}

export function useDueThisWeekPayments() {
  return useQuery({
    queryKey: ['payments', 'due-this-week'],
    queryFn: getDueThisWeekPayments,
  });
}

export function usePaymentStats() {
  return useQuery({
    queryKey: ['payment-stats'],
    queryFn: getPaymentStats,
  });
}

export function usePaymentCounts() {
  const { setPendingPaymentsCount, setOverduePaymentsCount } = useNotificationStore();

  const query = useQuery({
    queryKey: ['payment-counts'],
    queryFn: getPaymentCounts,
    refetchInterval: 60000, // Refetch every minute
  });

  useEffect(() => {
    if (query.data) {
      setPendingPaymentsCount(query.data.pending);
      setOverduePaymentsCount(query.data.overdue);
    }
  }, [query.data, setPendingPaymentsCount, setOverduePaymentsCount]);

  return query;
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['payment-stats'] });
      queryClient.invalidateQueries({ queryKey: ['payment-counts'] });
      toast.success('Payment created successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to create payment', {
        description: error.message,
      });
    },
  });
}

export function useUpdatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Payment> }) =>
      updatePayment(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['payment', data.id] });
      queryClient.invalidateQueries({ queryKey: ['payment-stats'] });
      queryClient.invalidateQueries({ queryKey: ['payment-counts'] });
      toast.success('Payment updated successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to update payment', {
        description: error.message,
      });
    },
  });
}

export function useDeletePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['payment-stats'] });
      queryClient.invalidateQueries({ queryKey: ['payment-counts'] });
      toast.success('Payment deleted successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete payment', {
        description: error.message,
      });
    },
  });
}

export function useMarkPaymentPaid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markPaymentPaid,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['payment', data.id] });
      queryClient.invalidateQueries({ queryKey: ['payment-stats'] });
      queryClient.invalidateQueries({ queryKey: ['payment-counts'] });
      toast.success('Payment marked as paid');
    },
    onError: (error: Error) => {
      toast.error('Failed to mark payment as paid', {
        description: error.message,
      });
    },
  });
}
