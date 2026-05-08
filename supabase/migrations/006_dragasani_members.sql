-- Create dragasani_members table for members specific to Dragasani location
CREATE TABLE dragasani_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  date_of_birth DATE,
  member_type VARCHAR(20) NOT NULL DEFAULT 'child' CHECK (member_type IN ('child', 'adult')),
  guardian_name VARCHAR(200),
  guardian_phone VARCHAR(50),
  guardian_email VARCHAR(255),
  chess_rating INTEGER,
  skill_level VARCHAR(20) CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  join_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  contract_signed BOOLEAN NOT NULL DEFAULT false,
  contract_file_url TEXT,
  payment_confirmed BOOLEAN NOT NULL DEFAULT false,
  feedback_received BOOLEAN NOT NULL DEFAULT false,
  rating_given BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for common queries
CREATE INDEX idx_dragasani_members_status ON dragasani_members(status);
CREATE INDEX idx_dragasani_members_member_type ON dragasani_members(member_type);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_dragasani_members_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_dragasani_members_updated_at
  BEFORE UPDATE ON dragasani_members
  FOR EACH ROW
  EXECUTE FUNCTION update_dragasani_members_updated_at();
