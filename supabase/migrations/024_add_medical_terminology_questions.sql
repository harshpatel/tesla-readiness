-- Migration 024: Insert quiz questions for Medical Terminology
-- This migration inserts all quiz questions into the quiz_questions table

DO $$
DECLARE
  v_module_id UUID;
  v_fundamentals_content_id UUID;
  v_suffixes_content_id UUID;
  v_prefixes_content_id UUID;
  v_roots_content_id UUID;
  v_abbreviations_content_id UUID;
  v_positioning_content_id UUID;
BEGIN
  -- Get module ID for 'medical-terminology'
  SELECT m.id INTO v_module_id 
  FROM modules m
  JOIN sections s ON m.section_id = s.id
  WHERE m.slug = 'medical-terminology';

  IF v_module_id IS NULL THEN
    RAISE EXCEPTION 'Module medical-terminology not found';
  END IF;

  -- Insert or update quiz_sections for each section
  INSERT INTO quiz_sections (key, title, description, icon, order_index)
  VALUES ('fundamentals', 'Medical Terminology Fundamentals', 'Core concepts and building blocks of medical terminology', '📝', 0)
  ON CONFLICT (key) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    updated_at = NOW();

  INSERT INTO quiz_sections (key, title, description, icon, order_index)
  VALUES ('suffixes', 'Suffixes', 'Word endings that modify the meaning of medical terms', '📝', 1)
  ON CONFLICT (key) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    updated_at = NOW();

  INSERT INTO quiz_sections (key, title, description, icon, order_index)
  VALUES ('prefixes', 'Prefixes', 'Word beginnings that modify the meaning of medical terms', '📝', 2)
  ON CONFLICT (key) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    updated_at = NOW();

  INSERT INTO quiz_sections (key, title, description, icon, order_index)
  VALUES ('roots', 'Root Words', 'Core medical terms that form the basis of medical vocabulary', '📝', 3)
  ON CONFLICT (key) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    updated_at = NOW();

  INSERT INTO quiz_sections (key, title, description, icon, order_index)
  VALUES ('abbreviations', 'Medical Abbreviations', 'Common abbreviations used in medical settings', '📝', 4)
  ON CONFLICT (key) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    updated_at = NOW();

  INSERT INTO quiz_sections (key, title, description, icon, order_index)
  VALUES ('positioning', 'Patient Positioning', 'Anatomical positions and directional terms used in MRI', '📝', 5)
  ON CONFLICT (key) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    updated_at = NOW();


  -- Get or create content item for fundamentals
  SELECT id INTO v_fundamentals_content_id
  FROM content_items
  WHERE module_id = v_module_id AND slug = 'fundamentals' AND type = 'quiz';

  IF v_fundamentals_content_id IS NULL THEN
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
      'Medical Terminology Fundamentals',
      'Core concepts and building blocks of medical terminology',
      'quiz',
      '📝',
      1,
      '{}',
      true
    ) RETURNING id INTO v_fundamentals_content_id;
  END IF;

  -- Delete existing questions for this section (if any)
  DELETE FROM quiz_questions WHERE content_item_id = v_fundamentals_content_id;

  -- Insert questions for fundamentals
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
    (v_fundamentals_content_id, 'fund-1', 'fundamentals', 'multiplechoice', 'Medical terms are made of 4 parts including, Prefixes, Word Roots, Suffixes, and _____________.', '{"A":"Transitional Forms","B":"Combining Forms","C":"Singular Forms","D":"Plural Forms"}', 'B', 1, 0),
    (v_fundamentals_content_id, 'fund-2', 'fundamentals', 'multiplechoice', 'Which medical word part is described as indicating a body part?', '{"A":"Word Root","B":"Prefix","C":"Suffix","D":"None of the above"}', 'A', 1, 1),
    (v_fundamentals_content_id, 'fund-3', 'fundamentals', 'multiplechoice', 'Which medical word part is described as coming at the end of the main word part?', '{"A":"Word Root","B":"Prefix","C":"Suffix","D":"None of the above"}', 'C', 1, 2),
    (v_fundamentals_content_id, 'fund-4', 'fundamentals', 'multiplechoice', 'Which medical word part indicates location, time, number, status?', '{"A":"Word Root","B":"Prefix","C":"Suffix","D":"Combining Form"}', 'B', 1, 3),
    (v_fundamentals_content_id, 'fund-5', 'fundamentals', 'multiplechoice', 'The word root "carcin" refers to:', '{"A":"Canker","B":"Cranial","C":"Carpal","D":"Cancer"}', 'D', 1, 4),
    (v_fundamentals_content_id, 'fund-6', 'fundamentals', 'multiplechoice', 'The word part in a medical term that is meant to help with the pronunciation of 2 or more other word parts is called _______________.', '{"A":"Suffix","B":"Prefix","C":"Word Root","D":"Combining Form"}', 'D', 1, 5),
    (v_fundamentals_content_id, 'fund-7', 'fundamentals', 'multiplechoice', 'True / False: A Combining Form for a prefix and suffix is always a vowel.', '{"A":"True","B":"False"}', 'B', 1, 6),
    (v_fundamentals_content_id, 'fund-8', 'fundamentals', 'multiplechoice', 'Fill in the missing vowel: AEOU', '{"A":"Y","B":"C","C":"I","D":"L"}', 'C', 1, 7),
    (v_fundamentals_content_id, 'fund-9', 'fundamentals', 'multiplechoice', 'What word part changes a medical term to a noun or an adjective?', '{"A":"Word Root","B":"Prefix","C":"Suffix","D":"Combining Form"}', 'C', 1, 8),
    (v_fundamentals_content_id, 'fund-10', 'fundamentals', 'multiplechoice', 'The suffix "-ic", in "Hepatic" changes the Word Root to a(n) _____________.', '{"A":"Noun","B":"Adjective","C":"Adverb","D":"Conjunction"}', 'B', 1, 9),
    (v_fundamentals_content_id, 'fund-11', 'fundamentals', 'multiplechoice', 'Pericardium refers to the area:', '{"A":"Above the heart","B":"Below the heart","C":"Around the heart","D":"Inside the heart"}', 'C', 1, 10),
    (v_fundamentals_content_id, 'fund-12', 'fundamentals', 'multiplechoice', 'Hypodermic means:', '{"A":"Above the skin","B":"Under the skin","C":"Through the skin","D":"Around the skin"}', 'B', 1, 11),
    (v_fundamentals_content_id, 'fund-13', 'fundamentals', 'multiplechoice', 'A sharp rise or sudden onset is the definition of:', '{"A":"Fever","B":"Infection","C":"Chronic","D":"Acute"}', 'D', 1, 12),
    (v_fundamentals_content_id, 'fund-14', 'fundamentals', 'multiplechoice', 'Hepatis-C, a type of inflammation of the liver, is a(n) _____________ condition.', '{"A":"Chronic","B":"Cancerous","C":"Acute","D":"Hypodermic"}', 'A', 1, 13),
    (v_fundamentals_content_id, 'fund-15', 'fundamentals', 'multiplechoice', 'An immune system response that is marked by redness, pain, and/or swelling is ______________.', '{"A":"An infection","B":"Inflammation","C":"Dermatitis","D":"Acute"}', 'B', 1, 14),
    (v_fundamentals_content_id, 'fund-16', 'fundamentals', 'multiplechoice', 'True or False: A cough, for example, can sometimes be both a sign and a symptom.', '{"A":"True","B":"False"}', 'A', 1, 15),
    (v_fundamentals_content_id, 'fund-17', 'fundamentals', 'multiplechoice', 'In medical terms, the apex of a structure is _________ and the base is _________.', '{"A":"Wide, pointed","B":"Points up, points down","C":"Pointed, wide","D":"Points down, points up"}', 'C', 1, 16),
    (v_fundamentals_content_id, 'fund-18', 'fundamentals', 'multiplechoice', 'In MRI, the ___________ plane is used for imaging anatomy in the superior/inferior (or inferior/superior) direction.', '{"A":"Axial","B":"Sagittal","C":"Coronal","D":"Oblique"}', 'A', 1, 17),
    (v_fundamentals_content_id, 'fund-19', 'fundamentals', 'multiplechoice', 'The abbreviation "f/u" means_____________.', '{"A":"Forward and up","B":"Flu","C":"Food undigested","D":"Follow up"}', 'D', 1, 18),
    (v_fundamentals_content_id, 'fund-20', 'fundamentals', 'multiplechoice', 'The wrist is ___________ to the elbow.', '{"A":"Medial","B":"Lateral","C":"Distal","D":"Proximal"}', 'C', 1, 19);

  -- Get or create content item for suffixes
  SELECT id INTO v_suffixes_content_id
  FROM content_items
  WHERE module_id = v_module_id AND slug = 'suffixes' AND type = 'quiz';

  IF v_suffixes_content_id IS NULL THEN
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
      'suffixes',
      'Suffixes',
      'Word endings that modify the meaning of medical terms',
      'quiz',
      '📝',
      2,
      '{}',
      true
    ) RETURNING id INTO v_suffixes_content_id;
  END IF;

  -- Delete existing questions for this section (if any)
  DELETE FROM quiz_questions WHERE content_item_id = v_suffixes_content_id;

  -- Insert questions for suffixes
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
    (v_suffixes_content_id, 'suf-1', 'suffixes', 'multiplechoice', 'What does the suffix "-itis" mean?', '{"A":"Tumor","B":"Swelling","C":"Inflammation","D":"Infection"}', 'C', 1, 0),
    (v_suffixes_content_id, 'suf-2', 'suffixes', 'multiplechoice', 'The suffix "-ectomy" means:', '{"A":"Enlargement","B":"Removal","C":"Inflammation","D":"Repair"}', 'B', 1, 1),
    (v_suffixes_content_id, 'suf-3', 'suffixes', 'multiplechoice', 'The suffix "-algia" refers to:', '{"A":"Pain","B":"Growth","C":"Nerve","D":"Infection"}', 'A', 1, 2),
    (v_suffixes_content_id, 'suf-4', 'suffixes', 'multiplechoice', 'The suffix "-plasty" means:', '{"A":"Removal","B":"Study of","C":"Surgical repair","D":"Inflammation"}', 'C', 1, 3),
    (v_suffixes_content_id, 'suf-5', 'suffixes', 'multiplechoice', 'The suffix "-pathy" means:', '{"A":"Treatment","B":"Disease","C":"Pain","D":"Surgery"}', 'B', 1, 4),
    (v_suffixes_content_id, 'suf-6', 'suffixes', 'multiplechoice', 'What does the suffix "-ology" mean?', '{"A":"Study of","B":"Treatment of","C":"Fear of","D":"Disease of"}', 'A', 1, 5),
    (v_suffixes_content_id, 'suf-7', 'suffixes', 'multiplechoice', 'What does "-otomy" mean?', '{"A":"Removal","B":"Repair","C":"Incision or cutting into","D":"Disease"}', 'C', 1, 6),
    (v_suffixes_content_id, 'suf-8', 'suffixes', 'multiplechoice', 'The suffix "-megaly" means:', '{"A":"Pain","B":"Inflammation","C":"Disease","D":"Enlargement"}', 'D', 1, 7),
    (v_suffixes_content_id, 'suf-9', 'suffixes', 'multiplechoice', 'What does the suffix "-rrhea" mean?', '{"A":"Flow or discharge","B":"Pain","C":"Inflammation","D":"Swelling"}', 'A', 1, 8),
    (v_suffixes_content_id, 'suf-10', 'suffixes', 'multiplechoice', 'What does "-pnea" refer to?', '{"A":"Heart rate","B":"Blood pressure","C":"Breathing","D":"Pain"}', 'C', 1, 9),
    (v_suffixes_content_id, 'suf-11', 'suffixes', 'multiplechoice', 'What does the suffix "-scopy" mean?', '{"A":"Visual examination","B":"Surgical removal","C":"Disease","D":"Study of"}', 'A', 1, 10),
    (v_suffixes_content_id, 'suf-12', 'suffixes', 'multiplechoice', 'What does "-emia" refer to?', '{"A":"Bone","B":"Muscle","C":"Nerve","D":"Blood condition"}', 'D', 1, 11),
    (v_suffixes_content_id, 'suf-13', 'suffixes', 'multiplechoice', 'What does the suffix "-osis" mean?', '{"A":"Inflammation","B":"Abnormal condition","C":"Removal","D":"Pain"}', 'B', 1, 12),
    (v_suffixes_content_id, 'suf-14', 'suffixes', 'multiplechoice', 'The suffix "-gram" means:', '{"A":"Treatment","B":"Disease","C":"Inflammation","D":"Record or image"}', 'D', 1, 13),
    (v_suffixes_content_id, 'suf-15', 'suffixes', 'multiplechoice', 'What does the suffix "-rrhage" or "-rrhagia" mean?', '{"A":"Excessive bleeding","B":"Pain","C":"Swelling","D":"Inflammation"}', 'A', 1, 14),
    (v_suffixes_content_id, 'suf-16', 'suffixes', 'multiplechoice', 'What does "-stenosis" mean?', '{"A":"Enlargement","B":"Narrowing","C":"Rupture","D":"Inflammation"}', 'B', 1, 15),
    (v_suffixes_content_id, 'suf-17', 'suffixes', 'truefalse', 'The suffix "-lysis" means hardening.', '{"A":"True","B":"False"}', 'B', 1, 16),
    (v_suffixes_content_id, 'suf-18', 'suffixes', 'truefalse', 'The suffix "-centesis" means surgical puncture to remove fluid.', '{"A":"True","B":"False"}', 'A', 1, 17),
    (v_suffixes_content_id, 'suf-19', 'suffixes', 'truefalse', 'The suffix "-trophy" refers to growth or development.', '{"A":"True","B":"False"}', 'A', 1, 18);

  -- Get or create content item for prefixes
  SELECT id INTO v_prefixes_content_id
  FROM content_items
  WHERE module_id = v_module_id AND slug = 'prefixes' AND type = 'quiz';

  IF v_prefixes_content_id IS NULL THEN
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
      'prefixes',
      'Prefixes',
      'Word beginnings that modify the meaning of medical terms',
      'quiz',
      '📝',
      3,
      '{}',
      true
    ) RETURNING id INTO v_prefixes_content_id;
  END IF;

  -- Delete existing questions for this section (if any)
  DELETE FROM quiz_questions WHERE content_item_id = v_prefixes_content_id;

  -- Insert questions for prefixes
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
    (v_prefixes_content_id, 'pre-1', 'prefixes', 'multiplechoice', 'What does "hyper-" mean?', '{"A":"Below normal","B":"Equal","C":"Slow","D":"Above normal"}', 'D', 1, 0),
    (v_prefixes_content_id, 'pre-2', 'prefixes', 'multiplechoice', 'What does "hypo-" mean?', '{"A":"Above normal","B":"Below normal","C":"Fast","D":"Inflammation"}', 'B', 1, 1),
    (v_prefixes_content_id, 'pre-3', 'prefixes', 'multiplechoice', 'Which prefix means "slow"?', '{"A":"Tachy-","B":"Brady-","C":"Hyper-","D":"Hypo-"}', 'B', 1, 2),
    (v_prefixes_content_id, 'pre-4', 'prefixes', 'multiplechoice', 'What does "tachycardia" mean?', '{"A":"Slow breathing","B":"Fast heart rate","C":"High blood sugar","D":"Joint pain"}', 'B', 1, 3),
    (v_prefixes_content_id, 'pre-5', 'prefixes', 'multiplechoice', 'The prefix "leuko-" refers to:', '{"A":"Red","B":"White","C":"Blue","D":"Yellow"}', 'B', 1, 4),
    (v_prefixes_content_id, 'pre-6', 'prefixes', 'multiplechoice', 'What does "erythro-" mean?', '{"A":"Red","B":"White","C":"Yellow","D":"Blue"}', 'A', 1, 5),
    (v_prefixes_content_id, 'pre-7', 'prefixes', 'truefalse', '"Dys-" is a prefix that means difficult, painful, or abnormal.', '{"A":"True","B":"False"}', 'A', 1, 6),
    (v_prefixes_content_id, 'pre-8', 'prefixes', 'truefalse', 'The prefix "poly-" means one or single.', '{"A":"True","B":"False"}', 'B', 1, 7),
    (v_prefixes_content_id, 'pre-9', 'prefixes', 'truefalse', '"Macro-" means small.', '{"A":"True","B":"False"}', 'B', 1, 8),
    (v_prefixes_content_id, 'pre-10', 'prefixes', 'truefalse', 'The prefix "a-" or "an-" means without or absence of.', '{"A":"True","B":"False"}', 'A', 1, 9);

  -- Get or create content item for roots
  SELECT id INTO v_roots_content_id
  FROM content_items
  WHERE module_id = v_module_id AND slug = 'roots' AND type = 'quiz';

  IF v_roots_content_id IS NULL THEN
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
      'roots',
      'Root Words',
      'Core medical terms that form the basis of medical vocabulary',
      'quiz',
      '📝',
      4,
      '{}',
      true
    ) RETURNING id INTO v_roots_content_id;
  END IF;

  -- Delete existing questions for this section (if any)
  DELETE FROM quiz_questions WHERE content_item_id = v_roots_content_id;

  -- Insert questions for roots
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
    (v_roots_content_id, 'root-1', 'roots', 'multiplechoice', 'What does the root word "neuro-" mean?', '{"A":"Blood","B":"Nerve","C":"Bone","D":"Muscle"}', 'B', 1, 0),
    (v_roots_content_id, 'root-2', 'roots', 'multiplechoice', 'The prefix "gastro-" refers to:', '{"A":"Muscles","B":"Stomach","C":"Bones","D":"Skin"}', 'B', 1, 1),
    (v_roots_content_id, 'root-3', 'roots', 'multiplechoice', 'The prefix "derm-" refers to:', '{"A":"Skin","B":"Muscle","C":"Bone","D":"Blood"}', 'A', 1, 2),
    (v_roots_content_id, 'root-4', 'roots', 'multiplechoice', 'The prefix "hemo-" or "hema-" refers to:', '{"A":"Liver","B":"Brain","C":"Blood","D":"Muscle"}', 'C', 1, 3),
    (v_roots_content_id, 'root-5', 'roots', 'multiplechoice', '"Arthro-" refers to:', '{"A":"Muscle","B":"Bone","C":"Joint","D":"Skin"}', 'C', 1, 4),
    (v_roots_content_id, 'root-6', 'roots', 'multiplechoice', 'The prefix "nephro-" refers to which organ?', '{"A":"Liver","B":"Kidney","C":"Heart","D":"Lung"}', 'B', 1, 5),
    (v_roots_content_id, 'root-7', 'roots', 'multiplechoice', 'What does the root word "pulmo-" mean?', '{"A":"Liver","B":"Lungs","C":"Stomach","D":"Blood"}', 'B', 1, 6),
    (v_roots_content_id, 'root-8', 'roots', 'multiplechoice', 'The prefix "myo-" refers to:', '{"A":"Bone","B":"Muscle","C":"Blood","D":"Nerve"}', 'B', 1, 7),
    (v_roots_content_id, 'root-9', 'roots', 'multiplechoice', 'What does "cyto-" refer to?', '{"A":"Skin","B":"Liver","C":"Blood","D":"Cells"}', 'D', 1, 8),
    (v_roots_content_id, 'root-10', 'roots', 'multiplechoice', 'What does "cardio-" refer to?', '{"A":"Heart","B":"Lung","C":"Blood","D":"Vein"}', 'A', 1, 9),
    (v_roots_content_id, 'root-11', 'roots', 'multiplechoice', 'The prefix "rhino-" refers to:', '{"A":"Ear","B":"Throat","C":"Nose","D":"Eye"}', 'C', 1, 10),
    (v_roots_content_id, 'root-12', 'roots', 'multiplechoice', 'The prefix "encephalo-" refers to:', '{"A":"Brain","B":"Skull","C":"Spine","D":"Nerve"}', 'A', 1, 11),
    (v_roots_content_id, 'root-13', 'roots', 'multiplechoice', 'What does "chole-" or "cholo-" refer to?', '{"A":"Blood","B":"Kidney","C":"Bile","D":"Liver"}', 'C', 1, 12),
    (v_roots_content_id, 'root-14', 'roots', 'multiplechoice', 'The prefix "entero-" refers to:', '{"A":"Stomach","B":"Intestines","C":"Liver","D":"Pancreas"}', 'B', 1, 13),
    (v_roots_content_id, 'root-15', 'roots', 'multiplechoice', 'The prefix "ocul-" or "ophthalmo-" refers to:', '{"A":"Ear","B":"Nose","C":"Mouth","D":"Eye"}', 'D', 1, 14),
    (v_roots_content_id, 'root-16', 'roots', 'multiplechoice', 'The prefix "crani-" refers to:', '{"A":"Brain","B":"Skull","C":"Spine","D":"Neck"}', 'B', 1, 15),
    (v_roots_content_id, 'root-17', 'roots', 'multiplechoice', 'The prefix "thoraco-" refers to:', '{"A":"Abdomen","B":"Pelvis","C":"Chest","D":"Back"}', 'C', 1, 16),
    (v_roots_content_id, 'root-18', 'roots', 'multiplechoice', 'The prefix "pneumo-" refers to:', '{"A":"Lung or air","B":"Blood","C":"Heart","D":"Liver"}', 'A', 1, 17),
    (v_roots_content_id, 'root-19', 'roots', 'multiplechoice', 'The prefix "reno-" refers to which organ?', '{"A":"Liver","B":"Heart","C":"Kidney","D":"Spleen"}', 'C', 1, 18),
    (v_roots_content_id, 'root-20', 'roots', 'multiplechoice', 'What does "hystero-" or "utero-" refer to?', '{"A":"Ovary","B":"Uterus","C":"Fallopian tube","D":"Cervix"}', 'B', 1, 19),
    (v_roots_content_id, 'root-21', 'roots', 'multiplechoice', 'The prefix "colpo-" refers to:', '{"A":"Colon","B":"Uterus","C":"Vagina","D":"Bladder"}', 'C', 1, 20),
    (v_roots_content_id, 'root-22', 'roots', 'multiplechoice', 'The prefix "angio-" refers to:', '{"A":"Bone","B":"Muscle","C":"Nerve","D":"Blood vessel"}', 'D', 1, 21),
    (v_roots_content_id, 'root-23', 'roots', 'multiplechoice', 'The prefix "oophor-" refers to:', '{"A":"Uterus","B":"Cervix","C":"Ovary","D":"Fallopian tube"}', 'C', 1, 22),
    (v_roots_content_id, 'root-24', 'roots', 'truefalse', '"Hepato-" is a prefix related to the liver.', '{"A":"True","B":"False"}', 'A', 1, 23),
    (v_roots_content_id, 'root-25', 'roots', 'truefalse', '"Osteo-" refers to something related to bones.', '{"A":"True","B":"False"}', 'A', 1, 24),
    (v_roots_content_id, 'root-26', 'roots', 'truefalse', 'The prefix "path-" or "patho-" means disease.', '{"A":"True","B":"False"}', 'A', 1, 25),
    (v_roots_content_id, 'root-27', 'roots', 'truefalse', '"Cardi-" and "cardio-" both refer to the heart.', '{"A":"True","B":"False"}', 'A', 1, 26),
    (v_roots_content_id, 'root-28', 'roots', 'truefalse', '"Spondyl-" refers to the ribs.', '{"A":"True","B":"False"}', 'B', 1, 27);

  -- Get or create content item for abbreviations
  SELECT id INTO v_abbreviations_content_id
  FROM content_items
  WHERE module_id = v_module_id AND slug = 'abbreviations' AND type = 'quiz';

  IF v_abbreviations_content_id IS NULL THEN
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
      'abbreviations',
      'Medical Abbreviations',
      'Common abbreviations used in medical settings',
      'quiz',
      '📝',
      5,
      '{}',
      true
    ) RETURNING id INTO v_abbreviations_content_id;
  END IF;

  -- Delete existing questions for this section (if any)
  DELETE FROM quiz_questions WHERE content_item_id = v_abbreviations_content_id;

  -- Insert questions for abbreviations
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
    (v_abbreviations_content_id, 'abbr-1', 'abbreviations', 'multiplechoice', 'What does "BP" stand for?', '{"A":"Body Position","B":"Blood Pressure","C":"Body Part","D":"Breathing Pattern"}', 'B', 1, 0),
    (v_abbreviations_content_id, 'abbr-2', 'abbreviations', 'multiplechoice', 'What does "HR" stand for?', '{"A":"Heart Rate","B":"Hospital Record","C":"Health Report","D":"Human Resources"}', 'A', 1, 1),
    (v_abbreviations_content_id, 'abbr-3', 'abbreviations', 'multiplechoice', 'What does "CT" stand for in medical imaging?', '{"A":"Clinical Test","B":"Central Tissue","C":"Computed Tomography","D":"Cardiac Therapy"}', 'C', 1, 2),
    (v_abbreviations_content_id, 'abbr-4', 'abbreviations', 'multiplechoice', 'What does "MRI" stand for?', '{"A":"Medical Radiology Imaging","B":"Muscle Resonance Image","C":"Multiple Radio Images","D":"Magnetic Resonance Imaging"}', 'D', 1, 3),
    (v_abbreviations_content_id, 'abbr-5', 'abbreviations', 'multiplechoice', 'What does "NPO" mean?', '{"A":"Not Previously Ordered","B":"Nothing by mouth","C":"Normal Patient Order","D":"No Pain Observed"}', 'B', 1, 4),
    (v_abbreviations_content_id, 'abbr-6', 'abbreviations', 'multiplechoice', 'What does "PRN" mean?', '{"A":"As needed","B":"Prior to night","C":"Patient requires nurse","D":"Prescription renewal needed"}', 'A', 1, 5),
    (v_abbreviations_content_id, 'abbr-7', 'abbreviations', 'multiplechoice', 'What does "STAT" mean?', '{"A":"Standard Test","B":"Stop All Treatment","C":"Immediately","D":"Statistical Analysis"}', 'C', 1, 6),
    (v_abbreviations_content_id, 'abbr-8', 'abbreviations', 'multiplechoice', 'What does "IV" stand for?', '{"A":"Intravenous","B":"Internal Ventilation","C":"Intensive Visit","D":"Invasive Valve"}', 'A', 1, 7),
    (v_abbreviations_content_id, 'abbr-9', 'abbreviations', 'multiplechoice', 'What does "ICU" stand for?', '{"A":"Internal Care Unit","B":"Intensive Care Unit","C":"Immediate Clinical Unit","D":"Inpatient Cardiac Unit"}', 'B', 1, 8),
    (v_abbreviations_content_id, 'abbr-10', 'abbreviations', 'truefalse', '"DNR" stands for Do Not Resuscitate.', '{"A":"True","B":"False"}', 'A', 1, 9),
    (v_abbreviations_content_id, 'abbr-11', 'abbreviations', 'truefalse', '"OR" stands for Operating Room.', '{"A":"True","B":"False"}', 'A', 1, 10);

  -- Get or create content item for positioning
  SELECT id INTO v_positioning_content_id
  FROM content_items
  WHERE module_id = v_module_id AND slug = 'positioning' AND type = 'quiz';

  IF v_positioning_content_id IS NULL THEN
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
      'positioning',
      'Patient Positioning',
      'Anatomical positions and directional terms used in MRI',
      'quiz',
      '📝',
      6,
      '{}',
      true
    ) RETURNING id INTO v_positioning_content_id;
  END IF;

  -- Delete existing questions for this section (if any)
  DELETE FROM quiz_questions WHERE content_item_id = v_positioning_content_id;

  -- Insert questions for positioning
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
    (v_positioning_content_id, 'pos-1', 'positioning', 'multiplechoice', 'What does "anterior" mean?', '{"A":"Front","B":"Back","C":"Side","D":"Center"}', 'A', 1, 0),
    (v_positioning_content_id, 'pos-2', 'positioning', 'multiplechoice', 'What does "posterior" mean?', '{"A":"Front","B":"Back","C":"Above","D":"Below"}', 'B', 1, 1),
    (v_positioning_content_id, 'pos-3', 'positioning', 'multiplechoice', 'What does "superior" mean?', '{"A":"Below","B":"Front","C":"Above or directed upward","D":"Side"}', 'C', 1, 2),
    (v_positioning_content_id, 'pos-4', 'positioning', 'multiplechoice', 'What does "inferior" mean?', '{"A":"Above","B":"Front","C":"Side","D":"Below or directed downward"}', 'D', 1, 3),
    (v_positioning_content_id, 'pos-5', 'positioning', 'multiplechoice', 'What does "lateral" mean?', '{"A":"Midline","B":"Side, away from the middle","C":"Front","D":"Back"}', 'B', 1, 4),
    (v_positioning_content_id, 'pos-6', 'positioning', 'multiplechoice', 'What does "medial" mean?', '{"A":"Midline","B":"Side","C":"Above","D":"Below"}', 'A', 1, 5),
    (v_positioning_content_id, 'pos-7', 'positioning', 'multiplechoice', 'What does "proximal" mean?', '{"A":"Away from","B":"Outside","C":"Toward the center or at the point of attachment","D":"Inside"}', 'C', 1, 6),
    (v_positioning_content_id, 'pos-8', 'positioning', 'multiplechoice', 'What does "distal" mean?', '{"A":"Toward the center","B":"Away from","C":"Inside","D":"Outside"}', 'B', 1, 7),
    (v_positioning_content_id, 'pos-9', 'positioning', 'multiplechoice', 'What does "supine" position mean?', '{"A":"Standing","B":"Sitting","C":"Lying on the abdomen","D":"Lying on the back"}', 'D', 1, 8),
    (v_positioning_content_id, 'pos-10', 'positioning', 'multiplechoice', 'What does "prone" position mean?', '{"A":"Lying on the back","B":"Standing","C":"Lying on the abdomen","D":"Sitting"}', 'C', 1, 9),
    (v_positioning_content_id, 'pos-11', 'positioning', 'multiplechoice', 'What does "Trendelenburg" position mean?', '{"A":"Head positioned below the legs","B":"Head elevated","C":"Lying on side","D":"Standing straight"}', 'A', 1, 10),
    (v_positioning_content_id, 'pos-12', 'positioning', 'multiplechoice', 'What does "bilateral" mean?', '{"A":"One side","B":"Pertaining to both sides","C":"Front only","D":"Back only"}', 'B', 1, 11),
    (v_positioning_content_id, 'pos-13', 'positioning', 'multiplechoice', 'What does "cephalic" mean?', '{"A":"Chest","B":"Abdomen","C":"Feet","D":"Head"}', 'D', 1, 12),
    (v_positioning_content_id, 'pos-14', 'positioning', 'multiplechoice', 'What does "external" mean?', '{"A":"Outside","B":"Inside","C":"Above","D":"Below"}', 'A', 1, 13),
    (v_positioning_content_id, 'pos-15', 'positioning', 'multiplechoice', 'What does "internal" mean?', '{"A":"Outside","B":"Inside","C":"Front","D":"Back"}', 'B', 1, 14),
    (v_positioning_content_id, 'pos-16', 'positioning', 'multiplechoice', 'What does "flexion" mean?', '{"A":"Straightening","B":"Rotation","C":"Bending limb or body part at the joint","D":"Stretching"}', 'C', 1, 15),
    (v_positioning_content_id, 'pos-17', 'positioning', 'multiplechoice', 'What does "extension" mean?', '{"A":"Bring limb into a straight position","B":"Bending","C":"Rotation","D":"Turning"}', 'A', 1, 16),
    (v_positioning_content_id, 'pos-18', 'positioning', 'truefalse', '"Peripheral" means outside the central area.', '{"A":"True","B":"False"}', 'A', 1, 17),
    (v_positioning_content_id, 'pos-19', 'positioning', 'truefalse', '"Rotation" means turning about the axis.', '{"A":"True","B":"False"}', 'A', 1, 18),
    (v_positioning_content_id, 'pos-20', 'positioning', 'truefalse', '"Oblique" means perfectly straight or perpendicular.', '{"A":"True","B":"False"}', 'B', 1, 19);

  RAISE NOTICE 'Successfully inserted questions for Medical Terminology';
END $$;
