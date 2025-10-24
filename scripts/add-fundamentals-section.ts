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

async function addFundamentalsSection() {
  console.log('🔄 Adding fundamentals section to quiz_sections...\n');

  // First, get existing sections and update their order manually
  console.log('📊 Updating order_index for existing sections...');
  const { data: existingSections } = await supabase
    .from('quiz_sections')
    .select('*')
    .in('key', ['prefixes', 'suffixes', 'roots', 'abbreviations', 'positioning']);

  if (existingSections) {
    for (const section of existingSections) {
      await supabase
        .from('quiz_sections')
        .update({ order_index: section.order_index + 1 })
        .eq('key', section.key);
    }
    console.log('✅ Order indices updated\n');
  }

  // Insert fundamentals section
  console.log('➕ Inserting fundamentals section...');
  const { data, error } = await supabase
    .from('quiz_sections')
    .insert({
      key: 'fundamentals',
      title: 'Medical Terminology Fundamentals',
      description: 'Core concepts and building blocks of medical terminology',
      icon: '🏗️',
      order_index: 0
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      console.log('✅ Fundamentals section already exists');
    } else {
      console.error('❌ Error inserting section:', error);
      process.exit(1);
    }
  } else {
    console.log('✅ Fundamentals section created:', data);
  }

  // Verify all sections
  console.log('\n📋 Current quiz sections:');
  const { data: sections } = await supabase
    .from('quiz_sections')
    .select('key, title, order_index')
    .order('order_index');

  sections?.forEach(s => {
    console.log(`  ${s.order_index}. ${s.key} - ${s.title}`);
  });

  console.log('\n✨ Done!\n');
}

addFundamentalsSection()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Failed:', err);
    process.exit(1);
  });

