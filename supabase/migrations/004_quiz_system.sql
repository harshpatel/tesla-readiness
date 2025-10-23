-- Quiz System Tables
-- Stores quiz sections, questions, and user progress for spaced repetition learning

-- Quiz Sections (e.g., Medical Terminology > Prefixes)
CREATE TABLE IF NOT EXISTS public.quiz_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL, -- e.g., 'prefixes', 'suffixes'
  parent_key TEXT, -- For nested sections, NULL for top-level
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- Emoji or icon identifier
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz Questions
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL REFERENCES public.quiz_sections(key) ON DELETE CASCADE,
  question_id TEXT UNIQUE NOT NULL, -- e.g., 'pre-1', 'suf-2'
  question_type TEXT NOT NULL CHECK (question_type IN ('multiplechoice', 'truefalse')),
  question_text TEXT NOT NULL,
  answers JSONB NOT NULL, -- { "A": "Answer 1", "B": "Answer 2", ... }
  correct_answer TEXT NOT NULL, -- "A", "B", "C", "D"
  points INTEGER NOT NULL DEFAULT 1,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Quiz Progress (tracks individual question progress with SM-2 algorithm)
CREATE TABLE IF NOT EXISTS public.user_quiz_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL REFERENCES public.quiz_questions(question_id) ON DELETE CASCADE,
  section_key TEXT NOT NULL REFERENCES public.quiz_sections(key) ON DELETE CASCADE,
  
  -- SM-2 Spaced Repetition Fields
  easiness_factor DECIMAL NOT NULL DEFAULT 2.5, -- SM-2 easiness factor (1.3 - 2.5+)
  repetitions INTEGER NOT NULL DEFAULT 0, -- Number of successful repetitions
  interval_days INTEGER NOT NULL DEFAULT 0, -- Days until next review
  next_review_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Performance Tracking
  correct_attempts INTEGER NOT NULL DEFAULT 0,
  incorrect_attempts INTEGER NOT NULL DEFAULT 0,
  mastered BOOLEAN NOT NULL DEFAULT FALSE, -- True if correct on first attempt
  last_attempt_date TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one progress record per user per question
  UNIQUE(user_id, question_id)
);

-- Section Progress Summary (aggregated view)
CREATE TABLE IF NOT EXISTS public.user_section_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  section_key TEXT NOT NULL REFERENCES public.quiz_sections(key) ON DELETE CASCADE,
  
  total_questions INTEGER NOT NULL DEFAULT 0,
  mastered_questions INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, section_key)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_quiz_questions_section ON public.quiz_questions(section_key);
CREATE INDEX IF NOT EXISTS idx_user_quiz_progress_user ON public.user_quiz_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_quiz_progress_section ON public.user_quiz_progress(section_key);
CREATE INDEX IF NOT EXISTS idx_user_quiz_progress_next_review ON public.user_quiz_progress(next_review_date);
CREATE INDEX IF NOT EXISTS idx_user_section_progress_user ON public.user_section_progress(user_id);

-- RLS Policies

-- Quiz Sections: Read-only for all authenticated users
ALTER TABLE public.quiz_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Quiz sections are viewable by authenticated users"
  ON public.quiz_sections FOR SELECT
  TO authenticated
  USING (true);

-- Quiz Questions: Read-only for all authenticated users
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Quiz questions are viewable by authenticated users"
  ON public.quiz_questions FOR SELECT
  TO authenticated
  USING (true);

-- User Quiz Progress: Users can only access their own progress
ALTER TABLE public.user_quiz_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own quiz progress"
  ON public.user_quiz_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz progress"
  ON public.user_quiz_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quiz progress"
  ON public.user_quiz_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- User Section Progress: Users can only access their own progress
ALTER TABLE public.user_section_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own section progress"
  ON public.user_section_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own section progress"
  ON public.user_section_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own section progress"
  ON public.user_section_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Admin policies: Admins and Master Admins can view all progress
CREATE POLICY "Admins can view all quiz progress"
  ON public.user_quiz_progress FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'master_admin')
    )
  );

CREATE POLICY "Admins can view all section progress"
  ON public.user_section_progress FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'master_admin')
    )
  );

-- Function to update section progress summary
CREATE OR REPLACE FUNCTION update_section_progress_summary()
RETURNS TRIGGER AS $$
BEGIN
  -- Upsert section progress summary
  INSERT INTO public.user_section_progress (
    user_id,
    section_key,
    total_questions,
    mastered_questions,
    completed
  )
  SELECT
    NEW.user_id,
    NEW.section_key,
    COUNT(*) as total_questions,
    COUNT(*) FILTER (WHERE mastered = true) as mastered_questions,
    COUNT(*) FILTER (WHERE mastered = true) = COUNT(*) as completed
  FROM public.user_quiz_progress
  WHERE user_id = NEW.user_id AND section_key = NEW.section_key
  GROUP BY user_id, section_key
  ON CONFLICT (user_id, section_key)
  DO UPDATE SET
    total_questions = EXCLUDED.total_questions,
    mastered_questions = EXCLUDED.mastered_questions,
    completed = EXCLUDED.completed,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update section progress
CREATE TRIGGER update_section_progress_trigger
  AFTER INSERT OR UPDATE ON public.user_quiz_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_section_progress_summary();

