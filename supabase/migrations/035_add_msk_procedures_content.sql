-- Add content for 10 - MRI Procedures & Set Up III: MSK module
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
  WHERE section_id = v_section_id AND slug = 'mri-procedures-msk';

  IF v_module_id IS NULL THEN
    -- Create new module
    INSERT INTO modules (section_id, slug, title, description, icon, order_index, is_published, is_locked)
    VALUES (v_section_id, 'mri-procedures-msk', '10 - MRI Procedures & Set Up III: MSK', 'Master musculoskeletal MRI protocols including knee, hip, shoulder, elbow, and wrist positioning, landmarking, plane angulation, anatomical coverage, and structure identification', '🦴', 10, true, false)
    RETURNING id INTO v_module_id;
  ELSE
    -- Update existing module
    UPDATE modules
    SET
      title = '10 - MRI Procedures & Set Up III: MSK',
      description = 'Master musculoskeletal MRI protocols including knee, hip, shoulder, elbow, and wrist positioning, landmarking, plane angulation, anatomical coverage, and structure identification',
      icon = '🦴',
      is_published = true,
      is_locked = false,
      updated_at = NOW()
    WHERE id = v_module_id;
  END IF;

  -- Insert video content item
  INSERT INTO content_items (module_id, slug, title, description, type, icon, order_index, metadata, is_published)
  VALUES (v_module_id, 'introduction', 'MRI Procedures & Set Up III: MSK', 'Comprehensive guide to musculoskeletal MRI protocols covering positioning, landmarking, and anatomical identification for knee, hip, shoulder, elbow, and wrist imaging', 'video', '🎥', 1, '{"videoUrl": "https://cffhrzzfhyotkbuuoayc.supabase.co/storage/v1/object/public/videos/10%20-%20MRI%20Procedures%20&%20Set%20Up%20III%20-%20MSK.mp4"}', true)
  RETURNING id INTO v_video_content_id;

  -- Insert quiz content item
  INSERT INTO content_items (module_id, slug, title, description, type, icon, order_index, metadata, is_published)
  VALUES (v_module_id, 'msk-procedures-fundamentals', 'MSK Procedures Fundamentals', 'Test your knowledge of musculoskeletal MRI positioning, landmarking, and anatomical identification across all major joints.', 'quiz', '📝', 2, '{}', true)
  RETURNING id INTO v_quiz_content_id;

  -- Insert or update quiz_sections
  INSERT INTO quiz_sections (key, title, description, icon, order_index)
  VALUES ('msk-procedures-fundamentals', 'MSK Procedures Fundamentals', 'Master musculoskeletal MRI positioning and anatomy identification', '🦴', 0)
  ON CONFLICT (key) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    updated_at = NOW();

  -- Insert all 42 quiz questions (6 with images)
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
    -- General MSK questions
    (v_quiz_content_id, 'msk-1', 'msk-procedures-fundamentals', 'multiplechoice', 'An image that is T1 Weighted means that T1 contrast is maximized and ___________________ are minimized.', '{"A": "T2 and Proton Density contrast", "B": "T1 and T2 are minimized contrast", "C": "1.5T and 3.0T effects", "D": "Artifacts"}', 'A', 1, 0, null),
    (v_quiz_content_id, 'msk-2', 'msk-procedures-fundamentals', 'multiplechoice', 'Proton Density Weighting means the predominant contrast is based on:', '{"A": "A combination of T1 and T2", "B": "T1 contrast", "C": "T2 contrast", "D": "The difference between number of hydrogen-based protons in the tissues being imaged"}', 'D', 1, 1, null),
    (v_quiz_content_id, 'msk-3', 'msk-procedures-fundamentals', 'multiplechoice', 'MSK imaging can be challenging because it requires ________________.', '{"A": "High spatial resolution", "B": "High signal-to-noise ration", "C": "Precise positioning", "D": "All the above"}', 'D', 1, 2, null),
    
    -- Knee questions
    (v_quiz_content_id, 'msk-knee-1', 'msk-procedures-fundamentals', 'multiplechoice', 'Indications for MRI of the knee include all the following expect_____.', '{"A": "Internal derangement", "B": "Torn meniscus", "C": "Hip Pain", "D": "Tendon/Ligament tears"}', 'C', 1, 3, null),
    (v_quiz_content_id, 'msk-knee-2', 'msk-procedures-fundamentals', 'multiplechoice', 'Landmarking for a knee MRI is:', '{"A": "At the lateral femoral condyle", "B": "Parallel to both femoral condyles", "C": "At the base of the patella", "D": "At the apex of the patella"}', 'D', 1, 4, null),
    (v_quiz_content_id, 'msk-knee-3', 'msk-procedures-fundamentals', 'multiplechoice', 'The axial coverage for a knee MRI is from the __________________.', '{"A": "Top of the patella through the joint space", "B": "Inferior half of the femur to the superior half of the tibia", "C": "Top of the patella to the patellar tendon insertion", "D": "Mid patella through the lateral femoral condyle"}', 'C', 1, 5, null),
    (v_quiz_content_id, 'msk-knee-4', 'msk-procedures-fundamentals', 'multiplechoice', 'For a sagittal of the knee, angle ____________.', '{"A": "Parallel to the plane of the femoral condyles", "B": "Perpendicular to the plane of the femoral condyles", "C": "To the plane of the femur", "D": "To the plane of the tibia"}', 'B', 1, 6, null),
    
    -- Hip questions
    (v_quiz_content_id, 'msk-hip-1', 'msk-procedures-fundamentals', 'multiplechoice', 'Indications for MRI of the Hip include all the following except for ____________.', '{"A": "Generalized pain", "B": "Degenerative Joint Disease (DJD)", "C": "Incontinence", "D": "Avascular necrosis"}', 'C', 1, 7, null),
    (v_quiz_content_id, 'msk-hip-2', 'msk-procedures-fundamentals', 'multiplechoice', 'The landmark for a hip MRI is the _________________.', '{"A": "Greater Trochanter", "B": "Symphysis pubis", "C": "Iliac crest", "D": "½ between the iliac crest and the symphysis pubis"}', 'A', 1, 8, null),
    (v_quiz_content_id, 'msk-hip-3', 'msk-procedures-fundamentals', 'multiplechoice', 'The coronal coverage for the hip is from the ___________________.', '{"A": "Iliac crest through the symphysis pubis", "B": "Ramus through the symphysis pubis", "C": "Hamstring insertion through the acetabulum", "D": "Ramus through the acetabulum"}', 'C', 1, 9, null),
    (v_quiz_content_id, 'msk-hip-4', 'msk-procedures-fundamentals', 'multiplechoice', 'The axial coverage for the hip is from ____________________.', '{"A": "Above the acetabulum through the entire greater trochanter", "B": "The iliac crest through the entire greater trochanter", "C": "Above the acetabulum through the symphysis pubis", "D": "The iliac crest through the symphysis pubis"}', 'A', 1, 10, null),
    
    -- Hip anatomy with image (questions 12-15 reference same image)
    (v_quiz_content_id, 'msk-hip-anat-1', 'msk-procedures-fundamentals', 'multiplechoice', 'Label 1:', '{"A": "Obturator internus T.", "B": "Femoral head", "C": "Labrum", "D": "Ramus"}', 'C', 1, 11, 'https://0cm.classmarker.com/10742032_6YCKGTBN.png'),
    (v_quiz_content_id, 'msk-hip-anat-2', 'msk-procedures-fundamentals', 'multiplechoice', 'Label 2:', '{"A": "Ligamentum teres", "B": "Obturator internus T.", "C": "Labrum", "D": "Femoral head"}', 'D', 1, 12, 'https://0cm.classmarker.com/10742032_6YCKGTBN.png'),
    (v_quiz_content_id, 'msk-hip-anat-3', 'msk-procedures-fundamentals', 'multiplechoice', 'Label 3:', '{"A": "Ligamentum teres", "B": "Obturator internus T.", "C": "Labrum", "D": "Ramus"}', 'A', 1, 13, 'https://0cm.classmarker.com/10742032_6YCKGTBN.png'),
    (v_quiz_content_id, 'msk-hip-anat-4', 'msk-procedures-fundamentals', 'multiplechoice', 'Label 4:', '{"A": "Ligamentum teres", "B": "Obturator internus T.", "C": "Labrum", "D": "Femoral neck"}', 'B', 1, 14, 'https://0cm.classmarker.com/10742032_6YCKGTBN.png'),
    
    -- Knee anatomy with image (questions 16-19 reference same image)
    (v_quiz_content_id, 'msk-knee-anat-1', 'msk-procedures-fundamentals', 'multiplechoice', 'Label 1:', '{"A": "Patella", "B": "Anterior Cruciate L.", "C": "Patellar tendon", "D": "Quadriceps Tendon"}', 'D', 1, 15, 'https://0cm.classmarker.com/10742032_TMKX8DSA.png'),
    (v_quiz_content_id, 'msk-knee-anat-2', 'msk-procedures-fundamentals', 'multiplechoice', 'Label 2:', '{"A": "Quadriceps Tendon", "B": "Anterior Cruciate L.", "C": "Patellar tendon", "D": "Tibia"}', 'B', 1, 16, 'https://0cm.classmarker.com/10742032_TMKX8DSA.png'),
    (v_quiz_content_id, 'msk-knee-anat-3', 'msk-procedures-fundamentals', 'multiplechoice', 'Label 3:', '{"A": "Popliteal artery", "B": "Quadriceps Tendon", "C": "Anterior Cruciate L.", "D": "Patellar tendon"}', 'D', 1, 17, 'https://0cm.classmarker.com/10742032_TMKX8DSA.png'),
    (v_quiz_content_id, 'msk-knee-anat-4', 'msk-procedures-fundamentals', 'multiplechoice', 'Label 4:', '{"A": "Femur", "B": "Tibia", "C": "Patellar tendon", "D": "Patella"}', 'B', 1, 18, 'https://0cm.classmarker.com/10742032_TMKX8DSA.png'),
    
    -- Shoulder questions
    (v_quiz_content_id, 'msk-shoulder-1', 'msk-procedures-fundamentals', 'multiplechoice', 'Indications for a shoulder MRI include all the following expect _______.', '{"A": "Post operative follow up", "B": "Chest Pain", "C": "Tumor", "D": "Trauma"}', 'B', 1, 19, null),
    (v_quiz_content_id, 'msk-shoulder-2', 'msk-procedures-fundamentals', 'multiplechoice', 'Which of the following is the only indication for an MRI of the shoulder?', '{"A": "Neck pain", "B": "Headache", "C": "Meniscal tear", "D": "Rotator cuff tear"}', 'D', 1, 20, null),
    (v_quiz_content_id, 'msk-shoulder-3', 'msk-procedures-fundamentals', 'multiplechoice', 'When positioning a shoulder, the landmark is the _______________.', '{"A": "Humeral head", "B": "Superior aspect of the sternum", "C": "Clavicle", "D": "Mid-humeral shaft"}', 'A', 1, 21, null),
    (v_quiz_content_id, 'msk-shoulder-4', 'msk-procedures-fundamentals', 'multiplechoice', 'When positioning the shoulder, move the patient as far as possible to:', '{"A": "The affected side", "B": "The unaffected side", "C": "Wherever the patient is most comfortable"}', 'B', 1, 22, null),
    (v_quiz_content_id, 'msk-shoulder-5', 'msk-procedures-fundamentals', 'multiplechoice', 'When positioning the shoulder, the humerus and forearm should be:', '{"A": "In the same plane as the shoulder", "B": "Slightly anterior to the shoulder", "C": "Slightly posterior to the shoulder", "D": "Left in the most comfortable position for the patient"}', 'A', 1, 23, null),
    (v_quiz_content_id, 'msk-shoulder-6', 'msk-procedures-fundamentals', 'multiplechoice', 'The angulation for the oblique coronal plane of the shoulder is parallel to the____________________.', '{"A": "Biceps tendon", "B": "Supraspinatus tendon", "C": "Infraspinatus tendon", "D": "Angle of the glenoid"}', 'B', 1, 24, null),
    (v_quiz_content_id, 'msk-shoulder-7', 'msk-procedures-fundamentals', 'multiplechoice', 'The coverage for an axial of the shoulder must also include the entire:', '{"A": "Shoulder blade", "B": "Acromial-Clavicular (AC) joint", "C": "Sterna-Clavicular (SC) joint", "D": "Superior half the humeral shaft"}', 'B', 1, 25, null),
    
    -- Shoulder anatomy with image (questions 27-30 reference same image)
    (v_quiz_content_id, 'msk-shoulder-anat-1', 'msk-procedures-fundamentals', 'multiplechoice', 'Label 1:', '{"A": "Humeral head", "B": "Glenoid", "C": "Acromion process", "D": "Labrum"}', 'C', 1, 26, 'https://0cm.classmarker.com/10742032_7DPB8HOD.png'),
    (v_quiz_content_id, 'msk-shoulder-anat-2', 'msk-procedures-fundamentals', 'multiplechoice', 'Label 2:', '{"A": "Acromion process", "B": "Labrum", "C": "Biceps tendon", "D": "Glenoid"}', 'C', 1, 27, 'https://0cm.classmarker.com/10742032_7DPB8HOD.png'),
    (v_quiz_content_id, 'msk-shoulder-anat-3', 'msk-procedures-fundamentals', 'multiplechoice', 'Label 3:', '{"A": "Acromion process", "B": "Labrum", "C": "Biceps tendon", "D": "Glenoid"}', 'D', 1, 28, 'https://0cm.classmarker.com/10742032_7DPB8HOD.png'),
    (v_quiz_content_id, 'msk-shoulder-anat-4', 'msk-procedures-fundamentals', 'multiplechoice', 'Label 4:', '{"A": "Acromion process", "B": "Labrum", "C": "Biceps tendon", "D": "Glenoid"}', 'B', 1, 29, 'https://0cm.classmarker.com/10742032_7DPB8HOD.png'),
    
    -- Shoulder anatomy single image question
    (v_quiz_content_id, 'msk-shoulder-anat-5', 'msk-procedures-fundamentals', 'multiplechoice', 'The arrow identifies:', '{"A": "Humeral head", "B": "Glenoid", "C": "Biceps tendon", "D": "Supraspinatus tendon"}', 'D', 1, 30, 'https://0cm.classmarker.com/10742032_RWBDRCG9.png'),
    
    -- Elbow questions
    (v_quiz_content_id, 'msk-elbow-1', 'msk-procedures-fundamentals', 'multiplechoice', 'The elbow is comprised of the following bones:', '{"A": "Humerus, Ulna, Tibia", "B": "Ulna, Radius, Capitate", "C": "Radius, Ulna, Shoulder", "D": "Humerus, Ulna, Radius"}', 'D', 1, 31, null),
    (v_quiz_content_id, 'msk-elbow-2', 'msk-procedures-fundamentals', 'multiplechoice', 'An advantage for positioning the elbow by the side is greater patient comfort. A disadvantage is_________________:', '{"A": "Higher SAR", "B": "Respiratory motion artifacts", "C": "Lower magnetic field homogeneity", "D": "Longer scan times"}', 'C', 1, 32, null),
    (v_quiz_content_id, 'msk-elbow-3', 'msk-procedures-fundamentals', 'multiplechoice', 'The landmark for the elbow is:', '{"A": "Mid humerus", "B": "Mid radius", "C": "Mid ulna", "D": "Center of the elbow"}', 'D', 1, 33, null),
    (v_quiz_content_id, 'msk-elbow-4', 'msk-procedures-fundamentals', 'multiplechoice', 'For elbow imaging, it is essential to include the________________.', '{"A": "Triceps muscle", "B": "Biceps muscle", "C": "Biceps tendon insertion", "D": "Triceps ligament insertion"}', 'C', 1, 34, null),
    (v_quiz_content_id, 'msk-elbow-5', 'msk-procedures-fundamentals', 'multiplechoice', 'The angulation for a sagittal elbow is__________________.', '{"A": "Perpendicular to the plane of the lateral and medial condyles", "B": "Parallel to the plane of the lateral and medial condyles", "C": "Parallel to the plane of the humeral shaft", "D": "Perpendicular to the plane of the humeral shaft"}', 'A', 1, 35, null),
    
    -- Elbow anatomy with image (questions 37-40 reference same image)
    (v_quiz_content_id, 'msk-elbow-anat-1', 'msk-procedures-fundamentals', 'multiplechoice', 'Label 1:', '{"A": "Biceps tendon insertion", "B": "Trochlea", "C": "Olecranon process", "D": "Triceps tendon"}', 'D', 1, 36, 'https://0cm.classmarker.com/10742032_KAJK0HNL.png'),
    (v_quiz_content_id, 'msk-elbow-anat-2', 'msk-procedures-fundamentals', 'multiplechoice', 'Label 2:', '{"A": "Biceps tendon insertion", "B": "Trochlea", "C": "Olecranon process", "D": "Triceps tendon"}', 'C', 1, 37, 'https://0cm.classmarker.com/10742032_KAJK0HNL.png'),
    (v_quiz_content_id, 'msk-elbow-anat-3', 'msk-procedures-fundamentals', 'multiplechoice', 'Label 3:', '{"A": "Biceps tendon insertion", "B": "Trochlea", "C": "Olecranon process", "D": "Triceps tendon"}', 'B', 1, 38, 'https://0cm.classmarker.com/10742032_KAJK0HNL.png'),
    (v_quiz_content_id, 'msk-elbow-anat-4', 'msk-procedures-fundamentals', 'multiplechoice', 'Label 4:', '{"A": "Biceps tendon insertion", "B": "Trochlea", "C": "Olecranon process", "D": "Triceps tendon"}', 'A', 1, 39, 'https://0cm.classmarker.com/10742032_KAJK0HNL.png'),
    
    -- Wrist questions
    (v_quiz_content_id, 'msk-wrist-1', 'msk-procedures-fundamentals', 'multiplechoice', 'Which indication is specific only to wrist MRI?', '{"A": "Degenerative joint disease (DJD)", "B": "Arthritis", "C": "Trauma", "D": "Carpel tunnel syndrome"}', 'D', 1, 40, null),
    (v_quiz_content_id, 'msk-wrist-2', 'msk-procedures-fundamentals', 'multiplechoice', 'Landmark the wrist at ________________.', '{"A": "½\" distal to the wrist joint at the capitate bone", "B": "1\" proximal to the wrist joint at the capitate bone", "C": "The wrist joint", "D": "The center of the metacarpal bones"}', 'A', 1, 41, null)
  ;

END $$;

