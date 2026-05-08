import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDragasaniMembers,
  getDragasaniMember,
  createDragasaniMember,
  updateDragasaniMember,
  deleteDragasaniMember,
  getDragasaniMemberStats,
} from '@/services/dragasani-members';
import type { DragasaniMember, PaginationParams } from '@/types';
import { toast } from 'sonner';

interface DragasaniMemberFilters {
  search?: string;
  member_type?: 'child' | 'adult' | 'all';
  status?: 'active' | 'inactive' | 'suspended' | 'all';
}

export function useDragasaniMembers(filters?: DragasaniMemberFilters, pagination?: PaginationParams) {
  return useQuery({
    queryKey: ['dragasani-members', filters, pagination],
    queryFn: () => getDragasaniMembers(filters, pagination),
  });
}

export function useDragasaniMember(id: string | undefined) {
  return useQuery({
    queryKey: ['dragasani-member', id],
    queryFn: () => getDragasaniMember(id!),
    enabled: !!id,
  });
}

export function useDragasaniMemberStats() {
  return useQuery({
    queryKey: ['dragasani-member-stats'],
    queryFn: getDragasaniMemberStats,
  });
}

export function useCreateDragasaniMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDragasaniMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dragasani-members'] });
      queryClient.invalidateQueries({ queryKey: ['dragasani-member-stats'] });
      toast.success('Membru adăugat cu succes');
    },
    onError: (error: Error) => {
      toast.error('Eroare la adăugarea membrului', {
        description: error.message,
      });
    },
  });
}

export function useUpdateDragasaniMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DragasaniMember> }) =>
      updateDragasaniMember(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['dragasani-members'] });
      queryClient.invalidateQueries({ queryKey: ['dragasani-member', data.id] });
      queryClient.invalidateQueries({ queryKey: ['dragasani-member-stats'] });
      toast.success('Membru actualizat cu succes');
    },
    onError: (error: Error) => {
      toast.error('Eroare la actualizarea membrului', {
        description: error.message,
      });
    },
  });
}

export function useDeleteDragasaniMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDragasaniMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dragasani-members'] });
      queryClient.invalidateQueries({ queryKey: ['dragasani-member-stats'] });
      toast.success('Membru șters cu succes');
    },
    onError: (error: Error) => {
      toast.error('Eroare la ștergerea membrului', {
        description: error.message,
      });
    },
  });
}
