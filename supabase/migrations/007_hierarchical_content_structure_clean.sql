-- Migration: Hierarchical Content Structure (CLEAN START)
-- This version drops old conflicting tables and starts fresh

-- ============================================================================
-- 1. DROP OLD CONFLICTING TABLES
-- ============================================================================

-- Drop old progress tables (these will be replaced with new structure)
DROP TABLE IF EXISTS public.user_section_progress CASCADE;
DROP TABLE IF EXISTS public.user_module_progress CASCADE;
DROP TABLE IF EXISTS public.user_content_progress CASCADE;

-- ============================================================================
-- 2. CREATE NEW TABLES
-- ============================================================================

-- Sections table (top level: Onboarding, Phase 1, Phase 2, etc.)
CREATE TABLE IF NOT EXISTS public.sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Modules table (containers within sections: Medical Terminology, etc.)
CREATE TABLE IF NOT EXISTS public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(section_id, slug)
);

-- Content items table (actual content: quizzes, videos, readings, etc.)
CREATE TABLE IF NOT EXISTS public.content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- 'quiz', 'video', 'reading', 'assessment', etc.
  icon TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  metadata JSONB DEFAULT '{}', -- type-specific data (video_url, reading_url, etc.)
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(module_id, slug)
);

-- ============================================================================
-- 3. CREATE NEW PROGRESS TRACKING TABLES
-- ============================================================================

-- User section progress (rollup of all modules in a section)
CREATE TABLE public.user_section_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  total_modules INTEGER DEFAULT 0,
  completed_modules INTEGER DEFAULT 0,
  progress_percent INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, section_id)
);

-- User module progress (rollup of all content items in a module)
CREATE TABLE public.user_module_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  total_items INTEGER DEFAULT 0,
  completed_items INTEGER DEFAULT 0,
  progress_percent INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

-- User content progress (granular tracking of individual content items)
CREATE TABLE public.user_content_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_item_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  score DECIMAL(5,2), -- for quizzes/assessments
  attempts INTEGER DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, content_item_id)
);

-- ============================================================================
-- 4. UPDATE quiz_questions TO REFERENCE content_items
-- ============================================================================

-- Add content_item_id column to quiz_questions
ALTER TABLE public.quiz_questions 
ADD COLUMN IF NOT EXISTS content_item_id UUID REFERENCES public.content_items(id) ON DELETE CASCADE;

-- ============================================================================
-- 5. CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_modules_section_id ON public.modules(section_id);
CREATE INDEX IF NOT EXISTS idx_modules_order ON public.modules(section_id, order_index);

CREATE INDEX IF NOT EXISTS idx_content_items_module_id ON public.content_items(module_id);
CREATE INDEX IF NOT EXISTS idx_content_items_order ON public.content_items(module_id, order_index);
CREATE INDEX IF NOT EXISTS idx_content_items_type ON public.content_items(type);

CREATE INDEX IF NOT EXISTS idx_user_section_progress_user ON public.user_section_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_module_progress_user ON public.user_module_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_content_progress_user ON public.user_content_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_content_progress_content ON public.user_content_progress(content_item_id);

CREATE INDEX IF NOT EXISTS idx_quiz_questions_content_item ON public.quiz_questions(content_item_id);

-- ============================================================================
-- 6. ENABLE RLS (Row Level Security)
-- ============================================================================

ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_section_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_content_progress ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 7. CREATE RLS POLICIES
-- ============================================================================

-- Sections: Public read, admin write
DROP POLICY IF EXISTS "Sections are viewable by everyone" ON public.sections;
CREATE POLICY "Sections are viewable by everyone"
  ON public.sections FOR SELECT
  USING (is_published = true);

DROP POLICY IF EXISTS "Sections are manageable by admins" ON public.sections;
CREATE POLICY "Sections are manageable by admins"
  ON public.sections FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Modules: Public read, admin write
DROP POLICY IF EXISTS "Modules are viewable by everyone" ON public.modules;
CREATE POLICY "Modules are viewable by everyone"
  ON public.modules FOR SELECT
  USING (is_published = true);

DROP POLICY IF EXISTS "Modules are manageable by admins" ON public.modules;
CREATE POLICY "Modules are manageable by admins"
  ON public.modules FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Content Items: Public read, admin write
DROP POLICY IF EXISTS "Content items are viewable by everyone" ON public.content_items;
CREATE POLICY "Content items are viewable by everyone"
  ON public.content_items FOR SELECT
  USING (is_published = true);

DROP POLICY IF EXISTS "Content items are manageable by admins" ON public.content_items;
CREATE POLICY "Content items are manageable by admins"
  ON public.content_items FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- User Section Progress: Users can view/edit their own
DROP POLICY IF EXISTS "Users can view own section progress" ON public.user_section_progress;
CREATE POLICY "Users can view own section progress"
  ON public.user_section_progress FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own section progress" ON public.user_section_progress;
CREATE POLICY "Users can update own section progress"
  ON public.user_section_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own section progress 2" ON public.user_section_progress;
CREATE POLICY "Users can update own section progress 2"
  ON public.user_section_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- User Module Progress: Users can view/edit their own
DROP POLICY IF EXISTS "Users can view own module progress" ON public.user_module_progress;
CREATE POLICY "Users can view own module progress"
  ON public.user_module_progress FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own module progress" ON public.user_module_progress;
CREATE POLICY "Users can insert own module progress"
  ON public.user_module_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own module progress" ON public.user_module_progress;
CREATE POLICY "Users can update own module progress"
  ON public.user_module_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- User Content Progress: Users can view/edit their own
DROP POLICY IF EXISTS "Users can view own content progress" ON public.user_content_progress;
CREATE POLICY "Users can view own content progress"
  ON public.user_content_progress FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own content progress" ON public.user_content_progress;
CREATE POLICY "Users can insert own content progress"
  ON public.user_content_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own content progress" ON public.user_content_progress;
CREATE POLICY "Users can update own content progress"
  ON public.user_content_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Admins can view all progress
DROP POLICY IF EXISTS "Admins can view all section progress" ON public.user_section_progress;
CREATE POLICY "Admins can view all section progress"
  ON public.user_section_progress FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Admins can view all module progress" ON public.user_module_progress;
CREATE POLICY "Admins can view all module progress"
  ON public.user_module_progress FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Admins can view all content progress" ON public.user_content_progress;
CREATE POLICY "Admins can view all content progress"
  ON public.user_content_progress FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================================================
-- 8. CREATE TRIGGERS FOR AUTOMATIC PROGRESS UPDATES
-- ============================================================================

-- Function to update module progress when content progress changes
CREATE OR REPLACE FUNCTION public.update_module_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or insert module progress
  INSERT INTO public.user_module_progress (
    user_id,
    module_id,
    total_items,
    completed_items,
    progress_percent,
    last_accessed_at,
    updated_at
  )
  SELECT
    NEW.user_id,
    ci.module_id,
    COUNT(*) as total_items,
    COUNT(*) FILTER (WHERE ucp.completed = true) as completed_items,
    CASE 
      WHEN COUNT(*) > 0 THEN ROUND((COUNT(*) FILTER (WHERE ucp.completed = true)::DECIMAL / COUNT(*)) * 100)
      ELSE 0
    END as progress_percent,
    NOW(),
    NOW()
  FROM public.content_items ci
  LEFT JOIN public.user_content_progress ucp 
    ON ucp.content_item_id = ci.id 
    AND ucp.user_id = NEW.user_id
  WHERE ci.module_id = (
    SELECT module_id FROM public.content_items WHERE id = NEW.content_item_id
  )
  GROUP BY ci.module_id
  ON CONFLICT (user_id, module_id) DO UPDATE SET
    total_items = EXCLUDED.total_items,
    completed_items = EXCLUDED.completed_items,
    progress_percent = EXCLUDED.progress_percent,
    last_accessed_at = EXCLUDED.last_accessed_at,
    updated_at = EXCLUDED.updated_at;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for module progress updates
DROP TRIGGER IF EXISTS trg_update_module_progress ON public.user_content_progress;
CREATE TRIGGER trg_update_module_progress
  AFTER INSERT OR UPDATE ON public.user_content_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_module_progress();

-- Function to update section progress when module progress changes
CREATE OR REPLACE FUNCTION public.update_section_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or insert section progress
  INSERT INTO public.user_section_progress (
    user_id,
    section_id,
    total_modules,
    completed_modules,
    progress_percent,
    last_accessed_at,
    updated_at
  )
  SELECT
    NEW.user_id,
    m.section_id,
    COUNT(*) as total_modules,
    COUNT(*) FILTER (WHERE ump.progress_percent = 100) as completed_modules,
    CASE 
      WHEN COUNT(*) > 0 THEN ROUND(AVG(ump.progress_percent))
      ELSE 0
    END as progress_percent,
    NOW(),
    NOW()
  FROM public.modules m
  LEFT JOIN public.user_module_progress ump 
    ON ump.module_id = m.id 
    AND ump.user_id = NEW.user_id
  WHERE m.section_id = (
    SELECT section_id FROM public.modules WHERE id = NEW.module_id
  )
  GROUP BY m.section_id
  ON CONFLICT (user_id, section_id) DO UPDATE SET
    total_modules = EXCLUDED.total_modules,
    completed_modules = EXCLUDED.completed_modules,
    progress_percent = EXCLUDED.progress_percent,
    last_accessed_at = EXCLUDED.last_accessed_at,
    updated_at = EXCLUDED.updated_at;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for section progress updates
DROP TRIGGER IF EXISTS trg_update_section_progress ON public.user_module_progress;
CREATE TRIGGER trg_update_section_progress
  AFTER INSERT OR UPDATE ON public.user_module_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_section_progress();

-- ============================================================================
-- 9. SEED INITIAL DATA
-- ============================================================================

-- Insert sections
INSERT INTO public.sections (slug, title, description, icon, order_index, is_published) VALUES
  ('onboarding', 'Onboarding', 'Get started with TeslaMR', '👋', 1, false),
  ('phase1', 'Phase 1', 'Foundation skills for MRI readiness', '1️⃣', 2, true),
  ('phase2', 'Phase 2', 'Advanced MRI concepts and techniques', '2️⃣', 3, false),
  ('clinical', 'Clinical Site Readiness', 'Prepare for your clinical rotations', '🏥', 4, false),
  ('registry', 'Registry Prep', 'Prepare for ARRT registry exam', '📜', 5, false)
ON CONFLICT (slug) DO NOTHING;

-- Insert Medical Terminology module under Phase 1
INSERT INTO public.modules (section_id, slug, title, description, icon, order_index, is_published)
SELECT 
  s.id,
  'medical-terminology',
  'Medical Terminology',
  'Master the language of medicine with prefixes, suffixes, root words, abbreviations, and patient positioning terminology.',
  '📚',
  1,
  true
FROM public.sections s
WHERE s.slug = 'phase1'
ON CONFLICT (section_id, slug) DO NOTHING;

-- Insert quiz content items for Medical Terminology
INSERT INTO public.content_items (module_id, slug, title, description, type, icon, order_index, is_published)
SELECT 
  m.id,
  'prefixes',
  'Prefixes',
  'Learn common medical prefixes and their meanings',
  'quiz',
  '🔤',
  1,
  true
FROM public.modules m
JOIN public.sections s ON s.id = m.section_id
WHERE s.slug = 'phase1' AND m.slug = 'medical-terminology'
ON CONFLICT (module_id, slug) DO NOTHING;

INSERT INTO public.content_items (module_id, slug, title, description, type, icon, order_index, is_published)
SELECT 
  m.id,
  'suffixes',
  'Suffixes',
  'Master medical suffixes and their meanings',
  'quiz',
  '📝',
  2,
  true
FROM public.modules m
JOIN public.sections s ON s.id = m.section_id
WHERE s.slug = 'phase1' AND m.slug = 'medical-terminology'
ON CONFLICT (module_id, slug) DO NOTHING;

INSERT INTO public.content_items (module_id, slug, title, description, type, icon, order_index, is_published)
SELECT 
  m.id,
  'roots',
  'Root Words',
  'Understand medical root words and their origins',
  'quiz',
  '🌿',
  3,
  true
FROM public.modules m
JOIN public.sections s ON s.id = m.section_id
WHERE s.slug = 'phase1' AND m.slug = 'medical-terminology'
ON CONFLICT (module_id, slug) DO NOTHING;

INSERT INTO public.content_items (module_id, slug, title, description, type, icon, order_index, is_published)
SELECT 
  m.id,
  'abbreviations',
  'Abbreviations',
  'Learn essential medical abbreviations',
  'quiz',
  '📋',
  4,
  true
FROM public.modules m
JOIN public.sections s ON s.id = m.section_id
WHERE s.slug = 'phase1' AND m.slug = 'medical-terminology'
ON CONFLICT (module_id, slug) DO NOTHING;

INSERT INTO public.content_items (module_id, slug, title, description, type, icon, order_index, is_published)
SELECT 
  m.id,
  'positioning',
  'Patient Positioning',
  'Master patient positioning terminology for MRI',
  'quiz',
  '🧍',
  5,
  true
FROM public.modules m
JOIN public.sections s ON s.id = m.section_id
WHERE s.slug = 'phase1' AND m.slug = 'medical-terminology'
ON CONFLICT (module_id, slug) DO NOTHING;

-- ============================================================================
-- 10. LINK EXISTING QUIZ QUESTIONS TO NEW CONTENT ITEMS
-- ============================================================================

-- Update quiz_questions to reference content_items based on section_key
UPDATE public.quiz_questions qq
SET content_item_id = ci.id
FROM public.content_items ci
JOIN public.modules m ON m.id = ci.module_id
JOIN public.sections s ON s.id = m.section_id
WHERE s.slug = 'phase1' 
  AND m.slug = 'medical-terminology'
  AND ci.slug = qq.section_key
  AND qq.content_item_id IS NULL;

COMMENT ON TABLE public.sections IS 'Top-level organizational units (Onboarding, Phase 1, Phase 2, etc.)';
COMMENT ON TABLE public.modules IS 'Content modules within sections (Medical Terminology, etc.)';
COMMENT ON TABLE public.content_items IS 'Individual content pieces (quizzes, videos, readings, etc.)';
COMMENT ON TABLE public.user_section_progress IS 'Tracks user progress at the section level';
COMMENT ON TABLE public.user_module_progress IS 'Tracks user progress at the module level';
COMMENT ON TABLE public.user_content_progress IS 'Tracks user progress for individual content items';

