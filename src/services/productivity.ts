import { createClient } from '@/lib/supabase/client';
import type {
  ProductivityQuestion,
  DailyResponse,
  RecurringTask,
  DailyTask,
  DailySummary,
  ProductivityStats,
  MoodEnergyData,
  QuestionType,
} from '@/types';

const supabase = createClient();

// Questions
export async function getQuestions(type?: QuestionType): Promise<ProductivityQuestion[]> {
  let query = supabase
    .from('productivity_questions')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (type) {
    query = query.eq('question_type', type);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getAllQuestions(): Promise<ProductivityQuestion[]> {
  const { data, error } = await supabase
    .from('productivity_questions')
    .select('*')
    .order('question_type')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function createQuestion(
  question: Omit<ProductivityQuestion, 'id' | 'created_at' | 'updated_at'>
): Promise<ProductivityQuestion> {
  const { data, error } = await supabase
    .from('productivity_questions')
    .insert(question)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateQuestion(
  id: string,
  question: Partial<ProductivityQuestion>
): Promise<ProductivityQuestion> {
  const { data, error } = await supabase
    .from('productivity_questions')
    .update(question)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteQuestion(id: string): Promise<void> {
  const { error } = await supabase
    .from('productivity_questions')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Daily Responses
export async function getDailyResponses(date: string): Promise<DailyResponse[]> {
  const { data, error } = await supabase
    .from('daily_responses')
    .select('*, question:productivity_questions(*)')
    .eq('response_date', date);

  if (error) throw error;
  return data ?? [];
}

export async function saveResponses(
  date: string,
  responses: Array<{
    question_id: string;
    response_text?: string | null;
    response_value?: number | null;
  }>
): Promise<DailyResponse[]> {
  // Upsert responses
  const { data, error } = await supabase
    .from('daily_responses')
    .upsert(
      responses.map((r) => ({
        question_id: r.question_id,
        response_date: date,
        response_text: r.response_text,
        response_value: r.response_value,
      })),
      { onConflict: 'question_id,response_date' }
    )
    .select();

  if (error) throw error;

  // Update daily summary with mood/energy values
  await updateDailySummaryFromResponses(date, responses);

  return data ?? [];
}

// Recurring Tasks
export async function getRecurringTasks(activeOnly = true): Promise<RecurringTask[]> {
  let query = supabase
    .from('recurring_tasks')
    .select('*')
    .order('display_order', { ascending: true });

  if (activeOnly) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function createRecurringTask(
  task: Omit<RecurringTask, 'id' | 'created_at' | 'updated_at'>
): Promise<RecurringTask> {
  const { data, error } = await supabase
    .from('recurring_tasks')
    .insert(task)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateRecurringTask(
  id: string,
  task: Partial<RecurringTask>
): Promise<RecurringTask> {
  const { data, error } = await supabase
    .from('recurring_tasks')
    .update(task)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteRecurringTask(id: string): Promise<void> {
  const { error } = await supabase
    .from('recurring_tasks')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Daily Tasks
export async function getDailyTasks(date: string): Promise<DailyTask[]> {
  const { data, error } = await supabase
    .from('daily_tasks')
    .select('*, recurring_task:recurring_tasks(*)')
    .eq('task_date', date)
    .order('is_custom', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function ensureDailyTasks(date: string): Promise<DailyTask[]> {
  // Check if tasks already exist for this date
  const existingTasks = await getDailyTasks(date);

  if (existingTasks.length > 0) {
    return existingTasks;
  }

  // Get active recurring tasks
  const recurringTasks = await getRecurringTasks(true);

  // Determine day of week (0 = Sunday, 6 = Saturday)
  const dayOfWeek = new Date(date).getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const isWeekday = !isWeekend;

  // Filter tasks based on frequency
  const tasksToCreate = recurringTasks.filter((task) => {
    switch (task.frequency) {
      case 'daily':
        return true;
      case 'weekdays':
        return isWeekday;
      case 'weekends':
        return isWeekend;
      case 'weekly':
        // Weekly tasks appear on Monday
        return dayOfWeek === 1;
      default:
        return false;
    }
  });

  if (tasksToCreate.length === 0) {
    return [];
  }

  // Create daily task instances
  const { data, error } = await supabase
    .from('daily_tasks')
    .insert(
      tasksToCreate.map((task) => ({
        recurring_task_id: task.id,
        title: task.title,
        task_date: date,
        is_completed: false,
        is_custom: false,
        is_priority: false,
      }))
    )
    .select('*, recurring_task:recurring_tasks(*)');

  if (error) throw error;

  // Update daily summary with task count
  await updateDailySummaryTaskCount(date);

  return data ?? [];
}

export async function addCustomTask(
  date: string,
  title: string,
  isPriority = false
): Promise<DailyTask> {
  const { data, error } = await supabase
    .from('daily_tasks')
    .insert({
      title,
      task_date: date,
      is_completed: false,
      is_custom: true,
      is_priority: isPriority,
    })
    .select()
    .single();

  if (error) throw error;

  // Update daily summary task count
  await updateDailySummaryTaskCount(date);

  return data;
}

export async function toggleTaskPriority(
  id: string,
  isPriority: boolean
): Promise<DailyTask> {
  const { data, error } = await supabase
    .from('daily_tasks')
    .update({ is_priority: isPriority })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getPriorityTasks(date: string): Promise<DailyTask[]> {
  const { data, error } = await supabase
    .from('daily_tasks')
    .select('*, recurring_task:recurring_tasks(*)')
    .eq('task_date', date)
    .eq('is_priority', true)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function toggleTask(
  id: string,
  isCompleted: boolean
): Promise<DailyTask> {
  const { data, error } = await supabase
    .from('daily_tasks')
    .update({
      is_completed: isCompleted,
      completed_at: isCompleted ? new Date().toISOString() : null,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  // Update daily summary task count
  await updateDailySummaryTaskCount(data.task_date);

  return data;
}

export async function deleteTask(id: string): Promise<void> {
  // Get task date before deleting
  const { data: task } = await supabase
    .from('daily_tasks')
    .select('task_date')
    .eq('id', id)
    .single();

  const { error } = await supabase
    .from('daily_tasks')
    .delete()
    .eq('id', id);

  if (error) throw error;

  // Update daily summary task count
  if (task) {
    await updateDailySummaryTaskCount(task.task_date);
  }
}

// Daily Summary
export async function getDailySummary(date: string): Promise<DailySummary | null> {
  const { data, error } = await supabase
    .from('daily_summary')
    .select('*')
    .eq('summary_date', date)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function getOrCreateDailySummary(date: string): Promise<DailySummary> {
  const existing = await getDailySummary(date);
  if (existing) return existing;

  const { data, error } = await supabase
    .from('daily_summary')
    .insert({ summary_date: date })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function updateDailySummaryFromResponses(
  date: string,
  responses: Array<{
    question_id: string;
    response_text?: string | null;
    response_value?: number | null;
  }>
): Promise<void> {
  // Get questions to determine response types
  const questions = await getQuestions();
  const questionMap = new Map(questions.map((q) => [q.id, q]));

  const updates: Partial<DailySummary> = {};

  for (const response of responses) {
    const question = questionMap.get(response.question_id);
    if (!question || response.response_value === null || response.response_value === undefined) continue;

    if (question.response_type === 'mood') {
      if (question.question_type === 'morning') {
        updates.morning_mood = response.response_value;
      } else {
        updates.evening_mood = response.response_value;
      }
    } else if (question.response_type === 'energy') {
      if (question.question_type === 'morning') {
        updates.morning_energy = response.response_value;
      } else {
        updates.evening_energy = response.response_value;
      }
    }
  }

  if (Object.keys(updates).length > 0) {
    await getOrCreateDailySummary(date);
    await supabase
      .from('daily_summary')
      .update(updates)
      .eq('summary_date', date);
  }
}

async function updateDailySummaryTaskCount(date: string): Promise<void> {
  const tasks = await getDailyTasks(date);
  const completed = tasks.filter((t) => t.is_completed).length;
  const total = tasks.length;

  await getOrCreateDailySummary(date);
  await supabase
    .from('daily_summary')
    .update({
      tasks_completed: completed,
      tasks_total: total,
    })
    .eq('summary_date', date);
}

// Stats & Analytics
export async function getProductivityStats(): Promise<ProductivityStats> {
  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Get today's summary
  const todaySummary = await getDailySummary(today);

  // Get weekly summaries
  const { data: weeklySummaries, error } = await supabase
    .from('daily_summary')
    .select('*')
    .gte('summary_date', weekAgo)
    .lte('summary_date', today)
    .order('summary_date', { ascending: false });

  if (error) throw error;

  // Calculate streak
  const streak = await calculateStreak();

  // Calculate weekly completion rate
  let weeklyCompleted = 0;
  let weeklyTotal = 0;
  for (const summary of weeklySummaries ?? []) {
    weeklyCompleted += summary.tasks_completed ?? 0;
    weeklyTotal += summary.tasks_total ?? 0;
  }
  const weeklyCompletionRate = weeklyTotal > 0 ? Math.round((weeklyCompleted / weeklyTotal) * 100) : 0;

  return {
    streak,
    todayCompleted: todaySummary?.tasks_completed ?? 0,
    todayTotal: todaySummary?.tasks_total ?? 0,
    weeklyCompletionRate,
  };
}

async function calculateStreak(): Promise<number> {
  const { data: summaries, error } = await supabase
    .from('daily_summary')
    .select('summary_date, tasks_completed, tasks_total, morning_mood')
    .order('summary_date', { ascending: false })
    .limit(365);

  if (error) throw error;
  if (!summaries || summaries.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];

    const summary = summaries.find((s) => s.summary_date === dateStr);

    // A day counts towards streak if:
    // 1. Has morning check-in (morning_mood is set), OR
    // 2. Completed at least one task
    const hasActivity =
      summary && (summary.morning_mood !== null || (summary.tasks_completed ?? 0) > 0);

    if (hasActivity) {
      streak++;
    } else if (i > 0) {
      // Allow today to be incomplete, but break on previous days
      break;
    }
  }

  return streak;
}

export async function getMoodEnergyHistory(days = 7): Promise<MoodEnergyData[]> {
  const today = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('daily_summary')
    .select('summary_date, morning_mood, morning_energy, evening_mood, evening_energy')
    .gte('summary_date', startDate)
    .lte('summary_date', today)
    .order('summary_date', { ascending: true });

  if (error) throw error;

  return (data ?? []).map((d) => ({
    date: d.summary_date,
    morning_mood: d.morning_mood,
    morning_energy: d.morning_energy,
    evening_mood: d.evening_mood,
    evening_energy: d.evening_energy,
  }));
}

// Check if evening check-in should be shown (after 18:00)
export function shouldShowEveningCheckin(): boolean {
  const now = new Date();
  return now.getHours() >= 18;
}

// Format date for display
export function formatDisplayDate(date: Date): string {
  const days = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'];
  const months = [
    'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
    'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
  ];

  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}
