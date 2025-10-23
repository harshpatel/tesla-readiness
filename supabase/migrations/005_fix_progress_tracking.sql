-- Add last_activity_date and current_streak to profiles for streak tracking
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS last_activity_date TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0;

-- Drop the existing trigger and function
DROP TRIGGER IF EXISTS trg_update_user_section_progress ON public.user_quiz_progress;
DROP FUNCTION IF EXISTS public.update_user_section_progress();

-- Create improved function to update user_section_progress
CREATE OR REPLACE FUNCTION public.update_user_section_progress()
RETURNS TRIGGER AS $$
DECLARE
  v_total_questions INTEGER;
  v_mastered_questions INTEGER;
  v_section_key TEXT;
BEGIN
  -- Get section_key from the trigger
  v_section_key := NEW.section_key;

  -- Count TOTAL questions in this section (from quiz_questions, not just attempted)
  SELECT COUNT(*) INTO v_total_questions 
  FROM public.quiz_questions 
  WHERE section_key = v_section_key;

  -- Count mastered questions for this user in this section
  SELECT COUNT(*) INTO v_mastered_questions 
  FROM public.user_quiz_progress 
  WHERE user_id = NEW.user_id 
    AND section_key = v_section_key 
    AND mastered = TRUE;

  -- Insert or update user_section_progress
  INSERT INTO public.user_section_progress (
    user_id, 
    section_key, 
    total_questions, 
    mastered_questions, 
    completed, 
    updated_at
  )
  VALUES (
    NEW.user_id, 
    v_section_key, 
    v_total_questions, 
    v_mastered_questions, 
    (v_mastered_questions = v_total_questions AND v_total_questions > 0), 
    NOW()
  )
  ON CONFLICT (user_id, section_key) DO UPDATE SET
    total_questions = v_total_questions,
    mastered_questions = v_mastered_questions,
    completed = (v_mastered_questions = v_total_questions AND v_total_questions > 0),
    updated_at = NOW();

  -- Update user's last_activity_date and streak in profiles
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

-- Recreate the trigger
CREATE TRIGGER trg_update_user_section_progress
AFTER INSERT OR UPDATE ON public.user_quiz_progress
FOR EACH ROW EXECUTE FUNCTION public.update_user_section_progress();

-- Recalculate all existing user_section_progress records
-- This will fix any existing incorrect data
DO $$
DECLARE
  v_user_record RECORD;
  v_total_questions INTEGER;
  v_mastered_questions INTEGER;
BEGIN
  -- For each user and section combination that exists in user_section_progress
  FOR v_user_record IN 
    SELECT DISTINCT user_id, section_key 
    FROM public.user_section_progress
  LOOP
    -- Get total questions in this section (using section_key)
    SELECT COUNT(*) INTO v_total_questions
    FROM public.quiz_questions
    WHERE section_key = v_user_record.section_key;

    -- Get mastered questions for this user in this section
    SELECT COUNT(*) INTO v_mastered_questions
    FROM public.user_quiz_progress
    WHERE user_id = v_user_record.user_id
      AND section_key = v_user_record.section_key
      AND mastered = TRUE;

    -- Update the record
    UPDATE public.user_section_progress
    SET 
      total_questions = v_total_questions,
      mastered_questions = v_mastered_questions,
      completed = (v_mastered_questions = v_total_questions AND v_total_questions > 0),
      updated_at = NOW()
    WHERE user_id = v_user_record.user_id
      AND section_key = v_user_record.section_key;
  END LOOP;
END $$;
