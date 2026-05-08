import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCompetitions,
  getCompetition,
  getCompetitionWithParticipants,
  createCompetition,
  updateCompetition,
  deleteCompetition,
  getParticipants,
  addParticipant,
  deleteParticipant,
  getCompetitionStats,
} from '@/services/competitions';
import type {
  Competition,
  CompetitionParticipant,
  CompetitionFilters,
  PaginationParams,
} from '@/types';
import { toast } from 'sonner';

// Competitions queries
export function useCompetitions(filters?: CompetitionFilters, pagination?: PaginationParams) {
  return useQuery({
    queryKey: ['competitions', filters, pagination],
    queryFn: () => getCompetitions(filters, pagination),
  });
}

export function useCompetition(id: string | undefined) {
  return useQuery({
    queryKey: ['competition', id],
    queryFn: () => getCompetition(id!),
    enabled: !!id,
  });
}

export function useCompetitionWithParticipants(id: string | undefined) {
  return useQuery({
    queryKey: ['competition', id, 'with-participants'],
    queryFn: () => getCompetitionWithParticipants(id!),
    enabled: !!id,
  });
}

export function useCompetitionStats() {
  return useQuery({
    queryKey: ['competition-stats'],
    queryFn: getCompetitionStats,
  });
}

// Competition mutations
export function useCreateCompetition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCompetition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitions'] });
      queryClient.invalidateQueries({ queryKey: ['competition-stats'] });
      toast.success('Competiție creată cu succes');
    },
    onError: (error: Error) => {
      toast.error('Eroare la crearea competiției', {
        description: error.message,
      });
    },
  });
}

export function useUpdateCompetition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Competition> }) =>
      updateCompetition(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['competitions'] });
      queryClient.invalidateQueries({ queryKey: ['competition', data.id] });
      queryClient.invalidateQueries({ queryKey: ['competition-stats'] });
      toast.success('Competiție actualizată cu succes');
    },
    onError: (error: Error) => {
      toast.error('Eroare la actualizarea competiției', {
        description: error.message,
      });
    },
  });
}

export function useDeleteCompetition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCompetition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitions'] });
      queryClient.invalidateQueries({ queryKey: ['competition-stats'] });
      toast.success('Competiție ștearsă cu succes');
    },
    onError: (error: Error) => {
      toast.error('Eroare la ștergerea competiției', {
        description: error.message,
      });
    },
  });
}

// Participants queries
export function useParticipants(competitionId: string | undefined) {
  return useQuery({
    queryKey: ['participants', competitionId],
    queryFn: () => getParticipants(competitionId!),
    enabled: !!competitionId,
  });
}

// Participant mutations
export function useAddParticipant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      competitionId,
      data,
    }: {
      competitionId: string;
      data: Omit<CompetitionParticipant, 'id' | 'created_at' | 'competition_id'>;
    }) => addParticipant(competitionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['participants', variables.competitionId] });
      queryClient.invalidateQueries({ queryKey: ['competition', variables.competitionId] });
      queryClient.invalidateQueries({ queryKey: ['competitions'] });
      queryClient.invalidateQueries({ queryKey: ['competition-stats'] });
      toast.success('Participant adăugat cu succes');
    },
    onError: (error: Error) => {
      toast.error('Eroare la adăugarea participantului', {
        description: error.message,
      });
    },
  });
}

export function useDeleteParticipant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; competitionId: string }) =>
      deleteParticipant(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['participants', variables.competitionId] });
      queryClient.invalidateQueries({ queryKey: ['competition', variables.competitionId] });
      queryClient.invalidateQueries({ queryKey: ['competitions'] });
      queryClient.invalidateQueries({ queryKey: ['competition-stats'] });
      toast.success('Participant șters cu succes');
    },
    onError: (error: Error) => {
      toast.error('Eroare la ștergerea participantului', {
        description: error.message,
      });
    },
  });
}
