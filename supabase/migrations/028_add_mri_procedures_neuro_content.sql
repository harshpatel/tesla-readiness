-- Add content for MRI Procedures & Set Up I: Neuro module
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

  -- Update existing module 'mri-procedures-neuro'
  UPDATE modules
  SET
    title = 'MRI Procedures & Set Up I: Neuro',
    description = 'Master neurological MRI protocols, patient positioning, anatomical landmarks, and spine imaging procedures for brain and spinal cord examinations',
    icon = '🧠',
    is_published = true,
    updated_at = NOW()
  WHERE section_id = v_section_id AND slug = 'mri-procedures-neuro'
  RETURNING id INTO v_module_id;

  -- Insert video content item
  INSERT INTO content_items (module_id, slug, title, description, type, icon, order_index, metadata, is_published)
  VALUES (v_module_id, 'introduction', 'MRI Procedures & Set Up I: Neuro', 'Comprehensive guide to neurological MRI procedures including brain and spine imaging protocols', 'video', '🎥', 1, '{"videoUrl": "https://cffhrzzfhyotkbuuoayc.supabase.co/storage/v1/object/public/videos/MRI%20Procedures%20&%20Set%20Up%20I%20-%20Neuro.mp4"}', true)
  RETURNING id INTO v_video_content_id;

  -- Insert quiz content item
  INSERT INTO content_items (module_id, slug, title, description, type, icon, order_index, metadata, is_published)
  VALUES (v_module_id, 'neuro-procedures-fundamentals', 'Neuro Procedures Fundamentals', 'Test your knowledge on neurological MRI protocols, positioning, landmarks, and anatomical identification.', 'quiz', '📝', 2, '{}', true)
  RETURNING id INTO v_quiz_content_id;

  -- Insert or update quiz_sections
  INSERT INTO quiz_sections (key, title, description, icon, order_index)
  VALUES ('neuro-procedures-fundamentals', 'Neuro Procedures Fundamentals', 'Master the essential concepts of neurological MRI procedures and setup', '🧠', 0)
  ON CONFLICT (key) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    updated_at = NOW();

  -- Insert quiz questions (19 total: 15 multiple choice + 4 matching/labeling)
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
    -- Question 1: Landmark definition
    (v_quiz_content_id, 'neuro-proc-landmark', 'neuro-procedures-fundamentals', 'multiplechoice', 'The anatomical point that establishes the what part of the body moves to the center of the magnet at the start of an MR exam is the:', '{"A": "Pulse Sequence", "B": "Landmark", "C": "Field-of-View", "D": "None of the Above"}', 'B', 1, 0, 
    'Think: Where do you START positioning? What point tells the magnet where to center?',
    '**Landmark** = Your starting reference point! 📍\n\n💡 **Remember it:** LANDMARK = LAND (where you place) + MARK (the point)! It''s like dropping a pin on Google Maps. Before scanning, you set a LANDMARK (like the nasion for brain, or chin for c-spine) to tell the magnet "CENTER HERE!" The table moves to position that landmark at isocenter (the sweet spot in the magnet). Think of it as the GPS coordinate that gets you to the right starting position!',
    null),

    -- Question 2: Protocol definition
    (v_quiz_content_id, 'neuro-proc-protocol', 'neuro-procedures-fundamentals', 'multiplechoice', 'In MRI, a "protocol" is best defined as:', '{"A": "The complete list of all the imaging pulse sequences and parameters in the entire MRI exam", "B": "The body part to be imagined and the reason for the exam found on the physician''s order", "C": "The written patient screening policy", "D": "None of the above"}', 'A', 1, 1,
    'Think: What''s the COMPLETE recipe for the entire MRI scan?',
    '**Protocol** = Your complete scanning game plan! 📋\n\n💡 **Remember it:** PROTOCOL = The ENTIRE MENU of sequences! Not just one sequence, not the doctor''s order, not the safety policy - it''s THE FULL LIST of every single pulse sequence you''ll run in the exam. Like a restaurant menu listing every dish (T1, T2, FLAIR, DWI, etc.) with all the "ingredients" (TR, TE, slice thickness, FOV). When you select "Brain w/ Contrast Protocol," you''re getting 10-15 pre-programmed sequences in a specific order. It''s the MASTER PLAN!',
    null),

    -- Question 3: Field of View (FOV)
    (v_quiz_content_id, 'neuro-proc-fov', 'neuro-procedures-fundamentals', 'multiplechoice', 'The 2-dimensional area to be imaged in a particular pulse sequence is the:', '{"A": "Slice Thickness", "B": "Slice Gap", "C": "Field-of-View (FOV)", "D": "Image Weighting"}', 'C', 1, 2,
    'Think: What defines the SIZE of the square or rectangle you''re imaging?',
    '**Field-of-View (FOV)** = Your imaging window size! 🖼️\n\n💡 **Remember it:** FOV = FIELD OF VIEW - literally HOW MUCH you can SEE in the image! Think of looking through a camera viewfinder - do you zoom in close (small FOV like 18cm for a tiny joint) or zoom out wide (large FOV like 48cm for the whole pelvis)? Slice thickness is how THICK each slice is (like bread thickness), but FOV is the LENGTH × WIDTH of the actual image area. Brain FOV = usually 24cm. Knee FOV = usually 16cm. Bigger patient = bigger FOV needed!',
    null),

    -- Question 4: Image weighting
    (v_quiz_content_id, 'neuro-proc-weighting', 'neuro-procedures-fundamentals', 'multiplechoice', 'The type of MR image contrast that has the strongest influence in the image is referred to as its:', '{"A": "Image weighting", "B": "T1 weighting", "C": "T2 Weighting", "D": "Voxel Brightness"}', 'A', 1, 3,
    'This is the GENERAL term for describing contrast, not a specific type!',
    '**Image weighting** = The BOSS contrast in your image! ⚖️\n\n💡 **Remember it:** WEIGHTING = What''s WEIGHING THE MOST in your image? Is T1 the main character (T1-weighted), or T2 (T2-weighted), or proton density? "Image weighting" is the UMBRELLA TERM - like saying "the main flavor" instead of specifically saying "chocolate" or "vanilla." When you say an image is T1-WEIGHTED, you''re saying T1 contrast is the DOMINANT influence. When T2-WEIGHTED, T2 is the star of the show. Weighting = which contrast is running the show!',
    null),

    -- Question 5: Brain indications
    (v_quiz_content_id, 'neuro-proc-brain-indications', 'neuro-procedures-fundamentals', 'multiplechoice', 'All of the following are indications for imaging the brain except for:', '{"A": "Multiple Sclerosis", "B": "Loss of Balance", "C": "Loss of Hearing", "D": "Herniated Nucleus Pulposus (HNP)"}', 'D', 1, 4,
    'One of these is a SPINE problem, not a BRAIN problem!',
    '**HNP is a spine issue!** 💿➡️🦴\n\n💡 **Remember it:** HNP = Herniated Nucleus Pulposus = DISC HERNIATION in the SPINE! A "slipped disc" - when the squishy center (nucleus pulposus) of a spinal disc pushes out through a tear. This is a SPINE problem, not a BRAIN problem! You scan the lumbar or cervical SPINE for HNP, not the brain! MS (brain lesions), loss of balance (cerebellum/brain issue), and loss of hearing (acoustic neuroma/brain) are all BRAIN indications. But HNP = disc bulge = SPINE MRI!',
    null),

    -- Question 6: Brain landmark
    (v_quiz_content_id, 'neuro-proc-brain-landmark', 'neuro-procedures-fundamentals', 'multiplechoice', 'The landmark of brain imaging is the nasion or the _____________.', '{"A": "Tip of the nose", "B": "Glabella", "C": "Tip of the Chin", "D": "Angle of the mandible"}', 'B', 1, 5,
    'It''s between your eyebrows - the smooth area right at the bridge of your nose!',
    '**Glabella** = The smooth spot between your eyebrows! 👁️👁️\n\n💡 **Remember it:** GLABELLA = GLABROUS (smooth/hairless) area! Touch the bridge of your nose between your eyebrows - that smooth, flat area is the GLABELLA. For brain MRI, you can use either the NASION (the very top of the nose bridge where it meets the forehead) OR the GLABELLA (just below that, between the brows). Both get you centered on the brain. Not the tip of the nose (too far forward), not the chin (way too low). Glabella = eyebrow midpoint!',
    null),

    -- Question 7: Brain axial coverage
    (v_quiz_content_id, 'neuro-proc-brain-coverage', 'neuro-procedures-fundamentals', 'multiplechoice', 'The typical coverage for axial imaging of the brain is _____________', '{"A": "C1 to the Calvarium", "B": "C1 to the ACPC line", "C": "Foramen Magnum to superior sagittal sinus", "D": "Foramen Magnum to the Calvarium"}', 'D', 1, 6,
    'Start at the bottom of the skull and go all the way to the TOP!',
    '**Foramen Magnum to Calvarium** = Bottom to top of the brain! 🧠\n\n💡 **Remember it:** FORAMEN MAGNUM = the big hole at the base of the skull where the spinal cord enters. CALVARIUM = the top of the skull (skull cap). For BRAIN imaging, you start at the FORAMEN MAGNUM (bottom) and go ALL THE WAY UP to the CALVARIUM (top) - you want to capture THE ENTIRE BRAIN from bottom to top! Not just to C1 (that''s too low, you''d miss the cerebellum). Not just to ACPC line (that''s only mid-brain, you''d miss the top). FULL BRAIN = foramen magnum ➡️ calvarium!',
    null),

    -- Question 8: Spine indications
    (v_quiz_content_id, 'neuro-proc-spine-indications', 'neuro-procedures-fundamentals', 'multiplechoice', 'All of the following are indications for imaging the spine except for:', '{"A": "Multiple Sclerosis", "B": "Tumor", "C": "Degenerative disk disease (DDD)", "D": "Chest Pain"}', 'D', 1, 7,
    'One of these is NOT related to the spine at all!',
    '**Chest pain is NOT a spine indication!** 💔\n\n💡 **Remember it:** CHEST PAIN = heart/lung issue, NOT spine! You''d get a CHEST CT or cardiac workup, not a spine MRI! MS (can have spinal cord lesions), tumors (can be in/around spine), and DDD (degenerative disc disease = worn-out discs) are all SPINE problems. But chest pain? That''s for the ER/cardiology, not spine imaging! If someone has chest pain, think HEART ATTACK or PULMONARY EMBOLISM, not "let''s scan their spine!"',
    null),

    -- Question 9: C-spine landmark
    (v_quiz_content_id, 'neuro-proc-cspine-landmark', 'neuro-procedures-fundamentals', 'multiplechoice', 'The typical landmark for the cervical spine is the____________.', '{"A": "Base of the skull", "B": "Base of the Chin", "C": "Nasion", "D": "Mandible"}', 'B', 1, 8,
    'Think about where the NECK is - what''s at the front of the neck at the right height?',
    '**Base of the Chin** = C-spine landmark! 🦴\n\n💡 **Remember it:** Touch your CHIN and drop straight back - that''s about C3-C4 level (middle of cervical spine)! For C-SPINE imaging, the landmark is the BASE (bottom) of the CHIN. Not the nasion (that''s for brain - way too high). Not the mandible angle (side of jaw - not consistent). BASE OF CHIN gets you centered on the CERVICAL spine (C1-C7). Think: CHIN = CERVICAL. Both start with "C"! Easy peasy!',
    null),

    -- Question 10: C-spine angulation
    (v_quiz_content_id, 'neuro-proc-cspine-angle', 'neuro-procedures-fundamentals', 'multiplechoice', 'Typical angulation for axial imaging of the cervical spine is _________.', '{"A": "Perpendicular to the plane of the cervical spinal cord", "B": "Parallel to the plane of the cervical spinal cord", "C": "45° to the plane of the cervical spinal cord", "D": "Orthogonal to the axial plane"}', 'A', 1, 9,
    'Think: Do you want to cut ACROSS the cord (perpendicular) or ALONG it (parallel)?',
    '**Perpendicular to the spinal cord** = Cut across it! ✂️\n\n💡 **Remember it:** PERPENDICULAR = 90° angle = ACROSS! For axial spine images, you want to cut PERPENDICULAR (across) the spinal CORD, like slicing a hot dog into circular coins! NOT parallel (that would be lengthwise, like slicing a hot dog into a long half). The cervical spine has a natural curve (lordosis), so you ANGLE your slices to stay perpendicular to the cord''s path as it curves. This gives you nice round cross-sections of the cord in each slice!',
    null),

    -- Question 11: Thoracic vertebrae count
    (v_quiz_content_id, 'neuro-proc-thoracic-count', 'neuro-procedures-fundamentals', 'multiplechoice', 'There are ____________ vertebral bodies in the thoracic spine', '{"A": "7", "B": "10", "C": "5", "D": "12"}', 'D', 1, 10,
    'Think about how many RIBS you have - same number!',
    '**12 thoracic vertebrae!** 🦴🦴🦴\n\n💡 **Remember it:** 12 RIBS = 12 THORACIC VERTEBRAE! Easy! Each thoracic vertebra (T1-T12) connects to a pair of ribs. Remember the spine sections: 7 CERVICAL (your neck, C1-C7), 12 THORACIC (your mid-back with ribs, T1-T12), 5 LUMBAR (lower back, L1-L5), 5 SACRAL (fused, S1-S5), and 4 tiny COCCYX bones. Use "Breakfast at 7, Lunch at 12, Dinner at 5" - Cervical=7, Thoracic=12, Lumbar=5!',
    null),

    -- Question 12: T-spine landmark
    (v_quiz_content_id, 'neuro-proc-tspine-landmark', 'neuro-procedures-fundamentals', 'multiplechoice', 'The landmark for the thoracic spine is the _______________.', '{"A": "Superior segment of the sternum", "B": "Mid sternum", "C": "Inferior segment of the sternum", "D": "Larynx"}', 'B', 1, 11,
    'The sternum (breastbone) runs along your chest - which part is at T-spine level?',
    '**Mid sternum** = T-spine landmark! 🎯\n\n💡 **Remember it:** Put your hand on the MIDDLE of your BREASTBONE (sternum) - that''s about T5-T7 level (middle of thoracic spine T1-T12). Not the top (that''s too high, near C7/T1), not the bottom (that''s getting into lumbar territory). MID STERNUM = MID THORACIC. The sternum is that flat bone in the center of your chest that your ribs attach to. Touch the center of your chest - that''s your landmark for centering T-spine!',
    null),

    -- Question 13: L-spine landmark
    (v_quiz_content_id, 'neuro-proc-lspine-landmark', 'neuro-procedures-fundamentals', 'multiplechoice', 'The landmark for the lumbar spine is at ________________.', '{"A": "The inferior segment of the sternum", "B": "The iliac crest", "C": "The symphysis pubis", "D": "1\"-2\" above the iliac crest"}', 'D', 1, 12,
    'The iliac crest is too LOW - you need to be just ABOVE it!',
    '**1"-2" above the iliac crest** = L-spine landmark! 📏\n\n💡 **Remember it:** Put your hands on your hips - those bony points you feel are the ILIAC CRESTS (top of your hip bones). Now move up about 1-2 inches (about 2-5 cm) - that''s roughly L2-L3 level (middle of lumbar spine L1-L5). NOT at the iliac crest itself (that''s L4-L5, too low), and definitely not at the sternum (way too high) or pubis (pelvic bone, way too low). 1"-2" ABOVE iliac crest = sweet spot for L-spine centering!',
    null),

    -- Question 14: L-spine sagittal coverage
    (v_quiz_content_id, 'neuro-proc-lspine-coverage', 'neuro-procedures-fundamentals', 'multiplechoice', 'The Sagittal coverage for the lumbar spine is:', '{"A": "All of T12 and includes all S1", "B": "All of L1 and incudes all of S2", "C": "All of L1 and includes all of S1", "D": "All of T12 and includes the L5-S1 disc space"}', 'A', 1, 13,
    'Start one vertebra ABOVE L1 and go all the way down to include S1!',
    '**T12 to S1** = Full L-spine coverage! 📐\n\n💡 **Remember it:** For LUMBAR spine, you want to see: (1) The TRANSITION from thoracic to lumbar (so include T12 - the last thoracic vertebra ABOVE L1), and (2) The TRANSITION from lumbar to sacral (so include ALL of S1 - the first sacral vertebra BELOW L5). This ensures you capture all 5 lumbar vertebrae (L1-L5) PLUS one above (T12) and one below (S1) for context. T12 ➡️ L1-L5 ➡️ S1 = complete coverage!',
    null),

    -- Question 15: Brain axial angulation
    (v_quiz_content_id, 'neuro-proc-brain-angle', 'neuro-procedures-fundamentals', 'multiplechoice', 'The typical angulation for axial imaging of the brain is parallel to the ________________.', '{"A": "Foramen Magnum", "B": "Anterior Commissure-Posterior Commissure (ACPC) line", "C": "Nasion", "D": "Glabella"}', 'B', 1, 14,
    'Think about internal brain landmarks - there''s a famous line connecting two brain structures!',
    '**ACPC line** = The gold standard brain angle! 🧠📏\n\n💡 **Remember it:** ACPC = Anterior Commissure to Posterior Commissure line. These are two tiny white matter structures in the MIDDLE of your brain that connect the two hemispheres. The ACPC LINE is like the brain''s "equator" - a reliable INTERNAL landmark that runs front-to-back through the center of the brain. By angling your axial slices PARALLEL to the ACPC line, you get standardized, reproducible brain images that look the same every time and match anatomy atlases. It''s the REFERENCE LINE for brain imaging!',
    null),

    -- Question 16-19: Matching/labeling questions with images
    -- Brain anatomy labeling (sagittal)
    (v_quiz_content_id, 'neuro-proc-brain-label-1', 'neuro-procedures-fundamentals', 'multiplechoice', 'In this sagittal brain MRI, what structure is labeled as #1?', '{"A": "Corpus callosum", "B": "Thalamus", "C": "Pons", "D": "Cerebellum"}', 'A', 1, 15,
    'Look at the top of the image - it''s the thick white band connecting the two brain hemispheres!',
    '**Corpus Callosum** = The brain''s main highway! 🛣️\n\n💡 **Remember it:** CORPUS CALLOSUM = the BIG WHITE BRIDGE connecting left and right brain hemispheres! On sagittal brain MRI (side view), it looks like a thick, curved white band arching across the TOP-MIDDLE of the brain. It''s HUGE and impossible to miss - like a boomerang or banana shape. This is the brain''s superhighway with over 200 MILLION nerve fibers allowing the left and right sides to communicate. Think: CORPUS = BODY/CORE, CALLOSUM = CALLUS (thick/tough). It''s that thick white structure at the top!',
    'https://0cm.classmarker.com/10742032_TNJF0ZXE.png'),

    (v_quiz_content_id, 'neuro-proc-brain-label-2', 'neuro-procedures-fundamentals', 'multiplechoice', 'In this sagittal brain MRI, what structure is labeled as #2?', '{"A": "Corpus callosum", "B": "Thalamus", "C": "Pons", "D": "Cerebellum"}', 'B', 1, 16,
    'It''s the egg-shaped gray structure in the CENTER of the brain!',
    '**Thalamus** = The brain''s relay station! 🥚\n\n💡 **Remember it:** THALAMUS = the EGG in the middle! On sagittal MRI, it looks like a gray, egg-shaped structure right in the CENTER of the brain, just below the corpus callosum. The thalamus is your brain''s RELAY STATION - almost ALL sensory information (except smell) passes through the thalamus before going to the cortex. Think: THALAMUS = THE ALMOST US - almost everything goes through it to get to "us" (consciousness). It''s that gray egg in the middle!',
    'https://0cm.classmarker.com/10742032_TNJF0ZXE.png'),

    (v_quiz_content_id, 'neuro-proc-brain-label-3', 'neuro-procedures-fundamentals', 'multiplechoice', 'In this sagittal brain MRI, what structure is labeled as #3?', '{"A": "Corpus callosum", "B": "Thalamus", "C": "Pons", "D": "Cerebellum"}', 'C', 1, 17,
    'It''s the BRIDGE in the brainstem - literally what its name means!',
    '**Pons** = The brainstem bridge! 🌉\n\n💡 **Remember it:** PONS = BRIDGE in Latin! It''s the bulging part of the brainstem that looks like a little bump or bridge in the middle. On sagittal MRI, the brainstem has 3 parts from top to bottom: midbrain (small), PONS (the big bulge/bridge), and medulla (the tail going down to spinal cord). The PONS is the THICK MIDDLE SECTION that "bridges" the upper brain to the lower brainstem and cerebellum. Look for the bump in the middle of the brainstem - that''s your pons!',
    'https://0cm.classmarker.com/10742032_TNJF0ZXE.png'),

    (v_quiz_content_id, 'neuro-proc-brain-label-4', 'neuro-procedures-fundamentals', 'multiplechoice', 'In this sagittal brain MRI, what structure is labeled as #4?', '{"A": "Corpus callosum", "B": "Thalamus", "C": "Pons", "D": "Cerebellum"}', 'D', 1, 18,
    'It''s the tree-like structure in the BACK/BOTTOM of the brain - the "little brain"!',
    '**Cerebellum** = The little brain in the back! 🌳\n\n💡 **Remember it:** CEREBELLUM = "little brain" in Latin! It sits in the POSTERIOR FOSSA (back of the skull) BELOW the cerebrum. On sagittal MRI, it has a distinctive TREE-LIKE appearance called the "arbor vitae" (tree of life) - you can see the branching white matter pattern. The cerebellum controls COORDINATION, BALANCE, and FINE MOTOR CONTROL. Think: If you''re drunk and can''t walk straight, that''s your CEREBELLUM not working! It''s that tree-like structure in the back-bottom!',
    'https://0cm.classmarker.com/10742032_TNJF0ZXE.png'),

    -- C-spine anatomy labeling (sagittal)
    (v_quiz_content_id, 'neuro-proc-cspine-label-1', 'neuro-procedures-fundamentals', 'multiplechoice', 'In this sagittal cervical spine MRI, what structure is labeled as #1?', '{"A": "C2", "B": "C4-C5 Disc", "C": "Spinal Cord", "D": "Spinous Process"}', 'A', 1, 19,
    'Count from the TOP! This is the second vertebra from the top.',
    '**C2 (Axis)** = The second cervical vertebra! 🦴\n\n💡 **Remember it:** C2 = the AXIS vertebra = second one from the top! The cervical spine has 7 vertebrae (C1-C7). C1 (atlas) is the first one at the very top (holds up your head like Atlas holding the world). C2 (axis) is RIGHT BELOW C1 and has a special "tooth" (dens/odontoid process) that sticks UP into C1, allowing your head to rotate. On sagittal MRI, start counting from the TOP and count down: 1, 2, 3... #1 from top = C2!',
    'https://0cm.classmarker.com/10742032_7HYOGSLT.png'),

    (v_quiz_content_id, 'neuro-proc-cspine-label-2', 'neuro-procedures-fundamentals', 'multiplechoice', 'In this sagittal cervical spine MRI, what structure is labeled as #2?', '{"A": "C2", "B": "C4-C5 Disc", "C": "Spinal Cord", "D": "Spinous Process"}', 'B', 1, 20,
    'It''s the cushion BETWEEN two vertebral bodies - the shock absorber!',
    '**C4-C5 Disc** = The cushion between vertebrae! 💿\n\n💡 **Remember it:** INTERVERTEBRAL DISC = the CUSHION between bones! Like a jelly donut - tough outer ring (annulus fibrosus) and squishy center (nucleus pulposus). Discs act as SHOCK ABSORBERS between vertebrae. They''re labeled by the vertebrae ABOVE and BELOW: C4-C5 disc sits BETWEEN C4 (above) and C5 (below). On MRI, discs are BRIGHT on T2 (lots of water), DARK on T1. When they bulge or herniate (HNP), that squishy center pushes out and can pinch nerves. Look for the bright cushion between bones!',
    'https://0cm.classmarker.com/10742032_7HYOGSLT.png'),

    (v_quiz_content_id, 'neuro-proc-cspine-label-3', 'neuro-procedures-fundamentals', 'multiplechoice', 'In this sagittal cervical spine MRI, what structure is labeled as #3?', '{"A": "C2", "B": "C4-C5 Disc", "C": "Spinal Cord", "D": "Spinous Process"}', 'C', 1, 21,
    'It''s the gray tube running down the CENTER of the spinal canal!',
    '**Spinal Cord** = Your neural superhighway! 🚄\n\n💡 **Remember it:** The SPINAL CORD is the extension of your BRAIN running down through the vertebral canal! It carries ALL signals between your brain and body. On sagittal MRI, it looks like a gray TUBE running down the CENTER of the spinal canal (the hollow space inside the stacked vertebrae). The cord is surrounded by CSF (bright on T2) for cushioning. The cord ENDS at about L1-L2 (conus medullaris), then continues as nerve roots (cauda equina = "horse''s tail"). Protect it at all costs - it''s your brain''s lifeline!',
    'https://0cm.classmarker.com/10742032_7HYOGSLT.png'),

    (v_quiz_content_id, 'neuro-proc-cspine-label-4', 'neuro-procedures-fundamentals', 'multiplechoice', 'In this sagittal cervical spine MRI, what structure is labeled as #4?', '{"A": "C2", "B": "C4-C5 Disc", "C": "Spinal Cord", "D": "Spinous Process"}', 'D', 1, 22,
    'It''s the bony pointy thing sticking out the BACK of each vertebra!',
    '**Spinous Process** = The pointy part you can feel! 👆\n\n💡 **Remember it:** Run your hand down your back - those bumps you feel are SPINOUS PROCESSES! Each vertebra has a SPINOUS PROCESS sticking out the BACK (posterior). On sagittal MRI, they look like dark bony projections pointing backward. These are where back muscles attach and they act as levers for movement. In the cervical spine, C2-C6 have BIFID (split/forked) spinous processes, while C7 has a big single one (that''s why C7 is called "vertebra prominens" - you can really feel it). Spinous = SPINE-LIKE = pointy!',
    'https://0cm.classmarker.com/10742032_7HYOGSLT.png'),

    -- T-spine anatomy labeling (axial)
    (v_quiz_content_id, 'neuro-proc-tspine-label-1', 'neuro-procedures-fundamentals', 'multiplechoice', 'In this axial thoracic spine MRI, what structure is labeled as #1?', '{"A": "Vertebral body", "B": "Spinal Cord", "C": "Transverse Process", "D": "Spinous Process"}', 'A', 1, 23,
    'It''s the big round/oval FRONT part of the vertebra - the weight-bearing part!',
    '**Vertebral Body** = The main weight-bearing part! 🏋️\n\n💡 **Remember it:** The VERTEBRAL BODY is the BIG ROUND/CYLINDRICAL front part of each vertebra that bears all the weight! Think of vertebrae like a ring: the BODY is the thick front part (anterior), and the arch wraps around the back to protect the spinal cord. On axial (cross-section) MRI, the vertebral body looks like a big round or oval structure in the FRONT. This is the part that can fracture in compression fractures or get invaded by tumors. Bodies stack on top of each other with discs in between. BODY = BULK = weight bearer!',
    'https://0cm.classmarker.com/10742032_T0EIXV4L.png'),

    (v_quiz_content_id, 'neuro-proc-tspine-label-2', 'neuro-procedures-fundamentals', 'multiplechoice', 'In this axial thoracic spine MRI, what structure is labeled as #2?', '{"A": "Vertebral body", "B": "Spinal Cord", "C": "Transverse Process", "D": "Spinous Process"}', 'B', 1, 24,
    'It''s the round gray structure in the CENTER of the canal!',
    '**Spinal Cord** = The gray circle in the middle! ⭕\n\n💡 **Remember it:** On AXIAL (cross-section) spine MRI, the spinal cord looks like a GRAY CIRCLE in the middle of the spinal canal! It''s surrounded by bright CSF (on T2) which acts as a cushion. The cord is GRAY on T1 and T2 (intermediate signal). In the cervical and thoracic spine, the cord is continuous. In the lumbar spine, the CORD ENDS at L1-L2 (conus medullaris), and only nerve roots continue below (cauda equina). On axial, always look for that gray circle - that''s the precious spinal cord!',
    'https://0cm.classmarker.com/10742032_T0EIXV4L.png'),

    (v_quiz_content_id, 'neuro-proc-tspine-label-3', 'neuro-procedures-fundamentals', 'multiplechoice', 'In this axial thoracic spine MRI, what structure is labeled as #3?', '{"A": "Vertebral body", "B": "Spinal Cord", "C": "Transverse Process", "D": "Spinous Process"}', 'C', 1, 25,
    'It''s the bony wings sticking out to the SIDES!',
    '**Transverse Process** = The side wings! 🦅\n\n💡 **Remember it:** TRANSVERSE = ACROSS/SIDEWAYS = processes sticking out to the SIDES! Each vertebra has TWO transverse processes (left and right) projecting laterally (sideways). On axial MRI, they look like dark bony projections on each SIDE of the vertebral body and spinal canal. These are attachment points for muscles and ligaments. In the THORACIC spine, the RIBS also attach to the transverse processes! Think: TRANSVERSE = TRANS-verse (across) = side to side. NOT the spinous process (that''s the one pointing BACK). Transverse = side wings!',
    'https://0cm.classmarker.com/10742032_T0EIXV4L.png'),

    -- L-spine anatomy labeling (sagittal)
    (v_quiz_content_id, 'neuro-proc-lspine-label-1', 'neuro-procedures-fundamentals', 'multiplechoice', 'In this sagittal lumbar spine MRI, what structure is labeled as #1?', '{"A": "Conus Medullaris", "B": "Abdominal Aorta", "C": "L3 Vertebral Body", "D": "L5-S1 disc space"}', 'A', 1, 26,
    'It''s the tapered END of the spinal cord!',
    '**Conus Medullaris** = Where the spinal cord ends! 🎯\n\n💡 **Remember it:** CONUS = CONE = the tapered END of the spinal cord! The spinal cord doesn''t go all the way down to your tailbone - it ENDS at about the L1-L2 level as the CONUS MEDULLARIS. Below that, only nerve roots continue (called cauda equina = "horse''s tail"). On sagittal lumbar MRI, look for where the gray cord TAPERS and ENDS - that''s the conus! Below it, you''ll see individual nerve roots floating in CSF. If the conus is LOW (below L2), that''s a "low-lying conus" (can be normal or a tethered cord). CONUS = END CONE!',
    'https://0cm.classmarker.com/10742032_KB45918J.png'),

    (v_quiz_content_id, 'neuro-proc-lspine-label-2', 'neuro-procedures-fundamentals', 'multiplechoice', 'In this sagittal lumbar spine MRI, what structure is labeled as #2?', '{"A": "Conus Medullaris", "B": "Abdominal Aorta", "C": "L3 Vertebral Body", "D": "L5-S1 disc space"}', 'B', 1, 27,
    'It''s the big blood vessel in FRONT of the spine!',
    '**Abdominal Aorta** = The body''s main pipeline! 🫀\n\n💡 **Remember it:** The AORTA is the BIGGEST artery in your body! It comes down from the heart through the chest (thoracic aorta) and continues through the ABDOMEN (abdominal aorta) RIGHT IN FRONT of the lumbar spine. On sagittal lumbar MRI, you can see it as a tubular structure ANTERIOR (in front) to the vertebral bodies. It''s usually dark (flow void) on standard sequences or bright on special vascular sequences. The aorta carries oxygenated blood from the heart to the rest of the body. If it ruptures (AAA = abdominal aortic aneurysm), that''s a life-threatening emergency!',
    'https://0cm.classmarker.com/10742032_KB45918J.png'),

    (v_quiz_content_id, 'neuro-proc-lspine-label-3', 'neuro-procedures-fundamentals', 'multiplechoice', 'In this sagittal lumbar spine MRI, what structure is labeled as #3?', '{"A": "Conus Medullaris", "B": "Abdominal Aorta", "C": "L3 Vertebral Body", "D": "L5-S1 disc space"}', 'C', 1, 28,
    'Count the lumbar vertebrae - this is the THIRD one from the top!',
    '**L3 Vertebral Body** = The middle lumbar vertebra! 🦴\n\n💡 **Remember it:** The lumbar spine has 5 vertebrae (L1-L5). L3 is right in the MIDDLE! On sagittal MRI, count the lumbar vertebral bodies from TOP to BOTTOM: L1 (first one below the last rib/T12), L2, L3 (middle one - usually around belly button level), L4, L5 (last one before sacrum). L3 is often used as a landmark - it''s roughly at the ILIAC CREST level. Each vertebral body is that rectangular bony structure (the weight-bearing part). L3 = middle = #3 in a 5-vertebra stack!',
    'https://0cm.classmarker.com/10742032_KB45918J.png'),

    (v_quiz_content_id, 'neuro-proc-lspine-label-4', 'neuro-procedures-fundamentals', 'multiplechoice', 'In this sagittal lumbar spine MRI, what structure is labeled as #4?', '{"A": "Conus Medullaris", "B": "Abdominal Aorta", "C": "L3 Vertebral Body", "D": "L5-S1 disc space"}', 'D', 1, 29,
    'It''s the very BOTTOM disc - the cushion between the last lumbar vertebra and the sacrum!',
    '**L5-S1 disc space** = The lumbosacral junction! 💿\n\n💡 **Remember it:** L5-S1 = the disc BETWEEN the last lumbar vertebra (L5) and the first sacral vertebra (S1). This is the LUMBOSACRAL JUNCTION - where the mobile lumbar spine meets the fixed sacrum. It''s the MOST COMMON site for disc herniations in the lower back! This disc takes a LOT of stress because it''s at the transition point. On sagittal MRI, it''s the disc space at the VERY BOTTOM of the lumbar spine, right above the triangular sacrum. L5-S1 = last lumbar disc = herniation hotspot!',
    'https://0cm.classmarker.com/10742032_KB45918J.png')
  ;

END $$;

