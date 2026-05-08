-- Add teaching_levels column to teachers table
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS teaching_levels text[] DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN teachers.teaching_levels IS 'Niveluri de predare: începător, intermediar, avansat';
