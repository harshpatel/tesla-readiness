-- Remove hint and explanation columns from quiz_questions table
-- These will now be stored in JSON files for easier editing

ALTER TABLE public.quiz_questions
DROP COLUMN IF EXISTS hint,
DROP COLUMN IF EXISTS explanation;

COMMENT ON TABLE quiz_questions IS 'Quiz questions with answers and correct answer. Hints and explanations are stored in JSON files for easier editing.';

