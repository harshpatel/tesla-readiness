-- Add content for 07 - MRI Safety II: RF & Gradient Fields module
-- Update existing module and add video + quiz content

DO $$
DECLARE
  v_section_id UUID;
  v_module_id UUID;
  v_video_content_id UUID;
  v_quiz_content_id UUID;
BEGIN
  -- Get section ID for 'phase1'
  SELECT id INTO v_section_id FROM sections WHERE slug = 'phase1';

  -- Update existing module 'mri-safety-rf-gradient-fields'
  UPDATE modules
  SET
    title = '07 - MRI Safety II: RF & Gradient Fields',
    description = 'Learn RF burn prevention, SAR limits and management, implant safety protocols, acoustic noise hazards, hearing protection requirements, and the roles of MRI safety personnel',
    icon = '📡',
    is_published = true,
    is_locked = false,
    updated_at = NOW()
  WHERE section_id = v_section_id AND slug = 'mri-safety-rf-gradient-fields'
  RETURNING id INTO v_module_id;

  -- Insert video content item
  INSERT INTO content_items (module_id, slug, title, description, type, icon, order_index, metadata, is_published)
  VALUES (v_module_id, 'introduction', 'MRI Safety II: RF & Gradient Fields', 'Comprehensive coverage of RF burns, SAR management, implant safety, acoustic hazards, and MRI safety personnel roles for safe clinical practice', 'video', '🎥', 1, '{"videoUrl": "https://cffhrzzfhyotkbuuoayc.supabase.co/storage/v1/object/public/videos/07%20-%20MRI%20Safety%20II%20-%20RF%20&%20Gradient%20Fields.mp4"}', true)
  RETURNING id INTO v_video_content_id;

  -- Insert quiz content item
  INSERT INTO content_items (module_id, slug, title, description, type, icon, order_index, metadata, is_published)
  VALUES (v_module_id, 'mri-safety-rf-gradient-fundamentals', 'MRI Safety: RF & Gradient Fundamentals', 'Test your knowledge of RF burns, SAR limits, implant safety, acoustic noise hazards, and MRI safety personnel roles.', 'quiz', '📝', 2, '{}', true)
  RETURNING id INTO v_quiz_content_id;

  -- Insert or update quiz_sections
  INSERT INTO quiz_sections (key, title, description, icon, order_index)
  VALUES ('mri-safety-rf-gradient-fundamentals', 'MRI Safety: RF & Gradient Fundamentals', 'Master RF safety, SAR management, and acoustic hazard protocols', '📡', 0)
  ON CONFLICT (key) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    updated_at = NOW();

  -- Insert quiz questions (question data ONLY - no hints/explanations in DB!)
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
    (v_quiz_content_id, 'rf-safety-1', 'mri-safety-rf-gradient-fundamentals', 'multiplechoice', 'The most common MRI-related injury is:', '{"A": "Hearing damage", "B": "Radio-frequency burns", "C": "Cryogen burns", "D": "Ferrous objects accelerating into the magnet bore"}', 'B', 1, 0, null),
    (v_quiz_content_id, 'rf-safety-2', 'mri-safety-rf-gradient-fundamentals', 'multiplechoice', 'Which of the following is not a type of radio frequency burn seen in MRI?', '{"A": "Looped cables", "B": "Skin contact with a transmitting antenna", "C": "Skin-to-Skin large contact loops", "D": "Electrical conductor arcing"}', 'D', 1, 1, null),
    (v_quiz_content_id, 'rf-safety-3', 'mri-safety-rf-gradient-fundamentals', 'multiplechoice', 'True or False: Burns caused by looped cables burns may be delayed.', '{"A": "True", "B": "False"}', 'A', 1, 2, null),
    (v_quiz_content_id, 'rf-safety-4', 'mri-safety-rf-gradient-fundamentals', 'multiplechoice', 'A best practice for any cables is the magnet bore is to _____________.', '{"A": "Keep as much of the cable in the bore as possible", "B": "Loop the cable to shorten the overall length", "C": "Leave the cable unplugged", "D": "Keep the amount of cable in the bore to a minimum and plugged in"}', 'D', 1, 3, null),
    (v_quiz_content_id, 'rf-safety-5', 'mri-safety-rf-gradient-fundamentals', 'multiplechoice', 'Skin contact with the inside of the bore is unsafe because it', '{"A": "Comes in to contact with a transmitting antenna leading to a burn.", "B": "Degrades image quality", "C": "Increases SAR", "D": "Decreases signal-to-noise ratio"}', 'A', 1, 4, null),
    (v_quiz_content_id, 'rf-safety-6', 'mri-safety-rf-gradient-fundamentals', 'multiplechoice', 'Non-ferrous implants may be unsafe if they are _____________.', '{"A": "Large", "B": "Near large nerves", "C": "Mechanically or electrically activated", "D": "Made primarily of iron"}', 'C', 1, 5, null),
    (v_quiz_content_id, 'rf-safety-7', 'mri-safety-rf-gradient-fundamentals', 'multiplechoice', 'Ferrous implants are dangerous because they may ____________.', '{"A": "Be strongly attracted to the magnetic field accelerating the object into the magnet", "B": "Create poor image quality", "C": "Damage the implant", "D": "Increase magnetic field inhomogeneity"}', 'A', 1, 6, null),
    (v_quiz_content_id, 'rf-safety-8', 'mri-safety-rf-gradient-fundamentals', 'multiplechoice', 'All metallic implants _______________ though may pose little or no risk to the patient.', '{"A": "Distort the magnetic field causing artifacts if located in the area of interest.", "B": "Cause radio-frequency burns", "C": "Are unsafe", "D": "Must be removed before the exam"}', 'A', 1, 7, null),
    (v_quiz_content_id, 'rf-safety-9', 'mri-safety-rf-gradient-fundamentals', 'multiplechoice', 'The Magnetic Resonance Medical Director (MRMD) is a ________________.', '{"A": "Certified MRI technologist", "B": "A physicist trained in MRI Safety", "C": "Physician trained in MRI Safety", "D": "MRI Department Manager"}', 'C', 1, 8, null),
    (v_quiz_content_id, 'rf-safety-10', 'mri-safety-rf-gradient-fundamentals', 'multiplechoice', 'The primary role of the Magnetic Resonance Safety Officer (MRSO) is to___________:', '{"A": "Advise and execute orders from the MRMD", "B": "Advise and execute orders from the MRSE", "C": "Give orders to a scanning MR technologist", "D": "Give orders to the MRSE"}', 'A', 1, 9, null),
    (v_quiz_content_id, 'rf-safety-11', 'mri-safety-rf-gradient-fundamentals', 'multiplechoice', 'The radio-frequency energy transmitted to the patient over time is referred to as ____________ , or SAR.', '{"A": "Signal Absorption Rate", "B": "Safe Absorption Rate", "C": "Selective Absorption Rate", "D": "Specific Absorption Rate"}', 'D', 1, 10, null),
    (v_quiz_content_id, 'rf-safety-12', 'mri-safety-rf-gradient-fundamentals', 'multiplechoice', 'SAR is measured in___________.', '{"A": "Watts/milligram", "B": "Watts/Hertz", "C": "Watts/pound", "D": "Watts/kilogram"}', 'D', 1, 11, null),
    (v_quiz_content_id, 'rf-safety-13', 'mri-safety-rf-gradient-fundamentals', 'multiplechoice', 'The maximum SAR for whole body imaging in NORMAL MODE is ___________________.', '{"A": "No more than 3.2 Watts/kilogram", "B": "No more than 2.0 Watts/kilogram", "C": "No more than 4.0 Watts/kilogram", "D": "No more than 8.0 Watts/kilogram"}', 'B', 1, 12, null),
    (v_quiz_content_id, 'rf-safety-14', 'mri-safety-rf-gradient-fundamentals', 'multiplechoice', 'One method of reducing SAR is to________________;', '{"A": "Reduce TR", "B": "Reduce TE", "C": "Increase flip angle in GRE pulse sequence", "D": "Increase the TR"}', 'D', 1, 13, null),
    (v_quiz_content_id, 'rf-safety-15', 'mri-safety-rf-gradient-fundamentals', 'multiplechoice', 'The noise of an MRI system while scanning arises from ___________________.', '{"A": "The rise and fall of the gradients", "B": "radio-frequency transmission", "C": "radio-frequency absorption", "D": "circulating cryogens"}', 'A', 1, 14, null),
    (v_quiz_content_id, 'rf-safety-16', 'mri-safety-rf-gradient-fundamentals', 'multiplechoice', 'Acoustic noise levels are measured in decibels, or dB. dB levels are a function of the______________ of the noise:', '{"A": "Volume and duration", "B": "Frequency and duration", "C": "Volume and the distance", "D": "Time and iteration"}', 'A', 1, 15, null),
    (v_quiz_content_id, 'rf-safety-17', 'mri-safety-rf-gradient-fundamentals', 'multiplechoice', 'dB levels above _________dB can cause hearing damage and loss.', '{"A": "60", "B": "75", "C": "85", "D": "90"}', 'C', 1, 16, null),
    (v_quiz_content_id, 'rf-safety-18', 'mri-safety-rf-gradient-fundamentals', 'multiplechoice', 'True or False: Acoustic noise levels in MRI are a function of the MRI system performance levels and magnetic field strength.', '{"A": "True", "B": "False"}', 'A', 1, 17, null),
    (v_quiz_content_id, 'rf-safety-19', 'mri-safety-rf-gradient-fundamentals', 'multiplechoice', 'True or False: Non-patients in the magnet during scanning are not required to have hearing protection.', '{"A": "True", "B": "False"}', 'B', 1, 18, null),
    (v_quiz_content_id, 'rf-safety-20', 'mri-safety-rf-gradient-fundamentals', 'multiplechoice', 'A high-performance 3.0T MRI system can reach dB levels as high as_________.', '{"A": "85db", "B": "97dB", "C": "110dB", "D": "125dB"}', 'D', 1, 19, null)
  ;

END $$;

