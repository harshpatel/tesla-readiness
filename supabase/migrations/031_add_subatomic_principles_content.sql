-- Add content for 04 - Subatomic Principles of MRI module
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

  -- Update existing module 'subatomic-principles-mri'
  UPDATE modules
  SET
    title = '04 - Subatomic Principles of MRI',
    description = 'Master the fundamental physics of MRI including magnetism, electromagnetic waves, resonance, precession, and the behavior of atomic particles in magnetic fields',
    icon = '⚛️',
    is_published = true,
    is_locked = false,
    updated_at = NOW()
  WHERE section_id = v_section_id AND slug = 'subatomic-principles-mri'
  RETURNING id INTO v_module_id;

  -- Insert video content item
  INSERT INTO content_items (module_id, slug, title, description, type, icon, order_index, metadata, is_published)
  VALUES (v_module_id, 'introduction', 'Subatomic Principles of MRI', 'Comprehensive overview of the physics and electromagnetic principles underlying magnetic resonance imaging', 'video', '🎥', 1, '{"videoUrl": "https://cffhrzzfhyotkbuuoayc.supabase.co/storage/v1/object/public/videos/04%20-%20Subatomic%20Principles%20of%20MRI.mp4"}', true)
  RETURNING id INTO v_video_content_id;

  -- Insert quiz content item
  INSERT INTO content_items (module_id, slug, title, description, type, icon, order_index, metadata, is_published)
  VALUES (v_module_id, 'subatomic-principles-fundamentals', 'Subatomic Principles Fundamentals', 'Test your understanding of magnetic properties, electromagnetic waves, resonance, precession, and MRI physics fundamentals.', 'quiz', '📝', 2, '{}', true)
  RETURNING id INTO v_quiz_content_id;

  -- Insert or update quiz_sections
  INSERT INTO quiz_sections (key, title, description, icon, order_index)
  VALUES ('subatomic-principles-fundamentals', 'Subatomic Principles Fundamentals', 'Master the physics and electromagnetic foundations of MRI technology', '⚛️', 0)
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
    (v_quiz_content_id, 'sub-1', 'subatomic-principles-fundamentals', 'multiplechoice', 'Magnetism arises from:', '{"A": "Protons", "B": "Neutrons", "C": "Electrons", "D": "Faraday''s Law"}', 'C', 1, 0, null),
    (v_quiz_content_id, 'sub-2', 'subatomic-principles-fundamentals', 'multiplechoice', 'A subatomic magnetic field is:', '{"A": "strong and large", "B": "weak but large", "C": "strong but small", "D": "weak and small"}', 'C', 1, 1, null),
    (v_quiz_content_id, 'sub-3', 'subatomic-principles-fundamentals', 'multiplechoice', 'Which is an example of a ferromagnetic?', '{"A": "Iron", "B": "Aluminum", "C": "Copper", "D": "Gadolinium"}', 'A', 1, 2, null),
    (v_quiz_content_id, 'sub-4', 'subatomic-principles-fundamentals', 'multiplechoice', 'Which is an example of a paramagnetic?', '{"A": "Iron", "B": "Aluminum", "C": "Copper", "D": "Colbalt"}', 'B', 1, 3, null),
    (v_quiz_content_id, 'sub-5', 'subatomic-principles-fundamentals', 'multiplechoice', 'Which is an example of a diamagnetic?', '{"A": "Iron", "B": "Aluminum", "C": "Copper", "D": "Nickel"}', 'C', 1, 4, null),
    (v_quiz_content_id, 'sub-6', 'subatomic-principles-fundamentals', 'multiplechoice', '"The ability of a material to become magnetized" is the definition of:', '{"A": "Superconductivity", "B": "Susceptibility", "C": "Slice excitation", "D": "Spectroscopy"}', 'B', 1, 5, null),
    (v_quiz_content_id, 'sub-7', 'subatomic-principles-fundamentals', 'multiplechoice', 'Faraday''s Law says that:', '{"A": "A magnetic field moving across a conductor produces resonance", "B": "Current is induced when a magnetic field is removed", "C": "A magnetic field moving across a conductor produces electrical current", "D": "The magnetic fields and electrical current are separate and distinct"}', 'C', 1, 6, null),
    (v_quiz_content_id, 'sub-8', 'subatomic-principles-fundamentals', 'multiplechoice', 'One "Hertz" is defined as:', '{"A": "One cycle per milli-second", "B": "One cycle per second", "C": "One cycle per minute", "D": "One cycle per hour"}', 'B', 1, 7, null),
    (v_quiz_content_id, 'sub-9', 'subatomic-principles-fundamentals', 'multiplechoice', 'One cycle of a radio wave is referred to as its:', '{"A": "Frequency", "B": "Amplitude", "C": "Strength", "D": "Phase Coherence"}', 'A', 1, 8, null),
    (v_quiz_content_id, 'sub-10', 'subatomic-principles-fundamentals', 'multiplechoice', 'In addition to the answer above, one cycle of a radio wave is also its:', '{"A": "Source", "B": "Wave Coherence", "C": "Wavelength", "D": "Oscillation"}', 'C', 1, 9, null),
    (v_quiz_content_id, 'sub-11', 'subatomic-principles-fundamentals', 'multiplechoice', 'If two signals or waves have the same _____________ they are considered to be "in phase":', '{"A": "Frequency", "B": "Amplitude", "C": "Source", "D": "Power"}', 'A', 1, 10, null),
    (v_quiz_content_id, 'sub-12', 'subatomic-principles-fundamentals', 'multiplechoice', 'The transmitted radio frequency that is perfectly matched to the frequencies of a set of protons is referred to as the:', '{"A": "Resonant Frequency", "B": "In-phase frequency", "C": "Rotational frequency", "D": "Oscillation frequency"}', 'A', 1, 11, null),
    (v_quiz_content_id, 'sub-13', 'subatomic-principles-fundamentals', 'multiplechoice', 'In MRI, when the radio transmission is turned off, protons that absorbed the radio frequency energy:', '{"A": "Transfer the energy to electrons", "B": "Hold on to the energy until the next transmission", "C": "Release the energy in the form of a radio wave", "D": "Absorb more energy in the form of heat"}', 'C', 1, 12, null),
    (v_quiz_content_id, 'sub-14', 'subatomic-principles-fundamentals', 'multiplechoice', 'In MRI, a rotating proton will have a type of inertia referred as ______________ or simply, "spin".', '{"A": "Angular momentum", "B": "Magnetic resonance", "C": "Spin-spin momentum", "D": "gyromagnetic ratio"}', 'A', 1, 13, null),
    (v_quiz_content_id, 'sub-15', 'subatomic-principles-fundamentals', 'multiplechoice', 'What causes a spinning top to wobble?', '{"A": "Resonant frequency", "B": "RF transmission", "C": "Angular momentum", "D": "Gravity"}', 'D', 1, 14, null),
    (v_quiz_content_id, 'sub-16', 'subatomic-principles-fundamentals', 'multiplechoice', 'In MRI, the "wobble" of a proton is referred to as:', '{"A": "Wobble", "B": "Angular Momentum", "C": "Frequency", "D": "Precession"}', 'D', 1, 15, null),
    (v_quiz_content_id, 'sub-17', 'subatomic-principles-fundamentals', 'multiplechoice', 'The fundamental equation that determines the required frequency to obtain resonance is the Lamour Equation. Which below is the equation?', '{"A": "ω = γ × B₀", "B": "f = γ / 2π", "C": "B₀ = ω / γ", "D": "γ = B₀ × 2π"}', 'A', 1, 16, 'https://0cm.classmarker.com/10742032_XRUWWK2K.png'),
    (v_quiz_content_id, 'sub-18', 'subatomic-principles-fundamentals', 'multiplechoice', 'In determining the Larmor Frequency in MRI, the only thing that is needed to know about hydrogen is its', '{"A": "Resonant frequency", "B": "Proton density", "C": "Gyromagnetic Ratio", "D": "The strength of Bₒ field"}', 'C', 1, 17, null),
    (v_quiz_content_id, 'sub-19', 'subatomic-principles-fundamentals', 'multiplechoice', 'A "vector" is a graphical illustration showing', '{"A": "Direction and magnitude", "B": "Transverse magnetization", "C": "Longitudinal magnetization", "D": "Distance and magnitude"}', 'A', 1, 18, null),
    (v_quiz_content_id, 'sub-20', 'subatomic-principles-fundamentals', 'multiplechoice', 'Vectors that are equal but opposite have their forces:', '{"A": "Cancel each other", "B": "Add together", "C": "Combine into one", "D": "Reach resonance"}', 'A', 1, 19, null),
    (v_quiz_content_id, 'sub-21', 'subatomic-principles-fundamentals', 'multiplechoice', 'Considering the answer above, those forces would be considered to be:', '{"A": "In-phase", "B": "Out-of-Phase", "C": "In resonance", "D": "Phase coherent"}', 'B', 1, 20, null),
    (v_quiz_content_id, 'sub-22', 'subatomic-principles-fundamentals', 'multiplechoice', 'Looking at the front of a high-field cylindrical MRI system, the Z direction is:', '{"A": "Across the face of the magnet", "B": "Top-bottom of the magnet", "C": "Down the bore of the magnet", "D": "Cannot be determined but looking at the magnet"}', 'C', 1, 21, null),
    (v_quiz_content_id, 'sub-23', 'subatomic-principles-fundamentals', 'multiplechoice', 'When all the vectors of the spins pointing in the Z-direction are added together, the result is the _______________ vector:', '{"A": "Longitudinal Magnetization (Mz)", "B": "Transverse Magnetization (Mxy)", "C": "Resonant (Mr)", "D": "Phase Coherent"}', 'A', 1, 22, null),
    (v_quiz_content_id, 'sub-24', 'subatomic-principles-fundamentals', 'multiplechoice', 'Considering the answer above, those individual spins are considered to be precessing:', '{"A": "In-Phase", "B": "Randomly", "C": "Coherently", "D": "Together"}', 'B', 1, 23, null),
    (v_quiz_content_id, 'sub-25', 'subatomic-principles-fundamentals', 'multiplechoice', 'In MRI, we refer to a radio-frequency transmission as a "radio-frequency…. _____________".', '{"A": "Vector", "B": "Spin Transmission", "C": "Pulse", "D": "Flip"}', 'C', 1, 24, null),
    (v_quiz_content_id, 'sub-26', 'subatomic-principles-fundamentals', 'multiplechoice', 'Spins placed in the XY transverse plane are initially:', '{"A": "Out-of-phase with each other", "B": "Phase coherent with each other", "C": "Precessing randomly", "D": "In the Z-direction"}', 'B', 1, 25, null),
    (v_quiz_content_id, 'sub-27', 'subatomic-principles-fundamentals', 'multiplechoice', 'Spins that absorbed the transmitted RF energy are termed:', '{"A": "Precessing", "B": "Wobbling", "C": "Excited", "D": "Dephased"}', 'C', 1, 26, null),
    (v_quiz_content_id, 'sub-28', 'subatomic-principles-fundamentals', 'multiplechoice', 'Spins in the _____________ plane can produce a radio signal that can be detected.', '{"A": "Transverse", "B": "Longitudinal", "C": "Anterior-Posterior", "D": "Left-Right"}', 'A', 1, 27, null),
    (v_quiz_content_id, 'sub-29', 'subatomic-principles-fundamentals', 'multiplechoice', 'In MRI, the resonant frequency and the Larmor frequency are:', '{"A": "The same", "B": "Opposite", "C": "Not related", "D": "Always weaker than the transmission frequency"}', 'A', 1, 28, null),
    (v_quiz_content_id, 'sub-30', 'subatomic-principles-fundamentals', 'multiplechoice', 'If the gyromagnetic ration of hydrogen is 42.6mHz and the resonant frequency transmitted to is 127.8mHz, the field strength of your MRI system is ________________.', '{"A": "0.5T", "B": "1.0T", "C": "1.5T", "D": "3.0T"}', 'D', 1, 29, null),
    (v_quiz_content_id, 'sub-31', 'subatomic-principles-fundamentals', 'truefalse', 'If two signals or waves are "in phase" they produce a stronger signal than individually.', '{"A": "True", "B": "False"}', 'A', 1, 30, null)
  ;

END $$;

