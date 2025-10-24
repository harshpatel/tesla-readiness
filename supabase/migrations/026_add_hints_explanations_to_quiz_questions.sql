-- Add hint and explanation columns to quiz_questions table
ALTER TABLE quiz_questions 
ADD COLUMN IF NOT EXISTS hint TEXT,
ADD COLUMN IF NOT EXISTS explanation TEXT;

-- Update with data from JSON files
-- Medical Terminology questions will be updated via script
-- Introduction to MRI questions will be updated via script
-- General Anatomy & Physiology questions will be updated via script

COMMENT ON COLUMN quiz_questions.hint IS 'Helpful hint shown after first incorrect answer';
COMMENT ON COLUMN quiz_questions.explanation IS 'Detailed explanation with mnemonics and learning aids';


-- Update quiz_questions with hints and explanations from JSON files

DO $$
BEGIN
  RAISE NOTICE 'Updating hints and explanations for quiz questions...';

  -- Medical Terminology
  UPDATE quiz_questions
  SET 
    hint = 'Think of the glue that COMBINES word parts together smoothly!',
    explanation = '**Combining Forms** are the 4th building block! 🧩

💡 **Remember it:** Medical terms = PREFIX + WORD ROOT + SUFFIX + COMBINING FORM. The combining form is usually a vowel (like ''o'' or ''i'') that connects word parts to make pronunciation easier. Like ''cardi/o/logy'' - the ''o'' is the combining form that smoothly connects ''cardi'' (heart) to ''logy'' (study of)!',
    updated_at = NOW()
  WHERE question_id = 'fund-1';

  UPDATE quiz_questions
  SET 
    hint = 'Think of the ROOT of a tree - it''s the FOUNDATION, the main body part!',
    explanation = '**Word Root** indicates the body part! 🌳

💡 **Remember it:** The WORD ROOT is the MAIN PART - it tells you WHAT body part you''re talking about. Cardi = heart, gastro = stomach, neuro = nerve, derma = skin. Everything else (prefixes, suffixes) just modifies this main body part!',
    updated_at = NOW()
  WHERE question_id = 'fund-2';

  UPDATE quiz_questions
  SET 
    hint = 'SUF-FIX = comes at the end, like the FIX-up happens AFTER!',
    explanation = '**Suffix** comes at the END! 🎯

💡 **Remember it:** SUFFIX = SUF (sounds like ''stuff'') that comes AFTER! It''s the ENDING. Like appendic-ITIS (inflammation), tonsill-ECTOMY (removal), cardi-OLOGY (study of). The suffix ALWAYS comes LAST and tells you what''s happening to that body part!',
    updated_at = NOW()
  WHERE question_id = 'fund-3';

  UPDATE quiz_questions
  SET 
    hint = 'PRE-fix = comes BEFORE and tells you WHERE, WHEN, HOW MANY!',
    explanation = '**Prefix** indicates location, time, number, status! 📍

💡 **Remember it:** PREFIX = PRE (before) - it comes FIRST and describes WHERE (peri=around, hypo=under), WHEN (post=after, pre=before), HOW MANY (mono=one, poly=many), or STATUS (hyper=too much, hypo=too little). It MODIFIES the word root that comes after it!',
    updated_at = NOW()
  WHERE question_id = 'fund-4';

  UPDATE quiz_questions
  SET 
    hint = 'Think carcinoma - the medical term for cancer tumors!',
    explanation = '**Carcin** = **Cancer**! 🎗️

💡 **Remember it:** CARCIN-OMA is the medical term for a cancerous tumor. Whenever you see CARCIN, think CANCER cells. Like adenocarcinoma (cancer of glandular tissue) or squamous cell carcinoma (cancer of flat skin cells)!',
    updated_at = NOW()
  WHERE question_id = 'fund-5';

  UPDATE quiz_questions
  SET 
    hint = 'It''s the vowel that makes words flow smoothly - like ''o'' in cardi-O-logy!',
    explanation = '**Combining Form** helps with pronunciation! 🗣️

💡 **Remember it:** The COMBINING FORM is usually a VOWEL (o, i, a) that acts like GLUE between word parts to make them easier to say. Without it, words would sound clunky! Compare ''cardlogy'' (ugh!) vs ''cardi-O-logy'' (smooth!). It''s the pronunciation helper!',
    updated_at = NOW()
  WHERE question_id = 'fund-6';

  UPDATE quiz_questions
  SET 
    hint = 'MOST of the time it''s a vowel, but not ALWAYS!',
    explanation = '**FALSE!** While combining forms are USUALLY vowels (o, i, a), they''re not ALWAYS vowels! ⚠️

💡 **Remember it:** MOST combining forms are vowels (like ''o'' in gastr-o-logy), but sometimes consonants can be used. The key is that they make pronunciation easier - that''s their job! Don''t assume 100% vowel - think ''pronunciation helper'' instead!',
    updated_at = NOW()
  WHERE question_id = 'fund-7';

  UPDATE quiz_questions
  SET 
    hint = 'Think of the 5 vowels you learned in kindergarten!',
    explanation = '**I** is the missing vowel! 🔤

💡 **Remember it:** The 5 vowels are A, E, I, O, U (and sometimes Y)! In medical terminology, these vowels are often used as combining forms. So A-E-I-O-U - you were missing the ''I''! Easy once you remember your vowels from grade school!',
    updated_at = NOW()
  WHERE question_id = 'fund-8';

  UPDATE quiz_questions
  SET 
    hint = 'The ENDING determines if it''s a thing (noun) or describing word (adjective)!',
    explanation = '**Suffix** changes the part of speech! 📝

💡 **Remember it:** The SUFFIX at the END determines if a word is a NOUN (a thing/person/place) or ADJECTIVE (describing word). Like hepat-IC (adjective: relating to liver) vs hepat-ITIS (noun: inflammation of liver). The suffix transforms the word root into different parts of speech!',
    updated_at = NOW()
  WHERE question_id = 'fund-9';

  UPDATE quiz_questions
  SET 
    hint = 'Hepatic DESCRIBES something - it''s a describing word!',
    explanation = '**Adjective** - the suffix ''-ic'' makes it descriptive! ✨

💡 **Remember it:** HEPAT-IC = ''relating to the liver'' - it DESCRIBES/MODIFIES something. ''Hepatic artery'' = the artery RELATED TO the liver. Whenever you see -IC at the end, it''s an ADJECTIVE that describes or relates to the word root. Like ''cardiac'' (relating to heart), ''gastric'' (relating to stomach)!',
    updated_at = NOW()
  WHERE question_id = 'fund-10';

  UPDATE quiz_questions
  SET 
    hint = 'PERI = around, like the PERIMETER around a fence!',
    explanation = '**Pericardium** = the sac AROUND the heart! 💗

💡 **Remember it:** PERI = AROUND (like PERIMETER is the boundary AROUND something). CARDI = heart. PERICARDIUM is literally the protective membrane that wraps AROUND your heart like a cozy blanket! It''s the outer covering!',
    updated_at = NOW()
  WHERE question_id = 'fund-11';

  UPDATE quiz_questions
  SET 
    hint = 'HYPO = below/under, like a HIPPO sinking UNDER water!',
    explanation = '**Hypodermic** = UNDER the skin! 💉

💡 **Remember it:** HYPO = UNDER/BELOW. DERM = skin. A HYPODERMIC needle goes UNDER your skin to inject medicine. Think of a HIPPO sinking UNDER water = HYPO means UNDER! Hypodermic, hypoglycemia (low blood sugar UNDER normal), hypothermia (body temp UNDER normal)!',
    updated_at = NOW()
  WHERE question_id = 'fund-12';

  UPDATE quiz_questions
  SET 
    hint = 'Think of an ACUTE angle - it''s SHARP and SUDDEN!',
    explanation = '**Acute** = sudden, sharp, severe onset! ⚡

💡 **Remember it:** ACUTE = think of an ACUTE ANGLE in math - it''s SHARP! Acute illness comes on SUDDENLY and is SEVERE but SHORT-lived. Like acute appendicitis (sudden, severe pain) or acute heart attack. Opposite of chronic (long-lasting). ACUTE = SHARP + SUDDEN + SHORT!',
    updated_at = NOW()
  WHERE question_id = 'fund-13';

  UPDATE quiz_questions
  SET 
    hint = 'Hepatitis C lasts a LONG time - it''s not sudden!',
    explanation = '**Chronic** = long-lasting, persistent condition! ⏱️

💡 **Remember it:** CHRONIC = LONG-TERM, ongoing, persisting. Hepatitis C can last YEARS or a LIFETIME. Think CHRONIC = CONTINUOUSLY present over a LONG time. Like chronic pain, chronic disease. Opposite of ACUTE (sudden/short). CHRONIC = LONG + LASTING + PERSISTENT!',
    updated_at = NOW()
  WHERE question_id = 'fund-14';

  UPDATE quiz_questions
  SET 
    hint = 'Think of something being IN FLAMES - red, hot, swollen!',
    explanation = '**Inflammation** = body''s immune response with redness, heat, swelling, pain! 🔥

💡 **Remember it:** IN-FLAME-ation = literally IN FLAMES! When your body detects injury or infection, it sends blood and immune cells causing the area to be RED (blood flow), HOT (increased temperature), SWOLLEN (fluid buildup), PAINFUL. It''s your body''s alarm system! Think of any ''-ITIS'' word!',
    updated_at = NOW()
  WHERE question_id = 'fund-15';

  UPDATE quiz_questions
  SET 
    hint = 'A cough is something YOU feel (symptom) AND something others can observe (sign)!',
    explanation = '**TRUE!** A cough can be both! ✅

💡 **Remember it:** SYMPTOM = what the PATIENT feels/reports (''I have a cough''). SIGN = what others can SEE/HEAR/MEASURE (''I hear you coughing''). A COUGH is both - the patient FEELS the urge and reports it (symptom) AND others can HEAR it happening (sign). Some things cross over!',
    updated_at = NOW()
  WHERE question_id = 'fund-16';

  UPDATE quiz_questions
  SET 
    hint = 'Think of a mountain - the APEX is the pointy top, the BASE is the wide bottom!',
    explanation = '**Apex = Pointed, Base = Wide** ⛰️

💡 **Remember it:** Think of a MOUNTAIN or CONE! The APEX is the POINTY TIP at the top. The BASE is the WIDE BOTTOM. Like the apex of your heart (pointy tip pointing down-left) and the base of your heart (wide top). APEX = A-PEAK (pointed), BASE = BROAD (wide)!',
    updated_at = NOW()
  WHERE question_id = 'fund-17';

  UPDATE quiz_questions
  SET 
    hint = 'Think of an AXE chopping you horizontally into top and bottom slices!',
    explanation = '**Axial** plane = horizontal slices showing superior/inferior! 🪓

💡 **Remember it:** AXIAL = imagine an AXE chopping you HORIZONTALLY into TOP (superior) and BOTTOM (inferior) slices - like cutting a cake into layers! You''re looking UP or DOWN through the body. Also called TRANSVERSE plane. Sagittal = left/right, Coronal = front/back, Axial = top/bottom!',
    updated_at = NOW()
  WHERE question_id = 'fund-18';

  UPDATE quiz_questions
  SET 
    hint = 'Think of checking back with the doctor later!',
    explanation = '**f/u** = **Follow up** 📅

💡 **Remember it:** F/U = FOLLOW UP - checking back with the patient later to see how they''re doing after treatment. ''Patient needs f/u in 2 weeks'' = come back in 2 weeks for a follow-up appointment. Super common abbreviation in medical charts!',
    updated_at = NOW()
  WHERE question_id = 'fund-19';

  UPDATE quiz_questions
  SET 
    hint = 'The wrist is DISTANT/farther from the body''s center than the elbow!',
    explanation = '**Distal** = farther from the body''s center! 📏

💡 **Remember it:** DISTAL = DISTance/DISTANT - FARTHER from the center/trunk of the body. Your wrist is FARTHER from your shoulder than your elbow is. PROXIMAL = PROXIMITY - CLOSER to the center. So wrist is DISTAL to elbow, and elbow is PROXIMAL to wrist. Think DISTAL = DISTANT!',
    updated_at = NOW()
  WHERE question_id = 'fund-20';

  UPDATE quiz_questions
  SET 
    hint = 'Think of when you get a mosquito bite - it''s red, hot, and irritated!',
    explanation = '**-itis** means **inflammation** 🔥

💡 **Remember it:** Picture something that''s ''IT IS'' on fire and red! Appendicitis = your appendix IS inflamed. Tonsillitis = your tonsils are inflamed (red, swollen, painful). Arthritis = your joints are inflamed. Whenever you see -ITIS, think ''IT IS red and angry!''',
    updated_at = NOW()
  WHERE question_id = 'suf-1';

  UPDATE quiz_questions
  SET 
    hint = 'Think ''EXIT, TAKE ME OUT!'' - something''s being taken out!',
    explanation = '**-ectomy** means **surgical removal** ✂️

💡 **Remember it:** -ECTOMY sounds like ''EXIT ME'' - something''s being REMOVED, taken OUT! Appendectomy = removal of appendix. Tonsillectomy = removal of tonsils. Mastectomy = removal of breast. If you see -ECTOMY, something''s getting CUT OUT and leaving the body!',
    updated_at = NOW()
  WHERE question_id = 'suf-2';

  UPDATE quiz_questions
  SET 
    hint = 'Think ''ALL-GEE-AH!'' - what you yell when something hurts!',
    explanation = '**-algia** means **pain** 😣

💡 **Remember it:** -ALGIA sounds like ''ALL-GEE-AH!'' or ''OUCH-AH!'' - what you scream when you''re in PAIN! Neuralgia = nerve pain. Myalgia = muscle pain. Arthralgia = joint pain. Whenever you see -ALGIA, something HURTS and you''re saying ''AH!''',
    updated_at = NOW()
  WHERE question_id = 'suf-3';

  UPDATE quiz_questions
  SET 
    hint = 'Think of PLASTIC surgery - reshaping and fixing things!',
    explanation = '**-plasty** means **surgical repair** or **reconstruction** 🔧

💡 **Remember it:** -PLASTY sounds like PLASTIC! Think of PLASTIC surgery - molding, reshaping, REPAIRING! Rhinoplasty = nose job (repairing/reshaping nose). Angioplasty = repairing blood vessels. Like working with Play-Doh or PLASTIC - you''re SCULPTING and FIXING something!',
    updated_at = NOW()
  WHERE question_id = 'suf-4';

  UPDATE quiz_questions
  SET 
    hint = 'Think of SYMPATHY - feeling bad because someone is sick!',
    explanation = '**-pathy** means **disease** or **disorder** 🤒

💡 **Remember it:** Think of having SYMPATHY for someone who''s sick - you feel bad about their DISEASE! Neuropathy = nerve disease. Cardiomyopathy = heart muscle disease. Whenever you see -PATHY, something is WRONG, something''s DISEASED or not functioning right!',
    updated_at = NOW()
  WHERE question_id = 'suf-5';

  UPDATE quiz_questions
  SET 
    hint = 'Think of biology, psychology, geology - what are all these?',
    explanation = '**-ology** means **study of** 📚

💡 **Remember it:** -OLOGY = ''OH! LOGIC!'' - the STUDY and LOGIC of something! Biology = study of life. Cardiology = study of the heart. Psychology = study of the mind. Whenever you see -OLOGY, someone''s studying and learning about that thing!',
    updated_at = NOW()
  WHERE question_id = 'suf-6';

  UPDATE quiz_questions
  SET 
    hint = 'Think of a surgeon making a CUT to look inside - not removing, just opening!',
    explanation = '**-otomy** means **incision** or **cutting into** ✂️

💡 **Remember it:** -OTOMY sounds like ''OH-TO-ME!'' - like saying ''cut INTO me!'' Tracheotomy = cutting INTO the trachea (to help breathing). Lobotomy = cutting INTO the brain. Different from -ECTOMY (removal) - this is just CUTTING IN to look or access something, like slicing open a present!',
    updated_at = NOW()
  WHERE question_id = 'suf-7';

  UPDATE quiz_questions
  SET 
    hint = 'Think MEGA - like mega-size, mega-big!',
    explanation = '**-megaly** means **enlargement** or **abnormally large** 📏

💡 **Remember it:** -MEGALY starts with MEGA - like MEGA-SIZE at McDonald''s, or MEGA-blocks - it means BIG! Cardiomegaly = enlarged heart. Hepatomegaly = enlarged liver. Splenomegaly = enlarged spleen. Whenever you see -MEGALY, something grew too BIG, like it got MEGA-SIZED!',
    updated_at = NOW()
  WHERE question_id = 'suf-8';

  UPDATE quiz_questions
  SET 
    hint = 'Think of diarrhea - something flowing that shouldn''t be!',
    explanation = '**-rrhea** means **flow** or **discharge** 💧

💡 **Remember it:** -RRHEA sounds like ''RHEA'' (runs away)! Think of diaRRHEA - everything''s FLOWING out! Rhinorrhea = runny nose (discharge FLOWING from nose). Menorrhea = menstrual flow. Whenever you see -RRHEA, something''s RUNNING, FLOWING, or LEAKING out!',
    updated_at = NOW()
  WHERE question_id = 'suf-9';

  UPDATE quiz_questions
  SET 
    hint = 'Think of PNEUMONIA - a breathing problem!',
    explanation = '**-pnea** means **breathing** 🫁

💡 **Remember it:** -PNEA sounds like PNEUMONIA - a BREATHING disease! Apnea = without breathing (sleep apnea - you STOP breathing!). Dyspnea = difficult breathing. Tachypnea = fast breathing. Whenever you see -PNEA, think LUNGS and BREATHING!',
    updated_at = NOW()
  WHERE question_id = 'suf-10';

  UPDATE quiz_questions
  SET 
    hint = 'Think of a telescope or microscope - tools for LOOKING at things!',
    explanation = '**-scopy** means **visual examination** or **looking at** 👁️

💡 **Remember it:** -SCOPY = SCOPE IT OUT! Like a telesCOPE or microSCOPE - you''re LOOKING at something! Colonoscopy = looking inside your colon with a camera. Endoscopy = looking inside your body. Whenever you see -SCOPY, someone''s taking a PEEK inside with a camera!',
    updated_at = NOW()
  WHERE question_id = 'suf-11';

  UPDATE quiz_questions
  SET 
    hint = 'Think of ANEMIA - a blood problem!',
    explanation = '**-emia** means **blood condition** 🩸

💡 **Remember it:** -EMIA sounds like ''IN MY BLOOD!'' Anemia = not enough red blood cells IN the blood. Leukemia = cancer of white BLOOD cells. Hyperglycemia = high blood sugar IN the blood. Whenever you see -EMIA, it''s about what''s IN YOUR BLOOD!',
    updated_at = NOW()
  WHERE question_id = 'suf-12';

  UPDATE quiz_questions
  SET 
    hint = 'Think of OSIS as ''OH SIS, something''s wrong!''',
    explanation = '**-osis** means **abnormal condition** or **disease process** ⚠️

💡 **Remember it:** -OSIS = ''OH SIS, something''s not right!'' Cirrhosis = abnormal liver condition. Necrosis = tissue death (abnormal condition). Psychosis = abnormal mental state. Stenosis = abnormal narrowing. Whenever you see -OSIS, something''s WRONG or ABNORMAL!',
    updated_at = NOW()
  WHERE question_id = 'suf-13';

  UPDATE quiz_questions
  SET 
    hint = 'Think of Instagram - pictures and images!',
    explanation = '**-gram** means **record** or **image** 📸

💡 **Remember it:** -GRAM = InstaGRAM! You''re taking a PICTURE or making a RECORD! Electrocardiogram (ECG) = recording of heart''s electrical activity. Mammogram = image/x-ray of breast. Angiogram = image of blood vessels. Whenever you see -GRAM, you''re getting a PICTURE or RECORDING!',
    updated_at = NOW()
  WHERE question_id = 'suf-14';

  UPDATE quiz_questions
  SET 
    hint = 'Think of HEMORRHAGE - massive blood loss!',
    explanation = '**-rrhage/-rrhagia** means **excessive bleeding** or **bursting forth** 🩸

💡 **Remember it:** -RRHAGE sounds like ''RAGE!'' - blood RAGING out! Hemorrhage = severe bleeding. Menorrhagia = heavy menstrual bleeding. Think of blood RAGING and GUSHING out uncontrollably - like a broken fire hydrant! Whenever you see -RRHAGE, there''s TOO MUCH bleeding!',
    updated_at = NOW()
  WHERE question_id = 'suf-15';

  UPDATE quiz_questions
  SET 
    hint = 'Think of a STENO pad - narrow lines squeezed together!',
    explanation = '**-stenosis** means **narrowing** or **tightening** 🔒

💡 **Remember it:** STENOSIS sounds like STENO (stenographer) - writing in NARROW, TIGHT little lines! Or think ''SQUEEZE-IT-CLOSE!'' Aortic stenosis = narrowing of aorta. Mitral stenosis = narrowing of heart valve. Whenever you see -STENOSIS, something''s getting SQUEEZED and NARROWED like a tight collar!',
    updated_at = NOW()
  WHERE question_id = 'suf-16';

  UPDATE quiz_questions
  SET 
    hint = 'Think of Listerine dissolving plaque - breaking things DOWN!',
    explanation = '**FALSE!** ❌ **-lysis** means **breakdown** or **destruction**, NOT hardening!

💡 **Remember it:** -LYSIS sounds like ''LIES-IS'' (falling apart)! Think of things DISSOLVING, BREAKING DOWN, LOOSENING! Hemolysis = breakdown of red blood cells. Dialysis = breaking down/filtering waste from blood. Paralysis = breakdown of muscle function. The opposite of hardening - it''s about things FALLING APART or being DESTROYED!',
    updated_at = NOW()
  WHERE question_id = 'suf-17';

  UPDATE quiz_questions
  SET 
    hint = 'Think of a needle POKING IN to drain something out!',
    explanation = '**TRUE!** ✅ **-centesis** means **surgical puncture** to remove fluid 💉

💡 **Remember it:** -CENTESIS sounds like ''SENT-A-NEEDLE-IN!'' You''re POKING through to drain fluid! Amniocentesis = puncture to remove amniotic fluid. Thoracentesis = puncture to remove fluid from chest. Paracentesis = puncture to remove abdominal fluid. Whenever you see -CENTESIS, someone''s getting a NEEDLE POKE to drain something!',
    updated_at = NOW()
  WHERE question_id = 'suf-18';

  UPDATE quiz_questions
  SET 
    hint = 'Think of a TROPHY - you grew your skills and developed into a winner!',
    explanation = '**TRUE!** ✅ **-trophy** means **growth**, **development**, or **nourishment** 🏆

💡 **Remember it:** -TROPHY like a sports TROPHY - you GREW and DEVELOPED your skills! Hypertrophy = excessive growth (muscles get BIGGER). Atrophy = wasting away (muscles SHRINK from lack of use). Dystrophy = abnormal development. Think of winning a TROPHY for GROWING stronger!',
    updated_at = NOW()
  WHERE question_id = 'suf-19';

  UPDATE quiz_questions
  SET 
    hint = 'Think of a hyper kid bouncing off the walls - their energy is way up!',
    explanation = '**hyper-** means **above normal** or **excessive** ⬆️

💡 **Remember it:** Think of a HYPER kid bouncing off the walls - their energy is ABOVE normal, EXCESSIVELY high! HYPERtension = blood pressure ABOVE normal. HYPER means you''re going UP and OVER the top!',
    updated_at = NOW()
  WHERE question_id = 'pre-1';

  UPDATE quiz_questions
  SET 
    hint = 'HYPO sounds like ''low'' - think of going down under!',
    explanation = '**hypo-** means **below normal** or **deficient** ⬇️

💡 **Remember it:** HYPO sounds like ''HI, go LOW!'' You''re going DOWN, UNDER normal levels. HYPOthermia = body temp BELOW normal (you''re too cold!). HYPOglycemia = blood sugar BELOW normal. Think of a HYPOdermic needle going UNDER your skin!',
    updated_at = NOW()
  WHERE question_id = 'pre-2';

  UPDATE quiz_questions
  SET 
    hint = 'Think of a famous quarterback taking his sweet time in the pocket...',
    explanation = '**brady-** means **slow** 🐢

💡 **Remember it:** Think of Tom BRADY slowly backing up in the pocket before throwing - taking his time! BRADYcardia = SLOW heart rate (your heart is being a ''Brady'' - playing it slow and steady). The opposite is TACHY- (fast, like a TACHOmeter showing high RPMs!)',
    updated_at = NOW()
  WHERE question_id = 'pre-3';

  UPDATE quiz_questions
  SET 
    hint = 'TACHY- sounds like tachometer (that RPM gauge in your car!)',
    explanation = '**tachycardia** means **fast heart rate** 🏃‍♂️💨

💡 **Remember it:** TACHY- means FAST (like a TACHOmeter showing high RPMs in a race car!). CARDIA = heart. So TACHYcardia = your heart is racing FAST! Think of getting TACKY (sticky) because you''re running so fast you''re sweating. Opposite of BRADYcardia (slow heart rate).',
    updated_at = NOW()
  WHERE question_id = 'pre-4';

  UPDATE quiz_questions
  SET 
    hint = 'Think of Luke Skywalker in his white Jedi robes!',
    explanation = '**leuko-** means **white** 🤍

💡 **Remember it:** Think of LUKE Skywalker in WHITE Jedi robes! Or LEUKemia - a disease of WHITE blood cells. LEUKO sounds like ''LOOK-OH'' - look at those white clouds! White blood cells are called LEUKOcytes.',
    updated_at = NOW()
  WHERE question_id = 'pre-5';

  UPDATE quiz_questions
  SET 
    hint = 'Think of someone''s face turning red when they''re embarrassed!',
    explanation = '**erythro-** means **red** ❤️

💡 **Remember it:** Think ''ERR-I-THROW up RED'' - like when you''re embarrassed (ERR) and your face turns RED! ERYTHROcytes = RED blood cells. ERYTHROmycin (antibiotic) has a reddish color. Picture someone BLUSHING red - that''s erythro!',
    updated_at = NOW()
  WHERE question_id = 'pre-6';

  UPDATE quiz_questions
  SET 
    hint = 'Think about DYSfunctional - something not working right!',
    explanation = '**dys-** means **difficult**, **painful**, or **abnormal** 😣

💡 **Remember it:** DYS = ''THIS is difficult!'' Think of a DYSfunctional family - things aren''t working normally. DYSpnea = DIFFICULT or PAINFUL breathing (like you''re gasping ''THIS is hard!''). DYSpepsia = DIFFICULT digestion. Whenever you see DYS-, something is going WRONG or is HARD to do!',
    updated_at = NOW()
  WHERE question_id = 'pre-7';

  UPDATE quiz_questions
  SET 
    hint = 'Think of Monopoly vs. Polygamy - how many are involved?',
    explanation = '**FALSE!** ❌ **poly-** means **many** or **multiple**, NOT one!

💡 **Remember it:** POLY = PLENTY! Think POLYgamy (MANY spouses), POLYgon (MANY sides), or a talking PARROT that says ''POLLY want a cracker'' - and POLLY wants MANY crackers! POLYuria = urinating MANY times. POLYdipsia = drinking MANY fluids. The opposite is MONO- (one), like MONOpoly - ONE person controlling everything!',
    updated_at = NOW()
  WHERE question_id = 'pre-8';

  UPDATE quiz_questions
  SET 
    hint = 'Think of McDonald''s Big Mac - is it small or large?',
    explanation = '**FALSE!** ❌ **macro-** means **large** or **big**, NOT small!

💡 **Remember it:** MACRO = MASSIVE! Think of McDonald''s Big MAC - it''s LARGE! Or MACROeconomics - studying the BIG picture of the economy. MACROcephaly = abnormally LARGE head. The opposite is MICRO- (small), like a MICROscope for seeing TINY things. MACRO sounds like ''MACHO'' - big and strong!',
    updated_at = NOW()
  WHERE question_id = 'pre-9';

  UPDATE quiz_questions
  SET 
    hint = 'Think of atheists - people WITHOUT belief in gods!',
    explanation = '**TRUE!** ✅ **a-** or **an-** means **without** or **absence of** 🚫

💡 **Remember it:** Think ''AH, there''s NONE!'' - the ''A'' means ABSENT! Atheist = WITHOUT belief in god. Anemia = WITHOUT enough red blood cells. Apnea = WITHOUT breathing (sleep apnea - you STOP breathing!). Asymptomatic = WITHOUT symptoms. When you see A- or AN-, something is MISSING!',
    updated_at = NOW()
  WHERE question_id = 'pre-10';

  UPDATE quiz_questions
  SET 
    hint = 'Think of a ''neurotic'' person - their NERVES are all worked up!',
    explanation = '**neuro-** means **nerve** or **nervous system** 🧠⚡

💡 **Remember it:** NEURO sounds like ''NEW-ROW'' of nerves! Think of someone NEURotic - their NERVES are frayed! Neurology = study of nerves. Neuron = nerve cell. Neuropathy = nerve disease. Whenever you see NEURO-, it''s about NERVES sending signals!',
    updated_at = NOW()
  WHERE question_id = 'root-1';

  UPDATE quiz_questions
  SET 
    hint = 'Think of GAS in your tummy - that''s where it builds up!',
    explanation = '**gastro-** means **stomach** 🍽️

💡 **Remember it:** GASTRO- sounds like GAS! Where does GAS build up? Your STOMACH! Gastritis = stomach inflammation. Gastroenterology = study of stomach and intestines. Gastric juice = stomach acid. Whenever you see GASTRO-, think of your BELLY and STOMACH!',
    updated_at = NOW()
  WHERE question_id = 'root-2';

  UPDATE quiz_questions
  SET 
    hint = 'Think of a DERMatologist - what do they treat?',
    explanation = '**derm-** or **dermato-** means **skin** 🧴

💡 **Remember it:** DERM- sounds like ''DERM-IS!'' - your skin IS your covering! Dermatology = study of skin. Dermatitis = skin inflammation. Epidermis = outer layer of skin. Think of a DERMatologist checking your SKIN for problems!',
    updated_at = NOW()
  WHERE question_id = 'root-3';

  UPDATE quiz_questions
  SET 
    hint = 'Think of a HEMOphiliac - someone with a BLOOD clotting disorder!',
    explanation = '**hemo-** or **hema-** means **blood** 🩸

💡 **Remember it:** HEMO- sounds like ''HE-MOW'' down enemies with BLOOD! Hemoglobin = protein in red BLOOD cells. Hemorrhage = excessive bleeding. Hematology = study of blood. Whenever you see HEMO- or HEMA-, it''s all about BLOOD!',
    updated_at = NOW()
  WHERE question_id = 'root-4';

  UPDATE quiz_questions
  SET 
    hint = 'Think of ARTHritis - where does it hurt? Your JOINTS!',
    explanation = '**arthro-** means **joint** 🦴

💡 **Remember it:** ARTHRO- sounds like ''ARTHUR!'' - Picture King Arthur''s rusty armor JOINTS squeaking! Arthritis = joint inflammation. Arthroscopy = looking inside a joint. Arthroplasty = joint replacement surgery. Whenever you see ARTHRO-, think of where bones MEET and MOVE - your JOINTS!',
    updated_at = NOW()
  WHERE question_id = 'root-5';

  UPDATE quiz_questions
  SET 
    hint = 'Think of your NEPHEW - he needs his KIDNEYS to filter out the juice he drinks!',
    explanation = '**nephro-** means **kidney** 🫘

💡 **Remember it:** NEPHRO- sounds like NEPHEW! Your NEPHEW needs his KIDNEYS to filter all that soda! Nephrology = study of kidneys. Nephritis = kidney inflammation. Nephrectomy = kidney removal. Whenever you see NEPHRO-, think of those bean-shaped KIDNEY filters!',
    updated_at = NOW()
  WHERE question_id = 'root-6';

  UPDATE quiz_questions
  SET 
    hint = 'Think of PULMonary - that''s your breathing system!',
    explanation = '**pulmo-** or **pulmon-** means **lung** 🫁

💡 **Remember it:** PULMO- sounds like ''PULL-MORE'' air! You PULL air into your LUNGS! Pulmonary = relating to lungs. Pulmonologist = lung doctor. Think of your lungs PULLING and PUMPING air with every breath!',
    updated_at = NOW()
  WHERE question_id = 'root-7';

  UPDATE quiz_questions
  SET 
    hint = 'Think ''MY-OH!'' - flexing YOUR muscles!',
    explanation = '**myo-** means **muscle** 💪

💡 **Remember it:** MYO- sounds like ''MY-OH!'' - flex YOUR muscles! Myocardium = heart MUSCLE. Myalgia = MUSCLE pain. Myopathy = MUSCLE disease. Whenever you see MYO-, think of MUSCLES flexing and contracting!',
    updated_at = NOW()
  WHERE question_id = 'root-8';

  UPDATE quiz_questions
  SET 
    hint = 'Think of CYTOplasm - the gooey stuff inside CELLS!',
    explanation = '**cyto-** means **cell** 🔬

💡 **Remember it:** CYTO- sounds like ''SIGHT-OH'' - you need a microscope to SIGHT cells! Cytology = study of cells. Cytoplasm = cell contents. Leukocyte = white blood CELL. Whenever you see CYTO-, think of the tiny building blocks - CELLS!',
    updated_at = NOW()
  WHERE question_id = 'root-9';

  UPDATE quiz_questions
  SET 
    hint = 'Think of CARDIO workout - gets your HEART pumping!',
    explanation = '**cardio-** means **heart** ❤️

💡 **Remember it:** CARDIO exercise gets your HEART racing! Cardiology = study of the heart. Cardiomyopathy = heart muscle disease. Tachycardia = fast heart rate. Whenever you see CARDIO-, think of that pump in your chest beating - your HEART!',
    updated_at = NOW()
  WHERE question_id = 'root-10';

  UPDATE quiz_questions
  SET 
    hint = 'Think of a RHINO - what''s the most obvious feature on its face?',
    explanation = '**rhino-** means **nose** 👃

💡 **Remember it:** Think of a RHINOCEROS - that big HORN coming out of its NOSE! Rhinitis = nose inflammation (stuffy nose). Rhinoplasty = nose job. Rhinorrhea = runny nose. Whenever you see RHINO-, picture that rhino''s giant NOSE horn!',
    updated_at = NOW()
  WHERE question_id = 'root-11';

  UPDATE quiz_questions
  SET 
    hint = 'Think of it as ''EN-CEPHALO'' - IN your head is your BRAIN!',
    explanation = '**encephalo-** means **brain** 🧠

💡 **Remember it:** ENCEPHALO- = ''IN-CEPHALON'' (IN your head)! Encephalitis = brain inflammation. Encephalopathy = brain disease. EEG (electroENCEPHALOgram) = recording brain waves. Whenever you see ENCEPHALO-, think of what''s INSIDE your skull - your BRAIN!',
    updated_at = NOW()
  WHERE question_id = 'root-12';

  UPDATE quiz_questions
  SET 
    hint = 'Think of CHOLEsterol - that fatty stuff in your BILE!',
    explanation = '**chole-** or **cholo-** means **bile** or **gall** 💛

💡 **Remember it:** CHOLE- sounds like CHOLESTEROL - found in BILE! Cholecystitis = gallbladder inflammation (stores bile). Cholesterol = fatty substance in bile. Bile is that greenish-yellow digestive fluid your liver makes!',
    updated_at = NOW()
  WHERE question_id = 'root-13';

  UPDATE quiz_questions
  SET 
    hint = 'Think of ENTERING food - it goes through your long, winding intestines!',
    explanation = '**entero-** means **intestines** or **small intestine** 🌀

💡 **Remember it:** ENTERO- sounds like ENTER! Food ENTERS and travels through those long, twisty INTESTINES! Gastroenterology = study of stomach and intestines. Enteritis = intestine inflammation. Think of that long tube where food ENTERS and gets digested!',
    updated_at = NOW()
  WHERE question_id = 'root-14';

  UPDATE quiz_questions
  SET 
    hint = 'Think of OCULAR vision or an OPHTHALMOlogist - the EYE doctor!',
    explanation = '**ocul-** or **ophthalmo-** means **eye** 👁️

💡 **Remember it:** OCULAR sounds like ''OH-COOL-ARE'' your eyes! Or think of binoculars - for your EYES! Ophthalmologist = eye doctor. Intraocular = inside the eye. Whenever you see OCUL- or OPHTHALMO-, think of those peepers - your EYES!',
    updated_at = NOW()
  WHERE question_id = 'root-15';

  UPDATE quiz_questions
  SET 
    hint = 'Think of CRANIUM - your hard SKULL protecting your brain!',
    explanation = '**crani-** or **cranio-** means **skull** 💀

💡 **Remember it:** CRANI- = CRANIUM! That hard SKULL bone protecting your brain! Craniotomy = cutting into the skull. Craniofacial = relating to skull and face. Think of CRANIberries - hard like your SKULL!',
    updated_at = NOW()
  WHERE question_id = 'root-16';

  UPDATE quiz_questions
  SET 
    hint = 'Think of THOR - the superhero with the mighty CHEST!',
    explanation = '**thoraco-** or **thorax** means **chest** 🫁

💡 **Remember it:** THORACO- sounds like THOR! Picture THOR puffing out his mighty CHEST! Thoracic cavity = chest cavity (contains heart and lungs). Thoracotomy = chest surgery. Whenever you see THORACO-, think of that barrel CHEST!',
    updated_at = NOW()
  WHERE question_id = 'root-17';

  UPDATE quiz_questions
  SET 
    hint = 'Think of PNEUMONIA - a LUNG infection!',
    explanation = '**pneumo-** or **pneumon-** means **lung** or **air** 🫁

💡 **Remember it:** PNEUMO- = PNEUMONIA (LUNG disease)! Pneumothorax = air in chest cavity (collapsed lung). Pneumonia = lung infection. Think of BREATHING air into your LUNGS - that''s PNEUMO!',
    updated_at = NOW()
  WHERE question_id = 'root-18';

  UPDATE quiz_questions
  SET 
    hint = 'RENO sounds like RENAL - your KIDNEY system!',
    explanation = '**reno-** means **kidney** 🫘

💡 **Remember it:** RENO- sounds like RENAL (kidney)! Think of the city RENO - you need your KIDNEYS to filter out the casino drinks! Renal failure = kidney failure. Renovascular = relating to kidney blood vessels. Just another word for KIDNEY (like nephro-)!',
    updated_at = NOW()
  WHERE question_id = 'root-19';

  UPDATE quiz_questions
  SET 
    hint = 'Think of a HYSTERectomy - removing the UTERUS!',
    explanation = '**hystero-** or **utero-** means **uterus** or **womb** 🤰

💡 **Remember it:** HYSTERO- in HYSTERectomy = removal of UTERUS! UTERO- literally has ''UTER-US'' in it! The uterus is where babies grow. Hysterectomy = uterus removal. Intrauterine = inside the uterus. Think of the baby''s first home - the UTERUS!',
    updated_at = NOW()
  WHERE question_id = 'root-20';

  UPDATE quiz_questions
  SET 
    hint = 'Don''t confuse with COLON! Think of a COLPOscopy exam.',
    explanation = '**colpo-** means **vagina** 🔬

💡 **Remember it:** COLPO- sounds like COAL-POT (a passageway)! Colposcopy = visual exam of vagina and cervix. Colpotomy = incision into vaginal wall. Don''t confuse with COLO- (colon) - this is specifically the VAGINAL canal!',
    updated_at = NOW()
  WHERE question_id = 'root-21';

  UPDATE quiz_questions
  SET 
    hint = 'Think of an ANGIOgram - imaging of BLOOD VESSELS!',
    explanation = '**angio-** means **blood vessel** or **vessel** 🩸

💡 **Remember it:** ANGIO- sounds like ''ANGLE-OF'' tubes! Your blood vessels ANGLE all through your body! Angiogram = x-ray of blood vessels. Angioplasty = repair of blood vessel. Angiology = study of blood vessels. Think of those tubes carrying blood - VESSELS!',
    updated_at = NOW()
  WHERE question_id = 'root-22';

  UPDATE quiz_questions
  SET 
    hint = 'Think ''OOH-FOR'' eggs - where do eggs come from? OVARIES!',
    explanation = '**oophor-** means **ovary** 🥚

💡 **Remember it:** OOPHOR- sounds like ''OOH-FOR'' eggs! OVARIES make eggs! Oophorectomy = ovary removal. Oophoritis = ovary inflammation. Think of those egg-producing organs - the OVARIES!',
    updated_at = NOW()
  WHERE question_id = 'root-23';

  UPDATE quiz_questions
  SET 
    hint = 'Think of HEPAtitis - LIVER inflammation!',
    explanation = '**TRUE!** ✅ **hepato-** means **liver** 🫀

💡 **Remember it:** HEPATO- = HEP-A! Hepatitis A = LIVER inflammation! Hepatology = study of liver. Hepatomegaly = enlarged liver. Think of the liver as your body''s FILTER - and HEPATO- is the word for it!',
    updated_at = NOW()
  WHERE question_id = 'root-24';

  UPDATE quiz_questions
  SET 
    hint = 'Think of OSTEOporosis - weak, brittle BONES!',
    explanation = '**TRUE!** ✅ **osteo-** means **bone** 🦴

💡 **Remember it:** OSTEO- = OH-STEE-OH (bones)! Osteoporosis = porous, weak bones. Osteopathy = bone disease. Osteology = study of bones. Think of your skeleton - that''s all OSTEO!',
    updated_at = NOW()
  WHERE question_id = 'root-25';

  UPDATE quiz_questions
  SET 
    hint = 'Think of a PATHOgen - something that causes DISEASE!',
    explanation = '**TRUE!** ✅ **path-** or **patho-** means **disease** or **suffering** 🤒

💡 **Remember it:** PATHO- = PATHOGEN (disease-causing germ)! Pathology = study of disease. Pathologist = doctor who studies diseases. Neuropathy = nerve disease. Whenever you see PATHO-, something''s SICK or DISEASED!',
    updated_at = NOW()
  WHERE question_id = 'root-26';

  UPDATE quiz_questions
  SET 
    hint = 'Think of a CARDIologist - the HEART doctor!',
    explanation = '**TRUE!** ✅ Both **cardi-** and **cardio-** mean **heart** ❤️

💡 **Remember it:** CARDI/CARDIO = that CARD-shaped pump in your chest! Cardiologist = heart doctor. Cardiac arrest = heart stops. Pericardium = sac around the heart. Same meaning, just slightly different spelling!',
    updated_at = NOW()
  WHERE question_id = 'root-27';

  UPDATE quiz_questions
  SET 
    hint = 'Think of your SPINE - those stacked vertebrae!',
    explanation = '**FALSE!** ❌ **spondyl-** means **vertebrae** or **spine**, NOT ribs!

💡 **Remember it:** SPONDYL- sounds like ''SPONDY-LONG'' - your LONG SPINE! Spondylitis = vertebrae inflammation. Spondylolisthesis = vertebra slipping. Think of those stacked bones running down your back - your SPINE/VERTEBRAE, not your ribs!',
    updated_at = NOW()
  WHERE question_id = 'root-28';

  UPDATE quiz_questions
  SET 
    hint = 'Think of a BP cuff squeezing your arm to measure something!',
    explanation = '**BP** = **Blood Pressure** 🩺

💡 **Remember it:** BP = the pressure in your BLOOD vessels! That cuff on your arm measures how hard your blood is pushing against artery walls. Normal BP is around 120/80. Too high (hypertension) or too low (hypotension) can be dangerous!',
    updated_at = NOW()
  WHERE question_id = 'abbr-1';

  UPDATE quiz_questions
  SET 
    hint = 'Think of checking your pulse - counting how fast something beats!',
    explanation = '**HR** = **Heart Rate** ❤️

💡 **Remember it:** HR = how fast your HEART is RACING! Measured in beats per minute (bpm). Normal resting HR is 60-100 bpm. Feel your pulse on your wrist - that''s your HR!',
    updated_at = NOW()
  WHERE question_id = 'abbr-2';

  UPDATE quiz_questions
  SET 
    hint = 'Think of a CAT scan - uses a COMPUTER to create cross-section images!',
    explanation = '**CT** = **Computed Tomography** (also called CAT scan) 🖥️

💡 **Remember it:** CT = COMPUTER + TOMO (slices)! A CT scan uses x-rays and a COMPUTER to create detailed slice-by-slice images of your body. Like taking photos of bread slices to see what''s inside the loaf!',
    updated_at = NOW()
  WHERE question_id = 'abbr-3';

  UPDATE quiz_questions
  SET 
    hint = 'Think of powerful MAGNETS creating detailed images!',
    explanation = '**MRI** = **Magnetic Resonance Imaging** 🧲

💡 **Remember it:** MRI = MAGNETS Resonating Inside! Uses powerful magnets (not radiation!) to create super detailed images of soft tissues. No metal allowed - those magnets are STRONG! Great for seeing brain, muscles, and organs!',
    updated_at = NOW()
  WHERE question_id = 'abbr-4';

  UPDATE quiz_questions
  SET 
    hint = 'From Latin ''nil per os'' - no food or drink before surgery!',
    explanation = '**NPO** = **Nothing by mouth** (from Latin: nil per os) 🚫

💡 **Remember it:** NPO = NO PIZZA OR anything! Can''t eat or drink - usually before surgery or procedures. Empty stomach prevents choking/aspiration during anesthesia. If you see NPO, the patient is FASTING!',
    updated_at = NOW()
  WHERE question_id = 'abbr-5';

  UPDATE quiz_questions
  SET 
    hint = 'From Latin ''pro re nata'' - take medicine when you need it, not on a schedule!',
    explanation = '**PRN** = **As needed** (from Latin: pro re nata) 💊

💡 **Remember it:** PRN = PAIN? RELIEF NOW! Take the medicine AS NEEDED, not on a set schedule. Like taking Tylenol when your head hurts, not every 4 hours automatically. It''s ''as-needed'' medicine!',
    updated_at = NOW()
  WHERE question_id = 'abbr-6';

  UPDATE quiz_questions
  SET 
    hint = 'From Latin ''statim'' - think of medical emergency TV shows: ''We need that STAT!''',
    explanation = '**STAT** = **Immediately** or **right now** (from Latin: statim) ⚡

💡 **Remember it:** STAT = START-AT-TOP priority! When doctors yell ''I need that blood work STAT!'' they mean RIGHT NOW, drop everything else! It''s URGENT, EMERGENCY, no delays! Like when you''re ''standing'' (stat) still waiting - except you CAN''T wait!',
    updated_at = NOW()
  WHERE question_id = 'abbr-7';

  UPDATE quiz_questions
  SET 
    hint = 'Think of a needle in your VEIN delivering fluids directly into your blood!',
    explanation = '**IV** = **Intravenous** (within the vein) 💉

💡 **Remember it:** IV = IN VEIN! INTRA = inside, VENOUS = vein. That IV drip puts medicine/fluids directly INTO your VEIN! Fast delivery straight to your bloodstream. Think of it like an express highway directly into your blood!',
    updated_at = NOW()
  WHERE question_id = 'abbr-8';

  UPDATE quiz_questions
  SET 
    hint = 'The most serious patients go here for INTENSIVE monitoring!',
    explanation = '**ICU** = **Intensive Care Unit** 🏥

💡 **Remember it:** ICU = I SEE YOU constantly! INTENSIVE monitoring 24/7 for the sickest patients. Constant nurse attention, lots of machines, critical care. If someone''s in the ICU, they need INTENSE medical attention!',
    updated_at = NOW()
  WHERE question_id = 'abbr-9';

  UPDATE quiz_questions
  SET 
    hint = 'A patient''s choice about CPR and life-saving measures.',
    explanation = '**TRUE!** ✅ **DNR** = **Do Not Resuscitate** 🕊️

💡 **Remember it:** DNR = DON''T NEED REVIVAL! A patient''s legal choice to NOT receive CPR or other life-saving measures if their heart stops. It''s a serious medical order respecting end-of-life wishes. DNR means ''let nature take its course.''',
    updated_at = NOW()
  WHERE question_id = 'abbr-10';

  UPDATE quiz_questions
  SET 
    hint = 'Where do surgeons perform operations?',
    explanation = '**TRUE!** ✅ **OR** = **Operating Room** 🏥

💡 **Remember it:** OR = where they OPERATE! The sterile room where surgeries happen. Bright lights, surgical tools, anesthesiologist, surgical team. When someone says ''patient''s in the OR,'' they''re having surgery right now!',
    updated_at = NOW()
  WHERE question_id = 'abbr-11';

  UPDATE quiz_questions
  SET 
    hint = 'Think of an ANTeater''s FRONT snout sticking out ahead!',
    explanation = '**anterior** means **front** or **toward the front** ➡️

💡 **Remember it:** ANTERIOR = ANT crawling on the FRONT of you! Your chest, face, and belly are ANTERIOR (front) surfaces. Opposite of POSTERIOR (back). Think of being ''in front'' of (ANTERIOR to) someone in line!',
    updated_at = NOW()
  WHERE question_id = 'pos-1';

  UPDATE quiz_questions
  SET 
    hint = 'Think of your POSTERIOR - your backside, your butt!',
    explanation = '**posterior** means **back** or **toward the back** ⬅️

💡 **Remember it:** POSTERIOR = POSTE-REAR! Your butt is your POSTERIOR! Your back, spine, and heels are POSTERIOR surfaces. Opposite of ANTERIOR (front). Like a POSTER on the wall BEHIND you!',
    updated_at = NOW()
  WHERE question_id = 'pos-2';

  UPDATE quiz_questions
  SET 
    hint = 'Think of a SUPERIOR officer - they''re ABOVE you in rank!',
    explanation = '**superior** means **above** or **upper** ⬆️

💡 **Remember it:** SUPERIOR = SUPER-UP! Like Superman flying ABOVE! Your head is SUPERIOR to your feet. Think of a SUPERIOR boss - they''re ABOVE you! Opposite of INFERIOR (below).',
    updated_at = NOW()
  WHERE question_id = 'pos-3';

  UPDATE quiz_questions
  SET 
    hint = 'Think of feeling INFERIOR - looking DOWN on yourself, BELOW others!',
    explanation = '**inferior** means **below** or **lower** ⬇️

💡 **Remember it:** INFERIOR = IN-FEAR-OF heights because you''re DOWN! Your feet are INFERIOR to your head. Like feeling ''inferior'' - you''re DOWN, BELOW. Opposite of SUPERIOR (above).',
    updated_at = NOW()
  WHERE question_id = 'pos-4';

  UPDATE quiz_questions
  SET 
    hint = 'Think of a LATERAL pass in football - throwing to the SIDE!',
    explanation = '**lateral** means **side** or **away from midline** ↔️

💡 **Remember it:** LATERAL = LATER-ALL (to the side)! Like a LATERAL pass in football - throwing to the SIDE! Your ears are LATERAL to your nose. Think of moving SIDE-TO-SIDE. Opposite of MEDIAL (toward middle).',
    updated_at = NOW()
  WHERE question_id = 'pos-5';

  UPDATE quiz_questions
  SET 
    hint = 'Think of the MEDIAN strip in the MIDDLE of the highway!',
    explanation = '**medial** means **midline** or **toward the middle** ⬅️➡️

💡 **Remember it:** MEDIAL = MIDDLE! Like the MEDIAN strip in the MIDDLE of a highway! Your nose is MEDIAL to your ears. Think of MED-MIDDLE. Opposite of LATERAL (away from middle/to the side).',
    updated_at = NOW()
  WHERE question_id = 'pos-6';

  UPDATE quiz_questions
  SET 
    hint = 'Think ''PROXIMITY'' - CLOSE to the body''s center!',
    explanation = '**proximal** means **closer to the center** or **point of attachment** 🔗

💡 **Remember it:** PROXIMAL = PROXIMITY (closeness)! Your shoulder is PROXIMAL to your hand (closer to body center). Like being in ''close PROXIMITY'' - you''re NEAR the center/attachment point! Opposite of DISTAL (far from center).',
    updated_at = NOW()
  WHERE question_id = 'pos-7';

  UPDATE quiz_questions
  SET 
    hint = 'Think ''DISTANCE'' - FAR from the body''s center!',
    explanation = '**distal** means **farther from the center** or **point of attachment** 🚀

💡 **Remember it:** DISTAL = DISTANCE! Your fingers are DISTAL to your shoulder (farther from body center). Think of the DISTANT end, FAR AWAY from attachment. Like being at a DISTANCE! Opposite of PROXIMAL (close to center).',
    updated_at = NOW()
  WHERE question_id = 'pos-8';

  UPDATE quiz_questions
  SET 
    hint = 'Think ''SOUP-INE'' - lying on your BACK like holding a bowl of soup on your belly!',
    explanation = '**supine** means **lying on your back** (face up) 🛌

💡 **Remember it:** SUPINE = SOUP-ON-SPINE! Lying on your BACK like you could balance a bowl of SOUP on your belly! Face pointing UP to the sky. Opposite of PRONE (face down).',
    updated_at = NOW()
  WHERE question_id = 'pos-9';

  UPDATE quiz_questions
  SET 
    hint = 'Think ''PRONE to fall'' - face DOWN on the ground!',
    explanation = '**prone** means **lying on your stomach/abdomen** (face down) 🤸

💡 **Remember it:** PRONE = PRONE to fall FACE-DOWN! Like doing a plank or push-up position - face pointing DOWN to the floor. Opposite of SUPINE (face up/on back).',
    updated_at = NOW()
  WHERE question_id = 'pos-10';

  UPDATE quiz_questions
  SET 
    hint = 'Think ''TREND-DOWN'' - head trending DOWN below your feet!',
    explanation = '**Trendelenburg** position means **head lower than feet** (tilted upside down) 🙃

💡 **Remember it:** TRENDE-DOWN-BURG! Your HEAD is DOWN, legs are UP! Used to improve blood flow to the brain or for certain surgeries. Picture sliding down a slide - head going DOWN first!',
    updated_at = NOW()
  WHERE question_id = 'pos-11';

  UPDATE quiz_questions
  SET 
    hint = 'Think ''BI'' (two) + ''LATERAL'' (sides) = BOTH SIDES!',
    explanation = '**bilateral** means **both sides** or **affecting both sides** ↔️

💡 **Remember it:** BI-LATERAL = BI (two) + LATERAL (sides) = BOTH SIDES! Like BIcycle (two wheels), BIlateral = TWO sides! Bilateral knee pain = BOTH knees hurt. Opposite of UNI-lateral (one side only).',
    updated_at = NOW()
  WHERE question_id = 'pos-12';

  UPDATE quiz_questions
  SET 
    hint = 'Think of ENCEPHALO (brain) - CEPHALIC is toward the HEAD!',
    explanation = '**cephalic** means **head** or **toward the head** 🧠

💡 **Remember it:** CEPHALIC = sounds like ''SELF-LICK'' - you''d need a HEAD to lick yourself! Or remember enCEPHALO means brain - CEPHALIC relates to HEAD! A cephalic presentation in birth means baby''s HEAD is down. Opposite of caudal (toward feet/tail).',
    updated_at = NOW()
  WHERE question_id = 'pos-13';

  UPDATE quiz_questions
  SET 
    hint = 'EXTERNAL - like EXTERior of a house, the OUTSIDE!',
    explanation = '**external** means **outside** or **outer surface** 🏠

💡 **Remember it:** EXTERNAL = EXTERior! Like the OUTSIDE of a building! Your skin is EXTERNAL (outside surface). External bleeding = bleeding you can SEE on the outside. Opposite of INTERNAL (inside).',
    updated_at = NOW()
  WHERE question_id = 'pos-14';

  UPDATE quiz_questions
  SET 
    hint = 'INTERNAL - like INTERior of a house, the INSIDE!',
    explanation = '**internal** means **inside** or **within** 🫀

💡 **Remember it:** INTERNAL = INTERior! Like the INSIDE of a building! Your organs are INTERNAL (inside your body). Internal bleeding = bleeding you CAN''T see (inside). Opposite of EXTERNAL (outside).',
    updated_at = NOW()
  WHERE question_id = 'pos-15';

  UPDATE quiz_questions
  SET 
    hint = 'Think ''FLEX your muscles'' - you''re BENDING your arm!',
    explanation = '**flexion** means **bending** or **decreasing the angle** at a joint 💪

💡 **Remember it:** FLEXION = FLEX! When you FLEX your bicep, you''re BENDING your elbow! Flexion DECREASES the angle between bones. Like doing a bicep curl - that''s arm FLEXION! Opposite of EXTENSION (straightening).',
    updated_at = NOW()
  WHERE question_id = 'pos-16';

  UPDATE quiz_questions
  SET 
    hint = 'Think ''EXTEND your arm'' - you''re STRAIGHTENING it out!',
    explanation = '**extension** means **straightening** or **increasing the angle** at a joint ➡️

💡 **Remember it:** EXTENSION = EXTEND! When you EXTEND your arm out straight, you''re STRAIGHTENING your elbow! Extension INCREASES the angle between bones. Like reaching for something - you EXTEND your arm straight! Opposite of FLEXION (bending).',
    updated_at = NOW()
  WHERE question_id = 'pos-17';

  UPDATE quiz_questions
  SET 
    hint = 'Think of PERIPHERAL vision - what you see on the OUTER edges, not in the center!',
    explanation = '**TRUE!** ✅ **peripheral** means **outside** or **away from the center** 🔄

💡 **Remember it:** PERIPHERAL = OUTER PERIMETER! Like PERIPHERAL vision (side vision) - you''re seeing the EDGES, not the CENTER! Peripheral nerves = nerves in your arms/legs (away from spine/brain center). Peripheral devices = stuff OUTSIDE your computer (keyboard, mouse). Think PERIMETER - the OUTER boundary!',
    updated_at = NOW()
  WHERE question_id = 'pos-18';

  UPDATE quiz_questions
  SET 
    hint = 'Think of ROTATING a doorknob - TURNING it in a circle!',
    explanation = '**TRUE!** ✅ **rotation** means **turning** or **revolving around an axis** 🔄

💡 **Remember it:** ROTATION = like ROTATING tires on a car - you''re TURNING them! Or Earth''s ROTATION - spinning around its axis! When you turn your head side to side (''no''), that''s ROTATION of your neck. Think of SPINNING, TWISTING, TURNING in a circle!',
    updated_at = NOW()
  WHERE question_id = 'pos-19';

  UPDATE quiz_questions
  SET 
    hint = 'Think of an OBLIQUE angle - it''s SLANTED, not straight!',
    explanation = '**FALSE!** ❌ **oblique** means **slanted** or **at an angle**, NOT straight!

💡 **Remember it:** OBLIQUE = OH-BLEAK (leaning over sadly)! It''s SLANTED, DIAGONAL, at an ANGLE - not straight up/down or perfectly horizontal! Like the Leaning Tower of Pisa - that''s OBLIQUE! Oblique muscles run at an angle across your abdomen. Think TILTED, not straight!',
    updated_at = NOW()
  WHERE question_id = 'pos-20';


  -- Introduction to MRI
  UPDATE quiz_questions
  SET 
    hint = '**Think about it:** Can you tell how fast a computer is just by looking at it? Modern MRI scanners with different field strengths often look identical on the outside. The real power is on the inside!',
    explanation = '**False!** This is a common misconception. MRI systems of different field strengths (0.3T, 1.5T, 3T, even 7T) can look nearly identical externally. You cannot determine:

- **Magnetic field strength** (measured in Tesla)
- **System performance** or capabilities
- **Image quality** potential

Just by visual inspection. The differences are internal - in the magnet design, gradient systems, and RF technology. Always check the system specifications and labels to know what you''re working with!

💡 **Remember:** *Don''t judge a magnet by its cover!*',
    updated_at = NOW()
  WHERE question_id = 'intro-1';

  UPDATE quiz_questions
  SET 
    hint = '**Think radio station:** The body doesn''t become magnetic, make sound, or receive x-rays. We''re using **radio waves** here! The protons in your body both receive and send back radio signals.',
    explanation = '**D. A radio receiver and transmitter** is correct!

Here''s the beautiful process:

1. **Radio Receiver:** The body''s protons absorb radio frequency (RF) energy when we transmit at their resonant frequency
2. **Radio Transmitter:** When the RF pulse stops, those same protons release that energy as radio waves that we detect

🎙️ **Think of it like this:** Your body becomes a tiny radio station! We send out a signal, the protons tune in and absorb it, then broadcast it back to us. That''s how we create the image.

⚡ **Key Point:** MRI is all about **radio waves**, not magnetism alone, not sound, not x-rays. Radio in, radio out!',
    updated_at = NOW()
  WHERE question_id = 'intro-2';

  UPDATE quiz_questions
  SET 
    hint = '**Think hydrogen:** What''s in water? H₂O! The ''H'' is hydrogen, which has one of these particles. And since we''re 60-70% water, we have LOTS of them!',
    explanation = '**B. Proton** is the star of MRI!

Here''s why protons are perfect:

🎯 **Abundance:** Hydrogen protons are everywhere in the body (in water, fat, proteins)
🧲 **Magnetic:** Protons have a magnetic moment - they act like tiny bar magnets
📻 **Responsive:** They can absorb and emit radio frequency energy
⚡ **Spin:** They have nuclear spin, making them resonate at specific frequencies

**Why not the others?**
- Electrons: Too light and fast-moving
- Neutrons: No charge, can''t be detected this way
- Photons: These are light particles, not the target of MRI

💡 **Remember:** *P is for Proton, P is for Power in MRI!*',
    updated_at = NOW()
  WHERE question_id = 'intro-3';

  UPDATE quiz_questions
  SET 
    hint = '**Think tuning fork:** When you strike a tuning fork at just the right pitch, another one nearby starts vibrating too. That specific pitch is the _______ frequency. Same concept in MRI!',
    explanation = '**A. Resonant Frequency** is correct!

🎵 **Musical Analogy:** Just like each musical note has a specific frequency (A = 440 Hz), each proton in a magnetic field has a specific resonant frequency where it will absorb energy most efficiently.

**Why it matters in MRI:**
- At 1.5T, hydrogen protons resonate at ~63.9 MHz
- At 3T, they resonate at ~127.8 MHz
- We must transmit at EXACTLY this frequency for energy transfer
- Off frequency = no signal = no image!

🎼 **Think of it like this:** The Larmor frequency (another name for resonant frequency) is like the proton''s favorite song - it only dances when it hears that exact tune!

💡 **Remember:** *Right frequency = Resonance = Energy transfer = MRI magic!*',
    updated_at = NOW()
  WHERE question_id = 'intro-4';

  UPDATE quiz_questions
  SET 
    hint = '**What goes in, must come out:** We send in radio waves to excite the protons. When they relax, they give back the same type of energy. Radio in = _____ out!',
    explanation = '**A. Releases the energy in the form of a radio wave** is correct!

This is called **T1 and T2 relaxation:**

📡 **The Process:**
1. RF pulse ON → Protons absorb radio energy and get excited
2. RF pulse OFF → Protons return to their low-energy state
3. As they relax, they emit radio waves at the same frequency
4. Our receiver coils pick up these radio signals
5. Computer converts signals into an image!

🪃 **Think boomerang:** You throw radio energy at the protons, they catch it, then throw it right back to you as a radio signal!

**Not light, not sound, not just heat** - it''s radio waves all the way. That''s why MRI is also called **MR** (Magnetic Resonance) - it''s all about that resonant radio frequency!

💡 **Remember:** *RF goes in, RF comes out - that''s the MRI shout!*',
    updated_at = NOW()
  WHERE question_id = 'intro-5';

  UPDATE quiz_questions
  SET 
    hint = '**Signal strength = brightness:** More signal means more information means more brightness on the image. It''s like turning up the volume on your radio - stronger signal = clearer reception!',
    explanation = '**B. Bright rather than dark** is correct!

🔆 **The Brightness Rule:**
- **Strong signal** = High signal intensity = **Bright pixels (hyperintense)**
- **Weak signal** = Low signal intensity = **Dark pixels (hypointense)**
- **No signal** = No intensity = **Black (signal void)**

**What creates strong signals?**
- Water-rich tissues (CSF, fluid)
- Fat (appears bright on T1)
- Tissues with many mobile protons

**What creates weak signals?**
- Dense bone (cortical)
- Air
- Fast-flowing blood
- Dense fibrous tissue

📺 **Think TV reception:** Strong broadcast signal = clear, bright picture. Weak signal = dark, fuzzy picture. Same in MRI!

💡 **Remember:** *Strong signal = Bright light = Good night (for diagnosing)!*',
    updated_at = NOW()
  WHERE question_id = 'intro-6';

  UPDATE quiz_questions
  SET 
    hint = '**Non-ionizing = non-damaging:** Unlike X-rays and CT, MRI doesn''t use ionizing radiation. The magnetic fields and radio waves don''t damage DNA or cells when safety protocols are followed.',
    explanation = '**True!** MRI is remarkably safe when proper protocols are followed.

✅ **Why MRI is safe:**
- **No ionizing radiation** (unlike X-ray, CT, PET)
- **No DNA damage** from the magnetic field
- **No cumulative effects** - can be repeated safely
- **Radio waves** are non-ionizing (like FM radio)

⚠️ **But ONLY when used properly:**
- Screen for metallic implants and devices
- Follow SAR (Specific Absorption Rate) limits
- Prevent projectile accidents with ferrous objects
- Protect hearing from gradient noise
- Monitor patients with claustrophobia/anxiety

🛡️ **The key phrase:** *"When used properly"* - this means following all safety protocols!

**Contrast this with:**
- X-ray/CT: Ionizing radiation (cumulative risk)
- PET: Radioactive isotopes

💡 **Remember:** *MRI is safe as can be, when you follow safety to a T!*',
    updated_at = NOW()
  WHERE question_id = 'intro-7';

  UPDATE quiz_questions
  SET 
    hint = '**Inverse square law:** This is physics! When you halve the distance, the force doesn''t just double - it quadruples! This is why the ''5-gauss line'' is so critical for safety.',
    explanation = '**B. 4x** is correct - this is CRITICAL for safety!

📐 **The Math:**
- Magnetic force follows the **inverse square law**
- Force ∝ 1/distance²
- If distance → ½, then force → 1/(½)² = 1/(¼) = **4x stronger**

⚠️ **Real-world danger:**
Imagine a wheelchair:
- At 8 feet away: Mild pull
- At 4 feet away: 4x stronger pull
- At 2 feet away: 16x stronger pull (4×4)
- At 1 foot away: 64x stronger pull!

🚀 **This is why:**
- Objects accelerate as they approach the magnet
- The "projectile effect" can be deadly
- Items feel "yanked" from your hands
- Always control ferrous objects BEFORE entering the room

💡 **Remember:** *Half the distance = Four times the force = Danger at the source!*

**Never underestimate magnetic attraction!**',
    updated_at = NOW()
  WHERE question_id = 'intro-8';

  UPDATE quiz_questions
  SET 
    hint = '**Zero, zip, nada:** MRI uses magnetic fields and radio waves - both are NON-ionizing. There''s no X-ray tube, no gamma rays, no radiation at all!',
    explanation = '**D. Never** - MRI produces ZERO ionizing radiation!

🧲 **What MRI uses:**
1. **Static magnetic field** (non-ionizing)
2. **Radio frequency waves** (non-ionizing, like your phone)
3. **Gradient magnetic fields** (non-ionizing)

⚛️ **What is ionizing radiation?**
- X-rays, gamma rays, cosmic rays
- High enough energy to knock electrons off atoms
- Can damage DNA → cancer risk
- Found in: X-ray, CT, PET, fluoroscopy

✅ **MRI''s advantage:**
- Safe for children (no radiation)
- Safe for repeated scans
- No cumulative exposure risk
- Can scan pregnant patients (2nd/3rd trimester)

📻 **Think radio station:** FM radio has been broadcasting for decades - do radio waves cause cancer? No! MRI uses similar (but stronger) radio frequencies.

💡 **Remember:** *MRI never, ever, not at all, uses ionizing radiation!*',
    updated_at = NOW()
  WHERE question_id = 'intro-9';

  UPDATE quiz_questions
  SET 
    hint = '**Think hydrogen:** What contains hydrogen protons? H₂O! We''re imaging hydrogen, and water is packed with it. That''s why we see soft tissues so well!',
    explanation = '**C. Water** is the key to MRI success!

💧 **Why water matters:**
- Water = H₂O = 2 hydrogen atoms per molecule
- Hydrogen protons are what we''re imaging
- Human body is 60-70% water
- More water = More protons = Better signal!

🎯 **What this means clinically:**

**Great MRI contrast:**
- Brain (75-80% water)
- Muscles (75% water)
- CSF (99% water) - appears very bright
- Tumors (often high water content)

**Poor MRI contrast:**
- Cortical bone (very little water) - appears black
- Air/lung (no water) - appears black
- Dense scar tissue (low water)

**Not iron** (creates artifacts), **not air** (no signal), **not energy** (we provide that).

💡 **Remember:** *Water is the matter for MRI to capture!*',
    updated_at = NOW()
  WHERE question_id = 'intro-10';

  UPDATE quiz_questions
  SET 
    hint = '**Ancient compass:** This is the natural magnet that ancient sailors used for navigation. It''s also called magnetite. The word ''magnet'' actually comes from this stone!',
    explanation = '**A. Lodestone** is correct!

🪨 **Lodestone Facts:**
- Also called **magnetite** (Fe₃O₄)
- Naturally occurring magnetic iron ore
- Can attract iron objects without any external power
- Used in ancient compasses
- The word "magnet" comes from lodestone!

📜 **Historical significance:**
- Discovered in ancient Magnesia (Asia Minor)
- First known magnet used by humans
- Helped sailors navigate for centuries
- Led to our understanding of Earth''s magnetic field

**Why not the others?**
- **Bronze:** Alloy of copper and tin - not magnetic
- **Iron:** Can BE magnetized, but not naturally magnetic
- **Tin:** Not magnetic at all

🧭 **Fun fact:** Ancient Chinese called lodestone "loving stone" because it seemed to "love" (attract) iron!

💡 **Remember:** *Lodestone loads up the magnetic zone - naturally magnetic, all on its own!*',
    updated_at = NOW()
  WHERE question_id = 'intro-11';

  UPDATE quiz_questions
  SET 
    hint = '**Greek origins:** This region is in modern-day Turkey. The ancient Greeks found magnetic stones there and named them after the place - Magnesia!',
    explanation = '**D. Asia Minor** (modern-day Turkey) is correct!

🗺️ **Geography & History:**
- **Magnesia** was a region in ancient Thessaly (Greece) and Asia Minor
- Part of the ancient Greek world
- Now located in modern-day **Turkey**
- Site where lodestone (magnetite) was discovered

📚 **Etymology:**
1. Lodestone found in Magnesia
2. Greeks called it "Magnētis lithos" (stone from Magnesia)
3. This became "magnet" in English
4. The rest is history!

**Other ancient magnetic discoveries:**
- China: Discovered lodestone independently around 300 BCE
- Used for feng shui and compasses
- But the word "magnet" came from Greek Magnesia

🌍 **Asia Minor includes:** Ancient lands that are now Turkey, connecting Europe and Asia.

💡 **Remember:** *Magnesia in Asia Minor = Where magnets earned their name!*',
    updated_at = NOW()
  WHERE question_id = 'intro-12';

  UPDATE quiz_questions
  SET 
    hint = '**Electromagnetism:** Tesla''s discovery was about using electrical current to generate magnetic fields. This is how we create the powerful magnets in MRI! Without this, no modern MRI scanners.',
    explanation = '**D. Electricity can create a magnetic field** is correct!

⚡ **Tesla''s Revolutionary Discovery:**
- Running electrical current through a wire creates a magnetic field
- This is called **electromagnetism**
- The basis for ALL modern electromagnets
- Essential for MRI magnet design!

🧲 **Why this matters for MRI:**
- Superconducting magnets use electrical current
- Current flows through coils of wire
- Creates the strong, stable magnetic field (1.5T, 3T, etc.)
- When current stops, the field stops

**Why not the others?**
- **Rotating fields:** That''s also Tesla, but from his AC motor work
- **Hydrogen lighter than helium:** That''s chemistry (true, but not Tesla)
- **Earth''s magnetic field:** Known since ancient times

🎩 **Tesla fact:** The unit of magnetic field strength is named after him - the **Tesla (T)**!

💡 **Remember:** *Tesla''s electric trick made magnetic fields stick!*',
    updated_at = NOW()
  WHERE question_id = 'intro-13';

  UPDATE quiz_questions
  SET 
    hint = '**Opposite of Tesla''s discovery:** Tesla showed electricity creates magnetism. Faraday showed the reverse - changing magnetic fields create electricity! This is how we DETECT the MRI signal.',
    explanation = '**C. Law of Induction** is fundamental to MRI!

🔄 **Faraday''s Law of Electromagnetic Induction:**
*A changing magnetic field induces an electrical current in a conductor*

**How it works in MRI:**
1. Excited protons emit radio waves (changing magnetic field)
2. This changing field passes through the receiver coil
3. The coil acts as a conductor
4. **Faraday''s Law:** The changing field induces electrical current
5. We measure this current = MRI signal!

⚡ **The beautiful cycle:**
- **Tesla''s principle:** Electricity → Magnetism (creating the main field)
- **Faraday''s principle:** Magnetism → Electricity (detecting the signal)

🎯 **Without Faraday''s Law:**
- No way to detect the signal from protons
- No receiver coils would work
- No MRI images!

💡 **Remember:** *Faraday''s induction lets us detect the MRI production!*',
    updated_at = NOW()
  WHERE question_id = 'intro-14';

  UPDATE quiz_questions
  SET 
    hint = '**Nobel Prize 1944:** This physicist first observed nuclear magnetic resonance in molecular beams. His work laid the foundation for both NMR spectroscopy and eventually MRI!',
    explanation = '**C. Isidor Rabi** is correct!

🏆 **Isidor Rabi (1898-1988):**
- First observed **nuclear magnetic resonance (NMR)** in 1938
- Won the **Nobel Prize in Physics (1944)** for this work
- Showed that atomic nuclei could be made to absorb and emit radio waves
- This was the foundation for MRI!

📅 **Timeline:**
- **1938:** Rabi discovers NMR
- **1946:** Bloch and Purcell extend NMR to liquids and solids
- **1971:** Damadian shows tumors have different NMR signals
- **1973:** Lauterbur creates first MRI image
- **1977:** First human MRI scan

**Why not the others?**
- **Faraday:** 1800s, electromagnetic induction
- **Tesla:** 1800s, electromagnetism and AC current
- **Bohr:** Atomic model, not NMR

💡 **Remember:** *Rabi was first to see NMR work - the spark that made MRI lurk!*',
    updated_at = NOW()
  WHERE question_id = 'intro-15';

  UPDATE quiz_questions
  SET 
    hint = '**From frequencies to pictures:** This mathematical technique converts complex frequency signals into spatial information (images). It''s named after a French mathematician and is used in signal processing everywhere!',
    explanation = '**A. Fourier Transform** is the mathematical heart of MRI!

🎼 **What is Fourier Transform?**
- Mathematical method developed by Joseph Fourier (1768-1830)
- Converts signals from the **frequency domain** to the **spatial domain**
- Breaks down complex signals into simple sine waves
- Reconstructs them into an image

🖼️ **How it works in MRI:**
1. Protons emit radio signals at various frequencies
2. Signals are encoded with spatial information
3. Computer collects this "raw data" (K-space)
4. **Fast Fourier Transform (FFT)** processes the data
5. Out comes your MRI image!

**Without Fourier Transform:**
- We''d have frequency data but no image
- No way to reconstruct spatial information
- MRI simply wouldn''t work!

🎵 **Musical analogy:** Like taking a recording of an orchestra and separating out each instrument''s individual sound.

💡 **Remember:** *Fourier Transform is the key - turns signals into what we see!*',
    updated_at = NOW()
  WHERE question_id = 'intro-16';

  UPDATE quiz_questions
  SET 
    hint = '**Controversial pioneer:** This physician was first to propose using NMR for medical diagnosis and built a whole-body scanner. Though he got the first patent, he controversially wasn''t included in the 2003 Nobel Prize.',
    explanation = '**D. Raymond Damadian** holds the first MRI patent!

📜 **Damadian''s Contributions:**
- **1971:** Published paper showing cancerous tissue has different NMR properties
- **1974:** Awarded first patent for NMR body scanning apparatus
- **1977:** Built "Indomitable" - first whole-body MRI scanner
- **1977:** First MRI scan of a living human (took 5 hours!)

⚖️ **The Nobel Controversy:**
- **2003:** Nobel Prize awarded to Lauterbur and Mansfield
- Damadian was excluded despite his foundational work
- He took out full-page newspaper ads protesting
- Still controversial in the MRI community

**Timeline clarification:**
- **Rabi (1938):** Discovered NMR
- **Bloch & Purcell (1946):** Extended NMR (shared 1952 Nobel)
- **Damadian (1974):** First MRI patent
- **Lauterbur (1973):** First MRI image

💡 **Remember:** *Damadian''s patent came first in ''74 - MRI pioneer, that''s for sure!*',
    updated_at = NOW()
  WHERE question_id = 'intro-17';

  UPDATE quiz_questions
  SET 
    hint = '**The image maker:** This chemist created the first 2D NMR image in 1973 and the first living tissue image in 1976. He introduced the concept of using magnetic field gradients to create spatial information!',
    explanation = '**C. Paul Lauterbur** created the first MRI image!

🖼️ **Lauterbur''s Breakthrough:**
- **1973:** First NMR image ever (two tubes of water)
- **1976:** First image of living tissue (a clam)
- Introduced the concept of **magnetic field gradients** for spatial encoding
- Called his technique "zeugmatography" (from Greek "to join")

🧲 **His Key Innovation:**
- Used gradient magnetic fields to encode spatial information
- Different locations have slightly different magnetic field strengths
- Protons at different locations resonate at different frequencies
- This creates the "map" needed for an image!

🏆 **Recognition:**
- Shared 2003 Nobel Prize with Peter Mansfield
- Often called the "Father of MRI"

**Why not the others?**
- **Damadian:** First whole-body human scan (1977)
- **Mansfield:** Developed echo-planar imaging (fast MRI)
- **Ernst:** NMR spectroscopy (1991 Nobel)

💡 **Remember:** *Lauterbur made pictures first appear - MRI imaging pioneer!*',
    updated_at = NOW()
  WHERE question_id = 'intro-18';

  UPDATE quiz_questions
  SET 
    hint = '**Indomitable achievement:** This was done on July 3, 1977, using a scanner named ''Indomitable.'' The first human scanned was actually one of Damadian''s graduate students, Larry Minkoff!',
    explanation = '**A. Raymond Damadian** performed the first whole-body human MRI scan!

🏥 **Historic Scan - July 3, 1977:**
- Scanner name: **"Indomitable"**
- First human subject: **Larry Minkoff** (Damadian''s graduate student)
- Scan time: Nearly **5 hours!**
- Location: Brooklyn, New York
- Image: Crude by today''s standards, but revolutionary!

🔬 **Why this was different:**
- **Lauterbur (1976):** First image of living tissue (small samples)
- **Damadian (1977):** First WHOLE HUMAN BODY scan
- Big enough to fit a person
- Clinical potential proven

⚡ **"Indomitable" Facts:**
- Weighed several tons
- Required patient to remain completely still for hours
- No gradient coils like modern MRI
- Now in the Smithsonian Institution!

**Fun fact:** Damadian wanted to be the first person scanned, but he was too large to fit in his own machine!

💡 **Remember:** *Damadian''s whole-body scan in ''77 - opened MRI''s door to heaven!*',
    updated_at = NOW()
  WHERE question_id = 'intro-19';

  UPDATE quiz_questions
  SET 
    hint = '**The controversial Nobel:** One pioneered spatial encoding and made the first image. The other developed echo-planar imaging for fast scanning. A third major contributor was notably excluded from this prize!',
    explanation = '**D. Peter Mansfield and Paul Lauterbur** shared the 2003 Nobel Prize!

🏆 **The Winners:**

**Paul Lauterbur (1929-2007):**
- Discovered how to create images using gradient fields
- First MRI image (1973)
- Introduced spatial encoding concept

**Peter Mansfield (1933-2017):**
- Developed **Echo-Planar Imaging (EPI)**
- Made MRI much faster (seconds instead of hours)
- Advanced mathematical techniques for image reconstruction

⚖️ **The Controversy:**
- **Raymond Damadian** was NOT included
- He had the first patent (1974)
- Did the first whole-body human scan (1977)
- Showed tumors have different NMR signals (1971)
- He publicly protested the decision

📰 **The Debate:**
- Some say Damadian deserved inclusion
- Others argue Lauterbur and Mansfield made the imaging breakthroughs
- Nobel committee doesn''t explain their decisions

💡 **Remember:** *Mansfield and Lauterbur won the Nobel crown - but Damadian''s work won''t be let down!*',
    updated_at = NOW()
  WHERE question_id = 'intro-20';


  -- General Anatomy & Physiology
  UPDATE quiz_questions
  SET 
    hint = 'Think: PHYSIO = HOW things work, not WHAT they look like!',
    explanation = '**Physiology** = How the body FUNCTIONS! ⚙️

💡 **Remember it:** Anatomy tells you WHAT it looks like (structure), Physiology tells you HOW it works (function)! Like knowing a car has an engine (anatomy) vs. understanding how that engine makes the car move (physiology)!',
    updated_at = NOW()
  WHERE question_id = 'physiology-definition';

  UPDATE quiz_questions
  SET 
    hint = 'PATH = suffering or disease in Greek - it''s about what goes WRONG!',
    explanation = '**Pathology** = Study of DISEASE! 🔬

💡 **Remember it:** PATH-ology is the study of what''s on the wrong PATH (disease). Pathologists examine tissues and diagnose diseases. In MRI, understanding pathology helps you identify abnormalities in scans!',
    updated_at = NOW()
  WHERE question_id = 'pathology-definition';

  UPDATE quiz_questions
  SET 
    hint = 'Your skull protects your brain, ribs protect your heart - think ARMOR! 🛡️',
    explanation = '**Protection** is the PRIMARY function! 🦴

💡 **Remember it:** Your skeleton is like ARMOR protecting your vital organs! Skull protects the brain, ribcage guards the heart and lungs, vertebrae shield the spinal cord. Yes, bones also help with movement, but protection is #1!',
    updated_at = NOW()
  WHERE question_id = 'skeletal-function';

  UPDATE quiz_questions
  SET 
    hint = 'Tendons are the BRIDGE between muscle and bone - they touch BOTH!',
    explanation = '**TRUE!** Tendons bridge TWO systems! 🌉

💡 **Remember it:** TENDONS attach MUSCLE to BONE - so they''re literally part of BOTH systems! Think of your Achilles tendon connecting your calf muscle to your heel bone. Without tendons, muscles couldn''t move bones!',
    updated_at = NOW()
  WHERE question_id = 'tendons-location';

  UPDATE quiz_questions
  SET 
    hint = 'LIG-aments LINK bones together at joints - remember LINK!',
    explanation = '**Bone to Bone!** Ligaments are joint stabilizers! 🔗

💡 **Remember it:** LIG = LINK bones together! Ligaments keep your joints stable (like your knee or elbow). TENDONS connect muscle to bone, LIGAMENTS connect bone to bone. In MRI, torn ligaments (like ACL tears) are common findings!',
    updated_at = NOW()
  WHERE question_id = 'ligaments-connect';

  UPDATE quiz_questions
  SET 
    hint = 'Think small to big: Cells → ? → Organs → Systems. What comes after cells?',
    explanation = '**Tissue** is the next level! 🧬

💡 **Remember the hierarchy:** CELLS → TISSUES → ORGANS → SYSTEMS. Many similar cells working together = TISSUE. Like muscle cells form muscle tissue, nerve cells form nervous tissue. Then tissues combine to make organs (like the heart)!',
    updated_at = NOW()
  WHERE question_id = 'cells-build';

  UPDATE quiz_questions
  SET 
    hint = 'Mitochondria = POWERHOUSE of the cell! Think POWER = ?',
    explanation = '**Energy** (ATP)! Mitochondria = Cellular Power Plants! ⚡

💡 **Remember it:** Mitochondria are the POWERHOUSE of the cell - they convert food into ATP (cellular energy). Without mitochondria, cells couldn''t function! Fun fact: Your body makes about 50 kg of ATP per DAY!',
    updated_at = NOW()
  WHERE question_id = 'mitochondrion-function';

  UPDATE quiz_questions
  SET 
    hint = 'EPIT-helial covers and lines body surfaces - think SKIN!',
    explanation = '**Epithelial** tissue completes the fab four! 🎯

💡 **Remember the 4 tissue types:** CONNECTIVE (holds things together), MUSCLE (moves), NERVOUS (senses & controls), EPITHELIAL (covers & lines). Epithelial tissue is like wallpaper - it covers your skin and lines your organs!',
    updated_at = NOW()
  WHERE question_id = 'tissue-types';

  UPDATE quiz_questions
  SET 
    hint = 'CARD-iac = heart muscle! The third type is in your HEART! ❤️',
    explanation = '**Cardiac** muscle - for the heart! 💪

💡 **Remember the 3 muscle types:** SKELETAL (voluntary - you control), SMOOTH (involuntary - organs), CARDIAC (heart only - involuntary). In MRI, cardiac imaging specifically looks at this special muscle tissue that never gets tired!',
    updated_at = NOW()
  WHERE question_id = 'muscle-types';

  UPDATE quiz_questions
  SET 
    hint = 'Think of a TREE: DENDrites are like branches that RECEIVE information!',
    explanation = '**Dendrites** RECEIVE signals! 🌳

💡 **Remember it:** DENDrites = branches that RECEIVE messages (think tree branches catching raindrops). AXON = highway that SENDS messages away. In neuro MRI, you''re looking at these neural pathways!',
    updated_at = NOW()
  WHERE question_id = 'neuron-stimulus';

  UPDATE quiz_questions
  SET 
    hint = 'INTER-phase = the phase BETWEEN divisions, where cells grow!',
    explanation = '**Interphase** = Growth phase! 📈

💡 **Remember it:** Cell cycle = INTERPHASE (growth & prep) + MITOSIS (division). Think INTER = BETWEEN divisions. During interphase, cells grow, copy their DNA, and prepare to divide. It''s like training before the big game (mitosis)!',
    updated_at = NOW()
  WHERE question_id = 'cell-cycle';

  UPDATE quiz_questions
  SET 
    hint = 'MITOSIS divides the DNA (which lives in the NUCLEUS)!',
    explanation = '**Cell Nucleus** divides in mitosis! 🧬

💡 **Remember it:** MITOSIS = NUCLEAR division (DNA splits). The nucleus divides first, THEN the cytoplasm divides (that''s cytokinesis). Result = 2 identical daughter cells with the same DNA!',
    updated_at = NOW()
  WHERE question_id = 'mitosis-definition';

  UPDATE quiz_questions
  SET 
    hint = 'Stand up straight, arms at sides - palms ready to SHAKE HANDS (forward)!',
    explanation = '**Facing Forward!** Palms = handshake position! 🤝

💡 **Remember Anatomical Position:** Standing UPRIGHT, facing FORWARD, arms at SIDES, palms facing FORWARD (like ready to shake hands). This is the STANDARD reference for ALL anatomical descriptions in MRI and medicine!',
    updated_at = NOW()
  WHERE question_id = 'anatomical-position';

  UPDATE quiz_questions
  SET 
    hint = 'SAGITTAL = like an ARROW (sagittal = arrow in Latin) splitting LEFT from RIGHT!',
    explanation = '**Left-Right** division! 🏹

💡 **Remember it:** SAGITTAL plane splits you into LEFT and RIGHT halves (like slicing bread). MID-sagittal = exactly down the middle. In MRI, sagittal images show your profile view! Coronal = front/back, Transverse (axial) = top/bottom.',
    updated_at = NOW()
  WHERE question_id = 'sagittal-plane';

  UPDATE quiz_questions
  SET 
    hint = 'TARSAL = FOOT (ankle). CARPAL = wrist. Don''t mix them up!',
    explanation = '**Foot** (ankle)! TARSAL = Ankle bones! 🦶

💡 **Remember it:** TARSAL = TARSUS = ANKLE/FOOT bones. CARPAL = WRIST bones. Easy memory trick: TARSAL rhymes with PARCEL (you carry parcels with your feet when you walk). MRI often images tarsal fractures and sprains!',
    updated_at = NOW()
  WHERE question_id = 'tarsal-bones';

  UPDATE quiz_questions
  SET 
    hint = 'INTERNAL organ - skin doesn''t count! Think LIVER = LARGE! 📏',
    explanation = '**Liver** is #1 INTERNAL organ! 🫁

💡 **Remember it:** LIVER is the largest INTERNAL organ (~3 lbs/1.5 kg). Skin is the largest organ OVERALL, but it''s external. The liver does 500+ jobs including detox, digestion, and storing vitamins. In MRI, liver imaging is super common!',
    updated_at = NOW()
  WHERE question_id = 'largest-organ';

  UPDATE quiz_questions
  SET 
    hint = 'Which organ is LONG enough to span BOTH cavities? The colon travels far!',
    explanation = '**Large Bowel (Colon)** bridges both regions! 🌊

💡 **Remember it:** The large bowel/colon starts in the abdomen (ascending, transverse, descending) and continues into the PELVIS (sigmoid colon and rectum). It''s the only option long enough to span both cavities! In MRI, abdominal-pelvic imaging captures the full colon path!',
    updated_at = NOW()
  WHERE question_id = 'abdomen-pelvis-organ';

  UPDATE quiz_questions
  SET 
    hint = 'CERVICAL = NECK. Count: C1, C2, C3... how many fit in your neck? 🦒',
    explanation = '**7 cervical vertebrae!** Remember 7-12-5! 🔢

💡 **Easy memory trick:** 7 Cervical (neck), 12 Thoracic (chest/ribs), 5 Lumbar (lower back). Breakfast at 7, Lunch at 12, Dinner at 5! In spine MRI, you''ll image cervical, thoracic, or lumbar regions separately!',
    updated_at = NOW()
  WHERE question_id = 'cervical-vertebrae';

  UPDATE quiz_questions
  SET 
    hint = 'Spinal cord STOPS around the transition from Thoracic to Lumbar (T-to-L)!',
    explanation = '**T12-L1** = Where cord becomes cauda equina! 🐴

💡 **Remember it:** The spinal CORD ends at the CONUS MEDULLARIS around T12-L1 (thoracic-lumbar junction). Below that = CAUDA EQUINA (horse''s tail) - just nerve roots. Critical for MRI! Lumbar punctures done at L3-L4 or L4-L5 to avoid damaging cord!',
    updated_at = NOW()
  WHERE question_id = 'spinal-cord-end';

  UPDATE quiz_questions
  SET 
    hint = 'The COCCYX is just your tailbone - nerves exit ABOVE it!',
    explanation = '**FALSE!** Nerves don''t go through the coccyx! 🚫

💡 **Remember it:** Nerve roots exit through LUMBAR and SACRAL foramina (holes in vertebrae) to reach the legs. The COCCYX (tailbone) is just a vestigial remnant at the very bottom - no nerves pass through it! In MRI, we image nerve root compression at lumbar/sacral levels, not the coccyx!',
    updated_at = NOW()
  WHERE question_id = 'nerve-roots-coccyx';


  RAISE NOTICE 'Successfully updated hints and explanations';
END $$;
