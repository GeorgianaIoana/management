export type CompetitionStatus = 'planned' | 'ongoing' | 'completed' | 'cancelled';

export interface Competition {
  id: string;
  name: string;
  description: string | null;
  event_date: string;
  end_date: string | null;
  location: string | null;
  status: CompetitionStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  participants_count?: number;
  participants?: CompetitionParticipant[];
}

export interface CompetitionParticipant {
  id: string;
  competition_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  created_at: string;
}

// Form types
export type CompetitionFormData = Omit<Competition, 'id' | 'created_at' | 'updated_at' | 'participants_count' | 'participants'>;
export type ParticipantFormData = Omit<CompetitionParticipant, 'id' | 'created_at' | 'competition_id'>;

// Filter types
export interface CompetitionFilters {
  search?: string;
  status?: CompetitionStatus | 'all';
}

// Stats type
export interface CompetitionStats {
  total: number;
  planned: number;
  ongoing: number;
  completed: number;
  totalParticipants: number;
}
