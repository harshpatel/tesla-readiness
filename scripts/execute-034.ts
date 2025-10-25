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
    console.log('🚀 Executing migration 034: MRI Safety II - RF & Gradient Fields content\n');

    // Get section ID
    const { data: section } = await supabase
      .from('sections')
      .select('id')
      .eq('slug', 'phase1')
      .single();

    const sectionId = section!.id;

    // Check if module exists, if not create it
    console.log('📝 Checking for existing module...');
    const { data: existingModule } = await supabase
      .from('modules')
      .select('id')
      .eq('section_id', sectionId)
      .eq('slug', 'mri-safety-rf-gradient-fields')
      .single();

    let module;
    if (existingModule) {
      console.log('   Module exists, updating...');
      const { data: updatedModule, error: moduleError } = await supabase
        .from('modules')
        .update({
          title: '07 - MRI Safety II: RF & Gradient Fields',
          description: 'Learn RF burn prevention, SAR limits and management, implant safety protocols, acoustic noise hazards, hearing protection requirements, and the roles of MRI safety personnel',
          icon: '📡',
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
          slug: 'mri-safety-rf-gradient-fields',
          title: '07 - MRI Safety II: RF & Gradient Fields',
          description: 'Learn RF burn prevention, SAR limits and management, implant safety protocols, acoustic noise hazards, hearing protection requirements, and the roles of MRI safety personnel',
          icon: '📡',
          order_index: 7,
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
        title: 'MRI Safety II: RF & Gradient Fields',
        description: 'Comprehensive coverage of RF burns, SAR management, implant safety, acoustic hazards, and MRI safety personnel roles for safe clinical practice',
        type: 'video',
        icon: '🎥',
        order_index: 1,
        metadata: { videoUrl: 'https://cffhrzzfhyotkbuuoayc.supabase.co/storage/v1/object/public/videos/07%20-%20MRI%20Safety%20II%20-%20RF%20&%20Gradient%20Fields.mp4' },
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
        slug: 'mri-safety-rf-gradient-fundamentals',
        title: 'MRI Safety: RF & Gradient Fundamentals',
        description: 'Test your knowledge of RF burns, SAR limits, implant safety, acoustic noise hazards, and MRI safety personnel roles.',
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
        key: 'mri-safety-rf-gradient-fundamentals',
        title: 'MRI Safety: RF & Gradient Fundamentals',
        description: 'Master RF safety, SAR management, and acoustic hazard protocols',
        icon: '📡',
        order_index: 0
      }, {
        onConflict: 'key'
      });

    if (quizSectionError) throw quizSectionError;
    console.log(`✅ Quiz section created\n`);

    // Insert all 20 questions in one batch
    console.log('❓ Inserting 20 quiz questions...');
    
    const allQuestions = [
      { id: 'rf-safety-1', text: 'The most common MRI-related injury is:', answers: '{"A": "Hearing damage", "B": "Radio-frequency burns", "C": "Cryogen burns", "D": "Ferrous objects accelerating into the magnet bore"}', correct: 'B', order: 0 },
      { id: 'rf-safety-2', text: 'Which of the following is not a type of radio frequency burn seen in MRI?', answers: '{"A": "Looped cables", "B": "Skin contact with a transmitting antenna", "C": "Skin-to-Skin large contact loops", "D": "Electrical conductor arcing"}', correct: 'D', order: 1 },
      { id: 'rf-safety-3', text: 'True or False: Burns caused by looped cables burns may be delayed.', answers: '{"A": "True", "B": "False"}', correct: 'A', order: 2 },
      { id: 'rf-safety-4', text: 'A best practice for any cables is the magnet bore is to _____________.', answers: '{"A": "Keep as much of the cable in the bore as possible", "B": "Loop the cable to shorten the overall length", "C": "Leave the cable unplugged", "D": "Keep the amount of cable in the bore to a minimum and plugged in"}', correct: 'D', order: 3 },
      { id: 'rf-safety-5', text: 'Skin contact with the inside of the bore is unsafe because it', answers: '{"A": "Comes in to contact with a transmitting antenna leading to a burn.", "B": "Degrades image quality", "C": "Increases SAR", "D": "Decreases signal-to-noise ratio"}', correct: 'A', order: 4 },
      { id: 'rf-safety-6', text: 'Non-ferrous implants may be unsafe if they are _____________.', answers: '{"A": "Large", "B": "Near large nerves", "C": "Mechanically or electrically activated", "D": "Made primarily of iron"}', correct: 'C', order: 5 },
      { id: 'rf-safety-7', text: 'Ferrous implants are dangerous because they may ____________.', answers: '{"A": "Be strongly attracted to the magnetic field accelerating the object into the magnet", "B": "Create poor image quality", "C": "Damage the implant", "D": "Increase magnetic field inhomogeneity"}', correct: 'A', order: 6 },
      { id: 'rf-safety-8', text: 'All metallic implants _______________ though may pose little or no risk to the patient.', answers: '{"A": "Distort the magnetic field causing artifacts if located in the area of interest.", "B": "Cause radio-frequency burns", "C": "Are unsafe", "D": "Must be removed before the exam"}', correct: 'A', order: 7 },
      { id: 'rf-safety-9', text: 'The Magnetic Resonance Medical Director (MRMD) is a ________________.', answers: '{"A": "Certified MRI technologist", "B": "A physicist trained in MRI Safety", "C": "Physician trained in MRI Safety", "D": "MRI Department Manager"}', correct: 'C', order: 8 },
      { id: 'rf-safety-10', text: 'The primary role of the Magnetic Resonance Safety Officer (MRSO) is to___________:', answers: '{"A": "Advise and execute orders from the MRMD", "B": "Advise and execute orders from the MRSE", "C": "Give orders to a scanning MR technologist", "D": "Give orders to the MRSE"}', correct: 'A', order: 9 },
      { id: 'rf-safety-11', text: 'The radio-frequency energy transmitted to the patient over time is referred to as ____________ , or SAR.', answers: '{"A": "Signal Absorption Rate", "B": "Safe Absorption Rate", "C": "Selective Absorption Rate", "D": "Specific Absorption Rate"}', correct: 'D', order: 10 },
      { id: 'rf-safety-12', text: 'SAR is measured in___________.', answers: '{"A": "Watts/milligram", "B": "Watts/Hertz", "C": "Watts/pound", "D": "Watts/kilogram"}', correct: 'D', order: 11 },
      { id: 'rf-safety-13', text: 'The maximum SAR for whole body imaging in NORMAL MODE is ___________________.', answers: '{"A": "No more than 3.2 Watts/kilogram", "B": "No more than 2.0 Watts/kilogram", "C": "No more than 4.0 Watts/kilogram", "D": "No more than 8.0 Watts/kilogram"}', correct: 'B', order: 12 },
      { id: 'rf-safety-14', text: 'One method of reducing SAR is to________________;', answers: '{"A": "Reduce TR", "B": "Reduce TE", "C": "Increase flip angle in GRE pulse sequence", "D": "Increase the TR"}', correct: 'D', order: 13 },
      { id: 'rf-safety-15', text: 'The noise of an MRI system while scanning arises from ___________________.', answers: '{"A": "The rise and fall of the gradients", "B": "radio-frequency transmission", "C": "radio-frequency absorption", "D": "circulating cryogens"}', correct: 'A', order: 14 },
      { id: 'rf-safety-16', text: 'Acoustic noise levels are measured in decibels, or dB. dB levels are a function of the______________ of the noise:', answers: '{"A": "Volume and duration", "B": "Frequency and duration", "C": "Volume and the distance", "D": "Time and iteration"}', correct: 'A', order: 15 },
      { id: 'rf-safety-17', text: 'dB levels above _________dB can cause hearing damage and loss.', answers: '{"A": "60", "B": "75", "C": "85", "D": "90"}', correct: 'C', order: 16 },
      { id: 'rf-safety-18', text: 'True or False: Acoustic noise levels in MRI are a function of the MRI system performance levels and magnetic field strength.', answers: '{"A": "True", "B": "False"}', correct: 'A', order: 17 },
      { id: 'rf-safety-19', text: 'True or False: Non-patients in the magnet during scanning are not required to have hearing protection.', answers: '{"A": "True", "B": "False"}', correct: 'B', order: 18 },
      { id: 'rf-safety-20', text: 'A high-performance 3.0T MRI system can reach dB levels as high as_________.', answers: '{"A": "85db", "B": "97dB", "C": "110dB", "D": "125dB"}', correct: 'D', order: 19 },
    ];

    const { error: qError } = await supabase
      .from('quiz_questions')
      .insert(allQuestions.map(q => ({
        content_item_id: quiz.id,
        question_id: q.id,
        section_key: 'mri-safety-rf-gradient-fundamentals',
        question_type: 'multiplechoice',
        question_text: q.text,
        answers: q.answers,
        correct_answer: q.correct,
        points: 1,
        order_index: q.order,
        image_url: null
      })));

    if (qError) throw qError;
    console.log(`   ✅ Inserted all 20 RF & gradient safety questions\n`);

    console.log('✅ All content created successfully!\n');
    console.log('📊 Summary:');
    console.log('   ✅ Module: 07 - MRI Safety II: RF & Gradient Fields (published, unlocked)');
    console.log('   ✅ Video: MRI Safety II: RF & Gradient Fields');
    console.log('   ✅ Quiz: MRI Safety: RF & Gradient Fundamentals (20 questions)');
    console.log('   ✅ Hints JSON: /public/data/quiz-hints/14-mri-safety-rf-gradient-fundamentals.json\n');
    console.log('🎉 Migration complete! Test at: http://localhost:3000/phase1/mri-safety-rf-gradient-fields');

  } catch (error) {
    console.error('💥 Error:', error);
    process.exit(1);
  }
}

execute();

