require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function findSections() {
  // Get all unique section keys from quiz_questions
  const { data: questions } = await supabase
    .from('quiz_questions')
    .select('section_key')
    .order('section_key');

  const uniqueSections = [...new Set(questions.map(q => q.section_key))];
  
  console.log('📋 Quiz sections with questions:');
  for (const sectionKey of uniqueSections) {
    const { count } = await supabase
      .from('quiz_questions')
      .select('*', { count: 'exact', head: true })
      .eq('section_key', sectionKey);
    
    console.log(`  - ${sectionKey}: ${count} questions`);
  }
}

findSections();

