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
    console.log('🚀 Executing migration 032: Instrumentation I - Magnets content\n');

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
        title: '05 - Instrumentation I: Magnets',
        description: 'Explore MRI magnet types, magnetic field principles, superconductive technology, cryogen systems, and the essential hardware components that create the imaging environment',
        icon: '🧲',
        is_published: true,
        is_locked: false,
        updated_at: new Date().toISOString()
      })
      .eq('section_id', sectionId)
      .eq('slug', 'instrumentation-magnets')
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
        title: 'Instrumentation I: Magnets',
        description: 'Comprehensive overview of MRI magnet technology including superconductive, permanent, and resistive magnet systems',
        type: 'video',
        icon: '🎥',
        order_index: 1,
        metadata: { videoUrl: 'https://cffhrzzfhyotkbuuoayc.supabase.co/storage/v1/object/public/videos/05%20-%20Instrumentation%20I%20-%20Magnets.mp4' },
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
        slug: 'instrumentation-magnets-fundamentals',
        title: 'Instrumentation & Magnets Fundamentals',
        description: 'Test your knowledge of MRI magnet types, magnetic field strength, superconductive systems, and essential MRI hardware components.',
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
        key: 'instrumentation-magnets-fundamentals',
        title: 'Instrumentation & Magnets Fundamentals',
        description: 'Master the technology and physics of MRI magnet systems',
        icon: '🧲',
        order_index: 0
      }, {
        onConflict: 'key'
      });

    if (quizSectionError) throw quizSectionError;
    console.log(`✅ Quiz section created\n`);

    // Insert questions - batch 1 (questions 1-10)
    console.log('❓ Inserting 22 quiz questions...');
    
    const batch1 = [
      { id: 'inst-mag-1', text: '10,000 Gauss is equivalent to:', answers: '{"A": "0.5 Tesla", "B": "1.0 Tesla", "C": "1.5 Tesla", "D": "10 Tesla"}', correct: 'B', order: 0 },
      { id: 'inst-mag-2', text: 'In the absence of a magnetic field, the orientation, or "spins" of hydrogen protons are all:', answers: '{"A": "aligned", "B": "Parallel and anti-parallel", "C": "random", "D": "fixed"}', correct: 'C', order: 1 },
      { id: 'inst-mag-3', text: 'As magnetic field strength increases, the number of protons that align in the parallel direction of the magnetic field vs the anti-parallel direction:', answers: '{"A": "remains the same", "B": "increases", "C": "decreases", "D": "goes to zero"}', correct: 'B', order: 2 },
      { id: 'inst-mag-4', text: 'The summation of all the magnetic moments of individual spins along the same plane as the magnetic field is referred to as the:', answers: '{"A": "Longitudinal magnetization vector", "B": "Transverse magnetization vector", "C": "Parallel vector", "D": "Anti-parallel vector"}', correct: 'A', order: 3 },
      { id: 'inst-mag-5', text: 'Of the 3 magnet types used in MRI, the one that is used the most is:', answers: '{"A": "Superconductive", "B": "Permanent", "C": "Resistive (or electro)", "D": "Bar"}', correct: 'A', order: 4 },
      { id: 'inst-mag-6', text: 'Of the 3 magnet types used in MRI, which can be routinely turned on and off?', answers: '{"A": "Superconductive", "B": "Permanent", "C": "Resistive (or electro)", "D": "Bar"}', correct: 'C', order: 5 },
      { id: 'inst-mag-7', text: 'True or False: The magnetic field strength of an MRI system can be determined by looking at its size.', answers: '{"A": "True", "B": "False"}', correct: 'B', order: 6, type: 'truefalse' },
      { id: 'inst-mag-8', text: 'Of the 3 magnet types used in MRI, which is mostly used in "open" designs?', answers: '{"A": "Superconductive", "B": "Permanent", "C": "Resistive (or electro)", "D": "Bar"}', correct: 'B', order: 7 },
      { id: 'inst-mag-9', text: 'Of the 3 magnet types used in MRI, which can yield the highest magnetic field strength?', answers: '{"A": "Superconductive", "B": "Permanent", "C": "Resistive (or electro)", "D": "Bar"}', correct: 'A', order: 8 },
      { id: 'inst-mag-10', text: 'Of the 3 magnet types used in MRI, which is heaviest?', answers: '{"A": "Superconductive", "B": "Permanent", "C": "Resistive (or electro)", "D": "Bar"}', correct: 'C', order: 9 },
    ];

    const { error: q1Error } = await supabase
      .from('quiz_questions')
      .insert(batch1.map(q => ({
        content_item_id: quiz.id,
        question_id: q.id,
        section_key: 'instrumentation-magnets-fundamentals',
        question_type: q.type || 'multiplechoice',
        question_text: q.text,
        answers: q.answers,
        correct_answer: q.correct,
        points: 1,
        order_index: q.order,
        image_url: null
      })));

    if (q1Error) throw q1Error;
    console.log(`   ✅ Inserted questions 1-10`);

    // Batch 2 (questions 11-21)
    const batch2 = [
      { id: 'inst-mag-11', text: 'Of the 3 magnet types used in MRI, which accommodates the highest performance levels in image quality and speed?', answers: '{"A": "Superconductive", "B": "Permanent", "C": "Resistive (or electro)", "D": "Bar"}', correct: 'A', order: 10 },
      { id: 'inst-mag-12', text: 'Of the 3 magnet types used in MRI, which requires special cooling to maintain its magnetic field?', answers: '{"A": "Superconductive", "B": "Permanent", "C": "Resisitve (or electro)", "D": "Bar"}', correct: 'A', order: 11 },
      { id: 'inst-mag-13', text: 'In a superconductive magnet, electrical current flowing through the magnetic experiences:', answers: '{"A": "virtually no resistance", "B": "no change on resistance", "C": "extreme resistance", "D": "extreme heat"}', correct: 'A', order: 12 },
      { id: 'inst-mag-14', text: 'The medium used to make a conductor superconductive is called a:', answers: '{"A": "Dewar", "B": "Gradient", "C": "Alloy", "D": "Cryogen"}', correct: 'D', order: 13 },
      { id: 'inst-mag-15', text: 'The strong magnetic field produced by heavy electric current passing through a conductor is an example of:', answers: '{"A": "Tesla\'s Law", "B": "Faraday\'s Law", "C": "Magnetic resonance", "D": "Electromagnetic resistance"}', correct: 'B', order: 14 },
      { id: 'inst-mag-16', text: 'Helium liquifies at -453°F (-2690C) which is equivalent to:', answers: '{"A": "0 degrees Kelvin", "B": "4 degrees Kelvin", "C": "10 degrees Kelvin", "D": "2.69 degrees Kelvin"}', correct: 'B', order: 15 },
      { id: 'inst-mag-17', text: '0° Kelvin, the theoretical point where all molecular motion stops, is also referred to as:', answers: '{"A": "0 degrees Celsius", "B": "null point", "C": "absolute zero", "D": "superconductivity"}', correct: 'C', order: 16 },
      { id: 'inst-mag-18', text: 'The process of liquid helium explosively turning gaseous is referred to as a:', answers: '{"A": "quench", "B": "superconductivity", "C": "dephasing", "D": "ramping"}', correct: 'A', order: 17 },
      { id: 'inst-mag-19', text: 'All MRI systems have a transmitting antenna surrounding the patient referred to as the:', answers: '{"A": "Cold Head", "B": "Body Coil", "C": "Array Processor", "D": "Surface Coil"}', correct: 'B', order: 18 },
      { id: 'inst-mag-20', text: 'The computer component that performs the mathematical reconstruction of MRI images is called the:', answers: '{"A": "Fourier Transformation module", "B": "Array processor", "C": "Body coil", "D": "Gradient Subsystem"}', correct: 'B', order: 19 },
      { id: 'inst-mag-21', text: 'The mathematical reconstruction of an MRI image uses the ________________ process to create the image.', answers: '{"A": "Fourier Transformation", "B": "Array Processing", "C": "RF Coil Subsystem", "D": "Cold Head"}', correct: 'A', order: 20 },
    ];

    const { error: q2Error } = await supabase
      .from('quiz_questions')
      .insert(batch2.map(q => ({
        content_item_id: quiz.id,
        question_id: q.id,
        section_key: 'instrumentation-magnets-fundamentals',
        question_type: 'multiplechoice',
        question_text: q.text,
        answers: q.answers,
        correct_answer: q.correct,
        points: 1,
        order_index: q.order,
        image_url: null
      })));

    if (q2Error) throw q2Error;
    console.log(`   ✅ Inserted questions 11-21\n`);

    console.log('✅ All content created successfully!\n');
    console.log('📊 Summary:');
    console.log('   ✅ Module: 05 - Instrumentation I: Magnets (published, unlocked)');
    console.log('   ✅ Video: Instrumentation I: Magnets');
    console.log('   ✅ Quiz: Instrumentation & Magnets Fundamentals (22 questions: 21 multiple choice + 1 true/false)');
    console.log('   ✅ Hints JSON: /public/data/quiz-hints/12-instrumentation-magnets-fundamentals.json\n');
    console.log('🎉 Migration complete! Test at: http://localhost:3000/phase1/instrumentation-magnets');

  } catch (error) {
    console.error('💥 Error:', error);
    process.exit(1);
  }
}

execute();

