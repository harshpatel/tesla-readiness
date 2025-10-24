require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function exportFirstQuiz() {
  console.log('🔍 Fetching first quiz section...');
  
  // Get all quiz sections ordered by order_index
  const { data: sections, error: sectionsError } = await supabase
    .from('quiz_sections')
    .select('*')
    .order('order_index', { ascending: true })
    .limit(1);

  if (sectionsError || !sections || sections.length === 0) {
    console.error('❌ Error fetching quiz sections:', sectionsError);
    process.exit(1);
  }

  const firstSection = sections[0];
  console.log(`📝 First quiz section: "${firstSection.title}" (key: ${firstSection.key})`);

  // Get all questions for this section
  const { data: questions, error: questionsError } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('section_key', firstSection.key)
    .order('order_index', { ascending: true });

  if (questionsError) {
    console.error('❌ Error fetching questions:', questionsError);
    process.exit(1);
  }

  console.log(`✅ Fetched ${questions.length} questions`);

  const output = {
    section: firstSection,
    questions: questions
  };

  // Write to JSON file
  const outputPath = 'first-quiz-questions.json';
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.log(`📝 Exported to ${outputPath}`);
  console.log(`📊 File size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
}

exportFirstQuiz();

