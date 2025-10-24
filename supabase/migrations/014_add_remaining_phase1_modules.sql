-- Add remaining Phase 1 modules (03-14)
-- These were supposed to be added in migration 009 but weren't

DO $$
DECLARE
  phase1_id UUID;
BEGIN
  -- Get Phase 1 section ID
  SELECT id INTO phase1_id FROM public.sections WHERE slug = 'phase1';
  
  IF phase1_id IS NULL THEN
    RAISE EXCEPTION 'Phase 1 section not found';
  END IF;

  -- Delete any existing modules with these slugs to avoid conflicts
  DELETE FROM public.modules 
  WHERE section_id = phase1_id 
  AND slug IN (
    'general-anatomy-physiology',
    'subatomic-principles-mri',
    'instrumentation-magnets',
    'mri-safety-magnetic-fields',
    'mri-safety-rf-gradient',
    'mri-procedures-neuro',
    'mri-procedures-body',
    'mri-procedures-msk',
    'patient-care-management',
    'cross-sectional-anatomy-neuro',
    'image-contrast-mechanisms',
    'phase1-final-exam'
  );

  -- Module 03: General Anatomy & Physiology
  INSERT INTO public.modules (section_id, slug, title, description, icon, order_index, is_published, created_at, updated_at)
  VALUES (phase1_id, 'general-anatomy-physiology', 'General Anatomy & Physiology', 'Essential anatomy and physiology concepts for MRI technologists', '🫀', 3, false, NOW(), NOW());

  -- Module 04: Subatomic Principles of MRI
  INSERT INTO public.modules (section_id, slug, title, description, icon, order_index, is_published, created_at, updated_at)
  VALUES (phase1_id, 'subatomic-principles-mri', 'Subatomic Principles of MRI', 'Understanding the physics behind magnetic resonance imaging', '⚛️', 4, false, NOW(), NOW());

  -- Module 05: Instrumentation I: Magnets
  INSERT INTO public.modules (section_id, slug, title, description, icon, order_index, is_published, created_at, updated_at)
  VALUES (phase1_id, 'instrumentation-magnets', 'Instrumentation I: Magnets', 'MRI magnet types, characteristics, and functionality', '🧲', 5, false, NOW(), NOW());

  -- Module 06: MRI Safety I: Magnetic Fields
  INSERT INTO public.modules (section_id, slug, title, description, icon, order_index, is_published, created_at, updated_at)
  VALUES (phase1_id, 'mri-safety-magnetic-fields', 'MRI Safety I: Magnetic Fields', 'Safety protocols and hazards related to static magnetic fields', '⚠️', 6, false, NOW(), NOW());

  -- Module 07: MRI Safety II: RF & Gradient Fields
  INSERT INTO public.modules (section_id, slug, title, description, icon, order_index, is_published, created_at, updated_at)
  VALUES (phase1_id, 'mri-safety-rf-gradient', 'MRI Safety II: RF & Gradient Fields', 'Safety considerations for radiofrequency and gradient fields', '📡', 7, false, NOW(), NOW());

  -- Module 08: MRI Procedures & Set Up I: Neuro
  INSERT INTO public.modules (section_id, slug, title, description, icon, order_index, is_published, created_at, updated_at)
  VALUES (phase1_id, 'mri-procedures-neuro', 'MRI Procedures & Set Up I: Neuro', 'Neurological MRI procedures and patient setup', '🧠', 8, false, NOW(), NOW());

  -- Module 09: MRI Procedures & Set Up II: Body
  INSERT INTO public.modules (section_id, slug, title, description, icon, order_index, is_published, created_at, updated_at)
  VALUES (phase1_id, 'mri-procedures-body', 'MRI Procedures & Set Up II: Body', 'Body MRI procedures including chest, abdomen, and pelvis', '🫁', 9, false, NOW(), NOW());

  -- Module 10: MRI Procedures & Set Up III: MSK
  INSERT INTO public.modules (section_id, slug, title, description, icon, order_index, is_published, created_at, updated_at)
  VALUES (phase1_id, 'mri-procedures-msk', 'MRI Procedures & Set Up III: MSK', 'Musculoskeletal MRI procedures and positioning', '🦴', 10, false, NOW(), NOW());

  -- Module 11: Patient Care and Management
  INSERT INTO public.modules (section_id, slug, title, description, icon, order_index, is_published, created_at, updated_at)
  VALUES (phase1_id, 'patient-care-management', 'Patient Care and Management', 'Patient communication, care, and management in MRI', '👥', 11, false, NOW(), NOW());

  -- Module 12: Cross Sectional Anatomy I: Neuro
  INSERT INTO public.modules (section_id, slug, title, description, icon, order_index, is_published, created_at, updated_at)
  VALUES (phase1_id, 'cross-sectional-anatomy-neuro', 'Cross Sectional Anatomy I: Neuro', 'Neurological cross-sectional anatomy for MRI interpretation', '🔬', 12, false, NOW(), NOW());

  -- Module 13: Image Contrast Mechanisms
  INSERT INTO public.modules (section_id, slug, title, description, icon, order_index, is_published, created_at, updated_at)
  VALUES (phase1_id, 'image-contrast-mechanisms', 'Image Contrast Mechanisms', 'Understanding T1, T2, and other contrast mechanisms in MRI', '🎨', 13, false, NOW(), NOW());

  -- Module 14: Phase 1 Final Exam
  INSERT INTO public.modules (section_id, slug, title, description, icon, order_index, is_published, created_at, updated_at)
  VALUES (phase1_id, 'phase1-final-exam', 'Phase 1 Final Exam', 'Comprehensive exam covering all Phase 1 material', '📝', 14, false, NOW(), NOW());

END $$;

