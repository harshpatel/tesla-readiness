-- Add video content item for Medical Terminology module
INSERT INTO public.content_items (
  module_id,
  type,
  slug,
  title,
  description,
  icon,
  order_index,
  is_published,
  metadata,
  created_at,
  updated_at
)
SELECT
  m.id,
  'video',
  'medical-terminology-intro',
  'Introduction to Medical Terminology',
  'Learn the fundamentals of medical terminology and how it applies to MRI',
  '📹',
  0, -- Order 0 to place it first
  true,
  jsonb_build_object('videoUrl', 'https://cffhrzzfhyotkbuuoayc.supabase.co/storage/v1/object/public/videos/Medical%20Terminology.mp4'),
  NOW(),
  NOW()
FROM public.modules m
WHERE m.slug = 'medical-terminology'
ON CONFLICT (module_id, slug) DO UPDATE
SET
  metadata = jsonb_set(
    COALESCE(content_items.metadata, '{}'::jsonb),
    '{videoUrl}',
    '"https://cffhrzzfhyotkbuuoayc.supabase.co/storage/v1/object/public/videos/Medical%20Terminology.mp4"'::jsonb
  ),
  updated_at = NOW();

-- Update order_index for existing quiz content items to make room for the video
UPDATE public.content_items
SET order_index = order_index + 1
WHERE module_id = (SELECT id FROM public.modules WHERE slug = 'medical-terminology')
AND type = 'quiz'
AND slug IN ('prefixes', 'suffixes', 'roots', 'abbreviations', 'positioning');

