-- Add image_url column to quiz_questions table
ALTER TABLE public.quiz_questions
ADD COLUMN image_url TEXT;

COMMENT ON COLUMN quiz_questions.image_url IS 'Optional URL to an image (diagram, scan, anatomical reference, etc.) to display with the question';

