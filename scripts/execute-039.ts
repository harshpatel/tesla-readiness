import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function execute() {
  console.log('🎓 Adding Phase 1 Final Exam content...');

  // Get section and module IDs
  const { data: section } = await supabase
    .from('sections')
    .select('id')
    .eq('slug', 'phase1')
    .single();

  if (!section) {
    throw new Error('Phase1 section not found');
  }

  // Update module
  const { data: module, error: moduleError } = await supabase
    .from('modules')
    .update({
      title: '14 - Phase 1 Final Exam',
      description: 'Comprehensive final exam covering all Phase 1 topics: MRI systems, safety, anatomy, contrast mechanisms, and clinical procedures.',
      icon: '🎓',
      is_published: true,
      is_locked: false,
      updated_at: new Date().toISOString()
    })
    .eq('section_id', section.id)
    .eq('slug', 'phase1-final-exam')
    .select('id')
    .single();

  if (moduleError) throw moduleError;
  console.log('✅ Module updated');

  // Check for existing quiz content
  let { data: quizContent } = await supabase
    .from('content_items')
    .select('id')
    .eq('module_id', module.id)
    .eq('slug', 'final-exam')
    .single();

  // Insert quiz content if it doesn't exist
  if (!quizContent) {
    const { data, error } = await supabase
      .from('content_items')
      .insert({
        module_id: module.id,
        slug: 'final-exam',
        title: 'Phase 1 Final Exam',
        description: 'Comprehensive assessment of all Phase 1 knowledge and skills.',
        type: 'quiz',
        icon: '📝',
        order_index: 1,
        metadata: {},
        is_published: true
      })
      .select('id')
      .single();

    if (error) throw error;
    quizContent = data;
    console.log('✅ Quiz content created');
  } else {
    console.log('✅ Quiz content exists');
  }

  // Upsert quiz section
  const { error: sectionError } = await supabase
    .from('quiz_sections')
    .upsert({
      key: 'final-exam',
      title: 'Phase 1 Final Exam',
      description: 'Comprehensive exam covering MRI systems, safety, anatomy, and contrast',
      icon: '🎓',
      order_index: 19
    }, {
      onConflict: 'key'
    });

  if (sectionError) throw sectionError;
  console.log('✅ Quiz section upserted');

  console.log('📝 Checking quiz questions...');

  // Check if questions already exist
  const { data: existingQuestions } = await supabase
    .from('quiz_questions')
    .select('question_id')
    .eq('content_item_id', quizContent.id);

  if (existingQuestions && existingQuestions.length > 0) {
    console.log('Found ' + existingQuestions.length + ' existing questions');
  } else {
    console.log('⚠️  No questions found');
    console.log('👉 Please run the SQL migration file manually in Supabase SQL Editor');
    console.log('   File: supabase/migrations/039_add_phase1_final_exam.sql');
  }

  console.log('✅ Module structure complete!');
}

execute().catch(console.error);
