-- Migration: 003_competitions
-- Description: Competitions dashboard module schema

-- 1. Competiții
CREATE TABLE competitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  end_date DATE,
  location VARCHAR(200),
  status VARCHAR(20) NOT NULL DEFAULT 'planned'
    CHECK (status IN ('planned', 'ongoing', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Participanți (simplu, fără legătură cu members)
CREATE TABLE competition_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Triggers for updated_at
CREATE TRIGGER update_competitions_updated_at
  BEFORE UPDATE ON competitions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX idx_competitions_status ON competitions(status);
CREATE INDEX idx_competitions_event_date ON competitions(event_date);
CREATE INDEX idx_competition_participants_competition_id ON competition_participants(competition_id);

-- RLS policies
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE competition_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users full access to competitions"
  ON competitions FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to competition_participants"
  ON competition_participants FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
