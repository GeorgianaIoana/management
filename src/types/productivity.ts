// Productivity System Types

export type QuestionType = 'morning' | 'evening';
export type ResponseType = 'text' | 'scale' | 'mood' | 'energy';
export type TaskFrequency = 'daily' | 'weekdays' | 'weekends' | 'weekly';

export interface ProductivityQuestion {
  id: string;
  question_text: string;
  question_type: QuestionType;
  response_type: ResponseType;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DailyResponse {
  id: string;
  question_id: string;
  response_date: string;
  response_text: string | null;
  response_value: number | null;
  created_at: string;
  // Joined fields
  question?: ProductivityQuestion;
}

export interface RecurringTask {
  id: string;
  title: string;
  description: string | null;
  frequency: TaskFrequency;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface DailyTask {
  id: string;
  recurring_task_id: string | null;
  title: string;
  task_date: string;
  is_completed: boolean;
  completed_at: string | null;
  is_custom: boolean;
  is_priority: boolean;
  created_at: string;
  // Joined fields
  recurring_task?: RecurringTask;
}

export interface DailySummary {
  id: string;
  summary_date: string;
  morning_mood: number | null;
  morning_energy: number | null;
  evening_mood: number | null;
  evening_energy: number | null;
  tasks_completed: number;
  tasks_total: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Form types
export type ProductivityQuestionFormData = Omit<ProductivityQuestion, 'id' | 'created_at' | 'updated_at'>;
export type DailyResponseFormData = Omit<DailyResponse, 'id' | 'created_at' | 'question'>;
export type RecurringTaskFormData = Omit<RecurringTask, 'id' | 'created_at' | 'updated_at'>;
export type DailyTaskFormData = Omit<DailyTask, 'id' | 'created_at' | 'recurring_task'>;
export type DailySummaryFormData = Omit<DailySummary, 'id' | 'created_at' | 'updated_at'>;

// Stats types
export interface ProductivityStats {
  streak: number;
  todayCompleted: number;
  todayTotal: number;
  weeklyCompletionRate: number;
}

export interface MoodEnergyData {
  date: string;
  morning_mood: number | null;
  morning_energy: number | null;
  evening_mood: number | null;
  evening_energy: number | null;
}

// Check-in state
export interface CheckInState {
  responses: Record<string, string | number>;
  isComplete: boolean;
}

// Database types for Supabase
export interface ProductivityDatabase {
  public: {
    Tables: {
      productivity_questions: {
        Row: ProductivityQuestion;
        Insert: Omit<ProductivityQuestion, 'id' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Omit<ProductivityQuestion, 'id' | 'created_at' | 'updated_at'>>;
      };
      daily_responses: {
        Row: DailyResponse;
        Insert: Omit<DailyResponse, 'id' | 'created_at' | 'question'> & { id?: string };
        Update: Partial<Omit<DailyResponse, 'id' | 'created_at' | 'question'>>;
      };
      recurring_tasks: {
        Row: RecurringTask;
        Insert: Omit<RecurringTask, 'id' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Omit<RecurringTask, 'id' | 'created_at' | 'updated_at'>>;
      };
      daily_tasks: {
        Row: DailyTask;
        Insert: Omit<DailyTask, 'id' | 'created_at' | 'recurring_task'> & { id?: string };
        Update: Partial<Omit<DailyTask, 'id' | 'created_at' | 'recurring_task'>>;
      };
      daily_summary: {
        Row: DailySummary;
        Insert: Omit<DailySummary, 'id' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Omit<DailySummary, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}
