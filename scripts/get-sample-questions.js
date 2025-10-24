require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role to bypass RLS

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function getSampleQuestions() {
  // First, let's check if there are any questions at all
  const { count } = await supabase
    .from('quiz_questions')
    .select('*', { count: 'exact', head: true });
  
  console.log(`Total questions in database: ${count}`);

  // Get one multiple choice question
  const { data: mcQuestions, error: mcError } = await supabase
    .from('quiz_questions')
    .select('question_id, question_type, question_text, answers, correct_answer, hint, explanation')
    .eq('question_type', 'multiplechoice')
    .limit(1);

  console.log('MC Questions returned:', mcQuestions?.length || 0);
  if (mcError) {
    console.error('MC Error:', mcError);
  }

  // Get one true/false question
  const { data: tfQuestions, error: tfError } = await supabase
    .from('quiz_questions')
    .select('question_id, question_type, question_text, answers, correct_answer, hint, explanation')
    .eq('question_type', 'truefalse')
    .limit(1);

  console.log('TF Questions returned:', tfQuestions?.length || 0);
  if (tfError) {
    console.error('TF Error:', tfError);
  }

  const result = {
    multiplechoice_example: mcQuestions?.[0] || null,
    truefalse_example: tfQuestions?.[0] || null
  };

  console.log('\n=== RESULT ===');
  console.log(JSON.stringify(result, null, 2));
}

getSampleQuestions();

