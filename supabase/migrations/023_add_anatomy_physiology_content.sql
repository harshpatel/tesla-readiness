-- Add content to General Anatomy & Physiology module
-- This module already exists at order_index 3, we're adding the video and quiz content

DO $$
DECLARE
  v_section_id UUID;
  v_module_id UUID;
  v_video_id UUID;
  v_quiz_id UUID;
BEGIN
  -- Get Phase 1 section ID
  SELECT id INTO v_section_id FROM sections WHERE slug = 'phase1';
  
  -- Get the existing General Anatomy & Physiology module ID
  SELECT id INTO v_module_id FROM modules 
  WHERE section_id = v_section_id AND slug = 'general-anatomy-physiology';
  
  -- Update the module to be published
  UPDATE modules 
  SET 
    is_published = true,
    is_locked = false,
    updated_at = NOW()
  WHERE id = v_module_id;
  
  -- Insert video content item
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
    'introduction',
    'General Anatomy & Physiology Introduction',
    'Comprehensive overview of human anatomy and physiology fundamentals for MRI technologists',
    'video',
    '🎥',
    1,
    '{"videoUrl": "https://cffhrzzfhyotkbuuoayc.supabase.co/storage/v1/object/public/videos/General%20Anatomy%20&%20Physiology.mp4"}',
    true
  ) RETURNING id INTO v_video_id;
  
  -- Insert quiz content item
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
    'fundamentals',
    'Anatomy & Physiology Fundamentals',
    'Test your knowledge of basic anatomy and physiology concepts essential for MRI imaging',
    'quiz',
    '📝',
    2,
    '{}',
    true
  ) RETURNING id INTO v_quiz_id;
  
  -- Insert quiz questions
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
    (v_quiz_id, 'physiology-definition', 'fundamentals', 'multiplechoice', 
     'Physiology pertains to the _____________ of the body.',
     '{"a": "Structures", "b": "Functions", "c": "Diseases", "d": "Physical motion"}',
     'b', 1, 0),
     
    (v_quiz_id, 'pathology-definition', 'fundamentals', 'multiplechoice',
     'The study of diseases is ___________.',
     '{"a": "Anatomy", "b": "Physiology", "c": "Pathology", "d": "Infection Control"}',
     'c', 1, 1),
     
    (v_quiz_id, 'skeletal-function', 'fundamentals', 'multiplechoice',
     'A primary function of the skeletal system is ____________.',
     '{"a": "Protection", "b": "Movement", "c": "Communication", "d": "None of the above"}',
     'a', 1, 2),
     
    (v_quiz_id, 'tendons-location', 'fundamentals', 'truefalse',
     'True or False: Tendons are found in both the skeletal and muscular systems.',
     '{"a": "True", "b": "False"}',
     'a', 1, 3),
     
    (v_quiz_id, 'ligaments-connect', 'fundamentals', 'multiplechoice',
     'Ligaments connect ________ to _________.',
     '{"a": "Muscle, muscle", "b": "Bone, Bone", "c": "Muscle, Bone", "d": "Connective tissue, Epithelial tissue"}',
     'b', 1, 4),
     
    (v_quiz_id, 'cells-build', 'fundamentals', 'multiplechoice',
     'Groups of cells build ____________.',
     '{"a": "Organs", "b": "Systems", "c": "Structures", "d": "Tissue"}',
     'd', 1, 5),
     
    (v_quiz_id, 'mitochondrion-function', 'fundamentals', 'multiplechoice',
     'The mitochondrion on a cell produces __________ for a cell.',
     '{"a": "Oxygen", "b": "Nutrients", "c": "Energy", "d": "DNA"}',
     'c', 1, 6),
     
    (v_quiz_id, 'tissue-types', 'fundamentals', 'multiplechoice',
     'The four types of tissue in the body are Connective, Muscle, Nervous, and ____________.',
     '{"a": "Skeletal", "b": "Epithelial", "c": "Cartilage", "d": "Squamous"}',
     'b', 1, 7),
     
    (v_quiz_id, 'muscle-types', 'fundamentals', 'multiplechoice',
     'Three examples of muscle tissue are smooth muscle tissue, skeletal muscle tissue and __________ muscle tissue.',
     '{"a": "Connective", "b": "Cartilage", "c": "Cardiac", "d": "Circular"}',
     'c', 1, 8),
     
    (v_quiz_id, 'neuron-stimulus', 'fundamentals', 'multiplechoice',
     'The part of a neuron that receives stimulus is the ______________.',
     '{"a": "Dendrite", "b": "Axon", "c": "Synapse", "d": "Nucleus"}',
     'a', 1, 9),
     
    (v_quiz_id, 'cell-cycle', 'fundamentals', 'multiplechoice',
     'The life cycle of a cell is divided into 2 parts: __________ and cell division.',
     '{"a": "Interphase", "b": "Prophase", "c": "Metaphase", "d": "Mitosis"}',
     'a', 1, 10),
     
    (v_quiz_id, 'mitosis-definition', 'fundamentals', 'multiplechoice',
     'Mitosis is the division of the ______________.',
     '{"a": "Cell wall", "b": "Cytoplasm", "c": "Cell nucleus", "d": "Daughter cell"}',
     'c', 1, 11),
     
    (v_quiz_id, 'anatomical-position', 'fundamentals', 'multiplechoice',
     'In Anatomical Position the palms of the hand are placed____________.',
     '{"a": "Facing inward toward the body", "b": "Facing forward", "c": "Facing backward", "d": "Facing outward from the body"}',
     'b', 1, 12),
     
    (v_quiz_id, 'sagittal-plane', 'fundamentals', 'multiplechoice',
     'The Sagittal anatomical plane is ____________.',
     '{"a": "Superior-Inferior", "b": "Posterior-Anterior", "c": "Left-Right", "d": "Oblique"}',
     'c', 1, 13),
     
    (v_quiz_id, 'tarsal-bones', 'fundamentals', 'multiplechoice',
     'The tarsal bones are small bones found in the __________.',
     '{"a": "Wrist", "b": "Face", "c": "Knee", "d": "Foot"}',
     'd', 1, 14),
     
    (v_quiz_id, 'largest-organ', 'fundamentals', 'multiplechoice',
     'The largest internal organ of the human body is the ___________.',
     '{"a": "Skin", "b": "Liver", "c": "Brain", "d": "Lungs"}',
     'b', 1, 15),
     
    (v_quiz_id, 'abdomen-pelvis-organ', 'fundamentals', 'multiplechoice',
     'Of the organs listed below, which is contained in both the abdomen and the pelvis?',
     '{"a": "Abdominal aorta", "b": "Liver", "c": "Kidneys", "d": "Large bowel"}',
     'd', 1, 16),
     
    (v_quiz_id, 'cervical-vertebrae', 'fundamentals', 'multiplechoice',
     'The cervical spine has _____ vertebrae.',
     '{"a": "7", "b": "12", "c": "5", "d": "3-4"}',
     'a', 1, 17),
     
    (v_quiz_id, 'spinal-cord-end', 'fundamentals', 'multiplechoice',
     'The spinal cord generally ends near the ___________.',
     '{"a": "L5 level of the lumbar spine", "b": "C7-T1 level of the spine", "c": "T12-L1 level of the spine", "d": "Junction between the base of the skull and C1"}',
     'c', 1, 18),
     
    (v_quiz_id, 'nerve-roots-coccyx', 'fundamentals', 'truefalse',
     'True or False: Nerve roots travel through the coccyx and then down each leg.',
     '{"a": "True", "b": "False"}',
     'b', 1, 19);

END $$;

