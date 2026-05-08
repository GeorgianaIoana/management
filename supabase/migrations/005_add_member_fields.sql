-- Add new fields to members table for contract, payment, feedback, rating and trainer tracking

ALTER TABLE members ADD COLUMN contract_signed BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE members ADD COLUMN contract_file_url TEXT;
ALTER TABLE members ADD COLUMN payment_confirmed BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE members ADD COLUMN feedback_received BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE members ADD COLUMN rating_given BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE members ADD COLUMN trainer_id UUID REFERENCES teachers(id) ON DELETE SET NULL;

-- Create index for trainer lookups
CREATE INDEX idx_members_trainer ON members(trainer_id);
