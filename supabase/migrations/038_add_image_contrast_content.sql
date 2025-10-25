-- Migration: Add Image Contrast Mechanisms content
-- Includes video and 38 quiz questions covering image quality, T1/T2/PD weighting, TR/TE

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
    title = '13 - Image Contrast Mechanisms',
    description = 'Understand how T1, T2, and proton density weighting create image contrast. Master the relationship between TR, TE, and image appearance.',
    icon = '🎨',
    is_published = true,
    is_locked = false,
    updated_at = NOW()
  WHERE section_id = v_section_id AND slug = 'image-contrast-mechanisms'
  RETURNING id INTO v_module_id;
  
  -- Get or insert video content
  SELECT id INTO v_video_content_id FROM content_items 
  WHERE module_id = v_module_id AND slug = 'introduction';
  
  IF v_video_content_id IS NULL THEN
    INSERT INTO content_items (module_id, slug, title, description, type, icon, order_index, metadata, is_published)
    VALUES (
      v_module_id, 
      'introduction', 
      'Image Contrast Mechanisms Overview', 
      'Learn how TR and TE control image weighting and contrast in MRI.', 
      'video', 
      '🎥', 
      1, 
      '{"videoUrl": "https://cffhrzzfhyotkbuuoayc.supabase.co/storage/v1/object/public/videos/13%20-%20Image%20Contrast%20Mechanisms.mp4"}', 
      true
    )
    RETURNING id INTO v_video_content_id;
  END IF;
  
  -- Get or insert quiz content
  SELECT id INTO v_quiz_content_id FROM content_items 
  WHERE module_id = v_module_id AND slug = 'contrast-fundamentals';
  
  IF v_quiz_content_id IS NULL THEN
    INSERT INTO content_items (module_id, slug, title, description, type, icon, order_index, metadata, is_published)
    VALUES (
      v_module_id, 
      'contrast-fundamentals', 
      'Image Contrast Fundamentals', 
      'Test your understanding of T1, T2, PD weighting, TR, TE, and image quality parameters.', 
      'quiz', 
      '📝', 
      2, 
      '{}', 
      true
    )
    RETURNING id INTO v_quiz_content_id;
  END IF;
  
  -- Insert or update quiz_sections
  INSERT INTO quiz_sections (key, title, description, icon, order_index)
  VALUES (
    'contrast-fundamentals', 
    'Image Contrast Fundamentals', 
    'Master T1, T2, and proton density weighting concepts', 
    '🎨', 
    18
  )
  ON CONFLICT (key) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    updated_at = NOW();
  
  -- Insert quiz questions (38 total)
  INSERT INTO quiz_questions (
    content_item_id, question_id, section_key, question_type, 
    question_text, answers, correct_answer, points, order_index, image_url
  ) VALUES 
    -- Q1: Image quality attributes
    (v_quiz_content_id, 'contrast-q1', 'contrast-fundamentals', 'multiplechoice', 
    'Which characteristic below is not an attribute to defining image quality?', 
    '{"A": "Spatial resolution", "B": "Signal-to-Noise Ratio (SNR)", "C": "Image contrast", "D": "Scan time"}', 'D', 1, 0, null),
    
    -- Q2: Spatial resolution definition
    (v_quiz_content_id, 'contrast-q2', 'contrast-fundamentals', 'multiplechoice', 
    'Image sharpness or detail best describes ___________ ?', 
    '{"A": "Spatial resolution", "B": "Signal-to-Noise Ratio (SNR)", "C": "Image contrast", "D": "None above"}', 'A', 1, 1, null),
    
    -- Q3: High SNR with poor resolution
    (v_quiz_content_id, 'contrast-q3', 'contrast-fundamentals', 'truefalse', 
    'An image with high SNR but poor spatial resolution can be considered a "good" image.', 
    '{"A": "True", "B": "False"}', 'A', 1, 2, null),
    
    -- Q4: High resolution and SNR relationship
    (v_quiz_content_id, 'contrast-q4', 'contrast-fundamentals', 'truefalse', 
    'An image with high spatial resolution always as high SNR as well.', 
    '{"A": "True", "B": "False"}', 'B', 1, 3, null),
    
    -- Q5: Low resolution always repeated
    (v_quiz_content_id, 'contrast-q5', 'contrast-fundamentals', 'truefalse', 
    'An image with low spatial resolution always needs to be repeated.', 
    '{"A": "True", "B": "False"}', 'B', 1, 4, null),
    
    -- Q6: What doesn''t contribute to spatial resolution
    (v_quiz_content_id, 'contrast-q6', 'contrast-fundamentals', 'multiplechoice', 
    'Which of the following does not contribute to an image''s spatial resolution?', 
    '{"A": "Slice thickness", "B": "Voxel number", "C": "Field-of-View (FOV)", "D": "SNR"}', 'D', 1, 5, null),
    
    -- Q7: What contributes to contrast (multiple answers)
    (v_quiz_content_id, 'contrast-q7', 'contrast-fundamentals', 'multiplechoice', 
    'Which of the following contributes to an image''s contrast? (select all that apply)', 
    '{"A": "SNR", "B": "TE", "C": "TR", "D": "Phase and Frequency encoding"}', 'B,C', 1, 6, null),
    
    -- Q8: Image weighting definition
    (v_quiz_content_id, 'contrast-q8', 'contrast-fundamentals', 'multiplechoice', 
    'Maximizing one type of contrast while minimizing the other two is best described as:', 
    '{"A": "High spatial resolution", "B": "High SNR", "C": "Image Weighting", "D": "Image Contrast"}', 'C', 1, 7, null),
    
    -- Q9: T1 definition
    (v_quiz_content_id, 'contrast-q9', 'contrast-fundamentals', 'multiplechoice', 
    'A tissue''s T1 is defined as the time is takes for ____% of its __________ magnetization to recovery (or relax).', 
    '{"A": "63%, transverse", "B": "63%, longitudinal", "C": "37%, T2", "D": "37%, T1"}', 'B', 1, 8, null),
    
    -- Q10: T2 definition
    (v_quiz_content_id, 'contrast-q10', 'contrast-fundamentals', 'multiplechoice', 
    'A tissue''s T2 is defined as the time is takes for ____% of its __________ magnetization to decay (or relax).', 
    '{"A": "63%, transverse", "B": "63%, longitudinal", "C": "37%, T2", "D": "37%, T1"}', 'A', 1, 9, null),
    
    -- Q11: Proton density definition
    (v_quiz_content_id, 'contrast-q11', 'contrast-fundamentals', 'multiplechoice', 
    'The number of a tissue''s mobile protons that can contribute to signal is described as the tissue''s:', 
    '{"A": "T1", "B": "T2", "C": "Proton Density", "D": "Image Contrast"}', 'C', 1, 10, null),
    
    -- Q12: Image weighting identification (T1W image)
    (v_quiz_content_id, 'contrast-q12', 'contrast-fundamentals', 'multiplechoice', 
    'What is the most likely contrast of this image?', 
    '{"A": "T1 weighting", "B": "T2 weighting", "C": "Proton Density Weighting", "D": "High SNR"}', 'A', 1, 11, 'https://0cm.classmarker.com/10742032_YQR4BQEX.png'),
    
    -- Q13: Image weighting identification (T2W image)
    (v_quiz_content_id, 'contrast-q13', 'contrast-fundamentals', 'multiplechoice', 
    'What is the most likely contrast of this image?', 
    '{"A": "T1 weighting", "B": "T2 weighting", "C": "Proton density weighting", "D": "High SNR"}', 'B', 1, 12, 'https://0cm.classmarker.com/10742032_0AUI4E0N.png'),
    
    -- Q14: Curve identification (T1 curve)
    (v_quiz_content_id, 'contrast-q14', 'contrast-fundamentals', 'multiplechoice', 
    'Fig 1: Referring to Fig 1, this is a _____________ curve.', 
    '{"A": "T1", "B": "T2", "C": "Proton Density", "D": "All of the Above"}', 'A', 1, 13, 'https://0cm.classmarker.com/10742032_1W21OPKN.png'),
    
    -- Q15: Proton density from T1 curve
    (v_quiz_content_id, 'contrast-q15', 'contrast-fundamentals', 'multiplechoice', 
    'Fig 1: Referring to Fig 1, which tissue has the greater proton density?', 
    '{"A": "A", "B": "B", "C": "Cannot be determined by this graph", "D": "Tissue Density is the same"}', 'A', 1, 14, 'https://0cm.classmarker.com/10742032_1W21OPKN.png'),
    
    -- Q16: Shorter T1 from curve
    (v_quiz_content_id, 'contrast-q16', 'contrast-fundamentals', 'multiplechoice', 
    'Fig 1: Referring to Fig 1, which tissue has the shorter T1?', 
    '{"A": "A", "B": "B", "C": "Cannot be determined by this graph", "D": "Tissue Density is the same"}', 'A', 1, 15, 'https://0cm.classmarker.com/10742032_1W21OPKN.png'),
    
    -- Q17: T2 from T1 curve
    (v_quiz_content_id, 'contrast-q17', 'contrast-fundamentals', 'multiplechoice', 
    'Fig 1: Referring to Fig 1, which tissue has the shorter T2?', 
    '{"A": "A", "B": "B", "C": "Cannot be determined by this graph", "D": "Tissue Density is the same"}', 'C', 1, 16, 'https://0cm.classmarker.com/10742032_1W21OPKN.png'),
    
    -- Q18: T2 curve identification
    (v_quiz_content_id, 'contrast-q18', 'contrast-fundamentals', 'multiplechoice', 
    'Referring to Fig 2, this is a _____________ curve.', 
    '{"A": "T1", "B": "T2", "C": "Proton Density", "D": "All of the Above"}', 'B', 1, 17, 'https://0cm.classmarker.com/10742032_EO01FIMD.png'),
    
    -- Q19: T1 from T2 curve
    (v_quiz_content_id, 'contrast-q19', 'contrast-fundamentals', 'multiplechoice', 
    'Referring to Fig 2, which tissue has the shorter T1?', 
    '{"A": "A", "B": "B", "C": "Cannot be determined by this graph", "D": "T1 time is the same"}', 'C', 1, 18, 'https://0cm.classmarker.com/10742032_EO01FIMD.png'),
    
    -- Q20: Longer T2 from curve
    (v_quiz_content_id, 'contrast-q20', 'contrast-fundamentals', 'multiplechoice', 
    'Referring to Fig 2, which tissue has the longer T2?', 
    '{"A": "A", "B": "B", "C": "Cannot be determined by this graph", "D": "T2 time is the same"}', 'B', 1, 19, 'https://0cm.classmarker.com/10742032_EO01FIMD.png'),
    
    -- Q21: Proton density from T2 curve
    (v_quiz_content_id, 'contrast-q21', 'contrast-fundamentals', 'multiplechoice', 
    'Referring to Fig 2, which tissue has the greater proton density?', 
    '{"A": "A", "B": "B", "C": "Cannot be determined by this graph", "D": "Proton density is the same"}', 'C', 1, 20, 'https://0cm.classmarker.com/10742032_EO01FIMD.png'),
    
    -- Q22: Least contrast point
    (v_quiz_content_id, 'contrast-q22', 'contrast-fundamentals', 'multiplechoice', 
    'Fig 3: Referring to Fig 3, at what point in time is the least contrast between the 2 tissues?', 
    '{"A": "A", "B": "B", "C": "C", "D": "Cannot be determined"}', 'C', 1, 21, 'https://0cm.classmarker.com/10742032_GAPKG8KL.png'),
    
    -- Q23: Weighting at least contrast
    (v_quiz_content_id, 'contrast-q23', 'contrast-fundamentals', 'multiplechoice', 
    'Fig 3: Referring to Fig 3, given your answer to Q22, what is the most likely contrast weighting of the obtained image?', 
    '{"A": "T1W", "B": "T2W", "C": "PDW", "D": "Cannot be determined"}', 'C', 1, 22, 'https://0cm.classmarker.com/10742032_GAPKG8KL.png'),
    
    -- Q24: Sampling plane
    (v_quiz_content_id, 'contrast-q24', 'contrast-fundamentals', 'multiplechoice', 
    'Fig 3: To sample the signal in MRI, the spins must be in the ___________ plane.', 
    '{"A": "Longitudinal", "B": "Transverse", "C": "either", "D": "neither"}', 'B', 1, 23, 'https://0cm.classmarker.com/10742032_GAPKG8KL.png'),
    
    -- Q25: TR definition (multiple correct)
    (v_quiz_content_id, 'contrast-q25', 'contrast-fundamentals', 'multiplechoice', 
    'TR is: (Mark all that apply)', 
    '{"A": "Repetition Time", "B": "The time allowed to T1 recovery", "C": "The time allowed for T2 decay", "D": "The time from the beginning of one pulse sequence to the beginning of the next."}', 'A,B,D', 1, 24, null),
    
    -- Q26: TE definition (multiple correct)
    (v_quiz_content_id, 'contrast-q26', 'contrast-fundamentals', 'multiplechoice', 
    'TE is: (Mark all that apply)', 
    '{"A": "Time to Echo", "B": "The time allowed to T1 recovery", "C": "The time allowed for T2 decay", "D": "The time from the beginning of a pulse sequence until the generated echo signal."}', 'A,C,D', 1, 25, null),
    
    -- Q27: TE and SNR relationship
    (v_quiz_content_id, 'contrast-q27', 'contrast-fundamentals', 'truefalse', 
    'As TE increases, signal-to-noise ratio decreases.', 
    '{"A": "True", "B": "False"}', 'A', 1, 26, null),
    
    -- Q28: TR and SNR relationship
    (v_quiz_content_id, 'contrast-q28', 'contrast-fundamentals', 'truefalse', 
    'As TR increases, signal-to-noise ratio decreases.', 
    '{"A": "True", "B": "False"}', 'B', 1, 27, null),
    
    -- Q29: TR and T1 weighting
    (v_quiz_content_id, 'contrast-q29', 'contrast-fundamentals', 'truefalse', 
    'As TR increases, T1 weighting increases.', 
    '{"A": "True", "B": "False"}', 'B', 1, 28, null),
    
    -- Q30: Fat T1 time
    (v_quiz_content_id, 'contrast-q30', 'contrast-fundamentals', 'multiplechoice', 
    'Fat is bright on a T1W image because it has a _______________ T1 time.', 
    '{"A": "Short", "B": "Long", "C": "Moderate", "D": "No"}', 'A', 1, 29, null),
    
    -- Q31: CSF T1 time
    (v_quiz_content_id, 'contrast-q31', 'contrast-fundamentals', 'multiplechoice', 
    'Cerebral Spinal Fluid (CSF) is dark on a T1W image because it has a ________ T1 time.', 
    '{"A": "Short", "B": "Long", "C": "Moderate", "D": "No"}', 'B', 1, 30, null),
    
    -- Q32: CSF T2 time
    (v_quiz_content_id, 'contrast-q32', 'contrast-fundamentals', 'multiplechoice', 
    'Cerebral Spinal Fluid (CSF) is bright on a T2W image because it has a ________ T2 time.', 
    '{"A": "Short", "B": "Long", "C": "Moderate", "D": "No"}', 'B', 1, 31, null),
    
    -- Q33: Compact bone signal (multiple correct)
    (v_quiz_content_id, 'contrast-q33', 'contrast-fundamentals', 'multiplechoice', 
    'Compact bone is dark on both T1W and T2W imaging because: (Mark all that apply.)', 
    '{"A": "It has no mobile protons", "B": "It has no water", "C": "It has an exceptionally long T2", "D": "It has an exceptionally long T1"}', 'A,B', 1, 32, null),
    
    -- Q34: Three main contrast types
    (v_quiz_content_id, 'contrast-q34', 'contrast-fundamentals', 'multiplechoice', 
    'Choose the three main types of image contrast in MRI:', 
    '{"A": "Dark CSF, Bright Fat, Spatial resolution", "B": "T1, T2, Spatial resolution", "C": "TR, TE, Phase encoding", "D": "T1, T2, Proton Density"}', 'D', 1, 33, null),
    
    -- Q35: Four parts of pulse sequence
    (v_quiz_content_id, 'contrast-q35', 'contrast-fundamentals', 'multiplechoice', 
    'Choose the correct list of the four parts of any MRI pulse sequence.', 
    '{"A": "TR, TE, Phase encoding, Frequency Encoding", "B": "Slice excitation, Phase encoding, Echo generation, Frequency encoding", "C": "TR, TE, NEX/NSA, Echo generation", "D": "900 , 1800 , Phase encoding, Frequency encoding"}', 'B', 1, 34, null);
  
END $$;

