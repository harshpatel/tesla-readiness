-- Add content for 05 - Instrumentation I: Magnets module
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

  -- Update existing module 'instrumentation-magnets'
  UPDATE modules
  SET
    title = '05 - Instrumentation I: Magnets',
    description = 'Explore MRI magnet types, magnetic field principles, superconductive technology, cryogen systems, and the essential hardware components that create the imaging environment',
    icon = '🧲',
    is_published = true,
    is_locked = false,
    updated_at = NOW()
  WHERE section_id = v_section_id AND slug = 'instrumentation-magnets'
  RETURNING id INTO v_module_id;

  -- Insert video content item
  INSERT INTO content_items (module_id, slug, title, description, type, icon, order_index, metadata, is_published)
  VALUES (v_module_id, 'introduction', 'Instrumentation I: Magnets', 'Comprehensive overview of MRI magnet technology including superconductive, permanent, and resistive magnet systems', 'video', '🎥', 1, '{"videoUrl": "https://cffhrzzfhyotkbuuoayc.supabase.co/storage/v1/object/public/videos/05%20-%20Instrumentation%20I%20-%20Magnets.mp4"}', true)
  RETURNING id INTO v_video_content_id;

  -- Insert quiz content item
  INSERT INTO content_items (module_id, slug, title, description, type, icon, order_index, metadata, is_published)
  VALUES (v_module_id, 'instrumentation-magnets-fundamentals', 'Instrumentation & Magnets Fundamentals', 'Test your knowledge of MRI magnet types, magnetic field strength, superconductive systems, and essential MRI hardware components.', 'quiz', '📝', 2, '{}', true)
  RETURNING id INTO v_quiz_content_id;

  -- Insert or update quiz_sections
  INSERT INTO quiz_sections (key, title, description, icon, order_index)
  VALUES ('instrumentation-magnets-fundamentals', 'Instrumentation & Magnets Fundamentals', 'Master the technology and physics of MRI magnet systems', '🧲', 0)
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
    (v_quiz_content_id, 'inst-mag-1', 'instrumentation-magnets-fundamentals', 'multiplechoice', '10,000 Gauss is equivalent to:', '{"A": "0.5 Tesla", "B": "1.0 Tesla", "C": "1.5 Tesla", "D": "10 Tesla"}', 'B', 1, 0, null),
    (v_quiz_content_id, 'inst-mag-2', 'instrumentation-magnets-fundamentals', 'multiplechoice', 'In the absence of a magnetic field, the orientation, or "spins" of hydrogen protons are all:', '{"A": "aligned", "B": "Parallel and anti-parallel", "C": "random", "D": "fixed"}', 'C', 1, 1, null),
    (v_quiz_content_id, 'inst-mag-3', 'instrumentation-magnets-fundamentals', 'multiplechoice', 'As magnetic field strength increases, the number of protons that align in the parallel direction of the magnetic field vs the anti-parallel direction:', '{"A": "remains the same", "B": "increases", "C": "decreases", "D": "goes to zero"}', 'B', 1, 2, null),
    (v_quiz_content_id, 'inst-mag-4', 'instrumentation-magnets-fundamentals', 'multiplechoice', 'The summation of all the magnetic moments of individual spins along the same plane as the magnetic field is referred to as the:', '{"A": "Longitudinal magnetization vector", "B": "Transverse magnetization vector", "C": "Parallel vector", "D": "Anti-parallel vector"}', 'A', 1, 3, null),
    (v_quiz_content_id, 'inst-mag-5', 'instrumentation-magnets-fundamentals', 'multiplechoice', 'Of the 3 magnet types used in MRI, the one that is used the most is:', '{"A": "Superconductive", "B": "Permanent", "C": "Resistive (or electro)", "D": "Bar"}', 'A', 1, 4, null),
    (v_quiz_content_id, 'inst-mag-6', 'instrumentation-magnets-fundamentals', 'multiplechoice', 'Of the 3 magnet types used in MRI, which can be routinely turned on and off?', '{"A": "Superconductive", "B": "Permanent", "C": "Resistive (or electro)", "D": "Bar"}', 'C', 1, 5, null),
    (v_quiz_content_id, 'inst-mag-7', 'instrumentation-magnets-fundamentals', 'truefalse', 'True or False: The magnetic field strength of an MRI system can be determined by looking at its size.', '{"A": "True", "B": "False"}', 'B', 1, 6, null),
    (v_quiz_content_id, 'inst-mag-8', 'instrumentation-magnets-fundamentals', 'multiplechoice', 'Of the 3 magnet types used in MRI, which is mostly used in "open" designs?', '{"A": "Superconductive", "B": "Permanent", "C": "Resistive (or electro)", "D": "Bar"}', 'B', 1, 7, null),
    (v_quiz_content_id, 'inst-mag-9', 'instrumentation-magnets-fundamentals', 'multiplechoice', 'Of the 3 magnet types used in MRI, which can yield the highest magnetic field strength?', '{"A": "Superconductive", "B": "Permanent", "C": "Resistive (or electro)", "D": "Bar"}', 'A', 1, 8, null),
    (v_quiz_content_id, 'inst-mag-10', 'instrumentation-magnets-fundamentals', 'multiplechoice', 'Of the 3 magnet types used in MRI, which is heaviest?', '{"A": "Superconductive", "B": "Permanent", "C": "Resistive (or electro)", "D": "Bar"}', 'C', 1, 9, null),
    (v_quiz_content_id, 'inst-mag-11', 'instrumentation-magnets-fundamentals', 'multiplechoice', 'Of the 3 magnet types used in MRI, which accommodates the highest performance levels in image quality and speed?', '{"A": "Superconductive", "B": "Permanent", "C": "Resistive (or electro)", "D": "Bar"}', 'A', 1, 10, null),
    (v_quiz_content_id, 'inst-mag-12', 'instrumentation-magnets-fundamentals', 'multiplechoice', 'Of the 3 magnet types used in MRI, which requires special cooling to maintain its magnetic field?', '{"A": "Superconductive", "B": "Permanent", "C": "Resisitve (or electro)", "D": "Bar"}', 'A', 1, 11, null),
    (v_quiz_content_id, 'inst-mag-13', 'instrumentation-magnets-fundamentals', 'multiplechoice', 'In a superconductive magnet, electrical current flowing through the magnetic experiences:', '{"A": "virtually no resistance", "B": "no change on resistance", "C": "extreme resistance", "D": "extreme heat"}', 'A', 1, 12, null),
    (v_quiz_content_id, 'inst-mag-14', 'instrumentation-magnets-fundamentals', 'multiplechoice', 'The medium used to make a conductor superconductive is called a:', '{"A": "Dewar", "B": "Gradient", "C": "Alloy", "D": "Cryogen"}', 'D', 1, 13, null),
    (v_quiz_content_id, 'inst-mag-15', 'instrumentation-magnets-fundamentals', 'multiplechoice', 'The strong magnetic field produced by heavy electric current passing through a conductor is an example of:', '{"A": "Tesla''s Law", "B": "Faraday''s Law", "C": "Magnetic resonance", "D": "Electromagnetic resistance"}', 'B', 1, 14, null),
    (v_quiz_content_id, 'inst-mag-16', 'instrumentation-magnets-fundamentals', 'multiplechoice', 'Helium liquifies at -453°F (-2690C) which is equivalent to:', '{"A": "0 degrees Kelvin", "B": "4 degrees Kelvin", "C": "10 degrees Kelvin", "D": "2.69 degrees Kelvin"}', 'B', 1, 15, null),
    (v_quiz_content_id, 'inst-mag-17', 'instrumentation-magnets-fundamentals', 'multiplechoice', '0° Kelvin, the theoretical point where all molecular motion stops, is also referred to as:', '{"A": "0 degrees Celsius", "B": "null point", "C": "absolute zero", "D": "superconductivity"}', 'C', 1, 16, null),
    (v_quiz_content_id, 'inst-mag-18', 'instrumentation-magnets-fundamentals', 'multiplechoice', 'The process of liquid helium explosively turning gaseous is referred to as a:', '{"A": "quench", "B": "superconductivity", "C": "dephasing", "D": "ramping"}', 'A', 1, 17, null),
    (v_quiz_content_id, 'inst-mag-19', 'instrumentation-magnets-fundamentals', 'multiplechoice', 'All MRI systems have a transmitting antenna surrounding the patient referred to as the:', '{"A": "Cold Head", "B": "Body Coil", "C": "Array Processor", "D": "Surface Coil"}', 'B', 1, 18, null),
    (v_quiz_content_id, 'inst-mag-20', 'instrumentation-magnets-fundamentals', 'multiplechoice', 'The computer component that performs the mathematical reconstruction of MRI images is called the:', '{"A": "Fourier Transformation module", "B": "Array processor", "C": "Body coil", "D": "Gradient Subsystem"}', 'B', 1, 19, null),
    (v_quiz_content_id, 'inst-mag-21', 'instrumentation-magnets-fundamentals', 'multiplechoice', 'The mathematical reconstruction of an MRI image uses the ________________ process to create the image.', '{"A": "Fourier Transformation", "B": "Array Processing", "C": "RF Coil Subsystem", "D": "Cold Head"}', 'A', 1, 20, null)
  ;

END $$;

