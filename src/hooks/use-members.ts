import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember,
  getMemberPayments,
  getMemberEnrollments,
  getMemberStats,
} from '@/services/members';
import type { Member, MemberFilters, PaginationParams } from '@/types';
import { toast } from 'sonner';

export function useMembers(filters?: MemberFilters, pagination?: PaginationParams) {
  return useQuery({
    queryKey: ['members', filters, pagination],
    queryFn: () => getMembers(filters, pagination),
  });
}

export function useMember(id: string | undefined) {
  return useQuery({
    queryKey: ['member', id],
    queryFn: () => getMember(id!),
    enabled: !!id,
  });
}

export function useMemberPayments(memberId: string | undefined) {
  return useQuery({
    queryKey: ['member-payments', memberId],
    queryFn: () => getMemberPayments(memberId!),
    enabled: !!memberId,
  });
}

export function useMemberEnrollments(memberId: string | undefined) {
  return useQuery({
    queryKey: ['member-enrollments', memberId],
    queryFn: () => getMemberEnrollments(memberId!),
    enabled: !!memberId,
  });
}

export function useMemberStats() {
  return useQuery({
    queryKey: ['member-stats'],
    queryFn: getMemberStats,
  });
}

export function useCreateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['member-stats'] });
      toast.success('Member created successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to create member', {
        description: error.message,
      });
    },
  });
}

export function useUpdateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Member> }) =>
      updateMember(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['member', data.id] });
      queryClient.invalidateQueries({ queryKey: ['member-stats'] });
      toast.success('Member updated successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to update member', {
        description: error.message,
      });
    },
  });
}

export function useDeleteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['member-stats'] });
      toast.success('Member deleted successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete member', {
        description: error.message,
      });
    },
  });
}
