-- Add fundamentals quiz as a content item in Medical Terminology module
-- This needs to be order_index = 1 (after the video which is 0)

-- First, shift all existing quiz content items down by 1
UPDATE public.content_items
SET order_index = order_index + 1
WHERE module_id = (SELECT id FROM public.modules WHERE slug = 'medical-terminology')
AND type = 'quiz'
AND slug IN ('prefixes', 'suffixes', 'roots', 'abbreviations', 'positioning');

-- Insert the fundamentals quiz content item
INSERT INTO public.content_items (
  module_id,
  slug,
  title,
  description,
  icon,
  type,
  order_index,
  is_published,
  metadata,
  created_at,
  updated_at
)
SELECT
  m.id,
  'fundamentals',
  'Medical Terminology Fundamentals',
  'Core concepts and building blocks of medical terminology',
  '🏗️',
  'quiz',
  1, -- Right after the video (order_index 0)
  true,
  jsonb_build_object(
    'questionCount', 20,
    'passingScore', 80
  ),
  NOW(),
  NOW()
FROM public.modules m
WHERE m.slug = 'medical-terminology'
ON CONFLICT (module_id, slug) DO NOTHING;

-- Link the quiz_questions to this content item
UPDATE public.quiz_questions qq
SET content_item_id = ci.id
FROM public.content_items ci
JOIN public.modules m ON m.id = ci.module_id
WHERE m.slug = 'medical-terminology'
  AND ci.slug = 'fundamentals'
  AND qq.section_key = 'fundamentals'
  AND qq.content_item_id IS NULL;

