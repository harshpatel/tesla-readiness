-- Add content for 06 - MRI Safety I: Magnetic Fields module
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

  -- Update existing module 'mri-safety-magnetic-fields'
  UPDATE modules
  SET
    title = '06 - MRI Safety I: Magnetic Fields',
    description = 'Master critical MRI safety protocols including Zone designation, magnetic forces, projectile risks, cryogen hazards, patient screening procedures, and contraindications for safe clinical practice',
    icon = '⚠️',
    is_published = true,
    is_locked = false,
    updated_at = NOW()
  WHERE section_id = v_section_id AND slug = 'mri-safety-magnetic-fields'
  RETURNING id INTO v_module_id;

  -- Insert video content item
  INSERT INTO content_items (module_id, slug, title, description, type, icon, order_index, metadata, is_published)
  VALUES (v_module_id, 'introduction', 'MRI Safety I: Magnetic Fields', 'Comprehensive overview of magnetic field safety including zone protocols, translational and rotational forces, quench procedures, and patient contraindications', 'video', '🎥', 1, '{"videoUrl": "https://cffhrzzfhyotkbuuoayc.supabase.co/storage/v1/object/public/videos/06%20-%20MRI%20Safety%20I%20-%20Magnetic%20Fields.mp4"}', true)
  RETURNING id INTO v_video_content_id;

  -- Insert quiz content item
  INSERT INTO content_items (module_id, slug, title, description, type, icon, order_index, metadata, is_published)
  VALUES (v_module_id, 'mri-safety-magnetic-fields-fundamentals', 'MRI Safety: Magnetic Fields Fundamentals', 'Test your knowledge of MRI safety zones, magnetic forces, projectile risks, cryogen safety, patient screening, and critical contraindications.', 'quiz', '📝', 2, '{}', true)
  RETURNING id INTO v_quiz_content_id;

  -- Insert or update quiz_sections
  INSERT INTO quiz_sections (key, title, description, icon, order_index)
  VALUES ('mri-safety-magnetic-fields-fundamentals', 'MRI Safety: Magnetic Fields Fundamentals', 'Master the critical safety protocols for magnetic field environments', '⚠️', 0)
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
    (v_quiz_content_id, 'safety-1', 'mri-safety-magnetic-fields-fundamentals', 'multiplechoice', 'When used properly, MRI has:', '{"A": "No adverse biological effects", "B": "Minimal ionizing radiation", "C": "Several known adverse biological effects", "D": "The same adverse biological effects as radiography"}', 'A', 1, 0, null),
    (v_quiz_content_id, 'safety-2', 'mri-safety-magnetic-fields-fundamentals', 'multiplechoice', 'The amount of force a magnet exerts on an object depends on the:', '{"A": "Mass of an object and distance to the center of the magnet", "B": "Mass of an object and distance to the fringe field of the magnet", "C": "Amount of ferrous material of the object and the distance to the center of the magnet", "D": "Amount of ferrous material of the object and the distance to the fringe field of the magnet"}', 'C', 1, 1, null),
    (v_quiz_content_id, 'safety-3', 'mri-safety-magnetic-fields-fundamentals', 'multiplechoice', 'As the distance of an object to the magnet decreases by 1/2, the force exerted on the object increases by:', '{"A": "2x", "B": "4x", "C": "10x", "D": "No effect"}', 'B', 1, 2, null),
    (v_quiz_content_id, 'safety-4', 'mri-safety-magnetic-fields-fundamentals', 'multiplechoice', 'Lines of magnetic force in a magnetic field diagram indicate the:', '{"A": "Magnet field strength", "B": "Change in the magnetic field strength over a given distance", "C": "Distance to isocenter", "D": "Magnetic field homogeneity over a given distance"}', 'B', 1, 3, null),
    (v_quiz_content_id, 'safety-5', 'mri-safety-magnetic-fields-fundamentals', 'multiplechoice', 'The force exerted on an object by a magnetic field that results in the object accelerating toward the magnet is a:', '{"A": "Lenz force", "B": "Rotational force", "C": "Magnetic field force", "D": "Translational force"}', 'D', 1, 4, null),
    (v_quiz_content_id, 'safety-6', 'mri-safety-magnetic-fields-fundamentals', 'multiplechoice', 'MRI-related injuries are:', '{"A": "Rare", "B": "Common", "C": "Never fatal", "D": "Always the fault of the technologist"}', 'A', 1, 5, null),
    (v_quiz_content_id, 'safety-7', 'mri-safety-magnetic-fields-fundamentals', 'multiplechoice', 'Superconductive magnets use a ____________ to hold liquid helium.', '{"A": "Gradient coil", "B": "RF coil", "C": "Cryostat", "D": "Cryogen"}', 'C', 1, 6, null),
    (v_quiz_content_id, 'safety-8', 'mri-safety-magnetic-fields-fundamentals', 'multiplechoice', 'Helium liquifies at -453 Degrees Farhenheit or ______________.', '{"A": "0 Degrees Celsius", "B": "0 Degrees Kelvin", "C": "-4 Degrees Celsius", "D": "4 Degrees Kelvin"}', 'D', 1, 7, null),
    (v_quiz_content_id, 'safety-9', 'mri-safety-magnetic-fields-fundamentals', 'multiplechoice', 'An explosive conversion of liquid helium to gaseous helium is called a:', '{"A": "radio frequency burn", "B": "Dewar", "C": "RF pulse", "D": "quench"}', 'D', 1, 8, null),
    (v_quiz_content_id, 'safety-10', 'mri-safety-magnetic-fields-fundamentals', 'multiplechoice', 'A release of helium into the magnet room can lead to death caused by:', '{"A": "A cold burn", "B": "burned lungs", "C": "anaphylactic shock", "D": "asphyxiation"}', 'D', 1, 9, null),
    (v_quiz_content_id, 'safety-11', 'mri-safety-magnetic-fields-fundamentals', 'multiplechoice', 'In the case of a sudden release of gaseous helium into the magnet room, the very first action the technologist takes is:', '{"A": "Call a supervisor", "B": "Call 911", "C": "Finish the exam immediately", "D": "Remove the patient from the magnet bore and magnet room"}', 'D', 1, 10, null),
    (v_quiz_content_id, 'safety-12', 'mri-safety-magnetic-fields-fundamentals', 'multiplechoice', 'Anyone entering the Zones III or IV must be screened by:', '{"A": "A qualified MRI Professional", "B": "The referring physician", "C": "The attending radiologist", "D": "The Radiology supervisor"}', 'A', 1, 11, null),
    (v_quiz_content_id, 'safety-13', 'mri-safety-magnetic-fields-fundamentals', 'multiplechoice', 'All pacemakers are contraindicated for an MRI exam:', '{"A": "True", "B": "False"}', 'B', 1, 12, null),
    (v_quiz_content_id, 'safety-14', 'mri-safety-magnetic-fields-fundamentals', 'multiplechoice', 'It is essential to get the patients accurate weight because the weight:', '{"A": "Determines the limits of the Specific Absorption Rate or SAR", "B": "Determines if the patient will fit in the magnet bore", "C": "Determines the length of the scan time", "D": "Determines the imaging protocol"}', 'A', 1, 13, null),
    (v_quiz_content_id, 'safety-15', 'mri-safety-magnetic-fields-fundamentals', 'multiplechoice', 'It is important to ask a female patient if there is a possibility of pregnancy because:', '{"A": "MRI is contraindicated for a pregnant patient", "B": "Special imaging parameters are needed for a pregnant patient", "C": "Acoustic noise is damaging to the fetus", "D": "IV contrast agents may be contraindicated for a pregnant patient"}', 'D', 1, 14, null),
    (v_quiz_content_id, 'safety-16', 'mri-safety-magnetic-fields-fundamentals', 'multiplechoice', 'Zone III is which area?', '{"A": "Magnet room", "B": "Facility lobby/Check-in area/Facility waiting room", "C": "Patient holding area", "D": "Public area or any area outside the facility entrance"}', 'C', 1, 15, null),
    (v_quiz_content_id, 'safety-17', 'mri-safety-magnetic-fields-fundamentals', 'multiplechoice', 'Zone IV is the:', '{"A": "Waiting room", "B": "Magnet room", "C": "Control room", "D": "The patient screening area"}', 'B', 1, 16, null),
    (v_quiz_content_id, 'safety-18', 'mri-safety-magnetic-fields-fundamentals', 'multiplechoice', 'Patients are screened in', '{"A": "Zone I", "B": "Zone II", "C": "Zone III", "D": "Zone IV"}', 'B', 1, 17, null),
    (v_quiz_content_id, 'safety-19', 'mri-safety-magnetic-fields-fundamentals', 'multiplechoice', '__________________ is contraindicated for an MRI', '{"A": "An uncleared metallic foreign body", "B": "An artificial hip replacement", "C": "Any implant controlled by a battery", "D": "A verified prior history of an allergenic reaction to IV contrast agents"}', 'A', 1, 18, null)
  ;

END $$;

