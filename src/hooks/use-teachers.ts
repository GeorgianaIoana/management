import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTeachers,
  getAllTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getTeacherClasses,
} from '@/services/teachers';
import type { Teacher, PaginationParams } from '@/types';
import { toast } from 'sonner';

interface TeacherFilters {
  search?: string;
  is_active?: boolean;
}

export function useTeachers(filters?: TeacherFilters, pagination?: PaginationParams) {
  return useQuery({
    queryKey: ['teachers', filters, pagination],
    queryFn: () => getTeachers(filters, pagination),
  });
}

export function useAllTeachers() {
  return useQuery({
    queryKey: ['teachers', 'all'],
    queryFn: getAllTeachers,
  });
}

export function useTeacher(id: string | undefined) {
  return useQuery({
    queryKey: ['teacher', id],
    queryFn: () => getTeacher(id!),
    enabled: !!id,
  });
}

export function useTeacherClasses(teacherId: string | undefined) {
  return useQuery({
    queryKey: ['teacher-classes', teacherId],
    queryFn: () => getTeacherClasses(teacherId!),
    enabled: !!teacherId,
  });
}

export function useCreateTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast.success('Teacher created successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to create teacher', {
        description: error.message,
      });
    },
  });
}

export function useUpdateTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Teacher> }) =>
      updateTeacher(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      queryClient.invalidateQueries({ queryKey: ['teacher', data.id] });
      toast.success('Teacher updated successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to update teacher', {
        description: error.message,
      });
    },
  });
}

export function useDeleteTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast.success('Teacher deleted successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete teacher', {
        description: error.message,
      });
    },
  });
}
