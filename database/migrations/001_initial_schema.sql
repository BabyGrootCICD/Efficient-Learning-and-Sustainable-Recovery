-- Systematic Life initial schema for Supabase PostgreSQL

CREATE TYPE habit_category AS ENUM (
  'priming', 'encoding', 'reference', 'retrieval', 'interleaving', 'overlearning',
  'relaxation', 'detachment', 'mastery', 'control'
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE diagnostic_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  overall_score DECIMAL(5,2) NOT NULL,
  category_scores JSONB NOT NULL DEFAULT '{}',
  answers JSONB NOT NULL DEFAULT '{}',
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE habit_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category habit_category NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  entry_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, category, entry_date)
);

CREATE TABLE weekly_checklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  items JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, week_start)
);

CREATE INDEX idx_diagnostic_results_user_id ON diagnostic_results(user_id);
CREATE INDEX idx_habit_entries_user_date ON habit_entries(user_id, entry_date);
CREATE INDEX idx_weekly_checklist_user_week ON weekly_checklist(user_id, week_start);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostic_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_checklist ENABLE ROW LEVEL SECURITY;

CREATE POLICY users_own ON users FOR ALL USING (auth.uid() = id);
CREATE POLICY diagnostic_own ON diagnostic_results FOR ALL USING (auth.uid() = user_id);
CREATE POLICY habits_own ON habit_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY checklist_own ON weekly_checklist FOR ALL USING (auth.uid() = user_id);
