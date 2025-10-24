-- Add content for MRI Procedures & Set Up II: Body module
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

  -- Update existing module 'mri-procedures-body'
  UPDATE modules
  SET
    title = 'MRI Procedures & Set Up II: Body',
    description = 'Master musculoskeletal MRI protocols including knee, hip, shoulder, elbow, and wrist imaging with positioning, landmarks, and anatomical identification',
    icon = '🫁',
    is_published = true,
    is_locked = false,
    updated_at = NOW()
  WHERE section_id = v_section_id AND slug = 'mri-procedures-body'
  RETURNING id INTO v_module_id;

  -- Insert video content item
  INSERT INTO content_items (module_id, slug, title, description, type, icon, order_index, metadata, is_published)
  VALUES (v_module_id, 'introduction', 'MRI Procedures & Set Up II: Body', 'Comprehensive guide to body and musculoskeletal MRI procedures including extremity imaging protocols', 'video', '🎥', 1, '{"videoUrl": "https://cffhrzzfhyotkbuuoayc.supabase.co/storage/v1/object/public/videos/MRI%20Procedures%20&%20Set%20Up%20II%20-%20Body.mp4"}', true)
  RETURNING id INTO v_video_content_id;

  -- Insert quiz content item
  INSERT INTO content_items (module_id, slug, title, description, type, icon, order_index, metadata, is_published)
  VALUES (v_module_id, 'body-msk-fundamentals', 'Body & MSK Imaging Fundamentals', 'Test your knowledge on musculoskeletal MRI protocols, positioning, landmarks, and anatomical identification for extremities.', 'quiz', '📝', 2, '{}', true)
  RETURNING id INTO v_quiz_content_id;

  -- Insert or update quiz_sections
  INSERT INTO quiz_sections (key, title, description, icon, order_index)
  VALUES ('body-msk-fundamentals', 'Body & MSK Imaging Fundamentals', 'Master musculoskeletal imaging protocols and anatomy', '🦴', 0)
  ON CONFLICT (key) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    updated_at = NOW();

  -- Insert quiz questions (42 total questions)
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
    hint, 
    explanation,
    image_url
  ) VALUES 
    -- Question 1: T1 weighting basics
    (v_quiz_content_id, 'body-t1-weighting', 'body-msk-fundamentals', 'multiplechoice', 'An image that is T1 Weighted means that T1 contrast is maximized and ___________________ are minimized.', '{"A": "T2 and Proton Density contrast", "B": "T1 and T2 are minimized contrast", "C": "1.5T and 3.0T effects", "D": "Artifacts"}', 'A', 1, 0,
    'When you MAX one type of contrast, you MIN the others!',
    '**T1-weighted = MAX T1, MIN T2 & PD!** ⚖️\n\n💡 **Remember it:** Think of a seesaw! When T1 contrast is UP (maximized), T2 and Proton Density contrast are DOWN (minimized). You can''t have everything maxed at once! T1-weighted images show great ANATOMY (fat is bright, water is dark). To get pure T1 weighting, you use short TR and short TE to MINIMIZE T2 and PD effects. It''s like turning up the volume on one instrument while turning down the others!',
    null),

    -- Question 2: Proton Density weighting
    (v_quiz_content_id, 'body-pd-weighting', 'body-msk-fundamentals', 'multiplechoice', 'Proton Density Weighting means the predominant contrast is based on:', '{"A": "A combination of T1 and T2", "B": "T1 contrast", "C": "T2 contrast", "D": "The difference between number of hydrogen-based protons in the tissues being imaged"}', 'D', 1, 1,
    'PD = PROTON DENSITY = counting hydrogen atoms!',
    '**Proton Density = How many H atoms!** 🧲\n\n💡 **Remember it:** PD (Proton Density) weighting is ALL ABOUT counting hydrogen! Tissues with MORE hydrogen protons = BRIGHTER. Tissues with FEWER = DARKER. It''s not about T1 relaxation or T2 relaxation - it''s about the CONCENTRATION of protons! Think of it like counting how many people are in a room - more people = brighter signal. Water and fat both have lots of hydrogen, so they''re bright on PD. Cortical bone has few protons, so it''s dark. Pure head count!',
    null),

    -- Question 3: MSK imaging challenges
    (v_quiz_content_id, 'body-msk-challenges', 'body-msk-fundamentals', 'multiplechoice', 'MSK imaging can be challenging because it requires ________________.', '{"A": "High spatial resolution", "B": "High signal-to-noise ratio", "C": "Precise positioning", "D": "All the above"}', 'D', 1, 2,
    'MSK = DETAIL + CLARITY + ACCURACY = ALL of them!',
    '**MSK needs it ALL!** 🎯\n\n💡 **Remember it:** MSK (MusculoSKeletal) imaging is PICKY! (1) HIGH SPATIAL RESOLUTION - tiny structures like meniscus tears, ligament fibers, cartilage defects need DETAIL! Small FOV, thin slices, high matrix. (2) HIGH SNR - good signal-to-noise so you can SEE those tiny structures clearly! Use surface coils, optimize TR/TE. (3) PRECISE POSITIONING - if the knee is rotated, you can''t see the ACL properly! Everything must be PERFECT. MSK = the perfectionist of MRI!',
    null),

    -- KNEE SECTION (Questions 4-10)
    -- Question 4: Knee indications
    (v_quiz_content_id, 'body-knee-indications', 'body-msk-fundamentals', 'multiplechoice', 'Indications for MRI of the knee include all the following except_____.', '{"A": "Internal derangement", "B": "Torn meniscus", "C": "Hip Pain", "D": "Tendon/Ligament tears"}', 'C', 1, 3,
    'Hip pain = wrong joint!',
    '**Hip pain is NOT a knee indication!** 🦵\n\n💡 **Remember it:** HIP PAIN = scan the HIP, not the knee! Internal derangement (stuff broken inside the knee), torn meniscus (cartilage cushion tear), and tendon/ligament tears (ACL, PCL, MCL, LCL, patellar tendon) are all KNEE problems. But hip pain? That''s coming from the HIP JOINT (femoral head/acetabulum), not the knee! Don''t scan the wrong body part - hip ≠ knee!',
    null),

    -- Question 5: Knee landmark
    (v_quiz_content_id, 'body-knee-landmark', 'body-msk-fundamentals', 'multiplechoice', 'Landmarking for a knee MRI is:', '{"A": "At the lateral femoral condyle", "B": "Parallel to both femoral condyles", "C": "At the base of the patella", "D": "At the apex of the patella"}', 'D', 1, 4,
    'The APEX = the pointy TIP of the kneecap!',
    '**Apex of the patella = knee landmark!** 🦵\n\n💡 **Remember it:** APEX = the pointy TIP (top) of the patella (kneecap)! Touch the top of your kneecap - that''s the apex. This gets you centered on the knee joint. Not the BASE (bottom) of the patella - that''s too low. Not the femoral condyles - those are above the joint. The APEX is the perfect reference point because it''s right at the level of the joint space. Think: A-PEX = A-POINT at the top!',
    null),

    -- Question 6: Knee axial coverage
    (v_quiz_content_id, 'body-knee-coverage', 'body-msk-fundamentals', 'multiplechoice', 'The axial coverage for a knee MRI is from the __________________.', '{"A": "Top of the patella through the joint space", "B": "Inferior half of the femur to the superior half of the tibia", "C": "Top of the patella to the patellar tendon insertion", "D": "Mid patella through the lateral femoral condyle"}', 'C', 1, 5,
    'Start at the TOP, end at the INSERTION point below!',
    '**Top of patella ➡️ patellar tendon insertion!** 📐\n\n💡 **Remember it:** For knee axial coverage, start at the TOP of the kneecap (patella) and go all the way down to where the patellar tendon INSERTS on the tibial tubercle (that bump below the knee). This captures the ENTIRE patellofemoral joint (kneecap area) AND the tibiofemoral joint (main knee joint) AND the patellar tendon. You want to see it ALL - from the top of the cap to where the tendon attaches below. Complete coverage!',
    null),

    -- Question 7: Knee sagittal angle
    (v_quiz_content_id, 'body-knee-sagittal-angle', 'body-msk-fundamentals', 'multiplechoice', 'For a sagittal of the knee, angle ____________.', '{"A": "Parallel to the plane of the femoral condyles", "B": "Perpendicular to the plane of the femoral condyles", "C": "To the plane of the femur", "D": "To the plane of the tibia"}', 'B', 1, 6,
    'PERPENDICULAR = 90° = cutting ACROSS!',
    '**Perpendicular to the condyles!** ✂️\n\n💡 **Remember it:** PERPENDICULAR = 90° angle = cutting ACROSS! The femoral condyles (the two rounded bumps at the bottom of the femur) run side-to-side. For sagittal knee images, you want to angle PERPENDICULAR (across) to those condyles, so your slices go front-to-back through the knee. This shows the ACL, PCL, menisci, and patellar tendon in their proper planes. NOT parallel (that would be sideways). Think: slicing a bagel from front to back!',
    null),

    -- Questions 8-11: Knee anatomy labeling (sagittal) - Uses image 10742032_TMKX8DSA.png
    (v_quiz_content_id, 'body-knee-label-1', 'body-msk-fundamentals', 'multiplechoice', 'In this sagittal knee MRI, what structure is labeled as #1?', '{"A": "Patella", "B": "Anterior Cruciate L.", "C": "Patellar tendon", "D": "Quadriceps Tendon"}', 'D', 1, 7,
    'It''s ABOVE the patella - the muscle''s tendon!',
    '**Quadriceps Tendon** = above the kneecap! 💪\n\n💡 **Remember it:** QUADRICEPS TENDON sits RIGHT ABOVE the patella (kneecap)! It''s where your QUAD muscles (front of thigh) attach to the TOP of the kneecap. Think of the flow: Quadriceps muscle ➡️ Quadriceps TENDON ➡️ Patella (kneecap) ➡️ Patellar TENDON ➡️ Tibial tubercle. The quadriceps tendon pulls the kneecap UP to straighten your leg. On sagittal MRI, it''s that dark band above the bright kneecap!',
    'https://0cm.classmarker.com/10742032_TMKX8DSA.png'),

    (v_quiz_content_id, 'body-knee-label-2', 'body-msk-fundamentals', 'multiplechoice', 'In this sagittal knee MRI, what structure is labeled as #2?', '{"A": "Quadriceps Tendon", "B": "Anterior Cruciate L.", "C": "Patellar tendon", "D": "Tibia"}', 'B', 1, 8,
    'It''s the ligament going from front-up to back-down inside the joint!',
    '**Anterior Cruciate Ligament (ACL)!** 🎗️\n\n💡 **Remember it:** ACL = the ligament that goes diagonally inside the knee! On sagittal MRI, it looks like a dark band running from the ANTERIOR (front) tibia going UP and BACK to the posterior femur. The ACL PREVENTS the tibia from sliding forward. It''s the most commonly TORN ligament in sports (basketball, soccer, skiing). Think: ACL = Anterior (front) Cruciate (cross-shaped) Ligament - it literally crosses inside your knee!',
    'https://0cm.classmarker.com/10742032_TMKX8DSA.png'),

    (v_quiz_content_id, 'body-knee-label-3', 'body-msk-fundamentals', 'multiplechoice', 'In this sagittal knee MRI, what structure is labeled as #3?', '{"A": "Popliteal artery", "B": "Quadriceps Tendon", "C": "Anterior Cruciate L.", "D": "Patellar tendon"}', 'D', 1, 9,
    'It''s BELOW the patella - connects kneecap to shin!',
    '**Patellar Tendon** = below the kneecap! 🦵\n\n💡 **Remember it:** PATELLAR TENDON is the continuation BELOW the patella (kneecap)! It connects the bottom of the kneecap to the tibial tubercle (that bump on your shin). On sagittal MRI, it''s that dark band running from the bottom of the bright kneecap down to the tibia. This is what you HIT when doctors test your knee reflex! When the quadriceps contract, they pull the patellar tendon, which pulls the tibia forward, straightening your leg. Patellar tendon = kneecap''s connection to the shin!',
    'https://0cm.classmarker.com/10742032_TMKX8DSA.png'),

    (v_quiz_content_id, 'body-knee-label-4', 'body-msk-fundamentals', 'multiplechoice', 'In this sagittal knee MRI, what structure is labeled as #4?', '{"A": "Femur", "B": "Tibia", "C": "Patellar tendon", "D": "Patella"}', 'B', 1, 10,
    'It''s the shin bone - below the joint!',
    '**Tibia** = the shin bone! 🦴\n\n💡 **Remember it:** TIBIA = the BIG shin bone! On sagittal knee MRI, it''s the large bone at the BOTTOM of the image, below the knee joint. The tibia is the WEIGHT-BEARING bone of the lower leg (the fibula on the outside is thinner). Think: TIBia = TIny Bump - you can feel it right under your skin on the front of your shin (that''s why it hurts so much when you bang it!). The flat top of the tibia is the tibial plateau where the femur sits.',
    'https://0cm.classmarker.com/10742032_TMKX8DSA.png'),

    -- HIP SECTION (Questions 12-22)
    -- Question 12: Hip indications
    (v_quiz_content_id, 'body-hip-indications', 'body-msk-fundamentals', 'multiplechoice', 'Indications for MRI of the Hip include all the following except for ____________.', '{"A": "Generalized pain", "B": "Degenerative Joint Disease (DJD)", "C": "Incontinence", "D": "Avascular necrosis"}', 'C', 1, 11,
    'Incontinence = bladder/bowel problem, NOT a hip problem!',
    '**Incontinence is NOT a hip issue!** 🚽\n\n💡 **Remember it:** INCONTINENCE = loss of bladder or bowel control = NOT RELATED TO THE HIP! Pain, DJD (arthritis/worn cartilage), and AVN (avascular necrosis = dead bone from loss of blood supply) are all hip problems. But incontinence? That''s a PELVIC FLOOR, BLADDER, or NEUROLOGICAL issue - nothing to do with the hip joint! Don''t confuse "hip/pelvis area" with "hip joint" - they''re different!',
    null),

    -- Question 13: Hip landmark
    (v_quiz_content_id, 'body-hip-landmark', 'body-msk-fundamentals', 'multiplechoice', 'The landmark for a hip MRI is the _________________.', '{"A": "Greater Trochanter", "B": "Symphysis pubis", "C": "Iliac crest", "D": "½ between the iliac crest and the symphysis pubis"}', 'A', 1, 12,
    'It''s that bony bump on the side of your hip!',
    '**Greater Trochanter = hip landmark!** 🦴\n\n💡 **Remember it:** Put your hand on your hip - that bony bump you feel on the SIDE is the GREATER TROCHANTER! It''s the big bony knob at the top of the femur where muscles attach. This gets you perfectly centered on the hip joint (where the femoral head sits in the acetabulum). Not the iliac crest (top of pelvis - too high), not the symphysis pubis (pubic bone - too low). Greater trochanter = the perfect hip landmark!',
    null),

    -- Question 14: Hip coronal coverage
    (v_quiz_content_id, 'body-hip-coronal-coverage', 'body-msk-fundamentals', 'multiplechoice', 'The coronal coverage for the hip is from the ___________________.', '{"A": "Iliac crest through the symphysis pubis", "B": "Ramus through the symphysis pubis", "C": "Hamstring insertion through the acetabulum", "D": "Ramus through the acetabulum"}', 'C', 1, 13,
    'Start where the hamstrings attach, end at the socket!',
    '**Hamstring insertion ➡️ acetabulum!** 📐\n\n💡 **Remember it:** For hip CORONAL (front-to-back) coverage, start at the HAMSTRING INSERTION (where those back-of-thigh muscles attach to the ischial tuberosity/"sit bones") and go all the way UP through the ACETABULUM (the hip socket). This captures the entire femoral head, the socket, and the attachments below. You want to see the WHOLE hip joint complex from bottom to top. Hamstrings to hip socket = complete!',
    null),

    -- Question 15: Hip axial coverage
    (v_quiz_content_id, 'body-hip-axial-coverage', 'body-msk-fundamentals', 'multiplechoice', 'The axial coverage for the hip is from ____________________.', '{"A": "Above the acetabulum through the entire greater trochanter", "B": "The iliac crest through the entire greater trochanter", "C": "Above the acetabulum through the symphysis pubis", "D": "The iliac crest through the symphysis pubis"}', 'A', 1, 14,
    'Start above the socket, end after the big bump!',
    '**Above acetabulum ➡️ through greater trochanter!** 📐\n\n💡 **Remember it:** For hip AXIAL (cross-sections), start ABOVE the acetabulum (hip socket) and go all the way down through the ENTIRE greater trochanter (that big bony bump). This captures the acetabulum (socket), femoral head (ball), femoral neck (the narrow part connecting head to shaft), and the greater trochanter (where muscles attach). You want the WHOLE hip joint and proximal femur. Top of socket to bottom of trochanter!',
    null),

    -- Questions 16-19: Hip anatomy labeling (coronal) - Uses image 10742032_6YCKGTBN.png
    (v_quiz_content_id, 'body-hip-label-1', 'body-msk-fundamentals', 'multiplechoice', 'In this coronal hip MRI, what structure is labeled as #1?', '{"A": "Obturator internus T.", "B": "Femoral head", "C": "Labrum", "D": "Ramus"}', 'C', 1, 15,
    'It''s the cartilage rim around the socket!',
    '**Labrum** = the cartilage ring! 🎯\n\n💡 **Remember it:** The HIP LABRUM is a ring of cartilage that goes around the RIM of the acetabulum (hip socket) to make it deeper and more stable. Think of it like the rubber seal around a Tupperware lid - it creates a better "suction" seal for the femoral head. On MRI, it looks like a triangular dark structure at the edge of the socket. LABRAL TEARS are common in athletes and cause hip pain/clicking. Labrum = the rim seal!',
    'https://0cm.classmarker.com/10742032_6YCKGTBN.png'),

    (v_quiz_content_id, 'body-hip-label-2', 'body-msk-fundamentals', 'multiplechoice', 'In this coronal hip MRI, what structure is labeled as #2?', '{"A": "Ligamentum teres", "B": "Obturator internus T.", "C": "Labrum", "D": "Femoral head"}', 'D', 1, 16,
    'It''s the ball that sits in the socket!',
    '**Femoral Head** = the ball of the ball-and-socket! ⚽\n\n💡 **Remember it:** The FEMORAL HEAD is the round "BALL" at the top of the femur (thighbone) that fits into the acetabulum (socket) to form the HIP JOINT. It''s literally shaped like a ball - about 2/3 of a sphere! On MRI, it''s that big round structure sitting in the socket. The femoral head gets its blood supply from small vessels that can be damaged in fractures or AVN (avascular necrosis = dead bone). Ball in socket = hip joint!',
    'https://0cm.classmarker.com/10742032_6YCKGTBN.png'),

    (v_quiz_content_id, 'body-hip-label-3', 'body-msk-fundamentals', 'multiplechoice', 'In this coronal hip MRI, what structure is labeled as #3?', '{"A": "Ligamentum teres", "B": "Obturator internus T.", "C": "Labrum", "D": "Ramus"}', 'A', 1, 17,
    'It''s the ligament INSIDE the hip joint!',
    '**Ligamentum Teres** = the "round ligament"! 🎗️\n\n💡 **Remember it:** LIGAMENTUM TERES = Latin for "round ligament" = the ligament INSIDE the hip joint connecting the femoral head to the acetabulum! On coronal MRI, it looks like a thin dark line going from the center of the femoral head to the socket. It carries a small artery that supplies blood to the femoral head (important in kids, less so in adults). Think: Teres = ROUND, like a thin rope connecting the ball to the socket!',
    'https://0cm.classmarker.com/10742032_6YCKGTBN.png'),

    (v_quiz_content_id, 'body-hip-label-4', 'body-msk-fundamentals', 'multiplechoice', 'In this coronal hip MRI, what structure is labeled as #4?', '{"A": "Ligamentum teres", "B": "Obturator internus T.", "C": "Labrum", "D": "Femoral neck"}', 'B', 1, 18,
    'It''s the muscle/tendon on the INSIDE of the pelvis!',
    '**Obturator Internus Tendon** = internal rotator! 🔄\n\n💡 **Remember it:** OBTURATOR INTERNUS = muscle INSIDE (internus = internal) the pelvis that goes through the obturator foramen (hole in the pelvic bone). Its TENDON wraps around the back of the hip and inserts on the greater trochanter. It''s a LATERAL (external) ROTATOR of the hip despite being called "internus"! On MRI, you see it as a band-like structure lateral to the hip joint. Think: OB-turator = OB-scure muscle that''s hard to remember!',
    'https://0cm.classmarker.com/10742032_6YCKGTBN.png'),

    -- SHOULDER SECTION (Questions 20-30)
    -- Question 20: Shoulder indications
    (v_quiz_content_id, 'body-shoulder-indications', 'body-msk-fundamentals', 'multiplechoice', 'Indications for a shoulder MRI include all the following except _______.', '{"A": "Post operative follow up", "B": "Chest Pain", "C": "Tumor", "D": "Trauma"}', 'B', 1, 19,
    'Chest pain = heart/lungs, NOT shoulder!',
    '**Chest pain is NOT a shoulder indication!** 💔\n\n💡 **Remember it:** CHEST PAIN = HEART/LUNG issue (cardiac, PE, pneumonia), NOT shoulder! Post-op follow-up (checking surgical repairs), tumor (masses), and trauma (fractures, dislocations, rotator cuff tears) are all shoulder problems. But chest pain? That''s MEDIASTINUM (heart/lungs/esophagus), not the shoulder joint! Don''t confuse "chest area" with "shoulder" - if it''s true chest pain, think cardiac workup, not shoulder MRI!',
    null),

    -- Question 21: Shoulder indication specific
    (v_quiz_content_id, 'body-shoulder-indication-specific', 'body-msk-fundamentals', 'multiplechoice', 'Which of the following is the only indication for an MRI of the shoulder?', '{"A": "Neck pain", "B": "Headache", "C": "Meniscal tear", "D": "Rotator cuff tear"}', 'D', 1, 20,
    'Only ONE is actually IN the shoulder!',
    '**Rotator cuff tear = shoulder-specific!** 🔧\n\n💡 **Remember it:** ROTATOR CUFF TEAR is the ONLY one that''s actually a SHOULDER problem! Neck pain = C-spine MRI. Headache = brain MRI. Meniscal tear = KNEE MRI (meniscus is in the knee!). But rotator cuff (supraspinatus, infraspinatus, teres minor, subscapularis muscles/tendons) = SHOULDER! These tendons stabilize and rotate the shoulder. Common tears in athletes, overhead workers, and aging adults. Only the rotator cuff belongs to the shoulder!',
    null),

    -- Question 22: Shoulder landmark
    (v_quiz_content_id, 'body-shoulder-landmark', 'body-msk-fundamentals', 'multiplechoice', 'When positioning a shoulder, the landmark is the _______________.', '{"A": "Humeral head", "B": "Superior aspect of the sternum", "C": "Clavicle", "D": "Mid-humeral shaft"}', 'A', 1, 21,
    'Landmark at the ball of the shoulder joint!',
    '**Humeral head = shoulder landmark!** ⚾\n\n💡 **Remember it:** HUMERAL HEAD = the "ball" at the top of the humerus (upper arm bone) that sits in the glenoid (shoulder socket). Landmark HERE to center on the shoulder joint! Not the sternum (that''s chest/midline), not the clavicle (collarbone - too high), not mid-shaft (too far down the arm). The humeral head is the CENTER of the shoulder joint action. Put your hand on your shoulder - that ball you feel is the humeral head!',
    null),

    -- Question 23: Shoulder positioning
    (v_quiz_content_id, 'body-shoulder-positioning-side', 'body-msk-fundamentals', 'multiplechoice', 'When positioning the shoulder, move the patient as far as possible to:', '{"A": "The affected side", "B": "The unaffected side", "C": "Wherever the patient is most comfortable"}', 'B', 1, 22,
    'Move AWAY from the sore shoulder toward the good side!',
    '**Move to the UNaffected side!** ↔️\n\n💡 **Remember it:** Move the patient toward their GOOD (unaffected) side, so the BAD shoulder is as close to ISOCENTER as possible! The further from isocenter, the worse the image quality (field inhomogeneity, artifacts). By shifting the patient toward the good side, you get the symptomatic shoulder RIGHT IN THE MIDDLE of the magnet where the field is strongest and most uniform. Think: Good side scoots over so bad side gets the VIP center spot!',
    null),

    -- Question 24: Shoulder arm positioning
    (v_quiz_content_id, 'body-shoulder-arm-position', 'body-msk-fundamentals', 'multiplechoice', 'When positioning the shoulder, the humerus and forearm should be:', '{"A": "In the same plane as the shoulder", "B": "Slightly anterior to the shoulder", "C": "Slightly posterior to the shoulder", "D": "Left in the most comfortable position for the patient"}', 'A', 1, 23,
    'Keep the arm IN LINE with the shoulder!',
    '**Same plane = aligned!** 📏\n\n💡 **Remember it:** The humerus (upper arm) and forearm should be IN THE SAME PLANE as the shoulder - all aligned in a straight line! Not twisted forward (anterior) or backward (posterior). This gives you TRUE anatomical planes and prevents obliquity that would distort the anatomy. Imagine drawing a straight line from the shoulder through the elbow to the wrist - that''s what you want. Alignment = accurate imaging!',
    null),

    -- Question 25: Shoulder oblique coronal angle
    (v_quiz_content_id, 'body-shoulder-oblique-angle', 'body-msk-fundamentals', 'multiplechoice', 'The angulation for the oblique coronal plane of the shoulder is parallel to the____________________.', '{"A": "Biceps tendon", "B": "Supraspinatus tendon", "C": "Infraspinatus tendon", "D": "Angle of the glenoid"}', 'B', 1, 24,
    'Think about the MOST commonly torn rotator cuff tendon!',
    '**Parallel to supraspinatus tendon!** 🎯\n\n💡 **Remember it:** SUPRASPINATUS = the MOST commonly torn rotator cuff tendon! The oblique coronal plane is angled PARALLEL to the supraspinatus tendon (which runs from the top of the scapula over the humeral head). This shows the supraspinatus in its BEST plane - you can see tears, tendinosis, and muscle atrophy clearly. Think: SUPRA = SUPER important = angle parallel to it! This is the money shot for rotator cuff tears!',
    null),

    -- Question 26: Shoulder axial coverage
    (v_quiz_content_id, 'body-shoulder-axial-coverage', 'body-msk-fundamentals', 'multiplechoice', 'The coverage for an axial of the shoulder must also include the entire:', '{"A": "Shoulder blade", "B": "Acromial-Clavicular (AC) joint", "C": "Sterna-Clavicular (SC) joint", "D": "Superior half the humeral shaft"}', 'B', 1, 25,
    'Don''t forget the joint at the TOP of the shoulder!',
    '**Include the AC joint!** 🔗\n\n💡 **Remember it:** AC JOINT = Acromial-Clavicular joint = where the clavicle (collarbone) meets the acromion (top of shoulder blade). This joint can have SEPARATIONS (shoulder separations), arthritis, and cysts. On axial shoulder, you MUST include the ENTIRE AC joint! Not the SC joint (that''s where clavicle meets sternum - too medial/far away). The AC joint sits RIGHT ABOVE the shoulder, so capture it all! Think: AC = At the Crest of the shoulder!',
    null),

    -- Questions 27-30: Shoulder anatomy labeling (coronal) - Uses image 10742032_7DPB8HOD.png
    (v_quiz_content_id, 'body-shoulder-label-1', 'body-msk-fundamentals', 'multiplechoice', 'In this coronal shoulder MRI, what structure is labeled as #1?', '{"A": "Humeral head", "B": "Glenoid", "C": "Acromion process", "D": "Labrum"}', 'C', 1, 26,
    'It''s the bony roof over the top of the shoulder!',
    '**Acromion Process** = the roof! 🏠\n\n💡 **Remember it:** ACROMION = the bony "roof" over the shoulder! It''s the flat part of the scapula (shoulder blade) that extends over the top of the shoulder joint. The acromion forms the AC (acromioclavicular) joint with the clavicle. The space under the acromion (subacromial space) is where the supraspinatus tendon lives - if the space is too narrow, you get IMPINGEMENT! On coronal MRI, the acromion is that flat bone at the very top. Think: Acromion = At the Crown = the roof!',
    'https://0cm.classmarker.com/10742032_7DPB8HOD.png'),

    (v_quiz_content_id, 'body-shoulder-label-2', 'body-msk-fundamentals', 'multiplechoice', 'In this coronal shoulder MRI, what structure is labeled as #2?', '{"A": "Acromion process", "B": "Labrum", "C": "Biceps tendon", "D": "Glenoid"}', 'C', 1, 27,
    'It''s the tendon in the groove at the front of the humerus!',
    '**Biceps Tendon (Long Head)** = in the groove! 💪\n\n💡 **Remember it:** The LONG HEAD of the BICEPS TENDON runs through the bicipital groove (intertubercular groove) at the front of the humerus, then goes UP and over the humeral head to attach inside the shoulder joint at the top of the glenoid! On coronal MRI, you see it as a dark oval/circle in the groove between the greater and lesser tuberosities. This tendon can tear, get inflamed (tendinitis), or sublux (pop out of the groove). The biceps tendon = the rope in the groove!',
    'https://0cm.classmarker.com/10742032_7DPB8HOD.png'),

    (v_quiz_content_id, 'body-shoulder-label-3', 'body-msk-fundamentals', 'multiplechoice', 'In this coronal shoulder MRI, what structure is labeled as #3?', '{"A": "Acromion process", "B": "Labrum", "C": "Biceps tendon", "D": "Glenoid"}', 'D', 1, 28,
    'It''s the shallow socket of the shoulder!',
    '**Glenoid** = the socket! 🥄\n\n💡 **Remember it:** GLENOID = the shallow "socket" on the scapula (shoulder blade) where the humeral head (ball) sits. It''s called a "ball and socket" joint, but the glenoid is really more like a SHALLOW DISH or SAUCER - very flat! That''s why the shoulder dislocates easily compared to the hip (which has a deep socket). The labrum (cartilage rim) helps make it deeper. On coronal MRI, the glenoid is that flat bony surface facing the humeral head. Think: Glenoid = Golf tee (flat top)!',
    'https://0cm.classmarker.com/10742032_7DPB8HOD.png'),

    (v_quiz_content_id, 'body-shoulder-label-4', 'body-msk-fundamentals', 'multiplechoice', 'In this coronal shoulder MRI, what structure is labeled as #4?', '{"A": "Acromion process", "B": "Labrum", "C": "Biceps tendon", "D": "Glenoid"}', 'B', 1, 29,
    'It''s the cartilage rim around the socket!',
    '**Labrum** = the rim seal! ⭕\n\n💡 **Remember it:** The GLENOID LABRUM is a ring of fibrocartilage around the edge of the glenoid (socket) that makes it DEEPER and more stable. Think of it like the rubber gasket around a jar lid - it creates a better seal! On MRI, it looks like a small triangular dark structure at the rim of the glenoid. LABRAL TEARS (especially SLAP tears = Superior Labrum Anterior-Posterior) are common in throwing athletes and cause shoulder pain/instability. Labrum = the rim that keeps the ball in!',
    'https://0cm.classmarker.com/10742032_7DPB8HOD.png'),

    -- Question 31: Supraspinatus identification
    (v_quiz_content_id, 'body-shoulder-supraspinatus-arrow', 'body-msk-fundamentals', 'multiplechoice', 'The arrow identifies:', '{"A": "Humeral head", "B": "Glenoid", "C": "Biceps tendon", "D": "Supraspinatus tendon"}', 'D', 1, 30,
    'It''s the most commonly torn rotator cuff tendon!',
    '**Supraspinatus Tendon** = #1 tear location! 🎯\n\n💡 **Remember it:** SUPRASPINATUS TENDON = the MOST commonly TORN rotator cuff tendon! It runs from the supraspinatus muscle (above the scapular spine) over the TOP of the humeral head to insert on the greater tuberosity. It''s responsible for the first 15° of shoulder abduction (lifting arm away from body). This tendon lives in the SUBACROMIAL SPACE under the acromion - when that space narrows (impingement), the tendon gets pinched and can tear. On MRI, look for it arching over the top of the humeral head!',
    'https://0cm.classmarker.com/10742032_RWBDRCG9.png'),

    -- ELBOW SECTION (Questions 32-40)
    -- Question 32: Elbow bones
    (v_quiz_content_id, 'body-elbow-bones', 'body-msk-fundamentals', 'multiplechoice', 'The elbow is comprised of the following bones:', '{"A": "Humerus, Ulna, Tibia", "B": "Ulna, Radius, Capitate", "C": "Radius, Ulna, Shoulder", "D": "Humerus, Ulna, Radius"}', 'D', 1, 31,
    'One bone from above, two bones from below!',
    '**Humerus, Ulna, Radius!** 🦴\n\n💡 **Remember it:** ELBOW = 3 bones meeting! (1) HUMERUS = upper arm bone (1 bone from above), (2) ULNA = pinky-side forearm bone, (3) RADIUS = thumb-side forearm bone (2 bones from below). NOT tibia (that''s shin/leg!), not capitate (that''s a wrist bone!), not "shoulder" (that''s not even a single bone!). Think: HUmerus from above meets Ulna & Radius from below = HUR (like hurray!). Three bones, one joint!',
    null),

    -- Question 33: Elbow positioning disadvantage
    (v_quiz_content_id, 'body-elbow-positioning-disadvantage', 'body-msk-fundamentals', 'multiplechoice', 'An advantage for positioning the elbow by the side is greater patient comfort. A disadvantage is_________________:', '{"A": "Higher SAR", "B": "Respiratory motion artifacts", "C": "Lower magnetic field homogeneity", "D": "Longer scan times"}', 'C', 1, 32,
    'Think about the magnet''s sweet spot - is the elbow in the center?',
    '**Lower field homogeneity!** 🧲\n\n💡 **Remember it:** When the elbow is BY THE SIDE (down by the patient''s hip), it''s FAR from ISOCENTER (the sweet spot in the middle of the magnet). The further from isocenter, the more INHOMOGENEOUS (non-uniform) the magnetic field becomes = worse image quality, more artifacts, poorer fat saturation! Ideally, you''d position the elbow OVERHEAD (Superman position) to get it at isocenter, but that''s uncomfortable. Side position = comfy but crummy field. Trade-offs!',
    null),

    -- Question 34: Elbow landmark
    (v_quiz_content_id, 'body-elbow-landmark', 'body-msk-fundamentals', 'multiplechoice', 'The landmark for the elbow is:', '{"A": "Mid humerus", "B": "Mid radius", "C": "Mid ulna", "D": "Center of the elbow"}', 'D', 1, 33,
    'Right at the joint itself!',
    '**Center of the elbow!** 🎯\n\n💡 **Remember it:** Landmark right at the CENTER OF THE ELBOW JOINT - the point where the humerus meets the radius and ulna! Not mid-humerus (too high), not mid-radius or ulna (those extend way down the forearm). The elbow joint is the HINGE where your arm bends - landmark RIGHT THERE at the crease. Simple! Think: Elbow = where it bends = center!',
    null),

    -- Question 35: Elbow essential structure
    (v_quiz_content_id, 'body-elbow-essential-structure', 'body-msk-fundamentals', 'multiplechoice', 'For elbow imaging, it is essential to include the________________.', '{"A": "Triceps muscle", "B": "Biceps muscle", "C": "Biceps tendon insertion", "D": "Triceps ligament insertion"}', 'C', 1, 34,
    'Don''t forget where the biceps attaches!',
    '**Biceps tendon insertion!** 💪\n\n💡 **Remember it:** The BICEPS TENDON INSERTION (where the biceps tendon attaches to the radial tuberosity on the radius) is ESSENTIAL for elbow imaging! Biceps tendon tears often occur at this insertion point. The biceps muscle is in the upper arm (too far up), triceps muscle is in the back of the arm, and "triceps ligament insertion" isn''t really a thing. But the DISTAL BICEPS TENDON and where it inserts? Critical! Include it or you''ll miss pathology!',
    null),

    -- Question 36: Elbow sagittal angulation
    (v_quiz_content_id, 'body-elbow-sagittal-angle', 'body-msk-fundamentals', 'multiplechoice', 'The angulation for a sagittal elbow is__________________.', '{"A": "Perpendicular to the plane of the lateral and medial condyles", "B": "Parallel to the plane of the lateral and medial condyles", "C": "Parallel to the plane of the humeral shaft", "D": "Perpendicular to the plane of the humeral shaft"}', 'A', 1, 35,
    'PERPENDICULAR = cutting ACROSS the condyles!',
    '**Perpendicular to the condyles!** ✂️\n\n💡 **Remember it:** The CONDYLES (medial and lateral humeral condyles) are the bony bumps on each side of the elbow. For SAGITTAL elbow images, angle PERPENDICULAR (90° / across) to the plane of these condyles. This gives you true front-to-back slices through the elbow showing the distal humerus, radial head, coronoid process, olecranon, and trochlea in proper alignment. NOT parallel (that would be side-to-side). Perpendicular = cut across!',
    null),

    -- Questions 37-40: Elbow anatomy labeling (sagittal) - Uses image 10742032_KAJK0HNL.png
    (v_quiz_content_id, 'body-elbow-label-1', 'body-msk-fundamentals', 'multiplechoice', 'In this sagittal elbow MRI, what structure is labeled as #1?', '{"A": "Biceps tendon insertion", "B": "Trochlea", "C": "Olecranon process", "D": "Triceps tendon"}', 'D', 1, 36,
    'It''s the back-of-arm muscle''s tendon!',
    '**Triceps Tendon** = straightens the elbow! 💪\n\n💡 **Remember it:** TRICEPS TENDON is the tendon of the TRICEPS muscle (back of upper arm) that attaches to the olecranon process (the pointy part of the ulna at the back of your elbow). The triceps STRAIGHTENS (extends) your elbow. On sagittal MRI, the triceps tendon is that dark band coming down the back to insert on the olecranon. Think: TRI-ceps TEN-don = TEN-points for knowing it attaches to the olecranon!',
    'https://0cm.classmarker.com/10742032_KAJK0HNL.png'),

    (v_quiz_content_id, 'body-elbow-label-2', 'body-msk-fundamentals', 'multiplechoice', 'In this sagittal elbow MRI, what structure is labeled as #2?', '{"A": "Biceps tendon insertion", "B": "Trochlea", "C": "Olecranon process", "D": "Triceps tendon"}', 'C', 1, 37,
    'It''s the pointy bone at the back of your elbow!',
    '**Olecranon Process** = the elbow point! 📍\n\n💡 **Remember it:** OLECRANON = the bony bump at the BACK of your elbow that you can feel (and bang painfully on tables!). It''s part of the ULNA. The olecranon fits into the olecranon fossa (groove) on the back of the humerus when you straighten your arm. The triceps tendon attaches here. On sagittal MRI, it''s that pointy projection at the back of the elbow. Think: O-LECRANON = O! that hurts when you hit it!',
    'https://0cm.classmarker.com/10742032_KAJK0HNL.png'),

    (v_quiz_content_id, 'body-elbow-label-3', 'body-msk-fundamentals', 'multiplechoice', 'In this sagittal elbow MRI, what structure is labeled as #3?', '{"A": "Biceps tendon insertion", "B": "Trochlea", "C": "Olecranon process", "D": "Triceps tendon"}', 'B', 1, 38,
    'It''s the spool-shaped part of the humerus!',
    '**Trochlea** = the spool! 🎡\n\n💡 **Remember it:** TROCHLEA = Latin for "pulley/spool" = the grooved, spool-shaped part of the distal humerus that articulates with (touches) the ulna at the elbow joint! The trochlea is on the MEDIAL (pinky side) of the humerus. It''s shaped like a spool of thread with a groove in the middle. The ulna''s trochlear notch wraps around it, creating the hinge joint that lets your elbow bend and straighten. Think: TROCHlea = TRuck wheel (round and grooved)!',
    'https://0cm.classmarker.com/10742032_KAJK0HNL.png'),

    (v_quiz_content_id, 'body-elbow-label-4', 'body-msk-fundamentals', 'multiplechoice', 'In this sagittal elbow MRI, what structure is labeled as #4?', '{"A": "Biceps tendon insertion", "B": "Trochlea", "C": "Olecranon process", "D": "Triceps tendon"}', 'A', 1, 39,
    'It''s where the biceps connects to the radius!',
    '**Biceps Tendon Insertion** = on the radial tuberosity! 💪\n\n💡 **Remember it:** The DISTAL BICEPS TENDON inserts on the RADIAL TUBEROSITY (a bump on the radius bone). This insertion point is where biceps tendon tears commonly occur (especially in middle-aged men lifting heavy objects). The biceps muscle BENDS (flexes) your elbow and ROTATES your forearm (supination = palm up). On sagittal MRI, look for the dark tendon attaching to the radius below the joint. Essential to include this in elbow imaging!',
    'https://0cm.classmarker.com/10742032_KAJK0HNL.png'),

    -- WRIST SECTION (Questions 41-42)
    -- Question 41: Wrist specific indication
    (v_quiz_content_id, 'body-wrist-indication', 'body-msk-fundamentals', 'multiplechoice', 'Which indication is specific only to wrist MRI?', '{"A": "Degenerative joint disease (DJD)", "B": "Arthritis", "C": "Trauma", "D": "Carpal tunnel syndrome"}', 'D', 1, 40,
    'Think about what structure is UNIQUE to the wrist!',
    '**Carpal Tunnel Syndrome!** 🖐️\n\n💡 **Remember it:** CARPAL TUNNEL SYNDROME is SPECIFIC to the WRIST! The carpal tunnel is a narrow passageway in the wrist formed by the carpal bones (floor/sides) and flexor retinaculum (roof). The MEDIAN NERVE passes through this tunnel along with flexor tendons. When the tunnel gets too tight (from swelling, repetitive motion, pregnancy), the median nerve gets COMPRESSED = carpal tunnel syndrome = numbness/tingling in thumb, index, middle fingers! DJD, arthritis, and trauma can happen in ANY joint, but carpal tunnel? That''s WRIST-SPECIFIC!',
    null),

    -- Question 42: Wrist landmark
    (v_quiz_content_id, 'body-wrist-landmark', 'body-msk-fundamentals', 'multiplechoice', 'Landmark the wrist at ________________.', '{"A": "½\" distal to the wrist joint at the capitate bone", "B": "1\" proximal to the wrist joint at the capitate bone", "C": "The wrist joint", "D": "The center of the metacarpal bones"}', 'A', 1, 41,
    'Go slightly BELOW the joint to the biggest carpal bone!',
    '**½" distal to wrist joint at the capitate!** 🎯\n\n💡 **Remember it:** Landmark about ½ inch (1-1.5 cm) DISTAL (toward the fingers) from the wrist joint, right at the CAPITATE bone! The capitate is the LARGEST carpal bone, sitting in the CENTER of the wrist. By landmarking here (slightly below the wrist joint), you capture the distal radius/ulna, ALL the carpal bones, and the bases of the metacarpals - the complete wrist complex! Not at the joint itself (too high), not at the metacarpals (too low). Capitate = CAPital city = center of wrist!',
    null)
  ;

END $$;

