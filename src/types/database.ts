export type MemberType = 'child' | 'adult';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type MemberStatus = 'active' | 'inactive' | 'suspended';
export type ChessTitle = 'GM' | 'IM' | 'FM' | 'CM' | 'NM' | 'WGM' | 'WIM' | 'WFM' | 'WCM' | null;
export type TargetAgeGroup = 'kids' | 'adults' | 'all';
export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';
export type PaymentMethod = 'cash' | 'card' | 'transfer' | 'other';
export type ReminderType = 'upcoming' | 'due' | 'overdue';
export type ReminderStatus = 'pending' | 'sent' | 'dismissed';
export type SessionStatus = 'scheduled' | 'completed' | 'cancelled';

export interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  date_of_birth: string | null;
  member_type: MemberType;
  guardian_name: string | null;
  guardian_phone: string | null;
  guardian_email: string | null;
  chess_rating: number | null;
  skill_level: SkillLevel | null;
  status: MemberStatus;
  join_date: string;
  avatar_url: string | null;
  notes: string | null;
  contract_signed: boolean;
  contract_file_url: string | null;
  payment_confirmed: boolean;
  feedback_received: boolean;
  rating_given: boolean;
  trainer_id: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  trainer?: Teacher;
}

export interface DragasaniMember {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  date_of_birth: string | null;
  member_type: MemberType;
  guardian_name: string | null;
  guardian_phone: string | null;
  guardian_email: string | null;
  chess_rating: number | null;
  skill_level: SkillLevel | null;
  status: MemberStatus;
  join_date: string;
  notes: string | null;
  contract_signed: boolean;
  contract_file_url: string | null;
  payment_confirmed: boolean;
  feedback_received: boolean;
  rating_given: boolean;
  created_at: string;
  updated_at: string;
}

export interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  chess_title: ChessTitle;
  chess_rating: number | null;
  bio: string | null;
  specializations: string[] | null;
  teaching_levels: string[] | null;
  hourly_rate: number | null;
  is_active: boolean;
  avatar_url: string | null;
  auth_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Class {
  id: string;
  name: string | null; // Optional - generated dynamically from day_of_week + target_age_group
  description: string | null;
  target_age_group: TargetAgeGroup;
  day_of_week: number;
  start_time: string;
  end_time: string;
  max_students: number;
  price_per_session: number | null;
  price_per_month: number | null;
  teacher_id: string | null;
  is_active: boolean;
  location: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  teacher?: Teacher;
  enrollments_count?: number;
}

export interface Enrollment {
  id: string;
  member_id: string;
  class_id: string;
  enrolled_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields
  member?: Member;
  class?: Class;
}

export interface Payment {
  id: string;
  member_id: string;
  class_id: string | null;
  amount: number;
  currency: string;
  payment_method: PaymentMethod | null;
  period_start: string | null;
  period_end: string | null;
  status: PaymentStatus;
  due_date: string;
  paid_date: string | null;
  invoice_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  member?: Member;
  class?: Class;
}

export interface PaymentReminder {
  id: string;
  payment_id: string;
  reminder_type: ReminderType;
  scheduled_date: string;
  sent_date: string | null;
  status: ReminderStatus;
  created_at: string;
  // Joined fields
  payment?: Payment;
}

export interface Lesson {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  tags: string[] | null;
  skill_level: SkillLevel | 'all' | null;
  target_age_group: TargetAgeGroup | null;
  file_url: string | null;
  file_name: string | null;
  file_type: string | null;
  file_size: number | null;
  class_id: string | null;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  class?: Class;
}

export interface ClassSession {
  id: string;
  class_id: string;
  session_date: string;
  teacher_id: string | null;
  status: SessionStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  class?: Class;
  teacher?: Teacher;
  attendance?: Attendance[];
}

export interface Attendance {
  id: string;
  session_id: string;
  member_id: string;
  attended: boolean;
  notes: string | null;
  created_at: string;
  // Joined fields
  member?: Member;
  session?: ClassSession;
}

export interface ActivityLog {
  id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  description: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

// Form types for creating/updating
export type MemberFormData = Omit<Member, 'id' | 'created_at' | 'updated_at'>;
export type TeacherFormData = Omit<Teacher, 'id' | 'created_at' | 'updated_at'>;
export type ClassFormData = Omit<Class, 'id' | 'created_at' | 'updated_at' | 'teacher' | 'enrollments_count'>;
export type PaymentFormData = Omit<Payment, 'id' | 'created_at' | 'updated_at' | 'member' | 'class'>;
export type LessonFormData = Omit<Lesson, 'id' | 'created_at' | 'updated_at' | 'class'>;

// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      members: {
        Row: Member;
        Insert: Omit<Member, 'id' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Omit<Member, 'id' | 'created_at' | 'updated_at'>>;
      };
      teachers: {
        Row: Teacher;
        Insert: Omit<Teacher, 'id' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Omit<Teacher, 'id' | 'created_at' | 'updated_at'>>;
      };
      classes: {
        Row: Class;
        Insert: Omit<Class, 'id' | 'created_at' | 'updated_at' | 'teacher' | 'enrollments_count'> & { id?: string };
        Update: Partial<Omit<Class, 'id' | 'created_at' | 'updated_at' | 'teacher' | 'enrollments_count'>>;
      };
      enrollments: {
        Row: Enrollment;
        Insert: Omit<Enrollment, 'id' | 'created_at' | 'updated_at' | 'member' | 'class'> & { id?: string };
        Update: Partial<Omit<Enrollment, 'id' | 'created_at' | 'updated_at' | 'member' | 'class'>>;
      };
      payments: {
        Row: Payment;
        Insert: Omit<Payment, 'id' | 'created_at' | 'updated_at' | 'member' | 'class'> & { id?: string };
        Update: Partial<Omit<Payment, 'id' | 'created_at' | 'updated_at' | 'member' | 'class'>>;
      };
      payment_reminders: {
        Row: PaymentReminder;
        Insert: Omit<PaymentReminder, 'id' | 'created_at' | 'payment'> & { id?: string };
        Update: Partial<Omit<PaymentReminder, 'id' | 'created_at' | 'payment'>>;
      };
      lessons: {
        Row: Lesson;
        Insert: Omit<Lesson, 'id' | 'created_at' | 'updated_at' | 'class'> & { id?: string };
        Update: Partial<Omit<Lesson, 'id' | 'created_at' | 'updated_at' | 'class'>>;
      };
      class_sessions: {
        Row: ClassSession;
        Insert: Omit<ClassSession, 'id' | 'created_at' | 'updated_at' | 'class' | 'teacher' | 'attendance'> & { id?: string };
        Update: Partial<Omit<ClassSession, 'id' | 'created_at' | 'updated_at' | 'class' | 'teacher' | 'attendance'>>;
      };
      attendance: {
        Row: Attendance;
        Insert: Omit<Attendance, 'id' | 'created_at' | 'member' | 'session'> & { id?: string };
        Update: Partial<Omit<Attendance, 'id' | 'created_at' | 'member' | 'session'>>;
      };
      activity_log: {
        Row: ActivityLog;
        Insert: Omit<ActivityLog, 'id' | 'created_at'> & { id?: string };
        Update: never;
      };
    };
  };
}
