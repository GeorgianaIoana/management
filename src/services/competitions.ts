import { createClient } from '@/lib/supabase/client';
import type {
  Competition,
  CompetitionParticipant,
  CompetitionFilters,
  CompetitionStats,
  PaginatedResponse,
  PaginationParams,
} from '@/types';

const supabase = createClient();

export async function getCompetitions(
  filters?: CompetitionFilters,
  pagination?: PaginationParams
): Promise<PaginatedResponse<Competition>> {
  const page = pagination?.page ?? 1;
  const pageSize = pagination?.pageSize ?? 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('competitions')
    .select('*, competition_participants(count)', { count: 'exact' });

  if (filters?.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,location.ilike.%${filters.search}%`
    );
  }

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  query = query
    .order('event_date', { ascending: false })
    .range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;

  // Transform data to include participants_count
  const competitions = (data ?? []).map((comp) => ({
    ...comp,
    participants_count: comp.competition_participants?.[0]?.count ?? 0,
  }));

  return {
    data: competitions,
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  };
}

export async function getCompetition(id: string): Promise<Competition | null> {
  const { data, error } = await supabase
    .from('competitions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getCompetitionWithParticipants(id: string): Promise<Competition | null> {
  const { data, error } = await supabase
    .from('competitions')
    .select('*, participants:competition_participants(*)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createCompetition(
  competition: Omit<Competition, 'id' | 'created_at' | 'updated_at' | 'participants_count' | 'participants'>
): Promise<Competition> {
  const { data, error } = await supabase
    .from('competitions')
    .insert(competition)
    .select()
    .single();

  if (error) throw error;

  await logActivity('competition', data.id, 'created', `Competiție nouă: ${data.name}`);

  return data;
}

export async function updateCompetition(
  id: string,
  competition: Partial<Competition>
): Promise<Competition> {
  const { data, error } = await supabase
    .from('competitions')
    .update(competition)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  await logActivity('competition', data.id, 'updated', `Competiție actualizată: ${data.name}`);

  return data;
}

export async function deleteCompetition(id: string): Promise<void> {
  const { data: competition } = await supabase
    .from('competitions')
    .select('name')
    .eq('id', id)
    .single();

  const { error } = await supabase
    .from('competitions')
    .delete()
    .eq('id', id);

  if (error) throw error;

  if (competition) {
    await logActivity('competition', id, 'deleted', `Competiție ștearsă: ${competition.name}`);
  }
}

// Participants
export async function getParticipants(competitionId: string): Promise<CompetitionParticipant[]> {
  const { data, error } = await supabase
    .from('competition_participants')
    .select('*')
    .eq('competition_id', competitionId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function addParticipant(
  competitionId: string,
  participant: Omit<CompetitionParticipant, 'id' | 'created_at' | 'competition_id'>
): Promise<CompetitionParticipant> {
  const { data, error } = await supabase
    .from('competition_participants')
    .insert({
      ...participant,
      competition_id: competitionId,
    })
    .select()
    .single();

  if (error) throw error;

  await logActivity('competition_participant', data.id, 'created', `Participant nou: ${data.name}`);

  return data;
}

export async function deleteParticipant(id: string): Promise<void> {
  const { data: participant } = await supabase
    .from('competition_participants')
    .select('name')
    .eq('id', id)
    .single();

  const { error } = await supabase
    .from('competition_participants')
    .delete()
    .eq('id', id);

  if (error) throw error;

  if (participant) {
    await logActivity('competition_participant', id, 'deleted', `Participant șters: ${participant.name}`);
  }
}

// Stats
export async function getCompetitionStats(): Promise<CompetitionStats> {
  const { data: competitions, error: compError } = await supabase
    .from('competitions')
    .select('id, status');

  if (compError) throw compError;

  const { count: participantsCount, error: partError } = await supabase
    .from('competition_participants')
    .select('*', { count: 'exact', head: true });

  if (partError) throw partError;

  return {
    total: competitions?.length ?? 0,
    planned: competitions?.filter(c => c.status === 'planned').length ?? 0,
    ongoing: competitions?.filter(c => c.status === 'ongoing').length ?? 0,
    completed: competitions?.filter(c => c.status === 'completed').length ?? 0,
    totalParticipants: participantsCount ?? 0,
  };
}

// Activity logging helper
async function logActivity(
  entityType: string,
  entityId: string,
  action: string,
  description: string
) {
  await supabase.from('activity_log').insert({
    entity_type: entityType,
    entity_id: entityId,
    action,
    description,
  });
}
