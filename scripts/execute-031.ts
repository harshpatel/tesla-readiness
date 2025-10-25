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
    console.log('🚀 Executing migration 031: Subatomic Principles content\n');

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
        title: '04 - Subatomic Principles of MRI',
        description: 'Master the fundamental physics of MRI including magnetism, electromagnetic waves, resonance, precession, and the behavior of atomic particles in magnetic fields',
        icon: '⚛️',
        is_published: true,
        is_locked: false,
        updated_at: new Date().toISOString()
      })
      .eq('section_id', sectionId)
      .eq('slug', 'subatomic-principles-mri')
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
        title: 'Subatomic Principles of MRI',
        description: 'Comprehensive overview of the physics and electromagnetic principles underlying magnetic resonance imaging',
        type: 'video',
        icon: '🎥',
        order_index: 1,
        metadata: { videoUrl: 'https://cffhrzzfhyotkbuuoayc.supabase.co/storage/v1/object/public/videos/04%20-%20Subatomic%20Principles%20of%20MRI.mp4' },
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
        slug: 'subatomic-principles-fundamentals',
        title: 'Subatomic Principles Fundamentals',
        description: 'Test your understanding of magnetic properties, electromagnetic waves, resonance, precession, and MRI physics fundamentals.',
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
        key: 'subatomic-principles-fundamentals',
        title: 'Subatomic Principles Fundamentals',
        description: 'Master the physics and electromagnetic foundations of MRI technology',
        icon: '⚛️',
        order_index: 0
      }, {
        onConflict: 'key'
      });

    if (quizSectionError) throw quizSectionError;
    console.log(`✅ Quiz section created\n`);

    // Insert questions (doing in batches to avoid huge single insert)
    console.log('❓ Inserting 31 quiz questions...');
    
    const questions = [
      { id: 'sub-1', text: 'Magnetism arises from:', answers: '{"A": "Protons", "B": "Neutrons", "C": "Electrons", "D": "Faraday\'s Law"}', correct: 'C', order: 0 },
      { id: 'sub-2', text: 'A subatomic magnetic field is:', answers: '{"A": "strong and large", "B": "weak but large", "C": "strong but small", "D": "weak and small"}', correct: 'C', order: 1 },
      { id: 'sub-3', text: 'Which is an example of a ferromagnetic?', answers: '{"A": "Iron", "B": "Aluminum", "C": "Copper", "D": "Gadolinium"}', correct: 'A', order: 2 },
      { id: 'sub-4', text: 'Which is an example of a paramagnetic?', answers: '{"A": "Iron", "B": "Aluminum", "C": "Copper", "D": "Colbalt"}', correct: 'B', order: 3 },
      { id: 'sub-5', text: 'Which is an example of a diamagnetic?', answers: '{"A": "Iron", "B": "Aluminum", "C": "Copper", "D": "Nickel"}', correct: 'C', order: 4 },
      { id: 'sub-6', text: '"The ability of a material to become magnetized" is the definition of:', answers: '{"A": "Superconductivity", "B": "Susceptibility", "C": "Slice excitation", "D": "Spectroscopy"}', correct: 'B', order: 5 },
      { id: 'sub-7', text: 'Faraday\'s Law says that:', answers: '{"A": "A magnetic field moving across a conductor produces resonance", "B": "Current is induced when a magnetic field is removed", "C": "A magnetic field moving across a conductor produces electrical current", "D": "The magnetic fields and electrical current are separate and distinct"}', correct: 'C', order: 6 },
      { id: 'sub-8', text: 'One "Hertz" is defined as:', answers: '{"A": "One cycle per milli-second", "B": "One cycle per second", "C": "One cycle per minute", "D": "One cycle per hour"}', correct: 'B', order: 7 },
      { id: 'sub-9', text: 'One cycle of a radio wave is referred to as its:', answers: '{"A": "Frequency", "B": "Amplitude", "C": "Strength", "D": "Phase Coherence"}', correct: 'A', order: 8 },
      { id: 'sub-10', text: 'In addition to the answer above, one cycle of a radio wave is also its:', answers: '{"A": "Source", "B": "Wave Coherence", "C": "Wavelength", "D": "Oscillation"}', correct: 'C', order: 9 },
    ];

    // Insert first batch
    const { error: q1Error } = await supabase
      .from('quiz_questions')
      .insert(questions.map(q => ({
        content_item_id: quiz.id,
        question_id: q.id,
        section_key: 'subatomic-principles-fundamentals',
        question_type: 'multiplechoice',
        question_text: q.text,
        answers: q.answers,
        correct_answer: q.correct,
        points: 1,
        order_index: q.order,
        image_url: null
      })));

    if (q1Error) throw q1Error;
    console.log(`   ✅ Inserted questions 1-10`);

    // Continue with remaining questions...
    const questions2 = [
      { id: 'sub-11', text: 'If two signals or waves have the same _____________ they are considered to be "in phase":', answers: '{"A": "Frequency", "B": "Amplitude", "C": "Source", "D": "Power"}', correct: 'A', order: 10 },
      { id: 'sub-12', text: 'The transmitted radio frequency that is perfectly matched to the frequencies of a set of protons is referred to as the:', answers: '{"A": "Resonant Frequency", "B": "In-phase frequency", "C": "Rotational frequency", "D": "Oscillation frequency"}', correct: 'A', order: 11 },
      { id: 'sub-13', text: 'In MRI, when the radio transmission is turned off, protons that absorbed the radio frequency energy:', answers: '{"A": "Transfer the energy to electrons", "B": "Hold on to the energy until the next transmission", "C": "Release the energy in the form of a radio wave", "D": "Absorb more energy in the form of heat"}', correct: 'C', order: 12 },
      { id: 'sub-14', text: 'In MRI, a rotating proton will have a type of inertia referred as ______________ or simply, "spin".', answers: '{"A": "Angular momentum", "B": "Magnetic resonance", "C": "Spin-spin momentum", "D": "gyromagnetic ratio"}', correct: 'A', order: 13 },
      { id: 'sub-15', text: 'What causes a spinning top to wobble?', answers: '{"A": "Resonant frequency", "B": "RF transmission", "C": "Angular momentum", "D": "Gravity"}', correct: 'D', order: 14 },
      { id: 'sub-16', text: 'In MRI, the "wobble" of a proton is referred to as:', answers: '{"A": "Wobble", "B": "Angular Momentum", "C": "Frequency", "D": "Precession"}', correct: 'D', order: 15 },
      { id: 'sub-17', text: 'The fundamental equation that determines the required frequency to obtain resonance is the Lamour Equation. Which below is the equation?', answers: '{"A": "ω = γ × B₀", "B": "f = γ / 2π", "C": "B₀ = ω / γ", "D": "γ = B₀ × 2π"}', correct: 'A', order: 16, img: 'https://0cm.classmarker.com/10742032_XRUWWK2K.png' },
      { id: 'sub-18', text: 'In determining the Larmor Frequency in MRI, the only thing that is needed to know about hydrogen is its', answers: '{"A": "Resonant frequency", "B": "Proton density", "C": "Gyromagnetic Ratio", "D": "The strength of Bₒ field"}', correct: 'C', order: 17 },
      { id: 'sub-19', text: 'A "vector" is a graphical illustration showing', answers: '{"A": "Direction and magnitude", "B": "Transverse magnetization", "C": "Longitudinal magnetization", "D": "Distance and magnitude"}', correct: 'A', order: 18 },
      { id: 'sub-20', text: 'Vectors that are equal but opposite have their forces:', answers: '{"A": "Cancel each other", "B": "Add together", "C": "Combine into one", "D": "Reach resonance"}', correct: 'A', order: 19 },
    ];

    const { error: q2Error } = await supabase
      .from('quiz_questions')
      .insert(questions2.map(q => ({
        content_item_id: quiz.id,
        question_id: q.id,
        section_key: 'subatomic-principles-fundamentals',
        question_type: 'multiplechoice',
        question_text: q.text,
        answers: q.answers,
        correct_answer: q.correct,
        points: 1,
        order_index: q.order,
        image_url: q.img || null
      })));

    if (q2Error) throw q2Error;
    console.log(`   ✅ Inserted questions 11-20`);

    // Final batch
    const questions3 = [
      { id: 'sub-21', text: 'Considering the answer above, those forces would be considered to be:', answers: '{"A": "In-phase", "B": "Out-of-Phase", "C": "In resonance", "D": "Phase coherent"}', correct: 'B', order: 20 },
      { id: 'sub-22', text: 'Looking at the front of a high-field cylindrical MRI system, the Z direction is:', answers: '{"A": "Across the face of the magnet", "B": "Top-bottom of the magnet", "C": "Down the bore of the magnet", "D": "Cannot be determined but looking at the magnet"}', correct: 'C', order: 21 },
      { id: 'sub-23', text: 'When all the vectors of the spins pointing in the Z-direction are added together, the result is the _______________ vector:', answers: '{"A": "Longitudinal Magnetization (Mz)", "B": "Transverse Magnetization (Mxy)", "C": "Resonant (Mr)", "D": "Phase Coherent"}', correct: 'A', order: 22 },
      { id: 'sub-24', text: 'Considering the answer above, those individual spins are considered to be precessing:', answers: '{"A": "In-Phase", "B": "Randomly", "C": "Coherently", "D": "Together"}', correct: 'B', order: 23 },
      { id: 'sub-25', text: 'In MRI, we refer to a radio-frequency transmission as a "radio-frequency…. _____________".', answers: '{"A": "Vector", "B": "Spin Transmission", "C": "Pulse", "D": "Flip"}', correct: 'C', order: 24 },
      { id: 'sub-26', text: 'Spins placed in the XY transverse plane are initially:', answers: '{"A": "Out-of-phase with each other", "B": "Phase coherent with each other", "C": "Precessing randomly", "D": "In the Z-direction"}', correct: 'B', order: 25 },
      { id: 'sub-27', text: 'Spins that absorbed the transmitted RF energy are termed:', answers: '{"A": "Precessing", "B": "Wobbling", "C": "Excited", "D": "Dephased"}', correct: 'C', order: 26 },
      { id: 'sub-28', text: 'Spins in the _____________ plane can produce a radio signal that can be detected.', answers: '{"A": "Transverse", "B": "Longitudinal", "C": "Anterior-Posterior", "D": "Left-Right"}', correct: 'A', order: 27 },
      { id: 'sub-29', text: 'In MRI, the resonant frequency and the Larmor frequency are:', answers: '{"A": "The same", "B": "Opposite", "C": "Not related", "D": "Always weaker than the transmission frequency"}', correct: 'A', order: 28 },
      { id: 'sub-30', text: 'If the gyromagnetic ration of hydrogen is 42.6mHz and the resonant frequency transmitted to is 127.8mHz, the field strength of your MRI system is ________________.', answers: '{"A": "0.5T", "B": "1.0T", "C": "1.5T", "D": "3.0T"}', correct: 'D', order: 29 },
      { id: 'sub-31', text: 'If two signals or waves are "in phase" they produce a stronger signal than individually.', answers: '{"A": "True", "B": "False"}', correct: 'A', order: 30, type: 'truefalse' },
    ];

    const { error: q3Error } = await supabase
      .from('quiz_questions')
      .insert(questions3.map(q => ({
        content_item_id: quiz.id,
        question_id: q.id,
        section_key: 'subatomic-principles-fundamentals',
        question_type: q.type || 'multiplechoice',
        question_text: q.text,
        answers: q.answers,
        correct_answer: q.correct,
        points: 1,
        order_index: q.order,
        image_url: null
      })));

    if (q3Error) throw q3Error;
    console.log(`   ✅ Inserted questions 21-31\n`);

    console.log('✅ All content created successfully!\n');
    console.log('📊 Summary:');
    console.log('   ✅ Module: 04 - Subatomic Principles of MRI (published, unlocked)');
    console.log('   ✅ Video: Subatomic Principles of MRI');
    console.log('   ✅ Quiz: Subatomic Principles Fundamentals (31 questions)');
    console.log('   ✅ Hints JSON: /public/data/quiz-hints/11-subatomic-principles-fundamentals.json\n');
    console.log('🎉 Migration complete! Test at: http://localhost:3000/phase1/subatomic-principles-mri');

  } catch (error) {
    console.error('💥 Error:', error);
    process.exit(1);
  }
}

execute();

