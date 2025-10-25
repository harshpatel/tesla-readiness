-- Add content for 11 - Patient Care and Management module
-- Create/update module and add video + quiz content

DO $$
DECLARE
  v_section_id UUID;
  v_module_id UUID;
  v_video_content_id UUID;
  v_quiz_content_id UUID;
BEGIN
  -- Get section ID for 'phase1'
  SELECT id INTO v_section_id FROM sections WHERE slug = 'phase1';

  -- Check if module exists
  SELECT id INTO v_module_id FROM modules 
  WHERE section_id = v_section_id AND slug = 'patient-care-management';

  IF v_module_id IS NULL THEN
    -- Create new module
    INSERT INTO modules (section_id, slug, title, description, icon, order_index, is_published, is_locked)
    VALUES (v_section_id, 'patient-care-management', '11 - Patient Care and Management', 'Learn essential patient care skills including HIPAA compliance, patient rights, vital signs monitoring, body mechanics, infection control protocols, and professional communication techniques', '🩺', 11, true, false)
    RETURNING id INTO v_module_id;
  ELSE
    -- Update existing module
    UPDATE modules
    SET
      title = '11 - Patient Care and Management',
      description = 'Learn essential patient care skills including HIPAA compliance, patient rights, vital signs monitoring, body mechanics, infection control protocols, and professional communication techniques',
      icon = '🩺',
      is_published = true,
      is_locked = false,
      updated_at = NOW()
    WHERE id = v_module_id;
  END IF;

  -- Insert video content item
  INSERT INTO content_items (module_id, slug, title, description, type, icon, order_index, metadata, is_published)
  VALUES (v_module_id, 'introduction', 'Patient Care and Management', 'Comprehensive training on patient rights, HIPAA regulations, vital signs assessment, infection control, body mechanics, and effective communication in healthcare settings', 'video', '🎥', 1, '{"videoUrl": "https://cffhrzzfhyotkbuuoayc.supabase.co/storage/v1/object/public/videos/11%20-%20Patient%20Care%20and%20Management.mp4"}', true)
  RETURNING id INTO v_video_content_id;

  -- Insert quiz content item
  INSERT INTO content_items (module_id, slug, title, description, type, icon, order_index, metadata, is_published)
  VALUES (v_module_id, 'patient-care-fundamentals', 'Patient Care Fundamentals', 'Test your knowledge of patient rights, HIPAA compliance, vital signs, body mechanics, infection control, and professional communication.', 'quiz', '📝', 2, '{}', true)
  RETURNING id INTO v_quiz_content_id;

  -- Insert or update quiz_sections
  INSERT INTO quiz_sections (key, title, description, icon, order_index)
  VALUES ('patient-care-fundamentals', 'Patient Care Fundamentals', 'Master patient care and professional healthcare practices', '🩺', 0)
  ON CONFLICT (key) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    updated_at = NOW();

  -- Insert all 20 quiz questions (18 multiple choice, 2 true/false)
  INSERT INTO quiz_questions (
    content_item_id, 
    question_id, 
    section_key, 
    question_type, 
    question_text, 
    answers, 
    correct_answer, 
    points, 
    order_index,
    image_url
  ) VALUES 
    -- Patient Rights and HIPAA
    (v_quiz_content_id, 'pc-1', 'patient-care-fundamentals', 'multiplechoice', 'Privacy and Confidentiality, Informed Consent, and Respect and Nondiscrimination are all examples of:', '{"A": "Patients'' Rights", "B": "Medical Malpractice", "C": "HIPAA guidelines", "D": "The Privacy Rule"}', 'A', 1, 0, null),
    (v_quiz_content_id, 'pc-2', 'patient-care-fundamentals', 'multiplechoice', 'HIPAA stands for:', '{"A": "Health Insurance Privacy and Access", "B": "Health Inpatient Privacy and Accounting Act", "C": "Health Insurance Portability and Accountability Act", "D": "Hospital Insured Patient Access Act"}', 'C', 1, 1, null),
    (v_quiz_content_id, 'pc-3', 'patient-care-fundamentals', 'multiplechoice', 'HIPAA is U.S. federal law designed to provide privacy standards to protect patients'' medical records and other health information otherwise known as PHI and stands for:', '{"A": "Patient Health Information", "B": "Patient Hospital Intersection", "C": "Protected or Private Health Information", "D": "Proactive Healthcare for Inpatients"}', 'C', 1, 2, null),
    (v_quiz_content_id, 'pc-4', 'patient-care-fundamentals', 'multiplechoice', 'The difference between "negligence" and "malpractice" is that negligence can be committed by anyone. Malpractice is a type of negligence and is committed:', '{"A": "In a professional context that holds a standard of practice and conduct.", "B": "Knowingly and willingly", "C": "Without the immediate knowledge of the injured person", "D": "Only in the medical field by licensed physicians"}', 'A', 1, 3, null),
    
    -- Communication
    (v_quiz_content_id, 'pc-5', 'patient-care-fundamentals', 'multiplechoice', 'Differences in language, cognitive impairments, and emotional status are all examples of:', '{"A": "Patients that are difficult", "B": "Patients that need modifications to their test", "C": "Patients that need physician intervention", "D": "Communication barriers"}', 'D', 1, 4, null),
    
    -- Vital Signs
    (v_quiz_content_id, 'pc-6', 'patient-care-fundamentals', 'multiplechoice', 'Taking a patient''s vital signs includes all listed below except:', '{"A": "Blood pressure", "B": "Respiratory rate", "C": "Pulse rate", "D": "Temperature"}', 'B', 1, 5, null),
    (v_quiz_content_id, 'pc-7', 'patient-care-fundamentals', 'multiplechoice', 'The diastolic reading in taking a blood pressure is when:', '{"A": "The blood pressure exerted on the vessel walls is the greatest", "B": "The blood pressure exerted on the vessel walls is the lowest", "C": "The blood flow is at peak velocity", "D": "The blood flood is at the lowest velocity"}', 'B', 1, 6, null),
    (v_quiz_content_id, 'pc-8', 'patient-care-fundamentals', 'multiplechoice', 'For children and adults, any temperature above ____________ is considered a fever.', '{"A": "98.6 degrees", "B": "99.9 degrees", "C": "100.4 degrees", "D": "101.0 degrees"}', 'C', 1, 7, null),
    (v_quiz_content_id, 'pc-9', 'patient-care-fundamentals', 'multiplechoice', 'True/False: Any finger can be used to detect and record a radial pulse.', '{"A": "True", "B": "False"}', 'B', 1, 8, null),
    
    -- Body Mechanics
    (v_quiz_content_id, 'pc-10', 'patient-care-fundamentals', 'multiplechoice', 'When lifting heavy items from the floor it is best to:', '{"A": "Bend at the knees and lift with the legs", "B": "Bend at the waist and keep the knees locked", "C": "Always ask for help lifting heavy items", "D": "Slide the item away from heavy traffic areas"}', 'A', 1, 9, null),
    (v_quiz_content_id, 'pc-11', 'patient-care-fundamentals', 'multiplechoice', 'When helping a patient to a standing position, first:', '{"A": "Bend your knees slightly to avoid back injuries", "B": "Always ask for help getting a patient to stand", "C": "Ask the patient to place their hands on your shoulders or around your waist", "D": "Check the patient''s ability and willingness to stand"}', 'D', 1, 10, null),
    (v_quiz_content_id, 'pc-12', 'patient-care-fundamentals', 'multiplechoice', 'When helping a patient to the floor to prevent a fall:', '{"A": "Gently guide the patient to a sitting position", "B": "Protect the patient''s head", "C": "Stay calm and reassuring to the patient", "D": "All the above"}', 'D', 1, 11, null),
    
    -- Infection Control
    (v_quiz_content_id, 'pc-13', 'patient-care-fundamentals', 'multiplechoice', 'The practice of implementing techniques that reduce or prevent the spread of pathogens that can cause illness is referred to as:', '{"A": "Sterile procedures", "B": "Safety Policies and Procedures", "C": "Infection Control", "D": "Soiled material disposal"}', 'C', 1, 12, null),
    (v_quiz_content_id, 'pc-14', 'patient-care-fundamentals', 'multiplechoice', 'When donning sterile gloves use the ____________ hand to place the glove on the other hand.', '{"A": "Left hand", "B": "Right hand", "C": "Non-dominate hand", "D": "Dominate hand"}', 'C', 1, 13, null),
    (v_quiz_content_id, 'pc-15', 'patient-care-fundamentals', 'multiplechoice', 'Personal Protective Equipment (PPE) includes:', '{"A": "Gloves", "B": "Goggles / Face mask", "C": "Gowns", "D": "All the above"}', 'D', 1, 14, null),
    (v_quiz_content_id, 'pc-16', 'patient-care-fundamentals', 'multiplechoice', 'The most important step in performing infection control is:', '{"A": "Proper hand hygiene", "B": "Cleaning all surfaces that the patient contacts", "C": "Wearing masks", "D": "Wearing PPE"}', 'A', 1, 15, null),
    (v_quiz_content_id, 'pc-17', 'patient-care-fundamentals', 'multiplechoice', 'When inserting and IV into the arm, the blood vessel to palpate is the:', '{"A": "Radial artery", "B": "Median cubital vein", "C": "Cephalic vein", "D": "Pronator teres vein"}', 'B', 1, 16, null),
    (v_quiz_content_id, 'pc-18', 'patient-care-fundamentals', 'multiplechoice', 'When disposing of soiled linens and other fabrics, always:', '{"A": "Wear PPE", "B": "Carefully place items in specifically designated bags or containers", "C": "Securely seal the bags or containers", "D": "All the above"}', 'D', 1, 17, null),
    
    -- Empathy and Communication
    (v_quiz_content_id, 'pc-19', 'patient-care-fundamentals', 'multiplechoice', 'Which statements below best displays empathy?', '{"A": "I understand that you must feel badly.", "B": "I have a solution for how you are feeling.", "C": "I can feel what you must be feeling.", "D": "It''s ok… you''ll be fine."}', 'C', 1, 18, null),
    (v_quiz_content_id, 'pc-20', 'patient-care-fundamentals', 'multiplechoice', 'True/False: Empathy is a skill that can be taught and mastered.', '{"A": "True", "B": "False"}', 'A', 1, 19, null)
  ;

END $$;

