-- Fix section progress to show total questions in section, not just attempted questions
-- Run this in your Supabase SQL Editor

-- Drop old trigger and function
DROP TRIGGER IF EXISTS update_section_progress_trigger ON public.user_quiz_progress;
DROP FUNCTION IF EXISTS update_section_progress_summary();

-- Drop the newer trigger (in case it exists)
DROP TRIGGER IF EXISTS trg_update_user_section_progress ON public.user_quiz_progress;
DROP FUNCTION IF EXISTS public.update_user_section_progress();

-- Create the correct function
CREATE OR REPLACE FUNCTION public.update_user_section_progress()
RETURNS TRIGGER AS $$
DECLARE
  v_total_questions INTEGER;
  v_mastered_questions INTEGER;
  v_questions_for_review INTEGER;
  v_section_key TEXT;
  v_section_id UUID;
BEGIN
  -- Get section_key and section_id
  v_section_key := NEW.section_key;
  SELECT id INTO v_section_id FROM public.quiz_sections WHERE key = v_section_key;

  -- Count TOTAL questions in this section (not just attempted)
  SELECT COUNT(*) INTO v_total_questions 
  FROM public.quiz_questions 
  WHERE section_key = v_section_key;

  -- Count mastered questions for this user in this section
  SELECT COUNT(*) INTO v_mastered_questions 
  FROM public.user_quiz_progress 
  WHERE user_id = NEW.user_id 
    AND section_key = v_section_key 
    AND mastered = TRUE;

  -- Count questions needing review (attempted but not mastered)
  SELECT COUNT(*) INTO v_questions_for_review 
  FROM public.user_quiz_progress 
  WHERE user_id = NEW.user_id 
    AND section_key = v_section_key 
    AND mastered = FALSE;

  -- Insert or update user_section_progress
  INSERT INTO public.user_section_progress (
    user_id, 
    section_id,
    section_key, 
    total_questions, 
    mastered_questions,
    questions_for_review,
    completed,
    last_activity_at,
    updated_at
  )
  VALUES (
    NEW.user_id,
    v_section_id,
    v_section_key, 
    v_total_questions, 
    v_mastered_questions,
    v_questions_for_review,
    (v_mastered_questions = v_total_questions AND v_total_questions > 0),
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id, section_id) DO UPDATE SET
    total_questions = v_total_questions,
    mastered_questions = v_mastered_questions,
    questions_for_review = v_questions_for_review,
    completed = (v_mastered_questions = v_total_questions AND v_total_questions > 0),
    last_activity_at = NOW(),
    updated_at = NOW();

  -- Update user's last_activity_date and streak
  UPDATE public.profiles
  SET 
    last_activity_date = NOW(),
    current_streak = CASE
      -- If last activity was today, keep streak
      WHEN DATE(last_activity_date) = CURRENT_DATE THEN current_streak
      -- If last activity was yesterday, increment streak
      WHEN DATE(last_activity_date) = CURRENT_DATE - INTERVAL '1 day' THEN current_streak + 1
      -- If no previous activity or gap > 1 day, start new streak at 1
      ELSE 1
    END,
    updated_at = NOW()
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER trg_update_user_section_progress
AFTER INSERT OR UPDATE ON public.user_quiz_progress
FOR EACH ROW EXECUTE FUNCTION public.update_user_section_progress();

-- Recalculate all existing user_section_progress records
DO $$
DECLARE
  v_user_record RECORD;
  v_total_questions INTEGER;
  v_mastered_questions INTEGER;
  v_questions_for_review INTEGER;
  v_section_id UUID;
BEGIN
  -- For each user and section combination
  FOR v_user_record IN 
    SELECT DISTINCT user_id, section_key 
    FROM public.user_quiz_progress
  LOOP
    -- Get section_id
    SELECT id INTO v_section_id FROM public.quiz_sections WHERE key = v_user_record.section_key;

    -- Get total questions in this section (from quiz_questions table)
    SELECT COUNT(*) INTO v_total_questions
    FROM public.quiz_questions
    WHERE section_key = v_user_record.section_key;

    -- Get mastered questions
    SELECT COUNT(*) INTO v_mastered_questions
    FROM public.user_quiz_progress
    WHERE user_id = v_user_record.user_id
      AND section_key = v_user_record.section_key
      AND mastered = TRUE;

    -- Get questions for review
    SELECT COUNT(*) INTO v_questions_for_review
    FROM public.user_quiz_progress
    WHERE user_id = v_user_record.user_id
      AND section_key = v_user_record.section_key
      AND mastered = FALSE;

    -- Update or insert the record
    INSERT INTO public.user_section_progress (
      user_id,
      section_id,
      section_key,
      total_questions,
      mastered_questions,
      questions_for_review,
      completed,
      last_activity_at,
      updated_at
    )
    VALUES (
      v_user_record.user_id,
      v_section_id,
      v_user_record.section_key,
      v_total_questions,
      v_mastered_questions,
      v_questions_for_review,
      (v_mastered_questions = v_total_questions AND v_total_questions > 0),
      NOW(),
      NOW()
    )
    ON CONFLICT (user_id, section_id) DO UPDATE SET
      total_questions = v_total_questions,
      mastered_questions = v_mastered_questions,
      questions_for_review = v_questions_for_review,
      completed = (v_mastered_questions = v_total_questions AND v_total_questions > 0),
      updated_at = NOW();
  END LOOP;
END $$;

