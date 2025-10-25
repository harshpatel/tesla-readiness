-- Add numerical prefixes to module titles
-- Format: "01 - Module Name", "02 - Module Name", etc.

DO $$
DECLARE
  phase1_id UUID;
BEGIN
  -- Get Phase 1 section ID
  SELECT id INTO phase1_id FROM public.sections WHERE slug = 'phase1';
  
  IF phase1_id IS NULL THEN
    RAISE EXCEPTION 'Phase 1 section not found';
  END IF;

  -- Update all module titles with numerical prefixes
  -- Based on their order_index
  
  -- Module 01: Introduction to MRI (order_index = 1)
  UPDATE public.modules 
  SET title = '01 - Introduction to MRI', updated_at = NOW()
  WHERE section_id = phase1_id AND slug = 'introduction-to-mri';

  -- Module 02: Medical Terminology (order_index = 2)
  UPDATE public.modules 
  SET title = '02 - Medical Terminology', updated_at = NOW()
  WHERE section_id = phase1_id AND slug = 'medical-terminology';

  -- Module 03: General Anatomy & Physiology (order_index = 3)
  UPDATE public.modules 
  SET title = '03 - General Anatomy & Physiology', updated_at = NOW()
  WHERE section_id = phase1_id AND slug = 'general-anatomy-physiology';

  -- Module 04: Subatomic Principles of MRI (order_index = 4)
  UPDATE public.modules 
  SET title = '04 - Subatomic Principles of MRI', updated_at = NOW()
  WHERE section_id = phase1_id AND slug = 'subatomic-principles-mri';

  -- Module 05: Instrumentation I: Magnets (order_index = 5)
  UPDATE public.modules 
  SET title = '05 - Instrumentation I: Magnets', updated_at = NOW()
  WHERE section_id = phase1_id AND slug = 'instrumentation-magnets';

  -- Module 06: MRI Safety I: Magnetic Fields (order_index = 6)
  UPDATE public.modules 
  SET title = '06 - MRI Safety I: Magnetic Fields', updated_at = NOW()
  WHERE section_id = phase1_id AND slug = 'mri-safety-magnetic-fields';

  -- Module 07: MRI Safety II: RF & Gradient Safety (order_index = 7)
  UPDATE public.modules 
  SET title = '07 - MRI Safety II: RF & Gradient Safety', updated_at = NOW()
  WHERE section_id = phase1_id AND slug = 'mri-safety-rf-gradient';

  -- Module 08: MRI Procedures & Set Up I: Neuro (order_index = 8)
  UPDATE public.modules 
  SET title = '08 - MRI Procedures & Set Up I: Neuro', updated_at = NOW()
  WHERE section_id = phase1_id AND slug = 'mri-procedures-neuro';

  -- Module 09: MRI Procedures & Set Up II: Body (order_index = 9)
  UPDATE public.modules 
  SET title = '09 - MRI Procedures & Set Up II: Body', updated_at = NOW()
  WHERE section_id = phase1_id AND slug = 'mri-procedures-body';

  -- Module 10: MRI Procedures & Set Up III: MSK (order_index = 10)
  UPDATE public.modules 
  SET title = '10 - MRI Procedures & Set Up III: MSK', updated_at = NOW()
  WHERE section_id = phase1_id AND slug = 'mri-procedures-msk';

  -- Module 11: Patient Care and Management (order_index = 11)
  UPDATE public.modules 
  SET title = '11 - Patient Care and Management', updated_at = NOW()
  WHERE section_id = phase1_id AND slug = 'patient-care-management';

  -- Module 12: Cross Sectional Anatomy I: Neuro (order_index = 12)
  UPDATE public.modules 
  SET title = '12 - Cross Sectional Anatomy I: Neuro', updated_at = NOW()
  WHERE section_id = phase1_id AND slug = 'cross-sectional-anatomy-neuro';

  -- Module 13: Image Contrast Mechanisms (order_index = 13)
  UPDATE public.modules 
  SET title = '13 - Image Contrast Mechanisms', updated_at = NOW()
  WHERE section_id = phase1_id AND slug = 'image-contrast-mechanisms';

  -- Module 14: Phase 1 Final Exam (order_index = 14)
  UPDATE public.modules 
  SET title = '14 - Phase 1 Final Exam', updated_at = NOW()
  WHERE section_id = phase1_id AND slug = 'phase1-final-exam';

END $$;

