import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getLessons,
  getLesson,
  createLesson,
  updateLesson,
  deleteLesson,
  uploadLessonFile,
  getCategories,
  getTags,
} from '@/services/lessons';
import type { Lesson, LessonFilters, PaginationParams } from '@/types';
import { toast } from 'sonner';

export function useLessons(filters?: LessonFilters, pagination?: PaginationParams) {
  return useQuery({
    queryKey: ['lessons', filters, pagination],
    queryFn: () => getLessons(filters, pagination),
  });
}

export function useLesson(id: string | undefined) {
  return useQuery({
    queryKey: ['lesson', id],
    queryFn: () => getLesson(id!),
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['lesson-categories'],
    queryFn: getCategories,
  });
}

export function useTags() {
  return useQuery({
    queryKey: ['lesson-tags'],
    queryFn: getTags,
  });
}

export function useCreateLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      queryClient.invalidateQueries({ queryKey: ['lesson-categories'] });
      queryClient.invalidateQueries({ queryKey: ['lesson-tags'] });
      toast.success('Lesson created successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to create lesson', {
        description: error.message,
      });
    },
  });
}

export function useUpdateLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Lesson> }) =>
      updateLesson(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      queryClient.invalidateQueries({ queryKey: ['lesson', data.id] });
      queryClient.invalidateQueries({ queryKey: ['lesson-categories'] });
      queryClient.invalidateQueries({ queryKey: ['lesson-tags'] });
      toast.success('Lesson updated successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to update lesson', {
        description: error.message,
      });
    },
  });
}

export function useDeleteLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      toast.success('Lesson deleted successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete lesson', {
        description: error.message,
      });
    },
  });
}

export function useUploadLessonFile() {
  return useMutation({
    mutationFn: uploadLessonFile,
    onError: (error: Error) => {
      toast.error('Failed to upload file', {
        description: error.message,
      });
    },
  });
}
