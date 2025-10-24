import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addFundamentalsContentItem() {
  console.log('🔄 Adding fundamentals quiz as a content item...\n');

  // Get the Medical Terminology module ID
  const { data: module, error: moduleError } = await supabase
    .from('modules')
    .select('id')
    .eq('slug', 'medical-terminology')
    .single();

  if (moduleError || !module) {
    console.error('❌ Medical Terminology module not found:', moduleError);
    process.exit(1);
  }

  console.log('✅ Found Medical Terminology module:', module.id);

  // First, update order_index for existing quiz items manually
  console.log('\n📊 Updating order_index for existing quiz content items...');
  const { data: existingQuizzes } = await supabase
    .from('content_items')
    .select('*')
    .eq('module_id', module.id)
    .eq('type', 'quiz')
    .in('slug', ['prefixes', 'suffixes', 'roots', 'abbreviations', 'positioning']);

  if (existingQuizzes) {
    for (const quiz of existingQuizzes) {
      await supabase
        .from('content_items')
        .update({ order_index: quiz.order_index + 1 })
        .eq('id', quiz.id);
    }
    console.log(`✅ Updated ${existingQuizzes.length} quiz items\n`);
  }

  // Insert the fundamentals content item
  console.log('➕ Inserting fundamentals quiz content item...');
  const { data: contentItem, error: insertError } = await supabase
    .from('content_items')
    .insert({
      module_id: module.id,
      slug: 'fundamentals',
      title: 'Medical Terminology Fundamentals',
      description: 'Core concepts and building blocks of medical terminology',
      icon: '🏗️',
      type: 'quiz',
      order_index: 1, // Right after the video
      is_published: true,
      metadata: {
        questionCount: 20,
        passingScore: 80
      }
    })
    .select()
    .single();

  if (insertError) {
    if (insertError.code === '23505') {
      console.log('✅ Fundamentals content item already exists');
      
      // Get the existing one
      const { data: existing } = await supabase
        .from('content_items')
        .select('*')
        .eq('module_id', module.id)
        .eq('slug', 'fundamentals')
        .single();
      
      if (existing) {
        console.log('📍 Using existing content item:', existing.id);
        
        // Link quiz questions to this content item
        console.log('\n🔗 Linking quiz_questions to content item...');
        const { error: linkError } = await supabase
          .from('quiz_questions')
          .update({ content_item_id: existing.id })
          .eq('section_key', 'fundamentals')
          .is('content_item_id', null);

        if (linkError) {
          console.error('❌ Error linking questions:', linkError);
        } else {
          console.log('✅ Questions linked successfully');
        }
      }
    } else {
      console.error('❌ Error inserting content item:', insertError);
      process.exit(1);
    }
  } else {
    console.log('✅ Fundamentals content item created:', contentItem);
    
    // Link quiz questions to this content item
    console.log('\n🔗 Linking quiz_questions to content item...');
    const { error: linkError } = await supabase
      .from('quiz_questions')
      .update({ content_item_id: contentItem.id })
      .eq('section_key', 'fundamentals')
      .is('content_item_id', null);

    if (linkError) {
      console.error('❌ Error linking questions:', linkError);
    } else {
      console.log('✅ Questions linked successfully');
    }
  }

  // Verify all content items in Medical Terminology
  console.log('\n📋 Current Medical Terminology content items:');
  const { data: items } = await supabase
    .from('content_items')
    .select('order_index, slug, title, type')
    .eq('module_id', module.id)
    .order('order_index');

  items?.forEach(item => {
    console.log(`  ${item.order_index}. [${item.type}] ${item.slug} - ${item.title}`);
  });

  // Verify quiz questions are linked
  console.log('\n🔍 Verifying fundamentals questions are linked:');
  const { data: linkedQuestions, count } = await supabase
    .from('quiz_questions')
    .select('question_id, content_item_id', { count: 'exact' })
    .eq('section_key', 'fundamentals')
    .not('content_item_id', 'is', null);

  console.log(`  ✅ ${count} / 20 questions have content_item_id`);

  console.log('\n✨ Done!\n');
}

addFundamentalsContentItem()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Failed:', err);
    process.exit(1);
  });

