-- Migration 025: Insert quiz questions for Introduction to MRI
-- This migration inserts all quiz questions into the quiz_questions table

DO $$
DECLARE
  v_module_id UUID;
  v_introduction_quiz_content_id UUID;
BEGIN
  -- Get module ID for 'introduction-to-mri'
  SELECT m.id INTO v_module_id 
  FROM modules m
  JOIN sections s ON m.section_id = s.id
  WHERE m.slug = 'introduction-to-mri';

  IF v_module_id IS NULL THEN
    RAISE EXCEPTION 'Module introduction-to-mri not found';
  END IF;

  -- Insert or update quiz_sections for each section
  INSERT INTO quiz_sections (key, title, description, icon, order_index)
  VALUES ('introduction-quiz', 'Introduction to MRI Quiz', '', '📝', 0)
  ON CONFLICT (key) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    updated_at = NOW();


  -- Get or create content item for introduction-quiz
  SELECT id INTO v_introduction_quiz_content_id
  FROM content_items
  WHERE module_id = v_module_id AND slug = 'introduction-quiz' AND type = 'quiz';

  IF v_introduction_quiz_content_id IS NULL THEN
    INSERT INTO content_items (
      module_id,
      slug,
      title,
      description,
      type,
      icon,
      order_index,
      metadata,
      is_published
    ) VALUES (
      v_module_id,
      'introduction-quiz',
      'Introduction to MRI Quiz',
      '',
      'quiz',
      '📝',
      1,
      '{}',
      true
    ) RETURNING id INTO v_introduction_quiz_content_id;
  END IF;

  -- Delete existing questions for this section (if any)
  DELETE FROM quiz_questions WHERE content_item_id = v_introduction_quiz_content_id;

  -- Insert questions for introduction-quiz
  INSERT INTO quiz_questions (
    content_item_id,
    question_id,
    section_key,
    question_type,
    question_text,
    answers,
    correct_answer,
    points,
    order_index
  ) VALUES
    (v_introduction_quiz_content_id, 'intro-1', 'introduction-quiz', 'truefalse', 'One can tell the system performance and magnetic field strength of an MRI system by looking at it.', '{"A":"True","B":"False"}', 'B', 1, 0),
    (v_introduction_quiz_content_id, 'intro-2', 'introduction-quiz', 'multiplechoice', 'In MRI, we literally turn the human body into:', '{"A":"A magnet","B":"An acoustic transmitter","C":"An x-ray receiver","D":"A radio receiver and transmitter"}', 'D', 1, 1),
    (v_introduction_quiz_content_id, 'intro-3', 'introduction-quiz', 'multiplechoice', 'The essential particle that makes MRI possible is a(an):', '{"A":"Electron","B":"Proton","C":"Neutron","D":"Photon"}', 'B', 1, 2),
    (v_introduction_quiz_content_id, 'intro-4', 'introduction-quiz', 'multiplechoice', 'The frequency that drives the resonant energy transfer from one system to another is referred to as:', '{"A":"Resonant Frequency","B":"Resonant C-tuning Frequency","C":"Resonant phase","D":"Resonant proton"}', 'A', 1, 3),
    (v_introduction_quiz_content_id, 'intro-5', 'introduction-quiz', 'multiplechoice', 'When the transmitted radio frequency is turned off, the proton that absorbed the energy:', '{"A":"Releases the energy in the form of a radio wave","B":"Releases the energy in the form of light","C":"Releases the energy in the form of a sound wave","D":"Releases the energy in the form of heat"}', 'A', 1, 4),
    (v_introduction_quiz_content_id, 'intro-6', 'introduction-quiz', 'multiplechoice', 'Protons that emit strong radio signals yield voxels that are:', '{"A":"Dark rather than bright","B":"Bright rather than dark","C":"Loud rather than quiet","D":"Quiet rather than loud"}', 'B', 1, 5),
    (v_introduction_quiz_content_id, 'intro-7', 'introduction-quiz', 'truefalse', 'When used properly MRI has NO known adverse biological effects.', '{"A":"True","B":"False"}', 'A', 1, 6),
    (v_introduction_quiz_content_id, 'intro-8', 'introduction-quiz', 'multiplechoice', 'The force with which a ferrous object is pulled toward a magnet field source increases by ______ when the distance from the magnet center decreases by ½.', '{"A":"2x","B":"4x","C":"No change","D":"Ferrous objects do not pull into a magnet"}', 'B', 1, 7),
    (v_introduction_quiz_content_id, 'intro-9', 'introduction-quiz', 'multiplechoice', 'MRI emits ionizing radiation:', '{"A":"Constantly","B":"Randomly","C":"Rarely","D":"Never"}', 'D', 1, 8),
    (v_introduction_quiz_content_id, 'intro-10', 'introduction-quiz', 'multiplechoice', 'In order to create a useful MRI, the imaging area must have an abundance of:', '{"A":"Iron","B":"Air","C":"Water","D":"Energy"}', 'C', 1, 9),
    (v_introduction_quiz_content_id, 'intro-11', 'introduction-quiz', 'multiplechoice', 'A naturally occurring mineral that has magnetic properties is:', '{"A":"Lodestone","B":"Bronze","C":"Iron","D":"Tin"}', 'A', 1, 10),
    (v_introduction_quiz_content_id, 'intro-12', 'introduction-quiz', 'multiplechoice', 'The term ''magnet'' comes from the region Magnesia in an ancient part of:', '{"A":"China","B":"Western Europe","C":"Southeast Asia","D":"Asia Minor"}', 'D', 1, 11),
    (v_introduction_quiz_content_id, 'intro-13', 'introduction-quiz', 'multiplechoice', 'In 1882 Nikola Tesla discovered that:', '{"A":"Magnetic fields rotate","B":"Hydrogen is lighter than helium","C":"A magnetic field surrounds the planet","D":"Electricity can create a magnetic field"}', 'D', 1, 12),
    (v_introduction_quiz_content_id, 'intro-14', 'introduction-quiz', 'multiplechoice', 'One of the most important concepts in MRI is Faraday''s:', '{"A":"Law of Magnetism","B":"Law of Thermodynamics","C":"Law of Induction","D":"Law of Radio Frequency Modulation"}', 'C', 1, 13),
    (v_introduction_quiz_content_id, 'intro-15', 'introduction-quiz', 'multiplechoice', 'First to perform nuclear magnetic resonance, the precursor to MRI, was ______ in the 1930s:', '{"A":"Michael Faraday","B":"Nikola Tesla","C":"Isidor Rabi","D":"Niels Bohr"}', 'C', 1, 14),
    (v_introduction_quiz_content_id, 'intro-16', 'introduction-quiz', 'multiplechoice', 'The mathematical method by which MRI images are processed is:', '{"A":"Fourier Transform","B":"Radio Frequency Modulation","C":"Electromagnetic Modulation","D":"DOS"}', 'A', 1, 15),
    (v_introduction_quiz_content_id, 'intro-17', 'introduction-quiz', 'multiplechoice', 'The first patent specifically for MRI was awarded in 1974 to:', '{"A":"Isidor Rabi","B":"Felix Bloch","C":"Edward Purcell","D":"Raymond Damadian"}', 'D', 1, 16),
    (v_introduction_quiz_content_id, 'intro-18', 'introduction-quiz', 'multiplechoice', 'The first MRI image in vivo (living tissue) was performed in 1976 by:', '{"A":"Raymond Damadian","B":"Peter Mansfield","C":"Paul Lauterbur","D":"Richard Ernst"}', 'C', 1, 17),
    (v_introduction_quiz_content_id, 'intro-19', 'introduction-quiz', 'multiplechoice', 'The first MRI in vivo (living tissue) using a whole-body MRI system was performed in 1977 by:', '{"A":"Raymond Damadian","B":"Peter Mansfield","C":"Paul Lauterbur","D":"Richard Ernst"}', 'A', 1, 18),
    (v_introduction_quiz_content_id, 'intro-20', 'introduction-quiz', 'multiplechoice', 'The 2003 Nobel Prize in Physiology and Medicine for development in MRI was awarded to:', '{"A":"Paul Lauterbur and Raymond Damadian","B":"Raymond Damadian and Purcell","C":"Edward Purcell and Peter Mansfield","D":"Peter Mansfield and Paul Lauterbur"}', 'D', 1, 19);

  RAISE NOTICE 'Successfully inserted questions for Introduction to MRI';
END $$;
