-- Migration: Add Phase 1 Final Exam
-- NO VIDEO - Comprehensive quiz with 55 questions covering all Phase 1 topics

DO $$
DECLARE
  v_section_id UUID;
  v_module_id UUID;
  v_quiz_content_id UUID;
BEGIN
  SELECT id INTO v_section_id FROM sections WHERE slug = 'phase1';
  
  UPDATE modules SET
    title = '14 - Phase 1 Final Exam',
    description = 'Comprehensive final exam covering all Phase 1 topics: MRI systems, safety, anatomy, contrast mechanisms, and clinical procedures.',
    icon = '🎓',
    is_published = true,
    is_locked = false,
    updated_at = NOW()
  WHERE section_id = v_section_id AND slug = 'phase1-final-exam'
  RETURNING id INTO v_module_id;
  
  SELECT id INTO v_quiz_content_id FROM content_items 
  WHERE module_id = v_module_id AND slug = 'final-exam';
  
  IF v_quiz_content_id IS NULL THEN
    INSERT INTO content_items (module_id, slug, title, description, type, icon, order_index, metadata, is_published)
    VALUES (v_module_id, 'final-exam', 'Phase 1 Final Exam', 'Comprehensive assessment of all Phase 1 knowledge.', 'quiz', '📝', 1, '{}', true)
    RETURNING id INTO v_quiz_content_id;
  END IF;
  
  INSERT INTO quiz_sections (key, title, description, icon, order_index)
  VALUES ('final-exam', 'Phase 1 Final Exam', 'Comprehensive exam covering all Phase 1 content', '🎓', 19)
  ON CONFLICT (key) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, icon = EXCLUDED.icon, order_index = EXCLUDED.order_index, updated_at = NOW();
  
  INSERT INTO quiz_questions (content_item_id, question_id, section_key, question_type, question_text, answers, correct_answer, points, order_index, image_url) VALUES 
    (v_quiz_content_id, 'final-q1', 'final-exam', 'multiplechoice', 'MRI system performance and _____________ of an MRI system cannot be determined by looking at it.', '{"A": "Noise level (dB)", "B": "Magnetic field strength", "C": "Software and hardware configuration", "D": "Pulse sequences"}', 'B', 1, 0, null),
    (v_quiz_content_id, 'final-q2', 'final-exam', 'multiplechoice', 'In MRI, the human body and the MRI system act together as:', '{"A": "A magnet", "B": "An acoustic transmitter", "C": "An x-ray receiver", "D": "A radio receiver transmitter"}', 'D', 1, 1, null),
    (v_quiz_content_id, 'final-q3', 'final-exam', 'multiplechoice', 'MRI of the human body depends solely upon:', '{"A": "The magnetic field strength", "B": "Sound waves", "C": "Iron molecules", "D": "Water-bond hydrogen protons"}', 'D', 1, 2, null),
    (v_quiz_content_id, 'final-q4', 'final-exam', 'multiplechoice', 'In MRI, a frequency that drives the energy transfer from the RF transmitter to the body is referred to as :', '{"A": "Resonant Frequency", "B": "Resonant C-tuning Frequency", "C": "Resonant phase", "D": "Resonant proton"}', 'A', 1, 3, null),
    (v_quiz_content_id, 'final-q5', 'final-exam', 'multiplechoice', 'One reason that MRI is exceptionally safe because it_____________.', '{"A": "Uses extremely low doses of ionizing radiation", "B": "Has no ionizing radiation", "C": "It is painless", "D": "Requires patients to hold very still"}', 'B', 1, 4, null),
    (v_quiz_content_id, 'final-q6', 'final-exam', 'truefalse', 'Some ferrous items are allowed in the magnet room under controlled circumstances.', '{"A": "TRUE", "B": "FALSE"}', 'A', 1, 5, null),
    (v_quiz_content_id, 'final-q7', 'final-exam', 'multiplechoice', 'Magnetic fields are measured in Gauss and Tesla units.                    5000 Gauss = _________.', '{"A": "0.005 Tesla", "B": "0.05 Tesla", "C": ".5 Tesla", "D": "5.0 Tesla"}', 'C', 1, 6, null),
    (v_quiz_content_id, 'final-q8', 'final-exam', 'multiplechoice', 'Superconductive MRI magnets have potentially highest performance and highest field strength compared to other magnet types. Another advantage is:', '{"A": "A very high resistance to electrical current", "B": "Has virtually no electrical resistance at all", "C": "It produces the least acoustic noise", "D": "It produces images using only sound waves"}', 'B', 1, 7, null),
    (v_quiz_content_id, 'final-q9', 'final-exam', 'multiplechoice', 'The process of liquid helium explosively turning gaseous is referred to as a:', '{"A": "quench", "B": "superconductivity", "C": "dephasing", "D": "ramping"}', 'A', 1, 8, null),
    (v_quiz_content_id, 'final-q10', 'final-exam', 'multiplechoice', 'In a superconductive magnet, the cryostat is filled with:', '{"A": "Gaseous helium", "B": "Gaseous hydrogen", "C": "Liquid helium", "D": "Liquid hydrogen"}', 'C', 1, 9, null),
    (v_quiz_content_id, 'final-q11', 'final-exam', 'truefalse', 'Though extremely rare, patients have been seriously injured and killed due to MRI mistakes.', '{"A": "TRUE", "B": "FALSE"}', 'A', 1, 10, null),
    (v_quiz_content_id, 'final-q12', 'final-exam', 'multiplechoice', 'As ferrous objects get closer to the magnet, the force pulling on the object:', '{"A": "Greatly decreases", "B": "Greatly increases", "C": "Is the same because the mass of the ferrous material is constant", "D": "Pushed the object away from the magnet due to opposite charges"}', 'B', 1, 11, null),
    (v_quiz_content_id, 'final-q13', 'final-exam', 'multiplechoice', 'The most common MRI-related injury is/are:', '{"A": "Hearing damage", "B": "Radio-frequency burns", "C": "Cryogen burns", "D": "Moving metal"}', 'B', 1, 12, null),
    (v_quiz_content_id, 'final-q14', 'final-exam', 'multiplechoice', 'One important method for greatly reducing the risk of an RF burn is:', '{"A": "Make sure the Pt has ear plugs", "B": "Prevent skin touching the inside the magnet bore with cushions", "C": "Do not let a patient wear their shoes into the magnet", "D": "Make sure the patient as an emergency call squeeze ball"}', 'B', 1, 13, null),
    (v_quiz_content_id, 'final-q15', 'final-exam', 'multiplechoice', 'In MRI, any type of metal can be a cause for concern. The 3 main concerns about any metal are if it: accelerates toward the magnetic field; can cause an image artifact; and ___________________:', '{"A": "Make the MRI system louder", "B": "Break the MRI system", "C": "Absorb radio-frequency energy and may get hot", "D": "Accelerate into the magnet bore"}', 'C', 1, 14, null),
    (v_quiz_content_id, 'final-q16', 'final-exam', 'multiplechoice', 'The radio-frequency energy transmitted to the patient over time is referred to as  ____________ , or SAR.', '{"A": "Signal Absorption Rate", "B": "Safe Absorption Rate", "C": "Selective Absorption Rate", "D": "Specific Absorption Rate"}', 'D', 1, 15, null),
    (v_quiz_content_id, 'final-q17', 'final-exam', 'multiplechoice', 'Concerning the answer above, SAR is measured in___________:', '{"A": "Watts/milligram", "B": "Watts/Hertz", "C": "Watts/kilogram", "D": "Watts/pound"}', 'C', 1, 16, null),
    (v_quiz_content_id, 'final-q18', 'final-exam', 'multiplechoice', 'The noise of an MRI system arises from ___________________.', '{"A": "functioning gradients", "B": "radio-frequency transmission", "C": "radio-frequency absorption", "D": "circulating cryogens"}', 'A', 1, 17, null),
    (v_quiz_content_id, 'final-q19', 'final-exam', 'truefalse', 'Hearing protection is an absolute requirement for patients without exception.', '{"A": "TRUE", "B": "FALSE"}', 'A', 1, 18, null),
    (v_quiz_content_id, 'final-q20', 'final-exam', 'truefalse', 'Patients may refuse hearing protection if they assume legal responsibility for any hearing damage or hearing loss.', '{"A": "TRUE", "B": "FALSE"}', 'B', 1, 19, null),
    (v_quiz_content_id, 'final-q21', 'final-exam', 'multiplechoice', 'The person with the most control, and therefore responsibility, for a patient''s safety is:', '{"A": "The MRI supervisor", "B": "The lead radiologist", "C": "The patient him/herself", "D": "The patient''s MRI technologist"}', 'D', 1, 20, null),
    (v_quiz_content_id, 'final-q22', 'final-exam', 'multiplechoice', 'HIPAA stands for ______________________.', '{"A": "Health Insurance Privacy and Accountability Act", "B": "Health Information Privacy and Accountability Act", "C": "Health Insurance Portability and Accountability Act", "D": "Health Information Portability and Accountability Act"}', 'C', 1, 21, null),
    (v_quiz_content_id, 'final-q23', 'final-exam', 'multiplechoice', 'PHI stands for ____________________.', '{"A": "Privacy of Health Information", "B": "Public Health Information", "C": "Public Health Institute", "D": "Protected Health Information"}', 'D', 1, 22, null),
    (v_quiz_content_id, 'final-q24', 'final-exam', 'multiplechoice', 'The study of the body''s functions and structure is referred as _______.', '{"A": "Physiology", "B": "Biology", "C": "Pathology", "D": "Biochemistry"}', 'A', 1, 23, null),
    (v_quiz_content_id, 'final-q25', 'final-exam', 'multiplechoice', 'The study of diseases and their processes is referred to as: ________.', '{"A": "Immunology", "B": "Biochemistry", "C": "Organic Chemistry", "D": "Pathology"}', 'D', 1, 24, null),
    (v_quiz_content_id, 'final-q26', 'final-exam', 'multiplechoice', 'The three orthogonal planes on the body in MRI are_______________.', '{"A": "Superior, Inferior, and Co-Axial", "B": "Medial, Lateral, and Superior", "C": "Axial, Sagittal, and Posterior", "D": "Axial, Sagittal, and Coronal"}', 'D', 1, 25, null),
    (v_quiz_content_id, 'final-q27', 'final-exam', 'multiplechoice', 'A plane of the body that is not an orthogonal plane is referred to as ________________.', '{"A": "Medial", "B": "Lateral", "C": "Co-Axial", "D": "Oblique"}', 'D', 1, 26, null),
    (v_quiz_content_id, 'final-q28', 'final-exam', 'multiplechoice', 'Which of the following is an example of a nervous system pathology?', '{"A": "Multiple Sclerosis", "B": "Lower back pain", "C": "Osteosarcoma", "D": "Hepatitis"}', 'A', 1, 27, null),
    (v_quiz_content_id, 'final-q29', 'final-exam', 'multiplechoice', 'Which of the following is an example of a skeletal system pathology?', '{"A": "Alzheimer''s", "B": "Myocardial infarction", "C": "Osteosarcoma", "D": "Hepatitis"}', 'C', 1, 28, null),
    (v_quiz_content_id, 'final-q30', 'final-exam', 'multiplechoice', 'Cells are organized and share a common function give rise to________.', '{"A": "Tissue", "B": "Organs", "C": "Systems", "D": "Anatomy"}', 'A', 1, 29, null),
    (v_quiz_content_id, 'final-q31', 'final-exam', 'multiplechoice', 'Image sharpness or detail best describes ________________.', '{"A": "Spatial resolution", "B": "Signal-to-Noise Ratio (SNR)", "C": "Image contrast", "D": "Temporal resolution"}', 'A', 1, 30, null),
    (v_quiz_content_id, 'final-q32', 'final-exam', 'multiplechoice', 'Which of the following does not contribute to an image''s spatial resolution?', '{"A": "Slice thickness", "B": "Voxel number", "C": "Field-of-View (FOV)", "D": "Signal-to-Noise ratio (SNR)"}', 'D', 1, 31, null),
    (v_quiz_content_id, 'final-q33', 'final-exam', 'multiplechoice', 'Which of the following contributes to an image''s contrast? (Circle all the apply.)', '{"A": "SNR and TR", "B": "TR and TE", "C": "SNR and TE", "D": "Phase and Frequency encoding"}', 'B', 1, 32, null),
    (v_quiz_content_id, 'final-q34', 'final-exam', 'multiplechoice', 'The three main types of image contrast are_______________.', '{"A": "Signal-to-noise ratio (SNR), TR, and TE", "B": "T1, T2 and Spatial resolution", "C": "T1, T2, and Proton Density", "D": "Spatial resolution, Signal-to-noise ratio (SNR), Contrast"}', 'C', 1, 33, null),
    (v_quiz_content_id, 'final-q35', 'final-exam', 'multiplechoice', 'Maximizing one type of image contrast while minimizing the other two is referred to as________________.', '{"A": "Spatial resolution", "B": "Signal-to-Noise ratio (SNR)", "C": "Image Weighting", "D": "Image Contrast"}', 'C', 1, 34, null),
    (v_quiz_content_id, 'final-q36', 'final-exam', 'multiplechoice', 'T1 refers to a tissue''s time for ___% of its ____________ magnetization to recover.', '{"A": "63%, transverse", "B": "63%, longitudinal", "C": "37%, T2", "D": "37%, T1"}', 'B', 1, 35, null),
    (v_quiz_content_id, 'final-q37', 'final-exam', 'multiplechoice', 'T2 refers to a tissue''s time for ___% of its ____________ magnetization to decay.', '{"A": "63%, transverse", "B": "63%, longitudinal", "C": "37%, T2", "D": "37%, T1"}', 'A', 1, 36, null),
    (v_quiz_content_id, 'final-q38', 'final-exam', 'multiplechoice', 'The number of a tissue''s mobile protons that contribute to MRI signal is described as the tissue''s:', '{"A": "T1", "B": "T2", "C": "Proton Density", "D": "Image contrast"}', 'C', 1, 37, null),
    (v_quiz_content_id, 'final-q39', 'final-exam', 'multiplechoice', 'What is the most likely contrast of this image?', '{"A": "T1 weighted", "B": "T2 weighted", "C": "Proton density weighted", "D": "High SNR"}', 'A', 1, 38, 'https://0cm.classmarker.com/10742032_OGUEMC2V.png'),
    (v_quiz_content_id, 'final-q40', 'final-exam', 'multiplechoice', 'What is the most likely contrast of the image?', '{"A": "T1 weighted", "B": "T2 weighted", "C": "Proton density weighted", "D": "High SNR"}', 'B', 1, 39, 'https://0cm.classmarker.com/10742032_SZ9YN1VX.png'),
    (v_quiz_content_id, 'final-q41', 'final-exam', 'multiplechoice', 'Referring to the figure above, this is a  _____________  curve.', '{"A": "T1", "B": "T2", "C": "Proton Density", "D": "Signal-to-Noise contrast"}', 'A', 1, 40, 'https://0cm.classmarker.com/10742032_MHIX0LZO.png'),
    (v_quiz_content_id, 'final-q42', 'final-exam', 'multiplechoice', 'Referring to the figure above, which tissue has the shorter T1 ?', '{"A": "A", "B": "B", "C": "Cannot be determined"}', 'A', 1, 41, 'https://0cm.classmarker.com/10742032_MHIX0LZO.png'),
    (v_quiz_content_id, 'final-q43', 'final-exam', 'multiplechoice', 'Referring to figure above which tissue has the longer T2?', '{"A": "A", "B": "B", "C": "Cannot be determined"}', 'C', 1, 42, 'https://0cm.classmarker.com/10742032_MHIX0LZO.png'),
    (v_quiz_content_id, 'final-q44', 'final-exam', 'multiplechoice', 'Referring to the figure above, this is a _____________ curve.', '{"A": "T1", "B": "T2", "C": "Proton Density", "D": "Signal-to-Noise contrast"}', 'B', 1, 43, 'https://0cm.classmarker.com/10742032_VLJCXDVO.png'),
    (v_quiz_content_id, 'final-q45', 'final-exam', 'multiplechoice', 'Referring to the figure above, which tissue has the shorter T2?', '{"A": "A", "B": "B", "C": "Cannot be determined"}', 'B', 1, 44, 'https://0cm.classmarker.com/10742032_VLJCXDVO.png'),
    (v_quiz_content_id, 'final-q46', 'final-exam', 'multiplechoice', 'Referring to the figure above, which tissue has the shorter T1?', '{"A": "A", "B": "B", "C": "Cannot be determined"}', 'C', 1, 45, 'https://0cm.classmarker.com/10742032_VLJCXDVO.png'),
    (v_quiz_content_id, 'final-q47', 'final-exam', 'multiplechoice', 'Referring to the figure above, at what point in time is the least contrast between the 2 tissues.', '{"A": "A", "B": "B", "C": "C", "D": "Cannot be determined"}', 'C', 1, 46, 'https://0cm.classmarker.com/10742032_9N7RXC0D.png'),
    (v_quiz_content_id, 'final-q48', 'final-exam', 'multiplechoice', 'Referring to the figure above, given your answer to Q47, what is the most likely contrast weighting of the obtained image? (think carefully)', '{"A": "T1", "B": "T2", "C": "Proton density", "D": "Cannot be determined"}', 'C', 1, 47, 'https://0cm.classmarker.com/10742032_9N7RXC0D.png'),
    (v_quiz_content_id, 'final-q49', 'final-exam', 'multiplechoice', 'To sample the signal in MRI, the spins must be in the ___________ plane.', '{"A": "Longitudinal", "B": "Transverse", "C": "=-Z", "D": "=+Z"}', 'B', 1, 48, null),
    (v_quiz_content_id, 'final-q50', 'final-exam', 'multiplechoice', 'TR is: (Select all that apply)', '{"A": "Repetition Time", "B": "Time allowed for T1 recovery", "C": "Time allowed for T2 decay", "D": "The time from the beginning of one pulse sequence to the beginning of the next"}', 'A,B,D', 1, 49, null),
    (v_quiz_content_id, 'final-q51', 'final-exam', 'multiplechoice', 'TE is: (Select all that apply)', '{"A": "Time to Echo", "B": "Time allowed for T1 recovery", "C": "Time allowed for T2 decay", "D": "The time from the beginning of a pulse sequence until the generated echo signal."}', 'A,C,D', 1, 50, null),
    (v_quiz_content_id, 'final-q52', 'final-exam', 'multiplechoice', 'Fat is bright on a T1W image because it has a _______________ T1 time.', '{"A": "Short", "B": "Long", "C": "Moderate", "D": "Proton Density"}', 'A', 1, 51, null),
    (v_quiz_content_id, 'final-q53', 'final-exam', 'multiplechoice', 'Cerebral Spinal Fluid (CSF) is dark on a T1W image because it has a ________ T1 time.', '{"A": "Short", "B": "Long", "C": "Moderate", "D": "Proton Density"}', 'B', 1, 52, null),
    (v_quiz_content_id, 'final-q54', 'final-exam', 'multiplechoice', 'Cerebral Spinal Fluid (CSF) is bright on a T2W image because it has a ________ T2 time.', '{"A": "Short", "B": "Long", "C": "Moderate", "D": "Proton Density"}', 'B', 1, 53, null),
    (v_quiz_content_id, 'final-q55', 'final-exam', 'multiplechoice', 'Compact bone is dark on both T1W and T2W imaging because: (Select all that apply.)', '{"A": "It has very few mobile protons", "B": "It has little to no water", "C": "It has an exceptionally long T2", "D": "It has an exceptionally long T1"}', 'A,B', 1, 54, null);
END $$;
