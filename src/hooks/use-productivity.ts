import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getQuestions,
  getAllQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getDailyResponses,
  saveResponses,
  getRecurringTasks,
  createRecurringTask,
  updateRecurringTask,
  deleteRecurringTask,
  getDailyTasks,
  ensureDailyTasks,
  addCustomTask,
  toggleTask,
  toggleTaskPriority,
  getPriorityTasks,
  deleteTask,
  getDailySummary,
  getProductivityStats,
  getMoodEnergyHistory,
} from '@/services/productivity';
import type {
  ProductivityQuestion,
  RecurringTask,
  QuestionType,
} from '@/types';
import { toast } from 'sonner';

// Questions hooks
export function useQuestions(type?: QuestionType) {
  return useQuery({
    queryKey: ['productivity-questions', type],
    queryFn: () => getQuestions(type),
  });
}

export function useAllQuestions() {
  return useQuery({
    queryKey: ['productivity-questions-all'],
    queryFn: getAllQuestions,
  });
}

export function useCreateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productivity-questions'] });
      queryClient.invalidateQueries({ queryKey: ['productivity-questions-all'] });
      toast.success('Întrebare creată cu succes');
    },
    onError: (error: Error) => {
      toast.error('Eroare la crearea întrebării', {
        description: error.message,
      });
    },
  });
}

export function useUpdateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductivityQuestion> }) =>
      updateQuestion(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productivity-questions'] });
      queryClient.invalidateQueries({ queryKey: ['productivity-questions-all'] });
      toast.success('Întrebare actualizată');
    },
    onError: (error: Error) => {
      toast.error('Eroare la actualizarea întrebării', {
        description: error.message,
      });
    },
  });
}

export function useDeleteQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productivity-questions'] });
      queryClient.invalidateQueries({ queryKey: ['productivity-questions-all'] });
      toast.success('Întrebare ștearsă');
    },
    onError: (error: Error) => {
      toast.error('Eroare la ștergerea întrebării', {
        description: error.message,
      });
    },
  });
}

// Daily Responses hooks
export function useDailyResponses(date: string) {
  return useQuery({
    queryKey: ['daily-responses', date],
    queryFn: () => getDailyResponses(date),
    enabled: !!date,
  });
}

export function useSaveResponses() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      date,
      responses,
    }: {
      date: string;
      responses: Array<{
        question_id: string;
        response_text?: string | null;
        response_value?: number | null;
      }>;
    }) => saveResponses(date, responses),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['daily-responses', variables.date] });
      queryClient.invalidateQueries({ queryKey: ['daily-summary', variables.date] });
      queryClient.invalidateQueries({ queryKey: ['productivity-stats'] });
      queryClient.invalidateQueries({ queryKey: ['mood-energy-history'] });
      toast.success('Răspunsuri salvate');
    },
    onError: (error: Error) => {
      toast.error('Eroare la salvarea răspunsurilor', {
        description: error.message,
      });
    },
  });
}

// Recurring Tasks hooks
export function useRecurringTasks(activeOnly = true) {
  return useQuery({
    queryKey: ['recurring-tasks', activeOnly],
    queryFn: () => getRecurringTasks(activeOnly),
  });
}

export function useCreateRecurringTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRecurringTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring-tasks'] });
      toast.success('Task recurent creat');
    },
    onError: (error: Error) => {
      toast.error('Eroare la crearea task-ului', {
        description: error.message,
      });
    },
  });
}

export function useUpdateRecurringTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RecurringTask> }) =>
      updateRecurringTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring-tasks'] });
      toast.success('Task recurent actualizat');
    },
    onError: (error: Error) => {
      toast.error('Eroare la actualizarea task-ului', {
        description: error.message,
      });
    },
  });
}

export function useDeleteRecurringTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRecurringTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring-tasks'] });
      toast.success('Task recurent șters');
    },
    onError: (error: Error) => {
      toast.error('Eroare la ștergerea task-ului', {
        description: error.message,
      });
    },
  });
}

// Daily Tasks hooks
export function useDailyTasks(date: string) {
  return useQuery({
    queryKey: ['daily-tasks', date],
    queryFn: () => getDailyTasks(date),
    enabled: !!date,
  });
}

export function useEnsureDailyTasks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ensureDailyTasks,
    onSuccess: (_, date) => {
      queryClient.invalidateQueries({ queryKey: ['daily-tasks', date] });
      queryClient.invalidateQueries({ queryKey: ['daily-summary', date] });
    },
  });
}

export function useAddCustomTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ date, title, isPriority = false }: { date: string; title: string; isPriority?: boolean }) =>
      addCustomTask(date, title, isPriority),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['daily-tasks', variables.date] });
      queryClient.invalidateQueries({ queryKey: ['priority-tasks', variables.date] });
      queryClient.invalidateQueries({ queryKey: ['daily-summary', variables.date] });
      queryClient.invalidateQueries({ queryKey: ['productivity-stats'] });
      toast.success(variables.isPriority ? 'Prioritate adăugată' : 'Task adăugat');
    },
    onError: (error: Error) => {
      toast.error('Eroare la adăugarea task-ului', {
        description: error.message,
      });
    },
  });
}

export function usePriorityTasks(date: string) {
  return useQuery({
    queryKey: ['priority-tasks', date],
    queryFn: () => getPriorityTasks(date),
    enabled: !!date,
  });
}

export function useToggleTaskPriority() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isPriority }: { id: string; isPriority: boolean }) =>
      toggleTaskPriority(id, isPriority),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['daily-tasks', data.task_date] });
      queryClient.invalidateQueries({ queryKey: ['priority-tasks', data.task_date] });
      toast.success(data.is_priority ? 'Marcat ca prioritate' : 'Eliminat din priorități');
    },
    onError: (error: Error) => {
      toast.error('Eroare la actualizarea priorității', {
        description: error.message,
      });
    },
  });
}

export function useToggleTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isCompleted }: { id: string; isCompleted: boolean }) =>
      toggleTask(id, isCompleted),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['daily-tasks', data.task_date] });
      queryClient.invalidateQueries({ queryKey: ['priority-tasks', data.task_date] });
      queryClient.invalidateQueries({ queryKey: ['daily-summary', data.task_date] });
      queryClient.invalidateQueries({ queryKey: ['productivity-stats'] });
    },
    onError: (error: Error) => {
      toast.error('Eroare la actualizarea task-ului', {
        description: error.message,
      });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['daily-summary'] });
      queryClient.invalidateQueries({ queryKey: ['productivity-stats'] });
      toast.success('Task șters');
    },
    onError: (error: Error) => {
      toast.error('Eroare la ștergerea task-ului', {
        description: error.message,
      });
    },
  });
}

// Daily Summary hooks
export function useDailySummary(date: string) {
  return useQuery({
    queryKey: ['daily-summary', date],
    queryFn: () => getDailySummary(date),
    enabled: !!date,
  });
}

// Stats hooks
export function useProductivityStats() {
  return useQuery({
    queryKey: ['productivity-stats'],
    queryFn: getProductivityStats,
  });
}

export function useMoodEnergyHistory(days = 7) {
  return useQuery({
    queryKey: ['mood-energy-history', days],
    queryFn: () => getMoodEnergyHistory(days),
  });
}
