-- Add is_priority column to daily_tasks table
ALTER TABLE daily_tasks ADD COLUMN is_priority BOOLEAN NOT NULL DEFAULT false;

-- Create index for better query performance on priority tasks
CREATE INDEX idx_daily_tasks_priority ON daily_tasks(is_priority);
