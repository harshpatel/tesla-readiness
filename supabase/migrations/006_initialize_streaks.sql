-- Initialize current_streak for users who have quiz activity
-- This sets streak to 1 for anyone who has done quiz activity

UPDATE public.profiles
SET 
  current_streak = CASE
    -- If they have activity today, set to 1
    WHEN EXISTS (
      SELECT 1 FROM public.user_quiz_progress 
      WHERE user_id = profiles.id 
      AND DATE(last_attempt_date) = CURRENT_DATE
    ) THEN 1
    -- Otherwise leave at 0
    ELSE 0
  END,
  last_activity_date = CASE
    -- Set last_activity_date to their most recent quiz activity
    WHEN EXISTS (
      SELECT 1 FROM public.user_quiz_progress WHERE user_id = profiles.id
    ) THEN (
      SELECT MAX(last_attempt_date) FROM public.user_quiz_progress WHERE user_id = profiles.id
    )
    ELSE last_activity_date
  END
WHERE current_streak IS NULL OR current_streak = 0;

