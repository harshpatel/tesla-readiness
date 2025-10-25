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
    console.log('🚀 Executing migration 033: MRI Safety I - Magnetic Fields content\n');

    // Get section ID
    const { data: section } = await supabase
      .from('sections')
      .select('id')
      .eq('slug', 'phase1')
      .single();

    const sectionId = section!.id;

    // Update module
    console.log('📝 Updating module...');
    const { data: module, error: moduleError } = await supabase
      .from('modules')
      .update({
        title: '06 - MRI Safety I: Magnetic Fields',
        description: 'Master critical MRI safety protocols including Zone designation, magnetic forces, projectile risks, cryogen hazards, patient screening procedures, and contraindications for safe clinical practice',
        icon: '⚠️',
        is_published: true,
        is_locked: false,
        updated_at: new Date().toISOString()
      })
      .eq('section_id', sectionId)
      .eq('slug', 'mri-safety-magnetic-fields')
      .select()
      .single();

    if (moduleError) throw moduleError;
    console.log(`✅ Module updated: ${module.title}\n`);

    // Insert video content
    console.log('🎥 Adding video content...');
    const { data: video, error: videoError } = await supabase
      .from('content_items')
      .insert({
        module_id: module.id,
        slug: 'introduction',
        title: 'MRI Safety I: Magnetic Fields',
        description: 'Comprehensive overview of magnetic field safety including zone protocols, translational and rotational forces, quench procedures, and patient contraindications',
        type: 'video',
        icon: '🎥',
        order_index: 1,
        metadata: { videoUrl: 'https://cffhrzzfhyotkbuuoayc.supabase.co/storage/v1/object/public/videos/06%20-%20MRI%20Safety%20I%20-%20Magnetic%20Fields.mp4' },
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
        slug: 'mri-safety-magnetic-fields-fundamentals',
        title: 'MRI Safety: Magnetic Fields Fundamentals',
        description: 'Test your knowledge of MRI safety zones, magnetic forces, projectile risks, cryogen safety, patient screening, and critical contraindications.',
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
        key: 'mri-safety-magnetic-fields-fundamentals',
        title: 'MRI Safety: Magnetic Fields Fundamentals',
        description: 'Master the critical safety protocols for magnetic field environments',
        icon: '⚠️',
        order_index: 0
      }, {
        onConflict: 'key'
      });

    if (quizSectionError) throw quizSectionError;
    console.log(`✅ Quiz section created\n`);

    // Insert all 19 questions in one batch
    console.log('❓ Inserting 19 quiz questions...');
    
    const allQuestions = [
      { id: 'safety-1', text: 'When used properly, MRI has:', answers: '{"A": "No adverse biological effects", "B": "Minimal ionizing radiation", "C": "Several known adverse biological effects", "D": "The same adverse biological effects as radiography"}', correct: 'A', order: 0 },
      { id: 'safety-2', text: 'The amount of force a magnet exerts on an object depends on the:', answers: '{"A": "Mass of an object and distance to the center of the magnet", "B": "Mass of an object and distance to the fringe field of the magnet", "C": "Amount of ferrous material of the object and the distance to the center of the magnet", "D": "Amount of ferrous material of the object and the distance to the fringe field of the magnet"}', correct: 'C', order: 1 },
      { id: 'safety-3', text: 'As the distance of an object to the magnet decreases by 1/2, the force exerted on the object increases by:', answers: '{"A": "2x", "B": "4x", "C": "10x", "D": "No effect"}', correct: 'B', order: 2 },
      { id: 'safety-4', text: 'Lines of magnetic force in a magnetic field diagram indicate the:', answers: '{"A": "Magnet field strength", "B": "Change in the magnetic field strength over a given distance", "C": "Distance to isocenter", "D": "Magnetic field homogeneity over a given distance"}', correct: 'B', order: 3 },
      { id: 'safety-5', text: 'The force exerted on an object by a magnetic field that results in the object accelerating toward the magnet is a:', answers: '{"A": "Lenz force", "B": "Rotational force", "C": "Magnetic field force", "D": "Translational force"}', correct: 'D', order: 4 },
      { id: 'safety-6', text: 'MRI-related injuries are:', answers: '{"A": "Rare", "B": "Common", "C": "Never fatal", "D": "Always the fault of the technologist"}', correct: 'A', order: 5 },
      { id: 'safety-7', text: 'Superconductive magnets use a ____________ to hold liquid helium.', answers: '{"A": "Gradient coil", "B": "RF coil", "C": "Cryostat", "D": "Cryogen"}', correct: 'C', order: 6 },
      { id: 'safety-8', text: 'Helium liquifies at -453 Degrees Farhenheit or ______________.', answers: '{"A": "0 Degrees Celsius", "B": "0 Degrees Kelvin", "C": "-4 Degrees Celsius", "D": "4 Degrees Kelvin"}', correct: 'D', order: 7 },
      { id: 'safety-9', text: 'An explosive conversion of liquid helium to gaseous helium is called a:', answers: '{"A": "radio frequency burn", "B": "Dewar", "C": "RF pulse", "D": "quench"}', correct: 'D', order: 8 },
      { id: 'safety-10', text: 'A release of helium into the magnet room can lead to death caused by:', answers: '{"A": "A cold burn", "B": "burned lungs", "C": "anaphylactic shock", "D": "asphyxiation"}', correct: 'D', order: 9 },
      { id: 'safety-11', text: 'In the case of a sudden release of gaseous helium into the magnet room, the very first action the technologist takes is:', answers: '{"A": "Call a supervisor", "B": "Call 911", "C": "Finish the exam immediately", "D": "Remove the patient from the magnet bore and magnet room"}', correct: 'D', order: 10 },
      { id: 'safety-12', text: 'Anyone entering the Zones III or IV must be screened by:', answers: '{"A": "A qualified MRI Professional", "B": "The referring physician", "C": "The attending radiologist", "D": "The Radiology supervisor"}', correct: 'A', order: 11 },
      { id: 'safety-13', text: 'All pacemakers are contraindicated for an MRI exam:', answers: '{"A": "True", "B": "False"}', correct: 'B', order: 12 },
      { id: 'safety-14', text: 'It is essential to get the patients accurate weight because the weight:', answers: '{"A": "Determines the limits of the Specific Absorption Rate or SAR", "B": "Determines if the patient will fit in the magnet bore", "C": "Determines the length of the scan time", "D": "Determines the imaging protocol"}', correct: 'A', order: 13 },
      { id: 'safety-15', text: 'It is important to ask a female patient if there is a possibility of pregnancy because:', answers: '{"A": "MRI is contraindicated for a pregnant patient", "B": "Special imaging parameters are needed for a pregnant patient", "C": "Acoustic noise is damaging to the fetus", "D": "IV contrast agents may be contraindicated for a pregnant patient"}', correct: 'D', order: 14 },
      { id: 'safety-16', text: 'Zone III is which area?', answers: '{"A": "Magnet room", "B": "Facility lobby/Check-in area/Facility waiting room", "C": "Patient holding area", "D": "Public area or any area outside the facility entrance"}', correct: 'C', order: 15 },
      { id: 'safety-17', text: 'Zone IV is the:', answers: '{"A": "Waiting room", "B": "Magnet room", "C": "Control room", "D": "The patient screening area"}', correct: 'B', order: 16 },
      { id: 'safety-18', text: 'Patients are screened in', answers: '{"A": "Zone I", "B": "Zone II", "C": "Zone III", "D": "Zone IV"}', correct: 'B', order: 17 },
      { id: 'safety-19', text: '__________________ is contraindicated for an MRI', answers: '{"A": "An uncleared metallic foreign body", "B": "An artificial hip replacement", "C": "Any implant controlled by a battery", "D": "A verified prior history of an allergenic reaction to IV contrast agents"}', correct: 'A', order: 18 },
    ];

    const { error: qError } = await supabase
      .from('quiz_questions')
      .insert(allQuestions.map(q => ({
        content_item_id: quiz.id,
        question_id: q.id,
        section_key: 'mri-safety-magnetic-fields-fundamentals',
        question_type: 'multiplechoice',
        question_text: q.text,
        answers: q.answers,
        correct_answer: q.correct,
        points: 1,
        order_index: q.order,
        image_url: null
      })));

    if (qError) throw qError;
    console.log(`   ✅ Inserted all 19 safety questions\n`);

    console.log('✅ All content created successfully!\n');
    console.log('📊 Summary:');
    console.log('   ✅ Module: 06 - MRI Safety I: Magnetic Fields (published, unlocked)');
    console.log('   ✅ Video: MRI Safety I: Magnetic Fields');
    console.log('   ✅ Quiz: MRI Safety: Magnetic Fields Fundamentals (19 multiple choice questions)');
    console.log('   ✅ Hints JSON: /public/data/quiz-hints/13-mri-safety-magnetic-fields-fundamentals.json\n');
    console.log('🎉 Migration complete! Test at: http://localhost:3000/phase1/mri-safety-magnetic-fields');

  } catch (error) {
    console.error('💥 Error:', error);
    process.exit(1);
  }
}

execute();

