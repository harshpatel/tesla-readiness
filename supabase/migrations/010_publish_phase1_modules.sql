-- Publish all Phase 1 modules
UPDATE public.modules
SET 
  is_published = true,
  updated_at = NOW()
WHERE section_id = (SELECT id FROM public.sections WHERE slug = 'phase1');

