-- Fix duplicate "fundamentals" slug for Anatomy & Physiology quiz
-- Change it to "anatomy-fundamentals" to match our file naming

DO $$
DECLARE
  v_module_id UUID;
  v_old_content_id UUID;
BEGIN
  -- Get the General Anatomy & Physiology module ID
  SELECT id INTO v_module_id 
  FROM modules 
  WHERE slug = 'general-anatomy-physiology';

  -- Get the content_item_id for the old "fundamentals" quiz
  SELECT id INTO v_old_content_id
  FROM content_items
  WHERE module_id = v_module_id 
    AND slug = 'fundamentals'
    AND type = 'quiz';

  -- First, insert/update quiz_sections to avoid FK constraint violation
  INSERT INTO quiz_sections (key, title, description, icon, order_index)
  VALUES ('anatomy-fundamentals', 'Anatomy & Physiology Fundamentals', 'Test your knowledge on the core principles of human anatomy and physiology.', '🫀', 7)
  ON CONFLICT (key) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    updated_at = NOW();

  -- Update the slug to be unique
  UPDATE content_items
  SET 
    slug = 'anatomy-fundamentals',
    updated_at = NOW()
  WHERE id = v_old_content_id;

  -- Update all quiz_questions to use new section_key
  UPDATE quiz_questions
  SET 
    section_key = 'anatomy-fundamentals',
    updated_at = NOW()
  WHERE content_item_id = v_old_content_id;

  RAISE NOTICE 'Updated Anatomy & Physiology quiz slug to "anatomy-fundamentals"';
END $$;

