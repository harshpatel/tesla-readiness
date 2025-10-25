-- Migration: Add Phase 1 Final Exam content
-- NO VIDEO - Quiz only with 57 comprehensive questions covering all Phase 1 topics

DO $$
DECLARE
  v_section_id UUID;
  v_module_id UUID;
  v_quiz_content_id UUID;
BEGIN
  -- Get section ID
  SELECT id INTO v_section_id FROM sections WHERE slug = 'phase1';
  
  -- Update existing module
  UPDATE modules
  SET
    title = '14 - Phase 1 Final Exam',
    description = 'Comprehensive final exam covering all Phase 1 topics: MRI systems, safety, anatomy, contrast mechanisms, and clinical procedures.',
    icon = '🎓',
    is_published = true,
    is_locked = false,
    updated_at = NOW()
  WHERE section_id = v_section_id AND slug = 'phase1-final-exam'
  RETURNING id INTO v_module_id;
  
  -- Get or insert quiz content (NO VIDEO for final exam)
  SELECT id INTO v_quiz_content_id FROM content_items 
  WHERE module_id = v_module_id AND slug = 'final-exam';
  
  IF v_quiz_content_id IS NULL THEN
    INSERT INTO content_items (module_id, slug, title, description, type, icon, order_index, metadata, is_published)
    VALUES (
      v_module_id, 
      'final-exam', 
      'Phase 1 Final Exam', 
      'Comprehensive assessment of all Phase 1 knowledge and skills.', 
      'quiz', 
      '📝', 
      1, 
      '{}', 
      true
    )
    RETURNING id INTO v_quiz_content_id;
  END IF;
  
  -- Insert or update quiz_sections
  INSERT INTO quiz_sections (key, title, description, icon, order_index)
  VALUES (
    'final-exam', 
    'Phase 1 Final Exam', 
    'Comprehensive exam covering MRI systems, safety, anatomy, and contrast', 
    '🎓', 
    19
  )
  ON CONFLICT (key) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    updated_at = NOW();
  
  -- Insert quiz questions (57 total - comprehensive final exam)
  INSERT INTO quiz_questions (
    content_item_id, question_id, section_key, question_type, 
    question_text, answers, correct_answer, points, order_index, image_url
  ) VALUES 
    -- Q1: MRI system performance
    (v_quiz_content_id, 'final-q1', 'final-exam', 'multiplechoice', 
    'MRI system performance and _____________ of an MRI system cannot be determined by looking at it.', 
    '{"A": "Noise level (dB)", "B": "Magnetic field strength", "C": "Software and hardware configuration", "D": "Pulse sequences"}', 'B', 1, 0, null),
    
    -- Q2: Radio transmitter/receiver
    (v_quiz_content_id, 'final-q2', 'final-exam', 'multiplechoice', 
    'In MRI, the human body and the MRI system act together as:', 
    '{"A": "A magnet", "B": "An acoustic transmitter", "C": "An x-ray receiver", "D": "A radio receiver transmitter"}', 'D', 1, 1, null),
    
    -- Q3: MRI depends on hydrogen
    (v_quiz_content_id, 'final-q3', 'final-exam', 'multiplechoice', 
    'MRI of the human body depends solely upon:', 
    '{"A": "The magnetic field strength", "B": "Sound waves", "C": "Iron molecules", "D": "Water-bond hydrogen protons"}', 'D', 1, 2, null),
    
    -- Q4: Resonant frequency
    (v_quiz_content_id, 'final-q4', 'final-exam', 'multiplechoice', 
    'In MRI, a frequency that drives the energy transfer from the RF transmitter to the body is referred to as :', 
    '{"A": "Resonant Frequency", "B": "Resonant C-tuning Frequency", "C": "Resonant phase", "D": "Resonant proton"}', 'A', 1, 3, null),
    
    -- Q5: MRI safety - no ionizing radiation
    (v_quiz_content_id, 'final-q5', 'final-exam', 'multiplechoice', 
    'One reason that MRI is exceptionally safe because it_____________.', 
    '{"A": "Uses extremely low doses of ionizing radiation", "B": "Has no ionizing radiation", "C": "It is painless", "D": "Requires patients to hold very still"}', 'B', 1, 4, null),
    
    -- Q6: Some ferrous items allowed
    (v_quiz_content_id, 'final-q6', 'final-exam', 'truefalse', 
    'Some ferrous items are allowed in the magnet room under controlled circumstances.', 
    '{"A": "TRUE", "B": "FALSE"}', 'A', 1, 5, null),
    
    -- Q7: Gauss to Tesla conversion
    (v_quiz_content_id, 'final-q7', 'final-exam', 'multiplechoice', 
    'Magnetic fields are measured in Gauss and Tesla units.                    5000 Gauss = _________.', 
    '{"A": "0.005 Tesla", "B": "0.05 Tesla", "C": ".5 Tesla", "D": "5.0 Tesla"}', 'C', 1, 6, null),
    
    -- Q8: Superconducting magnets advantage
    (v_quiz_content_id, 'final-q8', 'final-exam', 'multiplechoice', 
    'Superconductive MRI magnets have potentially highest performance and highest field strength compared to other magnet types. Another advantage is:', 
    '{"A": "A very high resistance to electrical current", "B": "Has virtually no electrical resistance at all", "C": "It produces the least acoustic noise", "D": "It produces images using only sound waves"}', 'B', 1, 7, null),
    
    -- Q9: Quench definition
    (v_quiz_content_id, 'final-q9', 'final-exam', 'multiplechoice', 
    'The process of liquid helium explosively turning gaseous is referred to as a:', 
    '{"A": "quench", "B": "superconductivity", "C": "dephasing", "D": "ramping"}', 'A', 1, 8, null),
    
    -- Q10: Cryostat contents
    (v_quiz_content_id, 'final-q10', 'final-exam', 'multiplechoice', 
    'In a superconductive magnet, the cryostat is filled with:', 
    '{"A": "Gaseous helium", "B": "Gaseous hydrogen", "C": "Liquid helium", "D": "Liquid hydrogen"}', 'C', 1, 9, null);
    
