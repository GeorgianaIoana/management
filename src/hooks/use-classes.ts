import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getClasses,
  getAllClasses,
  getClass,
  createClass,
  updateClass,
  deleteClass,
  getClassEnrollments,
  enrollMember,
  unenrollMember,
  getClassSessions,
  createClassSession,
  getSessionAttendance,
  bulkRecordAttendance,
  getTodaysClasses,
  getWeeklySchedule,
  getRecentSessions,
} from '@/services/classes';
import type { Class, ClassFilters, PaginationParams } from '@/types';
import { toast } from 'sonner';

export function useClasses(filters?: ClassFilters, pagination?: PaginationParams) {
  return useQuery({
    queryKey: ['classes', filters, pagination],
    queryFn: () => getClasses(filters, pagination),
  });
}

export function useAllClasses() {
  return useQuery({
    queryKey: ['classes', 'all'],
    queryFn: getAllClasses,
  });
}

export function useClass(id: string | undefined) {
  return useQuery({
    queryKey: ['class', id],
    queryFn: () => getClass(id!),
    enabled: !!id,
  });
}

export function useTodaysClasses() {
  return useQuery({
    queryKey: ['classes', 'today'],
    queryFn: getTodaysClasses,
  });
}

export function useWeeklySchedule(weekStart: string) {
  return useQuery({
    queryKey: ['classes', 'weekly', weekStart],
    queryFn: () => getWeeklySchedule(weekStart),
  });
}

export function useClassEnrollments(classId: string | undefined) {
  return useQuery({
    queryKey: ['class-enrollments', classId],
    queryFn: () => getClassEnrollments(classId!),
    enabled: !!classId,
  });
}

export function useClassSessions(classId: string | undefined, startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['class-sessions', classId, startDate, endDate],
    queryFn: () => getClassSessions(classId!, startDate, endDate),
    enabled: !!classId,
  });
}

export function useSessionAttendance(sessionId: string | undefined) {
  return useQuery({
    queryKey: ['session-attendance', sessionId],
    queryFn: () => getSessionAttendance(sessionId!),
    enabled: !!sessionId,
  });
}

export function useRecentSessions(limit: number = 20) {
  return useQuery({
    queryKey: ['recent-sessions', limit],
    queryFn: () => getRecentSessions(limit),
  });
}

export function useCreateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast.success('Class created successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to create class', {
        description: error.message,
      });
    },
  });
}

export function useUpdateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Class> }) =>
      updateClass(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      queryClient.invalidateQueries({ queryKey: ['class', data.id] });
      toast.success('Class updated successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to update class', {
        description: error.message,
      });
    },
  });
}

export function useDeleteClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast.success('Class deleted successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete class', {
        description: error.message,
      });
    },
  });
}

export function useEnrollMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classId, memberId }: { classId: string; memberId: string }) =>
      enrollMember(classId, memberId),
    onSuccess: (_, { classId }) => {
      queryClient.invalidateQueries({ queryKey: ['class-enrollments', classId] });
      toast.success('Member enrolled successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to enroll member', {
        description: error.message,
      });
    },
  });
}

export function useUnenrollMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ enrollmentId }: { enrollmentId: string; classId: string }) =>
      unenrollMember(enrollmentId),
    onSuccess: (_, { classId }) => {
      queryClient.invalidateQueries({ queryKey: ['class-enrollments', classId] });
      toast.success('Member unenrolled successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to unenroll member', {
        description: error.message,
      });
    },
  });
}

export function useCreateClassSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClassSession,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['class-sessions', data.class_id] });
      queryClient.invalidateQueries({ queryKey: ['recent-sessions'] });
      toast.success('Sesiune creată');
    },
    onError: (error: Error) => {
      toast.error('Eroare la crearea sesiunii', {
        description: error.message,
      });
    },
  });
}

export function useBulkRecordAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      records,
    }: {
      sessionId: string;
      records: { member_id: string; attended: boolean }[];
    }) => bulkRecordAttendance(sessionId, records),
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({ queryKey: ['session-attendance', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['recent-sessions'] });
      toast.success('Prezența a fost salvată!');
    },
    onError: (error: Error) => {
      toast.error('Eroare la salvarea prezenței', {
        description: error.message,
      });
    },
  });
}
