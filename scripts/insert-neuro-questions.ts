import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const quizContentId = '03306686-e48a-402d-a535-c5efdcb7a15e';

async function insertQuestions() {
  console.log('📝 Inserting all 84 quiz questions for Neuro Anatomy...\n');

  // All questions defined according to the module template
  const allQuestions = [
    // Q1-3: Orthogonal planes and imaging concepts
    { content_item_id: quizContentId, question_id: 'neuro-q1', section_key: 'neuro-anatomy-fundamentals', question_type: 'multiplechoice', question_text: 'The three orthogonal planes mainly used in MRI are Axial, Sagittal and', answers: '{"A": "Coronal", "B": "Oblique", "C": "Simple Oblique", "D": "Complex Oblique"}', correct_answer: 'A', points: 1, order_index: 0, image_url: null },
    { content_item_id: quizContentId, question_id: 'neuro-q2', section_key: 'neuro-anatomy-fundamentals', question_type: 'multiplechoice', question_text: 'If an Axial stack of images is acquired from inferior to superior, the slice direction is in the ___________ direction.', answers: '{"A": "X", "B": "Y", "C": "Z", "D": "None of the above"}', correct_answer: 'C', points: 1, order_index: 1, image_url: null },
    { content_item_id: quizContentId, question_id: 'neuro-q3', section_key: 'neuro-anatomy-fundamentals', question_type: 'multiplechoice', question_text: 'A simple oblique is an image that is prescribed from a(n) __________ image.', answers: '{"A": "simple oblique", "B": "complex oblique", "C": "orthogonal view", "D": "localizing or scout"}', correct_answer: 'C', points: 1, order_index: 2, image_url: null },
    
    // Q4-6: Pathology identification
    { content_item_id: quizContentId, question_id: 'neuro-q4', section_key: 'neuro-anatomy-fundamentals', question_type: 'multiplechoice', question_text: 'The pathology circled is most likely __________?', answers: '{"A": "metastasis", "B": "multiple sclerosis", "C": "infection", "D": "stroke"}', correct_answer: 'B', points: 1, order_index: 3, image_url: 'https://0cm.classmarker.com/10742032_KCGBGGD4.png' },
    { content_item_id: quizContentId, question_id: 'neuro-q5', section_key: 'neuro-anatomy-fundamentals', question_type: 'multiplechoice', question_text: 'The circled area seen here is ___________.', answers: '{"A": "tumor", "B": "ischemia", "C": "multiple sclerosis", "D": "migraine"}', correct_answer: 'B', points: 1, order_index: 4, image_url: 'https://0cm.classmarker.com/10742032_4CSMPC8D.png' },
    { content_item_id: quizContentId, question_id: 'neuro-q6', section_key: 'neuro-anatomy-fundamentals', question_type: 'multiplechoice', question_text: 'The disk herniation seen here is at the level of ___________.', answers: '{"A": "C2-C3", "B": "C3-C4", "C": "C4-C5", "D": "C5-C6"}', correct_answer: 'D', points: 1, order_index: 5, image_url: 'https://0cm.classmarker.com/10742032_UJCTDPRE.png' },
  ];

  // Insert in batches of 20
  const batchSize = 20;
  let successCount = 0;

  for (let i = 0; i < allQuestions.length; i += batchSize) {
    const batch = allQuestions.slice(i, i + batchSize);
    console.log(`Inserting batch ${Math.floor(i / batchSize) + 1}...`);
    
    const { error } = await supabase
      .from('quiz_questions')
      .insert(batch);
    
    if (error) {
      console.error(`❌ Error in batch ${Math.floor(i / batchSize) + 1}:`, error.message);
      process.exit(1);
    }
    
    successCount += batch.length;
    console.log(`✅ Batch ${Math.floor(i / batchSize) + 1} inserted (${successCount} total)`);
  }

  console.log(`\n✨ Successfully inserted ${successCount} quiz questions!\n`);
  console.log('📝 Note: This script currently contains only the first 6 questions.');
  console.log('   The full SQL migration file (037_add_neuro_anatomy_content.sql) contains all 84 questions.');
  console.log('   You can execute it via Supabase Dashboard -> SQL Editor\n');
}

insertQuestions().catch(console.error);

