-- Add fundamentals section to quiz_sections table
INSERT INTO public.quiz_sections (key, title, description, icon, order_index)
VALUES (
  'fundamentals',
  'Medical Terminology Fundamentals',
  'Core concepts and building blocks of medical terminology',
  '🏗️',
  0 -- First section, before all others
)
ON CONFLICT (key) DO NOTHING;

-- Update order_index for other sections to make room
UPDATE public.quiz_sections
SET order_index = order_index + 1
WHERE key IN ('prefixes', 'suffixes', 'roots', 'abbreviations', 'positioning');

