-- Unpublish all modules from "General Anatomy & Physiology" onwards
-- Keep only "Introduction to MRI" (order_index 1) and "Medical Terminology" (order_index 2) published

UPDATE public.modules
SET 
  is_published = false,
  updated_at = NOW()
WHERE section_id = (SELECT id FROM public.sections WHERE slug = 'phase1')
AND order_index >= 3;  -- All modules with order_index 3 and above

