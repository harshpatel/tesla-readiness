import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function execute() {
  try {
    console.log('🚀 Executing migration 036: Patient Care and Management content\n');

    // Get section ID
    const { data: section } = await supabase
      .from('sections')
      .select('id')
      .eq('slug', 'phase1')
      .single();

    const sectionId = section!.id;

    // Check if module exists
    console.log('📝 Checking for existing module...');
    const { data: existingModule } = await supabase
      .from('modules')
      .select('id')
      .eq('section_id', sectionId)
      .eq('slug', 'patient-care-management')
      .single();

    let module;
    if (existingModule) {
      console.log('   Module exists, updating...');
      const { data: updatedModule, error: moduleError } = await supabase
        .from('modules')
        .update({
          title: '11 - Patient Care and Management',
          description: 'Learn essential patient care skills including HIPAA compliance, patient rights, vital signs monitoring, body mechanics, infection control protocols, and professional communication techniques',
          icon: '🩺',
          is_published: true,
          is_locked: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingModule.id)
        .select()
        .single();
      if (moduleError) throw moduleError;
      module = updatedModule;
    } else {
      console.log('   Module does not exist, creating...');
      const { data: newModule, error: moduleError } = await supabase
        .from('modules')
        .insert({
          section_id: sectionId,
          slug: 'patient-care-management',
          title: '11 - Patient Care and Management',
          description: 'Learn essential patient care skills including HIPAA compliance, patient rights, vital signs monitoring, body mechanics, infection control protocols, and professional communication techniques',
          icon: '🩺',
          order_index: 11,
          is_published: true,
          is_locked: false
        })
        .select()
        .single();
      if (moduleError) throw moduleError;
      module = newModule;
    }
    console.log(`✅ Module ready: ${module.title}\n`);

    // Insert video content
    console.log('🎥 Adding video content...');
    const { data: video, error: videoError } = await supabase
      .from('content_items')
      .insert({
        module_id: module.id,
        slug: 'introduction',
        title: 'Patient Care and Management',
        description: 'Comprehensive training on patient rights, HIPAA regulations, vital signs assessment, infection control, body mechanics, and effective communication in healthcare settings',
        type: 'video',
        icon: '🎥',
        order_index: 1,
        metadata: { videoUrl: 'https://cffhrzzfhyotkbuuoayc.supabase.co/storage/v1/object/public/videos/11%20-%20Patient%20Care%20and%20Management.mp4' },
        is_published: true
      })
      .select()
      .single();

    if (videoError) throw videoError;
    console.log(`✅ Video added: ${video.title}\n`);

    // Insert quiz content
    console.log('📝 Adding quiz content...');
    const { data: quiz, error: quizError } = await supabase
      .from('content_items')
      .insert({
        module_id: module.id,
        slug: 'patient-care-fundamentals',
        title: 'Patient Care Fundamentals',
        description: 'Test your knowledge of patient rights, HIPAA compliance, vital signs, body mechanics, infection control, and professional communication.',
        type: 'quiz',
        icon: '📝',
        order_index: 2,
        metadata: {},
        is_published: true
      })
      .select()
      .single();

    if (quizError) throw quizError;
    console.log(`✅ Quiz content added: ${quiz.title}\n`);

    // Insert quiz section
    console.log('📋 Adding quiz section...');
    const { error: quizSectionError } = await supabase
      .from('quiz_sections')
      .upsert({
        key: 'patient-care-fundamentals',
        title: 'Patient Care Fundamentals',
        description: 'Master patient care and professional healthcare practices',
        icon: '🩺',
        order_index: 0
      }, {
        onConflict: 'key'
      });

    if (quizSectionError) throw quizSectionError;
    console.log(`✅ Quiz section created\n`);

    // Insert all 20 questions
    console.log('❓ Inserting 20 patient care quiz questions...');
    
    const allQuestions = [
      { id: 'pc-1', text: 'Privacy and Confidentiality, Informed Consent, and Respect and Nondiscrimination are all examples of:', answers: '{"A": "Patients\' Rights", "B": "Medical Malpractice", "C": "HIPAA guidelines", "D": "The Privacy Rule"}', correct: 'A', order: 0 },
      { id: 'pc-2', text: 'HIPAA stands for:', answers: '{"A": "Health Insurance Privacy and Access", "B": "Health Inpatient Privacy and Accounting Act", "C": "Health Insurance Portability and Accountability Act", "D": "Hospital Insured Patient Access Act"}', correct: 'C', order: 1 },
      { id: 'pc-3', text: 'HIPAA is U.S. federal law designed to provide privacy standards to protect patients\' medical records and other health information otherwise known as PHI and stands for:', answers: '{"A": "Patient Health Information", "B": "Patient Hospital Intersection", "C": "Protected or Private Health Information", "D": "Proactive Healthcare for Inpatients"}', correct: 'C', order: 2 },
      { id: 'pc-4', text: 'The difference between "negligence" and "malpractice" is that negligence can be committed by anyone. Malpractice is a type of negligence and is committed:', answers: '{"A": "In a professional context that holds a standard of practice and conduct.", "B": "Knowingly and willingly", "C": "Without the immediate knowledge of the injured person", "D": "Only in the medical field by licensed physicians"}', correct: 'A', order: 3 },
      { id: 'pc-5', text: 'Differences in language, cognitive impairments, and emotional status are all examples of:', answers: '{"A": "Patients that are difficult", "B": "Patients that need modifications to their test", "C": "Patients that need physician intervention", "D": "Communication barriers"}', correct: 'D', order: 4 },
      { id: 'pc-6', text: 'Taking a patient\'s vital signs includes all listed below except:', answers: '{"A": "Blood pressure", "B": "Respiratory rate", "C": "Pulse rate", "D": "Temperature"}', correct: 'B', order: 5 },
      { id: 'pc-7', text: 'The diastolic reading in taking a blood pressure is when:', answers: '{"A": "The blood pressure exerted on the vessel walls is the greatest", "B": "The blood pressure exerted on the vessel walls is the lowest", "C": "The blood flow is at peak velocity", "D": "The blood flood is at the lowest velocity"}', correct: 'B', order: 6 },
      { id: 'pc-8', text: 'For children and adults, any temperature above ____________ is considered a fever.', answers: '{"A": "98.6 degrees", "B": "99.9 degrees", "C": "100.4 degrees", "D": "101.0 degrees"}', correct: 'C', order: 7 },
      { id: 'pc-9', text: 'True/False: Any finger can be used to detect and record a radial pulse.', answers: '{"A": "True", "B": "False"}', correct: 'B', order: 8 },
      { id: 'pc-10', text: 'When lifting heavy items from the floor it is best to:', answers: '{"A": "Bend at the knees and lift with the legs", "B": "Bend at the waist and keep the knees locked", "C": "Always ask for help lifting heavy items", "D": "Slide the item away from heavy traffic areas"}', correct: 'A', order: 9 },
      { id: 'pc-11', text: 'When helping a patient to a standing position, first:', answers: '{"A": "Bend your knees slightly to avoid back injuries", "B": "Always ask for help getting a patient to stand", "C": "Ask the patient to place their hands on your shoulders or around your waist", "D": "Check the patient\'s ability and willingness to stand"}', correct: 'D', order: 10 },
      { id: 'pc-12', text: 'When helping a patient to the floor to prevent a fall:', answers: '{"A": "Gently guide the patient to a sitting position", "B": "Protect the patient\'s head", "C": "Stay calm and reassuring to the patient", "D": "All the above"}', correct: 'D', order: 11 },
      { id: 'pc-13', text: 'The practice of implementing techniques that reduce or prevent the spread of pathogens that can cause illness is referred to as:', answers: '{"A": "Sterile procedures", "B": "Safety Policies and Procedures", "C": "Infection Control", "D": "Soiled material disposal"}', correct: 'C', order: 12 },
      { id: 'pc-14', text: 'When donning sterile gloves use the ____________ hand to place the glove on the other hand.', answers: '{"A": "Left hand", "B": "Right hand", "C": "Non-dominate hand", "D": "Dominate hand"}', correct: 'C', order: 13 },
      { id: 'pc-15', text: 'Personal Protective Equipment (PPE) includes:', answers: '{"A": "Gloves", "B": "Goggles / Face mask", "C": "Gowns", "D": "All the above"}', correct: 'D', order: 14 },
      { id: 'pc-16', text: 'The most important step in performing infection control is:', answers: '{"A": "Proper hand hygiene", "B": "Cleaning all surfaces that the patient contacts", "C": "Wearing masks", "D": "Wearing PPE"}', correct: 'A', order: 15 },
      { id: 'pc-17', text: 'When inserting and IV into the arm, the blood vessel to palpate is the:', answers: '{"A": "Radial artery", "B": "Median cubital vein", "C": "Cephalic vein", "D": "Pronator teres vein"}', correct: 'B', order: 16 },
      { id: 'pc-18', text: 'When disposing of soiled linens and other fabrics, always:', answers: '{"A": "Wear PPE", "B": "Carefully place items in specifically designated bags or containers", "C": "Securely seal the bags or containers", "D": "All the above"}', correct: 'D', order: 17 },
      { id: 'pc-19', text: 'Which statements below best displays empathy?', answers: '{"A": "I understand that you must feel badly.", "B": "I have a solution for how you are feeling.", "C": "I can feel what you must be feeling.", "D": "It\'s ok… you\'ll be fine."}', correct: 'C', order: 18 },
      { id: 'pc-20', text: 'True/False: Empathy is a skill that can be taught and mastered.', answers: '{"A": "True", "B": "False"}', correct: 'A', order: 19 },
    ];

    const { error: qError } = await supabase
      .from('quiz_questions')
      .insert(allQuestions.map(q => ({
        content_item_id: quiz.id,
        question_id: q.id,
        section_key: 'patient-care-fundamentals',
        question_type: 'multiplechoice',
        question_text: q.text,
        answers: q.answers,
        correct_answer: q.correct,
        points: 1,
        order_index: q.order,
        image_url: null
      })));

    if (qError) throw qError;
    console.log(`   ✅ Inserted all 20 patient care questions\n`);

    console.log('✅ All content created successfully!\n');
    console.log('📊 Summary:');
    console.log('   ✅ Module: 11 - Patient Care and Management (published, unlocked)');
    console.log('   ✅ Video: Patient Care and Management');
    console.log('   ✅ Quiz: Patient Care Fundamentals (20 questions)');
    console.log('   ✅ Hints JSON: /public/data/quiz-hints/16-patient-care-fundamentals.json\n');
    console.log('🎉 Migration complete! Test at: http://localhost:3000/phase1/patient-care-management');

  } catch (error) {
    console.error('💥 Error:', error);
    process.exit(1);
  }
}

execute();

