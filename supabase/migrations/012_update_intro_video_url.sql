-- Update Introduction to MRI video URL
UPDATE public.content_items
SET 
  metadata = jsonb_set(
    metadata,
    '{videoUrl}',
    '"https://www.youtube.com/watch?v=XsM4KJBb2FU"'
  ),
  updated_at = NOW()
WHERE slug = 'introduction'
AND type = 'video'
AND module_id = (
  SELECT id FROM public.modules 
  WHERE slug = 'introduction-to-mri' 
  AND section_id = (SELECT id FROM public.sections WHERE slug = 'phase1')
);

