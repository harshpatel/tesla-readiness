-- Add is_locked flag to modules
ALTER TABLE public.modules 
ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN public.modules.is_locked IS 'If true, module is published but locked (visible but not accessible)';

-- Publish all Phase 1 modules
UPDATE public.modules 
SET is_published = true 
WHERE section_id = (SELECT id FROM public.sections WHERE slug = 'phase1');

-- Lock modules from "General Anatomy & Physiology" onwards
UPDATE public.modules 
SET is_locked = true 
WHERE section_id = (SELECT id FROM public.sections WHERE slug = 'phase1')
AND order_index >= 3;

