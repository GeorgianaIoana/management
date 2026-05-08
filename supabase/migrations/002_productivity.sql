-- Productivity System Database Schema
-- Daily check-in, task tracking, mood & energy monitoring

-- 1. Template questions (morning/evening)
CREATE TABLE productivity_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_text TEXT NOT NULL,
    question_type VARCHAR(20) NOT NULL CHECK (question_type IN ('morning', 'evening')),
    response_type VARCHAR(20) NOT NULL CHECK (response_type IN ('text', 'scale', 'mood', 'energy')),
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Daily responses
CREATE TABLE daily_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES productivity_questions(id) ON DELETE CASCADE,
    response_date DATE NOT NULL,
    response_text TEXT,
    response_value INT CHECK (response_value BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(question_id, response_date)
);

-- 3. Template recurring tasks
CREATE TABLE recurring_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    frequency VARCHAR(20) NOT NULL CHECK (frequency IN ('daily', 'weekdays', 'weekends', 'weekly')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Daily tasks (instances)
CREATE TABLE daily_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recurring_task_id UUID REFERENCES recurring_tasks(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    task_date DATE NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ,
    is_custom BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Daily summary (mood/energy/stats)
CREATE TABLE daily_summary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    summary_date DATE NOT NULL UNIQUE,
    morning_mood INT CHECK (morning_mood BETWEEN 1 AND 5),
    morning_energy INT CHECK (morning_energy BETWEEN 1 AND 5),
    evening_mood INT CHECK (evening_mood BETWEEN 1 AND 5),
    evening_energy INT CHECK (evening_energy BETWEEN 1 AND 5),
    tasks_completed INT DEFAULT 0,
    tasks_total INT DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_productivity_questions_type ON productivity_questions(question_type);
CREATE INDEX idx_productivity_questions_active ON productivity_questions(is_active);
CREATE INDEX idx_daily_responses_date ON daily_responses(response_date);
CREATE INDEX idx_daily_responses_question ON daily_responses(question_id);
CREATE INDEX idx_recurring_tasks_active ON recurring_tasks(is_active);
CREATE INDEX idx_recurring_tasks_frequency ON recurring_tasks(frequency);
CREATE INDEX idx_daily_tasks_date ON daily_tasks(task_date);
CREATE INDEX idx_daily_tasks_recurring ON daily_tasks(recurring_task_id);
CREATE INDEX idx_daily_summary_date ON daily_summary(summary_date);

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_productivity_questions_updated_at BEFORE UPDATE ON productivity_questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recurring_tasks_updated_at BEFORE UPDATE ON recurring_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_summary_updated_at BEFORE UPDATE ON daily_summary FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE productivity_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_summary ENABLE ROW LEVEL SECURITY;

-- RLS policies - Allow authenticated users full access (single user app)
CREATE POLICY "Allow authenticated users full access to productivity_questions" ON productivity_questions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated users full access to daily_responses" ON daily_responses FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated users full access to recurring_tasks" ON recurring_tasks FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated users full access to daily_tasks" ON daily_tasks FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated users full access to daily_summary" ON daily_summary FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed Data: Default Morning Questions
INSERT INTO productivity_questions (question_text, question_type, response_type, display_order) VALUES
('Cum te simți în această dimineață?', 'morning', 'mood', 1),
('Care este nivelul tău de energie?', 'morning', 'energy', 2),
('Care sunt cele 3 priorități ale zilei?', 'morning', 'text', 3),
('Ce te-ar face să consideri ziua un succes?', 'morning', 'text', 4);

-- Seed Data: Default Evening Questions
INSERT INTO productivity_questions (question_text, question_type, response_type, display_order) VALUES
('Cum te simți la final de zi?', 'evening', 'mood', 1),
('Care este nivelul tău de energie?', 'evening', 'energy', 2),
('Ce ai realizat azi?', 'evening', 'text', 3),
('Ce ai învățat azi?', 'evening', 'text', 4),
('Pentru ce ești recunoscător/recunoscătoare?', 'evening', 'text', 5);

-- Seed Data: Default Recurring Tasks
INSERT INTO recurring_tasks (title, frequency, display_order) VALUES
('Meditație', 'daily', 1),
('Exerciții fizice', 'daily', 2),
('Citit 30 min', 'daily', 3),
('Review obiective', 'weekdays', 4);
