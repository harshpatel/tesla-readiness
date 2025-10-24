-- Add content items to Introduction to MRI module
DO $$
DECLARE
  intro_module_id UUID;
BEGIN
  -- Get Introduction to MRI module ID
  SELECT id INTO intro_module_id 
  FROM public.modules 
  WHERE slug = 'introduction-to-mri' 
  AND section_id = (SELECT id FROM public.sections WHERE slug = 'phase1');
  
  IF intro_module_id IS NULL THEN
    RAISE EXCEPTION 'Introduction to MRI module not found';
  END IF;

  -- Content Item 1: Introduction Video
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
  ) VALUES (
    intro_module_id,
    'introduction',
    'Introduction to MRI',
    'Welcome video introducing MRI technology and the program',
    '📹',
    'video',
    1,
    true,
    jsonb_build_object(
      'videoUrl', '',  -- Will be updated with actual YouTube URL
      'duration', '10:00'
    ),
    NOW(),
    NOW()
  ) ON CONFLICT (module_id, slug) DO NOTHING;

  -- Content Item 2: Code of Conduct Document
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
  ) VALUES (
    intro_module_id,
    'code-of-conduct',
    'Code of Conduct',
    'Review and acknowledge the Tesla MRI Code of Conduct',
    '📄',
    'document',
    2,
    true,
    jsonb_build_object(
      'documentUrl', 'https://docs.google.com/document/d/1F72i9MDraPSS5m8KDioDH1hHheJum6PLxnft3KO_L8s/edit?tab=t.0',
      'checkboxes', jsonb_build_array(
        'I will act professionally and respectfully with everyone in the Tesla MRI community.',
        'I will complete my own work honestly and won''t cheat, lie, or use outside help on tests or assignments.',
        'I will be on time, responsive, and dependable in all classes and clinical settings.',
        'I won''t use drugs, alcohol, or anything illegal during program hours or at clinical sites.',
        'I will follow all Tesla MRI and clinical site rules, including dress code, attendance, and safety.',
        'I won''t post, share, or say anything hurtful or unprofessional about others—online or in person.',
        'I will listen to feedback, own my mistakes, and keep improving.',
        'I won''t harass, bully, or make anyone feel unwelcome, and I''ll report it if I see it.',
        'I will protect people''s privacy and keep personal or patient information confidential.',
        'I understand that breaking these rules can lead to discipline or dismissal, and I agree to uphold them at all times.'
      )
    ),
    NOW(),
    NOW()
  ) ON CONFLICT (module_id, slug) DO NOTHING;

  -- Content Item 3: Introduction Quiz
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
  ) VALUES (
    intro_module_id,
    'introduction-quiz',
    'Introduction to MRI Quiz',
    'Test your knowledge of MRI fundamentals',
    '📝',
    'quiz',
    3,
    true,
    jsonb_build_object(
      'questionCount', 20,
      'passingScore', 80
    ),
    NOW(),
    NOW()
  ) ON CONFLICT (module_id, slug) DO NOTHING;

END $$;

