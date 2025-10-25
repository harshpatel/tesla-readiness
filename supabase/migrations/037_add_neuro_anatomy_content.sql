-- Migration: Add Cross Sectional Anatomy I - Neuro content
-- Includes video and 77 quiz questions (most with anatomical images)

DO $$
DECLARE
  v_section_id UUID;
  v_module_id UUID;
  v_video_content_id UUID;
  v_quiz_content_id UUID;
BEGIN
  -- Get section ID
  SELECT id INTO v_section_id FROM sections WHERE slug = 'phase1';
  
  -- Update existing module
  UPDATE modules
  SET
    title = '12 - Cross Sectional Anatomy I - Neuro',
    description = 'Master neuroanatomy through cross-sectional imaging. Learn to identify key brain structures, vessels, and pathology on axial, sagittal, and coronal MRI views.',
    icon = '🧠',
    is_published = true,
    is_locked = false,
    updated_at = NOW()
  WHERE section_id = v_section_id AND slug = 'cross-sectional-anatomy-neuro'
  RETURNING id INTO v_module_id;
  
  -- Insert video content
  INSERT INTO content_items (module_id, slug, title, description, type, icon, order_index, metadata, is_published)
  VALUES (
    v_module_id, 
    'introduction', 
    'Cross Sectional Anatomy: Neuro Overview', 
    'Comprehensive video covering brain and spine anatomy across all three orthogonal planes.', 
    'video', 
    '🎥', 
    1, 
    '{"videoUrl": "https://cffhrzzfhyotkbuuoayc.supabase.co/storage/v1/object/public/videos/12%20-%20Cross%20Sectional%20Anatomy%20I%20-%20Neuro.mp4"}', 
    true
  )
  RETURNING id INTO v_video_content_id;
  
  -- Insert quiz content
  INSERT INTO content_items (module_id, slug, title, description, type, icon, order_index, metadata, is_published)
  VALUES (
    v_module_id, 
    'neuro-anatomy-fundamentals', 
    'Neuro Anatomy Fundamentals', 
    'Test your knowledge of brain and spine anatomy through image-based identification.', 
    'quiz', 
    '📝', 
    2, 
    '{}', 
    true
  )
  RETURNING id INTO v_quiz_content_id;
  
  -- Insert or update quiz_sections
  INSERT INTO quiz_sections (key, title, description, icon, order_index)
  VALUES (
    'neuro-anatomy-fundamentals', 
    'Neuro Anatomy Fundamentals', 
    'Identify anatomical structures on cross-sectional brain and spine MRI images', 
    '🧠', 
    17
  )
  ON CONFLICT (key) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    updated_at = NOW();
  
  -- Insert quiz questions (77 total - anatomical identification focus)
  INSERT INTO quiz_questions (
    content_item_id, question_id, section_key, question_type, 
    question_text, answers, correct_answer, points, order_index, image_url
  ) VALUES 
    -- Q1: Orthogonal planes
    (v_quiz_content_id, 'neuro-q1', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'The three orthogonal planes mainly used in MRI are Axial, Sagittal and', 
    '{"A": "Coronal", "B": "Oblique", "C": "Simple Oblique", "D": "Complex Oblique"}', 'A', 1, 0, null),
    
    -- Q2: Slice direction
    (v_quiz_content_id, 'neuro-q2', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'If an Axial stack of images is acquired from inferior to superior, the slice direction is in the ___________ direction.', 
    '{"A": "X", "B": "Y", "C": "Z", "D": "None of the above"}', 'C', 1, 1, null),
    
    -- Q3: Simple oblique
    (v_quiz_content_id, 'neuro-q3', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'A simple oblique is an image that is prescribed from a(n) __________ image.', 
    '{"A": "simple oblique", "B": "complex oblique", "C": "orthogonal view", "D": "localizing or scout"}', 'C', 1, 2, null),
    
    -- Q4: Pathology - Multiple Sclerosis
    (v_quiz_content_id, 'neuro-q4', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'The pathology circled is most likely __________?', 
    '{"A": "metastasis", "B": "multiple sclerosis", "C": "infection", "D": "stroke"}', 'B', 1, 3, 'https://0cm.classmarker.com/10742032_KCGBGGD4.png'),
    
    -- Q5: Pathology - Ischemia
    (v_quiz_content_id, 'neuro-q5', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'The circled area seen here is ___________.', 
    '{"A": "tumor", "B": "ischemia", "C": "multiple sclerosis", "D": "migraine"}', 'B', 1, 4, 'https://0cm.classmarker.com/10742032_4CSMPC8D.png'),
    
    -- Q6: Disk herniation level
    (v_quiz_content_id, 'neuro-q6', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'The disk herniation seen here is at the level of ___________.', 
    '{"A": "C2-C3", "B": "C3-C4", "C": "C4-C5", "D": "C5-C6"}', 'D', 1, 5, 'https://0cm.classmarker.com/10742032_UJCTDPRE.png'),
    
    -- Image Set 1: HTP4QW7U (4 questions)
    (v_quiz_content_id, 'neuro-q7', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled A:', 
    '{"A": "Caudate Nucleus", "B": "Lateral ventricle", "C": "Cerebellum", "D": "Frontal Sinus"}', 'B', 1, 6, 'https://0cm.classmarker.com/10742032_HTP4QW7U.png'),
    
    (v_quiz_content_id, 'neuro-q8', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled B:', 
    '{"A": "Caudate Nucleus", "B": "Lateral ventricle", "C": "Cerebellum", "D": "Frontal Sinus"}', 'A', 1, 7, 'https://0cm.classmarker.com/10742032_HTP4QW7U.png'),
    
    (v_quiz_content_id, 'neuro-q9', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled C:', 
    '{"A": "Caudate Nucleus", "B": "Lateral ventricle", "C": "Cerebellum", "D": "Frontal Sinus"}', 'D', 1, 8, 'https://0cm.classmarker.com/10742032_HTP4QW7U.png'),
    
    (v_quiz_content_id, 'neuro-q10', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled D:', 
    '{"A": "Caudate Nucleus", "B": "Lateral ventricle", "C": "Cerebellum", "D": "Frontal Sinus"}', 'C', 1, 9, 'https://0cm.classmarker.com/10742032_HTP4QW7U.png'),
    
    -- Image Set 2: FHNA0ESY (6 questions)
    (v_quiz_content_id, 'neuro-q11', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled A:', 
    '{"A": "Fourth Ventricle", "B": "Thalamus", "C": "Sphenoid Sinus", "D": "Genu of the Corpus Callosum"}', 'D', 1, 10, 'https://0cm.classmarker.com/10742032_FHNA0ESY.png'),
    
    (v_quiz_content_id, 'neuro-q12', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled B:', 
    '{"A": "Fourth Ventricle", "B": "Corpus Callosum", "C": "Sphenoid Sinus", "D": "Genu of the Corpus Callosum"}', 'C', 1, 11, 'https://0cm.classmarker.com/10742032_FHNA0ESY.png'),
    
    (v_quiz_content_id, 'neuro-q13', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled C:', 
    '{"A": "Pons", "B": "Thalamus", "C": "Corpus Callosum", "D": "Genu of the Corpus Callosum"}', 'C', 1, 12, 'https://0cm.classmarker.com/10742032_FHNA0ESY.png'),
    
    (v_quiz_content_id, 'neuro-q14', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled D:', 
    '{"A": "Pons", "B": "Thalamus", "C": "Corpus Callosum", "D": "Genu of the Corpus Callosum"}', 'B', 1, 13, 'https://0cm.classmarker.com/10742032_FHNA0ESY.png'),
    
    (v_quiz_content_id, 'neuro-q15', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled E:', 
    '{"A": "Fourth Ventricle", "B": "Thalamus", "C": "Sphenoid Sinus", "D": "Genu of the Corpus Callosum"}', 'A', 1, 14, 'https://0cm.classmarker.com/10742032_FHNA0ESY.png'),
    
    (v_quiz_content_id, 'neuro-q16', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled F:', 
    '{"A": "Pons", "B": "Fourth Ventricle", "C": "Thalamus", "D": "Sphenoid Sinus"}', 'A', 1, 15, 'https://0cm.classmarker.com/10742032_FHNA0ESY.png'),
    
    -- Image Set 3: 542HMMXK (6 questions)
    (v_quiz_content_id, 'neuro-q17', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled A:', 
    '{"A": "Internal Carotid Artery", "B": "Optic Nerve", "C": "Basilar Artery", "D": "Orbital Globe"}', 'D', 1, 16, 'https://0cm.classmarker.com/10742032_542HMMXK.png'),
    
    (v_quiz_content_id, 'neuro-q18', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled B:', 
    '{"A": "Internal Carotid Artery", "B": "Optic Nerve", "C": "Basilar Artery", "D": "Orbital Globe"}', 'A', 1, 17, 'https://0cm.classmarker.com/10742032_542HMMXK.png'),
    
    (v_quiz_content_id, 'neuro-q19', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled C:', 
    '{"A": "Internal Carotid Artery", "B": "Optic Nerve", "C": "Basilar Artery", "D": "Orbital Globe"}', 'B', 1, 18, 'https://0cm.classmarker.com/10742032_542HMMXK.png'),
    
    (v_quiz_content_id, 'neuro-q20', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled D:', 
    '{"A": "Internal Carotid Artery", "B": "Basilar Artery", "C": "Cerebral Peduncle", "D": "Cerebral Aqueduct"}', 'B', 1, 19, 'https://0cm.classmarker.com/10742032_542HMMXK.png'),
    
    (v_quiz_content_id, 'neuro-q21', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled E:', 
    '{"A": "Internal Carotid Artery", "B": "Basilar Artery", "C": "Cerebral Peduncle", "D": "Cerebral Aqueduct"}', 'C', 1, 20, 'https://0cm.classmarker.com/10742032_542HMMXK.png'),
    
    (v_quiz_content_id, 'neuro-q22', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled F:', 
    '{"A": "Internal Carotid Artery", "B": "Basilar Artery", "C": "Cerebral Peduncle", "D": "Cerebral Aqueduct"}', 'D', 1, 21, 'https://0cm.classmarker.com/10742032_542HMMXK.png'),
    
    -- Image Set 4: 40OYCD2B (6 questions)
    (v_quiz_content_id, 'neuro-q23', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled A:', 
    '{"A": "Pituitary Gland", "B": "Medial Rectus Muscle", "C": "Ethmoid Sinus", "D": "Lateral Rectus Muscle"}', 'D', 1, 22, 'https://0cm.classmarker.com/10742032_40OYCD2B.png'),
    
    (v_quiz_content_id, 'neuro-q24', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled B:', 
    '{"A": "Pituitary Gland", "B": "Medial Rectus Muscle", "C": "Ethmoid Sinus", "D": "Lateral Rectus Muscle"}', 'C', 1, 23, 'https://0cm.classmarker.com/10742032_40OYCD2B.png'),
    
    (v_quiz_content_id, 'neuro-q25', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled C:', 
    '{"A": "Pituitary Gland", "B": "Medial Rectus Muscle", "C": "Ethmoid Sinus", "D": "Lateral Rectus Muscle"}', 'B', 1, 24, 'https://0cm.classmarker.com/10742032_40OYCD2B.png'),
    
    (v_quiz_content_id, 'neuro-q26', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled D:', 
    '{"A": "Sagittal Sinus", "B": "Vermis", "C": "Pituitary Gland", "D": "Ethmoid Sinus"}', 'C', 1, 25, 'https://0cm.classmarker.com/10742032_40OYCD2B.png'),
    
    (v_quiz_content_id, 'neuro-q27', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled E:', 
    '{"A": "Sagittal Sinus", "B": "Vermis", "C": "Pituitary Gland", "D": "Ethmoid Sinus"}', 'B', 1, 26, 'https://0cm.classmarker.com/10742032_40OYCD2B.png'),
    
    (v_quiz_content_id, 'neuro-q28', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled F:', 
    '{"A": "Sagittal Sinus", "B": "Vermis", "C": "Pituitary Gland", "D": "Ethmoid Sinus"}', 'A', 1, 27, 'https://0cm.classmarker.com/10742032_40OYCD2B.png'),
    
    -- Image Set 5: T5EPJWWJ (5 questions)
    (v_quiz_content_id, 'neuro-q29', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled A:', 
    '{"A": "White Matter", "B": "Splenium of Corpus Callosum", "C": "Caudate Nucleus", "D": "Choroid Plexus"}', 'C', 1, 28, 'https://0cm.classmarker.com/10742032_T5EPJWWJ.png'),
    
    (v_quiz_content_id, 'neuro-q30', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled B:', 
    '{"A": "White Matter", "B": "Posterior Horn - Lat Ventricle", "C": "Caudate Nucleus", "D": "Choroid Plexus"}', 'D', 1, 29, 'https://0cm.classmarker.com/10742032_T5EPJWWJ.png'),
    
    (v_quiz_content_id, 'neuro-q31', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled C:', 
    '{"A": "White Matter", "B": "Posterior Horn - Lat Ventricle", "C": "Caudate Nucleus", "D": "Choroid Plexus"}', 'A', 1, 30, 'https://0cm.classmarker.com/10742032_T5EPJWWJ.png'),
    
    (v_quiz_content_id, 'neuro-q32', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled D:', 
    '{"A": "Posterior Horn - Lat Ventricle", "B": "Splenium of Corpus Callosum", "C": "Caudate Nucleus", "D": "Choroid Plexus"}', 'A', 1, 31, 'https://0cm.classmarker.com/10742032_T5EPJWWJ.png'),
    
    (v_quiz_content_id, 'neuro-q33', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled E:', 
    '{"A": "Posterior Horn - Lat Ventricle", "B": "Splenium of Corpus Callosum", "C": "Caudate Nucleus", "D": "Choroid Plexus"}', 'B', 1, 32, 'https://0cm.classmarker.com/10742032_T5EPJWWJ.png'),
    
    -- Image Set 6: 0I7JCBKE (5 questions)
    (v_quiz_content_id, 'neuro-q34', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled A:', 
    '{"A": "Internal Auditory Canal", "B": "Gray Matter", "C": "Splenium of Corpus Callosum", "D": "Third Ventricle"}', 'C', 1, 33, 'https://0cm.classmarker.com/10742032_0I7JCBKE.png'),
    
    (v_quiz_content_id, 'neuro-q35', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled B:', 
    '{"A": "Pons", "B": "Internal Auditory Canal", "C": "Gray Matter", "D": "Third Ventricle"}', 'D', 1, 34, 'https://0cm.classmarker.com/10742032_0I7JCBKE.png'),
    
    (v_quiz_content_id, 'neuro-q36', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled C:', 
    '{"A": "Pons", "B": "Internal Auditory Canal", "C": "Gray Matter", "D": "Third Ventricle"}', 'B', 1, 35, 'https://0cm.classmarker.com/10742032_0I7JCBKE.png'),
    
    (v_quiz_content_id, 'neuro-q37', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled D:', 
    '{"A": "Pons", "B": "Internal Auditory Canal", "C": "Gray Matter", "D": "Third Ventricle"}', 'C', 1, 36, 'https://0cm.classmarker.com/10742032_0I7JCBKE.png'),
    
    (v_quiz_content_id, 'neuro-q38', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled E:', 
    '{"A": "Pons", "B": "Internal Auditory Canal", "C": "Gray Matter", "D": "Third Ventricle"}', 'A', 1, 37, 'https://0cm.classmarker.com/10742032_0I7JCBKE.png'),
    
    -- Image Set 7: FVIQXLMY (8 questions - C-spine sagittal)
    (v_quiz_content_id, 'neuro-q39', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled A:', 
    '{"A": "Clivus", "B": "C2", "C": "Cerebellar Tonsil", "D": "Spinous Process"}', 'A', 1, 38, 'https://0cm.classmarker.com/10742032_FVIQXLMY.png'),
    
    (v_quiz_content_id, 'neuro-q40', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled B:', 
    '{"A": "Clivus", "B": "C2", "C": "Cerebellar Tonsil", "D": "Medulla"}', 'D', 1, 39, 'https://0cm.classmarker.com/10742032_FVIQXLMY.png'),
    
    (v_quiz_content_id, 'neuro-q41', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled C:', 
    '{"A": "Clivus", "B": "C2", "C": "Cerebellar Tonsil", "D": "Medulla"}', 'B', 1, 40, 'https://0cm.classmarker.com/10742032_FVIQXLMY.png'),
    
    (v_quiz_content_id, 'neuro-q42', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled D:', 
    '{"A": "C2", "B": "Spinous Process", "C": "C5/C6 disc", "D": "Spinal Cord"}', 'C', 1, 41, 'https://0cm.classmarker.com/10742032_FVIQXLMY.png'),
    
    (v_quiz_content_id, 'neuro-q43', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled E:', 
    '{"A": "Clivus", "B": "C2", "C": "Cerebellar Tonsil", "D": "Spinous Process"}', 'C', 1, 42, 'https://0cm.classmarker.com/10742032_FVIQXLMY.png'),
    
    (v_quiz_content_id, 'neuro-q44', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled F:', 
    '{"A": "Medulla", "B": "C5/C6 disc", "C": "Spinal Cord", "D": "Ligamentum Flavum"}', 'C', 1, 43, 'https://0cm.classmarker.com/10742032_FVIQXLMY.png'),
    
    (v_quiz_content_id, 'neuro-q45', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled G:', 
    '{"A": "Clivus", "B": "C2", "C": "Cerebellar Tonsil", "D": "Spinous Process"}', 'D', 1, 44, 'https://0cm.classmarker.com/10742032_FVIQXLMY.png'),
    
    (v_quiz_content_id, 'neuro-q46', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled H:', 
    '{"A": "Cerebellar Tonsil", "B": "C5/C6 disc", "C": "Spinal Cord", "D": "Ligamentum Flavum"}', 'D', 1, 45, 'https://0cm.classmarker.com/10742032_FVIQXLMY.png'),
    
    -- Image Set 8: LJS4HP2L (5 questions - C-spine axial)
    (v_quiz_content_id, 'neuro-q47', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled A:', 
    '{"A": "Lamina", "B": "Spinal Cord", "C": "Jugular Vein", "D": "Spinous Process"}', 'C', 1, 46, 'https://0cm.classmarker.com/10742032_LJS4HP2L.png'),
    
    (v_quiz_content_id, 'neuro-q48', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled B:', 
    '{"A": "Lamina", "B": "Spinal Cord", "C": "Spinous Process", "D": "Vertebral Body"}', 'B', 1, 47, 'https://0cm.classmarker.com/10742032_LJS4HP2L.png'),
    
    (v_quiz_content_id, 'neuro-q49', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled C:', 
    '{"A": "Lamina", "B": "Spinal Cord", "C": "Spinous Process", "D": "Vertebral Body"}', 'A', 1, 48, 'https://0cm.classmarker.com/10742032_LJS4HP2L.png'),
    
    (v_quiz_content_id, 'neuro-q50', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled D:', 
    '{"A": "Lamina", "B": "Spinal Cord", "C": "Spinous Process", "D": "Vertebral Body"}', 'D', 1, 49, 'https://0cm.classmarker.com/10742032_LJS4HP2L.png'),
    
    (v_quiz_content_id, 'neuro-q51', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled E:', 
    '{"A": "Lamina", "B": "Spinal Cord", "C": "Spinous Process", "D": "Vertebral Body"}', 'C', 1, 50, 'https://0cm.classmarker.com/10742032_LJS4HP2L.png'),
    
    -- Image Set 9: UY08JES1 (4 questions - C-spine axial detail)
    (v_quiz_content_id, 'neuro-q52', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled A:', 
    '{"A": "Doral Nerve Root", "B": "Posterior Longitudinal Ligament", "C": "Vertebral Artery", "D": "CSF"}', 'C', 1, 51, 'https://0cm.classmarker.com/10742032_UY08JES1.png'),
    
    (v_quiz_content_id, 'neuro-q53', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled B:', 
    '{"A": "Doral Nerve Root", "B": "Posterior Longitudinal Ligament", "C": "Vertebral Artery", "D": "CSF"}', 'D', 1, 52, 'https://0cm.classmarker.com/10742032_UY08JES1.png'),
    
    (v_quiz_content_id, 'neuro-q54', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled C:', 
    '{"A": "Doral Nerve Root", "B": "Posterior Longitudinal Ligament", "C": "Vertebral Artery", "D": "CSF"}', 'B', 1, 53, 'https://0cm.classmarker.com/10742032_UY08JES1.png'),
    
    (v_quiz_content_id, 'neuro-q55', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled D:', 
    '{"A": "Doral Nerve Root", "B": "Posterior Longitudinal Ligament", "C": "Vertebral Artery", "D": "CSF"}', 'A', 1, 54, 'https://0cm.classmarker.com/10742032_UY08JES1.png'),
    
    -- Image Set 10: A39WNOW2 (4 questions - C-spine sagittal)
    (v_quiz_content_id, 'neuro-q56', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled A:', 
    '{"A": "Vertebral Body", "B": "Spinal Cord", "C": "CSF", "D": "Supraspinatus ligament"}', 'D', 1, 55, 'https://0cm.classmarker.com/10742032_A39WNOW2.png'),
    
    (v_quiz_content_id, 'neuro-q57', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled B:', 
    '{"A": "Vertebral Body", "B": "Spinal Cord", "C": "CSF", "D": "Supraspinatus ligament"}', 'C', 1, 56, 'https://0cm.classmarker.com/10742032_A39WNOW2.png'),
    
    (v_quiz_content_id, 'neuro-q58', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled C:', 
    '{"A": "Vertebral Body", "B": "Spinal Cord", "C": "CSF", "D": "Supraspinatus ligament"}', 'B', 1, 57, 'https://0cm.classmarker.com/10742032_A39WNOW2.png'),
    
    (v_quiz_content_id, 'neuro-q59', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled D:', 
    '{"A": "Vertebral Body", "B": "Spinal Cord", "C": "CSF", "D": "Supraspinatus ligament"}', 'A', 1, 58, 'https://0cm.classmarker.com/10742032_A39WNOW2.png'),
    
    -- Image Set 11: W7M4IEHL (3 questions - Lumbar axial)
    (v_quiz_content_id, 'neuro-q60', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled A:', 
    '{"A": "Facet Joint", "B": "Erector spinae muscle", "C": "Nerve Root", "D": "Spinous Process"}', 'B', 1, 59, 'https://0cm.classmarker.com/10742032_W7M4IEHL.png'),
    
    (v_quiz_content_id, 'neuro-q61', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled B:', 
    '{"A": "Facet Joint", "B": "Erector spinae muscle", "C": "Nerve Root", "D": "Spinous Process"}', 'A', 1, 60, 'https://0cm.classmarker.com/10742032_W7M4IEHL.png'),
    
    (v_quiz_content_id, 'neuro-q62', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled C:', 
    '{"A": "Facet Joint", "B": "Erector spinae muscle", "C": "Nerve Root", "D": "Spinous Process"}', 'C', 1, 61, 'https://0cm.classmarker.com/10742032_W7M4IEHL.png'),
    
    -- Image Set 12: GLJUD2W2 (7 questions - T-spine axial)
    (v_quiz_content_id, 'neuro-q63', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled A:', 
    '{"A": "Vertebral Body", "B": "Costovertebral Articulation", "C": "Transverse Process", "D": "Lamina"}', 'A', 1, 62, 'https://0cm.classmarker.com/10742032_GLJUD2W2.png'),
    
    (v_quiz_content_id, 'neuro-q64', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled B:', 
    '{"A": "Vertebral Body", "B": "Costovertebral Articulation", "C": "Transverse Process", "D": "Lamina"}', 'B', 1, 63, 'https://0cm.classmarker.com/10742032_GLJUD2W2.png'),
    
    (v_quiz_content_id, 'neuro-q65', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled C:', 
    '{"A": "Vertebral Body", "B": "Costovertebral Articulation", "C": "Transverse Process", "D": "Lamina"}', 'C', 1, 64, 'https://0cm.classmarker.com/10742032_GLJUD2W2.png'),
    
    (v_quiz_content_id, 'neuro-q66', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled D:', 
    '{"A": "Vertebral Body", "B": "Costovertebral Articulation", "C": "Transverse Process", "D": "Lamina"}', 'D', 1, 65, 'https://0cm.classmarker.com/10742032_GLJUD2W2.png'),
    
    (v_quiz_content_id, 'neuro-q67', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled E:', 
    '{"A": "Spinal Cord", "B": "Vertebral Body", "C": "Transverse Process", "D": "Lamina"}', 'A', 1, 66, 'https://0cm.classmarker.com/10742032_GLJUD2W2.png'),
    
    (v_quiz_content_id, 'neuro-q68', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled F:', 
    '{"A": "Rib", "B": "Vertebral Body", "C": "Transverse Process", "D": "Lamina"}', 'A', 1, 67, 'https://0cm.classmarker.com/10742032_GLJUD2W2.png'),
    
    (v_quiz_content_id, 'neuro-q69', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled G:', 
    '{"A": "Ligamentum Flavum", "B": "Vertebral Body", "C": "Transverse Process", "D": "Lamina"}', 'A', 1, 68, 'https://0cm.classmarker.com/10742032_GLJUD2W2.png'),
    
    -- Image Set 13: J26TC4WP (5 questions - L-spine sagittal)
    (v_quiz_content_id, 'neuro-q70', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled A:', 
    '{"A": "L4-L5 disc", "B": "Cauda Equina", "C": "L2 Vertebral Body", "D": "Spinous Process"}', 'B', 1, 69, 'https://0cm.classmarker.com/10742032_J26TC4WP.png'),
    
    (v_quiz_content_id, 'neuro-q71', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled B:', 
    '{"A": "L4-L5 disc", "B": "Cauda Equina", "C": "L2 Vertebral Body", "D": "Spinous Process"}', 'C', 1, 70, 'https://0cm.classmarker.com/10742032_J26TC4WP.png'),
    
    (v_quiz_content_id, 'neuro-q72', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled C:', 
    '{"A": "L4-L5 disc", "B": "S1 Vertebral Body", "C": "L2 Vertebral Body", "D": "Spinous Process"}', 'D', 1, 71, 'https://0cm.classmarker.com/10742032_J26TC4WP.png'),
    
    (v_quiz_content_id, 'neuro-q73', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled D:', 
    '{"A": "L4-L5 disc", "B": "S1 Vertebral Body", "C": "Cauda Equina", "D": "L2 Vertebral Body"}', 'A', 1, 72, 'https://0cm.classmarker.com/10742032_J26TC4WP.png'),
    
    (v_quiz_content_id, 'neuro-q74', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled E:', 
    '{"A": "L4-L5 disc", "B": "S1 Vertebral Body", "C": "L2 Vertebral Body", "D": "Spinous Process"}', 'B', 1, 73, 'https://0cm.classmarker.com/10742032_J26TC4WP.png'),
    
    -- Image Set 14: 7M7X3ZOU (7 questions - L-spine axial)
    (v_quiz_content_id, 'neuro-q75', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled A:', 
    '{"A": "Nerve Roots", "B": "Left Iliac Artery", "C": "Psoas Muscle", "D": "Neural Foramen"}', 'D', 1, 74, 'https://0cm.classmarker.com/10742032_7M7X3ZOU.png'),
    
    (v_quiz_content_id, 'neuro-q76', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled B:', 
    '{"A": "Nerve Roots", "B": "Spinous Process", "C": "Facet articulation", "D": "Lamina"}', 'A', 1, 75, 'https://0cm.classmarker.com/10742032_7M7X3ZOU.png'),
    
    (v_quiz_content_id, 'neuro-q77', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled C:', 
    '{"A": "Spinous Process", "B": "Psoas Muscle", "C": "Facet articulation", "D": "Lamina"}', 'A', 1, 76, 'https://0cm.classmarker.com/10742032_7M7X3ZOU.png'),
    
    (v_quiz_content_id, 'neuro-q78', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled D:', 
    '{"A": "Left Iliac Artery", "B": "Psoas Muscle", "C": "Facet articulation", "D": "Lamina"}', 'A', 1, 77, 'https://0cm.classmarker.com/10742032_7M7X3ZOU.png'),
    
    (v_quiz_content_id, 'neuro-q79', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled E:', 
    '{"A": "Spinous Process", "B": "Psoas Muscle", "C": "Facet articulation", "D": "Lamina"}', 'B', 1, 78, 'https://0cm.classmarker.com/10742032_7M7X3ZOU.png'),
    
    (v_quiz_content_id, 'neuro-q80', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled F:', 
    '{"A": "Psoas Muscle", "B": "Facet articulation", "C": "Lamina", "D": "Neural Foramen"}', 'B', 1, 79, 'https://0cm.classmarker.com/10742032_7M7X3ZOU.png'),
    
    (v_quiz_content_id, 'neuro-q81', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled G:', 
    '{"A": "Spinous Process", "B": "Facet articulation", "C": "Lamina", "D": "Neural Foramen"}', 'C', 1, 80, 'https://0cm.classmarker.com/10742032_7M7X3ZOU.png'),
    
    -- Image Set 15: ARI4Y1MC (3 questions - L-spine axial final)
    (v_quiz_content_id, 'neuro-q82', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled A:', 
    '{"A": "Transverse Process", "B": "Erector spinae muscle", "C": "Nerve Roots", "D": "Pedicle"}', 'B', 1, 81, 'https://0cm.classmarker.com/10742032_ARI4Y1MC.png'),
    
    (v_quiz_content_id, 'neuro-q83', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled B:', 
    '{"A": "Transverse Process", "B": "Erector spinae muscle", "C": "Nerve Roots", "D": "Pedicle"}', 'A', 1, 82, 'https://0cm.classmarker.com/10742032_ARI4Y1MC.png'),
    
    (v_quiz_content_id, 'neuro-q84', 'neuro-anatomy-fundamentals', 'multiplechoice', 
    'Identify the structure labeled C:', 
    '{"A": "Transverse Process", "B": "Erector spinae muscle", "C": "Nerve Roots", "D": "Pedicle"}', 'C', 1, 83, 'https://0cm.classmarker.com/10742032_ARI4Y1MC.png');
  
END $$;

