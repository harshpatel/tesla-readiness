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
    console.log('🚀 Executing migration 035: MRI Procedures & Set Up III: MSK content\n');

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
      .eq('slug', 'mri-procedures-msk')
      .single();

    let module;
    if (existingModule) {
      console.log('   Module exists, updating...');
      const { data: updatedModule, error: moduleError } = await supabase
        .from('modules')
        .update({
          title: '10 - MRI Procedures & Set Up III: MSK',
          description: 'Master musculoskeletal MRI protocols including knee, hip, shoulder, elbow, and wrist positioning, landmarking, plane angulation, anatomical coverage, and structure identification',
          icon: '🦴',
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
          slug: 'mri-procedures-msk',
          title: '10 - MRI Procedures & Set Up III: MSK',
          description: 'Master musculoskeletal MRI protocols including knee, hip, shoulder, elbow, and wrist positioning, landmarking, plane angulation, anatomical coverage, and structure identification',
          icon: '🦴',
          order_index: 10,
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
        title: 'MRI Procedures & Set Up III: MSK',
        description: 'Comprehensive guide to musculoskeletal MRI protocols covering positioning, landmarking, and anatomical identification for knee, hip, shoulder, elbow, and wrist imaging',
        type: 'video',
        icon: '🎥',
        order_index: 1,
        metadata: { videoUrl: 'https://cffhrzzfhyotkbuuoayc.supabase.co/storage/v1/object/public/videos/10%20-%20MRI%20Procedures%20&%20Set%20Up%20III%20-%20MSK.mp4' },
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
        slug: 'msk-procedures-fundamentals',
        title: 'MSK Procedures Fundamentals',
        description: 'Test your knowledge of musculoskeletal MRI positioning, landmarking, and anatomical identification across all major joints.',
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
        key: 'msk-procedures-fundamentals',
        title: 'MSK Procedures Fundamentals',
        description: 'Master musculoskeletal MRI positioning and anatomy identification',
        icon: '🦴',
        order_index: 0
      }, {
        onConflict: 'key'
      });

    if (quizSectionError) throw quizSectionError;
    console.log(`✅ Quiz section created\n`);

    // Insert all 42 questions (split into batches for reliability)
    console.log('❓ Inserting 42 MSK quiz questions (6 with images)...');
    
    const batch1 = [
      { id: 'msk-1', text: 'An image that is T1 Weighted means that T1 contrast is maximized and ___________________ are minimized.', answers: '{"A": "T2 and Proton Density contrast", "B": "T1 and T2 are minimized contrast", "C": "1.5T and 3.0T effects", "D": "Artifacts"}', correct: 'A', order: 0, image: null },
      { id: 'msk-2', text: 'Proton Density Weighting means the predominant contrast is based on:', answers: '{"A": "A combination of T1 and T2", "B": "T1 contrast", "C": "T2 contrast", "D": "The difference between number of hydrogen-based protons in the tissues being imaged"}', correct: 'D', order: 1, image: null },
      { id: 'msk-3', text: 'MSK imaging can be challenging because it requires ________________.', answers: '{"A": "High spatial resolution", "B": "High signal-to-noise ration", "C": "Precise positioning", "D": "All the above"}', correct: 'D', order: 2, image: null },
      { id: 'msk-knee-1', text: 'Indications for MRI of the knee include all the following expect_____.', answers: '{"A": "Internal derangement", "B": "Torn meniscus", "C": "Hip Pain", "D": "Tendon/Ligament tears"}', correct: 'C', order: 3, image: null },
      { id: 'msk-knee-2', text: 'Landmarking for a knee MRI is:', answers: '{"A": "At the lateral femoral condyle", "B": "Parallel to both femoral condyles", "C": "At the base of the patella", "D": "At the apex of the patella"}', correct: 'D', order: 4, image: null },
      { id: 'msk-knee-3', text: 'The axial coverage for a knee MRI is from the __________________.', answers: '{"A": "Top of the patella through the joint space", "B": "Inferior half of the femur to the superior half of the tibia", "C": "Top of the patella to the patellar tendon insertion", "D": "Mid patella through the lateral femoral condyle"}', correct: 'C', order: 5, image: null },
      { id: 'msk-knee-4', text: 'For a sagittal of the knee, angle ____________.', answers: '{"A": "Parallel to the plane of the femoral condyles", "B": "Perpendicular to the plane of the femoral condyles", "C": "To the plane of the femur", "D": "To the plane of the tibia"}', correct: 'B', order: 6, image: null },
      { id: 'msk-hip-1', text: 'Indications for MRI of the Hip include all the following except for ____________.', answers: '{"A": "Generalized pain", "B": "Degenerative Joint Disease (DJD)", "C": "Incontinence", "D": "Avascular necrosis"}', correct: 'C', order: 7, image: null },
      { id: 'msk-hip-2', text: 'The landmark for a hip MRI is the _________________.', answers: '{"A": "Greater Trochanter", "B": "Symphysis pubis", "C": "Iliac crest", "D": "½ between the iliac crest and the symphysis pubis"}', correct: 'A', order: 8, image: null },
      { id: 'msk-hip-3', text: 'The coronal coverage for the hip is from the ___________________.', answers: '{"A": "Iliac crest through the symphysis pubis", "B": "Ramus through the symphysis pubis", "C": "Hamstring insertion through the acetabulum", "D": "Ramus through the acetabulum"}', correct: 'C', order: 9, image: null },
    ];

    const { error: batch1Error } = await supabase.from('quiz_questions').insert(
      batch1.map(q => ({
        content_item_id: quiz.id,
        question_id: q.id,
        section_key: 'msk-procedures-fundamentals',
        question_type: 'multiplechoice',
        question_text: q.text,
        answers: q.answers,
        correct_answer: q.correct,
        points: 1,
        order_index: q.order,
        image_url: q.image
      }))
    );
    if (batch1Error) throw batch1Error;
    console.log('   ✅ Batch 1/5 complete (10 questions)');

    const batch2 = [
      { id: 'msk-hip-4', text: 'The axial coverage for the hip is from ____________________.', answers: '{"A": "Above the acetabulum through the entire greater trochanter", "B": "The iliac crest through the entire greater trochanter", "C": "Above the acetabulum through the symphysis pubis", "D": "The iliac crest through the symphysis pubis"}', correct: 'A', order: 10, image: null },
      { id: 'msk-hip-anat-1', text: 'Label 1:', answers: '{"A": "Obturator internus T.", "B": "Femoral head", "C": "Labrum", "D": "Ramus"}', correct: 'C', order: 11, image: 'https://0cm.classmarker.com/10742032_6YCKGTBN.png' },
      { id: 'msk-hip-anat-2', text: 'Label 2:', answers: '{"A": "Ligamentum teres", "B": "Obturator internus T.", "C": "Labrum", "D": "Femoral head"}', correct: 'D', order: 12, image: 'https://0cm.classmarker.com/10742032_6YCKGTBN.png' },
      { id: 'msk-hip-anat-3', text: 'Label 3:', answers: '{"A": "Ligamentum teres", "B": "Obturator internus T.", "C": "Labrum", "D": "Ramus"}', correct: 'A', order: 13, image: 'https://0cm.classmarker.com/10742032_6YCKGTBN.png' },
      { id: 'msk-hip-anat-4', text: 'Label 4:', answers: '{"A": "Ligamentum teres", "B": "Obturator internus T.", "C": "Labrum", "D": "Femoral neck"}', correct: 'B', order: 14, image: 'https://0cm.classmarker.com/10742032_6YCKGTBN.png' },
      { id: 'msk-knee-anat-1', text: 'Label 1:', answers: '{"A": "Patella", "B": "Anterior Cruciate L.", "C": "Patellar tendon", "D": "Quadriceps Tendon"}', correct: 'D', order: 15, image: 'https://0cm.classmarker.com/10742032_TMKX8DSA.png' },
      { id: 'msk-knee-anat-2', text: 'Label 2:', answers: '{"A": "Quadriceps Tendon", "B": "Anterior Cruciate L.", "C": "Patellar tendon", "D": "Tibia"}', correct: 'B', order: 16, image: 'https://0cm.classmarker.com/10742032_TMKX8DSA.png' },
      { id: 'msk-knee-anat-3', text: 'Label 3:', answers: '{"A": "Popliteal artery", "B": "Quadriceps Tendon", "C": "Anterior Cruciate L.", "D": "Patellar tendon"}', correct: 'D', order: 17, image: 'https://0cm.classmarker.com/10742032_TMKX8DSA.png' },
      { id: 'msk-knee-anat-4', text: 'Label 4:', answers: '{"A": "Femur", "B": "Tibia", "C": "Patellar tendon", "D": "Patella"}', correct: 'B', order: 18, image: 'https://0cm.classmarker.com/10742032_TMKX8DSA.png' },
    ];

    const { error: batch2Error } = await supabase.from('quiz_questions').insert(
      batch2.map(q => ({
        content_item_id: quiz.id,
        question_id: q.id,
        section_key: 'msk-procedures-fundamentals',
        question_type: 'multiplechoice',
        question_text: q.text,
        answers: q.answers,
        correct_answer: q.correct,
        points: 1,
        order_index: q.order,
        image_url: q.image
      }))
    );
    if (batch2Error) throw batch2Error;
    console.log('   ✅ Batch 2/5 complete (9 questions with images)');

    const batch3 = [
      { id: 'msk-shoulder-1', text: 'Indications for a shoulder MRI include all the following expect _______.', answers: '{"A": "Post operative follow up", "B": "Chest Pain", "C": "Tumor", "D": "Trauma"}', correct: 'B', order: 19, image: null },
      { id: 'msk-shoulder-2', text: 'Which of the following is the only indication for an MRI of the shoulder?', answers: '{"A": "Neck pain", "B": "Headache", "C": "Meniscal tear", "D": "Rotator cuff tear"}', correct: 'D', order: 20, image: null },
      { id: 'msk-shoulder-3', text: 'When positioning a shoulder, the landmark is the _______________.', answers: '{"A": "Humeral head", "B": "Superior aspect of the sternum", "C": "Clavicle", "D": "Mid-humeral shaft"}', correct: 'A', order: 21, image: null },
      { id: 'msk-shoulder-4', text: 'When positioning the shoulder, move the patient as far as possible to:', answers: '{"A": "The affected side", "B": "The unaffected side", "C": "Wherever the patient is most comfortable"}', correct: 'B', order: 22, image: null },
      { id: 'msk-shoulder-5', text: 'When positioning the shoulder, the humerus and forearm should be:', answers: '{"A": "In the same plane as the shoulder", "B": "Slightly anterior to the shoulder", "C": "Slightly posterior to the shoulder", "D": "Left in the most comfortable position for the patient"}', correct: 'A', order: 23, image: null },
      { id: 'msk-shoulder-6', text: 'The angulation for the oblique coronal plane of the shoulder is parallel to the____________________.', answers: '{"A": "Biceps tendon", "B": "Supraspinatus tendon", "C": "Infraspinatus tendon", "D": "Angle of the glenoid"}', correct: 'B', order: 24, image: null },
      { id: 'msk-shoulder-7', text: 'The coverage for an axial of the shoulder must also include the entire:', answers: '{"A": "Shoulder blade", "B": "Acromial-Clavicular (AC) joint", "C": "Sterna-Clavicular (SC) joint", "D": "Superior half the humeral shaft"}', correct: 'B', order: 25, image: null },
      { id: 'msk-shoulder-anat-1', text: 'Label 1:', answers: '{"A": "Humeral head", "B": "Glenoid", "C": "Acromion process", "D": "Labrum"}', correct: 'C', order: 26, image: 'https://0cm.classmarker.com/10742032_7DPB8HOD.png' },
      { id: 'msk-shoulder-anat-2', text: 'Label 2:', answers: '{"A": "Acromion process", "B": "Labrum", "C": "Biceps tendon", "D": "Glenoid"}', correct: 'C', order: 27, image: 'https://0cm.classmarker.com/10742032_7DPB8HOD.png' },
      { id: 'msk-shoulder-anat-3', text: 'Label 3:', answers: '{"A": "Acromion process", "B": "Labrum", "C": "Biceps tendon", "D": "Glenoid"}', correct: 'D', order: 28, image: 'https://0cm.classmarker.com/10742032_7DPB8HOD.png' },
    ];

    const { error: batch3Error } = await supabase.from('quiz_questions').insert(
      batch3.map(q => ({
        content_item_id: quiz.id,
        question_id: q.id,
        section_key: 'msk-procedures-fundamentals',
        question_type: 'multiplechoice',
        question_text: q.text,
        answers: q.answers,
        correct_answer: q.correct,
        points: 1,
        order_index: q.order,
        image_url: q.image
      }))
    );
    if (batch3Error) throw batch3Error;
    console.log('   ✅ Batch 3/5 complete (10 questions)');

    const batch4 = [
      { id: 'msk-shoulder-anat-4', text: 'Label 4:', answers: '{"A": "Acromion process", "B": "Labrum", "C": "Biceps tendon", "D": "Glenoid"}', correct: 'B', order: 29, image: 'https://0cm.classmarker.com/10742032_7DPB8HOD.png' },
      { id: 'msk-shoulder-anat-5', text: 'The arrow identifies:', answers: '{"A": "Humeral head", "B": "Glenoid", "C": "Biceps tendon", "D": "Supraspinatus tendon"}', correct: 'D', order: 30, image: 'https://0cm.classmarker.com/10742032_RWBDRCG9.png' },
      { id: 'msk-elbow-1', text: 'The elbow is comprised of the following bones:', answers: '{"A": "Humerus, Ulna, Tibia", "B": "Ulna, Radius, Capitate", "C": "Radius, Ulna, Shoulder", "D": "Humerus, Ulna, Radius"}', correct: 'D', order: 31, image: null },
      { id: 'msk-elbow-2', text: 'An advantage for positioning the elbow by the side is greater patient comfort. A disadvantage is_________________:', answers: '{"A": "Higher SAR", "B": "Respiratory motion artifacts", "C": "Lower magnetic field homogeneity", "D": "Longer scan times"}', correct: 'C', order: 32, image: null },
      { id: 'msk-elbow-3', text: 'The landmark for the elbow is:', answers: '{"A": "Mid humerus", "B": "Mid radius", "C": "Mid ulna", "D": "Center of the elbow"}', correct: 'D', order: 33, image: null },
      { id: 'msk-elbow-4', text: 'For elbow imaging, it is essential to include the________________.', answers: '{"A": "Triceps muscle", "B": "Biceps muscle", "C": "Biceps tendon insertion", "D": "Triceps ligament insertion"}', correct: 'C', order: 34, image: null },
      { id: 'msk-elbow-5', text: 'The angulation for a sagittal elbow is__________________.', answers: '{"A": "Perpendicular to the plane of the lateral and medial condyles", "B": "Parallel to the plane of the lateral and medial condyles", "C": "Parallel to the plane of the humeral shaft", "D": "Perpendicular to the plane of the humeral shaft"}', correct: 'A', order: 35, image: null },
      { id: 'msk-elbow-anat-1', text: 'Label 1:', answers: '{"A": "Biceps tendon insertion", "B": "Trochlea", "C": "Olecranon process", "D": "Triceps tendon"}', correct: 'D', order: 36, image: 'https://0cm.classmarker.com/10742032_KAJK0HNL.png' },
      { id: 'msk-elbow-anat-2', text: 'Label 2:', answers: '{"A": "Biceps tendon insertion", "B": "Trochlea", "C": "Olecranon process", "D": "Triceps tendon"}', correct: 'C', order: 37, image: 'https://0cm.classmarker.com/10742032_KAJK0HNL.png' },
      { id: 'msk-elbow-anat-3', text: 'Label 3:', answers: '{"A": "Biceps tendon insertion", "B": "Trochlea", "C": "Olecranon process", "D": "Triceps tendon"}', correct: 'B', order: 38, image: 'https://0cm.classmarker.com/10742032_KAJK0HNL.png' },
    ];

    const { error: batch4Error } = await supabase.from('quiz_questions').insert(
      batch4.map(q => ({
        content_item_id: quiz.id,
        question_id: q.id,
        section_key: 'msk-procedures-fundamentals',
        question_type: 'multiplechoice',
        question_text: q.text,
        answers: q.answers,
        correct_answer: q.correct,
        points: 1,
        order_index: q.order,
        image_url: q.image
      }))
    );
    if (batch4Error) throw batch4Error;
    console.log('   ✅ Batch 4/5 complete (10 questions)');

    const batch5 = [
      { id: 'msk-elbow-anat-4', text: 'Label 4:', answers: '{"A": "Biceps tendon insertion", "B": "Trochlea", "C": "Olecranon process", "D": "Triceps tendon"}', correct: 'A', order: 39, image: 'https://0cm.classmarker.com/10742032_KAJK0HNL.png' },
      { id: 'msk-wrist-1', text: 'Which indication is specific only to wrist MRI?', answers: '{"A": "Degenerative joint disease (DJD)", "B": "Arthritis", "C": "Trauma", "D": "Carpel tunnel syndrome"}', correct: 'D', order: 40, image: null },
      { id: 'msk-wrist-2', text: 'Landmark the wrist at ________________.', answers: '{"A": "½\\" distal to the wrist joint at the capitate bone", "B": "1\\" proximal to the wrist joint at the capitate bone", "C": "The wrist joint", "D": "The center of the metacarpal bones"}', correct: 'A', order: 41, image: null },
    ];

    const { error: batch5Error } = await supabase.from('quiz_questions').insert(
      batch5.map(q => ({
        content_item_id: quiz.id,
        question_id: q.id,
        section_key: 'msk-procedures-fundamentals',
        question_type: 'multiplechoice',
        question_text: q.text,
        answers: q.answers,
        correct_answer: q.correct,
        points: 1,
        order_index: q.order,
        image_url: q.image
      }))
    );
    if (batch5Error) throw batch5Error;
    console.log('   ✅ Batch 5/5 complete (3 questions)');

    console.log('\n✅ All content created successfully!\n');
    console.log('📊 Summary:');
    console.log('   ✅ Module: 10 - MRI Procedures & Set Up III: MSK (published, unlocked)');
    console.log('   ✅ Video: MRI Procedures & Set Up III: MSK');
    console.log('   ✅ Quiz: MSK Procedures Fundamentals (42 questions, 6 with images)');
    console.log('   ✅ Hints JSON: /public/data/quiz-hints/15-msk-procedures-fundamentals.json\n');
    console.log('🎉 Migration complete! Test at: http://localhost:3000/phase1/mri-procedures-msk');

  } catch (error) {
    console.error('💥 Error:', error);
    process.exit(1);
  }
}

execute();

